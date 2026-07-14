import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt.js";
import { UnauthorizedError, ForbiddenError } from "../lib/errors.js";

export interface AdminRequest extends Request {
  adminId: number;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new UnauthorizedError("Missing token");
    const token = header.slice(7);
    const payload = verifyToken(token);
    if (payload.role !== "admin") throw new ForbiddenError("Admin access required");
    (req as AdminRequest).adminId = payload.sub;
    next();
  } catch (err) {
    next(err instanceof UnauthorizedError || err instanceof ForbiddenError ? err : new UnauthorizedError("Invalid token"));
  }
}
