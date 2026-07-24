'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Users, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface TicketInfo {
  id: number;
  ticketNumber: string;
  categoryName: string;
  categoryCode: string;
  status: string;
  counter: string;
  queueAheadCount: number;
  estimatedMinutes: number;
  createdAt: string;
}

export default function TicketTrackPage({ params }: { params: { id: string } }) {
  const [ticket, setTicket] = useState<TicketInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTicketStatus = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/queue/track/${params.id}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Gagal memuat info tiket');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setTicket(data);
    } catch (err) {
      console.error(err);
      setError('Koneksi server terganggu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketStatus();
    const interval = setInterval(fetchTicketStatus, 5000);
    return () => clearInterval(interval);
  }, [params.id]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center p-4 font-sans relative overflow-hidden select-none">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-md flex items-center justify-between z-20 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Beranda</span>
        </Link>
        <button
          onClick={fetchTicketStatus}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3 py-2 rounded-xl active:scale-95 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Update Status</span>
        </button>
      </header>

      {/* Centered Ticket Card */}
      <main className="w-full max-w-md flex-1 flex flex-col justify-center items-center z-10 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-slate-900/90 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-7 shadow-2xl relative overflow-hidden text-center"
        >
          {/* Official Logo */}
          <div className="w-16 h-16 relative flex items-center justify-center p-2 bg-white/10 rounded-2xl mx-auto mb-4 border border-white/20 shadow-xl">
            <Image src="/kemenag.svg" alt="Logo Kemenag" width={48} height={48} className="object-contain" />
          </div>

          <span className="text-[11px] font-extrabold text-emerald-300 uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-700/50 inline-block mb-2">
            TIKET ANTRIAN DIGITAL &bull; PTSP
          </span>

          {error ? (
            <div className="my-6 p-4 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-bold flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          ) : ticket ? (
            <>
              <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mt-2">
                {ticket.categoryName}
              </div>

              {/* Big Ticket Number */}
              <div className="my-6 py-6 rounded-2xl bg-slate-950 border border-emerald-500/40 shadow-inner">
                <div className="text-5xl md:text-6xl font-black text-amber-300 font-mono tracking-wider">
                  {ticket.ticketNumber}
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                {ticket.status === 'CALLED' ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-black text-sm animate-pulse">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>SILAKAN MENUJU LOKET {ticket.counter}</span>
                  </div>
                ) : ticket.status === 'WAITING' ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-extrabold text-xs">
                    <Clock className="w-4 h-4 text-amber-300" />
                    <span>STATUS: MENUNGGU PANGGILAN</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs">
                    <span>SELESAI TERLAYANI</span>
                  </div>
                )}
              </div>

              {/* Info Stats Cards */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Antrian Di Depan</span>
                  </div>
                  <div className="text-xl font-black text-white font-mono">
                    {ticket.queueAheadCount} Orang
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Estimasi Tunggu</span>
                  </div>
                  <div className="text-xl font-black text-amber-300 font-mono">
                    &plusmn; {ticket.estimatedMinutes} Menit
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-slate-400 text-xs font-bold">Memuat info status tiket...</div>
          )}
        </motion.div>
      </main>

      <footer className="text-xs text-slate-500 text-center py-2 z-20">
        Pelayanan Terpadu Satu Pintu &bull; Kementerian Agama RI
      </footer>
    </div>
  );
}
