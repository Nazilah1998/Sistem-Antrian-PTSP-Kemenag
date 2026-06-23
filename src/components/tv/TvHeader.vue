<template>
  <header class="bg-gradient-to-r from-kemenag-green-dark via-kemenag-green to-[#00a85f] text-white px-8 py-5 flex justify-between items-center shadow-xl z-10 relative border-b-4 border-kemenag-gold">
    <!-- Left: Logo & Title -->
    <div class="flex items-center gap-6">
      <div class="w-20 h-20 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] p-2">
        <img src="/kemenag.svg" alt="Logo Kemenag" class="w-full h-full object-contain" />
      </div>
      <div class="flex flex-col drop-shadow-md">
        <h1 class="text-[32px] font-extrabold uppercase tracking-widest text-white m-0 leading-tight">Pelayanan Terpadu Satu Pintu</h1>
        <h2 class="text-xl font-semibold text-kemenag-gold m-0 leading-tight mt-1">Kementerian Agama Kabupaten Barito Utara</h2>
      </div>
    </div>

    <!-- Right: Real-time Clock -->
    <div class="flex flex-col items-end text-right bg-white/10 px-6 py-2 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
      <div class="text-5xl font-extrabold font-mono tracking-widest text-white drop-shadow-lg">
        {{ currentTime }}
      </div>
      <div class="text-[17px] font-bold text-kemenag-gold uppercase tracking-[0.2em] mt-1">
        {{ currentDate }}
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';


const currentTime = ref('');
const currentDate = ref('');
let timer: ReturnType<typeof setInterval>;

const updateTime = () => {
  const now = new Date();
  
  // Format Time (HH:MM:SS)
  currentTime.value = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  // Format Date (Hari, Tanggal Bulan Tahun)
  currentDate.value = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>
