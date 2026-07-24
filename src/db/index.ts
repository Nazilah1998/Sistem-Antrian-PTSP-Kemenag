import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || '';

if (!connectionString) {
  console.warn('DATABASE_URL is missing in environment variables');
}

// Disable prefetch for serverless / edge compatibility if needed
const client = postgres(connectionString, { max: 10 });
export const db = drizzle(client, { schema });
