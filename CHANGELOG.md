# Changelog

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
