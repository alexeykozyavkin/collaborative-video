# Media Archive

This folder is reserved for the final rendered media associated with the archived Collaborative Order demo.

Expected durable filenames:

```text
collaborative-order-final.mp4
collaborative-order-voiceover-final.mp3
```

Optional additional source files:

```text
collaborative-order-voiceover-raw.mp3
collaborative-order-voiceover-timestamps.json
```

## What should be preserved

### Final video

The mastered screen recording with the final voice-over mix. The browser animation itself is 98 seconds and was recorded in a 16:9 frame.

### Final voice-over

The exact audio used in the mastered video, not merely a regenerated ElevenLabs take.

### Raw voice-over / timestamps

Useful but optional. If preserved, they make later re-editing or re-synchronization much easier.

## Current archive state

The source code, project context, script and TTS settings are already preserved in this branch.

The actual mastered MP4 and MP3 need to be added from the editor/export files used for the final video. They are not reproducible byte-for-byte from the repository because the final audio/video alignment was completed outside the browser prototype.

## File-size note

GitHub rejects normal repository files above its hard per-file size limit. If the final MP4 is too large for a normal commit:

1. use Git LFS if it is enabled for this repository; or
2. put the media in durable company storage and add the permanent internal link here.

Do not rely on a temporary fal.ai output URL as the long-term archive location.
