import { initDDTracer } from "@pushpress/datadog";
import tracer from "dd-trace";

export function newTracer() {
  return initDDTracer({
    tracer,
    metrics: [],
  });
}

export type Tracer = Awaited<ReturnType<typeof newTracer>>;
