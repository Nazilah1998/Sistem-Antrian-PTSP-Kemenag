<template>
  <div class="h-screen w-screen bg-[#f0fdf4] overflow-hidden font-sans relative">
    
    <!-- Floating Zoom Controls (Subtle, becomes visible on hover) -->
    <div class="absolute top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-row gap-4 opacity-20 hover:opacity-100 transition-opacity duration-300 bg-black/10 p-2 rounded-full backdrop-blur-sm">
      <button @click="zoomOut" class="bg-white/90 p-2 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.2)] hover:bg-white hover:scale-110 text-kemenag-green transition-all backdrop-blur-md border border-gray-200" title="Perkecil Tampilan">
        <Icon icon="mdi:magnify-minus-outline" class="text-xl" />
      </button>
      <button @click="resetZoom" class="bg-white/90 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.2)] hover:bg-white hover:scale-110 text-gray-700 font-extrabold text-sm w-10 h-10 flex items-center justify-center transition-all backdrop-blur-md border border-gray-200" title="Reset Ukuran">
        {{ Math.round(zoomLevel * 100) }}%
      </button>
      <button @click="zoomIn" class="bg-white/90 p-2 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.2)] hover:bg-white hover:scale-110 text-kemenag-green transition-all backdrop-blur-md border border-gray-200" title="Perbesar Tampilan">
        <Icon icon="mdi:magnify-plus-outline" class="text-xl" />
      </button>
    </div>

    <!-- Scalable Container -->
    <div class="h-full w-full flex flex-col origin-top" :style="{ zoom: zoomLevel }">
      <!-- Top Header -->
      <TvHeader />

      <!-- Main Content Area -->
      <main class="flex-1 flex gap-6 p-6 overflow-hidden">
        
        <!-- Left Side: Current Queue (60%) -->
        <section class="flex-[3] flex flex-col h-full">
          <CurrentQueue />
        </section>

        <!-- Right Side: Queues & Widgets (40%) -->
        <section class="flex-[2] flex flex-col gap-6 h-full">
          
          <!-- Queue List Widget -->
          <div class="flex-[3] overflow-hidden">
            <QueueList />
          </div>

          <!-- Prayer Times Widget -->
          <div class="flex-[2] overflow-hidden">
            <PrayerTimes />
          </div>
        </section>

      </main>

      <!-- Bottom Footer Ticker -->
      <NewsTicker />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import TvHeader from '../components/tv/TvHeader.vue';
import CurrentQueue from '../components/tv/CurrentQueue.vue';
import QueueList from '../components/tv/QueueList.vue';
import PrayerTimes from '../components/tv/PrayerTimes.vue';
import NewsTicker from '../components/tv/NewsTicker.vue';

// Zoom feature state
const zoomLevel = ref(1);

const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value + 0.05, 1.5); // Max 150%
};

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value - 0.05, 0.5); // Min 50%
};

const resetZoom = () => {
  zoomLevel.value = 1;
};
</script>
