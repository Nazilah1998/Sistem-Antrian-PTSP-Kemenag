export interface MaintenanceStatus {
  isMaintenance: boolean;
  message?: string;
  estimatedEndTime?: string;
}

export async function checkPusdatinMaintenance(): Promise<MaintenanceStatus> {
  const pusdatinUrl = process.env.NEXT_PUBLIC_PUSDATIN_URL || 'https://pusdatin.kemenag-baritoutara.com';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-second timeout

    const res = await fetch(`${pusdatinUrl}/api/maintenance`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      // Fallback check on alternate endpoint if /api/maintenance isn't 200
      const altRes = await fetch(`${pusdatinUrl}/api/status`, {
        method: 'GET',
        cache: 'no-store',
      });
      if (altRes.ok) {
        const altData = await altRes.json();
        return {
          isMaintenance: !!(altData.maintenance || altData.isMaintenance),
          message: altData.message || altData.reason || 'Sistem sedang dalam pemeliharaan rutin terpusat Pusdatin Kemenag.',
          estimatedEndTime: altData.estimatedEndTime,
        };
      }
      return { isMaintenance: false };
    }

    const data = await res.json();
    return {
      isMaintenance: !!(data.maintenance || data.isMaintenance || data.status === 'MAINTENANCE'),
      message: data.message || data.reason || 'Sistem sedang dalam pemeliharaan terpusat Pusdatin Kemenag.',
      estimatedEndTime: data.estimatedEndTime || data.eta,
    };
  } catch (error) {
    // If Pusdatin server is unreachable or times out, assume normal operation (false)
    return { isMaintenance: false };
  }
}
