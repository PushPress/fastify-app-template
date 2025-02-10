import { FeatureFallbacks } from "@pushpress/fastify-feature-flags";
import { AppFeatures } from "../../types/app-features";

export type Environments = "development" | "production" | "test";

export const fallbacks: FeatureFallbacks<Environments, AppFeatures> = {
  environments: {
    production: {},
    development: {},
    test: {},
  },
};
