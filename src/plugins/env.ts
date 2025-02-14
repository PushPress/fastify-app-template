import fp from "fastify-plugin";
import fastifyEnv from "@fastify/env";
import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { Service } from "../manifest";

/** Define your environment variables schema here */
const schema = {
  type: "object",
  required: [
    "NODE_ENV",
    "SERVICE",
    "DB_HOST",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
    "GROWTHBOOK_CLIENT_KEY",
    "GROWTHBOOK_API_HOST",
  ],
  properties: {
    NODE_ENV: {
      type: "string",
      enum: ["development", "production", "test"],
    },
    SERVICE: {
      type: "string",
      enum: Service.options,
    },
    DB_HOST: {
      type: "string",
    },
    DB_USER: {
      type: "string",
    },
    DB_PASSWORD: {
      type: "string",
    },
    DB_NAME: {
      type: "string",
    },
    DB_PORT: {
      type: "number",
      default: 5432,
    },
    MIGRATE_ON_START: {
      type: "boolean",
      default: true,
    },
    REDIS_HOST: {
      type: "string",
      default: "localhost",
    },
    REDIS_PORT: {
      type: "number",
      default: 6379,
    },
    REDIS_USERNAME: {
      type: "string",
    },
    REDIS_PASSWORD: {
      type: "string",
    },
    REDIS_CLUSTER: {
      type: "boolean",
      default: false,
    },
    GROWTHBOOK_API_HOST: {
      type: "string",
      default: "https://cdn.growthbook.io",
    },
    GROWTHBOOK_CLIENT_KEY: {
      type: "string",
    },
    GROWTHBOOK_ENABLE_STREAMING: {
      type: "boolean",
      default: true,
    },
  },
} as const satisfies JSONSchema;

export type Config = FromSchema<typeof schema>;

/**
 * Register environment variables
 */
export default fp(
  (fastify, _, done) => {
    fastify.register(fastifyEnv, {
      confKey: "config",
      schema,
    });
    done();
  },
  { name: "env", dependencies: [] },
);

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
  }
}
