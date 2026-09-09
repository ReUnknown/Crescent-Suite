/* global console, document, fetch, process, setTimeout */

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
  } finally {
    await behaviorPage.close();
  }

  await browser.close();
  if (failures.length) {
    console.error(JSON.stringify(failures, null, 2));
    process.exitCode = 1;
  } else {
    console.log(`Crescent smoke: ${routes.length * viewports.length} routes passed; Calendar Month has 42 cells; content search, local formulas, Forms controls, favorite continuity, and Slides presentation controls are active.`);
  }
} finally {
  server.kill("SIGTERM");
}
