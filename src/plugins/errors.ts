import fp from "fastify-plugin";
import {
  ResponseSerializationError,
  RequestValidationError,
} from "fastify-zod-openapi";
import { fromError } from "zod-validation-error";

/**
 * Root Error handler
 */
export default fp(
  (fastify, _opts, done) => {
    fastify.setErrorHandler((error, _req, res) => {
      // Process Zod validation errors on the request
      if (error instanceof RequestValidationError) {
        return res
          .status(500)
          .send({ message: fromError(error.cause).toString() });
      }
      // Process Zod validation errors on the response
      if (error instanceof ResponseSerializationError) {
        return res
          .status(500)
          .send({ message: fromError(error.cause).toString() });
      }

      fastify.log.error(error, "Internal Server Error");
      return res.status(500).send("System Error – Please try again later");
    });
    done();
  },
  { name: "errors" },
);
