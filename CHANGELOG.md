# Changelog

## v1.6.0 — Universal Search accessibility

Published September 9, 2026.

### Improved

- Universal Search now advertises list autocomplete and a result listbox to assistive technology.
- Search results now expose option semantics while preserving direct keyboard focus and navigation.
- Result updates are announced through a polite live region.
- Added production smoke coverage for the result-region semantics alongside Escape, outside-click, ArrowDown, and Enter behavior.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.5.2 — Project search regression coverage

Published September 9, 2026.

### Improved

- Added a production regression assertion for Project search destinations.
- Search now remains verified as a cross-suite router: a Project result opens Tasks with the matching Project filter selected.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.5.1 — Safe imported history and Trash

Published September 9, 2026.

### Fixed

- Malformed Form response history now normalizes into safe local response records.
- Invalid Trash entries are ignored during backup import instead of producing phantom or crashing records.
- Added production smoke coverage for malformed Responses and Trash collections.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.5.0 — Safe imported workspace records

Published September 9, 2026.

### Fixed

- Workspace backup import now normalizes malformed Slides, Notes, Tasks, Forms, Calendar, and Drive records.
- Valid v1 backups containing incomplete or null list entries now recover to safe local starter records instead of crashing a surface later.
- Preserved intentional empty task, form, and calendar collections while repairing malformed entries that are present.
- Added production smoke coverage for malformed-record backup recovery across the suite.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.4.1 — Exact Drive file destinations

Published September 9, 2026.

### Fixed

- Drive search now distinguishes folders, Workspaces, Projects, and Drive files instead of treating every result as a folder.
- Project search results now open Tasks with the matching Project filter selected.
- Home, Recent, utility, and Drive cards now preserve exact Drive-file context.
- Drive can surface and highlight a targeted recent file even when it falls outside the default six-card window.
- Added a committed visual capture of the exact Drive-file destination.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.4.0 — Accessibility and motion preferences

Published September 9, 2026.

### Improved

- Crescent now respects `prefers-reduced-motion` for route animations, hover transitions, and scroll behavior.
- Reduced-motion users get the same complete suite without unnecessary movement.
- Added production smoke coverage under reduced-motion browser emulation.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.3.9 — Consistent selection semantics

Published September 9, 2026.

### Improved

- Home Recent filters now expose the active filter with `aria-pressed`.
- Drive Grid/List controls now expose the active view with `aria-pressed`.
- Slides thumbnails and layout choices now expose their current selection state.
- Added production smoke coverage for the key selected-state contracts.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.3.8 — Accessible Slides speaker notes

Published September 9, 2026.

### Improved

- Slides speaker notes now expose a stable accessible name tied to the active slide.
- Assistive technology can identify the notes field even after the slide title changes.
- Added production smoke coverage for the active Slides speaker-notes label.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.3.7 — Exact Drive recent-file destinations

Published September 9, 2026.

### Improved

- Drive Recent files cards now preserve the clicked file title when routing into the suite.
- A Drive card now opens the exact live local record instead of only the containing app.
- Added production smoke coverage for the Drive Recent files destination contract.
- Added a committed visual capture of the Drive-to-Docs handoff.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.3.6 — Clean Docs search markers

Published September 9, 2026.

### Fixed

- Transient Docs search highlights are now removed before content-editable autosave.
- Search-only styling can no longer contaminate exported or persisted document HTML.
- Added production smoke coverage for clean saved document content after the destination highlight is blurred.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.3.5 — Browser tab context

Published September 9, 2026.

### Improved

- Route navigation now updates the browser tab title, for example `Docs · Crescent Suite`.
- Added production smoke coverage for the route title behavior.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.3.4 — Search accessibility semantics

Published September 9, 2026.

### Improved

- Universal Search now exposes its open state with `aria-expanded`.
- The search input now identifies its result region with `aria-controls="crescent-search-results"`.
- Added production smoke assertions for the new search semantics.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.3.3 — Surface-aware editor headers

Published September 9, 2026.

### Fixed

- Shared editor title editability now follows the actual surface identity instead of the current displayed title.
- Real files named “Tasks,” “Calendar,” “Drive,” or “Notes” remain editable while fixed container headers stay read-only.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.3.2 — Exact Docs heading destinations

Published September 9, 2026.

### Added

- Universal Search now carries matching Docs heading context into the editor.
- Searching for a heading such as “North star” scrolls to that heading and highlights it with document-safe contrast.
- Added a committed preview of the exact Docs heading destination.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.
- Smoke coverage verifies that searching for “North star” selects the matching document heading.

## v1.3.1 — Exact Forms question destinations

Published September 9, 2026.

### Added

- Universal Search now carries matching Forms question context into the form builder.
- Searching for a question opens Forms with that question highlighted and centered in view.
- Added a committed preview of the exact Forms question destination.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.
- Smoke coverage verifies that searching for “What are you working on?” highlights the first form question.

## v1.3.0 — Exact Sheets cell destinations

Published September 9, 2026.

### Added

- Universal Search now carries matching Sheets cell coordinates into the workbook.
- Searching for a cell value opens Sheets with that cell selected and visible in the formula bar.
- Added a committed preview of the exact Sheets cell destination.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.
- Smoke coverage verifies that searching for “Organic” selects cell A2.

## v1.2.2 — Search regression coverage

Published September 9, 2026.

### Fixed

- Committed the outside-click Universal Search smoke assertion that accompanies the v1.2.0 overlay behavior.
- Kept the release metadata and checked-in verification suite aligned with the published app behavior.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.2.1 — Navigation semantics

Published September 9, 2026.

### Improved

- Primary sidebar navigation now exposes the active page with `aria-current="page"`.
- Preserved the existing visual active state while improving screen-reader route context.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.2.0 — Search overlay polish

Published September 9, 2026.

### Improved

- Universal Search now dismisses when the user clicks outside the search field or result controls.
- Search result buttons remain interactive while open panel space lets clicks reach the workspace dismissal handler.
- Added production smoke coverage for outside-click dismissal alongside Escape, arrow navigation, and Enter-to-open.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.1.5 — Editor header semantics

Published September 9, 2026.

### Improved

- Added an explicit regression assertion for read-only container titles in the rendered Tasks surface.
- Kept the shared title behavior verified in the same production smoke pass as the full suite.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.1.4 — Clear container navigation

Published September 9, 2026.

### Improved

- Fixed the shared editor header so Notes, Tasks, Calendar, and Drive no longer present fixed surface names as editable file titles.
- Real document, sheet, slide, and form titles remain editable and continue to update local Starred metadata.
- Added read-only semantics and visual treatment for fixed container titles.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.1.3 — Exact utility destinations

Published September 9, 2026.

### Improved

- Recent, Starred, and Shared utility rows now preserve the exact local file context when opening an app.
- Utility navigation now follows the same destination contract as Universal Search, Home, and the sidebar.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.1.2 — Exact Recent destinations

Published September 9, 2026.

### Improved

- Home Continue working cards now carry exact local navigation context.
- Home Recent rows now reopen the selected note, slide, task, or event instead of only opening the containing app.
- Added a committed preview of an exact Recent note destination.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.
- Smoke coverage verifies that a Recent note row opens the matching note editor.

## v1.1.1 — Contextual sidebar navigation

Published September 9, 2026.

### Improved

- Sidebar Workspaces now open Drive with the matching folder selected.
- Sidebar Projects now open Tasks with the matching Project filter selected.
- Added a committed preview of the contextual Project destination.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.
- Smoke coverage verifies sidebar Workspace and Project destinations persist through local navigation.

## v1.1.0 — Universal app search

Published September 9, 2026.

### Added

- Universal Search now includes direct destinations for Docs, Sheets, Slides, Notes, Tasks, Calendar, Drive, and Forms.
- App results include the app’s purpose and open the app directly without requiring a saved file.
- Added a committed preview of the app result state.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.
- Smoke coverage verifies that searching for “Calendar” opens the Calendar app result.

## v1.0.9 — Exact Calendar and Drive destinations

Published September 9, 2026.

### Added

- Search results now carry local navigation context into Calendar and Drive.
- Selecting a Calendar event opens the saved event list with that event highlighted.
- Selecting a Drive folder opens the folder context with the matching folder selected, including case-insensitive matches.
- Added committed visual previews for both destination states.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.
- Smoke coverage verifies exact Drive folder and Calendar event result routing.

## v1.0.8 — Exact task destinations

Published September 9, 2026.

### Added

- Search results now carry local navigation context into Tasks.
- Selecting a task opens the Tasks surface with the matching Project filter selected, including case-insensitive matches from imported workspace backups.
- Added a committed visual preview of an exact task search destination.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.
- Smoke coverage verifies exact task result routing and Project selection after backup normalization.

## v1.0.7 — Stable exact search destinations

Published September 9, 2026.

### Fixed

- Applied search-selected note and slide context only once per destination.
- Prevented later workspace edits from reselecting an old search result after the user has moved elsewhere.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.0.6 — Exact search destinations

Published September 9, 2026.

### Fixed

- Search results now carry local navigation context into Notes and Slides.
- Selecting a note opens that note in the Notes list.
- Selecting an individual slide opens that slide in the Slides editor.
- Slide search now indexes each slide’s own title and body instead of attaching all slide text to the deck-level result.
- Added a committed visual preview of an exact slide search destination.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.
- Smoke coverage verifies exact note and slide result destinations.

## v1.0.5 — Keyboard-friendly search

Published September 9, 2026.

### Added

- Search results can now be reached from the search field with ArrowDown.
- ArrowUp moves through results and returns to the search field at the top.
- Enter opens the focused local result and preserves the existing route navigation behavior.
- Added a committed visual preview of the focused search result state.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.
- Smoke coverage verifies search result focus and Enter navigation to Docs.

## v1.0.4 — Calendar time across Home

Published September 9, 2026.

### Fixed

- Home’s My day rail now shows the time parsed from saved local calendar events instead of a generic Saved/Local label.
- Added a committed visual preview of a local event flowing from Calendar into Home.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.
- Smoke coverage verifies same-day local calendar events appear in Home with their saved time while future events remain excluded.

## v1.0.3 — Responsive task editing

Published September 9, 2026.

### Fixed

- Kept the mobile task title editor focused by hiding secondary row actions while a title is being edited.
- Verified the 390px task editing state has no horizontal overflow.
- Added a committed mobile preview for the responsive editing state.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v1.0.2 — Editable calendar events

Published September 9, 2026.

### Added

- Added inline editing for saved local calendar event titles and times.
- Added Enter to save and Escape to cancel while editing an event.
- Recalculate the saved local event day whenever its edited time text includes a new natural-language date.
- Added a committed visual preview for the calendar editing state.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.
- Smoke coverage now verifies event creation, inline editing, reload persistence, local-day placement, and ICS export.

## v1.0.1 — Editable task titles

Published September 9, 2026.

### Added

- Added inline task title editing with explicit save and cancel controls.
- Added Enter to save and Escape to cancel while editing a task title.
- Renamed starred task titles safely when a task is edited.
- Added a committed visual preview for the editing state.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.
- Smoke coverage now verifies task title creation, editing, and reload persistence.

## v1.0.0 — First big Crescent release

Published September 9, 2026.

### Added

- Established the first major Crescent Suite baseline from the v0.1.166 build.
- Published the complete local-first suite shell with Home, Docs, Sheets, Slides, Notes, Tasks, Calendar, Drive, and Forms.
- Carried forward the committed visual preview archive, responsive layouts, exports, local workspace persistence, and 30-route smoke coverage as the major-release foundation.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass before the `v1.0.0` tag.
- GitHub Actions CI and Pages preview are expected to validate the tagged baseline from `main`.

## v0.1.166 — Settings accessibility polish

Published September 9, 2026.

### Fixed

- The hidden Settings workspace-backup file input now exposes the accessible name “Import workspace backup.”
- A browser accessibility check confirms the backup control is labeled while remaining visually hidden behind the Import action.

### Verification

- `npm run lint` and `npm run build` pass; the full 30-route smoke suite remains green on the underlying v0.1.165 implementation.

## v0.1.165 — Clear Tasks empty states

Published September 9, 2026.

### Added

- Tasks now shows a contextual empty state when a status or Project filter has no matching work.
- Added a committed preview of the filtered empty state so the behavior is reviewable in the visual archive.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass with 30 desktop/mobile route checks.

## v0.1.164 — Preview archive alignment

Published September 9, 2026.

### Documentation

- Aligned the committed visual preview archive with the current v0.1.163 Home shell and refreshed screenshot description.

### Verification

- Repository remains clean after the metadata-only release update; the underlying v0.1.163 implementation passed lint, build, Pages verification, and 30-route smoke checks.

## v0.1.163 — Focused Home day rail

Published September 9, 2026.

### Fixed

- Home’s My day rail now filters saved Calendar events by the current local date, preventing future weekday events from appearing as today’s schedule.
- Future local events remain searchable and visible in Calendar/Recent, preserving their discoverability without distorting the day view.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass with 30 desktop/mobile route checks.

## v0.1.162 — Complete app launcher layout

Published September 9, 2026.

### Fixed

- Home now lays out all eight suite apps in a balanced 4×2 launcher at desktop widths, keeping Forms inside the main column instead of allowing it to slip beneath the right rail.
- Refreshed the committed Home preview to show the complete launcher.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass with 30 desktop/mobile route checks.

## v0.1.161 — Utility surface consistency

Published September 9, 2026.

### Fixed

- Mobile utility pages now show their actual page title instead of the generic Crescent label.
- Empty Recent, Starred, Shared, and Trash surfaces now explain the relevant next step instead of reusing Trash-only copy.
- Smoke coverage now exercises all utility routes across desktop and mobile, expanding the route matrix to 30 checks.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.160 — Search keyboard polish

Published September 9, 2026.

### Added

- Global Search now clears its query and closes its result panel on Escape, keeping keyboard navigation within the current Crescent surface.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.159 — Project-filtered Tasks

Published September 9, 2026.

### Added

- Tasks now includes a local Project filter alongside the existing All, Today, Open, and Done status cycle.
- The filter uses the same persistent project vocabulary as New task and the sidebar, keeping project labels consistent as the workspace grows.
- Added a committed Tasks screenshot showing a filtered project list.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.158 — Local calendar date fidelity

Published September 9, 2026.

### Fixed

- Calendar event dates now use local browser date keys instead of UTC-derived strings, preventing late-evening events from shifting into the previous day.
- Natural-language event dates now recognize weekday names such as “Friday” and explicit `M/D` or `M/D/YYYY` dates in addition to Today, Tomorrow, and Yesterday.
- Week, Day, Month, Recent, and ICS views now share the same local calendar-day interpretation.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.157 — Project-linked smoke reporting

Published September 9, 2026.

### Testing

- The successful smoke summary now explicitly reports local project-linked task creation coverage.

### Verification

- `npm run test:smoke` passes with the clarified report.

## v0.1.156 — Consistent Task project choices

Published September 9, 2026.

### Fixed

- New Task project choices now deduplicate case-insensitively across persistent Projects and existing task labels.
- The first readable label wins, so seeded variations such as “Product launch” and “Product Launch” do not create duplicate options.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.155 — Project-linked Tasks preview

Published September 9, 2026.

### Documentation

- Added a committed Tasks screenshot showing the Project selector, local progress, due dates, and the shared sidebar vocabulary.
- The visual preview index now includes `tasks-project-selector.png`.

### Verification

- Preview captured from the running local app after the project-linked Tasks implementation.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass on the underlying v0.1.154 implementation.

## v0.1.154 — Project-linked task creation

Published September 9, 2026.

### Added

- Tasks now expose a local Project selector when creating a new task.
- Existing task project names remain available alongside persistent sidebar Projects, so older tasks do not lose their labels.

### Verification

- Smoke coverage creates a task under the new local “Smoke project” and verifies the project label persists on the task row.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.153 — Empty Tasks stay empty

Published September 9, 2026.

### Fixed

- Home Recent now suppresses the seeded Tasks fallback when the local Task collection is intentionally empty.
- Deleting the last local Task no longer makes the demo “Review the launch brief” reappear.

### Verification

- Smoke coverage empties the local Task collection and verifies the seeded Task is absent from Home Recent.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.152 — Release metadata aligned

Published September 9, 2026.

### Documentation

- README’s Current release label now matches the package version, changelog, and preview index.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass on the aligned release metadata.

## v0.1.151 — Preview archive link cleanup

Published September 9, 2026.

### Documentation

- README now links directly to the committed visual preview archive.
- Removed a stale historical note that incorrectly described the archive as v0.1.66.

### Verification

- README and preview index references were audited against the current v0.1.150 milestone.

## v0.1.150 — Legacy folder names preserved

Published September 9, 2026.

### Fixed

- String-style Drive folder records from older backups now retain their original names during normalization.
- Incomplete object records still receive synthesized names and safe metadata in the same migration pass.

### Verification

- Smoke coverage imports both an incomplete folder object and a legacy `Archive` string, then verifies both render.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.149 — Scrollable local navigation

Published September 9, 2026.

### Changed

- The fixed sidebar now scrolls vertically, keeping custom Workspaces, Projects, and its lower focus card reachable as local navigation grows.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass across desktop and mobile route coverage.

## v0.1.148 — Safer legacy folder migration

Published September 9, 2026.

### Fixed

- Partial or hand-edited backups with incomplete Drive folder records now receive safe names, non-negative item counts, and supported colors.
- Drive duplicate detection can safely inspect migrated folders without throwing on missing names.

### Verification

- Smoke coverage imports an incomplete folder record and verifies Drive renders the synthesized `Folder 1` entry.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.147 — Searchable workspace preview

Published September 9, 2026.

### Documentation

- Added a committed Home screenshot showing Global Search finding a locally created Workspace and identifying its Drive destination.
- The visual preview index now includes `search-local-navigation.png`.

### Verification

- Preview captured from the running local app after creating the custom Workspace.
- `npm run test:smoke` passes on the underlying v0.1.146 implementation.

## v0.1.146 — Drive folder persistence coverage

Published September 9, 2026.

### Testing

- Playwright smoke coverage now reloads Drive after creating a folder and verifies the folder remains available.

### Verification

- `npm run test:smoke` passes with the expanded persistence assertion.

## v0.1.145 — Safer Drive folder creation

Published September 9, 2026.

### Changed

- Drive New folder now rejects duplicate names case-insensitively and reports the local creation result.

### Verification

- Smoke coverage creates a folder, then attempts the same name again and verifies that only one card remains.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.144 — Normalized custom folder colors

Published September 9, 2026.

### Fixed

- New Workspace folders now use a defined Drive color even when the sidebar color cycle reaches its fifth variant.
- Imported workspace and folder colors are clamped to the supported visual ranges before rendering.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.143 — Recent keyboard navigation coverage

Published September 9, 2026.

### Testing

- Playwright smoke coverage now focuses the first Home Recent row, opens it with Enter, and verifies that navigation reaches Docs.
- The existing favorite action remains separately covered by the task Starred recovery path.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.142 — Workspace-to-Drive preview

Published September 9, 2026.

### Documentation

- Added a committed Drive screenshot showing a locally created Workspace mirrored as an empty folder.
- The visual preview index now includes `workspace-drive.png` for GitHub review.

### Verification

- Preview captured from the running local app after creating a custom Workspace.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass on the underlying v0.1.141 implementation.

## v0.1.141 — Workspaces open into Drive

Published September 9, 2026.

### Changed

- Creating a local Workspace now creates an empty Drive folder with the same name, making the sidebar destination immediately useful.
- Workspace and folder colors stay aligned through the local creation flow.

### Verification

- Smoke coverage creates a workspace, reloads it, and verifies its matching Drive folder.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.140 — Searchable local navigation

Published September 9, 2026.

### Changed

- Global Search now includes locally created Workspaces and Projects alongside files, tasks, folders, and events.
- Search results route custom navigation records to Drive so they remain useful even before team connectivity exists.

### Verification

- Smoke coverage restores a legacy workspace and project backup, then finds the workspace through Global Search.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.139 — Accessible Recent file rows

Published September 9, 2026.

### Changed

- Home Recent rows now use keyboard-operable link containers, keeping the nested Starred action valid for assistive technology.
- Enter and Space open the focused Recent file, while the favorite control retains its independent action.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.138 — Safer workspace backup migration

Published September 9, 2026.

### Fixed

- Workspace and Project records imported from older or hand-edited backups are normalized before the sidebar reads them.
- String workspace names and object-style project records now migrate into the current local navigation model without runtime errors.

### Verification

- Smoke coverage restores legacy-shaped workspace/project entries and verifies they render after import.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.137 — Local workspace and project creation

Published September 9, 2026.

### Added

- Sidebar Workspaces and Projects can now be created with a local prompt and stored in the version-1 workspace model.
- Imported or exported backups retain the custom workspace and project lists.
- The committed Home preview now shows the persistent navigation shell used by these local creation flows.

### Verification

- Smoke coverage creates a workspace and project through the sidebar and verifies both appear immediately.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.136 — Calendar ICS export keeps event times

Published September 9, 2026.

### Changed

- Calendar `.ics` export now preserves a local event’s entered time as a floating `DTSTART` value.
- Events without a recognizable time remain valid all-day ICS events.

### Verification

- Smoke coverage checks a “Tomorrow · 3:00 PM” event exports as `T150000` on its stored date.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.135 — Forms answer controls are accessible

Published September 9, 2026.

### Changed

- Respondent text inputs and Long answer textareas now expose each question’s text as their accessible label.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.134 — Forms multi-response state stays clear

Published September 9, 2026.

### Changed

- Forms now labels the submission action as “Submit response” whenever multiple responses are allowed, even after an earlier response was saved.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.133 — Recent files reflect local Calendar events

Published September 9, 2026.

### Changed

- The live Recent/Home model now includes the newest locally saved Calendar event and its timing text.

### Verification

- Smoke coverage creates a local Calendar event and confirms it appears in Home Recent.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.132 — Shared Starred recovery across live Tasks

Published September 9, 2026.

### Changed

- Recent files now include the current task record rather than only the seeded task placeholder.
- Smoke coverage verifies task Starred → Trash → Restore continuity through the shared recovery model.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.131 — Forms Long answer control

Published September 9, 2026.

### Changed

- Forms Long answer questions now render resizable textareas for respondent input.

### Verification

- Smoke coverage cycles a question through types and asserts the Long answer textarea is present.
- Added a committed Forms Preview screenshot showing the multi-line control.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.130 — Tasks due-date interaction preview

Published September 9, 2026.

### Changed

- Added a committed visual preview of the editable Tasks due-date interaction.

### Verification

- Preview was captured after cycling “Review the launch brief” from Today to Tomorrow.

## v0.1.129 — Tasks support editable due dates

Published September 9, 2026.

### Changed

- Task due chips are now interactive and cycle through Today, Tomorrow, Friday, and No date.
- Due-date changes persist in the local workspace and remain included in task exports.

### Verification

- Smoke coverage checks that a task due chip changes state locally.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.128 — Trash recovery preserves Starred state across apps

Published September 9, 2026.

### Changed

- Notes and Tasks now archive their Starred metadata when moved to Trash.
- Restoring Notes or Tasks brings their Starred state back, matching the Docs recovery path.

### Verification

- Shared local recovery paths pass lint, build, and browser smoke coverage.

## v0.1.127 — Drive restores Starred metadata

Published September 9, 2026.

### Changed

- Drive file creation now records whether the archived Docs record was starred.
- Restoring that record brings its Starred state back with the document.

### Verification

- Smoke coverage now checks Drive → Trash → Restore → Starred continuity.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.126 — Form responses export to CSV

Published September 9, 2026.

### Changed

- Added a CSV export action to the local Forms Responses view.
- CSV columns include the submission timestamp, optional email address, and every current question label.

### Verification

- Browser smoke coverage verifies a submitted response downloads with a `-responses.csv` filename.
- Refreshed the committed Forms response-history preview.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.125 — Calendar natural-language dates are respected

Published September 9, 2026.

### Changed

- Calendar local-event creation now shifts the stored date for prompts containing “Tomorrow” or “Yesterday,” matching the wording users entered.

### Verification

- Smoke coverage checks a “Tomorrow · 3:00 PM” event stores tomorrow’s date and renders at the 3 PM slot.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.124 — Calendar local events land on the timeline

Published September 9, 2026.

### Changed

- Locally saved Calendar events now appear in the Week/Day timeline instead of only in the saved-events list.
- Event times are parsed from the prompt so entries such as `Today · 3:00 PM` land in the corresponding hour slot.

### Verification

- Refreshed the committed Calendar local-event preview and added smoke coverage for the 3 PM position.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.123 — Sheets add COUNT and COUNTA formulas

Published September 9, 2026.

### Changed

- Sheets range formulas now support `COUNT` and `COUNTA` alongside the existing local aggregate and ratio formulas.

### Verification

- Smoke coverage checks `COUNT(B2:B4)` and expects three numeric cells.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.122 — Forms keep a local response history

Published September 9, 2026.

### Changed

- Form submissions now append to a local response history with timestamps instead of replacing the previous response.
- Added a dedicated Responses view with answer cards and a clear return path to the form editor or Preview mode.
- Form JSON exports now include the full local response history.

### Verification

- Added a committed response-history preview and browser smoke coverage for submit → Responses → Back to form.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.121 — Smoke coverage waits for backup confirmation

Published September 9, 2026.

### Changed

- Settings backup smoke coverage waits for the visible local restore confirmation before navigating to Forms.

### Verification

- GitHub CI for `v0.1.120` passes.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.120 — Drive file creation is recoverable

Published September 9, 2026.

### Changed

- Drive New file prompts for a title and moves the current Docs record to local Trash.
- Docs Restore archives the temporary active document before returning the selected document, preserving both records.

### Verification

- Browser smoke coverage now checks Drive → Docs → Trash → Restore.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.119 — CI guards safe export filenames

Published September 9, 2026.

### Changed

- CI smoke now exercises a slash-containing Forms title and checks that the downloaded filename is sanitized.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.118 — All local exports use safe filenames

Published September 9, 2026.

### Changed

- Notes, Slides, and Forms exports now sanitize title-derived filenames using the shared helper.

### Verification

- Browser check confirms a Forms title containing `/` downloads with a safe hyphenated filename.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.117 — CI guards partial backup restore

Published September 9, 2026.

### Changed

- CI smoke now imports a partial Settings backup and verifies safe default Forms questions plus a restored `collectEmail` setting.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

## v0.1.116 — GitHub Pages install paths are safe

Published September 9, 2026.

### Changed

- PWA manifest `start_url`, `scope`, and icon paths are relative for repository-subpath hosting.
- Smoke now checks the manifest, and a Pages-base build verifies `/Crescent-Suite/` asset paths.

### Verification

- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.
- `CRESCENT_PAGES_BUILD=true npm run build` passes the Pages base/manifest check.

## v0.1.115 — Calendar Week copy matches its grid

Published September 9, 2026.

### Changed

- Week headings now use the Sunday-start date shown by the seven-day timeline.
- Refreshed `docs/preview/calendar.png` after the heading alignment.

### Verification

- Browser check confirms the Week heading, Week of subheading, and seven visible columns share the same anchor.
- `npm run lint`, `npm run build`, and `npm run test:smoke` pass.

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
