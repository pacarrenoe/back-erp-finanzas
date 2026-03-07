import { Request, Response } from "express";
import { createRecurringSchema, updateRecurringSchema } from "../dtos/recurring.schema";
import * as service from "../services/recurring.service";
import { success } from "../../../shared/response";

export async function create(req: Request, res: Response) {

  const input = createRecurringSchema.parse(req.body);

  const created = await service.create(input);

  return success(res, created, 201, "Compromiso recurrente creado");

}

export async function list(_req: Request, res: Response) {

  const data = await service.list();

  return success(res, data);

}

export async function update(
  req: Request<{ id: string }>,
  res: Response
) {

  const input = updateRecurringSchema.parse(req.body);

  const updated = await service.update(req.params.id, input);

  return success(res, updated);

}

export async function toggleActive(
  req: Request<{ id: string }>,
  res: Response
) {

  const updated = await service.toggleActive(req.params.id);

  return success(res, updated);

}

export async function remove(
  req: Request<{ id: string }>,
  res: Response
) {

  await service.remove(req.params.id);

  return success(res, true);

}