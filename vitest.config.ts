import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "edge-runtime",
    include: ["convex/**/*.integration.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text"],
      include: ["convex/**/*.ts"],
      exclude: [
        "convex/**/*.test.ts",
        "convex/_generated/**",
        "convex/auth.config.ts",
        "convex/schema.ts",
      ],
    },
  },
});
