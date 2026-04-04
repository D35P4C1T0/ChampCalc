import { randomBytes } from "node:crypto";

import type { FastifyInstance } from "fastify";

import { convertRequestSchema } from "../contracts/convert.js";
import { showdownSetSchema } from "../contracts/showdown.js";
import { convertEvToChampions } from "../domain/ev-master.js";
import { parseShowdownEvs } from "../domain/showdown-parser.js";
import { buildHtmlContentSecurityPolicy } from "./security.js";
import { renderHomePage } from "../ui/home-page.js";

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async () => ({
    status: "ok",
  }));

  app.get("/", async (_request, reply) => {
    const scriptNonce = randomBytes(16).toString("base64");

    reply.header(
      "Content-Security-Policy",
      buildHtmlContentSecurityPolicy(scriptNonce),
    );
    reply.type("text/html; charset=utf-8");
    return renderHomePage({ scriptNonce });
  });

  app.get("/api/convert", async (request) => {
    const input = convertRequestSchema.parse(request.query);

    return {
      input,
      result: convertEvToChampions(input),
    };
  });

  app.post("/api/convert", async (request) => {
    const input = convertRequestSchema.parse(request.body);

    return {
      input,
      result: convertEvToChampions(input),
    };
  });

  app.post("/api/parse-showdown", async (request) => {
    const { text } = showdownSetSchema.parse(request.body);
    const evs = parseShowdownEvs(text);

    return {
      evs,
      found: evs !== null,
    };
  });
}
