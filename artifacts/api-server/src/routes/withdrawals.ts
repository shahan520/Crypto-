import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { users, wallets, withdrawalRequests } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod/v4";
import { requireUser, type AuthRequest } from "../middlewares/auth.js";
import { BadRequestError, NotFoundError, ForbiddenError, UnauthorizedError } from "../lib/errors.js";
import type { Request, Response, NextFunction } from "express";

const router = Router();
router.use(requireUser);

const createSchema = z.object({
  amountUsdt:   z.number().positive().max(9_999_999),
  walletId:     z.number().int().positive(),
  fundPassword: z.string().min(1),
});

// ── POST /api/withdrawals ─────────────────────────────────────────────────────
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body   = createSchema.parse(req.body);
    const userId = (req as AuthRequest).userId;

    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user) throw new NotFoundError();
    if (!user.canWithdraw) throw new ForbiddenError("Complete 25 orders first to unlock withdrawal");
    if (!user.fundPasswordHash) throw new BadRequestError("Set a fund password before withdrawing");

    const ok = await bcrypt.compare(body.fundPassword, user.fundPasswordHash);
    if (!ok) throw new UnauthorizedError("Incorrect fund password");

    const balance = parseFloat(user.balanceUsdt);
    if (body.amountUsdt > balance) {
      throw new BadRequestError(`Insufficient balance. Available: ${balance.toFixed(4)} USDT`);
    }

    // Get wallet
    const wallet = await db.query.wallets.findFirst({ where: eq(wallets.id, body.walletId) });
    if (!wallet || wallet.userId !== userId) throw new NotFoundError("Wallet not found");

    // Deduct balance immediately
    const newBalance = balance - body.amountUsdt;
    await db.update(users)
      .set({ balanceUsdt: newBalance.toFixed(4), updatedAt: new Date() })
      .where(eq(users.id, userId));

    const [wr] = await db.insert(withdrawalRequests).values({
      userId,
      amountUsdt:    body.amountUsdt.toFixed(4),
      walletId:      body.walletId,
      walletAddress: wallet.address,
      network:       wallet.network,
    }).returning();

    res.status(201).json({
      withdrawal: {
        id:            wr.id,
        amountUsdt:    parseFloat(wr.amountUsdt),
        walletAddress: wr.walletAddress,
        network:       wr.network,
        status:        wr.status,
        createdAt:     wr.createdAt,
      },
      newBalance: newBalance.toFixed(4),
    });
  } catch (err) { next(err); }
});

// ── GET /api/withdrawals ──────────────────────────────────────────────────────
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).userId;
    const rows = await db.query.withdrawalRequests.findMany({
      where: eq(withdrawalRequests.userId, userId),
      orderBy: [desc(withdrawalRequests.createdAt)],
      limit: 50,
    });
    res.json({
      withdrawals: rows.map(w => ({
        id:            w.id,
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

export default router;
