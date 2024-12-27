<div align="center">
    <h1>Fastify App Template</h1>
</div>

<br /><br />

## Table of Contents

- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [OpenAPI Docs](#openapi-docs)
- [Database Migrations](#database-migrations)
- [Monitoring](#monitoring)
- [Learn More](#learn-more)

## Getting Started

Clone the repos and run `pnpm install` to install the dependencies.

```bash
# clone the repo
git clone https://github.com/Pushpress/fastify-app-template.git
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

## OpenAPI Docs

A Swagger UI is generated automatically and is available at [http://localhost:3000/docs](http://localhost:3000/docs)

## Database Migrations

Kysely offers a type safe way to automate database migrations with [kysely-ctl](https://github.com/kysely-org/kysely-ctl). Use the `pnpm migrate <command>` to manage migrations, run `pnpm migrate --help` for more information.

NOTE: This creates an "onReady" hook that will run the migrations when the server starts to automatically apply migrations. To disable this feature set MIGRATE_ON_START to false in the .env file

## Monitoring

Apps should use datadog to monitor their performance and health.

### Logs

Apps should stream logs to stdout and stderr so datadog can collect them.

### custom metrics

Configure custom metrics in datadog.ts so you can increment them in your app without configuring a tracer or worrying about type safety.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).
