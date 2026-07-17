#!/usr/bin/env python3
"""Validate PPTX animation targets, groups, and timing classes."""
from __future__ import annotations

import argparse
import collections
import re
import zipfile
from pathlib import Path
from typing import Any

from lxml import etree as ET

NS = {"p": "http://schemas.openxmlformats.org/presentationml/2006/main"}
SLIDE_RE = re.compile(r"ppt/slides/slide\d+\.xml")


def validate(path: Path) -> dict[str, Any]:
    missing: list[tuple[str, str]] = []
    duplicate_ids: list[tuple[str, str]] = []
    proxies: list[str] = []
    groups: list[str] = []
    classes: collections.Counter[str] = collections.Counter()
    filters: collections.Counter[str] = collections.Counter()
    node_types: collections.Counter[str] = collections.Counter()
    motion_paths = 0
    timing_slides = 0

    with zipfile.ZipFile(path) as archive:
        slides = sorted(name for name in archive.namelist() if SLIDE_RE.fullmatch(name))
        for name in slides:
            root = ET.fromstring(archive.read(name))
            ids = root.xpath(".//p:cNvPr/@id", namespaces=NS)
            counts = collections.Counter(ids)
            duplicate_ids.extend((name, item) for item, count in counts.items() if count > 1)
            targets = root.xpath(".//p:spTgt/@spid", namespaces=NS)
            missing.extend((name, target) for target in targets if target not in counts)
            proxies.extend(root.xpath('.//p:cNvPr[starts-with(@name,"anim-proxy:")]/@name', namespaces=NS))
            groups.extend(root.xpath('.//p:grpSp/p:nvGrpSpPr/p:cNvPr/@name', namespaces=NS))
            classes.update(root.xpath('.//p:cTn[@presetClass]/@presetClass', namespaces=NS))
            filters.update(root.xpath('.//p:animEffect/@filter', namespaces=NS))
            node_types.update(root.xpath('.//p:cTn[@nodeType]/@nodeType', namespaces=NS))
            motion_paths += len(root.xpath(".//p:animMotion", namespaces=NS))
            timing_slides += int(bool(root.xpath(".//p:timing", namespaces=NS)))

        return {
            "zip_error": archive.testzip(),
            "slides": len(slides),
            "timing_slides": timing_slides,
            "groups": groups,
            "remaining_proxies": proxies,
            "missing_targets": missing,
            "duplicate_shape_ids": duplicate_ids,
            "preset_classes": dict(classes),
            "anim_effect_filters": dict(filters),
            "motion_paths": motion_paths,
            "node_types": dict(node_types),
        }


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate animation OOXML in a PPTX package")
    parser.add_argument("pptx", type=Path)
    args = parser.parse_args()
    if not args.pptx.is_file():
        parser.error(f"PPTX not found: {args.pptx}")
    report = validate(args.pptx)
    print(report)
    failed = any(
        (
            report["zip_error"],
            report["remaining_proxies"],
            report["missing_targets"],
            report["duplicate_shape_ids"],
        )
    )
    return int(failed)


if __name__ == "__main__":
    raise SystemExit(main())


