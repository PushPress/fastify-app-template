import cors from "@fastify/cors";
import fp from "fastify-plugin";

export default fp(
  (fastify, _, done) => {
    // NOTE: specify origins for your app here
    fastify.log.warn("All origins are allowed! set CORS to your needs!");
    fastify.register(cors, {
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: "*",
      credentials: true,
    });
    done();
  },
  { name: "cors", dependencies: ["env"] },
);
