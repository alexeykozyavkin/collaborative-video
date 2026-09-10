# Collaborative Order — Context and Technical Notes

## Snapshot

This archive captures the final browser-demo state used for the September 2026 recording.

- Runtime: **98 seconds**
- Target frame: **16:9**, ideally 1920×1080
- Runtime model: deterministic HTML/CSS/JavaScript, no backend
- Base source snapshot: final `main` state after fullscreen, cursor, mobile-touch and Action-control fixes
- Recording flow: press **Action** to restart at 0:00, hide controls and play

## Why the code is layered

The final result was built incrementally. The archive intentionally preserves the working stack rather than collapsing it into a new rewrite.

### CSS

- `v5.css` — main desktop/browser/mobile visual system, scene layout, windows, portal shell and 16:9 scaling rules.
- `v7.css` — later scene transitions, pointer/touch foundations and mobile hand-off behavior.
- `v8.css` — final order-wizard styling, orange primary actions, layout fixes and exact-16:9 fullscreen correction.

`v8.css` imports `v7.css`, which imports the earlier base stylesheet. Do not remove those imports unless the styles are deliberately consolidated and visually regression-tested.

### JavaScript

- `v8-wizard.js` — replaces the simple create-order form with the four-step Customer → Product → Options → Summary wizard.
- `v8.js` — master 98-second timeline, scene switching, cursor targets, mobile states, typing animation and production states.
- `v8-polish.js` — final old-way escalation, notification stack, second proof window, file naming/timings, product-preview injection and packshot reveal.
- `v8-editor.js` — rebuilds the mobile label as real HTML text layered into the artwork so the copy visibly changes while Emma types.
- `v8-interactions.js` — restores the Action button, fixes the 8–12 second cursor conflict and replaces long-lived touch indicators with short natural taps.

Load order matters:

```text
v8-wizard.js
v8.js
v8-polish.js
v8-editor.js
v8-interactions.js
```

## GitHub Pages assembly

The source `index.html` in the development history still references the older v7 entrypoint. The Pages workflow transforms it during deployment by:

1. replacing `v7.css` with `v8.css`;
2. changing the page title from v7 to v8;
3. replacing the old `v7.js` script with the final v8 script stack above;
4. rasterizing product-preview SVGs into PNGs for the deployed page.

The local-run helpers in `tools/` reproduce the same entrypoint transformation and use source SVGs as a fallback for the product cards, so a local user does not need the GitHub Actions rasterization step.

## Exact scene boundaries

| Time | Scene |
| --- | --- |
| 0.0–37.0 | Old fragmented workflow on desktop |
| 37.0–56.0 | Dana creates the structured order |
| 56.0–57.0 | Seller → customer flip |
| 57.0–81.0 | Emma reviews and edits on mobile |
| 81.0–82.0 | Customer → seller flip |
| 82.0–94.0 | Dana finalizes and production output is prepared |
| 94.0–98.0 | Closing packshot |

## Old-way sequence

The final old-way sequence intentionally avoids a full Teams workspace and focuses on the combination of email, local files, proofs and app-style notifications.

Important timings:

- Outlook visible from about 1.5 s.
- File Explorer appears around 8 s.
- First PDF proof opens around 13 s.
- Emma's first correction appears at about 17.2 s.
- Version 2 appears at about 18.8 s.
- Second correction appears at about 20.5 s.
- Version 3 appears at about 21.8 s.
- Prepress message appears at about 24 s.
- Print-ready-for-approval file appears around 25.2 s.
- A second proof window appears around 25.45 s.
- “Which version should I approve?” appears around 27.8 s.
- `APPROVED` appears around 29 s.
- Production waiting appears around 30.8 s.
- `APPROVED_2` appears around 31.15 s.
- Rewind runs from 33–37 s and rolls the visible state back in reverse order.

### Cursor issue fixed near 11 seconds

Earlier, `v8.js` still targeted the hidden Teams window around 9–11.4 s while `v8-polish.js` redirected the visible story to File Explorer. Two cursor destinations were being applied in the same frame, producing a visible back-and-forth jump.

`v8-interactions.js` normalizes that interval to File Explorer, so the cursor now remains stable.

## Structured-order sequence

### 37–56 s: Dana

- Customer step
- Product step
- Options step
- Summary step
- Create as Draft
- Invite Emma

The wizard uses real print-oriented options for the roll-label example: size, stock, finish, adhesive, winding, core and quantity.

### 57–81 s: Emma on mobile

- Notification opens the same order.
- Version 1 is shown with job details.
- Emma opens the editor.
- Product name changes to `Sourdough Boule`.
- Claim changes to `No artificial flavors`.
- Artwork text updates during typing.
- Emma saves Version 2.
- Emma confirms the exact Version 2 shown on screen.

### Mobile touch behavior

The original touch indicator stayed visible for several seconds and its animation class was repeatedly toggled by the frame-by-frame timeline, which looked like a browser/rendering glitch.

The final behavior uses short tap windows centered on the actual interaction moments:

- notification: ~60.225 s
- Open in Editor: ~64.325 s
- product-name field: ~66.05 s
- claim field: ~70.15 s
- Save: ~75.225 s
- Confirm: ~78.225 s

Each tap is a brief contact + ripple, then disappears. There is no hovering finger marker between actions.

## 82–94 s: final seller state

- Current design is Version 2.
- Customer update is present in the order.
- History records Version 2 and customer confirmation.
- Dana gets one final confirmation action.
- Status becomes `Preparing print files`.
- Final status becomes `Ready for production`.

## Packshot

94–98 s reveals the final flow in sequence:

```text
Create → Customize → Confirm → Produce
```

Closing line:

```text
One order. One shared workspace.
```

## Fullscreen fix

At exactly 16:9, the inherited `max-aspect-ratio:16/9` and `min-aspect-ratio:16/9` media queries can both match. Previously, `left:50%` from one rule survived while the other rule changed the transform, shifting the entire stage half a screen to the right in F11.

The final `v8.css` explicitly resets both axes in each media rule, making fullscreen 16:9 stable.

## Demo controls

The development controls remain available for reviewing and recording:

- **Action**: restart → hide controls → play
- **Play**
- **Pause**
- **Restart**
- Scrubber
- `Space`: play/pause
- `R`: restart
- `H`: toggle controls
- Arrow keys: ±5 seconds

## Important preservation constraints

When changing this demo later:

1. Do not alter the 98-second timing unless the voice-over/video is deliberately being re-edited.
2. Do not remove the rewind; it is the narrative hinge that makes the before/after comparison work.
3. Keep the same order and artwork across both halves unless testing a different scenario intentionally.
4. Keep Version 2 confirmation tied to the exact design shown to the customer.
5. Prefer deterministic browser interactions over generated video for UI sections. Readable text and exact timing are more valuable than cinematic motion here.
6. Treat Meridian Print Services, Willow & Co. and the people in the demo as fictional scenario data.
