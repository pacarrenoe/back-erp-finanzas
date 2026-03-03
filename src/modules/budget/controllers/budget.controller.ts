import { Request, Response } from "express";
import { success, failure } from "../../../shared/response";
import { createBudgetRuleSchema } from "../dtos/budget.schema";
import * as service from "../services/budget.service";

export async function create(req: Request, res: Response) {
  try {
    const input = createBudgetRuleSchema.parse(req.body);
    const rule = await service.create(input);
    return success(res, rule, 201);
  } catch (e: any) {
    return failure(res, 400, "BAD REQUEST", e.message);
  }
}

export async function list(_req: Request, res: Response) {
  const rules = await service.getAll();
  return success(res, rules);
}