import { Request, Response } from "express";
import { createTransactionSchema } from "../dtos/transaction.schema";
import * as service from "../services/transaction.service";
import { success } from "../../../shared/response";

export async function create(req: Request, res: Response) {
  const input = createTransactionSchema.parse(req.body);
  const created = await service.create(input);

  return success(res, created, 201, "Transacción creada correctamente");
}

export async function list(req: Request, res: Response) {
  const periodId = req.query.periodId as string | undefined;

  const data = await service.list(periodId);

  return success(res, data);
}

export async function getById(req: Request, res: Response) {

  const id = req.params.id as string;

  const data = await service.getById(id);

  return success(res, data);
}

export async function update(req: Request, res: Response) {

  const id = req.params.id as string;

  const input = createTransactionSchema.partial().parse(req.body);

  const updated = await service.update(id, input);

  return success(res, updated, 200, "Transacción actualizada");
}

export async function remove(req: Request, res: Response) {

  const id = req.params.id as string;

  await service.remove(id);

  return success(res, null, 200, "Transacción eliminada");
}