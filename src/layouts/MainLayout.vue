<template>
  <Transition name="modal-fade">
    <div v-if="isLogoutModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        class="absolute inset-0 bg-gray-900 bg-opacity-75"
        @click="cancelLogout"
      ></div>

      <Transition name="modal-scale">
        <div v-if="isLogoutModalOpen" class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                Konfirmasi Logout
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Apakah Anda yakin ingin keluar dari aplikasi?
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:gap-3">
            <button 
              type="button" 
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 sm:w-auto"
              @click="confirmLogout"
            >
              Ya, Logout
            </button>
            <button 
              type="button" 
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 sm:mt-0 sm:w-auto"
              @click="cancelLogout"
            >
              Batal
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
  
  <div class="flex min-h-screen bg-gray-50">
    <aside
      class="fixed left-0 top-0 z-20 h-screen flex flex-col bg-blue-900 text-gray-300 shadow-lg transition-all duration-500 ease-in-out"
      :class="isSidebarOpen ? 'w-64' : 'w-20'"
    >
      <div class="relative flex items-center justify-center border-b border-blue-700 p-6">
        <BoltIcon class="h-8 w-8 text-yellow-400" />

        <span
          :class="[
            isSidebarOpen ? 'w-auto opacity-100 ml-3 transition-all duration-500 delay-150' : 'w-0 opacity-0 ml-0',
            'overflow-hidden whitespace-nowrap text-lg font-bold text-white'
          ]"
        >
          ATK Icon Plus
        </span>

        <button
          @click="isSidebarOpen = !isSidebarOpen"
          class="absolute -right-3.5 top-1/2 -translate-y-1/2 z-30 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-blue-800 text-yellow-400 transition duration-300 hover:bg-yellow-400 hover:text-blue-900"
        >
          <ChevronDoubleLeftIcon
            :class="[isSidebarOpen ? '' : 'rotate-180', 'h-4 w-4 transition-transform duration-500']"
          />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto p-4">
        <ul class="space-y-1">
          <li v-for="item in navigation" :key="item.name">
            <RouterLink
              :to="item.href"
              class="group flex items-center rounded-lg px-3 py-3 text-sm font-medium relative overflow-hidden transition-all duration-200"
              :class="[
                isActive(item.href)
                  ? 'bg-blue-800 text-yellow-400 font-semibold shadow-md'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white',
                !isSidebarOpen && 'justify-center'
              ]"
            >
              <span
                v-if="isActive(item.href)"
                class="absolute inset-y-0 left-0 w-1 bg-yellow-400 rounded-r"
              ></span>

              <component
                :is="item.icon"
                class="h-5 w-5 flex-shrink-0 transition-colors duration-200"
                :class="[
                  isActive(item.href)
                    ? 'text-yellow-400'
                    : 'text-blue-300 group-hover:text-white',
                  isSidebarOpen ? 'mr-3' : 'mr-0'
                ]"
              />

              <span
                :class="[
                  isSidebarOpen ? 'w-auto opacity-100 transition-all duration-500 delay-150' : 'w-0 opacity-0',
                  'truncate overflow-hidden'
                ]"
              >
                {{ item.name }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="mt-auto border-t border-blue-700 p-4">
        <div
          :class="[
            'relative w-full transition-all duration-500 ease-in-out',
            isSidebarOpen ? 'h-10' : 'h-20'
          ]"
        >
          <div
            :class="[
              'absolute flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 transition-all duration-500 ease-in-out',
              isSidebarOpen
                ? 'left-0 top-0'
                : 'left-1/2 top-0 -translate-x-1/2'
            ]"
          >
            <span class="font-semibold text-blue-900 capitalize">
              {{ currentUser.charAt(0) }}
            </span>
          </div>

          <div
            :class="[
              'absolute left-12 top-1/2 -translate-y-1/2 overflow-hidden text-left transition-all duration-500',
              isSidebarOpen
                ? 'opacity-100 delay-150'
                : 'opacity-0'
            ]"
          >
            <p class="text-sm font-semibold text-white whitespace-nowrap capitalize">
              {{ currentUser }}
            </p>
            <p class="text-xs text-gray-400 whitespace-nowrap">Online</p>
          </div>

          <button
            @click="handleLogout" 
            class="absolute rounded-lg p-2 text-yellow-400 hover:bg-red-400 hover:text-white transition-all duration-500 ease-in-out"
            :class="[
              isSidebarOpen
                ? 'right-0 top-1/2 -translate-y-1/2'
                : 'left-1/2 top-12 -translate-x-1/2'
            ]"
            title="Logout"
          >
            <ArrowRightOnRectangleIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>

    <main
      class="flex-1 min-h-screen p-6 lg:p-10 overflow-auto transition-all duration-500 ease-in-out"
      :class="isSidebarOpen ? 'ml-64' : 'ml-20'"
    >
      <div class="rounded-lg bg-white p-6 shadow">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';

import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,
  BoltIcon,
  ArrowRightOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline';

const navigation = shallowRef([
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Manage Users', href: '/manage-users', icon: UsersIcon },
  { name: 'Manage Units', href: '/manage-units', icon: BuildingOfficeIcon },
  { name: 'Master ATK', href: '/master-atk', icon: ClipboardDocumentListIcon },
  { name: 'Manage Stock', href: '/manage-stock', icon: ArchiveBoxIcon }
]);

const router = useRouter();
const route = useRoute();

// --- LOGIKA USERNAME DINAMIS ---
const currentUser = ref('Admin'); // Default name

// Saat layout dimuat, cek local storage
onMounted(() => {
  const storedUser = localStorage.getItem('activeUser');
  if (storedUser) {
    currentUser.value = storedUser;
  }
});
// -----------------------------

// Active route check
const isActive = (href) => {
  const current = route.path.replace(/\/+$/, '');
  const target = href.replace(/\/+$/, '');
  return current.startsWith(target);
};

// Logika Modal & Logout
const isLogoutModalOpen = ref(false);

const handleLogout = () => {
  isLogoutModalOpen.value = true;
};

const cancelLogout = () => {
  isLogoutModalOpen.value = false;
};

const confirmLogout = () => {
  localStorage.removeItem('userLoggedIn');
  localStorage.removeItem('activeUser'); // Hapus nama user saat logout
  router.push({ name: 'Login' });
  isLogoutModalOpen.value = false;
};

// Sidebar state
const isSidebarOpen = ref(true);
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.1s;
}
.modal-scale-leave-active {
  transition: all 0.2s ease-in-out;
}
.modal-scale-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>