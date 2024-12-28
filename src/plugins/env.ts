import fp from "fastify-plugin";
import fastifyEnv from "@fastify/env";
import { FromSchema, JSONSchema } from "json-schema-to-ts";

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
  ],
  properties: {
    NODE_ENV: {
      type: "string",
      enum: ["development", "production", "test"],
    },
    SERVICE: {
      type: "string",
      enum: ["api", "worker", "monolith"],
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
