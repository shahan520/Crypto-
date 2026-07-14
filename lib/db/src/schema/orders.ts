import { pgTable, serial, integer, varchar, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const orders = pgTable("orders", {
  id:                  serial("id").primaryKey(),
  userId:              integer("user_id").notNull().references(() => users.id),
  platform:            varchar("platform", { length: 20 }).notNull(), // amazon | alibaba | aliexpress
  orderRef:            varchar("order_ref", { length: 30 }).notNull().unique(),
  amountUsdt:          numeric("amount_usdt", { precision: 18, scale: 4 }).notNull(),
  commissionUsdt:      numeric("commission_usdt", { precision: 18, scale: 4 }).notNull(),
  expectedIncomeUsdt:  numeric("expected_income_usdt", { precision: 18, scale: 4 }).notNull(),
  isCombo:             boolean("is_combo").notNull().default(false),
  sessionRound:        integer("session_round").notNull(),
  orderPosition:       integer("order_position").notNull(), // 1-25 within session
  status:              varchar("status", { length: 20 }).notNull().default("pending"), // pending | complete
  createdAt:           timestamp("created_at").notNull().defaultNow(),
  completedAt:         timestamp("completed_at"),
});

export type Order = typeof orders.$inferSelect;
