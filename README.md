# Collaborative Order — deterministic HTML video prototype

A static, deterministic browser “movie” for the Collaborative Order customer-development demo.

## Recording

Open `index.html` in a 16:9 browser viewport (ideally 1920×1080 / fullscreen) and record the browser source in OBS.

- `?controls=1` — show the hidden production HUD with timecode, scene name, VO line and seek bar.
- `?autoplay=0&controls=1` — open paused for inspection.
- `?start=34&autoplay=0&controls=1` — inspect a specific second of the timeline.
- Space — play/pause.
- `R` — restart.
- Left/right arrows — seek ±5s.

The recording view itself has no marketing captions. Voice-over cues are visible only in the production HUD.

## Story constraints

- Two active roles only: Seller / Operator Meridian and Customer.
- Seller side is desktop; Customer side is mobile.
- All artwork changes are made by the Customer in the mobile editor.
- Prepress can appear only in the old-way communication context.
- No automatic preflight flow is demonstrated.
- Artwork is raster (`assets/artwork/*.jpg`) rather than HTML-drawn label content.

## Current timeline

The current v5 cut is about 78 seconds. The old-way opening has been expanded to ~17 seconds so the setup and escalation remain readable before the rewind.
