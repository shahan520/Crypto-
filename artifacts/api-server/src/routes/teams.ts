import { Router } from "express";
import { db } from "@workspace/db";
import { users, inviteCodes, orders } from "@workspace/db/schema";
import { eq, count, sum, and } from "drizzle-orm";
import { requireUser, type AuthRequest } from "../middlewares/auth.js";
import { NotFoundError } from "../lib/errors.js";
import type { Request, Response, NextFunction } from "express";

const router = Router();
router.use(requireUser);

// ── GET /api/teams ────────────────────────────────────────────────────────────
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).userId;
    const user   = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user) throw new NotFoundError();

    // Level 1: direct referrals
    const level1 = await db.query.users.findMany({ where: eq(users.referredById, userId) });
    const level1Ids = level1.map(u => u.id);

    // Level 2: referrals of referrals
    let level2: typeof level1 = [];
    if (level1Ids.length > 0) {
      const allUsers = await db.query.users.findMany();
      level2 = allUsers.filter(u => u.referredById !== null && level1Ids.includes(u.referredById!));
    }
    const level2Ids = level2.map(u => u.id);

    // Level 3
    let level3: typeof level1 = [];
    if (level2Ids.length > 0) {
      const allUsers = await db.query.users.findMany();
      level3 = allUsers.filter(u => u.referredById !== null && level2Ids.includes(u.referredById!));
    }

    const mask = (username: string) =>
      username.length <= 2 ? username[0] + "*" : username[0] + "*".repeat(username.length - 2) + username[username.length - 1];

    const mapMember = (u: typeof level1[0]) => ({
      id:          u.id,
      username:    mask(u.username),
      balanceUsdt: parseFloat(u.balanceUsdt).toFixed(2),
      isVip:       u.isVip,
      joinedAt:    u.createdAt,
    });

    res.json({
      totalMembers: level1.length + level2.length + level3.length,
      level1: { count: level1.length, members: level1.map(mapMember) },
      level2: { count: level2.length, members: level2.map(mapMember) },
      level3: { count: level3.length, members: level3.map(mapMember) },
    });
  } catch (err) { next(err); }
});

// ── GET /api/teams/invite ─────────────────────────────────────────────────────
router.get("/invite", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).userId;
    const user   = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user) throw new NotFoundError();

    const domain = process.env["REPLIT_DEV_DOMAIN"] ?? "localhost";
    const inviteUrl = `https://${domain}/__mockup/preview/crypto-wallet/App?code=${user.inviteCode}`;

    res.json({ inviteCode: user.inviteCode, inviteUrl });
  } catch (err) { next(err); }
});

export default router;
