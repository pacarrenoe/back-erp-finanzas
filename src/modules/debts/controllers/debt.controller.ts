import { Request, Response } from "express";
import { success, failure } from "../../../shared/response";
import { createDebtSchema, createScheduleSchema } from "../dtos/debt.schema";
import * as service from "../services/debt.service";

export async function create(req: Request, res: Response) {
  try {
    const input = createDebtSchema.parse(req.body);
    const debt = await service.createDebt(input);
    return success(res, debt, 201);
  } catch (e: any) {
    return failure(res, 400, "BAD REQUEST", e.message);
  }
}

export async function schedule(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const input = createScheduleSchema.parse(req.body);

    await service.createSchedule(
      id,
      input.installments,
      input.first_due_date,
      Number(req.body.total)
    );

    return success(res, true);
  } catch (e: any) {
    return failure(res, 400, "BAD REQUEST", e.message);
  }
}

export async function list(_req: Request, res: Response) {
  const debts = await service.getAll();
  return success(res, debts);
}

export async function markPaid(req: Request, res: Response) {
  const id = req.params.id as string;
  const updated = await service.markPaid(id);
  return success(res, updated);
}