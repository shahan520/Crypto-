import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { users, adminAccounts, inviteCodes, depositRequests, withdrawalRequests, comboConfigs, orders } from "@workspace/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { z } from "zod/v4";
import { requireAdmin, type AdminRequest } from "../middlewares/admin-auth.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import type { Request, Response, NextFunction } from "express";

const router = Router();
router.use(requireAdmin);

function safeUser(u: typeof users.$inferSelect) {
  return {
    id:                u.id,
    username:          u.username,
    inviteCode:        u.inviteCode,
    balanceUsdt:       parseFloat(u.balanceUsdt),
    frozenUsdt:        parseFloat(u.frozenUsdt),
    isVip:             u.isVip,
    sessionApproved:   u.sessionApproved,
    sessionOrderCount: u.sessionOrderCount,
    sessionRound:      u.sessionRound,
    canWithdraw:       u.canWithdraw,
    loginCount:        u.loginCount,
    referredById:      u.referredById,
    createdAt:         u.createdAt,
  };
}

function generateCode(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// ── GET /api/admin/users ──────────────────────────────────────────────────────
router.get("/users", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const all = await db.query.users.findMany({ orderBy: [asc(users.createdAt)] });
    res.json({ users: all.map(safeUser) });
  } catch (err) { next(err); }
});

// ── PUT /api/admin/users/:id/vip ──────────────────────────────────────────────
router.put("/users/:id/vip", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params["id"] ?? "0");
    const body   = z.object({ isVip: z.boolean() }).parse(req.body);
    const [u] = await db.update(users)
      .set({ isVip: body.isVip, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    if (!u) throw new NotFoundError("User not found");
    res.json({ user: safeUser(u) });
  } catch (err) { next(err); }
});

// ── PUT /api/admin/users/:id/session-approval ─────────────────────────────────
router.put("/users/:id/session-approval", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params["id"] ?? "0");
    const body   = z.object({ approved: z.boolean() }).parse(req.body);
    const [u] = await db.update(users)
      .set({ sessionApproved: body.approved, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    if (!u) throw new NotFoundError("User not found");
    res.json({ user: safeUser(u) });
  } catch (err) { next(err); }
});

// ── PUT /api/admin/users/:id/freeze ──────────────────────────────────────────
router.put("/users/:id/freeze", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params["id"] ?? "0");
    const body   = z.object({ frozenUsdt: z.number().min(0) }).parse(req.body);
    const [u] = await db.update(users)
      .set({ frozenUsdt: body.frozenUsdt.toFixed(4), updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    if (!u) throw new NotFoundError("User not found");
    res.json({ user: safeUser(u) });
  } catch (err) { next(err); }
});

// ── POST /api/admin/users/:id/reset-password ──────────────────────────────────
router.post("/users/:id/reset-password", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params["id"] ?? "0");
    const body   = z.object({ newPassword: z.string().min(6) }).parse(req.body);
    const hash   = await bcrypt.hash(body.newPassword, 12);
    const [u]    = await db.update(users)
      .set({ passwordHash: hash, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    if (!u) throw new NotFoundError("User not found");
    res.json({ message: "Password reset successfully" });
  } catch (err) { next(err); }
});

// ── PUT /api/admin/users/:id/combos ───────────────────────────────────────────
router.put("/users/:id/combos", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params["id"] ?? "0");
    const body   = z.object({
      positions: z.array(z.number().int().min(1).max(25)).max(25),
    }).parse(req.body);

    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user) throw new NotFoundError("User not found");

    const existing = await db.query.comboConfigs.findFirst({ where: eq(comboConfigs.userId, userId) });
    if (existing) {
      await db.update(comboConfigs)
        .set({ positions: body.positions, updatedAt: new Date() })
        .where(eq(comboConfigs.userId, userId));
    } else {
      await db.insert(comboConfigs).values({ userId, positions: body.positions });
    }

    res.json({ message: "Combo positions updated", positions: body.positions });
  } catch (err) { next(err); }
});

// ── POST /api/admin/invite-codes ───────────────────────────────────────────────
router.post("/invite-codes", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = z.object({ count: z.number().int().min(1).max(50).default(1) }).parse(req.body);
    const created: string[] = [];

    for (let i = 0; i < body.count; i++) {
      let code: string;
      do {
        code = generateCode(8);
        const clash = await db.query.inviteCodes.findFirst({ where: eq(inviteCodes.code, code) });
        if (!clash) break;
      } while (true);
      await db.insert(inviteCodes).values({ code, createdByAdmin: true });
      created.push(code);
    }

    res.status(201).json({ codes: created });
  } catch (err) { next(err); }
});

// ── GET /api/admin/invite-codes ────────────────────────────────────────────────
router.get("/invite-codes", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const codes = await db.query.inviteCodes.findMany({
      orderBy: [desc(inviteCodes.createdAt)],
      limit: 200,
    });
    res.json({
      codes: codes.map(c => ({
        id:             c.id,
        code:           c.code,
        ownerId:        c.ownerId,
        createdByAdmin: c.createdByAdmin,
        usedById:       c.usedById,
        usedAt:         c.usedAt,
        createdAt:      c.createdAt,
      })),
    });
  } catch (err) { next(err); }
});

// ── GET /api/admin/deposits ───────────────────────────────────────────────────
router.get("/deposits", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await db.query.depositRequests.findMany({ orderBy: [desc(depositRequests.createdAt)], limit: 200 });
    // Enrich with usernames
    const userIds = [...new Set(rows.map(r => r.userId))];
    const userList = await Promise.all(userIds.map(id =>
      db.query.users.findFirst({ where: eq(users.id, id) })
    ));
    const userMap = Object.fromEntries(userList.filter(Boolean).map(u => [u!.id, u!.username]));

    res.json({
      deposits: rows.map(d => ({
        id:          d.id,
        userId:      d.userId,
        username:    userMap[d.userId] ?? "unknown",
        amountUsdt:  parseFloat(d.amountUsdt),
        network:     d.network,
        txHash:      d.txHash,
        status:      d.status,
        adminNote:   d.adminNote,
        createdAt:   d.createdAt,
        processedAt: d.processedAt,
      })),
    });
  } catch (err) { next(err); }
});

// ── PUT /api/admin/deposits/:id ───────────────────────────────────────────────
router.put("/deposits/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const depId = parseInt(req.params["id"] ?? "0");
    const body  = z.object({
      status:    z.enum(["confirmed", "rejected"]),
      adminNote: z.string().max(500).optional(),
    }).parse(req.body);

    const dep = await db.query.depositRequests.findFirst({ where: eq(depositRequests.id, depId) });
    if (!dep) throw new NotFoundError("Deposit not found");
    if (dep.status !== "pending") throw new BadRequestError("Deposit already processed");

    // If confirmed → credit user balance
    if (body.status === "confirmed") {
      const user = await db.query.users.findFirst({ where: eq(users.id, dep.userId) });
      if (user) {
        const newBal = parseFloat(user.balanceUsdt) + parseFloat(dep.amountUsdt);
        await db.update(users)
          .set({ balanceUsdt: newBal.toFixed(4), updatedAt: new Date() })
          .where(eq(users.id, user.id));
      }
    }

    await db.update(depositRequests)
      .set({ status: body.status, adminNote: body.adminNote, processedAt: new Date() })
      .where(eq(depositRequests.id, depId));

    res.json({ message: `Deposit ${body.status}` });
  } catch (err) { next(err); }
});

// ── GET /api/admin/withdrawals ────────────────────────────────────────────────
router.get("/withdrawals", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await db.query.withdrawalRequests.findMany({ orderBy: [desc(withdrawalRequests.createdAt)], limit: 200 });
    const userIds = [...new Set(rows.map(r => r.userId))];
    const userList = await Promise.all(userIds.map(id =>
      db.query.users.findFirst({ where: eq(users.id, id) })
    ));
    const userMap = Object.fromEntries(userList.filter(Boolean).map(u => [u!.id, u!.username]));

    res.json({
      withdrawals: rows.map(w => ({
        id:            w.id,
        userId:        w.userId,
        username:      userMap[w.userId] ?? "unknown",
        amountUsdt:    parseFloat(w.amountUsdt),
        walletAddress: w.walletAddress,
        network:       w.network,
        status:        w.status,
        adminNote:     w.adminNote,
        createdAt:     w.createdAt,
        processedAt:   w.processedAt,
      })),
    });
  } catch (err) { next(err); }
});

// ── PUT /api/admin/withdrawals/:id ────────────────────────────────────────────
router.put("/withdrawals/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wrId = parseInt(req.params["id"] ?? "0");
    const body = z.object({
      status:    z.enum(["success", "rejected"]),
      adminNote: z.string().max(500).optional(),
    }).parse(req.body);

    const wr = await db.query.withdrawalRequests.findFirst({ where: eq(withdrawalRequests.id, wrId) });
    if (!wr) throw new NotFoundError("Withdrawal not found");
    if (wr.status !== "pending") throw new BadRequestError("Withdrawal already processed");

    // If rejected → refund balance
    if (body.status === "rejected") {
      const user = await db.query.users.findFirst({ where: eq(users.id, wr.userId) });
      if (user) {
        const newBal = parseFloat(user.balanceUsdt) + parseFloat(wr.amountUsdt);
        await db.update(users)
          .set({ balanceUsdt: newBal.toFixed(4), updatedAt: new Date() })
          .where(eq(users.id, user.id));
      }
    }

    await db.update(withdrawalRequests)
      .set({ status: body.status, adminNote: body.adminNote, processedAt: new Date() })
      .where(eq(withdrawalRequests.id, wrId));

    res.json({ message: `Withdrawal ${body.status}` });
  } catch (err) { next(err); }
});

// ── GET /api/admin/orders ─────────────────────────────────────────────────────
router.get("/orders", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await db.query.orders.findMany({ orderBy: [desc(orders.createdAt)], limit: 500 });
    const userIds = [...new Set(rows.map(r => r.userId))];
    const userList = await Promise.all(userIds.map(id =>
      db.query.users.findFirst({ where: eq(users.id, id) })
    ));
    const userMap = Object.fromEntries(userList.filter(Boolean).map(u => [u!.id, u!.username]));

    res.json({
      orders: rows.map(o => ({
        id:             o.id,
        userId:         o.userId,
        username:       userMap[o.userId] ?? "unknown",
        orderRef:       o.orderRef,
        platform:       o.platform,
        amount:         parseFloat(o.amountUsdt),
        commission:     parseFloat(o.commissionUsdt),
        expectedIncome: parseFloat(o.expectedIncomeUsdt),
        isCombo:        o.isCombo,
        orderPosition:  o.orderPosition,
        sessionRound:   o.sessionRound,
        status:         o.status,
        createdAt:      o.createdAt,
        completedAt:    o.completedAt,
      })),
    });
  } catch (err) { next(err); }
});

export default router;
