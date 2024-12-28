import fp from "fastify-plugin";
import { createBullBoard } from "@bull-board/api";
import { FastifyAdapter } from "@bull-board/fastify";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";

export default fp((fastify, _, done) => {
  if (fastify.config.NODE_ENV === "production") {
    done();
    return;
  }

  const serverAdapter = new FastifyAdapter();

  createBullBoard({
    queues: Array.from(Object.values(fastify.queues)).map(
      (queue) => new BullMQAdapter(queue),
    ),
    serverAdapter,
  });

  serverAdapter.setBasePath("/dashboard");

  fastify.register(serverAdapter.registerPlugin(), {
    prefix: "/dashboard",
    basePath: "",
  });
  done();
});
