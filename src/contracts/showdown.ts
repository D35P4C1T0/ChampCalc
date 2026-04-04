import { z } from "zod";

export const showdownSetSchema = z.object({
  text: z.string(),
});

export type ShowdownSetRequest = z.infer<typeof showdownSetSchema>;
