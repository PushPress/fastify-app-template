import dotenv from "dotenv";
/**
 * This file is used to setup the environment variables for the test environment.
 */
export default function globalSetup() {
  dotenv.config({ path: ".env.test" });
}
