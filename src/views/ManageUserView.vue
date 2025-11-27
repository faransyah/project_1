<template>
  <!-- TOAST NOTIFICATION -->
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

  <!-- CONFIRM DELETE MODAL -->
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
                <h3 class="text-lg font-bold leading-6 text-slate-900" id="modal-title">{{ confirmModal.title }}</h3>
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
  
  <!-- MAIN CONTENT -->
  <div class="space-y-8">
    
    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Manage Users</h1>
        <p class="mt-2 text-base text-slate-500">
          Kelola Data Karyawan & Hak Akses (Referensi: <code>c_user</code>).
        </p>
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

    <!-- CARD CONTAINER -->
    <div class="rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] border border-slate-100">
      
      <!-- TOOLBAR -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <UserGroupIcon class="h-5 w-5 text-slate-400" />
          Daftar Pegawai
        </h2>

        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <!-- SEARCH -->
          <div class="relative w-full sm:w-72">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon class="h-4 w-4 text-slate-400" />
            </div>
            <input 
              v-model="searchQuery"
              @input="handleSearch"
              type="text" 
              class="block w-full rounded-lg border-0 py-2 pl-10 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow" 
              placeholder="Cari nama, NIP, atau unit..."
            >
          </div>

          <!-- ADD BUTTON -->
          <button 
            @click="openModal(null)"
            class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 active:scale-95 whitespace-nowrap"
          >
            <PlusIcon class="mr-1.5 h-4 w-4" />
            Tambah Pegawai
          </button>
        </div>
      </div>

      <!-- TABLE -->
      <div class="overflow-hidden rounded-xl border border-slate-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 sm:pl-6">Identitas Pegawai</th>
                <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Unit & Jabatan</th>
                <th scope="col" class="hidden px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 lg:table-cell">Role</th>
                <th scope="col" class="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Status</th>
                <th scope="col" class="py-3.5 pl-3 pr-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500 sm:pr-6">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">
              
              <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="py-12 text-center text-sm text-slate-500">
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
                <!-- KOLOM 1: IDENTITAS -->
                <td class="py-4 pl-4 pr-3 sm:pl-6">
                  <div class="flex items-start gap-3">
                    <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xs shadow-sm overflow-hidden border border-blue-200">
                       <img v-if="user.url_photo" :src="user.url_photo" alt="" class="h-full w-full object-cover" />
                       <span v-else>{{ user.full_name.charAt(0) }}{{ user.full_name.split(' ').length > 1 ? user.full_name.split(' ')[1].charAt(0) : '' }}</span>
                    </div>
                    <div>
                      <div class="text-sm font-bold text-slate-800">{{ user.full_name }}</div>
                      <div class="text-xs text-slate-500 mt-0.5 font-mono flex items-center gap-1">
                        <span class="bg-slate-100 px-1 rounded text-[10px] font-semibold tracking-wider text-slate-600">NIP</span> {{ user.nip }}
                      </div>
                      <div class="text-[10px] text-slate-400 mt-0.5">@{{ user.username }}</div>
                    </div>
                  </div>
                </td>

                <!-- KOLOM 2: UNIT & JABATAN -->
                <td class="px-3 py-4">
                   <div class="flex flex-col gap-1">
                      <div class="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded w-fit border border-blue-100">
                        <BuildingOfficeIcon class="h-3 w-3" />
                        {{ getUnitAlias(user.unit_id) }}
                      </div>
                      <div class="text-xs text-slate-600 font-medium mt-0.5">
                        {{ user.position_name || '-' }}
                      </div>
                   </div>
                </td>

                <!-- KOLOM 3: ROLE (Dikembalikan untuk kemudahan monitoring) -->
                <td class="hidden px-3 py-4 lg:table-cell">
                   <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="user.role === 'Admin' 
                      ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20' 
                      : 'bg-slate-100 text-slate-600 ring-slate-500/20'"
                  >
                    {{ user.role }}
                  </span>
                </td>

                <!-- KOLOM 4: STATUS -->
                <td class="px-3 py-4 text-center">
                   <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                    :class="user.is_active 
                      ? 'bg-green-50 text-green-700 ring-green-600/20' 
                      : 'bg-red-50 text-red-700 ring-red-600/20'"
                  >
                    <span class="h-1.5 w-1.5 rounded-full mr-1.5" :class="user.is_active ? 'bg-green-600' : 'bg-red-500'"></span>
                    {{ user.is_active ? 'Aktif' : 'Non-Aktif' }}
                  </span>
                </td>

                <!-- KOLOM 5: AKSI -->
                <td class="py-4 pl-3 pr-4 text-center text-xs font-medium sm:pr-6">
                  <div class="flex items-center justify-center gap-2">
                    <button @click="openModal(user)" class="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-all font-semibold shadow-sm">Edit</button>
                    <button @click="handleDelete(user.id)" class="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-all font-semibold shadow-sm">Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAGINATION FOOTER -->
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

  <!-- USER FORM MODAL -->
  <!-- Passing prop 'unitOptions' agar dropdown unit di modal terisi -->
  <UserFormModal
    :show="showModal"
    :user-to-edit="selectedUser"
    :unit-options="units" 
    @close="closeModal"
    @save="handleSave"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, shallowRef } from 'vue';
import { 
  PlusIcon, CalendarDaysIcon, UserGroupIcon, UserIcon, 
  CheckCircleIcon, XCircleIcon, XMarkIcon, NoSymbolIcon,
  MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, IdentificationIcon
} from '@heroicons/vue/24/outline';

import UserFormModal from '../components/UserFormModal.vue';

// --- TOAST LOGIC ---
const toast = ref({ show: false, message: '', type: 'success' });
let toastTimeout = null;
const triggerToast = (message, type = 'success') => {
  if (toastTimeout) clearTimeout(toastTimeout); 
  toast.value.message = message; toast.value.type = type; toast.value.show = true;
  toastTimeout = setTimeout(() => { toast.value.show = false; }, 3000);
};

// --- CONFIRM MODAL LOGIC ---
const confirmModal = ref({ show: false, title: '', message: '', buttonText: '', buttonClass: '', icon: null, iconBg: '', iconColor: '', onConfirmAction: () => {} });
const openConfirmModal = ({ title, message, buttonText, buttonClass, icon, iconBg, iconColor, onConfirm }) => {
  confirmModal.value = { show: true, title, message, buttonText, buttonClass, icon: shallowRef(icon), iconBg, iconColor, onConfirmAction: onConfirm };
};
const closeConfirmModal = () => { confirmModal.value.show = false; };
const onConfirm = () => { if (typeof confirmModal.value.onConfirmAction === 'function') { confirmModal.value.onConfirmAction(); } closeConfirmModal(); };

// --- TIME LOGIC ---
const currentTime = ref('');
let timeInterval = null;
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }).replace(/\./g, ':');
};
onMounted(() => { updateTime(); timeInterval = setInterval(updateTime, 1000); });
onUnmounted(() => { if (timeInterval) clearInterval(timeInterval); });

// --- DATA UNIT (Referensi untuk Dropdown) ---
const units = ref([
  { id: 1, alias: 'UID Jatim', name: 'Unit Induk Distribusi Jawa Timur' },
  { id: 2, alias: 'UID Jabar', name: 'Unit Induk Distribusi Jawa Barat' },
  { id: 3, alias: 'UID Jaya', name: 'Unit Induk Distribusi Jakarta Raya' },
  { id: 4, alias: 'UID Jateng', name: 'Unit Induk Distribusi Jawa Tengah & DIY' },
  { id: 5, alias: 'UID Bali', name: 'Unit Induk Distribusi Bali' },
  { id: 7, alias: 'UID Sumut', name: 'Unit Induk Distribusi Sumatera Utara' },
]);

// Helper untuk mendapatkan alias unit berdasarkan ID
const getUnitAlias = (unitId) => {
  const unit = units.value.find(u => u.id === unitId);
  return unit ? unit.alias : 'Unit Tidak Diketahui';
};

// --- DATABASE SIMULASI USER (Sesuai c_user + Role untuk UI) ---
// Role tetap ada di frontend state untuk kebutuhan UI/UX, meski di backend tabelnya terpisah.
const users = ref([
  { id: 1, full_name: 'Budi Santoso', nip: '77889900', username: 'budi.s', email: 'budi.jatim@pln.co.id', phone: '081298765432', unit_id: 1, position_name: 'Staff Gudang', role: 'User', is_active: 1, password: 'password-budi', created_at: '2023-02-15', created_by: 'Admin Utama' },
  { id: 2, full_name: 'Citra Lestari', nip: '88990011', username: 'citra.l', email: 'citra.jabar@pln.co.id', phone: '081345678901', unit_id: 2, position_name: 'Supervisor Logistik', role: 'User', is_active: 1, password: 'password-citra', created_at: '2023-03-10', created_by: 'Admin Utama' },
  { id: 3, full_name: 'Dewi Ayu', nip: '99001122', username: 'dewi.a', email: 'dewi.bali@pln.co.id', phone: '081234561234', unit_id: 5, position_name: 'Staff Administrasi', role: 'User', is_active: 1, password: 'password-dewi', created_at: '2023-04-05', created_by: 'Admin Utama' },
  { id: 4, full_name: 'Erik Kurniawan', nip: '11223344', username: 'erik.k', email: 'erik.ntb@pln.co.id', phone: '085678901234', unit_id: 1, position_name: 'Teknisi Lapangan', role: 'User', is_active: 0, password: 'password-erik', created_at: '2023-05-20', created_by: 'Budi Santoso' },
  { id: 5, full_name: 'Fajar Nugraha', nip: '22334455', username: 'fajar.n', email: 'fajar.ntt@pln.co.id', phone: '081908765432', unit_id: 7, position_name: 'Staff Gudang', role: 'User', is_active: 1, password: 'password-fajar', created_at: '2023-06-12', created_by: 'Admin Utama' },
  { id: 6, full_name: 'Gina Maharani', nip: '33445566', username: 'gina.m', email: 'gina.riau@pln.co.id', phone: '081223344556', unit_id: 1, position_name: 'Manager Keuangan', role: 'User', is_active: 1, password: 'password-gina', created_at: '2023-07-01', created_by: 'Admin Utama' },
  { id: 7, full_name: 'Hendra Wijaya', nip: '44556677', username: 'hendra.w', email: 'hendra.sumbar@pln.co.id', phone: '085212345678', unit_id: 2, position_name: 'Staff Umum', role: 'User', is_active: 1, password: 'password-hendra', created_at: '2023-08-15', created_by: 'Admin Utama' },
  { id: 8, full_name: 'Intan Permata', nip: '55667788', username: 'intan.p', email: 'intan.kaltim@pln.co.id', phone: '081399887766', unit_id: 3, position_name: 'Staff Logistik', role: 'User', is_active: 1, password: 'password-intan', created_at: '2023-09-10', created_by: 'Admin Utama' },
  { id: 9, full_name: 'Joko Widodo', nip: '66778899', username: 'joko.w', email: 'joko.papua@pln.co.id', phone: '081233221100', unit_id: 4, position_name: 'Supervisor Teknik', role: 'User', is_active: 0, password: 'password-joko', created_at: '2023-10-05', created_by: 'Admin Utama' },
  { id: 10, full_name: 'Kiki Amalia', nip: '77889901', username: 'kiki.a', email: 'kiki.sulsel@pln.co.id', phone: '085712349876', unit_id: 5, position_name: 'Staff Gudang', role: 'User', is_active: 1, password: 'password-kiki', created_at: '2023-11-01', created_by: 'Admin Utama' },
  { id: 11, full_name: 'Lukman Hakim', nip: '88990012', username: 'lukman.h', email: 'lukman.kalbar@pln.co.id', phone: '081255443322', unit_id: 7, position_name: 'Super Admin', role: 'Admin', is_active: 1, password: 'password-lukman', created_at: '2023-12-12', created_by: 'Admin Utama' },
]);

// --- SEARCH & PAGINATION LOGIC ---
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10; // Pagination 10 Item

const filteredUsers = computed(() => {
  return users.value
    .filter(user => {
      const search = searchQuery.value.toLowerCase();
      const unitName = getUnitAlias(user.unit_id).toLowerCase();
      return (
        user.full_name.toLowerCase().includes(search) ||
        user.username.toLowerCase().includes(search) ||
        user.nip.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.position_name.toLowerCase().includes(search) ||
        unitName.includes(search)
      );
    })
    .sort((a, b) => a.full_name.localeCompare(b.full_name)); // Ascending Sort by Name
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage));

const handleSearch = () => { currentPage.value = 1; };

// --- MODAL & ACTIONS ---
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

// HANDLE SAVE
const handleSave = (userData) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    if (userData.id) {
      // UPDATE
      const index = users.value.findIndex(u => u.id === userData.id);
      if (index !== -1) {
        const oldPassword = users.value[index].password;
        const newData = { ...userData };
        
        // Jika password tidak diubah (undefined/null), pakai yang lama
        if (!newData.password) newData.password = oldPassword;

        newData.updated_at = today;
        newData.updated_by = 'Admin'; 
        
        users.value[index] = newData;
        triggerToast('Data user berhasil diperbarui.', 'success'); 
      } else {
        throw new Error('User not found');
      }
    } else {
      // CREATE
      const newId = users.value.length > 0 ? Math.max(...users.value.map(u => u.id)) + 1 : 1;
      const newUser = { 
        ...userData, 
        id: newId, 
        created_at: today,
        created_by: 'Admin',
        is_active: 1
      };
      users.value.push(newUser);
      triggerToast('User baru berhasil ditambahkan.', 'success'); 
    }
    closeModal();
  } catch (error) {
    triggerToast('Gagal menyimpan data user.', 'error'); 
  }
};

// HANDLE DELETE
const handleDelete = (userId) => {
  openConfirmModal({
    title: 'Hapus User',
    message: 'Apakah Anda yakin ingin menghapus user ini? Data yang dihapus tidak dapat dikembalikan.',
    buttonText: 'Hapus',
    buttonClass: 'bg-red-600 hover:bg-red-700 focus-visible:outline-red-600',
    icon: NoSymbolIcon,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    onConfirm: () => {
      try {
        users.value = users.value.filter(u => u.id !== userId);
        
        if (paginatedUsers.value.length === 0 && currentPage.value > 1) {
          currentPage.value--;
        }

        triggerToast('User berhasil dihapus.', 'success');
        
      } catch (error) {
        triggerToast('Gagal menghapus user.', 'error');
      }
    }
  });
};
</script>

<style scoped>
.toast-slide-top-enter-active{ transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-slide-top-leave-active { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-slide-top-enter-from, .toast-slide-top-leave-to { opacity: 0; transform: translateY(-20px) translateX(-50%); }
</style>