import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Vitest configuration for the frontend suite.
 *
 * Mirrors the Vite aliases (`@` -> ./src, `declarations` -> ../declarations) so
 * tests import the same modules the app does. The DOM environment is supplied
 * by the `test` script (`vitest run --environment jsdom`); this file only wires
 * aliases, the React plugin and the shared setup module.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@icp-sdk/core"],
  },
  test: {
    pool: "threads",
    poolOptions: {
      threads: { minThreads: 1, maxThreads: 1 },
    },
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    restoreMocks: true,
  },
});
