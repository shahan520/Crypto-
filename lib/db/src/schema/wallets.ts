import { pgTable, serial, integer, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const wallets = pgTable("wallets", {
  id:        serial("id").primaryKey(),
  userId:    integer("user_id").notNull().references(() => users.id),
  network:   varchar("network", { length: 20 }).notNull().default("TRC20"),
  address:   text("address").notNull(),
  label:     varchar("label", { length: 50 }),
  isPrimary: boolean("is_primary").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Wallet = typeof wallets.$inferSelect;
