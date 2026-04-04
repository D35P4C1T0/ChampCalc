import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";

export async function registerApiDocs(app: FastifyInstance): Promise<void> {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "ChampCalc API",
        description:
          "HTTP API for converting Pokemon Showdown EV spreads into the 66-point Champions format.",
        version: "0.1.0",
      },
      tags: [
        {
          name: "system",
          description: "Operational endpoints for availability and diagnostics.",
        },
        {
          name: "conversion",
          description: "Endpoints for EV conversion and Showdown set rewriting.",
        },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/documentation",
    staticCSP: true,
    transformStaticCSP: (header) => header,
    uiConfig: {
      deepLinking: false,
      docExpansion: "list",
    },
  });
}
