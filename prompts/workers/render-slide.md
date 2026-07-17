# Render Slide Worker

> **Image-mode worker only.** Do not use this worker for default PPT tasks.
> Default decks are `editable`/`hybrid` with object animations → use `render-editable-slide.md`.
> This worker produces full-slide bitmaps and cannot create object entrance/emphasis/exit/path timelines.

Use this worker only after the deck sample and production backend are approved.

## Input Contract

The parent provides:

- `deck_dir`: absolute deck project directory.
- `job_file`: absolute path to `jobs/slides/slide_<NN>.json`.
- `approved_backend`: exact backend and tool identity used for the approved sample.
- `approved_sample`: absolute path to the approved style reference.
- `output_candidate_dir`: worker-owned directory for generated candidates.

The job JSON is the source of truth for slide content, required assets, style constraints, and target size.

## Execution Contract

1. Read the job JSON before generating anything.
2. Use only the approved backend, model family, operation mode, prompt source, and context preparation method.
3. Treat required source images as strict assets. Preserve labels, values, arrows, relationships, and factual content.
4. Generate candidates only inside `output_candidate_dir`.
5. Do not write the final file under `assets/slides`; the parent records and promotes the selected candidate.
6. Do not edit the manifest, run state, job JSON, speaker notes, or PPTX.
7. Do not substitute Pillow, SVG, HTML/CSS, canvas capture, native-PPT screenshots, or manual overlays for the approved image backend.
8. If the approved backend is unavailable, return a blocker instead of silently switching methods.

## QA Contract

Before selecting a candidate, verify:

- all required text is legible and exact;
- the slide matches the approved sample's visual system;
- required images retain their original information;
- no element overlaps, clips, or exits the 16:9 canvas;
- the visual hierarchy communicates one clear slide-level conclusion.

## Output Contract

Return exactly three lines and no surrounding prose:

```text
backend_used=<exact backend label>
selected_source=<absolute generated candidate path>
qa_note=<one concise sentence>
```


