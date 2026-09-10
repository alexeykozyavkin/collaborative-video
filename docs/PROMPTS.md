# Collaborative Order — Reusable Prompts

These prompts capture the working approach that produced the final demo. They are written so another team member can reuse the archive with ChatGPT, Claude, Gemini, Qwen or another coding/reasoning model.

Replace repository paths, filenames or timing constraints only when the task really requires it.

---

## 1. Restore project context before making changes

```text
You are working on an archived HTML/JavaScript product-demo prototype called Collaborative Order.

Before changing anything, read:
- README.md
- docs/PROJECT.md
- docs/CONTEXT.md
- the current HTML/CSS/JS files used by the final v8 runtime

Important constraints:
- This is a deterministic 98-second browser animation, not a production application.
- The story is: fragmented print workflow → rewind → the same job as one shared Collaborative Order → customer edits controlled fields → exact Version 2 is confirmed → final employee check → print-ready output.
- Preserve the existing 98-second timeline unless I explicitly ask to change timing.
- Preserve the same fictional job, customer and artwork across both halves unless I explicitly ask for a different scenario.
- Do not replace readable UI with generated video or decorative mockups.
- Make the smallest safe change that solves the requested problem.

First tell me which files and timeline ranges are relevant. Then implement the change.
```

---

## 2. Make a visual or interaction change without breaking the timeline

```text
Modify the Collaborative Order browser demo to solve the issue below:

[DESCRIBE ISSUE]

Constraints:
- Keep total runtime exactly 98 seconds.
- Do not change unrelated scenes or timings.
- Keep the v8 load order intact:
  v8-wizard.js → v8.js → v8-polish.js → v8-editor.js → v8-interactions.js
- Preserve Action, Play, Pause, Restart, scrubber and keyboard controls.
- Preserve fullscreen 16:9 behavior.
- Preserve the old-way rewind and the exact Version 2 customer-confirmation story.
- Prefer a local override/fix in the latest layer instead of rewriting older historical layers unless the underlying architecture requires it.

After changing the code, explain exactly what caused the problem and which seconds of the animation I should review.
```

---

## 3. Diagnose a problem at a specific timestamp

```text
Review the Collaborative Order demo code around [TIME RANGE, e.g. 8–12 seconds].

I see this behavior:
[DESCRIBE WHAT IS VISIBLE]

Trace all code paths that can affect:
- scene visibility
- cursor/touch position
- class toggles
- animations/transitions
- z-index
- any later override files

Pay special attention to multiple layers writing to the same DOM element during the same animation frame.

Do not guess that it is browser lag until you have ruled out conflicting state updates in the timeline code.

Give me the root cause, then implement the smallest safe fix without changing the overall 98-second scenario.
```

This prompt is especially useful because two late bugs in the final demo were caused by multiple layers updating the same interaction state rather than by browser performance.

---

## 4. Check whether the script sounds native to print professionals

```text
Review this voice-over/script using a “print-industry insider vs outsider” test.

Target audience:
- commercial printers
- label and specialty print providers
- prepress / production teams
- people familiar with B2B print ordering and proof approval

For every phrase, ask whether a print professional would naturally say or immediately recognize it.

Prefer familiar language such as:
- print job
- specs
- artwork
- proof
- corrections / revisions
- prepress
- stock / substrate
- adhesive
- winding
- approval
- print-ready file / artwork
- ready for production

Flag SaaS/marketing language that sounds imported from software presentations, such as abstract architecture terminology or generic “single source of truth” wording, when a more concrete print-workflow phrase would be clearer.

Do not change the product story. Rewrite only the language that fails the insider test.

Script:
[PASTE SCRIPT]
```

---

## 5. Create or revise the English voice-over

```text
Create an English voice-over for the 98-second Collaborative Order demo.

Narrative:
1. A normal print job arrives.
2. Corrections create files and proofs until version/approval ambiguity becomes obvious.
3. Production is waiting.
4. Rewind.
5. The same job is recreated as one structured Collaborative Order.
6. Customer Emma opens the same order on mobile, edits only allowed text, saves Version 2 and confirms that exact proof.
7. Dana sees the same customer-approved Version 2, makes the final check and generates the print-ready file.
8. Close with: “Create. Customize. Confirm. Produce. One order. One shared workspace.”

Requirements:
- American English.
- Calm, confident B2B narration, not a radio-commercial voice.
- Use print-industry terminology, not generic SaaS jargon.
- Do not explain things that are already obvious on screen.
- Leave room for the UI to breathe.
- “Which version should I approve?” is a key dramatic line and should remain clear.
- The rewind should feel like a deliberate reset from confusion to clarity.
- If a line cannot fit naturally into its visual window, shorten the line instead of making the narrator unnaturally fast.

Return the script grouped by exact video time ranges.
```

---

## 6. ElevenLabs / fal.ai voice generation prompt

Model used during the project:

```text
fal-ai/elevenlabs/tts/eleven-v3
```

Working voice-direction prompt:

```text
Professional American English voiceover for a B2B software product demo.

Voice: male, approximately 35–50, natural American accent.
Tone: confident, calm, intelligent, conversational.
Style: modern technology documentary, not a commercial announcer.
Pacing: controlled and moderately brisk.

The first section should gradually build a sense of operational frustration as a simple print job turns into scattered files, proofs, revisions and approval ambiguity. Do not sound theatrical. Let the situation create the tension.

At the rewind, make a noticeable reset in energy.

From “With Collaborative Order...” onward, sound clearer, calmer and more assured. The contrast should feel like moving from a fragmented process to an organized workflow.

Emphasize naturally:
“Which version should I approve?”
“the same order”
“Version Two”
“the exact proof”
“One order. One shared workspace.”

Do not oversell. Do not use a radio-commercial voice. Use short natural pauses between ideas. The final line should feel concise and conclusive.
```

Recommended starting settings from the project:

```text
Voice: Brian
Stability: 0.50
Similarity Boost: 0.75
Speed: 1.00
Language Code: en
Apply Text Normalization: auto
Timestamps: ON
Output Format: mp3_44100_192
Streaming: OFF
```

When exact synchronization matters, generate shorter semantic sections rather than relying on one long take and forcing the entire narration to fit by changing speed.

---

## 7. Adapt the demo to another print product or customer

```text
Create a new scenario variant from the archived Collaborative Order demo.

New product/customer:
[DESCRIBE PRODUCT, CUSTOMER AND WORKFLOW]

Keep the core product hypothesis unchanged:
- one structured order
- one current design/version
- collaboration around that order
- controlled customer changes where appropriate
- explicit approval/confirmation of an exact version
- clear production hand-off

First map the current Willow & Co. roll-label scenario to the new job:
- customer
- product
- product-specific options
- likely revision request
- proof/prepress terminology
- what the customer should be allowed to edit
- what exact action constitutes approval
- what “ready for production” means for that product

Then identify which HTML, artwork and timeline elements must change. Preserve the narrative contrast and overall pacing unless there is a strong reason to redesign the scenario.
```

---

## 8. Prepare the demo for recording

```text
Audit the Collaborative Order demo for a clean 1920×1080 recording.

Check:
- exact 16:9 fullscreen positioning
- no clipping or unexpected letterboxing
- no stale controls after pressing Action
- cursor movement is smooth and points only at visible elements
- mobile touch indicators appear only at actual taps and disappear immediately afterwards
- readable UI at 1080p
- no broken product-preview or artwork assets
- the rewind restores state in a visually believable reverse order
- the packshot holds long enough to read

Do not make aesthetic redesigns unless they solve a visible recording problem. Return a timestamped QA list and fix only confirmed issues.
```

---

## 9. Produce a future archival handoff

```text
Prepare a durable handoff of this demo for another team member who did not participate in the original work.

The archive must let them answer four questions without asking the original author:
1. What problem was this demo built to test?
2. What exactly happens in the scenario and why?
3. Which files make the final runtime work and how do I run it locally?
4. How can I safely create the next version without accidentally breaking the existing narrative/timeline?

Preserve:
- source code
- artwork assets
- final video and audio exports
- voice-over text/settings
- project context
- exact timeline
- reusable AI prompts
- local-run instructions

Clearly distinguish experimental product assumptions from implemented product functionality.
```
