#!/usr/bin/env python3
"""Download official demo assets into a gitignored local cache.

This script never logs into gated datasets and never bypasses access controls.
It only follows the public URLs listed below after the user explicitly accepts
the source terms. Generated clips are for local inspection, not redistribution.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "local"
USER_AGENT = "ego-dataset-local-gallery/1.0 (research preview downloader)"

DATASETS = {
    "ropedia": {
        "license": "CC BY-NC 4.0; non-commercial use only.",
        "source": "https://huggingface.co/datasets/ropedia-ai/xperience-10m-sample/tree/main",
        "items": [
            {"kind": "video", "url": "https://huggingface.co/datasets/ropedia-ai/xperience-10m-sample/resolve/main/stereo_left.mp4", "out": "preview.mp4", "start": 20, "duration": 12},
            {"kind": "contact", "input": "preview.mp4", "out": "contact.webp"},
        ],
    },
    "ace-data-0": {
        "license": "ACE Research License; redistribution is prohibited. Local use only.",
        "source": "https://ace-data-engine.github.io/ACE-Data-0/#video-examples",
        "items": [
            {"kind": "video", "url": "https://ace-data-engine.github.io/ACE-Data-0/assets/videos/example1-rego-front-left.mp4", "out": "ego.mp4", "start": 4, "duration": 12},
            {"kind": "video", "url": "https://ace-data-engine.github.io/ACE-Data-0/assets/videos/example1-gopro-cam0.mp4", "out": "exo0.mp4", "start": 4, "duration": 12},
        ],
    },
    "ego-exo4d": {
        "license": "Ego-Exo4D license restrictions apply. Local preview only.",
        "source": "https://ego-exo4d-data.org/",
        "items": [
            {"kind": "video", "url": "https://ego-exo4d-data.org/assets/videos/bike_repair/aria.mp4", "out": "aria.mp4", "start": 4, "duration": 12},
            {"kind": "video", "url": "https://ego-exo4d-data.org/assets/videos/bike_repair/cam01.mp4", "out": "cam01.mp4", "start": 4, "duration": 12},
        ],
    },
    "adt": {
        "license": "Project Aria ADT License; local inspection only, no redistribution or public display.",
        "source": "https://facebookresearch.github.io/projectaria_tools/docs/open_datasets/aria_digital_twin_dataset/visualizers",
        "items": [
            {"kind": "file", "url": "https://facebookresearch.github.io/projectaria_tools/assets/images/rerun-adt-8f99fc7ab867aeb74af652b7dc49a61c.png", "out": "viewer.png"},
            {"kind": "file", "url": "https://facebookresearch.github.io/projectaria_tools/assets/images/rerun-adt-time-window-e461b5593e86b60f79aacbdb82a7cd2d.png", "out": "timeline.png"},
        ],
    },
    "egohtr": {
        "license": "No dataset/media redistribution license found. Local cache only.",
        "source": "https://egohtr.github.io/",
        "items": [
            {"kind": "video", "url": "https://egohtr.github.io/assets/explorer_modalities/all.mp4", "out": "modalities.mp4", "start": 2, "duration": 12},
            {"kind": "contact", "input": "modalities.mp4", "out": "contact.webp"},
        ],
    },
    "show3d": {
        "license": "CC BY-NC 4.0; non-commercial use only.",
        "source": "https://huggingface.co/datasets/facebook/show3d-dataset",
        "items": [
            {"kind": "video", "url": "https://huggingface.co/datasets/facebook/show3d-dataset/resolve/main/scenes/YZH016/balandabowl_scooping_0663/headset0.mp4", "out": "headset0.mp4", "start": 3, "duration": 12},
            {"kind": "video", "url": "https://huggingface.co/datasets/facebook/show3d-dataset/resolve/main/scenes/YZH016/balandabowl_scooping_0663/headset1.mp4", "out": "headset1.mp4", "start": 3, "duration": 12},
            {"kind": "file", "url": "https://huggingface.co/datasets/facebook/show3d-dataset/resolve/main/hand_pose/v2/scenes/YZH016/balandabowl_scooping_0663/hand_pose.json", "out": "annotations/hand_pose_v2.json"},
            {"kind": "show3d_overlay", "input": "annotations/hand_pose_v2.json", "out": "annotations/hand_overlay_compact.json"},
            {"kind": "file", "url": "https://huggingface.co/datasets/facebook/show3d-dataset/resolve/main/object_pose/v1/scenes/YZH016/balandabowl_scooping_0663/object_pose.json", "out": "annotations/object_pose.json"},
            {"kind": "file", "url": "https://huggingface.co/datasets/facebook/show3d-dataset/resolve/main/scenes/YZH016/balandabowl_scooping_0663/camera_calibration/headset0.json", "out": "annotations/headset0_calibration.json"},
            {"kind": "file", "url": "https://huggingface.co/datasets/facebook/show3d-dataset/resolve/main/scenes/YZH016/balandabowl_scooping_0663/camera_calibration/headset1.json", "out": "annotations/headset1_calibration.json"},
            {"kind": "file", "url": "https://huggingface.co/datasets/facebook/show3d-dataset/resolve/main/scenes/YZH016/balandabowl_scooping_0663/metadata/frame_info.json", "out": "annotations/frame_info.json"},
            {"kind": "file", "url": "https://huggingface.co/datasets/facebook/show3d-dataset/resolve/main/captions/v1/scenes/YZH016/balandabowl_scooping_0663/caption.json", "out": "annotations/caption.json"},
        ],
    },
    "assembly101": {
        "license": "CC BY-NC 4.0; non-commercial use only.",
        "source": "https://assembly-101.github.io/",
        "items": [
            {"kind": "video", "url": "https://drive.usercontent.google.com/download?id=12gg-hMcLGnPXPVzkvhRyud1nqOzQ2_UG&export=download&confirm=t", "out": "e1.mp4", "start": 3, "duration": 12},
            {"kind": "video", "url": "https://assembly-101.github.io/assets/12_view_assembly.mp4", "out": "montage.mp4", "start": 3, "duration": 12},
        ],
    },
    "hd-epic": {
        "license": "Treated conservatively as CC BY-NC 4.0; source metadata conflicts.",
        "source": "https://hd-epic.github.io/site/",
        "items": [
            {"kind": "video", "url": "https://data.bris.ac.uk/datasets/3cqb5b81wk2dc2379fx1mrxh47/Videos/P01/P01-20240202-110250.mp4", "out": "p01_134_153.mp4", "start": 134, "duration": 19},
        ],
    },
    "open-aoe": {
        "license": "Dataset license is listed as 'other'; local cache only.",
        "source": "https://huggingface.co/datasets/inclusionAI/OpenAoE-2000h",
        "items": [
            {"kind": "video", "url": "https://huggingface.co/datasets/inclusionAI/OpenAoE-2000h/resolve/c363c7866816505c697b9a7ab76341eb2773716b/aoe_20260214_233341_p000/raw_video.mp4", "out": "raw.mp4", "start": 3, "duration": 12},
            {"kind": "video", "url": "https://huggingface.co/datasets/inclusionAI/OpenAoE-2000h/resolve/c363c7866816505c697b9a7ab76341eb2773716b/aoe_20260214_233341_p000/ego_process/ego_hands_reconstruction/visualization/hands_combined.mp4", "out": "hands.mp4", "start": 3, "duration": 12},
            {"kind": "file", "url": "https://huggingface.co/datasets/inclusionAI/OpenAoE-2000h/resolve/c363c7866816505c697b9a7ab76341eb2773716b/aoe_20260214_233341_p000/ego_annotation/ego_action_annotation.json", "out": "annotations/ego_action_annotation.json"},
        ],
    },
    "humanego": {
        "license": "CC BY-NC 4.0 plus Project Aria terms; non-commercial use only.",
        "source": "https://huggingface.co/datasets/Leo-TX/HumanEgo",
        "items": [
            {"kind": "video", "url": "https://huggingface.co/datasets/Leo-TX/HumanEgo/resolve/main/serve_bread/aria/mps_serve_bread_000_vrs/preprocess/vis/aria_vis.mp4", "out": "aria_vis.mp4", "start": 2, "duration": 12},
            {"kind": "video", "url": "https://huggingface.co/datasets/Leo-TX/HumanEgo/resolve/main/serve_bread/aria/mps_serve_bread_000_vrs/preprocess/vis/visualkpts_vis.mp4", "out": "keypoints.mp4", "start": 2, "duration": 12},
            {"kind": "file", "url": "https://huggingface.co/datasets/Leo-TX/HumanEgo/resolve/f0aa87fade6a41316d65322512f56f066dec62e3/serve_bread/aria/mps_serve_bread_000_vrs/hand_tracking/hand_tracking_results.csv", "out": "annotations/hand_tracking_results.csv"},
            {"kind": "file", "url": "https://huggingface.co/datasets/Leo-TX/HumanEgo/resolve/f0aa87fade6a41316d65322512f56f066dec62e3/serve_bread/aria/mps_serve_bread_000_vrs/preprocess/aria_phases_results.json", "out": "annotations/aria_phases_results.json"},
            {"kind": "file", "url": "https://huggingface.co/datasets/Leo-TX/HumanEgo/resolve/f0aa87fade6a41316d65322512f56f066dec62e3/serve_bread/aria/mps_serve_bread_000_vrs/preprocess/cotracker_results.json", "out": "annotations/cotracker_results.json"},
            {"kind": "file", "url": "https://huggingface.co/datasets/Leo-TX/HumanEgo/resolve/f0aa87fade6a41316d65322512f56f066dec62e3/serve_bread/aria/mps_serve_bread_000_vrs/preprocess/aria_cam_rgb_config.json", "out": "annotations/aria_cam_rgb_config.json"},
            {"kind": "file", "url": "https://huggingface.co/datasets/Leo-TX/HumanEgo/resolve/f0aa87fade6a41316d65322512f56f066dec62e3/serve_bread/aria/mps_serve_bread_000_vrs/preprocess/kptsselector_results.json", "out": "annotations/kptsselector_results.json"},
            {"kind": "file", "url": "https://huggingface.co/datasets/Leo-TX/HumanEgo/resolve/f0aa87fade6a41316d65322512f56f066dec62e3/serve_bread/aria/mps_serve_bread_000_vrs/preprocess/camtriangulator_results.json", "out": "annotations/camtriangulator_results.json"},
        ],
    },
    "egopat3d": {
        "license": "No media/data redistribution grant found; local cache only.",
        "source": "https://ai4ce.github.io/EgoPAT3D/index.html",
        "items": [
            {"kind": "video", "url": "https://ai4ce.github.io/EgoPAT3D/img/gif/1.gif", "out": "sequence1.mp4", "start": 0, "duration": 12},
        ],
    },
}


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def require_ffmpeg() -> str:
    binary = shutil.which("ffmpeg")
    if not binary:
        raise SystemExit("ffmpeg not found. macOS: brew install ffmpeg")
    return binary


def valid_video(path: Path) -> bool:
    probe = shutil.which("ffprobe")
    if not probe or not path.exists() or path.stat().st_size < 4096:
        return False
    result = subprocess.run(
        [probe, "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=codec_name,pix_fmt,width,height,r_frame_rate:format=duration", "-of", "json", str(path)],
        check=False, capture_output=True, text=True,
    )
    if result.returncode:
        return False
    try:
        payload = json.loads(result.stdout)
        stream = payload["streams"][0]
        duration = float(payload["format"]["duration"])
        numerator, denominator = stream["r_frame_rate"].split("/", 1)
        frame_rate = float(numerator) / float(denominator)
        return (
            stream.get("codec_name") == "h264"
            and stream.get("pix_fmt") == "yuv420p"
            and max(int(stream["width"]), int(stream["height"])) <= 720
            and abs(frame_rate - 30.0) < 0.05
            and duration > 0.5
        )
    except (KeyError, IndexError, TypeError, ValueError, json.JSONDecodeError):
        return False


def valid_file(path: Path, expected_suffix: str | None = None) -> bool:
    if not path.exists() or path.stat().st_size < 32:
        return False
    if (expected_suffix or path.suffix).lower() == ".json":
        try:
            json.loads(path.read_text(encoding="utf-8"))
        except (OSError, UnicodeDecodeError, json.JSONDecodeError):
            return False
    return True


def transcode(ffmpeg: str, item: dict, target: Path, force: bool) -> None:
    if target.exists() and not force and valid_video(target):
        print(f"  exists  {target.relative_to(ROOT)}")
        return
    if target.exists() and not force:
        print(f"  stale   {target.relative_to(ROOT)} (rebuilding incompatible cache)")
    target.parent.mkdir(parents=True, exist_ok=True)
    tmp = target.with_suffix(".partial.mp4")
    cmd = [
        ffmpeg, "-hide_banner", "-loglevel", "warning", "-y",
        "-rw_timeout", "30000000", "-user_agent", USER_AGENT,
        "-ss", str(item.get("start", 0)), "-i", item["url"],
        "-t", str(item.get("duration", 12)), "-an",
        "-vf", "scale=720:720:force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30",
        "-c:v", "libx264", "-preset", "medium", "-crf", "25",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(tmp),
    ]
    print(f"  video   {target.relative_to(ROOT)}")
    last_error = None
    for attempt in range(1, 4):
        try:
            tmp.unlink(missing_ok=True)
            subprocess.run(cmd, check=True)
            if not valid_video(tmp):
                raise RuntimeError("transcoded output failed H.264/yuv420p/size validation")
            tmp.replace(target)
            return
        except (OSError, subprocess.CalledProcessError, RuntimeError) as exc:
            last_error = exc
            tmp.unlink(missing_ok=True)
            if attempt < 3:
                print(f"    retry {attempt}/2 after video error: {exc}")
                time.sleep(attempt)
    raise RuntimeError(f"video failed after 3 attempts: {last_error}")


def download(item: dict, target: Path, force: bool) -> None:
    if target.exists() and not force and valid_file(target):
        print(f"  exists  {target.relative_to(ROOT)}")
        return
    if target.exists() and not force:
        print(f"  stale   {target.relative_to(ROOT)} (re-downloading invalid cache)")
    target.parent.mkdir(parents=True, exist_ok=True)
    tmp = target.with_suffix(target.suffix + ".partial")
    req = urllib.request.Request(item["url"], headers={"User-Agent": USER_AGENT})
    print(f"  file    {target.relative_to(ROOT)}")
    last_error = None
    for attempt in range(1, 4):
        try:
            tmp.unlink(missing_ok=True)
            with urllib.request.urlopen(req, timeout=90) as src, tmp.open("wb") as dst:
                shutil.copyfileobj(src, dst)
            if not valid_file(tmp, target.suffix):
                raise RuntimeError("downloaded file failed size/JSON validation")
            tmp.replace(target)
            return
        except (OSError, urllib.error.URLError, RuntimeError) as exc:
            last_error = exc
            tmp.unlink(missing_ok=True)
            if attempt < 3:
                print(f"    retry {attempt}/2 after download error: {exc}")
                time.sleep(attempt)
    raise RuntimeError(f"download failed after 3 attempts: {last_error}")


def make_contact(ffmpeg: str, item: dict, dataset_dir: Path, target: Path, force: bool) -> None:
    if target.exists() and not force:
        print(f"  exists  {target.relative_to(ROOT)}")
        return
    source = dataset_dir / item["input"]
    if not source.exists():
        raise SystemExit(f"Cannot build {target.name}: missing {source.relative_to(ROOT)}")
    target.parent.mkdir(parents=True, exist_ok=True)
    tmp = target.with_suffix(".partial.webp")
    cmd = [
        ffmpeg, "-hide_banner", "-loglevel", "warning", "-y", "-i", str(source),
        "-vf", "fps=1/3,scale=320:-2,tile=2x2:padding=4:margin=4", "-frames:v", "1", str(tmp),
    ]
    print(f"  contact {target.relative_to(ROOT)}")
    subprocess.run(cmd, check=True)
    tmp.replace(target)


def make_show3d_overlay(item: dict, dataset_dir: Path, target: Path, force: bool) -> None:
    if target.exists() and not force and valid_file(target):
        print(f"  exists  {target.relative_to(ROOT)}")
        return
    if target.exists() and not force:
        print(f"  stale   {target.relative_to(ROOT)} (rebuilding invalid overlay)")
    source = dataset_dir / item["input"]
    if not source.exists():
        raise RuntimeError(f"Cannot build {target.name}: missing {source.relative_to(ROOT)}")
    print(f"  derive  {target.relative_to(ROOT)}")
    raw = json.loads(source.read_text(encoding="utf-8"))
    numeric_keys = [int(key) for key in raw if str(key).isdigit()]
    if not numeric_keys:
        raise RuntimeError("SHOW3D hand-pose JSON contains no numeric frame keys")
    frames = []
    for index in range(max(numeric_keys) + 1):
        record = raw.get(str(index), {})
        hands = record.get("hand_poses") or {}
        frame = {}
        for side, short in (("0", "left"), ("1", "right")):
            hand = hands.get(side) or {}
            points = (hand.get("landmarks_2d") or {})
            if float(hand.get("confidence") or 0) <= 0.5:
                continue
            cameras = {}
            for camera in ("headset0", "headset1"):
                camera_points = points.get(camera)
                if isinstance(camera_points, list) and any(p is not None for p in camera_points):
                    cameras[camera] = camera_points
            if cameras:
                frame[short] = cameras
        frames.append(frame)
    payload = {
        "schema": "show3d-hand-overlay-1",
        "source": "official SHOW3D hand-pose v2",
        "fps": 60,
        "frame_count": len(frames),
        "confidence_threshold": 0.5,
        "image_size": [1024, 1280],
        "frames": frames,
    }
    target.parent.mkdir(parents=True, exist_ok=True)
    tmp = target.with_suffix(target.suffix + ".partial")
    tmp.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    tmp.replace(target)


def process(slug: str, force: bool) -> None:
    spec = DATASETS[slug]
    print(f"\n[{slug}] {spec['license']}")
    ffmpeg = require_ffmpeg() if any(i["kind"] in {"video", "contact"} for i in spec["items"]) else ""
    completed = []
    for item in spec["items"]:
        target = OUT / slug / item["out"]
        if item["kind"] == "video":
            transcode(ffmpeg, item, target, force)
        elif item["kind"] == "contact":
            make_contact(ffmpeg, item, OUT / slug, target, force)
        elif item["kind"] == "show3d_overlay":
            make_show3d_overlay(item, OUT / slug, target, force)
        else:
            download(item, target, force)
        if target.exists():
            completed.append({
                "path": str(target.relative_to(ROOT)),
                "sha256": sha256(target),
                "source": item.get("url") or f"derived from {item['input']}",
            })
    provenance = {
        "dataset": slug,
        "source_page": spec["source"],
        "license_notice": spec["license"],
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "files": completed,
        "note": "Local cache generated from official URLs; do not commit or redistribute without checking source terms.",
    }
    target = OUT / slug / ".provenance.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    group = p.add_mutually_exclusive_group(required=True)
    group.add_argument("--dataset", choices=sorted(DATASETS))
    group.add_argument("--all", action="store_true")
    group.add_argument("--list", action="store_true")
    p.add_argument("--accept-source-terms", action="store_true", help="Confirm you reviewed each official source and will use local copies under its terms.")
    p.add_argument("--force", action="store_true")
    args = p.parse_args()
    if args.list:
        for slug, spec in DATASETS.items():
            print(f"{slug:14} {spec['license']}")
        return
    if not args.accept_source_terms:
        raise SystemExit("Refusing to download until --accept-source-terms is supplied. Review THIRD_PARTY_ASSETS.md first.")
    selected = list(DATASETS) if args.all else [args.dataset]
    failures = []
    for slug in selected:
        try:
            process(slug, args.force)
        except (OSError, RuntimeError, subprocess.CalledProcessError, json.JSONDecodeError) as exc:
            failures.append((slug, str(exc)))
            print(f"\n[{slug}] FAILED: {exc}", file=sys.stderr)
            if not args.all:
                break
    succeeded = len(selected) - len(failures)
    print(f"\nFinished: {succeeded}/{len(selected)} datasets ready.")
    if failures:
        print("Failures:", file=sys.stderr)
        for slug, error in failures:
            print(f"  - {slug}: {error}", file=sys.stderr)
        raise SystemExit(1)
    print("Run: python3 scripts/serve.py")


if __name__ == "__main__":
    main()
