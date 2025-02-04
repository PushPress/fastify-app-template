import {
  FileMigrationProvider,
  Migrator,
  PostgresDialect,
  Kysely,
  CamelCasePlugin,
} from "kysely";
import { Pool } from "pg";
import fs from "fs/promises";
import path from "path";
import { DB } from "./types/db";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl:
      process.env.NODE_ENV === "test" || process.stdout.isTTY
        ? false
        : {
            rejectUnauthorized: true,
            ca: process.env.DB_SSL_CA,
          },
  }),
});
export const db = new Kysely<DB>({ dialect, plugins: [new CamelCasePlugin()] });

export const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.resolve(path.join(__dirname, "migrations")),
  }),
});
