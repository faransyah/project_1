<template>
  <div class="min-h-screen bg-[#F8FAFC] font-inter text-slate-600 flex overflow-hidden">
    
    <aside class="fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-xl transition-transform duration-300 transform md:translate-x-0" :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'">
      
      <div class="h-24 flex items-center justify-center border-b border-slate-100/50">
        <div class="flex items-center gap-3 group cursor-pointer" @click="router.push('/user/request')">
          <div class="relative h-11 w-11 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 text-white transform group-hover:scale-105 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path fill-rule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-extrabold text-slate-800 tracking-tight">E-ATK</span>
            <span class="text-[10px] font-bold text-blue-500 tracking-widest uppercase">Portal Pegawai</span>
          </div>
        </div>
      </div>

      <div class="p-6">
        <div class="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm">
          <div class="relative">
            <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg ring-2 ring-white shadow-md overflow-hidden">
               <img v-if="userObj.url_photo" :src="userObj.url_photo" class="w-full h-full object-cover" />
               <span v-else>{{ getInitials(userObj.full_name) }}</span>
            </div>
            <div class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white"></div>
          </div>
          <div class="overflow-hidden">
            <h4 class="text-sm font-bold text-slate-800 truncate">{{ userObj.full_name }}</h4>
            <p class="text-xs text-slate-500 truncate">{{ userObj.position_name || 'Staff' }}</p>
          </div>
        </div>
      </div>

      <nav class="px-4 space-y-2 mt-2">
        <p class="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Menu Utama</p>
        
        <router-link to="/user/request" class="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group" :class="isActive('/user/request') ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'">
          <div class="p-2 rounded-lg" :class="isActive('/user/request') ? 'bg-white text-blue-600 shadow-sm' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:shadow-sm'">
            <Squares2X2Icon class="h-5 w-5" />
          </div>
          <span class="text-sm font-bold">Dashboard & Request</span>
        </router-link>

        <a href="#" class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 group">
          <div class="p-2 rounded-lg bg-slate-100 text-slate-400 group-hover:bg-white group-hover:shadow-sm">
            <ClockIcon class="h-5 w-5" />
          </div>
          <span class="text-sm font-bold">Riwayat Approval</span>
        </a>
      </nav>

      <div class="absolute bottom-8 left-0 right-0 px-6">
        <button @click="openLogoutModal" class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-100 bg-red-50 text-red-600 font-bold text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm hover:shadow-red-200">
          <ArrowRightOnRectangleIcon class="h-5 w-5" />
          Keluar Aplikasi
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col md:pl-72 transition-all duration-300 min-h-screen relative">
      
      <header class="md:hidden h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-40">
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
          </div>
          <span class="font-bold text-slate-800">E-ATK Mobile</span>
        </div>
        <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 rounded-lg bg-slate-100 text-slate-600">
          <Bars3Icon class="h-6 w-6" />
        </button>
      </header>

      <main class="flex-1 p-6 md:p-10 overflow-y-auto">
        
        <div class="flex justify-between items-end mb-8">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-800 tracking-tight">Selamat Datang 👋</h1>
            <p class="text-sm text-slate-500 mt-1">Kelola kebutuhan operasional unit Anda di sini.</p>
          </div>
          <div class="relative p-2.5 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md cursor-pointer transition-all">
             <span class="absolute top-0 right-0 h-3 w-3 bg-red-500 border-2 border-white rounded-full"></span>
             <BellIcon class="h-6 w-6 text-slate-400 hover:text-slate-600" />
          </div>
        </div>

        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"></div>

    </div>

    <Transition name="modal-backdrop">
      <div v-if="isLogoutModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeLogoutModal"></div>
        <Transition name="modal-content">
          <div v-if="isLogoutModalOpen" class="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-white/50">
            <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-orange-500"></div>
            <div class="flex flex-col items-center text-center">
              <div class="group flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50 mb-6">
                <ArrowRightOnRectangleIcon class="h-7 w-7 text-red-600" />
              </div>
              <h3 class="text-xl font-bold text-slate-900 tracking-tight">Keluar Aplikasi?</h3>
              <p class="mt-3 text-sm text-slate-500 leading-relaxed px-2">Sesi Anda akan berakhir. Pastikan pekerjaan tersimpan.</p>
              <div class="mt-8 flex w-full gap-3">
                <button @click="closeLogoutModal" class="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Batal</button>
                <button @click="confirmLogout" class="flex-1 rounded-xl bg-gradient-to-br from-red-600 to-red-700 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-red-600/30">Ya, Keluar</button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  ArrowRightOnRectangleIcon, BellIcon, Squares2X2Icon, ClockIcon, Bars3Icon 
} from '@heroicons/vue/24/outline'; 

const router = useRouter();
const route = useRoute();

const isSidebarOpen = ref(false);
const isLogoutModalOpen = ref(false);
const userObj = ref({ full_name: 'User', position_name: 'Staff' });

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U';
const isActive = (path) => route.path.startsWith(path);
const openLogoutModal = () => isLogoutModalOpen.value = true;
const closeLogoutModal = () => isLogoutModalOpen.value = false;

const confirmLogout = () => {
  localStorage.clear();
  router.push('/login');
  isLogoutModalOpen.value = false;
};

onMounted(() => {
  const stored = localStorage.getItem('activeUser');
  if(stored) {
    try { userObj.value = JSON.parse(stored); } catch(e) {}
  }
});
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }

.modal-backdrop-enter-active, .modal-backdrop-leave-active { transition: opacity 0.2s ease; }
.modal-backdrop-enter-from, .modal-backdrop-leave-to { opacity: 0; }
.modal-content-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-content-leave-active { transition: all 0.2s ease-in; }
.modal-content-enter-from { opacity: 0; transform: scale(0.95) translateY(10px); }
.modal-content-leave-to { opacity: 0; transform: scale(0.95) translateY(10px); }
</style>