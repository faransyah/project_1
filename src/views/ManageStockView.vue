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
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 transition-colors bg-red-100 text-red-600">
                <NoSymbolIcon class="h-6 w-6" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-bold leading-6 text-slate-900">Konfirmasi Hapus</h3>
                <div class="mt-2"><p class="text-sm text-slate-500 leading-relaxed">{{ confirmModal.message }}</p></div>
              </div>
            </div>
          </div>
          <div class="bg-slate-50/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
            <button type="button" @click="confirmModal.onConfirm" class="inline-flex w-full justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto">Hapus & Catat Log</button>
            <button type="button" @click="confirmModal.show = false" class="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto">Batal</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="space-y-6">
    
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Manage Stock</h1>
        <p class="mt-2 text-base text-slate-500">
          Monitoring stok fisik & Riwayat Mutasi (Batch System).
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

    <div class="rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] border border-slate-100">
      
      <div class="mb-6 border-b border-slate-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button 
            @click="activeTab = 'stock'"
            :class="[
              activeTab === 'stock' 
                ? 'border-blue-500 text-blue-600 font-bold' 
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 font-medium',
              'whitespace-nowrap border-b-2 py-4 px-1 text-sm transition-colors'
            ]"
          >
            📦 Stok Fisik (Aktif)
          </button>
          <button 
            @click="activeTab = 'history'"
            :class="[
              activeTab === 'history' 
                ? 'border-blue-500 text-blue-600 font-bold' 
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 font-medium',
              'whitespace-nowrap border-b-2 py-4 px-1 text-sm transition-colors'
            ]"
          >
            📝 Riwayat Mutasi (Log)
          </button>
        </nav>
      </div>

      <div v-if="activeTab === 'stock'">
        
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ArchiveBoxIcon class="h-5 w-5 text-slate-400" />
            Daftar Barang
          </h2>

          <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
            <div class="relative w-full sm:w-64">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon class="h-4 w-4 text-slate-400" />
              </div>
              <input 
                v-model="searchQuery"
                @input="handleFilterChange"
                type="text" 
                class="block w-full rounded-lg border-0 h-10 py-1.5 pl-10 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow" 
                placeholder="Cari SKU atau Nama Barang..."
              >
            </div>
            <button 
              @click="openStockModal(null)"
              class="inline-flex items-center justify-center rounded-lg bg-blue-600 h-10 px-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 w-full sm:w-auto"
            >
              <PlusIcon class="mr-1.5 h-4 w-4" />
              Tambah Stok
            </button>
          </div>
        </div>

        <div class="overflow-hidden rounded-xl border border-slate-200">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 sm:pl-6">Barang (SKU)</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Lokasi</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Stok</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Harga (Avg)</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Status</th>
                  <th class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Aksi</span></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr v-if="filteredStock.length === 0">
                  <td colspan="6" class="py-12 text-center text-sm text-slate-500">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in paginatedStock" :key="item.id" class="group hover:bg-slate-50/80 transition-colors">
                  <td class="py-4 pl-4 pr-3 sm:pl-6">
                    <div class="flex items-center gap-3">
                      <div class="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">ATK</div>
                      <div>
                        <div 
                           @click="openDetailModal(item)"
                           class="font-semibold text-slate-800 cursor-pointer hover:text-blue-600 hover:underline transition-all"
                           title="Klik untuk lihat detail harga"
                        >
                          {{ item.name }}
                        </div>
                        <div class="text-xs text-slate-500 font-mono mt-0.5 bg-slate-100 inline-block px-1.5 rounded">{{ item.sku }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-4 text-sm text-slate-500">
                    <span class="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <MapPinIcon class="h-3 w-3" /> {{ item.unit }}
                    </span>
                  </td>
                  <td class="px-3 py-4 text-sm font-bold text-slate-700">
                    {{ item.stock }} <span class="text-xs font-normal text-slate-400 ml-1">{{ item.uom }}</span>
                  </td>
                  <td class="px-3 py-4 text-sm text-slate-600 tabular-nums">
                    <div class="flex flex-col">
                      <span class="font-bold">Rp {{ getAveragePrice(item).toLocaleString('id-ID') }}</span>
                      <span v-if="item.batches?.length > 1" class="text-[10px] text-slate-400 bg-slate-100 px-1 rounded w-fit mt-0.5">
                        Avg {{ item.batches.length }} batch
                      </span>
                    </div>
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
                      <button @click="openStockModal(item)" class="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-all font-semibold shadow-sm text-xs border border-blue-200">Restock</button>
                      <button @click="handleAdjustment(item)" class="text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-md transition-all font-semibold shadow-sm text-xs border border-orange-200">Adjustment</button>
                      <button @click="handleDelete(item)" class="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-all font-semibold shadow-sm text-xs border border-red-200">Hapus</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-slate-700">
                  Menampilkan <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> sampai <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredStock.length) }}</span> dari <span class="font-medium">{{ filteredStock.length }}</span> data
                </p>
              </div>
              <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button @click="currentPage--" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50">
                    <span class="sr-only">Previous</span>
                    <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[page === currentPage ? 'z-10 bg-blue-600 text-white focus-visible:outline-blue-600' : 'text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50', 'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2']">
                    {{ page }}
                  </button>
                  <button @click="currentPage++" :disabled="currentPage === totalPages" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50">
                    <span class="sr-only">Next</span>
                    <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'history'">
         <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-slate-800">Log Aktivitas (Masuk/Keluar)</h2>
            <button @click="activeTab='stock'" class="text-sm text-blue-600 hover:underline font-semibold">← Kembali ke Stok</button>
         </div>

         <div class="overflow-hidden rounded-xl border border-slate-200">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="py-3.5 pl-4 text-left text-xs font-bold uppercase text-slate-500">Waktu</th>
                  <th class="px-3 py-3.5 text-left text-xs font-bold uppercase text-slate-500">Tipe</th>
                  <th class="px-3 py-3.5 text-left text-xs font-bold uppercase text-slate-500">Barang</th>
                  <th class="px-3 py-3.5 text-left text-xs font-bold uppercase text-slate-500">Qty</th>
                  <th class="px-3 py-3.5 text-left text-xs font-bold uppercase text-slate-500">Oleh / Ket</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr v-if="stockHistory.length === 0">
                  <td colspan="5" class="py-8 text-center text-sm text-slate-500">Belum ada riwayat transaksi.</td>
                </tr>
                <tr v-for="log in stockHistory" :key="log.id" class="hover:bg-slate-50 transition-colors">
                  <td class="py-4 pl-4 text-sm text-slate-600 font-mono whitespace-nowrap">{{ log.date }}</td>
                  <td class="px-3 py-4 text-sm">
                    <span v-if="log.type === 'IN'" class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">⬇️ Masuk</span>
                    <span v-else class="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">⬆️ Keluar</span>
                  </td>
                  <td class="px-3 py-4 text-sm font-semibold text-slate-800">{{ log.itemName }}</td>
                  <td class="px-3 py-4 text-sm font-bold font-mono text-base" :class="log.type === 'IN' ? 'text-green-600' : 'text-orange-600'">
                    {{ log.type === 'IN' ? '+' : '-' }}{{ log.qty }}
                  </td>
                  <td class="px-3 py-4 text-sm text-slate-500">
                    <div class="flex flex-col">
                      <span class="font-medium text-slate-800 text-xs">{{ log.actor }}</span>
                      <span class="text-xs italic text-slate-400">{{ log.note }}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
         </div>
      </div>

    </div>
  </div>

  <StockFormModal
    :show="isModalOpen"
    :stock-to-edit="selectedItem"
    :atk-options="allATKMaster"
    :unit-options="allUnits"
    @close="closeModal"
    @save="handleStockSave"
  />

  <StockDetailModal
    :show="isDetailModalOpen"
    :item="detailItem"
    @close="closeDetailModal"
  />
</template>

<script setup>
import { ref, computed, watch } from 'vue'; // <-- PENTING: ADA watch DISINI
import { 
  MagnifyingGlassIcon, PlusIcon, ArchiveBoxIcon, XMarkIcon, CalendarDaysIcon, 
  CheckCircleIcon, XCircleIcon, NoSymbolIcon, MapPinIcon,
  ChevronLeftIcon, ChevronRightIcon
} from '@heroicons/vue/24/outline';

// Import Komponen
import StockFormModal from '../components/StockFormModal.vue';
import StockDetailModal from '../components/StockDetailModal.vue';

// --- STATE & CONFIG ---
const toast = ref({ show: false, message: '', type: 'success' });
const triggerToast = (msg, type) => { toast.value = { show: true, message: msg, type }; setTimeout(() => toast.value.show = false, 3000); };
const currentTime = ref('');
setInterval(() => { currentTime.value = new Date().toLocaleTimeString('id-ID'); }, 1000);

const activeTab = ref('stock');
const confirmModal = ref({ show: false, message: '', onConfirm: () => {} });
const closeConfirmModal = () => { confirmModal.value.show = false; };

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

// --- WATCHER KHUSUS MODAL HAPUS (AGAR BODY GAK SCROLL) ---
watch(() => confirmModal.value.show, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// --- DATA UNIT ---
const allUnits = ref([
  { id: 1, name: 'UID Jakarta Raya' },
  { id: 2, name: 'UID Jawa Barat' },
  { id: 3, name: 'Kantor Pusat' },
  { id: 4, name: 'UID Jawa Tengah' },
  { id: 5, name: 'UID Bali' },
  { id: 6, name: 'UID Sulawesi Selatan' },
  { id: 7, name: 'UID Sumatera Utara' },
  { id: 8, name: 'UID Sumatera Barat' }
]);

// --- DATA MASTER ---
const allATKMaster = ref([
  { id: 1, name: 'Kertas A4 Sinar Dunia 70gr', sku: 'ATK-KRT-001', category: 'Kertas', uom: 'Rim' },
  { id: 2, name: 'Pulpen Standard AE7 Hitam', sku: 'ATK-ALT-002', category: 'Alat Tulis', uom: 'Pcs' },
  { id: 3, name: 'Tinta Epson 003 Black', sku: 'ATK-TNT-003', category: 'Tinta', uom: 'Botol' },
  { id: 4, name: 'Baterai ABC AA', sku: 'ATK-ELK-001', category: 'Elektronik', uom: 'Pack' },
  { id: 5, name: 'Ordner Bindex 717 Folio', sku: 'ATK-ODR-005', category: 'Penyimpanan', uom: 'Pcs' },
]);

// --- DATA STOK (10 ITEM) ---
const allStockItems = ref([
  { id: 101, atkId: 1, unitId: 1, stock: 150, threshold: 20, name: 'Kertas A4 Sinar Dunia 70gr', sku: 'ATK-KRT-001', unit: 'UID Jakarta Raya', uom: 'Rim', batches: [{ id: 1, stock: 100, price: 45000, date: '2023-11-01' }, { id: 2, stock: 50,  price: 46000, date: '2023-11-20' }] },
  { id: 102, atkId: 2, unitId: 1, stock: 500, threshold: 50, name: 'Pulpen Standard AE7 Hitam', sku: 'ATK-ALT-002', unit: 'UID Jakarta Raya', uom: 'Pcs', batches: [{ id: 3, stock: 500, price: 2500, date: '2023-10-05' }] },
  { id: 103, atkId: 3, unitId: 2, stock: 3, threshold: 5, name: 'Tinta Epson 003 Black', sku: 'ATK-TNT-003', unit: 'UID Jawa Barat', uom: 'Botol', batches: [{ id: 4, stock: 3, price: 85000, date: '2023-09-15' }] },
  { id: 104, atkId: 4, unitId: 3, stock: 0, threshold: 10, name: 'Baterai ABC AA', sku: 'ATK-ELK-001', unit: 'Kantor Pusat', uom: 'Pack', batches: [] },
  { id: 105, atkId: 5, unitId: 1, stock: 50, threshold: 10, name: 'Ordner Bindex 717 Folio', sku: 'ATK-ODR-005', unit: 'UID Jakarta Raya', uom: 'Pcs', batches: [{ id: 5, stock: 50, price: 28000, date: '2023-11-22' }] },
  { id: 106, atkId: 1, unitId: 4, stock: 80, threshold: 20, name: 'Kertas A4 Sinar Dunia 70gr', sku: 'ATK-KRT-001', unit: 'UID Jawa Tengah', uom: 'Rim', batches: [{ id: 6, stock: 80, price: 47500, date: '2023-11-10' }] },
  { id: 107, atkId: 2, unitId: 5, stock: 200, threshold: 30, name: 'Pulpen Standard AE7 Hitam', sku: 'ATK-ALT-002', unit: 'UID Bali', uom: 'Pcs', batches: [{ id: 7, stock: 200, price: 2700, date: '2023-11-01' }] },
  { id: 108, atkId: 3, unitId: 7, stock: 15, threshold: 5, name: 'Tinta Epson 003 Black', sku: 'ATK-TNT-003', unit: 'UID Sumatera Utara', uom: 'Botol', batches: [{ id: 8, stock: 15, price: 90000, date: '2023-10-20' }] },
  { id: 109, atkId: 4, unitId: 6, stock: 5, threshold: 10, name: 'Baterai ABC AA', sku: 'ATK-ELK-001', unit: 'UID Sulawesi Selatan', uom: 'Pack', batches: [{ id: 9, stock: 5, price: 16000, date: '2023-11-05' }] },
  { id: 110, atkId: 5, unitId: 8, stock: 100, threshold: 20, name: 'Ordner Bindex 717 Folio', sku: 'ATK-ODR-005', unit: 'UID Sumatera Barat', uom: 'Pcs', batches: [{ id: 10, stock: 100, price: 29500, date: '2023-11-25' }] }
]);

const stockHistory = ref([
  { id: 1, type: 'IN', date: '2023-11-20 09:00', itemName: 'Kertas A4 Sinar Dunia 70gr', qty: 50, actor: 'Admin', note: 'Restock Batch #2' },
]);

// --- COMPUTED ---
const filteredStock = computed(() => {
  return allStockItems.value.filter(item => 
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const paginatedStock = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredStock.value.slice(start, start + itemsPerPage);
});
const totalPages = computed(() => Math.ceil(filteredStock.value.length / itemsPerPage));
const handleFilterChange = () => { currentPage.value = 1; };

const getAveragePrice = (item) => {
  if (!item.batches || item.batches.length === 0) return 0;
  const totalValue = item.batches.reduce((sum, batch) => sum + (batch.price * batch.stock), 0);
  const totalStock = item.batches.reduce((sum, batch) => sum + batch.stock, 0);
  return totalStock > 0 ? Math.round(totalValue / totalStock) : 0;
};

// --- MODALS STATE ---
const isModalOpen = ref(false);
const selectedItem = ref(null);
const isDetailModalOpen = ref(false);
const detailItem = ref(null);

const openStockModal = (item) => {
  selectedItem.value = item ? { ...item, price: getAveragePrice(item) } : null;
  isModalOpen.value = true;
};
const closeModal = () => { isModalOpen.value = false; selectedItem.value = null; };

const openDetailModal = (item) => {
  detailItem.value = item;
  isDetailModalOpen.value = true;
};
const closeDetailModal = () => {
  isDetailModalOpen.value = false;
  detailItem.value = null;
};

// --- ACTIONS ---
const handleStockSave = (formData) => {
  const masterATK = allATKMaster.value.find(a => a.id === formData.atkId);
  const masterUnit = allUnits.value.find(u => u.id === formData.unitId);
  const existingIndex = allStockItems.value.findIndex(i => i.atkId === formData.atkId && i.unitId === formData.unitId);

  if (existingIndex !== -1) {
    const item = allStockItems.value[existingIndex];
    if (formData.id && formData.id === item.id && formData.stock == 0) {
        item.threshold = parseInt(formData.threshold);
        triggerToast('Data berhasil diperbarui', 'success');
    } else {
        const qty = parseInt(formData.stock);
        const price = parseInt(formData.price);
        item.stock += qty;
        item.threshold = parseInt(formData.threshold);
        
        const lastBatch = item.batches[item.batches.length - 1];
        if (lastBatch && lastBatch.price === price) lastBatch.stock += qty;
        else item.batches.push({ id: Date.now(), stock: qty, price: price, date: new Date().toISOString() });

        stockHistory.value.unshift({ id: Date.now(), type: 'IN', date: new Date().toLocaleString('id-ID'), itemName: item.name, qty: qty, actor: 'Admin', note: `Restock (Rp ${price})` });
        triggerToast(`Restock +${qty} berhasil`, 'success');
    }
  } else {
    const qty = parseInt(formData.stock);
    const price = parseInt(formData.price);
    allStockItems.value.push({
      id: Date.now(), atkId: formData.atkId, unitId: formData.unitId, stock: qty, threshold: parseInt(formData.threshold),
      name: masterATK.name, sku: masterATK.sku, uom: masterATK.uom, unit: masterUnit.name,
      batches: [{ id: Date.now(), stock: qty, price: price, date: new Date().toISOString() }]
    });
    stockHistory.value.unshift({ id: Date.now()+1, type: 'IN', date: new Date().toLocaleString('id-ID'), itemName: masterATK.name, qty: qty, actor: 'Admin', note: 'Item Baru' });
    triggerToast('Item baru ditambahkan', 'success');
  }
  closeModal();
};

const handleAdjustment = (item) => {
  const qtyStr = prompt(`Adjustment Stok (Pengurangan)\nBarang: ${item.name}\nMasukkan jumlah:`, "1");
  if (qtyStr) {
    const qty = parseInt(qtyStr);
    if (isNaN(qty) || qty <= 0) return alert("Jumlah tidak valid");
    if (qty > item.stock) return alert("Stok tidak cukup!");

    item.stock -= qty;
    stockHistory.value.unshift({ id: Date.now(), type: 'OUT', date: new Date().toLocaleString('id-ID'), itemName: item.name, qty: qty, actor: 'Admin', note: 'Adjustment Manual' });
    triggerToast(`Stok dikurangi -${qty}`, 'success');
  }
};

const handleDelete = (item) => {
  confirmModal.value = {
    show: true,
    message: `Hapus stok ${item.name}? Sisa stok (${item.stock}) akan dicatat sebagai barang keluar.`,
    onConfirm: () => {
      if (item.stock > 0) {
        stockHistory.value.unshift({ id: Date.now(), type: 'OUT', date: new Date().toLocaleString('id-ID'), itemName: item.name, qty: item.stock, actor: 'Admin', note: 'Data Dihapus (Write-off)' });
      }
      allStockItems.value = allStockItems.value.filter(i => i.id !== item.id);
      confirmModal.value.show = false;
      triggerToast('Data dihapus & dicatat', 'success');
    }
  };
};
</script>

<style scoped>
.toast-slide-top-enter-active, .toast-slide-top-leave-active { transition: all 0.5s ease; }
.toast-slide-top-enter-from, .toast-slide-top-leave-to { opacity: 0; transform: translateY(-20px) translateX(-50%); }
</style>