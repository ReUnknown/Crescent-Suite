# Crescent Suite

An all-in-one productivity workspace built to keep the work in one calm, consistent place.

## Current release

**v0.1.47 — Preview index catches up**

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
