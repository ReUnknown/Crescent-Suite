import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
  Mail,
  MailOpen,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  NotebookPen,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Play,
  Plus,
  Presentation,
  Redo2,
  Search,
  Send,
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
const SIDEBAR_KEY = "crescent-suite:sidebar-collapsed:v1";
const FOCUS_APP_IDS = new Set(["docs", "sheets", "slides", "notes", "tasks", "calendar", "drive", "forms", "mail"]);

const APP_META = [
  { id: "docs", label: "Docs", icon: FileText, color: "blue", description: "Write with clarity" },
  { id: "sheets", label: "Sheets", icon: FileSpreadsheet, color: "green", description: "Make data useful" },
  { id: "slides", label: "Slides", icon: Presentation, color: "gold", description: "Tell the story" },
  { id: "notes", label: "Notes", icon: StickyNote, color: "lilac", description: "Catch the spark" },
  { id: "tasks", label: "Tasks", icon: ListChecks, color: "violet", description: "Move work forward" },
  { id: "calendar", label: "Calendar", icon: CalendarDays, color: "periwinkle", description: "Own your time" },
  { id: "drive", label: "Drive", icon: HardDrive, color: "rainbow", description: "Keep it together" },
  { id: "forms", label: "Forms", icon: FormInput, color: "peach", description: "Ask better questions" },
  { id: "mail", label: "Mail", icon: Mail, color: "peach", description: "Keep the thread" },
];

const INITIAL_WORKSPACE = {
  version: 1,
  demo: true,
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
  slidesTitle: "Design review deck",
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
  formTitle: "Launch feedback",
  formTheme: "lilac",
  formSettings: { collectEmail: false, oneResponse: true },
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
  workspaces: [
    { name: "Product", color: 0 },
    { name: "Marketing", color: 1 },
    { name: "Design", color: 2 },
    { name: "Operations", color: 3 },
    { name: "Personal", color: 4 },
  ],
  projects: ["Q3 Planning", "Website Redesign", "Product Launch", "Team Offsite"],
  mail: [
    { id: 1, from: "Taylor Kim", email: "taylor@crescent.local", subject: "Design review tomorrow", preview: "The latest pass is ready whenever you are.", body: "Hi Alex,\n\nThe latest pass on the design review deck is ready whenever you are. I tightened the story around the three moves and left a note on slide two.\n\nCould you take a look before our 10:00 AM review?\n\nTaylor", time: "10:24 AM", read: false, starred: true, tag: "Design" },
    { id: 2, from: "Jordan Lee", email: "jordan@crescent.local", subject: "Growth metrics are ready", preview: "I added the partner channel numbers to the shared sheet.", body: "Hey Alex,\n\nI added the partner channel numbers to Growth metrics and flagged the conversion row for our next check-in.\n\nJordan", time: "9:12 AM", read: true, starred: false, tag: "Q3 planning" },
    { id: 3, from: "Crescent Updates", email: "updates@crescent.local", subject: "A calmer way to start the week", preview: "Three small rituals for making room for momentum.", body: "A short note from the Crescent team:\n\nStart with one clear next step, keep the supporting context nearby, and leave a little room for the work to surprise you.\n\nCrescent", time: "Yesterday", read: true, starred: false, tag: "Updates" },
  ],
};

function createEmptyWorkspace() {
  return {
    version: 1,
    demo: false,
    docs: { title: "", body: "", updatedAt: "" },
    sheets: { title: "", cells: {}, tabs: [{ name: "Sheet 1", cells: {} }], activeSheet: 0, styles: {}, updatedAt: "" },
    slidesTitle: "",
    slides: [{ title: "", body: "", accent: "lilac", notes: "", layout: "title-body" }],
    notes: [],
    formTitle: "",
    formTheme: "lilac",
    formSettings: { collectEmail: false, oneResponse: false },
    formPublished: false,
    forms: [],
    formResponses: [],
    lastFormResponse: undefined,
    tasks: [],
    calendarEvents: [],
    deletedFiles: [],
    starredFiles: [],
    driveFolders: [],
    workspaces: [],
    projects: [],
    mail: [],
    guideDismissed: false,
  };
}

const RECENT_FILES = [
  { title: "Product strategy Q3 2024", type: "Docs", icon: FileText, color: "blue", opened: "2 hours ago", owner: "Me", starred: true },
  { title: "Growth metrics", type: "Sheets", icon: FileSpreadsheet, color: "green", opened: "5 hours ago", owner: "Me", starred: false },
  { title: "Design review deck", type: "Slides", icon: Presentation, color: "gold", opened: "1 day ago", owner: "Taylor Kim", starred: true },
  { title: "Meeting notes", type: "Notes", icon: StickyNote, color: "lilac", opened: "1 day ago", owner: "Me", starred: false },
  { title: "Q3 planning", type: "Tasks", icon: ListChecks, color: "violet", opened: "2 days ago", owner: "Jordan Lee", starred: false },
  { title: "Editorial calendar", type: "Calendar", icon: CalendarDays, color: "periwinkle", opened: "3 days ago", owner: "Me", starred: true },
  { title: "Launch assets", type: "Drive", icon: HardDrive, color: "rainbow", opened: "3 days ago", owner: "Me", starred: false },
  { title: "Design review tomorrow", type: "Mail", icon: Mail, color: "peach", opened: "10 minutes ago", owner: "Taylor Kim", starred: true },
];

const DRIVE_FILE_TYPES = [
  { type: "Docs", icon: FileText, color: "blue", description: "Write a document" },
  { type: "Sheets", icon: FileSpreadsheet, color: "green", description: "Shape the numbers" },
  { type: "Slides", icon: Presentation, color: "gold", description: "Build the story" },
  { type: "Notes", icon: StickyNote, color: "lilac", description: "Catch a thought" },
  { type: "Forms", icon: FormInput, color: "peach", description: "Ask a question" },
];

function getStarredTitles(workspace) {
  return new Set(Array.isArray(workspace.starredFiles) ? workspace.starredFiles : RECENT_FILES.filter((file) => file.starred).map((file) => file.title));
}

function renameStarredFile(workspace, previousTitle, nextTitle) {
  const starredTitles = getStarredTitles(workspace);
  if (!previousTitle || previousTitle === nextTitle || !starredTitles.has(previousTitle)) return [...starredTitles];
  starredTitles.delete(previousTitle);
  const normalizedNextTitle = String(nextTitle ?? "").trim();
  if (normalizedNextTitle) starredTitles.add(normalizedNextTitle);
  return [...starredTitles];
}

function getLiveRecentFiles(workspace) {
  const sourceFor = (type, fallback) => RECENT_FILES.find((file) => file.type === type) ?? fallback;
  const liveFiles = [
    workspace.docs?.title && { ...sourceFor("Docs"), title: workspace.docs.title, opened: workspace.docs.updatedAt ?? "just now", owner: "Me" },
    workspace.sheets?.title && { ...sourceFor("Sheets"), title: workspace.sheets.title, opened: workspace.sheets.updatedAt ?? "just now", owner: "Me" },
    (workspace.slidesTitle || workspace.slides?.[0]?.title) && { ...sourceFor("Slides"), title: workspace.slidesTitle || workspace.slides[0].title, opened: "just now", owner: "Me" },
    workspace.notes?.[0]?.title && { ...sourceFor("Notes"), title: workspace.notes[0].title, opened: workspace.notes[0].updatedAt ?? "just now", owner: "Me" },
    workspace.tasks?.[0]?.title && { ...sourceFor("Tasks"), title: workspace.tasks[0].title, opened: workspace.tasks[0].due ?? "just now", owner: "Me" },
    workspace.calendarEvents?.[0]?.title && { ...sourceFor("Calendar"), title: workspace.calendarEvents[0].title, opened: workspace.calendarEvents[0].when ?? "just now", owner: "Me" },
    workspace.formTitle && { ...sourceFor("Forms", { type: "Forms", icon: FormInput, color: "peach", owner: "Me", starred: false }), title: workspace.formTitle, opened: "just now", owner: "Me" },
    workspace.mail?.[0]?.subject && { ...sourceFor("Mail"), title: workspace.mail[0].subject, opened: workspace.mail[0].time ?? "just now", owner: workspace.mail[0].from ?? "Me" },
  ].filter(Boolean);
  const liveTypes = new Set(liveFiles.map((file) => file.type));
  const suppressedTypes = new Set();
  if (Array.isArray(workspace.tasks) && workspace.tasks.length === 0) suppressedTypes.add("Tasks");
  const starredTitles = getStarredTitles(workspace);
  const fallbackFiles = workspace.demo ? RECENT_FILES.filter((file) => !liveTypes.has(file.type) && !suppressedTypes.has(file.type)) : [];
  return [...liveFiles, ...fallbackFiles].map((file) => ({ ...file, starred: starredTitles.has(file.title) }));
}

function fileNavigationContext(file) {
  return file.type === "Drive" ? { fileTitle: file.title } : { title: file.title };
}

const SCHEDULE = [
  { time: "9:00 AM", end: "9:45 AM", title: "Product sync", color: "lilac" },
  { time: "10:00 AM", end: "11:00 AM", title: "Design review", color: "blue" },
  { time: "1:00 PM", end: "3:00 PM", title: "Focus time", color: "green" },
  { time: "4:00 PM", end: "4:30 PM", title: "Marketing check-in", color: "peach" },
];

function normalizeWorkspace(source) {
  const base = source?.demo === false ? createEmptyWorkspace() : INITIAL_WORKSPACE;
  const merged = { ...base, ...(source ?? {}) };
  const workspaces = Array.isArray(source?.workspaces) && source.workspaces.length
    ? source.workspaces.map((item, index) => typeof item === "string"
      ? { name: item, color: index % 5 }
      : { ...item, name: String(item?.name ?? `Workspace ${index + 1}`), color: Number.isFinite(item?.color) ? Math.abs(Math.trunc(item.color)) % 5 : index % 5 })
    : base.workspaces;
  const projects = Array.isArray(source?.projects)
    ? source.projects.map((item) => typeof item === "string" ? item : String(item?.name ?? "")).filter(Boolean)
    : base.projects;
  const driveFolders = Array.isArray(source?.driveFolders)
    ? source.driveFolders.map((folder, index) => {
      const record = folder && typeof folder === "object" ? folder : {};
      const items = Number(record.items);
      const color = Number(record.color);
      return {
        ...record,
        name: String(typeof folder === "string" ? folder : record.name ?? `Folder ${index + 1}`),
        items: Number.isFinite(items) ? Math.max(0, Math.trunc(items)) : 0,
        color: Number.isFinite(color) ? Math.abs(Math.trunc(color)) % 4 : index % 4,
      };
    })
    : base.driveFolders;
  const slides = Array.isArray(source?.slides) && source.slides.length
    ? source.slides.map((slide, index) => {
      const record = slide && typeof slide === "object" ? slide : {};
      const seed = base.slides[index % base.slides.length] ?? {};
      return { ...seed, ...record, title: String(record.title ?? seed.title ?? `Slide ${index + 1}`), body: String(record.body ?? seed.body ?? ""), accent: ["lilac", "blue", "gold"].includes(record.accent) ? record.accent : seed.accent, notes: String(record.notes ?? ""), layout: record.layout === "statement" ? "statement" : "title-body" };
    })
    : (Array.isArray(source?.slides) ? base.slides : base.slides);
  const notes = Array.isArray(source?.notes)
    ? source.notes.map((note, index) => {
      const record = note && typeof note === "object" ? note : {};
      const seed = base.notes[index % Math.max(base.notes.length, 1)] ?? { color: "blue" };
      return { ...seed, ...record, id: record.id ?? index + 1, title: String(record.title ?? seed.title ?? `Note ${index + 1}`), body: String(record.body ?? ""), color: ["lilac", "blue", "gold"].includes(record.color) ? record.color : seed.color, updatedAt: String(record.updatedAt ?? "Just now") };
    })
    : base.notes;
  const tasks = Array.isArray(source?.tasks)
    ? source.tasks.map((task, index) => {
      const record = task && typeof task === "object" ? task : {};
      return { ...record, id: record.id ?? index + 1, title: String(record.title ?? `Task ${index + 1}`), project: String(record.project ?? ""), due: String(record.due ?? "No date"), complete: Boolean(record.complete) };
    })
    : base.tasks;
  const forms = Array.isArray(source?.forms)
    ? source.forms.map((question, index) => {
      const record = question && typeof question === "object" ? question : {};
      return { ...record, id: record.id ?? index + 1, label: String(record.label ?? `Question ${index + 1}`), type: ["Short answer", "Long answer", "Scale"].includes(record.type) ? record.type : "Short answer", required: Boolean(record.required) };
    })
    : base.forms;
  const mail = Array.isArray(source?.mail)
    ? source.mail.map((message, index) => {
      const record = message && typeof message === "object" ? message : {};
      const seed = base.mail[index % Math.max(base.mail.length, 1)] ?? {};
      return { ...seed, ...record, id: record.id ?? index + 1, from: String(record.from ?? seed.from), email: String(record.email ?? seed.email), subject: String(record.subject ?? seed.subject), preview: String(record.preview ?? seed.preview), body: String(record.body ?? seed.body), time: String(record.time ?? "Just now"), read: Boolean(record.read), starred: Boolean(record.starred), tag: String(record.tag ?? seed.tag), sent: Boolean(record.sent), to: String(record.to ?? "") };
    })
    : base.mail;
  const calendarEvents = Array.isArray(source?.calendarEvents)
    ? source.calendarEvents.map((event, index) => {
      const record = event && typeof event === "object" ? event : {};
      return { ...record, id: record.id ?? index + 1, title: String(record.title ?? `Event ${index + 1}`), when: String(record.when ?? "No time"), ...(record.date ? { date: String(record.date) } : {}) };
    })
    : [];
  const deletedFiles = Array.isArray(source?.deletedFiles)
    ? source.deletedFiles.filter((file) => file && typeof file === "object").map((file, index) => {
      const type = ["Docs", "Sheets", "Slides", "Notes", "Tasks", "Calendar", "Drive", "Forms"].includes(file.type) ? file.type : "Docs";
      return { ...file, id: file.id ?? `deleted-${index + 1}`, title: String(file.title ?? `Deleted ${type}`), type, appId: file.appId ?? type.toLowerCase(), opened: String(file.opened ?? "Previously"), owner: String(file.owner ?? "Me"), starred: Boolean(file.starred) };
    })
    : [];
  const normalizeResponse = (response, index) => {
    const record = response && typeof response === "object" ? response : {};
    const submittedDate = record.submittedAt ? new Date(record.submittedAt) : null;
    const submittedAt = submittedDate && Number.isFinite(submittedDate.getTime()) ? submittedDate.toISOString() : undefined;
    const scaleAnswers = record.scaleAnswers && typeof record.scaleAnswers === "object"
      ? Object.fromEntries(Object.entries(record.scaleAnswers).flatMap(([questionId, value]) => { const normalized = Number(value); return Number.isInteger(normalized) && normalized >= 1 && normalized <= 5 ? [[questionId, normalized]] : []; }))
      : {};
    const legacyScale = Number(record.scale);
    return { ...record, id: record.id ?? index + 1, saved: true, submittedAt, scale: Number.isInteger(legacyScale) && legacyScale >= 1 && legacyScale <= 5 ? legacyScale : null, scaleAnswers, answers: record.answers && typeof record.answers === "object" ? record.answers : {} };
  };
  const formResponses = Array.isArray(source?.formResponses)
    ? source.formResponses.map(normalizeResponse)
    : source?.lastFormResponse?.saved ? [normalizeResponse(source.lastFormResponse, 0)] : [];
  const lastFormResponse = source?.lastFormResponse && typeof source.lastFormResponse === "object" ? normalizeResponse(source.lastFormResponse, 0) : undefined;
  return {
    ...merged,
    docs: { ...base.docs, ...(source?.docs ?? {}) },
    sheets: { ...base.sheets, ...(source?.sheets ?? {}) },
    slides,
    notes,
    tasks,
    forms,
    mail,
    driveFolders,
    workspaces,
    projects,
    calendarEvents,
    deletedFiles,
    formSettings: { ...base.formSettings, ...(source?.formSettings ?? {}) },
    formResponses,
    lastFormResponse,
    version: 1,
  };
}

function loadWorkspace() {
  try {
    const demoRequested = new window.URLSearchParams(window.location.search).get("demo") === "1";
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored && demoRequested) return INITIAL_WORKSPACE;
    if (!stored) return createEmptyWorkspace();
    const parsed = JSON.parse(stored);
    return parsed?.version === 1 ? normalizeWorkspace(parsed) : createEmptyWorkspace();
  } catch {
    return createEmptyWorkspace();
  }
}

function useWorkspace() {
  const [workspace, setWorkspace] = useState(loadWorkspace);
  const workspaceRef = useRef(workspace);
  workspaceRef.current = workspace;
  useEffect(() => {
    const persist = (notify = true) => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceRef.current)); } catch { if (notify) emitNotice("This workspace could not be saved locally."); }
    };
    const timeout = window.setTimeout(() => persist(), 180);
    const flushOnExit = () => persist(false);
    window.addEventListener("pagehide", flushOnExit);
    window.addEventListener("beforeunload", flushOnExit);
    return () => { window.clearTimeout(timeout); window.removeEventListener("pagehide", flushOnExit); window.removeEventListener("beforeunload", flushOnExit); };
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

function Sidebar({ activeApp, onNavigate, open, onClose, workspace, update, collapsed }) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "recent", label: "Recent", icon: Clock3 },
    { id: "starred", label: "Starred", icon: Star },
    { id: "shared", label: "Shared with me", icon: UsersRound },
    { id: "trash", label: "Trash", icon: Trash2 },
  ];
  const workspaces = workspace.workspaces ?? (workspace.demo ? INITIAL_WORKSPACE.workspaces : []);
  const projects = workspace.projects ?? (workspace.demo ? INITIAL_WORKSPACE.projects : []);
  const [addDialog, setAddDialog] = useState(null);
  const [addName, setAddName] = useState("");
  const openAddDialog = (kind) => { setAddDialog(kind); setAddName(kind === "workspace" ? "New workspace" : "New project"); };
  useEffect(() => {
    if (!addDialog) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setAddDialog(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [addDialog]);
  const addWorkspace = () => {
    const name = addName.trim();
    if (!name) return;
    if (workspaces.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      emitNotice("That workspace already exists.");
      return;
    }
    const color = workspaces.length % 5;
    const folderColor = workspaces.length % 4;
    const driveFolders = workspace.driveFolders ?? [];
    const hasFolder = driveFolders.some((folder) => folder.name.toLowerCase() === name.toLowerCase());
    update({ workspaces: [...workspaces, { name, color }], driveFolders: hasFolder ? driveFolders : [...driveFolders, { name, items: 0, color: folderColor }] });
    setAddDialog(null);
    emitNotice(`${name} workspace added locally.`);
  };
  const addProject = () => {
    const name = addName.trim();
    if (!name) return;
    if (projects.some((item) => item.toLowerCase() === name.toLowerCase())) {
      emitNotice("That project already exists.");
      return;
    }
    update({ projects: [...projects, name] });
    setAddDialog(null);
    emitNotice(`${name} project added locally.`);
  };
  return <>
    {open && <button className="sidebar-scrim" onClick={onClose} aria-label="Dismiss navigation" />}
    <aside className={`sidebar ${open ? "sidebar-open" : ""} ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-header"><BrandMark /><button className="icon-button sidebar-close" onClick={onClose} aria-label="Close navigation"><X size={18} /></button></div>
      <nav className="sidebar-nav" aria-label="Primary">
        {navItems.map(({ id, label, icon: Icon }) => <button key={id} className={`sidebar-link ${activeApp === id ? "active" : ""}`} onClick={() => onNavigate(id)} title={label} aria-label={label} aria-current={activeApp === id ? "page" : undefined}><Icon size={18} /><span>{label}</span></button>)}
      </nav>
      <div className="sidebar-divider" />
      <div className="sidebar-section-head"><span>Workspaces</span><button className="icon-button muted" onClick={() => openAddDialog("workspace")} aria-label="Add workspace" title="Add workspace"><Plus size={17} /></button></div>
      <div className="workspace-list">
        {workspaces.map((item, index) => <button className="workspace-link" key={`${item.name}-${index}`} onClick={() => onNavigate("drive", { folderName: item.name })} title={item.name} aria-label={item.name}><span className={`workspace-dot dot-${item.color ?? index % 5}`} /><span>{item.name}</span></button>)}
      </div>
      <div className="sidebar-section-head projects-head"><span>Projects</span><button className="icon-button muted" onClick={() => openAddDialog("project")} aria-label="Add project" title="Add project"><Plus size={17} /></button></div>
      <div className="project-list">
        {projects.map((project) => <button className="project-link" key={project} onClick={() => onNavigate("tasks", { project })} title={project} aria-label={project}><FileText size={16} /><span>{project}</span></button>)}
        <button className="project-link project-more" onClick={() => emitNotice("Add a project whenever you need a new focus area.")} title="More projects" aria-label="More projects"><MoreHorizontal size={16} /><span>More projects...</span></button>
      </div>
      <div className="sidebar-quote"><div className="quote-orbit"><span className="quote-moon" /></div><p>Make space for the work that matters.</p></div>
      {addDialog && <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAddDialog(null); }}><section className="file-create-dialog sidebar-create-dialog" role="dialog" aria-modal="true" aria-labelledby="sidebar-create-title"><div className="file-create-heading"><div><span className="utility-kicker">{addDialog === "workspace" ? <FolderPlus size={14} /> : <ListChecks size={14} />}{addDialog === "workspace" ? "New workspace" : "New project"}</span><h2 id="sidebar-create-title">{addDialog === "workspace" ? "Make room for a new space" : "Give the work a clear home"}</h2><p>{addDialog === "workspace" ? "Create a local folder for a team, theme, or part of your life." : "Projects keep related tasks together in one focused view."}</p></div><button className="icon-button muted" onClick={() => setAddDialog(null)} aria-label="Close create dialog"><X size={18} /></button></div><label className="file-name-field"><span>{addDialog === "workspace" ? "Workspace name" : "Project name"}</span><input autoFocus value={addName} aria-label={addDialog === "workspace" ? "Workspace name" : "Project name"} onChange={(event) => setAddName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addDialog === "workspace" ? addWorkspace() : addProject(); }} /></label><div className="file-create-footer"><span><HardDrive size={14} />Saved locally in this browser</span><div><button className="secondary-button" onClick={() => setAddDialog(null)}>Cancel</button><button className="primary-button" onClick={addDialog === "workspace" ? addWorkspace : addProject}>{addDialog === "workspace" ? <><FolderPlus size={16} />Add workspace</> : <><ListChecks size={16} />Add project</>}</button></div></div></section></div>}
    </aside>
  </>;
}

function Header({ activeApp, onOpenSidebar, onToggleSidebar, onOpenGuide, onToggleFocus, focusMode, sidebarCollapsed, query, onQueryChange, onNavigate, workspace }) {
  const utilityTitles = { recent: "Recent", starred: "Starred", shared: "Shared with me", trash: "Trash", settings: "Settings" };
  const title = activeApp === "home" ? "Home" : APP_META.find((app) => app.id === activeApp)?.label ?? utilityTitles[activeApp] ?? "Crescent";
  const handleSearchKeyDown = (event) => {
    const firstResult = document.querySelector(".search-result");
    if (event.key === "ArrowDown" && firstResult) { event.preventDefault(); firstResult.focus(); }
    if (event.key === "Enter" && firstResult) { event.preventDefault(); firstResult.click(); }
  };
  return <header className="topbar">
    <button className="mobile-menu icon-button" onClick={onOpenSidebar} aria-label="Open navigation"><Menu size={20} /></button>
    <div className="mobile-title"><BrandMark small /><span>{title}</span></div>
    <div className="global-search"><Search size={19} /><input value={query} onChange={(event) => onQueryChange(event.target.value)} onKeyDown={handleSearchKeyDown} placeholder="Search across Crescent..." aria-label="Search across Crescent" aria-expanded={Boolean(query)} aria-controls="crescent-search-results" aria-autocomplete="list" aria-haspopup="listbox" /><kbd><Command size={13} />K</kbd></div>
    <div className="topbar-actions"><button className="icon-button sidebar-toggle" aria-label={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"} title={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"} onClick={onToggleSidebar}>{sidebarCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}</button>{FOCUS_APP_IDS.has(activeApp) && <button className="icon-button focus-toggle" aria-label={focusMode ? "Exit focus mode" : "Enter focus mode"} title={focusMode ? "Exit focus mode" : "Enter focus mode"} onClick={onToggleFocus}>{focusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>}<button className="icon-button" aria-label="Open Crescent guide" onClick={onOpenGuide}><CircleHelp size={19} /></button><button className="icon-button" aria-label="Settings" onClick={() => onNavigate("settings")}><Settings2 size={19} /></button><div className="topbar-divider" /><button className="profile-button" aria-label="Local workspace" onClick={() => emitNotice("Crescent is running locally in this browser.")}><span>⌁</span><ChevronDown size={15} /></button></div>
    {query && <SearchResults query={query} onNavigate={onNavigate} workspace={workspace} />}
  </header>;
}

function SearchResults({ query, onNavigate, workspace }) {
  const appResults = APP_META.map((app) => ({ title: app.label, type: "App", opened: app.description, owner: "Crescent", icon: app.icon, color: app.color, appId: app.id }));
  const workspaceFiles = [
    workspace.docs?.title && { title: workspace.docs.title, type: "Docs", opened: workspace.docs.updatedAt ?? "just now", owner: "Me", icon: FileText, color: "blue" },
    workspace.sheets?.title && { title: workspace.sheets.title, type: "Sheets", opened: workspace.sheets.updatedAt ?? "just now", owner: "Me", icon: FileSpreadsheet, color: "green" },
    workspace.slidesTitle && { title: workspace.slidesTitle, type: "Slides", opened: "just now", owner: "Me", icon: Presentation, color: "gold" },
    ...(workspace.slides ?? []).map((slide) => ({ title: slide.title, type: "Slides", opened: "just now", owner: "Me", icon: Presentation, color: "gold" })),
    ...(workspace.notes ?? []).map((note) => ({ title: note.title, type: "Notes", opened: note.updatedAt ?? "just now", owner: "Me", icon: StickyNote, color: "lilac" })),
    workspace.formTitle && { title: workspace.formTitle, type: "Forms", opened: "just now", owner: "Me", icon: FormInput, color: "peach" },
    ...(workspace.mail ?? []).map((message) => ({ title: message.subject, type: "Mail", appId: "mail", opened: message.time ?? "just now", owner: message.from, icon: Mail, color: "peach" })),
  ].filter(Boolean);
  const localResults = [
    ...workspaceFiles,
    ...(workspace.tasks ?? []).map((task) => ({ title: task.title, type: "Tasks", opened: task.due, owner: "Me", icon: ListChecks, color: "violet" })),
    ...(workspace.driveFolders ?? []).map((folder) => ({ title: folder.name, type: "Drive", opened: `${folder.items} items`, owner: "Me", icon: HardDrive, color: "rainbow" })),
    ...(workspace.workspaces ?? []).map((item) => ({ title: item.name, type: "Drive", opened: "workspace", owner: "Me", icon: HardDrive, color: "rainbow" })),
    ...(workspace.projects ?? []).map((project) => ({ title: project, type: "Tasks", appId: "tasks", opened: "project", owner: "Me", icon: ListChecks, color: "violet" })),
    ...(workspace.calendarEvents ?? []).map((event) => ({ title: event.title, type: "Calendar", opened: event.when, owner: "Me", icon: CalendarDays, color: "periwinkle" })),
  ];
  const searchTextFor = (file) => {
    if (file.type === "Docs") return workspace.docs?.body?.replace(/<[^>]+>/g, " ") ?? "";
    if (file.type === "Sheets") return Object.values(workspace.sheets?.cells ?? {}).join(" ");
    if (file.type === "Slides") {
      const matchingSlide = (workspace.slides ?? []).find((slide) => slide.title === file.title);
      return matchingSlide ? `${matchingSlide.title} ${matchingSlide.body}` : workspace.slidesTitle ?? "";
    }
    if (file.type === "Notes") return workspace.notes?.find((note) => note.title === file.title)?.body ?? "";
    if (file.type === "Forms") return (workspace.forms ?? []).map((question) => question.label).join(" ");
    if (file.type === "Mail") {
      const message = workspace.mail?.find((item) => item.subject === file.title);
      return message ? `${message.from} ${message.email} ${message.to ?? ""} ${message.body}` : "";
    }
    if (file.type === "App") return file.opened;
    return "";
  };
  const mergedResults = new Map([...appResults, ...getLiveRecentFiles(workspace), ...localResults].map((file) => [`${file.type}-${file.title}`, file]));
  const results = [...mergedResults.values()].filter((file) => `${file.title} ${file.type} ${file.opened} ${searchTextFor(file)}`.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  const navigationFor = (file) => {
    if (file.appId) return file.appId === "tasks" ? { project: file.title } : file.appId === "mail" ? { title: file.title } : null;
    if (file.type === "Drive") {
      const isFolder = [...(workspace.driveFolders ?? []), ...(workspace.workspaces ?? [])].some((folder) => folder.name?.toLowerCase() === file.title.toLowerCase());
      return isFolder ? { folderName: file.title } : { fileTitle: file.title };
    }
    if (file.type === "Docs") {
      const parsed = new window.DOMParser().parseFromString(workspace.docs?.body ?? "", "text/html");
      const matchedHeading = [...parsed.querySelectorAll("h1, h2, h3")].find((heading) => heading.textContent.toLowerCase().includes(query.toLowerCase()));
      return { title: file.title, ...(matchedHeading ? { heading: matchedHeading.textContent.trim() } : {}) };
    }
    if (file.type === "Forms") {
      const matchedQuestion = workspace.forms?.find((question) => String(question.label).toLowerCase().includes(query.toLowerCase()));
      return { title: file.title, ...(matchedQuestion ? { questionId: matchedQuestion.id } : {}) };
    }
    if (file.type !== "Sheets") return { title: file.title };
    const matchedCell = Object.entries(workspace.sheets?.cells ?? {}).find(([, value]) => String(value).toLowerCase().includes(query.toLowerCase()))?.[0];
    return { title: file.title, ...(matchedCell ? { cell: matchedCell } : {}) };
  };
  const handleResultKeyDown = (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const resultButtons = [...document.querySelectorAll(".search-result")];
    const currentIndex = resultButtons.indexOf(event.currentTarget);
    const nextIndex = event.key === "ArrowDown" ? Math.min(resultButtons.length - 1, currentIndex + 1) : currentIndex - 1;
    if (nextIndex < 0) document.querySelector(".global-search input")?.focus();
    else resultButtons[nextIndex]?.focus();
  };
  return <div className="search-results" id="crescent-search-results" role="listbox" aria-label="Search results" aria-live="polite"><div className="search-results-heading">Search results</div>{results.length ? results.map((file) => <button key={`${file.type}-${file.title}`} className="search-result" role="option" onClick={() => onNavigate(file.appId ?? file.type.toLowerCase(), navigationFor(file))} onKeyDown={handleResultKeyDown}><AppIcon app={{ ...file, id: file.appId ?? file.type.toLowerCase() }} size={16} /><span><strong>{file.title}</strong><small>{file.type} · {file.opened}</small></span><ArrowRight size={15} /></button>) : <div className="search-empty">No files match “{query}”.</div>}</div>;
}

function GettingStarted({ onNavigate, onDismiss }) {
  const steps = [
    { app: "docs", label: "Write a document", detail: "Capture a plan, brief, or idea." },
    { app: "tasks", label: "Add a task", detail: "Turn the next step into momentum." },
    { app: "calendar", label: "Plan your time", detail: "Reserve space for focused work." },
  ];
  return <section className="getting-started" aria-labelledby="getting-started-title"><div className="getting-started-copy"><span className="utility-kicker"><Sparkles size={14} />Optional guide</span><h2 id="getting-started-title">Make Crescent yours.</h2><p>Start with a blank workspace and add only what you need. You can hide this guide at any time.</p></div><div className="getting-started-steps">{steps.map((step, index) => <button className="getting-started-step" key={step.app} onClick={() => onNavigate(step.app)}><span className="getting-started-number">{index + 1}</span><span><strong>{step.label}</strong><small>{step.detail}</small></span><ArrowRight size={15} /></button>)}</div><button className="getting-started-dismiss" onClick={onDismiss}>Hide guide</button></section>;
}

function GuideDialog({ onClose, onNavigate }) {
  useLayoutEffect(() => {
    const closeOnEscape = (event) => { if (event.key === "Escape") onClose(); };
    document.querySelector(".guide-dialog button")?.focus();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);
  const guideItems = [
    ["Start at Home", "Use the app launcher to open a blank tool, or follow the optional three-step guide."],
    ["Write and capture", "Use Docs for long-form work and Notes for quick ideas. Both save locally as you type."],
    ["Plan and analyze", "Use Sheets for calculations, Tasks for next steps, and Calendar for time you want to protect."],
    ["Present, ask, and communicate", "Use Slides to tell the story, Forms to collect answers, and Mail to keep a local thread."],
    ["Keep work together", "Use Drive for named files and folders, Recent for momentum, and Search to jump to exact work."],
    ["Keep your focus", "Every Crescent app opens in Focus Mode to give the work surface the full viewport. Press Escape or use the corner control to return to navigation and Search."],
    ["Protect your work", "Crescent saves your work in this browser. Open Settings to download a JSON backup or reset the local workspace before starting over."],
  ];
  return <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="file-create-dialog guide-dialog" role="dialog" aria-modal="true" aria-labelledby="guide-title"><div className="file-create-heading"><div><span className="utility-kicker"><CircleHelp size={14} />Crescent guide</span><h2 id="guide-title">A calm way to get things done.</h2><p>Everything you need to start using the suite, without pre-filled work.</p></div><button className="icon-button muted" onClick={onClose} aria-label="Close guide"><X size={18} /></button></div><div className="guide-list">{guideItems.map(([title, body], index) => <article className="guide-item" key={title}><span>{index + 1}</span><div><strong>{title}</strong><p>{body}</p></div></article>)}</div><div className="guide-apps"><span>Open an app</span>{APP_META.map((app) => <button className="quiet-button" key={app.id} onClick={() => { onClose(); onNavigate(app.id); }}><AppIcon app={app} size={14} />{app.label}</button>)}</div><div className="file-create-footer"><span><HardDrive size={14} />Saved locally in this browser</span><button className="primary-button" onClick={onClose}>Got it</button></div></section></div>;
}

function HomeView({ workspace, update, onNavigate, onFocusSearch }) {
  const [filter, setFilter] = useState("All");
  const recentFiles = getLiveRecentFiles(workspace);
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";
  const files = filter === "All" ? recentFiles : recentFiles.filter((file) => file.type === filter);
  const todayKey = localDateKey(new Date());
  const localSchedule = (workspace.calendarEvents ?? []).filter((event) => !event.date || event.date === todayKey).slice(0, 2).map((event) => ({ ...event, time: scheduleTimeLabel(event.when), end: "Local", color: "periwinkle" }));
  const toggleStar = (event, file) => { event.stopPropagation(); const starredTitles = getStarredTitles(workspace); if (starredTitles.has(file.title)) starredTitles.delete(file.title); else starredTitles.add(file.title); update({ starredFiles: [...starredTitles] }); emitNotice(starredTitles.has(file.title) ? `${file.title} added to Starred.` : `${file.title} removed from Starred.`); };
  return <div className="home-layout page-enter">
    <main className="home-main">
      <section className="home-hero">
        <div><h1>{greeting}</h1><p>{workspace.demo ? "Pick up where you left off, or start something new." : "Your workspace is ready for the next thing that matters."}</p></div>
        <div className="hero-moon"><span className="hero-moon-shape" /><span>A calmer<br />brighter you</span></div>
      </section>
      <section className="app-launcher" aria-label="Crescent apps">
        {APP_META.map((app) => <button className="app-launch" key={app.id} onClick={() => onNavigate(app.id)}><AppIcon app={app} size={23} /><span>{app.label}</span><small>{app.description}</small></button>)}
      </section>
      {!workspace.demo && !workspace.guideDismissed && <GettingStarted onNavigate={onNavigate} onDismiss={() => update({ guideDismissed: true })} />}
      <section className="workspace-section">
        <div className="section-heading"><div><h2>Continue working</h2><p>Jump back into the work that is already in motion.</p></div><button className="quiet-button" onClick={() => onNavigate("recent")}>See all <ArrowRight size={15} /></button></div>
        {recentFiles.length ? <div className="continue-row">{recentFiles.slice(0, 4).map((file) => <button className="continue-card" key={file.title} onClick={() => onNavigate(file.type.toLowerCase(), fileNavigationContext(file))}><div className={`file-preview preview-${file.color}`}><PreviewArt type={file.type} /></div><div className="file-meta"><span><AppIcon app={{ ...file, id: file.type.toLowerCase() }} size={14} />{file.type}</span><MoreHorizontal size={15} /></div><strong>{file.title}</strong><small>Edited {file.opened}</small></button>)}</div> : <div className="home-empty-state"><span className="home-empty-icon"><Plus size={18} /></span><div><strong>Your recent work will show up here.</strong><small>Open any app above to create something new.</small></div><button className="quiet-button" onClick={() => onNavigate("docs")}>Start with Docs <ArrowRight size={15} /></button></div>}
      </section>
      <section className="workspace-section recent-section">
        <div className="section-heading"><div><h2>Recent</h2><p>The latest files across your workspaces.</p></div><div className="filter-row">{["All", "Docs", "Sheets", "Slides", "Notes", "Tasks", "Calendar", "Drive", "Forms", "Mail"].map((item) => <button className={filter === item ? "filter-button selected" : "filter-button"} key={item} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</button>)}</div></div>
        <div className="recent-table"><div className="recent-table-head"><span>Name</span><span>Type</span><span>Last opened</span><span>Owner</span><span aria-label="Actions" /></div>{files.length ? files.map((file) => <div className="recent-row" role="link" tabIndex="0" key={file.title} onClick={() => onNavigate(file.type.toLowerCase(), file.type === "Mail" ? { title: file.title } : { title: file.title })} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onNavigate(file.type.toLowerCase(), file.type === "Mail" ? { title: file.title } : { title: file.title }); } }}><span className="file-name"><AppIcon app={{ ...file, id: file.type.toLowerCase() }} size={18} /><strong>{file.title}</strong></span><span>{file.type}</span><span>{file.opened}</span><span>{file.owner}</span><span className="row-actions"><span className="row-action" role="button" tabIndex="0" aria-label={`${file.starred ? "Remove" : "Add"} ${file.title} ${file.starred ? "from" : "to"} Starred`} onClick={(event) => toggleStar(event, file)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") toggleStar(event, file); }}>{file.starred ? <Star size={16} fill="currentColor" /> : <Star size={16} />}</span><MoreHorizontal size={17} /></span></div>) : <div className="home-table-empty"><Clock3 size={18} /><span>No recent files yet. Create something and it will appear here.</span></div>}</div>
      </section>
    </main>
    <aside className="home-rail">
      <section className="rail-card day-card"><div className="rail-heading"><div><h3>My day</h3><p>{new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date())}</p></div><button className="text-link" onClick={() => onNavigate("calendar")}>View calendar</button></div>{(workspace.demo ? [...SCHEDULE, ...localSchedule] : localSchedule).length ? (workspace.demo ? [...SCHEDULE, ...localSchedule] : localSchedule).map((event) => <div className="schedule-row" key={`${event.title}-${event.time}`}><div className="schedule-time"><span>{event.time}</span><span>{event.end}</span></div><span className={`schedule-bar bar-${event.color}`} /><strong>{event.title}</strong></div>) : <div className="rail-empty"><CalendarDays size={18} /><span>Your day is open. Add time in Calendar when you are ready.</span></div>}</section>
      <section className="rail-card activity-card"><div className="rail-heading"><h3>Activity</h3><button className="text-link" onClick={() => onNavigate("recent")}>See all <ArrowRight size={14} /></button></div>{workspace.demo ? <>{[{ initials: "TK", color: "lilac", text: "Taylor Kim commented on", target: "Design review deck", time: "10 minutes ago" }, { initials: "JL", color: "green", text: "Jordan Lee edited", target: "Growth metrics", time: "1 hour ago" }, { initials: "SC", color: "violet", text: "Sam Chen shared", target: "Launch assets with you", time: "3 hours ago" }].map((item) => <div className="activity-row" key={item.initials}><span className={`avatar avatar-${item.color}`}>{item.initials}</span><p>{item.text} <strong>{item.target}</strong><small>{item.time}</small></p></div>)}<div className="activity-task"><CalendarCheck2 size={18} /><p>You have <strong>3 tasks due tomorrow</strong><small>5 hours ago</small></p></div></> : <div className="rail-empty"><Clock3 size={18} /><span>Activity will collect here as you work.</span></div>}</section>
      <button className="ask-card" onClick={onFocusSearch}><span className="ask-icon"><Search size={16} /></span><span className="ask-copy"><strong>Find anything in Crescent</strong><small>Search files, notes, tasks, and events.</small></span><ArrowRight size={18} /></button>
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
  const titleEditable = !["notes", "tasks", "calendar", "drive", "mail"].includes(icon?.id);
  const handleEditorAction = (event) => { if (event.target.closest("button")?.textContent?.trim() === "Share") emitNotice("Sharing will be available when Crescent Cloud is connected."); };
  return <div className="editor-header"><div className="editor-breadcrumb"><button onClick={() => onNavigate("home")} className="crumb-home" aria-label="Back to Home"><Home size={15} /></button><ChevronRight size={14} /><span className="editor-app-label"><AppIcon app={icon} size={15} />{icon.label}</span><ChevronRight size={14} /><input value={title} onChange={(event) => onChangeTitle(event.target.value)} placeholder={titleEditable && !title ? "Untitled file" : undefined} readOnly={!titleEditable} aria-label="File title" aria-readonly={!titleEditable} /></div><div className="editor-actions" onClick={handleEditorAction}><span className="saved-status"><Check size={14} />Saved locally</span>{children}</div></div>;
}

function MailView({ workspace, update, onNavigate, initialSubject }) {
  const messages = useMemo(() => (Array.isArray(workspace.mail) ? workspace.mail : []), [workspace.mail]);
  const [selectedId, setSelectedId] = useState(messages[0]?.id ?? null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [draft, setDraft] = useState({ to: "", subject: "", body: "" });
  const appliedSubjectNavigation = useRef(null);
  const selected = messages.find((message) => message.id === selectedId) ?? messages[0];
  const unreadCount = messages.filter((message) => !message.read).length;
  useEffect(() => {
    if (!initialSubject || initialSubject === appliedSubjectNavigation.current) return;
    appliedSubjectNavigation.current = initialSubject;
    const target = messages.find((message) => message.subject === initialSubject);
    if (target) setSelectedId(target.id);
  }, [initialSubject, messages]);
  useEffect(() => {
    if (!composeOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setComposeOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [composeOpen]);
  const selectMessage = (message) => {
    setSelectedId(message.id);
    if (!message.read) update({ mail: messages.map((item) => item.id === message.id ? { ...item, read: true } : item) });
  };
  const toggleStar = () => {
    if (!selected) return;
    update({ mail: messages.map((item) => item.id === selected.id ? { ...item, starred: !item.starred } : item) });
    emitNotice(selected.starred ? "Message removed from Starred." : "Message added to Starred.");
  };
  const toggleRead = () => {
    if (!selected) return;
    update({ mail: messages.map((item) => item.id === selected.id ? { ...item, read: !item.read } : item) });
    emitNotice(selected.read ? "Message marked unread." : "Message marked read.");
  };
  const openCompose = (replyTo) => {
    setDraft(replyTo ? { to: replyTo.email, subject: `Re: ${replyTo.subject}`, body: `\n\n—\n${replyTo.from} wrote:\n${replyTo.body}` } : { to: "", subject: "", body: "" });
    setComposeOpen(true);
  };
  const sendMessage = () => {
    const to = draft.to.trim();
    const subject = draft.subject.trim();
    const body = draft.body.trim();
    if (!to || !subject || !body) { emitNotice("Add a recipient, subject, and message before sending."); return; }
    const sentMessage = { id: Date.now(), from: "You", email: "local@crescent", to, subject, preview: body.slice(0, 92), body, time: "just now", read: true, starred: false, tag: "Sent", sent: true };
    update({ mail: [sentMessage, ...messages] });
    setSelectedId(sentMessage.id);
    setComposeOpen(false);
    emitNotice("Message saved to this local inbox.");
  };
  return <div className="mail-page page-enter"><EditorHeader title="Inbox" icon={APP_META.find((app) => app.id === "mail")} onChangeTitle={() => {}} onNavigate={onNavigate}><button className="primary-button" onClick={() => openCompose()}><Plus size={16} />New message</button></EditorHeader><div className="mail-content"><div className="mail-heading"><div><span className="utility-kicker"><Mail size={14} />Local inbox</span><h1>Keep the thread.</h1><p>Read, reply, and draft messages without leaving your Crescent workspace.</p></div><div className="mail-heading-count"><strong>{unreadCount}</strong><span>unread</span></div></div><div className="mail-workspace"><section className="mail-list-panel" aria-label="Inbox messages"><div className="mail-list-heading"><div><strong>Inbox</strong><small>{messages.length} message{messages.length === 1 ? "" : "s"}</small></div><button className="icon-button muted" onClick={() => emitNotice("Inbox is already up to date.")} aria-label="Refresh inbox"><Redo2 size={16} /></button></div><div className="mail-list">{messages.map((message) => <button className={`mail-row ${selected?.id === message.id ? "selected" : ""} ${message.read ? "" : "unread"}`} key={message.id} onClick={() => selectMessage(message)} aria-label={`Open message ${message.subject}`} aria-pressed={selected?.id === message.id}><span className={`mail-avatar ${message.sent ? "mail-avatar-sent" : ""}`}>{message.sent ? "A" : message.from.slice(0, 1)}</span><span className="mail-row-copy"><span className="mail-row-top"><strong>{message.from}</strong><small>{message.time}</small></span><span className="mail-row-subject">{message.subject}</span><span className="mail-row-preview">{message.preview}</span></span><span className="mail-row-star" aria-hidden="true">{message.starred ? <Star size={14} fill="currentColor" /> : <Star size={14} />}</span></button>)}</div></section><article className="mail-detail" aria-label={selected ? `Message ${selected.subject}` : "No message selected"}>{selected ? <><div className="mail-detail-heading"><div><span className="mail-tag">{selected.tag}</span><h2>{selected.subject}</h2></div><button className="icon-button muted" onClick={toggleStar} aria-label={selected.starred ? "Remove message from Starred" : "Add message to Starred"}><Star size={17} fill={selected.starred ? "currentColor" : "none"} /></button></div><div className="mail-sender"><span className={`mail-avatar ${selected.sent ? "mail-avatar-sent" : ""}`}>{selected.sent ? "A" : selected.from.slice(0, 1)}</span><div><strong>{selected.from}</strong><small>{selected.email}{selected.to ? ` · to ${selected.to}` : ""}</small></div><span className="mail-detail-time">{selected.time}</span></div><div className="mail-body">{selected.body}</div><div className="mail-detail-actions"><button className="secondary-button" onClick={() => openCompose(selected)}><Undo2 size={15} />Reply</button><button className="secondary-button" onClick={toggleRead}><MailOpen size={15} />{selected.read ? "Mark unread" : "Mark read"}</button></div></> : <div className="mail-detail-empty"><Mail size={22} /><strong>Select a message</strong><small>Your local inbox will appear here.</small></div>}</article></div></div>{composeOpen && <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setComposeOpen(false); }}><section className="file-create-dialog mail-compose-dialog" role="dialog" aria-modal="true" aria-labelledby="mail-compose-title"><div className="file-create-heading"><div><span className="utility-kicker"><Send size={14} />New local message</span><h2 id="mail-compose-title">Write something clear.</h2><p>Messages are saved in this browser so you can keep the thread moving.</p></div><button className="icon-button muted" onClick={() => setComposeOpen(false)} aria-label="Close compose dialog"><X size={18} /></button></div><div className="mail-compose-fields"><label className="file-name-field"><span>To</span><input autoFocus value={draft.to} aria-label="To" placeholder="name@example.com" onChange={(event) => setDraft((current) => ({ ...current, to: event.target.value }))} /></label><label className="file-name-field"><span>Subject</span><input value={draft.subject} aria-label="Subject" placeholder="A clear subject" onChange={(event) => setDraft((current) => ({ ...current, subject: event.target.value }))} /></label><label className="file-name-field"><span>Message</span><textarea value={draft.body} aria-label="Message" placeholder="Write your message..." onChange={(event) => setDraft((current) => ({ ...current, body: event.target.value }))} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") sendMessage(); }} /></label></div><div className="file-create-footer"><span><Mail size={14} />Saved locally in this browser</span><div><button className="secondary-button" onClick={() => setComposeOpen(false)}>Cancel</button><button className="primary-button" onClick={sendMessage}><Send size={16} />Send message</button></div></div></section></div>}</div>;
}

function DocsView({ workspace, update, onNavigate, initialHeading }) {
  const [title, setTitle] = useState(workspace.docs.title);
  const [blockStyle, setBlockStyle] = useState("p");
  const [linkDialog, setLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const editorRef = useRef(null);
  const linkSelectionRef = useRef(null);
  const appliedHeadingNavigation = useRef(null);
  const icon = APP_META.find((app) => app.id === "docs");
  const outline = useMemo(() => {
    const parser = new window.DOMParser();
    const parsed = parser.parseFromString(workspace.docs.body ?? "", "text/html");
    return [title || "Untitled document", ...Array.from(parsed.querySelectorAll("h2, h3")).map((heading) => heading.textContent.trim()).filter(Boolean)].slice(0, 6);
  }, [title, workspace.docs.body]);
  const jumpToOutline = (item) => { const target = Array.from(editorRef.current?.querySelectorAll("h1, h2, h3") ?? []).find((heading) => heading.textContent.trim() === item); target?.scrollIntoView({ behavior: "smooth", block: "center" }); };
  const addSection = () => { const nextBody = `${workspace.docs.body}<h2>New section</h2><p>Start writing the next idea here.</p>`; update({ docs: { ...workspace.docs, title, body: nextBody, updatedAt: "just now" } }); emitNotice("New section added to the document."); };
  useEffect(() => { if (editorRef.current && editorRef.current.innerHTML !== workspace.docs.body) editorRef.current.innerHTML = workspace.docs.body; }, [workspace.docs.body]);
  useEffect(() => {
    if (!initialHeading || initialHeading === appliedHeadingNavigation.current) return;
    appliedHeadingNavigation.current = initialHeading;
    window.setTimeout(() => {
      const targetHeading = [...(editorRef.current?.querySelectorAll("h1, h2, h3") ?? [])].find((heading) => heading.textContent.trim() === initialHeading);
      targetHeading?.classList.add("search-target");
      targetHeading?.scrollIntoView({ block: "center" });
    }, 0);
  }, [initialHeading, workspace.docs.body]);
  const updateDoc = (nextBody) => {
    const searchTarget = editorRef.current?.querySelector(".search-target");
    searchTarget?.classList.remove("search-target");
    const body = nextBody ?? editorRef.current?.innerHTML ?? workspace.docs.body;
    update({ docs: { ...workspace.docs, title, body, updatedAt: "just now" } });
  };
  const exec = (command, value = undefined) => { editorRef.current?.focus(); document.execCommand(command, false, value); if (command === "formatBlock") setBlockStyle(String(value)); updateDoc(); };
  const openLinkDialog = () => {
    const selection = window.getSelection();
    if (!selection?.rangeCount || selection.isCollapsed || !editorRef.current?.contains(selection.anchorNode)) { emitNotice("Select text in the document before adding a link."); return; }
    linkSelectionRef.current = selection.getRangeAt(0).cloneRange();
    setLinkUrl("https://");
    setLinkDialog(true);
  };
  useEffect(() => {
    if (!linkDialog) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setLinkDialog(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [linkDialog]);
  const insertLink = () => {
    const url = linkUrl.trim();
    if (!/^https?:\/\//i.test(url)) { emitNotice("Use a full link beginning with http:// or https://."); return; }
    editorRef.current?.focus();
    const selection = window.getSelection();
    if (selection && linkSelectionRef.current) { selection.removeAllRanges(); selection.addRange(linkSelectionRef.current); }
    document.execCommand("createLink", false, url);
    updateDoc();
    linkSelectionRef.current = null;
    setLinkDialog(false);
    emitNotice("Link added to the document.");
  };
  const exportDocument = () => {
    const body = editorRef.current?.innerHTML ?? workspace.docs.body ?? "";
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title || "Crescent document")}</title><style>body{margin:0;background:#f6f4fb;color:#252238;font:16px/1.7 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.document-export{max-width:760px;margin:64px auto;padding:64px 72px;background:#fff;border-radius:24px;box-shadow:0 18px 60px rgba(43,35,77,.12)}h1{font-size:42px;line-height:1.12;margin:0 0 20px}h2,h3{margin-top:36px;line-height:1.25}p,ul,ol,blockquote{margin:18px 0}blockquote{border-left:3px solid #9d89df;padding-left:20px;color:#665b86;font-style:italic}li{margin:8px 0}@media(max-width:820px){.document-export{margin:0;border-radius:0;padding:40px 24px;min-height:100vh;box-sizing:border-box}}</style></head><body><main class="document-export">${body}</main></body></html>`;
    downloadText(`${safeFileName(title || "crescent-doc")}.html`, html, "text/html");
    emitNotice("Standalone document export downloaded.");
  };
  const moveDocumentToTrash = () => {
    const starredTitles = getStarredTitles(workspace);
    const deletedDoc = { id: `doc-${Date.now()}`, title, body: workspace.docs.body, updatedAt: workspace.docs.updatedAt, type: "Docs", appId: "docs", opened: "just now", owner: "Me", starred: starredTitles.has(title) };
    starredTitles.delete(title);
    update({ docs: { ...INITIAL_WORKSPACE.docs, title: "Untitled document", body: "<h1>Untitled document</h1><p>Start writing your next idea here.</p>", updatedAt: "just now" }, starredFiles: [...starredTitles], deletedFiles: [deletedDoc, ...(workspace.deletedFiles ?? [])] });
    emitNotice("Document moved to local Trash.");
    onNavigate("trash");
  };
  return <div className="editor-page page-enter docs-page"><EditorHeader title={title} icon={icon} onChangeTitle={(value) => { setTitle(value); update({ docs: { ...workspace.docs, title: value, updatedAt: "just now" }, starredFiles: renameStarredFile(workspace, workspace.docs.title, value) }); }} onNavigate={onNavigate}><button className="secondary-button" onClick={exportDocument}><Download size={16} />Export</button><button className="secondary-button editor-trash-button" onClick={moveDocumentToTrash}><Trash2 size={16} />Move to Trash</button><button className="primary-button"><Share2 size={16} />Share</button></EditorHeader><div className="editor-subbar"><div className="toolbar-group"><button onClick={() => exec("undo")} aria-label="Undo"><Undo2 size={16} /></button><button onClick={() => exec("redo")} aria-label="Redo"><Redo2 size={16} /></button></div><div className="toolbar-divider" /><div className="toolbar-group"><button onClick={() => exec("bold")} aria-label="Bold"><Bold size={16} /></button><button onClick={() => exec("italic")} aria-label="Italic"><Italic size={16} /></button><button onClick={() => exec("formatBlock", "h2")} aria-label="Heading"><span className="toolbar-text">H2</span></button><button onClick={() => exec("insertUnorderedList")} aria-label="Bullet list"><List size={16} /></button><button onClick={() => exec("justifyLeft")} aria-label="Align left"><AlignLeft size={16} /></button><button onClick={() => exec("justifyCenter")} aria-label="Align center"><AlignCenter size={16} /></button><button onClick={() => exec("justifyRight")} aria-label="Align right"><AlignRight size={16} /></button><button onClick={openLinkDialog} aria-label="Add link"><Link size={16} /></button></div><div className="toolbar-divider" /><select className="toolbar-select" value={blockStyle} onChange={(event) => exec("formatBlock", event.target.value)} aria-label="Text style"><option value="p">Body</option><option value="h2">Heading</option><option value="blockquote">Quote</option></select><div className="editor-zoom">100% <ChevronDown size={14} /></div></div><div className="doc-workspace"><aside className="doc-outline"><div className="outline-heading"><span>Outline</span><button className="icon-button muted" onClick={addSection} aria-label="Add outline item"><Plus size={15} /></button></div>{outline.map((item, index) => <button className={`outline-link ${index === 0 ? "active" : ""}`} onClick={() => jumpToOutline(item)} key={`${item}-${index}`}>{item}</button>)}<div className="outline-footer"><span>Words</span><strong>{(editorRef.current?.innerText ?? "").trim().split(/\s+/).filter(Boolean).length}</strong></div></aside><article className="document-paper"><div className="document-inner" ref={editorRef} contentEditable role="textbox" aria-label="Document body" aria-multiline="true" data-placeholder="Start writing here…" suppressContentEditableWarning onInput={() => updateDoc()} onBlur={() => updateDoc()} /></article><aside className="doc-inspector"><div className="inspector-heading"><span>Details</span><button className="icon-button muted" aria-label="Close details"><X size={15} /></button></div><div className="inspector-section"><span className="inspector-label">Cover</span><div className="cover-preview"><div className="cover-moon" /><strong>{title || "Untitled document"}</strong><small>LOCAL DOCUMENT</small></div></div><div className="inspector-section"><span className="inspector-label">Storage</span><div className="person-row"><span className="avatar avatar-lilac">⌁</span><div><strong>Local workspace</strong><small>Saved in this browser</small></div></div><button className="add-person" onClick={() => emitNotice("Sharing will be available when Crescent Cloud is connected.")}><Plus size={15} />Invite someone</button></div></aside></div>{linkDialog && <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setLinkDialog(false); }}><section className="file-create-dialog link-create-dialog" role="dialog" aria-modal="true" aria-labelledby="link-create-title"><div className="file-create-heading"><div><span className="utility-kicker"><Link size={14} />Add document link</span><h2 id="link-create-title">Connect this thought</h2><p>Turn the selected text into a link you can revisit later.</p></div><button className="icon-button muted" onClick={() => setLinkDialog(false)} aria-label="Close link dialog"><X size={18} /></button></div><label className="file-name-field"><span>Link URL</span><input autoFocus value={linkUrl} aria-label="Link URL" onChange={(event) => setLinkUrl(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") insertLink(); }} /></label><div className="file-create-footer"><span><Link size={14} />Links stay in this local document</span><div><button className="secondary-button" onClick={() => setLinkDialog(false)}>Cancel</button><button className="primary-button" onClick={insertLink}><Link size={16} />Add link</button></div></div></section></div>}</div>;
}

const SHEET_COLS = ["A", "B", "C", "D", "E", "F"];
const SHEET_ROWS = Array.from({ length: 9 }, (_, index) => index + 1);

function evaluateCell(value, cells) {
  if (typeof value !== "string" || !value.startsWith("=")) return value;
  const rangeMatch = value.match(/^=(SUM|AVERAGE|MIN|MAX|COUNT|COUNTA)\(([A-F]\d+):([A-F]\d+)\)$/i);
  if (rangeMatch) {
    const [, operation, start, end] = rangeMatch;
    const column = start[0].toUpperCase();
    const startRow = Number(start.slice(1));
    const endRow = Number(end.slice(1));
    const rawValues = Array.from({ length: endRow - startRow + 1 }, (_, index) => evaluateCell(cells[`${column}${startRow + index}`] ?? "", cells));
    const values = rawValues.map((item) => Number(item) || 0);
    if (operation.toUpperCase() === "COUNT") return rawValues.filter((item) => String(item).trim() !== "" && Number.isFinite(Number(item))).length;
    if (operation.toUpperCase() === "COUNTA") return rawValues.filter((item) => String(item).trim() !== "").length;
    if (operation.toUpperCase() === "AVERAGE") return Number((values.reduce((sum, item) => sum + item, 0) / values.length).toFixed(2));
    if (operation.toUpperCase() === "MIN") return Math.min(...values);
    if (operation.toUpperCase() === "MAX") return Math.max(...values);
    return values.reduce((sum, item) => sum + item, 0);
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

function SheetsView({ workspace, update, onNavigate, initialCell }) {
  const [selected, setSelected] = useState(initialCell ?? "B2");
  const [view, setView] = useState("grid");
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const icon = APP_META.find((app) => app.id === "sheets");
  const sheetTabs = useMemo(() => workspace.sheets.tabs ?? [{ name: "Sheet 1", cells: workspace.sheets.cells }], [workspace.sheets.cells, workspace.sheets.tabs]);
  const activeSheet = Math.min(workspace.sheets.activeSheet ?? 0, sheetTabs.length - 1);
  const cells = useMemo(() => sheetTabs[activeSheet]?.cells ?? {}, [activeSheet, sheetTabs]);
  const appliedCellNavigation = useRef(null);
  useEffect(() => {
    if (!initialCell || initialCell === appliedCellNavigation.current || cells[initialCell] === undefined) return;
    appliedCellNavigation.current = initialCell;
    setSelected(initialCell);
  }, [cells, initialCell]);
  const commitSheets = (nextSheets, extra = {}) => { setPast((current) => [...current, workspace.sheets].slice(-30)); setFuture([]); update({ sheets: nextSheets, ...extra }); };
  const persistCells = (nextCells) => { const nextTabs = sheetTabs.map((sheet, index) => index === activeSheet ? { ...sheet, cells: nextCells } : sheet); commitSheets({ ...workspace.sheets, tabs: nextTabs, activeSheet, cells: nextCells, updatedAt: "just now" }); };
  const updateCell = (cell, value) => persistCells({ ...cells, [cell]: value });
  const selectSheet = (index) => update({ sheets: { ...workspace.sheets, tabs: sheetTabs, activeSheet: index, cells: sheetTabs[index]?.cells ?? {}, updatedAt: "just now" } });
  const addSheet = () => { const nextTabs = [...sheetTabs, { name: `Sheet ${sheetTabs.length + 1}`, cells: {} }]; commitSheets({ ...workspace.sheets, tabs: nextTabs, activeSheet: nextTabs.length - 1, cells: {}, updatedAt: "just now" }); setSelected("A1"); setView("grid"); };
  const undo = () => { if (!past.length) return; const previous = past[past.length - 1]; setPast(past.slice(0, -1)); setFuture((current) => [workspace.sheets, ...current]); update({ sheets: previous }); };
  const redo = () => { if (!future.length) return; const next = future[0]; setFuture(future.slice(1)); setPast((current) => [...current, workspace.sheets].slice(-30)); update({ sheets: next }); };
  const exportCsv = () => { const csv = SHEET_ROWS.map((row) => SHEET_COLS.map((col) => JSON.stringify(evaluateCell(cells[`${col}${row}`] ?? "", cells))).join(",")).join("\n"); downloadText(`${safeFileName(workspace.sheets.title || "crescent-sheet")}.csv`, csv, "text/csv"); emitNotice("Sheet export downloaded."); };
  const moveSheetToTrash = () => {
    const starredTitles = getStarredTitles(workspace);
    const deletedSheet = { id: `sheet-${Date.now()}`, title: workspace.sheets.title, cells: workspace.sheets.cells, tabs: workspace.sheets.tabs, styles: workspace.sheets.styles, activeSheet: workspace.sheets.activeSheet, type: "Sheets", appId: "sheets", opened: "just now", owner: "Me", starred: starredTitles.has(workspace.sheets.title) };
    starredTitles.delete(workspace.sheets.title);
    update({ sheets: { ...INITIAL_WORKSPACE.sheets, title: "Untitled spreadsheet", updatedAt: "just now" }, starredFiles: [...starredTitles], deletedFiles: [deletedSheet, ...(workspace.deletedFiles ?? [])] });
    emitNotice("Spreadsheet moved to local Trash.");
    onNavigate("trash");
  };
  const sheetName = sheetTabs[activeSheet]?.name ?? "Sheet 1";
  const sheetStyles = workspace.sheets.styles ?? {};
  const styleKey = (cell) => `${sheetName}:${cell}`;
  const selectedStyle = sheetStyles[styleKey(selected)] ?? {};
  const updateCellStyle = (property, value) => { const currentStyle = sheetStyles[styleKey(selected)] ?? {}; commitSheets({ ...workspace.sheets, styles: { ...sheetStyles, [styleKey(selected)]: { ...currentStyle, [property]: value } }, updatedAt: "just now" }); };
  return <div className="editor-page page-enter sheets-page"><EditorHeader title={workspace.sheets.title} icon={icon} onChangeTitle={(value) => commitSheets({ ...workspace.sheets, title: value, updatedAt: "just now" }, { starredFiles: renameStarredFile(workspace, workspace.sheets.title, value) })} onNavigate={onNavigate}><button className="secondary-button" onClick={exportCsv}><Download size={16} />Export CSV</button><button className="secondary-button editor-trash-button" onClick={moveSheetToTrash}><Trash2 size={16} />Move to Trash</button><button className="primary-button"><Share2 size={16} />Share</button></EditorHeader><div className="sheet-toolbar"><div className="sheet-toolbar-group"><button onClick={undo} aria-label="Undo" disabled={!past.length}><Undo2 size={16} /></button><button onClick={redo} aria-label="Redo" disabled={!future.length}><Redo2 size={16} /></button><button className="toolbar-select">100% <ChevronDown size={14} /></button><div className="toolbar-divider" /><button aria-label="Bold cells" onClick={() => updateCellStyle("bold", !selectedStyle.bold)} aria-pressed={!!selectedStyle.bold}><Bold size={16} /></button><button aria-label="Italic cells" onClick={() => updateCellStyle("italic", !selectedStyle.italic)} aria-pressed={!!selectedStyle.italic}><Italic size={16} /></button><button aria-label="Align left" onClick={() => updateCellStyle("align", "left")} aria-pressed={selectedStyle.align === "left"}><AlignLeft size={16} /></button><button aria-label="Insert link"><Link size={16} /></button></div><div className="sheet-view-switch"><button className={view === "grid" ? "selected" : ""} onClick={() => setView("grid")} aria-pressed={view === "grid"}><Grid2X2 size={15} />Grid</button><button className={view === "insights" ? "selected" : ""} onClick={() => setView("insights")} aria-pressed={view === "insights"}><LayoutDashboard size={15} />Insights</button></div></div><div className={`formula-bar ${view === "insights" ? "sheet-utility-hidden" : ""}`}><span className="name-box">{selected}</span><span className="formula-symbol">fx</span><input value={cells[selected] ?? ""} onChange={(event) => updateCell(selected, event.target.value)} aria-label="Formula bar" /></div>{view === "insights" ? <SheetInsights cells={cells} /> : <><div className="sheet-canvas"><div className="sheet-grid"><div className="sheet-corner" />{SHEET_COLS.map((column) => <div className="sheet-col-label" key={column}>{column}</div>)}{SHEET_ROWS.map((row) => <div className="sheet-row" key={row}><div className="sheet-row-label">{row}</div>{SHEET_COLS.map((column) => { const cell = `${column}${row}`; const cellStyle = sheetStyles[styleKey(cell)] ?? {}; const isSelected = cell === selected; const isHeader = row === 1; return <div className={`sheet-cell ${isSelected ? "selected" : ""} ${isHeader ? "sheet-header-cell" : ""}`} key={cell}><input value={cells[cell] ?? ""} style={{ fontWeight: cellStyle.bold ? 700 : undefined, fontStyle: cellStyle.italic ? "italic" : undefined, textAlign: cellStyle.align ?? "left" }} onChange={(event) => updateCell(cell, event.target.value)} onFocus={() => setSelected(cell)} aria-label={`Cell ${cell}`} /><span className="sheet-display" style={{ fontWeight: cellStyle.bold ? 700 : undefined, fontStyle: cellStyle.italic ? "italic" : undefined, textAlign: cellStyle.align ?? "left" }}>{evaluateCell(cells[cell] ?? "", cells)}</span></div>; })}</div>)}</div></div><div className="sheet-status"><span><span className="status-dot" />Saved locally</span><span>{Object.keys(cells).length} populated cells</span><div className="sheet-tabs" role="tablist" aria-label="Sheets">{sheetTabs.map((sheet, index) => <button className={index === activeSheet ? "selected" : ""} key={sheet.name} onClick={() => selectSheet(index)} role="tab" aria-selected={index === activeSheet}>{sheet.name}</button>)}<button onClick={addSheet} aria-label="Add sheet"><Plus size={15} />Add sheet</button></div></div></>}
  </div>;
}

function SlidesView({ workspace, update, onNavigate, initialSlideTitle }) {
  const [active, setActive] = useState(() => Math.max(0, workspace.slides.findIndex((slide) => slide.title === initialSlideTitle)));
  const [presenting, setPresenting] = useState(false);
  const notesRef = useRef(null);
  const [deckTitle, setDeckTitle] = useState(workspace.slidesTitle ?? "Design review deck");
  const icon = APP_META.find((app) => app.id === "slides");
  const slides = workspace.slides;
  const current = slides[active] ?? slides[0];
  const layout = current.layout ?? "title-body";
  const appliedSlideNavigation = useRef(null);
  useEffect(() => {
    if (!initialSlideTitle || initialSlideTitle === appliedSlideNavigation.current) return;
    appliedSlideNavigation.current = initialSlideTitle;
    const nextIndex = slides.findIndex((slide) => slide.title === initialSlideTitle);
    if (nextIndex >= 0) setActive(nextIndex);
  }, [initialSlideTitle, slides]);
  useEffect(() => {
    if (!presenting) return undefined;
    const handlePresentationKey = (event) => {
      if (event.key === "Escape") setPresenting(false);
      if (event.key === "ArrowRight" || event.key === " ") { event.preventDefault(); setActive((index) => Math.min(slides.length - 1, index + 1)); }
      if (event.key === "ArrowLeft") { event.preventDefault(); setActive((index) => Math.max(0, index - 1)); }
    };
    window.addEventListener("keydown", handlePresentationKey);
    return () => window.removeEventListener("keydown", handlePresentationKey);
  }, [presenting, slides.length]);
  const updateCurrent = (patch) => update({ slides: slides.map((slide, index) => index === active ? { ...slide, ...patch } : slide) });
  const addSlide = () => { const nextSlide = workspace.demo ? { title: "A new chapter", body: "Add a thought worth sharing.", accent: "blue", notes: "", layout: "title-body" } : { title: "", body: "", accent: "blue", notes: "", layout: "title-body" }; update({ slides: [...slides, nextSlide] }); setActive(slides.length); };
  const moveDeckToTrash = () => {
    const starredTitles = getStarredTitles(workspace);
    const deletedDeck = { id: `slides-${Date.now()}`, title: workspace.slidesTitle, slides, type: "Slides", appId: "slides", opened: "just now", owner: "Me", starred: starredTitles.has(workspace.slidesTitle) };
    starredTitles.delete(workspace.slidesTitle);
    update({ slidesTitle: "", slides: [{ title: "", body: "", accent: "lilac", notes: "", layout: "title-body" }], starredFiles: [...starredTitles], deletedFiles: [deletedDeck, ...(workspace.deletedFiles ?? [])] });
    emitNotice("Presentation moved to local Trash.");
    onNavigate("trash");
  };
  const exportDeck = () => { const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(deckTitle || "Crescent deck")}</title><style>body{margin:0;background:#10141e;color:#f6f4ff;font:16px system-ui,sans-serif}section{min-height:70vh;padding:15vh 12vw;box-sizing:border-box;border-bottom:1px solid #30364a}small{color:#aaa1e7;letter-spacing:.14em}h1{max-width:780px;font-size:clamp(36px,7vw,90px);line-height:1.02}p{max-width:580px;color:#c8c4dc;font-size:20px;line-height:1.5}</style></head><body>${slides.map((slide, index) => `<section><small>CRESCENT / SLIDE ${String(index + 1).padStart(2, "0")}</small><h1>${escapeHtml(slide.title)}</h1><p>${escapeHtml(slide.body)}</p></section>`).join("")}</body></html>`; downloadText(`${safeFileName(deckTitle || "crescent-deck")}.html`, html, "text/html"); emitNotice("Slides export downloaded."); };
  return <div className="editor-page page-enter slides-page"><EditorHeader title={deckTitle} icon={icon} onChangeTitle={(value) => { setDeckTitle(value); update({ slidesTitle: value, starredFiles: renameStarredFile(workspace, workspace.slidesTitle, value) }); }} onNavigate={onNavigate}><button className="secondary-button" onClick={exportDeck}><Download size={16} />Export</button><button className="secondary-button" onClick={() => setPresenting(true)}><Play size={16} />Present</button><button className="secondary-button editor-trash-button" onClick={moveDeckToTrash}><Trash2 size={16} />Move to Trash</button><button className="primary-button"><Share2 size={16} />Share</button></EditorHeader><div className="slide-workspace"><aside className="slide-rail"><div className="slide-rail-heading"><span>Slides <small>{slides.length}</small></span><button className="icon-button muted" onClick={addSlide} aria-label="Add slide"><Plus size={16} /></button></div>{slides.map((slide, index) => <button key={`${slide.title}-${index}`} className={`slide-thumb ${active === index ? "selected" : ""}`} onClick={() => setActive(index)} aria-current={active === index ? "true" : undefined}><span className={`thumb-canvas thumb-${slide.accent}`}><small>{index + 1}</small><strong>{slide.title}</strong></span><span>Slide {index + 1}</span></button>)}</aside><main className="slide-main"><div className={`presentation-canvas canvas-${current.accent} canvas-layout-${layout}`}><div className="canvas-orbit" /><span className="canvas-kicker">CRESCENT / DESIGN REVIEW</span><h1 contentEditable role="textbox" aria-label="Slide title" suppressContentEditableWarning onBlur={(event) => updateCurrent({ title: event.currentTarget.textContent })}>{current.title}</h1><p contentEditable role="textbox" aria-label="Slide body" aria-multiline="true" suppressContentEditableWarning onBlur={(event) => updateCurrent({ body: event.currentTarget.textContent })}>{current.body}</p><span className="canvas-page">{String(active + 1).padStart(2, "0")} — {String(slides.length).padStart(2, "0")}</span></div><div className="slide-notes"><span>Speaker notes</span><button className="icon-button muted" onClick={() => notesRef.current?.focus()} aria-label="Add speaker note"><Plus size={16} /></button><textarea ref={notesRef} aria-label={`Speaker notes for ${current.title}`} placeholder="Add a note for this slide..." value={current.notes ?? ""} onChange={(event) => updateCurrent({ notes: event.target.value })} /></div></main><aside className="slide-inspector"><div className="inspector-heading"><span>Design</span><button className="icon-button muted" aria-label="Design options"><SlidersIcon /></button></div><div className="inspector-section"><span className="inspector-label">Theme</span><div className="theme-options"><button className={`theme-swatch swatch-lilac ${current.accent === "lilac" ? "selected" : ""}`} onClick={() => updateCurrent({ accent: "lilac" })} aria-label="Lilac theme" aria-pressed={current.accent === "lilac"} /><button className={`theme-swatch swatch-blue ${current.accent === "blue" ? "selected" : ""}`} onClick={() => updateCurrent({ accent: "blue" })} aria-label="Blue theme" aria-pressed={current.accent === "blue"} /><button className={`theme-swatch swatch-gold ${current.accent === "gold" ? "selected" : ""}`} onClick={() => updateCurrent({ accent: "gold" })} aria-label="Gold theme" aria-pressed={current.accent === "gold"} /></div></div><div className="inspector-section"><span className="inspector-label">Layout</span><button className={`layout-option ${layout === "title-body" ? "selected" : ""}`} onClick={() => updateCurrent({ layout: "title-body" })} aria-pressed={layout === "title-body"}><span className="layout-preview layout-title" /><span>Title & body</span>{layout === "title-body" && <Check size={15} />}</button><button className={`layout-option ${layout === "statement" ? "selected" : ""}`} onClick={() => updateCurrent({ layout: "statement" })} aria-pressed={layout === "statement"}><span className="layout-preview layout-quote" /><span>Big statement</span>{layout === "statement" && <Check size={15} />}</button></div></aside></div>{presenting && <div className="presentation-overlay"><button className="presentation-close icon-button" aria-label="Close presentation" onClick={() => setPresenting(false)}><X size={21} /></button><div className={`presentation-stage canvas-${current.accent} canvas-layout-${layout}`}><span className="canvas-kicker">CRESCENT / DESIGN REVIEW</span><h1>{current.title}</h1><p>{current.body}</p><span className="canvas-page">{String(active + 1).padStart(2, "0")} — {String(slides.length).padStart(2, "0")}</span></div><button className="presentation-prev icon-button" aria-label="Previous slide" onClick={() => setActive(Math.max(0, active - 1))}><ChevronLeft /></button><button className="presentation-next icon-button" aria-label="Next slide" onClick={() => setActive(Math.min(slides.length - 1, active + 1))}><ChevronRight /></button></div>}</div>;
}

function SlidersIcon() { return <Settings2 size={16} />; }

function NotesView({ workspace, update, onNavigate, initialNoteTitle }) {
  const [selected, setSelected] = useState(() => workspace.notes.find((note) => note.title === initialNoteTitle)?.id ?? workspace.notes[0]?.id ?? 1);
  const note = workspace.notes.find((item) => item.id === selected) ?? workspace.notes[0];
  const appliedNoteNavigation = useRef(null);
  useEffect(() => {
    if (!initialNoteTitle || initialNoteTitle === appliedNoteNavigation.current) return;
    appliedNoteNavigation.current = initialNoteTitle;
    const nextNote = workspace.notes.find((item) => item.title === initialNoteTitle);
    if (nextNote) setSelected(nextNote.id);
  }, [initialNoteTitle, workspace.notes]);
  const addNote = () => { const id = Date.now(); update({ notes: [{ id, title: "Untitled note", body: "", color: "blue", updatedAt: "Just now" }, ...workspace.notes] }); setSelected(id); };
  if (!note) return <div className="notes-page page-enter"><EditorHeader title="Notes" icon={APP_META.find((app) => app.id === "notes")} onChangeTitle={() => {}} onNavigate={onNavigate}><button className="primary-button" onClick={addNote}><Plus size={16} />New note</button></EditorHeader><div className="notes-empty-state"><span className="home-empty-icon"><NotebookPen size={18} /></span><div><h2>Keep the good ideas.</h2><p>Your notes start blank and stay local to this browser.</p><button className="primary-button" onClick={addNote}><Plus size={16} />Create your first note</button></div></div></div>;
  const updateNote = (patch) => update({ notes: workspace.notes.map((item) => item.id === note.id ? { ...item, ...patch, updatedAt: "Just now" } : item), ...(Object.prototype.hasOwnProperty.call(patch, "title") ? { starredFiles: renameStarredFile(workspace, note.title, patch.title) } : {}) });
  const removeNote = () => { if (workspace.notes.length <= 1) { emitNotice("Keep one note in the workspace."); return; } const remaining = workspace.notes.filter((item) => item.id !== note.id); const starredTitles = getStarredTitles(workspace); const deletedNote = { id: `note-${note.id}`, noteId: note.id, title: note.title, body: note.body, color: note.color, updatedAt: note.updatedAt, type: "Notes", appId: "notes", opened: "just now", owner: "Me", starred: starredTitles.has(note.title) }; starredTitles.delete(note.title); update({ notes: remaining, starredFiles: [...starredTitles], deletedFiles: [deletedNote, ...(workspace.deletedFiles ?? [])] }); setSelected(remaining[0].id); emitNotice("Note moved to local Trash."); };
  return <div className="notes-page page-enter"><EditorHeader title="Notes" icon={APP_META.find((app) => app.id === "notes")} onChangeTitle={() => {}} onNavigate={onNavigate}><button className="secondary-button" onClick={() => downloadText(`${safeFileName(note.title || "crescent-note")}.txt`, note.body, "text/plain")}><Download size={16} />Export</button><button className="primary-button" onClick={addNote}><Plus size={16} />New note</button></EditorHeader><div className="notes-workspace"><aside className="notes-list"><div className="notes-list-head"><span>All notes</span><button className="icon-button muted" onClick={addNote} aria-label="Add note"><FolderPlus size={16} /></button></div>{workspace.notes.map((item) => <button className={`note-list-item ${item.id === selected ? "selected" : ""}`} key={item.id} onClick={() => setSelected(item.id)}><span className={`note-dot note-dot-${item.color}`} /><span><strong>{item.title}</strong><small>{item.body}</small><em>{item.updatedAt}</em></span></button>)}</aside><main className="note-editor"><div className="note-editor-top"><span className={`note-dot note-dot-${note.color}`} /> <input value={note.title} onChange={(event) => updateNote({ title: event.target.value })} aria-label="Note title" /><span className="saved-status"><Check size={14} />Saved</span><button className="icon-button muted" onClick={removeNote} aria-label={`Delete ${note.title}`}><Trash2 size={16} /></button></div><textarea value={note.body} onChange={(event) => updateNote({ body: event.target.value })} aria-label="Note body" /><div className="note-footer"><span><NotebookPen size={15} />Plain text note</span><span>{note.body.length} characters</span></div></main></div></div>;
}

function TasksView({ workspace, update, onNavigate, initialTaskTitle, initialProject }) {
  const [newTask, setNewTask] = useState("");
  const [newProject, setNewProject] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const appliedTaskNavigation = useRef(null);
  const appliedProjectNavigation = useRef(null);
  const projectOptions = useMemo(() => {
    const options = [];
    [...(workspace.demo ? ["Personal"] : []), ...(workspace.projects ?? []), ...workspace.tasks.map((task) => task.project).filter(Boolean)].forEach((project) => {
      const label = String(project);
      if (label && !options.some((option) => option.toLowerCase() === label.toLowerCase())) options.push(label);
    });
    return options;
  }, [workspace.demo, workspace.projects, workspace.tasks]);
  const activeProject = projectOptions.includes(newProject) ? newProject : projectOptions[0] ?? "";
  const filterOrder = ["all", "today", "open", "done"];
  const dueOrder = ["Today", "Tomorrow", "Friday", "No date"];
  const filterLabels = { all: "All", today: "Today", open: "Open", done: "Done" };
  const toggle = (id) => update({ tasks: workspace.tasks.map((task) => task.id === id ? { ...task, complete: !task.complete } : task) });
  const addTask = (event) => { event.preventDefault(); if (!newTask.trim()) return; update({ tasks: [{ id: Date.now(), title: newTask.trim(), project: activeProject, due: "Today", complete: false }, ...workspace.tasks] }); setNewTask(""); };
  const startTaskEdit = (task) => { setEditingTask(task.id); setEditingTitle(task.title); };
  const cancelTaskEdit = () => { setEditingTask(null); setEditingTitle(""); };
  const saveTaskEdit = (id) => {
    const nextTitle = editingTitle.trim();
    if (!nextTitle) { emitNotice("Give the task a title before saving."); return; }
    const task = workspace.tasks.find((item) => item.id === id);
    if (!task) return;
    update({ tasks: workspace.tasks.map((item) => item.id === id ? { ...item, title: nextTitle } : item), starredFiles: renameStarredFile(workspace, task.title, nextTitle) });
    cancelTaskEdit();
    emitNotice("Task title updated locally.");
  };
  const cycleDue = (id) => update({ tasks: workspace.tasks.map((task) => { if (task.id !== id) return task; const currentIndex = Math.max(0, dueOrder.indexOf(task.due)); return { ...task, due: dueOrder[(currentIndex + 1) % dueOrder.length] }; }) });
  const removeTask = (id) => { const task = workspace.tasks.find((item) => item.id === id); if (!task) return; const starredTitles = getStarredTitles(workspace); const deletedTask = { id: `task-${id}`, taskId: id, title: task.title, project: task.project, due: task.due, complete: task.complete, type: "Tasks", appId: "tasks", opened: "just now", owner: "Me", starred: starredTitles.has(task.title) }; starredTitles.delete(task.title); update({ tasks: workspace.tasks.filter((item) => item.id !== id), starredFiles: [...starredTitles], deletedFiles: [deletedTask, ...(workspace.deletedFiles ?? [])] }); emitNotice("Task moved to local Trash."); };
  const openCount = workspace.tasks.filter((task) => !task.complete).length;
  const visibleTasks = workspace.tasks.filter((task) => {
    const matchesStatus = filter === "all" || (filter === "today" ? task.due === "Today" : filter === "open" ? !task.complete : task.complete);
    const matchesProject = projectFilter === "all" || String(task.project ?? "").toLowerCase() === projectFilter.toLowerCase();
    return matchesStatus && matchesProject;
  });
  useEffect(() => {
    if (!initialTaskTitle || initialTaskTitle === appliedTaskNavigation.current) return;
    appliedTaskNavigation.current = initialTaskTitle;
    const targetTask = workspace.tasks.find((task) => task.title === initialTaskTitle);
    if (!targetTask) return;
    setFilter("all");
    setProjectFilter(projectOptions.find((project) => project.toLowerCase() === String(targetTask.project ?? "").toLowerCase()) ?? "all");
    window.setTimeout(() => [...document.querySelectorAll(".task-row")].find((row) => row.dataset.taskTitle === initialTaskTitle)?.scrollIntoView({ block: "center" }), 0);
  }, [initialTaskTitle, projectOptions, workspace.tasks]);
  useEffect(() => {
    if (!initialProject || initialProject === appliedProjectNavigation.current) return;
    appliedProjectNavigation.current = initialProject;
    setFilter("all");
    setProjectFilter(projectOptions.find((project) => project.toLowerCase() === initialProject.toLowerCase()) ?? "all");
  }, [initialProject, projectOptions]);
  const cycleFilter = () => setFilter((current) => filterOrder[(filterOrder.indexOf(current) + 1) % filterOrder.length]);
  const exportTasks = () => { downloadText("crescent-tasks.json", JSON.stringify({ format: "crescent-suite-tasks", version: 1, exportedAt: new Date().toISOString(), tasks: workspace.tasks }, null, 2), "application/json"); emitNotice(`${workspace.tasks.length} task${workspace.tasks.length === 1 ? "" : "s"} exported.`); };
  return <div className="tasks-page page-enter">
    <EditorHeader title="Tasks" icon={APP_META.find((app) => app.id === "tasks")} onChangeTitle={() => {}} onNavigate={onNavigate}><button className="secondary-button" onClick={exportTasks}><Download size={16} />Export</button><button className="secondary-button" onClick={cycleFilter}><SlidersIcon />{filterLabels[filter]}</button><button className="primary-button" onClick={() => document.querySelector(".new-task-input")?.focus()}><Plus size={16} />New task</button></EditorHeader>
    <div className="tasks-content"><div className="tasks-heading"><div><h1>Make room for momentum.</h1><p>{openCount} open tasks across your workspace.</p></div><div className="task-progress"><span><i style={{ width: `${Math.max(8, ((workspace.tasks.length - openCount) / Math.max(workspace.tasks.length, 1)) * 100)}%` }} /></span><small>{workspace.tasks.length - openCount} completed</small></div></div>
      <form className="new-task" onSubmit={addTask}><Plus size={19} /><input className="new-task-input" value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="Add a task and press enter..." aria-label="New task" /><select className="new-task-project" value={activeProject} onChange={(event) => setNewProject(event.target.value)} aria-label="New task project"><option value="">No project</option>{projectOptions.map((project) => <option value={project} key={project}>{project}</option>)}</select></form>
      <section className="task-list"><div className="task-list-heading"><div className="task-list-label"><span>{filterLabels[filter]}</span><small>{visibleTasks.length} task{visibleTasks.length === 1 ? "" : "s"}</small></div><select className="task-project-filter" value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} aria-label="Filter tasks by project"><option value="all">All projects</option>{projectOptions.map((project) => <option value={project} key={project}>{project}</option>)}</select></div>{visibleTasks.length ? visibleTasks.map((task) => <div className={`task-row ${task.complete ? "complete" : ""}`} key={task.id} data-task-title={task.title}><button className="task-check" onClick={() => toggle(task.id)} aria-label={`Mark ${task.title} ${task.complete ? "open" : "complete"}`}>{task.complete && <Check size={14} />}</button><div className="task-copy">{editingTask === task.id ? <input className="task-title-edit" value={editingTitle} onChange={(event) => setEditingTitle(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") saveTaskEdit(task.id); if (event.key === "Escape") cancelTaskEdit(); }} aria-label="Edit task title" autoFocus /> : <strong>{task.title}</strong>}<span>{task.project || "No project"}</span></div>{editingTask === task.id ? <div className="task-edit-actions"><button className="task-edit-save" onClick={() => saveTaskEdit(task.id)} aria-label="Save task title"><Check size={15} /></button><button className="task-edit-cancel" onClick={cancelTaskEdit} aria-label="Cancel task title edit"><X size={15} /></button></div> : <button className="icon-button muted task-edit-button" onClick={() => startTaskEdit(task)} aria-label={`Edit ${task.title}`}><Pencil size={15} /></button>}<button className={`task-due ${task.due === "Today" ? "due-today" : ""}`} onClick={() => cycleDue(task.id)} aria-label={`Change due date for ${task.title}`}>{task.due}</button><button className="icon-button muted" onClick={() => removeTask(task.id)} aria-label={`Delete ${task.title}`}><Trash2 size={17} /></button></div>) : <div className="task-empty"><ListChecks size={20} /><strong>No tasks in this view.</strong><small>Try a different status or project, or add a new task above.</small></div>}</section>
    </div>
  </div>;
}

function CalendarView({ workspace, update, onNavigate, initialEventTitle }) {
  const [mode, setMode] = useState("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingEventTitle, setEditingEventTitle] = useState("");
  const [editingEventWhen, setEditingEventWhen] = useState("");
  const [highlightedEvent, setHighlightedEvent] = useState(null);
  const [eventDialog, setEventDialog] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventWhen, setNewEventWhen] = useState("");
  const appliedEventNavigation = useRef(null);
  const localEvents = useMemo(() => workspace.calendarEvents ?? [], [workspace.calendarEvents]);
  useEffect(() => {
    if (!initialEventTitle || initialEventTitle === appliedEventNavigation.current) return;
    appliedEventNavigation.current = initialEventTitle;
    const targetEvent = localEvents.find((event) => event.title === initialEventTitle);
    if (!targetEvent) return;
    setHighlightedEvent(targetEvent.id);
    window.setTimeout(() => [...document.querySelectorAll(".calendar-local-card")].find((card) => card.dataset.eventTitle === initialEventTitle)?.scrollIntoView({ block: "center" }), 0);
  }, [initialEventTitle, localEvents]);
  const openEventDialog = () => { setNewEventTitle(""); setNewEventWhen(""); setEventDialog(true); };
  useEffect(() => {
    if (!eventDialog) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setEventDialog(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [eventDialog]);
  const addEvent = () => {
    const title = newEventTitle.trim();
    const when = newEventWhen.trim();
    if (!title || !when) { emitNotice("Add an event title and time before saving."); return; }
    const eventDate = resolveNaturalDate(when, now);
    update({ calendarEvents: [{ id: Date.now(), title, when, date: localDateKey(eventDate) }, ...localEvents] });
    setEventDialog(false);
    emitNotice("Event saved in this local workspace.");
  };
  const removeEvent = (id) => {
    const event = localEvents.find((item) => item.id === id);
    if (!event) return;
    const starredTitles = getStarredTitles(workspace);
    const deletedEvent = { id: `calendar-${id}`, eventId: id, title: event.title, when: event.when, date: event.date, type: "Calendar", appId: "calendar", opened: "just now", owner: "Me", starred: starredTitles.has(event.title) };
    starredTitles.delete(event.title);
    update({ calendarEvents: localEvents.filter((item) => item.id !== id), starredFiles: [...starredTitles], deletedFiles: [deletedEvent, ...(workspace.deletedFiles ?? [])] });
    emitNotice("Event moved to local Trash.");
  };
  const startEventEdit = (event) => { setEditingEvent(event.id); setEditingEventTitle(event.title); setEditingEventWhen(event.when); };
  const cancelEventEdit = () => { setEditingEvent(null); setEditingEventTitle(""); setEditingEventWhen(""); };
  const saveEventEdit = (id) => {
    const title = editingEventTitle.trim();
    const when = editingEventWhen.trim();
    if (!title || !when) { emitNotice("Add an event title and time before saving."); return; }
    const eventDate = resolveNaturalDate(when, now);
    update({ calendarEvents: localEvents.map((event) => event.id === id ? { ...event, title, when, date: localDateKey(eventDate) } : event) });
    cancelEventEdit();
    emitNotice("Event updated locally.");
  };
  const exportCalendar = () => {
    const events = localEvents.map((event, index) => {
      const date = (event.date ?? localDateKey(displayDate)).replaceAll("-", "");
      const timeMatch = String(event.when ?? "").match(/\b(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\b/i);
      let startLine = `DTSTART;VALUE=DATE:${date}`;
      if (timeMatch) {
        let hour = Number(timeMatch[1]);
        if (timeMatch[3].toUpperCase() === "PM" && hour < 12) hour += 12;
        if (timeMatch[3].toUpperCase() === "AM" && hour === 12) hour = 0;
        startLine = `DTSTART:${date}T${String(hour).padStart(2, "0")}${timeMatch[2] ?? "00"}00`;
      }
      return ["BEGIN:VEVENT", `UID:crescent-${event.id ?? index}@crescent-suite`, `DTSTAMP:${icsTimestamp(new Date())}`, startLine, `SUMMARY:${escapeIcs(event.title)}`, `DESCRIPTION:${escapeIcs(event.when)}`, "END:VEVENT"].join("\r\n");
    });
    const calendar = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Crescent Suite//Calendar//EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR"].join("\r\n");
    downloadText("crescent-calendar.ics", `${calendar}\r\n`, "text/calendar");
    emitNotice(`${localEvents.length} calendar event${localEvents.length === 1 ? "" : "s"} exported.`);
  };
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const displayDate = new Date(now);
  if (mode === "month") {
    const dayOfMonth = displayDate.getDate();
    displayDate.setDate(1);
    displayDate.setMonth(displayDate.getMonth() + monthOffset);
    const lastDay = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0).getDate();
    displayDate.setDate(Math.min(dayOfMonth, lastDay));
  } else {
    displayDate.setDate(displayDate.getDate() + weekOffset * 7);
  }
  const weekStart = new Date(displayDate);
  if (mode !== "day") weekStart.setDate(displayDate.getDate() - displayDate.getDay());
  const todayKey = localDateKey(now);
  const displayHeading = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(displayDate);
  const weekHeading = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(weekStart);
  const displayMonth = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(displayDate);
  const shortDisplayDay = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(displayDate);
  const calendarScope = workspace.demo ? "Product workspace" : "Local schedule";
  const localEventTop = (when, index) => {
    const match = String(when ?? "").match(/\b(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\b/i);
    if (!match) return Math.max(4, 510 - (index * 50));
    let hour = Number(match[1]);
    if (match[3].toUpperCase() === "PM" && hour < 12) hour += 12;
    if (match[3].toUpperCase() === "AM" && hour === 12) hour = 0;
    return Math.max(4, Math.min(520, ((hour - 9) + (Number(match[2] ?? 0) / 60)) * 64));
  };
  const weekDates = Array.from({ length: 7 }, (_, dayOffset) => { const date = new Date(weekStart); date.setDate(weekStart.getDate() + dayOffset); return { date: date.getDate(), dateKey: localDateKey(date), label: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date) }; });
  const localEventsForDay = (dateKey) => localEvents.filter((event) => (event.date ?? localDateKey(displayDate)) === dateKey);
  const localEventsForDate = (date) => localEventsForDay(localDateKey(date)).map((event) => event.title);
  const seedDate = (dayOffset) => { const date = new Date(displayDate); date.setDate(displayDate.getDate() - displayDate.getDay() + dayOffset); return localDateKey(date); };
  const seededMonthEvents = workspace.demo ? new Map([[seedDate(2), ["Product sync", "Design review", "Focus time"]], [seedDate(3), ["Customer interview"]], [seedDate(4), ["Launch review"]]]) : new Map();
  const monthStart = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
  const monthDays = Array.from({ length: 42 }, (_, index) => { const date = new Date(monthStart); date.setDate(index - monthStart.getDay() + 1); const dateKey = localDateKey(date); return { label: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date), date: date.getDate(), dateKey, currentMonth: date.getMonth() === displayDate.getMonth(), events: [...(seededMonthEvents.get(dateKey) ?? []), ...localEventsForDate(date)] }; });
  const monthCalendar = <div className="calendar-month-grid">{monthDays.map((day) => <div className={`calendar-month-cell ${day.currentMonth ? "" : "muted"} ${day.dateKey === todayKey ? "today" : ""}`} key={day.dateKey}><div className="calendar-month-head"><span>{day.label}</span><strong>{day.date}</strong></div><div className="calendar-month-events">{day.events.map((event, index) => <span className={`calendar-month-event month-event-${index % 4}`} key={`${day.dateKey}-${event}`}>{event}</span>)}</div></div>)}</div>;
  const weekCalendar = <div className={"calendar-grid " + (mode === "day" ? "calendar-grid-day" : "")}><div className="calendar-axis"><span /><span>9 AM</span><span>10 AM</span><span>11 AM</span><span>12 PM</span><span>1 PM</span><span>2 PM</span><span>3 PM</span><span>4 PM</span><span>5 PM</span></div>{weekDates.map((day, index) => <div className={"calendar-day " + (mode === "day" && index > 0 ? "muted-day" : "")} key={day.dateKey}><div className="calendar-day-head"><span>{day.dateKey === todayKey ? "Today" : day.label}</span><strong>{day.date}</strong></div><div className="calendar-lines">{Array.from({ length: 9 }, (_, lineIndex) => <span key={lineIndex} />)}{workspace.demo && index === 0 && <><div className="calendar-event event-one"><strong>Product sync</strong><small>Team · 9:00–9:45</small></div><div className="calendar-event event-two"><strong>Design review</strong><small>Design · 10:00–11:00</small></div><div className="calendar-event event-three"><strong>Focus time</strong><small>Personal · 1:00–3:00</small></div><div className="calendar-event event-four"><strong>Marketing check-in</strong><small>Marketing · 4:00–4:30</small></div></>}{workspace.demo && index === 1 && <div className="calendar-event event-five"><strong>Customer interview</strong><small>Research · 11:00–12:00</small></div>}{workspace.demo && index === 2 && <div className="calendar-event event-six"><strong>Launch review</strong><small>Product · 2:00–3:00</small></div>}{localEventsForDay(day.dateKey).map((event, eventIndex) => <div className="calendar-event calendar-event-local" style={{ top: `${localEventTop(event.when, eventIndex)}px` }} key={`local-${event.id ?? event.title}`}><strong>{event.title}</strong><small>{event.when}</small></div>)}</div></div>)}</div>;
  return <div className="calendar-page page-enter">
    <EditorHeader title="Calendar" icon={APP_META.find((app) => app.id === "calendar")} onChangeTitle={() => {}} onNavigate={onNavigate}>
      <button className="secondary-button mobile-calendar-action" onClick={exportCalendar} disabled={!localEvents.length}><Download size={16} />Export ICS</button>
      <button className="secondary-button mobile-calendar-action" onClick={() => mode === "month" ? setMonthOffset((current) => current - 1) : setWeekOffset((current) => current - 1)}><ChevronLeft size={16} />Previous</button>
      <button className="secondary-button mobile-calendar-action" onClick={() => { setWeekOffset(0); setMonthOffset(0); }}><CalendarCheck2 size={16} />Today</button>
      <button className="secondary-button mobile-calendar-action" onClick={() => mode === "month" ? setMonthOffset((current) => current + 1) : setWeekOffset((current) => current + 1)}><ChevronRight size={16} />Next</button>
      <button className="primary-button" onClick={openEventDialog}><Plus size={16} />Event</button>
    </EditorHeader>
    <div className="calendar-content">
      <div className="calendar-heading">
        <div><h1>{mode === "month" ? displayMonth : mode === "week" ? weekHeading : displayHeading}</h1><p>{mode === "month" ? `${displayMonth} · ${calendarScope}` : mode === "day" ? `${shortDisplayDay} · ${calendarScope}` : `Week of ${weekHeading} · ${calendarScope}`}</p></div>
        <div className="calendar-switch"><button className={mode === "day" ? "selected" : ""} onClick={() => setMode("day")} aria-pressed={mode === "day"}>Day</button><button className={mode === "week" ? "selected" : ""} onClick={() => setMode("week")} aria-pressed={mode === "week"}>Week</button><button className={mode === "month" ? "selected" : ""} onClick={() => setMode("month")} aria-pressed={mode === "month"}>Month</button></div>
      </div>
      {localEvents.length > 0 && <section className="calendar-local-events" aria-label="Saved local events">
        <div className="calendar-local-heading"><div><span className="utility-kicker"><CalendarCheck2 size={14} />Saved locally</span><h2>Your Crescent events</h2></div><small>{localEvents.length} event{localEvents.length === 1 ? "" : "s"}</small></div>
        <div className="calendar-local-list">{localEvents.map((event) => <div className={`calendar-local-card ${highlightedEvent === event.id ? "selected" : ""}`} data-event-title={event.title} key={event.id}>
          <span className="calendar-local-dot" />
          {editingEvent === event.id ? <div className="calendar-event-edit-fields">
            <input value={editingEventTitle} onChange={(inputEvent) => setEditingEventTitle(inputEvent.target.value)} onKeyDown={(inputEvent) => { if (inputEvent.key === "Enter") saveEventEdit(event.id); if (inputEvent.key === "Escape") cancelEventEdit(); }} aria-label="Edit event title" autoFocus />
            <input value={editingEventWhen} onChange={(inputEvent) => setEditingEventWhen(inputEvent.target.value)} onKeyDown={(inputEvent) => { if (inputEvent.key === "Enter") saveEventEdit(event.id); if (inputEvent.key === "Escape") cancelEventEdit(); }} aria-label="Edit event time" />
          </div> : <div><strong>{event.title}</strong><small>{event.when}</small></div>}
          {editingEvent === event.id ? <div className="calendar-event-edit-actions"><button className="calendar-event-save" onClick={() => saveEventEdit(event.id)} aria-label="Save event"><Check size={15} /></button><button className="calendar-event-cancel" onClick={cancelEventEdit} aria-label="Cancel event edit"><X size={15} /></button></div> : <><button className="icon-button muted" onClick={() => startEventEdit(event)} aria-label={`Edit ${event.title}`}><Pencil size={15} /></button><button className="icon-button muted" onClick={() => removeEvent(event.id)} aria-label={`Remove ${event.title}`}><Trash2 size={15} /></button></>}
        </div>)}</div>
      </section>}
      {mode === "month" ? monthCalendar : weekCalendar}
    </div>
    {eventDialog && <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEventDialog(false); }}><section className="file-create-dialog event-create-dialog" role="dialog" aria-modal="true" aria-labelledby="event-create-title"><div className="file-create-heading"><div><span className="utility-kicker"><CalendarCheck2 size={14} />New local event</span><h2 id="event-create-title">Block time with intention</h2><p>Add a saved event with the same natural language you use every day.</p></div><button className="icon-button muted" onClick={() => setEventDialog(false)} aria-label="Close new event dialog"><X size={18} /></button></div><div className="event-create-fields"><label className="file-name-field"><span>Event title</span><input autoFocus value={newEventTitle} aria-label="Event title" onChange={(event) => setNewEventTitle(event.target.value)} /></label><label className="file-name-field"><span>When</span><input value={newEventWhen} aria-label="Event time" placeholder="Tomorrow · 3:00 PM" onChange={(event) => setNewEventWhen(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addEvent(); }} /></label></div><div className="file-create-footer"><span><CalendarCheck2 size={14} />Saved locally in this browser</span><div><button className="secondary-button" onClick={() => setEventDialog(false)}>Cancel</button><button className="primary-button" onClick={addEvent}><CalendarCheck2 size={16} />Save event</button></div></div></section></div>}
  </div>;
}

function _DriveViewLegacy({ onNavigate }) {
  const folders = ["Product", "Marketing", "Design", "Operations"];
  return <div className="drive-page page-enter"><EditorHeader title="Drive" icon={APP_META.find((app) => app.id === "drive")} onChangeTitle={() => {}} onNavigate={onNavigate}><button className="secondary-button"><FolderPlus size={16} />New folder</button><button className="primary-button"><FilePlus2 size={16} />New file</button></EditorHeader><div className="drive-content"><div className="drive-heading"><div><h1>Everything in one place.</h1><p>Organize your work without losing the thread.</p></div><div className="drive-view"><button className="selected"><Grid2X2 size={16} /></button><button><List size={16} /></button></div></div><div className="drive-section"><div className="drive-section-title"><span>Folders</span><small>4 folders</small></div><div className="folder-grid">{folders.map((folder, index) => <button className="folder-card" key={folder}><span className={`folder-icon folder-${index}`}><FolderOpen size={21} /></span><strong>{folder}</strong><small>{[12, 8, 14, 5][index]} items</small><MoreHorizontal size={17} /></button>)}</div></div><div className="drive-section"><div className="drive-section-title"><span>Recent files</span><button className="text-link">See all <ArrowRight size={14} /></button></div><div className="drive-file-grid">{RECENT_FILES.slice(0, 6).map((file) => <button className="drive-file" key={file.title} onClick={() => onNavigate(file.type.toLowerCase())}><div className={`drive-file-preview preview-${file.color}`}><PreviewArt type={file.type} /></div><div><AppIcon app={{ ...file, id: file.type.toLowerCase() }} size={15} /><strong>{file.title}</strong></div><small>{file.type} · {file.opened}</small></button>)}</div></div></div></div>;
}

function DriveView({ workspace, update, onNavigate, initialFolderName, initialFileTitle }) {
  const [view, setView] = useState("grid");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedRecentTitle, setSelectedRecentTitle] = useState(null);
  const [newFileDialog, setNewFileDialog] = useState(false);
  const [newFileType, setNewFileType] = useState("Docs");
  const [newFileTitle, setNewFileTitle] = useState("Untitled document");
  const [folderDialog, setFolderDialog] = useState(false);
  const [folderName, setFolderName] = useState("New workspace");
  const appliedFolderNavigation = useRef(null);
  const appliedFileNavigation = useRef(null);
  const recentFiles = getLiveRecentFiles(workspace);
  const displayRecentFiles = useMemo(() => {
    const visibleFiles = recentFiles.slice(0, 6);
    const targetedFile = recentFiles.find((file) => file.title === initialFileTitle);
    return targetedFile && !visibleFiles.some((file) => file.title === targetedFile.title) ? [...visibleFiles.slice(0, 5), targetedFile] : visibleFiles;
  }, [initialFileTitle, recentFiles]);
  const folders = useMemo(() => workspace.driveFolders ?? [
    { name: "Product", items: 12, color: 0 },
    { name: "Marketing", items: 8, color: 1 },
    { name: "Design", items: 14, color: 2 },
    { name: "Operations", items: 5, color: 3 },
  ], [workspace.driveFolders]);
  useEffect(() => {
    if (!initialFolderName || initialFolderName === appliedFolderNavigation.current) return;
    appliedFolderNavigation.current = initialFolderName;
    const targetFolder = folders.find((folder) => folder.name.toLowerCase() === initialFolderName.toLowerCase());
    if (targetFolder) setSelectedFolder(targetFolder.name);
  }, [folders, initialFolderName]);
  useEffect(() => {
    if (!initialFileTitle || initialFileTitle === appliedFileNavigation.current) return;
    appliedFileNavigation.current = initialFileTitle;
    if (!recentFiles.some((file) => file.title === initialFileTitle)) return;
    setSelectedRecentTitle(initialFileTitle);
    window.setTimeout(() => [...document.querySelectorAll("[data-file-title]")].find((node) => node.dataset.fileTitle === initialFileTitle)?.scrollIntoView({ block: "center" }), 0);
  }, [initialFileTitle, recentFiles]);
  const createFolder = () => {
    const trimmedName = folderName.trim();
    if (!trimmedName) { emitNotice("Name your new folder first."); return; }
    if (folders.some((folder) => folder.name.toLowerCase() === trimmedName.toLowerCase())) {
      emitNotice("That folder already exists.");
      return;
    }
    update({ driveFolders: [...folders, { name: trimmedName, items: 0, color: folders.length % 4 }] });
    setFolderDialog(false);
    emitNotice(`${trimmedName} folder added locally.`);
  };
  const openFolderDialog = () => { setFolderName("New workspace"); setFolderDialog(true); };
  const activeFolder = folders.find((folder) => folder.name === selectedFolder);
  const selectFolder = (folder) => { setSelectedFolder((current) => current === folder.name ? null : folder.name); emitNotice(`${folder.name} folder selected locally.`); };
  const openCreateFile = () => { setNewFileType("Docs"); setNewFileTitle("Untitled document"); setNewFileDialog(true); };
  const selectNewFileType = (type) => { const defaults = { Docs: "Untitled document", Sheets: "Untitled spreadsheet", Slides: "Untitled presentation", Notes: "Untitled note", Forms: "Untitled form" }; setNewFileType(type); setNewFileTitle(defaults[type]); };
  useEffect(() => {
    if (!newFileDialog && !folderDialog) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") { setNewFileDialog(false); setFolderDialog(false); } };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [folderDialog, newFileDialog]);
  const createFile = () => {
    const type = newFileType;
    const title = newFileTitle.trim();
    if (!title) { emitNotice("Name your new file first."); return; }
    const starredTitles = getStarredTitles(workspace);
    const deletedFiles = [...(workspace.deletedFiles ?? [])];
    const archive = (record) => {
      if (!record.title?.trim()) return;
      const starred = starredTitles.has(record.title);
      starredTitles.delete(record.title);
      deletedFiles.unshift({ ...record, starred });
    };
    if (type === "Docs") {
      const previous = workspace.docs;
      archive({ id: `doc-${Date.now()}`, title: previous.title, body: previous.body, updatedAt: previous.updatedAt, type, appId: "docs", opened: "just now", owner: "Me" });
      update({ docs: { title, body: `<h1>${escapeHtml(title)}</h1><p>Start writing your next idea here.</p>`, updatedAt: "just now" }, starredFiles: [...starredTitles], deletedFiles });
    } else if (type === "Sheets") {
      const previous = workspace.sheets;
      archive({ id: `sheet-${Date.now()}`, title: previous.title, cells: previous.cells, tabs: previous.tabs, styles: previous.styles, activeSheet: previous.activeSheet, type, appId: "sheets", opened: "just now", owner: "Me" });
      const cells = { A1: "" };
      update({ sheets: { title, cells, tabs: [{ name: "Sheet 1", cells }], activeSheet: 0, styles: {}, updatedAt: "just now" }, starredFiles: [...starredTitles], deletedFiles });
    } else if (type === "Slides") {
      const previousTitle = workspace.slidesTitle;
      archive({ id: `slides-${Date.now()}`, title: previousTitle, slides: workspace.slides, type, appId: "slides", opened: "just now", owner: "Me" });
      const slide = workspace.demo ? { title: "A new chapter", body: "Add a thought worth sharing.", accent: "blue", notes: "", layout: "title-body" } : { title: "", body: "", accent: "lilac", notes: "", layout: "title-body" };
      update({ slidesTitle: title, slides: [slide], starredFiles: [...starredTitles], deletedFiles });
    } else if (type === "Forms") {
      const previousTitle = workspace.formTitle;
      archive({ id: `form-${Date.now()}`, title: previousTitle, formTitle: previousTitle, formTheme: workspace.formTheme, formSettings: workspace.formSettings, forms: workspace.forms, formPublished: workspace.formPublished, formResponses: workspace.formResponses, lastFormResponse: workspace.lastFormResponse, type, appId: "forms", opened: "just now", owner: "Me" });
      update({ formTitle: title, formTheme: "lilac", formSettings: workspace.demo ? { ...INITIAL_WORKSPACE.formSettings } : { collectEmail: false, oneResponse: false }, forms: workspace.demo ? [...INITIAL_WORKSPACE.forms] : [], formPublished: false, formResponses: [], lastFormResponse: undefined, starredFiles: [...starredTitles], deletedFiles });
    } else {
      const newNote = { id: Date.now(), title, body: "", color: "blue", updatedAt: "just now" };
      update({ notes: [newNote, ...(workspace.notes ?? [])] });
    }
    setNewFileDialog(false);
    emitNotice(`${type} created in this local workspace.`);
    onNavigate(type.toLowerCase(), { title });
  };
  return <>
    <div className="drive-page page-enter"><EditorHeader title="Drive" icon={APP_META.find((app) => app.id === "drive")} onChangeTitle={() => {}} onNavigate={onNavigate}><button className="secondary-button" onClick={openFolderDialog}><FolderPlus size={16} />New folder</button><button className="primary-button" onClick={openCreateFile}><FilePlus2 size={16} />New file</button></EditorHeader><div className="drive-content"><div className="drive-heading"><div><h1>{activeFolder ? activeFolder.name : "Everything in one place."}</h1><p>{activeFolder ? "A local folder ready for the work you want to keep together." : "Organize your work without losing the thread."}</p></div><div className="drive-view"><button className={view === "grid" ? "selected" : ""} onClick={() => setView("grid")} aria-label="Grid view" aria-pressed={view === "grid"}><Grid2X2 size={16} /></button><button className={view === "list" ? "selected" : ""} onClick={() => setView("list")} aria-label="List view" aria-pressed={view === "list"}><List size={16} /></button></div></div><div className="drive-section"><div className="drive-section-title"><span>Folders</span><small>{folders.length} folders</small></div><div className={`folder-grid ${view === "list" ? "folder-list-view" : ""}`}>{folders.map((folder) => <button className={`folder-card ${selectedFolder === folder.name ? "selected" : ""}`} data-folder-name={folder.name} key={folder.name} onClick={() => selectFolder(folder)} aria-pressed={selectedFolder === folder.name}><span className={`folder-icon folder-${folder.color}`}><FolderOpen size={21} /></span><strong>{folder.name}</strong><small>{folder.items} items</small><MoreHorizontal size={17} /></button>)}</div>{activeFolder && <div className="drive-folder-detail"><span className={`folder-icon folder-${activeFolder.color}`}><FolderOpen size={18} /></span><div><strong>{activeFolder.name} selected</strong><small>{activeFolder.items} items · saved in this browser</small></div><button className="text-link" onClick={() => setSelectedFolder(null)}>Clear selection</button></div>}</div><div className="drive-section"><div className="drive-section-title"><span>Recent files</span><button className="text-link" onClick={() => onNavigate("recent")}>See all <ArrowRight size={14} /></button></div><div className={`drive-file-grid ${view === "list" ? "drive-list-view" : ""}`}>{displayRecentFiles.map((file) => <button className={`drive-file ${selectedRecentTitle === file.title ? "selected" : ""}`} data-file-title={file.title} key={file.title} onClick={() => onNavigate(file.type.toLowerCase(), fileNavigationContext(file))} aria-pressed={selectedRecentTitle === file.title}><div className={`drive-file-preview preview-${file.color}`}><PreviewArt type={file.type} /></div><div><AppIcon app={{ ...file, id: file.type.toLowerCase() }} size={15} /><strong>{file.title}</strong></div><small>{file.type} · {file.opened}</small></button>)}</div></div></div></div>
    {newFileDialog && <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setNewFileDialog(false); }}><section className="file-create-dialog" role="dialog" aria-modal="true" aria-labelledby="file-create-title"><div className="file-create-heading"><div><span className="utility-kicker"><FilePlus2 size={14} />New local file</span><h2 id="file-create-title">Start something new</h2><p>Choose a Crescent tool, then give your new work a name.</p></div><button className="icon-button muted" onClick={() => setNewFileDialog(false)} aria-label="Close new file dialog"><X size={18} /></button></div><div className="file-type-grid" aria-label="File type">{DRIVE_FILE_TYPES.map(({ type, icon: Icon, color, description }) => <button className={`file-type-option ${newFileType === type ? "selected" : ""}`} key={type} onClick={() => selectNewFileType(type)} aria-pressed={newFileType === type}><span className={`app-icon app-icon-${color}`}><Icon size={17} /></span><span><strong>{type}</strong><small>{description}</small></span>{newFileType === type && <Check size={16} />}</button>)}</div><label className="file-name-field"><span>File name</span><input autoFocus value={newFileTitle} aria-label="File name" onChange={(event) => setNewFileTitle(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") createFile(); }} /></label><div className="file-create-footer"><span><HardDrive size={14} />Saved locally in this browser</span><div><button className="secondary-button" onClick={() => setNewFileDialog(false)}>Cancel</button><button className="primary-button" onClick={createFile}><FilePlus2 size={16} />Create {newFileType}</button></div></div></section></div>}
    {folderDialog && <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setFolderDialog(false); }}><section className="file-create-dialog sidebar-create-dialog" role="dialog" aria-modal="true" aria-labelledby="folder-create-title"><div className="file-create-heading"><div><span className="utility-kicker"><FolderPlus size={14} />New local folder</span><h2 id="folder-create-title">Make room for a new folder</h2><p>Organize related work without leaving the local Crescent workspace.</p></div><button className="icon-button muted" onClick={() => setFolderDialog(false)} aria-label="Close new folder dialog"><X size={18} /></button></div><label className="file-name-field"><span>Folder name</span><input autoFocus value={folderName} aria-label="Folder name" onChange={(event) => setFolderName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") createFolder(); }} /></label><div className="file-create-footer"><span><HardDrive size={14} />Saved locally in this browser</span><div><button className="secondary-button" onClick={() => setFolderDialog(false)}>Cancel</button><button className="primary-button" onClick={createFolder}><FolderPlus size={16} />Add folder</button></div></div></section></div>}
  </>;
}

function _FormsViewLegacy({ workspace, update, onNavigate }) {
  const [published, setPublished] = useState(false);
  const addQuestion = () => update({ forms: [...workspace.forms, { id: Date.now(), label: "New question", type: "Short answer", required: false }] });
  return <div className="forms-page page-enter"><EditorHeader title="Launch feedback" icon={APP_META.find((app) => app.id === "forms")} onChangeTitle={() => {}} onNavigate={onNavigate}><button className="secondary-button"><EyeIcon />Preview</button><button className="primary-button" onClick={() => setPublished(true)}><Share2 size={16} />{published ? "Published" : "Publish"}</button></EditorHeader><div className="forms-content"><div className="forms-heading"><div><h1>Launch feedback</h1><p>Ask the questions that help the next move become obvious.</p></div><span className={`publish-status ${published ? "is-published" : ""}`}><span />{published ? "Live" : "Draft"}</span></div><div className="form-builder"><div className="form-preview"><div className="form-cover"><div className="form-cover-orbit" /><span>CRESCENT / FEEDBACK</span><h2>Help us make the next release better.</h2><p>A two-minute check-in for the people who use the work.</p></div><div className="form-questions">{workspace.forms.map((question, index) => <div className="form-question" key={question.id}><span>{index + 1}</span><div><strong>{question.label}</strong><small>{question.type} {question.required && "· Required"}</small><div className="fake-input">{question.type === "Scale" ? <>{[1, 2, 3, 4, 5].map((value) => <button key={value}>{value}</button>)}</> : "Your answer..."}</div></div></div>)}<button className="add-question" onClick={addQuestion}><Plus size={16} />Add question</button></div></div><aside className="form-settings"><div className="inspector-heading"><span>Form settings</span><Settings2 size={16} /></div><div className="inspector-section"><span className="inspector-label">Responses</span><div className="setting-row"><span>Collect email addresses</span><button className="toggle" aria-label="Collect email addresses"><i /></button></div><div className="setting-row"><span>Allow one response</span><button className="toggle active" aria-label="Allow one response"><i /></button></div></div><div className="inspector-section"><span className="inspector-label">Theme</span><div className="form-theme"><button className="theme-swatch swatch-lilac" /><button className="theme-swatch swatch-blue" /><button className="theme-swatch swatch-gold" /></div></div></aside></div></div></div>;
}

function FormResponses({ workspace, responses, onBack, onExport }) {
  return <section className="form-responses-panel"><div className="response-panel-heading"><div><span className="utility-kicker"><CheckCircle2 size={14} />Saved locally</span><h2>{responses.length} response{responses.length === 1 ? "" : "s"}</h2><p>Review the answers collected on this device.</p></div><div className="response-panel-actions"><button className="secondary-button" onClick={onExport} disabled={!responses.length}><Download size={15} />Export CSV</button><button className="secondary-button" onClick={onBack}><EyeIcon />Back to form</button></div></div>{responses.length ? <div className="response-list">{responses.map((response, responseIndex) => <article className="response-card" key={response.id ?? responseIndex}><div className="response-card-heading"><strong>Response {responses.length - responseIndex}</strong><small>{response.submittedAt ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(response.submittedAt)) : "Saved locally"}</small></div><div className="response-grid">{workspace.formSettings?.collectEmail && <div><span>Email address</span><strong>{response.answers?.email || "No email"}</strong></div>}{workspace.forms.map((question) => <div key={question.id}><span>{question.label}</span><strong>{question.type === "Scale" ? response.scaleAnswers?.[question.id] ?? response.scale ?? "No answer" : response.answers?.[question.id] || "No answer"}</strong></div>)}</div></article>)}</div> : <div className="response-empty"><CheckCircle2 size={20} /><strong>No responses yet.</strong><small>Submit the form in Preview mode to create the first local response.</small></div>}</section>;
}

function FormsView({ workspace, update, onNavigate, initialQuestionId }) {
  const [formTitle, setFormTitle] = useState(workspace.formTitle ?? "");
  const [published, setPublished] = useState(workspace.formPublished ?? false);
  const [submitted, setSubmitted] = useState(workspace.lastFormResponse?.saved ?? false);
  const [scaleAnswers, setScaleAnswers] = useState(() => {
    const existing = workspace.lastFormResponse?.scaleAnswers;
    if (existing && typeof existing === "object" && Object.keys(existing).length) return existing;
    const scaleQuestion = workspace.forms.find((question) => question.type === "Scale");
    return scaleQuestion && workspace.lastFormResponse?.scale != null ? { [scaleQuestion.id]: workspace.lastFormResponse.scale } : {};
  });
  const [answers, setAnswers] = useState(workspace.lastFormResponse?.answers ?? {});
  const [previewing, setPreviewing] = useState(false);
  const [showResponses, setShowResponses] = useState(false);
  const appliedQuestionNavigation = useRef(null);
  const formTheme = workspace.formTheme ?? "lilac";
  const formSettings = workspace.formSettings ?? { collectEmail: false, oneResponse: true };
  const responses = workspace.formResponses?.length ? workspace.formResponses : workspace.lastFormResponse?.saved ? [workspace.lastFormResponse] : [];
  useEffect(() => {
    if (!initialQuestionId || initialQuestionId === appliedQuestionNavigation.current) return;
    appliedQuestionNavigation.current = initialQuestionId;
    const targetQuestion = workspace.forms.find((question) => question.id === initialQuestionId);
    if (!targetQuestion) return;
    window.setTimeout(() => {
      const questionIndex = workspace.forms.findIndex((question) => question.id === targetQuestion.id) + (formSettings.collectEmail ? 1 : 0);
      const questionNode = document.querySelectorAll(".form-question")[questionIndex];
      questionNode?.classList.add("selected");
      questionNode?.setAttribute("data-question-id", String(initialQuestionId));
      questionNode?.scrollIntoView({ block: "center" });
    }, 0);
  }, [formSettings.collectEmail, initialQuestionId, workspace.forms]);
  const addQuestion = () => update({ forms: [...workspace.forms, { id: Date.now(), label: "New question", type: "Short answer", required: false }] });
  const updateQuestion = (id, label) => update({ forms: workspace.forms.map((question) => question.id === id ? { ...question, label } : question) });
  const toggleRequired = (id) => update({ forms: workspace.forms.map((question) => question.id === id ? { ...question, required: !question.required } : question) });
  const removeQuestion = (id) => { if (workspace.forms.length <= 1) { emitNotice("Keep one question in the form."); return; } update({ forms: workspace.forms.filter((question) => question.id !== id) }); emitNotice("Question removed from this local form."); };
  const cycleQuestionType = (id) => { const types = ["Short answer", "Long answer", "Scale"]; update({ forms: workspace.forms.map((question) => { if (question.id !== id) return question; const nextType = types[(types.indexOf(question.type) + 1) % types.length]; return { ...question, type: nextType }; }) }); };
  const toggleFormSetting = (setting) => update({ formSettings: { ...formSettings, [setting]: !formSettings[setting] } });
  const setFormTheme = (theme) => update({ formTheme: theme });
  const publishForm = () => { if (!workspace.forms.length) { emitNotice("Add at least one question before publishing."); return; } setPublished(true); update({ formPublished: true }); };
  const moveFormToTrash = () => {
    const starredTitles = getStarredTitles(workspace);
    const deletedForm = { id: `form-${Date.now()}`, title: formTitle, formTitle, formTheme, formSettings, forms: workspace.forms, formPublished: published, formResponses: workspace.formResponses ?? [], lastFormResponse: workspace.lastFormResponse, type: "Forms", appId: "forms", opened: "just now", owner: "Me", starred: starredTitles.has(formTitle) };
    starredTitles.delete(formTitle);
    update({ formTitle: "Untitled form", formTheme: "lilac", formSettings: { ...INITIAL_WORKSPACE.formSettings }, forms: [...INITIAL_WORKSPACE.forms], formPublished: false, formResponses: [], lastFormResponse: undefined, starredFiles: [...starredTitles], deletedFiles: [deletedForm, ...(workspace.deletedFiles ?? [])] });
    emitNotice("Form moved to local Trash.");
    onNavigate("trash");
  };
  const exportForm = () => { const exportData = { title: formTitle, questions: workspace.forms, settings: formSettings, responses, response: workspace.lastFormResponse ?? null }; downloadText(`${safeFileName(formTitle || "crescent-form")}.json`, JSON.stringify(exportData, null, 2), "application/json"); emitNotice("Form export downloaded."); };
  const exportResponses = () => { const headers = ["Submitted at", ...(formSettings.collectEmail ? ["Email address"] : []), ...workspace.forms.map((question) => question.label)]; const rows = responses.map((response) => [response.submittedAt ?? "", ...(formSettings.collectEmail ? [response.answers?.email ?? ""] : []), ...workspace.forms.map((question) => question.type === "Scale" ? response.scaleAnswers?.[question.id] ?? response.scale ?? "" : response.answers?.[question.id] ?? "")]); const csv = [headers, ...rows].map((row) => row.map((value) => JSON.stringify(String(value ?? ""))).join(",")).join("\n"); downloadText(`${safeFileName(formTitle || "crescent-form")}-responses.csv`, `${csv}\n`, "text/csv"); emitNotice("Form responses exported as CSV."); };
  const submitResponse = () => { const email = answers.email?.trim() ?? ""; if (formSettings.collectEmail && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) { emitNotice("Add a valid email address before submitting."); return; } const missingRequired = workspace.forms.some((question) => question.required && (question.type === "Scale" ? !scaleAnswers[question.id] : !answers[question.id]?.trim())); if (missingRequired) { emitNotice("Complete all required questions before submitting."); return; } const response = { id: Date.now(), saved: true, submittedAt: new Date().toISOString(), scale: Object.values(scaleAnswers).find((value) => Number.isInteger(value) && value >= 1 && value <= 5) ?? null, scaleAnswers, answers }; setSubmitted(true); update({ lastFormResponse: response, formResponses: [response, ...(workspace.formResponses ?? [])] }); emitNotice("Response saved in this local workspace."); };
  if (!workspace.demo && !formTitle && workspace.forms.length === 0 && !showResponses) return <div className={`forms-page page-enter form-theme-${formTheme}`}><EditorHeader title="" icon={APP_META.find((app) => app.id === "forms")} onChangeTitle={(value) => { setFormTitle(value); update({ formTitle: value }); }} onNavigate={onNavigate}><button className="secondary-button" onClick={exportForm}><Download size={16} />Export</button><button className="secondary-button" onClick={() => setPreviewing(true)}><EyeIcon />Preview</button><button className="primary-button" onClick={addQuestion}><Plus size={16} />Add question</button></EditorHeader><div className="form-empty-state"><span className="home-empty-icon"><FormInput size={18} /></span><h1>Build a form that fits the moment.</h1><p>Name your form above, then add one clear question to get started. Everything stays in this browser.</p><button className="primary-button" onClick={addQuestion}><Plus size={16} />Add your first question</button></div></div>;
  const displayTitle = formTitle || "Untitled form";
  return <div className={`forms-page page-enter form-theme-${formTheme}`}>
    <EditorHeader title={formTitle} icon={APP_META.find((app) => app.id === "forms")} onChangeTitle={(value) => { setFormTitle(value); update({ formTitle: value, starredFiles: renameStarredFile(workspace, workspace.formTitle, value) }); }} onNavigate={onNavigate}>
      <button className="secondary-button" onClick={exportForm}><Download size={16} />Export</button>
      <button className="secondary-button" onClick={() => setShowResponses((current) => !current)}><CheckCircle2 size={15} />Responses {responses.length ? `(${responses.length})` : ""}</button>
      <button className="secondary-button" onClick={() => setPreviewing((current) => !current)}><EyeIcon />{previewing ? "Edit form" : "Preview"}</button>
      <button className="secondary-button editor-trash-button" onClick={moveFormToTrash}><Trash2 size={16} />Move to Trash</button>
      <button className="primary-button" onClick={publishForm}><Share2 size={16} />{published ? "Published" : "Publish"}</button>
    </EditorHeader>
    <div className={`forms-content ${previewing ? "forms-preview-mode" : ""}`}>
      <div className="forms-heading"><div><h1>{displayTitle}</h1><p>{workspace.demo ? "Ask the questions that help the next move become obvious." : "Create a focused form and keep responses on this device."}</p></div><span className={`publish-status ${published ? "is-published" : ""}`}><span />{published ? "Live" : "Draft"}</span></div>
      {showResponses ? <FormResponses workspace={workspace} responses={responses} onBack={() => setShowResponses(false)} onExport={exportResponses} /> : <div className="form-builder">
        <div className="form-preview">
          <div className="form-cover"><div className="form-cover-orbit" /><span>{workspace.demo ? "CRESCENT / FEEDBACK" : "LOCAL FORM"}</span><h2>{workspace.demo ? "Help us make the next release better." : displayTitle === "Untitled form" ? "Start with one clear question." : displayTitle}</h2><p>{workspace.demo ? "A two-minute check-in for the people who use the work." : "Add a question below whenever you are ready."}</p></div>
          <div className="form-questions">
            {formSettings.collectEmail && <div className="form-question"><span>•</span><div><strong>Email address</strong><small>Required to respond</small><input className="form-input" type="email" value={answers.email ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, email: event.target.value }))} placeholder="you@example.com" aria-label="Email address" aria-required="true" /></div></div>}
            {!workspace.forms.length && <div className="form-question-empty"><FormInput size={18} /><span>Add a question to give this form a purpose.</span></div>}
            {workspace.forms.map((question, index) => <div className="form-question" key={question.id}><span>{index + 1}</span><div>{previewing ? <strong>{question.label}</strong> : <input className="question-label-input" value={question.label} aria-label={`Question ${index + 1} label`} onChange={(event) => updateQuestion(question.id, event.target.value)} />}{previewing ? <small>{question.type} {question.required && "· Required"}</small> : <div className="question-edit-actions"><button className="question-type-toggle" onClick={() => cycleQuestionType(question.id)} aria-label={`Change question ${index + 1} type`}>{question.type}</button><button className="question-required-toggle" onClick={() => toggleRequired(question.id)} aria-pressed={question.required}>{question.required ? "Required" : "Optional"}</button><button className="icon-button muted" onClick={() => removeQuestion(question.id)} aria-label={`Delete question ${index + 1}`}><Trash2 size={15} /></button></div>}{question.type === "Scale" ? <div className="fake-input scale-input">{[1, 2, 3, 4, 5].map((value) => <button className={scaleAnswers[question.id] === value ? "selected" : ""} key={value} onClick={() => setScaleAnswers((current) => ({ ...current, [question.id]: value }))} aria-label={`${question.label}: ${value}`} aria-pressed={scaleAnswers[question.id] === value} aria-required={question.required}>{value}</button>)}</div> : question.type === "Long answer" ? <textarea className="form-input form-textarea" aria-label={question.label} aria-required={question.required} value={answers[question.id] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} placeholder="Your answer..." /> : <input className="form-input" aria-label={question.label} aria-required={question.required} value={answers[question.id] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} placeholder="Your answer..." />}</div></div>)}
            <button className="add-question" onClick={addQuestion}><Plus size={16} />Add question</button><button className="form-submit" onClick={submitResponse} disabled={!workspace.forms.length || (submitted && formSettings.oneResponse)}>{submitted && formSettings.oneResponse ? <><Check size={16} />Response saved</> : "Submit response"}</button>{submitted && <p className="form-success"><CheckCircle2 size={14} />Thanks — your response is saved locally.</p>}
          </div>
        </div>
        <aside className="form-settings"><div className="inspector-heading"><span>Form settings</span><Settings2 size={16} /></div><div className="inspector-section"><span className="inspector-label">Responses</span><div className="setting-row"><span>Collect email addresses</span><button className={`toggle ${formSettings.collectEmail ? "active" : ""}`} onClick={() => toggleFormSetting("collectEmail")} aria-label="Collect email addresses" aria-pressed={formSettings.collectEmail}><i /></button></div><div className="setting-row"><span>Allow one response</span><button className={`toggle ${formSettings.oneResponse ? "active" : ""}`} onClick={() => toggleFormSetting("oneResponse")} aria-label="Allow one response" aria-pressed={formSettings.oneResponse}><i /></button></div></div><div className="inspector-section"><span className="inspector-label">Theme</span><div className="form-theme"><button className={`theme-swatch swatch-lilac ${formTheme === "lilac" ? "selected" : ""}`} onClick={() => setFormTheme("lilac")} aria-label="Lilac theme" aria-pressed={formTheme === "lilac"} /><button className={`theme-swatch swatch-blue ${formTheme === "blue" ? "selected" : ""}`} onClick={() => setFormTheme("blue")} aria-label="Blue theme" aria-pressed={formTheme === "blue"} /><button className={`theme-swatch swatch-gold ${formTheme === "gold" ? "selected" : ""}`} onClick={() => setFormTheme("gold")} aria-label="Gold theme" aria-pressed={formTheme === "gold"} /></div></div></aside>
      </div>}
    </div>
  </div>;
}

function EyeIcon() { return <span className="eye-icon">◉</span>; }

function UtilityView({ id, workspace, update, onNavigate }) {
  const labels = { recent: ["Recent files", "Everything you touched lately, in one quiet list."], starred: ["Starred", "The files you want close at hand."], shared: ["Shared with me", "Work that has arrived from the people around you."], trash: ["Trash", "Files stay here until you are ready to let them go."], settings: ["Settings", "Shape Crescent around the way you work."] };
  const emptyCopy = { recent: ["No recent files yet.", "Open an app and your work will appear here."], starred: ["Nothing starred yet.", "Star a file from Home or Recent to keep it close."], shared: ["Nothing shared yet.", "Shared work will appear here when Crescent Cloud is connected."], trash: ["Trash is empty.", "Deleted local files will stay here until you restore them."], settings: ["Nothing here yet.", ""] };
  const [title, description] = labels[id] ?? labels.recent;
  const [emptyTitle, emptyDescription] = emptyCopy[id] ?? emptyCopy.recent;
  const emptyAction = { recent: ["Open apps", "home"], starred: ["Browse recent", "recent"], shared: ["Back home", "home"], trash: ["View recent files", "recent"] }[id];
  const [confirmAction, setConfirmAction] = useState(null);
  useEffect(() => {
    if (!confirmAction) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setConfirmAction(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [confirmAction]);
  const files = id === "starred" ? getLiveRecentFiles(workspace).filter((file) => file.starred) : id === "shared" ? (workspace.demo ? RECENT_FILES.filter((file) => file.owner !== "Me") : []) : id === "trash" ? (workspace.deletedFiles ?? []).map((file) => ({ ...(APP_META.find((app) => app.id === file.appId) ?? {}), ...file })) : getLiveRecentFiles(workspace);
  const backupInputRef = useRef(null);
  const exportWorkspace = () => { downloadText("crescent-workspace-backup.json", JSON.stringify({ format: "crescent-suite-workspace", version: 1, exportedAt: new Date().toISOString(), workspace }, null, 2), "application/json"); emitNotice("Workspace backup downloaded."); };
  const importWorkspace = (event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new window.FileReader(); reader.onload = () => { try { const parsed = JSON.parse(reader.result); const imported = parsed?.workspace ?? parsed; if (!imported || imported.version !== 1 || !imported.docs || !imported.sheets) throw new Error("Invalid Crescent backup"); update(normalizeWorkspace(imported)); emitNotice("Workspace backup restored locally."); } catch { emitNotice("That backup could not be restored."); } }; reader.readAsText(file); event.target.value = ""; };
  const requestDeleteForever = (file) => setConfirmAction({ kind: "delete", file });
  const requestEmptyTrash = () => {
    const count = workspace.deletedFiles?.length ?? 0;
    if (!count) return;
    setConfirmAction({ kind: "empty", count });
  };
  const requestResetWorkspace = () => setConfirmAction({ kind: "reset" });
  const confirmDestructiveAction = () => {
    if (!confirmAction) return;
    if (confirmAction.kind === "reset") {
      update(createEmptyWorkspace());
      setConfirmAction(null);
      onNavigate("home");
      emitNotice("Workspace reset locally. Start fresh on Home.");
      return;
    }
    if (confirmAction.kind === "delete") {
      const file = confirmAction.file;
      update({ deletedFiles: (workspace.deletedFiles ?? []).filter((item) => item.id !== file.id) });
      setConfirmAction(null);
      emitNotice(`${file.title} permanently deleted from this browser.`);
      return;
    }
    update({ deletedFiles: [] });
    setConfirmAction(null);
    emitNotice("Local Trash emptied.");
  };
  const restoreFile = (file) => {
    if (file.type === "Docs") {
      const currentDoc = workspace.docs;
      const restoredDoc = { title: file.title, body: file.body ?? "<h1>Recovered document</h1><p>Continue writing here.</p>", updatedAt: "Recovered" };
      const starredTitles = getStarredTitles(workspace);
      const archivedCurrent = { id: `doc-${Date.now()}`, title: currentDoc.title, body: currentDoc.body, updatedAt: currentDoc.updatedAt, type: "Docs", appId: "docs", opened: "just now", owner: "Me", starred: starredTitles.has(currentDoc.title) };
      starredTitles.delete(currentDoc.title);
      if (file.starred) starredTitles.add(file.title); else starredTitles.delete(file.title);
      update({ docs: restoredDoc, starredFiles: [...starredTitles], deletedFiles: [archivedCurrent, ...(workspace.deletedFiles ?? []).filter((item) => item.id !== file.id)] });
      emitNotice("Document restored to Docs.");
      return;
    }
    if (file.type === "Sheets") {
      const currentSheet = workspace.sheets;
      const restoredSheet = { ...INITIAL_WORKSPACE.sheets, title: file.title, cells: file.cells ?? {}, tabs: file.tabs, styles: file.styles, activeSheet: file.activeSheet ?? 0, updatedAt: "Recovered" };
      const starredTitles = getStarredTitles(workspace);
      const archivedCurrent = { id: `sheet-${Date.now()}`, title: currentSheet.title, cells: currentSheet.cells, tabs: currentSheet.tabs, styles: currentSheet.styles, activeSheet: currentSheet.activeSheet, type: "Sheets", appId: "sheets", opened: "just now", owner: "Me", starred: starredTitles.has(currentSheet.title) };
      starredTitles.delete(currentSheet.title);
      if (file.starred) starredTitles.add(file.title); else starredTitles.delete(file.title);
      update({ sheets: restoredSheet, starredFiles: [...starredTitles], deletedFiles: [archivedCurrent, ...(workspace.deletedFiles ?? []).filter((item) => item.id !== file.id)] });
      emitNotice("Spreadsheet restored to Sheets.");
      return;
    }
    if (file.type === "Slides") {
      const currentTitle = workspace.slidesTitle;
      const restoredSlides = Array.isArray(file.slides) && file.slides.length ? file.slides : INITIAL_WORKSPACE.slides;
      const starredTitles = getStarredTitles(workspace);
      const archivedCurrent = { id: `slides-${Date.now()}`, title: currentTitle, slides: workspace.slides, type: "Slides", appId: "slides", opened: "just now", owner: "Me", starred: starredTitles.has(currentTitle) };
      starredTitles.delete(currentTitle);
      if (file.starred) starredTitles.add(file.title); else starredTitles.delete(file.title);
      update({ slidesTitle: file.title, slides: restoredSlides, starredFiles: [...starredTitles], deletedFiles: [archivedCurrent, ...(workspace.deletedFiles ?? []).filter((item) => item.id !== file.id)] });
      emitNotice("Presentation restored to Slides.");
      return;
    }
    if (file.type === "Tasks") {
      const restoredTask = { id: file.taskId ?? Date.now(), title: file.title, project: file.project ?? "Recovered", due: file.due ?? "Today", complete: file.complete ?? false };
      const starredTitles = getStarredTitles(workspace);
      if (file.starred) starredTitles.add(file.title); else starredTitles.delete(file.title);
      update({ tasks: [restoredTask, ...workspace.tasks], starredFiles: [...starredTitles], deletedFiles: (workspace.deletedFiles ?? []).filter((item) => item.id !== file.id) });
      emitNotice("Task restored to Tasks.");
      return;
    }
    if (file.type === "Notes") {
      const restoredNote = { id: file.noteId ?? Date.now(), title: file.title, body: file.body ?? "", color: file.color ?? "blue", updatedAt: file.updatedAt ?? "Recovered" };
      const starredTitles = getStarredTitles(workspace);
      if (file.starred) starredTitles.add(file.title); else starredTitles.delete(file.title);
      update({ notes: [restoredNote, ...workspace.notes], starredFiles: [...starredTitles], deletedFiles: (workspace.deletedFiles ?? []).filter((item) => item.id !== file.id) });
      emitNotice("Note restored to Notes.");
      return;
    }
    if (file.type === "Calendar") {
      const restoredEvent = { id: file.eventId ?? Date.now(), title: file.title, when: file.when ?? "No time", ...(file.date ? { date: file.date } : {}) };
      const starredTitles = getStarredTitles(workspace);
      if (file.starred) starredTitles.add(file.title); else starredTitles.delete(file.title);
      update({ calendarEvents: [restoredEvent, ...(workspace.calendarEvents ?? [])], starredFiles: [...starredTitles], deletedFiles: (workspace.deletedFiles ?? []).filter((item) => item.id !== file.id) });
      emitNotice("Event restored to Calendar.");
      return;
    }
    if (file.type === "Forms") {
      const currentTitle = workspace.formTitle;
      const restoredForms = Array.isArray(file.forms) && file.forms.length ? file.forms : INITIAL_WORKSPACE.forms;
      const starredTitles = getStarredTitles(workspace);
      const archivedCurrent = { id: `form-${Date.now()}`, title: currentTitle, formTitle: currentTitle, formTheme: workspace.formTheme, formSettings: workspace.formSettings, forms: workspace.forms, formPublished: workspace.formPublished, formResponses: workspace.formResponses, lastFormResponse: workspace.lastFormResponse, type: "Forms", appId: "forms", opened: "just now", owner: "Me", starred: starredTitles.has(currentTitle) };
      starredTitles.delete(currentTitle);
      if (file.starred) starredTitles.add(file.title); else starredTitles.delete(file.title);
      update({ formTitle: file.formTitle ?? file.title, formTheme: file.formTheme ?? "lilac", formSettings: file.formSettings ?? INITIAL_WORKSPACE.formSettings, forms: restoredForms, formPublished: Boolean(file.formPublished), formResponses: Array.isArray(file.formResponses) ? file.formResponses : [], lastFormResponse: file.lastFormResponse, starredFiles: [...starredTitles], deletedFiles: [archivedCurrent, ...(workspace.deletedFiles ?? []).filter((item) => item.id !== file.id)] });
      emitNotice("Form restored to Forms.");
    }
  };
  const destructiveDialog = confirmAction && <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmAction(null); }}><section className="file-create-dialog confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description"><div className="file-create-heading"><div><span className="utility-kicker"><Trash2 size={14} />{confirmAction.kind === "reset" ? "Start over locally" : confirmAction.kind === "delete" ? "Permanent deletion" : "Empty local Trash"}</span><h2 id="confirm-title">{confirmAction.kind === "reset" ? "Start over with a blank workspace?" : confirmAction.kind === "delete" ? "Delete this file forever?" : "Empty Trash for good?"}</h2><p id="confirm-description">{confirmAction.kind === "reset" ? "Your Crescent files, tasks, events, messages, folders, projects, and Trash will be cleared from this browser. Download a backup first if you may need them later." : confirmAction.kind === "delete" ? `“${confirmAction.file.title}” cannot be restored after this step.` : `${confirmAction.count} item${confirmAction.count === 1 ? "" : "s"} will be permanently removed from this browser.`}</p></div><button className="icon-button muted" onClick={() => setConfirmAction(null)} aria-label="Close confirmation dialog"><X size={18} /></button></div><div className="file-create-footer"><span><Trash2 size={14} />This action cannot be undone</span><div><button className="secondary-button" onClick={() => setConfirmAction(null)}>Cancel</button><button className="danger-button" onClick={confirmDestructiveAction}>{confirmAction.kind === "reset" ? "Reset workspace" : confirmAction.kind === "delete" ? "Delete forever" : "Empty Trash"}</button></div></div></section></div>;
  const fileRows = files.map((file) => id === "trash" ? <div className="utility-file-row" key={file.id ?? file.title}><AppIcon app={{ ...file, id: file.type.toLowerCase() }} /><div><strong>{file.title}</strong><small>{file.type} · {file.opened} · {file.owner}</small></div><button className="secondary-button" onClick={() => restoreFile(file)}>Restore</button><button className="secondary-button" onClick={() => requestDeleteForever(file)}>Delete forever</button></div> : <button className="utility-file-row" key={file.title} onClick={() => onNavigate(file.type.toLowerCase(), fileNavigationContext(file))}><AppIcon app={{ ...file, id: file.type.toLowerCase() }} /><div><strong>{file.title}</strong><small>{file.type} · {file.opened} · {file.owner}</small></div><ArrowRight size={16} /></button>);
  return <div className="utility-page page-enter"><div className="utility-heading"><div><span className="utility-kicker"><Sparkles size={14} />Crescent workspace</span><h1>{title}</h1><p>{description}</p></div>{id === "trash" && files.length > 0 && <button className="secondary-button" onClick={requestEmptyTrash}><Trash2 size={16} />Empty Trash</button>}<button className="primary-button" onClick={() => onNavigate("home")}><Home size={16} />Back home</button></div><div className="utility-panel">{id === "settings" ? <><div className="settings-row"><div><strong>Appearance</strong><small>Keep Crescent quiet after dark.</small></div><button className="theme-toggle"><MoonIcon /><span>Night</span><Check size={15} /></button></div><div className="settings-row"><div><strong>Local workspace</strong><small>Your work is saved in this browser. No account connection required.</small></div><span className="local-status"><span />Active</span></div><div className="settings-row"><div><strong>Workspace backup</strong><small>Export your local work or restore it on this device later.</small></div><div className="settings-actions"><button className="secondary-button" onClick={exportWorkspace}><Download size={15} />Download</button><button className="secondary-button" onClick={() => backupInputRef.current?.click()}><FolderOpen size={15} />Import</button><input ref={backupInputRef} className="backup-input" type="file" accept="application/json,.json" aria-label="Import workspace backup" onChange={importWorkspace} /></div></div><div className="settings-row"><div><strong>Keyboard shortcuts</strong><small>Search: Command + K. Focus Mode: Command/Ctrl + Shift + F. Escape exits Focus Mode.</small></div><kbd><Command size={13} />K</kbd></div><div className="settings-row settings-row-danger"><div><strong>Start over</strong><small>Clear this browser’s Crescent workspace and return to a blank Home.</small></div><button className="danger-button" onClick={requestResetWorkspace}><Trash2 size={15} />Reset workspace</button></div></> : files.length ? fileRows : <div className="utility-empty"><Trash2 size={19} /><strong>{emptyTitle}</strong><small>{emptyDescription}</small>{emptyAction && <button className="utility-empty-action" onClick={() => onNavigate(emptyAction[1])}>{emptyAction[0]}<ArrowRight size={15} /></button>}</div>}</div>{destructiveDialog}</div>;
}

function MoonIcon() { return <span className="moon-icon" />; }

function emitNotice(message) {
  window.dispatchEvent(new CustomEvent("crescent:notice", { detail: message }));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}

function escapeIcs(value) {
  return String(value ?? "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

function icsTimestamp(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function localDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function scheduleTimeLabel(value) {
  return String(value ?? "").match(/\b\d{1,2}(?::\d{2})?\s*(?:AM|PM)\b/i)?.[0] ?? "Saved";
}

function resolveNaturalDate(input, baseDate) {
  const text = String(input ?? "").trim().toLowerCase();
  const eventDate = new Date(baseDate);
  eventDate.setHours(0, 0, 0, 0);
  if (/\btomorrow\b/.test(text)) eventDate.setDate(eventDate.getDate() + 1);
  else if (/\byesterday\b/.test(text)) eventDate.setDate(eventDate.getDate() - 1);
  else if (!/\btoday\b/.test(text)) {
    const weekdayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const weekdayIndex = weekdayNames.findIndex((day) => new RegExp(`\\b${day}\\b`).test(text));
    const explicitDate = text.match(/\b(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?\b/);
    if (weekdayIndex >= 0) {
      const daysAhead = (weekdayIndex - eventDate.getDay() + 7) % 7 || 7;
      eventDate.setDate(eventDate.getDate() + daysAhead);
    } else if (explicitDate) {
      const [, month, day, rawYear] = explicitDate;
      const year = rawYear ? Number(rawYear.length === 2 ? `20${rawYear}` : rawYear) : eventDate.getFullYear();
      const candidate = new Date(year, Number(month) - 1, Number(day));
      if (candidate.getFullYear() === year && candidate.getMonth() === Number(month) - 1 && candidate.getDate() === Number(day)) {
        if (!rawYear && candidate < eventDate) candidate.setFullYear(year + 1);
        eventDate.setTime(candidate.getTime());
      }
    }
  }
  return eventDate;
}

function safeFileName(value) {
  return String(value ?? "").trim().replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, " ").slice(0, 80) || "crescent-file";
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

const ROUTE_IDS = new Set(["home", "recent", "starred", "shared", "trash", "settings", ...APP_META.map((app) => app.id)]);
function appFromLocation() {
  const hashRoute = window.location.hash.replace(/^#/, "");
  const pathSegments = window.location.pathname.split("/").filter(Boolean);
  const pathRoute = [...pathSegments].reverse().find((segment) => ROUTE_IDS.has(segment)) ?? "";
  const candidate = hashRoute || pathRoute;
  return ROUTE_IDS.has(candidate) ? candidate : "home";
}

export default function App() {
  const [workspace, update] = useWorkspace();
  const [activeApp, setActiveApp] = useState(appFromLocation);
  const [focusMode, setFocusMode] = useState(() => FOCUS_APP_IDS.has(appFromLocation()));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try { return localStorage.getItem(SIDEBAR_KEY) !== "false"; } catch { return true; }
  });
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [guideOpen, setGuideOpen] = useState(false);
  const [navigationContext, setNavigationContext] = useState(null);
  useEffect(() => {
    const handleNotice = (event) => setNotice(event.detail);
    window.addEventListener("crescent:notice", handleNotice);
    return () => window.removeEventListener("crescent:notice", handleNotice);
  }, []);
  useEffect(() => {
    const handleLocationChange = () => { const nextApp = appFromLocation(); setActiveApp(nextApp); setFocusMode(FOCUS_APP_IDS.has(nextApp)); setNavigationContext(window.history.state?.context ?? null); };
    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => { window.removeEventListener("popstate", handleLocationChange); window.removeEventListener("hashchange", handleLocationChange); };
  }, []);
  useEffect(() => {
    const utilityTitles = { recent: "Recent", starred: "Starred", shared: "Shared with me", trash: "Trash", settings: "Settings" };
    const pageTitle = activeApp === "home" ? "Home" : APP_META.find((app) => app.id === activeApp)?.label ?? utilityTitles[activeApp] ?? "Crescent";
    document.title = `${pageTitle} · Crescent Suite`;
  }, [activeApp]);
  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [notice]);
  useEffect(() => {
    try { localStorage.setItem(SIDEBAR_KEY, String(sidebarCollapsed)); } catch { /* local preference is optional */ }
  }, [sidebarCollapsed]);
  useEffect(() => {
    const handleActionFeedback = (event) => {
      const button = event.target.closest("button");
      const label = button?.textContent?.trim() ?? "";
      if (label === "Night") emitNotice("Night mode is active for this local preview.");
      if (label.includes("Invite someone")) emitNotice("Inviting people will be available when Crescent Cloud is connected.");
      if (button?.getAttribute("aria-label") === "Insert link") emitNotice("Cell links will be available in a connected workspace.");
      if (button?.getAttribute("aria-label") === "Design options") emitNotice("Slide design options are available in the inspector.");
      if (button?.getAttribute("aria-label") === "Close details") emitNotice("Document details stay visible while you work locally.");
      if (button?.classList.contains("toolbar-select")) emitNotice("Sheet zoom is fixed at 100% in this local workspace.");
    };
    document.addEventListener("click", handleActionFeedback);
    return () => document.removeEventListener("click", handleActionFeedback);
  }, []);
  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (focusMode) {
          setFocusMode(false);
          window.setTimeout(() => document.querySelector(".global-search input")?.focus(), 0);
        } else document.querySelector(".global-search input")?.focus();
      }
      if (event.key === "Escape" && query) setQuery("");
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [focusMode, query]);
  useEffect(() => {
    if (!query) return undefined;
    const handleOutsideSearch = (event) => {
      if (!event.target.closest(".global-search") && !event.target.closest(".search-results")) setQuery("");
    };
    document.addEventListener("pointerdown", handleOutsideSearch);
    return () => document.removeEventListener("pointerdown", handleOutsideSearch);
  }, [query]);
  const navigate = (id, context = null) => { setActiveApp(id); setFocusMode(FOCUS_APP_IDS.has(id)); setNavigationContext(context); setQuery(""); setSidebarOpen(false); const nextHash = `#${id}`; const currentContext = window.history.state?.context ?? null; if (window.location.hash !== nextHash || JSON.stringify(currentContext) !== JSON.stringify(context)) window.history.pushState({ app: id, context }, "", nextHash); window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); };
  const focusSearch = () => { setQuery(""); window.setTimeout(() => document.querySelector(".global-search input")?.focus(), 0); };
  useEffect(() => {
    const handleFocusShortcut = (event) => {
      if (event.key === "Escape" && focusMode) {
        if (document.querySelector('.modal-scrim [role="dialog"]')) return;
        event.preventDefault();
        setFocusMode(false);
        return;
      }
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "f" && FOCUS_APP_IDS.has(activeApp)) { event.preventDefault(); setFocusMode((current) => !current); }
    };
    window.addEventListener("keydown", handleFocusShortcut);
    return () => window.removeEventListener("keydown", handleFocusShortcut);
  }, [activeApp, focusMode]);
  const currentView = useMemo(() => {
    if (activeApp === "home") return <HomeView workspace={workspace} update={update} onNavigate={navigate} onFocusSearch={focusSearch} />;
    if (activeApp === "mail") return <MailView workspace={workspace} update={update} onNavigate={navigate} initialSubject={navigationContext?.title} />;
    if (activeApp === "docs") return <DocsView workspace={workspace} update={update} onNavigate={navigate} initialHeading={navigationContext?.heading} />;
    if (activeApp === "sheets") return <SheetsView workspace={workspace} update={update} onNavigate={navigate} initialCell={navigationContext?.cell} />;
    if (activeApp === "slides") return <SlidesView workspace={workspace} update={update} onNavigate={navigate} initialSlideTitle={navigationContext?.title} />;
    if (activeApp === "notes") return <NotesView workspace={workspace} update={update} onNavigate={navigate} initialNoteTitle={navigationContext?.title} />;
    if (activeApp === "tasks") return <TasksView workspace={workspace} update={update} onNavigate={navigate} initialTaskTitle={navigationContext?.title} initialProject={navigationContext?.project} />;
    if (activeApp === "calendar") return <CalendarView workspace={workspace} update={update} onNavigate={navigate} initialEventTitle={navigationContext?.title} />;
    if (activeApp === "drive") return <DriveView workspace={workspace} update={update} onNavigate={navigate} initialFolderName={navigationContext?.folderName ?? navigationContext?.title} initialFileTitle={navigationContext?.fileTitle ?? (navigationContext?.folderName ? undefined : navigationContext?.title)} />;
    if (activeApp === "forms") return <FormsView workspace={workspace} update={update} onNavigate={navigate} initialQuestionId={navigationContext?.questionId} />;
    return <UtilityView id={activeApp} workspace={workspace} update={update} onNavigate={navigate} />;
  }, [activeApp, navigationContext, workspace, update]);
  return <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""} ${focusMode ? "focus-mode" : ""} ${workspace.demo ? "workspace-demo" : "workspace-local"}`}><Sidebar activeApp={activeApp} onNavigate={navigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} workspace={workspace} update={update} collapsed={sidebarCollapsed} /><div className="app-main"><Header activeApp={activeApp} onOpenSidebar={() => setSidebarOpen(true)} onToggleSidebar={() => setSidebarCollapsed((current) => !current)} onOpenGuide={() => setGuideOpen(true)} onToggleFocus={() => setFocusMode((current) => !current)} focusMode={focusMode} sidebarCollapsed={sidebarCollapsed} query={query} onQueryChange={setQuery} onNavigate={navigate} workspace={workspace} /><div className="app-content">{currentView}</div></div>{focusMode && <button className="focus-exit" onClick={() => setFocusMode(false)} aria-label="Exit focus mode" title="Exit focus mode"><Minimize2 size={17} /></button>}<div className={`toast ${notice ? "toast-visible" : ""}`} role="status" aria-live="polite"><CheckCircle2 size={16} />{notice}</div>{guideOpen && <GuideDialog onClose={() => setGuideOpen(false)} onNavigate={navigate} />}</div>;
}
