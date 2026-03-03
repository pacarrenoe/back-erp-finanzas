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