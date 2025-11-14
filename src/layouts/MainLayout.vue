<template>
  <!-- 'overflow-hidden' di sini MEMAKSA layout agar tidak scroll -->
  <div class="flex h-screen overflow-hidden bg-gray-50">
    
    <!-- 1. Sidebar (Tema Biru Dominan dengan Aksen Kuning) -->
    <!-- Sidebar ini akan diam di tempat -->
    <aside class="flex h-full w-64 flex-col bg-blue-900 text-gray-300">
      
      <!-- Logo & Judul Aplikasi -->
      <div class="flex items-center justify-center border-b border-blue-700 p-6">
        <!-- Ikon Bolt (Petir) kini berwarna kuning -->
        <BoltIcon class="h-8 w-8 text-yellow-400" />
        <span class="ml-3 text-lg font-bold text-white">ATK Icon Plus</span>
      </div>

      <!-- Navigasi Utama -->
      <nav class="flex-1 space-y-1 overflow-y-auto overscroll-y-none p-4">
        <RouterLink 
          v-for="item in navigation" 
          :key="item.name" 
          :to="item.href"
          class="nav-link group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-blue-800 hover:text-white "
        >
          <!-- Ikon kini berwarna biru muda, dan akan jadi kuning saat aktif -->
          <component :is="item.icon" class="nav-icon mr-3 h-5 w-5 flex-shrink-0 text-blue-300 group-hover:text-white" />
          {{ item.name }}
        </RouterLink>
      </nav>

      <!-- Bagian Logout / User -->
      <div class="mt-auto border-t border-blue-700 p-4">
        <div class="flex items-center justify-between">
          <!-- Info User (Simulasi) -->
          <div class="flex items-center">
            <!-- Avatar kini kuning-biru agar kontras -->
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400">
              <span class="font-semibold text-blue-900">A</span>
            </div>
            <div class="ml-3">
              <p class="text-sm font-semibold text-white">Admin</p>
              <p class="text-xs text-gray-400">Online</p>
            </div>
          </div>

          <!-- Tombol Logout -->
          <button 
            @click="handleLogout" 
            title="Logout"
            class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-800 hover:text-white"
          >
            <ArrowRightOnRectangleIcon class="h-5 w-5" />
            <span class="sr-only">Logout</span>
          </button>
        </div>
      </div>
    </aside>
    

    <!-- 2. Konten Utama (Area Halaman) -->
    <!-- 'overflow-y-auto' di sini membuat HANYA area ini yang scroll -->
    <main class="flex-1 overflow-y-auto overscroll-y-none p-8 lg:p-10">
      <!-- Di sinilah halaman (children) akan di-render -->
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { shallowRef } from 'vue';
// Impor RouterLink dan RouterView agar dikenali di template
import { useRouter, RouterLink, RouterView } from 'vue-router';
// Impor ikon-ikon yang kita perlukan
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,
  BoltIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline';

// Data untuk navigasi
const navigation = shallowRef([
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Manage Users', href: '/manage-users', icon: UsersIcon },
  { name: 'Manage Units', href: '/manage-units', icon: BuildingOfficeIcon },
  { name: 'Master ATK', href: '/master-atk', icon: ClipboardDocumentListIcon },
  { name: 'Manage Stock', href: '/manage-stock', icon: ArchiveBoxIcon },
]);

// Logika
const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem('userLoggedIn');
  router.push({ name: 'Login' }); // Asumsi Anda punya rute bernama 'Login'
};
</script>

<style scoped>
/* Ini adalah bagian PENTING untuk tema 10/10.
  Kita men-style 'router-link-exact-active' (link yang aktif)
  agar menggunakan aksen kuning sesuai permintaan.
*/
.nav-link.router-link-exact-active {
  background-color: #1E40AF; /* bg-blue-800 */
  color: #FBBF24; /* text-yellow-400 */
  font-weight: 600; /* semibold */
}

/* Mengubah warna ikon saat link aktif menjadi kuning */
.nav-link.router-link-exact-active .nav-icon {
  color: #FBBF24; /* text-yellow-400 */
}
</style>