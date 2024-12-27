// add the zod-openapi extension to the Zod library
import "zod-openapi/extend";

import { join } from "node:path";
import { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync, FastifyServerOptions } from "fastify";
import Manifest, { Service } from "./manifest";
import { serializerCompiler, validatorCompiler } from "fastify-zod-openapi";
import qs from "qs";
import AutoLoad from "@fastify/autoload";
import { newTracer, Tracer } from "./datadog";

const service = Service.parse(process.env.SERVICE);

declare module "fastify" {
  interface FastifyInstance {
    tracer: Tracer;
  }
}

/**
 * Define your root app options + server options here
 */
export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {
  service: Service;
}

/**
 * This options object is passed to the root plugin below from the fastify CLI
 */
const options: AppOptions = {
  /**
   *  Service to run as, (e.g api, worker, monolith)
   */
  service,
  /**
   *  Ignore trailing slashes so /example/ is the same as /example
   */
  ignoreTrailingSlash: true,
  /**
   * qs provides more flexible query string parsing capabilities
   * https://github.com/ljharb/qs
   */
  querystringParser: qs.parse,
};

const app: FastifyPluginAsync<AppOptions> = async (fastify, options) => {
  // set zod-openapi compilers
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  // Add datadog tracer
  fastify.decorate("tracer", await newTracer());

  // register root plugins
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: options,
  });

  // register root routes
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: options,
  });

  // register service plugins
  void Manifest[service].map(([plugin, opts]) =>
    fastify.register(plugin, opts ?? {}),
  );
};

export default app;
export { app, options };
