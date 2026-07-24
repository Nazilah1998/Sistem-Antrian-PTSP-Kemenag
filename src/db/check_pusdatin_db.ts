import 'dotenv/config';
import { db } from './index';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    const apps = await db.execute(sql`SELECT * FROM kemenag_pusdatin.satellite_apps;`);
    console.log('=== DATA IN kemenag_pusdatin.satellite_apps ===');
    console.log(JSON.stringify(apps, null, 2));
  } catch (err) {
    console.error('DB Query error:', err);
  } finally {
    process.exit(0);
  }
}

main();
