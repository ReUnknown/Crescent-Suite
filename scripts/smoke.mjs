/* global console, document, fetch, process, setTimeout */

import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = 4173;
const baseUrl = process.env.SMOKE_URL ?? `http://127.0.0.1:${port}`;
const routes = ["home", "docs", "sheets", "slides", "notes", "tasks", "calendar", "drive", "forms", "settings"];
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
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
  if (failures.length) {
    console.error(JSON.stringify(failures, null, 2));
    process.exitCode = 1;
  } else {
    console.log(`Crescent smoke: ${routes.length * viewports.length} routes passed; Calendar Month has 42 cells.`);
  }
} finally {
  server.kill("SIGTERM");
}
