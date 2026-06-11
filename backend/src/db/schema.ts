import { integer, pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const records = pgTable('records', {
  id: serial('id').primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  amount: integer('amount').notNull(), // amount in cents
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

