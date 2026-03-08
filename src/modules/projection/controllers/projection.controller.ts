import { Request, Response } from "express";
import { success, failure } from "../../../shared/response";
import { projectionQuerySchema } from "../dtos/projection.schema";
import * as service from "../services/projection.service";

export async function projection(req: Request, res: Response) {
  try {
    const query = projectionQuerySchema.parse(req.query);

    const periods = query.periods ?? 6;

    const data = await service.project(
      periods,
      query.startPeriodId
    );

    return success(res, data);
  } catch (e: any) {
    return failure(res, 400, "BAD REQUEST", e.message);
  }
}