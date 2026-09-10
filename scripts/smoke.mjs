/* global Buffer, console, document, fetch, getComputedStyle, localStorage, performance, process, setTimeout */

import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = 4173;
const baseUrl = process.env.SMOKE_URL ?? `http://127.0.0.1:${port}`;
const routes = ["home", "recent", "starred", "shared", "trash", "mail", "docs", "sheets", "slides", "notes", "tasks", "calendar", "drive", "forms", "settings", "Crescent-Suite/forms"];
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];
const smokeData = process.env.SMOKE_DATA ?? "demo";
const preparePage = (page) => {
  const originalGoto = page.goto.bind(page);
  page.goto = (url, options) => {
      const nextUrl = new globalThis.URL(url);
    nextUrl.searchParams.delete("demo");
    nextUrl.searchParams.delete("fresh");
    nextUrl.searchParams.set(smokeData === "fresh" ? "fresh" : "demo", "1");
    return originalGoto(nextUrl.toString(), options);
  };
  return page;
};

const server = spawn("npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", String(port)], { stdio: "ignore" });

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/`);
      if (response.ok) return;
    } catch {
      // The preview server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Preview server did not start at ${baseUrl}`);
}

try {
  await waitForServer();
  const manifestResponse = await fetch(`${baseUrl}/site.webmanifest`);
  const manifest = await manifestResponse.json();
  if (manifest.start_url !== "./" || manifest.scope !== "./" || manifest.icons?.[0]?.src !== "./favicon.svg") throw new Error("PWA manifest is not subpath-safe");
  const indexHtml = await (await fetch(`${baseUrl}/`)).text();
  if (!indexHtml.includes('rel="preconnect" href="https://fonts.googleapis.com"') || !indexHtml.includes('rel="preconnect" href="https://fonts.gstatic.com"')) throw new Error("Font preconnect hints are missing");
  const browser = await chromium.launch({ headless: true });
  const failures = [];
  const reducedMotionPage = preparePage(await browser.newPage({ viewport: viewports[0] }));
  try {
    await reducedMotionPage.emulateMedia({ reducedMotion: "reduce" });
    await reducedMotionPage.goto(`${baseUrl}/home`, { waitUntil: "networkidle" });
    const motionStyle = await reducedMotionPage.locator(".page-enter").first().evaluate((node) => getComputedStyle(node).transitionDuration);
    if (Number.parseFloat(motionStyle) > 0.001) failures.push({ route: "home", accessibility: "reduced-motion transitions", motionStyle });
    const coreTransfer = await reducedMotionPage.evaluate(() => performance.getEntriesByType("resource").filter((entry) => /\.(?:js|css)$/.test(entry.name)).reduce((total, entry) => total + entry.transferSize, 0));
    if (coreTransfer > 150000) failures.push({ route: "home", performance: "core JS/CSS transfer budget", coreTransfer });
  } finally {
    await reducedMotionPage.close();
  }

  for (const viewport of viewports) {
    for (const route of routes) {
      const page = preparePage(await browser.newPage({ viewport }));
      const pageErrors = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      try {
        await page.goto(`${baseUrl}/${route}`, { waitUntil: "networkidle" });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
        const accessibility = await page.evaluate(() => ({
          unnamedButtons: [...document.querySelectorAll("button")].filter((node) => !((node.innerText || node.getAttribute("aria-label") || node.getAttribute("title") || "").trim())).length,
          unnamedFields: [...document.querySelectorAll("input,textarea,select,[contenteditable=true]")].filter((node) => !((node.getAttribute("aria-label") || node.getAttribute("title") || node.getAttribute("placeholder") || node.labels?.length || node.getAttribute("role") || "").toString().trim())).length,
        }));
        if (pageErrors.length || overflow || accessibility.unnamedButtons || accessibility.unnamedFields) failures.push({ viewport: viewport.name, route, pageErrors, overflow, accessibility });
        if (["docs", "sheets", "slides", "notes", "tasks", "calendar", "drive", "forms", "mail"].includes(route)) {
          if (!(await page.locator(".app-shell.focus-mode").count()) || !(await page.getByRole("button", { name: "Exit focus mode" }).isVisible())) failures.push({ viewport: viewport.name, route, controls: "default focus mode" });
        if (route === "docs" && viewport.name === "desktop") {
            await page.keyboard.press("ControlOrMeta+KeyK");
            await page.waitForFunction(() => !document.querySelector(".app-shell")?.classList.contains("focus-mode") && document.activeElement?.matches(".global-search input"));
          } else if (route === "calendar" && viewport.name === "mobile") {
            await page.getByRole("button", { name: "Event", exact: true }).click();
            await page.keyboard.press("Escape");
            if (!(await page.locator(".app-shell.focus-mode").count()) || await page.getByRole("dialog", { name: "Block time with intention" }).count()) failures.push({ viewport: viewport.name, route, controls: "modal Escape preserves Focus Mode" });
            await page.getByRole("button", { name: "Exit focus mode" }).click();
          } else await page.getByRole("button", { name: "Exit focus mode" }).click();
          if (!(await page.getByRole("button", { name: "Enter focus mode" }).isVisible())) failures.push({ viewport: viewport.name, route, controls: "focus mode exit" });
        }
        if (route === "docs" && await page.title() !== "Docs · Crescent Suite") failures.push({ viewport: viewport.name, route, title: await page.title() });
        if (viewport.name === "mobile" && ["docs", "sheets", "slides", "forms"].includes(route) && !(await page.getByRole("button", { name: "Move to Trash" }).isVisible())) failures.push({ viewport: viewport.name, route, controls: "mobile editor Trash action" });
        if (viewport.name === "mobile" && ["docs", "sheets", "slides", "notes", "tasks", "calendar", "drive", "forms"].includes(route) && !(await page.locator(".editor-actions > .secondary-button:visible").count())) failures.push({ viewport: viewport.name, route, controls: "mobile editor secondary actions" });
        if (viewport.name === "mobile" && route === "docs" && await page.getByRole("button", { name: /details/i }).count()) failures.push({ viewport: viewport.name, route, controls: "hidden responsive details control" });
        if (viewport.name === "mobile" && route === "calendar") {
          const mobileCalendarNavigation = await Promise.all(["Previous", "Today", "Next"].map((name) => page.getByRole("button", { name, exact: true }).isVisible()));
          if (mobileCalendarNavigation.some((visible) => !visible)) failures.push({ viewport: viewport.name, route, controls: "mobile Calendar navigation" });
        }
        if (route === "calendar") {
          await page.getByRole("button", { name: "Day", exact: true }).click();
          const dayDays = await page.locator(".calendar-day:visible").count();
          if (dayDays !== 1) failures.push({ viewport: viewport.name, route, dayDays });
          await page.getByRole("button", { name: "Week", exact: true }).click();
          const weekDays = await page.locator(".calendar-day:visible").count();
          if (weekDays !== 7) failures.push({ viewport: viewport.name, route, weekDays });
          await page.getByRole("button", { name: "Month", exact: true }).click();
          const monthCells = await page.locator(".calendar-month-cell").count();
          if (monthCells !== 42) failures.push({ viewport: viewport.name, route, monthCells });
        }
        if (route === "slides" && await page.getByRole("textbox", { name: "Speaker notes for From ideas to impact" }).count() !== 1) failures.push({ viewport: viewport.name, route, accessibility: "speaker notes label" });
        if (route === "docs" && await page.getByRole("textbox", { name: "Document body" }).count() !== 1) failures.push({ viewport: viewport.name, route, accessibility: "document body label" });
        if (route === "slides" && (await page.getByRole("textbox", { name: "Slide title" }).count() !== 1 || await page.getByRole("textbox", { name: "Slide body" }).count() !== 1)) failures.push({ viewport: viewport.name, route, accessibility: "slide editing labels" });
        if (route === "forms" && await page.getByRole("button", { name: "How clear is the next step?: 1" }).getAttribute("aria-pressed") !== "false") failures.push({ viewport: viewport.name, route, accessibility: "scale choice semantics" });
        if (route === "forms" && await page.getByRole("textbox", { name: "What are you working on?" }).getAttribute("aria-required") !== "true") failures.push({ viewport: viewport.name, route, accessibility: "required answer semantics" });
        if (route === "forms" && await page.getByRole("button", { name: "How clear is the next step?: 1" }).getAttribute("aria-required") !== "true") failures.push({ viewport: viewport.name, route, accessibility: "required Scale semantics" });
        if (route === "home" && await page.getByRole("button", { name: "All", exact: true }).getAttribute("aria-pressed") !== "true") failures.push({ viewport: viewport.name, route, accessibility: "Recent filter state" });
        if (route === "mail" && smokeData === "fresh" && !(await page.locator(".mail-list-empty").count())) failures.push({ viewport: viewport.name, route, emptyState: "Mail inbox empty state" });
        if (route === "drive" && smokeData === "fresh" && await page.locator(".drive-empty-state").count() !== 2) failures.push({ viewport: viewport.name, route, emptyState: "Drive folders and files empty states" });
        if (route === "sheets" && smokeData === "fresh" && await page.locator(".name-box").innerText() !== "A1") failures.push({ viewport: viewport.name, route, controls: "blank Sheets starts at A1" });
        if (route === "forms" && smokeData === "fresh" && await page.getByRole("button", { name: "Preview", exact: true }).count()) failures.push({ viewport: viewport.name, route, controls: "blank Forms preview dead end" });
        if (route === "drive" && await page.getByRole("button", { name: "Grid view" }).getAttribute("aria-pressed") !== "true") failures.push({ viewport: viewport.name, route, accessibility: "Drive view state" });
        if (route === "trash" && !(await page.locator(".utility-panel").innerText()).includes("Trash is empty.")) failures.push({ viewport: viewport.name, route, emptyState: "Trash is empty." });
        if (route === "trash") {
          await page.getByRole("button", { name: "View recent files" }).click();
          if (!page.url().endsWith("#recent")) failures.push({ viewport: viewport.name, route, emptyState: "Trash empty-state action", url: page.url() });
        }
        if (route === "home" && viewport.name === "desktop") {
          await page.keyboard.press("Tab");
          if (!(await page.evaluate(() => document.activeElement?.classList.contains("skip-link")))) failures.push({ viewport: viewport.name, route, accessibility: "skip-link focus" });
          await page.keyboard.press("Enter");
          if (await page.evaluate(() => document.activeElement?.id !== "main-content")) failures.push({ viewport: viewport.name, route, accessibility: "skip-link target" });
          await page.getByRole("button", { name: "Open Crescent guide" }).click();
          if (!(await page.evaluate(() => document.activeElement?.closest(".guide-dialog") !== null))) failures.push({ viewport: viewport.name, route, accessibility: "guide focus" });
          await page.keyboard.press("Shift+Tab");
          if (!(await page.evaluate(() => document.activeElement?.closest(".guide-dialog") !== null))) failures.push({ viewport: viewport.name, route, accessibility: "guide focus trap" });
          await page.keyboard.press("Escape");
          const launchers = page.locator(".app-launch");
          if (await launchers.count() !== 9) failures.push({ viewport: viewport.name, route, launcherCount: await launchers.count() });
          const railBox = await page.locator(".home-rail").boundingBox();
          const formsBox = await launchers.filter({ hasText: "Forms" }).boundingBox();
          if (!formsBox || (railBox && formsBox.right > railBox.left)) failures.push({ viewport: viewport.name, route, formsLauncher: formsBox, homeRail: railBox });
          await page.getByRole("textbox", { name: "Search across Crescent" }).fill("North star");
          const searchHits = await page.locator(".search-results .search-result").count();
          if (!searchHits || await page.getByRole("textbox", { name: "Search across Crescent" }).getAttribute("aria-expanded") !== "true" || await page.getByRole("textbox", { name: "Search across Crescent" }).getAttribute("aria-controls") !== "crescent-search-results" || await page.getByRole("textbox", { name: "Search across Crescent" }).getAttribute("aria-autocomplete") !== "list" || await page.getByRole("listbox", { name: "Search results" }).count() !== 1) failures.push({ viewport: viewport.name, route, search: "North star" });
          await page.keyboard.press("Escape");
          if (await page.locator(".search-results").count()) failures.push({ viewport: viewport.name, route, search: "Escape dismiss" });
          await page.getByRole("textbox", { name: "Search across Crescent" }).fill("North star");
          await page.locator(".home-hero").click();
          if (await page.locator(".search-results").count()) failures.push({ viewport: viewport.name, route, search: "outside-click dismiss" });
          await page.getByRole("textbox", { name: "Search across Crescent" }).fill("North star");
          await page.keyboard.press("ArrowDown");
          if (!(await page.evaluate(() => document.activeElement?.classList.contains("search-result")))) failures.push({ viewport: viewport.name, route, search: "ArrowDown result focus" });
          await page.keyboard.press("Enter");
          if (!page.url().endsWith("#docs")) failures.push({ viewport: viewport.name, route, search: "Enter result navigation", url: page.url() });
        }
      } finally {
        await page.close();
      }
    }
  }

  const behaviorPage = preparePage(await browser.newPage({ viewport: viewports[0] }));
  try {
    const ensureGlobalChrome = async () => {
      const exitFocus = behaviorPage.getByRole("button", { name: "Exit focus mode" });
      if (await exitFocus.count()) await exitFocus.click();
    };
    await behaviorPage.goto(`${baseUrl}/mail`, { waitUntil: "networkidle" });
    if (await behaviorPage.getByRole("button", { name: "Open message Design review tomorrow" }).count() !== 1) failures.push({ route: "mail", controls: "inbox message" });
    await behaviorPage.getByRole("button", { name: "Open message Growth metrics are ready" }).click();
    await behaviorPage.getByRole("button", { name: "Mark unread" }).click();
    if (await behaviorPage.getByRole("button", { name: "Mark read" }).count() !== 1) failures.push({ route: "mail", controls: "mark unread" });
    await behaviorPage.getByRole("button", { name: "Reply" }).click();
    const replyDialog = behaviorPage.getByRole("dialog", { name: "Write something clear." });
    if (await replyDialog.getByRole("textbox", { name: "To" }).inputValue() !== "jordan@crescent.local" || await replyDialog.getByRole("textbox", { name: "Subject" }).inputValue() !== "Re: Growth metrics are ready") failures.push({ route: "mail", controls: "reply prefill" });
    await replyDialog.getByRole("button", { name: "Cancel" }).click();
    await behaviorPage.getByRole("button", { name: "New message" }).click();
    const composeDialog = behaviorPage.getByRole("dialog", { name: "Write something clear." });
    await composeDialog.getByRole("textbox", { name: "To" }).press("Shift+Tab");
    if (!(await behaviorPage.evaluate(() => document.activeElement?.getAttribute("aria-label") === "Close compose dialog"))) failures.push({ route: "mail", controls: "dialog focus trap" });
    await composeDialog.getByRole("textbox", { name: "To" }).focus();
    await composeDialog.getByRole("textbox", { name: "To" }).fill("casey");
    await composeDialog.getByRole("textbox", { name: "Subject" }).fill("Smoke message");
    await composeDialog.getByRole("textbox", { name: "Message" }).fill("A local smoke-test message.");
    await composeDialog.getByRole("button", { name: "Send message" }).click();
    if (await behaviorPage.getByRole("dialog", { name: "Write something clear." }).count() !== 1 || !(await behaviorPage.locator(".toast").innerText()).includes("Use an email address")) failures.push({ route: "mail", controls: "recipient validation" });
    await composeDialog.getByRole("textbox", { name: "To" }).fill("casey@crescent.local");
    await composeDialog.getByRole("button", { name: "Send message" }).click();
    if (await behaviorPage.getByRole("button", { name: "Open message Smoke message" }).count() !== 1) failures.push({ route: "mail", controls: "local message send" });
    await behaviorPage.goto(`${baseUrl}/docs`, { waitUntil: "networkidle" });
    if (await behaviorPage.getByRole("button", { name: "Share", exact: true }).count() !== 0 || await behaviorPage.getByText("Local", { exact: true }).count() !== 1) failures.push({ route: "docs", controls: "local-only sharing status" });
    if (await behaviorPage.getByRole("button", { name: "Show document details" }).count() !== 1) failures.push({ route: "docs", controls: "focus mode starts with details collapsed" });
    await behaviorPage.getByRole("button", { name: "Show document details" }).click();
    if (await behaviorPage.locator(".doc-inspector").count() !== 1 || await behaviorPage.getByText("Browser only", { exact: true }).count() !== 1) failures.push({ route: "docs", controls: "restore document details" });
    await behaviorPage.getByRole("button", { name: "Close details" }).click();
    if (await behaviorPage.locator(".doc-inspector").count() !== 0 || await behaviorPage.getByRole("button", { name: "Show document details" }).count() !== 1) failures.push({ route: "docs", controls: "hide document details" });
    await behaviorPage.getByRole("button", { name: "Show document details" }).click();
    if (await behaviorPage.locator(".doc-inspector").count() !== 1) failures.push({ route: "docs", controls: "restore document details" });
    const documentBody = behaviorPage.getByRole("textbox", { name: "Document body" });
    await documentBody.evaluate((node) => { const textNode = document.createTreeWalker(node, globalThis.NodeFilter.SHOW_TEXT).nextNode(); const range = document.createRange(); range.setStart(textNode, 0); range.setEnd(textNode, Math.min(8, textNode.textContent.length)); const selection = globalThis.getSelection(); selection.removeAllRanges(); selection.addRange(range); });
    await behaviorPage.getByRole("button", { name: "Add link" }).click();
    const linkDialog = behaviorPage.getByRole("dialog", { name: "Connect this thought" });
    await linkDialog.getByRole("textbox", { name: "Link URL" }).fill("https://example.com/crescent");
    await linkDialog.getByRole("button", { name: "Add link", exact: true }).click();
    if (await documentBody.locator('a[href="https://example.com/crescent"]').count() !== 1) failures.push({ route: "docs", controls: "local link insertion" });
    await behaviorPage.goto(`${baseUrl}/sheets`, { waitUntil: "networkidle" });
    if (await behaviorPage.getByRole("button", { name: "Insert link" }).count() !== 0 || await behaviorPage.getByRole("button", { name: /100%/ }).count() !== 0 || await behaviorPage.getByRole("button", { name: "Share", exact: true }).count() !== 0 || await behaviorPage.getByText("Local", { exact: true }).count() !== 1) failures.push({ route: "sheets", controls: "honest local affordances" });
    await behaviorPage.goto(`${baseUrl}/slides`, { waitUntil: "networkidle" });
    if (await behaviorPage.getByRole("button", { name: "Design options" }).count() !== 0 || await behaviorPage.getByRole("button", { name: "Share", exact: true }).count() !== 0 || await behaviorPage.getByText("Local", { exact: true }).count() !== 1) failures.push({ route: "slides", controls: "honest local affordances" });
    await behaviorPage.goto(`${baseUrl}/home`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("button", { name: "Add workspace" }).click();
    const workspaceDialog = behaviorPage.getByRole("dialog", { name: "Make room for a new space" });
    if (await workspaceDialog.getByRole("textbox", { name: "Workspace name" }).inputValue() !== "" || await workspaceDialog.getByRole("textbox", { name: "Workspace name" }).getAttribute("placeholder") !== "Name this workspace") failures.push({ route: "home", controls: "blank workspace naming field" });
    await workspaceDialog.getByRole("textbox", { name: "Workspace name" }).fill("Smoke workspace");
    await workspaceDialog.getByRole("button", { name: "Add workspace", exact: true }).click();
    if (!(await behaviorPage.locator(".workspace-list").innerText()).includes("Smoke workspace")) failures.push({ route: "home", controls: "local workspace creation" });
    await behaviorPage.getByRole("button", { name: "Add project" }).click();
    const projectDialog = behaviorPage.getByRole("dialog", { name: "Give the work a clear home" });
    if (await projectDialog.getByRole("textbox", { name: "Project name" }).inputValue() !== "" || await projectDialog.getByRole("textbox", { name: "Project name" }).getAttribute("placeholder") !== "Name this project") failures.push({ route: "home", controls: "blank project naming field" });
    await projectDialog.getByRole("textbox", { name: "Project name" }).fill("Smoke project");
    await projectDialog.getByRole("button", { name: "Add project", exact: true }).click();
    if (!(await behaviorPage.locator(".project-list").innerText()).includes("Smoke project")) failures.push({ route: "home", controls: "local project creation" });
    await behaviorPage.locator(".recent-row").first().focus();
    await behaviorPage.locator(".recent-row").first().press("Enter");
    if (!behaviorPage.url().endsWith("#docs")) failures.push({ route: "home", controls: "keyboard Recent row navigation", url: behaviorPage.url() });
    await behaviorPage.goto(`${baseUrl}/home`, { waitUntil: "networkidle" });
    await behaviorPage.reload({ waitUntil: "networkidle" });
    if (!(await behaviorPage.locator(".workspace-list").innerText()).includes("Smoke workspace") || !(await behaviorPage.locator(".project-list").innerText()).includes("Smoke project")) failures.push({ route: "home", controls: "workspace/project persistence" });
    await behaviorPage.getByRole("button", { name: "Expand navigation" }).click();
    await behaviorPage.getByRole("button", { name: "Smoke workspace" }).click();
    await behaviorPage.waitForSelector('[data-folder-name="Smoke workspace"].selected');
    if (behaviorPage.url().split("#")[1] !== "drive") failures.push({ route: "home", controls: "sidebar workspace destination", url: behaviorPage.url() });
    await behaviorPage.goto(`${baseUrl}/home`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("button", { name: "Smoke project" }).click();
    await behaviorPage.waitForFunction(() => document.querySelector(".task-project-filter")?.value?.toLowerCase() === "smoke project");
    if (behaviorPage.url().split("#")[1] !== "tasks" || (await behaviorPage.getByRole("combobox", { name: "Filter tasks by project" }).inputValue()).toLowerCase() !== "smoke project") failures.push({ route: "home", controls: "sidebar project destination", url: behaviorPage.url() });
    await behaviorPage.goto(`${baseUrl}/home`, { waitUntil: "networkidle" });
    await behaviorPage.locator(".recent-row").filter({ hasText: "Meeting notes" }).click();
    await behaviorPage.waitForFunction(() => document.querySelector('input[aria-label="Note title"]')?.value === "Meeting notes");
    if (behaviorPage.url().split("#")[1] !== "notes") failures.push({ route: "home", controls: "exact Recent note destination", url: behaviorPage.url() });
    await behaviorPage.goto(`${baseUrl}/drive`, { waitUntil: "networkidle" });
    if (!(await behaviorPage.locator(".folder-grid").innerText()).includes("Smoke workspace")) failures.push({ route: "drive", controls: "workspace folder creation" });
    await behaviorPage.getByRole("button", { name: "New folder" }).click();
    const folderDialog = behaviorPage.getByRole("dialog", { name: "Make room for a new folder" });
    if (await folderDialog.getByRole("textbox", { name: "Folder name" }).inputValue() !== "" || await folderDialog.getByRole("textbox", { name: "Folder name" }).getAttribute("placeholder") !== "Name this folder") failures.push({ route: "drive", controls: "blank folder naming field" });
    await folderDialog.getByRole("textbox", { name: "Folder name" }).fill("Smoke folder");
    await folderDialog.getByRole("button", { name: "Add folder", exact: true }).click();
    if (!(await behaviorPage.locator(".folder-grid").innerText()).includes("Smoke folder")) failures.push({ route: "drive", controls: "new folder creation" });
    await behaviorPage.getByRole("button", { name: "New folder" }).click();
    const duplicateFolderDialog = behaviorPage.getByRole("dialog", { name: "Make room for a new folder" });
    await duplicateFolderDialog.getByRole("textbox", { name: "Folder name" }).fill("Smoke folder");
    await duplicateFolderDialog.getByRole("button", { name: "Add folder", exact: true }).click();
    if (await behaviorPage.locator(".folder-card").filter({ hasText: "Smoke folder" }).count() !== 1) failures.push({ route: "drive", controls: "duplicate folder guard" });
    await behaviorPage.reload({ waitUntil: "networkidle" });
    if (await behaviorPage.locator(".folder-card").filter({ hasText: "Smoke folder" }).count() !== 1) failures.push({ route: "drive", controls: "folder persistence" });
    await behaviorPage.goto(`${baseUrl}/home`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).fill("Smoke folder");
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).press("Enter");
    await behaviorPage.waitForSelector('[data-folder-name="Smoke folder"].selected');
    if (behaviorPage.url().split("#")[1] !== "drive" || await behaviorPage.locator('[data-folder-name="Smoke folder"].selected').count() !== 1) failures.push({ route: "search", controls: "open exact Drive folder result", url: behaviorPage.url() });
    await behaviorPage.goto(`${baseUrl}/calendar`, { waitUntil: "networkidle" });
    const addCalendarEvent = async (title, when) => { await behaviorPage.getByRole("button", { name: "Event" }).click(); const dialog = behaviorPage.getByRole("dialog", { name: "Block time with intention" }); await dialog.waitFor(); await dialog.getByRole("textbox", { name: "Event title" }).fill(title); await dialog.getByRole("textbox", { name: "Event time" }).fill(when); await dialog.getByRole("button", { name: "Save event" }).click(); await behaviorPage.waitForTimeout(250); };
    await addCalendarEvent("Smoke focus block", "Tomorrow · 3:00 PM");
    const localEvent = behaviorPage.locator(".calendar-event-local");
    const localEventStyle = await localEvent.getAttribute("style");
    if (await localEvent.count() !== 1 || !localEventStyle?.includes("top: 384px")) failures.push({ route: "calendar", controls: "timed local event", localEventStyle });
    await behaviorPage.getByRole("button", { name: "Edit Smoke focus block" }).click();
    await behaviorPage.getByRole("textbox", { name: "Edit event title" }).fill("Smoke focus edited");
    await behaviorPage.getByRole("textbox", { name: "Edit event time" }).fill("Tomorrow · 4:00 PM");
    await behaviorPage.getByRole("button", { name: "Save event" }).click();
    if (!(await behaviorPage.locator(".calendar-local-list").innerText()).includes("Smoke focus edited")) failures.push({ route: "calendar", controls: "inline event edit" });
    await behaviorPage.reload({ waitUntil: "networkidle" });
    if (!(await behaviorPage.locator(".calendar-local-list").innerText()).includes("Smoke focus edited")) failures.push({ route: "calendar", controls: "event edit persistence" });
    const storedCalendarDate = await behaviorPage.evaluate(() => JSON.parse(localStorage.getItem("crescent-suite:workspace:v1") ?? "{}").calendarEvents?.[0]?.date);
    const expectedTomorrow = await behaviorPage.evaluate(() => { const date = new Date(); date.setDate(date.getDate() + 1); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; });
    if (storedCalendarDate !== expectedTomorrow) failures.push({ route: "calendar", controls: "natural language event date", storedCalendarDate, expectedTomorrow });
    const icsDownloadPromise = behaviorPage.waitForEvent("download");
    await behaviorPage.getByRole("button", { name: "Export ICS" }).click();
    const icsStream = await (await icsDownloadPromise).createReadStream();
    const icsChunks = [];
    for await (const chunk of icsStream) icsChunks.push(chunk);
    const icsText = Buffer.concat(icsChunks).toString();
    if (!icsText.includes(`DTSTART:${expectedTomorrow.replaceAll("-", "")}T160000`)) failures.push({ route: "calendar", controls: "timed ICS export" });
    await addCalendarEvent("Smoke Friday", "Friday · 9:00 AM");
    const expectedFriday = await behaviorPage.evaluate(() => { const date = new Date(); date.setHours(0, 0, 0, 0); const daysAhead = (5 - date.getDay() + 7) % 7 || 7; date.setDate(date.getDate() + daysAhead); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; });
    const storedFriday = await behaviorPage.evaluate(() => JSON.parse(localStorage.getItem("crescent-suite:workspace:v1") ?? "{}").calendarEvents?.[0]?.date);
    if (storedFriday !== expectedFriday) failures.push({ route: "calendar", controls: "natural language weekday date", storedFriday, expectedFriday });
    await addCalendarEvent("Smoke today", "Today · 5:00 PM");
    await behaviorPage.goto(`${baseUrl}/home`, { waitUntil: "networkidle" });
    if (!(await behaviorPage.locator(".recent-table").innerText()).includes("Smoke today")) failures.push({ route: "home", controls: "live calendar recent file" });
    if ((await behaviorPage.locator(".day-card").innerText()).includes("Smoke Friday")) failures.push({ route: "home", controls: "future event excluded from My day" });
    if (!(await behaviorPage.locator(".day-card").innerText()).includes("Smoke today") || !(await behaviorPage.locator(".day-card").innerText()).includes("5:00 PM")) failures.push({ route: "home", controls: "local calendar time in My day" });
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).fill("Smoke focus edited");
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).press("Enter");
    await behaviorPage.waitForSelector(".calendar-local-card.selected");
    if (behaviorPage.url().split("#")[1] !== "calendar" || !(await behaviorPage.locator(".calendar-local-card.selected").innerText()).includes("Smoke focus edited")) failures.push({ route: "search", controls: "open exact Calendar event result", url: behaviorPage.url() });
    await behaviorPage.getByRole("button", { name: "Remove Smoke focus edited" }).click();
    await behaviorPage.goto(`${baseUrl}/trash`, { waitUntil: "networkidle" });
    const deletedEvent = behaviorPage.locator(".utility-file-row").filter({ hasText: "Smoke focus edited" });
    if (await deletedEvent.count() !== 1) failures.push({ route: "trash", controls: "archived calendar event" });
    else await deletedEvent.getByRole("button", { name: "Restore" }).click();
    await behaviorPage.goto(`${baseUrl}/calendar`, { waitUntil: "networkidle" });
    if (!(await behaviorPage.locator(".calendar-local-list").innerText()).includes("Smoke focus edited")) failures.push({ route: "calendar", controls: "Calendar event restore" });
    await behaviorPage.goto(`${baseUrl}/sheets`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("button", { name: "Move to Trash" }).click();
    await behaviorPage.goto(`${baseUrl}/trash`, { waitUntil: "networkidle" });
    const deletedSheet = behaviorPage.locator(".utility-file-row").filter({ hasText: "Growth metrics" });
    if (await deletedSheet.count() !== 1) failures.push({ route: "trash", controls: "archived Sheets file" });
    else await deletedSheet.getByRole("button", { name: "Restore" }).click();
    await behaviorPage.goto(`${baseUrl}/sheets`, { waitUntil: "networkidle" });
    if (await behaviorPage.getByRole("textbox", { name: "File title" }).inputValue() !== "Growth metrics") failures.push({ route: "sheets", controls: "Sheets restore" });
    await behaviorPage.goto(`${baseUrl}/slides`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("button", { name: "Move to Trash" }).click();
    await behaviorPage.goto(`${baseUrl}/trash`, { waitUntil: "networkidle" });
    const deletedDeck = behaviorPage.locator(".utility-file-row").filter({ hasText: "Design review deck" });
    if (await deletedDeck.count() !== 1) failures.push({ route: "trash", controls: "archived Slides file" });
    else await deletedDeck.getByRole("button", { name: "Restore" }).click();
    await behaviorPage.goto(`${baseUrl}/slides`, { waitUntil: "networkidle" });
    if (await behaviorPage.getByRole("textbox", { name: "File title" }).inputValue() !== "Design review deck") failures.push({ route: "slides", controls: "Slides restore" });
    await behaviorPage.goto(`${baseUrl}/forms`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("button", { name: "Move to Trash" }).click();
    await behaviorPage.goto(`${baseUrl}/trash`, { waitUntil: "networkidle" });
    const deletedForm = behaviorPage.locator(".utility-file-row").filter({ hasText: "Launch feedback" });
    if (await deletedForm.count() !== 1) failures.push({ route: "trash", controls: "archived Forms file" });
    else await deletedForm.getByRole("button", { name: "Restore" }).click();
    await behaviorPage.goto(`${baseUrl}/forms`, { waitUntil: "networkidle" });
    if (await behaviorPage.getByRole("textbox", { name: "File title" }).inputValue() !== "Launch feedback") failures.push({ route: "forms", controls: "Forms restore" });
    await behaviorPage.goto(`${baseUrl}/docs`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("button", { name: "Move to Trash" }).click();
    await behaviorPage.goto(`${baseUrl}/trash`, { waitUntil: "networkidle" });
    const deletedDoc = behaviorPage.locator(".utility-file-row").filter({ hasText: "Product strategy Q3 2024" });
    if (await deletedDoc.count() !== 1) failures.push({ route: "trash", controls: "archived Docs file" });
    else await deletedDoc.getByRole("button", { name: "Restore" }).click();
    await behaviorPage.goto(`${baseUrl}/docs`, { waitUntil: "networkidle" });
    if (await behaviorPage.getByRole("textbox", { name: "File title" }).inputValue() !== "Product strategy Q3 2024") failures.push({ route: "docs", controls: "Docs restore" });
    await behaviorPage.goto(`${baseUrl}/notes`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("button", { name: "New note" }).click();
    const newNoteTitle = behaviorPage.getByRole("textbox", { name: "Note title" });
    if (await newNoteTitle.inputValue() !== "" || await newNoteTitle.getAttribute("placeholder") !== "Name this note") failures.push({ route: "notes", controls: "blank note naming field" });
    await behaviorPage.getByRole("button", { name: "Delete Untitled note" }).click();
    await behaviorPage.goto(`${baseUrl}/trash`, { waitUntil: "networkidle" });
    const permanentlyDeletedNote = behaviorPage.locator(".utility-file-row").filter({ hasText: "Untitled note" });
    await permanentlyDeletedNote.getByRole("button", { name: "Delete forever" }).click();
    const deleteForeverDialog = behaviorPage.getByRole("dialog", { name: "Delete this file forever?" });
    await deleteForeverDialog.getByRole("button", { name: "Delete forever", exact: true }).click();
    if (await behaviorPage.locator(".utility-file-row").filter({ hasText: "Untitled note" }).count()) failures.push({ route: "trash", controls: "permanent item deletion" });
    await behaviorPage.goto(`${baseUrl}/notes`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("button", { name: "New note" }).click();
    await behaviorPage.getByRole("button", { name: "Delete Untitled note" }).click();
    await behaviorPage.goto(`${baseUrl}/trash`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("button", { name: "Empty Trash" }).click();
    const emptyTrashDialog = behaviorPage.getByRole("dialog", { name: "Empty Trash for good?" });
    await emptyTrashDialog.getByRole("button", { name: "Empty Trash", exact: true }).click();
    if (!(await behaviorPage.locator(".utility-panel").innerText()).includes("Trash is empty.")) failures.push({ route: "trash", controls: "empty Trash" });
    await behaviorPage.goto(`${baseUrl}/tasks`, { waitUntil: "networkidle" });
    if (await behaviorPage.getByRole("textbox", { name: "File title" }).isEditable()) failures.push({ route: "tasks", controls: "fixed container title is read-only" });
    const dueBefore = await behaviorPage.getByRole("button", { name: "Change due date for Review the launch brief" }).innerText();
    await behaviorPage.getByRole("button", { name: "Change due date for Review the launch brief" }).click();
    const dueAfter = await behaviorPage.getByRole("button", { name: "Change due date for Review the launch brief" }).innerText();
    if (dueBefore === dueAfter) failures.push({ route: "tasks", controls: "due date cycle", dueBefore, dueAfter });
    await behaviorPage.goto(`${baseUrl}/home`, { waitUntil: "networkidle" });
    const liveTaskRow = behaviorPage.locator(".recent-row").filter({ hasText: "Review the launch brief" });
    await liveTaskRow.locator(".row-action").click();
    await behaviorPage.goto(`${baseUrl}/tasks`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("button", { name: "Delete Review the launch brief" }).click();
    await behaviorPage.goto(`${baseUrl}/trash`, { waitUntil: "networkidle" });
    const deletedTask = behaviorPage.locator(".utility-file-row").filter({ hasText: "Review the launch brief" });
    if (await deletedTask.count() !== 1) failures.push({ route: "trash", controls: "archived starred task" });
    else await deletedTask.getByRole("button", { name: "Restore" }).click();
    await behaviorPage.goto(`${baseUrl}/starred`, { waitUntil: "networkidle" });
    if (!(await behaviorPage.locator(".utility-panel").innerText()).includes("Review the launch brief")) failures.push({ route: "starred", controls: "restored task favorite" });
    await behaviorPage.goto(`${baseUrl}/tasks`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("combobox", { name: "New task project" }).selectOption({ label: "Smoke project" });
    await behaviorPage.getByRole("textbox", { name: "New task" }).fill("Smoke project task");
    await behaviorPage.getByRole("textbox", { name: "New task" }).press("Enter");
    if (!(await behaviorPage.locator(".task-row").filter({ hasText: "Smoke project task" }).innerText()).includes("Smoke project")) failures.push({ route: "tasks", controls: "project-linked task creation" });
    await behaviorPage.getByRole("button", { name: "Edit Smoke project task" }).click();
    await behaviorPage.getByRole("textbox", { name: "Edit task title" }).fill("Smoke edited task");
    await behaviorPage.getByRole("textbox", { name: "Edit task title" }).press("Enter");
    if (!(await behaviorPage.locator(".task-row").filter({ hasText: "Smoke edited task" }).count())) failures.push({ route: "tasks", controls: "inline task title edit" });
    await behaviorPage.reload({ waitUntil: "networkidle" });
    if (!(await behaviorPage.locator(".task-row").filter({ hasText: "Smoke edited task" }).count())) failures.push({ route: "tasks", controls: "task title persistence" });
    await behaviorPage.getByRole("combobox", { name: "Filter tasks by project" }).selectOption({ label: "Team Offsite" });
    if (await behaviorPage.locator(".task-empty").count() !== 1) failures.push({ route: "tasks", controls: "empty project task state" });
    await behaviorPage.getByRole("combobox", { name: "Filter tasks by project" }).selectOption({ label: "Smoke project" });
    const projectFilteredTasks = await behaviorPage.locator(".task-row").allTextContents();
    if (projectFilteredTasks.some((task) => !task.includes("Smoke project"))) failures.push({ route: "tasks", controls: "project task filter", projectFilteredTasks });
    await behaviorPage.evaluate(() => { const key = "crescent-suite:workspace:v1"; const workspace = JSON.parse(localStorage.getItem(key) ?? "{}"); workspace.tasks = []; localStorage.setItem(key, JSON.stringify(workspace)); });
    await behaviorPage.goto(`${baseUrl}/home`, { waitUntil: "networkidle" });
    if ((await behaviorPage.locator(".recent-table").innerText()).includes("Review the launch brief")) failures.push({ route: "home", controls: "empty task collection stays empty" });
    await behaviorPage.goto(`${baseUrl}/sheets`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("textbox", { name: "Cell B9" }).fill("=AVERAGE(B2:B4)");
    const averageValue = await behaviorPage.evaluate(() => document.querySelector('[aria-label="Cell B9"]')?.parentElement?.querySelector(".sheet-display")?.textContent);
    if (averageValue !== "5196.67") failures.push({ route: "sheets", formula: "AVERAGE", averageValue });
    await behaviorPage.getByRole("textbox", { name: "Cell B8" }).fill("=COUNT(B2:B4)");
    const countValue = await behaviorPage.evaluate(() => document.querySelector('[aria-label="Cell B8"]')?.parentElement?.querySelector(".sheet-display")?.textContent);
    if (countValue !== "3") failures.push({ route: "sheets", formula: "COUNT", countValue });
    await behaviorPage.goto(`${baseUrl}/forms`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("button", { name: "Change question 1 type" }).click();
    await behaviorPage.getByRole("button", { name: "Change question 1 type" }).click();
    await behaviorPage.getByRole("button", { name: "Change question 1 type" }).click();
    if (await behaviorPage.locator("textarea.form-textarea").count() !== 1) failures.push({ route: "forms", controls: "long answer textarea" });
    await behaviorPage.getByRole("button", { name: "Change question 1 type" }).click();
    const independentScaleChoices = behaviorPage.locator(".scale-input button");
    await independentScaleChoices.nth(4).click();
    await independentScaleChoices.nth(5).click();
    if (await independentScaleChoices.count() !== 10 || await independentScaleChoices.nth(4).getAttribute("aria-pressed") !== "true" || await independentScaleChoices.nth(5).getAttribute("aria-pressed") !== "true" || await independentScaleChoices.nth(0).getAttribute("aria-pressed") !== "false") failures.push({ route: "forms", controls: "independent scale answers" });
    await behaviorPage.getByRole("button", { name: "Delete question 1" }).click();
    const questionCount = await behaviorPage.locator(".question-label-input").count();
    if (questionCount !== 2) failures.push({ route: "forms", controls: "question delete", questionCount });
    await behaviorPage.goto(`${baseUrl}/docs`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("textbox", { name: "File title" }).fill("Crescent smoke favorite");
    await behaviorPage.goto(`${baseUrl}/starred`, { waitUntil: "networkidle" });
    const renamedFavorite = await behaviorPage.locator(".utility-panel").innerText();
    if (!renamedFavorite.includes("Crescent smoke favorite")) failures.push({ route: "starred", controls: "rename favorite" });
    await behaviorPage.goto(`${baseUrl}/slides`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("button", { name: "Present" }).click();
    const slideBefore = await behaviorPage.locator(".presentation-stage .canvas-page").innerText();
    await behaviorPage.keyboard.press("ArrowRight");
    const slideAfter = await behaviorPage.locator(".presentation-stage .canvas-page").innerText();
    if (slideBefore === slideAfter) failures.push({ route: "slides", controls: "keyboard presentation navigation" });
    await behaviorPage.keyboard.press("Escape");
    if (await behaviorPage.locator(".presentation-overlay").count()) failures.push({ route: "slides", controls: "presentation escape" });
    await behaviorPage.goto(`${baseUrl}/docs`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("combobox", { name: "Text style" }).selectOption("blockquote");
    const styleValue = await behaviorPage.getByRole("combobox", { name: "Text style" }).inputValue();
    if (styleValue !== "blockquote") failures.push({ route: "docs", controls: "text style", styleValue });
    await behaviorPage.goto(`${baseUrl}/forms`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("textbox", { name: "File title" }).fill("Smoke / export");
    const exportDownloadPromise = behaviorPage.waitForEvent("download");
    await behaviorPage.getByRole("button", { name: "Export" }).click();
    const exportFilename = (await exportDownloadPromise).suggestedFilename();
    if (exportFilename.includes("/")) failures.push({ route: "forms", controls: "safe export filename", exportFilename });
    await behaviorPage.getByRole("button", { name: "Publish", exact: true }).click();
    await behaviorPage.waitForTimeout(50);
    if (await behaviorPage.getByRole("button", { name: "Published locally", exact: true }).count() !== 1 || !(await behaviorPage.locator(".publish-status").innerText()).includes("Ready locally") || !(await behaviorPage.locator(".toast").innerText()).includes("ready locally")) failures.push({ route: "forms", controls: "honest local publish state" });
    await behaviorPage.getByRole("button", { name: "Preview" }).click();
    await behaviorPage.locator(".form-input").first().fill("Smoke response");
    await behaviorPage.locator(".scale-input button").last().click();
    await behaviorPage.getByRole("button", { name: "Submit response" }).click();
    await behaviorPage.getByRole("button", { name: /Responses/ }).click();
    if (await behaviorPage.locator(".response-card").count() !== 1) failures.push({ route: "forms", controls: "response history" });
    const responseCsvDownloadPromise = behaviorPage.waitForEvent("download");
    await behaviorPage.getByRole("button", { name: "Export CSV" }).click();
    const responseCsvFilename = (await responseCsvDownloadPromise).suggestedFilename();
    if (!responseCsvFilename.endsWith("-responses.csv")) failures.push({ route: "forms", controls: "response CSV export", responseCsvFilename });
    await behaviorPage.getByRole("button", { name: "Back to form" }).click();
    const previousDocTitle = "Crescent smoke favorite";
    const createDriveFile = async (type, title) => { await behaviorPage.goto(`${baseUrl}/drive`, { waitUntil: "networkidle" }); await behaviorPage.getByRole("button", { name: "New file" }).click(); const dialog = behaviorPage.getByRole("dialog", { name: "Start something new" }); await dialog.waitFor(); await dialog.locator(".file-type-option").filter({ hasText: type }).click(); await dialog.getByRole("textbox", { name: "File name" }).fill(title); await dialog.getByRole("button", { name: `Create ${type}`, exact: true }).click(); await behaviorPage.waitForURL(new RegExp(`#${type.toLowerCase()}$`)); };
    await behaviorPage.goto(`${baseUrl}/drive`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("button", { name: "New file" }).click();
    const blankFileDialog = behaviorPage.getByRole("dialog", { name: "Start something new" });
    if (await blankFileDialog.getByRole("textbox", { name: "File name" }).inputValue() !== "" || await blankFileDialog.getByRole("textbox", { name: "File name" }).getAttribute("placeholder") !== "Name this document") failures.push({ route: "drive", controls: "blank file naming field" });
    await blankFileDialog.press("Escape");
    if (await behaviorPage.getByRole("dialog", { name: "Start something new" }).count()) failures.push({ route: "drive", controls: "new file Escape dismissal" });
    await createDriveFile("Docs", "Smoke new file");
    if (await behaviorPage.getByRole("textbox", { name: "File title" }).inputValue() !== "Smoke new file") failures.push({ route: "drive", controls: "new file title" });
    if ((await behaviorPage.getByRole("textbox", { name: "Document body" }).innerText()).trim()) failures.push({ route: "drive", controls: "new Docs file starts blank" });
    await behaviorPage.goto(`${baseUrl}/trash`, { waitUntil: "networkidle" });
    const archivedDoc = behaviorPage.locator(".utility-file-row").filter({ hasText: previousDocTitle });
    if (await archivedDoc.count() !== 1) failures.push({ route: "trash", controls: "archived Docs file" });
    else await archivedDoc.getByRole("button", { name: "Restore" }).click();
    await behaviorPage.goto(`${baseUrl}/docs`, { waitUntil: "networkidle" });
    if (await behaviorPage.getByRole("textbox", { name: "File title" }).inputValue() !== previousDocTitle) failures.push({ route: "docs", controls: "Docs restore" });
    await createDriveFile("Sheets", "Smoke sheet");
    await behaviorPage.goto(`${baseUrl}/sheets`, { waitUntil: "networkidle" });
    if (await behaviorPage.getByRole("textbox", { name: "File title" }).inputValue() !== "Smoke sheet") failures.push({ route: "drive", controls: "new Sheets file" });
    await behaviorPage.goto(`${baseUrl}/trash`, { waitUntil: "networkidle" });
    const archivedSheet = behaviorPage.locator(".utility-file-row").filter({ hasText: "Growth metrics" });
    if (await archivedSheet.count() !== 1) failures.push({ route: "trash", controls: "archived Sheets file from Drive" });
    else { await archivedSheet.getByRole("button", { name: "Restore" }).click(); if (await behaviorPage.locator(".utility-file-row").filter({ hasText: "Smoke sheet" }).count() !== 1) failures.push({ route: "trash", controls: "recoverable displaced Sheets file" }); }
    await behaviorPage.goto(`${baseUrl}/sheets`, { waitUntil: "networkidle" });
    if (await behaviorPage.getByRole("textbox", { name: "File title" }).inputValue() !== "Growth metrics") failures.push({ route: "sheets", controls: "Drive Sheets restore" });
    await createDriveFile("Slides", "Smoke deck");
    await behaviorPage.goto(`${baseUrl}/slides`, { waitUntil: "networkidle" });
    if (await behaviorPage.getByRole("textbox", { name: "File title" }).inputValue() !== "Smoke deck") failures.push({ route: "drive", controls: "new Slides file" });
    await behaviorPage.goto(`${baseUrl}/trash`, { waitUntil: "networkidle" });
    const archivedSlides = behaviorPage.locator(".utility-file-row").filter({ hasText: "Design review deck" });
    if (await archivedSlides.count() !== 1) failures.push({ route: "trash", controls: "archived Slides file from Drive" });
    else { await archivedSlides.getByRole("button", { name: "Restore" }).click(); if (await behaviorPage.locator(".utility-file-row").filter({ hasText: "Smoke deck" }).count() !== 1) failures.push({ route: "trash", controls: "recoverable displaced Slides file" }); }
    await behaviorPage.goto(`${baseUrl}/slides`, { waitUntil: "networkidle" });
    if (await behaviorPage.getByRole("textbox", { name: "File title" }).inputValue() !== "Design review deck") failures.push({ route: "slides", controls: "Drive Slides restore" });
    await behaviorPage.goto(`${baseUrl}/forms`, { waitUntil: "networkidle" });
    const previousFormTitle = await behaviorPage.getByRole("textbox", { name: "File title" }).inputValue();
    await createDriveFile("Forms", "Smoke form");
    await behaviorPage.goto(`${baseUrl}/forms`, { waitUntil: "networkidle" });
    if (await behaviorPage.getByRole("textbox", { name: "File title" }).inputValue() !== "Smoke form") failures.push({ route: "drive", controls: "new Forms file" });
    await behaviorPage.goto(`${baseUrl}/trash`, { waitUntil: "networkidle" });
    const archivedForm = behaviorPage.locator(".utility-file-row").filter({ hasText: previousFormTitle });
    if (await archivedForm.count() !== 1) failures.push({ route: "trash", controls: "archived Forms file from Drive" });
    else { await archivedForm.getByRole("button", { name: "Restore" }).click(); if (await behaviorPage.locator(".utility-file-row").filter({ hasText: "Smoke form" }).count() !== 1) failures.push({ route: "trash", controls: "recoverable displaced Forms file" }); }
    await behaviorPage.goto(`${baseUrl}/forms`, { waitUntil: "networkidle" });
    if (await behaviorPage.getByRole("textbox", { name: "File title" }).inputValue() !== previousFormTitle) failures.push({ route: "forms", controls: "Drive Forms restore" });
    await behaviorPage.goto(`${baseUrl}/starred`, { waitUntil: "networkidle" });
    if (!(await behaviorPage.locator(".utility-panel").innerText()).includes(previousDocTitle)) failures.push({ route: "starred", controls: "restored favorite" });
    await behaviorPage.goto(`${baseUrl}/settings`, { waitUntil: "networkidle" });
    await behaviorPage.locator('input[type="file"]').setInputFiles({ name: "partial-backup.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ version: 1, docs: { title: "Smoke restore" }, sheets: { title: "Smoke sheet" }, forms: null, formSettings: { collectEmail: true }, workspaces: ["Research"], projects: [{ name: "Migration" }], driveFolders: [{}, "Archive"] })) });
    await behaviorPage.getByRole("status").filter({ hasText: "Workspace backup restored locally." }).waitFor({ state: "visible" });
    await behaviorPage.goto(`${baseUrl}/forms`, { waitUntil: "networkidle" });
    if (await behaviorPage.locator(".question-label-input").count() !== 3 || await behaviorPage.getByRole("button", { name: "Collect email addresses" }).getAttribute("aria-pressed") !== "true") failures.push({ route: "settings", controls: "partial backup restore" });
    await behaviorPage.goto(`${baseUrl}/home`, { waitUntil: "networkidle" });
    if (!(await behaviorPage.locator(".workspace-list").innerText()).includes("Research") || !(await behaviorPage.locator(".project-list").innerText()).includes("Migration")) failures.push({ route: "settings", controls: "legacy workspace/project backup normalization" });
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).fill("Research");
    if (await behaviorPage.locator(".search-results .search-result").count() !== 1) failures.push({ route: "home", controls: "workspace/project global search" });
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).fill("Migration");
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).press("Enter");
    await behaviorPage.waitForFunction(() => document.querySelector(".task-project-filter")?.value?.toLowerCase() === "migration");
    if (behaviorPage.url().split("#")[1] !== "tasks" || (await behaviorPage.getByRole("combobox", { name: "Filter tasks by project" }).inputValue()).toLowerCase() !== "migration") failures.push({ route: "search", controls: "open exact Project result", url: behaviorPage.url() });
    await ensureGlobalChrome();
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).fill("Calendar");
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).press("Enter");
    if (behaviorPage.url().split("#")[1] !== "calendar") failures.push({ route: "search", controls: "open exact app result", url: behaviorPage.url() });
    await behaviorPage.goto(`${baseUrl}/home`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).fill("Organic");
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).press("Enter");
    await behaviorPage.waitForFunction(() => document.querySelector(".name-box")?.textContent === "A2");
    if (behaviorPage.url().split("#")[1] !== "sheets" || await behaviorPage.getByRole("textbox", { name: "Formula bar" }).inputValue() !== "Organic") failures.push({ route: "search", controls: "open exact Sheets cell result", url: behaviorPage.url() });
    await ensureGlobalChrome();
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).fill("What are you working on?");
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).press("Enter");
    await behaviorPage.waitForSelector(".form-question.selected");
    if (behaviorPage.url().split("#")[1] !== "forms" || await behaviorPage.locator(".form-question.selected").count() !== 1) failures.push({ route: "search", controls: "open exact Forms question result", url: behaviorPage.url() });
    await ensureGlobalChrome();
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).fill("North star");
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).press("Enter");
    await behaviorPage.waitForSelector(".document-inner .search-target");
    if (behaviorPage.url().split("#")[1] !== "docs" || !(await behaviorPage.locator(".document-inner .search-target").innerText()).includes("North star")) failures.push({ route: "search", controls: "open exact Docs heading result", url: behaviorPage.url() });
    await behaviorPage.locator(".document-inner").evaluate((editor) => editor.blur());
    await behaviorPage.waitForFunction(() => !JSON.parse(localStorage.getItem("crescent-suite:workspace:v1") ?? "{}").docs?.body?.includes("search-target"));
    await ensureGlobalChrome();
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).fill("Launch ideas");
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).press("Enter");
    if (behaviorPage.url().split("#")[1] !== "notes" || await behaviorPage.getByRole("textbox", { name: "Note title" }).inputValue() !== "Launch ideas") failures.push({ route: "search", controls: "open exact note result", url: behaviorPage.url() });
    await behaviorPage.goto(`${baseUrl}/home`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).fill("One calm workspace");
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).press("ArrowDown");
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).press("Enter");
    if (behaviorPage.url().split("#")[1] !== "slides" || await behaviorPage.locator(".presentation-canvas h1").innerText() !== "One calm workspace") failures.push({ route: "search", controls: "open exact slide result", url: behaviorPage.url() });
    await behaviorPage.goto(`${baseUrl}/home`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).fill("Review the launch brief");
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).press("Enter");
    await behaviorPage.waitForFunction(() => document.querySelector(".task-project-filter")?.value?.toLowerCase() === "product launch");
    if (behaviorPage.url().split("#")[1] !== "tasks" || await behaviorPage.locator('[data-task-title="Review the launch brief"]').count() !== 1 || (await behaviorPage.getByRole("combobox", { name: "Filter tasks by project" }).inputValue()).toLowerCase() !== "product launch") failures.push({ route: "search", controls: "open exact task result", url: behaviorPage.url() });
    await behaviorPage.goto(`${baseUrl}/drive`, { waitUntil: "networkidle" });
    const migratedFolders = await behaviorPage.locator(".folder-grid").innerText();
    if (!migratedFolders.includes("Folder 1") || !migratedFolders.includes("Archive")) failures.push({ route: "settings", controls: "legacy folder backup normalization" });
    await behaviorPage.goto(`${baseUrl}/home`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).fill("Launch assets");
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).press("Enter");
    await behaviorPage.waitForSelector('[data-file-title="Launch assets"].selected');
    if (behaviorPage.url().split("#")[1] !== "drive") failures.push({ route: "search", controls: "open exact Drive file result", url: behaviorPage.url() });
    await behaviorPage.goto(`${baseUrl}/drive`, { waitUntil: "networkidle" });
    const liveDriveTitle = "Smoke restore";
    await behaviorPage.locator(".drive-file").filter({ hasText: liveDriveTitle }).click();
    if (behaviorPage.url().split("#")[1] !== "docs" || await behaviorPage.getByRole("textbox", { name: "File title" }).inputValue() !== liveDriveTitle) failures.push({ route: "drive", controls: "exact recent-file destination", url: behaviorPage.url() });
    await behaviorPage.goto(`${baseUrl}/home`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).fill("North star");
    await behaviorPage.getByRole("textbox", { name: "Search across Crescent" }).press("Enter");
    await behaviorPage.waitForSelector(".document-inner .search-target");
    await behaviorPage.goBack();
    await behaviorPage.waitForFunction(() => globalThis.location.pathname.endsWith("/home") && (!globalThis.location.hash || globalThis.location.hash === "#home"));
    await behaviorPage.goForward();
    await behaviorPage.waitForSelector(".document-inner .search-target");
    if (behaviorPage.url().split("#")[1] !== "docs") failures.push({ route: "history", controls: "restore exact search context", url: behaviorPage.url() });
    await behaviorPage.goto(`${baseUrl}/settings`, { waitUntil: "networkidle" });
    await behaviorPage.locator('input[type="file"]').setInputFiles({ name: "malformed-records.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ version: 1, docs: { title: "Safe import" }, sheets: { title: "Safe sheet" }, slides: [null], notes: [null], tasks: [null], forms: [null], calendarEvents: [null], driveFolders: [null], deletedFiles: [null], formResponses: [{ submittedAt: "not a date", scaleAnswers: { 2: "invalid", 3: "5" }, scale: "9", answers: null }] })) });
    await behaviorPage.getByRole("status").filter({ hasText: "Workspace backup restored locally." }).waitFor({ state: "visible" });
    await behaviorPage.waitForTimeout(250);
    const normalizedScaleResponse = await behaviorPage.evaluate(() => JSON.parse(localStorage.getItem("crescent-suite:workspace:v1") ?? "{}").formResponses?.[0] ?? {});
    if (normalizedScaleResponse.scale !== null || Object.prototype.hasOwnProperty.call(normalizedScaleResponse.scaleAnswers ?? {}, "2") || normalizedScaleResponse.scaleAnswers?.[3] !== 5) failures.push({ route: "settings", controls: "malformed Scale response normalization", normalizedScaleResponse });
    await behaviorPage.goto(`${baseUrl}/slides`, { waitUntil: "networkidle" });
    if (await behaviorPage.locator(".slide-thumb").count() !== 1) failures.push({ route: "settings", controls: "malformed slide backup normalization" });
    await behaviorPage.goto(`${baseUrl}/notes`, { waitUntil: "networkidle" });
    if (await behaviorPage.locator(".note-list-item").count() !== 1) failures.push({ route: "settings", controls: "malformed note backup normalization" });
    await behaviorPage.goto(`${baseUrl}/tasks`, { waitUntil: "networkidle" });
    if (await behaviorPage.locator(".task-row").count() !== 1) failures.push({ route: "settings", controls: "malformed task backup normalization" });
    await behaviorPage.goto(`${baseUrl}/forms`, { waitUntil: "networkidle" });
    if (await behaviorPage.locator(".question-label-input").count() !== 1) failures.push({ route: "settings", controls: "malformed form backup normalization" });
    await behaviorPage.goto(`${baseUrl}/calendar`, { waitUntil: "networkidle" });
    if (await behaviorPage.locator(".calendar-local-card").count() !== 1) failures.push({ route: "settings", controls: "malformed calendar backup normalization" });
    await behaviorPage.goto(`${baseUrl}/trash`, { waitUntil: "networkidle" });
    if (await behaviorPage.locator(".utility-file-row").count() !== 0 || !(await behaviorPage.locator(".utility-panel").innerText()).includes("Trash is empty.")) failures.push({ route: "settings", controls: "malformed Trash backup normalization" });
    await behaviorPage.goto(`${baseUrl}/forms`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("button", { name: /Responses/ }).click();
    if (await behaviorPage.locator(".response-card").count() !== 1) failures.push({ route: "settings", controls: "malformed response backup normalization" });
    await behaviorPage.goto(`${baseUrl}/settings`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("button", { name: "Reset workspace" }).click();
    const resetDialog = behaviorPage.getByRole("dialog", { name: "Start over with a blank workspace?" });
    await resetDialog.getByRole("button", { name: "Reset workspace", exact: true }).click();
    await behaviorPage.getByRole("status").filter({ hasText: "Workspace reset locally. Start fresh on Home." }).waitFor({ state: "visible" });
    if (behaviorPage.url().split("#")[1] !== "home" || (await behaviorPage.locator(".app-shell").getAttribute("class"))?.includes("workspace-demo") || (await behaviorPage.locator(".recent-table").innerText()).includes("Review the launch brief")) failures.push({ route: "settings", controls: "reset local workspace" });
  } finally {
    await behaviorPage.close();
  }

  const freshContext = await browser.newContext();
  const freshRoutes = routes.filter((route) => route !== "Crescent-Suite/forms");
  const seededCopy = /Alex Morgan|Taylor Kim|Jordan Lee|Sam Chen|Design review|Growth metrics|Launch feedback|Product workspace|A new chapter|Add a thought worth sharing/;
  try {
    for (const viewport of viewports) {
      for (const route of freshRoutes) {
        const freshPage = await freshContext.newPage({ viewport });
        const pageErrors = [];
        freshPage.on("pageerror", (error) => pageErrors.push(error.message));
        try {
          await freshPage.goto(`${baseUrl}/${route}?fresh=1`, { waitUntil: "networkidle" });
          const state = await freshPage.evaluate(() => ({
            workspaceClass: document.querySelector(".app-shell")?.className ?? "",
            text: document.body.innerText,
            overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
          }));
          const hasLocalSlideResidue = route === "slides" && state.text.includes("CRESCENT / DESIGN REVIEW");
          if (pageErrors.length || state.overflow || !state.workspaceClass.includes("workspace-local") || seededCopy.test(state.text) || hasLocalSlideResidue) failures.push({ viewport: viewport.name, route, pageErrors, overflow: state.overflow, workspaceClass: state.workspaceClass, seededCopy: seededCopy.test(state.text), hasLocalSlideResidue });
          if (route === "home" && viewport.name === "desktop" && await freshPage.getByText("Make Crescent yours.").count() !== 1) failures.push({ viewport: viewport.name, route, emptyState: "optional guide" });
          if (route === "home" && viewport.name === "desktop") {
            await freshPage.getByRole("textbox", { name: "Search across Crescent" }).fill("Slides");
            const blankSearchTitles = await freshPage.locator(".search-result strong").allTextContents();
            if (blankSearchTitles.some((title) => !title.trim())) failures.push({ viewport: viewport.name, route, search: "blank editor residue" });
            await freshPage.keyboard.press("Escape");
            await freshPage.getByRole("button", { name: "Expand navigation", exact: true }).click();
            if (await freshPage.getByRole("button", { name: "More projects", exact: true }).count()) failures.push({ viewport: viewport.name, route, controls: "inert projects placeholder" });
            if (await freshPage.getByRole("button", { name: "Add your first project", exact: true }).count() !== 1) failures.push({ viewport: viewport.name, route, controls: "first project action" });
          }
          if (route === "forms" && await freshPage.getByRole("button", { name: "Preview", exact: true }).count()) failures.push({ viewport: viewport.name, route, controls: "blank Forms preview dead end" });
          if (["docs", "sheets", "slides"].includes(route) && viewport.name === "desktop") {
            await freshPage.getByRole("button", { name: "Move to Trash", exact: true }).click();
            if (!freshPage.url().endsWith("#trash") || !(await freshPage.locator(".utility-panel").innerText()).includes("Trash is empty.")) failures.push({ viewport: viewport.name, route, controls: "blank file trash cleanup", url: freshPage.url(), trash: await freshPage.locator(".utility-panel").innerText() });
          }
          if (route === "forms" && viewport.name === "desktop") {
            const formIsolationContext = await browser.newContext({ viewport });
            const formIsolationPage = await formIsolationContext.newPage();
            try {
              await formIsolationPage.goto(`${baseUrl}/forms?fresh=1`, { waitUntil: "networkidle" });
              await formIsolationPage.getByRole("button", { name: "Add your first question" }).click();
              const newQuestion = formIsolationPage.getByRole("textbox", { name: "Question 1 label" });
              if (await newQuestion.inputValue() !== "" || await newQuestion.getAttribute("placeholder") !== "Write a question...") failures.push({ viewport: viewport.name, route, controls: "blank new question label" });
              await formIsolationPage.getByRole("button", { name: "Preview", exact: true }).click();
              if (!(await formIsolationPage.getByRole("status").innerText()).includes("Give every question a label before previewing")) failures.push({ viewport: viewport.name, route, controls: "unlabeled question preview guard" });
            } finally {
              await formIsolationPage.close();
              await formIsolationContext.close();
            }
          }
        } finally {
          await freshPage.close();
        }
      }
    }
  } finally {
    await freshContext.close();
  }

  const demoIsolationContext = await browser.newContext({ viewport: viewports[0] });
  try {
    const demoIsolationPage = await demoIsolationContext.newPage();
    await demoIsolationPage.goto(`${baseUrl}/home?demo=1`, { waitUntil: "networkidle" });
    await demoIsolationPage.waitForTimeout(250);
    await demoIsolationPage.goto(`${baseUrl}/home`, { waitUntil: "networkidle" });
    const isolationState = await demoIsolationPage.evaluate(() => ({
      workspaceClass: document.querySelector(".app-shell")?.className ?? "",
      text: document.body.innerText,
    }));
    if (isolationState.workspaceClass.includes("workspace-demo") || /Product strategy Q3 2024|Growth metrics|Launch feedback/.test(isolationState.text)) failures.push({ route: "home", controls: "demo preview isolation", isolationState });
    await demoIsolationPage.close();
  } finally {
    await demoIsolationContext.close();
  }

  const blankRecoveryContext = await browser.newContext({ viewport: viewports[0] });
  try {
    const recoveryPage = await blankRecoveryContext.newPage();
    await recoveryPage.goto(`${baseUrl}/drive?fresh=1`, { waitUntil: "networkidle" });
    const createNamedFile = async (type, title) => {
      await recoveryPage.getByRole("button", { name: "New file", exact: true }).first().click();
      const dialog = recoveryPage.getByRole("dialog", { name: "Start something new" });
      await dialog.locator(".file-type-option").filter({ hasText: type }).click();
      await dialog.getByRole("textbox", { name: "File name" }).fill(title);
      await dialog.getByRole("button", { name: `Create ${type}`, exact: true }).click();
      await recoveryPage.waitForURL(new RegExp(`#${type.toLowerCase()}$`));
    };
    await createNamedFile("Forms", "Smoke empty form");
    await recoveryPage.getByRole("button", { name: "Move to Trash", exact: true }).click();
    const formTrashRow = recoveryPage.locator(".utility-file-row").filter({ hasText: "Smoke empty form" });
    if (await formTrashRow.count() !== 1) failures.push({ route: "forms", controls: "named empty form recovery record" });
    await formTrashRow.getByRole("button", { name: "Restore" }).click();
    await recoveryPage.goto(`${baseUrl}/forms`, { waitUntil: "networkidle" });
    if (await recoveryPage.locator(".question-label-input").count() !== 0) failures.push({ route: "forms", controls: "named empty form restore seeded content" });
    await recoveryPage.goto(`${baseUrl}/trash`, { waitUntil: "networkidle" });
    if (!(await recoveryPage.locator(".utility-panel").innerText()).includes("Trash is empty.")) failures.push({ route: "forms", controls: "blank current archive after restore" });
    await recoveryPage.close();
  } finally {
    await blankRecoveryContext.close();
  }

  await browser.close();
  if (failures.length) {
    console.error(JSON.stringify(failures, null, 2));
    process.exitCode = 1;
  } else {
    console.log(`Crescent smoke: ${routes.length * viewports.length} routes passed; ${freshRoutes.length * viewports.length} isolated blank-workspace routes passed; demo preview isolation; consistent Focus Mode and keyboard-safe exit controls across every suite app; actionable empty-state navigation; local-only sharing feedback; guided local workspace/project/folder creation and project-linked task creation; Calendar Week has 7 days; mobile Calendar navigation; guided local event creation with inline editing, natural-language dates, live Recent, reversible Calendar events, and timed ICS export; Month has 42 cells; recoverable Docs, Sheets, Slides, and Forms files with displaced-file recovery; independent Form Scale answers; editable task titles and due dates; guided Docs link insertion; guided Trash cleanup confirmations; clear Forms multi-response state and Long answer controls; live Task Starred recovery; content search, local formulas (including COUNT), response history and CSV export, safe exports, accessible cross-app Drive file creation and recovery, and Slides presentation controls are active.`);
  }
} finally {
  server.kill("SIGTERM");
}
