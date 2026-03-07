import { z } from "zod";

export const createPurchaseSchema = z.object({

  card_account_id: z.string().uuid(),

  total_amount: z.number().int().positive(),

  installments: z.number().int().min(1).max(48),

  first_installment_date: z.string(),

  description: z.string().optional()

});

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;