/* global Buffer, console, document, fetch, process, setTimeout */

import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = 4173;
const baseUrl = process.env.SMOKE_URL ?? `http://127.0.0.1:${port}`;
const routes = ["home", "docs", "sheets", "slides", "notes", "tasks", "calendar", "drive", "forms", "settings", "Crescent-Suite/forms"];
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

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
  const browser = await chromium.launch({ headless: true });
  const failures = [];

  for (const viewport of viewports) {
    for (const route of routes) {
      const page = await browser.newPage({ viewport });
      const pageErrors = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      try {
        await page.goto(`${baseUrl}/${route}`, { waitUntil: "networkidle" });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
        if (pageErrors.length || overflow) failures.push({ viewport: viewport.name, route, pageErrors, overflow });
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
        if (route === "home" && viewport.name === "desktop") {
          await page.getByRole("textbox", { name: "Search across Crescent" }).fill("North star");
          const searchHits = await page.locator(".search-results .search-result").count();
          if (!searchHits) failures.push({ viewport: viewport.name, route, search: "North star" });
        }
      } finally {
        await page.close();
      }
    }
  }

  const behaviorPage = await browser.newPage({ viewport: viewports[0] });
  try {
    await behaviorPage.goto(`${baseUrl}/sheets`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("textbox", { name: "Cell B9" }).fill("=AVERAGE(B2:B4)");
    const averageValue = await behaviorPage.evaluate(() => document.querySelector('[aria-label="Cell B9"]')?.parentElement?.querySelector(".sheet-display")?.textContent);
    if (averageValue !== "5196.67") failures.push({ route: "sheets", formula: "AVERAGE", averageValue });
    await behaviorPage.getByRole("textbox", { name: "Cell B8" }).fill("=COUNT(B2:B4)");
    const countValue = await behaviorPage.evaluate(() => document.querySelector('[aria-label="Cell B8"]')?.parentElement?.querySelector(".sheet-display")?.textContent);
    if (countValue !== "3") failures.push({ route: "sheets", formula: "COUNT", countValue });
    await behaviorPage.goto(`${baseUrl}/forms`, { waitUntil: "networkidle" });
    await behaviorPage.getByRole("button", { name: "Change question 1 type" }).click();
    const typeAfterCycle = await behaviorPage.getByRole("button", { name: "Change question 1 type" }).innerText();
    if (!typeAfterCycle) failures.push({ route: "forms", controls: "question type cycle" });
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
    await behaviorPage.getByRole("button", { name: "Preview" }).click();
    await behaviorPage.locator(".form-input").first().fill("Smoke response");
    await behaviorPage.locator(".scale-input button").last().click();
    await behaviorPage.getByRole("button", { name: "Submit response" }).click();
    await behaviorPage.getByRole("button", { name: /Responses/ }).click();
    if (await behaviorPage.locator(".response-card").count() !== 1) failures.push({ route: "forms", controls: "response history" });
    await behaviorPage.getByRole("button", { name: "Back to form" }).click();
    const previousDocTitle = "Crescent smoke favorite";
    await behaviorPage.goto(`${baseUrl}/drive`, { waitUntil: "networkidle" });
    behaviorPage.once("dialog", (dialog) => dialog.accept("Smoke new file"));
    await behaviorPage.getByRole("button", { name: "New file" }).click();
    if (await behaviorPage.getByRole("textbox", { name: "File title" }).inputValue() !== "Smoke new file") failures.push({ route: "drive", controls: "new file title" });
    await behaviorPage.goto(`${baseUrl}/trash`, { waitUntil: "networkidle" });
    const archivedDoc = behaviorPage.locator(".utility-file-row").filter({ hasText: previousDocTitle });
    if (await archivedDoc.count() !== 1) failures.push({ route: "trash", controls: "archived Docs file" });
    else await archivedDoc.getByRole("button", { name: "Restore" }).click();
    await behaviorPage.goto(`${baseUrl}/docs`, { waitUntil: "networkidle" });
    if (await behaviorPage.getByRole("textbox", { name: "File title" }).inputValue() !== previousDocTitle) failures.push({ route: "docs", controls: "Docs restore" });
    await behaviorPage.goto(`${baseUrl}/settings`, { waitUntil: "networkidle" });
    await behaviorPage.locator('input[type="file"]').setInputFiles({ name: "partial-backup.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ version: 1, docs: { title: "Smoke restore" }, sheets: { title: "Smoke sheet" }, forms: null, formSettings: { collectEmail: true } })) });
    await behaviorPage.getByRole("status").filter({ hasText: "Workspace backup restored locally." }).waitFor({ state: "visible" });
    await behaviorPage.goto(`${baseUrl}/forms`, { waitUntil: "networkidle" });
    if (await behaviorPage.locator(".question-label-input").count() !== 3 || await behaviorPage.getByRole("button", { name: "Collect email addresses" }).getAttribute("aria-pressed") !== "true") failures.push({ route: "settings", controls: "partial backup restore" });
  } finally {
    await behaviorPage.close();
  }

  await browser.close();
  if (failures.length) {
    console.error(JSON.stringify(failures, null, 2));
    process.exitCode = 1;
  } else {
    console.log(`Crescent smoke: ${routes.length * viewports.length} routes passed; Calendar Week has 7 days; Month has 42 cells; content search, local formulas (including COUNT), Forms controls, response history, favorite continuity, safe exports, Drive recovery, and Slides presentation controls are active.`);
  }
} finally {
  server.kill("SIGTERM");
}
