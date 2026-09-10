# Collaborative Order — Final Artifact Manifest

## Archive identity

- Archive branch: `archive/collaborative-order-final-2026-09-10`
- Created from final `main` state after the interaction polish deployment
- Base source commit: `f4d6a5519e0ed857eeaf598ea6d276a2dca60211`
- Browser animation runtime: 98 seconds

## Final browser-demo source

The ready-to-run local entrypoint is:

```text
final.html
```

It loads the final v8 runtime directly and includes the local product-preview fallback.

The underlying final runtime files are:

```text
index.html
v5.css
v7.css
v8.css
v8-wizard.js
v8.js
v8-polish.js
v8-editor.js
v8-interactions.js
```

The raw historical `index.html` is intentionally preserved because it is also the source used by the GitHub Pages deployment workflow. GitHub Pages transforms its v7 references into the final v8 stack at deploy time.

For ordinary local playback, open `final.html`. The helper scripts `tools/run-local.ps1` and `tools/run-local.sh` are also preserved to reproduce the deployment-style transformation from `index.html` into `.local-index.html`.

## Artwork used by the scenario

```text
assets/willow-label-v1.svg
assets/willow-label-v2.svg
assets/willow-label-v2-exact.svg
```

Version 2 is the exact customer-edited artwork used after Emma changes the product name and claim.

## Product catalog preview sources

```text
assets/product-previews-src/roll-label.svg
assets/product-previews-src/wraparound-label.svg
assets/product-previews-src/business-card.svg
assets/product-previews-src/flyer.svg
assets/product-previews-src/folding-carton-sleeve.svg
assets/product-previews-src/roll-up-banner.svg
```

The deployed GitHub Pages build rasterizes these into 900×525 PNGs. Local playback uses the SVG sources directly through `tools/local-preview-fallback.js`.

## Documentation added for preservation

```text
README.md
docs/PROJECT.md
docs/CONTEXT.md
docs/VOICEOVER-FINAL.md
docs/PROMPTS.md
docs/ASSET-MANIFEST.md
media/README.md
```

## Local-run helpers

```text
tools/run-local.ps1
tools/run-local.sh
tools/local-preview-fallback.js
```

## Media to preserve

Expected final files:

```text
media/collaborative-order-final.mp4
media/collaborative-order-voiceover-final.mp3
```

Optional but useful:

```text
media/collaborative-order-voiceover-raw.mp3
media/collaborative-order-voiceover-timestamps.json
```

The mastered MP4 and MP3 are external edit/export artifacts and must be added from the files used for the final video. The browser source alone cannot reproduce their exact byte-level edit/mix.

## Historical files

The branch was created from the working repository and therefore also contains earlier experimental scripts, CSS files, patches and repair fragments. They are **not** part of the final runtime unless explicitly listed above. Keep them only as development history; use this manifest when deciding what belongs to the final demo.
