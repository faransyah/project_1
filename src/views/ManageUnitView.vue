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

  <div class="space-y-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Manage Units</h1>
        <p class="mt-2 text-base text-slate-500">
          Kelola unit terdaftar (UID, UIP, dll.) yang ada di sistem.
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
          <span class="text-xs font-medium text-slate-500 tabular-nums tracking-wide">
            {{ currentTime }} WIB
          </span>
        </div>
      </div>
    </div>

    <div class="rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] border border-slate-100">
      
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <BuildingOfficeIcon class="h-5 w-5 text-slate-400" />
          Daftar Unit
        </h2>
        <button 
          @click="openModal(null)"
          class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 active:scale-95"
        >
          <PlusIcon class="mr-1.5 h-4 w-4" />
          Tambah Unit
        </button>
      </div>

      <div class="overflow-hidden rounded-xl border border-slate-200">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 sm:pl-6">Nama Unit</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Lokasi</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            <tr v-if="units.length === 0">
              <td colspan="3" class="py-12 text-center text-sm text-slate-500">
                <div class="flex flex-col items-center justify-center">
                  <div class="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <BuildingOfficeIcon class="h-6 w-6 text-slate-300" />
                  </div>
                  <p>Belum ada data unit.</p>
                </div>
              </td>
            </tr>

            <tr v-for="unit in units" :key="unit.id" class="group hover:bg-slate-50/80 transition-colors">
              <td class="py-4 pl-4 pr-3 text-sm font-semibold text-slate-800 sm:pl-6">
                {{ unit.name }}
              </td>
              <td class="px-3 py-4 text-sm text-slate-500">
                <span class="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                  <MapPinIcon class="h-3 w-3 text-slate-400" />
                  {{ unit.location }}
                </span>
              </td>
              <td class="py-4 pl-3 pr-4 text-right text-xs font-medium sm:pr-6">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="openModal(unit)" 
                    class="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-all font-semibold shadow-sm"
                  >
                    Edit
                  </button>
                  <button 
                    @click="handleDelete(unit.id)" 
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

  <UnitFormModal
    :show="showModal"
    :unit-to-edit="selectedUnit"
    @close="closeModal"
    @save="handleSave"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, shallowRef } from 'vue';
// Import Icons
import { PlusIcon, CalendarDaysIcon, BuildingOfficeIcon, MapPinIcon, CheckCircleIcon, XCircleIcon, XMarkIcon, NoSymbolIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';
import UnitFormModal from '../components/UnitFormModal.vue';

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

// --- DATABASE SIMULASI ---
const units = ref([
  { id: 1, name: 'UID Jatim', location: 'Surabaya' },
  { id: 2, name: 'UID Jabar', location: 'Bandung' },
  { id: 3, name: 'UID Pusat', location: 'Jakarta' },
  { id: 4, name: 'UID Jateng', location: 'Semarang' },
  { id: 5, name: 'UID Bali', location: 'Denpasar' },
  { id: 6, name: 'UID Sulsel', location: 'Makassar' },
  { id: 7, name: 'UID Sumut', location: 'Medan' },
  { id: 8, name: 'UID Sumbar', location: 'Padang' },
  { id: 9, name: 'UID Sumsel', location: 'Palembang' },
  { id: 10, name: 'UID Kaltim', location: 'Samarinda' },
  { id: 11, name: 'UID Kalsel', location: 'Banjarmasin' },
  { id: 12, name: 'UID Kalbar', location: 'Pontianak' },
  { id: 13, name: 'UID Kalteng', location: 'Palangkaraya' },
  { id: 14, name: 'UID Papua', location: 'Jayapura' },
  { id: 15, name: 'UID Banten', location: 'Serang' },
  { id: 16, name: 'UID DIY', location: 'Yogyakarta' },
  { id: 17, name: 'UID Lampung', location: 'Bandar Lampung' },
  { id: 18, name: 'UID Riau', location: 'Pekanbaru' },
  { id: 19, name: 'UID Kepri', location: 'Tanjung Pinang' },
  { id: 20, name: 'UID Aceh', location: 'Banda Aceh' },
  { id: 21, name: 'UID NTB', location: 'Mataram' },
  { id: 22, name: 'UID NTT', location: 'Kupang' },
  { id: 23, name: 'UID Sulut', location: 'Manado' },
  { id: 24, name: 'UID Sulteng', location: 'Palu' },
  { id: 25, name: 'UID Sultra', location: 'Kendari' },
  { id: 26, name: 'UID Maluku', location: 'Ambon' },
  { id: 27, name: 'UID Malut', location: 'Ternate' },
  { id: 28, name: 'UID Gorontalo', location: 'Gorontalo' },
  { id: 29, name: 'UID Babel', location: 'Pangkal Pinang' },
  { id: 30, name: 'UID Kaltara', location: 'Tanjung Selor' },
]);

const showModal = ref(false);
const selectedUnit = ref(null); 

const openModal = (unit) => {
  selectedUnit.value = unit ? { ...unit } : null;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedUnit.value = null;
};

const handleSave = (unit) => {
  if (unit.id) {
    const index = units.value.findIndex(u => u.id === unit.id);
    if (index !== -1) units.value[index] = unit;
    triggerToast('Data unit berhasil diperbarui.', 'success');
  } else {
    const newId = units.value.length > 0 ? Math.max(...units.value.map(u => u.id)) + 1 : 1;
    units.value.push({ ...unit, id: newId });
    triggerToast('Unit baru berhasil ditambahkan.', 'success');
  }
  closeModal();
};

const handleDelete = (unitId) => {
  openConfirmModal({
    title: 'Hapus Unit',
    message: 'Apakah Anda yakin ingin menghapus unit ini? Data yang dihapus tidak dapat dikembalikan.',
    buttonText: 'Hapus',
    buttonClass: 'bg-red-600 hover:bg-red-700 focus-visible:outline-red-600',
    icon: NoSymbolIcon,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    onConfirm: () => {
      units.value = units.value.filter(u => u.id !== unitId);
      triggerToast('Unit berhasil dihapus.', 'error');
    }
  });
};
</script>

<style scoped>
.toast-slide-top-enter-active{ transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-slide-top-leave-active { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-slide-top-enter-from, .toast-slide-top-leave-to { opacity: 0; transform: translateY(-20px) translateX(-50%); }
</style>