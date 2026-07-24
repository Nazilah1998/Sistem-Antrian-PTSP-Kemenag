'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Turnstile } from '@marsidev/react-turnstile';
import { User, Lock, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAADR1O_LSp1lgc3km';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login gagal. Cek kembali username & password Anda.');
        setLoading(false);
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      router.push('/admin');
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi server');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center bg-gradient-to-b from-emerald-50/70 via-teal-50/40 to-slate-100 text-slate-800 p-4 relative overflow-hidden font-sans select-none">
      {/* Floating Bokeh Bubbles Canvas */}
      <ParticleBackground />

      {/* Top Back Link Header */}
      <header className="w-full max-w-5xl flex items-center justify-between z-20 py-4 px-2">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-extrabold text-slate-600 hover:text-emerald-700 transition-colors bg-white/80 border border-slate-200/80 shadow-sm backdrop-blur-md px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </header>

      {/* Centered Main Login Container */}
      <main className="w-full flex-1 flex flex-col items-center justify-center z-10 py-6 px-4 max-w-lg mx-auto">
        {/* Top Kemenag Emblem & Title Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 flex flex-col items-center"
        >
          {/* Logo Badge */}
          <div className="w-20 h-20 relative flex items-center justify-center p-2.5 bg-white rounded-3xl mb-4 shadow-xl border border-slate-100">
            <Image
              src="/kemenag.svg"
              alt="Logo Kemenag"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>

          <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-widest bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-200 mb-2">
            &bull; KEMENTERIAN AGAMA KABUPATEN BARITO UTARA &bull;
          </span>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-1.5">
            LOKET PTSP
          </h1>

          <p className="text-xs md:text-sm font-semibold text-slate-500 max-w-sm">
            Sistem Informasi Antrian & Pelayanan Terpadu Satu Pintu
          </p>
        </motion.div>

        {/* Clean White Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-7 md:p-9 shadow-2xl shadow-emerald-950/5 relative"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-700 text-xs font-bold"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
                USERNAME / EMAIL ADMIN
              </label>
              <div className="relative flex items-center rounded-2xl bg-slate-100/80 border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/15 transition-all">
                <User className="w-5 h-5 text-slate-400 absolute left-4" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-transparent py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
                PASSWORD
              </label>
              <div className="relative flex items-center rounded-2xl bg-slate-100/80 border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/15 transition-all">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Cloudflare Turnstile Integration */}
            <div className="flex justify-center pt-2 pb-1 overflow-hidden">
              <Turnstile
                siteKey={siteKey}
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => setError('Gagal memuat verifikasi Cloudflare Turnstile')}
                options={{
                  theme: 'light',
                }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-600/30 transition-all duration-200 flex items-center justify-center gap-2 tracking-wider uppercase border border-emerald-500/30 disabled:opacity-50"
            >
              {loading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <span>MASUK KE DASHBOARD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </main>

      {/* Official Footer */}
      <footer className="w-full text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest z-20 py-4">
        &copy; {new Date().getFullYear()} LOKET PTSP KEMENAG BARITO UTARA
      </footer>
    </div>
  );
}
