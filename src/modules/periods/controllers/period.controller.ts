import { Request, Response } from "express";
import { createPeriodSchema } from "../dtos/period.schema";
import * as service from "../services/period.service";
import { success, failure } from "../../../shared/response";

export async function create(req: Request, res: Response) {
  const input = createPeriodSchema.parse(req.body);
  const created = await service.create(input);
  return success(res, created, 201, "Período creado correctamente");
}

export async function list(req: Request, res: Response) {
  const data = await service.list();
  return success(res, data);
}