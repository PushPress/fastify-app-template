import fp from "fastify-plugin";
import { exampleWorker, exampleQueue } from "../queues/example";

/**
 * Configure BullMQ Queues Workers and Events
 */
export default fp(
  (fastify, _, done) => {
    // exampleEvents.on("retries-exhausted", (job) => {
    //   fastify.log.error(`retries-exhausted for job ${job.jobId}`);
    // });

    fastify.decorate("queues", {
      exampleQueue,
    });

    fastify.decorate("workers", {
      exampleWorker,
    });

    done();
  },
  { name: "openapi" },
);

declare module "fastify" {
  interface FastifyInstance {
    queues: {
      exampleQueue: typeof exampleQueue;
    };
    workers: {
      exampleWorker: typeof exampleWorker;
    };
  }
}
