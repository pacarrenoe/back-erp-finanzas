import { Request, Response } from "express";

import {
  registerSchema,
  loginSchema
} from "../dtos/auth.schema";

import * as service from "../services/auth.service";

import {
  success,
  failure
} from "../../../shared/response";

export async function register(
  req: Request,
  res: Response
) {

  try {

    const input = registerSchema.parse(req.body);

    const user = await service.register(
      input.email,
      input.password,
      input.name,
      input.phone
    );

    return success(
      res,
      user,
      201,
      "Usuario registrado correctamente"
    );

  } catch (err: any) {

    return failure(
      res,
      400,
      "BAD REQUEST",
      err.message
    );

  }

}

export async function login(
  req: Request,
  res: Response
) {

  try {

    const input = loginSchema.parse(req.body);

    const result = await service.login(
      input.email,
      input.password
    );

    return success(res, result);

  } catch (err: any) {

    return failure(
      res,
      401,
      "UNAUTHORIZED",
      err.message
    );

  }

}

export async function me(
  req: Request,
  res: Response
) {

  const user = (req as any).user;

  return success(res, user);

}