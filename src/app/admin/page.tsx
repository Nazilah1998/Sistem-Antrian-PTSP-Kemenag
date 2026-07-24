'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Volume2,
  PhoneCall,
  RotateCcw,
  Plus,
  Minus,
  Sliders,
  LogOut,
  UserCheck,
  Sparkles,
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  code: string;
}

interface ActiveQueue {
  category: Category;
  queue: {
    id: number;
    number: number;
    status: string;
    counter: string;
    createdAt: string;
  } | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeQueues, setActiveQueues] = useState<ActiveQueue[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [counter, setCounter] = useState('01');
  const [customNumber, setCustomNumber] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ name?: string; username: string } | null>(null);

  useEffect(() => {
    // Check client session
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
    fetchCategories();
    fetchActiveQueues();

    const interval = setInterval(() => {
      fetchActiveQueues();
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (data.length > 0 && !selectedCatId) {
          setSelectedCatId(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  const callNextQueue = async (catId: number) => {
    setLoading(true);
    try {
      const res = await fetch('/api/queue/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: catId, counter }),
      });
      if (res.ok) {
        await fetchActiveQueues();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const recallQueue = async (queueId?: number) => {
    if (!queueId) return;
    setLoading(true);
    try {
      await fetch('/api/queue/recall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueId, counter }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const adjustQueue = async (catId: number, action: 'INCREMENT' | 'DECREMENT' | 'SET', value?: number) => {
    setLoading(true);
    try {
      const res = await fetch('/api/queue/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: catId, action, value, counter }),
      });
      if (res.ok) {
        await fetchActiveQueues();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const playTestVoice = () => {
    if ('speechSynthesis' in window) {
      const selectedCat = categories.find((c) => c.id === selectedCatId);
      const code = selectedCat ? selectedCat.code : 'A';
      const text = `Nomor Antrian ${code} 001, silakan menuju ke Loket ${counter}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentSelectedQueueInfo = activeQueues.find((a) => a.category.id === selectedCatId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans w-full">
      {/* Top Navbar Full Width */}
      <header className="w-full bg-slate-900 border-b border-emerald-500/30 px-6 lg:px-12 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative flex items-center justify-center p-1 bg-white/10 rounded-xl border border-white/20">
            <Image
              src="/kemenag.svg"
              alt="Kemenag"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white">Dashboard Petugas PTSP</h1>
            <p className="text-xs text-emerald-300">Kementerian Agama RI &bull; Operational Counter</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Counter Selector */}
          <div className="flex items-center gap-2 bg-slate-950 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-slate-400 font-semibold">Loket Anda:</span>
            <select
              value={counter}
              onChange={(e) => setCounter(e.target.value)}
              className="bg-transparent text-amber-300 font-extrabold text-sm focus:outline-none cursor-pointer"
            >
              <option value="01" className="bg-slate-900 text-white">Loket 01</option>
              <option value="02" className="bg-slate-900 text-white">Loket 02</option>
              <option value="03" className="bg-slate-900 text-white">Loket 03</option>
              <option value="04" className="bg-slate-900 text-white">Loket 04</option>
              <option value="05" className="bg-slate-900 text-white">Loket 05</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-300 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-700/40">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>{user?.name || user?.username || 'Operator Loket'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container Full Width */}
      <main className="w-full flex-1 px-6 lg:px-12 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Primary Call Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Tabs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Pilih Layanan Loket
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => {
                const isActive = selectedCatId === cat.id;
                const catActiveQueue = activeQueues.find((a) => a.category.id === cat.id);
                const currentNum = catActiveQueue?.queue ? catActiveQueue.queue.number : 0;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCatId(cat.id)}
                    className={`p-4 rounded-xl text-left border transition-all flex justify-between items-center ${
                      isActive
                        ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-amber-300 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                          {cat.code}
                        </span>
                        <span className="font-bold text-sm text-white">{cat.name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">Nomor:</span>
                      <span className="font-extrabold text-amber-300 text-lg font-mono">
                        {cat.code}-{String(currentNum).padStart(3, '0')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Call Control Card */}
          {selectedCatId && (
            <div className="bg-gradient-to-br from-slate-900 via-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                    Layanan Aktif Terpilih
                  </span>
                  <h3 className="text-2xl font-black text-white mt-2">
                    {currentSelectedQueueInfo?.category.name} ({currentSelectedQueueInfo?.category.code})
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-300 font-semibold">Posisi Petugas:</span>
                  <div className="text-xl font-black text-white font-mono">LOKET {counter}</div>
                </div>
              </div>

              {/* Big Queue Display Number */}
              <div className="my-6 text-center py-10 rounded-3xl bg-slate-950 border border-white/10 backdrop-blur-md relative shadow-inner">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">
                  Nomor Antrian Dipanggil
                </div>
                <div className="text-6xl md:text-8xl font-black text-amber-300 tracking-wider font-mono">
                  {currentSelectedQueueInfo?.category.code}-
                  {String(currentSelectedQueueInfo?.queue?.number || 0).padStart(3, '0')}
                </div>
                <div className="mt-2 text-xs text-emerald-400 font-medium">
                  {currentSelectedQueueInfo?.queue ? `Terakhir dipanggil pada ${new Date(currentSelectedQueueInfo.queue.createdAt).toLocaleTimeString('id-ID')}` : 'Belum ada panggilan antrian'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  disabled={loading}
                  onClick={() => callNextQueue(selectedCatId)}
                  className="py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-950/50 transition-all flex items-center justify-center gap-3 border border-emerald-400/30 active:scale-95 disabled:opacity-50"
                >
                  <PhoneCall className="w-5 h-5 text-amber-300" />
                  <span>PANGGIL SELANJUTNYA</span>
                </button>

                <button
                  disabled={loading || !currentSelectedQueueInfo?.queue}
                  onClick={() => recallQueue(currentSelectedQueueInfo?.queue?.id)}
                  className="py-4 px-6 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-base shadow-xl shadow-amber-950/50 transition-all flex items-center justify-center gap-3 border border-amber-400/30 active:scale-95 disabled:opacity-50"
                >
                  <RotateCcw className="w-5 h-5 text-slate-950" />
                  <span>PANGGIL ULANG (RECALL)</span>
                </button>
              </div>

              {/* Adjust / Manual Counter Section */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Koreksi Nomor Manual:</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustQueue(selectedCatId, 'DECREMENT')}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    title="Kurangi 1"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => adjustQueue(selectedCatId, 'INCREMENT')}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    title="Tambah 1"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1.5 ml-2">
                    <input
                      type="number"
                      value={customNumber}
                      onChange={(e) => setCustomNumber(Number(e.target.value))}
                      placeholder="No."
                      className="w-16 bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-center text-white"
                    />
                    <button
                      onClick={() => adjustQueue(selectedCatId, 'SET', customNumber)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold"
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Monitor Overview & Speech Test */}
        <div className="space-y-6">
          {/* Audio Test Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400" />
              Uji Coba Suara (TTS)
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Tes panggil suara Bahasa Indonesia untuk memastikan sistem audio speaker antrian bekerja dengan baik.
            </p>
            <button
              onClick={playTestVoice}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Putar Suara Pemanggilan
            </button>
          </div>

          {/* All Categories Status Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4">Status Seluruh Loket</h3>
            <div className="space-y-3">
              {activeQueues.map((item) => (
                <div
                  key={item.category.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{item.category.name}</span>
                    <span className="text-slate-500 text-[10px]">Kode: {item.category.code}</span>
                  </div>
                  <div className="text-right font-mono font-bold text-amber-300 text-base">
                    {item.category.code}-{String(item.queue?.number || 0).padStart(3, '0')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
