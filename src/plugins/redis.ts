import fp from "fastify-plugin";
import redis from "../redis";

declare module "fastify" {
  interface FastifyInstance {
    redis: () => typeof redis;
  }
}

/**
 * Initialize redis
 */
export default fp(
  (fastify, _, done) => {
    fastify.decorate("redis", () => redis);
    done();
  },
  { name: "redis" },
);
