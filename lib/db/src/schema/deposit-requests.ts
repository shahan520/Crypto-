import { pgTable, serial, integer, numeric, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const depositRequests = pgTable("deposit_requests", {
  id:          serial("id").primaryKey(),
  userId:      integer("user_id").notNull().references(() => users.id),
  amountUsdt:  numeric("amount_usdt", { precision: 18, scale: 4 }).notNull(),
  network:     varchar("network", { length: 20 }).notNull().default("TRC20"),
  txHash:      text("tx_hash"),
  status:      varchar("status", { length: 20 }).notNull().default("pending"), // pending | confirmed | rejected
  adminNote:   text("admin_note"),
  createdAt:   timestamp("created_at").notNull().defaultNow(),
  processedAt: timestamp("processed_at"),
});

export type DepositRequest = typeof depositRequests.$inferSelect;
