# Architecture Migration

## Target layout

- `src/notrat_ppt_studio/core`: runtime configuration, atomic JSON state, shared contracts.
- `src/notrat_ppt_studio/pipeline`: deck planning, job lifecycle, assembly, and reporting.
- `src/notrat_ppt_studio/media`: image generation, provider adapters, and image utilities.
- `src/notrat_ppt_studio/animation`: OOXML grouping, sequencing, postprocessing, and validation.
- `scripts/notrat-ppt.py`: one stable command gateway; internal modules are not public CLIs.
- `prompts/workers`: role prompts with explicit input/output contracts.
- `templates/styles`: reusable style packs with stable IDs and metadata.
- `schemas`: machine-readable contracts for deck manifests, slide jobs, and style packs.
- `tests`: import, catalog, state, and command smoke tests.

## Migration map

| Legacy path | New path / command |
|---|---|
| `scripts/notrat-ppt.py runtime` | `notrat-ppt runtime ...` |
| `scripts/notrat-ppt.py image` | `notrat-ppt image ...` |
| `scripts/notrat-ppt.py prepare` | `notrat-ppt prepare ...` |
| `scripts/notrat-ppt.py dispatch` | `notrat-ppt dispatch ...` |
| `scripts/notrat-ppt.py result` | `notrat-ppt result ...` |
| `scripts/notrat-ppt.py blocker` | `notrat-ppt blocker ...` |
| `scripts/notrat-ppt.py status` | `notrat-ppt status ...` |
| `scripts/notrat-ppt.py assemble` | `notrat-ppt assemble ...` |
| `scripts/notrat-ppt.py animate` | `notrat-ppt animate ...` |
| `scripts/notrat-ppt.py validate` | `notrat-ppt validate ...` |
| `scripts/notrat-ppt.py chroma` | `notrat-ppt chroma ...` |
| `references/*.md` | `templates/styles/<style-id>/template.md` |
| `prompts/workers/render-slide.md` | `prompts/workers/render-slide.md` |

No compatibility wrappers are retained inside the package. Integrations must use the command gateway or import the namespaced Python package.

