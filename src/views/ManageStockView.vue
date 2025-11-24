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
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Manage Stock</h1>
        <p class="mt-2 text-base text-slate-500">
          Monitoring stok fisik, penyesuaian jumlah, dan filter berdasarkan UID.
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
      
      <!-- TOOLBAR: TITLE, SEARCH, ADD BUTTON -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <ArchiveBoxIcon class="h-5 w-5 text-slate-400" />
          Daftar Stok
        </h2>

        <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          
          <!-- SEARCH -->
          <div class="relative w-full sm:w-56">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon class="h-4 w-4 text-slate-400" />
            </div>
            <input 
              v-model="searchQuery"
              @input="handleFilterChange"
              type="text" 
              class="block w-full rounded-lg border-0 py-2 pl-10 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow" 
              placeholder="Cari nama barang..."
            >
          </div>

          <!-- FILTER UNIT -->
          <div class="relative w-full sm:w-48">
            <select 
              v-model="selectedUnit"
              @change="handleFilterChange"
              class="block w-full rounded-lg border-0 py-2 pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 cursor-pointer"
            >
              <option value="Semua Unit">Semua Unit</option>
              <option v-for="unit in uniqueUnits" :key="unit">{{ unit }}</option>
            </select>
          </div>

          <!-- FILTER KATEGORI -->
          <div class="relative w-full sm:w-40">
            <select 
              v-model="selectedCategory"
              @change="handleFilterChange"
              class="block w-full rounded-lg border-0 py-2 pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 cursor-pointer"
            >
              <option value="Semua Kategori">Semua Kategori</option>
              <option v-for="cat in uniqueCategories" :key="cat">{{ cat }}</option>
            </select>
          </div>

          <!-- BUTTON ADD -->
          <button 
            @click="openStockModal(null)"
            class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 active:scale-95 whitespace-nowrap"
          >
            <PlusIcon class="mr-1.5 h-4 w-4" />
            Tambah Stok
          </button>
        </div>
      </div>

      <!-- TABLE -->
      <div class="overflow-hidden rounded-xl border border-slate-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 sm:pl-6">Nama Barang</th>
                <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Unit (Lokasi)</th>
                <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Kategori</th>
                <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Jumlah Stok</th>
                <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Harga</th>
                <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Status</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">
              
              <!-- Empty State -->
              <tr v-if="filteredStock.length === 0">
                <td colspan="7" class="py-12 text-center text-sm text-slate-500">
                  <div class="flex flex-col items-center justify-center">
                    <div class="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <ArchiveBoxIcon class="h-6 w-6 text-slate-300" />
                    </div>
                    <p>Tidak ada barang yang cocok dengan filter.</p>
                  </div>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-for="item in paginatedStock" :key="item.id" class="group hover:bg-slate-50/80 transition-colors">
                
                <td class="py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div class="font-semibold text-slate-800">{{ item.name }}</div>
                  <div class="text-xs text-slate-400 font-mono mt-0.5">{{ item.sku }}</div>
                </td>

                <td class="px-3 py-4 text-sm text-slate-500">
                   <span class="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                    <MapPinIcon class="h-3 w-3 text-slate-400" />
                    {{ item.unit }}
                  </span>
                </td>
                
                <td class="px-3 py-4 text-sm text-slate-500">{{ item.kategori }}</td>

                <td class="px-3 py-4 text-sm font-bold text-slate-700">
                  {{ item.stock }} <span class="text-xs font-normal text-slate-400">Pcs</span>
                </td>

                <td class="px-3 py-4 text-sm text-slate-600 tabular-nums">
                  Rp {{ (item.price || 0).toLocaleString('id-ID') }}
                </td>

                <td class="px-3 py-4 text-sm">
                  <span 
                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="item.stock > item.threshold 
                      ? 'bg-green-50 text-green-700 ring-green-600/20' 
                      : 'bg-red-50 text-red-700 ring-red-600/20'"
                  >
                    {{ item.stock > item.threshold ? 'Aman' : 'Menipis' }}
                  </span>
                </td>

                <td class="py-4 pl-3 pr-4 text-right text-xs font-medium sm:pr-6">
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      @click="openStockModal(item)" 
                      class="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-all font-semibold shadow-sm"
                    >
                      Edit
                    </button>
                    <button 
                      @click="handleDelete(item)" 
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

        <!-- PAGINATION FOOTER -->
        <div v-if="filteredStock.length > 0" class="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-3 sm:px-6">
          <div class="flex flex-1 justify-between sm:hidden">
            <button @click="currentPage > 1 ? currentPage-- : null" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Previous</button>
            <button @click="currentPage < totalPages ? currentPage++ : null" :disabled="currentPage === totalPages" class="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-slate-700">
                Menampilkan <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> sampai <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredStock.length) }}</span> dari <span class="font-medium">{{ filteredStock.length }}</span> hasil
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

  <!-- PENGGUNAAN KOMPONEN MODAL STOCK -->
  <!-- Disini kita menggunakan StockFormModal yang sudah kita buat -->
  <StockFormModal
    :show="isModalOpen"
    :stock-to-edit="selectedItem"
    :atk-options="allATK"
    :unit-options="allUnits"
    @close="closeModal"
    @save="handleStockSave"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, shallowRef } from 'vue';
import { 
  MagnifyingGlassIcon, PlusIcon, ArchiveBoxIcon, XMarkIcon, CalendarDaysIcon, 
  CheckCircleIcon, XCircleIcon, NoSymbolIcon, MapPinIcon, ChevronLeftIcon, ChevronRightIcon 
} from '@heroicons/vue/24/outline';

// IMPORT KOMPONEN MODAL STOCK
import StockFormModal from '../components/StockFormModal.vue';

// --- TOAST LOGIC ---
const toast = ref({ show: false, message: '', type: 'success' });
let toastTimeout = null;
const triggerToast = (message, type = 'success') => {
  if (toastTimeout) clearTimeout(toastTimeout); 
  toast.value.message = message; toast.value.type = type; toast.value.show = true;
  toastTimeout = setTimeout(() => { toast.value.show = false; }, 3000);
};

// --- CONFIRM MODAL LOGIC ---
const confirmModal = ref({ 
  show: false, title: '', message: '', buttonText: '', buttonClass: '', icon: null, iconBg: '', iconColor: '', onConfirmAction: () => {} 
});

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

// --- DATA: 30 ITEMS ACROSS PROVINCES (Updated with PRICE) ---
const allStockItems = ref([
  // UID Aceh
  { id: 1, name: 'Kertas A4 Sinar Dunia', sku: 'ATK-KRT-001', unit: 'UID Aceh', kategori: 'Kertas', stock: 50, threshold: 20, atkId: 2, unitId: 20, price: 45000 },
  { id: 2, name: 'Tinta Printer Epson 003 Black', sku: 'ATK-TNT-003', unit: 'UID Aceh', kategori: 'Tinta', stock: 8, threshold: 5, atkId: 3, unitId: 20, price: 85000 },
  
  // UID Sumut
  { id: 3, name: 'Spidol Boardmarker Hitam', sku: 'ATK-ATS-001', unit: 'UID Sumut', kategori: 'Alat Tulis', stock: 120, threshold: 15, atkId: 4, unitId: 7, price: 8500 },
  { id: 4, name: 'Buku Tulis Sinar Dunia', sku: 'ATK-ATS-005', unit: 'UID Sumut', kategori: 'Alat Tulis', stock: 45, threshold: 25, atkId: 7, unitId: 7, price: 5000 },

  // UID Sumbar
  { id: 5, name: 'Map Snelhecter Biru', sku: 'ATK-KRT-005', unit: 'UID Sumbar', kategori: 'Kertas', stock: 200, threshold: 50, atkId: 6, unitId: 8, price: 3500 },
  { id: 6, name: 'Lakban Bening 2 Inch', sku: 'ATK-LKB-001', unit: 'UID Sumbar', kategori: 'Lain-lain', stock: 30, threshold: 10, atkId: 10, unitId: 8, price: 12000 },

  // UID Riau
  { id: 7, name: 'Kertas F4 PaperOne', sku: 'ATK-KRT-002', unit: 'UID Riau', kategori: 'Kertas', stock: 15, threshold: 20, atkId: 11, unitId: 18, price: 55000 },
  { id: 8, name: 'Baterai ABC AA', sku: 'ATK-LAI-002', unit: 'UID Riau', kategori: 'Elektronik', stock: 5, threshold: 10, atkId: 5, unitId: 18, price: 15000 },

  // UID Pusat (Jakarta)
  { id: 9, name: 'Toner Printer HP 85A', sku: 'ATK-TNT-001', unit: 'UID Pusat', kategori: 'Tinta', stock: 55, threshold: 10, atkId: 8, unitId: 3, price: 350000 },
  { id: 10, name: 'Stabilo Boss Kuning', sku: 'ATK-ATS-009', unit: 'UID Pusat', kategori: 'Alat Tulis', stock: 80, threshold: 15, atkId: 9, unitId: 3, price: 12000 },
  { id: 11, name: 'Ordner Bindex Hitam', sku: 'ATK-ODR-001', unit: 'UID Pusat', kategori: 'Kertas', stock: 100, threshold: 20, atkId: 12, unitId: 3, price: 25000 },
  { id: 12, name: 'Pulpen Standard AE7', sku: 'ATK-ATS-002', unit: 'UID Pusat', kategori: 'Alat Tulis', stock: 500, threshold: 100, atkId: 1, unitId: 3, price: 2500 },

  // UID Jabar
  { id: 13, name: 'Kertas A4 Sinar Dunia', sku: 'ATK-KRT-001', unit: 'UID Jabar', kategori: 'Kertas', stock: 10, threshold: 20, atkId: 2, unitId: 2, price: 45000 },
  { id: 14, name: 'Mouse Wireless Logitech', sku: 'ATK-ELK-001', unit: 'UID Jabar', kategori: 'Elektronik', stock: 25, threshold: 5, atkId: 13, unitId: 2, price: 150000 },
  { id: 15, name: 'Flashdisk Sandisk 32GB', sku: 'ATK-ELK-002', unit: 'UID Jabar', kategori: 'Elektronik', stock: 40, threshold: 10, atkId: 14, unitId: 2, price: 75000 },

  // UID Jateng
  { id: 16, name: 'Tinta Printer Epson 003 Color', sku: 'ATK-TNT-004', unit: 'UID Jateng', kategori: 'Tinta', stock: 12, threshold: 10, atkId: 15, unitId: 4, price: 85000 },
  { id: 17, name: 'Amplop Coklat A3', sku: 'ATK-KRT-006', unit: 'UID Jateng', kategori: 'Kertas', stock: 150, threshold: 50, atkId: 16, unitId: 4, price: 2000 },

  // UID DIY
  { id: 18, name: 'Spidol Permanent Hitam', sku: 'ATK-ATS-003', unit: 'UID DIY', kategori: 'Alat Tulis', stock: 60, threshold: 20, atkId: 17, unitId: 16, price: 7500 },
  { id: 19, name: 'Gunting Besar Joyko', sku: 'ATK-ATS-008', unit: 'UID DIY', kategori: 'Alat Tulis', stock: 15, threshold: 5, atkId: 18, unitId: 16, price: 12500 },

  // UID Jatim
  { id: 20, name: 'Kertas A4 Sinar Dunia', sku: 'ATK-KRT-001', unit: 'UID Jatim', kategori: 'Kertas', stock: 300, threshold: 50, atkId: 2, unitId: 1, price: 44500 },
  { id: 21, name: 'Clip Paper No. 3', sku: 'ATK-ATS-010', unit: 'UID Jatim', kategori: 'Alat Tulis', stock: 1000, threshold: 200, atkId: 19, unitId: 1, price: 3500 },
  { id: 22, name: 'Post-it Notes 3x3', sku: 'ATK-KRT-008', unit: 'UID Jatim', kategori: 'Kertas', stock: 50, threshold: 20, atkId: 20, unitId: 1, price: 6500 },

  // UID Bali
  { id: 23, name: 'Toner Printer Canon 325', sku: 'ATK-TNT-005', unit: 'UID Bali', kategori: 'Tinta', stock: 2, threshold: 5, atkId: 21, unitId: 5, price: 450000 },
  { id: 24, name: 'Buku Ekspedisi', sku: 'ATK-KRT-009', unit: 'UID Bali', kategori: 'Kertas', stock: 18, threshold: 5, atkId: 22, unitId: 5, price: 15000 },

  // UID Kaltim
  { id: 25, name: 'Kalkulator Casio 12 Digit', sku: 'ATK-ELK-005', unit: 'UID Kaltim', kategori: 'Elektronik', stock: 10, threshold: 3, atkId: 23, unitId: 10, price: 125000 },
  { id: 26, name: 'Stapler HD-10', sku: 'ATK-ATS-012', unit: 'UID Kaltim', kategori: 'Alat Tulis', stock: 25, threshold: 10, atkId: 24, unitId: 10, price: 18000 },

  // UID Sulsel
  { id: 27, name: 'Kertas A4 Sinar Dunia', sku: 'ATK-KRT-001', unit: 'UID Sulsel', kategori: 'Kertas', stock: 90, threshold: 20, atkId: 2, unitId: 6, price: 46000 },
  { id: 28, name: 'Isi Staples No. 10', sku: 'ATK-ATS-013', unit: 'UID Sulsel', kategori: 'Alat Tulis', stock: 200, threshold: 50, atkId: 25, unitId: 6, price: 2500 },

  // UID Papua
  { id: 29, name: 'Tinta Printer Epson 003 Black', sku: 'ATK-TNT-003', unit: 'UID Papua', kategori: 'Tinta', stock: 20, threshold: 10, atkId: 3, unitId: 14, price: 90000 },
  { id: 30, name: 'Baterai Alkaline AAA', sku: 'ATK-LAI-003', unit: 'UID Papua', kategori: 'Elektronik', stock: 12, threshold: 8, atkId: 26, unitId: 14, price: 20000 },
]);

const allATK = ref([
  { id: 1, name: 'Pulpen Standard AE7' }, { id: 2, name: 'Kertas A4 Sinar Dunia' }, { id: 3, name: 'Tinta Printer Epson 003 Black' },
  { id: 4, name: 'Spidol Boardmarker Hitam' }, { id: 5, name: 'Baterai ABC AA' }, { id: 6, name: 'Map Snelhecter Biru' },
  { id: 7, name: 'Buku Tulis Sinar Dunia' }, { id: 8, name: 'Toner Printer HP 85A' }, { id: 9, name: 'Stabilo Boss Kuning' },
  { id: 10, name: 'Lakban Bening 2 Inch' }, { id: 11, name: 'Kertas F4 PaperOne' }, { id: 12, name: 'Ordner Bindex Hitam' },
  { id: 13, name: 'Mouse Wireless Logitech' }, { id: 14, name: 'Flashdisk Sandisk 32GB' }, { id: 15, name: 'Tinta Printer Epson 003 Color' },
  { id: 16, name: 'Amplop Coklat A3' }, { id: 17, name: 'Spidol Permanent Hitam' }, { id: 18, name: 'Gunting Besar Joyko' },
  { id: 19, name: 'Clip Paper No. 3' }, { id: 20, name: 'Post-it Notes 3x3' }, { id: 21, name: 'Toner Printer Canon 325' },
  { id: 22, name: 'Buku Ekspedisi' }, { id: 23, name: 'Kalkulator Casio 12 Digit' }, { id: 24, name: 'Stapler HD-10' },
  { id: 25, name: 'Isi Staples No. 10' }, { id: 26, name: 'Baterai Alkaline AAA' }
]);

const allUnits = ref([
  { id: 1, name: 'UID Jatim' }, { id: 2, name: 'UID Jabar' }, { id: 3, name: 'UID Pusat' }, { id: 4, name: 'UID Jateng' },
  { id: 5, name: 'UID Bali' }, { id: 6, name: 'UID Sulsel' }, { id: 7, name: 'UID Sumut' }, { id: 8, name: 'UID Sumbar' },
  { id: 10, name: 'UID Kaltim' }, { id: 14, name: 'UID Papua' }, { id: 16, name: 'UID DIY' }, { id: 18, name: 'UID Riau' },
  { id: 20, name: 'UID Aceh' }
]);

// --- FILTER & PAGINATION ---
const searchQuery = ref('');
const selectedUnit = ref('Semua Unit');
const selectedCategory = ref('Semua Kategori');

// Pagination State
const currentPage = ref(1);
const itemsPerPage = 10;

// Get Unique lists for Dropdowns
const uniqueUnits = computed(() => [...new Set(allStockItems.value.map(item => item.unit))].sort());
const uniqueCategories = computed(() => [...new Set(allStockItems.value.map(item => item.kategori))].sort());

// Filter Logic
const filteredStock = computed(() => {
  return allStockItems.value
    .filter(item => {
      const search = searchQuery.value.toLowerCase();
      const matchName = item.name.toLowerCase().includes(search);
      const matchUnit = selectedUnit.value === 'Semua Unit' || item.unit === selectedUnit.value;
      const matchCat = selectedCategory.value === 'Semua Kategori' || item.kategori === selectedCategory.value;
      return matchName && matchUnit && matchCat;
    })
    .sort((a, b) => a.name.localeCompare(b.name)); // <-- Tambahan: Urutkan A-Z berdasarkan nama
});

// Pagination Logic
const paginatedStock = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredStock.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredStock.value.length / itemsPerPage));

// Reset page on filter change
const handleFilterChange = () => {
  currentPage.value = 1;
};

// --- MODAL & ACTION LOGIC ---
const isModalOpen = ref(false);
const selectedItem = ref(null);

const openStockModal = (item) => {
  if (item) {
    selectedItem.value = item;
  } else {
    selectedItem.value = null;
  }
  isModalOpen.value = true;
};

const closeModal = () => { 
  isModalOpen.value = false; 
  selectedItem.value = null; 
};

// FUNGSI SIMPAN STOK (TERHUBUNG KE COMPONENT MODAL)
const handleStockSave = (formData) => {
  if (formData.id) {
    // === LOGIKA EDIT / UPDATE ===
    const itemIndex = allStockItems.value.findIndex(item => item.id === formData.id);
    if (itemIndex !== -1) {
      // Update data di array
      allStockItems.value[itemIndex] = { ...allStockItems.value[itemIndex], ...formData };
      
      // Tampilkan Notifikasi Sukses (HIJAU)
      triggerToast('Data stok berhasil diperbarui.', 'success');
    } else {
      // Jika data tidak ditemukan (Error)
      triggerToast('Gagal memperbarui: Item tidak ditemukan.', 'error');
    }
  } else {
    // === LOGIKA TAMBAH BARU (CREATE) ===
    // Cari nama ATK dan Unit berdasarkan ID dari form
    const atk = allATK.value.find(a => a.id === formData.atkId);
    const unit = allUnits.value.find(u => u.id === formData.unitId);

    if (atk && unit) {
      // Cek Duplikasi
      const duplicate = allStockItems.value.find(item => item.atkId === formData.atkId && item.unitId === formData.unitId);
      if (duplicate) {
        triggerToast("Stok barang di unit ini sudah ada.", 'error');
        return;
      }

      // Buat ID Baru
      const newId = allStockItems.value.length > 0 ? Math.max(...allStockItems.value.map(i => i.id)) + 1 : 1;
      
      // Tentukan Kategori dummy sederhana
      let kategori = 'Lain-lain';
      if(atk.name.includes('Kertas') || atk.name.includes('Buku') || atk.name.includes('Map')) kategori = 'Kertas';
      else if(atk.name.includes('Tinta') || atk.name.includes('Toner')) kategori = 'Tinta';
      else if(atk.name.includes('Pulpen') || atk.name.includes('Spidol')) kategori = 'Alat Tulis';

      // Push ke Array
      allStockItems.value.push({ 
        id: newId,
        name: atk.name,
        sku: `ATK-NEW-${newId}`, // Generate SKU dummy
        unit: unit.name,
        kategori: kategori,
        stock: formData.stock,
        threshold: 10, // Default threshold
        atkId: formData.atkId,
        unitId: formData.unitId,
        price: formData.price // Simpan harga juga jika ada
      });

      // Notifikasi Sukses (HIJAU)
      triggerToast('Entri stok baru berhasil ditambahkan.', 'success');
    } else {
      triggerToast('Gagal menambah: Data referensi tidak valid.', 'error');
    }
  }
  closeModal();
};

const handleDelete = (itemToDelete) => {
  openConfirmModal({
    title: 'Hapus Stok',
    message: `Apakah Anda yakin ingin menghapus stok "${itemToDelete.name}" di "${itemToDelete.unit}"? Data yang dihapus tidak dapat dikembalikan.`,
    buttonText: 'Hapus',
    buttonClass: 'bg-red-600 hover:bg-red-700 focus-visible:outline-red-600',
    icon: NoSymbolIcon,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    onConfirm: () => {
      try {
        // 1. Eksekusi Hapus
        allStockItems.value = allStockItems.value.filter(item => item.id !== itemToDelete.id);
        
        // 2. Cek Pagination (Mundur halaman jika kosong)
        if (paginatedStock.value.length === 0 && currentPage.value > 1) {
          currentPage.value--;
        }

        // 3. SUKSES -> Ubah jadi 'success' (Warna Hijau + Ceklis)
        triggerToast('Entri stok berhasil dihapus.', 'success');

      } catch (error) {
        // 4. GAGAL -> Baru gunakan 'error' (Warna Merah + Silang)
        triggerToast('Gagal menghapus data.', 'error');
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