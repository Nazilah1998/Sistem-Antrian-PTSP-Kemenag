import { pgSchema, serial, text, integer, timestamp, varchar } from 'drizzle-orm/pg-core';

// Create or use the schema 'kemenag_loket'
export const kemenagLoketSchema = pgSchema('kemenag_loket');

export const users = kemenagLoketSchema.table('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  password: text('password').notNull(),
  role: varchar('role', { length: 50 }).notNull().default('OPERATOR'),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categories = kemenagLoketSchema.table('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  code: varchar('code', { length: 10 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const queues = kemenagLoketSchema.table('queues', {
  id: serial('id').primaryKey(),
  number: integer('number').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('WAITING'), // WAITING, CALLED, COMPLETED, SKIPPED
  categoryId: integer('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  counter: varchar('counter', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Queue = typeof queues.$inferSelect;
export type NewQueue = typeof queues.$inferInsert;
