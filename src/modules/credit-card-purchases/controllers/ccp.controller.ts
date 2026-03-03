import { Request, Response } from "express";
import { createPurchaseSchema } from "../dtos/ccp.schema";
import * as service from "../services/ccp.service";
import { success } from "../../../shared/response";

export async function create(req: Request, res: Response) {
  const input = createPurchaseSchema.parse(req.body);
  const created = await service.create(input);
  return success(res, created, 201, "Compra en cuotas creada correctamente");
}

export async function list(_req: Request, res: Response) {
  const data = await service.list();
  return success(res, data);
}