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
  <div v-if="deleteModal.show" class="relative z-[1100]">
    <div class="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" @click="closeDeleteModal"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl transform transition-all">
         <div class="p-6 flex gap-4 items-start">
            <div class="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
               <NoSymbolIcon class="h-6 w-6" />
            </div>
            <div>
               <h3 class="text-lg font-bold text-slate-900">Hapus Pegawai</h3>
               <p class="text-sm text-slate-500 mt-1 leading-relaxed">
                  Yakin hapus <strong>{{ itemToDelete?.full_name }}</strong>? Akses login ke aplikasi akan dicabut secara permanen.
               </p>
            </div>
         </div>
         <div class="bg-slate-50 px-6 py-4 flex justify-end gap-3">
            <button @click="confirmDeleteAction" class="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 shadow-sm transition-all">Hapus Pegawai</button>
            <button @click="closeDeleteModal" class="px-5 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">Batal</button>
         </div>
      </div>
    </div>
  </div>

  <div class="space-y-8">
    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Manage Users</h1>
        <p class="mt-2 text-base text-slate-500">Kelola Akses Pegawai & Administrator Sistem.</p>
      </div>
      <div class="hidden sm:flex flex-col items-end justify-center">
        <div class="flex items-center gap-2 text-sm font-bold text-slate-700">
          <CalendarDaysIcon class="h-4 w-4 text-slate-400" /><span>{{ currentTime }} WIB</span>
        </div>
      </div>
    </div>

    <!-- CARD CONTAINER -->
    <div class="rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] border border-slate-100">
      
      <!-- TOOLBAR -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <UserGroupIcon class="h-5 w-5 text-slate-400" /> Daftar Pegawai
        </h2>
        <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <!-- Search -->
          <div class="relative w-full sm:w-64">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><MagnifyingGlassIcon class="h-4 w-4 text-slate-400" /></div>
            <input v-model="searchQuery" @input="handleSearch" type="text" class="block w-full rounded-lg border-0 h-10 py-1.5 pl-10 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow" placeholder="Cari nama / NIP...">
          </div>
          <!-- Filter Unit -->
          <div class="relative w-full sm:w-52">
             <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPinIcon class="h-4 w-4 text-slate-400" /></div>
             <select v-model="selectedUnit" @change="handleFilterChange" class="block w-full rounded-lg border-0 h-10 py-1.5 pl-9 pr-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 cursor-pointer">
                <option value="Semua Unit">Semua Unit</option>
                <option v-for="unit in allUnits" :key="unit.id" :value="unit.id">{{ unit.alias }}</option>
             </select>
          </div>
          <button @click="openModal(null)" class="inline-flex items-center justify-center rounded-lg bg-blue-600 h-10 px-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 whitespace-nowrap"><PlusIcon class="mr-1.5 h-4 w-4" /> Tambah User</button>
        </div>
      </div>

      <!-- TABLE -->
      <div class="overflow-hidden rounded-xl border border-slate-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <!-- Fixed Widths -->
                <th scope="col" class="w-[30%] py-3.5 pl-4 pr-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 sm:pl-6">Identitas</th>
                <th scope="col" class="w-[20%] px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Unit Kerja</th>
                <th scope="col" class="w-[15%] px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Jabatan</th>
                <th scope="col" class="w-[15%] px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Kontak</th>
                <th scope="col" class="w-[10%] px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Role & Status</th>
                <th scope="col" class="w-[10%] relative py-3.5 pl-3 pr-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500 sm:pr-6">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">
              <tr v-if="filteredUsers.length === 0"><td colspan="6" class="py-12 text-center text-sm text-slate-500">Tidak ada data pegawai yang cocok.</td></tr>
              
              <tr v-for="user in paginatedUsers" :key="user.id" class="group hover:bg-slate-50/80 transition-colors">
                <!-- Identitas (Clickable) -->
                <td class="py-4 pl-4 pr-3 sm:pl-6">
                  <div class="flex items-center gap-3 cursor-pointer group/user" @click="openDetailModal(user)">
                    <img v-if="user.url_photo" :src="user.url_photo" class="h-10 w-10 rounded-full border border-slate-200 object-cover shadow-sm group-hover/user:ring-2 group-hover/user:ring-blue-400 transition-all" />
                    <div class="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover/user:ring-2 group-hover/user:ring-blue-400 transition-all" v-else><UserIcon class="h-6 w-6" /></div>
                    <div class="min-w-0">
                      <div class="font-bold text-slate-800 text-sm truncate group-hover/user:text-blue-700 transition-colors">{{ user.full_name }}</div>
                      <div class="text-xs text-slate-500 font-mono bg-slate-100 px-1.5 rounded w-fit mt-0.5">NIP: {{ user.nip }}</div>
                    </div>
                  </div>
                </td>
                
                <td class="px-3 py-4 text-sm text-slate-600">
                   <div class="flex items-center gap-1.5">
                     <MapPinIcon class="h-3.5 w-3.5 text-slate-400" /> 
                     <span class="truncate max-w-[180px]" :title="getUnitAlias(user.unit_id)">{{ getUnitAlias(user.unit_id) }}</span>
                   </div>
                </td>
                
                <td class="px-3 py-4 text-sm text-slate-600 truncate max-w-[150px]" :title="user.position_name">{{ user.position_name }}</td>
                
                <td class="px-3 py-4 text-sm text-slate-600">
                   <div class="flex flex-col gap-0.5">
                      <span class="flex items-center gap-1.5 truncate max-w-[150px]" :title="user.email"><EnvelopeIcon class="h-3 w-3 text-slate-400" /> {{ user.email }}</span>
                      <span class="flex items-center gap-1.5 text-xs"><PhoneIcon class="h-3 w-3 text-slate-400" /> {{ user.phone }}</span>
                   </div>
                </td>
                
                <td class="px-3 py-4 text-center">
                   <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border mb-1" 
                         :class="user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-slate-50 text-slate-600 border-slate-100'">
                      {{ user.role }}
                   </span>
                   <div class="text-[10px] font-bold flex items-center justify-center gap-1" :class="user.is_active ? 'text-green-600' : 'text-red-600'">
                      <span class="h-1.5 w-1.5 rounded-full" :class="user.is_active ? 'bg-green-500' : 'bg-red-500'"></span>
                      {{ user.is_active ? 'Aktif' : 'Non-Aktif' }}
                   </div>
                </td>
                
                <td class="py-4 pl-3 pr-4 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button @click="openModal(user)" class="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md font-bold shadow-sm text-xs border border-blue-200 transition-all">Edit</button>
                    <button @click="handleDelete(user)" class="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md font-bold shadow-sm text-xs border border-red-200 transition-all">Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- PAGINATION -->
         <div v-if="filteredUsers.length > 0" class="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div><p class="text-sm text-slate-700">Menampilkan <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> sampai <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}</span> dari <span class="font-medium">{{ filteredUsers.length }}</span></p></div>
              <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">
                  <button @click="currentPage > 1 ? currentPage-- : null" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50"><ChevronLeftIcon class="h-5 w-5" /></button>
                  <button @click="currentPage < totalPages ? currentPage++ : null" :disabled="currentPage === totalPages" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50"><ChevronRightIcon class="h-5 w-5" /></button>
                </nav>
              </div>
            </div>
         </div>
      </div>
    </div>
  </div>

  <!-- COMPONENTS -->
  <UserFormModal 
    :show="showModal" 
    :user-to-edit="selectedUser" 
    :unit-options="allUnits"
    @close="closeModal" 
    @save="handleSave" 
  />

  <UserDetailModal
    :show="isDetailModalOpen"
    :user="detailUser"
    @close="closeDetailModal"
    @edit="handleDetailEdit"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { 
  UserGroupIcon, PlusIcon, CalendarDaysIcon, MagnifyingGlassIcon, 
  CheckCircleIcon, XCircleIcon, XMarkIcon, NoSymbolIcon,
  UserIcon, MapPinIcon, EnvelopeIcon, PhoneIcon, ChevronLeftIcon, ChevronRightIcon 
} from '@heroicons/vue/24/outline';

import { useInventoryStore } from '../../stores/inventoryStore';
import UserFormModal from '../../components/admin/UserFormModal.vue';
import UserDetailModal from '../../components/admin/UserDetailModal.vue';

const store = useInventoryStore();

// --- TOAST ---
const toast = ref({ show: false, message: '', type: 'success' });
let toastTimeout = null;
const triggerToast = (msg, type) => { 
  if (toastTimeout) clearTimeout(toastTimeout);
  toast.value = {show:true, message:msg, type}; 
  setTimeout(()=>toast.value.show=false, 3000); 
};

// --- DELETE ---
const deleteModal = ref({ show: false });
const itemToDelete = ref(null);
const confirmDeleteAction = () => {
  if(itemToDelete.value) {
    store.deleteUser(itemToDelete.value.id);
    if(paginatedUsers.value.length === 0 && currentPage.value > 1) currentPage.value--;
    triggerToast('Pegawai berhasil dihapus.', 'success');
    deleteModal.value.show = false;
  }
};
const closeDeleteModal = () => deleteModal.value.show = false;
const handleDelete = (user) => { itemToDelete.value = user; deleteModal.value.show = true; };

// --- DATA ---
const users = computed(() => store.users);
const allUnits = computed(() => store.units); 
const getUnitAlias = (id) => allUnits.value.find(u => u.id === id)?.alias || '-';
const getUnitName = (id) => allUnits.value.find(u => u.id === id)?.name || '-';
const getUnitAddress = (id) => allUnits.value.find(u => u.id === id)?.address || 'Alamat tidak tersedia';

// --- FILTER ---
const searchQuery = ref('');
const selectedUnit = ref('Semua Unit');
const currentPage = ref(1);
const itemsPerPage = 10;

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const search = searchQuery.value.toLowerCase();
    const matchSearch = user.full_name.toLowerCase().includes(search) || 
                        user.username.toLowerCase().includes(search) ||
                        user.nip.includes(search);
    const matchUnit = selectedUnit.value === 'Semua Unit' || user.unit_id === selectedUnit.value;
    return matchSearch && matchUnit;
  }).sort((a, b) => a.full_name.localeCompare(b.full_name));
});

const paginatedUsers = computed(() => filteredUsers.value.slice((currentPage.value-1)*itemsPerPage, currentPage.value*itemsPerPage));
const totalPages = computed(() => Math.ceil(filteredUsers.value.length/itemsPerPage));
const handleSearch = () => currentPage.value = 1;
const handleFilterChange = () => currentPage.value = 1;

// --- MODALS ---
const showModal = ref(false);
const selectedUser = ref(null);
const openModal = (user) => { selectedUser.value = user ? JSON.parse(JSON.stringify(user)) : null; showModal.value = true; };
const closeModal = () => showModal.value = false;

const isDetailModalOpen = ref(false);
const detailUser = ref(null);
const openDetailModal = (user) => { 
  // Enrich user data
  detailUser.value = { 
      ...user, 
      unit_name: getUnitName(user.unit_id), 
      unit_alias: getUnitAlias(user.unit_id),
      unit_address: getUnitAddress(user.unit_id)
  };
  isDetailModalOpen.value = true; 
};
const closeDetailModal = () => { isDetailModalOpen.value = false; detailUser.value = null; };
const handleDetailEdit = () => {
  const userToEdit = users.value.find(u => u.id === detailUser.value.id);
  closeDetailModal();
  openModal(userToEdit);
};

const handleSave = (userData) => {
  const today = new Date().toLocaleDateString('en-GB');
  if(userData.id) {
     store.updateUser({...userData, updated_at: today});
     triggerToast('Data pegawai diperbarui.', 'success');
  } else {
     const newId = Date.now();
     store.addUser({...userData, id: newId, created_at: today});
     triggerToast('Pegawai baru ditambahkan.', 'success');
  }
  closeModal();
};

const currentTime = ref('');
onMounted(() => setInterval(() => currentTime.value = new Date().toLocaleTimeString('id-ID'), 1000));
watch(() => deleteModal.value.show, (val) => document.body.style.overflow = val ? 'hidden' : '');
</script>

<style scoped>
.toast-slide-top-enter-active{ transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-slide-top-leave-active { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-slide-top-enter-from, .toast-slide-top-leave-to { opacity: 0; transform: translateY(-20px) translateX(-50%); }
</style>