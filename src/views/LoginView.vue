<template>
  <div class="min-h-screen bg-gradient-to-br from-green-600 via-emerald-700 to-green-900 flex items-center justify-center p-6 relative overflow-hidden">
    
    <!-- Decorative background elements -->
    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
    <div class="absolute top-[20%] right-[-10%] w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div class="absolute bottom-[-20%] left-[20%] w-[30rem] h-[30rem] bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

    <div class="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl w-full max-w-xl p-10 sm:p-14 border border-white/40 relative z-10 transform transition-all hover:scale-[1.01] duration-300">
      
      <!-- Logo & Title -->
      <div class="text-center mb-12">
        <div class="bg-white inline-block p-4 rounded-full shadow-md mb-6 border border-gray-100">
          <img src="/kemenag.svg" alt="Logo Kemenag" class="w-24 h-24 sm:w-28 sm:h-28 mx-auto" />
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">Sistem Antrian</h1>
        <p class="text-emerald-600 font-medium mt-3 text-lg sm:text-xl">Pelayanan Terpadu Satu Pintu</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="flex flex-col gap-6">
        
        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-xl text-base text-center border border-red-200 font-medium flex items-center justify-center gap-2 animate-pulse">
          <Icon icon="mdi:alert-circle" class="text-xl" />
          {{ errorMessage }}
        </div>

        <!-- Username -->
        <div>
          <label class="block text-base font-bold text-gray-700 mb-2 ml-1">Username</label>
          <div class="relative group">
            <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-emerald-600 transition-colors">
              <Icon icon="mdi:account" class="text-2xl" />
            </span>
            <input 
              v-model="username" 
              type="text" 
              class="w-full pl-12 pr-4 py-4 bg-gray-50/50 text-lg border-2 border-gray-200 rounded-2xl focus:bg-white focus:ring-0 focus:border-emerald-500 transition-all outline-none text-gray-800 font-medium" 
              placeholder="Masukkan username" 
              required 
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-base font-bold text-gray-700 mb-2 ml-1">Password</label>
          <div class="relative group">
            <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-emerald-600 transition-colors">
              <Icon icon="mdi:lock" class="text-2xl" />
            </span>
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              class="w-full pl-12 pr-14 py-4 bg-gray-50/50 text-lg border-2 border-gray-200 rounded-2xl focus:bg-white focus:ring-0 focus:border-emerald-500 transition-all outline-none text-gray-800 font-medium" 
              placeholder="Masukkan password" 
              required 
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword" 
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-600 focus:outline-none transition-colors"
            >
              <Icon :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'" class="text-2xl" />
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-xl py-4 rounded-2xl hover:from-emerald-700 hover:to-green-700 hover:shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all mt-4 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin text-2xl" />
          <Icon v-else icon="mdi:login-variant" class="text-2xl" />
          <span>{{ isLoading ? 'Memproses...' : 'Masuk Sekarang' }}</span>
        </button>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Icon } from '@iconify/vue';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    await authStore.login(username.value, password.value);
    router.push('/admin');
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Gagal login, periksa koneksi server.';
  } finally {
    isLoading.value = false;
  }
};
</script>
