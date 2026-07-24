'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Volume2, Sparkles, Monitor, Radio, VolumeX } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  code: string;
}

interface ActiveQueueItem {
  category: Category;
  queue: {
    id: number;
    number: number;
    status: string;
    counter: string;
    createdAt: string;
  } | null;
}

interface QueueCalledPayload {
  id: number;
  number: number;
  counter: string;
  categoryId: number;
  category: Category;
  isRecall?: boolean;
}

export default function TvDisplay() {
  const [activeQueues, setActiveQueues] = useState<ActiveQueueItem[]>([]);
  const [currentCall, setCurrentCall] = useState<{
    code: string;
    number: number;
    categoryName: string;
    counter: string;
  } | null>(null);

  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isCallingAnimation, setIsCallingAnimation] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    fetchActiveQueues();

    const clockInterval = setInterval(() => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    }, 1000);

    const channel = supabase
      .channel('queue-updates')
      .on('broadcast', { event: 'queue-called' }, (payload) => {
        const queueData: QueueCalledPayload = payload.payload;
        if (queueData && queueData.category) {
          handleNewQueueCalled(queueData);
        }
      })
      .subscribe();

    return () => {
      clearInterval(clockInterval);
      supabase.removeChannel(channel);
    };
  }, [audioEnabled]);

  const fetchActiveQueues = async () => {
    try {
      const res = await fetch('/api/queue/active');
      if (res.ok) {
        const data = await res.json();
        setActiveQueues(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewQueueCalled = (q: QueueCalledPayload) => {
    const code = q.category.code;
    const counterStr = q.counter || '01';

    setCurrentCall({
      code,
      number: q.number,
      categoryName: q.category?.name || 'Pelayanan PTSP',
      counter: counterStr,
    });

    setIsCallingAnimation(true);
    setTimeout(() => setIsCallingAnimation(false), 5000);

    fetchActiveQueues();

    if (audioEnabled) {
      // Play Bel Chime sound first, then speak
      playChimeSound();
      setTimeout(() => {
        speakQueue(code, q.number, counterStr);
      }, 1200);
    }
  };

  const playChimeSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Tone 1 (D5 - 587.33 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.8);

      // Tone 2 (A5 - 880 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.4);
      gain2.gain.setValueAtTime(0.35, ctx.currentTime + 0.4);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 1.4);
    } catch (err) {
      console.error('Audio chime error:', err);
    }
  };

  const speakQueue = (code: string, number: number, counter: string) => {
    if (!('speechSynthesis' in window)) return;

    const formattedNum = String(number).split('').join(' ');
    const text = `Nomor antrian ${code}, ${formattedNum}, silakan menuju ke loket ${counter}`;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans overflow-hidden select-none relative w-full">
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Official TV Header */}
      <header className="bg-slate-900/90 border-b border-emerald-500/30 px-8 py-5 flex items-center justify-between shadow-2xl backdrop-blur-xl z-20 w-full">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 relative flex items-center justify-center p-1.5 bg-white/10 rounded-2xl border border-white/20 shadow-lg">
            <Image
              src="/kemenag.svg"
              alt="Logo Kemenag"
              width={52}
              height={52}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              PELAYANAN TERPADU SATU PINTU (PTSP)
            </h1>
            <p className="text-sm font-semibold text-emerald-300 flex items-center gap-2 mt-0.5">
              <span>KEMENTERIAN AGAMA REPUBLIK INDONESIA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="text-amber-300 font-bold">MONITOR DISPLAY TV</span>
            </p>
          </div>
        </div>

        {/* Audio Toggle & Clock */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-3 rounded-2xl border transition-all flex items-center gap-2 text-xs font-bold ${
              audioEnabled
                ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950 border-rose-500/40 text-rose-300'
            }`}
            title="Toggle Audio Voice Announcement"
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Suara & Bel Aktif</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-rose-400" />
                <span>Suara Mute</span>
              </>
            )}
          </button>

          <div className="bg-slate-950 border border-slate-800 px-6 py-2.5 rounded-2xl shadow-inner text-right">
            <div className="text-3xl font-black text-amber-300 tracking-wider font-mono">
              {timeStr || '00:00:00'}
            </div>
            <div className="text-xs font-semibold text-slate-400">{dateStr}</div>
          </div>
        </div>
      </header>

      {/* Main TV Layout */}
      <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch z-10 w-full">
        {/* Left 7 Columns: Hero Current Active Call Display Box */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className={`h-full rounded-3xl bg-slate-900/90 border-2 ${
            isCallingAnimation ? 'border-amber-400 shadow-2xl shadow-amber-500/30 scale-[1.01]' : 'border-emerald-500/30'
          } p-8 md:p-10 shadow-2xl transition-all duration-500 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl`}>
            
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-sm font-extrabold tracking-wider uppercase shadow-md">
                <Radio className="w-4 h-4 animate-pulse text-amber-300" /> PANGGILAN ANTRIAN SEKARANG
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-700/50 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Supabase Realtime
              </span>
            </div>

            {/* Central Number Box */}
            <div className="my-6 text-center py-10 md:py-14 rounded-3xl bg-slate-950 border border-emerald-500/30 shadow-2xl relative">
              <div className="text-slate-300 text-sm md:text-base font-bold uppercase tracking-widest mb-3">
                {currentCall?.categoryName || 'SIAP MELAYANI MASYARAKAT'}
              </div>

              <div className="text-7xl md:text-9xl font-black text-amber-300 tracking-wider font-mono drop-shadow-[0_10px_20px_rgba(245,176,65,0.25)]">
                {currentCall ? `${currentCall.code}-${String(currentCall.number).padStart(3, '0')}` : '---'}
              </div>

              <div className="mt-4 text-xs font-bold text-emerald-400 tracking-wider uppercase">
                {currentCall ? 'Status: Dipanggil Ke Loket' : 'Menunggu Panggilan Operator Loket'}
              </div>
            </div>

            {/* Target Counter */}
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 border border-emerald-400/40 rounded-2xl p-6 text-center shadow-xl">
              <span className="text-slate-200 text-xs md:text-sm font-extrabold uppercase tracking-widest block">SILAKAN MENUJU KE</span>
              <div className="text-4xl md:text-6xl font-black text-white tracking-wider mt-1 font-mono">
                LOKET {currentCall?.counter || '01'}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Status Cards for All Counters */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black text-emerald-300 uppercase tracking-widest flex items-center gap-2">
              <Monitor className="w-4 h-4 text-amber-400" /> STATUS SELURUH LOKET
            </h2>
            <span className="text-[11px] text-slate-400 font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Live Realtime
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 flex-1">
            {activeQueues.map((item) => {
              const numStr = item.queue ? `${item.category.code}-${String(item.queue.number).padStart(3, '0')}` : '---';
              const counterStr = item.queue?.counter || '01';

              return (
                <div
                  key={item.category.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl hover:border-emerald-500/50 transition-all backdrop-blur-md"
                >
                  <div className="max-w-[65%]">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-amber-300 font-black text-sm flex items-center justify-center border border-emerald-500/40 shadow-inner">
                        {item.category.code}
                      </span>
                      <span className="font-extrabold text-white text-base truncate">{item.category.name}</span>
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800/40">
                      Petugas Loket {counterStr}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-black text-amber-300 font-mono tracking-wider drop-shadow">
                      {numStr}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Official Marquee Ticker Footer */}
      <footer className="bg-slate-900 border-t border-emerald-700/50 py-3.5 px-8 flex items-center overflow-hidden z-20 shadow-2xl w-full">
        <div className="bg-amber-400 text-slate-950 px-4 py-1.5 rounded-lg text-xs font-black tracking-widest shrink-0 mr-4 shadow-md flex items-center gap-2">
          <Image src="/kemenag.svg" alt="Logo" width={16} height={16} />
          <span>INFO PTSP</span>
        </div>
        <div className="whitespace-nowrap overflow-hidden relative flex-1 text-sm font-bold text-emerald-100">
          <div className="inline-block animate-marquee tracking-wider">
            Selamat datang di Pelayanan Terpadu Satu Pintu (PTSP) Kementerian Agama &bull; Mohon menunggu hingga nomor antrian Anda dipanggil &bull; Siapkan dokumen berkas persyaratan Anda &bull; Melayani Sepenuh Hati, Transparan, Bebas Pungli, dan Akuntabel &bull; 5 Nilai Budaya Kerja: Integritas, Profesionalitas, Inovasi, Tanggung Jawab, Keteladanan.
          </div>
        </div>
      </footer>
    </div>
  );
}
