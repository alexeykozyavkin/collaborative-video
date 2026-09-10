# Collaborative Order — Final Demo Archive

This branch is a preservation snapshot of the final **Collaborative Order** product-demo prototype prepared in September 2026.

**Archive branch:** `archive/collaborative-order-final-2026-09-10`  
**Runtime:** 98 seconds  
**Format:** deterministic HTML/CSS/JavaScript browser animation  
**Status:** customer-development / exhibition prototype, not a production implementation.

## What this archive contains

The branch preserves the final browser demo and the context needed to understand or continue it later:

- the final HTML/CSS/JavaScript source and artwork assets;
- the exact 98-second timeline used for the recorded demo;
- the restored **Action** control for recording;
- the final cursor, fullscreen and mobile-touch fixes;
- project goals, narrative and technical context in `docs/PROJECT.md` and `docs/CONTEXT.md`;
- the final voice-over source text and ElevenLabs setup in `docs/VOICEOVER-FINAL.md`;
- reusable prompts for future AI-assisted work in `docs/PROMPTS.md`;
- local-run helpers in `tools/`;
- a `media/` folder reserved for the mastered video and audio exports.

## Run locally

The deployed GitHub Pages version is assembled from several source files by the Pages workflow. For a local reproduction, use one of the helper scripts:

### Windows

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\run-local.ps1
```

### macOS / Linux

```bash
bash ./tools/run-local.sh
```

The helper builds `.local-index.html` with the same v8 script stack used by the final deployed demo and opens it in the default browser. Product-preview PNGs created by GitHub Actions are replaced locally with their source SVG equivalents, so no build dependencies are required.

The demo can also be served with any static HTTP server after generating `.local-index.html`.

## Recording controls

- **Action**: restart at 0:00, hide controls, play.
- **Space**: play / pause.
- **R**: restart.
- **H**: show / hide controls.
- **Left / Right Arrow**: jump 5 seconds while reviewing.

For capture, use a 16:9 viewport, ideally 1920×1080, and fullscreen mode. The exact-16:9 positioning bug is fixed in `v8.css`.

## Final runtime stack

The archive intentionally keeps the layered source used for the final result:

- `v5.css` — base visual system and scene layout;
- `v7.css` — scene transitions, pointer and mobile foundations;
- `v8.css` — final wizard styling, orange actions and fullscreen fixes;
- `v8-wizard.js` — four-step order-creation flow;
- `v8.js` — master 98-second state/timeline controller;
- `v8-polish.js` — old-way escalation, proof/version stack and packshot polish;
- `v8-editor.js` — editable mobile label reconstruction;
- `v8-interactions.js` — Action button, cursor fix and natural mobile taps.

Do not remove an earlier layer just because a later file looks self-contained; the final demo depends on this composition.

## Media

The source code and documentation are archived now. The mastered video and mastered audio are intentionally expected in `media/` as:

- `collaborative-order-final.mp4`
- `collaborative-order-voiceover-final.mp3`

See `media/README.md` for details. If the MP4 exceeds GitHub's normal file-size limit, store it with Git LFS or in the company's durable media storage and keep the permanent link in `media/README.md`.

## Important preservation note

This branch is an archive. Future experiments should normally start from a new branch rather than rewriting this snapshot. The purpose is that another team member can return months later, understand why the demo exists, reproduce it, and use the prompts/context to create the next iteration.
