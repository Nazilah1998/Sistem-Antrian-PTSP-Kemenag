import { NextResponse } from 'next/server';
import { db } from '@/db';
import { queues } from '@/db/schema';
import { gte, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Fetch queues created today
    const todayQueues = await db
      .select()
      .from(queues)
      .where(gte(queues.createdAt, todayStart));

    const totalToday = todayQueues.length;
    const calledToday = todayQueues.filter((q) => q.status === 'CALLED' || q.status === 'COMPLETED').length;
    const waitingToday = todayQueues.filter((q) => q.status === 'WAITING').length;

    // Check operational hours (Mon-Fri 08:00 - 15:30)
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 6 is Saturday
    const hour = now.getHours();

    const isWeekday = day >= 1 && day <= 5;
    const isWithinHours = hour >= 7 && hour < 16;
    const isOpen = isWeekday && isWithinHours;

    return NextResponse.json({
      totalToday,
      calledToday,
      waitingToday,
      isOpen,
      operationalStatus: isOpen ? 'BUKA' : 'TUTUP',
      operatingHoursText: 'Senin - Jumat | 08.00 - 15.30 WITA/WIB',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Gagal mengambil statistik antrian' }, { status: 500 });
  }
}
