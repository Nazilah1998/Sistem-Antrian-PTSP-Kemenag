'use client';

import { useState, useEffect } from 'react';

interface MaintenanceStatus {
  isMaintenance: boolean;
  message?: string;
  estimatedEndTime?: string;
}

export default function MaintenanceBlocker({
  children,
  initialIsMaintenance = false,
}: {
  children: React.ReactNode;
  initialIsMaintenance?: boolean;
}) {
  // Sync state with exact initial status evaluated on the Server Side
  const [status, setStatus] = useState<MaintenanceStatus>({ isMaintenance: initialIsMaintenance });

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/pusdatin/maintenance', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.error('Failed to check maintenance status:', err);
    }
  };

  useEffect(() => {
    // Keep background polling every 15 seconds for live status changes
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // 1. If maintenance is active, render official Pusdatin maintenance page
  if (status.isMaintenance) {
    const pusdatinMaintenanceUrl = `https://pusdatin.kemenag-baritoutara.com/maintenance?app=loket_ptsp_kemenag`;

    return (
      <div className="fixed inset-0 w-screen h-screen z-[99999] bg-white overflow-hidden">
        <iframe
          src={pusdatinMaintenanceUrl}
          className="w-full h-full border-0 outline-none"
          title="Pusdatin Official Maintenance Page"
        />
      </div>
    );
  }

  // 2. Render children immediately when initialIsMaintenance is false (ONLINE mode)
  return <>{children}</>;
}
