# Workflow Gates And Progress

Read this before creating downstream artifacts, advancing between phases, or reporting progress.

> **Default path is editable + proactive object animation.**  
> Image backend confirmation, full-slide image jobs, and `assemble` apply only when mode is `image` (or hybrid background generation). Do not force the image pipeline on normal PPT tasks.

## Mandatory Phase Gates

This workflow has explicit approval gates. Do not advance to a later phase until the previous phase has been approved by the user, unless the user explicitly asks to skip that confirmation.

### Default phase order (`editable` / `hybrid`)

1. Source reading and asset extraction
2. Outline confirmation (**includes mode + animation intent per slide**)
3. Visual style confirmation (tokens + animation tone; do not ask “要不要动画”)
4. One native sample slide approval (with real object animations)
5. Full native slide production (`@bapunhansdah/pptxgenjs@1.1.3`)
6. OOXML postprocess when needed (`notrat-ppt.py animate`)
7. Structural validation (`notrat-ppt.py validate`)
8. QA, speaker notes, delivery report

### Image-mode phase order (only if user chose `image`)

1. Source reading and asset extraction
2. Outline confirmation (state no object animation)
3. Visual style confirmation
4. Image backend confirmation
5. One sample slide image approval
6. Full slide image generation
7. QA, speaker notes finalization, and `assemble` PPT

Hard rules:

- Before outline approval, do not create final `deck_spec.json`, `speech.md`, prompt job files, slide images, or `.pptx` files.
- If you need an internal planning artifact before approval, name it with `.draft.` such as `deck_spec.draft.json` or `speech.draft.md`, and clearly report that it is not final.
- Downstream artifacts should be created only after the relevant gates have been approved.
- If the deck uses required source images, stop at outline confirmation and ask the user to verify the slide-to-image mapping before style selection or generation.
- **Do not enter image backend / `prepare` / `dispatch` / `assemble` solely because those docs exist.** Enter them only for `image` mode or hybrid backgrounds.
- **Do not mark animation complete** unless object `animation` fields exist (editable/hybrid) or the outline explicitly chose static/image-only.

## Visible Progress Plan

### Editable / hybrid checklist

1. Prepare source, outline (mode + animation intent), and style decisions.
2. Generate and approve one **native** sample slide with object animations.
3. Produce remaining native slides with `animation` fields.
4. Run `animate` when groups / multi-effect sequences are used; keep raw PPTX.
5. Run `validate` and fix structural issues.
6. Speaker notes, final QA, and delivery report (mode, animation classes, paths).

Completion evidence:

- Outline approved with `mode: editable|hybrid` and per-slide animation intent.
- Sample native slide approved (user confirmed layout **and** animation rhythm).
- Final PPTX built from animation-capable backend (not bitmap-only `assemble`).
- If groups/multi-effect: `*_raw.pptx` + postprocessed PPTX + validate pass.
- Delivery report states animation classes and any missing playback QA.

### Image-mode checklist

1. Prepare source, outline, style, and backend decisions.
2. Generate and approve one sample slide image.
3. Prepare slide jobs and slide state.
4. Dispatch slide subagents.
5. Record generated slide results.
6. QA, repair, notes, and PPT assembly.

Completion evidence (image mode):

- `outline.md` approved; image backend confirmed; no object-animation claim.
- One final `assets/slides/slide_XX.png` approved as style reference.
- `prompts/slide_XX.json`, `deck.manifest.json`, and `state/run.json` exist.
- Each worker recorded via `notrat-ppt dispatch` / `result`.
- Every expected final image exists, `speech.md` is final, and `{deck_name}.pptx` exists via `assemble`.

Do not mark a step complete just because the chat says it is complete; use real files or script-recorded state.
