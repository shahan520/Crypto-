import { Router } from "express";
import { db } from "@workspace/db";
import { wallets } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod/v4";
import { requireUser, type AuthRequest } from "../middlewares/auth.js";
import { NotFoundError, ForbiddenError } from "../lib/errors.js";
import type { Request, Response, NextFunction } from "express";

const router = Router();
router.use(requireUser);

const createSchema = z.object({
  address: z.string().min(20).max(200),
  network: z.enum(["TRC20", "ERC20", "BEP20"]).default("TRC20"),
  label:   z.string().max(50).optional(),
});

// ── POST /api/wallets ─────────────────────────────────────────────────────────
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body   = createSchema.parse(req.body);
    const userId = (req as AuthRequest).userId;

    // Check if this is the first wallet → make it primary
    const existing = await db.query.wallets.findMany({ where: eq(wallets.userId, userId) });
    const isPrimary = existing.length === 0;

    const [w] = await db.insert(wallets).values({
      userId,
      address:   body.address,
      network:   body.network,
      label:     body.label,
      isPrimary,
    }).returning();

    res.status(201).json({
      wallet: { id: w.id, address: w.address, network: w.network, label: w.label, isPrimary: w.isPrimary, createdAt: w.createdAt },
    });
  } catch (err) { next(err); }
});

// ── GET /api/wallets ──────────────────────────────────────────────────────────
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).userId;
    const rows   = await db.query.wallets.findMany({ where: eq(wallets.userId, userId) });
    res.json({
      wallets: rows.map(w => ({
        id: w.id, address: w.address, network: w.network, label: w.label, isPrimary: w.isPrimary, createdAt: w.createdAt,
      })),
    });
  } catch (err) { next(err); }
});

// ── DELETE /api/wallets/:id ───────────────────────────────────────────────────
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const walletId = parseInt(req.params["id"] ?? "0");
    const userId   = (req as AuthRequest).userId;
    const wallet   = await db.query.wallets.findFirst({ where: eq(wallets.id, walletId) });
    if (!wallet) throw new NotFoundError("Wallet not found");
    if (wallet.userId !== userId) throw new ForbiddenError();
    await db.delete(wallets).where(eq(wallets.id, walletId));
    res.json({ message: "Wallet removed" });
  } catch (err) { next(err); }
});

export default router;
