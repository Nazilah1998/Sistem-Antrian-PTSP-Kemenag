<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    
    <!-- Navbar -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center gap-3">
            <img src="/kemenag.svg" alt="Logo Kemenag" class="h-10 w-10" />
            <h1 class="font-bold text-xl text-gray-800">Dashboard PTSP</h1>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-800">{{ authStore.user?.name }}</p>
              <p class="text-xs text-gray-500 capitalize">{{ authStore.user?.role }}</p>
            </div>
            <button @click="handleLogout" class="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-red-200">
              <Icon icon="mdi:logout" class="text-lg" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div class="mb-6 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-800">Manajemen Antrian</h2>
        <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <label class="text-sm font-semibold text-gray-600">Loket Anda:</label>
          <select v-model="selectedCounter" class="border-none bg-gray-50 rounded px-2 py-1 outline-none text-sm font-bold text-kemenag-green">
            <option value="01">Loket 01</option>
            <option value="02">Loket 02</option>
            <option value="03">Loket 03</option>
            <option value="04">Loket 04</option>
          </select>
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="item in activeQueues" :key="item.category.id" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div class="bg-kemenag-green text-white px-4 py-3 flex justify-between items-center">
            <h3 class="font-bold">{{ item.category.name }}</h3>
            <span class="bg-white/20 px-2 py-1 rounded text-xs font-bold">{{ item.category.code }}</span>
          </div>
          
          <div class="p-6 flex-1 flex flex-col items-center justify-center border-b border-gray-100 bg-green-50/30">
            <p class="text-sm text-gray-500 font-semibold mb-1">Antrian Saat Ini</p>
            <h1 class="text-6xl font-black text-gray-800 tracking-tighter">
              {{ item.category.code }}-{{ formatNumber(item.queue?.number || 0) }}
            </h1>
          </div>

          <div class="p-4 flex gap-3 bg-gray-50">
            <button 
              @click="callNext(item.category.id)" 
              class="flex-1 bg-kemenag-green hover:bg-kemenag-green-dark text-white font-bold py-3 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
              :disabled="isLoading"
            >
              <Icon icon="mdi:account-arrow-right" class="text-xl" />
              <span>Panggil (Next)</span>
            </button>
            <button 
              v-if="item.queue"
              @click="recallQueue(item.queue.id)" 
              class="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-bold p-3 rounded-lg shadow-sm transition-colors"
              title="Panggil Ulang"
              :disabled="isLoading"
            >
              <Icon icon="mdi:bullhorn" class="text-xl text-kemenag-gold-dark" />
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Icon } from '@iconify/vue';
import axios from 'axios';

const router = useRouter();
const authStore = useAuthStore();
const selectedCounter = ref('01');
const activeQueues = ref<any[]>([]);
const isLoading = ref(false);

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const formatNumber = (num: number) => {
  return num.toString().padStart(3, '0');
};

const fetchActiveQueues = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/queue/active');
    activeQueues.value = res.data;
  } catch (error) {
    console.error('Failed to fetch queues', error);
  }
};

const callNext = async (categoryId: number) => {
  isLoading.value = true;
  try {
    await axios.post('http://localhost:3000/api/queue/call', {
      categoryId,
      counter: selectedCounter.value
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    await fetchActiveQueues();
  } catch (error) {
    alert('Gagal memanggil antrian. Sesi mungkin telah berakhir.');
  } finally {
    isLoading.value = false;
  }
};

const recallQueue = async (queueId: number) => {
  isLoading.value = true;
  try {
    await axios.post('http://localhost:3000/api/queue/recall', {
      queueId,
      counter: selectedCounter.value
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
  } catch (error) {
    alert('Gagal memanggil ulang.');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchActiveQueues();
});
</script>
