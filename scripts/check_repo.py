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


def scene_catalog() -> list[dict]:
    script = (
        "const fs=require('fs'),vm=require('vm'),c={window:{}};"
        "vm.runInNewContext(fs.readFileSync('data/catalog.js','utf8'),c);"
        "vm.runInNewContext(fs.readFileSync('data/scene-catalog.js','utf8'),c);"
        "process.stdout.write(JSON.stringify(c.window.EGO_SCENE_DATASETS));"
    )
    result = subprocess.run(
        ["node", "-e", script], cwd=ROOT, check=True, capture_output=True, text=True
    )
    return json.loads(result.stdout)


def scene_taxonomy() -> dict[str, object]:
    script = (
        "const fs=require('fs'),vm=require('vm'),c={window:{}};"
        "vm.runInNewContext(fs.readFileSync('data/scene-comparison.js','utf8'),c);"
        "process.stdout.write(JSON.stringify({taxonomy:c.window.EGO_SCENE_TAXONOMY,methods:c.window.EGO_SCENE_METHOD}));"
    )
    result = subprocess.run(
        ["node", "-e", script], cwd=ROOT, check=True, capture_output=True, text=True
    )
    return json.loads(result.stdout)


def comparison_additions() -> dict[str, object]:
    script = (
        "const fs=require('fs'),vm=require('vm'),c={window:{}};"
        "vm.runInNewContext(fs.readFileSync('data/comparison-additions.js','utf8'),c);"
        "process.stdout.write(JSON.stringify(c.window.EGO_COMPARISON_META));"
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
    assert len(records) == 39, f"expected 39 scene records, found {len(records)}"
    assert [r["no"] for r in records] == list(range(1, 40)), "scene indices are not 1..39"
    slugs = {record["slug"] for record in records}
    assert len(slugs) == 39, "scene catalog slugs must be unique"
    assert set(scene_records) == slugs, "scene distribution slugs must match all 39 datasets"
    assert sum(bool(record.get("hasSample")) for record in records) == 20, "scene catalog must preserve exactly 20 media peers"
    assert {record.get("releaseStatus") for record in records} <= {"open", "gated", "phased", "pending"}, "invalid release status"
    allowed = {"computed", "reported", "taxonomy", "unavailable"}
    availability = {"frequency", "proxy", "presence", "none"}
    for slug, scene in scene_records.items():
        assert scene.get("status") in allowed, f"invalid scene status for {slug}"
        assert scene.get("availability") in availability, f"invalid scene availability for {slug}"
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
        normalized = scene.get("normalized", [])
        categories = [item.get("category") for item in normalized]
        assert len(categories) == len(set(categories)), f"duplicate normalized scene category for {slug}"
        if scene["availability"] in {"frequency", "proxy"}:
            assert scene.get("denominator", {}).get("value", 0) > 0, f"missing scene denominator for {slug}"
            assert normalized and all(type(item.get("value")) in (int, float) for item in normalized), f"missing normalized values for {slug}"
            denominator = scene["denominator"]["value"]
            total = sum(item["value"] for item in normalized)
            assert math.isclose(total, denominator, rel_tol=1e-6, abs_tol=1e-6), f"normalized scene values do not sum to denominator for {slug}: {total} != {denominator}"
        if scene["availability"] == "presence":
            assert normalized and all(item.get("present") is True for item in normalized), f"invalid presence-only scenes for {slug}"


def check_scene_taxonomy(scene_meta: dict[str, object], scene_records: dict[str, dict]) -> None:
    taxonomy = scene_meta["taxonomy"]
    methods = scene_meta["methods"]
    assert len(taxonomy) == 15, f"expected 15 normalized scene categories, found {len(taxonomy)}"
    category_ids = {item["id"] for item in taxonomy}
    assert len(category_ids) == len(taxonomy), "normalized scene category ids must be unique"
    assert set(methods) == {"frequency", "proxy", "presence", "none"}, "scene method legend is incomplete"
    for slug, scene in scene_records.items():
        for item in scene.get("normalized", []):
            assert item["category"] in category_ids, f"unknown normalized category for {slug}: {item['category']}"


def check_comparison_additions(comparison: dict[str, object], scene_records: list[dict]) -> None:
    additions = comparison["additions"]
    assert len(additions) == 19, f"expected 19 comparison additions, found {len(additions)}"
    addition_slugs = {item["slug"] for item in additions}
    scene_addition_slugs = {item["slug"] for item in scene_records if not item.get("hasSample")}
    assert addition_slugs == scene_addition_slugs, "comparison additions must match the 19 expanded scene datasets"
    assert len(comparison["originalReleaseByName"]) == 20, "all original media peers need release status"
    assert set(comparison["releaseLabels"]) == {"open", "gated", "phased", "pending"}
    required = {
        "name", "year", "category", "scale", "task", "kind", "views", "sync", "calib",
        "sensors", "human", "objects", "scene", "access", "license", "evidence", "relevance",
        "releaseStatus", "source", "note", "feature_values"
    }
    for item in additions:
        assert required <= set(item), f"incomplete comparison row for {item.get('slug')}"
        assert item["evidence"] in {"A", "B"}, f"invalid evidence for {item['slug']}"
        assert item["releaseStatus"] in comparison["releaseLabels"], f"invalid release status for {item['slug']}"
        assert item["source"].startswith("https://"), f"unsafe comparison source for {item['slug']}"
        assert len(item["feature_values"]) == 9, f"comparison feature vector must have 9 fields for {item['slug']}"
        assert set(item["feature_values"]) <= {0, 1, 2}, f"invalid feature value for {item['slug']}"


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
    assert comparison[0].get("src") == "distribution.html?embed=1&viewer=scene-distribution-v3"
    assert 'src="gallery.js?v=scene-distribution-v2"' in index, "versioned gallery application script is missing"
    assert 'src="data/catalog.js?v=scene-distribution-v2"' in index, "versioned catalog script is missing"
    assert 'src="data/scenes.js?v=scene-distribution-v2"' in index, "scene distribution data script is missing"
    assert 'src="data/scene-catalog.js?v=scene-distribution-v3"' in distribution, "expanded scene catalog is missing"
    assert 'src="data/scene-comparison.js?v=scene-distribution-v3"' in distribution, "scene taxonomy script is missing"
    assert 'src="distribution.js?v=scene-distribution-v3"' in distribution, "scene distribution application script is missing"
    assert 'src="data/comparison-additions.js?v=comparison-v1"' in report, "39-item comparison data is missing"
    assert "39 个开放 / 重要 Ego 数据集：统一能力矩阵" in report, "expanded comparison matrix heading is missing"
    assert 'id="peerCohortFilter"' in report and 'id="peerReleaseFilter"' in report, "comparison filters are incomplete"
    assert "comparisonPeers.map" in report, "ability matrix must render all 39 comparison datasets"
    assert 'id="heatmapGrid"' in distribution and 'id="cardsGrid"' in distribution and 'id="boundaryList"' in distribution
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
    subprocess.run(["node", "--check", "data/scene-catalog.js"], cwd=ROOT, check=True)
    subprocess.run(["node", "--check", "data/scenes.js"], cwd=ROOT, check=True)
    subprocess.run(["node", "--check", "data/scene-comparison.js"], cwd=ROOT, check=True)
    subprocess.run(["node", "--check", "data/comparison-additions.js"], cwd=ROOT, check=True)
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
    scene_records_catalog = scene_catalog()
    scene_records = scenes()
    scene_meta = scene_taxonomy()
    comparison = comparison_additions()
    check_catalog_and_manifests(records)
    check_scene_distributions(scene_records_catalog, scene_records)
    check_scene_taxonomy(scene_meta, scene_records)
    check_comparison_additions(comparison, scene_records_catalog)
    check_pages()
    check_range_server()
    print("OK: 20 media entries, 39-item capability comparison, 39 concrete-scene records, release-state boundaries, lazy official-media fallback, and HTTP Range support")


if __name__ == "__main__":
    main()
