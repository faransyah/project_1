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
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Manage Stock</h1>
        <p class="mt-2 text-base text-slate-500">
          Monitoring stok fisik per unit kerja & Riwayat Mutasi (Ref: <code>eatk_item_unit</code>).
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
      
      <div class="mb-8 border-b border-slate-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button 
            @click="activeTab = 'stock'"
            class="group inline-flex items-center border-b-2 py-4 px-1 text-sm font-bold transition-all duration-200 ease-in-out whitespace-nowrap outline-none"
            :class="activeTab === 'stock' 
              ? 'border-blue-600 text-blue-700' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'"
          >
            <ArchiveBoxIcon class="mr-2 h-5 w-5" :class="activeTab === 'stock' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'" />
            Stok Fisik (Aktif)
          </button>
          <button 
            @click="activeTab = 'history'"
            class="group inline-flex items-center border-b-2 py-4 px-1 text-sm font-bold transition-all duration-200 ease-in-out whitespace-nowrap outline-none"
            :class="activeTab === 'history' 
              ? 'border-blue-600 text-blue-700' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'"
          >
            <ClockIcon class="mr-2 h-5 w-5" :class="activeTab === 'history' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'" />
            Riwayat Mutasi (Log)
          </button>
        </nav>
      </div>

      <div v-if="activeTab === 'stock'">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ArchiveBoxIcon class="h-5 w-5 text-slate-400" />
            Daftar Stok Unit
          </h2>

          <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
            
            <div class="relative w-full sm:w-48">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon class="h-4 w-4 text-slate-400" />
              </div>
              <input 
                v-model="searchQuery"
                @input="handleFilterChange"
                type="text" 
                class="block w-full rounded-lg border-0 h-10 py-1.5 pl-10 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow" 
                placeholder="Cari barang..."
              >
            </div>

            <div class="relative w-full sm:w-48">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon class="h-4 w-4 text-slate-400" />
              </div>
              <select 
                v-model="selectedUnit"
                @change="handleFilterChange"
                class="block w-full rounded-lg border-0 h-10 py-1.5 pl-9 pr-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 cursor-pointer"
              >
                <option value="Semua Unit">Semua Unit</option>
                <option v-for="unit in allUnits" :key="unit.id" :value="unit.id">{{ unit.alias }}</option>
              </select>
            </div>

            <div class="relative w-full sm:w-48">
               <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TagIcon class="h-4 w-4 text-slate-400" />
               </div>
              <select 
                v-model="selectedCategory"
                @change="handleFilterChange"
                class="block w-full rounded-lg border-0 h-10 py-1.5 pl-9 pr-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 cursor-pointer"
              >
                <option value="Semua Kategori">Semua Kategori</option>
                <option v-for="cat in uniqueCategories" :key="cat">{{ cat }}</option>
              </select>
            </div>

            <button 
              @click="openStockModal(null)"
              class="inline-flex items-center justify-center rounded-lg bg-blue-600 h-10 px-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 active:scale-95 whitespace-nowrap w-full sm:w-auto"
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
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 sm:pl-6">Barang (Master Item)</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Unit Kerja</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Kondisi Stok</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Harga</th>
                  <th scope="col" class="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Status</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500 sm:pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                
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

                <tr v-for="item in paginatedStock" :key="item.id" class="group hover:bg-slate-50/80 transition-colors">
                  
                  <td class="py-4 pl-4 pr-3 sm:pl-6 min-w-[280px]">
                    <div class="flex items-center gap-4">
                       <div 
                          class="h-12 w-12 rounded-lg bg-white border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center shadow-sm group-hover:border-blue-300 transition-all duration-200 cursor-pointer"
                          @click="openDetailModal(item)"
                          title="Lihat Detail Barang"
                       >
                         <img v-if="getATK(item.item_id)?.url_photo" :src="getATK(item.item_id).url_photo" alt="" class="h-full w-full object-contain p-1" />
                         <ArchiveBoxIcon v-else class="h-6 w-6 text-slate-300" />
                      </div>
                      
                      <div>
                        <button 
                           @click="openDetailModal(item)"
                           class="text-left font-bold text-slate-800 text-sm hover:text-blue-600 hover:underline transition-all line-clamp-1 focus:outline-none"
                           title="Klik untuk detail stok"
                        >
                           {{ getATK(item.item_id)?.name }}
                        </button>
                        <div class="flex items-center gap-2 mt-1">
                           <span class="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">
                             {{ getATK(item.item_id)?.code }}
                           </span>
                           <span class="text-[10px] text-slate-400 truncate max-w-[100px]">
                             {{ getCategoryName(getATK(item.item_id)?.category_id) }}
                           </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td class="px-3 py-4 text-sm text-slate-500">
                    <div class="flex flex-col gap-1.5">
                       <div class="flex items-center gap-1.5">
                          <MapPinIcon class="h-3.5 w-3.5 text-slate-400" />
                          <span class="text-sm font-semibold text-slate-700">{{ getUnitAlias(item.unit_id) }}</span>
                       </div>
                       <div class="flex items-center gap-1.5 ml-0.5">
                          <TagIcon class="h-3 w-3 text-slate-400" />
                          <span class="text-xs text-slate-500 bg-slate-50 px-1.5 rounded border border-slate-100">
                             {{ getATK(item.item_id)?.category }}
                          </span>
                       </div>
                    </div>
                  </td>
                  
                  <td class="px-3 py-4 min-w-[160px]">
                    <div class="flex flex-col gap-1.5">
                       <div class="flex justify-between items-end">
                          <span class="text-sm font-bold text-slate-800">{{ item.stock }} <span class="text-[10px] font-normal text-slate-400">{{ getATK(item.item_id)?.uom }}</span></span>
                          <span v-if="item.stock <= item.stock_min" class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-50 text-[9px] font-bold text-red-600 border border-red-100 uppercase tracking-wide">
                             <ExclamationTriangleIcon class="h-3 w-3" /> Low
                          </span>
                          <span v-else class="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                             <CheckCircleIcon class="h-3 w-3" /> Aman
                          </span>
                       </div>
                       <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div class="h-full rounded-full transition-all duration-500 relative" 
                               :class="item.stock <= item.stock_min ? 'bg-red-500' : 'bg-emerald-500'"
                               :style="{ width: Math.min((item.stock / (item.stock_min * 3)) * 100, 100) + '%' }">
                          </div>
                       </div>
                       <span class="text-[10px] text-slate-400">Min: {{ item.stock_min }}</span>
                    </div>
                  </td>

                  <td class="px-3 py-4 text-sm font-medium text-slate-700 tabular-nums">
                    Rp {{ (item.price || 0).toLocaleString('id-ID') }}
                  </td>

                  <td class="px-3 py-4 text-center">
                      <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                      :class="item.status === 'Active' 
                        ? 'bg-green-50 text-green-700 ring-green-600/20' 
                        : 'bg-slate-100 text-slate-500 ring-slate-500/20'"
                    >
                      <span class="h-1.5 w-1.5 rounded-full mr-1.5" :class="item.status === 'Active' ? 'bg-green-600' : 'bg-slate-400'"></span>
                      {{ item.status === 'Active' ? 'Aktif' : 'Non-Aktif' }}
                    </span>
                    <div class="text-[10px] text-slate-400 mt-1 font-mono">{{ item.updated_at || item.created_at }}</div>
                  </td>

                  <td class="py-4 pl-3 pr-4 text-center text-xs font-medium sm:pr-6">
                    <div class="flex items-center justify-center gap-2">
                      <button 
                        @click="openStockModal(item)" 
                        class="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-all font-semibold shadow-sm border border-blue-200"
                      >
                        Edit
                      </button>
                      <button 
                        @click="handleDelete(item)" 
                        class="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-all font-semibold shadow-sm border border-red-200"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="filteredStock.length > 0" class="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
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
      
      <div v-if="activeTab === 'history'">
         <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
           <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ClockIcon class="h-5 w-5 text-slate-400" />
              Log Mutasi Barang
           </h2>
           <div class="flex items-center gap-4">
              <div class="relative w-full sm:w-64">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon class="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  v-model="historySearchQuery"
                  @input="handleHistoryFilterChange"
                  type="text" 
                  class="block w-full rounded-lg border-0 h-10 py-1.5 pl-10 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow" 
                  placeholder="Cari riwayat..."
                >
              </div>
              <button @click="activeTab='stock'" class="text-sm text-blue-600 hover:underline font-semibold">← Kembali ke Stok</button>
           </div>
         </div>

         <div class="overflow-hidden rounded-xl border border-slate-200">
            <div class="overflow-x-auto">
               <table class="min-w-full divide-y divide-slate-200">
                  <thead class="bg-slate-50">
                    <tr>
                      <th class="py-3.5 pl-4 text-left text-xs font-bold uppercase text-slate-500">Waktu</th>
                      <th class="px-3 py-3.5 text-left text-xs font-bold uppercase text-slate-500">Tipe</th>
                      <th class="px-3 py-3.5 text-left text-xs font-bold uppercase text-slate-500">Barang</th>
                      <th class="px-3 py-3.5 text-left text-xs font-bold uppercase text-slate-500">Qty</th>
                      <th class="px-3 py-3.5 text-left text-xs font-bold uppercase text-slate-500">Keterangan</th>
                      <th class="px-3 py-3.5 text-left text-xs font-bold uppercase text-slate-500">Oleh</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 bg-white">
                    <tr v-if="filteredHistory.length === 0">
                       <td colspan="6" class="py-8 text-center text-sm text-slate-500">Belum ada riwayat transaksi.</td>
                    </tr>
                    <tr v-for="log in paginatedHistory" :key="log.id" class="hover:bg-slate-50 transition-colors">
                      <td class="py-4 pl-4 text-sm text-slate-600 font-mono whitespace-nowrap">{{ log.date }}</td>
                      <td class="px-3 py-4 text-sm">
                        <span v-if="log.type === 'IN'" class="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          <ArrowUpTrayIcon class="h-3 w-3" /> Masuk
                        </span>
                        <span v-else class="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
                          <ArrowDownIcon class="h-3 w-3" /> Keluar
                        </span>
                      </td>
                      <td class="px-3 py-4 text-sm font-semibold text-slate-800">{{ log.itemName }}</td>
                      <td class="px-3 py-4 text-sm font-bold font-mono text-base" :class="log.type === 'IN' ? 'text-green-600' : 'text-orange-600'">
                        {{ log.type === 'IN' ? '+' : '-' }}{{ log.qty }}
                      </td>
                      <td class="px-3 py-4 text-sm text-slate-500 italic">{{ log.note }}</td>
                      <td class="px-3 py-4 text-sm text-slate-800 font-medium">{{ log.actor }}</td>
                    </tr>
                  </tbody>
               </table>
            </div>
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
    @edit="handleDetailEdit"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { 
  MagnifyingGlassIcon, PlusIcon, ArchiveBoxIcon, XMarkIcon, CalendarDaysIcon, 
  CheckCircleIcon, XCircleIcon, NoSymbolIcon, MapPinIcon, ChevronLeftIcon, ChevronRightIcon,
  ClockIcon, TagIcon, ExclamationTriangleIcon, ArrowUpTrayIcon, ArrowDownIcon
} from '@heroicons/vue/24/outline';

// Import Komponen (Sesuaikan path jika perlu)
import StockFormModal from '../components/StockFormModal.vue';
import StockDetailModal from '../components/StockDetailModal.vue';

// --- 1. CONFIG & STATE ---
const toast = ref({ show: false, message: '', type: 'success' });
let toastTimeout = null;

const triggerToast = (message, type = 'success') => {
  if (toastTimeout) clearTimeout(toastTimeout); 
  toast.value.message = message; toast.value.type = type; toast.value.show = true;
  toastTimeout = setTimeout(() => { toast.value.show = false; }, 3000);
};

// State Confirm Modal
const confirmModal = ref({ show: false, message: '', onConfirm: () => {} });

// FUNGSI PENTING: Jembatan untuk tombol "Ya, Hapus"
const onConfirm = () => {
    if (confirmModal.value.onConfirm) {
        confirmModal.value.onConfirm(); // Jalankan logika hapus yang disimpan
    }
    closeConfirmModal();
};

const closeConfirmModal = () => { confirmModal.value.show = false; };
const openConfirmModal = (opts) => {
    confirmModal.value = { ...opts, show: true };
};

const currentTime = ref('');
const activeTab = ref('stock');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

// Filter State
const selectedUnit = ref('Semua Unit');
const selectedCategory = ref('Semua Kategori');

// History State
const historySearchQuery = ref('');
const currentHistoryPage = ref(1);

const isModalOpen = ref(false);
const selectedItem = ref(null);
const isDetailModalOpen = ref(false);
const detailItem = ref(null);

// Timer Jam
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }).replace(/\./g, ':');
};
onMounted(() => { updateTime(); timeInterval = setInterval(updateTime, 1000); });
let timeInterval = null;
onUnmounted(() => { if (timeInterval) clearInterval(timeInterval); });

// --- 2. DATA MASTER ---
const allUnits = ref([
  { id: 1, alias: 'UID Jatim', name: 'UID Jawa Timur' },
  { id: 2, alias: 'UID Jabar', name: 'UID Jawa Barat' },
  { id: 3, alias: 'UID Jaya', name: 'UID Jakarta Raya' },
  { id: 5, alias: 'UID Bali', name: 'UID Bali' },
  { id: 7, alias: 'UID Sumut', name: 'UID Sumatera Utara' },
  { id: 13, alias: 'UIW Papua', name: 'UIW Papua' },
  { id: 8, alias: 'UID Sumbar', name: 'UID Sumatera Barat' },
  { id: 10, alias: 'UID Kaltim', name: 'UID Kalimantan Timur' },
  { id: 6, alias: 'UID Sulsel', name: 'UID Sulawesi Selatan' },
]);

const allATKMaster = ref([
  { id: 1, name: 'Kertas A4 Sinar Dunia 70gr', code: 'ATK-KRT-001', category: 'Kertas', uom: 'Rim', url_photo: '' },
  { id: 2, name: 'Pulpen Standard AE7 Hitam', code: 'ATK-ALT-002', category: 'Alat Tulis', uom: 'Pcs', url_photo: '' },
  { id: 3, name: 'Tinta Epson 003 Black', code: 'ATK-TNT-003', category: 'Tinta', uom: 'Botol', url_photo: '' },
  { id: 4, name: 'Baterai ABC AA', code: 'ATK-ELK-001', category: 'Elektronik', uom: 'Pack', url_photo: '' },
  { id: 5, name: 'Ordner Bindex 717 Folio', code: 'ATK-ODR-005', category: 'Penyimpanan', uom: 'Pcs', url_photo: '' },
  { id: 6, name: 'Stapler Max HD-10', code: 'ATK-ALT-006', category: 'Alat Tulis', uom: 'Pcs', url_photo: '' },
  { id: 7, name: 'Isi Staples Max No.10', code: 'ATK-ALT-007', category: 'Alat Tulis', uom: 'Box', url_photo: '' },
  { id: 8, name: 'Map Snelhecter Plastik', code: 'ATK-DOC-008', category: 'Kertas', uom: 'Lusin', url_photo: '' },
  { id: 9, name: 'Spidol Permanent Snowman', code: 'ATK-ALT-009', category: 'Alat Tulis', uom: 'Pcs', url_photo: '' },
  { id: 10, name: 'Kalkulator Casio', code: 'ATK-ELK-010', category: 'Elektronik', uom: 'Pcs', url_photo: '' },
]);

const categories = ref([ 'Alat Tulis', 'Kertas', 'Tinta', 'Elektronik', 'Penyimpanan' ]);

// Helpers
const getATK = (itemId) => allATKMaster.value.find(a => a.id === itemId) || { name: 'Unknown', code: '???', category: 'Umum' };
const getUnitAlias = (unitId) => allUnits.value.find(u => u.id === unitId)?.alias || 'Unknown';
const getCategoryName = (id) => 'Kategori'; // Placeholder jika kategori bukan ID

// --- 3. DATA & LOGIC STOK ---
const allStockItems = ref([
  { id: 101, item_id: 1, unit_id: 1, stock: 150, stock_min: 20, price: 45000, status: 'Active', created_at: '01/01/2023', updated_at: '10/12/2023', batches: [{ id:1, date:'2023-11-01', price:45000, stock:150 }] },
  { id: 102, item_id: 2, unit_id: 1, stock: 500, stock_min: 50, price: 2500, status: 'Active', created_at: '01/01/2023', batches: [{ id:2, date:'2023-10-05', price:2500, stock:500 }] },
  { id: 103, item_id: 3, unit_id: 2, stock: 3, stock_min: 5, price: 85000, status: 'Active', created_at: '01/01/2023', batches: [{ id:3, date:'2023-09-15', price:85000, stock:3 }] },
  { id: 104, item_id: 4, unit_id: 3, stock: 0, stock_min: 10, price: 12000, status: 'Active', created_at: '05/01/2023', batches: [] },
  { id: 105, item_id: 5, unit_id: 1, stock: 50, stock_min: 10, price: 28000, status: 'Active', created_at: '06/01/2023', batches: [{ id:4, date:'2023-11-22', price:28000, stock:50 }] },
  { id: 106, item_id: 1, unit_id: 4, stock: 80, stock_min: 20, price: 46000, status: 'Active', created_at: '10/01/2023', batches: [{ id:5, date:'2023-11-10', price:46000, stock:80 }] },
  { id: 107, item_id: 2, unit_id: 5, stock: 200, stock_min: 30, price: 2700, status: 'Active', created_at: '12/01/2023', batches: [{ id:6, date:'2023-11-01', price:2700, stock:200 }] },
  { id: 108, item_id: 3, unit_id: 7, stock: 15, stock_min: 5, price: 90000, status: 'Active', created_at: '15/01/2023', batches: [{ id:7, date:'2023-10-20', price:90000, stock:15 }] },
  { id: 109, item_id: 4, unit_id: 6, stock: 5, stock_min: 10, price: 16000, status: 'Active', created_at: '18/01/2023', batches: [{ id:8, date:'2023-11-05', price:16000, stock:5 }] },
  { id: 110, item_id: 5, unit_id: 8, stock: 100, stock_min: 20, price: 29500, status: 'Active', created_at: '20/01/2023', batches: [{ id:9, date:'2023-11-25', price:29500, stock:100 }] },
  { id: 111, item_id: 6, unit_id: 1, stock: 40, stock_min: 10, price: 15000, status: 'Active', created_at: '22/01/2023', batches: [{ id:10, date:'2023-02-01', price:15000, stock:40 }] },
  { id: 112, item_id: 7, unit_id: 3, stock: 200, stock_min: 50, price: 2000, status: 'Active', created_at: '25/01/2023', batches: [{ id:11, date:'2023-02-05', price:2000, stock:200 }] },
  { id: 113, item_id: 8, unit_id: 2, stock: 25, stock_min: 5, price: 35000, status: 'Active', created_at: '28/01/2023', batches: [{ id:12, date:'2023-02-10', price:35000, stock:25 }] },
  { id: 114, item_id: 9, unit_id: 1, stock: 300, stock_min: 50, price: 7500, status: 'Active', created_at: '30/01/2023', batches: [{ id:13, date:'2023-02-15', price:7500, stock:300 }] },
  { id: 115, item_id: 10, unit_id: 13, stock: 10, stock_min: 5, price: 125000, status: 'Active', created_at: '01/02/2023', batches: [{ id:14, date:'2023-02-20', price:125000, stock:10 }] },
]);

const stockHistory = ref([
  { id: 1, type: 'IN', date: '2023-11-20 09:00', itemName: 'Kertas A4 Sinar Dunia 70gr', qty: 50, actor: 'Admin', note: 'Restock Batch #2' },
]);

// COMPUTED: UNTUK MENGAMBIL DATA UNIK
const uniqueUnits = computed(() => allUnits.value); 
const uniqueCategories = computed(() => categories.value);

// --- 4. LOGIKA FILTER UTAMA (DIPERBAIKI) ---
const filteredStock = computed(() => {
  return allStockItems.value.filter(stock => {
    const item = getATK(stock.item_id);
    
    // 1. Logic Search (Nama atau Kode)
    const search = searchQuery.value.toLowerCase();
    const matchSearch = item.name.toLowerCase().includes(search) || 
                        item.code.toLowerCase().includes(search);
    
    // 2. Logic Filter Unit
    // Perhatikan: stock.unit_id adalah Number. selectedUnit bisa String "Semua Unit" atau Number ID.
    const matchUnit = selectedUnit.value === 'Semua Unit' || stock.unit_id === selectedUnit.value;
    
    // 3. Logic Filter Kategori
    const matchCat = selectedCategory.value === 'Semua Kategori' || item.category === selectedCategory.value;
    
    return matchSearch && matchUnit && matchCat;
  }).sort((a, b) => getATK(a.item_id).name.localeCompare(getATK(b.item_id).name));
});

const paginatedStock = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredStock.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredStock.value.length / itemsPerPage));

// --- 5. LOGIKA FILTER HISTORY (DIPERBAIKI) ---
const filteredHistory = computed(() => {
  if (!historySearchQuery.value) return stockHistory.value;
  
  const query = historySearchQuery.value.toLowerCase();
  return stockHistory.value.filter(log => 
     log.itemName.toLowerCase().includes(query) ||
     log.actor.toLowerCase().includes(query) ||
     log.note.toLowerCase().includes(query) ||
     (log.type === 'IN' ? 'masuk' : 'keluar').includes(query)
  );
});

const paginatedHistory = computed(() => filteredHistory.value);

// Reset halaman saat filter berubah
const handleFilterChange = () => { currentPage.value = 1; };
const handleHistoryFilterChange = () => { currentHistoryPage.value = 1; };

// --- 6. ACTIONS ---

// Modal & CRUD
const openStockModal = (stock) => {
  selectedItem.value = stock ? { ...stock } : null;
  isModalOpen.value = true;
};

const closeModal = () => { 
  isModalOpen.value = false; 
  selectedItem.value = null; 
};

const openDetailModal = (stock) => {
  const atk = getATK(stock.item_id);
  detailItem.value = { 
    ...stock, 
    name: atk.name, sku: atk.code, uom: atk.uom, 
    unit: getUnitAlias(stock.unit_id),
    url_photo: atk.url_photo, category: atk.category
  }; 
  isDetailModalOpen.value = true; 
};

const closeDetailModal = () => {
  isDetailModalOpen.value = false;
  detailItem.value = null;
};

const handleDetailEdit = () => {
   const itemToEdit = allStockItems.value.find(i => i.id === detailItem.value.id);
   closeDetailModal();
   openStockModal(itemToEdit);
};

const handleStockSave = (formData) => {
  const today = new Date().toLocaleDateString('en-GB');
  
  // LOGIC EDIT / TRANSAKSI
  if (formData.id) {
    const index = allStockItems.value.findIndex(s => s.id === formData.id);
    if (index !== -1) {
      if (formData.txType && formData.txQty > 0) { // Transaksi Masuk/Keluar
         const qty = parseInt(formData.txQty);
         const atkName = getATK(allStockItems.value[index].item_id).name;
         
         if (formData.txType === 'in') {
            allStockItems.value[index].stock += qty;
            stockHistory.value.unshift({ id: Date.now(), type: 'IN', date: new Date().toLocaleString('id-ID'), itemName: atkName, qty: qty, actor: 'Admin', note: formData.txNote || 'Restock Manual' });
            triggerToast(`Berhasil restock +${qty}`, 'success');
         } else {
            if (allStockItems.value[index].stock >= qty) {
              allStockItems.value[index].stock -= qty;
              stockHistory.value.unshift({ id: Date.now(), type: 'OUT', date: new Date().toLocaleString('id-ID'), itemName: atkName, qty: qty, actor: 'Admin', note: formData.txNote || 'Koreksi Stok' });
              triggerToast(`Berhasil koreksi -${qty}`, 'success');
            } else {
              triggerToast('Stok tidak mencukupi!', 'error');
              return;
            }
         }
      } else { // Edit Data Biasa
         allStockItems.value[index] = { ...allStockItems.value[index], ...formData, updated_at: today };
         triggerToast('Data stok diperbarui', 'success');
      }
    }
  } 
  // LOGIC CREATE BARU
  else {
    const newId = Date.now();
    allStockItems.value.push({ 
      ...formData, id: newId, status: 'Active', created_at: today, created_by: 'Admin',
    });
    stockHistory.value.unshift({ 
      id: Date.now(), type: 'IN', date: new Date().toLocaleString('id-ID'), 
      itemName: getATK(formData.item_id).name, qty: formData.stock, actor: 'Admin', note: 'Stok Awal' 
    });
    triggerToast('Stok baru ditambahkan', 'success');
  }
  closeModal();
};

const handleDelete = (itemToDelete) => {
  openConfirmModal({
    title: 'Hapus Data Stok',
    message: `Yakin hapus stok "${getATK(itemToDelete.item_id).name}" di ${getUnitAlias(itemToDelete.unit_id)}?`,
    buttonText: 'Hapus',
    buttonClass: 'bg-red-600 hover:bg-red-700',
    icon: NoSymbolIcon,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    
    // Callback ini akan dijalankan saat tombol "Ya, Hapus" diklik via onConfirm()
    onConfirm: () => {
        try {
          allStockItems.value = allStockItems.value.filter(s => s.id !== itemToDelete.id);
          
          // Catat Log Penghapusan
          stockHistory.value.unshift({
              id: Date.now(), type: 'OUT', date: new Date().toLocaleString('id-ID'),
              itemName: getATK(itemToDelete.item_id).name, qty: itemToDelete.stock,
              actor: 'Admin', note: 'Penghapusan Data Stok'
          });

          if (paginatedStock.value.length === 0 && currentPage.value > 1) currentPage.value--;
          triggerToast('Data berhasil dihapus', 'success');
        } catch (error) {
          triggerToast('Gagal menghapus data.', 'error');
        }
    }
  });
};

watch(() => confirmModal.value.show, (val) => document.body.style.overflow = val ? 'hidden' : '');
</script>

<style scoped>
.toast-slide-top-enter-active{ transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-slide-top-leave-active { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-slide-top-enter-from, .toast-slide-top-leave-to { opacity: 0; transform: translateY(-20px) translateX(-50%); }
</style>