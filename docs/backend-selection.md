# Backend Selection

## 决策树

```
用户要 PPT
  │
  ├─ 明确要"全页图片 / 概念大片 / 不可编辑"
  │   └→ image 模式
  │      └→ python-pptx (assemble) — 无对象动画
  │
  ├─ 明确要"氛围背景 + 可改文字"
  │   └→ hybrid 模式
  │      └→ @bapunhansdah/pptxgenjs (前景对象) + 图像生成 (背景)
  │
  └─ 其他所有情况（默认）
      └→ editable 模式
         └→ @bapunhansdah/pptxgenjs (原生对象 + animation)
```

## 后端对比

| 维度 | `@bapunhansdah/pptxgenjs` | `python-pptx` |
|------|--------------------------|---------------|
| 语言 | Node.js | Python |
| 原生对象 | ✅ 文本、形状、表格、图表 | ✅ 文本、形状、表格 |
| `animation` 字段 | ✅ 写入 OOXML `p:timing` | ❌ 无此功能 |
| 全页图片 | ✅ `addImage` | ✅ |
| OOXML 后处理 | ❌ 需配合 `postprocess.py` | ❌ |
| 组合动画 | ✅ + `postprocess.py` | ❌ |
| 用途 | **editable / hybrid（默认）** | **image / assemble（仅图片型）** |

## 为什么不能混用

### 场景 1：标准 pptxgenjs 冒充 fork

```js
// ❌ 错误：npm install pptxgenjs（标准版）
const pptx = require('pptxgenjs');  // 没有 @bapunhansdah scope
pptx.addSlide().addText('Hello', {
  animation: { type: 'fadein', trigger: 'onClick' }
  // 字段被静默丢弃 — 生成的 PPT 没有动画
});
```

### 场景 2：python-pptx 假装可编辑动画

```python
# ❌ 错误：用 python-pptx 组装的图片型 PPT 无法承载对象动画
from pptx import Presentation
slide.shapes.add_picture('slide_01.png', ...)  # 整页一张位图
# 没有可动画的原生对象，最多加翻页切换
```

### 场景 3：正确的 editable 路径

```js
// ✅ 正确：使用 fork 版本
const PptxGenJS = require('@bapunhansdah/pptxgenjs');
const L = require('./layout.js');

const s = pptx.addSlide();
s.addText('Title', { ..., animation: L.groupAnchor('fadein') });
s.addText('Body', { ..., animation: L.groupMember('fadein') });
```

## package.json 约束

```json
{
  "dependencies": {
    "@bapunhansdah/pptxgenjs": "^1.1.3"
  }
}
```

**不要**在 dependencies 中添加标准 `pptxgenjs`。两者同时存在时，`require('pptxgenjs')` 会优先解析到标准版。

## 切换后端的时机

| 从 | 到 | 条件 |
|----|-----|------|
| editable | image | 用户中途改为"全页图片即可" |
| image | editable | 用户抱怨"没有动画 / 不能编辑文字" |
| editable | hybrid | 用户要"加个好看的背景" |

> 切换后必须重新走 `animate` + `validate`，不能在旧产物上打补丁。
