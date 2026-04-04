import { randomBytes } from "node:crypto";

import type { FastifyInstance, FastifyRequest } from "fastify";

import { convertRequestSchema } from "../contracts/convert.js";
import { showdownSetSchema } from "../contracts/showdown.js";
import { convertEvToChampions } from "../domain/ev-master.js";
import { parseShowdownEvs } from "../domain/showdown-parser.js";
import { buildHtmlContentSecurityPolicy } from "./security.js";
import { renderHomePage } from "../ui/home-page.js";

export function registerRoutes(app: FastifyInstance): void {
  app.get("/health", async () => ({
    status: "ok",
  }));

  app.get("/", async (request, reply) => {
    const scriptNonce = randomBytes(16).toString("base64");

    reply.header(
      "Content-Security-Policy",
      buildHtmlContentSecurityPolicy(scriptNonce),
    );
    reply.type("text/html; charset=utf-8");
    return renderHomePage({
      pageUrl: readPageUrl(request),
      scriptNonce,
    });
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

function readPageUrl(request: FastifyRequest): string {
  const forwardedProto = request.headers["x-forwarded-proto"];
  const forwardedHost = request.headers["x-forwarded-host"];
  const protocol = Array.isArray(forwardedProto)
    ? forwardedProto[0]
    : forwardedProto ?? request.protocol;
  const host = Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost ?? request.headers.host ?? request.hostname;

  return normalizePageUrl(`${protocol}://${host}${request.url}`);
}

function normalizePageUrl(value: string): string {
  const url = new URL(value);

  url.search = "";
  url.hash = "";

  return url.toString();
}
