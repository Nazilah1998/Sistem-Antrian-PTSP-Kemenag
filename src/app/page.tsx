'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { Tv, Ticket, ArrowRight, ShieldCheck, Sparkles, Award, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';

interface Stats {
  totalToday: number;
  calledToday: number;
  waitingToday: number;
  isOpen: boolean;
  operationalStatus: string;
  operatingHoursText: string;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans w-full">
      {/* Ambient Glow Atmosphere */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] bg-teal-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full py-5 px-6 md:px-12 lg:px-16 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl z-20 sticky top-0"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 relative flex items-center justify-center p-1.5 bg-white/10 rounded-2xl border border-white/20 shadow-lg">
            <Image
              src="/kemenag.svg"
              alt="Logo Kemenag"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
              Loket PTSP
            </h1>
            <p className="text-xs text-slate-400 font-medium">Pelayanan Terpadu Satu Pintu Kementerian Agama RI</p>
          </div>
        </div>

        {/* Animated Login Button */}
        <Link href="/login">
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="relative group cursor-pointer"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse" />
            <div className="relative flex items-center gap-2.5 px-5 py-2.5 bg-slate-900 border border-emerald-400/40 rounded-xl text-xs font-extrabold text-white shadow-xl">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Login Petugas / Operator</span>
            </div>
          </motion.div>
        </Link>
      </motion.header>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full px-6 md:px-12 lg:px-16 py-10 md:py-14 flex-1 flex flex-col justify-center items-center z-10"
      >
        {/* Headline & Live Status Badge */}
        <motion.div variants={itemVariants} className="text-center max-w-4xl mb-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900 border border-emerald-500/40 text-xs font-extrabold text-white mb-6 backdrop-blur-md shadow-lg">
            <span className={`w-2.5 h-2.5 rounded-full ${stats?.isOpen ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
            <span className="text-emerald-300">STATUS OPERASIONAL: {stats?.operationalStatus || 'BUKA'}</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-300 font-medium">{stats?.operatingHoursText || 'Senin - Jumat | 08.00 - 15.30'}</span>
          </div>

          <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
            Sistem Antrian Digital <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Loket PTSP Kementerian Agama
            </span>
          </h2>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Silakan pilih modul pelayanan di bawah ini untuk menampilkan Layar Monitor TV Publik atau Anjungan Mandiri Cetak Tiket Pengunjung.
          </p>
        </motion.div>

        {/* Realtime Live Stats Bar */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-amber-300 font-mono">{stats?.calledToday || 0}</span>
              <span className="block text-xs font-semibold text-slate-400">Antrian Dipanggil Hari Ini</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-white font-mono">{stats?.totalToday || 0}</span>
              <span className="block text-xs font-semibold text-slate-400">Total Pengunjung Hari Ini</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-emerald-300 font-mono">{stats?.waitingToday || 0}</span>
              <span className="block text-xs font-semibold text-slate-400">Sisa Antrian Menunggu</span>
            </div>
          </div>
        </motion.div>

        {/* 2 Main Public Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Card 1: Display TV */}
          <motion.div variants={itemVariants}>
            <Link
              href="/display"
              className="group relative block p-8 md:p-12 rounded-3xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-400/60 transition-all duration-300 shadow-2xl overflow-hidden backdrop-blur-xl h-full flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
              <div>
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-6 text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors shadow-md">
                  <Tv className="w-8 h-8" />
                </div>
                <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-md border border-amber-400/20 inline-block mb-3">
                  Tampilan Publik TV
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 group-hover:text-amber-300 transition-colors">
                  Layar Monitor TV
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Tampilan layar antrian publik untuk monitor TV utama yang dilengkapi pemanggilan suara sintetis (TTS) Bahasa Indonesia otomatis.
                </p>
              </div>
              <div className="mt-10 flex items-center justify-between text-sm font-extrabold text-amber-300 pt-5 border-t border-slate-800">
                <span>Tampilkan Layar TV</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>

          {/* Card 2: Kiosk Ambil Tiket */}
          <motion.div variants={itemVariants}>
            <Link
              href="/kiosk"
              className="group relative block p-8 md:p-12 rounded-3xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-teal-400/60 transition-all duration-300 shadow-2xl overflow-hidden backdrop-blur-xl h-full flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
              <div>
                <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center mb-6 text-teal-300 group-hover:bg-teal-400 group-hover:text-slate-950 transition-colors shadow-md">
                  <Ticket className="w-8 h-8" />
                </div>
                <span className="text-xs font-black text-teal-400 uppercase tracking-widest bg-teal-400/10 px-3 py-1 rounded-md border border-teal-400/20 inline-block mb-3">
                  Anjungan Mandiri
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 group-hover:text-teal-300 transition-colors">
                  Kiosk Ambil Tiket
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Halaman mandiri masyarakat/pengunjung untuk memilih jenis layanan publik dan mengambil cetakan nomor antrian.
                </p>
              </div>
              <div className="mt-10 flex items-center justify-between text-sm font-extrabold text-teal-300 pt-5 border-t border-slate-800">
                <span>Buka Anjungan Kiosk</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* 5 Nilai Budaya Kerja Badge Bar */}
        <motion.div
          variants={itemVariants}
          className="mt-12 w-full max-w-5xl p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-around gap-4 text-center"
        >
          <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-emerald-300">
            <Award className="w-5 h-5 text-amber-300" />
            <span>5 Nilai Budaya Kerja Kemenag:</span>
          </div>
          <span className="text-xs font-semibold text-slate-300">1. Integritas</span>
          <span className="text-xs font-semibold text-slate-300">2. Profesionalitas</span>
          <span className="text-xs font-semibold text-slate-300">3. Inovasi</span>
          <span className="text-xs font-semibold text-slate-300">4. Tanggung Jawab</span>
          <span className="text-xs font-semibold text-slate-300">5. Keteladanan</span>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 md:px-12 lg:px-16 border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-xs z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image src="/kemenag.svg" alt="Kemenag Logo" width={24} height={24} className="opacity-80" />
          <span>&copy; {new Date().getFullYear()} Kementerian Agama Republik Indonesia &bull; Ikhlas Beramal</span>
        </div>
        <div className="text-slate-500 text-xs font-medium">
          Loket PTSP &bull; Pelayanan Terpadu Satu Pintu Digital
        </div>
      </footer>
    </div>
  );
}
