import { FastifyPluginCallback } from "fastify";
import AutoLoad from "@fastify/autoload";
import { join } from "node:path";

const app: FastifyPluginCallback = (fastify, opts, done) => {
  // load plugins
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: { ...opts, prefix: "/worker" },
  });

  // load workers
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "workers"),
    options: opts,
  });

  done();
};

export default app;
