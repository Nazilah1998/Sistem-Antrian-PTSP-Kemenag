<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-green-100 flex flex-col font-sans relative overflow-hidden">
    
    <!-- Decorative background elements -->
    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
    <div class="absolute top-[20%] right-[-10%] w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>

    <!-- Navbar -->
    <header class="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/50 sticky top-0 z-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20 items-center">
          <div class="flex items-center gap-4">
            <div class="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <img src="/kemenag.svg" alt="Logo Kemenag" class="h-10 w-10" />
            </div>
            <div>
              <h1 class="font-extrabold text-2xl text-gray-800 tracking-tight">Dashboard PTSP</h1>
              <p class="text-xs text-emerald-600 font-bold">Kementerian Agama</p>
            </div>
          </div>
          <div class="flex items-center gap-6">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-bold text-gray-800">{{ authStore.user?.name }}</p>
              <p class="text-xs text-emerald-600 font-bold uppercase tracking-wider">{{ authStore.user?.role }}</p>
            </div>
            <button @click="handleLogout" class="bg-red-50/80 text-red-600 hover:bg-red-500 hover:text-white p-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-bold shadow-sm hover:shadow-md border border-red-100">
              <Icon icon="mdi:logout" class="text-xl" />
              <span class="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full z-10">
      <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-3xl font-black text-gray-800 tracking-tight">Manajemen Antrian</h2>
          <p class="text-gray-500 font-medium mt-1">Kelola dan panggil nomor antrian secara dinamis.</p>
        </div>
        <div class="flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/60 shadow-lg shadow-emerald-500/5">
          <Icon icon="mdi:storefront" class="text-emerald-500 text-xl" />
          <label class="text-sm font-bold text-gray-700">Loket Anda:</label>
          <select v-model="selectedCounter" class="border-none bg-emerald-50 rounded-lg px-3 py-1.5 outline-none text-sm font-black text-emerald-700 cursor-pointer focus:ring-2 focus:ring-emerald-500 transition-shadow">
            <option value="01">Loket 01</option>
            <option value="02">Loket 02</option>
            <option value="03">Loket 03</option>
            <option value="04">Loket 04</option>
          </select>
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="item in activeQueues" :key="item.category.id" class="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-white relative overflow-hidden flex flex-col transform transition-all duration-300 hover:scale-[1.02]">
          
          <div class="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-5 flex justify-between items-center shadow-inner">
            <h3 class="font-extrabold text-lg">{{ item.category.name }}</h3>
            <span class="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-black shadow-sm">{{ item.category.code }}</span>
          </div>
          
          <div class="p-8 flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-green-50/30 relative">
            
            <p class="text-sm text-gray-500 font-bold mb-2 tracking-wide uppercase">Antrian Saat Ini</p>
            
            <!-- Number Display / Edit Mode -->
            <div class="flex items-center gap-4 my-2">
              <button @click="adjustQueue(item.category.id, 'DECREMENT')" class="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm disabled:opacity-50" :disabled="isLoading">
                <Icon icon="mdi:minus" class="text-2xl" />
              </button>
              
              <div v-if="editingCategory === item.category.id" class="flex items-center gap-2">
                <input 
                  type="number" 
                  v-model.number="editValue"
                  class="w-24 text-center text-4xl font-black text-gray-800 border-2 border-emerald-500 rounded-xl py-2 outline-none focus:ring-4 focus:ring-emerald-500/20 bg-white"
                  min="0"
                  @keyup.enter="saveEdit(item.category.id)"
                />
                <button @click="saveEdit(item.category.id)" class="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors">
                  <Icon icon="mdi:check" class="text-xl" />
                </button>
                <button @click="editingCategory = null" class="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-500 hover:text-white transition-colors">
                  <Icon icon="mdi:close" class="text-xl" />
                </button>
              </div>
              
              <div v-else class="text-center group relative cursor-pointer" @click="startEdit(item.category.id, item.queue?.number || 0)">
                <h1 class="text-6xl sm:text-7xl font-black text-gray-800 tracking-tighter">
                  {{ item.category.code }}-{{ formatNumber(item.queue?.number || 0) }}
                </h1>
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/60 backdrop-blur-sm rounded-2xl transition-all">
                  <div class="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    <Icon icon="mdi:pencil" class="text-lg" />
                    <span>Edit Manual</span>
                  </div>
                </div>
              </div>
              
              <button @click="adjustQueue(item.category.id, 'INCREMENT')" class="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors shadow-sm disabled:opacity-50" :disabled="isLoading">
                <Icon icon="mdi:plus" class="text-2xl" />
              </button>
            </div>
            
          </div>

          <div class="p-5 flex gap-3 bg-white border-t border-gray-100">
            <button 
              @click="callNext(item.category.id)" 
              class="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:transform-none"
              :disabled="isLoading"
            >
              <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin text-2xl" />
              <Icon v-else icon="mdi:account-arrow-right" class="text-2xl" />
              <span>Panggil (Next)</span>
            </button>
            <button 
              v-if="item.queue"
              @click="recallQueue(item.queue.id)" 
              class="bg-orange-50 hover:bg-orange-500 text-orange-500 hover:text-white border border-orange-200 font-bold px-5 rounded-xl shadow-sm transition-all flex items-center justify-center disabled:opacity-70"
              title="Panggil Ulang"
              :disabled="isLoading"
            >
              <Icon icon="mdi:bullhorn" class="text-2xl" />
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

const editingCategory = ref<number | null>(null);
const editValue = ref<number>(0);

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const formatNumber = (num: number) => {
  return num.toString().padStart(3, '0');
};

const fetchActiveQueues = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:3000/api/queue/active');
    activeQueues.value = res.data;
  } catch (error) {
    console.error('Failed to fetch queues', error);
  }
};

const playSoundAndSpeak = (code: string, number: number, loket: string) => {
  const numStr = number.toString().padStart(3, '0');
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  audio.play().then(() => {
    setTimeout(() => {
      if (!('speechSynthesis' in window)) return;
      const splitNumber = numStr.split('').join(' '); 
      const splitLoket = loket.split('').join(' ');
      const textToSpeak = `Nomor antrian, ${code}, ${splitNumber}. silakan menuju ke, loket, ${splitLoket}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'id-ID';
      utterance.rate = 0.85;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }, 1500);
  }).catch(e => console.log('Audio autoplay blocked', e));
};

const callNext = async (categoryId: number) => {
  isLoading.value = true;
  try {
    const res = await axios.post('/api/queue/call', {
      categoryId,
      counter: selectedCounter.value
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    const data = res.data;
    if (data && data.category) {
      playSoundAndSpeak(data.category.code, data.number, selectedCounter.value);
    }
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
    const res = await axios.post('/api/queue/recall', {
      queueId,
      counter: selectedCounter.value
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    const data = res.data;
    if (data && data.category) {
      playSoundAndSpeak(data.category.code, data.number, selectedCounter.value);
    }
  } catch (error) {
    alert('Gagal memanggil ulang.');
  } finally {
    isLoading.value = false;
  }
};

const adjustQueue = async (categoryId: number, action: 'INCREMENT' | 'DECREMENT') => {
  isLoading.value = true;
  try {
    const res = await axios.post('/api/queue/adjust', {
      categoryId,
      action,
      counter: selectedCounter.value
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    const data = res.data;
    if (data && data.category) {
      playSoundAndSpeak(data.category.code, data.number, selectedCounter.value);
    }
    await fetchActiveQueues();
  } catch (error) {
    alert('Gagal mengubah antrian.');
  } finally {
    isLoading.value = false;
  }
};

const startEdit = (categoryId: number, currentValue: number) => {
  editingCategory.value = categoryId;
  editValue.value = currentValue;
};

const saveEdit = async (categoryId: number) => {
  if (editValue.value < 0) return;
  isLoading.value = true;
  try {
    const res = await axios.post('/api/queue/adjust', {
      categoryId,
      action: 'SET',
      value: editValue.value,
      counter: selectedCounter.value
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    const data = res.data;
    if (data && data.category) {
      playSoundAndSpeak(data.category.code, data.number, selectedCounter.value);
    }
    editingCategory.value = null;
    await fetchActiveQueues();
  } catch (error) {
    alert('Gagal mengubah antrian secara manual.');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchActiveQueues();
});
</script>
