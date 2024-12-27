import fp from "fastify-plugin";
import sensible, { FastifySensibleOptions } from "@fastify/sensible";

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp<FastifySensibleOptions>(
  (fastify, _, done) => {
    fastify.register(sensible);
    done();
  },
  { name: "sensible" },
);
