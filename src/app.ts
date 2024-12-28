// add the zod-openapi extension to the Zod library
import "zod-openapi/extend";

import { join } from "node:path";
import { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginCallback, FastifyServerOptions } from "fastify";
import Manifest, { Service } from "./manifest";
import { serializerCompiler, validatorCompiler } from "fastify-zod-openapi";
import qs from "qs";
import AutoLoad from "@fastify/autoload";
import EventEmitter from "eventemitter2";

const service = Service.parse(process.env.SERVICE);

export const internalEventEmitter = new EventEmitter();

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

const app: FastifyPluginCallback<AppOptions> = (fastify, options, done) => {
  // set zod-openapi compilers
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

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

  // Run all on close hooks in an order sensitive way
  fastify.addHook("onClose", async () => {
    // close all workers
    await internalEventEmitter.emitAsync("close");
    await fastify.db.destroy();
    await fastify.redis().quit();
  });
  done();
};

export default app;
export { app, options };
