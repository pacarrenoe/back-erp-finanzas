import { z } from "zod";

export const categoryKindEnum = z.enum(["INCOME", "EXPENSE", "TRANSFER"]);

export const createCategorySchema = z.object({
  name: z.string().min(2),
  kind: categoryKindEnum,
  parent_id: z.string().uuid().optional(),
  active: z.boolean().optional(),
});

export const listCategoriesQuerySchema = z.object({
  kind: categoryKindEnum.optional(),
  active: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;