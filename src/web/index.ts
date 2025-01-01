import { FastifyPluginAsync } from "fastify";
import path from "path";
import fastifyStatic from "@fastify/static";

const app: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyStatic, {
    root:
      process.env.NODE_ENV === "development"
        ? path.join(__dirname, "../../spa")
        : path.join(__dirname, "../../spa/dist"),
  });

  fastify.get("/", (_, reply) => reply.sendFile("index.html"));
};

export default app;
