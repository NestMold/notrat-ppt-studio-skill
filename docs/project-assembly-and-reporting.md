# Project Assembly And Reporting

Read this before initializing the project directory, writing speaker notes, assembling the PPT, or sending the final report.

> **Branch by mode.** Default delivery is **editable/hybrid native PPTX with object animations**.  
> `nestmold-ppt.py assemble` is the **image-mode** assembler (bitmap pages). It cannot create object timelines.

## Project Directory

### Editable / hybrid (default)

```text
{base_dir}/{deck_name}/
├── assets/
│   ├── sources/                 # user assets
│   └── backgrounds/             # hybrid bg only (no baked text)
├── content/
│   ├── outline.md
│   └── speaker-notes.md         # or speech.md at deck root
├── work/
│   └── candidates/
├── output/
│   ├── {deck_name}_raw.pptx
│   ├── {deck_name}.pptx
│   ├── {deck_name}_preview.pdf  # optional
│   ├── layout-report.json       # optional
│   └── animation-report.json    # optional / validate output
├── deck_spec.json
└── state/                       # optional run logs
```

### Image mode (explicit only)

```text
{base_dir}/{deck_name}/
├── assets/slides/
│   ├── slide_01.png
│   ├── slide_02.png
│   └── ...
├── prompts/
│   ├── slide_01.json
│   └── ...
├── deck.manifest.json
├── state/run.json
├── deck_spec.json
├── outline.md
├── speech.md
└── {deck_name}.pptx
```

If the user did not specify a destination, use the current working directory or the directory that contains the source file.

You may initialize a project scaffold with:

```bash
~/.nestmold-ppt-studio/.venv/bin/python {skill_root}/scripts/nestmold-ppt.py assemble {base_dir} {deck_name}.pptx --init
```

## Quality Check And Repair

### Editable / hybrid

Before delivery:

- Every content slide matches outline conclusions.
- Native text remains editable; no accidental raster titles.
- Semantic objects have stable names when groups/postprocess are used.
- **Object animations are present** unless the user forbade them (not page transitions only).
- Triggers match talk order; related parts use `withPrevious`.
- No decoration spam animations.
- Multi-effect / groups: ran `animate` with distinct input/output paths.
- Ran `validate`; no missing `spTgt`, no leftover proxies.
- Report structural pass vs playback QA separately.

If a slide lacks animation that the outline promised, **fix the native build** — do not paste a screenshot into `assemble` as a workaround.

### Image mode

Before assembling the PPT, inspect every slide image. Check:

- Text is readable and not garbled.
- Slide content matches the outline.
- Title and key points are not truncated.
- Visual style is consistent across slides.
- No page number appears unless the user requested one.
- Important elements do not overlap.

If a slide has severe text or layout issues, regenerate it with a more constrained prompt. If a slide is mostly correct but has a localized issue, use the selected backend's edit capability when available. In CLI/API fallback mode, use `scripts/nestmold-ppt.py image edit --image {slide_path} --prompt ... --out {new_slide_path}` and replace the final slide only after validating the edited output.

## Speaker Notes

Make sure `outline.md` reflects the final confirmed deck outline. Do not recreate it from scratch here.

Create `speech.md` (or `content/speaker-notes.md`) as presenter notes that a speaker can use directly. Do not write a brief summary of visible slide text. Write in the presentation language; for Chinese decks, speaker notes should be in Chinese.

For each slide, write only the spoken talk track directly under the slide heading, without an extra label. It is the script the presenter can read or closely follow. It should connect the slide to the deck's main story, explain the point the audience should take away, and include a natural transition at the end when useful.

For animated decks, notes should follow the **reveal order** (what appears on each click), not dump the whole slide at once.

Before writing the slide notes, choose a delivery style based on the deck content, audience, and purpose. The delivery style is not a label added after writing; it should shape the actual talk track, including how direct the claim is, how much background is explained, which examples are used, how quickly the speaker moves, and how transitions are phrased.

Common delivery styles:

- Technical explainer: patient, definition-first, example-driven, with careful visual walkthroughs.
- Research or paper reading: evidence-led, method/result/limitation oriented, with clear claims about what the audience should learn from each figure.
- Product or pitch deck: outcome-first, persuasive, focused on user pain, value, proof, and the next action.
- Training or workshop: step-by-step, checkpoint-driven, with small prompts for audience reflection or practice.
- Executive report: conclusion-first, concise, focused on decisions, risks, tradeoffs, and recommended actions.

Keep one deck-level delivery style consistent, but adapt the tone by slide role. For example, an opening slide can be more framing-oriented, a dense diagram slide can slow down for explanation, and a closing slide can become more action-oriented.

Length guidance:

- Title, agenda, and section-divider slides can be 1-2 short paragraphs.
- Normal content slides should usually be 2-5 short paragraphs, or roughly 150-400 Chinese characters for Chinese decks.
- Dense concept, architecture, data, or paper-explanation slides may need more, but split long material if the audience would lose the thread.

Use basic presentation craft in the talk track:

- Lead with the claim before the details.
- Explain visuals in the order the audience should look at them (and in the order animations reveal them).
- Add examples, contrast, caveats, and "so what" implications instead of rereading the slide.
- Close with a natural bridge to the next slide when useful.

Write the talk track from the presenter's point of view, facing the audience. Avoid generic AI-style phrasing, canned summaries, and phrases that sound detached from the actual talk. The script should sound like a person explaining this specific deck in the room:

- Use natural first-person or speaker-facing phrasing when appropriate, such as "这里我想强调的是..." or "我们先看左边这个结构...".
- Ground each paragraph in the current slide's content and the surrounding deck narrative.
- Prefer concrete explanations, examples, and audience-oriented transitions over broad filler like "本页主要介绍了..." or "综上所述...".
- Do not mention that the notes were generated, inferred, or prepared by an AI.

Use headings that assembly tooling can map back to slide numbers:

```markdown
## Slide 1: {Title}

{Presenter talk track for slide 1. For Chinese decks, write this in Chinese. Include an optional transition sentence at the end when useful.}

## Slide 2: {Title}

{Presenter talk track for slide 2}
```

## Assembly / Delivery Commands

### Editable / hybrid delivery (default)

```bash
# multi-effect sequences + true groups (input and output must differ)
python {skill_root}/scripts/nestmold-ppt.py animate {deck}_raw.pptx {deck}.pptx

# structural checks
python {skill_root}/scripts/nestmold-ppt.py validate {deck}.pptx
```

- Build the raw native PPTX with `@bapunhansdah/pptxgenjs@1.1.3` and `animation` fields.
- Never overwrite the only good raw file.
- Embed speaker notes in the native write path when possible; otherwise keep `speech.md` as the talk track source of truth.
- Optional PDF/preview export is separate from animation validity.

### Image-mode assembly (explicit only)

Before running `scripts/nestmold-ppt.py assemble` or the CLI/API fallback scripts, make sure the shared runtime exists. If `~/.nestmold-ppt-studio/.venv/bin/python` is missing, or if importing script dependencies fails, create or refresh the environment:

```bash
python3 {skill_root}/scripts/nestmold-ppt.py runtime bootstrap
```

This is an internal setup step for the skill. Do not ask the user to run these commands unless dependency installation fails and user approval or troubleshooting is required.

Run:

```bash
~/.nestmold-ppt-studio/.venv/bin/python {skill_root}/scripts/nestmold-ppt.py assemble {base_dir} {deck_name}.pptx --aspect-ratio 16:9
```

Important:

- `{base_dir}` is the parent directory of `{deck_name}/`.
- `{deck_name}.pptx` must match the project folder name.
- The script reads images from `{base_dir}/{deck_name}/assets/slides/`.
- The script only reads final images named like `slide_01.png`, `slide_02.png`, etc.; drafts and sample files are ignored.
- Before running assembly, `deck.manifest.json` should show every generated slide as `recorded` and every approved sample slide as `accepted`. If any slide is `pending`, `dispatched`, or `blocked`, stop and report that state.
- If `{base_dir}/{deck_name}/speech.md` exists and uses `Slide N` headings, the script writes those notes into the corresponding PPT speaker notes.
- The script writes `{base_dir}/{deck_name}/{deck_name}.pptx`.
- **This path cannot produce object entrance/emphasis/exit/path animations.** Final report must say so.

`nestmold-ppt assemble` supports `16:9` and `4:3`. Use `16:9` unless the user requests otherwise. `nestmold-ppt image` loads `~/.nestmold-ppt-studio/.env` automatically for `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `NESTMOLD_PPT_IMAGE_MODEL`. Run `python3 {skill_root}/scripts/nestmold-ppt.py runtime doctor --check-api` when troubleshooting API access.

## Final Report

Always report:

- Project directory
- PPT file path(s): raw + final when postprocessed
- `outline.md` path
- Speaker notes path
- Number of slides
- **Output mode:** `editable` / `hybrid` / `image`
- **Animation policy:** proactive-object / static / page-transition-only
- Animation classes used (`entr` / `emph` / `exit` / `path`) when applicable
- Whether true groups and multi-effect sequences were applied
- Structural validation result; playback QA done or not (and on which app)
- Any slides regenerated, blocked, or limited

Mode-specific extras:

- **Editable/hybrid:** confirm fork version, `animate`/`validate` ran when needed, no leftover proxies.
- **Image:** confirm image backend, every non-sample slide recorded with `nestmold-ppt result`, speaker notes written if applicable, and **explicitly no object animation**.

If the deck's style is custom or noticeably adapted (extracted from user references, tuned during sampling, or otherwise not an unmodified built-in style), end with a one-sentence tip that the style can be saved to the personal style library for future reuse, for example: "如果你喜欢这套风格，可以说「保存这个风格」，我会把它存入个人风格库（`~/.nestmold-ppt-studio/templates/styles/`），以后可以直接复用，更新 skill 也不会丢失。" If the user agrees, read `docs/style-library.md`. Skip this tip when the deck used an unmodified built-in style.

## Prompting Principles

- Keep one global visual style fixed across the deck.
- Vary slide composition by page role; style consistency does not mean repeating the same layout.
- Use `layout_blueprints` as candidate patterns, not mandatory templates.
- **Default to native objects + object animation**, not one image per slide.
- For image mode only: generate one slide per image request.
- Prefer concrete visual direction over generic words like "beautiful" or "professional".
- For dense content, split across more slides instead of crowding one slide.
- Prioritize clarity over decoration.
- Animation serves hierarchy: 3–7 steps, semantic units, no decoration spam.
