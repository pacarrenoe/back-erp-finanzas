import { Request, Response } from "express";
import { createCategorySchema, listCategoriesQuerySchema } from "../dtos/category.schema";
import * as service from "../services/category.service";

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