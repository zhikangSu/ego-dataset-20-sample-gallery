#!/usr/bin/env python3
"""Serve the gallery locally with HTTP byte-range support for smooth seeking."""

from __future__ import annotations

import argparse
import os
import re
import shutil
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RANGE_RE = re.compile(r"bytes=(\d*)-(\d*)$")


class RangeRequestHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    _byte_range: tuple[int, int] | None = None

    def end_headers(self) -> None:
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def send_head(self):
        self._byte_range = None
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        try:
            source = open(path, "rb")
        except OSError:
            self.send_error(HTTPStatus.NOT_FOUND, "File not found")
            return None

        stat = os.fstat(source.fileno())
        size = stat.st_size
        header = self.headers.get("Range")
        if not header:
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", self.guess_type(path))
            self.send_header("Content-Length", str(size))
            self.send_header("Last-Modified", self.date_time_string(stat.st_mtime))
            self.end_headers()
            return source

        match = RANGE_RE.fullmatch(header.strip())
        if not match or size == 0:
            source.close()
            self.send_error(HTTPStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
            return None

        first, last = match.groups()
        if first:
            start = int(first)
            end = int(last) if last else size - 1
        elif last:
            length = min(int(last), size)
            start, end = size - length, size - 1
        else:
            source.close()
            self.send_error(HTTPStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
            return None

        if start >= size or start > end:
            source.close()
            self.send_response(HTTPStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
            self.send_header("Content-Range", f"bytes */{size}")
            self.end_headers()
            return None

        end = min(end, size - 1)
        self._byte_range = (start, end)
        self.send_response(HTTPStatus.PARTIAL_CONTENT)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Last-Modified", self.date_time_string(stat.st_mtime))
        self.end_headers()
        return source

    def copyfile(self, source, outputfile) -> None:
        if self._byte_range is None:
            shutil.copyfileobj(source, outputfile)
            return
        start, end = self._byte_range
        source.seek(start)
        remaining = end - start + 1
        while remaining:
            chunk = source.read(min(64 * 1024, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--bind", default="127.0.0.1")
    args = parser.parse_args()
    handler = lambda *a, **kw: RangeRequestHandler(*a, directory=str(ROOT), **kw)
    server = ThreadingHTTPServer((args.bind, args.port), handler)
    print(f"Serving {ROOT} at http://{args.bind}:{args.port}/")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
