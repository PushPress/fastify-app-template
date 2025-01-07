import { FastifyPluginCallback } from "fastify";

const app: FastifyPluginCallback = (fastify, _, done) => {
  // NOTE: delete this worker and replace with your own worker
  const { exampleWorker } = fastify.workers;
  exampleWorker.run(async (job) => {
    return Promise.resolve(job.data.id);
  });

  done();
};

export default app;
