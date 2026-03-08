import { Request, Response } from "express";
import { success, failure } from "../../../shared/response";
import {
  createBudgetRuleSchema,
  updateBudgetRuleSchema,
  budgetListQuerySchema,
} from "../dtos/budget.schema";
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

export async function list(req: Request, res: Response) {
  try {
    const query = budgetListQuerySchema.parse(req.query);

    if (query.periodId) {
      const data = await service.getBudget(query.periodId);
      return success(res, data);
    }

    const rules = await service.getAll(query.active);
    return success(res, rules);
  } catch (e: any) {
    return failure(res, 400, "BAD REQUEST", e.message);
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const rule = await service.getOne(req.params.id);
    return success(res, rule);
  } catch (e: any) {
    return failure(res, 404, "NOT FOUND", e.message);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const input = updateBudgetRuleSchema.parse(req.body);
    const id = req.params.id as string;
    const rule = await service.update(id, input);
    return success(res, rule);
  } catch (e: any) {
    return failure(res, 400, "BAD REQUEST", e.message);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const rule = await service.remove(id);
    return success(res, rule);
  } catch (e: any) {
    return failure(res, 404, "NOT FOUND", e.message);
  }
}