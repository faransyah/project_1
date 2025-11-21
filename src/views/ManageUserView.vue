<template>
  <div class="space-y-8">    
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
      
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Manage Users</h1>
        <p class="mt-2 text-base text-slate-500">
          Kelola pengguna yang dapat mengakses sistem.
        </p>
      </div>
      
      <div class="hidden sm:flex flex-col items-end justify-center">
        <div class="flex items-center gap-2 text-sm font-bold text-slate-700">
          <CalendarDaysIcon class="h-4 w-4 text-slate-400" />
          <span>
            {{ new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
          </span>
        </div>
        <div class="flex items-center gap-1.5 mt-1">
          <span class="relative flex h-1.5 w-1.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          <span class="text-xs font-medium text-slate-500 tabular-nums tracking-wide">
            {{ currentTime }} WIB
          </span>
        </div>
      </div>
    </div>

    <div class="rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] border border-slate-100">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <UserGroupIcon class="h-5 w-5 text-slate-400" />
          Daftar Pengguna
        </h2>

        <button 
          @click="openModal(null)"
          class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 active:scale-95"
        >
          <PlusIcon class="mr-1.5 h-4 w-4" />
          Tambah User
        </button>
      </div>

      <div class="overflow-hidden rounded-xl border border-slate-200">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 sm:pl-6">Nama</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 lg:table-cell">Email</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Peran</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            <tr v-if="users.length === 0">
              <td colspan="4" class="py-12 text-center text-sm text-slate-500">
                <div class="flex flex-col items-center justify-center">
                  <div class="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <UserIcon class="h-6 w-6 text-slate-300" />
                  </div>
                  <p>Belum ada data pengguna.</p>
                </div>
              </td>
            </tr>

            <tr v-for="user in users" :key="user.id" class="group hover:bg-slate-50/80 transition-colors">
              <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-semibold text-slate-800 sm:w-auto sm:max-w-none sm:pl-6">
                {{ user.name }}
                <dl class="font-normal lg:hidden">
                  <dt class="sr-only">Email</dt>
                  <dd class="mt-1 truncate text-slate-500">{{ user.email }}</dd>
                </dl>
              </td>
              
              <td class="hidden px-3 py-4 text-sm text-slate-500 lg:table-cell group-hover:text-slate-700 transition-colors">{{ user.email }}</td>
              
              <td class="px-3 py-4 text-sm text-slate-500">
                <span class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                  :class="user.role === 'Admin' 
                    ? 'bg-blue-50 text-blue-700 ring-blue-600/20' 
                    : 'bg-slate-100 text-slate-600 ring-slate-500/20'"
                >
                  {{ user.role }}
                </span>
              </td>
              
              <td class="py-4 pl-3 pr-4 text-right text-xs font-medium sm:pr-6">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="openModal(user)" 
                    class="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-all font-semibold shadow-sm"
                  >
                    Edit
                  </button>
                  <button 
                    @click="handleDelete(user.id)" 
                    class="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-all font-semibold shadow-sm"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <UserFormModal
    :show="showModal"
    :user-to-edit="selectedUser"
    @close="closeModal"
    @save="handleSave"
  />

</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
// Import Icon yang dibutuhkan untuk UI baru
import { PlusIcon, CalendarDaysIcon, UserGroupIcon, UserIcon } from '@heroicons/vue/24/outline';
import UserFormModal from '../components/UserFormModal.vue';

// --- LOGIKA JAM REAL-TIME (Agar header berfungsi) ---
const currentTime = ref('');
let timeInterval = null;

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta' 
  }).replace(/\./g, ':');
};

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval);
});
// ----------------------------------------------------

// --- DATABASE SIMULASI ---
const users = ref([
  { id: 1, name: 'Admin Utama', email: 'admin@pln.co.id', role: 'Admin', password: 'password-admin' },
  { id: 2, name: 'Budi (UID Jatim)', email: 'budi.jatim@pln.co.id', role: 'User', password: 'password-budi' },
  { id: 3, name: 'Citra (UID Jabar)', email: 'citra.jabar@pln.co.id', role: 'User', password: 'password-citra' },
  { id: 4, name: 'Dewi (UID Bali)', email: 'dewi.bali@pln.co.id', role: 'User', password: 'password-dewi' },
  { id: 5, name: 'Erik (UID NTB)', email: 'erik.ntb@pln.co.id', role: 'User', password: 'password-erik' },
  { id: 6, name: 'Fajar (UID NTT)', email: 'fajar.ntt@pln.co.id', role: 'User', password: 'password-fajar' },
  { id: 7, name: 'Gina (UID Riau)', email: 'gina.riau@pln.co.id', role: 'User', password: 'password-gina' },
  { id: 8, name: 'Hendra (UID Sumbar)', email: 'hendra.sumbar@pln.co.id', role: 'User', password: 'password-hendra' },
  { id: 9, name: 'Intan (UID Kaltim)', email: 'intan.kaltim@pln.co.id', role: 'User', password: 'password-intan' },
  { id: 10, name: 'Joko (UID Papua)', email: 'joko.papua@pln.co.id', role: 'User', password: 'password-joko' },
]);

const showModal = ref(false);
const selectedUser = ref(null); 

const openModal = (user) => {
  selectedUser.value = user ? { ...user } : null;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedUser.value = null;
};

// Create & Update
const handleSave = (userFromModal) => {
  if (userFromModal.id) {
    // --- UPDATE ---
    const index = users.value.findIndex(u => u.id === userFromModal.id);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...userFromModal };
    }
  } else {
    // --- CREATE ---
    const newId = users.value.length > 0 ? Math.max(...users.value.map(u => u.id)) + 1 : 1;
    users.value.push({ ...userFromModal, id: newId });
  }
  closeModal();
};

// Delete
const handleDelete = (userId) => {
  if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
    users.value = users.value.filter(u => u.id !== userId);
  }
};
</script>