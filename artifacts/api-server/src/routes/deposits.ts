import { Router } from "express";
import { db } from "@workspace/db";
import { depositRequests } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod/v4";
import { requireUser, type AuthRequest } from "../middlewares/auth.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import type { Request, Response, NextFunction } from "express";

const router = Router();
router.use(requireUser);

const createSchema = z.object({
  amountUsdt: z.number().positive().max(9_999_999),
  network:    z.enum(["TRC20", "ERC20", "BEP20"]).default("TRC20"),
  txHash:     z.string().min(10).max(200).optional(),
});

// ── POST /api/deposits ────────────────────────────────────────────────────────
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body   = createSchema.parse(req.body);
    const userId = (req as AuthRequest).userId;

    const [dep] = await db.insert(depositRequests).values({
      userId,
      amountUsdt: body.amountUsdt.toFixed(4),
      network:    body.network,
      txHash:     body.txHash,
    }).returning();

    res.status(201).json({
      deposit: {
        id:          dep.id,
        amountUsdt:  parseFloat(dep.amountUsdt),
        network:     dep.network,
        txHash:      dep.txHash,
        status:      dep.status,
        createdAt:   dep.createdAt,
      },
    });
  } catch (err) { next(err); }
});

// ── GET /api/deposits ─────────────────────────────────────────────────────────
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).userId;
    const rows = await db.query.depositRequests.findMany({
      where: eq(depositRequests.userId, userId),
      orderBy: [desc(depositRequests.createdAt)],
      limit: 50,
    });
    res.json({
      deposits: rows.map(d => ({
        id:          d.id,
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

export default router;
