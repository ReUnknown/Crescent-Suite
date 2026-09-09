# Crescent Suite

An all-in-one productivity workspace built to keep the work in one calm, consistent place.

## Current release

**v1.3.0 — Exact Sheets cell destinations**

Review the [committed visual preview archive](docs/preview/README.md) for milestone screenshots.

The first major release establishes a usable Crescent product shell and a local-first suite experience:

- Home dashboard with app launcher, recent work, activity, and a daily focus rail
- Docs editor with local autosave, formatting controls, outline, and HTML export
- Sheets grid with editable cells, basic formulas, and CSV export
- Slides editor with slide management, themes, and presentation mode
- Notes, Tasks, Calendar, Drive, and Forms surfaces with working local interactions
- Shared navigation, command-style search, responsive layouts, and a night-sky design system
- Pages-ready workflow builds a visual preview on every `main` milestone and deploys when repository Pages is enabled
- Calendar events can be created, saved, reviewed, and removed in the local workspace
- Calendar events can be exported as a standard `.ics` calendar file for use in other calendar apps
- Calendar event dates now use the browser’s local calendar day, recognize weekday names and explicit numeric dates, and keep ICS exports aligned with the saved day
- Tasks can now be filtered to a persistent local Project while retaining the existing status and due-date controls
- Command+K search can now be dismissed with Escape without leaving the current route
- Recent, Starred, Shared, Trash, and Settings now keep their correct mobile page titles and contextual empty-state copy
- Home now presents all eight suite apps in a visible 4×2 launcher so Forms remains discoverable beside the other core tools
- Home’s My day rail now includes only saved events on the current local day; future events remain available in Calendar and Recent
- The committed preview archive header and Home screenshot description now match the current published shell
- Tasks now explain when a status or Project filter has no matches, with a clear next-step message instead of an empty list
- Settings’ hidden workspace-backup input now has an explicit accessible name for assistive technology
- `v1.0.0` marks the first major, reviewable Crescent baseline with the full suite shell, eight working apps, committed visual previews, and green CI smoke coverage
- Tasks now support inline title editing with Enter/Escape keyboard controls, explicit save/cancel actions, and local persistence
- Calendar events now support inline title and time editing with natural-language date recalculation and local persistence
- Task title editing now collapses to a compact save/cancel state on small screens without horizontal overflow
- Saved same-day calendar events now carry their actual time into Home’s My day rail
- Global Search now supports ArrowDown/ArrowUp focus movement and Enter-to-open navigation
- Search results now open the exact local note or slide selected instead of only opening the containing app
- Search context now applies once per destination so later local editing and manual selection stay stable
- Search results now open the matching task with its existing Project filter selected
- Search results now highlight the matching local Calendar event or Drive folder in its destination surface
- Universal Search now includes direct destinations for all eight Crescent apps, even before they have local files
- Sidebar Workspaces now select their matching Drive folder, and Projects open Tasks with the matching Project filter selected
- Home Continue working and Recent rows now preserve the exact local file destination when opening Notes, Slides, Tasks, or Calendar
- Recent, Starred, and Shared utility rows now preserve the exact local file destination as well
- Fixed the shared editor header so fixed container surfaces are read-only while real file titles remain editable
- Added smoke coverage that asserts fixed surface titles stay read-only in the rendered Tasks editor
- Universal Search now dismisses on outside clicks while keeping its result buttons interactive
- Primary sidebar navigation now exposes the active page with `aria-current="page"`
- The outside-click search dismissal assertion is now committed with the released smoke suite
- Search results that match a Sheets cell now open the workbook with the matching cell selected in the grid and formula bar
- Tasks can be exported as versioned JSON while retaining completion, project, and due metadata
- Home Activity’s “See all” now opens the shared Recent workspace instead of ending in a silent no-op
- Local-only Share, Invite, Night mode, cell-link, and slide-design controls now provide explicit status feedback
- Calendar Today, Previous, and new-event dates now follow the browser’s actual date instead of the seeded demo date
- Calendar Month view now places saved local events in the matching stored day column
- Calendar Month view keeps pre-date-metadata local events visible on the current day during migration
- Calendar Month now renders a complete six-week grid with muted adjacent-month days and date-aware saved events
- Calendar Previous/Next now move by week in Day/Week mode and by month in Month mode; Today resets either view
- Refreshed the committed Home preview so its My day rail matches the live browser date
- Sheets CSV exports now use the current saved workbook title with safe filename characters
- CI now runs a Playwright smoke suite across desktop/mobile routes, page errors, overflow, and the full Calendar Month grid
- Mobile Home’s Recent filter row now stays within the viewport while remaining horizontally scrollable
- Pages subpath builds now opt in explicitly, so local and CI smoke previews test root-mounted assets reliably
- CI installs Playwright Chromium before running the route and layout smoke suite
- Smoke coverage now includes a repository-prefixed `/Crescent-Suite/forms` direct route
- Global Search now matches current Docs, Sheets cell values, Slides body text, Notes body text, and Forms question labels
- CI smoke checks now exercise a seeded Docs body search in addition to route, layout, and Month-grid coverage
- SearchResults now deduplicates against live workspace records so renamed files do not leave stale seeded entries
- Local reloads now normalize partial version-1 workspace data so newer suite surfaces retain safe defaults
- Settings backup restores now use the same workspace normalizer, keeping partial or older local backups safe to import
- Empty Slides or Notes arrays in an imported backup now fall back to a safe starter item instead of leaving an editor without a current record
- Docs Export now downloads a standalone responsive HTML document with the current content, title, and a safe filename
- Sheets CSV export now includes the full nine-row visible range instead of truncating lower-row edits
- Forms builders can now remove questions locally while keeping one safe question in the form; respondent Preview stays focused and hides builder controls
- Forms builders can cycle each question between Short answer, Long answer, and Scale while preserving the local response flow
- Drive New file prompts for a title, preserves the previous Docs record in local Trash, and lets Restore recover it without silently discarding the replacement document
- Settings backup smoke coverage waits for the local restore confirmation before checking the restored Forms defaults, keeping CI deterministic
- Forms retain a local response history, show saved answers and timestamps in a dedicated Responses view, and include the history in JSON exports
- Sheets now support COUNT and COUNTA over visible ranges alongside SUM, AVERAGE, MIN, MAX, and ratio formulas
- Calendar events created in the local workspace now render in the Week/Day timeline at the time entered in the event prompt
- Calendar event prompts recognize “Tomorrow” and “Yesterday” when assigning the saved event date
- Forms response history can be exported as a clean CSV with question labels, answers, timestamps, and optional email addresses
- Drive → Trash → Restore now preserves whether the recovered Docs record was starred
- Notes and Tasks now use the same Starred metadata preservation when items move through local Trash and return
- Tasks due chips now cycle through Today, Tomorrow, Friday, and No date with local persistence
- Added a committed Tasks preview showing the interactive Tomorrow state
- Forms Long answer questions now render a resizable textarea in Preview mode
- The live Recent/Starred surfaces now reflect the current task, and task Starred state survives Trash recovery
- Home/Recent now includes the latest locally saved Calendar event with its entered timing text
- Forms correctly returns the action label to “Submit response” when Allow one response is turned off after a previous submission
- Respondent text and Long answer controls now expose their question text as accessible labels
- Calendar ICS export now writes `DTSTART` times for local events such as “3:00 PM,” with an all-day fallback when no time is entered
- Sidebar Workspaces and Projects can now be created locally, persisted in the workspace backup, and restored on this device
- Workspace backups normalize older string-style workspace/project entries before rendering them in the sidebar
- Home Recent rows are keyboard-operable without nesting a favorite control inside another interactive button
- Global Search now finds custom Workspaces and Projects and routes them back to Drive
- Creating a Workspace also creates an empty local Drive folder with the same name
- Added a committed preview showing a custom workspace in the sidebar and its matching Drive folder
- CI now verifies that a focused Home Recent row opens with Enter, alongside the independent Starred action
- Custom Workspace colors now map safely to the four available Drive folder treatments, including imported values
- Drive New folder now guards against duplicate names and confirms successful local creation
- CI now verifies a new Drive folder remains after a full page reload
- Added a committed Home preview showing Global Search finding a custom Workspace
- Workspace backups now synthesize safe folder names, counts, and supported colors for incomplete folder records
- Home Recent no longer resurrects the seeded Task card after every local Task has been deleted
- New Tasks can be assigned to any local Project from the same persistent Project list
- Added a committed Tasks preview showing the Project selector alongside local due dates and progress
- Task creation deduplicates project choices case-insensitively, keeping seeded and custom labels consistent
- The smoke report now names the Project-linked task path it verifies
- The sidebar now scrolls safely as local Workspaces and Projects grow beyond the initial shell
- Backup migration preserves string-style Drive folder names while still filling missing metadata safely
- Added a committed Forms builder screenshot showing editable question types, required state, delete controls, and Scale responses
- Home’s “Ask Crescent anything…” card now focuses the shared global search and matches its real local-first behavior
- Sheets local formulas now support SUM, AVERAGE, MIN, and MAX over visible cell ranges
- CI smoke now verifies the new local formula path and Forms type/delete controls in addition to routes, layout, search, and Calendar Month
- Home now greets the local browser with morning, afternoon, or evening language and the committed dashboard preview reflects the current time
- Renaming a starred Docs, Sheets, Slides, Forms, or Notes record now carries its local favorite state to the new title
- CI smoke now verifies that a renamed starred Docs record appears under its new title in Starred
- Slides presentation mode now advances with ArrowRight/Space, moves back with ArrowLeft, and exits with Escape; CI smoke covers the interaction
- Sheets AVERAGE results now display to two decimals for readable local analysis output
- Docs’ Body toolbar control is now a real local style selector for Body, Heading, and Quote blocks
- Refreshed the committed Docs preview after the editor toolbar polish
- CI smoke now verifies the Docs Text style selector in addition to the route and editor surfaces
- Updated CHANGELOG.md with the complete current overnight milestone summary and verification record
- Calendar Week now renders Sunday through Saturday, while Day remains one column and Month keeps its six-week grid
- Calendar Day remains anchored to the displayed date after the seven-day Week refactor; smoke now checks the visible one-column state
- Calendar Week headings and subheadings now use the same Sunday-start anchor as the seven visible day columns
- Refreshed the committed Calendar preview after the heading alignment
- PWA manifest start, scope, and icon paths are now relative so installs remain correct under the GitHub Pages `/Crescent-Suite/` subpath
- CI smoke checks the relative manifest, and the Pages-base build is verified against the repository asset prefix
- CI smoke now imports a partial Settings backup and verifies schema defaults plus persisted Form settings
- Notes, Slides, and Forms exports now sanitize titles with the same safe filename helper as Docs and Sheets
- CI smoke now exports a slash-containing Form title and verifies the downloaded filename stays filesystem-safe
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
- Global Search now indexes the current Docs, Sheets, Slides, and Notes workspace content alongside tasks, folders, and events
- Creating a blank document in Drive makes that new title immediately discoverable through Search
- Home’s Recent filters and the Recent utility view now include the saved Forms workspace file
- Slides decks now have an editable, persisted title while individual slide titles remain searchable
- Updated committed Home and Forms preview screenshots to show the current suite surface and Recent workspace state
- Calendar Previous and Today controls now move and reset the displayed week/month context while preserving local events
- Sheets Add sheet creates a real local tab with independent cells and restores the active tab after reload
- Sheets Undo and Redo now track recent workbook edits, including cell edits and tab creation
- Updated the committed Sheets preview with the new Sheet 2 tab and independent cell surface
- Forms response settings for collecting emails and allowing one response now have real, persisted toggle states
- Docs outline buttons now scroll to the matching saved heading in the document
- Forms email collection adds a respondent email field, and one-response mode disables duplicate submission after saving
- Tasks now have a real delete action that moves the item to the local Trash surface and survives reloads
- Refreshed the committed Forms Preview screenshot to show email collection and respondent-facing controls
- Trash now offers Restore for deleted Tasks, returning them to the active Tasks list and removing the Trash record
- Task restore preserves the original project, due label, completion state, and task id
- Updated the committed visual preview index to the current release and documented the latest Sheets and Forms captures
- Added a committed Trash screenshot showing a recoverable deleted task
- Updated the visual archive header to match the latest committed preview set
- Re-captured the Trash preview after the page animation settled for a clearer GitHub review image
- Forms blocks submission with a local message when email collection is enabled but the email field is empty
- Forms now blocks incomplete required questions, including unanswered scale questions, before saving a response
- Shared editor breadcrumb home buttons now expose an accessible “Back to Home” name across Docs, Sheets, Slides, Calendar, Drive, and Forms
- Forms theme swatches now change and persist the cover treatment, with a selected state and respondent-facing color variants
- Slides theme swatches now expose selected state and labels, and the speaker-note plus button focuses the note editor
- Drive folder cards now select locally, update the page context, and show a clear folder-selection panel
- Drive’s Recent files “See all” action now routes to the shared Recent surface
- Docs, Sheets, and Notes editor icon controls now expose explicit accessible labels
- Sheet cell editing remains targeted to the active cell after the toolbar-label pass
- Sheets Bold and Italic now apply to the selected cell and persist across reloads
- Sheets alignment state is stored alongside the cell style for future formatting expansion
- Home file rows can add or remove local favorites, and Starred reflects those changes after reload
- Docs’ Outline “+” now appends a real editable section and persists it in the document body
- Forms now rejects malformed email addresses before saving a response when email collection is enabled
- Direct app paths such as `/forms` open the matching Crescent surface, while in-app navigation and browser Back/Forward remain coherent
- Notes can be deleted into local Trash and restored with their original title, body, color, and id
- Direct app routing also recognizes repository-prefixed paths such as `/Crescent-Suite/forms`
- The Pages artifact includes a `404.html` app fallback and base-aware favicon/manifest links for direct URL loads
- Notes now export the selected note as a plain-text `.txt` file alongside Docs HTML and Sheets CSV export
- Slides now export the full deck as a self-contained HTML document with escaped title/body content
- Forms now export their questions, response settings, and saved local response as JSON
- Help, Profile, and More projects shell controls explain their local-only or not-yet-connected state; Workspace and Project “+” controls create persistent local entries
- Forms creators can toggle each question between Required and Optional, with the state saved locally and reflected in Preview
- The committed visual archive now captures that Required state in the Forms builder
- Home’s Continue working and Recent shelves now use current local Docs, Sheets, Slides, and Notes titles
- Drive’s Recent files shelf mirrors the same live workspace records, so creating a draft no longer leaves stale demo cards behind
- Settings can download a versioned JSON backup of the local workspace and restore it later on the same device
- Backup and restore stay local-first; no account or external storage connection is required
- Docs now derives its outline from the current document title and headings
- The Docs cover title follows renamed or newly created drafts instead of showing seeded copy
- Forms builder question labels are editable and persist in the local workspace
- Preview mode renders respondent-facing text without exposing builder inputs
- Forms titles are editable, saved locally, and discoverable through Global Search
- Starred, Shared with me, and Trash now show filtered or empty states instead of duplicating Recent files
- Home Recent filters now include Calendar and Drive alongside the core editors
- Drive’s New file action now opens a real blank local Docs draft instead of reopening seeded content

Everything is stored in this browser under a versioned local workspace key. No external account connection is required for this release.

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL printed in the terminal.

## Progress

Milestones are intentionally published as small, reviewable steps so the product can be inspected visually over time.
