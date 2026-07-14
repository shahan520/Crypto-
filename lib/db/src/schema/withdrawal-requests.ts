import { pgTable, serial, integer, numeric, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { wallets } from "./wallets";

export const withdrawalRequests = pgTable("withdrawal_requests", {
  id:            serial("id").primaryKey(),
  userId:        integer("user_id").notNull().references(() => users.id),
  amountUsdt:    numeric("amount_usdt", { precision: 18, scale: 4 }).notNull(),
  walletId:      integer("wallet_id").references(() => wallets.id),
  walletAddress: text("wallet_address").notNull(), // snapshot at time of request
  network:       varchar("network", { length: 20 }).notNull().default("TRC20"),
  status:        varchar("status", { length: 20 }).notNull().default("pending"), // pending | success | rejected
  adminNote:     text("admin_note"),
  createdAt:     timestamp("created_at").notNull().defaultNow(),
  processedAt:   timestamp("processed_at"),
});

export type WithdrawalRequest = typeof withdrawalRequests.$inferSelect;
