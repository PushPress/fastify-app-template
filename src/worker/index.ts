import { FastifyPluginCallback } from "fastify";
import AutoLoad from "@fastify/autoload";
import { join } from "node:path";

const app: FastifyPluginCallback = (fastify, opts, done) => {
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });
  done();
};

export default app;
