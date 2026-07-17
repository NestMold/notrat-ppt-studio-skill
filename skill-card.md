# Nestmold PPT Studio

## Publisher

- Owner: [nestmold.cn](https://nestmold.cn)
- Produced with: [notrat.cn](https://notrat.cn)
- Version: 2.0.0
- License: Proprietary for original materials; see `THIRD_PARTY_NOTICES.md` for incorporated third-party components.

## Description

Create image-based, native editable, or hybrid PowerPoint presentations from source material. The skill covers story structure, visual systems, image generation, editable layout, speaker notes, assembly, semantic object grouping, entrance/emphasis/exit/path animations, timing sequences, and PPTX Open XML validation.

**Default behavior (hard):** `editable` mode with **proactive object animations** (about 3–7 steps per slide). The agent must add object timelines without waiting for the user to say “加动画”. Use `image` + `assemble` only when the user explicitly wants full-slide bitmaps / no object timing.

## Outputs

- PPTX decks (default: native editable objects with animation)
- Optional PDF and slide previews
- Editable native objects or full-slide images according to the selected mode
- Speaker notes aligned to reveal order
- Layout and animation reports
- Raw and postprocessed PPTX files when OOXML transformations are used

## Privacy And Operational Risks

Remote image providers may receive prompts and approved input assets. Review sensitive data before use. Generated projects contain persistent prompts, images, state files, and presentation outputs. Advanced animation compatibility must be verified in the target PowerPoint or WPS version.

## Animation Boundary (Critical)

- **Proactive by default:** if the user does not forbid animation, the agent MUST add object animations without being asked.
- **Default mode:** `editable` (+ object timeline). Use `hybrid` when atmosphere background is needed. Use `image` only when the user wants full-slide visuals without object timing.
- Object animation requires `editable` or `hybrid` mode.
- Backend: `@bapunhansdah/pptxgenjs@1.1.3` + `python scripts/nestmold-ppt.py animate|validate`.
- Image-mode `assemble` only pastes full-slide bitmaps; it cannot create entrance/emphasis/exit/path object timelines.
- Page transitions are not object animations. Do not substitute flip effects for object timing.
- Outline must include per-slide **animation intent**; code must include `animation` fields.
- Worker for default path: `prompts/workers/render-editable-slide.md`.
- Canonical rules are inlined in `SKILL.md` sections **默认模式与自觉动画策略** and **动画硬约束**; `docs/object-animation-and-grouping.md` is backup detail.

## Runtime Contract

Unified command gateway: `python scripts/nestmold-ppt.py <command>`. Style templates use stable IDs under `templates/styles/`; deck projects use `deck.manifest.json` and responsibility-based asset, job, state, content, work, and output directories.

Default command path for animated decks: native build → `animate` (if groups/multi-effect) → `validate` → deliver. Do not default to `image` / `prepare` / `assemble`.
