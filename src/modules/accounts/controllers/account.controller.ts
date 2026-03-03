import { Request, Response } from "express";
import { z } from "zod";
import { createAccountSchema, updateAccountSchema } from "../dtos/account.schema";
import * as service from "../services/account.service";

const idSchema = z.string().uuid();

export async function list(req: Request, res: Response) {
  const data = await service.list();
  res.json(data);
}

export async function getById(req: Request, res: Response) {
  const id = idSchema.parse(req.params.id);
  const account = await service.getById(id);
  if (!account) return res.status(404).json({ message: "Account not found" });
  res.json(account);
}

export async function create(req: Request, res: Response) {
  const input = createAccountSchema.parse(req.body);
  const created = await service.create(input);
  res.status(201).json(created);
}

export async function update(req: Request, res: Response) {
  const id = idSchema.parse(req.params.id);
  const input = updateAccountSchema.parse(req.body);
  const updated = await service.update(id, input);
  if (!updated) return res.status(404).json({ message: "Account not found" });
  res.json(updated);
}

export async function remove(req: Request, res: Response) {
  const id = idSchema.parse(req.params.id);
  const ok = await service.remove(id);
  if (!ok) return res.status(404).json({ message: "Account not found" });
  res.status(204).send();
}