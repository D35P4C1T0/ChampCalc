import { randomBytes } from "node:crypto";

import type { FastifyInstance, FastifyRequest } from "fastify";

import { convertRequestSchema } from "../contracts/convert.js";
import { showdownSetSchema } from "../contracts/showdown.js";
import {
  MAX_EV,
  MAX_TOTAL_CHAMPIONS,
  MIN_EV,
  convertEvToChampions,
} from "../domain/ev-master.js";
import {
  parseShowdownEvs,
  rewriteShowdownEvsLine,
} from "../domain/showdown-parser.js";
import { renderHomePage } from "../ui/home-page.js";
import { buildHtmlContentSecurityPolicy } from "./security.js";

const evValueSchema = {
  type: "integer",
  minimum: MIN_EV,
  maximum: MAX_EV,
  default: MIN_EV,
} as const;

const evInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hp: { ...evValueSchema, description: "Legacy HP EVs." },
    attack: { ...evValueSchema, description: "Legacy Attack EVs." },
    defense: { ...evValueSchema, description: "Legacy Defense EVs." },
    specialAttack: { ...evValueSchema, description: "Legacy Special Attack EVs." },
    specialDefense: { ...evValueSchema, description: "Legacy Special Defense EVs." },
    speed: { ...evValueSchema, description: "Legacy Speed EVs." },
  },
} as const;

const resolvedEvInputSchema = {
  ...evInputSchema,
  required: ["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"],
} as const;

const conversionResultSchema = {
  type: "object",
  additionalProperties: false,
  required: ["hp", "attack", "defense", "specialAttack", "specialDefense", "speed", "total", "maxTotal", "isOverCap"],
  properties: {
    hp: { type: "integer", description: "Champions HP points." },
    attack: { type: "integer", description: "Champions Attack points." },
    defense: { type: "integer", description: "Champions Defense points." },
    specialAttack: { type: "integer", description: "Champions Special Attack points." },
    specialDefense: { type: "integer", description: "Champions Special Defense points." },
    speed: { type: "integer", description: "Champions Speed points." },
    total: {
      type: "integer",
      description: "Total Champions points across all stats before enforcing the 66-point cap.",
    },
    maxTotal: {
      type: "integer",
      const: MAX_TOTAL_CHAMPIONS,
      description: "Maximum Champions point budget.",
    },
    isOverCap: {
      type: "boolean",
      description: "Whether the converted set would exceed the Champions cap.",
    },
  },
} as const;

const validationErrorSchema = {
  type: "object",
  additionalProperties: false,
  required: ["error", "details"],
  properties: {
    error: { type: "string", example: "Invalid request payload" },
    details: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["field", "message"],
        properties: {
          field: { type: "string", example: "hp" },
          message: { type: "string", example: `EVs cannot exceed ${MAX_EV}` },
        },
      },
    },
  },
} as const;

const convertResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["input", "result"],
  properties: {
    input: resolvedEvInputSchema,
    result: conversionResultSchema,
  },
} as const;

const showdownRequestSchema = {
  type: "object",
  additionalProperties: false,
  required: ["text"],
  properties: {
    text: {
      type: "string",
      description: "Full Pokemon Showdown set text, including the EVs line to convert.",
    },
  },
} as const;

const showdownRewriteResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["evs", "found", "result", "championsText"],
  properties: {
    evs: {
      ...resolvedEvInputSchema,
      nullable: true,
      description: "Original EVs parsed from the pasted Showdown set.",
    },
    found: {
      type: "boolean",
      description: "Whether an EVs line was detected in the pasted Showdown content.",
    },
    result: {
      ...conversionResultSchema,
      nullable: true,
      description: "Converted Champions points for the parsed set.",
    },
    championsText: {
      type: "string",
      nullable: true,
      description: "Original Showdown text with its EVs line rewritten to Champions-format values.",
    },
  },
} as const;

export function registerRoutes(app: FastifyInstance): void {
  // Health endpoint for uptime checks and deployment probes.
  app.get("/health", {
    schema: {
      tags: ["system"],
      summary: "Health check",
      description: "Returns a simple OK payload so hosting platforms can verify the service is up.",
      response: {
        200: {
          type: "object",
          additionalProperties: false,
          required: ["status"],
          properties: {
            status: { type: "string", example: "ok" },
          },
        },
      },
    },
  }, async () => ({
    status: "ok",
  }));

  app.get("/", {
    schema: {
      hide: true,
    },
  }, async (request, reply) => {
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

  // Convert a stat spread supplied as query parameters.
  app.get("/api/convert", {
    schema: {
      tags: ["conversion"],
      summary: "Convert legacy EVs to canonical Champions points",
      description:
        "Accepts legacy EV values as query parameters and returns the canonical per-stat Champions point buckets plus over-cap metadata.",
      querystring: evInputSchema,
      response: {
        200: convertResponseSchema,
        400: validationErrorSchema,
      },
    },
  }, async (request) => {
    const input = convertRequestSchema.parse(request.query);

    return {
      input,
      result: convertEvToChampions(input),
    };
  });

  // Convert a stat spread supplied as JSON.
  app.post("/api/convert", {
    schema: {
      tags: ["conversion"],
      summary: "Convert EV payload to canonical Champions points",
      description:
        "Accepts a JSON EV payload and returns the canonical per-stat Champions point buckets with total-point and over-cap metadata.",
      body: evInputSchema,
      response: {
        200: convertResponseSchema,
        400: validationErrorSchema,
      },
    },
  }, async (request) => {
    const input = convertRequestSchema.parse(request.body);

    return {
      input,
      result: convertEvToChampions(input),
    };
  });

  // Parse a full Showdown set, convert its EVs, and rewrite the set text.
  app.post("/api/parse-showdown", {
    schema: {
      tags: ["conversion"],
      summary: "Rewrite a Showdown set into Champions EVs",
      description:
        "Accepts a full pasted Pokemon Showdown set, extracts its EV line, converts it into canonical Champions point buckets, and returns the rewritten set text.",
      body: showdownRequestSchema,
      response: {
        200: showdownRewriteResponseSchema,
        400: validationErrorSchema,
      },
    },
  }, async (request) => {
    const { text } = showdownSetSchema.parse(request.body);
    const evs = parseShowdownEvs(text);
    const result = evs ? convertEvToChampions(evs) : null;
    const championsText = result
      ? rewriteShowdownEvsLine(text, {
          hp: result.hp,
          attack: result.attack,
          defense: result.defense,
          specialAttack: result.specialAttack,
          specialDefense: result.specialDefense,
          speed: result.speed,
        })
      : null;

    return {
      evs,
      found: evs !== null,
      result,
      championsText,
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
