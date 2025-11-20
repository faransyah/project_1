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

  <div class="min-h-screen bg-slate-50/50 font-inter text-slate-600 selection:bg-blue-500 selection:text-white">
    
    <div class="fixed top-0 left-0 z-0 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl"></div>
    <div class="fixed bottom-0 right-0 z-0 h-96 w-96 rounded-full bg-indigo-200/20 blur-3xl"></div>
    <div class="fixed inset-0 z-0 pointer-events-none" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px; opacity: 0.5;"></div>

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
              class="relative flex h-10 w-10 items-center justify-center rounded-xl text-white transition-all duration-300 group-hover:scale-105"
              :class="isScrolled ? 'bg-slate-900 shadow-lg shadow-slate-900/20' : 'bg-slate-800 shadow-none'"
            >
              <BoltIcon class="h-6 w-6 text-yellow-400" />
              <div class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-yellow-400 ring-2 ring-white animate-pulse"></div>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold text-slate-900 leading-none tracking-tight">ATK Icon Plus</span>
              <span class="text-[10px] font-semibold text-slate-400 mt-0.5 tracking-wide uppercase">Internal System</span>
            </div>
          </div>

          <div 
            class="hidden md:flex items-center gap-1.5 p-1.5 rounded-full border transition-all duration-500"
            :class="isScrolled ? 'bg-slate-100/80 border-slate-200/50 shadow-inner' : 'bg-transparent border-transparent'"
          >
            <RouterLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="relative rounded-full px-5 py-2 text-xs font-bold transition-all duration-300 flex items-center gap-2"
              :class="isActive(item.href) 
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 ring-1 ring-black/10 scale-105' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'"
            >
              <component :is="item.icon" class="h-4 w-4" :class="isActive(item.href) ? 'text-yellow-400' : 'text-slate-400 group-hover:text-slate-600'" />
              {{ item.name }}
            </RouterLink>
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

    <main class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-12">
      <div class="min-h-[600px]">
        <router-view v-slot="{ Component }">
           <component :is="Component" />
        </router-view>
      </div>
    </main>

  </div>
</template>

<script setup>
// 1. Tambahkan 'watch' pada import
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';

// Import Icons
import {
  HomeIcon, UsersIcon, BuildingOfficeIcon, ClipboardDocumentListIcon,
  ArchiveBoxIcon, BoltIcon, ArrowRightOnRectangleIcon, UserIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const route = useRoute();

// State & Navbar Scroll Logic
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

// === FIX SCROLL POSITION ===
// Setiap kali rute berubah (pindah halaman), reset scroll ke paling atas
watch(
  () => route.path, 
  () => {
    // Reset posisi scroll ke 0,0 (Atas Kiri)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); 
    
    // Reset juga style navbar agar kembali transparan (jika user di atas)
    // atau biarkan handleScroll mengurusnya jika halaman pendek
    isScrolled.value = false;
  }
);

// Data Navigasi
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Users', href: '/manage-users', icon: UsersIcon },
  { name: 'Units', href: '/manage-units', icon: BuildingOfficeIcon },
  { name: 'Master ATK', href: '/master-atk', icon: ClipboardDocumentListIcon },
  { name: 'Stock', href: '/manage-stock', icon: ArchiveBoxIcon }
];

const currentUser = ref('Muhammad Rezza');
const isLogoutModalOpen = ref(false);

// Lifecycle Hooks
onMounted(() => {
  const storedUser = localStorage.getItem('activeUser');
  if (storedUser) currentUser.value = storedUser;
  
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Methods
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

/* --- Animations --- */
.modal-backdrop-enter-active, .modal-backdrop-leave-active { transition: opacity 0.3s ease; }
.modal-backdrop-enter-from, .modal-backdrop-leave-to { opacity: 0; }

.modal-content-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-content-leave-active { transition: all 0.2s ease-in; }
.modal-content-enter-from { opacity: 0; transform: scale(0.9) translateY(20px); }
.modal-content-leave-to { opacity: 0; transform: scale(0.95) translateY(10px); }
</style>