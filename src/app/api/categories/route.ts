import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';

export async function GET() {
  try {
    const list = await db.select().from(categories);
    return NextResponse.json(list);
  } catch (error) {
    console.error('Categories error:', error);
    return NextResponse.json({ error: 'Gagal mengambil kategori' }, { status: 500 });
  }
}
