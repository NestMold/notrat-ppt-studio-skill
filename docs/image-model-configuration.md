# Image Model Configuration

Use this reference only when API/CLI fallback is selected and its configuration is missing or must change.

## Variables

- `OPENAI_API_KEY`: required by most remote providers.
- `OPENAI_BASE_URL`: optional provider API root.
- `NOTRAT_PPT_IMAGE_MODEL`: optional model override; defaults to `gpt-image-2`.
- `NOTRAT_PPT_HOME`: optional runtime-home override; defaults to `~/.notrat-ppt-studio`.

Configure values through the runtime command instead of editing `.env` manually:

```bash
python {skill_root}/scripts/notrat-ppt.py runtime config \
  --api-key "your-api-key" \
  --base-url "https://provider.example/v1" \
  --model "gpt-image-2"
```

The command writes `~/.notrat-ppt-studio/.env`. Process environment variables override file values; a command-line `--model` applies only to that invocation.

For OpenAI-compatible services, use the provider's API root rather than a terminal `/images/generations` or `/images/edits` endpoint. Provider-specific model names should only be used when documented by that provider.

Never print full API keys in logs or final reports.

