<template>
  <div class="h-full bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden border border-gray-100 relative transition-colors duration-300" :class="{'bg-green-100': isBlinking}">
    <!-- Title Area -->
    <div class="pt-12 pb-6 text-center z-10">
      <span class="bg-kemenag-green text-white font-black tracking-widest px-8 py-3 rounded-full shadow-md text-xl md:text-2xl uppercase transition-colors" :class="{'bg-kemenag-gold-dark': isBlinking}">
        Antrian Dipanggil
      </span>
    </div>

    <!-- Main Number Area -->
    <div class="flex-1 flex flex-col items-center justify-center -mt-8 z-10">
      <h1 class="text-[12rem] md:text-[16rem] leading-none font-black text-gray-800 tracking-tighter drop-shadow-sm transition-transform duration-300" :class="{'scale-110 text-kemenag-green': isBlinking}">
        {{ currentNumber }}
      </h1>
      
      <!-- Loket Info -->
      <div class="mt-8 border-4 border-kemenag-gold rounded-2xl px-12 py-6 text-center bg-white shadow-lg w-3/4 max-w-lg transition-transform duration-300" :class="{'scale-105 border-kemenag-green': isBlinking}">
        <p class="text-gray-500 font-bold tracking-widest text-lg mb-1 uppercase">Silakan Menuju</p>
        <h2 class="text-5xl font-black text-kemenag-green transition-colors" :class="{'text-kemenag-gold-dark': isBlinking}">LOKET {{ currentLoket }}</h2>
      </div>

      <!-- Category Label -->
      <div class="mt-8 bg-gray-50 border border-gray-200 px-6 py-3 rounded-xl shadow-inner">
        <p class="text-xl font-bold text-gray-600">Layanan: <span class="text-kemenag-green-dark">{{ currentCategoryName }}</span></p>
      </div>
    </div>

    <!-- Background Decoration -->
    <div class="absolute inset-0 z-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-kemenag-gold via-transparent to-transparent pointer-events-none"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { socket } from '../../lib/socket';

const currentNumber = ref('A-000');
const currentLoket = ref('00');
const currentCategoryName = ref('Menunggu Antrian');
const isBlinking = ref(false);

const handleQueueCalled = (data: any) => {
  const q = data.queue;
  const numStr = q.number.toString().padStart(3, '0');
  currentNumber.value = `${q.category.code}-${numStr}`;
  currentLoket.value = data.counter;
  currentCategoryName.value = q.category.name;
  
  // Visual Alert
  isBlinking.value = true;
  setTimeout(() => {
    isBlinking.value = false;
  }, 4000);

  // Play Bell Sound
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  audio.play().then(() => {
    // After bell starts playing, wait a bit then speak
    setTimeout(() => {
      speakQueue(q.category.code, numStr, data.counter);
    }, 1500);
  }).catch(e => console.log('Audio autoplay blocked', e));
};

const speakQueue = (code: string, number: string, loket: string) => {
  if (!('speechSynthesis' in window)) return;
  
  // Format text so it's read clearly by Indonesian TTS
  // e.g. "Nomor antrian, A, 0, 1, 2, silakan menuju ke, loket, 0, 1"
  const splitNumber = number.split('').join(' '); 
  const splitLoket = loket.split('').join(' ');
  const textToSpeak = `Nomor antrian, ${code}, ${splitNumber}. silakan menuju ke, loket, ${splitLoket}`;

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = 'id-ID';
  utterance.rate = 0.85; // Slightly slower for clarity
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
};

const fetchInitialQueue = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:3000/api/queue/active');
    let latestQueue: any = null;
    res.data.forEach((item: any) => {
      if (item.queue && (!latestQueue || new Date(item.queue.createdAt) > new Date(latestQueue.queue.createdAt))) {
        latestQueue = item;
      }
    });

    if (latestQueue && latestQueue.queue) {
      currentNumber.value = `${latestQueue.category.code}-${latestQueue.queue.number.toString().padStart(3, '0')}`;
      currentLoket.value = '01'; // Default or fetched if we had loket history
      currentCategoryName.value = latestQueue.category.name;
    }
  } catch (e) {
    console.error('Failed to fetch initial queue', e);
  }
};

onMounted(() => {
  fetchInitialQueue();
  socket.on('queue-called', handleQueueCalled);
});

onUnmounted(() => {
  socket.off('queue-called', handleQueueCalled);
});
</script>
