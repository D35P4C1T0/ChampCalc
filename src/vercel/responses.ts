import { ZodError } from "zod";

import { createSecurityHeaders } from "../http/security.js";
import { validationErrorBody } from "../http/validation.js";

export function jsonResponse(
  body: unknown,
  options: {
    headers?: Record<string, string>;
    status?: number;
  } = {},
): Response {
  return new Response(JSON.stringify(body), {
    status: options.status ?? 200,
    headers: createSecurityHeaders({
      "Content-Type": "application/json; charset=utf-8",
      ...options.headers,
    }),
  });
}

export function htmlResponse(
  body: string,
  options: {
    headers?: Record<string, string>;
    status?: number;
  } = {},
): Response {
  return new Response(body, {
    status: options.status ?? 200,
    headers: createSecurityHeaders({
      "Content-Type": "text/html; charset=utf-8",
      ...options.headers,
    }),
  });
}

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

export function handleVercelError(error: unknown): Response {
  if (error instanceof ZodError) {
    return jsonResponse(validationErrorBody(error), {
      status: 400,
    });
  }

  console.error(error);

  return jsonResponse(
    {
      error: "Internal server error",
    },
    {
      status: 500,
    },
  );
}
