import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const adminAccounts = pgTable("admin_accounts", {
  id:           serial("id").primaryKey(),
  username:     varchar("username", { length: 50 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt:    timestamp("created_at").notNull().defaultNow(),
});

export const insertAdminSchema = createInsertSchema(adminAccounts).omit({ id: true, createdAt: true });
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof adminAccounts.$inferSelect;
