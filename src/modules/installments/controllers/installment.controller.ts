import { Request, Response } from "express";
import { z } from "zod";
import { listInstallmentsQuerySchema, markPaidSchema } from "../dtos/installment.schema";
import * as service from "../services/installment.service";
import { success, failure } from "../../../shared/response";

const idSchema = z.string().uuid();

export async function list(req: Request, res: Response) {
  const q = listInstallmentsQuerySchema.parse(req.query);
  const data = await service.list({ periodId: q.periodId, status: q.status });
  return success(res, data);
}

export async function markPaid(req: Request, res: Response) {
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return failure(res, 412, "PRECONDITION FAILED", "UUID inválido");
  }
  const body = markPaidSchema.parse(req.body ?? {});
  const updated = await service.markPaid(parsed.data, body.paid_transaction_id);
  if (!updated) return failure(res, 404, "NOT FOUND", "Cuota no encontrada");
  return success(res, updated, 200, "Cuota marcada como pagada");
}