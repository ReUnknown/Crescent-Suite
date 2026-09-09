import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.CRESCENT_PAGES_BUILD === "true" ? "/Crescent-Suite/" : "/",
});
