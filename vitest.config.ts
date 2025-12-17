// vitest.workspace.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // This replaces the old defineWorkspace
    projects: ["packages/*"],

    // Optional: Shared settings for all projects
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
