# Object Animation & Grouping

## 动画后端选择

| 库 | 动画支持 | 用途 |
|----|---------|------|
| `@bapunhansdah/pptxgenjs@1.1.3` | ✅ `animation` 字段 → OOXML `p:timing` | **默认可编辑/混合路径** |
| 标准 `pptxgenjs` | ❌ 静默忽略 `animation` | 禁止用于动画 PPT |
| `python-pptx` | ❌ 无动画表面 | 仅用于 `assemble` 图片型组装 |

> ⚠️ **第一号陷阱**：如果 `npm install pptxgenjs`（不带 scope），装到的是标准版，所有 `animation` 字段会被静默丢弃，生成静态 PPT。必须用 `@bapunhansdah/pptxgenjs`。

## 动画类型

| Type | Category | 方向参数 | 说明 |
|------|----------|---------|------|
| `fadein` | Entrance | — | 淡入 |
| `floatin` | Entrance | — | 上浮 + 淡入 |
| `flyin` | Entrance | `direction`: up/down/left/right | 从方向飞入 |
| `wipe` | Entrance | `direction`: up/down/left/right | 擦除揭示 |
| `zoom` | Entrance/Emphasis | — | 缩放进入 |
| `pulse` | Emphasis | — | 脉冲强调 |
| `fadeout` | Exit | — | 淡出 |
| `flyout` | Exit | `direction`: up/down/left/right | 飞出 |

## 触发器

| Trigger | 行为 | 对应 OOXML |
|---------|------|-----------|
| `onClick` | 点击后出现（新建一个点击组） | `tn:cond evt=onClick` |
| `withPrevious` | 与前一个元素同时出现 | `stCondLst cond=withPrev` |
| `afterPrevious` | 前一个结束后出现 | `stCondLst cond=afterPrev` |

## 组合动画 API（layout.js）

`src/layout.js` 导出三个组合语义函数：

```js
const L = require('./layout.js');

// ── groupAnchor: 新建点击组，此元素为锚点 ──
// presenter 点击一次 → 整组同时出现
s.addText('Card Title', { ..., animation: L.groupAnchor('fadein') });

// ── groupMember: 与最近的 groupAnchor 同时出现 ──
// 用于同一卡片/模块的内部元素
s.addText('Card body...', { ..., animation: L.groupMember('fadein') });
s.addShape(pptx.ShapeType.roundRect, { ..., animation: L.groupMember('fadein') });

// ── afterGroup: 当前组完成后顺序出现 ──
// 用于组内分层揭示
s.addText('Note', { ..., animation: L.afterGroup('fadein') });
```

### 组合动画的 OOXML 后处理

fork 版 `pptxgenjs` 的 `animation` 字段只写单段 `p:timing`。**多段序列和真实组合**需要 `postprocess.py` 做 OOXML XML 重写：

```bash
# 1. pptxgenjs 生成带有 animation 字段的原始 PPTX
node src/demo_build.js

# 2. postprocess.py 注入组合节点、多段序列、proxy 重定向
python scripts/notrat-ppt.py animate output/MyDeck.pptx

# 3. validate.py 检查 p:timing 结构完整性
python scripts/notrat-ppt.py validate output/MyDeck.pptx
```

### postprocess.py 的核心逻辑

文件路径：`src/notrat_ppt_studio/animation/postprocess.py`

1. **解压 PPTX** → 读取 `ppt/slides/slideN.xml`
2. **扫描 animation 字段** → 找到 `onClick` / `withPrevious` / `afterPrevious` 标记
3. **构建时间线树** → `onClick` 作为组锚点，`withPrevious` 挂到同组，`afterPrevious` 串联
4. **写入 `p:timing`** → 生成合法的 `<p:par>` / `<p:seq>` / `<p:cTn>` 嵌套结构
5. **重新打包 PPTX**

## 动画意图 → 代码 → 后处理 对照

| 阶段 | 产出物 | 位置 |
|------|--------|------|
| 大纲 | `animation_intent` 声明 | deck outline JSON |
| 代码 | `animation: { type, trigger, duration }` | `demo_build.js` / `render-editable-slide.md` worker 输出 |
| 后处理 | OOXML `p:timing` 节点 | `postprocess.py` |
| 验证 | 结构完整性报告 | `validate.py` |

## 反模式

- ❌ 所有对象统一 `flyin` — 没有节奏区分
- ❌ 给分隔线、背景框、装饰元素加动画
- ❌ 用 slide transition（翻页切换）冒充对象动画
- ❌ 写了 `animation` 字段但用了标准 `pptxgenjs`（字段被丢弃）
- ❌ 跳过 `animate` / `validate` 直接交付组合动画稿
