import { Request, Response } from "express";
import { z } from "zod";
import { success, failure } from "../../../shared/response";
import * as service from "../services/dashboard.service";
import { trendQuerySchema } from "../dtos/dashboard.schema"; // opcional

const idSchema = z.string().uuid();

export async function current(_req: Request, res: Response) {
  const data = await service.getCurrentDashboard();
  if (!data) return failure(res, 404, "NOT FOUND", "No hay períodos creados aún");
  return success(res, data);
}

export async function byPeriod(req: Request, res: Response) {
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return failure(res, 412, "PRECONDITION FAILED", "period id inválido (UUID requerido)");
  }

  const data = await service.getDashboardByPeriod(parsed.data);
  if (!data) return failure(res, 404, "NOT FOUND", "Período no encontrado");

  return success(res, data);
}

export async function trend(req: Request, res: Response) {
  // si NO quieres DTO, comenta estas 2 líneas y usa el parse simple que tenías
  const q = trendQuerySchema.parse(req.query);
  const data = await service.getTrend(q.n);

  return success(res, data);
}