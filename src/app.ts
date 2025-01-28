// add the zod-openapi extension to the Zod library
import "zod-openapi/extend";

import { join } from "node:path";
import { AutoloadPluginOptions } from "@fastify/autoload";
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyServerOptions,
} from "fastify";
import Manifest, { Service } from "./manifest";
import { serializerCompiler, validatorCompiler } from "fastify-zod-openapi";
import qs from "qs";
import AutoLoad from "@fastify/autoload";
import EventEmitter from "eventemitter2";
import { repl } from "./repl";
import fp from "fastify-plugin";
import { newTracer, Tracer } from "./datadog";

declare module "fastify" {
  interface FastifyInstance {
    tracer: Tracer;
  }
}

const service = Service.parse(process.env.SERVICE);

export const internalEventEmitter = new EventEmitter();

/**
 * Define your root app options + server options here
 */
export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {
  /**
   *  Service to run as, (e.g api, worker, monolith)
   */
  service: Service;
  /**
   * Start the application in a repl session
   */
  repl: boolean;
}

/**
 * This options object is passed to the root plugin below from the fastify CLI
 */
const options: AppOptions = {
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

  /**
   * qs provides more flexible query string parsing capabilities
   */
  repl: false,
};

const app: FastifyPluginAsync<AppOptions> = async (fastify, options) => {
  // set zod-openapi compilers
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

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

  // Run all on close hooks in an order sensitive way
  fastify.addHook("onClose", async () => {
    // close all workers
    await internalEventEmitter.emitAsync("close");
    await fastify.db.destroy();
    await fastify.redis().quit();
  });

  // Start the repl and expose all decorators on the server context in the repl
  if (options.repl) {
    mountServices(Manifest, fastify, { encapsulate: false });
    repl(options.service, fastify);
    return;
  }

  mountServices(Manifest, fastify, { encapsulate: true });
};

export default app;
export { app, options };

/**
 * Register the plugins for the service according to the manifest
 */
function mountServices(
  manifest: typeof Manifest,
  fastify: FastifyInstance,
  { encapsulate }: { encapsulate: boolean },
) {
  void manifest[service].map(([plugin, opts]) =>
    fastify.register(encapsulate ? plugin : fp(plugin), opts ?? {}),
  );
}
