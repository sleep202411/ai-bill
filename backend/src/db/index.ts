import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured');
}

// Supabase pooler (6543) 需要关闭 prepare
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });

export { schema };
export * from './schema';
