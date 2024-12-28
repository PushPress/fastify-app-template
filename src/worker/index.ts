import { FastifyPluginCallback } from "fastify";

const app: FastifyPluginCallback = (_, __, done) => {
  done();
};

export default app;
