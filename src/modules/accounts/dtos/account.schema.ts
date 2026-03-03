import { z } from "zod";

export const accountTypeEnum = z.enum([
  "DEBIT",
  "CASH",
  "CREDIT_CARD",
  "CHECKING",
  "SAVINGS",
]);

export const createAccountSchema = z.object({
  name: z.string().min(2, "name muy corto"),
  type: accountTypeEnum,
  currency: z.string().length(3).default("CLP"),
  bank: z.string().min(2).optional(),
  last4: z.string().regex(/^\d{4}$/).optional(),
  credit_limit: z.number().int().positive().optional(),
  billing_day: z.number().int().min(1).max(31).optional(),
  due_day: z.number().int().min(1).max(31).optional(),
  active: z.boolean().optional(),
});

export const updateAccountSchema = createAccountSchema.partial();

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;