<template>
  <div class="h-14 bg-gray-900 flex items-center shadow-inner relative z-20">
    <div class="bg-kemenag-green text-white h-full px-6 flex items-center justify-center font-bold tracking-widest z-10 whitespace-nowrap shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
      BERITA TERKINI
    </div>
    <div class="flex-1 overflow-hidden h-full flex items-center relative">
      <div class="animate-marquee whitespace-nowrap flex gap-12 text-white/90 items-center h-full text-lg">
        <span v-for="(news, index) in newsList" :key="index" class="flex items-center gap-4">
          <span class="w-2 h-2 rounded-full bg-kemenag-gold"></span>
          {{ news.title }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// import { createClient } from '@supabase/supabase-js';

const newsList = ref([
  { title: 'Menunggu pembaruan berita dari Supabase Kantor...' },
]);

const fetchNews = async () => {
  // TODO: Configure Supabase integration here once the database is ready
  /*
  const supabaseUrl = 'YOUR_SUPABASE_URL';
  const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from('berita')
      .select('title')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;
    if (data && data.length > 0) {
      newsList.value = data;
    }
  } catch (error) {
    console.error('Error fetching news:', error);
  }
  */
  
  // For now, use dummy news
  newsList.value = [
    { title: 'Kemenag Barito Utara Gelar Manasik Haji Sepanjang Tahun 2026' },
    { title: 'Pendaftaran Sertifikasi Halal Gratis (SEHATI) Diperpanjang' },
    { title: 'Sosialisasi PMA Terbaru tentang Pencatatan Nikah di KUA Muara Teweh' },
    { title: 'Bupati dan Kepala Kemenag Resmikan Gedung Pusat Layanan Haji' },
    { title: 'Pengumuman Penerimaan CPNS Kementerian Agama Formasi 2026' },
  ];
};

onMounted(() => {
  fetchNews();
  // Fetch news every hour
  setInterval(fetchNews, 3600000);
});
</script>

<style scoped>
.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 35s linear infinite;
}

@keyframes marquee {
  0% { transform: translateX(100vw); }
  100% { transform: translateX(-100%); }
}
</style>
