# Architecture

## 系统分层

```
┌─────────────────────────────────────────┐
│            SKILL.md (契约层)              │
│   Agent 读到的唯一权威工作流文档            │
├─────────────────────────────────────────┤
│         scripts/notrat-ppt.py            │
│   统一命令网关 (Python CLI)               │
├──────────┬──────────┬───────────────────┤
│  core/   │ pipeline/ │  animation/       │
│  运行时   │  逐页管线  │  动画后处理         │
│  状态管理  │  装配组装   │  OOXML 校验       │
├──────────┴──────────┴───────────────────┤
│              media/                      │
│  图像生成 (provider 抽象层)                │
├─────────────────────────────────────────┤
│    @bapunhansdah/pptxgenjs (Node.js)     │
│    原生可编辑对象 + animation 字段          │
├─────────────────────────────────────────┤
│    templates/styles/  +  schemas/        │
│    样式模板 + JSON Schema 契约             │
└─────────────────────────────────────────┘
```

## 核心模块

### Python 运行时 (`src/notrat_ppt_studio/`)

| 模块 | 文件 | 职责 |
|------|------|------|
| **core/runtime** | `core/runtime.py` | 环境检测、路径初始化、远程图像配置 |
| **core/state** | `core/state.py` | 项目状态机（draft → building → review → delivered） |
| **core/catalog** | `core/catalog.py` | 样式目录扫描与校验 |
| **pipeline/prepare** | `pipeline/prepare.py` | 从大纲生成逐页渲染任务 |
| **pipeline/assembler** | `pipeline/assembler.py` | 图片型 PPT 组装（`assemble` 命令） |
| **pipeline/status** | `pipeline/status.py` | 逐页任务状态查询 |
| **pipeline/record_*** | `pipeline/record_*.py` | 记录调度、结果、阻塞 |
| **media/generator** | `media/generator.py` | 图像生成 provider 抽象与调用 |
| **media/chroma** | `media/chroma.py` | 色彩处理与适配 |
| **animation/postprocess** | `animation/postprocess.py` | OOXML 动画时间线注入 |
| **animation/validate** | `animation/validate.py` | PPTX 结构与动画引用校验 |

### JavaScript 运行时

| 文件 | 职责 |
|------|------|
| `src/layout.js` | 12 列网格系统 + 组合动画 API (`groupAnchor` / `groupMember` / `afterGroup`) |
| `src/demo_build.js` | 8 页参考实现（editable + 全量对象动画） |
| `src/notrat_ppt_studio/animation/capability_lab.js` | 动画能力实验台 |

### Worker 提示

| 文件 | 触发场景 |
|------|---------|
| `prompts/workers/render-editable-slide.md` | **默认**：editable / hybrid 逐页渲染 |
| `prompts/workers/render-slide.md` | image 模式逐页图片生成 |

## 数据流

### editable 路径（默认）

```
用户输入 → 大纲 (含 animation_intent)
  → render-editable-slide.md worker 逐页生成
  → @bapunhansdah/pptxgenjs 写入 animation 字段
  → postprocess.py 注入 OOXML p:timing
  → validate.py 校验
  → 交付 .pptx
```

### image 路径（仅用户明确要全页图片）

```
用户输入 → 大纲
  → prepare.py 生成逐页任务
  → media/generator.py 生成 16:9 位图
  → assembler.py 贴图组装
  → 交付 .pptx (无对象动画)
```

### hybrid 路径

```
用户输入 → 大纲
  → 前景: editable 路径 (layout.js + animation)
  → 背景: image 路径 (media/generator.py)
  → postprocess.py 合并
  → validate.py 校验
  → 交付 .pptx
```

## 命令网关路由

`scripts/notrat-ppt.py` 是唯一入口，内部按命令名动态导入对应模块：

```
runtime    → core/runtime.py
styles     → core/catalog.py
image      → media/generator.py
chroma     → media/chroma.py
prepare    → pipeline/prepare.py
dispatch   → pipeline/record_dispatch.py
result     → pipeline/record_result.py
blocker    → pipeline/record_blocker.py
status     → pipeline/status.py
assemble   → pipeline/assembler.py
animate    → animation/postprocess.py
validate   → animation/validate.py
animation-lab → node capability_lab.js
```
