import { z } from "zod";

export const createPurchaseSchema = z.object({
  card_account_id: z.string().uuid(),
  total_amount: z.number().int().positive(),
  installments: z.number().int().min(1).max(48),
  first_installment_date: z.string(), // "YYYY-MM-DD"
  description: z.string().optional(), // opcional para futuro (transaction madre)
});

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;