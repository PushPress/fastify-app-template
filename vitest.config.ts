import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    server: {
      deps: {
        inline: ["@fastify/autoload"],
      },
    },
    globalSetup: "./test/globalSetup.ts",
    coverage: {
      provider: "v8",
    },
    include: ["./test/**/*.test.{ts,js}"],
  },
});
