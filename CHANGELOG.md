# Changelog

## v0.1.114 — Calendar Day keeps its current-date anchor

Published September 9, 2026.

### Changed

- Kept Day mode anchored to the displayed date while Week mode uses a Sunday-start seven-day range.
- Smoke coverage now checks visible Day, Week, and Month layouts separately.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.113 — Calendar Week is a full seven-day view

Published September 9, 2026.

### Changed

- Calendar Week now renders all seven days from Sunday through Saturday.
- Day mode still hides the additional columns, and Calendar Month keeps the existing 42-cell grid.
- Refreshed the committed Calendar preview with the current browser date and seven-day timeline.

### Verification

- CI smoke now asserts seven Week day columns and 42 Month cells on desktop and mobile routes.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.112 — Overnight progress recorded

Published September 9, 2026.

### Changed

- Added safe local backup normalization, including empty Slides/Notes fallback records and verified restore behavior.
- Added standalone responsive Docs HTML export, full-range Sheets CSV export, and local SUM/AVERAGE/MIN/MAX formulas.
- Expanded Forms editing with question deletion, type cycling, and committed builder controls preview.
- Connected Home’s Ask Crescent card to global search, made the greeting follow local time, and preserved Starred state across file renames.
- Added keyboard navigation for Slides presentation mode and actionable Docs Body/Heading/Quote styles.
- Expanded CI smoke coverage to formulas, Forms controls, favorite continuity, presentation navigation, and Docs styles across desktop/mobile routes.

### Verification

- `npm run lint` passes with zero warnings.
- `npm run build` passes.
- `npm run test:smoke` passes 22 desktop/mobile routes plus the interaction checks above.
- GitHub CI and Pages Preview run for the preceding v0.1.111 milestone.

## v0.1.51 — Editor breadcrumbs are accessible

Published September 9, 2026.

### Changed

- Added an accessible `Back to Home` label to the shared editor breadcrumb home control.
- The label now applies consistently across all editor-style app surfaces.

### Verification

- Confirmed lint/build pass after the shared component change.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.50 — Forms enforce required answers

Published September 9, 2026.

### Changed

- Forms validates every required short/long answer and required scale question before saving.
- Incomplete responses show a local toast explaining the missing required work.

### Verification

- Confirmed an empty form is blocked with “Complete all required questions before submitting.”, then filled the required answer and scale and confirmed the response saved.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.49 — Forms validate collected email

Published September 9, 2026.

### Changed

- Forms now blocks submission when email collection is enabled and the email field is empty.
- The existing local toast explains the required next step; valid email input continues through the saved response flow.

### Verification

- Confirmed empty email leaves the form unsaved with “Add an email address before submitting.”, then entered `alex@example.com` and confirmed the success state.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.48 — Trash preview clarified

Published September 9, 2026.

### Changed

- Re-captured `docs/preview/trash.png` after the page-enter animation settled, improving readability of the Restore state.
- Updated the visual preview index to v0.1.48.

### Verification

- Visually reviewed the clearer Trash screenshot with its Restore action and local toast.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.47 — Preview index catches up

Published September 9, 2026.

### Changed

- Updated `docs/preview/README.md` to identify the v0.1.46 visual preview set, including Trash.

### Verification

- Confirmed the preview index header and listed screenshots match the committed archive.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.46 — Trash visual checkpoint refreshed

Published September 9, 2026.

### Changed

- Added `docs/preview/trash.png` showing the new local Trash and Restore action.
- Added the Trash capture to the visual preview index.

### Verification

- Captured the screenshot from the running Vite app after moving a task to Trash and visually reviewed it.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.45 — Preview archive metadata refreshed

Published September 9, 2026.

### Changed

- Updated `docs/preview/README.md` from the original v0.1.0 label to v0.1.44.
- Clarified that the current Sheets preview includes persistent tabs and the Forms Preview includes email collection.

### Verification

- Confirmed all listed preview files exist in `docs/preview`.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.44 — Task restore preserves metadata

Published September 9, 2026.

### Changed

- Trash records now retain task project, due label, completion state, and original id.
- Restored tasks return with their original metadata instead of a generic recovered project.

### Verification

- Deleted and restored the completed “Share growth metrics” task, then confirmed its `Q3 planning`, `Tomorrow`, and completed state were preserved.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.43 — Trash can restore tasks

Published September 9, 2026.

### Changed

- Added a Restore action to deleted task rows in Trash.
- Restoring a task returns it to Tasks with its original id and removes the deleted record.

### Verification

- Deleted “Review the launch brief,” opened Trash, restored it, confirmed Trash emptied, and confirmed the task returned to Tasks.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.42 — Forms response preview refreshed

Published September 9, 2026.

### Changed

- Refreshed `docs/preview/forms-preview.png` with email collection enabled in the respondent-facing Preview mode.

### Verification

- Captured the screenshot from the running Vite app after enabling email collection and entering Preview, then visually reviewed it.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.41 — Tasks can move to Trash

Published September 9, 2026.

### Changed

- Added a task delete action that removes the task from the active list and records a lightweight local Trash item.
- Trash now renders deleted task records with the correct Tasks icon and remains populated after reload.
- Deletion feedback uses the existing local toast channel.

### Verification

- Deleted “Review the launch brief,” confirmed it appeared in Trash immediately, reloaded, and confirmed it remained there.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.40 — Forms settings change responses

Published September 9, 2026.

### Changed

- Collect email addresses now adds a persisted email field to the form response surface.
- Allow one response now disables the submit action after a response has been saved locally.
- Response answers include the collected email value in the existing local draft record.

### Verification

- Enabled email collection, confirmed the email field appeared, submitted `alex@example.com`, confirmed the submit control became disabled, and confirmed the field remained visible in Preview.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.39 — Docs outline links are live

Published September 9, 2026.

### Changed

- Docs outline entries now locate and scroll to matching `h1`, `h2`, or `h3` elements in the editor.
- Generated outline content remains derived from the saved document, so navigation follows renamed and edited drafts.

### Verification

- Clicked the “North star” outline entry and confirmed the page scrolled while the heading remained visible.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.38 — Forms response settings persist

Published September 9, 2026.

### Changed

- Added a versioned local `formSettings` object with `collectEmail` and `oneResponse` flags.
- Forms settings toggles now expose pressed state, update immediately, and persist through reloads.

### Verification

- Toggled both response settings, reloaded the app, and confirmed both states were restored.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.37 — Sheets visual checkpoint refreshed

Published September 9, 2026.

### Changed

- Refreshed `docs/preview/sheets.png` to show the persistent tab strip with Sheet 2 selected and local cell content.

### Verification

- Captured the screenshot from the running Vite app after creating Sheet 2 and entering a value in A1, then visually reviewed it.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.36 — Sheets has local undo and redo

Published September 9, 2026.

### Changed

- Added a bounded in-memory history for Sheets workbook edits.
- Undo and Redo now work for cell changes, title changes, and new-sheet creation during the current editing session.
- The toolbar disables each direction when its history is empty.

### Verification

- Changed B2 from 8420 to 9000, confirmed Undo restored 8420, and Redo restored 9000.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.35 — Sheets can grow beyond one tab

Published September 9, 2026.

### Changed

- Added persisted Sheets tabs with independent cell maps.
- Existing single-sheet workspaces migrate automatically into `Sheet 1`.
- Add sheet creates and selects a new blank tab; switching tabs preserves each tab’s cells and active selection.

### Verification

- Added `Sheet 2`, entered “Notes” in its A1 cell, switched back to Sheet 1 and confirmed the original B2 value remained, then reloaded and confirmed Sheet 2/A1 persisted.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.34 — Calendar navigation is live

Published September 8, 2026.

### Changed

- Calendar Previous and Today controls now update the displayed date context.
- Week and month labels, day numbers, and month cells follow the selected offset.
- Existing local event records remain intact while navigating.

### Verification

- Confirmed Previous changes April 23 / Week 17 to April 16 / Week 16, Today restores the original range, and Month renders April 2024 with seven cells.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.33 — Visual checkpoint refreshed

Published September 8, 2026.

### Changed

- Refreshed `docs/preview/home.png` with the current app launcher, live Recent shelf, and Forms filter.
- Refreshed `docs/preview/forms.png` with the current editable Forms builder surface.

### Verification

- Captured both screenshots from the running Vite app at desktop viewport size and visually reviewed them.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.32 — Slides decks have a saved identity

Published September 8, 2026.

### Changed

- Added a persisted `slidesTitle` workspace field for the deck-level file name.
- Slides now uses the shared editable title breadcrumb.
- Global Search indexes the deck title and keeps individual slide titles searchable.
- Home and Drive recent records display the deck title instead of the first slide title.

### Verification

- Renamed the deck to “Crescent launch story,” searched for it, and confirmed the result reopened Slides with the saved title.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.31 — Forms appear in Recent work

Published September 8, 2026.

### Changed

- Extended live recent records with the saved Forms title.
- Added Forms to Home’s Recent filter row.
- Recent utility navigation now uses the same live workspace records as Home and Drive.

### Verification

- Selected the Home Forms filter and confirmed “Launch feedback” was the only matching row.
- Opened Recent and confirmed the same Forms file appeared alongside the live core workspace files.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.30 — Forms titles are workspace files

Published September 8, 2026.

### Changed

- Added a persisted `formTitle` workspace field.
- Forms now uses the shared editable file-title breadcrumb and live heading.
- Global Search indexes the current form title with the Forms app route.

### Verification

- Renamed the form to “Customer pulse,” searched for that title, and confirmed the result reopened Forms with the saved title.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.29 — Forms builder can shape questions

Published September 8, 2026.

### Changed

- Added editable question-label inputs to Forms builder mode.
- Preview mode now switches those labels to respondent-facing text and hides builder controls.
- Question label changes continue through the same local workspace persistence model.

### Verification

- Edited the first question, entered Preview, confirmed the editable input disappeared and the new label rendered, then returned to Edit mode and added a fourth question.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.28 — Docs outline follows the draft

Published September 8, 2026.

### Changed

- Docs derives its outline from the current title and saved `h2`/`h3` headings.
- The document cover reflects the current title, including new blank drafts and renamed files.

### Verification

- Created a blank document from Drive and confirmed the Docs outline and cover both show “Untitled document.”
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.27 — Workspace backup and restore

Published September 8, 2026.

### Changed

- Added a Settings workspace backup row with Download and Import actions.
- Backups use a versioned JSON envelope and restore through the existing local workspace state model.
- Invalid or unsupported backup files show a local status message without changing current work.

### Verification

- Downloaded a backup and confirmed the filename is `crescent-workspace-backup.json`.
- Imported a test backup and confirmed the restored document title appeared in Docs.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.26 — Recent work stays current

Published September 8, 2026.

### Changed

- Added a shared live-recent record builder for the core workspace apps.
- Home’s Continue working and Recent tables now reflect current local titles and timestamps.
- Drive’s Recent files cards use the same live records, keeping the suite consistent after creating or renaming content.

### Verification

- Created a blank document in Drive, returned Home, and confirmed both Home shelves showed “Untitled document.”
- Confirmed Drive Recent files showed the same live title and current core workspace items.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.25 — Search follows your workspace

Published September 8, 2026.

### Changed

- Global Search indexes the current local Docs, Sheets, Slides, and Notes content instead of relying only on seeded demo files.
- Newly created or renamed workspace items can be found immediately, with duplicate seeded entries removed from the result set.

### Verification

- Created a blank document in Drive, searched for “Untitled document,” and confirmed the result navigated back to Docs with the saved title.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.24 — Drive can start work

Published September 8, 2026.

### Changed

- Drive New file creates an Untitled document with starter copy and opens it in Docs.
- The new draft is saved through the same local workspace model as the existing Docs editor.

### Verification

- Triggered Drive New file and confirmed the Docs title and body reset to a blank local draft in Playwright.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.23 — A complete Recent shelf

Published September 8, 2026.

### Changed

- Home Recent filters now include Calendar and Drive, matching every seeded file type shown in the table.

### Verification

- Selected Calendar in Home Recent and confirmed exactly one Calendar row and an active filter state in Playwright.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.22 — Navigation that tells the truth

Published September 8, 2026.

### Changed

- Starred now filters to starred files.
- Shared with me now filters to files owned by someone else.
- Trash now shows a clear empty state until deleted-file support is added.

### Verification

- Confirmed Starred shows 3 files, Shared shows 2, and Trash shows its empty state in Playwright.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.21 — Slides with a stronger voice

Published September 8, 2026.

### Changed

- Slides’ Big statement layout is now a real persisted slide layout.
- The layout centers and enlarges the title while hiding body copy for presentation-style emphasis.
- The corrected slide kicker stays in the canvas chrome instead of overlapping the title.
- Added a committed Big statement screenshot to the visual evidence set.

### Verification

- Selected Big statement, confirmed the canvas and layout state persisted after navigation, and visually inspected the result in Playwright.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.20 — Calendar with a wider view

Published September 8, 2026.

### Added

- Calendar Day mode narrows the schedule to today.
- Calendar Week mode preserves the detailed timeline.
- Calendar Month mode renders a seven-day month grid with event pills and saved local events.
- Added a committed Calendar Month preview to the visual evidence set.

### Verification

- Switched Day → Month and confirmed the timeline, headings, seven month cells, and event pills in Playwright.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.19 — A calmer GitHub check

Published September 8, 2026.

### Changed

- Pages preview still builds and uploads on every `main` push.
- Deployment now waits for the repository variable `CRESCENT_PAGES_ENABLED=true`, preventing a known Pages-disabled 404 from masking green product CI.

### Verification

- The workflow configuration remains scoped to the Crescent repository and preserves the deploy path for when Pages is enabled.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.18 — A steadier workspace loop

Published September 8, 2026.

### Changed

- Workspace updates now use a stable React callback, reducing avoidable view recomputation during shell interactions.

### Verification

- Full lint and production build pass after the workspace hook change.
- The cross-app regression pass still covers Sheets Insights, Forms Preview, Drive List, and mobile overflow.

## v0.1.17 — Forms you can preview

Published September 8, 2026.

### Added

- Forms Preview now switches into a centered respondent view.
- Builder-only settings and Add question controls hide during Preview and return in Edit form mode.
- Added a committed Forms Preview screenshot to the visual evidence set.

### Verification

- Toggled Preview → Edit form and confirmed builder settings hide and return in Playwright.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.16 — Sheets with a signal

Published September 8, 2026.

### Added

- Sheets now has a working Insights view with local totals, conversion, and visits-by-channel bars.
- Insights are calculated from the same editable cell data and ignore empty rows.
- Added a committed Sheets Insights preview to the visual evidence set.

### Verification

- Switched between Grid and Insights, confirmed three metric cards and four populated channel bars in Playwright.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.15 — Drive in the right shape

Published September 8, 2026.

### Added

- Drive’s Grid/List view toggle now changes both folders and recent files.
- List view keeps file previews, metadata, and actions readable in a compact vertical scan.
- Added a committed Drive list-view preview to the visual evidence set.

### Verification

- Switched Drive to List view and confirmed folder/file list layouts in Playwright.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.14 — Slides that remember

Published September 8, 2026.

### Changed

- Slide speaker notes are now stored with each slide and restored when reopening the deck.
- New slides include their own empty notes field.
- The visible deck counter now uses the actual slide count instead of a fixed value.

### Verification

- Wrote speaker notes, added a fourth slide, confirmed `04 — 04`, navigated away, and confirmed the notes restored in Playwright.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.13 — Responses that stay put

Published September 8, 2026.

### Changed

- Forms answer fields are now controlled by the local workspace state.
- Saved responses retain answer text, selected scale, and the response-saved status after navigation.

### Verification

- Entered a response, selected scale 4, submitted, navigated away, and confirmed the text and scale restored in Playwright.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

## v0.1.12 — Tasks with a point of view

Published September 8, 2026.

### Added

- Tasks' Filter control cycles through All, Today, Open, and Done views.
- Task list headings and counts update with the active filter.

### Verification

- Confirmed the filter changes visible rows and labels in Playwright.
- `npm run lint` passes with zero warnings.
- `npm run build` passes.

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

- GitHub Pages workflow builds the Vite app from `main` and deploys when the repository Pages gate is enabled.
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
