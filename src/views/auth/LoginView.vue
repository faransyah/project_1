<template>
  <div class="font-inter flex min-h-screen flex-col items-center justify-center bg-primary-blue px-4 py-12 overflow-hidden">
    
    <Transition appear name="fade-in-up">
      <div class="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-2 ring-gray-100 transition-all duration-300">
        
        <div class="relative flex flex-col items-center justify-center p-8 text-center text-white border-b border-white/30 bg-primary-blue">
          
          <div class="absolute inset-0 opacity-10" style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cdefs%3e%3clinearGradient id=\'grad1\' x1=\'0%25\' y1=\'0%25\' x2=\'100%25\' y2=\'100%25\'%3e%3cstop offset=\'0%25\' stop-color=\'%23ffffff\' stop-opacity=\'0.2\' /%3e%3cstop offset=\'100%25\' stop-color=\'%23ffffff\' stop-opacity=\'0\' /%3e%3c/linearGradient%3e%3c/defs%3e%3crect width=\'100%25\' height=\'100%25\' fill=\'url(%23grad1)\' /%3e%3c/svg%3e');"></div>

          <div class="relative z-10 space-y-3">
            <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-xl overflow-hidden shadow-lg ring-4 ring-white/30 bg-white p-3 transform hover:scale-105 transition-transform duration-500">
              <img 
                src="/pln-click.png" 
                alt="Logo PLN Click" 
                class="w-full h-full object-contain"
                onerror="this.onerror=null; this.src='https://placehold.co/100x100/ffffff/000000?text=PLN'"
              >
            </div>

            <p class="text-base font-semibold text-white/90 pt-1 max-w-xs mx-auto">
              Sistem Manajemen Aset & Stok
            </p>
          </div>
          
        </div>
        
        <div class="p-8">
          
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
            Masuk ke Akun Anda
          </h2>

          <form class="space-y-6" @submit.prevent="handleLogin">
            
            <div>
              <label for="username" class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Username</label>
              <div class="relative group">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <EnvelopeIcon class="h-5 w-5 text-gray-400 group-focus-within:text-primary-blue transition-colors" />
                </div>
                <input 
                  id="username" 
                  name="username" 
                  type="text" 
                  required
                  v-model="username"
                  class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-primary-blue focus:shadow-lg focus:outline-none focus:ring-1 focus:ring-primary-blue sm:text-sm transition-all"
                  placeholder="Masukkan username"
                />
              </div>
            </div>
            
            <div>
              <label for="password" class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Password</label>
              <div class="relative group">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon class="h-5 w-5 text-gray-400 group-focus-within:text-primary-blue transition-colors" />
                </div>
                <input 
                  id="password" 
                  name="password" 
                  :type="showPassword ? 'text' : 'password'" 
                  required
                  v-model="password"
                  class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-10 text-gray-900 placeholder-gray-400 focus:border-primary-blue focus:shadow-lg focus:outline-none focus:ring-1 focus:ring-primary-blue sm:text-sm transition-all"
                  placeholder="Masukkan password"
                />
                <button 
                  type="button" 
                  class="absolute inset-y-0 right-0 z-10 flex items-center pr-3 text-gray-400 hover:text-primary-blue transition-colors"
                  @click="showPassword = !showPassword"
                >
                  <span class="sr-only">Toggle password visibility</span>
                  <EyeSlashIcon v-if="showPassword" class="h-5 w-5" />
                  <EyeIcon v-else class="h-5 w-5" />
                </button>
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
              class="relative flex w-full justify-center rounded-xl bg-[#00A2B9] px-4 py-3 text-sm font-bold text-[#ffffff] shadow-xl transition-all duration-300 hover:bg-yellow-300 hover:shadow-2xl hover:translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 !mt-8"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
              <span v-else>MASUK APLIKASI</span>
            </button>
          </form>
          <p class="mt-10 text-center text-xs text-gray-400 space-y-1">
            <span class="block">Simulasi Login:</span>
            <span class="block">Admin: <b>agus.salim</b> / 123</span>
            <span class="block">Pegawai: <b>siti.aminah</b> / 123</span>
          </p>
        </div>
      </div>
    </Transition>
    
    <div class="mt-8 text-center text-xs text-white/80">
      &copy; 2025 PLN Icon Plus. All rights reserved.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Import Store
import { useInventoryStore } from '../../stores/inventoryStore'; 
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';

// State
const username = ref(''); // Ganti dari 'email' menjadi 'username'
const password = ref('');
const errorMsg = ref('');
const isLoading = ref(false);
const showPassword = ref(false); 
const router = useRouter();
const store = useInventoryStore(); // Init store

const handleLogin = () => {
  isLoading.value = true;
  errorMsg.value = '';

  setTimeout(() => {
    // 1. Cari user di Store berdasarkan Username & Password
    // (Data dummy password di store adalah '123')
    const user = store.users.find(u => 
      u.username === username.value && (u.password || '123') === password.value
    );

    if (user) {
      // Cek status aktif
      if (user.is_active !== 1) {
        errorMsg.value = 'Akun Anda non-aktif. Hubungi Admin.';
        isLoading.value = false;
        return;
      }

      // 2. Simpan Sesi
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('activeUser', JSON.stringify(user));
      localStorage.setItem('userRole', user.role);

      // 3. Redirect Berdasarkan Role
      if (user.role === 'Admin') {
        router.push('/admin/dashboard');
      } else {
        // Asumsi selain Admin adalah User (Pegawai)
        router.push('/user/request');
      }
    } else {
      // Login Gagal
      errorMsg.value = 'Username atau password salah!';
    }
    
    isLoading.value = false;
  }, 1000);
};
</script>

<style>
/* Deklarasi variabel CSS untuk warna primary */
:root {
  --color-primary-blue: #00A2B9;
}

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}

/* Utilitas Tailwind Kustom menggunakan variabel CSS */
.bg-primary-blue {
    background-color: var(--color-primary-blue);
}

.text-primary-blue {
    color: var(--color-primary-blue);
}

.focus\:border-primary-blue:focus {
    border-color: var(--color-primary-blue);
}

.focus\:ring-primary-blue:focus {
    --tw-ring-color: var(--color-primary-blue);
}

/* Animasi "Pop-in" Kartu */
.fade-in-up-enter-active {
  transition: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.fade-in-up-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
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