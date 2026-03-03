import { Request, Response } from "express";
import { z } from "zod";
import { createAccountSchema, updateAccountSchema } from "../dtos/account.schema";
import * as service from "../services/account.service";
import { success, failure } from "../../../shared/response";

const idSchema = z.string().uuid();

export async function list(req: Request, res: Response) {
  const data = await service.list();
  return success(res, data);
}

export async function getById(req: Request, res: Response) {
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return failure(res, 412, "PRECONDITION FAILED", "UUID inválido");
  }

  const account = await service.getById(parsed.data);
  if (!account) return failure(res, 404, "NOT FOUND", "Account no encontrada");

  return success(res, account);
}

export async function create(req: Request, res: Response) {
  const input = createAccountSchema.parse(req.body);
  const created = await service.create(input);
  return success(res, created, 201, "Cuenta creada correctamente");
}

export async function update(req: Request, res: Response) {
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return failure(res, 412, "PRECONDITION FAILED", "UUID inválido");
  }

  const input = updateAccountSchema.parse(req.body);
  const updated = await service.update(parsed.data, input);

  if (!updated) return failure(res, 404, "NOT FOUND", "Account no encontrada");

  return success(res, updated, 200, "Cuenta actualizada correctamente");
}

export async function remove(req: Request, res: Response) {
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return failure(res, 412, "PRECONDITION FAILED", "UUID inválido");
  }

  const ok = await service.remove(parsed.data);
  if (!ok) return failure(res, 404, "NOT FOUND", "Account no encontrada");

  return success(res, true, 200, "Cuenta eliminada correctamente");
}