import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories, queues } from '@/db/schema';
import { eq, desc, gte, and } from 'drizzle-orm';

export async function GET() {
  try {
    const allCategories = await db.select().from(categories);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const activeQueues = await Promise.all(
      allCategories.map(async (cat) => {
        const lastQ = await db
          .select()
          .from(queues)
          .where(and(eq(queues.categoryId, cat.id), gte(queues.createdAt, todayStart)))
          .orderBy(desc(queues.createdAt))
          .limit(1);

        return {
          category: cat,
          queue: lastQ.length > 0 ? lastQ[0] : null,
        };
      })
    );

    return NextResponse.json(activeQueues);
  } catch (error) {
    console.error('Active queues error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data antrian aktif' }, { status: 500 });
  }
}
