import { initDDTracer } from "@pushpress/datadog";
import tracer from "dd-trace";

/**
 * Details on ho to configure datadog tracing can be found here:
 * https://github.com/PushPress/datadog
 */
export function newTracer() {
  return initDDTracer({
    tracer,
    metrics: [
      {
        name: "sample.metric",
        type: "counter",
      },
    ],
  });
}

export type Tracer = Awaited<ReturnType<typeof newTracer>>;
