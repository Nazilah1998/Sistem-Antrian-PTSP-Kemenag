import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';

export async function GET() {
  try {
    // Quick database check query
    await db.select().from(categories).limit(1);

    return NextResponse.json({
      status: 'ok',
      service: 'loket-kemenag-next',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check database error:', error);
    return NextResponse.json(
      {
        status: 'error',
        service: 'loket-kemenag-next',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
