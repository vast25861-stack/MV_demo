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
- `js/scenarios.js` — scenario events/messages config + `CATEGORY_TOOLS` reference (edit this to change demos)
- `js/app.js` — app logic: event simulation, video control, UI
- `js/reports.js` — mock report data + charts (Chart.js via CDN)
- `css/style.css` — custom styles
- `lib/` — vendored Bootstrap 5 + Bootstrap Icons (no npm, no build)
- `video/` — demo video files (`.webm`, `.mp4`)

## Key Facts

- No build step, no package manager, no tests, no linting.
- Three scenarios in `js/scenarios.js` `SCENARIOS`: `ocr` (category 3 «Распознавание»),
  `diameter` (category 1 «Измерение»), `registered` (category 2 «Подсчёт»).
- Each scenario carries `category`, `categoryName`, `currentTool`, `categoryTools`;
  the sidebar block «Возможности категории» lists the other tools of that category.
- Hover hints in that block come from `TOOL_DESCRIPTIONS` / `CATEGORY_DESCRIPTIONS`
  in `js/scenarios.js` (source: `Category Tools.xlsx`, currently only category 3 is filled);
  they are Bootstrap tooltips, so `renderCategoryTools()` disposes and re-inits them on every re-render.
- There are **no** Start/Pause/Stop controls and **no** stats tiles — video autoplays
  on load and after `applyScenario()` (muted, `loadedmetadata` → `play()`).
- Events/messages are hardcoded in `js/scenarios.js` (no backend API).
- `server.py` is a minimal Python stdlib HTTP server — no dependencies.
- Video files in `video/` are referenced by scenario config: `ocr.webm`, `diameter.webm`, `Registered.webm`.