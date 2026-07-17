const PptxGenJS = require('@bapunhansdah/pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'nestmold.cn';
pptx.subject = 'PPTX animation capability lab';
pptx.title = 'PPTX 对象动画能力测试';
pptx.lang = 'zh-CN';
pptx.theme = { headFontFace: 'Microsoft YaHei', bodyFontFace: 'Microsoft YaHei', lang: 'zh-CN' };

const OUT = path.join(__dirname, '..', 'output', 'animation_capability_lab_raw.pptx');
const C = { bg: '0B1020', surface: '161D32', text: 'F3F6FF', muted: 'AAB5D1', cyan: '52D6FF', purple: '8B7CFF', green: '62D39B', red: 'FF718B' };

function base(title, subtitle) {
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  s.addText(title, { x: 0.55, y: 0.28, w: 7.4, h: 0.45, fontSize: 25, bold: true, color: C.text });
  s.addText(subtitle, { x: 0.58, y: 0.78, w: 8.7, h: 0.28, fontSize: 10.5, color: C.muted });
  return s;
}

function tile(s, x, y, label, color, animation, objectName) {
  s.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 1.55, h: 0.86, rectRadius: 0.06,
    fill: { color, transparency: 8 }, line: { color, transparency: 20 },
    animation, objectName
  });
  s.addText(label, { x: x + 0.08, y: y + 0.24, w: 1.39, h: 0.3, fontSize: 12, bold: true, color: C.text, align: 'center', objectName: `${objectName}-label` });
}

// 1. Entrance effects and mixed triggers.
{
  const s = base('进入动画矩阵', '进入效果 + onClick / withPrevious / afterPrevious + delay / duration');
  const effects = [
    ['淡入', 'fadein', {}], ['飞入', 'flyin', { direction: 'left' }], ['擦除', 'wipe', { direction: 'left' }],
    ['缩放', 'zoom', { direction: 'slideCenter' }], ['分割', 'split', { direction: 'horizontalOut' }], ['弹跳', 'bounce', {}],
    ['轮辐', 'wheel', { spokes: 4 }], ['旋转进入', 'swivel', {}], ['浮入', 'floatin', { direction: 'floatUp' }]
  ];
  effects.forEach((e, i) => {
    const x = 0.7 + (i % 3) * 2.25; const y = 1.35 + Math.floor(i / 3) * 1.25;
    tile(s, x, y, e[0], i % 2 ? C.purple : C.cyan, { type: e[1], ...e[2], duration: 520 + i * 35, delay: i % 3 * 90, trigger: i === 0 ? 'onClick' : i % 3 === 1 ? 'withPrevious' : 'afterPrevious' }, `entrance-${i}`);
  });
}

// 2. Emphasis, exit and path effects.
{
  const s = base('强调、退出与路径', '同一页验证 presetClass=emph / exit / path');
  const effects = [
    ['脉冲', 'pulse'], ['旋转', 'spin'], ['放大缩小', 'growshrink'], ['颜色脉冲', 'colorpulse'],
    ['淡出', 'fadeout'], ['飞出', 'flyout'], ['擦除退出', 'wipeexit'], ['缩放退出', 'zoomexit'],
    ['向下路径', 'pathdown'], ['圆形路径', 'pathcircle'], ['折线路径', 'pathzigzag'], ['弧线路径', 'patharcdown']
  ];
  effects.forEach((e, i) => {
    const x = 0.62 + (i % 4) * 2.27; const y = 1.35 + Math.floor(i / 4) * 1.24;
    const cls = i < 4 ? C.green : i < 8 ? C.red : C.purple;
    tile(s, x, y, e[0], cls, { type: e[1], direction: e[1] === 'flyout' ? 'right' : undefined, color: e[1] === 'colorpulse' ? 'FFF06A' : undefined, duration: 700, delay: (i % 4) * 100, trigger: i === 0 ? 'onClick' : 'afterPrevious' }, `mixed-${i}`);
  });
}

// 3. True OOXML group + multi-effect sequence. The postprocessor groups the three named members,
// removes proxy objects, and retargets every proxy animation to the resulting p:grpSp id.
{
  const s = base('组合对象与多段序列', '卡片由背景、图标、文字组成；处理后作为一个组执行：淡入 → 脉冲 → 路径 → 淡出');
  s.addShape(pptx.ShapeType.roundRect, { x: 2.4, y: 1.45, w: 4.7, h: 2.35, fill: { color: C.surface }, line: { color: C.purple, width: 1.2 }, objectName: 'grp:hero-card:anchor' });
  s.addShape(pptx.ShapeType.hexagon, { x: 2.78, y: 2.03, w: 0.82, h: 0.82, fill: { color: C.cyan }, line: { color: C.cyan }, objectName: 'grp:hero-card:member:icon' });
  s.addText('一个动画单元', { x: 3.85, y: 1.87, w: 2.75, h: 0.42, fontSize: 23, bold: true, color: C.text, objectName: 'grp:hero-card:member:title' });
  s.addText('内部对象仍可在 PowerPoint 中编辑', { x: 3.87, y: 2.46, w: 2.8, h: 0.36, fontSize: 12.5, color: C.muted, objectName: 'grp:hero-card:member:body' });

  const proxy = (n, animation) => s.addShape(pptx.ShapeType.rect, { x: 0.02, y: 0.02, w: 0.01, h: 0.01, fill: { color: C.bg, transparency: 100 }, line: { color: C.bg, transparency: 100 }, objectName: `anim-proxy:hero-card:${n}`, animation });
  proxy(1, { type: 'fadein', duration: 650, trigger: 'afterPrevious' });
  proxy(2, { type: 'pulse', duration: 520, delay: 900, trigger: 'afterPrevious' });
  proxy(3, { type: 'patharcdown', duration: 900, delay: 250, trigger: 'afterPrevious' });
  proxy(4, { type: 'fadeout', duration: 600, delay: 1100, trigger: 'afterPrevious' });
}

require('fs').mkdirSync(path.dirname(OUT), { recursive: true });
pptx.writeFile({ fileName: OUT }).then(() => console.log(`Generated: ${OUT}`)).catch(err => { console.error(err); process.exit(1); });
