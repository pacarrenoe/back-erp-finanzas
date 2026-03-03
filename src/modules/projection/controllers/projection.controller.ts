import { Request, Response } from "express";
import { success } from "../../../shared/response";
import * as service from "../services/projection.service";

export async function projection(req: Request, res: Response) {
  const n = Number(req.query.n ?? 6);
  const data = await service.project(Number.isFinite(n) ? n : 6);
  return success(res, data);
}