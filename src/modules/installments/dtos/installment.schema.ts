import { z } from "zod";

export const markPaidSchema = z.object({
  paid_transaction_id: z.string().uuid().optional(), // si quieres linkear pago real
});

export const listInstallmentsQuerySchema = z.object({
  periodId: z.string().uuid().optional(),
  status: z.enum(["PENDING", "PAID"]).optional(),
});

export type MarkPaidInput = z.infer<typeof markPaidSchema>;