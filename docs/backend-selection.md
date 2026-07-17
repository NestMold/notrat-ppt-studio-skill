# Backend Selection

> **Scope: image backend selection for `image` mode or hybrid backgrounds (non-default full-deck path).**  
> Default decks use `@bapunhansdah/pptxgenjs@1.1.3` for native objects + animation and do **not** require this image-backend gate.  
> Do not force image-backend confirmation on editable-only decks.

Read this before confirming the image backend or generating a sample slide.

## Supported Backends

1. Notrat built-in image generation/editing tool, preferred when available.
2. Local API/CLI fallback through `scripts/nestmold-ppt.py image`.

## Decision Rules

- Check actual tool availability; do not infer it from the current agent name.
- Prefer the built-in Notrat image tool when it can satisfy the requested generation or edit.
- Use CLI/API fallback only when the built-in path is unavailable, lacks a required capability, fails, or the user explicitly requests a configured provider.
- Do not switch backends merely for easier file paths or batch automation.
- Confirm the chosen backend before the first generated sample.
- Keep the approved sample's backend, model family, mode, prompt source, and context-image preparation fixed for the remaining deck.
- The fallback automatically reads `~/.nestmold-ppt-studio/.env`.
- Ask for API configuration only after fallback was intentionally selected and reports a real configuration or authentication error.

If fallback is selected, read `cli-api-fallback.md`. Read `image-model-configuration.md` only when settings are missing or the user asks to change them.

## Confirmation Text

Built-in path:

```text
当前环境可调用 Notrat 内置图片工具，准备使用它生成一页样张。确认后开始。
```

Fallback path:

```text
当前内置图片工具不可用或缺少本页所需能力，准备使用本地 API/CLI fallback，并读取 ~/.nestmold-ppt-studio/.env。确认后开始。
```

