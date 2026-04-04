import { buildApp } from "./fastify-app.js";

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = "0.0.0.0";

async function startServer(): Promise<void> {
  const port = parsePort(process.env.PORT);
  const host = process.env.HOST ?? DEFAULT_HOST;
  const app = buildApp();

  try {
    await app.listen({ host, port });
  } catch (error) {
    app.log.error(error);
    process.exitCode = 1;
  }
}

function parsePort(value: string | undefined): number {
  if (!value) {
    return DEFAULT_PORT;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return DEFAULT_PORT;
  }

  return parsed;
}

await startServer();
