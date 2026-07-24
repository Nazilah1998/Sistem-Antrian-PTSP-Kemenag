'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Ticket, CheckCircle, Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  code: string;
}

export default function KioskPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [generatedTicket, setGeneratedTicket] = useState<{
    code: string;
    number: number;
    categoryName: string;
    createdAt: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const takeTicket = async (cat: Category) => {
    setLoading(true);
    setSelectedCategory(cat);

    try {
      const res = await fetch('/api/queue/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: cat.id, counter: '01' }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedTicket({
          code: cat.code,
          number: data.number,
          categoryName: cat.name,
          createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 font-sans relative overflow-hidden w-full">
      {/* Glow Backdrops */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Full Width */}
      <header className="w-full flex items-center justify-between z-10 py-4 px-4 lg:px-8 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 relative flex items-center justify-center p-1 bg-white/10 rounded-xl border border-white/20">
            <Image
              src="/kemenag.svg"
              alt="Kemenag"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Anjungan Kiosk PTSP</h1>
            <p className="text-xs text-emerald-300">Cetak Tiket Antrian Mandiri Pengunjung</p>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Portal
        </Link>
      </header>

      {/* Main Kiosk Content Full Width */}
      <main className="w-full px-4 lg:px-12 my-auto z-10 py-10">
        {!generatedTicket ? (
          <div>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">
                Pilih Layanan Yang Anda Butuhkan
              </h2>
              <p className="text-slate-400 text-sm md:text-base">
                Sentuh salah satu kotak kategori di bawah untuk mencetak nomor tiket antrian Anda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  disabled={loading}
                  onClick={() => takeTicket(cat)}
                  className="group p-8 md:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500 hover:bg-emerald-950/40 transition-all duration-300 shadow-2xl flex items-center justify-between text-left disabled:opacity-50"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-amber-300 font-black text-3xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                      {cat.code}
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 font-semibold">Sentuh untuk ambil tiket antrian</p>
                    </div>
                  </div>
                  <Ticket className="w-8 h-8 text-slate-600 group-hover:text-emerald-400 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Generated Ticket Receipt Screen */
          <div className="max-w-md mx-auto bg-white text-slate-900 rounded-3xl p-8 shadow-2xl text-center border border-slate-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">Tiket Berhasil Dicetak!</h3>
            <p className="text-xs text-slate-500 mt-1">PTSP Kementerian Agama RI</p>

            <div className="my-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
                {generatedTicket.categoryName}
              </div>
              <div className="text-6xl font-black text-emerald-700 tracking-wider font-mono my-3">
                {generatedTicket.code}-{String(generatedTicket.number).padStart(3, '0')}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Pukul: {generatedTicket.createdAt}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Printer className="w-4 h-4" /> Cetak Tiket
              </button>
              <button
                onClick={() => setGeneratedTicket(null)}
                className="py-3.5 px-5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-sm rounded-xl transition-all"
              >
                Selesai
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-slate-500 z-10 py-3 border-t border-slate-800/40">
        Kementerian Agama Republik Indonesia &bull; PTSP Digital Ticket Kiosk
      </footer>
    </div>
  );
}
