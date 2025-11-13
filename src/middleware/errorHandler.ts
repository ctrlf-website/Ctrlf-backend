import type { NextFunction, Response, Request } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[ERROR HANDLER] -> ${req.method} ${req.path} ->`, err.message);

  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";

  res.status(status).json({
    status: "error",
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
