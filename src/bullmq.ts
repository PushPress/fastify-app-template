/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  JobsOptions,
  Queue,
  Worker,
  QueueEvents,
  Processor,
  WorkerOptions,
  QueueOptions,
} from "bullmq";
import { Cluster, Redis } from "ioredis";
import redis from "./redis";
import { internalEventEmitter } from "./app";

interface BullOptions {
  connection: Redis | Cluster;
  defaultJobOptions: JobsOptions;
}

/**
 * Extend this interface to define the queues and their job data and result types
 * example:
 * interface QueueConfig {
 *   test: {
 *     data: { id: number };
 *     result: unknown;
 *   };
 * }
 */
export interface QueueConfig {}

/**
 * A BullBuilder is an object with a buld method that returns a queue and a worker configured to work with the same queue and job data
 */
interface BullBuilder {
  build<
    QueueName extends keyof QueueConfig,
    JobData = QueueConfig[QueueName]["data"],
    JobResult = QueueConfig[QueueName]["result"],
  >(
    name: QueueName,
    queueOptions?: Partial<QueueOptions>,
  ): {
    events: QueueEvents;
    queue: Queue<JobData, JobResult, QueueName>;
    worker: {
      run(
        processor: Processor<JobData>,
        workerOptions?: WorkerOptions,
      ): Worker<JobData, JobResult>;
    };
  };
}

/**
 * Create a bull builder object ties the a queue to a worker so that type inference is shared across the two
 */
function bull({ defaultJobOptions, connection }: BullOptions): BullBuilder {
  // keep track of workers so we can close them on close
  const workers: Worker[] = [];

  internalEventEmitter.on(
    "close",
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    () => {
      return Promise.all(workers.map((worker) => worker.close()));
    },
    { promisify: true },
  );

  return {
    build: (name, queueOptions) => {
      return {
        globalEvents: internalEventEmitter,
        events: new QueueEvents(name),
        queue: new Queue(name, {
          connection,
          ...queueOptions,
          defaultJobOptions: {
            ...defaultJobOptions,
            ...queueOptions?.defaultJobOptions,
          },
        }),
        worker: {
          run: (processor, workerOptions) => {
            const worker = new Worker(name, processor, {
              ...workerOptions,
              connection,
            });
            workers.push(worker);
            return worker;
          },
        },
      };
    },
  };
}

/**
 * instantiate default buill configuration
 */
export default bull({
  connection: redis,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 5 * 1000,
    },
    // remove failed jobs after 7 days
    removeOnFail: { count: 10000, age: 1000 * 60 * 60 * 24 * 7 },
    // remove completed jobs after 1 hour
    removeOnComplete: { count: 10000, age: 1000 * 60 * 60 },
  },
});
