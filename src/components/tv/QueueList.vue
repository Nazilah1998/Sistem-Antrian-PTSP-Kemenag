<template>
  <div class="h-full flex flex-col gap-4">
    <div v-for="(queue, index) in queues" :key="index" 
         class="bg-white rounded-2xl shadow-md flex items-stretch overflow-hidden border border-gray-100">
      
      <!-- Color Bar (Dynamic based on index or category) -->
      <div class="w-3" :class="[
        index % 3 === 0 ? 'bg-kemenag-green' : 
        index % 3 === 1 ? 'bg-kemenag-gold' : 'bg-blue-500'
      ]"></div>

      <div class="flex-1 p-4 md:p-6 flex flex-col justify-center">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-black text-gray-800 text-lg md:text-xl">{{ queue.name }}</h3>
          <span class="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">
            Loket {{ queue.loket }}
          </span>
        </div>
        
        <div class="text-center mt-2">
          <p class="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">Antrian Berikutnya</p>
          <p class="text-4xl md:text-5xl font-black text-gray-800 tracking-tighter">
            {{ queue.code }}-{{ formatNumber(queue.number) }}
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { socket } from '../../lib/socket';

const queues = ref<any[]>([]);

const fetchActiveQueues = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/queue/active');
    // Filter out categories that don't have any queue yet, or just show 0
    queues.value = res.data.map((item: any) => ({
      name: item.category.name,
      code: item.category.code,
      number: item.queue ? item.queue.number : 0,
      loket: '01' // Default if we don't track loket per queue historically
    }));
  } catch (e) {
    console.error('Failed to fetch queues', e);
  }
};

const handleQueueCalled = (data: any) => {
  const qIndex = queues.value.findIndex(q => q.code === data.queue.category.code);
  
  if (qIndex !== -1) {
    queues.value[qIndex].number = data.queue.number;
    queues.value[qIndex].loket = data.counter;
  }
};

onMounted(() => {
  fetchActiveQueues();
  socket.on('queue-called', handleQueueCalled);
});

onUnmounted(() => {
  socket.off('queue-called', handleQueueCalled);
});

const formatNumber = (num: number) => {
  if (num === 0) return '---';
  return num.toString().padStart(3, '0');
};
</script>
