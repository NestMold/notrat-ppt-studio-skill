# Slide Generation & Sub-agents

## Worker 角色体系

Agent 在逐页生产时，将每页任务委托给 Worker。Worker 提示文件位于 `prompts/workers/`。

### 默认 Worker（editable / hybrid）

文件：`prompts/workers/render-editable-slide.md`

触发条件：**所有 editable 和 hybrid 模式的逐页渲染**。

Worker 职责：
- 读取大纲中该页的 `animation_intent`
- 使用 `@bapunhansdah/pptxgenjs` 生成原生对象
- 为每个对象写入 `animation` 字段（使用 `layout.js` 的组合 API）
- 输出该页的 OOXML 兼容代码

### 图片型 Worker（image 模式）

文件：`prompts/workers/render-slide.md`

触发条件：**仅 image 模式**。

Worker 职责：
- 读取大纲中该页的视觉描述
- 生成图像生成 prompt
- 调用 `media/generator.py` 或远程 API 生成 16:9 位图
- 输出单页 PNG，由 `assembler.py` 组装

## Agent ↔ Worker 交接

```
Agent (SKILL.md 主控)
  │
  ├─ 1. 理解任务 → 确认模式 (editable/hybrid/image)
  ├─ 2. 写大纲 → 含 animation_intent
  │
  ├─ 3. 逐页委托 Worker
  │     ├─ editable → render-editable-slide.md
  │     └─ image → render-slide.md
  │
  ├─ 4. Worker 输出代码 / 图片
  │
  ├─ 5. 组装
  │     ├─ editable → pptxgenjs build → animate → validate
  │     └─ image → prepare → dispatch → assemble
  │
  └─ 6. 交付 + 报告
```

## Worker 输出规范

### render-editable-slide.md 输出

每页输出一段完整的 `pptxgenjs` 代码块：

```js
// Page 3: Core Features
const s = pptx.addSlide();
s.background = { color: C.bg };

// Title — groupAnchor (click to reveal)
s.addText('Core Features', {
  x: L.MARGIN_X, y: L.ZONE.titleY, w: L.CONTENT_W, h: L.ZONE.titleH,
  fontSize: 30, bold: true, color: C.text,
  animation: L.groupAnchor('fadein'),
});

// 3 cards — each is its own click group, internal elements withPrevious
const cards = L.distribute(3);
cards.forEach((pos, i) => {
  // Card background — anchor
  s.addShape(pptx.ShapeType.roundRect, {
    ...pos, y: L.ZONE.contentY, h: 2.5,
    fill: { color: C.surface },
    animation: L.groupAnchor('fadein'),
  });
  // Card title — member (appears with background)
  s.addText(titles[i], {
    ...L.cardInner(pos), y: L.ZONE.contentY + 0.3,
    animation: L.groupMember('fadein'),
  });
  // Card body — member
  s.addText(bodies[i], {
    ...L.cardInner(pos), y: L.ZONE.contentY + 0.9,
    animation: L.groupMember('fadein'),
  });
});
```

### render-slide.md 输出

每页输出一张 1920×1080 PNG + 对应的演讲者备注。

## 并行与顺序

| 模式 | 页间关系 | 可否并行 |
|------|---------|---------|
| editable | 独立（但共享 pptx 实例） | ❌ 顺序生成 |
| image | 完全独立 | ✅ 可并行 dispatch |
| hybrid | 前景顺序，背景可并行 | 部分并行 |

## 状态追踪

```
python scripts/notrat-ppt.py status
```

输出每页的当前状态：`pending` → `dispatched` → `completed` / `blocked`。

阻塞时记录原因：

```
python scripts/notrat-ppt.py blocker --page 3 --reason "等待品牌 Logo PNG"
```
