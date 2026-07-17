"""Postprocess PptxGenJS output for true OOXML groups and multi-effect sequences.

Naming contract:
  grp:<group>:anchor         first member and group bounding box
  grp:<group>:member:<name>  additional group members
  anim-proxy:<group>:<n>     invisible shape carrying one animation effect

Every animation targeting a proxy is retargeted to the generated p:grpSp. Proxy shapes are
removed. The result remains editable in PowerPoint, but PowerPoint/WPS visual validation is
still required because animation support differs between viewers.
"""
from __future__ import annotations

import argparse
import copy
import os
import re
import shutil
import tempfile
import zipfile
from pathlib import Path
from lxml import etree as ET

NS = {
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
}
QN = lambda p, n: f"{{{NS[p]}}}{n}"
GROUP_RE = re.compile(r"^grp:([^:]+):(anchor|member)(?::.*)?$")
PROXY_RE = re.compile(r"^anim-proxy:([^:]+):(.+)$")


def shape_id_name(el: ET._Element) -> tuple[str | None, str | None]:
    nv = el.find("./p:nvSpPr/p:cNvPr", NS)
    if nv is None:
        nv = el.find("./p:nvPicPr/p:cNvPr", NS)
    return (nv.get("id"), nv.get("name")) if nv is not None else (None, None)


def xfrm(el: ET._Element) -> ET._Element | None:
    for path in ("./p:spPr/a:xfrm", "./p:pic/p:spPr/a:xfrm", "./p:grpSpPr/a:xfrm"):
        node = el.find(path, NS)
        if node is not None:
            return node
    return el.find(".//a:xfrm", NS)


def rect(el: ET._Element) -> tuple[int, int, int, int]:
    xf = xfrm(el)
    if xf is None:
        return 0, 0, 0, 0
    off, ext = xf.find("a:off", NS), xf.find("a:ext", NS)
    return tuple(int(v) for v in (off.get("x", "0"), off.get("y", "0"), ext.get("cx", "0"), ext.get("cy", "0")))


def set_child(parent: ET._Element, tag: str, **attrs: int) -> None:
    child = parent.find(f"a:{tag}", NS)
    if child is None:
        child = ET.SubElement(parent, QN("a", tag))
    for key, value in attrs.items():
        child.set(key, str(value))


def group_shapes(sp_tree: ET._Element, group_name: str, members: list[ET._Element], group_id: int) -> ET._Element:
    bounds = [rect(m) for m in members]
    left = min(x for x, _, _, _ in bounds); top = min(y for _, y, _, _ in bounds)
    right = max(x + w for x, _, w, _ in bounds); bottom = max(y + h for _, y, _, h in bounds)
    width, height = right - left, bottom - top

    group = ET.Element(QN("p", "grpSp"))
    nv = ET.SubElement(group, QN("p", "nvGrpSpPr"))
    ET.SubElement(nv, QN("p", "cNvPr"), id=str(group_id), name=group_name)
    ET.SubElement(nv, QN("p", "cNvGrpSpPr"))
    ET.SubElement(nv, QN("p", "nvPr"))
    gp = ET.SubElement(group, QN("p", "grpSpPr"))
    xf = ET.SubElement(gp, QN("a", "xfrm"))
    set_child(xf, "off", x=left, y=top); set_child(xf, "ext", cx=width, cy=height)
    set_child(xf, "chOff", x=left, y=top); set_child(xf, "chExt", cx=width, cy=height)

    indices = [sp_tree.index(m) for m in members]
    insert_at = min(indices)
    for m in members:
        sp_tree.remove(m)
        group.append(m)
    sp_tree.insert(insert_at, group)
    return group


def process_slide(xml_path: Path) -> dict:
    parser = ET.XMLParser(remove_blank_text=False)
    tree = ET.parse(str(xml_path), parser)
    root = tree.getroot()
    sp_tree = root.find(".//p:spTree", NS)
    if sp_tree is None:
        return {"groups": 0, "proxies": 0, "retargeted": 0}

    groups: dict[str, list[ET._Element]] = {}
    proxies: list[tuple[ET._Element, str, str]] = []
    max_id = 1
    for el in list(sp_tree):
        sid, name = shape_id_name(el)
        if sid and sid.isdigit(): max_id = max(max_id, int(sid))
        if not name: continue
        gm = GROUP_RE.match(name)
        pm = PROXY_RE.match(name)
        if gm: groups.setdefault(gm.group(1), []).append(el)
        elif pm and sid: proxies.append((el, pm.group(1), sid))

    group_ids: dict[str, str] = {}
    for name, members in groups.items():
        max_id += 1
        group_shapes(sp_tree, f"Animation Group - {name}", members, max_id)
        group_ids[name] = str(max_id)

    retargeted = 0
    proxy_ids = {sid for _, _, sid in proxies}
    for _, group, sid in proxies:
        if group not in group_ids: continue
        for target in root.xpath(f'.//p:spTgt[@spid="{sid}"]', namespaces=NS):
            target.set("spid", group_ids[group]); retargeted += 1
    for el, _, _ in proxies:
        if el.getparent() is sp_tree: sp_tree.remove(el)

    # Guard against dangling proxy references after removal.
    dangling = [t.get("spid") for t in root.xpath('.//p:spTgt', namespaces=NS) if t.get("spid") in proxy_ids]
    if dangling:
        raise RuntimeError(f"Dangling animation proxy targets in {xml_path.name}: {dangling}")

    tree.write(str(xml_path), encoding="UTF-8", xml_declaration=True, standalone=True)
    return {"groups": len(group_ids), "proxies": len(proxies), "retargeted": retargeted}


def repack(src_dir: Path, output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as z:
        for file in src_dir.rglob("*"):
            if file.is_file(): z.write(file, file.relative_to(src_dir).as_posix())


def validate(pptx: Path) -> dict:
    with zipfile.ZipFile(pptx) as z:
        bad = z.testzip()
        slides = [n for n in z.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)]
        counts = {"slides": len(slides), "timing": 0, "effects": 0, "groups": 0, "targets": 0}
        for n in slides:
            root = ET.fromstring(z.read(n))
            counts["timing"] += len(root.xpath('.//p:timing', namespaces=NS))
            counts["effects"] += len(root.xpath('.//p:animEffect', namespaces=NS))
            counts["groups"] += len(root.xpath('.//p:grpSp', namespaces=NS))
            counts["targets"] += len(root.xpath('.//p:spTgt', namespaces=NS))
        counts["zip_error"] = bad
        return counts


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("input", type=Path)
    ap.add_argument("output", type=Path)
    args = ap.parse_args()
    if args.input.resolve() == args.output.resolve():
        raise SystemExit("Input and output must differ; keep the source PPTX intact.")
    with tempfile.TemporaryDirectory(prefix="pptx_anim_") as td:
        root = Path(td)
        with zipfile.ZipFile(args.input) as z: z.extractall(root)
        totals = {"groups": 0, "proxies": 0, "retargeted": 0}
        for slide in sorted((root / "ppt" / "slides").glob("slide*.xml")):
            result = process_slide(slide)
            for k, v in result.items(): totals[k] += v
        repack(root, args.output)
    print({"postprocess": totals, "validation": validate(args.output)})


if __name__ == "__main__":
    main()


