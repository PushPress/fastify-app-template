<div align="center">
    <h1>Fastify App Template</h1>
</div>

<br /><br />

## Table of Contents

- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Services](#services)
- [OpenAPI Documentation](#openapi-docs)
- [Database](#database)
- [Database Migrations](#database-migrations)
- [Learn More](#learn-more)

## Getting Started

Clone the repos and run `pnpm install` to install the dependencies.

```bash
# clone the repo into a new project and remove the git history
git clone https://github.com/Pushpress/fastify-app-template.git my-project
rm -rf .git
```

```bash
# use a tool like nvm to ensure you are using the correct node version
nvm use
```

```bash
# install dependencies
pnpm install
```

Use npm-check-updates to bring the dependencies up to date. If there are any breaking changes, please open a PR on the template repo!

```bash
npx npm-check-updates -i
```

Copy the `.env.sample` file to `.env` and update the values to match your environment.

```bash
cp .env.sample .env
```

Install the latest pushpress SDK

```bash
pnpm i @pushpress/pushpress
```

Set up local development dependencies with docker compose

```bash
docker compose up -d
```

## Available Scripts

In the project directory, you can run:

### `pnpm dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Configre the `FASTIFY_PORT` environment variable to change the port.

### `pnpm start`

For production mode

### `pnpm lint`

Run eslint

### `pnpm test`

Run the test cases.

## Services

The `SERVICE` environment variable can be set to `api`, `worker`, or `monolith` to run the app in a specific mode.

- The `/api` folder contains the api service, which should be primarily responsible for handling incoming requests and delegating to other services.
- The `/worker` folder contains the worker service, which should be responsible for handling long running tasks.
- `monolith` runs both the api and worker services in the same process, which is useful for simpler apps that dont need to scale workers or APIs indpendently

## OpenAPI Docs

A Swagger UI is generated automatically and is available at [http://localhost:3000/docs](http://localhost:3000/docs)

## Database

This template comes with a postres database and uses [kysely](https://kysely.dev/) for type safe database access. Kysely is a query builder rather than an ORM, so there is no magic happening under the hood. Its just SQL, but with high quality types.

Included are a few ecosystem tools to make working with a postgres database easier and safer, without reaching for an ORM.

[kysely-codegen](https://github.com/kysely-org/kysely-codegen) is used to generate typescript types from the database schema.
[kysely-ctl](https://github.com/kysely-org/kysely-ctl) is used to manage database migrations.

## Migrations

Kysely offers a type safe way to automate database migrations with [kysely-ctl](https://github.com/kysely-org/kysely-ctl). Use the `pnpm migrate <command>` to manage migrations, run `pnpm migrate --help` for more information.

NOTE: This creates an "onReady" hook that will run the migrations when the server starts to automatically apply migrations. To disable this feature set MIGRATE_ON_START to false in the .env file

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).
