<p align="center">
  <img src="./assets/nav-logo.png" width="120" alt="Notrat PPT Studio">
</p>

# Notrat PPT Studio

**Professional PowerPoint production skill for Notrat / agent workflows**

![Version](https://img.shields.io/badge/version-1.0.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Mode](https://img.shields.io/badge/default-editable%20%2B%20animation-purple)
![Backend](https://img.shields.io/badge/backend-%40bapunhansdah%2Fpptxgenjs-orange)

> 使用 Notrat 创建、改编和检查专业 PowerPoint 演示文稿。  
> 支持 **图片型 / 原生可编辑型 / 混合可编辑型**，以及对象组合与进入 / 强调 / 退出 / 路径动画。  
> **默认 `editable`，并自觉编排对象动画（无需用户点名）。**

---

## 效果演示

### Editable 模式：原生对象动画

元素逐组飞入，标题先入，卡片按阅读顺序依次出现。

![Notrat PPT Studio · editable 对象动画演示](./assets/demo-flyin.gif)

### Hybrid 模式：氛围背景 + 前景动画

背景为 AI 生成的视觉氛围层，前景文字和图形为可编辑对象，带有进入/强调动画。

![Notrat PPT Studio · hybrid 混合动画演示](./assets/demo-hybrid-animation.gif)

> 💡 运行 `node src/demo_build.js` 可生成本地 demo PPTX（需先 `npm install`）。

---

## 简介

**Notrat PPT Studio** 是一套面向 Agent 的 PowerPoint 生产规范与运行时。它把文章、报告、方案、数据、讲稿、品牌资料或既有 PPT，转换为结构清晰、视觉统一、可交付的演示文稿。

| 项目   | 说明                                          |
| ---- | ------------------------------------------- |
| 版本   | `1.0.1`                                     |
| 入口契约 | `[SKILL.md](./SKILL.md)`                    |
| 命令网关 | `python scripts/notrat-ppt.py <command>`    |
| 动画后端 | `@bapunhansdah/pptxgenjs@1.1.3` + OOXML 后处理 |
| 出品   | `notrat.cn`                                  |

适用场景：路演、汇报、提案、培训、发布会、产品介绍、从大纲/文章/数据生成可编辑 PPTX、全页视觉大片、对象动画与语义组合、PPTX 结构校验。

---

## 核心能力

- **叙事优先**：先大纲与页角色，再视觉与动画
- **三模式生产**：`editable`（默认）/ `hybrid` / `image`
- **自觉对象动画**：用户未禁止时，每页主动编排约 3–7 步时间线
- **语义组合**：卡片、步骤、标签等按意义成组再动画
- **统一命令网关**：准备、调度、装配、动画后处理、校验一条命令面
- **样式模板库**：`templates/styles/<style-id>/` 12 种可复用视觉系统
- **Schema 契约**：manifest / job / style 机器可读
- **Worker 角色提示**：`prompts/workers/` 约束子任务输出

---

## 默认策略（硬规则）

| 优先级 | 条件                    | 模式             | 动画                   |
| --- | --------------------- | -------------- | -------------------- |
| 1   | 用户明确要全页视觉大片、不要求可编辑    | `image`        | 仅可选翻页；**交付时写明无对象动画** |
| 2   | 用户要氛围背景 + 可改文字        | `hybrid`       | **必须**前景对象动画         |
| 3   | **其他所有常规 PPT 需求（默认）** | **`editable`** | **必须**对象动画           |

> ⚠️ **重要**：必须使用 `@bapunhansdah/pptxgenjs@1.1.3`（动画 fork），不能用标准 `pptxgenjs`。标准版会忽略 `animation` 字段，导致所有页面变成静态 PPT。

---

## 三种输出模式

### A. `image` — 全页图片型

- 每页完整 16:9 位图，适合概念提案、品牌展示、强视觉叙事
- **不能**承载对象进入/强调/退出/路径
- 装配命令：`assemble`

### B. `editable` — 原生可编辑型（默认）

- 标题、正文、形状、表格、图表为原生对象，文本不栅格化
- **对象动画主路径**

### C. `hybrid` — 混合可编辑型

- 位图仅作背景/氛围，关键文案与数据在前景原生对象上
- 动画只加在前景；背景保持静态

---

## 命令网关

```bash
python scripts/notrat-ppt.py <command> [args]
```

| 命令 | 说明 | 路径 |
|------|------|------|
| `runtime` | 环境检测、路径初始化、远程图像配置 | `core/runtime.py` |
| `styles validate` | 校验样式模板 | `core/catalog.py` |
| `image` | 图像生成 API 调用 | `media/generator.py` |
| `chroma` | 色彩处理与适配 | `media/chroma.py` |
| `prepare` | 从大纲生成逐页任务 | `pipeline/prepare.py` |
| `dispatch` | 调度逐页任务 | `pipeline/record_dispatch.py` |
| `result` | 记录任务结果 | `pipeline/record_result.py` |
| `blocker` | 记录阻塞项 | `pipeline/record_blocker.py` |
| `status` | 查询项目状态 | `pipeline/status.py` |
| `assemble` | 组装**图片型** PPT（无对象动画） | `pipeline/assembler.py` |
| `animate` | **OOXML 动画后处理（默认交付路径）** | `animation/postprocess.py` |
| `validate` | **动画引用与结构校验（默认交付路径）** | `animation/validate.py` |
| `animation-lab` | 对象动画能力实验台（Node.js） | `animation/capability_lab.js` |

### 默认交付路径

```
editable/hybrid → animate → validate → 交付
image → prepare → dispatch → result → assemble → 交付
```

---

## Deck 项目约定

```
<deck_project>/
├── deck.manifest.json        # 项目清单
├── content/                  # 源材料 & 大纲 (outline.json)
├── asset/                    # 品牌素材 (logo, brand-colors)
├── job/                      # 逐页任务 (image 模式)
├── work/                     # 工作区 (candidates/, slides/)
├── state/                    # 运行状态 (run.json)
└── output/                   # 最终 PPTX / PDF
```

---

## 动画与组合

对象动画使用 `@bapunhansdah/pptxgenjs@1.1.3` 的 `animation` 字段声明进入/强调/退出效果。语义组合通过 `layout.js` 的 `groupAnchor` / `groupMember` / `afterGroup` API 实现，多段序列与真实组合走 `notrat-ppt.py animate` 进行 OOXML 后处理。

| 动画类型 | 类别 | 说明 |
|---------|------|------|
| `fadein` | 进入 | 淡入 |
| `floatin` | 进入 | 上浮 + 淡入 |
| `flyin` | 进入 | 方向飞入 |
| `wipe` | 进入 | 擦除显现 |
| `zoom` | 进入/强调 | 缩放 |
| `pulse` | 强调 | 脉冲 |
| `fadeout` | 退出 | 淡出 |
| `flyout` | 退出 | 飞出 |

| 触发器 | 行为 |
|--------|------|
| `onClick` | 点击后出现（组锚点） |
| `withPrevious` | 与上一元素同时出现 |
| `afterPrevious` | 上一元素完成后顺序出现 |

---

## 样式模板

`templates/styles/` 下有 12 种可复用样式包：

| ID | 名称 | 适用场景 |
|----|------|---------|
| `clean-professional` | 简洁专业 | 企业、报告、提案 |
| `strategy-consulting` | 战略咨询 | 路演、战略 |
| `data-dashboard` | 数据仪表盘 | 分析、指标 |
| `education` | 教育 | 培训、课程 |
| `editorial-creative` | 编辑创意 | 品牌、媒体 |
| `research-defense` | 研究答辩 | 学术、论文 |
| `civic-red` | 政务红 | 政府、公共 |
| `retro-flat` | 复古扁平 | 创意、休闲 |
| `warm-craft` | 暖色手作 | 手工、匠心 |
| `whiteboard` | 白板 | 研讨、工作坊 |
| `handdrawn-technical` | 手绘技术 | 工程、图示 |
| `eink-editorial` | 电子墨水 | 阅读、长文 |

---

## 仓库结构

```text
notrat-ppt-studio/
├── SKILL.md                  # Agent 权威工作流契约
├── skill-card.md             # 发布卡片摘要
├── README.md                 # 本文件
├── package.json              # Node 依赖（pptxgenjs fork）
├── requirements.txt          # Python 依赖
├── THIRD_PARTY_NOTICES.md    # 第三方声明
├── _meta.json                # 技能元数据
├── docs/                     # 详细参考文档（13 篇）
├── scripts/
│   └── notrat-ppt.py         # 统一命令网关
├── src/
│   ├── notrat_ppt_studio/    # Python 核心
│   │   ├── core/             # 运行时、状态、样式目录
│   │   ├── pipeline/         # 准备、调度、装配、状态
│   │   ├── media/            # 图像生成与 provider
│   │   └── animation/        # 组合、动画后处理、校验
│   ├── demo_build.js         # 参考实现（8 页 editable demo）
│   └── layout.js             # 布局引擎 + 组合动画 API
├── prompts/workers/          # Worker 角色提示
├── templates/styles/         # 12 种样式包
├── schemas/                  # JSON Schema
├── tests/                    # 测试
└── frontend/                 # 产品网站
    ├── index.html
    └── assets/               # GIF 演示 + Logo
```

---

## 快速开始

### 环境要求

- Python 3.10+（建议 3.12）
- Node.js 18+（用于 pptxgenjs 动画能力与 `animation-lab`）
- 可选：图像生成 API Key（仅 image / hybrid 背景链路）

### 安装

```bash
pip install -r requirements.txt
npm install
```

### 本地自检

```bash
python scripts/notrat-ppt.py --help
python scripts/notrat-ppt.py styles validate
npm test
```

### npm scripts

| Script | 说明 |
|--------|------|
| `npm run cli` | 调用 Python 命令网关 |
| `npm run styles:validate` | 校验样式模板 |
| `npm run animation:lab` | 动画能力实验台 |
| `npm test` | Python unittest |

---

## 文档索引

| 文档 | 内容 |
|------|------|
| [docs/architecture.md](./docs/architecture.md) | 系统分层、模块职责、数据流 |
| [docs/backend-selection.md](./docs/backend-selection.md) | 后端选择决策树、pptxgenjs fork vs python-pptx |
| [docs/cli-api-fallback.md](./docs/cli-api-fallback.md) | CLI/API 降级路径、图像生成备用命令 |
| [docs/editable-hybrid-layout.md](./docs/editable-hybrid-layout.md) | 网格系统、布局函数、Hybrid 规则 |
| [docs/image-model-configuration.md](./docs/image-model-configuration.md) | 图像模型配置（API Key、Base URL、Model） |
| [docs/migration.md](./docs/migration.md) | 架构迁移映射表 |
| [docs/object-animation-and-grouping.md](./docs/object-animation-and-grouping.md) | 动画类型、组合 API、OOXML 后处理 |
| [docs/outline-style-and-sample.md](./docs/outline-style-and-sample.md) | 大纲格式、页面角色、动画意图写法 |
| [docs/project-assembly-and-reporting.md](./docs/project-assembly-and-reporting.md) | 项目目录、manifest、交付报告 |
| [docs/slide-generation-and-subagents.md](./docs/slide-generation-and-subagents.md) | Worker 体系、并行与顺序、状态追踪 |
| [docs/style-library.md](./docs/style-library.md) | 样式目录结构、style.json 字段、12 种样式 |
| [docs/user-supplied-assets.md](./docs/user-supplied-assets.md) | 用户素材处理（Logo、品牌色、字体） |
| [docs/workflow-gates-and-progress.md](./docs/workflow-gates-and-progress.md) | 7 步工作流、检查清单、状态机 |

---

## 隐私与风险

- 远程图像服务可能收到提示词与经批准的输入素材；敏感数据请先脱敏
- 生成项目会持久化 prompts、图片、状态与输出文件
- 高级动画兼容性必须在目标 PowerPoint / WPS 版本中实机验证
- 本仓库**不承诺**跨 PowerPoint、WPS、LibreOffice 完全一致播放

---

## 版权与第三方

- **版权所有：** [notrat.cn](https://notrat.cn)
- **许可：** MIT License。详见 [LICENSE](./LICENSE)
- 部分组件改编自 `codex-ppt`（MIT-0）；动画集成 `@bapunhansdah/pptxgenjs@1.1.3`（MIT）。详见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)

---

## 一句话记住

> **默认 `editable` + 自觉对象动画；必须用 `@bapunhansdah/pptxgenjs@1.1.3` fork，否则 animation 字段会被静默丢弃。**

---

© notrat.cn · v1.0.1
