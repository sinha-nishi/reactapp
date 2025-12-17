import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node", // Default is node, perfect for utilities
  },
});
