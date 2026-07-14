import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { requireUser, type AuthRequest } from "../middlewares/auth.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../lib/errors.js";
import type { Request, Response, NextFunction } from "express";

const router = Router();
router.use(requireUser);

// ── GET /api/user/balance ─────────────────────────────────────────────────────
router.get("/balance", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, (req as AuthRequest).userId) });
    if (!user) throw new NotFoundError();
    res.json({
      balanceUsdt:       user.balanceUsdt,
      frozenUsdt:        user.frozenUsdt,
      canWithdraw:       user.canWithdraw,
      sessionApproved:   user.sessionApproved,
      sessionOrderCount: user.sessionOrderCount,
      sessionRound:      user.sessionRound,
      isVip:             user.isVip,
    });
  } catch (err) { next(err); }
});

// ── PUT /api/user/fund-password ───────────────────────────────────────────────
const fundPwdSchema = z.object({
  password:    z.string().min(6).max(100),
  oldPassword: z.string().optional(),
});

router.put("/fund-password", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = fundPwdSchema.parse(req.body);
    const user = await db.query.users.findFirst({ where: eq(users.id, (req as AuthRequest).userId) });
    if (!user) throw new NotFoundError();

    // If fund password already set, require old password
    if (user.fundPasswordHash) {
      if (!body.oldPassword) throw new BadRequestError("Old fund password required");
      const ok = await bcrypt.compare(body.oldPassword, user.fundPasswordHash);
      if (!ok) throw new UnauthorizedError("Incorrect old fund password");
    }

    const hash = await bcrypt.hash(body.password, 12);
    await db.update(users)
      .set({ fundPasswordHash: hash, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    res.json({ message: "Fund password updated" });
  } catch (err) { next(err); }
});

// ── PUT /api/user/avatar ──────────────────────────────────────────────────────
const avatarSchema = z.object({ avatarUrl: z.string().url().max(2000).nullable() });

router.put("/avatar", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatarUrl } = avatarSchema.parse(req.body);
    await db.update(users)
      .set({ avatarUrl, updatedAt: new Date() })
      .where(eq(users.id, (req as AuthRequest).userId));
    res.json({ message: "Avatar updated" });
  } catch (err) { next(err); }
});

// ── PUT /api/user/language ────────────────────────────────────────────────────
const langSchema = z.object({ language: z.string().min(1).max(30) });

router.put("/language", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { language } = langSchema.parse(req.body);
    await db.update(users)
      .set({ language, updatedAt: new Date() })
      .where(eq(users.id, (req as AuthRequest).userId));
    res.json({ message: "Language updated" });
  } catch (err) { next(err); }
});

export default router;
