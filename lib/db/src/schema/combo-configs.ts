import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const comboConfigs = pgTable("combo_configs", {
  id:        serial("id").primaryKey(),
  userId:    integer("user_id").notNull().references(() => users.id).unique(),
  positions: integer("positions").array().notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type ComboConfig = typeof comboConfigs.$inferSelect;
