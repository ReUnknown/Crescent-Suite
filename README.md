# Crescent Suite

An all-in-one productivity workspace built to keep the work in one calm, consistent place.

## Current release

**v0.1.22 — Navigation that tells the truth**

The first release establishes the Crescent product shell and a local-first suite experience:

- Home dashboard with app launcher, recent work, activity, and a daily focus rail
- Docs editor with local autosave, formatting controls, outline, and HTML export
- Sheets grid with editable cells, basic formulas, and CSV export
- Slides editor with slide management, themes, and presentation mode
- Notes, Tasks, Calendar, Drive, and Forms surfaces with working local interactions
- Shared navigation, command-style search, responsive layouts, and a night-sky design system
- Pages-ready workflow builds a visual preview on every `main` milestone and deploys when repository Pages is enabled
- Calendar events can be created, saved, reviewed, and removed in the local workspace
- Home reflects saved local calendar events, and Forms keeps its published/response state across navigation
- Global Search includes locally created tasks, Drive folders, and Calendar events with correct app routing
- Tasks now filters between All, Today, Open, and Done from the shared editor header
- Forms saves answer text with the response and restores it across navigation
- Slides saves speaker notes and keeps its page counter accurate after adding slides
- Drive’s Grid/List toggle now changes folders and recent files into a compact scan-friendly list
- Sheets’ Insights view summarizes totals, conversion, and visits by channel from the editable grid
- Forms has a true Preview/Edit toggle that centers the respondent experience and hides builder controls
- Shared workspace updates now keep a stable callback so app views do less unnecessary recomputation while searching and switching
- Pages deployment is gated until the repository explicitly enables Pages, while the preview artifact still builds on every milestone
- Calendar’s Day, Week, and Month controls now switch between real timeline and month-grid views
- Slides’ Big statement layout now changes the canvas, persists per slide, and remains available in presentation mode
- Starred, Shared with me, and Trash now show filtered or empty states instead of duplicating Recent files

Everything is stored in this browser under a versioned local workspace key. No external account connection is required for this release.

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL printed in the terminal.

## Progress

Milestones are intentionally published as small, reviewable steps so the product can be inspected visually over time.
