# Editable & Hybrid Layout

## 网格系统（layout.js）

12 列网格，所有坐标以英寸为单位（PowerPoint 标准 16:9 = 13.333 × 7.5）。

```js
// src/layout.js 导出常量
const PAGE_W = 13.333;
const PAGE_H = 7.5;
const COLS = 12;
const MARGIN_X = 0.7;
const MARGIN_Y = 0.55;
const GUTTER = 0.25;
```

### 列宽计算

```
CONTENT_W = PAGE_W - 2 * MARGIN_X = 11.933"
COL_W = (CONTENT_W - 11 * GUTTER) / 12 = 0.768"
```

## 垂直分区

| Zone | Y | Height | 用途 |
|------|---|--------|------|
| Label | 0.55 | 0.35 | 章节标签 / 分类 |
| Title | 1.05 | 0.65 | 页面标题 |
| Subtitle | 1.85 | 0.75 | 副标题 / 描述 |
| Content | 2.90 | ~4.0 | 主内容区 |
| Footer | 6.60 | 0.35 | 页脚 / 页码 |

## 布局辅助函数

```js
const L = require('./layout.js');

// 列定位：跨 N 列，从第 offset 列开始
const pos = L.col(4, 2);  // { x: 2.238, w: 3.697 }

// 均匀分布 N 个元素
const cards = L.distribute(3, L.SPACE.md);
// [{x:0.7,w:3.628}, {x:4.578,w:3.628}, {x:8.456,w:3.628}]

// 居中
const cx = L.centerX(6);   // 3.667
const cy = L.centerY(3);   // 内容区垂直居中

// 卡片内边距
const inner = L.cardInner(cardPos, L.CARD.padding);
```

## 常用卡片尺寸

| 卡片类型 | 宽度 | 高度 | 圆角 |
|---------|------|------|------|
| 三列卡片 | `distribute(3)` | 2.5" | 0.10" |
| 四列卡片 | `distribute(4)` | 2.2" | 0.10" |
| 横幅卡片 | `CONTENT_W` | 1.2" | 0.08" |
| 数据卡片 | `distribute(2)` | 3.0" | 0.12" |

## Hybrid 布局规则

1. **背景层**：位图覆盖整个 `PAGE_W × PAGE_H`，无内边距
2. **遮罩层**（可选）：半透明矩形 `fill: { color: '000000', transparency: 50 }`
3. **前景层**：使用标准网格定位，与 editable 完全一致
4. **z-order**：背景 → 遮罩 → 前景（pptxgenjs 按添加顺序层叠）

```js
// Hybrid 示例
const s = pptx.addSlide();
s.background = { path: 'bg_arch.png' };        // 背景位图
s.addShape(pptx.ShapeType.rect, {               // 遮罩
  x: 0, y: 0, w: L.PAGE_W, h: L.PAGE_H,
  fill: { color: '0B1020', transparency: 40 },
});
s.addText('Architecture', {                      // 前景标题
  x: L.MARGIN_X, y: L.ZONE.titleY,
  animation: L.groupAnchor('fadein'),
});
```

## 页面类型速查

| 页面类型 | 布局模式 | 动画节奏 |
|---------|---------|---------|
| 封面 | 居中大标题 + 副标题 | 标题 fadein → 副标题 withPrevious |
| 要点卡片 | 3-4 列 distribute | 标题先入 → 卡片逐组 afterPrevious |
| 步骤流程 | 横向节点 + 连接线 | 节点顺序 wipe → 连接器 withPrevious |
| 数据焦点 | 大数字居中 + 注释 | 结论 fadein → 数字 zoom → 注释 withPrevious |
| 对比页 | 左右二分 | 左组 → 右组 → 焦点 pulse |
| 时间线 | 水平轴 + 节点 | 轴线 wipe → 节点逐个 fadein |
| 尾页 | CTA + 联系方式 | CTA enter → 联系方式 withPrevious |

## 间距系统

```js
const SPACE = {
  xs: 0.10,   // 行内紧凑
  sm: 0.20,   // 元素间
  md: 0.35,   // 卡片间
  lg: 0.50,   // 分区间
  xl: 0.80,   // 大段落
  xxl: 1.20,  // 页面级
};
```
