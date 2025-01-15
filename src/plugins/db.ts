import fp from "fastify-plugin";
import fs from "fs";
import path from "path";
import { db, migrator } from "../database";

/**
 * Connect to a Postgres database with kysely
 */
export default fp(
  (fastify, _, done) => {
    // Migrate the database to the latest version
    fastify.addHook("onReady", async () => {
      if (fastify.config.MIGRATE_ON_START) {
        const migrationDir = path.join(__dirname, "../migrations");

        if (!fs.existsSync(migrationDir)) {
          fs.mkdirSync(migrationDir);
        }

        const { error, results } = await migrator.migrateToLatest();

        results?.forEach((it) => {
          if (it.status === "Success") {
            fastify.log.info(
              `migration "${it.migrationName}" was executed successfully`,
            );
          } else if (it.status === "Error") {
            fastify.log.error(
              `failed to execute migration "${it.migrationName}"`,
            );
          }
        });

        if (error) {
          fastify.log.error({ error }, "failed to run `migrateToLatest`");
        }
      }
    });
    fastify.decorate("db", db);

    done();
  },
  { name: "db", dependencies: ["env"] },
);

declare module "fastify" {
  interface FastifyInstance {
    db: typeof db;
  }
}
