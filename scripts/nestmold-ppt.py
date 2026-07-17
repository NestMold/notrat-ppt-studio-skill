#!/usr/bin/env python3
"""Unified command gateway for Nestmold PPT Studio."""

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
    "runtime": "nestmold_ppt_studio.core.runtime",
    "styles": "nestmold_ppt_studio.core.catalog",
    "image": "nestmold_ppt_studio.media.generator",
    "chroma": "nestmold_ppt_studio.media.chroma",
    "prepare": "nestmold_ppt_studio.pipeline.prepare",
    "dispatch": "nestmold_ppt_studio.pipeline.record_dispatch",
    "result": "nestmold_ppt_studio.pipeline.record_result",
    "blocker": "nestmold_ppt_studio.pipeline.record_blocker",
    "status": "nestmold_ppt_studio.pipeline.status",
    "assemble": "nestmold_ppt_studio.pipeline.assembler",
    "animate": "nestmold_ppt_studio.animation.postprocess",
    "validate": "nestmold_ppt_studio.animation.validate",
}


def usage() -> str:
    commands = "\n".join(f"  {name}" for name in COMMANDS)
    return f"Nestmold PPT Studio\n\nUsage: nestmold-ppt <command> [args]\n\nCommands:\n{commands}\n  animation-lab"


def main(argv: list[str] | None = None) -> int:
    args = list(sys.argv[1:] if argv is None else argv)
    if not args or args[0] in {"-h", "--help", "help"}:
        print(usage())
        return 0

    command, *command_args = args
    if command == "animation-lab":
        lab = ROOT / "src" / "nestmold_ppt_studio" / "animation" / "capability_lab.js"
        return subprocess.call(["node", str(lab), *command_args])

    module_name = COMMANDS.get(command)
    if module_name is None:
        print(f"Unknown command: {command}\n\n{usage()}", file=sys.stderr)
        return 2

    module = importlib.import_module(module_name)
    previous = sys.argv
    try:
        sys.argv = [f"nestmold-ppt {command}", *command_args]
        return int(module.main() or 0)
    finally:
        sys.argv = previous


if __name__ == "__main__":
    raise SystemExit(main())

