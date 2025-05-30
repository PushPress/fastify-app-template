<div align="center">
    <h1>Fastify App Template</h1>
</div>

<br /><br />

## Table of Contents

- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Services](#services)
- [OpenAPI Documentation](#openapi-docs)
- [React App](#React)
- [REPL](#repl)
- [Database](#database)
- [Database Migrations](#database-migrations)
- [Background Jobs](#background-jobs)
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
# create the local development environment file
cp .env.sample .env
# create the test environment file
cp .env.sample .env.test
```

Install the latest pushpress SDK

```bash
pnpm i @pushpress/pushpress
```

Set up local development dependencies with docker compose

```bash
chmod +x init.sh
docker compose up -d
```

## Available Scripts

In the project directory, you can run:

### `pnpm dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Configure the `FASTIFY_PORT` environment variable to change the port.
Specify a SERVICE environment variable to configure which plugins execute.

### `pnpm dev:web`

Start the vite+react development server at the default port `http://localhost:5173`

### `pnpm start`

For production mode

### `pnpm lint`

Run eslint

### `pnpm test`

Run the test cases.

Note: make sure the runtime dependencies are up first - `docker compose --env-file .env.test -f docker-compose.test.yml up -d`

### `pnpm repl`

Start the server in a repl session. see [REPL](#repl) for more details.

## Services

The `SERVICE` environment variable can be set to `api`, `worker`, or `monolith` to run the app in a specific mode.

- The `/api` folder contains the api service, which should be primarily responsible for handling incoming requests and delegating to other services.
- The `/worker` folder contains the worker service, which should be responsible for handling long running tasks.
- The `/web` folder serves a vite react app at the root route as a static file. By default the web service also registers the API routes but it can be configured to only serve the app in the SPA folder.
- `monolith` runs both the api and worker services in the same process, which is useful for simpler apps that dont need to scale workers or APIs indpendently

# React App

The fastify app template supports Web UIs from simple components to minimize initial complexity and maximize extensibility. Fastify efficiently serves static html through the `@fastify/static` plugin. The template comes pre-built with a single page react app built with [vite](https://vite.dev), but any html file will work.

## OpenAPI Docs

A Swagger UI is generated automatically and is available at [http://localhost:3000/docs](http://localhost:3000/docs)

## REPL

A read-eval-print-loop (REPL) is available for debugging and development. Repls are useful for easily testing functionality without having to write extra code.

The REPL exposes the server instance and all decorators on the server instance, which is different from the production environment, where plugins registered on the different services are encapsulated to maintain better isolation since they are deployed as separate processes.

Use the SERVICE environment variable to switch between the different services or use the `--service` flag to start the repl with a specific service.

## Database

This template comes with a postres database and uses [kysely](https://kysely.dev/) for type safe database access. Kysely is a query builder rather than an ORM, so there is no magic happening under the hood. Its just SQL, but with high quality types.

Included are a few ecosystem tools to make working with a postgres database easier and safer, without reaching for an ORM.

[kysely-codegen](https://github.com/kysely-org/kysely-codegen) is used to generate typescript types from the database schema.
[kysely-ctl](https://github.com/kysely-org/kysely-ctl) is used to manage database migrations.

PgAdmin is included in the local development docker compose file for local database administration at <http://localhost:5050>. Login with username `admin@admin.com` and password `admin`.

# Redis

The fastify template depends on redis for caching and as the BullMQ back end. Redis is available in both local development and testing throught the included compose files. Redis Commander is also available in local development for improved
inspection and debugging at <http://localhost:8081>

## Migrations

Kysely offers a type safe way to automate database migrations with [kysely-ctl](https://github.com/kysely-org/kysely-ctl). Use the `pnpm migrate <command>` to manage migrations, run `pnpm migrate --help` for more information.

NOTE: This creates an "onReady" hook that will run the migrations when the server starts to automatically apply migrations. To disable this feature set MIGRATE_ON_START to false in the .env file

## Background Jobs

Background jobs are handled by [bullmq](https://github.com/taskforcesh/bullmq) and a lightweight wrapper called bullify, that provides a simpler way to build type safe queues, workers and the jobs they process.

Th BullMQ dashboard is available at [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

### Queues

Define a queue and its associated worker and job types in the `queues` folder using the `bullify` function. Then decorate the fastify instance with the queues and workers. When adding a job to a queue the job data and any result type will be type checked, all underlying bullmq APIS and options are exposed with sensible defaults applied.

Some Best Practices:

- Configure a jobId when adding a job to the queue so jobs can remain idempotent
- Be mindful of the retry and job retention strategies, a job needs to be retained long enough for it to be retried and long enough to prevent duplicate jobs from being processed
- Configure concurrency limits on workers, since each worker defaults to processing running 1 job at a time
- When updating any recurring job, ensure that you either update an existing job configuration or delete the previous configuration and create a new one. It's possible to mistakenly create a new recurring (cron) job without
  deleting the old one.
- When unsure about how changing some BullMQ configuration may change its behavior, use redis commander to inspect the BullMQ key path contents. inspect queue metadata etc.

### Workers

Run workers in the `worker` folder using the `.run` method on the worker. This way workers can be conditionally registered when running in a worker service, or when running in a monolith service.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).
