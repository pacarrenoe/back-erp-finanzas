import { Request, Response } from "express";
import { z } from "zod";
import { success, failure } from "../../../shared/response";
import * as service from "../services/dashboard.service";
import { trendQuerySchema } from "../dtos/dashboard.schema";

const idSchema = z.string().uuid();

export async function current(_req: Request, res: Response) {
  try {
    const data = await service.getCurrentDashboard();

    if (!data) {
      return failure(res, 404, "NOT FOUND", "No hay períodos creados aún");
    }

    return success(res, data);
  } catch (error: any) {
    return failure(
      res,
      500,
      "INTERNAL SERVER ERROR",
      error?.message || "Error obteniendo dashboard actual"
    );
  }
}

export async function byPeriod(req: Request, res: Response) {
  try {
    const parsed = idSchema.safeParse(req.params.id);

    if (!parsed.success) {
      return failure(
        res,
        412,
        "PRECONDITION FAILED",
        "period id inválido (UUID requerido)"
      );
    }

    const data = await service.getDashboardByPeriod(parsed.data);

    if (!data) {
      return failure(res, 404, "NOT FOUND", "Período no encontrado");
    }

    return success(res, data);
  } catch (error: any) {
    return failure(
      res,
      500,
      "INTERNAL SERVER ERROR",
      error?.message || "Error obteniendo dashboard por período"
    );
  }
}

export async function trend(req: Request, res: Response) {
  try {
    const q = trendQuerySchema.parse(req.query);
    const data = await service.getTrend(q.n);

    return success(res, data);
  } catch (error: any) {
    return failure(
      res,
      500,
      "INTERNAL SERVER ERROR",
      error?.message || "Error obteniendo tendencia del dashboard"
    );
  }
}