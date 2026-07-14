import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { users, adminAccounts, inviteCodes } from "@workspace/db/schema";
import { eq, isNull, count } from "drizzle-orm";
import { z } from "zod/v4";
import { signUserToken, signAdminToken } from "../lib/jwt.js";
import { BadRequestError, UnauthorizedError, ConflictError } from "../lib/errors.js";
import { requireUser, type AuthRequest } from "../middlewares/auth.js";
import type { Request, Response, NextFunction } from "express";

const router = Router();

// ── helpers ──────────────────────────────────────────────────────────────────

function safeUser(u: typeof users.$inferSelect) {
  return {
    id:                u.id,
    username:          u.username,
    inviteCode:        u.inviteCode,
    balanceUsdt:       u.balanceUsdt,
    frozenUsdt:        u.frozenUsdt,
    isVip:             u.isVip,
    sessionApproved:   u.sessionApproved,
    sessionOrderCount: u.sessionOrderCount,
    sessionRound:      u.sessionRound,
    canWithdraw:       u.canWithdraw,
    loginCount:        u.loginCount,
    avatarUrl:         u.avatarUrl,
    language:          u.language,
    hasFundPassword:   !!u.fundPasswordHash,
    createdAt:         u.createdAt,
  };
}

function generateCode(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// ── POST /api/auth/register ───────────────────────────────────────────────────
const registerSchema = z.object({
  username:   z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, "Alphanumeric and underscores only"),
  password:   z.string().min(6).max(100),
  inviteCode: z.string().optional(),
});

router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = registerSchema.parse(req.body);

    // Count total users — if 0 this is the bootstrap admin user
    const [{ value: userCount }] = await db.select({ value: count() }).from(users);
    const isFirstUser = Number(userCount) === 0;

    // Invite code required for everyone except the first user
    if (!isFirstUser) {
      if (!body.inviteCode) throw new BadRequestError("Invite code is required");
      const code = await db.query.inviteCodes.findFirst({
        where: (ic, { eq, and, isNull }) => and(
          eq(ic.code, body.inviteCode!.toUpperCase()),
          isNull(ic.usedById),
        ),
      });
      if (!code) throw new BadRequestError("Invalid or already-used invite code");
    }

    // Check username uniqueness
    const existing = await db.query.users.findFirst({ where: eq(users.username, body.username) });
    if (existing) throw new ConflictError("Username already taken");

    const passwordHash = await bcrypt.hash(body.password, 12);

    // Generate unique invite code for the new user
    let newCode: string;
    do {
      newCode = generateCode(8);
      const clash = await db.query.inviteCodes.findFirst({ where: eq(inviteCodes.code, newCode) });
      if (!clash) break;
    } while (true);

    // Find referrer if invite code provided
    let referredById: number | null = null;
    let usedCodeId: number | null = null;
    if (!isFirstUser && body.inviteCode) {
      const code = await db.query.inviteCodes.findFirst({
        where: (ic, { eq }) => eq(ic.code, body.inviteCode!.toUpperCase()),
      });
      if (code) {
        usedCodeId = code.id;
        referredById = code.ownerId ?? null;
      }
    }

    // Insert user
    const [user] = await db.insert(users).values({
      username:          body.username,
      passwordHash,
      inviteCode:        newCode,
      referredById,
      balanceUsdt:       "50",  // starting balance
      sessionApproved:   isFirstUser, // first user gets auto-approval
    }).returning();

    // Insert the new user's own invite code into invite_codes table
    await db.insert(inviteCodes).values({ code: newCode, ownerId: user.id });

    // Mark the used invite code as consumed
    if (usedCodeId) {
      await db.update(inviteCodes)
        .set({ usedById: user.id, usedAt: new Date() })
        .where(eq(inviteCodes.id, usedCodeId));
    }

    // If this is the first user, create admin account with same credentials
    if (isFirstUser) {
      const adminHash = await bcrypt.hash(body.password, 12);
      await db.insert(adminAccounts).values({ username: body.username, passwordHash: adminHash });
    }

    const token = signUserToken(user.id);
    res.status(201).json({ token, user: safeUser(user) });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = loginSchema.parse(req.body);
    const user = await db.query.users.findFirst({ where: eq(users.username, body.username) });
    if (!user) throw new UnauthorizedError("Invalid username or password");

    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) throw new UnauthorizedError("Invalid username or password");

    // Increment login count
    const [updated] = await db.update(users)
      .set({ loginCount: user.loginCount + 1, updatedAt: new Date() })
      .where(eq(users.id, user.id))
      .returning();

    const token = signUserToken(user.id);
    res.json({ token, user: safeUser(updated) });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/admin/login ────────────────────────────────────────────────
const adminLoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

router.post("/admin/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = adminLoginSchema.parse(req.body);
    const admin = await db.query.adminAccounts.findFirst({ where: eq(adminAccounts.username, body.username) });
    if (!admin) throw new UnauthorizedError("Invalid admin credentials");

    const ok = await bcrypt.compare(body.password, admin.passwordHash);
    if (!ok) throw new UnauthorizedError("Invalid admin credentials");

    const token = signAdminToken(admin.id);
    res.json({ token, admin: { id: admin.id, username: admin.username } });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get("/me", requireUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).userId;
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user) throw new UnauthorizedError("User not found");
    res.json({ user: safeUser(user) });
  } catch (err) {
    next(err);
  }
});

export default router;
