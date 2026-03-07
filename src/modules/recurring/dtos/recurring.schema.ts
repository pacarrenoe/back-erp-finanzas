import { z } from "zod";

export const frequencyEnum = z.enum([
  "MONTHLY",
  "WEEKLY",
  "YEARLY"
]);

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


export const updateRecurringSchema = z.object({

  name: z.string().optional(),

  amount: z.number().int().positive().optional(),

  category_id: z.string().uuid().optional(),

  account_id: z.string().uuid().optional(),

  frequency: frequencyEnum.optional(),

  start_date: z.string().optional(),

  end_date: z.string().optional(),

  active: z.boolean().optional()

});