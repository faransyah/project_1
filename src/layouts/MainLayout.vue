<template>
  <Transition name="modal-backdrop">
    <div v-if="isLogoutModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeLogoutModal"></div>
      
      <Transition name="modal-content">
        <div v-if="isLogoutModalOpen" class="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-white/50">
          <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-orange-500"></div>

          <div class="flex flex-col items-center text-center">
            <div class="group flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50 mb-6 transition-transform duration-500 hover:rotate-12">
              <ArrowRightOnRectangleIcon class="h-7 w-7 text-red-600 transition-transform group-hover:translate-x-1" />
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 tracking-tight">Keluar Aplikasi?</h3>
            <p class="mt-3 text-sm text-slate-500 leading-relaxed px-2">
              Anda akan diarahkan kembali ke halaman login. Pastikan pekerjaan Anda aman.
            </p>

            <div class="mt-8 flex w-full gap-3">
              <button 
                @click="closeLogoutModal"
                class="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 hover:shadow-sm transition-all duration-200"
              >
                Batal
              </button>
              <button 
                @click="confirmLogout"
                class="flex-1 rounded-xl bg-gradient-to-br from-red-600 to-red-700 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>

  <div class="min-h-screen bg-slate-50/50 font-inter text-slate-600 selection:bg-cyan-500 selection:text-white">
    
    <nav 
      class="fixed z-50 h-16 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center"
      :class="[
        isScrolled 
          ? 'top-0 inset-x-4 md:inset-x-0 border border-white/60 bg-gray-200/80 backdrop-blur-xl shadow-lg shadow-slate-200/20 ring-1 ring-black/5' 
          : 'top-0 inset-x-0 border-b border-transparent bg-slate-50/0 shadow-none'
      ]"
    >
      <div class="w-full h-full px-4 sm:px-6">
        <div class="flex h-full items-center justify-between">

          <div class="flex shrink-0 items-center gap-3 cursor-pointer group" @click="router.push('/dashboard')">
            
            <div 
              class="relative flex h-10 w-10 items-center justify-center rounded-md transition-all duration-300 group-hover:scale-105 overflow-hidden shadow-sm bg-[#FFE600]"
            >
            <div class="absolute inset-0 flex items-center justify-center z-0">
                 <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-90">
                    <path d="M2 5C6 2 8 8 12 5C16 2 18 8 22 5" stroke="#009BDB" stroke-width="2" stroke-linecap="round"/>
                    <path d="M2 10C6 7 8 13 12 10C16 7 18 13 22 10" stroke="#009BDB" stroke-width="2" stroke-linecap="round"/>
                    <path d="M2 15C6 12 8 18 12 15C16 12 18 18 22 15" stroke="#009BDB" stroke-width="2" stroke-linecap="round"/>
                 </svg>
              </div>
              <svg 
                viewBox="0 0 26 24" 
                fill="currentColor" 
                class="h-6 w-8 text-[#E30613] z-10 relative -rotate-6 scale-110 drop-shadow-sm"
              >
                <path d="M13 1L6 13.6H13L8 24L19 11H11L17 1Z" />
              </svg>
            </div>
            

            <div class="flex flex-col items-start">
              <span class="text-xl font-extrabold leading-none tracking-tight text-[#009BDB]">PLN</span>
              <span class="text-[10px] font-semibold text-slate-600 -mt-0.5 tracking-wide">Icon Plus</span>
            </div>

          </div>

          <div 
            class="hidden md:flex items-center gap-1 p-1.5 rounded-full border transition-all duration-500"
            :class="isScrolled ? 'bg-slate-100/80 border-slate-200/50 shadow-inner' : 'bg-transparent border-transparent'"
          >
            <template v-for="(item, index) in navigation" :key="item.name">
              
              <RouterLink
                :to="item.href"
                class="relative rounded-full px-6 py-2 text-xs font-bold transition-all duration-300 flex items-center justify-center"
                :class="isActive(item.href) 
                  ? 'bg-[#009BDB] text-white shadow-md shadow-cyan-500/20 ring-1 ring-black/10 scale-105' 
                  : 'text-slate-500 hover:text-[#009BDB] hover:bg-white/50'"
              >
                {{ item.name }}
              </RouterLink>

              <div v-if="index < navigation.length - 1" class="h-4 w-px bg-slate-300/50 mx-1"></div>

            </template>
          </div>

          <div class="flex items-center gap-5">
            
            <div class="hidden sm:flex items-center gap-3 pr-1 cursor-default select-none">
              <div class="flex flex-col items-end">
                 <span class="text-xs font-bold text-slate-700 leading-none">{{ currentUser }}</span>
                 <span class="text-[10px] font-medium text-slate-400 leading-none mt-0.5 tracking-wide">Administrator</span>
              </div>
              <UserIcon class="h-5 w-5 text-slate-400" />
            </div>

            <div class="h-8 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>

            <button 
              @click="openLogoutModal"
              class="group relative flex h-9 w-9 items-center justify-center rounded-full bg-red-50 border border-red-100 text-red-500 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-red-600/20"
              title="Keluar Sistem"
            >
              <ArrowRightOnRectangleIcon class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>

          </div>

        </div>
      </div>
    </nav>

    <main class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12">
      <div class="min-h-[600px]">
        <router-view v-slot="{ Component }">
           <component :is="Component" />
        </router-view>
      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';

// Import Icons
import {
  ArrowRightOnRectangleIcon,
  UserIcon
} from '@heroicons/vue/24/outline'; // BoltIcon (outline)

// Tambahkan import BoltSolidIcon untuk ikon petir solid
import { BoltIcon as BoltSolidIcon } from '@heroicons/vue/24/solid'; // BoltIcon (solid)

const router = useRouter();
const route = useRoute();

// --- State Scroll & Navbar ---
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

// Fix Scroll Position: Reset ke atas setiap pindah halaman
watch(
  () => route.path, 
  () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); 
    isScrolled.value = false;
  }
);

// --- Data Menu ---
const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Users', href: '/manage-users' },
  { name: 'Units', href: '/manage-units' },
  { name: 'Master ATK', href: '/master-atk' },
  { name: 'Stock', href: '/manage-stock' }
];

// --- State User ---
const currentUser = ref('Muhammad Rezza');
const isLogoutModalOpen = ref(false);

// --- Lifecycle ---
onMounted(() => {
  const storedUser = localStorage.getItem('activeUser');
  if (storedUser) currentUser.value = storedUser;
  
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// --- Helper Methods ---
const isActive = (href) => route.path.startsWith(href);
const openLogoutModal = () => isLogoutModalOpen.value = true;
const closeLogoutModal = () => isLogoutModalOpen.value = false;

const confirmLogout = () => {
  localStorage.removeItem('userLoggedIn');
  localStorage.removeItem('activeUser');
  router.push('/login');
  isLogoutModalOpen.value = false;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.font-inter { font-family: 'Inter', sans-serif; }

/* --- ANIMASI MODAL --- */
.modal-backdrop-enter-active, .modal-backdrop-leave-active { transition: opacity 0.3s ease; }
.modal-backdrop-enter-from, .modal-backdrop-leave-to { opacity: 0; }

.modal-content-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-content-leave-active { transition: all 0.2s ease-in; }
.modal-content-enter-from { opacity: 0; transform: scale(0.9) translateY(20px); }
.modal-content-leave-to { opacity: 0; transform: scale(0.95) translateY(10px); }
</style>