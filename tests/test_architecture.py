from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
sys.path.insert(0, str(SRC))

from nestmold_ppt_studio.core.catalog import load_catalog
from nestmold_ppt_studio.core.state import deck_manifest_path, run_state_path, write_json


class ArchitectureTests(unittest.TestCase):
    def test_style_catalog_is_complete_and_unique(self):
        catalog = load_catalog(ROOT)
        self.assertEqual(12, len(catalog))
        ids = [item["id"] for item in catalog]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertTrue(all(item["owner"] == "nestmold.cn" for item in catalog))
        self.assertTrue(all(item["producer"] == "notrat.cn" for item in catalog))

    def test_project_contract_paths(self):
        deck = Path("example-deck")
        self.assertEqual(deck / "deck.manifest.json", deck_manifest_path(deck))
        self.assertEqual(deck / "state" / "run.json", run_state_path(deck))

    def test_atomic_json_writer_preserves_unicode(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "state" / "run.json"
            write_json(path, {"message": "中文", "status": "ok"})
            self.assertEqual("中文", json.loads(path.read_text(encoding="utf-8"))["message"])


if __name__ == "__main__":
    unittest.main()
