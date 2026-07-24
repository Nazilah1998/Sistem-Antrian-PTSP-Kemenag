import { NextResponse } from 'next/server';
import { db } from '@/db';
import { queues, categories } from '@/db/schema';
import { eq, desc, gte, and } from 'drizzle-orm';
import { supabase } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { categoryId, counter } = await request.json();

    if (!categoryId) {
      return NextResponse.json({ error: 'categoryId wajib diisi' }, { status: 400 });
    }

    const catId = Number(categoryId);

    const catList = await db.select().from(categories).where(eq(categories.id, catId));
    if (catList.length === 0) {
      return NextResponse.json({ error: 'Kategori tidak ditemukan' }, { status: 404 });
    }
    const category = catList[0];

    // Daily Reset Logic: Filter by today's date
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const lastQueueToday = await db
      .select()
      .from(queues)
      .where(and(eq(queues.categoryId, catId), gte(queues.createdAt, todayStart)))
      .orderBy(desc(queues.createdAt))
      .limit(1);

    const nextNumber = lastQueueToday.length > 0 ? lastQueueToday[0].number + 1 : 1;

    const [insertedQueue] = await db
      .insert(queues)
      .values({
        number: nextNumber,
        status: 'CALLED',
        categoryId: catId,
        counter: counter || '01',
      })
      .returning();

    const queuePayload = {
      ...insertedQueue,
      category,
      counter: counter || '01',
      isRecall: false,
    };

    // Broadcast via Supabase Realtime channel
    const channel = supabase.channel('queue-updates');
    await channel.send({
      type: 'broadcast',
      event: 'queue-called',
      payload: queuePayload,
    });

    return NextResponse.json(queuePayload);
  } catch (error) {
    console.error('Queue call error:', error);
    return NextResponse.json({ error: 'Gagal memanggil antrian' }, { status: 500 });
  }
}
