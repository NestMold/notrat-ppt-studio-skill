"""Discover and validate reusable Nestmold style templates."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

REQUIRED_FIELDS = {
    "schema_version",
    "id",
    "name_zh",
    "kind",
    "status",
    "aspect_ratios",
    "modes",
    "owner",
    "producer",
    "prompt",
}


def skill_root() -> Path:
    return Path(__file__).resolve().parents[3]


def load_catalog(root: Path | None = None) -> list[dict[str, Any]]:
    styles_root = (root or skill_root()) / "templates" / "styles"
    entries: list[dict[str, Any]] = []
    for metadata_path in sorted(styles_root.glob("*/template.json")):
        data = json.loads(metadata_path.read_text(encoding="utf-8-sig"))
        missing = sorted(REQUIRED_FIELDS - data.keys())
        if missing:
            raise ValueError(f"{metadata_path}: missing fields: {', '.join(missing)}")
        if data["id"] != metadata_path.parent.name:
            raise ValueError(f"{metadata_path}: id must match directory name")
        prompt_path = metadata_path.parent / data["prompt"]
        if not prompt_path.is_file():
            raise ValueError(f"{metadata_path}: prompt not found: {prompt_path}")
        data["directory"] = str(metadata_path.parent.relative_to(root or skill_root())).replace("\\", "/")
        entries.append(data)
    return entries


def main() -> int:
    parser = argparse.ArgumentParser(description="List or validate style templates")
    parser.add_argument("action", choices=("list", "validate"), nargs="?", default="list")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    catalog = load_catalog()
    if args.json:
        print(json.dumps(catalog, ensure_ascii=False, indent=2))
    elif args.action == "validate":
        print(f"Validated {len(catalog)} style templates.")
    else:
        for item in catalog:
            print(f"{item['id']}\t{item['name_zh']}\t{','.join(item['modes'])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

