# Product Requirements Document (PRD)
## Sistem Antrian Cerdas PTSP Kemenag Barito Utara

**Tanggal Pembuatan:** 23 Juni 2026
**Proyek:** Layar Tampilan & Manajemen Antrian Ruang Tunggu PTSP
**Klien:** Kementerian Agama (Kemenag) Kabupaten Barito Utara

---

## 1. Pendahuluan
Dokumen ini menguraikan spesifikasi, fitur, dan kebutuhan teknis untuk pembuatan Sistem Layar Antrian Cerdas di Pelayanan Terpadu Satu Pintu (PTSP) Kemenag Barito Utara. Sistem ini dirancang untuk beroperasi secara *real-time*, mandiri di VPS, dan diakses melalui *browser* pada layar TV Landscape di ruang tunggu.

## 2. Visi Produk
Memberikan pengalaman pelayanan publik yang modern, informatif, dan nyaman bagi masyarakat yang berkunjung ke PTSP Kemenag Barito Utara, sekaligus mempermudah tugas admin dan petugas loket dalam mengelola antrian.

---

## 3. Fitur Utama (Features & Requirements)

### 3.1. Sistem Manajemen Antrian (Kategorikal)
*   **Kategori Layanan:** Antrian dibagi berdasarkan bidang layanan (Misal: A - Haji & Umrah, B - Bimas Islam, C - Pendidikan Madrasah, dll).
*   **Pemanggilan Real-Time:** Perubahan nomor antrian yang dipanggil dari *dashboard* admin langsung tampil di layar TV ruang tunggu tanpa perlu *refresh* halaman (berbasis WebSocket).
*   **Daftar Tunggu:** Menampilkan nomor antrian yang sedang dilayani saat ini (ukuran besar) dan nomor-nomor antrian berikutnya (ukuran lebih kecil).

### 3.2. Manajemen Audio & Suara (Fleksibel)
*   **Pemanggilan Suara (Opsional):** Admin dapat beralih antara menggunakan pemanggilan suara otomatis (*Text-to-Speech* bahasa Indonesia) atau hanya menggunakan notifikasi visual (bunyi bel/chime *ding-dong* & layar berkedip).
*   **Audio Latar Belakang (Dynamic Background Audio):** Sistem dilengkapi pemutar audio latar (BGM) yang akan mengecil/berhenti sejenak saat ada panggilan antrian. Admin bebas mengunggah, memilih, dan memutar audio latar apa saja melalui *dashboard* (tidak terpaku hanya pada instrumen atau murottal).

### 3.3. Modul Informasi Terintegrasi
*   **Berita Otomatis (News Scraper/API):** Menarik dan menampilkan 5 judul berita terbaru secara otomatis dari *https://baritoutara.kemenag.go.id/berita*.
*   **Jadwal Sholat Real-Time:** Menampilkan jadwal sholat 5 waktu secara spesifik untuk area Kabupaten Barito Utara yang diperbarui otomatis setiap hari.
*   **Jam & Tanggal:** Menampilkan waktu saat ini (Hari, Tanggal, Jam, Menit, Detik) dengan format zona waktu setempat (WIB/WITA sesuai letak geografis Barito Utara).
*   **Informasi Layanan & Running Text:** Admin dapat memasukkan teks informasi pelayanan atau pengumuman penting yang berjalan di bagian bawah layar (*marquee*).

### 3.4. Dashboard Admin & Petugas
*   Akses login aman untuk Admin (manajemen konten, audio, kategori) dan Petugas Loket (tombol 'Next', 'Recall'/'Panggil Ulang').
*   Kontrol penuh untuk *on/off* fitur suara, *upload* lagu latar belakang, dan menambah/mengubah kategori layanan.

---

## 4. Desain & Antarmuka (UI/UX)

*   **Orientasi:** Landscape (16:9), dioptimalkan untuk Smart TV atau Monitor PC beresolusi minimal 1080p (Full HD).
*   **Nuansa Kemenag (Tema Visual):**
    *   **Warna Dominan:** Hijau khas logo Kemenag, dikombinasikan dengan putih bersih untuk keterbacaan tinggi, serta aksen emas/kuning untuk kesan elegan.
    *   **Elemen Grafis:** Sentuhan ornamen Islami modern (seperti motif geometris tipis/transparan di *background* atau sudut layar) yang merepresentasikan slogan "Ikhlas Beramal".
    *   **Tipografi:** *Font* *sans-serif* yang tegas, modern, dan mudah dibaca dari jarak jauh (misal: Inter, Roboto, atau Poppins).
*   **Struktur Tata Letak (Usulan Layout):**
    *   **Header (Atas):** Logo Kemenag Kab. Barito Utara, Nama Kantor, Tanggal & Jam Digital ukuran sedang.
    *   **Main Kiri (60%):** Kotak besar berisi Nomor Antrian yang Sedang Dipanggil beserta Nomor Loket tujuannya. (Saat idle bisa menampilkan slideshow foto Kemenag atau visualizer audio latar).
    *   **Main Kanan (40%):** Widget Jadwal Sholat hari ini & Daftar antrian sebelumnya/selanjutnya berdasarkan masing-masing kategori.
    *   **Footer (Bawah):** *Running text* pengumuman. Di atasnya terdapat kolom/slider untuk menampilkan 5 Berita Terbaru.

---

## 5. Rekomendasi Teknologi (Tech Stack)

Sesuai permintaan untuk menggunakan teknologi modern, ringan, *real-time*, **serta tidak menggunakan PHP/Laravel**, berikut adalah rekomendasi arsitektur sistem:

### 5.1. Frontend (Layar TV & Dashboard Admin)
*   **Framework:** **Vue.js 3** (dengan *build tool* Vite) atau **React.js**. *Rekomendasi utama: Vue.js 3* karena sintaksnya sangat rapi, ringan, performa rendering tinggi, dan sangat mudah untuk *maintenance* jangka panjang.
*   **Styling:** **Tailwind CSS** (mempermudah pembuatan desain *custom* bernuansa Kemenag dengan cepat tanpa file CSS yang membengkak).
*   **Audio/TTS:** HTML5 Web Speech API untuk fitur *Text-to-Speech* bahasa Indonesia.

### 5.2. Backend & Real-time Engine
*   **Environment:** **Node.js**. Sangat cepat untuk menangani *event* I/O (seperti pemanggilan antrian).
*   **Framework:** **Express.js** atau **Fastify** (sangat ringan dan *to the point*).
*   **Real-time Communication:** **Socket.io**. Memastikan saat admin mengklik "Panggil", layar TV langsung merespons dalam hitungan milidetik.
*   **Web Scraper (Untuk Berita):** Menggunakan *library* **Cheerio** atau **Puppeteer** di dalam Node.js untuk secara berkala men-*scrape* 5 berita terbaru dari web Kemenag Barito Utara (jika tidak ada API JSON yang tersedia).

### 5.3. Database
*   **Database:** **PostgreSQL** atau **SQLite** (Jika ingin sangat *portable* dan ringan tanpa *setup database server* yang berat, SQLite + Prisma ORM sudah sangat mumpuni untuk menyimpan data antrian harian dan pengaturan *dashboard*).

---

## 6. Kebutuhan Deployment & Server
*   **Server:** Virtual Private Server (VPS) Linux (contoh: Ubuntu 22.04/24.04).
*   **Web Server / Reverse Proxy:** **Nginx** (untuk mengatur domain/IP port *routing*).
*   **Process Manager:** **PM2** (memastikan aplikasi Node.js selalu hidup *24/7* dan otomatis *restart* jika VPS di-*reboot*).
