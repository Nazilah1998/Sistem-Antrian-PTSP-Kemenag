<template>
  <div class="h-screen w-screen bg-[#111] overflow-hidden font-sans relative flex items-center justify-center">
    
    <!-- Scalable Container -->
    <div 
      class="origin-center bg-[#f0fdf4] flex flex-col overflow-hidden" 
      :style="{
        width: '1920px',
        height: '1080px',
        transform: `scale(${scale})`
      }"
    >
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
import { ref, onMounted, onUnmounted } from 'vue';
import TvHeader from '../components/tv/TvHeader.vue';
import CurrentQueue from '../components/tv/CurrentQueue.vue';
import QueueList from '../components/tv/QueueList.vue';
import PrayerTimes from '../components/tv/PrayerTimes.vue';
import NewsTicker from '../components/tv/NewsTicker.vue';

const scale = ref(1);

const calculateScale = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const targetWidth = 1920;
  const targetHeight = 1080;

  const scaleX = windowWidth / targetWidth;
  const scaleY = windowHeight / targetHeight;

  // Fit to screen (letterbox if needed)
  scale.value = Math.min(scaleX, scaleY);
};

onMounted(() => {
  calculateScale();
  window.addEventListener('resize', calculateScale);
});

onUnmounted(() => {
  window.removeEventListener('resize', calculateScale);
});
</script>
