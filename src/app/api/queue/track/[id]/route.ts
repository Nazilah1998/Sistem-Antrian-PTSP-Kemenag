import { NextResponse } from 'next/server';
import { db } from '@/db';
import { queues, categories } from '@/db/schema';
import { eq, gte, and, lt } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const queueId = Number(params.id);
    if (isNaN(queueId)) {
      return NextResponse.json({ error: 'ID tiket tidak valid' }, { status: 400 });
    }

    const queueList = await db.select().from(queues).where(eq(queues.id, queueId));
    if (queueList.length === 0) {
      return NextResponse.json({ error: 'Tiket tidak ditemukan' }, { status: 404 });
    }

    const targetQueue = queueList[0];

    const catList = await db.select().from(categories).where(eq(categories.id, targetQueue.categoryId));
    const category = catList[0];

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Count how many queues are waiting ahead of this ticket
    const aheadQueues = await db
      .select()
      .from(queues)
      .where(
        and(
          eq(queues.categoryId, targetQueue.categoryId),
          eq(queues.status, 'WAITING'),
          gte(queues.createdAt, todayStart),
          lt(queues.number, targetQueue.number)
        )
      );

    const queueAheadCount = aheadQueues.length;
    const estimatedMinutes = queueAheadCount * 5;

    return NextResponse.json({
      id: targetQueue.id,
      ticketNumber: `${category.code}-${String(targetQueue.number).padStart(3, '0')}`,
      categoryName: category.name,
      categoryCode: category.code,
      status: targetQueue.status,
      counter: targetQueue.counter || '01',
      queueAheadCount,
      estimatedMinutes,
      createdAt: targetQueue.createdAt,
    });
  } catch (error) {
    console.error('Track API error:', error);
    return NextResponse.json({ error: 'Gagal melacak tiket' }, { status: 500 });
  }
}
