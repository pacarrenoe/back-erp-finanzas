import { z } from "zod";

export const createBudgetRuleSchema = z.object({
  category_id: z.string().uuid(),
  limit_amount: z.number().positive(),
  alert_threshold_pct: z.number().min(1).max(100).optional(),
});