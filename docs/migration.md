# Architecture Migration

## Target layout

- `src/nestmold_ppt_studio/core`: runtime configuration, atomic JSON state, shared contracts.
- `src/nestmold_ppt_studio/pipeline`: deck planning, job lifecycle, assembly, and reporting.
- `src/nestmold_ppt_studio/media`: image generation, provider adapters, and image utilities.
- `src/nestmold_ppt_studio/animation`: OOXML grouping, sequencing, postprocessing, and validation.
- `scripts/nestmold-ppt.py`: one stable command gateway; internal modules are not public CLIs.
- `prompts/workers`: role prompts with explicit input/output contracts.
- `templates/styles`: reusable style packs with stable IDs and metadata.
- `schemas`: machine-readable contracts for deck manifests, slide jobs, and style packs.
- `tests`: import, catalog, state, and command smoke tests.

## Migration map

| Legacy path | New path / command |
|---|---|
| `scripts/nestmold-ppt.py runtime` | `nestmold-ppt runtime ...` |
| `scripts/nestmold-ppt.py image` | `nestmold-ppt image ...` |
| `scripts/nestmold-ppt.py prepare` | `nestmold-ppt prepare ...` |
| `scripts/nestmold-ppt.py dispatch` | `nestmold-ppt dispatch ...` |
| `scripts/nestmold-ppt.py result` | `nestmold-ppt result ...` |
| `scripts/nestmold-ppt.py blocker` | `nestmold-ppt blocker ...` |
| `scripts/nestmold-ppt.py status` | `nestmold-ppt status ...` |
| `scripts/nestmold-ppt.py assemble` | `nestmold-ppt assemble ...` |
| `scripts/nestmold-ppt.py animate` | `nestmold-ppt animate ...` |
| `scripts/nestmold-ppt.py validate` | `nestmold-ppt validate ...` |
| `scripts/nestmold-ppt.py chroma` | `nestmold-ppt chroma ...` |
| `references/*.md` | `templates/styles/<style-id>/template.md` |
| `prompts/workers/render-slide.md` | `prompts/workers/render-slide.md` |

No compatibility wrappers are retained inside the package. Integrations must use the command gateway or import the namespaced Python package.

