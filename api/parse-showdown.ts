import { showdownSetSchema } from "../src/contracts/showdown.js";
import { parseShowdownEvs } from "../src/domain/showdown-parser.js";
import {
  handleVercelError,
  jsonResponse,
  readJsonBody,
} from "../src/vercel/responses.js";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  try {
    const { text } = showdownSetSchema.parse(await readJsonBody(request));
    const evs = parseShowdownEvs(text);

    return jsonResponse({
      evs,
      found: evs !== null,
    });
  } catch (error) {
    return handleVercelError(error);
  }
}
