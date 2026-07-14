import { pgTable, serial, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const inviteCodes = pgTable("invite_codes", {
  id:             serial("id").primaryKey(),
  code:           varchar("code", { length: 20 }).notNull().unique(),
  ownerId:        integer("owner_id").references(() => users.id),  // null = admin-generated
  createdByAdmin: boolean("created_by_admin").notNull().default(false),
  usedById:       integer("used_by_id").references(() => users.id),
  usedAt:         timestamp("used_at"),
  createdAt:      timestamp("created_at").notNull().defaultNow(),
});

export type InviteCode = typeof inviteCodes.$inferSelect;
