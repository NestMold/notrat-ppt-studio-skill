# Editable Hybrid Layout

Read this for native editable decks and hybrid decks (bitmap atmosphere + editable foreground).

> **Default production path:** unless the user explicitly wants full-slide image posters or pure static layout, use **`editable`** and **proactively add object animations**. Do not wait for the user to say “加动画”.  
> Canonical animation rules: `SKILL.md` → **默认模式与自觉动画策略** + **动画硬约束**.

## Mode Decision

| Priority | Condition | Mode | Animation |
|---|---|---|---|
| 1 | User wants full-page visual posters, no object editing | `image` | Page transition only; state “no object animation” |
| 2 | User wants atmosphere background + editable copy | `hybrid` | **Must** animate foreground native objects |
| 3 | **All other normal PPT tasks (DEFAULT)** | **`editable`** | **Must** animate semantic objects (3–7 steps/slide) |

### `editable` (default)

- Titles, body, shapes, tables, charts, diagrams as native objects.
- Text is not rasterized.
- Chart data remains editable.
- Cards, process nodes, and labels keep independent semantic identity via stable `objectName`.
- **Object animation is mandatory** unless the user forbids it.
- Backend: `@bapunhansdah/pptxgenjs@1.1.3` for `animation` fields; multi-effect sequences and true groups via `notrat-ppt.py animate`.

### `hybrid`

- Generate **background-only** images: no text, labels, logos, cards, UI chrome, or fake diagrams that duplicate editable elements.
- Assemble text and semantic shapes with the animation-capable pptxgenjs fork.
- Preserve the approved image backend for background generation only.
- Record background provenance and editable assembly separately.
- **Animate only foreground native objects.** Background bitmaps stay static.
- Do not bake key copy into the background and then pretend it can animate.

### `image` (non-default)

Use only when the user accepts flattened pages and prioritizes maximum image-model visual unity **without** object timing. Do not claim object animations on this path.

Do not claim every element is editable when the background remains a bitmap. Say exactly which layers are editable.

## Proactive Animation (required for editable / hybrid)

Agent must design animation during outline and write it into code. Minimum patterns:

| Slide role | Default timeline |
|---|---|
| Cover | Title `fadein`/`floatin` → subtitle/promise `withPrevious` or short `afterPrevious` |
| Cards / bullets | Title first; each semantic card `afterPrevious`; in-card parts `withPrevious` or true group |
| Process / steps | Nodes in order; connectors `wipe` or directional light `flyin` |
| Data focus | Claim first; key number `zoom`/`fadein`; unit/note `withPrevious` |
| Comparison | Left group → right group; optional one `pulse` on focus side |
| Timeline | Axis first; nodes sequential `wipe`/`fadein` |
| Close / CTA | Primary CTA enter; contact `withPrevious`; avoid flashy exits |

Rules:

- Prefer **3–7** meaningful steps per slide.
- Animate semantic components, not every primitive decoration.
- Backgrounds, dividers, and pure decoration stay static.
- Never report page transitions as “animations done”.
- Never deliver zero-animation editable/hybrid when the user did not forbid animation.
- Multi-effect on one target / true `p:grpSp` groups → `animate` then `validate`.

Example declaration:

```js
const PptxGenJS = require('@bapunhansdah/pptxgenjs');

slide.addText('核心结论', {
  x: 0.7, y: 0.5, w: 8.5, h: 0.55,
  fontSize: 28, bold: true,
  objectName: 'title-claim',
  animation: {
    type: 'fadein',
    duration: 550,
    delay: 0,
    trigger: 'afterPrevious'
  }
});
```

## Design Tokens

Define one deck-level token file before assembly:

- Canvas and safe margins.
- Primary, secondary, surface, border, accent, success, warning, and text colors.
- Display, heading, body, label, and caption type scales with minimum and maximum sizes.
- Spacing scale, corner radius, border strength, and shadow policy.
- Image treatment and overlay policy (hybrid only).

Avoid a one-hue palette. A dark technology deck should still have one primary accent and one secondary semantic accent. Use shadows sparingly; borders and tonal surfaces should carry most separation.

## Content-Driven Layout

Treat layout blueprints as candidates, not fixed templates. Derive a content profile for each slide:

- Semantic role: cover, problem, proposition, demo, process, comparison, trust, tutorial, pricing, CTA.
- Text volume and longest line.
- Item count and item-length variance.
- Visual importance: hero, supporting, evidence, or utility.
- Required image orientation and safe area.
- **Animation intent:** reveal order, click steps, group units.

Choose proportions within ranges instead of fixed ratios:

- Hero/content split: 35/65 through 65/35.
- Two-column split: 42/58 through 58/42.
- Outer safe margin: 5.5% through 8.2% of slide width.
- Card gap: 1.8% through 4.2% of slide width.

Longer content gets more width or a stacked layout. Shorter content gets more whitespace, not larger empty cards.

## Composition Variety

Keep visual identity stable while varying composition by role. Use at least four composition families in an 8-12 slide deck:

1. Asymmetric hero with one strong focal area.
2. Editorial list or ranked rows without enclosing every item in a card.
3. Product demo with a dominant mockup and a narrow annotation rail.
4. Process with varied node emphasis, not three identical boxes.
5. Comparison with unequal columns based on importance.
6. Quote/trust statement paired with evidence rows.
7. Stair-step tutorial or timeline.
8. CTA with one dominant action and restrained platform metadata.

Do not repeat the same composition on adjacent slides unless the slides form an intentional sequence.

## Typography

- Titles should normally be left-aligned on content slides; center alignment is reserved for covers, section dividers, and deliberate closing pages.
- Use dynamic title size based on character count, with explicit minimum and maximum.
- Body text should not be centered inside large cards unless it is a short label.
- Use no more than four text levels on one slide.
- Keep Chinese body text at least 14 pt for normal presentation viewing; use 12 pt only for secondary UI labels.
- Avoid emoji as production icons because font substitution is inconsistent. Prefer simple native shapes, short labels, or supplied icon assets.

## Cards And Decoration

Cards are for grouping, not for filling the canvas. A slide should usually have zero to three dominant surfaces. Avoid cards nested inside cards.

- Prefer tonal contrast plus a 0.5-1 pt border.
- Use one emphasized surface per slide.
- Use glow only for a real focal action or active state.
- Decorative lines, grids, and dots must follow alignment anchors and remain below 20% visual salience.
- Prefer true OOXML groups (`grp:name:member:...` + `animate`) when a card should enter as one animation unit.

## Adaptive Rules

- Compute title size from title length.
- Allocate item width from content length with min/max constraints.
- Switch from horizontal cards to vertical rows when average item length exceeds the available line budget.
- Switch from equal columns to weighted columns when one side is the primary offer, result, screenshot, or recommendation.
- Reduce card count before reducing body text below the minimum size.
- Split slides when copy cannot fit without violating minimum sizes.

## Production Backend (editable / hybrid)

```bash
npm install @bapunhansdah/pptxgenjs@1.1.3
```

```bash
# multi-effect + true groups
python scripts/notrat-ppt.py animate raw.pptx grouped.pptx
python scripts/notrat-ppt.py validate grouped.pptx
```

- Pin fork version `1.1.3`.
- Do not claim object animation with standard `pptxgenjs` or `python-pptx`.
- Keep raw and postprocessed PPTX as separate files.

## QA

Generate a machine-readable layout report during assembly. For every slide, record:

- Chosen composition family.
- Content density.
- Main proportions.
- Title and body font sizes.
- Shape bounds.
- Overflow, overlap, and safe-margin warnings.
- **Animation steps count and classes (entr/emph/exit/path).**
- **Whether groups / multi-effect postprocess ran.**

Then render representative slides when a renderer is available and inspect the actual pixels. Structure-only QA is not a substitute for visual QA; report the limitation when PowerPoint, WPS, LibreOffice, or another reliable renderer is unavailable.

## Completion Criteria

- Mode is explicitly `editable` or `hybrid` (or intentional `image` with no object-animation claim).
- Editable objects remain editable after opening and saving in PowerPoint/WPS.
- No text or semantic element is duplicated in the bitmap background (hybrid).
- No object crosses the canvas or safe margin unintentionally.
- Adjacent slides do not repeat the same composition family without reason.
- Font sizes stay within declared bounds.
- **If animation was not forbidden: every content slide has a real object timeline in code, not only page transitions.**
- Multi-effect / group decks ran `animate` + `validate`.
- The final report states mode, which layers are editable, animation classes used, and what visual/playback checks were performed.
