import Fastify from "fastify";

import { configureApp } from "./fastify-app.js";

const app = configureApp(Fastify({
  logger: true,
}));

void app.listen({
  port: 3000,
});
