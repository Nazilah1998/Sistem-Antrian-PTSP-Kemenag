<template>
  <div class="bg-gradient-to-br from-kemenag-green-dark via-[#005230] to-gray-900 text-white rounded-2xl shadow-[0_10px_40px_rgba(0,102,58,0.4)] overflow-hidden flex flex-col h-full border border-kemenag-green/30 relative">
    <!-- Decorative faint logo pattern -->
    <div class="absolute inset-0 opacity-5 bg-[url('/kemenag.svg')] bg-center bg-no-repeat bg-[length:150%] mix-blend-overlay"></div>
    
    <div class="bg-black/40 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-white/10 z-10">
      <h4 class="font-extrabold text-lg m-0 uppercase tracking-[0.15em] flex items-center gap-3">
        <Icon icon="mdi:clock-outline" class="text-2xl text-kemenag-gold drop-shadow-md" />
        Jadwal Sholat
      </h4>
      <span class="text-xs font-bold tracking-wider text-green-100 bg-white/10 border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Barito Utara</span>
    </div>
    
    <div class="flex-1 flex flex-col justify-between p-3 z-10">
      <div 
        v-for="prayer in prayers" 
        :key="prayer.name"
        class="flex justify-between items-center px-5 py-3 my-1 rounded-xl transition-all duration-300"
        :class="prayer.isCurrent ? 'bg-gradient-to-r from-kemenag-gold to-kemenag-gold-dark text-gray-900 font-extrabold scale-[1.03] shadow-[0_5px_15px_rgba(241,196,15,0.4)] border border-yellow-300/50' : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10'"
      >
        <span class="text-xl tracking-wide">{{ prayer.name }}</span>
        <span class="text-2xl font-mono" :class="prayer.isCurrent ? 'font-black' : 'font-bold'">{{ prayer.time }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

interface Prayer {
  name: string;
  time: string;
  isCurrent: boolean;
}

// In the future, fetch this from an API based on date
defineProps({
  prayers: {
    type: Array as () => Prayer[],
    default: () => [
      { name: 'Subuh', time: '04:15', isCurrent: false },
      { name: 'Dzuhur', time: '11:40', isCurrent: false },
      { name: 'Ashar', time: '15:05', isCurrent: true },
      { name: 'Maghrib', time: '17:45', isCurrent: false },
      { name: 'Isya', time: '18:58', isCurrent: false },
    ]
  }
});
</script>
