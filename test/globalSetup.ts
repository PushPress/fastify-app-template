/**
 * This file is used to setup the environment variables for the test environment.
 */
export default function globalSetup() {
  process.env.NODE_ENV = "test";
  process.env.SERVICE = "monolith";
  process.env.FASTIFY_LOG_LEVEL = "FATAL";
  process.env.TZ = "UTC";

  process.env.DB_HOST = "localhost";
  process.env.DB_PORT = "5432";
  process.env.DB_USER = "postgres";
  process.env.DB_PASSWORD = "postgres";
  process.env.DB_NAME = "template";

  process.env.REDIS_HOST = "localhost";
  process.env.REDIS_PORT = "6379";
  process.env.REDIS_USERNAME = "";
  process.env.REDIS_PASSWORD = "";
  process.env.REDIS_CLUSTER = "false";
}
