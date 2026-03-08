import { z } from "zod"

export const createCategorySchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  kind: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  parent_id: z.string().uuid().nullable().optional()
})

export const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  kind: z.enum(["INCOME", "EXPENSE", "TRANSFER"]).optional(),
  parent_id: z.string().uuid().nullable().optional()
})