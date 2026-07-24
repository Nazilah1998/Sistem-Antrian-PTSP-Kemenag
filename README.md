# PTSP Loket Kemenag - Next.js Full Stack

Sistem Antrian & Pelayanan Loket Terpadu Satu Pintu (PTSP) Kementerian Agama berbasis Next.js Full Stack, Supabase PostgreSQL, Drizzle ORM, dan Cloudflare Turnstile.

## Stack Teknologi
- **Framework**: Next.js 14 (App Router) & React 18
- **Database**: Supabase PostgreSQL (`kemenag_loket` schema)
- **ORM**: Drizzle ORM & Drizzle Kit
- **Keamanan**: Cloudflare Turnstile
- **Styling**: Tailwind CSS & Lucide Icons
- **Realtime**: Supabase Realtime Broadcasting & Web Speech API (TTS Bahasa Indonesia)

## Perintah Pengembangan

```bash
# Inisialisasi dependensi
npm install

# Sinkronisasi schema database ke Supabase
npx drizzle-kit push

# Seed data kategori awal & user admin
npm run db:seed

# Jalankan server pengembangan
npm run dev

# Build produksi
npm run build
npm start
```
