/**
 * NOTE: delete this file and replace with your own queue
 */
import bullmq from "../bullmq";

declare module "../bullmq" {
  /**
   * Declare the queues and their job data and result types
   */
  export interface QueueConfig {
    example: {
      data: { id: number };
      result: unknown;
    };
  }
}

const {
  queue: exampleQueue,
  worker: exampleWorker,
  events: exampleEvents,
} = bullmq.build("example", {
  defaultJobOptions: { removeOnFail: true },
});

export { exampleQueue, exampleWorker, exampleEvents };
