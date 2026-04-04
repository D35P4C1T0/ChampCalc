import { convertRequestSchema } from "../src/contracts/convert.js";
import { convertEvToChampions } from "../src/domain/ev-master.js";
import {
  handleVercelError,
  jsonResponse,
  readJsonBody,
} from "../src/vercel/responses.js";

export const runtime = "nodejs";

export function GET(request: Request): Response {
  try {
    const url = new URL(request.url);
    const input = convertRequestSchema.parse(
      Object.fromEntries(url.searchParams.entries()),
    );

    return jsonResponse({
      input,
      result: convertEvToChampions(input),
    });
  } catch (error) {
    return handleVercelError(error);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const input = convertRequestSchema.parse(await readJsonBody(request));

    return jsonResponse({
      input,
      result: convertEvToChampions(input),
    });
  } catch (error) {
    return handleVercelError(error);
  }
}
