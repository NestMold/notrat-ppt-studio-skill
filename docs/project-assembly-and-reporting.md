# Project Assembly & Reporting

## Deck 项目目录结构

```
<deck_project>/
├── deck.manifest.json        # 项目清单（元数据 + 页面索引）
├── content/                  # 源材料 & 大纲
│   ├── source.md             # 用户提供的原文 / 笔记
│   └── outline.json          # 结构化大纲（含 animation_intent）
├── asset/                    # 品牌素材
│   ├── logo.png
│   └── brand-colors.json
├── job/                      # 逐页任务（image 模式）
│   ├── page_01.json
│   └── page_02.json
├── work/                     # 工作区
│   ├── candidates/           # 中间产物（git 忽略）
│   └── slides/               # 渲染中间结果
├── state/                    # 运行状态
│   └── run.json              # 当前构建状态（git 忽略）
├── output/                   # 最终交付物
│   ├── MyDeck_v01.pptx       # 交付版本
│   ├── MyDeck_v01_raw.pptx   # 动画后处理前的原始版本
│   └── reports/
│       ├── layout-report.json
│       └── animation-report.json
└── speaker-notes/
    └── notes.md              # 按揭示顺序对齐的演讲者备注
```

## deck.manifest.json

```json
{
  "deck_title": "Notrat PPT Studio 产品介绍",
  "version": "1.0",
  "mode": "editable",
  "style": "clean-professional",
  "page_count": 8,
  "pages": [
    { "page": 1, "role": "cover", "title": "Notrat PPT Studio", "status": "done" },
    { "page": 2, "role": "problem", "title": "传统 PPT 制作的痛点", "status": "done" }
  ],
  "build": {
    "backend": "@bapunhansdah/pptxgenjs@1.1.3",
    "animated": true,
    "validated": true
  }
}
```

## Schema 文件

| Schema | 位置 | 验证对象 |
|--------|------|---------|
| `schemas/deck-manifest.schema.json` | deck.manifest.json | 项目清单 |
| `schemas/slide-job.schema.json` | job/page_NN.json | 逐页任务（image 模式） |
| `schemas/style-template.schema.json` | templates/styles/*/style.json | 样式模板 |

## 组装命令

### editable 路径（默认）

```bash
# 1. Agent 用 pptxgenjs fork 生成原始 PPTX（含 animation 字段）
node build.js

# 2. OOXML 动画后处理
python scripts/notrat-ppt.py animate output/MyDeck_v01_raw.pptx

# 3. 校验
python scripts/notrat-ppt.py validate output/MyDeck_v01.pptx

# 4. 交付
# 交付物：MyDeck_v01.pptx + animation-report.json + speaker-notes/notes.md
```

### image 路径（仅图片型）

```bash
# 1. 准备逐页任务
python scripts/notrat-ppt.py prepare content/outline.json

# 2. 逐页生成图片
python scripts/notrat-ppt.py dispatch
# (生成完成后)
python scripts/notrat-ppt.py result

# 3. 组装
python scripts/notrat-ppt.py assemble --title "My Deck" --output output/MyDeck.pptx
```

## 交付报告

### layout-report.json

```json
{
  "total_slides": 8,
  "mode": "editable",
  "backend": "@bapunhansdah/pptxgenjs@1.1.3",
  "slides": [
    {
      "page": 1,
      "objects": 5,
      "overflow": false,
      "warnings": []
    }
  ]
}
```

### animation-report.json

```json
{
  "total_slides": 8,
  "total_animations": 34,
  "per_slide": [
    {
      "page": 1,
      "animation_count": 3,
      "groups": 2,
      "types": ["fadein", "floatin"]
    }
  ],
  "validation": "passed"
}
```

## 文件命名约定

```
<项目名>_<演示稿名>_v<版本号>.pptx       # 交付版本
<项目名>_<演示稿名>_v<版本号>_raw.pptx   # 后处理前
<项目名>_<演示稿名>_v<版本号>_preview.pdf # PDF 预览
```

> **禁止覆盖**：后处理和修复不得覆盖最后一个可用版本。新版本递增 `_v02`、`_v03`。
