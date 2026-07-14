import type { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/errors.js";
import { logger } from "../lib/logger.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof SyntaxError) {
    res.status(400).json({ message: "Invalid JSON" });
    return;
  }

  logger.error({ err }, "Unhandled error");
  res.status(500).json({ message: "Internal server error" });
}
