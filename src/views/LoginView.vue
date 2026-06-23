<template>
  <div class="min-h-screen bg-green-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border-t-4 border-kemenag-green">
      
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <img src="/kemenag.svg" alt="Logo Kemenag" class="w-20 h-20 mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-800">Login Sistem Antrian</h1>
        <p class="text-gray-500 mt-2 text-sm">Pelayanan Terpadu Satu Pintu</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
        
        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
          {{ errorMessage }}
        </div>

        <!-- Username -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Username</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Icon icon="mdi:account" class="text-lg" />
            </span>
            <input 
              v-model="username" 
              type="text" 
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kemenag-green focus:border-kemenag-green transition-all outline-none" 
              placeholder="Masukkan username" 
              required 
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Icon icon="mdi:lock" class="text-lg" />
            </span>
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              class="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kemenag-green focus:border-kemenag-green transition-all outline-none" 
              placeholder="Masukkan password" 
              required 
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword" 
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <Icon :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'" class="text-lg" />
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-kemenag-green text-white font-bold py-3 rounded-lg hover:bg-kemenag-green-dark transition-colors shadow-md mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin text-xl" />
          <span>{{ isLoading ? 'Memproses...' : 'Masuk' }}</span>
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
