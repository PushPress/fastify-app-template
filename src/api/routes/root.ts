import { FastifyPluginCallbackZodOpenApi } from "fastify-zod-openapi";

const root: FastifyPluginCallbackZodOpenApi = (fastify, _, done) => {
  fastify.get("/", function () {
    return { root: true };
  });
  done();
};

export default root;
