/**
 * Notrat PPT Studio — Demo Presentation Builder
 * 8-slide editable PPT with object animations
 * Uses @bapunhansdah/pptxgenjs fork + layout engine
 */
const PptxGenJS = require('@bapunhansdah/pptxgenjs');
const L = require('./layout.js');
const path = require('path');
const fs = require('fs');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'notrat.cn';
pptx.subject = 'Notrat PPT Studio — AI Agent 的 PowerPoint 生产引擎';
pptx.title = 'Notrat PPT Studio 产品介绍';
pptx.company = 'notrat.cn';
pptx.lang = 'zh-CN';

const C = {
  bg: '0B1020',
  surface: '161D32',
  surface2: '1E2641',
  text: 'F3F6FF',
  muted: 'AAB5D1',
  dim: '6B7896',
  cyan: '52D6FF',
  purple: '8B7CFF',
  green: '62D39B',
  red: 'FF718B',
  yellow: 'FFD66B',
  orange: 'FF9F66',
};



// ── helpers ──
function addLabel(s, text, x, y) {
  s.addText(text, {
    x, y, w: 4, h: 0.3,
    fontSize: 10, bold: true, color: C.purple,
    charSpacing: 2, fontFace: 'Microsoft YaHei',
  });
}

function addTitle(s, text, x, y, w) {
  s.addText(text, {
    x, y, w: w || L.CONTENT_W, h: 0.6,
    fontSize: 30, bold: true, color: C.text,
    fontFace: 'Microsoft YaHei',
  });
}

function addSubtitle(s, text, x, y, w) {
  s.addText(text, {
    x, y, w: w || L.CONTENT_W, h: 0.5,
    fontSize: 13, color: C.muted,
    fontFace: 'Microsoft YaHei',
  });
}

function cardBg(s, x, y, w, h, color, radius) {
  s.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: radius || L.CARD.radius,
    fill: { color: C.surface },
    line: { color: color || C.purple, width: 0.75, transparency: 40 },
  });
}

// ════════════════════════════════════════════
// SLIDE 1: Cover
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  s.slideNumber = { x: 12.4, y: 7.1, w: 0.6, h: 0.3, fontSize: 8, color: C.dim, align: 'right' };

  // Decorative top bar
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: L.PAGE_W, h: 0.06,
    fill: { color: C.purple }, line: { type: 'none' },
  });

  // Brand label
  s.addText('NOTRAT · PPT STUDIO', {
    x: L.MARGIN_X, y: 1.6, w: 5, h: 0.35,
    fontSize: 12, bold: true, color: C.cyan, charSpacing: 4,
    fontFace: 'Microsoft YaHei',
    animation: L.anim('fadein', { duration: 600, trigger: 'onClick' }),
  });

  // Main title
  s.addText('AI Agent 的', {
    x: L.MARGIN_X, y: 2.3, w: 10, h: 0.7,
    fontSize: 40, bold: true, color: C.text,
    fontFace: 'Microsoft YaHei',
    animation: L.anim('fadein', { duration: 600, delay: 200, trigger: 'afterPrevious' }),
  });
  s.addText('PowerPoint 生产引擎', {
    x: L.MARGIN_X, y: 3.05, w: 11, h: 0.85,
    fontSize: 48, bold: true, color: C.purple,
    fontFace: 'Microsoft YaHei',
    animation: L.anim('fadein', { duration: 700, delay: 150, trigger: 'afterPrevious' }),
  });

  // Tagline
  s.addText('从输入理解，到结构规划，再到可交付产物。', {
    x: L.MARGIN_X, y: 4.2, w: 10, h: 0.4,
    fontSize: 15, color: C.muted,
    fontFace: 'Microsoft YaHei',
    animation: L.anim('fadein', { duration: 500, delay: 100, trigger: 'afterPrevious' }),
  });

  // Version badge
  s.addShape(pptx.ShapeType.roundRect, {
    x: L.MARGIN_X, y: 5.0, w: 1.3, h: 0.38,
    rectRadius: 0.08,
    fill: { color: C.surface }, line: { color: C.green, width: 0.5 },
    animation: L.anim('zoom', { duration: 400, delay: 100, trigger: 'afterPrevious' }),
  });
  s.addText('v1.0.0', {
    x: L.MARGIN_X, y: 5.02, w: 1.3, h: 0.35,
    fontSize: 11, bold: true, color: C.green, align: 'center', valign: 'middle',
    fontFace: 'Microsoft YaHei',
  });

  // Copyright
  s.addText('Copyright © notrat.cn  ·  Produced with notrat.cn  ·  MIT License', {
    x: L.MARGIN_X, y: 6.9, w: 11, h: 0.3,
    fontSize: 9, color: C.dim,
    fontFace: 'Microsoft YaHei',
  });
}

// ════════════════════════════════════════════
// SLIDE 2: Problem
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  s.slideNumber = { x: 12.4, y: 7.1, w: 0.6, h: 0.3, fontSize: 8, color: C.dim, align: 'right' };

  addLabel(s, 'THE PROBLEM', L.MARGIN_X, L.MARGIN_Y);
  addTitle(s, '做 PPT 为什么这么痛苦？', L.MARGIN_X, L.ZONE.titleY);
  addSubtitle(s, '从空白文档到交付级演示稿，中间有太多不必要的摩擦。', L.MARGIN_X, L.ZONE.subY);

  const probs = [
    { icon: '🕐', title: '排版耗时', desc: '对齐字体、调色、修间距，一页要花 30 分钟。最终还是在反复"看着调"。', color: C.red },
    { icon: '🎨', title: '设计不一致', desc: '封面一种风格，内容页另一种风格。没有统一系统，靠感觉拼接。', color: C.orange },
    { icon: '🔧', title: '不可编辑', desc: '导出图片贴上去，文字改不了，数据更新不了，甲方一改就推翻重来。', color: C.yellow },
  ];

  const slots = L.distribute(3, L.SPACE.md);
  probs.forEach((p, i) => {
    const pos = slots[i];
    // Card background (group anchor)
    cardBg(s, pos.x, L.ZONE.contentY, pos.w, 3.4, p.color);
    s.addShape(pptx.ShapeType.roundRect, {
      x: pos.x, y: L.ZONE.contentY, w: pos.w, h: 3.4,
      rectRadius: L.CARD.radius,
      fill: { color: C.surface }, line: { color: p.color, width: 0.75, transparency: 40 },
      animation: L.anim('flyin', { direction: 'left', duration: 500, delay: i * 80, trigger: i === 0 ? 'onClick' : 'afterPrevious' }),
    });

    // Icon circle
    s.addShape(pptx.ShapeType.ellipse, {
      x: pos.x + 0.35, y: L.ZONE.contentY + 0.4, w: 0.7, h: 0.7,
      fill: { color: p.color, transparency: 80 }, line: { color: p.color, width: 1 },
      animation: L.groupMember('zoom', { duration: 300, delay: 100 }),
    });
    s.addText(p.icon, {
      x: pos.x + 0.35, y: L.ZONE.contentY + 0.4, w: 0.7, h: 0.7,
      fontSize: 22, align: 'center', valign: 'middle',
      animation: L.groupMember('fadein', { duration: 200 }),
    });

    // Title
    s.addText(p.title, {
      x: pos.x + 0.3, y: L.ZONE.contentY + 1.35, w: pos.w - 0.6, h: 0.45,
      fontSize: 20, bold: true, color: C.text,
      fontFace: 'Microsoft YaHei',
      animation: L.groupMember('fadein', { duration: 300, delay: 80 }),
    });

    // Description
    s.addText(p.desc, {
      x: pos.x + 0.3, y: L.ZONE.contentY + 1.9, w: pos.w - 0.6, h: 1.3,
      fontSize: 12, color: C.muted, lineSpacingMultiple: 1.5,
      fontFace: 'Microsoft YaHei',
      animation: L.groupMember('fadein', { duration: 300, delay: 120 }),
    });
  });
}

// ════════════════════════════════════════════
// SLIDE 3: Solution
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  s.slideNumber = { x: 12.4, y: 7.1, w: 0.6, h: 0.3, fontSize: 8, color: C.dim, align: 'right' };

  addLabel(s, 'THE SOLUTION', L.MARGIN_X, L.MARGIN_Y);
  addTitle(s, '把能力封装成可复用的 Skill', L.MARGIN_X, L.ZONE.titleY);
  addSubtitle(s, '每个 Skill 都是一条可追踪、可复用、可验证的工作流。', L.MARGIN_X, L.ZONE.subY);

  // Big highlight card
  s.addShape(pptx.ShapeType.roundRect, {
    x: L.MARGIN_X, y: L.ZONE.contentY, w: L.CONTENT_W, h: 1.2,
    rectRadius: 0.12,
    fill: { color: C.surface },
    line: { color: C.cyan, width: 1, transparency: 30 },
    animation: L.anim('wipe', { direction: 'left', duration: 600, trigger: 'onClick' }),
  });
  s.addText('一句话理解：你给材料，Skill 给你一份结构清晰、视觉统一、动画完整、可二次编辑的 PPT。', {
    x: L.MARGIN_X + 0.4, y: L.ZONE.contentY + 0.15, w: L.CONTENT_W - 0.8, h: 0.9,
    fontSize: 16, color: C.text, valign: 'middle', bold: true,
    fontFace: 'Microsoft YaHei',
    animation: L.anim('fadein', { duration: 400, delay: 200, trigger: 'afterPrevious' }),
  });

  // Three value anchors
  const vals = [
    { num: '3', unit: '种输出模式', desc: '全页图片 / 原生可编辑 / 混合型', color: C.cyan },
    { num: '6', unit: '步标准工作流', desc: '理解→规划→设计→生产→动画→校验', color: C.purple },
    { num: '12+', unit: '种动画效果', desc: '进入/强调/退出/路径 + 对象组合', color: C.green },
  ];
  const vslots = L.distribute(3, L.SPACE.md);
  vals.forEach((v, i) => {
    const pos = vslots[i];
    s.addShape(pptx.ShapeType.roundRect, {
      x: pos.x, y: L.ZONE.contentY + 1.6, w: pos.w, h: 2.0,
      rectRadius: 0.1,
      fill: { color: C.surface2 },
      line: { color: v.color, width: 0.5, transparency: 50 },
      animation: L.anim('zoom', { duration: 450, delay: i * 100, trigger: i === 0 ? 'afterPrevious' : 'afterPrevious' }),
    });
    s.addText(v.num, {
      x: pos.x + 0.2, y: L.ZONE.contentY + 1.75, w: pos.w - 0.4, h: 0.7,
      fontSize: 42, bold: true, color: v.color, align: 'center',
      fontFace: 'Microsoft YaHei',
      animation: L.groupMember('fadein', { duration: 300, delay: 100 }),
    });
    s.addText(v.unit, {
      x: pos.x + 0.2, y: L.ZONE.contentY + 2.5, w: pos.w - 0.4, h: 0.35,
      fontSize: 14, bold: true, color: C.text, align: 'center',
      fontFace: 'Microsoft YaHei',
      animation: L.groupMember('fadein', { duration: 250, delay: 80 }),
    });
    s.addText(v.desc, {
      x: pos.x + 0.2, y: L.ZONE.contentY + 2.9, w: pos.w - 0.4, h: 0.5,
      fontSize: 10, color: C.muted, align: 'center',
      fontFace: 'Microsoft YaHei',
      animation: L.groupMember('fadein', { duration: 250, delay: 120 }),
    });
  });
}

// ════════════════════════════════════════════
// SLIDE 4: Core Capabilities (6 features)
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  s.slideNumber = { x: 12.4, y: 7.1, w: 0.6, h: 0.3, fontSize: 8, color: C.dim, align: 'right' };

  addLabel(s, 'CORE CAPABILITIES', L.MARGIN_X, L.MARGIN_Y);
  addTitle(s, '六大核心能力', L.MARGIN_X, L.ZONE.titleY);
  addSubtitle(s, '从内容理解到动画编排，覆盖 PPT 生产的完整链路。', L.MARGIN_X, L.ZONE.subY);

  const feats = [
    { icon: '🧠', title: '内容理解', desc: '自动从文章、报告、方案中提取结构化大纲', color: C.cyan },
    { icon: '📐', title: '结构规划', desc: '按叙事逻辑分配页面任务，一页一观点', color: C.purple },
    { icon: '🎨', title: '视觉设计', desc: '12 套专业风格模板，色彩字体统一系统', color: C.green },
    { icon: '⚡', title: '动画编排', desc: '进入/强调/退出/路径，每页 3–7 步时间线', color: C.yellow },
    { icon: '📦', title: '对象组合', desc: '卡片、标签、步骤节点按语义组成动画单元', color: C.orange },
    { icon: '✅', title: '交付校验', desc: 'OOXML 结构检查，动画引用与组合完整性验证', color: C.red },
  ];

  const grid = L.distribute(3, L.SPACE.md);
  feats.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const pos = grid[col];
    const y = L.ZONE.contentY + row * 2.0;

    // Card
    s.addShape(pptx.ShapeType.roundRect, {
      x: pos.x, y, w: pos.w, h: 1.7,
      rectRadius: 0.1,
      fill: { color: C.surface },
      line: { color: f.color, width: 0.5, transparency: 50 },
      animation: L.anim('flyin', { direction: 'bottom', duration: 400, delay: (col + row * 3) * 60, trigger: i === 0 ? 'onClick' : i <= 2 ? 'afterPrevious' : 'afterPrevious' }),
    });

    // Icon
    s.addShape(pptx.ShapeType.roundRect, {
      x: pos.x + 0.25, y: y + 0.3, w: 0.6, h: 0.6,
      rectRadius: 0.08,
      fill: { color: f.color, transparency: 80 },
      line: { color: f.color, width: 0.5 },
      animation: L.groupMember('zoom', { duration: 200, delay: 80 }),
    });
    s.addText(f.icon, {
      x: pos.x + 0.25, y: y + 0.3, w: 0.6, h: 0.6,
      fontSize: 18, align: 'center', valign: 'middle',
      animation: L.groupMember('fadein', { duration: 150 }),
    });

    // Title
    s.addText(f.title, {
      x: pos.x + 1.05, y: y + 0.3, w: pos.w - 1.3, h: 0.4,
      fontSize: 17, bold: true, color: C.text,
      fontFace: 'Microsoft YaHei',
      animation: L.groupMember('fadein', { duration: 250, delay: 60 }),
    });

    // Desc
    s.addText(f.desc, {
      x: pos.x + 1.05, y: y + 0.75, w: pos.w - 1.3, h: 0.75,
      fontSize: 11, color: C.muted, lineSpacingMultiple: 1.4,
      fontFace: 'Microsoft YaHei',
      animation: L.groupMember('fadein', { duration: 250, delay: 100 }),
    });
  });
}

// ════════════════════════════════════════════
// SLIDE 5: Output Modes (A/B/C comparison)
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  s.slideNumber = { x: 12.4, y: 7.1, w: 0.6, h: 0.3, fontSize: 8, color: C.dim, align: 'right' };

  addLabel(s, 'OUTPUT MODES', L.MARGIN_X, L.MARGIN_Y);
  addTitle(s, '三种输出模式', L.MARGIN_X, L.ZONE.titleY);
  addSubtitle(s, '根据场景选择最合适的模式，不能含糊混用。', L.MARGIN_X, L.ZONE.subY);

  const modes = [
    {
      tag: 'A', title: '全页图片型', subtitle: 'Image',
      desc: '每页为完整的 16:9 视觉画面，适合强视觉叙事、品牌展示。',
      points: ['统一摄影/插画语言', '重要文字清晰可读', '只有翻页切换，无对象动画'],
      color: C.cyan, badge: '视觉大片',
    },
    {
      tag: 'B', title: '原生可编辑型', subtitle: 'Editable',
      desc: '所有对象使用原生 PPT 元素，文字不栅格化，图表数据可编辑。',
      points: ['对象可二次编辑', '动画主路径（进入/强调/退出/路径）', '默认推荐模式'],
      color: C.purple, badge: '⭐ 默认推荐',
    },
    {
      tag: 'C', title: '混合可编辑型', subtitle: 'Hybrid',
      desc: '图片做背景氛围，关键信息用原生对象叠加。',
      points: ['既有视觉氛围，又可编辑', '动画只加在前景对象', '背景保持静态'],
      color: C.green, badge: '两全其美',
    },
  ];

  const mslots = L.distribute(3, L.SPACE.md);
  modes.forEach((m, i) => {
    const pos = mslots[i];

    // Card
    s.addShape(pptx.ShapeType.roundRect, {
      x: pos.x, y: L.ZONE.contentY, w: pos.w, h: 4.2,
      rectRadius: 0.1,
      fill: { color: C.surface },
      line: { color: m.color, width: 1, transparency: 20 },
      animation: L.anim('flyin', { direction: i === 0 ? 'left' : i === 1 ? 'bottom' : 'right', duration: 500, delay: i * 80, trigger: i === 0 ? 'onClick' : 'afterPrevious' }),
    });

    // Mode tag
    s.addShape(pptx.ShapeType.roundRect, {
      x: pos.x + 0.3, y: L.ZONE.contentY + 0.3, w: 0.5, h: 0.5,
      rectRadius: 0.06,
      fill: { color: m.color },
      animation: L.groupMember('zoom', { duration: 200, delay: 100 }),
    });
    s.addText(m.tag, {
      x: pos.x + 0.3, y: L.ZONE.contentY + 0.3, w: 0.5, h: 0.5,
      fontSize: 22, bold: true, color: C.bg, align: 'center', valign: 'middle',
      animation: L.groupMember('fadein', { duration: 150 }),
    });

    // Title
    s.addText(m.title, {
      x: pos.x + 1.0, y: L.ZONE.contentY + 0.3, w: pos.w - 1.3, h: 0.35,
      fontSize: 18, bold: true, color: C.text,
      fontFace: 'Microsoft YaHei',
      animation: L.groupMember('fadein', { duration: 250, delay: 80 }),
    });
    s.addText(m.subtitle, {
      x: pos.x + 1.0, y: L.ZONE.contentY + 0.62, w: pos.w - 1.3, h: 0.25,
      fontSize: 11, color: m.color, charSpacing: 1,
      fontFace: 'Microsoft YaHei',
      animation: L.groupMember('fadein', { duration: 200, delay: 120 }),
    });

    // Badge
    s.addShape(pptx.ShapeType.roundRect, {
      x: pos.x + 0.3, y: L.ZONE.contentY + 1.0, w: 1.6, h: 0.32,
      rectRadius: 0.04,
      fill: { color: m.color, transparency: 75 },
      line: { color: m.color, width: 0.5 },
      animation: L.groupMember('fadein', { duration: 200, delay: 150 }),
    });
    s.addText(m.badge, {
      x: pos.x + 0.3, y: L.ZONE.contentY + 1.0, w: 1.6, h: 0.32,
      fontSize: 9, bold: true, color: m.color, align: 'center', valign: 'middle',
      animation: L.groupMember('fadein', { duration: 150 }),
    });

    // Desc
    s.addText(m.desc, {
      x: pos.x + 0.3, y: L.ZONE.contentY + 1.5, w: pos.w - 0.6, h: 0.8,
      fontSize: 11, color: C.muted, lineSpacingMultiple: 1.4,
      fontFace: 'Microsoft YaHei',
      animation: L.groupMember('fadein', { duration: 300, delay: 100 }),
    });

    // Points
    m.points.forEach((pt, j) => {
      const py = L.ZONE.contentY + 2.45 + j * 0.45;
      s.addShape(pptx.ShapeType.ellipse, {
        x: pos.x + 0.35, y: py + 0.05, w: 0.12, h: 0.12,
        fill: { color: m.color },
        animation: L.groupMember('zoom', { duration: 150, delay: 50 + j * 60 }),
      });
      s.addText(pt, {
        x: pos.x + 0.6, y: py, w: pos.w - 0.9, h: 0.35,
        fontSize: 10.5, color: C.text,
        fontFace: 'Microsoft YaHei',
        animation: L.groupMember('fadein', { duration: 200, delay: 80 + j * 60 }),
      });
    });
  });
}

// ════════════════════════════════════════════
// SLIDE 6: Workflow (6-step timeline)
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  s.slideNumber = { x: 12.4, y: 7.1, w: 0.6, h: 0.3, fontSize: 8, color: C.dim, align: 'right' };

  addLabel(s, 'WORKFLOW', L.MARGIN_X, L.MARGIN_Y);
  addTitle(s, '六步标准工作流', L.MARGIN_X, L.ZONE.titleY);
  addSubtitle(s, '从理解到校验，每一步都有明确的输入、输出和质量标准。', L.MARGIN_X, L.ZONE.subY);

  const steps = [
    { num: '01', title: '理解任务', desc: '提取主题、受众、场景', color: C.cyan },
    { num: '02', title: '规划大纲', desc: '确定页数、叙事逻辑', color: C.purple },
    { num: '03', title: '设计风格', desc: '选择色彩、字体、模板', color: C.green },
    { num: '04', title: '生产页面', desc: '逐页生成原生对象', color: C.yellow },
    { num: '05', title: '编排动画', desc: '设计对象时间线 + 组合', color: C.orange },
    { num: '06', title: '校验交付', desc: '结构检查 + 动画验证', color: C.red },
  ];

  // Timeline track
  s.addShape(pptx.ShapeType.rect, {
    x: L.MARGIN_X, y: L.ZONE.contentY + 1.05, w: L.CONTENT_W, h: 0.04,
    fill: { color: C.surface2 }, line: { type: 'none' },
    animation: L.anim('wipe', { direction: 'left', duration: 800, trigger: 'onClick' }),
  });

  const sslots = L.distribute(6, L.SPACE.sm);
  steps.forEach((st, i) => {
    const pos = sslots[i];
    const nodeY = L.ZONE.contentY + 0.85;

    // Node circle
    s.addShape(pptx.ShapeType.ellipse, {
      x: pos.x + pos.w / 2 - 0.22, y: nodeY, w: 0.44, h: 0.44,
      fill: { color: C.surface }, line: { color: st.color, width: 1.5 },
      animation: L.anim('zoom', { duration: 300, delay: i * 100, trigger: i === 0 ? 'afterPrevious' : 'afterPrevious' }),
    });
    s.addText(st.num, {
      x: pos.x + pos.w / 2 - 0.22, y: nodeY, w: 0.44, h: 0.44,
      fontSize: 13, bold: true, color: st.color, align: 'center', valign: 'middle',
      fontFace: 'Microsoft YaHei',
      animation: L.groupMember('fadein', { duration: 200, delay: 50 }),
    });

    // Title below node
    s.addText(st.title, {
      x: pos.x, y: L.ZONE.contentY + 1.55, w: pos.w, h: 0.35,
      fontSize: 13, bold: true, color: C.text, align: 'center',
      fontFace: 'Microsoft YaHei',
      animation: L.groupMember('fadein', { duration: 250, delay: 100 }),
    });

    // Desc
    s.addText(st.desc, {
      x: pos.x - 0.05, y: L.ZONE.contentY + 1.95, w: pos.w + 0.1, h: 0.5,
      fontSize: 10, color: C.muted, align: 'center', lineSpacingMultiple: 1.3,
      fontFace: 'Microsoft YaHei',
      animation: L.groupMember('fadein', { duration: 250, delay: 150 }),
    });

    // Connector arrow (except last)
    if (i < 5) {
      s.addShape(pptx.ShapeType.rightArrow, {
        x: pos.x + pos.w - 0.02, y: nodeY + 0.17, w: L.SPACE.sm - 0.06, h: 0.1,
        fill: { color: st.color, transparency: 40 }, line: { type: 'none' },
        animation: L.anim('wipe', { direction: 'left', duration: 200, delay: 80, trigger: 'afterPrevious' }),
      });
    }
  });

  // Bottom highlight
  s.addShape(pptx.ShapeType.roundRect, {
    x: L.MARGIN_X, y: L.ZONE.contentY + 3.0, w: L.CONTENT_W, h: 0.7,
    rectRadius: 0.08,
    fill: { color: C.surface2 },
    line: { color: C.purple, width: 0.5, transparency: 50 },
    animation: L.anim('fadein', { duration: 500, delay: 200, trigger: 'afterPrevious' }),
  });
  s.addText('每一步都有明确的质量标准：大纲要审查、风格要统一、动画要服务节奏、交付要校验。', {
    x: L.MARGIN_X + 0.3, y: L.ZONE.contentY + 3.05, w: L.CONTENT_W - 0.6, h: 0.6,
    fontSize: 13, color: C.text, valign: 'middle', align: 'center',
    fontFace: 'Microsoft YaHei',
    animation: L.anim('fadein', { duration: 400, delay: 150, trigger: 'afterPrevious' }),
  });
}

// ════════════════════════════════════════════
// SLIDE 7: Animation Capability Matrix
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  s.slideNumber = { x: 12.4, y: 7.1, w: 0.6, h: 0.3, fontSize: 8, color: C.dim, align: 'right' };

  addLabel(s, 'ANIMATION ENGINE', L.MARGIN_X, L.MARGIN_Y);
  addTitle(s, '对象动画能力矩阵', L.MARGIN_X, L.ZONE.titleY);
  addSubtitle(s, '进入 / 强调 / 退出 / 路径 — 全部基于 OOXML 原生动画，非翻页冒充。', L.MARGIN_X, L.ZONE.subY);

  const cats = [
    {
      title: '进入动画', color: C.cyan,
      items: [
        ['fadein', '淡入'], ['flyin', '飞入'], ['wipe', '擦除'],
        ['zoom', '缩放'], ['floatin', '浮入'], ['bounce', '弹跳'],
      ],
    },
    {
      title: '强调动画', color: C.green,
      items: [
        ['pulse', '脉冲'], ['spin', '旋转'], ['growshrink', '放大缩小'],
        ['colorpulse', '颜色脉冲'],
      ],
    },
    {
      title: '退出 + 路径', color: C.red,
      items: [
        ['fadeout', '淡出'], ['flyout', '飞出'], ['zoomexit', '缩放退出'],
        ['pathcircle', '圆形路径'], ['pathzigzag', '折线路径'], ['patharcdown', '弧线路径'],
      ],
    },
  ];

  const catslots = L.distribute(3, L.SPACE.md);
  cats.forEach((cat, ci) => {
    const pos = catslots[ci];

    // Category header
    s.addShape(pptx.ShapeType.roundRect, {
      x: pos.x, y: L.ZONE.contentY, w: pos.w, h: 0.45,
      rectRadius: 0.06,
      fill: { color: cat.color, transparency: 80 },
      line: { color: cat.color, width: 0.5 },
      animation: L.anim('fadein', { duration: 400, delay: ci * 100, trigger: ci === 0 ? 'onClick' : 'afterPrevious' }),
    });
    s.addText(cat.title, {
      x: pos.x, y: L.ZONE.contentY, w: pos.w, h: 0.45,
      fontSize: 14, bold: true, color: cat.color, align: 'center', valign: 'middle',
      fontFace: 'Microsoft YaHei',
      animation: L.groupMember('fadein', { duration: 200 }),
    });

    // Effect tiles
    cat.items.forEach((item, ii) => {
      const tileY = L.ZONE.contentY + 0.65 + ii * 0.62;
      const animType = item[0];

      s.addShape(pptx.ShapeType.roundRect, {
        x: pos.x, y: tileY, w: pos.w, h: 0.5,
        rectRadius: 0.06,
        fill: { color: C.surface },
        line: { color: cat.color, width: 0.3, transparency: 60 },
        animation: L.anim('fadein', { duration: 250, delay: ii * 60, trigger: 'afterPrevious' }),
      });

      // Effect name (code)
      s.addText(item[0], {
        x: pos.x + 0.15, y: tileY, w: pos.w * 0.55, h: 0.5,
        fontSize: 10, color: cat.color, valign: 'middle',
        fontFace: 'Consolas',
      });

      // CN name
      s.addText(item[1], {
        x: pos.x + pos.w * 0.6, y: tileY, w: pos.w * 0.35, h: 0.5,
        fontSize: 11, color: C.text, valign: 'middle', align: 'right',
        fontFace: 'Microsoft YaHei',
      });
    });
  });

  // Footer note
  s.addText('✓ 真实 OOXML 动画  ✓ 支持组合对象  ✓ 多段序列  ✓ onClick / withPrevious / afterPrevious', {
    x: L.MARGIN_X, y: 6.7, w: L.CONTENT_W, h: 0.3,
    fontSize: 10, color: C.dim, align: 'center',
    fontFace: 'Microsoft YaHei',
  });
}

// ════════════════════════════════════════════
// SLIDE 8: Closing / CTA
// ════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  s.slideNumber = { x: 12.4, y: 7.1, w: 0.6, h: 0.3, fontSize: 8, color: C.dim, align: 'right' };

  // Decorative gradient bar
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: L.PAGE_W, h: 0.06,
    fill: { color: C.purple }, line: { type: 'none' },
  });

  // Main CTA title
  s.addText('开始用 Notrat PPT Studio', {
    x: L.centerX(10), y: 2.0, w: 10, h: 0.8,
    fontSize: 40, bold: true, color: C.text, align: 'center',
    fontFace: 'Microsoft YaHei',
    animation: L.anim('fadein', { duration: 600, trigger: 'onClick' }),
  });

  s.addText('把做 PPT 的时间，还给真正重要的事。', {
    x: L.centerX(10), y: 2.9, w: 10, h: 0.5,
    fontSize: 18, color: C.muted, align: 'center',
    fontFace: 'Microsoft YaHei',
    animation: L.anim('fadein', { duration: 500, delay: 200, trigger: 'afterPrevious' }),
  });

  // CTA buttons
  const btnW = 3.2; const btnH = 0.55; const btnY = 3.9;
  const btns = [
    { label: 'GitHub 仓库 →', x: L.PAGE_W / 2 - btnW - 0.2, color: C.purple },
    { label: 'SkillHub 安装 →', x: L.PAGE_W / 2 + 0.2, color: C.cyan },
  ];
  btns.forEach((b, i) => {
    s.addShape(pptx.ShapeType.roundRect, {
      x: b.x, y: btnY, w: btnW, h: btnH,
      rectRadius: 0.08,
      fill: { color: C.surface },
      line: { color: b.color, width: 1 },
      animation: L.anim('zoom', { duration: 350, delay: i * 120, trigger: 'afterPrevious' }),
    });
    s.addText(b.label, {
      x: b.x, y: btnY, w: btnW, h: btnH,
      fontSize: 14, bold: true, color: b.color, align: 'center', valign: 'middle',
      fontFace: 'Microsoft YaHei',
    });
  });

  // Quick start command
  s.addShape(pptx.ShapeType.roundRect, {
    x: L.centerX(9), y: 4.9, w: 9, h: 0.6,
    rectRadius: 0.08,
    fill: { color: C.surface2 },
    line: { color: C.dim, width: 0.3, transparency: 50 },
    animation: L.anim('fadein', { duration: 400, delay: 200, trigger: 'afterPrevious' }),
  });
  s.addText('npm install @bapunhansdah/pptxgenjs', {
    x: L.centerX(9), y: 4.9, w: 9, h: 0.6,
    fontSize: 14, color: C.green, align: 'center', valign: 'middle',
    fontFace: 'Consolas',
  });

  // Copyright
  s.addText('Copyright © notrat.cn  ·  Produced with notrat.cn  ·  MIT License', {
    x: L.MARGIN_X, y: 6.9, w: L.CONTENT_W, h: 0.3,
    fontSize: 10, color: C.dim, align: 'center',
    fontFace: 'Microsoft YaHei',
  });
}

// ════════════════════════════════════════════
// Write file
// ════════════════════════════════════════════
const OUT_DIR = path.join(__dirname, '..', 'output');
const OUT_RAW = path.join(OUT_DIR, 'NotratPPT_产品介绍_v01_raw.pptx');
fs.mkdirSync(OUT_DIR, { recursive: true });

pptx.writeFile({ fileName: OUT_RAW }).then(() => {
  console.log('✅ Raw PPTX generated:', OUT_RAW);
  console.log('   Slides:', pptx.slides.length);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
