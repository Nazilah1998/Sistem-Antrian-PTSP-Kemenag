import { NextResponse } from 'next/server';
import { checkPusdatinMaintenance } from '@/lib/pusdatin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const status = await checkPusdatinMaintenance();
  return NextResponse.json(status, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}
