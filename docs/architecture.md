# Architecture

Nestmold PPT Studio exposes one workflow across image, editable, hybrid, and animation-enabled presentations.

## Package Layout

```text
SKILL.md                         Agent-facing workflow contract (canonical)
scripts/nestmold-ppt.py          Stable command gateway
src/nestmold_ppt_studio/
  core/                          Runtime configuration, state, template catalog
  pipeline/                      Job preparation, lifecycle, assembly, reporting
  media/                         Image generation, provider adapters, chroma tools
  animation/                     OOXML grouping, animation transforms, validation
prompts/workers/                 Worker role contracts
templates/styles/<style-id>/     Reusable style template packs
schemas/                         Machine-readable project contracts
tests/                           Runtime and architecture checks
docs/                            Detailed operating guidance
```

## Production Modes

| Mode | What it produces | Object animation |
|---|---|---|
| **`editable` (DEFAULT)** | Native PowerPoint text, shapes, charts, tables, diagrams | **Required by default** via pptxgenjs fork + `animate` |
| `hybrid` | Bitmap atmosphere/photography + native editable foreground | **Required on foreground objects** |
| `image` | Full-slide 16:9 bitmaps assembled as slides | **None** (page transitions only) |

### Default path (hard rule)

Unless the user explicitly asks for full-slide image posters or pure static layout:

1. Choose **`editable`** (or `hybrid` if atmosphere background is needed).
2. **Proactively design object animation** (3–7 meaningful steps per slide).
3. Write `animation` on semantic objects with `@bapunhansdah/pptxgenjs@1.1.3`.
4. Run `nestmold-ppt.py animate` when groups or multi-effect sequences are used.
5. Run `nestmold-ppt.py validate` before delivery.

Do **not** default to the image + `assemble` pipeline. That path pastes one bitmap per slide and cannot host entrance/emphasis/exit/path object timelines.

## Project Contract

A generated deck project uses stable responsibility-based paths:

```text
<deck>/
  deck.spec.json                 Approved deck specification
  deck.manifest.json             Slide lifecycle and provenance
  state/run.json                 Run-level status history
  jobs/slides/slide_<NN>.json    Immutable worker jobs
  assets/slides/slide_<NN>.png   Parent-owned final slide images (image/hybrid bg)
  assets/sources/                User and approved source assets
  work/candidates/               Worker-owned generated candidates
  content/outline.md             Outline with mode + animation intent
  content/speaker-notes.md       Speaker notes
  output/                        PPTX, PDF, previews, and QA reports
  output/*_raw.pptx              Pre-postprocess editable source
  output/*_animation-report.json Structural animation checks
```

The parent orchestrator owns the manifest, state, final assets, and delivery files. Workers read one job, write candidates, and return a strict result contract.

For **editable** decks, the primary deliverable is native PPTX from the animation-capable backend — not `assets/slides/*.png` + `assemble`.

## Command Surface

All automation goes through:

```text
python scripts/nestmold-ppt.py <command> [args]
```

Commands: `runtime`, `styles`, `image`, `chroma`, `prepare`, `dispatch`, `result`, `blocker`, `status`, `assemble`, `animate`, `validate`, and `animation-lab`.

Internal module paths are implementation details. New capabilities should enter through the gateway instead of adding another top-level script.

| Command | Mode relevance |
|---|---|
| `image` / `prepare` / `dispatch` / `result` / `assemble` | Image-mode full-slide production (or hybrid backgrounds) |
| `animate` / `validate` / `animation-lab` | **Editable/hybrid object animation** (default path) |

## Animation Boundary

Editable and hybrid animation decks use:

`native PPTX (with animation fields) -> OOXML grouping/retargeting (animate) -> structural validation (validate) -> target-app playback QA`

Critical distinctions:

- Object animation lives in `p:timing` on shapes/text/groups.
- Page transitions / Morph are **not** object animations.
- `assemble` only pastes bitmaps; it never creates object timelines.
- Structural validation cannot prove playback parity across PowerPoint, WPS, and LibreOffice.
- Preserve the raw editable PPTX before postprocessing.

Canonical agent rules are inlined in `SKILL.md` under **默认模式与自觉动画策略** and **动画硬约束**. `docs/object-animation-and-grouping.md` is the English backup detail.
