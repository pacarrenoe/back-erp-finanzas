import { z } from "zod";

export const directionEnum = z.enum(["IN", "OUT"]);
export const paymentMethodEnum = z.enum(["CASH", "DEBIT", "CREDIT", "TRANSFER"]);

export const createTransactionSchema = z.object({
  date: z.string(),
  description: z.string().optional(),
  amount: z.number().int().positive(),
  direction: directionEnum,
  account_id: z.string().uuid(),
  category_id: z.string().uuid(),
  payment_method: paymentMethodEnum,
  merchant: z.string().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;