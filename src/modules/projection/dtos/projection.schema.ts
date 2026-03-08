import { z } from "zod";

export const projectionQuerySchema = z.object({
  startPeriodId: z.string().uuid().optional(),
  periods: z.coerce.number().int().min(1).max(24).optional(),
});