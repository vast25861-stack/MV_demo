# AGENTS.md

## Project

Standalone HTML/JS demo: **Boiler Safety Monitor**. Simulated video surveillance with scenario-based event playback. Russian UI.

## Run

```
python server.py
```

Opens `http://localhost:8080`. Server supports Range requests for video seeking.

## Structure

- `index.html` — single-page UI (Bootstrap 5)
- `js/scenarios.js` — scenario events/messages config (edit this to change demos)
- `js/app.js` — app logic: event simulation, video control, UI
- `css/style.css` — custom styles
- `lib/` — vendored Bootstrap 5 + Bootstrap Icons (no npm, no build)
- `video/` — demo video files (`.webm`, `.mkv`)

## Key Facts

- No build step, no package manager, no tests, no linting.
- Two scenarios in `js/scenarios.js` `SCENARIOS` object: `ocr` (text recognition), `diameter` (diameter measurement).
- Events/messages are hardcoded in `js/scenarios.js` (no backend API). Stats are randomized.
- `server.py` is a minimal Python stdlib HTTP server — no dependencies.
- Video files in `video/` are referenced by scenario config: `ocr.webm`, `diameter.webm`.
