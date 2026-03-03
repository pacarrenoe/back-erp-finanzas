import { z } from "zod";

export const trendQuerySchema = z.object({
  n: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 6))
    .refine((v) => Number.isFinite(v) && v >= 1 && v <= 24, "n inválido (1..24)"),
});