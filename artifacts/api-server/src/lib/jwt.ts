import jwt from "jsonwebtoken";

const SECRET = process.env["SESSION_SECRET"];
if (!SECRET) throw new Error("SESSION_SECRET env var is required");

export interface UserJwtPayload {
  sub: number;       // user id
  role: "user";
  iat?: number;
  exp?: number;
}

export interface AdminJwtPayload {
  sub: number;       // admin id
  role: "admin";
  iat?: number;
  exp?: number;
}

export type JwtPayload = UserJwtPayload | AdminJwtPayload;

export function signUserToken(userId: number): string {
  return jwt.sign({ sub: userId, role: "user" }, SECRET, { expiresIn: "7d" });
}

export function signAdminToken(adminId: number): string {
  return jwt.sign({ sub: adminId, role: "admin" }, SECRET, { expiresIn: "24h" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}
