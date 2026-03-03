import { z } from "zod";

export const createDebtSchema = z.object({
  direction: z.enum(["I_OWE", "OWE_ME"]),
  counterparty_name: z.string().min(2),
  description: z.string().optional(),
  principal_amount: z.number().positive(),
});

export const createScheduleSchema = z.object({
  installments: z.number().min(1),
  first_due_date: z.string(),
});