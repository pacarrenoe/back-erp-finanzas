import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { failure } from "../shared/response";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return failure(res, 412, "PRECONDITION FAILED", JSON.stringify(err.issues));
  }

  return failure(res, 500, "INTERNAL SERVER ERROR", err?.message);
}