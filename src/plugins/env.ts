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
  },
} as const satisfies JSONSchema;

/**
 * Register environment variables
 */
export default fp(
  (fastify, _, done) => {
    fastify.register(fastifyEnv, {
      schema,
    });
    done();
  },
  { name: "env" },
);

declare module "fastify" {
  interface FastifyInstance {
    config: FromSchema<typeof schema>;
  }
}
