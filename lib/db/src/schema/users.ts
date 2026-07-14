import { pgTable, serial, varchar, text, boolean, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const users = pgTable("users", {
  id:                serial("id").primaryKey(),
  username:          varchar("username", { length: 50 }).notNull().unique(),
  passwordHash:      text("password_hash").notNull(),
  inviteCode:        varchar("invite_code", { length: 20 }).notNull().unique(),
  referredById:      integer("referred_by_id"),        // self-reference resolved in index
  balanceUsdt:       numeric("balance_usdt", { precision: 18, scale: 4 }).notNull().default("0"),
  frozenUsdt:        numeric("frozen_usdt", { precision: 18, scale: 4 }).notNull().default("0"),
  isVip:             boolean("is_vip").notNull().default(false),
  fundPasswordHash:  text("fund_password_hash"),
  sessionApproved:   boolean("session_approved").notNull().default(false),
  loginCount:        integer("login_count").notNull().default(0),
  sessionOrderCount: integer("session_order_count").notNull().default(0), // orders completed in current session
  sessionRound:      integer("session_round").notNull().default(1),        // 1 = first round, 2+ = subsequent
  canWithdraw:       boolean("can_withdraw").notNull().default(false),
  avatarUrl:         text("avatar_url"),
  language:          varchar("language", { length: 20 }).notNull().default("English"),
  createdAt:         timestamp("created_at").notNull().defaultNow(),
  updatedAt:         timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
