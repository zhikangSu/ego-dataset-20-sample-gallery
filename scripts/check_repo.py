#!/usr/bin/env python3
"""Offline smoke checks for a fresh clone of the ego sample gallery."""

from __future__ import annotations

import functools
import http.client
import json
import math
import subprocess
import threading
from html.parser import HTMLParser
from http.server import ThreadingHTTPServer
from pathlib import Path

from bootstrap_assets import DATASETS
from serve import RangeRequestHandler

ROOT = Path(__file__).resolve().parents[1]


class PageFacts(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.iframes: list[dict[str, str | None]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "iframe":
            self.iframes.append(dict(attrs))


def catalog() -> list[dict]:
    script = (
        "const fs=require('fs'),vm=require('vm'),c={window:{}};"
        "vm.runInNewContext(fs.readFileSync('data/catalog.js','utf8'),c);"
        "process.stdout.write(JSON.stringify(c.window.EGO_GALLERY));"
    )
    result = subprocess.run(
        ["node", "-e", script], cwd=ROOT, check=True, capture_output=True, text=True
    )
    return json.loads(result.stdout)


def scenes() -> dict[str, dict]:
    script = (
        "const fs=require('fs'),vm=require('vm'),c={window:{}};"
        "vm.runInNewContext(fs.readFileSync('data/scenes.js','utf8'),c);"
        "process.stdout.write(JSON.stringify(c.window.EGO_SCENES));"
    )
    result = subprocess.run(
        ["node", "-e", script], cwd=ROOT, check=True, capture_output=True, text=True
    )
    return json.loads(result.stdout)


def scene_comparison() -> dict[str, dict]:
    script = (
        "const fs=require('fs'),vm=require('vm'),c={window:{}};"
        "vm.runInNewContext(fs.readFileSync('data/scene-comparison.js','utf8'),c);"
        "process.stdout.write(JSON.stringify(c.window.EGO_SCENE_COMPARISON));"
    )
    result = subprocess.run(
        ["node", "-e", script], cwd=ROOT, check=True, capture_output=True, text=True
    )
    return json.loads(result.stdout)


def check_catalog_and_manifests(records: list[dict]) -> None:
    assert len(records) == 20, f"expected 20 catalog records, found {len(records)}"
    assert [r["no"] for r in records] == list(range(1, 21)), "catalog indices are not 1..20"
    manifest_paths = sorted((ROOT / "data" / "manifests").glob("*.json"))
    assert len(manifest_paths) == 20, f"expected 20 manifests, found {len(manifest_paths)}"
    for record in records:
        path = ROOT / "data" / "manifests" / f"{record['slug']}.json"
        assert path.exists(), f"missing manifest {path.relative_to(ROOT)}"
        manifest = json.loads(path.read_text(encoding="utf-8"))
        assert manifest["representative_id"] == record["sampleId"]
        assert manifest["redistribution"] == record["redistribution"]
        assert len(manifest["media"]) == len(record.get("media", []))
        assert len(manifest["annotations"]) == len(record.get("annotations", []))
        for media in record.get("media", []):
            local = media.get("local")
            if local and local.startswith("assets/local/"):
                assert record["slug"] in DATASETS, f"no downloader for {record['slug']}"
            if local and local.startswith("assets/datasets/"):
                assert (ROOT / local).exists(), f"missing bundled media {local}"


def check_scene_distributions(records: list[dict], scene_records: dict[str, dict]) -> None:
    slugs = {record["slug"] for record in records}
    assert set(scene_records) == slugs, "scene distribution slugs must match all 20 datasets"
    allowed = {"computed", "reported", "taxonomy", "unavailable"}
    for slug, scene in scene_records.items():
        assert scene.get("status") in allowed, f"invalid scene status for {slug}"
        assert scene.get("scope"), f"missing scene scope for {slug}"
        assert scene.get("sources"), f"missing primary scene source for {slug}"
        for source in scene["sources"]:
            assert source.get("label"), f"missing scene source label for {slug}"
            assert source.get("url", "").startswith("https://"), f"unsafe scene source URL for {slug}"
        for chart in scene.get("charts", []):
            assert chart.get("dimension") and chart.get("items"), f"empty scene chart for {slug}"
            labels = [item.get("label") for item in chart["items"]]
            assert all(labels) and len(labels) == len(set(labels)), f"invalid scene labels for {slug}"
            values = [item.get("value") for item in chart["items"]]
            assert all(type(value) in (int, float) and math.isfinite(value) and value >= 0 for value in values), f"invalid scene values for {slug}"
            if "total" in chart:
                assert type(chart["total"]) in (int, float) and math.isfinite(chart["total"])
                assert chart["total"] >= max(values), f"scene total smaller than a category for {slug}"


def check_scene_comparison(records: list[dict], comparison: dict[str, dict]) -> None:
    slugs = {record["slug"] for record in records}
    assert set(comparison) == slugs, "scene comparison slugs must match all 20 datasets"
    levels = {"physical", "semantic", "activity", "interaction", "composition", "unavailable"}
    availability = {"frequency", "taxonomy", "scope", "none"}
    for slug, record in comparison.items():
        assert record.get("level") in levels, f"invalid comparison level for {slug}"
        assert record.get("scene") in availability, f"invalid scene availability for {slug}"
        assert record.get("task") in availability, f"invalid task availability for {slug}"
        assert record.get("sceneNote"), f"missing scene comparison note for {slug}"
        assert record.get("taskNote"), f"missing task comparison note for {slug}"


def check_pages() -> None:
    report = (ROOT / "report.html").read_text(encoding="utf-8")
    index = (ROOT / "index.html").read_text(encoding="utf-8")
    distribution = (ROOT / "distribution.html").read_text(encoding="utf-8")
    assert "base64," not in report and "base64," not in index and "base64," not in distribution, "base64 media was reintroduced"
    assert 'id="sampleGrid"' in report and 'sample-grid legacy-samples' in report
    facts = PageFacts()
    facts.feed(report)
    gallery = [x for x in facts.iframes if x.get("class") == "sample-gallery-frame"]
    comparison = [x for x in facts.iframes if x.get("class") == "scene-compare-frame"]
    assert len(gallery) == 1, "report must contain exactly one gallery iframe"
    assert len(comparison) == 1, "report must contain exactly one scene comparison iframe"
    assert gallery[0].get("src") == "index.html?embed=1&viewer=scene-split-v1&hideScenes=1#gallery"
    assert comparison[0].get("src") == "distribution.html?embed=1&viewer=scene-compare-v1"
    assert 'src="gallery.js?v=scene-split-v1"' in index, "versioned gallery application script is missing"
    assert 'src="data/catalog.js?v=scene-split-v1"' in index, "versioned catalog script is missing"
    assert 'src="data/scenes.js?v=scene-split-v1"' in index, "scene distribution data script is missing"
    assert 'src="data/scene-comparison.js?v=scene-compare-v1"' in distribution, "comparison metadata script is missing"
    assert 'src="distribution.js?v=scene-compare-v1"' in distribution, "comparison application script is missing"
    assert 'id="coverageGrid"' in distribution and 'id="smallGrid"' in distribution
    gallery_js = (ROOT / "gallery.js").read_text(encoding="utf-8")
    assert "function mediaCandidates" in gallery_js, "official-media fallback is missing"
    assert "官方源直连" in gallery_js, "direct official-source state is missing"
    assert "IntersectionObserver" in gallery_js, "remote media must remain lazy-loaded"
    assert "HIDE_SCENES" in gallery_js, "report gallery must support moving distributions to a separate section"
    for path in [
        "data/annotations/comind/21c13149_5_17.json",
    ]:
        assert (ROOT / path).exists(), f"missing synchronized annotation excerpt {path}"
    subprocess.run(["node", "--check", "data/catalog.js"], cwd=ROOT, check=True)
    subprocess.run(["node", "--check", "data/scenes.js"], cwd=ROOT, check=True)
    subprocess.run(["node", "--check", "data/scene-comparison.js"], cwd=ROOT, check=True)
    subprocess.run(["node", "--check", "gallery.js"], cwd=ROOT, check=True)
    subprocess.run(["node", "--check", "distribution.js"], cwd=ROOT, check=True)


def check_range_server() -> None:
    handler = functools.partial(RangeRequestHandler, directory=str(ROOT))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        connection = http.client.HTTPConnection("127.0.0.1", server.server_address[1])
        connection.request(
            "GET", "/assets/datasets/comind/leader.mp4", headers={"Range": "bytes=1000-1999"}
        )
        response = connection.getresponse()
        payload = response.read()
        assert response.status == 206
        assert response.getheader("Accept-Ranges") == "bytes"
        assert len(payload) == 1000
        connection.close()
    finally:
        server.shutdown()
        server.server_close()
        thread.join()


def main() -> None:
    records = catalog()
    scene_records = scenes()
    comparison = scene_comparison()
    check_catalog_and_manifests(records)
    check_scene_distributions(records, scene_records)
    check_scene_comparison(records, comparison)
    check_pages()
    check_range_server()
    print("OK: 20 catalog entries, scene/task comparison, lazy official-media fallback, and HTTP Range support")


if __name__ == "__main__":
    main()
