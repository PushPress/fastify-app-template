import fp from "fastify-plugin";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastifyZodOpenApiPlugin } from "fastify-zod-openapi";

/**
 * configure openapi docs
 */
export default fp(
  (fastify, _, done) => {
    fastify.register(fastifyZodOpenApiPlugin, {
      components: {
        securitySchemes: {
          // NOTE: uncomment to enable bearer auth
          // bearer: {
          //   scheme: "bearer",
          //   type: "http",
          //   bearerFormat: "JWT",
          //   description:
          //     "JWT Bearer Token primarily used to provision access to the platform",
          // },
        },
      },
    });
    fastify.register(fastifySwagger);
    fastify.register(fastifySwaggerUi, {
      routePrefix: "/docs",
    });
    done();
  },
  { name: "openapi" },
);
