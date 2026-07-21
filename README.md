# Notrat PPT Studio

**Professional PowerPoint production skill for Notrat / agent workflows**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Owner](https://img.shields.io/badge/owner-nestmold.cn-0A66C2.svg)
![Producer](https://img.shields.io/badge/produced%20with-notrat.cn-6f42c1.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

> 使用 Notrat 创建、改编和检查专业 PowerPoint 演示文稿。  
> 支持 **图片型 / 原生可编辑型 / 混合可编辑型**，以及对象组合与进入 / 强调 / 退出 / 路径动画。  
> **默认 `editable`，并自觉编排对象动画（无需用户点名）。**

---

## 目录

- [简介](#简介)
- [效果演示](#效果演示)
- [核心能力](#核心能力)
- [默认策略（硬规则）](#默认策略硬规则)
- [三种输出模式](#三种输出模式)
- [仓库结构](#仓库结构)
- [快速开始](#快速开始)
- [命令网关](#命令网关)
- [Deck 项目约定](#deck-项目约定)
- [动画与组合](#动画与组合)
- [样式模板](#样式模板)
- [文档索引](#文档索引)
- [隐私与风险](#隐私与风险)
- [版权与第三方](#版权与第三方)
- [贡献与发布](#贡献与发布)

---

## 简介

**Notrat PPT Studio** 是一套面向 Agent 的 PowerPoint 生产规范与运行时。它把文章、报告、方案、数据、讲稿、品牌资料或既有 PPT，转换为结构清晰、视觉统一、可交付的演示文稿。


| 项目   | 说明                                          |
| ---- | ------------------------------------------- |
| 版本   | `1.0.0`                                     |
| 入口契约 | `[SKILL.md](./SKILL.md)`                    |
| 命令网关 | `python scripts/notrat-ppt.py <command>`    |
| 动画后端 | `@bapunhansdah/pptxgenjs@1.1.3` + OOXML 后处理 |
| 出品   | `notrat.cn` / 生产工具 `notrat.cn`              |


适用场景包括：

- 路演、汇报、提案、培训、发布会、产品介绍
- 从大纲 / 文章 / 数据生成可编辑 PPTX
- 全页视觉大片（image）或氛围背景 + 可编辑前景（hybrid）
- 对象进入 / 强调 / 退出 / 路径动画与语义组合
- PPTX Open XML 结构校验与交付质检

---

## 效果演示

Hybrid 模式示例：氛围背景 + 可编辑前景对象动画。  
使用 **GIF（约 6.1MB）** 展示 Hybrid 对象动画效果。

![Notrat PPT Studio · hybrid 对象动画演示](./assets/demo-hybrid-animation.gif)

> 完整演示视频可按需单独分发；仓库 / skill 包内仅保留轻量 GIF。

---

## 核心能力

- **叙事优先**：先大纲与页角色，再视觉与动画
- **三模式生产**：`editable`（默认）/ `hybrid` / `image`
- **自觉对象动画**：用户未禁止时，每页主动编排约 3–7 步时间线
- **语义组合**：卡片、步骤、标签等按意义成组再动画
- **统一命令网关**：准备、调度、装配、动画后处理、校验一条命令面
- **样式模板库**：`templates/styles/<style-id>/` 可复用视觉系统
- **Schema 契约**：manifest / job / style 机器可读
- **Worker 角色提示**：`prompts/workers/` 约束子任务输出

---

## 默认策略（硬规则）


| 优先级 | 条件                    | 模式             | 动画                   |
| --- | --------------------- | -------------- | -------------------- |
| 1   | 用户明确要全页视觉大片、不要求可编辑    | `image`        | 仅可选翻页；**交付时写明无对象动画** |
| 2   | 用户要氛围背景 + 可改文字        | `hybrid`       | **必须**前景对象动画         |
| 3   | **其他所有常规 PPT 需求（默认）** | `**editable**` | **必须**对象动画           |


**默认路径：**

```text
editable（或 hybrid）
  → 大纲写清动画意图
  → 原生对象写入 animation
  → notrat-ppt.py animate（组合 / 多段序列）
  → notrat-ppt.py validate
  → 交付
```

**禁止：**

- 用 `image` + `assemble` 假装对象动画
- 只加 slide transition / 翻页特效却报告“已加动画”
- 全页统一同一种飞入
- 给装饰线、背景框乱加动画
- 覆盖最后一个可用源 PPTX

---

## 三种输出模式

### A. `image` — 全页图片型

- 每页完整 16:9 位图
- 适合概念提案、品牌展示、强视觉叙事
- **不能**承载对象进入 / 强调 / 退出 / 路径
- 装配命令：`assemble`

### B. `editable` — 原生可编辑型（默认）

- 标题、正文、形状、表格、图表为原生对象
- 文本不栅格化，后续可改
- **对象动画主路径**

### C. `hybrid` — 混合可编辑型

- 位图仅作背景 / 氛围
- 关键文案与数据在前景原生对象上
- 动画只加在前景；背景保持静态

---

## 仓库结构

```text
notrat-ppt-studio/
├── SKILL.md                 # Agent 面向的权威工作流契约
├── skill-card.md            # 发布 / 目录卡片摘要
├── README.md                # 本文件
├── package.json             # Node 依赖（pptxgenjs fork）
├── requirements.txt         # Python 依赖
├── THIRD_PARTY_NOTICES.md   # 第三方声明
├── _meta.json               # 技能元数据
├── assets/
│   └── demo-hybrid-animation.gif  # README 演示 GIF（轻量）
├── scripts/
│   └── notrat-ppt.py      # 统一命令网关
├── src/notrat_ppt_studio/
│   ├── core/                # 运行时、状态、样式目录
│   ├── pipeline/            # 准备、调度、装配、状态
│   ├── media/               # 图像生成与 provider
│   └── animation/           # 组合、动画后处理、校验
├── prompts/workers/         # Worker 角色合同
├── templates/styles/        # 可复用样式包
├── schemas/                 # JSON Schema
├── docs/                    # 详细操作文档
└── tests/                   # 运行时与架构检查
```

---

## 快速开始

### 环境要求

- Python 3.10+（建议 3.12）
- Node.js 18+（用于 pptxgenjs 动画能力与 `animation-lab`）
- 可选：图像生成 API Key（仅 image / hybrid 背景链路）

### 安装

```bash
# 进入技能目录
cd notrat-ppt-studio

# Python 依赖
pip install -r requirements.txt

# Node 依赖（对象动画后端）
npm install
```

### 作为 Notrat Skill 使用

1. 将本目录放到 Notrat / 兼容运行时的 skills 路径下
  （例如工作区 `.skills/`、`.notrat/plugins/...` 或全局 skills 目录）
2. Agent 加载后以 `[SKILL.md](./SKILL.md)` 为权威契约执行
3. 用户说「做 PPT / 路演 / 汇报」且未禁止动画时，**默认走 editable + 对象动画**

### 本地 CLI 自检

```bash
# 查看命令帮助
python scripts/notrat-ppt.py --help

# 校验样式模板
python scripts/notrat-ppt.py styles validate

# 动画能力实验台
npm run animation:lab

# 单元测试
npm test
# 或
python -m unittest discover -s tests -v
```

---

## 命令网关

所有自动化经统一入口：

```bash
python scripts/notrat-ppt.py <command> [args]
```


| 命令              | 用途               | 模式相关性                       |
| --------------- | ---------------- | --------------------------- |
| `runtime`       | 运行时配置            | 通用                          |
| `styles`        | 样式目录 / 校验        | 通用                          |
| `image`         | 图像生成             | image / hybrid 背景           |
| `chroma`        | 色度 / 抠图类工具       | media                       |
| `prepare`       | 任务准备             | image 管线                    |
| `dispatch`      | 记录派发             | image 管线                    |
| `result`        | 记录结果             | image 管线                    |
| `blocker`       | 记录阻塞             | 通用                          |
| `status`        | 状态查询             | 通用                          |
| `assemble`      | 全页位图装订           | **仅 image**（无对象动画）          |
| `animate`       | OOXML 组合 / 动画后处理 | **editable / hybrid（默认路径）** |
| `validate`      | 结构校验             | **editable / hybrid（默认路径）** |
| `animation-lab` | 动画能力实验           | 研发 / 兼容探测                   |


**默认交付路径请优先使用 `animate` + `validate`，不要默认 `image` / `assemble`。**

---

## Deck 项目约定

生成中的 deck 使用责任分离目录：

```text
<deck>/
  deck.spec.json
  deck.manifest.json
  state/run.json
  jobs/slides/slide_<NN>.json
  assets/slides/slide_<NN>.png      # image / hybrid 背景
  assets/sources/
  work/candidates/
  content/outline.md                # 含 mode + 动画意图
  content/speaker-notes.md
  output/                           # PPTX / PDF / 预览 / QA
  output/*_raw.pptx                 # 后处理前源文件（必须保留）
  output/*_animation-report.json
```

父编排器拥有 manifest、状态、最终资产与交付物；Worker 读单一 job、写 candidate、返回严格结果合同。

---

## 动画与组合

- 对象动画写在原生对象的 `animation` 字段（pptxgenjs fork）
- 多段序列与真实组合走 `notrat-ppt.py animate`
- 结构检查：`notrat-ppt.py validate`
- 对象动画 ≠ 翻页切换 / Morph
- 结构通过 ≠ 各端（PowerPoint / WPS / LibreOffice）播放完全一致

每页自觉编排最低标准（摘要）：


| 页型      | 建议节奏                       |
| ------- | -------------------------- |
| 封面      | 标题进入 → 副标题 / 承诺            |
| 要点卡     | 标题先入 → 卡片按阅读顺序逐卡进入         |
| 步骤 / 流程 | 节点顺序进入，连接轻 wipe / flyin    |
| 数据焦点    | 结论先入 → 关键数字 zoom / fadein  |
| 对比      | 左组 → 右组，焦点可 pulse 一次       |
| 时间线     | 轴线先入，节点依次出现                |
| 尾页      | 主 CTA 进入，联系方式 withPrevious |


详细规则见：

- `[SKILL.md](./SKILL.md)` — **默认模式与自觉动画策略** / **动画硬约束**
- `[docs/object-animation-and-grouping.md](./docs/object-animation-and-grouping.md)`

---

## 样式模板

内置样式包位于 `templates/styles/`，例如：


| Style ID              | 气质      |
| --------------------- | ------- |
| `clean-professional`  | 商务干净    |
| `strategy-consulting` | 咨询策略    |
| `data-dashboard`      | 数据看板    |
| `editorial-creative`  | 编辑创意    |
| `education`           | 教育培训    |
| `research-defense`    | 研究答辩    |
| `civic-red`           | 政务红     |
| `warm-craft`          | 温暖手作    |
| `whiteboard`          | 白板讲解    |
| `eink-editorial`      | 电子墨水编辑风 |
| `handdrawn-technical` | 手绘技术    |
| `retro-flat`          | 复古扁平    |


校验：

```bash
python scripts/notrat-ppt.py styles validate
```

---

## 文档索引


| 文档                                                                                   | 内容                |
| ------------------------------------------------------------------------------------ | ----------------- |
| `[SKILL.md](./SKILL.md)`                                                             | Agent 权威契约（中文主规范） |
| `[skill-card.md](./skill-card.md)`                                                   | 发布卡片 / 能力摘要       |
| `[docs/architecture.md](./docs/architecture.md)`                                     | 架构与默认路径           |
| `[docs/object-animation-and-grouping.md](./docs/object-animation-and-grouping.md)`   | 对象动画与组合           |
| `[docs/editable-hybrid-layout.md](./docs/editable-hybrid-layout.md)`                 | 可编辑 / 混合版式        |
| `[docs/slide-generation-and-subagents.md](./docs/slide-generation-and-subagents.md)` | 生成与子 Agent        |
| `[docs/project-assembly-and-reporting.md](./docs/project-assembly-and-reporting.md)` | 装配与报告             |
| `[docs/outline-style-and-sample.md](./docs/outline-style-and-sample.md)`             | 大纲、样式与样例          |
| `[docs/workflow-gates-and-progress.md](./docs/workflow-gates-and-progress.md)`       | 门禁与进度             |
| `[docs/style-library.md](./docs/style-library.md)`                                   | 样式库               |
| `[docs/backend-selection.md](./docs/backend-selection.md)`                           | 后端选择              |
| `[docs/image-model-configuration.md](./docs/image-model-configuration.md)`           | 图像模型配置            |
| `[docs/user-supplied-assets.md](./docs/user-supplied-assets.md)`                     | 用户素材              |
| `[docs/cli-api-fallback.md](./docs/cli-api-fallback.md)`                             | CLI / API 回退      |
| `[docs/migration.md](./docs/migration.md)`                                           | 迁移说明              |
| `[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)`                                 | 第三方声明             |


---

## 隐私与风险

- 远程图像服务可能收到提示词与经批准的输入素材；敏感数据请先脱敏
- 生成项目会持久化 prompts、图片、状态与输出文件
- 高级动画兼容性必须在目标 PowerPoint / WPS 版本中实机验证
- 本仓库 **不承诺** 跨 PowerPoint、WPS、LibreOffice 完全一致播放

---

## 版权与第三方

- **版权所有：** [notrat.cn](https://notrat.cn)
- **生产工具：** [notrat.cn](https://notrat.cn)
- **许可：** MIT License（开源）。可自由复制、分发、修改和使用，需保留版权声明。详见 `[LICENSE](./LICENSE)`。
- 部分组件改编自 `codex-ppt`（ningzimu，MIT-0）；动画集成 `@bapunhansdah/pptxgenjs@1.1.3`（MIT）。详见 `[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)`。

---

## 贡献与发布

本技能基于 **MIT** 协议开源。对外 GitHub 发布前请确认：

1. 仓库可见性（建议 **Public**，方便社区使用）
2. 未提交本地密钥、`.env`、客户 deck 成品与缓存
3. `README.md` / `SKILL.md` / `THIRD_PARTY_NOTICES.md` 版权声明完整
4. `npm install` 与 `pip install -r requirements.txt` 可复现
5. `python scripts/notrat-ppt.py styles validate` 与测试通过

### 建议的 Git 初始化

```bash
cd notrat-ppt-studio
git init
git add .
git commit -m "chore: initial public package for notrat-ppt-studio v1.0.0"
git branch -M main
git remote add origin https://github.com/<YOUR_ORG_OR_USER>/notrat-ppt-studio.git
git push -u origin main
```

### npm scripts


| Script                    | 说明              |
| ------------------------- | --------------- |
| `npm run cli`             | 调用 Python 命令网关  |
| `npm run styles:validate` | 校验样式模板          |
| `npm run animation:lab`   | 动画能力实验台         |
| `npm test`                | Python unittest |


---

## 一句话记住

> **默认 `editable` + 自觉对象动画；`image`/`assemble` 只做全页贴图，不能冒充对象时间线。**

---

© notrat.cn · Produced with notrat.cn · v1.0.0
