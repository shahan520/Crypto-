import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt.js";
import { UnauthorizedError } from "../lib/errors.js";

export interface AuthRequest extends Request {
  userId: number;
}

export function requireUser(req: Request, res: Response, next: NextFunction): void {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new UnauthorizedError("Missing token");
    const token = header.slice(7);
    const payload = verifyToken(token);
    if (payload.role !== "user") throw new UnauthorizedError("Not a user token");
    (req as AuthRequest).userId = payload.sub;
    next();
  } catch (err) {
    next(err instanceof UnauthorizedError ? err : new UnauthorizedError("Invalid token"));
  }
}
