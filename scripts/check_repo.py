#!/usr/bin/env python3
"""Offline smoke checks for a fresh clone of the ego sample gallery."""

from __future__ import annotations

import functools
import http.client
import json
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


def check_pages() -> None:
    report = (ROOT / "report.html").read_text(encoding="utf-8")
    index = (ROOT / "index.html").read_text(encoding="utf-8")
    assert "base64," not in report and "base64," not in index, "base64 media was reintroduced"
    assert 'id="sampleGrid"' in report and 'sample-grid legacy-samples' in report
    facts = PageFacts()
    facts.feed(report)
    gallery = [x for x in facts.iframes if x.get("class") == "sample-gallery-frame"]
    assert len(gallery) == 1, "report must contain exactly one gallery iframe"
    assert gallery[0].get("src") == "index.html?embed=1&viewer=annotation-sync-v4#gallery"
    assert 'src="gallery.js?v=annotation-sync-v4"' in index, "versioned gallery application script is missing"
    assert 'src="data/catalog.js?v=annotation-sync-v4"' in index, "versioned catalog script is missing"
    gallery_js = (ROOT / "gallery.js").read_text(encoding="utf-8")
    assert "function mediaCandidates" in gallery_js, "official-media fallback is missing"
    assert "官方源直连" in gallery_js, "direct official-source state is missing"
    assert "IntersectionObserver" in gallery_js, "remote media must remain lazy-loaded"
    for path in [
        "data/annotations/comind/21c13149_5_17.json",
    ]:
        assert (ROOT / path).exists(), f"missing synchronized annotation excerpt {path}"
    subprocess.run(["node", "--check", "data/catalog.js"], cwd=ROOT, check=True)
    subprocess.run(["node", "--check", "gallery.js"], cwd=ROOT, check=True)


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
    check_catalog_and_manifests(records)
    check_pages()
    check_range_server()
    print("OK: 20 catalog entries, 20 manifests, lazy official-media fallback, and HTTP Range support")


if __name__ == "__main__":
    main()
