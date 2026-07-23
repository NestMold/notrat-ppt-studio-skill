# Outline Style & Sample

## 大纲格式

大纲是 Agent 在理解任务后、开始逐页生产前产出的结构化文档。**必须包含动画意图**。

```json
{
  "deck_title": "Notrat PPT Studio 产品介绍",
  "mode": "editable",
  "style": "clean-professional",
  "page_count": 8,
  "pages": [
    {
      "page": 1,
      "role": "cover",
      "title": "Notrat PPT Studio",
      "subtitle": "AI Agent 的 PowerPoint 生产引擎",
      "animation_intent": [
        { "group": ["title_fadein"] },
        { "group": ["subtitle_withPrevious", "cta_withPrevious"] }
      ]
    },
    {
      "page": 2,
      "role": "problem",
      "title": "传统 PPT 制作的痛点",
      "cards": ["模板僵化", "动画缺失", "协作困难", "交付低效"],
      "animation_intent": [
        { "group": ["title_fadein"] },
        { "group": ["card1_all"], "stagger": "afterPrevious" },
        { "group": ["card2_all"], "stagger": "afterPrevious" },
        { "group": ["card3_all"], "stagger": "afterPrevious" },
        { "group": ["card4_all"], "stagger": "afterPrevious" }
      ]
    }
  ]
}
```

## 页面角色（page role）

| Role | 说明 | 典型动画 |
|------|------|---------|
| `cover` | 封面 | 标题 fadein → 副标题/CTA withPrevious |
| `agenda` | 目录 | 标题先入 → 条目逐行 afterPrevious |
| `section` | 章节分隔 | 大字 fadein → 编号 withPrevious |
| `content` | 正文（要点/卡片/列表） | 标题 → 卡片逐组 |
| `data` | 数据焦点 | 结论 → 数字 zoom → 注释 |
| `comparison` | 对比 | 左组 → 右组 → 焦点 pulse |
| `process` | 流程/步骤 | 节点顺序 → 连接器 |
| `timeline` | 时间线 | 轴线 → 节点逐个 |
| `quote` | 引用/金句 | 引号 fadein → 正文 floatin |
| `cta` | 行动号召/结尾 | CTA → 联系方式 |

## 动画意图写法

```yaml
# 一组同时出现（点击触发）
animation_intent:
  - group: [title_fadein]

# 一组内逐个出现
animation_intent:
  - group: [card1_all]
  - group: [card2_all]
  - group: [card3_all]

# 一组同时 + 下一组顺序
animation_intent:
  - group: [title, subtitle]          # 点击 → 两者同时
  - group: [note]                     # 下一次点击 → note
```

## 大纲 → 代码的映射

| 大纲字段 | 代码位置 |
|---------|---------|
| `pages[].title` | `s.addText(title, { x: L.ZONE.titleY, ... })` |
| `pages[].cards[]` | `L.distribute(cards.length)` 逐个 `addText` / `addShape` |
| `animation_intent[].group` | `L.groupAnchor()` / `L.groupMember()` |
| `animation_intent[].stagger` | `L.afterGroup()` |

## 自检

- [ ] 每页都有 `animation_intent`
- [ ] 动画意图不是"全部统一 flyin"
- [ ] 装饰元素不在动画意图中
- [ ] `mode` 字段与用户需求一致（默认 editable）
- [ ] `style` 字段对应 `templates/styles/` 中的有效 ID
