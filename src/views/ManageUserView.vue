<template>
  <Transition name="toast-slide-top">
    <div v-if="toast.show" class="fixed top-20 left-1/2 z-[100] w-full max-w-sm -translate-x-1/2 transform px-4">
      <div class="flex items-center overflow-hidden rounded-2xl p-4 shadow-2xl backdrop-blur-xl ring-1 transition-all"
        :class="{ 
          'bg-white/95 text-slate-800 ring-slate-200': true, 
          'border-l-4 border-green-500': toast.type === 'success', 
          'border-l-4 border-red-500': toast.type === 'error' 
        }">
        <div class="flex-shrink-0">
          <CheckCircleIcon v-if="toast.type === 'success'" class="h-6 w-6 text-green-500" />
          <XCircleIcon v-if="toast.type === 'error'" class="h-6 w-6 text-red-500" />
        </div>
        <div class="ml-3 flex-1"><p class="text-sm font-semibold">{{ toast.message }}</p></div>
        <button @click="toast.show = false" class="ml-4 flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"><XMarkIcon class="h-5 w-5" /></button>
      </div>
    </div>
  </Transition>

  <div v-if="confirmModal.show" class="relative z-[60]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" @click="closeConfirmModal"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg ring-1 ring-slate-900/5">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 transition-colors" :class="confirmModal.iconBg">
                <component :is="confirmModal.icon" class="h-6 w-6" :class="confirmModal.iconColor" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-bold leading-6 text-slate-900">{{ confirmModal.title }}</h3>
                <div class="mt-2"><p class="text-sm text-slate-500 leading-relaxed">{{ confirmModal.message }}</p></div>
              </div>
            </div>
          </div>
          <div class="bg-slate-50/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
            <button type="button" @click="onConfirm" class="inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-95 sm:w-auto" :class="confirmModal.buttonClass">{{ confirmModal.buttonText }}</button>
            <button type="button" @click="closeConfirmModal" class="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all sm:mt-0 sm:w-auto">Batal</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Transition name="modal-fade">
    <div v-if="showModal" class="relative z-[70]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-100">
            
            <div class="bg-white px-4 py-4 sm:px-6 border-b border-slate-100 flex justify-between items-center">
              <h3 class="text-lg font-bold leading-6 text-slate-800">
                {{ formState.id ? 'Edit User' : 'Tambah User Baru' }}
              </h3>
              <button @click="closeModal" class="text-slate-400 hover:text-slate-500">
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>

            <form @submit.prevent="saveUser">
              <div class="px-4 py-6 sm:px-6 space-y-5">
                <div>
                  <label class="block text-sm font-medium leading-6 text-slate-700">Nama Lengkap</label>
                  <input type="text" v-model="formState.name" required class="mt-2 block w-full rounded-md border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 px-3" placeholder="Masukkan nama...">
                </div>

                <div>
                  <label class="block text-sm font-medium leading-6 text-slate-700">Email</label>
                  <input type="email" v-model="formState.email" required class="mt-2 block w-full rounded-md border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 px-3" placeholder="contoh@email.com">
                </div>

                <div>
                  <label class="block text-sm font-medium leading-6 text-slate-700">Peran (Role)</label>
                  <select v-model="formState.role" class="mt-2 block w-full rounded-md border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 px-3">
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium leading-6 text-slate-700">
                    Password <span v-if="formState.id" class="text-slate-400 font-normal text-xs">(Biarkan kosong jika tidak diubah)</span>
                  </label>
                  <input type="password" v-model="formState.password" :required="!formState.id" class="mt-2 block w-full rounded-md border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 px-3" placeholder="••••••••">
                </div>
              </div>

              <div class="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2 border-t border-slate-100">
                <button type="submit" class="inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto transition-colors">
                  {{ formState.id ? 'Simpan Perubahan' : 'Tambah User' }}
                </button>
                <button type="button" @click="closeModal" class="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto transition-colors">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Transition>


  <div class="space-y-8"> 
    
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Manage Users</h1>
        <p class="mt-2 text-base text-slate-500">Kelola pengguna yang dapat mengakses sistem.</p>
      </div>
      <div class="hidden sm:flex flex-col items-end justify-center">
        <div class="flex items-center gap-2 text-sm font-bold text-slate-700">
          <CalendarDaysIcon class="h-4 w-4 text-slate-400" />
          <span>{{ new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
        </div>
        <div class="flex items-center gap-1.5 mt-1">
          <span class="relative flex h-1.5 w-1.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          <span class="text-xs font-medium text-slate-500 tabular-nums tracking-wide">{{ currentTime }} WIB</span>
        </div>
      </div>
    </div>

    <div class="rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] border border-slate-100">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <UserGroupIcon class="h-5 w-5 text-slate-400" />
          Daftar Pengguna
        </h2>

        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div class="relative w-full sm:w-64">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon class="h-4 w-4 text-slate-400" />
            </div>
            <input 
              v-model="searchQuery"
              @input="handleSearch"
              type="text" 
              class="block w-full rounded-lg border-0 py-2 pl-10 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow" 
              placeholder="Cari nama atau email..."
            >
          </div>

          <button 
            @click="openModal(null)"
            class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 active:scale-95 whitespace-nowrap"
          >
            <PlusIcon class="mr-1.5 h-4 w-4" />
            Tambah User
          </button>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-slate-200">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 sm:pl-6">Nama</th>
              <th scope="col" class="hidden px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wide text-slate-500 lg:table-cell">Email</th>
              <th scope="col" class="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Peran</th>
              <th scope="col" class="py-3.5 pl-3 pr-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500 sm:pr-6">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            
            <tr v-if="filteredUsers.length === 0">
              <td colspan="4" class="py-12 text-center text-sm text-slate-500">
                <div class="flex flex-col items-center justify-center">
                  <div class="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <UserIcon class="h-6 w-6 text-slate-300" />
                  </div>
                  <p v-if="searchQuery">Tidak ada user yang cocok dengan "<strong>{{ searchQuery }}</strong>"</p>
                  <p v-else>Belum ada data pengguna.</p>
                </div>
              </td>
            </tr>

            <tr v-for="user in paginatedUsers" :key="user.id" class="group hover:bg-slate-50/80 transition-colors">
              <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-semibold text-slate-800 sm:w-auto sm:max-w-none sm:pl-6 text-left">
                {{ user.name }}
                <dl class="font-normal lg:hidden">
                  <dt class="sr-only">Email</dt>
                  <dd class="mt-1 truncate text-slate-500">{{ user.email }}</dd>
                </dl>
              </td>
              <td class="hidden px-3 py-4 text-sm text-slate-500 lg:table-cell group-hover:text-slate-700 transition-colors text-center">
                {{ user.email }}
              </td>
              <td class="px-3 py-4 text-sm text-slate-500 text-center">
                <span class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                  :class="user.role === 'Admin' 
                    ? 'bg-blue-50 text-blue-700 ring-blue-600/20' 
                    : 'bg-slate-100 text-slate-600 ring-slate-500/20'"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="py-4 pl-3 pr-4 text-center text-xs font-medium sm:pr-6">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openModal(user)" class="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-all font-semibold shadow-sm">Edit</button>
                  <button @click="handleDelete(user.id)" class="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-all font-semibold shadow-sm">Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredUsers.length > 0" class="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-3 sm:px-6">
          <div class="flex flex-1 justify-between sm:hidden">
            <button @click="currentPage > 1 ? currentPage-- : null" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Previous</button>
            <button @click="currentPage < totalPages ? currentPage++ : null" :disabled="currentPage === totalPages" class="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-slate-700">
                Menampilkan <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> sampai <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}</span> dari <span class="font-medium">{{ filteredUsers.length }}</span> hasil
              </p>
            </div>
            <div>
              <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button @click="currentPage > 1 ? currentPage-- : null" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-white focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                  <span class="sr-only">Previous</span>
                  <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                </button>
                <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 focus:outline-offset-0 bg-white">
                  Hal {{ currentPage }} / {{ totalPages }}
                </span>
                <button @click="currentPage < totalPages ? currentPage++ : null" :disabled="currentPage === totalPages" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-white focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                  <span class="sr-only">Next</span>
                  <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  PlusIcon, CalendarDaysIcon, UserGroupIcon, UserIcon, CheckCircleIcon, XCircleIcon, XMarkIcon, NoSymbolIcon,
  MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon 
} from '@heroicons/vue/24/outline';

// --- STATE: DATABASE USER (DUMMY) ---
const users = ref([
  { id: 1, name: 'Admin Utama', email: 'admin@pln.co.id', role: 'Admin', password: 'password-admin' },
  { id: 2, name: 'Budi Santoso', email: 'budi.jatim@pln.co.id', role: 'User', password: 'password-budi' },
  { id: 3, name: 'Citra Lestari', email: 'citra.jabar@pln.co.id', role: 'User', password: 'password-citra' },
  { id: 4, name: 'Dewi Ayu', email: 'dewi.bali@pln.co.id', role: 'User', password: 'password-dewi' },
  { id: 5, name: 'Erik Kurniawan', email: 'erik.ntb@pln.co.id', role: 'User', password: 'password-erik' },
  { id: 6, name: 'Fajar Nugraha', email: 'fajar.ntt@pln.co.id', role: 'User', password: 'password-fajar' },
  { id: 7, name: 'Gina Maharani', email: 'gina.riau@pln.co.id', role: 'User', password: 'password-gina' },
  { id: 8, name: 'Hendra Wijaya', email: 'hendra.sumbar@pln.co.id', role: 'User', password: 'password-hendra' },
  { id: 9, name: 'Intan Permata', email: 'intan.kaltim@pln.co.id', role: 'User', password: 'password-intan' },
  { id: 10, name: 'Joko Widodo', email: 'joko.papua@pln.co.id', role: 'User', password: 'password-joko' },
  { id: 11, name: 'Kiki Amalia', email: 'kiki.sulsel@pln.co.id', role: 'User', password: 'password-kiki' },
  { id: 12, name: 'Lukman Hakim', email: 'lukman.kalbar@pln.co.id', role: 'Admin', password: 'password-lukman' },
]);

// --- LOGIC: SEARCH & PAGINATION ---
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const search = searchQuery.value.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  });
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage));

const handleSearch = () => { currentPage.value = 1; };

// --- LOGIC: MODAL FORM (GABUNGAN) ---
const showModal = ref(false);

// State untuk inputan Form
const formState = ref({
  id: null,
  name: '',
  email: '',
  role: 'User',
  password: ''
});

// Buka Modal (Bisa untuk Add atau Edit)
const openModal = (user) => {
  if (user) {
    // Mode EDIT: Isi form dengan data user yg diklik
    formState.value = { ...user, password: '' }; // Kosongkan password biar aman
  } else {
    // Mode ADD: Reset form jadi kosong
    formState.value = { id: null, name: '', email: '', role: 'User', password: '' };
  }
  showModal.value = true;
};

// Tutup Modal
const closeModal = () => { showModal.value = false; };

// Simpan Data (Create / Update)
const saveUser = () => {
  if (formState.value.id) {
    // UPDATE
    const index = users.value.findIndex(u => u.id === formState.value.id);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...formState.value };
    }
    triggerToast('Data user berhasil diperbarui.', 'success');
  } else {
    // CREATE
    const newId = users.value.length > 0 ? Math.max(...users.value.map(u => u.id)) + 1 : 1;
    users.value.push({ ...formState.value, id: newId });
    triggerToast('User baru berhasil ditambahkan.', 'success');
  }
  closeModal();
};

// --- LOGIC: DELETE ---
const handleDelete = (userId) => {
  openConfirmModal({
    title: 'Hapus User',
    message: 'Apakah Anda yakin ingin menghapus user ini? Data yang dihapus tidak dapat dikembalikan.',
    buttonText: 'Hapus',
    buttonClass: 'bg-red-600 hover:bg-red-700',
    icon: NoSymbolIcon,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    onConfirm: () => {
      users.value = users.value.filter(u => u.id !== userId);
      if (paginatedUsers.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
      }
      triggerToast('User berhasil dihapus.', 'error'); 
    }
  });
};

// --- UTILITIES: TOAST, CONFIRM & CLOCK ---
const toast = ref({ show: false, message: '', type: 'success' });
let toastTimeout = null;
const triggerToast = (message, type = 'success') => {
  if (toastTimeout) clearTimeout(toastTimeout);
  toast.value = { show: true, message, type };
  toastTimeout = setTimeout(() => { toast.value.show = false; }, 3000);
};

const confirmModal = ref({ show: false, title: '', message: '', onConfirmAction: () => {} });
const openConfirmModal = (config) => { 
  confirmModal.value = { show: true, ...config, onConfirmAction: config.onConfirm }; 
};
const closeConfirmModal = () => { confirmModal.value.show = false; };
const onConfirm = () => { confirmModal.value.onConfirmAction(); closeConfirmModal(); };

const currentTime = ref('');
let timeInterval = null;
onMounted(() => {
  const updateTime = () => {
    currentTime.value = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(/\./g, ':');
  };
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});
onUnmounted(() => { if (timeInterval) clearInterval(timeInterval); });
</script>

<style scoped>
/* Animasi Toast */
.toast-slide-top-enter-active{ transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-slide-top-leave-active { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-slide-top-enter-from, .toast-slide-top-leave-to { opacity: 0; transform: translateY(-20px) translateX(-50%); }

/* Animasi Modal Fade */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>