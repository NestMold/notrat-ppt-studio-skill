# Workflow Gates & Progress

## 7 步标准工作流

每一步都是一个"门"（gate）——必须通过才能进入下一步。

```
Step 1: 理解任务
  Gate: 主题明确 + 模式确定 + 用户确认
  ↓
Step 2: 大纲设计
  Gate: 大纲完整 + 每页有 animation_intent + 用户确认
  ↓
Step 3: 样式选择
  Gate: style.json 有效 (styles validate 通过)
  ↓
Step 4: 逐页渲染
  Gate: 所有页面渲染完成 (status: all completed)
  ↓
Step 5: 组装
  Gate: PPTX 可打开 + 页序正确
  ↓
Step 6: 动画后处理 (editable/hybrid)
  Gate: animate 完成 + validate 通过
  ↓
Step 7: 交付
  Gate: 报告齐全 + 用户验收
```

## 各步骤检查清单

### Step 1: 理解任务

- [ ] 主题与演示目标
- [ ] 目标受众
- [ ] 页数或时长
- [ ] 语言与语气
- [ ] 品牌色 / Logo / 字体
- [ ] 模式确认（未指定 → editable）
- [ ] 动画策略（未禁止 → 自觉加动画）

### Step 2: 大纲设计

- [ ] 每页有 `role` 和 `title`
- [ ] 每页有 `animation_intent`
- [ ] 动画意图不是"统一 flyin"
- [ ] 页面之间叙事连贯
- [ ] 无冗余页（每页承担一个任务）

### Step 3: 样式选择

```bash
python scripts/notrat-ppt.py styles validate <style-id>
```
- [ ] style.json 存在且格式正确
- [ ] 色彩对比度 ≥ 4.5:1（正文 vs 背景）

### Step 4: 逐页渲染

```bash
python scripts/notrat-ppt.py status
```
- [ ] 所有页面状态为 `completed`
- [ ] 无 `blocked` 页面
- [ ] 内容无溢出（layout-report.json 无 overflow）

### Step 5: 组装

- [ ] PPTX 可在 PowerPoint / WPS 打开
- [ ] 页序与大纲一致
- [ ] 无空白页 / 重复页

### Step 6: 动画后处理

```bash
python scripts/notrat-ppt.py animate <pptx_path>
python scripts/notrat-ppt.py validate <pptx_path>
```
- [ ] `animate` 无报错
- [ ] `validate` 输出 `passed`
- [ ] animation-report.json 中每页 ≥ 3 个动画
- [ ] 无装饰元素被误加动画

### Step 7: 交付

- [ ] PPTX 文件命名正确（`<项目名>_<名称>_v01.pptx`）
- [ ] 附带 layout-report.json + animation-report.json
- [ ] 演讲者备注与揭示顺序对齐
- [ ] 版权署名：`Copyright © notrat.cn`

## 状态机

```
draft → building → review → delivered
  ↑         │         │
  └─────────┴─────────┘
     (用户要求修改时回退)
```

| 状态 | 含义 | 允许操作 |
|------|------|---------|
| `draft` | 大纲阶段 | 编辑大纲 |
| `building` | 逐页渲染中 | dispatch / result / blocker |
| `review` | 组装 + 动画 + 校验 | animate / validate |
| `delivered` | 已交付 | 版本递增 |

## 阻塞处理

当某页无法继续时：

```bash
python scripts/notrat-ppt.py blocker --page <N> --reason "<原因>"
```

Agent 应：
1. 记录阻塞原因
2. 跳过该页继续其他页
3. 向用户报告阻塞项
4. 解决后清除阻塞并继续

## 版本管理

- 每次交付递增版本号：`_v01` → `_v02` → `_v03`
- **禁止覆盖**最后一个可用版本
- 后处理前的原始文件保留为 `_raw.pptx`
- 用户要求"改一下"时 → 新版本，不覆盖旧版本
