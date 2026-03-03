import { Request, Response } from "express";
import { createRecurringSchema } from "../dtos/recurring.schema";
import * as service from "../services/recurring.service";
import { success } from "../../../shared/response";

export async function create(req: Request, res: Response) {
  const input = createRecurringSchema.parse(req.body);
  const created = await service.create(input);
  return success(res, created, 201, "Compromiso recurrente creado correctamente");
}

export async function list(req: Request, res: Response) {
  const data = await service.list();
  return success(res, data);
}