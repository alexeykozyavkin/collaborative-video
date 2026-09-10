#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE="$REPO_DIR/index.html"
OUTPUT="$REPO_DIR/.local-index.html"

python3 - "$SOURCE" "$OUTPUT" <<'PY'
from pathlib import Path
import sys

source = Path(sys.argv[1])
output = Path(sys.argv[2])
html = source.read_text(encoding='utf-8')
html = html.replace('./v7.css', './v8.css')
html = html.replace('Video Prototype v7', 'Video Prototype v8 — Archived Final')
old = '<script src="./v7.js"></script>'
new = '''<script src="./v8-wizard.js"></script>
<script src="./v8.js"></script>
<script src="./v8-polish.js"></script>
<script src="./v8-editor.js"></script>
<script src="./v8-interactions.js"></script>
<script src="./tools/local-preview-fallback.js"></script>'''
if old not in html:
    raise SystemExit('Expected v7 script tag was not found in index.html. The archive source layout may have changed.')
output.write_text(html.replace(old, new), encoding='utf-8')
print(f'Built local archive entrypoint: {output}')
PY

if command -v open >/dev/null 2>&1; then
  open "$OUTPUT"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$OUTPUT"
else
  echo "Open this file in a browser: $OUTPUT"
fi
