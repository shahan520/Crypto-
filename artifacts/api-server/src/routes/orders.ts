import { Router } from "express";
import { db } from "@workspace/db";
import { users, orders, comboConfigs } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod/v4";
import { requireUser, type AuthRequest } from "../middlewares/auth.js";
import {
  BadRequestError, NotFoundError, ForbiddenError,
} from "../lib/errors.js";
import {
  isComboPosition, calcComboOrder, calcNormalOrder, generateOrderRef,
} from "../lib/combo.js";
import type { Request, Response, NextFunction } from "express";

const router = Router();
router.use(requireUser);

const PLATFORMS = ["amazon", "alibaba", "aliexpress"] as const;
const SESSION_LIMIT = 25;

// ── POST /api/orders/grab ─────────────────────────────────────────────────────
const grabSchema = z.object({
  platform: z.enum(PLATFORMS),
});

router.post("/grab", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { platform } = grabSchema.parse(req.body);
    const userId = (req as AuthRequest).userId;

    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user) throw new NotFoundError("User not found");

    if (!user.sessionApproved) {
      throw new ForbiddenError("Session not approved. Contact customer service.");
    }
    if (parseFloat(user.frozenUsdt) > 0) {
      throw new ForbiddenError("Your account has frozen funds. Contact customer service.");
    }
    if (user.sessionOrderCount >= SESSION_LIMIT) {
      throw new BadRequestError("Session complete. Wait for admin to approve next session.");
    }

    const orderPosition = user.sessionOrderCount + 1;

    // Get custom combo positions for VIP
    let customPositions: number[] = [];
    if (user.isVip) {
      const cfg = await db.query.comboConfigs.findFirst({ where: eq(comboConfigs.userId, userId) });
      customPositions = cfg?.positions ?? [];
    }

    const isCombo = isComboPosition(orderPosition, user.sessionRound, user.isVip, customPositions);
    const balance = parseFloat(user.balanceUsdt);

    let amount: number, commission: number, expectedIncome: number;
    if (isCombo) {
      ({ amount, commission, expectedIncome } = calcComboOrder(balance, user.isVip));
    } else {
      ({ amount, commission, expectedIncome } = calcNormalOrder(platform));
    }

    const orderRef = generateOrderRef();

    const [order] = await db.insert(orders).values({
      userId,
      platform,
      orderRef,
      amountUsdt:         amount.toFixed(4),
      commissionUsdt:     commission.toFixed(4),
      expectedIncomeUsdt: expectedIncome.toFixed(4),
      isCombo,
      sessionRound: user.sessionRound,
      orderPosition,
      status: "pending",
    }).returning();

    res.json({
      order: {
        id:              order.id,
        orderRef:        order.orderRef,
        platform:        order.platform,
        amount:          parseFloat(order.amountUsdt),
        commission:      parseFloat(order.commissionUsdt),
        expectedIncome:  parseFloat(order.expectedIncomeUsdt),
        isCombo:         order.isCombo,
        orderPosition:   order.orderPosition,
        sessionRound:    order.sessionRound,
        status:          order.status,
        createdAt:       order.createdAt,
      },
    });
  } catch (err) { next(err); }
});

// ── POST /api/orders/:id/submit ───────────────────────────────────────────────
router.post("/:id/submit", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = parseInt(req.params["id"] ?? "0");
    const userId  = (req as AuthRequest).userId;

    const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
    if (!order) throw new NotFoundError("Order not found");
    if (order.userId !== userId) throw new ForbiddenError();
    if (order.status !== "pending") throw new BadRequestError("Order already submitted");

    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user) throw new NotFoundError();

    const income     = parseFloat(order.expectedIncomeUsdt);
    const newBalance = parseFloat(user.balanceUsdt) + income;
    const newCount   = user.sessionOrderCount + 1;
    const sessionComplete = newCount >= SESSION_LIMIT;

    // Update order status
    await db.update(orders)
      .set({ status: "complete", completedAt: new Date() })
      .where(eq(orders.id, orderId));

    // Update user: balance, session count, and session completion
    await db.update(users).set({
      balanceUsdt:       newBalance.toFixed(4),
      sessionOrderCount: sessionComplete ? 0 : newCount,
      sessionRound:      sessionComplete ? user.sessionRound + 1 : user.sessionRound,
      canWithdraw:       sessionComplete ? true : user.canWithdraw,
      sessionApproved:   sessionComplete ? false : user.sessionApproved, // re-approval required
      updatedAt:         new Date(),
    }).where(eq(users.id, userId));

    res.json({
      message:        "Order submitted successfully",
      newBalance:     newBalance.toFixed(4),
      sessionComplete,
      income:         income.toFixed(4),
    });
  } catch (err) { next(err); }
});

// ── GET /api/orders ───────────────────────────────────────────────────────────
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).userId;
    const page  = Math.max(1, parseInt(String(req.query["page"] ?? "1")));
    const limit = Math.min(50, parseInt(String(req.query["limit"] ?? "20")));
    const offset = (page - 1) * limit;

    const rows = await db.query.orders.findMany({
      where: eq(orders.userId, userId),
      orderBy: [desc(orders.createdAt)],
      limit,
      offset,
    });

    res.json({
      orders: rows.map(o => ({
        id:             o.id,
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
      page,
      limit,
    });
  } catch (err) { next(err); }
});

export default router;
