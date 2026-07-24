import { db } from '@/db';
import { sql } from 'drizzle-orm';

export interface MaintenanceStatus {
  isMaintenance: boolean;
  message?: string;
  estimatedEndTime?: string;
  source?: string;
}

export async function checkPusdatinMaintenance(): Promise<MaintenanceStatus> {
  // 1. Local override check (.env PUSDATIN_MAINTENANCE_MODE)
  if (process.env.PUSDATIN_MAINTENANCE_MODE === 'true' || process.env.MAINTENANCE_MODE === 'true') {
    return {
      isMaintenance: true,
      message: process.env.MAINTENANCE_MESSAGE || 'Aplikasi Loket PTSP sedang dalam pemeliharaan sistem.',
      estimatedEndTime: process.env.MAINTENANCE_ETA || 'Sampai pemberitahuan lebih lanjut',
      source: 'env_override',
    };
  }

  // 2. Direct Central Database Check (Pusdatin Satellite Apps Table)
  try {
    const result = await db.execute(sql`
      SELECT status, name, description 
      FROM kemenag_pusdatin.satellite_apps 
      WHERE schema_name = 'kemenag_loket' OR id = 'loket_ptsp_kemenag' OR id = 'loket'
      LIMIT 1;
    `);

    if (result && Array.isArray(result) && result.length > 0) {
      const appRecord = result[0] as { status?: string; name?: string; description?: string };
      const statusStr = (appRecord.status || '').toLowerCase();

      if (statusStr === 'maintenance') {
        return {
          isMaintenance: true,
          message: 'Sistem Loket PTSP sedang dalam pemeliharaan rutin terpusat oleh Pusat Data dan Teknologi Informasi (Pusdatin) Kementerian Agama RI.',
          estimatedEndTime: 'Sampai pemeliharaan selesai oleh Tim Pusdatin',
          source: 'database_satellite_apps',
        };
      }
    }
  } catch (dbErr) {
    console.error('Pusdatin direct DB check error:', dbErr);
  }

  // 3. Fallback Pusdatin HTTP API Check
  const pusdatinUrl = process.env.NEXT_PUBLIC_PUSDATIN_URL || 'https://pusdatin.kemenag-baritoutara.com';
  const appSlug = process.env.SATELLITE_APP_SLUG || 'loket_ptsp_kemenag';

  const endpoints = [
    `${pusdatinUrl}/api/maintenance?schema=kemenag_loket&app=${appSlug}`,
    `${pusdatinUrl}/api/status?schema=kemenag_loket`,
  ];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const isMaint =
          data.isMaintenance === true ||
          data.maintenance === true ||
          data.status === 'MAINTENANCE' ||
          data.status === 'maintenance';

        if (isMaint) {
          return {
            isMaintenance: true,
            message:
              data.message ||
              'Sistem sedang dalam pemeliharaan terpusat Pusdatin Kemenag Barito Utara.',
            estimatedEndTime: data.estimatedEndTime || data.eta,
            source: 'http_api',
          };
        }
      }
    } catch {
      // Continue
    }
  }

  return { isMaintenance: false };
}
