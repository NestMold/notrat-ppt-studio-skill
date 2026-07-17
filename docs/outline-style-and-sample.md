# Outline, Style, And Sample

Read this before writing or updating `outline.md`, offering visual styles, using files from `templates/styles/`, or generating/approving the sample slide.

If the user asks to save a finished deck style or a user-supplied image/PDF/PPT/PPTX style for future reuse, read `style-library.md`.

> **Default production path:** `editable` + **proactive object animation** (3–7 steps/slide).  
> Use full-slide image generation only when the user explicitly wants image-mode posters or pure static full-page visuals.  
> Canonical rules: `SKILL.md` → **默认模式与自觉动画策略** + **动画硬约束**.

## Declare Mode First

At the top of every `outline.md`, state:

```markdown
## Deck Mode
- mode: editable   # editable | hybrid | image
- animation: proactive-object   # proactive-object | static | page-transition-only
- backend: @bapunhansdah/pptxgenjs@1.1.3   # for editable/hybrid
```

Rules:

- User did not specify → `mode: editable`, `animation: proactive-object`.
- User wants atmosphere background + editable copy → `hybrid` + proactive object animation on foreground.
- User wants full-page visual posters / no object timing → `image` + `page-transition-only`, and tell the user there will be **no object animation**.
- **Do not ask “要不要动画？”** Declare the default. Only disable when the user says static / no animation / image-only.

## Plan The Deck Outline

Create a concise `outline.md` draft before production. For each slide, define:

- Slide number
- Slide title
- 3-5 key points
- Layout role and intent: cover, agenda, section divider, concept explanation, process, comparison, timeline, data evidence, architecture, case study, summary, or Q&A
- Visual idea (composition family, not just decoration)
- **Animation intent (required for editable/hybrid unless static):**
  - reveal order (what appears 1st / 2nd / …)
  - click steps vs automatic `afterPrevious` / `withPrevious`
  - group units (e.g. card = bg+icon+title+body)
  - optional emphasis / exit / path when narrative needs them
- Required source images, if any: path or attachment name, role, strict asset vs style-only reference

### Outline example (editable default)

```markdown
## Deck Mode
- mode: editable
- animation: proactive-object
- backend: @bapunhansdah/pptxgenjs@1.1.3

## Slide 1: Cover
- Role: cover
- Key points: product name; one-sentence promise; audience
- Layout: centered title stack, quiet brand bar
- Animation intent:
  1. title fadein (onClick/afterPrevious)
  2. promise floatin withPrevious
  3. meta line afterPrevious
- Groups: none

## Slide 4: Three Levers
- Role: concept cards
- Key points: A / B / C
- Layout: three equal cards
- Animation intent:
  1. section title fadein
  2-4. each card group afterPrevious (fadein)
  5. optional pulse on recommended card
- Groups: card-a, card-b, card-c
```

Save the draft to `{base_dir}/{deck_name}/outline.md` once the project directory is known. If the output directory is not known yet, show the outline in chat first and write it to `outline.md` immediately after creating the project directory.

Show the outline to the user for confirmation and wait for approval before moving to visual style selection or production, unless the user explicitly asked you to skip confirmation. If any slide lists required source images, explicitly ask the user to verify that each image is assigned to the correct slide and role before generation. If the user requests changes, update `outline.md` and ask for confirmation again.

Stop after writing the outline draft. At this point, report:

- `outline.md` path
- slide count
- **mode + animation policy**
- required source images and their slide mapping
- that no slide images or PPTX have been generated yet

Do not proceed to `deck_spec.json`, `speech.md`, prompt preparation, style selection, backend selection, or sample generation until the user approves the outline.

Recommended structure:

```text
Slide 1: Cover
Slide 2: Context / problem
Slide 3-7: Main argument or sections
Slide 8: Summary / recommendation / closing
```

For slides that use source images, add lines like:

```markdown
Slide 5: Experiment Results
- Key points: ...
- Animation intent: claim fadein → figure appear → callouts afterPrevious
- Required images:
  - Main evidence figure; strict input asset; preserve data, axes, labels, legends, colors, and values

    ![Result 01](assets/figures/result_01.png)

  - Supporting model architecture; strict input asset; preserve labels and arrows

    ![Model Architecture](assets/figures/model_architecture.png)
```

Use Markdown image syntax inside the `Required images` list whenever the asset is local and renderable in the outline. This lets the user visually verify the exact asset mapping during outline review. Keep the descriptive text next to each image so `notrat-ppt prepare` can convert the same asset into structured prompt input later (image/hybrid background paths).

## Confirm A Unified Visual Style

Before generating samples, discuss the visual style with the user unless the user has already provided a clear style direction or reference material.

If the user has already specified a style, provided a style image, or provided a PDF/PPT/PPTX to use as style reference, do not force a 2-3 option style selection. Extract the usable style rules, briefly restate them, then proceed to sample generation.

For PDF/PPT/PPTX style references, do not infer the visual system from document structure, outline text, XML, file metadata, or slide object hierarchy alone. First render or export representative pages/slides into real page images, inspect those rendered images, and derive the style from what is actually visible on the pages. If the file has multiple visual sections, inspect enough representative pages to capture the shared style and any section-specific variations.

When extracting style from reference material, separate content reuse from style reuse. Unless the user explicitly asks to reuse the source content, treat the provided image/PDF/PPT/PPTX as a style reference only.

If the user has not provided a clear style, prefer a multiple-choice question: offer 2-3 concrete style directions and mark one as your recommendation. Each style option should briefly specify:

- Color palette
- Layout system
- Typography direction
- Illustration or image treatment
- Decorative elements
- Density and whitespace rules
- **Animation tone** (restrained fade/wipe vs bolder fly/zoom) — still object animation by default, not “no animation”

After the user chooses a style, create one final style direction and keep the visual identity consistent across all slides. Keep color palette, typography, texture, icon/illustration language, and overall mood stable. Do not reuse the same layout on every page.

Reusable style templates come from two locations:

- Built-in templates: `templates/styles/<style-id>/template.json` plus `template.md`.
- User templates: `${NOTRAT_PPT_HOME:-~/.notrat-ppt-studio}/templates/styles/<style-id>/` using the same two-file contract.

Discover built-in templates with `python scripts/notrat-ppt.py styles list`. Merge user templates by stable `style-id`; a user template with the same ID overrides the built-in template. Use templates as visual systems, not fixed page compositions.

Example style confirmation:

```text
我建议用 A，因为它最适合这份内容的受众和表达目标。默认会做成原生可编辑稿，并为每页编排对象动画时间线（约 3–7 步）。若你只要全页图片或纯静态，请明确说。

A. 清爽专业风（推荐）：浅色背景、蓝绿强调色、结构清晰，适合汇报、答辩和技术分享；动画偏 fade/wipe。
B. 创意杂志风：大标题、强图片、留白更大胆，适合分享和传播；动画可少量 float/zoom。
C. 数据仪表盘风：指标卡、图表感布局，适合数据密集型报告；数字 zoom，卡片依次进入。

你选哪个？也可以指定要调整的配色、布局或插画方向，或者上传一张喜欢的 PPT 风格图片让我参考。
```

## Generate One Sample For Approval

After the outline and style are confirmed, generate **exactly one sample** before full production. Sample type depends on mode:

### Editable / hybrid sample (DEFAULT)

- Build a representative **native** content slide with `@bapunhansdah/pptxgenjs@1.1.3`.
- Prefer a real content page over the cover when possible.
- Include the planned object animations (not page transitions only).
- Hybrid: background-only image + animated foreground natives.
- Show the sample PPTX (or exported preview) and ask the user to confirm: layout, typography, density, Chinese text quality, **and animation rhythm**.
- Record sample method in `deck_spec.json`:
  - `backend_used`: `@bapunhansdah/pptxgenjs@1.1.3`
  - `mode`: `editable` or `hybrid`
  - `animation`: `proactive-object`
  - `approved_sample_path`
  - `needs_animate` if groups / multi-effect proxies were used

Worker handoff for full production: `prompts/workers/render-editable-slide.md`.

### Image-mode sample (only when user chose image)

- After image backend confirmation, generate one sample slide **image**.
- Save it as the intended final slide filename, e.g. `{base_dir}/{deck_name}/assets/slides/slide_08.png`.
- Show the sample image and confirm visual style, typography, layout density, and Chinese text quality.
- Explicitly state: **no object animation** on this path; only optional page transitions later.
- Record image `sample_generation_method` for subagents as before (`backend_used`, `tool_name`, `mode` generate/edit, `approved_sample_path`, etc.).

Do not generate the full deck until the user approves the sample. If the user requests changes, revise the same sample first.

If the user approved a sample image (image mode), record that `slide_XX.png` path as the deck-level style reference for later image jobs. If the user approved a native sample (editable/hybrid), keep style tokens + animation tone consistent across pages without cloning the sample layout.

## Mode-Specific Downstream Paths

| Mode | After sample approval |
|---|---|
| `editable` / `hybrid` | Produce native slides with animation fields → optional `animate` → `validate` → deliver PPTX |
| `image` | `prepare` jobs → image workers (`render-slide.md`) → `result` → `assemble` bitmap PPTX |

Never run image `assemble` and then claim object animations exist.
