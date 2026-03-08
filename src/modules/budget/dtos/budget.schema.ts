import { z } from "zod";

export const createBudgetRuleSchema = z.object({
  category_id: z.string().uuid(),
  limit_amount: z.number().int().positive(),
  alert_threshold_pct: z.number().int().min(1).max(100).optional(),
  period_type: z.enum(["PERIOD"]).optional(),
  active: z.boolean().optional(),
});

export const updateBudgetRuleSchema = z.object({
  category_id: z.string().uuid().optional(),
  limit_amount: z.number().int().positive().optional(),
  alert_threshold_pct: z.number().int().min(1).max(100).optional(),
  period_type: z.enum(["PERIOD"]).optional(),
  active: z.boolean().optional(),
});

export const budgetListQuerySchema = z.object({
  periodId: z.string().uuid().optional(),
  active: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
});