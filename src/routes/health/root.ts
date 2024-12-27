import { z } from "zod";
import { FastifyPluginCallbackZodOpenApi } from "fastify-zod-openapi";

const example: FastifyPluginCallbackZodOpenApi = (fastify, _, done) => {
  fastify.get(
    "/",
    {
      schema: {
        response: {
          200: z.object({ status: z.literal("ok") }),
        },
      },
    },
    () => {
      return { status: "ok" } as const;
    },
  );
  done();
};

export default example;
