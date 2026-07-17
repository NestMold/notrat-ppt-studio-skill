# Render Editable Slide Worker

Use this worker for **editable** or **hybrid** slide production with **proactive object animation**.

Do **not** use the image-only `render-slide.md` worker for object-animated decks.

## Input Contract

The parent provides:

- `deck_dir`: absolute deck project directory.
- `job_file`: absolute path to a slide job JSON (or equivalent handoff packet).
- `mode`: `editable` or `hybrid` (never `image` for this worker).
- `style_tokens`: palette, type scale, spacing, corner, shadow policy.
- `animation_intent`: per-slide reveal order, click steps, groups, emphasis targets.
- `approved_sample` (optional): style reference image or prior approved native slide.
- `background_image` (hybrid only): absolute path to background-only bitmap with no baked text.
- `output_candidate_dir`: worker-owned directory for generated candidates / partial PPTX.

The job / handoff is the source of truth for slide content, objects, and animation intent.

## Execution Contract

1. Read the job and animation intent before generating anything.
2. Use `@bapunhansdah/pptxgenjs@1.1.3` only. Pin the version. Do not fall back to standard `pptxgenjs` or `python-pptx` for animated objects.
3. Build **native** text/shapes/charts/tables. Do not rasterize titles or body copy.
4. Give semantic components stable `objectName` values for grouping and postprocess.
5. **Write `animation` on every semantic reveal unit** unless the parent job explicitly marks the slide static.
6. Prefer 3–7 meaningful steps:
   - Title / scene establish first
   - Core objects enter in reading order
   - Related parts use `withPrevious`
   - One optional emphasis (`pulse` / `zoom`) for the focal claim
   - Exit/path only when they communicate state change or flow
7. Do **not** animate pure decoration (backgrounds, hairline dividers, empty frames).
8. Hybrid: place background image as static layer; animate only foreground natives; never bake key copy into the background.
9. If the same target needs multiple effects or a true group:
   - emit named members / proxies per `SKILL.md` animation hard rules
   - leave final grouping to parent `nestmold-ppt.py animate` unless the parent explicitly asked this worker to postprocess
10. Write candidates only under `output_candidate_dir`.
11. Do not edit the deck manifest, final output PPTX, or sibling slides.
12. If the animation backend is unavailable, return a blocker — do not silently switch to image + assemble.

## Forbidden Shortcuts

- Full-slide screenshot / HTML canvas / Pillow as a substitute for native objects
- Claiming animation by adding only slide transitions
- One global `flyin` on every object
- Empty `animation` fields after an outline promised a timeline
- Using `assemble` of bitmaps and calling it object animation

## QA Contract

Before selecting a candidate, verify:

- all required text is exact and legible at presentation size;
- hierarchy matches one clear slide-level conclusion;
- no overlap, clip, or out-of-canvas objects;
- style tokens match the approved system;
- **semantic objects that should appear in sequence actually have `animation` fields**;
- triggers make sense for a live talk (`onClick` per idea, `withPrevious` for related parts);
- hybrid backgrounds contain no duplicate editable text.

## Output Contract

Return exactly these lines and no surrounding prose:

```text
backend_used=@bapunhansdah/pptxgenjs@1.1.3
mode=<editable|hybrid>
selected_source=<absolute generated candidate pptx or slide fragment path>
animation_steps=<integer count of object effects on this slide>
groups_planned=<comma-separated group ids or none>
needs_animate=<true|false>
qa_note=<one concise sentence>
```

If blocked:

```text
blocker=true
reason=<short reason>
```
