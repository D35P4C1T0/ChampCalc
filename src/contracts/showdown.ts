import { z } from "zod";
import {
  MAX_SHOWDOWN_TEXT_LENGTH,
  sanitizeShowdownTextInput,
} from "../domain/input-sanitize.js";

export const showdownSetSchema = z.object({
  text: z.preprocess(
    sanitizeShowdownTextInput,
    z.string()
      .min(1, { message: "Showdown set text is required" })
      .max(MAX_SHOWDOWN_TEXT_LENGTH, {
        message: `Showdown set text cannot exceed ${MAX_SHOWDOWN_TEXT_LENGTH} characters`,
      }),
  ),
});

export type ShowdownSetRequest = z.infer<typeof showdownSetSchema>;
