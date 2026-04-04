import Fastify, { type FastifyInstance } from "fastify";
import { ZodError } from "zod";

import { registerRoutes } from "./http/routes.js";
import {
  API_CONTENT_SECURITY_POLICY,
  COMMON_SECURITY_HEADERS,
} from "./http/security.js";
import { validationErrorBody } from "./http/validation.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true,
  });

  app.addHook("onSend", async (_request, reply, payload) => {
    for (const [key, value] of Object.entries(COMMON_SECURITY_HEADERS)) {
      reply.header(key, value);
    }

    if (reply.getHeader("Content-Security-Policy") === undefined) {
      reply.header("Content-Security-Policy", API_CONTENT_SECURITY_POLICY);
    }

    return payload;
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      reply.status(400).send(validationErrorBody(error));
      return;
    }

    app.log.error(error);
    reply.status(500).send({
      error: "Internal server error",
    });
  });

  await registerRoutes(app);

  return app;
}
