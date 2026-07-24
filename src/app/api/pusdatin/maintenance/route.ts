import { NextResponse } from 'next/server';
import { checkPusdatinMaintenance } from '@/lib/pusdatin';

export async function GET() {
  const status = await checkPusdatinMaintenance();
  return NextResponse.json(status);
}
