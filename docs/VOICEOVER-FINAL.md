# Collaborative Order — Final Voice-over Source

## Status

This document preserves the English narration text and ElevenLabs/fal.ai setup used during the final demo work.

The browser animation itself is **98 seconds**. The full raw ElevenLabs take returned during the project was approximately **106.322 seconds** according to the generated timestamps. The final video was then edited/aligned manually by the author.

For long-term preservation, store the actual mastered audio export in:

```text
media/collaborative-order-voiceover-final.mp3
```

and the mastered video in:

```text
media/collaborative-order-final.mp4
```

The media binaries are separate from this text source so the exact final edit can be preserved independently from the TTS generation input.

## TTS model

```text
fal-ai/elevenlabs/tts/eleven-v3
```

## Working settings

These were the recommended/tested starting settings for this project. If the final mastered take used a different voice or parameter, update this section when adding the final MP3.

```text
Voice: Brian
Stability: 0.50
Similarity Boost: 0.75
Speed: 1.00
Language Code: en
Apply Text Normalization: auto
Seed: not fixed
Timestamps: ON
Output Format: mp3_44100_192
Streaming: OFF
```

## Voice direction

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

## Final source text used for the full ElevenLabs take

```text
A typical print job starts simply.

A customer emails the specs, artwork, and logo.

Then the corrections begin.

One change creates a new file.
Another creates another version.

Prepress exports another proof.

Soon, more than one file looks current.

Then the customer asks:

Which version should I approve?

Production is waiting.
And even the approved artwork now has another version.

The problem isn't the artwork.

It's that the job details, proofs, and approval are all living in different places.

So... let's rewind.

[confident] With Collaborative Order, Dana starts the same job as one structured order.

She selects the customer and the product.

Size, stock, adhesive, winding, and quantity are captured as part of the job.

Dana checks the summary and creates the order as a draft.

Then she invites Emma to review it.

Emma gets one notification and opens the same order.

She sees the current proof together with the job specifications and due date.

Instead of emailing another correction, she changes the text she's allowed to edit directly.

Sourdough Boule.

No artificial flavors.

The artwork updates as she types.

Emma saves the revision.

Now it's Version Two.

And she confirms the exact proof she is looking at.

Back on Dana's side, that same Version Two is already current and customer-approved.

Dana performs the final check.

The print-ready file is generated.

The job is ready for production.

Create.
Customize.
Confirm.
Produce.

One order.
One shared workspace.
```

## Print-industry language decisions

The narration was deliberately adjusted to sound familiar to print professionals rather than like generic SaaS marketing.

Preferred wording in this project:

- `print job` instead of a generic workflow/request when referring to production work;
- `specs`;
- `artwork`;
- `proof`;
- `corrections` / `revision`;
- `prepress`;
- `stock`;
- `adhesive`;
- `winding`;
- `approved artwork`;
- `print-ready file`;
- `ready for production`.

The line “single source of truth” was intentionally replaced with the more concrete idea that the job details, proofs and approval are living in different places.

## Synchronization note

For future revisions, do not assume one long TTS take will naturally align to the 98-second animation. ElevenLabs pacing is not uniform across sentences.

A safer workflow is:

1. preserve the visual time ranges in `docs/CONTEXT.md`;
2. write narration for each semantic block;
3. generate shorter TTS sections;
4. align each section to its intended visual window;
5. shorten copy before applying aggressive speed changes.

This keeps the voice natural and avoids drifting away from key visual events such as the rewind, mobile edits and final confirmation.
