import { Request, Response } from "express"
import {
  createCategorySchema,
  updateCategorySchema
} from "../dtos/category.schema"
import * as service from "../services/category.service"
import { success } from "../../../shared/response"

export async function list(_req: Request, res: Response) {
  const data = await service.list()
  return success(res, data)
}

export async function create(req: Request, res: Response) {
  const input = createCategorySchema.parse(req.body)
  const created = await service.create(input)
  return success(res, created, 201, "Categoría creada")
}

export async function update(
  req: Request<{ id: string }>,
  res: Response
) {
  const input = updateCategorySchema.parse(req.body)
  const updated = await service.update(req.params.id, input)
  return success(res, updated)
}

export async function remove(
  req: Request<{ id: string }>,
  res: Response
) {
  await service.remove(req.params.id)
  return success(res, true)
}