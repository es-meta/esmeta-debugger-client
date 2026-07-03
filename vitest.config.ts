import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["tests/**", "node_modules/**", "dist/**"],
    passWithNoTests: true,
  },
});
