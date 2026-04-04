import Fastify, { type FastifyInstance } from "fastify";
import { ZodError } from "zod";

import { registerApiDocs } from "./http/docs.js";
import { registerRoutes } from "./http/routes.js";
import {
  API_CONTENT_SECURITY_POLICY,
  COMMON_SECURITY_HEADERS,
} from "./http/security.js";
import {
  fastifyValidationErrorBody,
  validationErrorBody,
} from "./http/validation.js";

export function configureApp(app: FastifyInstance): FastifyInstance {
  app.addHook("onSend", async (_request, reply, payload) => {
    for (const [key, value] of Object.entries(COMMON_SECURITY_HEADERS)) {
      reply.header(key, value);
    }

    const requestPath = _request.url.split("?")[0] ?? _request.url;
    if (
      reply.getHeader("Content-Security-Policy") === undefined &&
      !requestPath.startsWith("/documentation")
    ) {
      reply.header("Content-Security-Policy", API_CONTENT_SECURITY_POLICY);
    }

    return payload;
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      reply.status(400).send(validationErrorBody(error));
      return;
    }

    if (Array.isArray((error as { validation?: unknown }).validation)) {
      reply.status(400).send(
        fastifyValidationErrorBody(
          (error as { validation: Array<Record<string, unknown>> }).validation,
        ),
      );
      return;
    }

    app.log.error(error);
    reply.status(500).send({
      error: "Internal server error",
    });
  });

  app.register(async (scopedApp) => {
    await registerApiDocs(scopedApp);
    registerRoutes(scopedApp);
  });

  return app;
}

export function buildApp(): FastifyInstance {
  return configureApp(Fastify({
    logger: true,
  }));
}
