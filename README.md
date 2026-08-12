# React / Remotion assessment recreation

This project recreates the uploaded Pinterest reference as a 36-second 16:9 Remotion composition, including the synchronized narration/audio track.

## Important

The uploaded file was a browser screen recording. I isolated the embedded 36-second video during analysis and based the implementation on that content rather than reproducing the browser chrome.

## Audio

`public/voiceover.m4a` is the 36-second narration/audio segment aligned to the recreated video. The first 4 seconds and final browser-recording tail were excluded so the audio starts at the same point as the embedded reference video.

## Setup

```bash
npm install
npm run dev
```

Open the `ProductLaunch` composition in Remotion Studio.

Render:

```bash
npm run render
```

The output will be:

```text
out/product-launch.mp4
```

## Scene timing

- 00.0–04.0 — `operations`
- 04.0–08.0 — `agentic AI copilots`
- 08.0–10.7 — nested-frame / tunnel transition
- 10.7–12.7 — Stanley entrance
- 12.7–22.2 — Stanley feature map
- 22.1–24.0 — Stanley → Marie transition
- 24.0–35.7 — Marie feature map
- 35.7–36.0 — final fade

## Engineering choices

- React + TypeScript only for the visual system.
- Frame-driven animation with `useCurrentFrame()`.
- Reusable `FeatureNode`, `FeatureScene`, `CopilotCircle`, icon and background components.
- SVG line icons are generated locally, so there are no external image dependencies.
- The design uses CSS gradients, SVG paths, transforms, opacity and easing rather than embedding the reference video.
