import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { failure } from "../shared/response";
import * as authService from "../modules/auth/services/auth.service";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return failure(res, 401, "UNAUTHORIZED", "Token requerido");

  const token = authHeader.split(" ")[1];

  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const user = await authService.getUserById(payload.userId);
    if (!user)
      return failure(res, 401, "UNAUTHORIZED", "Usuario inválido");

    (req as any).user = user;
    next();
  } catch {
    return failure(res, 401, "UNAUTHORIZED", "Token inválido");
  }
}