import { NextResponse } from 'next/server';
import { db } from '@/db';
import { queues, categories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { supabase } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { categoryId, action, value, counter } = await request.json();

    if (!categoryId || !action) {
      return NextResponse.json({ error: 'categoryId dan action wajib diisi' }, { status: 400 });
    }

    const catId = Number(categoryId);
    const catList = await db.select().from(categories).where(eq(categories.id, catId));
    if (catList.length === 0) {
      return NextResponse.json({ error: 'Kategori tidak ditemukan' }, { status: 404 });
    }
    const category = catList[0];

    const lastQueue = await db
      .select()
      .from(queues)
      .where(eq(queues.categoryId, catId))
      .orderBy(desc(queues.createdAt))
      .limit(1);

    let newNumber = lastQueue.length > 0 ? lastQueue[0].number : 0;

    if (action === 'INCREMENT') {
      newNumber += 1;
    } else if (action === 'DECREMENT') {
      newNumber = Math.max(0, newNumber - 1);
    } else if (action === 'SET') {
      newNumber = Math.max(0, Number(value) || 0);
    }

    const [insertedQueue] = await db
      .insert(queues)
      .values({
        number: newNumber,
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

    const channel = supabase.channel('queue-updates');
    await channel.send({
      type: 'broadcast',
      event: 'queue-called',
      payload: queuePayload,
    });

    return NextResponse.json(queuePayload);
  } catch (error) {
    console.error('Queue adjust error:', error);
    return NextResponse.json({ error: 'Gagal menyesuaikan antrian' }, { status: 500 });
  }
}
