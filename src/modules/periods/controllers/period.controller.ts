import { Request, Response } from "express";
import { createPeriodSchema } from "../dtos/period.schema";
import * as service from "../services/period.service";

export async function create(req: Request, res: Response) {
  const input = createPeriodSchema.parse(req.body);
  const created = await service.create(input);
  res.status(201).json(created);
}

export async function list(req: Request, res: Response) {
  const data = await service.list();
  res.json(data);
}