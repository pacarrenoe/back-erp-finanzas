import { z } from "zod";

export const createPeriodSchema = z.object({
  salary_pay_date: z.string(),
  base_salary_amount: z.number().int().positive(),
  days_worked: z.number().int().optional(),
  pluxee_per_day: z.number().int().optional(),
  notes: z.string().optional(),
});

export type CreatePeriodInput = z.infer<typeof createPeriodSchema>;