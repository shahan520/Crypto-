// ─── Combo Order Business Logic ───────────────────────────────────────────────

/** Default combo positions for round 1 (first 25 orders) */
const ROUND_1_POSITIONS = [15];

/** Default combo positions for round 2 and beyond */
const ROUND_2_POSITIONS = [10, 15, 23];

/**
 * Returns which order positions (1-25) within the current session are combo positions.
 * VIP users with admin-set custom positions use those instead.
 */
export function getComboPositions(
  sessionRound: number,
  isVip: boolean,
  customPositions: number[],
): number[] {
  if (isVip && customPositions.length > 0) return customPositions;
  return sessionRound === 1 ? ROUND_1_POSITIONS : ROUND_2_POSITIONS;
}

/**
 * Returns whether the given order position in this session is a combo order.
 */
export function isComboPosition(
  orderPosition: number,
  sessionRound: number,
  isVip: boolean,
  customPositions: number[],
): boolean {
  return getComboPositions(sessionRound, isVip, customPositions).includes(orderPosition);
}

/** Precision-safe rounding to 4 decimal places */
function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

/**
 * Calculates combo order financials.
 * - Non-VIP: value = 150% of balance, commission = 25%
 * - VIP: value = 200% of balance, commission = 90%
 */
export function calcComboOrder(balanceUsdt: number, isVip: boolean): {
  amount: number;
  commission: number;
  expectedIncome: number;
} {
  const multiplier   = isVip ? 2.0 : 1.5;
  const commRate     = isVip ? 0.90 : 0.25;
  const amount       = round4(balanceUsdt * multiplier);
  const commission   = round4(amount * commRate);
  const expectedIncome = round4(amount + commission);
  return { amount, commission, expectedIncome };
}

// ─── Normal order amounts (per platform) ─────────────────────────────────────
const NORMAL_BASE: Record<string, { amount: number; rate: number }> = {
  amazon:     { amount: 159.96, rate: 0.04 },
  alibaba:    { amount: 99.80,  rate: 0.08 },
  aliexpress: { amount: 103.50, rate: 0.12 },
};

/**
 * Calculates normal (non-combo) order financials for a given platform.
 * Adds ±8% random variation so each order feels unique.
 */
export function calcNormalOrder(platform: string): {
  amount: number;
  commission: number;
  expectedIncome: number;
} {
  const base = NORMAL_BASE[platform] ?? NORMAL_BASE["amazon"]!;
  const variation = 1 + (Math.random() * 0.16 - 0.08);
  const amount     = round4(base.amount * variation);
  const commission = round4(amount * base.rate);
  return { amount, commission, expectedIncome: round4(amount + commission) };
}

/** Generate a unique order reference number */
export function generateOrderRef(): string {
  return `TR${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
}
