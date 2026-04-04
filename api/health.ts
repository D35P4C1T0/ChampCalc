import { jsonResponse } from "../src/vercel/responses.js";

export const runtime = "nodejs";

export function GET(): Response {
  return jsonResponse({
    status: "ok",
  });
}
