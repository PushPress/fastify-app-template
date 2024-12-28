import { test, expect } from "vitest";
import { build } from "../helper";

test("default root route", async () => {
  const app = await build();

  const res = await app.inject({
    url: "/health",
  });
  expect(res.json()).toEqual({ status: "ok" });

  app.close();
});
