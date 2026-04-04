import { z } from "zod";

import {
  MAX_EV,
  MAX_TOTAL_EVS,
  MIN_EV,
  sumEvInput,
} from "../domain/ev-master.js";

const evValueSchema = z.coerce.number().int()
  .min(MIN_EV, { message: `EVs cannot be below ${MIN_EV}` })
  .max(MAX_EV, { message: `EVs cannot exceed ${MAX_EV}` })
  .default(MIN_EV);

export const convertRequestSchema = z.object({
  hp: evValueSchema,
  attack: evValueSchema,
  defense: evValueSchema,
  specialAttack: evValueSchema,
  specialDefense: evValueSchema,
  speed: evValueSchema,
}).refine((input) => sumEvInput(input) <= MAX_TOTAL_EVS, {
  message: `Total EVs cannot exceed ${MAX_TOTAL_EVS}`,
});

export type ConvertRequest = z.infer<typeof convertRequestSchema>;
