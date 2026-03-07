import { Request, Response } from "express";
import { success, failure } from "../../../shared/response";
import {
  createDebtSchema,
  updateDebtSchema,
  createScheduleSchema,
} from "../dtos/debt.schema";
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

export async function list(_req: Request, res: Response) {
  const debts = await service.getAll();
  return success(res, debts);
}

export async function getById(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    const debt = await service.getById(id);

    if (!debt) {
      return failure(res, 404, "NOT FOUND", "Debt not found");
    }

    return success(res, debt);
  } catch (e: any) {
    return failure(res, 500, "SERVER ERROR", e.message);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    const input = updateDebtSchema.parse(req.body);

    const updated = await service.update(id, input);

    return success(res, updated);
  } catch (e: any) {
    return failure(res, 400, "BAD REQUEST", e.message);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    await service.remove(id);

    return success(res, true);
  } catch (e: any) {
    return failure(res, 500, "SERVER ERROR", e.message);
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
      input.total
    );

    return success(res, true);
  } catch (e: any) {
    return failure(res, 400, "BAD REQUEST", e.message);
  }
}

export async function getSchedule(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    const schedule = await service.getSchedule(id);

    return success(res, schedule);
  } catch (e: any) {
    return failure(res, 500, "SERVER ERROR", e.message);
  }
}

export async function markPaid(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    const updated = await service.markPaid(id);

    return success(res, updated);
  } catch (e: any) {
    return failure(res, 500, "SERVER ERROR", e.message);
  }
}