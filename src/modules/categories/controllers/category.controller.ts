import { Request, Response } from "express";
import { createCategorySchema, listCategoriesQuerySchema } from "../dtos/category.schema";
import * as service from "../services/category.service";
import { success } from "../../../shared/response";

export async function list(req: Request, res: Response) {
  const q = listCategoriesQuerySchema.parse(req.query);
  const data = await service.list({ kind: q.kind, active: q.active });
  return success(res, data);
}

export async function create(req: Request, res: Response) {
  const input = createCategorySchema.parse(req.body);
  const created = await service.create(input);
  return success(res, created, 201, "Categoría creada correctamente");
}