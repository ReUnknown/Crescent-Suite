# Changelog

## v0.1.4 — Local Drive

Published September 8, 2026.

### Added

- Drive can now create a local folder with a name and immediately render it in the workspace.
- Drive's New file action opens Docs with a clear next-step message for starting a draft.
- A Drive preview screenshot is included with the GitHub progress evidence.

### Verification

- Folder creation and New file navigation passed in Playwright.
- Production build passes after the Drive pass.

## v0.1.3 — Responsive feedback

Published September 8, 2026.

### Added

- Shared Crescent toast feedback for local-first actions that need a clear next step.
- Share, Calendar event, and Drive creation controls no longer fail silently.
- The feedback layer respects the same night-sky surface and status colors as the rest of the suite.

### Verification

- Production build passes.
- Share and Calendar action feedback verified in the rendered app.
- GitHub CI is configured to build every push to `main`.

## v0.1.2 — Editor direction

Published September 8, 2026.

### Added

- A full Docs editor concept reference and matching implementation preview.
- Visual evidence for Home, Docs, Sheets, and mobile Home in `docs/preview/`.

### Verification

- Docs editor renders the title, outline, North star, Three moves, quote, and local save state.
- The implementation was visually reviewed against the editor concept for chrome, spacing, paper contrast, typography, and inspector structure.

## v0.1.1 — A little more light

Published September 8, 2026.

### Added

- Keyboard shortcut support for `Command/Ctrl + K` to focus global search.
- Accessible presentation-mode close control.
- Crescent favicon and installable web manifest metadata.

### Verification

- Production build passes after the polish pass.
- Command palette shortcut and presentation close control verified with Playwright.

## v0.1.0 — The first light

Published September 8, 2026.

### Added

- Crescent home dashboard with consistent navigation, app launcher, recent files, activity, and daily focus rail.
- Docs editor with local autosave, formatting controls, outline, details panel, and HTML export.
- Sheets editor with editable grid, chained `SUM`/ratio formulas, formula bar, local persistence, and CSV export.
- Slides editor with editable slide copy, slide management, theme controls, and presentation mode.
- Notes, Tasks, Calendar, Drive, and Forms surfaces with working local interactions.
- Command-style search across recent work.
- Responsive desktop and mobile layouts with a shared night-sky design system.
- Browser QA preview images under `docs/preview/`.

### Verification

- `npm run build` passes.
- Playwright fallback smoke test passes because the Browser plugin is not available in this workspace.
- All eight app surfaces opened without console errors.
- Local Sheets edits persisted through app navigation.
- CSV export produced `growth-metrics.csv`.
- Desktop and mobile screenshots verified with no mobile horizontal overflow.
