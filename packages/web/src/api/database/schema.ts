import { sqliteTable, text } from "drizzle-orm/sqlite-core";
export * from './auth-schema';

export const content = sqliteTable('content', {
  id: text('id').primaryKey(),
  kind: text('kind').notNull(),
  data: text('data', { mode: 'json' }).$type<Record<string, string>>().notNull(),
});
export const administrators = sqliteTable('administrators', {
  userId: text('user_id').primaryKey(),
});

/**
 * Define your database schema here, then apply it with `bun run db:push`
 * (from packages/web). Re-export any generated schema from this file
 * (e.g. Better Auth's auth-schema.ts) so drizzle generates complete migrations.
 * Table patterns and conventions: skills/app/references/api.md
 */
