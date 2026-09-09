# Collaborative Order — deterministic HTML video prototype

A static browser “movie” for the Collaborative Order customer-development / exhibition demo.

## Recording

Use a 16:9 browser viewport, ideally 1920×1080 or fullscreen, and record the browser source in OBS.

- `?autoplay=1&controls=0` — clean recording mode.
- `?start=58&autoplay=0` — inspect a specific second of the timeline.
- Space — play/pause.
- `R` — restart.
- Left/right arrows — seek ±5 seconds.
- `H` — hide/show controls.

## Current v7 flow

- The old email / Teams / files workflow now starts slowly enough to read the initial request and then escalates into version chaos.
- The rewind visibly reverses the same story.
- Cursor position is calculated from the actual target element, with a normal pointer and visible click feedback.
- The customer hand-off starts with a phone notification. Mobile interactions use touch feedback instead of a mouse cursor.
- The customer edits `Sourdough Boule` and `No artificial flavors`; the fields and artwork update together before Version 2 is saved.
- `Create order` is anchored inside its panel instead of drifting outside the layout.

## Files

- `index.html` — current entry point
- `v7.js` — deterministic timeline
- `v7.css` — v7 interaction/layout overrides
- `v5.css` — shared base styling
- `assets/willow-label-v1.svg`, `assets/willow-label-v2.svg` — artwork states
