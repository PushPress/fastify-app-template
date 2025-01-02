import {
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyPluginOptions,
} from "fastify";
import { z } from "zod";
import Api from "./api";
import Worker from "./worker";
import Web from "./web";

export const Service = z.enum(["api", "web", "worker", "monolith"]);
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
const worker: PluginConfig = [Worker, { prefix: "worker" }];
const web: PluginConfig = [Web];
/**
 * Register Plugins For each service type
 */
const manifest: Manifest = {
  api: [api],
  web: [web, api],
  worker: [worker],
  monolith: [api, worker],
};

export default manifest;
