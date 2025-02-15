import App, { AppOptions } from "../src/app";
import fp from "fastify-plugin";
import Fastify from "fastify";
import { Queue, QueueEvents } from "bullmq";

// Automatically build and tear down our instance
export async function build(opts?: AppOptions) {
  const fastify = Fastify();
  await fastify.register(fp(App), opts ?? ({} as AppOptions));
  await fastify.ready();
  return fastify;
}

export async function cleanQueue(queue: Queue, events: QueueEvents) {
  const activeJobs = await queue.getActive();
  if (activeJobs.length > 0) {
    await Promise.all(activeJobs.map((job) => job.waitUntilFinished(events)));
  }

  await queue.obliterate({ force: true });
  await events.close();
}
