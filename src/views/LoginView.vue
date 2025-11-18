<template>
  <div class="font-inter flex min-h-screen flex-col items-center justify-center bg-blue-900 px-4 py-12 overflow-hidden">
    
    <Transition appear name="fade-in-up">
      <div class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 hover:shadow-yellow-400/10">
        
        <div class="bg-blue-800 p-8 text-center border-b border-blue-700">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 shadow-lg ring-4 ring-blue-700/50">
            <BoltIcon class="h-10 w-10 text-blue-900 animate-pulse-subtle" />
          </div>
          <h2 class="mt-4 text-2xl font-bold tracking-tight text-white">
            ATK Icon Plus
          </h2>
          <p class="mt-1 text-sm text-blue-100">
            Sistem Manajemen Aset & Stok
          </p>
        </div>
        
        <div class="p-8 pt-6">
          
          <form class="space-y-6" @submit.prevent="handleLogin">
            
            <div class="space-y-4">
              
              <div>
                <label for="email" class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Username / Email</label>
                <div class="relative group">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <EnvelopeIcon class="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input 
                    id="email" 
                    name="email" 
                    type="text" 
                    required
                    v-model="email"
                    class="block w-full rounded-lg border border-gray-300 bg-slate-50 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-600 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-600 sm:text-sm transition-all"
                    placeholder="Masukkan username"
                  />
                </div>
              </div>
              
              <div>
                <label for="password" class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Password</label>
                <div class="relative group">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon class="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input 
                    id="password" 
                    name="password" 
                    :type="showPassword ? 'text' : 'password'" 
                    required
                    v-model="password"
                    class="block w-full rounded-lg border border-gray-300 bg-slate-50 py-3 pl-10 pr-10 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-600 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-600 sm:text-sm transition-all"
                    placeholder="Masukkan password"
                  />
                  <button 
                    type="button" 
                    class="absolute inset-y-0 right-0 z-10 flex items-center pr-3 text-gray-400 hover:text-blue-600 transition-colors"
                    @click="showPassword = !showPassword"
                  >
                    <span class="sr-only">Toggle password visibility</span>
                    <EyeSlashIcon v-if="showPassword" class="h-5 w-5" />
                    <EyeIcon v-else class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <Transition name="slide-down-fade">
              <div v-if="errorMsg" class="rounded-lg bg-red-50 p-4 border-l-4 border-red-500">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-red-700">{{ errorMsg }}</p>
                  </div>
                </div>
              </div>
            </Transition>

            <button 
              type="submit" 
              :disabled="isLoading"
              class="relative flex w-full justify-center rounded-lg bg-yellow-400 px-4 py-3 text-sm font-bold text-blue-900 shadow-md transition-all duration-200 hover:bg-yellow-300 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 !mt-8"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
              <span v-else>MASUK APLIKASI</span>
            </button>
          </form>

          <p class="mt-8 text-center text-sm text-gray-500">
            Mengalami masalah login?
            <a href="#" class="font-semibold text-blue-700 hover:text-blue-900 transition-colors">
              Hubungi Administrator
            </a>
          </p>
        </div>
      </div>
    </Transition>
    
    <div class="mt-8 text-center text-xs text-blue-200/60">
      &copy; 2024 ATK Icon Plus. All rights reserved.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { BoltIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';

// --- LOGIKA KODE ANDA TETAP SAMA ---

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const isLoading = ref(false);
const showPassword = ref(false); 
const router = useRouter();

const handleLogin = () => {
  isLoading.value = true;
  errorMsg.value = '';

  setTimeout(() => {
    if (email.value === 'admin' && password.value === 'password') {
      localStorage.setItem('userLoggedIn', 'true');
      router.push('/dashboard'); 
    } else {
      errorMsg.value = 'Username atau password salah!';
    }
    isLoading.value = false;
  }, 1000);
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}

/* Pola Grid Halus */
.subtle-bg-pattern {
  background-image: linear-gradient(rgba(0, 83, 155, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 83, 155, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: center center;
}

/* Animasi Pulse Logo */
.animate-pulse-subtle {
  animation: pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-subtle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.95);
  }
}

/* Animasi "Pop-in" Kartu */
.fade-in-up-enter-active {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.fade-in-up-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.98);
}
.fade-in-up-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Animasi Error "Slide-down" */
.slide-down-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-down-fade-leave-active {
  transition: all 0.2s ease-in;
}
.slide-down-fade-enter-from,
.slide-down-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>