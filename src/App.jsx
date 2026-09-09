import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowRight,
  Bold,
  CalendarCheck2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Command,
  Download,
  FilePlus2,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  FolderPlus,
  FormInput,
  Grid2X2,
  HardDrive,
  Home,
  Italic,
  LayoutDashboard,
  Link,
  List,
  ListChecks,
  Menu,
  MoreHorizontal,
  NotebookPen,
  Play,
  Plus,
  Presentation,
  Redo2,
  Search,
  Settings2,
  Share2,
  Sparkles,
  Star,
  StickyNote,
  Trash2,
  Undo2,
  UsersRound,
  X,
} from "lucide-react";

const STORAGE_KEY = "crescent-suite:workspace:v1";

const APP_META = [
  { id: "docs", label: "Docs", icon: FileText, color: "blue", description: "Write with clarity" },
  { id: "sheets", label: "Sheets", icon: FileSpreadsheet, color: "green", description: "Make data useful" },
  { id: "slides", label: "Slides", icon: Presentation, color: "gold", description: "Tell the story" },
  { id: "notes", label: "Notes", icon: StickyNote, color: "lilac", description: "Catch the spark" },
  { id: "tasks", label: "Tasks", icon: ListChecks, color: "violet", description: "Move work forward" },
  { id: "calendar", label: "Calendar", icon: CalendarDays, color: "periwinkle", description: "Own your time" },
  { id: "drive", label: "Drive", icon: HardDrive, color: "rainbow", description: "Keep it together" },
  { id: "forms", label: "Forms", icon: FormInput, color: "peach", description: "Ask better questions" },
];

const INITIAL_WORKSPACE = {
  version: 1,
  docs: {
    title: "Product strategy Q3 2024",
    body: `<h1>Product strategy Q3 2024</h1><p class="doc-lede">A focused plan for making Crescent the calmest place to do great work.</p><h2>North star</h2><p>Make the workspace feel obvious at every moment: one home for the work, one consistent language, and fewer reasons to context-switch.</p><h2>Three moves</h2><ul><li>Ship a dependable core of Docs, Sheets, and Slides.</li><li>Make every surface share the same navigation and saved-work model.</li><li>Use small moments of delight to reward momentum without adding noise.</li></ul><blockquote>Clarity is a feature. The best tool is the one that gets out of the way.</blockquote><p><strong>Next review:</strong> Friday at 2:00 PM</p>`,
    updatedAt: "2 hours ago",
  },
  sheets: {
    title: "Growth metrics",
    cells: {
      A1: "Channel", B1: "Visits", C1: "Leads", D1: "Conversion", E1: "Owner", F1: "Trend",
      A2: "Organic", B2: "8420", C2: "486", D2: "=C2/B2", E2: "Jordan", F2: "+18%",
      A3: "Partners", B3: "4210", C3: "318", D3: "=C3/B3", E3: "Taylor", F3: "+11%",
      A4: "Product hunt", B4: "2960", C4: "214", D4: "=C4/B4", E4: "Sam", F4: "+26%",
      A5: "Community", B5: "1840", C5: "=SUM(C2:C4)", D5: "=C5/B5", E5: "Alex", F5: "+9%",
    },
    updatedAt: "5 hours ago",
  },
  slides: [
    { title: "From ideas to impact", body: "A clearer way to move from the first spark to the work that matters.", accent: "lilac", notes: "Open with the problem: too many tabs, too much switching, not enough focus." },
    { title: "One calm workspace", body: "Every tool, connected by one consistent language and a shared sense of place.", accent: "blue", notes: "" },
    { title: "Make room for momentum", body: "Less switching. More making. Crescent brings the work back into focus.", accent: "gold", notes: "" },
  ],
  notes: [
    { id: 1, title: "Meeting notes", body: "Capture decisions, owners, and the one thing that needs to happen next.", color: "lilac", updatedAt: "Yesterday" },
    { id: 2, title: "Launch ideas", body: "A softer onboarding, a faster blank page, a little more delight in the details.", color: "blue", updatedAt: "2 days ago" },
    { id: 3, title: "Reading list", body: "Tools that respect attention. Products that make the next step feel obvious.", color: "gold", updatedAt: "3 days ago" },
  ],
  tasks: [
    { id: 1, title: "Review the launch brief", project: "Product launch", due: "Today", complete: false },
    { id: 2, title: "Send the design review deck", project: "Website redesign", due: "Today", complete: false },
    { id: 3, title: "Share growth metrics", project: "Q3 planning", due: "Tomorrow", complete: true },
    { id: 4, title: "Set up the customer interview", project: "Product launch", due: "Friday", complete: false },
  ],
  forms: [
    { id: 1, label: "What are you working on?", type: "Long answer", required: true },
    { id: 2, label: "How clear is the next step?", type: "Scale", required: true },
    { id: 3, label: "Anything else to share?", type: "Short answer", required: false },
  ],
  driveFolders: [
    { name: "Product", items: 12, color: 0 },
    { name: "Marketing", items: 8, color: 1 },
    { name: "Design", items: 14, color: 2 },
    { name: "Operations", items: 5, color: 3 },
  ],
};

const RECENT_FILES = [
  { title: "Product strategy Q3 2024", type: "Docs", icon: FileText, color: "blue", opened: "2 hours ago", owner: "Me", starred: true },
  { title: "Growth metrics", type: "Sheets", icon: FileSpreadsheet, color: "green", opened: "5 hours ago", owner: "Me", starred: false },
  { title: "Design review deck", type: "Slides", icon: Presentation, color: "gold", opened: "1 day ago", owner: "Taylor Kim", starred: true },
  { title: "Meeting notes", type: "Notes", icon: StickyNote, color: "lilac", opened: "1 day ago", owner: "Me", starred: false },
  { title: "Q3 planning", type: "Tasks", icon: ListChecks, color: "violet", opened: "2 days ago", owner: "Jordan Lee", starred: false },
  { title: "Editorial calendar", type: "Calendar", icon: CalendarDays, color: "periwinkle", opened: "3 days ago", owner: "Me", starred: true },
  { title: "Launch assets", type: "Drive", icon: HardDrive, color: "rainbow", opened: "3 days ago", owner: "Me", starred: false },
];

const SCHEDULE = [
  { time: "9:00 AM", end: "9:45 AM", title: "Product sync", color: "lilac" },
  { time: "10:00 AM", end: "11:00 AM", title: "Design review", color: "blue" },
  { time: "1:00 PM", end: "3:00 PM", title: "Focus time", color: "green" },
  { time: "4:00 PM", end: "4:30 PM", title: "Marketing check-in", color: "peach" },
];

function loadWorkspace() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return INITIAL_WORKSPACE;
    const parsed = JSON.parse(stored);
    return parsed?.version === 1 ? { ...INITIAL_WORKSPACE, ...parsed } : INITIAL_WORKSPACE;
  } catch {
    return INITIAL_WORKSPACE;
  }
}

function useWorkspace() {
  const [workspace, setWorkspace] = useState(loadWorkspace);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  }, [workspace]);
  const update = useCallback((patch) => setWorkspace((current) => ({ ...current, ...patch })), []);
  return [workspace, update];
}

function AppIcon({ app, size = 18 }) {
  const Icon = app.icon;
  return <span className={`app-icon app-icon-${app.color}`}><Icon size={size} strokeWidth={2.2} /></span>;
}

function BrandMark({ small = false }) {
  return <div className={`brand-mark ${small ? "brand-mark-small" : ""}`} aria-label="Crescent">
    <span className="crescent-shape" />
    {!small && <span className="brand-word">CRESCENT</span>}
  </div>;
}

function Sidebar({ activeApp, onNavigate, open, onClose }) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "recent", label: "Recent", icon: Clock3 },
    { id: "starred", label: "Starred", icon: Star },
    { id: "shared", label: "Shared with me", icon: UsersRound },
    { id: "trash", label: "Trash", icon: Trash2 },
  ];
  return <>
    {open && <button className="sidebar-scrim" onClick={onClose} aria-label="Close navigation" />}
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-header"><BrandMark /><button className="icon-button sidebar-close" onClick={onClose} aria-label="Close navigation"><X size={18} /></button></div>
      <nav className="sidebar-nav" aria-label="Primary">
        {navItems.map(({ id, label, icon: Icon }) => <button key={id} className={`sidebar-link ${activeApp === id ? "active" : ""}`} onClick={() => onNavigate(id)}><Icon size={18} /><span>{label}</span></button>)}
      </nav>
      <div className="sidebar-divider" />
      <div className="sidebar-section-head"><span>Workspaces</span><button className="icon-button muted" aria-label="Add workspace"><Plus size={17} /></button></div>
      <div className="workspace-list">
        {["Product", "Marketing", "Design", "Operations", "Personal"].map((workspace, index) => <button className="workspace-link" key={workspace} onClick={() => onNavigate("drive")}><span className={`workspace-dot dot-${index}`} />{workspace}</button>)}
      </div>
      <div className="sidebar-section-head projects-head"><span>Projects</span><button className="icon-button muted" aria-label="Add project"><Plus size={17} /></button></div>
      <div className="project-list">
        {["Q3 Planning", "Website Redesign", "Product Launch", "Team Offsite"].map((project) => <button className="project-link" key={project} onClick={() => onNavigate("drive")}><FileText size={16} />{project}</button>)}
        <button className="project-link project-more"><MoreHorizontal size={16} />More projects...</button>
      </div>
      <div className="sidebar-quote"><div className="quote-orbit"><span className="quote-moon" /></div><p>A more focused way to work</p></div>
    </aside>
  </>;
}

function Header({ activeApp, onOpenSidebar, query, onQueryChange, onNavigate, workspace }) {
  const title = activeApp === "home" ? "Home" : APP_META.find((app) => app.id === activeApp)?.label ?? "Crescent";
  return <header className="topbar">
    <button className="mobile-menu icon-button" onClick={onOpenSidebar} aria-label="Open navigation"><Menu size={20} /></button>
    <div className="mobile-title"><BrandMark small /><span>{title}</span></div>
    <div className="global-search"><Search size={19} /><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search across Crescent..." aria-label="Search across Crescent" /><kbd><Command size={13} />K</kbd></div>
    <div className="topbar-actions"><button className="icon-button" aria-label="Help"><CircleHelp size={19} /></button><button className="icon-button" aria-label="Settings" onClick={() => onNavigate("settings")}><Settings2 size={19} /></button><div className="topbar-divider" /><button className="profile-button" aria-label="Open profile"><span>A</span><ChevronDown size={15} /></button></div>
    {query && <SearchResults query={query} onNavigate={onNavigate} workspace={workspace} />}
  </header>;
}

function SearchResults({ query, onNavigate, workspace }) {
  const localResults = [
    ...(workspace.tasks ?? []).map((task) => ({ title: task.title, type: "Tasks", opened: task.due, owner: "Me", icon: ListChecks, color: "violet" })),
    ...(workspace.driveFolders ?? []).map((folder) => ({ title: folder.name, type: "Drive", opened: `${folder.items} items`, owner: "Me", icon: HardDrive, color: "rainbow" })),
    ...(workspace.calendarEvents ?? []).map((event) => ({ title: event.title, type: "Calendar", opened: event.when, owner: "Me", icon: CalendarDays, color: "periwinkle" })),
  ];
  const results = [...RECENT_FILES, ...localResults].filter((file) => `${file.title} ${file.type} ${file.opened}`.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  return <div className="search-results"><div className="search-results-heading">Search results</div>{results.length ? results.map((file) => <button key={`${file.type}-${file.title}`} className="search-result" onClick={() => onNavigate(file.type.toLowerCase())}><AppIcon app={{ ...file, id: file.type.toLowerCase() }} size={16} /><span><strong>{file.title}</strong><small>{file.type} · {file.opened}</small></span><ArrowRight size={15} /></button>) : <div className="search-empty">No files match “{query}”.</div>}</div>;
}

function HomeView({ workspace, onNavigate }) {
  const [filter, setFilter] = useState("All");
  const files = filter === "All" ? RECENT_FILES : RECENT_FILES.filter((file) => file.type === filter);
  const localSchedule = (workspace.calendarEvents ?? []).slice(0, 2).map((event) => ({ ...event, time: "Saved", end: "Local", color: "periwinkle" }));
  return <div className="home-layout page-enter">
    <main className="home-main">
      <section className="home-hero">
        <div><h1>Good evening, Alex</h1><p>Pick up where you left off, or start something new.</p></div>
        <div className="hero-moon"><span className="hero-moon-shape" /><span>A calmer<br />brighter you</span></div>
      </section>
      <section className="app-launcher" aria-label="Crescent apps">
        {APP_META.map((app) => <button className="app-launch" key={app.id} onClick={() => onNavigate(app.id)}><AppIcon app={app} size={23} /><span>{app.label}</span><small>{app.description}</small></button>)}
      </section>
      <section className="workspace-section">
        <div className="section-heading"><div><h2>Continue working</h2><p>Jump back into the work that is already in motion.</p></div><button className="quiet-button" onClick={() => onNavigate("recent")}>See all <ArrowRight size={15} /></button></div>
        <div className="continue-row">{RECENT_FILES.slice(0, 4).map((file) => <button className="continue-card" key={file.title} onClick={() => onNavigate(file.type.toLowerCase())}><div className={`file-preview preview-${file.color}`}><PreviewArt type={file.type} /></div><div className="file-meta"><span><AppIcon app={{ ...file, id: file.type.toLowerCase() }} size={14} />{file.type}</span><MoreHorizontal size={15} /></div><strong>{file.title}</strong><small>Edited {file.opened}</small></button>)}</div>
      </section>
      <section className="workspace-section recent-section">
        <div className="section-heading"><div><h2>Recent</h2><p>The latest files across your workspaces.</p></div><div className="filter-row">{["All", "Docs", "Sheets", "Slides", "Notes", "Tasks"].map((item) => <button className={filter === item ? "filter-button selected" : "filter-button"} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
        <div className="recent-table"><div className="recent-table-head"><span>Name</span><span>Type</span><span>Last opened</span><span>Owner</span><span aria-label="Actions" /></div>{files.map((file) => <button className="recent-row" key={file.title} onClick={() => onNavigate(file.type.toLowerCase())}><span className="file-name"><AppIcon app={{ ...file, id: file.type.toLowerCase() }} size={18} /><strong>{file.title}</strong></span><span>{file.type}</span><span>{file.opened}</span><span>{file.owner}</span><span className="row-actions">{file.starred ? <Star size={16} fill="currentColor" /> : <Star size={16} />}<MoreHorizontal size={17} /></span></button>)}</div>
      </section>
    </main>
    <aside className="home-rail">
      <section className="rail-card day-card"><div className="rail-heading"><div><h3>My day</h3><p>Tue, Apr 23</p></div><button className="text-link" onClick={() => onNavigate("calendar")}>View calendar</button></div>{[...SCHEDULE, ...localSchedule].map((event) => <div className="schedule-row" key={`${event.title}-${event.time}`}><div className="schedule-time"><span>{event.time}</span><span>{event.end}</span></div><span className={`schedule-bar bar-${event.color}`} /><strong>{event.title}</strong></div>)}</section>
      <section className="rail-card activity-card"><div className="rail-heading"><h3>Activity</h3><button className="text-link">See all <ArrowRight size={14} /></button></div>{[{ initials: "TK", color: "lilac", text: "Taylor Kim commented on", target: "Design review deck", time: "10 minutes ago" }, { initials: "JL", color: "green", text: "Jordan Lee edited", target: "Growth metrics", time: "1 hour ago" }, { initials: "SC", color: "violet", text: "Sam Chen shared", target: "Launch assets with you", time: "3 hours ago" }].map((item) => <div className="activity-row" key={item.initials}><span className={`avatar avatar-${item.color}`}>{item.initials}</span><p>{item.text} <strong>{item.target}</strong><small>{item.time}</small></p></div>)}<div className="activity-task"><CalendarCheck2 size={18} /><p>You have <strong>3 tasks due tomorrow</strong><small>5 hours ago</small></p></div></section>
      <button className="ask-card" onClick={() => onNavigate("notes")}><span className="ask-icon"><Sparkles size={16} /></span><span className="ask-copy"><strong>Ask Crescent anything...</strong><small>Find files, draft content, set reminders...</small></span><ArrowRight size={18} /></button>
    </aside>
  </div>;
}

function PreviewArt({ type }) {
  if (type === "Sheets") return <div className="preview-sheet"><span /><span /><span /><i /><i /><i /></div>;
  if (type === "Slides") return <div className="preview-slide"><span>From ideas<br />to impact</span><i /></div>;
  if (type === "Notes") return <div className="preview-notes"><i /><i /><i /><i /></div>;
  return <div className="preview-doc"><i /><i /><i /><i /></div>;
}

function EditorHeader({ title, icon, onChangeTitle, children, onNavigate }) {
  return <div className="editor-header"><div className="editor-breadcrumb"><button onClick={() => onNavigate("home")} className="crumb-home"><Home size={15} /></button><ChevronRight size={14} /><span className="editor-app-label"><AppIcon app={icon} size={15} />{icon.label}</span><ChevronRight size={14} /><input value={title} onChange={(event) => onChangeTitle(event.target.value)} aria-label="File title" /></div><div className="editor-actions"><span className="saved-status"><Check size={14} />Saved locally</span>{children}</div></div>;
}

function DocsView({ workspace, update, onNavigate }) {
  const [title, setTitle] = useState(workspace.docs.title);
  const editorRef = useRef(null);
  const icon = APP_META.find((app) => app.id === "docs");
  useEffect(() => { if (editorRef.current && editorRef.current.innerHTML !== workspace.docs.body) editorRef.current.innerHTML = workspace.docs.body; }, [workspace.docs.body]);
  const updateDoc = (nextBody = editorRef.current?.innerHTML ?? workspace.docs.body) => update({ docs: { ...workspace.docs, title, body: nextBody, updatedAt: "just now" } });
  const exec = (command, value = undefined) => { editorRef.current?.focus(); document.execCommand(command, false, value); updateDoc(); };
  return <div className="editor-page page-enter docs-page"><EditorHeader title={title} icon={icon} onChangeTitle={(value) => { setTitle(value); update({ docs: { ...workspace.docs, title: value, updatedAt: "just now" } }); }} onNavigate={onNavigate}><button className="secondary-button" onClick={() => downloadText(`${title || "crescent-doc"}.html`, editorRef.current?.innerHTML ?? "", "text/html")}><Download size={16} />Export</button><button className="primary-button"><Share2 size={16} />Share</button></EditorHeader><div className="editor-subbar"><div className="toolbar-group"><button onClick={() => exec("undo")} aria-label="Undo"><Undo2 size={16} /></button><button onClick={() => exec("redo")} aria-label="Redo"><Redo2 size={16} /></button></div><div className="toolbar-divider" /><div className="toolbar-group"><button onClick={() => exec("bold")} aria-label="Bold"><Bold size={16} /></button><button onClick={() => exec("italic")} aria-label="Italic"><Italic size={16} /></button><button onClick={() => exec("formatBlock", "h2")} aria-label="Heading"><span className="toolbar-text">H2</span></button><button onClick={() => exec("insertUnorderedList")} aria-label="Bullet list"><List size={16} /></button><button onClick={() => exec("justifyLeft")} aria-label="Align left"><AlignLeft size={16} /></button><button onClick={() => exec("justifyCenter")} aria-label="Align center"><AlignCenter size={16} /></button><button onClick={() => exec("justifyRight")} aria-label="Align right"><AlignRight size={16} /></button><button onClick={() => exec("createLink", window.prompt("Link URL") || "")} aria-label="Add link"><Link size={16} /></button></div><div className="toolbar-divider" /><button className="toolbar-select">Body <ChevronDown size={14} /></button><div className="editor-zoom">100% <ChevronDown size={14} /></div></div><div className="doc-workspace"><aside className="doc-outline"><div className="outline-heading"><span>Outline</span><button className="icon-button muted"><Plus size={15} /></button></div><button className="outline-link active">Product strategy Q3 2024</button><button className="outline-link">North star</button><button className="outline-link">Three moves</button><button className="outline-link">Next review</button><div className="outline-footer"><span>Words</span><strong>{(editorRef.current?.innerText ?? "").trim().split(/\s+/).filter(Boolean).length || 72}</strong></div></aside><article className="document-paper"><div className="document-inner" ref={editorRef} contentEditable suppressContentEditableWarning onInput={() => updateDoc()} onBlur={() => updateDoc()} /></article><aside className="doc-inspector"><div className="inspector-heading"><span>Details</span><button className="icon-button muted"><X size={15} /></button></div><div className="inspector-section"><span className="inspector-label">Cover</span><div className="cover-preview"><div className="cover-moon" /><strong>Product strategy<br />Q3 2024</strong><small>CRESCENT / PRODUCT</small></div></div><div className="inspector-section"><span className="inspector-label">People</span><div className="person-row"><span className="avatar avatar-lilac">A</span><div><strong>Alex Morgan</strong><small>Owner</small></div><ChevronDown size={15} /></div><button className="add-person"><Plus size={15} />Invite someone</button></div></aside></div></div>;
}

const SHEET_COLS = ["A", "B", "C", "D", "E", "F"];
const SHEET_ROWS = Array.from({ length: 9 }, (_, index) => index + 1);

function evaluateCell(value, cells) {
  if (typeof value !== "string" || !value.startsWith("=")) return value;
  const sumMatch = value.match(/^=SUM\(([A-F]\d+):([A-F]\d+)\)$/i);
  if (sumMatch) {
    const [, start, end] = sumMatch;
    const column = start[0].toUpperCase();
    const startRow = Number(start.slice(1));
    const endRow = Number(end.slice(1));
    return Array.from({ length: endRow - startRow + 1 }, (_, index) => Number(evaluateCell(cells[`${column}${startRow + index}`] ?? "", cells)) || 0).reduce((sum, item) => sum + item, 0);
  }
  const ratio = value.match(/^=([A-F]\d+)\/([A-F]\d+)$/i);
  if (ratio) return ((Number(evaluateCell(cells[ratio[1].toUpperCase()] ?? "", cells)) || 0) / (Number(evaluateCell(cells[ratio[2].toUpperCase()] ?? "", cells)) || 1)).toFixed(2);
  return value;
}

function SheetInsights({ cells }) {
  const rows = SHEET_ROWS.slice(1).map((row) => ({ channel: cells[`A${row}`] ?? "", visits: Number(evaluateCell(cells[`B${row}`] ?? "", cells)) || 0, leads: Number(evaluateCell(cells[`C${row}`] ?? "", cells)) || 0 })).filter((row) => row.channel);
  const totalVisits = rows.reduce((sum, row) => sum + row.visits, 0);
  const totalLeads = rows.reduce((sum, row) => sum + row.leads, 0);
  const conversion = totalVisits ? ((totalLeads / totalVisits) * 100).toFixed(1) : "0.0";
  const maxVisits = Math.max(...rows.map((row) => row.visits), 1);
  return <div className="sheet-insights"><div className="sheet-insights-heading"><div><span className="utility-kicker"><Sparkles size={14} />Crescent insight</span><h2>Growth at a glance</h2><p>Quick signals from the cells in this sheet.</p></div><span className="sheet-insights-status"><span />Calculated locally</span></div><div className="insight-cards"><div className="insight-card"><small>Total visits</small><strong>{totalVisits.toLocaleString()}</strong><span>Across {rows.length} channels</span></div><div className="insight-card"><small>Total leads</small><strong>{totalLeads.toLocaleString()}</strong><span>Qualified actions</span></div><div className="insight-card"><small>Conversion</small><strong>{conversion}%</strong><span>Leads ÷ visits</span></div></div><div className="insight-chart"><div className="insight-chart-head"><span>Visits by channel</span><small>Source: Growth metrics</small></div>{rows.map((row) => <div className="insight-bar-row" key={row.channel}><span>{row.channel}</span><div><i style={{ width: `${Math.max(6, (row.visits / maxVisits) * 100)}%` }} /></div><strong>{row.visits.toLocaleString()}</strong></div>)}</div></div>;
}

function SheetsView({ workspace, update, onNavigate }) {
  const [selected, setSelected] = useState("B2");
  const [view, setView] = useState("grid");
  const icon = APP_META.find((app) => app.id === "sheets");
  const cells = workspace.sheets.cells;
  const updateCell = (cell, value) => update({ sheets: { ...workspace.sheets, cells: { ...cells, [cell]: value }, updatedAt: "just now" } });
  const exportCsv = () => { const csv = SHEET_ROWS.slice(0, 6).map((row) => SHEET_COLS.map((col) => JSON.stringify(evaluateCell(cells[`${col}${row}`] ?? "", cells))).join(",")).join("\n"); downloadText("growth-metrics.csv", csv, "text/csv"); };
  return <div className="editor-page page-enter sheets-page"><EditorHeader title={workspace.sheets.title} icon={icon} onChangeTitle={(value) => update({ sheets: { ...workspace.sheets, title: value, updatedAt: "just now" } })} onNavigate={onNavigate}><button className="secondary-button" onClick={exportCsv}><Download size={16} />Export CSV</button><button className="primary-button"><Share2 size={16} />Share</button></EditorHeader><div className="sheet-toolbar"><div className="sheet-toolbar-group"><button><Undo2 size={16} /></button><button><Redo2 size={16} /></button><button className="toolbar-select">100% <ChevronDown size={14} /></button><div className="toolbar-divider" /><button><Bold size={16} /></button><button><Italic size={16} /></button><button><AlignLeft size={16} /></button><button><Link size={16} /></button></div><div className="sheet-view-switch"><button className={view === "grid" ? "selected" : ""} onClick={() => setView("grid")} aria-pressed={view === "grid"}><Grid2X2 size={15} />Grid</button><button className={view === "insights" ? "selected" : ""} onClick={() => setView("insights")} aria-pressed={view === "insights"}><LayoutDashboard size={15} />Insights</button></div></div><div className={`formula-bar ${view === "insights" ? "sheet-utility-hidden" : ""}`}><span className="name-box">{selected}</span><span className="formula-symbol">fx</span><input value={cells[selected] ?? ""} onChange={(event) => updateCell(selected, event.target.value)} aria-label="Formula bar" /></div>{view === "insights" ? <SheetInsights cells={cells} /> : <><div className="sheet-canvas"><div className="sheet-grid"><div className="sheet-corner" />{SHEET_COLS.map((column) => <div className="sheet-col-label" key={column}>{column}</div>)}{SHEET_ROWS.map((row) => <div className="sheet-row" key={row}><div className="sheet-row-label">{row}</div>{SHEET_COLS.map((column) => { const cell = `${column}${row}`; const isSelected = cell === selected; const isHeader = row === 1; return <div className={`sheet-cell ${isSelected ? "selected" : ""} ${isHeader ? "sheet-header-cell" : ""}`} key={cell}><input value={cells[cell] ?? ""} onChange={(event) => updateCell(cell, event.target.value)} onFocus={() => setSelected(cell)} aria-label={`Cell ${cell}`} /><span className="sheet-display">{evaluateCell(cells[cell] ?? "", cells)}</span></div>; })}</div>)}</div></div><div className="sheet-status"><span><span className="status-dot" />Saved locally</span><span>{Object.keys(cells).length} populated cells</span><span>Sheet 1 <ChevronDown size={14} /></span><button><Plus size={15} />Add sheet</button></div></>}
  </div>;
}

function SlidesView({ workspace, update, onNavigate }) {
  const [active, setActive] = useState(0);
  const [presenting, setPresenting] = useState(false);
  const icon = APP_META.find((app) => app.id === "slides");
  const slides = workspace.slides;
  const current = slides[active] ?? slides[0];
  const updateCurrent = (patch) => update({ slides: slides.map((slide, index) => index === active ? { ...slide, ...patch } : slide) });
  const addSlide = () => { update({ slides: [...slides, { title: "A new chapter", body: "Add a thought worth sharing.", accent: "blue", notes: "" }] }); setActive(slides.length); };
  return <div className="editor-page page-enter slides-page"><EditorHeader title="Design review deck" icon={icon} onChangeTitle={() => {}} onNavigate={onNavigate}><button className="secondary-button" onClick={() => setPresenting(true)}><Play size={16} />Present</button><button className="primary-button"><Share2 size={16} />Share</button></EditorHeader><div className="slide-workspace"><aside className="slide-rail"><div className="slide-rail-heading"><span>Slides <small>{slides.length}</small></span><button className="icon-button muted" onClick={addSlide}><Plus size={16} /></button></div>{slides.map((slide, index) => <button key={`${slide.title}-${index}`} className={`slide-thumb ${active === index ? "selected" : ""}`} onClick={() => setActive(index)}><span className={`thumb-canvas thumb-${slide.accent}`}><small>{index + 1}</small><strong>{slide.title}</strong></span><span>Slide {index + 1}</span></button>)}</aside><main className="slide-main"><div className={`presentation-canvas canvas-${current.accent}`}><div className="canvas-orbit" /><span className="canvas-kicker">CRESCENT / DESIGN REVIEW</span><h1 contentEditable suppressContentEditableWarning onBlur={(event) => updateCurrent({ title: event.currentTarget.textContent })}>{current.title}</h1><p contentEditable suppressContentEditableWarning onBlur={(event) => updateCurrent({ body: event.currentTarget.textContent })}>{current.body}</p><span className="canvas-page">{String(active + 1).padStart(2, "0")} — {String(slides.length).padStart(2, "0")}</span></div><div className="slide-notes"><span>Speaker notes</span><button className="icon-button muted"><Plus size={16} /></button><textarea placeholder="Add a note for this slide..." value={current.notes ?? ""} onChange={(event) => updateCurrent({ notes: event.target.value })} /></div></main><aside className="slide-inspector"><div className="inspector-heading"><span>Design</span><button className="icon-button muted"><SlidersIcon /></button></div><div className="inspector-section"><span className="inspector-label">Theme</span><div className="theme-options"><button className="theme-swatch swatch-lilac" onClick={() => updateCurrent({ accent: "lilac" })} /><button className="theme-swatch swatch-blue" onClick={() => updateCurrent({ accent: "blue" })} /><button className="theme-swatch swatch-gold" onClick={() => updateCurrent({ accent: "gold" })} /></div></div><div className="inspector-section"><span className="inspector-label">Layout</span><button className="layout-option selected"><span className="layout-preview layout-title" /><span>Title & body</span><Check size={15} /></button><button className="layout-option"><span className="layout-preview layout-quote" /><span>Big statement</span></button></div></aside></div>{presenting && <div className="presentation-overlay"><button className="presentation-close icon-button" aria-label="Close presentation" onClick={() => setPresenting(false)}><X size={21} /></button><div className={`presentation-stage canvas-${current.accent}`}><span className="canvas-kicker">CRESCENT / DESIGN REVIEW</span><h1>{current.title}</h1><p>{current.body}</p><span className="canvas-page">{String(active + 1).padStart(2, "0")} — {String(slides.length).padStart(2, "0")}</span></div><button className="presentation-prev icon-button" onClick={() => setActive(Math.max(0, active - 1))}><ChevronLeft /></button><button className="presentation-next icon-button" onClick={() => setActive(Math.min(slides.length - 1, active + 1))}><ChevronRight /></button></div>}</div>;
}

function SlidersIcon() { return <Settings2 size={16} />; }

function NotesView({ workspace, update, onNavigate }) {
  const [selected, setSelected] = useState(workspace.notes[0]?.id ?? 1);
  const note = workspace.notes.find((item) => item.id === selected) ?? workspace.notes[0];
  const updateNote = (patch) => update({ notes: workspace.notes.map((item) => item.id === note.id ? { ...item, ...patch, updatedAt: "Just now" } : item) });
  const addNote = () => { const id = Date.now(); update({ notes: [{ id, title: "Untitled note", body: "Start writing...", color: "blue", updatedAt: "Just now" }, ...workspace.notes] }); setSelected(id); };
  return <div className="notes-page page-enter"><EditorHeader title="Notes" icon={APP_META.find((app) => app.id === "notes")} onChangeTitle={() => {}} onNavigate={onNavigate}><button className="primary-button" onClick={addNote}><Plus size={16} />New note</button></EditorHeader><div className="notes-workspace"><aside className="notes-list"><div className="notes-list-head"><span>All notes</span><button className="icon-button muted" onClick={addNote}><FolderPlus size={16} /></button></div>{workspace.notes.map((item) => <button className={`note-list-item ${item.id === selected ? "selected" : ""}`} key={item.id} onClick={() => setSelected(item.id)}><span className={`note-dot note-dot-${item.color}`} /><span><strong>{item.title}</strong><small>{item.body}</small><em>{item.updatedAt}</em></span></button>)}</aside><main className="note-editor"><div className="note-editor-top"><span className={`note-dot note-dot-${note.color}`} /> <input value={note.title} onChange={(event) => updateNote({ title: event.target.value })} aria-label="Note title" /><span className="saved-status"><Check size={14} />Saved</span></div><textarea value={note.body} onChange={(event) => updateNote({ body: event.target.value })} aria-label="Note body" /><div className="note-footer"><span><NotebookPen size={15} />Plain text note</span><span>{note.body.length} characters</span></div></main></div></div>;
}

function TasksView({ workspace, update, onNavigate }) {
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const filterOrder = ["all", "today", "open", "done"];
  const filterLabels = { all: "All", today: "Today", open: "Open", done: "Done" };
  const toggle = (id) => update({ tasks: workspace.tasks.map((task) => task.id === id ? { ...task, complete: !task.complete } : task) });
  const addTask = (event) => { event.preventDefault(); if (!newTask.trim()) return; update({ tasks: [{ id: Date.now(), title: newTask.trim(), project: "Personal", due: "Today", complete: false }, ...workspace.tasks] }); setNewTask(""); };
  const openCount = workspace.tasks.filter((task) => !task.complete).length;
  const visibleTasks = workspace.tasks.filter((task) => filter === "all" || (filter === "today" ? task.due === "Today" : filter === "open" ? !task.complete : task.complete));
  const cycleFilter = () => setFilter((current) => filterOrder[(filterOrder.indexOf(current) + 1) % filterOrder.length]);
  return <div className="tasks-page page-enter"><EditorHeader title="Tasks" icon={APP_META.find((app) => app.id === "tasks")} onChangeTitle={() => {}} onNavigate={onNavigate}><button className="secondary-button" onClick={cycleFilter}><SlidersIcon />{filterLabels[filter]}</button><button className="primary-button" onClick={() => document.querySelector(".new-task-input")?.focus()}><Plus size={16} />New task</button></EditorHeader><div className="tasks-content"><div className="tasks-heading"><div><h1>Make room for momentum.</h1><p>{openCount} open tasks across your workspace.</p></div><div className="task-progress"><span><i style={{ width: `${Math.max(8, ((workspace.tasks.length - openCount) / Math.max(workspace.tasks.length, 1)) * 100)}%` }} /></span><small>{workspace.tasks.length - openCount} completed</small></div></div><form className="new-task" onSubmit={addTask}><Plus size={19} /><input className="new-task-input" value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="Add a task and press enter..." aria-label="New task" /></form><section className="task-list"><div className="task-list-heading"><span>{filterLabels[filter]}</span><small>{visibleTasks.length} task{visibleTasks.length === 1 ? "" : "s"}</small></div>{visibleTasks.map((task) => <div className={`task-row ${task.complete ? "complete" : ""}`} key={task.id}><button className="task-check" onClick={() => toggle(task.id)} aria-label={`Mark ${task.title} ${task.complete ? "open" : "complete"}`}>{task.complete && <Check size={14} />}</button><div className="task-copy"><strong>{task.title}</strong><span>{task.project}</span></div><span className={`task-due ${task.due === "Today" ? "due-today" : ""}`}>{task.due}</span><button className="icon-button muted"><MoreHorizontal size={17} /></button></div>)}</section></div></div>;
}

function CalendarView({ workspace, update, onNavigate }) {
  const [mode, setMode] = useState("week");
  const localEvents = workspace.calendarEvents ?? [];
  const addEvent = () => {
    const title = window.prompt("Event title", "New focus block");
    if (!title?.trim()) return;
    const when = window.prompt("When should it happen?", "Tomorrow · 3:00 PM");
    if (!when?.trim()) return;
    update({ calendarEvents: [{ id: Date.now(), title: title.trim(), when: when.trim() }, ...localEvents] });
    emitNotice("Event saved in this local workspace.");
  };
  const removeEvent = (id) => update({ calendarEvents: localEvents.filter((event) => event.id !== id) });
  const monthDays = [
    { label: "Sun", date: 21, events: [] },
    { label: "Mon", date: 22, events: [] },
    { label: "Tue", date: 23, events: ["Product sync", "Design review", "Focus time", ...localEvents.map((event) => event.title)] },
    { label: "Wed", date: 24, events: ["Customer interview"] },
    { label: "Thu", date: 25, events: ["Launch review"] },
    { label: "Fri", date: 26, events: [] },
    { label: "Sat", date: 27, events: [] },
  ];
  const weekCalendar = <div className={`calendar-grid ${mode === "day" ? "calendar-grid-day" : ""}`}><div className="calendar-axis"><span /><span>9 AM</span><span>10 AM</span><span>11 AM</span><span>12 PM</span><span>1 PM</span><span>2 PM</span><span>3 PM</span><span>4 PM</span><span>5 PM</span></div><div className="calendar-day"><div className="calendar-day-head"><span>Today</span><strong>23</strong></div><div className="calendar-lines">{Array.from({ length: 9 }, (_, index) => <span key={index} />)}<div className="calendar-event event-one"><strong>Product sync</strong><small>Team · 9:00–9:45</small></div><div className="calendar-event event-two"><strong>Design review</strong><small>Design · 10:00–11:00</small></div><div className="calendar-event event-three"><strong>Focus time</strong><small>Personal · 1:00–3:00</small></div><div className="calendar-event event-four"><strong>Marketing check-in</strong><small>Marketing · 4:00–4:30</small></div></div></div><div className="calendar-day muted-day"><div className="calendar-day-head"><span>Wed</span><strong>24</strong></div><div className="calendar-lines">{Array.from({ length: 9 }, (_, index) => <span key={index} />)}<div className="calendar-event event-five"><strong>Customer interview</strong><small>Research · 11:00–12:00</small></div></div></div><div className="calendar-day muted-day"><div className="calendar-day-head"><span>Thu</span><strong>25</strong></div><div className="calendar-lines">{Array.from({ length: 9 }, (_, index) => <span key={index} />)}<div className="calendar-event event-six"><strong>Launch review</strong><small>Product · 2:00–3:00</small></div></div></div></div>;
  const monthCalendar = <div className="calendar-month-grid">{monthDays.map((day) => <div className={`calendar-month-cell ${day.date === 23 ? "today" : ""}`} key={day.date}><div className="calendar-month-head"><span>{day.label}</span><strong>{day.date}</strong></div><div className="calendar-month-events">{day.events.map((event, index) => <span className={`calendar-month-event month-event-${index % 4}`} key={`${day.date}-${event}`}>{event}</span>)}</div></div>)}</div>;
  return <div className="calendar-page page-enter"><EditorHeader title="Calendar" icon={APP_META.find((app) => app.id === "calendar")} onChangeTitle={() => {}} onNavigate={onNavigate}><button className="secondary-button"><ChevronLeft size={16} />Previous</button><button className="secondary-button">Today</button><button className="primary-button" onClick={addEvent}><Plus size={16} />Event</button></EditorHeader><div className="calendar-content"><div className="calendar-heading"><div><h1>Tuesday, April 23</h1><p>{mode === "month" ? "April 2024 · Product workspace" : mode === "day" ? "Tuesday · Product workspace" : "Week 17 · Product workspace"}</p></div><div className="calendar-switch"><button className={mode === "day" ? "selected" : ""} onClick={() => setMode("day")} aria-pressed={mode === "day"}>Day</button><button className={mode === "week" ? "selected" : ""} onClick={() => setMode("week")} aria-pressed={mode === "week"}>Week</button><button className={mode === "month" ? "selected" : ""} onClick={() => setMode("month")} aria-pressed={mode === "month"}>Month</button></div></div>{localEvents.length > 0 && <section className="calendar-local-events" aria-label="Saved local events"><div className="calendar-local-heading"><div><span className="utility-kicker"><CalendarCheck2 size={14} />Saved locally</span><h2>Your Crescent events</h2></div><small>{localEvents.length} event{localEvents.length === 1 ? "" : "s"}</small></div><div className="calendar-local-list">{localEvents.map((event) => <div className="calendar-local-card" key={event.id}><span className="calendar-local-dot" /><div><strong>{event.title}</strong><small>{event.when}</small></div><button className="icon-button muted" onClick={() => removeEvent(event.id)} aria-label={`Remove ${event.title}`}><Trash2 size={15} /></button></div>)}</div></section>}{mode === "month" ? monthCalendar : weekCalendar}</div></div>;
}

function _DriveViewLegacy({ onNavigate }) {
  const folders = ["Product", "Marketing", "Design", "Operations"];
  return <div className="drive-page page-enter"><EditorHeader title="Drive" icon={APP_META.find((app) => app.id === "drive")} onChangeTitle={() => {}} onNavigate={onNavigate}><button className="secondary-button"><FolderPlus size={16} />New folder</button><button className="primary-button"><FilePlus2 size={16} />New file</button></EditorHeader><div className="drive-content"><div className="drive-heading"><div><h1>Everything in one place.</h1><p>Organize your work without losing the thread.</p></div><div className="drive-view"><button className="selected"><Grid2X2 size={16} /></button><button><List size={16} /></button></div></div><div className="drive-section"><div className="drive-section-title"><span>Folders</span><small>4 folders</small></div><div className="folder-grid">{folders.map((folder, index) => <button className="folder-card" key={folder}><span className={`folder-icon folder-${index}`}><FolderOpen size={21} /></span><strong>{folder}</strong><small>{[12, 8, 14, 5][index]} items</small><MoreHorizontal size={17} /></button>)}</div></div><div className="drive-section"><div className="drive-section-title"><span>Recent files</span><button className="text-link">See all <ArrowRight size={14} /></button></div><div className="drive-file-grid">{RECENT_FILES.slice(0, 6).map((file) => <button className="drive-file" key={file.title} onClick={() => onNavigate(file.type.toLowerCase())}><div className={`drive-file-preview preview-${file.color}`}><PreviewArt type={file.type} /></div><div><AppIcon app={{ ...file, id: file.type.toLowerCase() }} size={15} /><strong>{file.title}</strong></div><small>{file.type} · {file.opened}</small></button>)}</div></div></div></div>;
}

function DriveView({ workspace, update, onNavigate }) {
  const [view, setView] = useState("grid");
  const folders = workspace.driveFolders ?? [
    { name: "Product", items: 12, color: 0 },
    { name: "Marketing", items: 8, color: 1 },
    { name: "Design", items: 14, color: 2 },
    { name: "Operations", items: 5, color: 3 },
  ];
  const createFolder = () => {
    const name = window.prompt("Folder name", "New workspace");
    if (!name?.trim()) return;
    update({ driveFolders: [...folders, { name: name.trim(), items: 0, color: folders.length % 4 }] });
  };
  return <div className="drive-page page-enter"><EditorHeader title="Drive" icon={APP_META.find((app) => app.id === "drive")} onChangeTitle={() => {}} onNavigate={onNavigate}><button className="secondary-button" onClick={createFolder}><FolderPlus size={16} />New folder</button><button className="primary-button" onClick={() => onNavigate("docs")}><FilePlus2 size={16} />New file</button></EditorHeader><div className="drive-content"><div className="drive-heading"><div><h1>Everything in one place.</h1><p>Organize your work without losing the thread.</p></div><div className="drive-view"><button className={view === "grid" ? "selected" : ""} onClick={() => setView("grid")} aria-label="Grid view"><Grid2X2 size={16} /></button><button className={view === "list" ? "selected" : ""} onClick={() => setView("list")} aria-label="List view"><List size={16} /></button></div></div><div className="drive-section"><div className="drive-section-title"><span>Folders</span><small>{folders.length} folders</small></div><div className={`folder-grid ${view === "list" ? "folder-list-view" : ""}`}>{folders.map((folder) => <button className="folder-card" key={folder.name}><span className={`folder-icon folder-${folder.color}`}><FolderOpen size={21} /></span><strong>{folder.name}</strong><small>{folder.items} items</small><MoreHorizontal size={17} /></button>)}</div></div><div className="drive-section"><div className="drive-section-title"><span>Recent files</span><button className="text-link">See all <ArrowRight size={14} /></button></div><div className={`drive-file-grid ${view === "list" ? "drive-list-view" : ""}`}>{RECENT_FILES.slice(0, 6).map((file) => <button className="drive-file" key={file.title} onClick={() => onNavigate(file.type.toLowerCase())}><div className={`drive-file-preview preview-${file.color}`}><PreviewArt type={file.type} /></div><div><AppIcon app={{ ...file, id: file.type.toLowerCase() }} size={15} /><strong>{file.title}</strong></div><small>{file.type} · {file.opened}</small></button>)}</div></div></div></div>;
}

function _FormsViewLegacy({ workspace, update, onNavigate }) {
  const [published, setPublished] = useState(false);
  const addQuestion = () => update({ forms: [...workspace.forms, { id: Date.now(), label: "New question", type: "Short answer", required: false }] });
  return <div className="forms-page page-enter"><EditorHeader title="Launch feedback" icon={APP_META.find((app) => app.id === "forms")} onChangeTitle={() => {}} onNavigate={onNavigate}><button className="secondary-button"><EyeIcon />Preview</button><button className="primary-button" onClick={() => setPublished(true)}><Share2 size={16} />{published ? "Published" : "Publish"}</button></EditorHeader><div className="forms-content"><div className="forms-heading"><div><h1>Launch feedback</h1><p>Ask the questions that help the next move become obvious.</p></div><span className={`publish-status ${published ? "is-published" : ""}`}><span />{published ? "Live" : "Draft"}</span></div><div className="form-builder"><div className="form-preview"><div className="form-cover"><div className="form-cover-orbit" /><span>CRESCENT / FEEDBACK</span><h2>Help us make the next release better.</h2><p>A two-minute check-in for the people who use the work.</p></div><div className="form-questions">{workspace.forms.map((question, index) => <div className="form-question" key={question.id}><span>{index + 1}</span><div><strong>{question.label}</strong><small>{question.type} {question.required && "· Required"}</small><div className="fake-input">{question.type === "Scale" ? <>{[1, 2, 3, 4, 5].map((value) => <button key={value}>{value}</button>)}</> : "Your answer..."}</div></div></div>)}<button className="add-question" onClick={addQuestion}><Plus size={16} />Add question</button></div></div><aside className="form-settings"><div className="inspector-heading"><span>Form settings</span><Settings2 size={16} /></div><div className="inspector-section"><span className="inspector-label">Responses</span><div className="setting-row"><span>Collect email addresses</span><button className="toggle" aria-label="Collect email addresses"><i /></button></div><div className="setting-row"><span>Allow one response</span><button className="toggle active" aria-label="Allow one response"><i /></button></div></div><div className="inspector-section"><span className="inspector-label">Theme</span><div className="form-theme"><button className="theme-swatch swatch-lilac" /><button className="theme-swatch swatch-blue" /><button className="theme-swatch swatch-gold" /></div></div></aside></div></div></div>;
}

function FormsView({ workspace, update, onNavigate }) {
  const [published, setPublished] = useState(workspace.formPublished ?? false);
  const [submitted, setSubmitted] = useState(workspace.lastFormResponse?.saved ?? false);
  const [scale, setScale] = useState(workspace.lastFormResponse?.scale ?? null);
  const [answers, setAnswers] = useState(workspace.lastFormResponse?.answers ?? {});
  const [previewing, setPreviewing] = useState(false);
  const addQuestion = () => update({ forms: [...workspace.forms, { id: Date.now(), label: "New question", type: "Short answer", required: false }] });
  const publishForm = () => { setPublished(true); update({ formPublished: true }); };
  const submitResponse = () => { setSubmitted(true); update({ lastFormResponse: { saved: true, scale, answers } }); emitNotice("Response saved in this local workspace."); };
  return <div className="forms-page page-enter"><EditorHeader title="Launch feedback" icon={APP_META.find((app) => app.id === "forms")} onChangeTitle={() => {}} onNavigate={onNavigate}><button className="secondary-button" onClick={() => setPreviewing((current) => !current)}><EyeIcon />{previewing ? "Edit form" : "Preview"}</button><button className="primary-button" onClick={publishForm}><Share2 size={16} />{published ? "Published" : "Publish"}</button></EditorHeader><div className={`forms-content ${previewing ? "forms-preview-mode" : ""}`}><div className="forms-heading"><div><h1>Launch feedback</h1><p>Ask the questions that help the next move become obvious.</p></div><span className={`publish-status ${published ? "is-published" : ""}`}><span />{published ? "Live" : "Draft"}</span></div><div className="form-builder"><div className="form-preview"><div className="form-cover"><div className="form-cover-orbit" /><span>CRESCENT / FEEDBACK</span><h2>Help us make the next release better.</h2><p>A two-minute check-in for the people who use the work.</p></div><div className="form-questions">{workspace.forms.map((question, index) => <div className="form-question" key={question.id}><span>{index + 1}</span><div><strong>{question.label}</strong><small>{question.type} {question.required && "· Required"}</small>{question.type === "Scale" ? <div className="fake-input scale-input">{[1, 2, 3, 4, 5].map((value) => <button className={scale === value ? "selected" : ""} key={value} onClick={() => setScale(value)}>{value}</button>)}</div> : <input className="form-input" value={answers[question.id] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} placeholder="Your answer..." />}</div></div>)}<button className="add-question" onClick={addQuestion}><Plus size={16} />Add question</button><button className="form-submit" onClick={submitResponse}>{submitted ? <><Check size={16} />Response saved</> : "Submit response"}</button>{submitted && <p className="form-success"><CheckCircle2 size={14} />Thanks — your response is saved locally.</p>}</div></div><aside className="form-settings"><div className="inspector-heading"><span>Form settings</span><Settings2 size={16} /></div><div className="inspector-section"><span className="inspector-label">Responses</span><div className="setting-row"><span>Collect email addresses</span><button className="toggle" aria-label="Collect email addresses"><i /></button></div><div className="setting-row"><span>Allow one response</span><button className="toggle active" aria-label="Allow one response"><i /></button></div></div><div className="inspector-section"><span className="inspector-label">Theme</span><div className="form-theme"><button className="theme-swatch swatch-lilac" /><button className="theme-swatch swatch-blue" /><button className="theme-swatch swatch-gold" /></div></div></aside></div></div></div>;
}

function EyeIcon() { return <span className="eye-icon">◉</span>; }

function UtilityView({ id, onNavigate }) {
  const labels = { recent: ["Recent files", "Everything you touched lately, in one quiet list."], starred: ["Starred", "The files you want close at hand."], shared: ["Shared with me", "Work that has arrived from the people around you."], trash: ["Trash", "Files stay here until you are ready to let them go."], settings: ["Settings", "Shape Crescent around the way you work."] };
  const [title, description] = labels[id] ?? labels.recent;
  return <div className="utility-page page-enter"><div className="utility-heading"><div><span className="utility-kicker"><Sparkles size={14} />Crescent workspace</span><h1>{title}</h1><p>{description}</p></div><button className="primary-button" onClick={() => onNavigate("home")}><Home size={16} />Back home</button></div><div className="utility-panel">{id === "settings" ? <><div className="settings-row"><div><strong>Appearance</strong><small>Keep Crescent quiet after dark.</small></div><button className="theme-toggle"><MoonIcon /><span>Night</span><Check size={15} /></button></div><div className="settings-row"><div><strong>Local workspace</strong><small>Your work is saved in this browser. No account connection required.</small></div><span className="local-status"><span />Active</span></div><div className="settings-row"><div><strong>Keyboard shortcuts</strong><small>Open search with Command + K, then type any file or app.</small></div><kbd><Command size={13} />K</kbd></div></> : RECENT_FILES.map((file) => <button className="utility-file-row" key={file.title} onClick={() => onNavigate(file.type.toLowerCase())}><AppIcon app={{ ...file, id: file.type.toLowerCase() }} /><div><strong>{file.title}</strong><small>{file.type} · {file.opened} · {file.owner}</small></div><ArrowRight size={16} /></button>)}</div></div>;
}

function MoonIcon() { return <span className="moon-icon" />; }

function emitNotice(message) {
  window.dispatchEvent(new CustomEvent("crescent:notice", { detail: message }));
}

function downloadText(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [workspace, update] = useWorkspace();
  const [activeApp, setActiveApp] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const handleNotice = (event) => setNotice(event.detail);
    window.addEventListener("crescent:notice", handleNotice);
    return () => window.removeEventListener("crescent:notice", handleNotice);
  }, []);
  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [notice]);
  useEffect(() => {
    const handleActionFeedback = (event) => {
      const button = event.target.closest("button");
      const label = button?.textContent?.trim() ?? "";
      if (label === "Share") emitNotice("Share links will be available when Crescent Cloud is connected.");
      if (label.includes("New folder")) emitNotice("Folder added to this local workspace.");
      if (label.includes("New file")) emitNotice("Docs opened. Rename the breadcrumb title to start a new draft.");
    };
    document.addEventListener("click", handleActionFeedback);
    return () => document.removeEventListener("click", handleActionFeedback);
  }, []);
  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.querySelector(".global-search input")?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);
  const navigate = (id) => { setActiveApp(id); setQuery(""); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const currentView = useMemo(() => {
    if (activeApp === "home") return <HomeView workspace={workspace} onNavigate={navigate} />;
    if (activeApp === "docs") return <DocsView workspace={workspace} update={update} onNavigate={navigate} />;
    if (activeApp === "sheets") return <SheetsView workspace={workspace} update={update} onNavigate={navigate} />;
    if (activeApp === "slides") return <SlidesView workspace={workspace} update={update} onNavigate={navigate} />;
    if (activeApp === "notes") return <NotesView workspace={workspace} update={update} onNavigate={navigate} />;
    if (activeApp === "tasks") return <TasksView workspace={workspace} update={update} onNavigate={navigate} />;
    if (activeApp === "calendar") return <CalendarView workspace={workspace} update={update} onNavigate={navigate} />;
    if (activeApp === "drive") return <DriveView workspace={workspace} update={update} onNavigate={navigate} />;
    if (activeApp === "forms") return <FormsView workspace={workspace} update={update} onNavigate={navigate} />;
    return <UtilityView id={activeApp} onNavigate={navigate} />;
  }, [activeApp, workspace, update]);
  return <div className="app-shell"><Sidebar activeApp={activeApp} onNavigate={navigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="app-main"><Header activeApp={activeApp} onOpenSidebar={() => setSidebarOpen(true)} query={query} onQueryChange={setQuery} onNavigate={navigate} workspace={workspace} /><div className="app-content">{currentView}</div></div><div className={`toast ${notice ? "toast-visible" : ""}`} role="status" aria-live="polite"><CheckCircle2 size={16} />{notice}</div></div>;
}
