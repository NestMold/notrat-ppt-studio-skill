# Style Template Library

Use this workflow when the user wants to save a finished deck style, approved sample style, or supplied PPT/PDF/image style for reuse.

## Storage Contract

Built-in templates:

```text
<skill-root>/templates/styles/<style-id>/
  template.json
  template.md
```

User templates:

```text
${NESTMOLD_PPT_HOME:-~/.nestmold-ppt-studio}/templates/styles/<style-id>/
  template.json
  template.md
```

User templates live outside the skill installation and survive updates. A user template with the same `style-id` overrides the built-in template after explicit confirmation.

## Extraction Rules

Inspect visible pages, not only PPTX XML or metadata. Prefer a cover, a normal content slide, a data/process slide, and a closing slide when available.

Extract only reusable visual rules:

- canvas, aspect ratio, density, and whitespace;
- primary, secondary, accent, and neutral color rules;
- typography hierarchy and alignment;
- layout families and when to use each one;
- photo, screenshot, chart, illustration, icon, and texture treatment;
- rendering constraints and anti-patterns.

Do not persist client names, private data, source copy, logos, quotes, project titles, or required external assets unless the user explicitly requests a reusable brand template and has rights to those assets.

## Naming

Use a stable lowercase kebab-case ID, such as `dark-data-tech` or `soft-academic-illustration`. The directory name and `template.json.id` must match.

Before writing, check both built-in and user template catalogs. If the ID already exists, ask whether to replace it or choose another ID.

## Metadata

`template.json` must conform to `schemas/style-template.schema.json`:

```json
{
  "schema_version": "1.0",
  "id": "dark-data-tech",
  "name_zh": "深色数据科技",
  "kind": "style",
  "status": "stable",
  "aspect_ratios": ["16:9"],
  "modes": ["image", "editable", "hybrid"],
  "owner": "nestmold.cn",
  "producer": "notrat.cn",
  "prompt": "template.md"
}
```

`template.md` contains the reusable style brief and no project-specific content.

## Validation And Discovery

Built-in templates are validated with:

```text
python scripts/nestmold-ppt.py styles validate
```

The catalog is discovered from metadata files; do not add a hard-coded registration list to another document.

## Completion Report

Report the style name, stable ID, saved template directory, validation result, and a concise reuse instruction such as: `用 dark-data-tech 风格生成这份 PPT`.
