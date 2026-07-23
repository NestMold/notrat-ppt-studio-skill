# Style Library

## 概述

样式模板位于 `templates/styles/<style-id>/`，每个样式定义一套完整的视觉系统。

## 样式目录结构

```
templates/styles/<style-id>/
├── style.json          # 色彩、字体、圆角、动画偏好
├── preview.png         # 16:9 预览缩略图（可选）
└── README.md           # 样式说明（可选）
```

## style.json 字段

```json
{
  "id": "clean-professional",
  "name": "Clean Professional",
  "palette": {
    "background": "#FFFFFF",
    "surface": "#F5F5F7",
    "primary_text": "#1D1D1F",
    "secondary_text": "#6E6E73",
    "accent": "#0071E3",
    "accent_secondary": "#147CE5"
  },
  "fonts": {
    "heading": "PingFang SC",
    "body": "PingFang SC",
    "mono": "SF Mono"
  },
  "shapes": {
    "card_radius": 0.12,
    "line_weight": 0.75
  },
  "animation": {
    "default_type": "fadein",
    "default_duration": 400,
    "stagger_delay": 200
  }
}
```

## 全部 12 种样式

| ID | 名称 | 适用场景 | 色调 |
|----|------|---------|------|
| `clean-professional` | Clean Professional | 企业汇报、报告、提案 | 白底蓝调 |
| `strategy-consulting` | Strategy Consulting | 咨询、战略、路演 | 白底灰蓝 |
| `data-dashboard` | Data Dashboard | 数据分析、仪表盘 | 深色背景 |
| `education` | Education | 培训、课程、教学 | 温暖明快 |
| `editorial-creative` | Editorial Creative | 品牌叙事、媒体 | 创意排版 |
| `research-defense` | Research Defense | 论文答辩、学术 | 严肃克制 |
| `civic-red` | Civic Red | 政府、公共事业 | 红金庄重 |
| `retro-flat` | Retro Flat | 创意、休闲 | 复古色块 |
| `warm-craft` | Warm Craft | 手工艺、人文 | 暖色系 |
| `whiteboard` | Whiteboard | 头脑风暴、工作坊 | 手绘感 |
| `handdrawn-technical` | Handdrawn Technical | 工程、技术图示 | 线稿风格 |
| `eink-editorial` | E-Ink Editorial | 阅读、长文 | 黑白克制 |

## 使用方法

```bash
# 验证某个样式模板
python scripts/notrat-ppt.py styles validate <style-id>

# 验证所有样式
python scripts/notrat-ppt.py styles validate

# 在代码中引用（demo_build.js 示例）
const C = require('./templates/styles/clean-professional/style.json');
const bgColor = C.palette.background;
```

## 样式与模式的关系

| 模式 | 样式作用 |
|------|---------|
| `editable` | 样式 JSON 驱动所有原生对象的颜色、字体、圆角 |
| `hybrid` | 样式驱动前景对象；背景另由图像生成器按风格 prompt 生成 |
| `image` | 样式 JSON 转换为图像生成 prompt 的一部分 |

## 选择建议

- 用户没指定 → 默认 `clean-professional`
- 品牌色已知 → 匹配最接近的，或新建 custom style.json
- 数据密集 → `data-dashboard` 或 `strategy-consulting`
- 创意提案 → `editorial-creative` 或 `retro-flat`
