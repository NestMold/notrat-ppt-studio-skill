/**
 * Notrat PPT Studio - Layout Engine v2
 * 统一网格系统 + 组合动画 API
 *
 * 核心改进:
 * - groupAnchor(): 新建一个 click 组，元素作为组的锚点
 * - groupMember(): 与最近的 groupAnchor 同时出现（withPrevious）
 * - afterGroup(): 在当前组完成后顺序出现（afterPrevious）
 *
 * 这样每张卡片/每个逻辑块的所有元素作为一个整体出现，
 * 而不是逐个散落冒出。
 */

// ===== Canvas =====
const PAGE_W = 13.333;
const PAGE_H = 7.5;

// ===== Grid System =====
const COLS = 12;
const MARGIN_X = 0.7;
const MARGIN_Y = 0.55;
const GUTTER = 0.25;

const CONTENT_W = PAGE_W - 2 * MARGIN_X;
const CONTENT_H = PAGE_H - 2 * MARGIN_Y;
const COL_W = (CONTENT_W - (COLS - 1) * GUTTER) / COLS;

// ===== Vertical Zones =====
const ZONE = {
  labelY:   MARGIN_Y,
  labelH:   0.35,
  titleY:   MARGIN_Y + 0.5,
  titleH:   0.65,
  subY:     MARGIN_Y + 1.3,
  subH:     0.75,
  contentY: MARGIN_Y + 2.35,
  contentH: PAGE_H - MARGIN_Y - (MARGIN_Y + 2.35),
  footerY:  PAGE_H - MARGIN_Y - 0.35,
};

const SPACE = { xs: 0.1, sm: 0.2, md: 0.35, lg: 0.5, xl: 0.8, xxl: 1.2 };

const CARD = { radius: 0.1, padding: 0.3 };

// ===== Grid Helpers =====
function col(span, offset = 0) {
  const x = MARGIN_X + offset * (COL_W + GUTTER);
  const w = span * COL_W + (span - 1) * GUTTER;
  return { x, w };
}

function distribute(n, gap = SPACE.md) {
  const itemW = (CONTENT_W - (n - 1) * gap) / n;
  return Array.from({ length: n }, (_, i) => ({
    x: MARGIN_X + i * (itemW + gap),
    w: itemW,
  }));
}

function centerX(w) { return (PAGE_W - w) / 2; }
function centerY(h) { return ZONE.contentY + (ZONE.contentH - h) / 2; }
function cardInner(cardPos, pt = 0) {
  return { x: cardPos.x + CARD.padding, w: cardPos.w - 2 * CARD.padding };
}

// ===== Animation API =====

/** Base animation config */
function anim(type, opts = {}) {
  return {
    type: type || 'fadein',
    duration: opts.duration || 400,
    trigger: opts.trigger || 'withPrevious',
    delay: opts.delay || 0,
    ...(opts.direction ? { direction: opts.direction } : {}),
  };
}

/**
 * GROUP ANCHOR — starts a new click group.
 * All subsequent groupMember() calls will appear TOGETHER with this shape.
 * The presenter clicks once → the entire group appears as one unit.
 */
function groupAnchor(type = 'fadein', opts = {}) {
  return anim(type, { ...opts, trigger: 'onClick', delay: opts.delay || 0 });
}

/**
 * GROUP MEMBER — appears simultaneously with the most recent groupAnchor.
 * Use for all elements that belong to the same logical unit (card content, etc.)
 */
function groupMember(type = 'fadein', opts = {}) {
  return anim(type, { ...opts, trigger: 'withPrevious', delay: opts.delay || 0 });
}

/**
 * AFTER GROUP — appears after the current group completes, sequentially.
 * Use for staggered follow-up items within a group.
 */
function afterGroup(type = 'fadein', opts = {}) {
  return anim(type, { ...opts, trigger: 'afterPrevious', delay: opts.delay || 0 });
}

module.exports = {
  PAGE_W, PAGE_H, COLS, MARGIN_X, MARGIN_Y, GUTTER, COL_W,
  CONTENT_W, CONTENT_H, ZONE, SPACE, CARD,
  col, distribute, centerX, centerY, cardInner,
  anim, groupAnchor, groupMember, afterGroup,
};
