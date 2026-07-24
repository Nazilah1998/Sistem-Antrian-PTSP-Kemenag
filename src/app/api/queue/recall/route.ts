import { NextResponse } from 'next/server';
import { db } from '@/db';
import { queues, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { supabase } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { queueId, counter } = await request.json();

    if (!queueId) {
      return NextResponse.json({ error: 'queueId wajib diisi' }, { status: 400 });
    }

    const qList = await db.select().from(queues).where(eq(queues.id, Number(queueId)));
    if (qList.length === 0) {
      return NextResponse.json({ error: 'Antrian tidak ditemukan' }, { status: 404 });
    }

    const queue = qList[0];
    const catList = await db.select().from(categories).where(eq(categories.id, queue.categoryId));
    const category = catList[0];

    const queuePayload = {
      ...queue,
      category,
      counter: counter || queue.counter || '01',
      isRecall: true,
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
    console.error('Queue recall error:', error);
    return NextResponse.json({ error: 'Gagal memanggil ulang antrian' }, { status: 500 });
  }
}
