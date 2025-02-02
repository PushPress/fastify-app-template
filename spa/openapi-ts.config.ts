import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../docs/openapi.json",
  output: "src/client",
  plugins: [
    "@hey-api/client-fetch",
    "@tanstack/react-query",
    "zod",
    {
      name: "@hey-api/sdk",
      validator: true,
    },
  ],
});
