import { Response } from "express";

export function success(res: Response, data: any, code = 200, message = "Respuesta exitosa") {
  return res.status(code).json({
    status: {
      code: String(code),
      message,
    },
    result: true,
    data,
  });
}

export function failure(
  res: Response,
  code = 500,
  message = "Internal Server Error",
  errorMessage?: string
) {
  return res.status(code).json({
    result: false,
    status: {
      code: String(code),
      message,
    },
    error: {
      message: errorMessage ?? message,
    },
  });
}