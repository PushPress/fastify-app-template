// This file contains code that we reuse between our tests.
import "../src/plugins/env";
import App, { AppOptions } from "../src/app";
import Fastify from "fastify";

// Automatically build and tear down our instance
async function build() {
  const fastify = Fastify();
  await fastify.register(App, {} as AppOptions);
  return fastify;
}

export { build };
