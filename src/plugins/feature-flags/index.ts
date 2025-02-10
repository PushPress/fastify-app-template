import fp from "fastify-plugin";

import {
  createGrowthBookClient,
  FeatureFlagClient,
} from "@pushpress/fastify-feature-flags";
import { AppFeatures } from "../../types/app-features";
import { Environments, fallbacks } from "./fallbacks";
import { Config } from "../env";

interface FeatureFlagPluginOpts {
  overrideEnv?: Config["NODE_ENV"];
}

export default fp(
  async function (fastify, opts: FeatureFlagPluginOpts) {
    const environment = opts.overrideEnv ?? fastify.config.NODE_ENV;
    const clientKey = fastify.config.GROWTHBOOK_CLIENT_KEY;
    const apiHost = fastify.config.GROWTHBOOK_API_HOST;

    const client = await createGrowthBookClient<
      Environments,
      AppFeatures,
      keyof AppFeatures
    >(fastify.log.child({ plugin: "feature-flags" }), {
      clientKey,
      apiHost,
      environment,
      initWaitTimeoutMs: 5000 /* init can block for up to 5 seconds */,
      fallbacks,
    });

    fastify.decorate("featureFlags", client);
  },
  { name: "feature-flags", dependencies: ["env"] },
);

declare module "fastify" {
  interface FastifyInstance {
    featureFlags: FeatureFlagClient<AppFeatures, keyof AppFeatures>;
  }
}
