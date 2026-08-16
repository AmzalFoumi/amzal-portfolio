import { defineConfig } from "vitest/config";

export default defineConfig({
  // Native replacement for the vite-tsconfig-paths plugin; resolves the `@/*` alias.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
