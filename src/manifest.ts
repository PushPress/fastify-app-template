import {
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyPluginOptions,
} from "fastify";
import { z } from "zod";
import Api from "./api";
import Worker from "./worker";

export const Service = z.enum(["api", "worker", "monolith"]);
export type Service = z.infer<typeof Service>;

type FastifyPlugin = FastifyPluginAsync | FastifyPluginCallback;
type PluginConfig = [FastifyPlugin] | [FastifyPlugin, FastifyPluginOptions];

/**
 * Configure which plugins get registered at the level
 */
export type Manifest = Record<Service, PluginConfig[]>;

/**
 * Configure which plugins get registered at the level
 */
const api: PluginConfig = [Api];
const worker: PluginConfig = [Worker];
/**
 * Register Plugins For each service type
 */
const manifest: Manifest = {
  api: [api],
  worker: [worker],
  monolith: [api, worker],
};

export default manifest;
