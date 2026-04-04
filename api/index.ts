import { randomBytes } from "node:crypto";

import { buildHtmlContentSecurityPolicy } from "../src/http/security.js";
import { renderHomePage } from "../src/ui/home-page.js";
import { htmlResponse } from "../src/vercel/responses.js";

export const runtime = "nodejs";

export function GET(): Response {
  const scriptNonce = randomBytes(16).toString("base64");

  return htmlResponse(renderHomePage({ scriptNonce }), {
    headers: {
      "Content-Security-Policy": buildHtmlContentSecurityPolicy(scriptNonce),
    },
  });
}
