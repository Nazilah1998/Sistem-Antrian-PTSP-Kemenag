'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShieldAlert, RefreshCw, Clock, Building2 } from 'lucide-react';

interface MaintenanceStatus {
  isMaintenance: boolean;
  message?: string;
  estimatedEndTime?: string;
}

export default function MaintenanceBlocker({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<MaintenanceStatus>({ isMaintenance: false });
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/pusdatin/maintenance', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.error('Failed to check maintenance status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Poll maintenance status every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (status.isMaintenance) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center p-6 font-sans relative overflow-hidden select-none w-full">
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Branding Header */}
        <header className="w-full max-w-5xl flex items-center justify-between z-10 py-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative flex items-center justify-center p-1 bg-white/10 rounded-xl border border-white/20">
              <Image
                src="/kemenag.svg"
                alt="Kemenag Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-white">PUSDATIN KEMENAG RI</h1>
              <p className="text-[11px] text-slate-400">Pusat Data & Teknologi Informasi</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-amber-300 text-xs font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>Pemeliharaan Terpusat Aktif</span>
          </div>
        </header>

        {/* Center Maintenance Card */}
        <main className="max-w-2xl w-full mx-auto my-auto text-center z-10 py-12 px-6">
          <div className="w-20 h-20 bg-amber-500/20 border border-amber-400/40 text-amber-300 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-amber-950/50">
            <Building2 className="w-10 h-10 animate-pulse" />
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
            Sistem Dalam Pemeliharaan Terpusat
          </h2>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
            {status.message ||
              'Aplikasi PTSP Loket Kemenag sedang menjalani pemeliharaan rutin terpusat oleh Pusat Data dan Teknologi Informasi (Pusdatin) Kementerian Agama RI.'}
          </p>

          {status.estimatedEndTime && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-300 mb-8">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Estimasi Selesai: {status.estimatedEndTime}</span>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={() => {
                setLoading(true);
                fetchStatus();
              }}
              disabled={loading}
              className="py-3 px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Cek Status Terbaru</span>
            </button>
          </div>
        </main>

        {/* Official Footer */}
        <footer className="w-full text-center text-xs text-slate-500 z-10 py-4 border-t border-slate-800/80">
          Kementerian Agama Republik Indonesia &bull; Centralized Maintenance Mode Integration
        </footer>
      </div>
    );
  }

  return <>{children}</>;
}
