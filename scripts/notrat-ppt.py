#!/usr/bin/env python3
"""Unified command gateway for Notrat PPT Studio."""

from __future__ import annotations

import importlib
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

COMMANDS = {
    "runtime": "notrat_ppt_studio.core.runtime",
    "styles": "notrat_ppt_studio.core.catalog",
    "image": "notrat_ppt_studio.media.generator",
    "chroma": "notrat_ppt_studio.media.chroma",
    "prepare": "notrat_ppt_studio.pipeline.prepare",
    "dispatch": "notrat_ppt_studio.pipeline.record_dispatch",
    "result": "notrat_ppt_studio.pipeline.record_result",
    "blocker": "notrat_ppt_studio.pipeline.record_blocker",
    "status": "notrat_ppt_studio.pipeline.status",
    "assemble": "notrat_ppt_studio.pipeline.assembler",
    "animate": "notrat_ppt_studio.animation.postprocess",
    "validate": "notrat_ppt_studio.animation.validate",
}


def usage() -> str:
    commands = "\n".join(f"  {name}" for name in COMMANDS)
    return f"Notrat PPT Studio\n\nUsage: notrat-ppt <command> [args]\n\nCommands:\n{commands}\n  animation-lab"


def main(argv: list[str] | None = None) -> int:
    args = list(sys.argv[1:] if argv is None else argv)
    if not args or args[0] in {"-h", "--help", "help"}:
        print(usage())
        return 0

    command, *command_args = args
    if command == "animation-lab":
        lab = ROOT / "src" / "notrat_ppt_studio" / "animation" / "capability_lab.js"
        return subprocess.call(["node", str(lab), *command_args])

    module_name = COMMANDS.get(command)
    if module_name is None:
        print(f"Unknown command: {command}\n\n{usage()}", file=sys.stderr)
        return 2

    module = importlib.import_module(module_name)
    previous = sys.argv
    try:
        sys.argv = [f"notrat-ppt {command}", *command_args]
        return int(module.main() or 0)
    finally:
        sys.argv = previous


if __name__ == "__main__":
    raise SystemExit(main())

