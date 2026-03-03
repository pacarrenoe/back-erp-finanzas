import { z } from "zod";

export const frequencyEnum = z.enum(["MONTHLY", "WEEKLY", "YEARLY"]);

export const createRecurringSchema = z.object({
  name: z.string().min(2),
  amount: z.number().int().positive(),
  category_id: z.string().uuid(),
  account_id: z.string().uuid(),
  frequency: frequencyEnum,
  start_date: z.string(),
  end_date: z.string().optional(),
  active: z.boolean().optional()
});

export type CreateRecurringInput = z.infer<typeof createRecurringSchema>;