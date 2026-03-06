import { Request, Response } from "express";
import { createCategorySchema, listCategoriesQuerySchema } from "../dtos/category.schema";
import * as service from "../services/category.service";
import { success } from "../../../shared/response";

export async function list(req: Request, res: Response) {
  const q = listCategoriesQuerySchema.parse(req.query);
  const data = await service.list({ kind: q.kind, active: q.active });
  res.json(data);
}

export async function create(req: Request, res: Response) {
  const input = createCategorySchema.parse(req.body);
  const created = await service.create(input);
  res.status(201).json(created);
}

export async function getById(req: Request, res: Response) {
  const id = req.params.id as string;

  const data = await service.getById(id);

  return success(res, data);
}

export async function update(req: Request, res: Response) {
  const id = req.params.id as string;

  const input = createCategorySchema.partial().parse(req.body);

  const updated = await service.update(id, input);

  return success(res, updated, 200, "Categoría actualizada");
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id as string;

  await service.remove(id);

  return success(res, null, 200, "Categoría eliminada");
}