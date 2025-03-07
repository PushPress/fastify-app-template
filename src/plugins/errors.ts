import { HTTPClientError } from "@pushpress/pushpress/models/errors/httpclienterrors";
import { SDKValidationError } from "@pushpress/pushpress/models/errors/sdkvalidationerror";
import { SDKError } from "@pushpress/pushpress/models/errors/sdkerror";
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

      // fastify error
      if (error.code === "FST_ERR_VALIDATION") {
        return res.status(400).send({ message: error.message });
      }

      // Postgres errors
      // constraint errors
      if (error.code === "P0001") {
        return res.status(400).send({ message: error.message });
      }

      // Process Zod validation errors on the request
      if (error instanceof RequestValidationError) {
        return res
          .status(500)
          .send({ message: fromError(error.cause).message });
      }
      // Process Zod validation errors on the response
      if (error instanceof ResponseSerializationError) {
        return res
          .status(500)
          .send({ message: fromError(error.cause).message });
      }

      // handle sdk errors
      if (error instanceof SDKValidationError) {
        return res.status(500).send({ message: error.pretty() });
      }
      if (error instanceof HTTPClientError) {
        return res
          .status(500)
          .send({ name: error.name, message: error.message });
      }
      if (error instanceof SDKError) {
        return res
          .status(500)
          .send({ name: error.name, message: error.message });
      }

      fastify.log.error(error, "Internal Server Error");
      return res.status(500).send("System Error – Please try again later");
    });
    done();
  },
  { name: "errors" },
);
