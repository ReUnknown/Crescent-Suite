# Changelog

## v0.1.11 — Search that knows your work

Published September 8, 2026.

### Changed

- Global Search now indexes local tasks, Drive folders, and Calendar events alongside seeded files.
- Local search results carry the correct Crescent app icon and route back into the owning surface.

### Verification

- Injected a local task, found it through Search, and opened its Tasks surface in Playwright.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.10 — Workspace continuity

Published September 8, 2026.

### Changed

- Home's My day rail now reflects saved local calendar events.
- Forms persists its published state and latest saved response in the local workspace.
- Returning to Forms after visiting another app restores the visible Live and response-saved states.

### Verification

- Created a calendar event, confirmed it appeared on Home, then published and submitted Forms before navigating away and back.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.9 — Calendar that remembers

Published September 8, 2026.

### Added

- Calendar can create local events with a title and time description.
- Saved events render in a focused local-events strip above the weekly calendar.
- Events can be removed and remain consistent after navigating between apps.
- Added a committed calendar preview showing the new workflow.

### Verification

- Created an event, navigated Home → Calendar, verified it persisted, and removed it in Playwright.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.8 — A live preview path

Published September 8, 2026.

### Added

- GitHub Pages workflow builds and deploys the Vite app from `main`.
- Vite uses the repository base path in Actions so the hosted app resolves assets correctly.
- Preview documentation now includes the Forms evidence screenshot alongside the other milestone captures.

### Verification

- `npm run lint` passes with zero warnings.
- `npm run build` passes with the GitHub Actions base path enabled locally through the config.

## v0.1.7 — A cleaner build loop

Published September 8, 2026.

### Added

- Flat ESLint configuration for the React/Vite source.
- GitHub CI now runs both `npm run build` and `npm run lint` on every push and pull request.
- Removed unused imports and resolved the initial React hook hygiene warnings.

### Verification

- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.6 — Forms that listen

Published September 8, 2026.

### Added

- Forms now has real local response fields, scale selection, publishing state, and a saved-response success state.
- Form response feedback uses the same toast and status language as the rest of Crescent.
- Forms preview added to the GitHub visual evidence set.

### Verification

- Filled a response, selected scale 4, published the form, and submitted the response in Playwright.
- Production build passes after the Forms interaction pass.

## v0.1.5 — Persistent Drive

Published September 8, 2026.

### Changed

- Drive folders now persist in Crescent's versioned browser workspace instead of resetting when you navigate away.
- The Drive preview now shows the local folder workflow in the committed visual evidence.

### Verification

- Created a folder through the UI, navigated Home → Drive, and verified it remained visible.
- Production build passes after the persistence change.

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
