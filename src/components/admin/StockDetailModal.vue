<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>
    
    <div v-if="show" class="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-start shrink-0">
          <div class="flex items-start gap-4">
             <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 ring-1 ring-blue-200 shadow-sm">
               <ArchiveBoxIcon class="h-7 w-7" />
             </div>
             <div>
               <h3 class="text-xl font-extrabold text-slate-800 leading-tight">{{ item?.name }}</h3>
               <div class="flex flex-wrap gap-2 mt-1.5">
                  <span class="text-xs font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-medium shadow-sm">{{ item?.sku }}</span>
                  <span class="text-xs text-slate-600 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-medium">
                    <MapPinIcon class="h-3 w-3 text-blue-500" /> {{ item?.unit }}
                  </span>
                  <span class="text-xs text-slate-600 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                    <TagIcon class="h-3 w-3 text-slate-400" /> {{ item?.category }}
                  </span>
               </div>
             </div>
          </div>
          <div class="flex items-center gap-2">
             <button @click="$emit('edit')" class="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 text-slate-600 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md">
                <PencilSquareIcon class="h-4 w-4" />
                Edit Stok
             </button>
             <button @click="$emit('close')" class="p-2 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                <XMarkIcon class="h-6 w-6" />
             </button>
          </div>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto custom-scrollbar space-y-8 bg-white flex-1">
           
           <!-- Top Section: Foto & Ringkasan -->
           <div class="flex flex-col sm:flex-row gap-6">
              <!-- Foto Barang -->
              <div class="sm:w-1/3 flex flex-col">
                <div class="relative w-full aspect-square rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner group">
                  <img v-if="item?.url_photo" :src="item.url_photo" alt="Foto Barang" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110" />
                  <div v-else class="flex flex-col items-center text-slate-300">
                     <PhotoIcon class="h-16 w-16 mb-2" />
                     <span class="text-xs font-medium">Tidak ada foto</span>
                  </div>
                </div>
              </div>

              <!-- Stats Grid -->
              <div class="sm:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
                 <div class="bg-blue-50 p-5 rounded-2xl border border-blue-100 relative overflow-hidden">
                    <p class="text-[11px] uppercase font-bold text-blue-600 tracking-wider mb-1">Total Stok Fisik</p>
                    <!-- Gunakan computed totalStock agar sesuai dengan tabel batch (termasuk dummy) -->
                    <p class="text-3xl font-black text-slate-800">{{ totalStock }} <span class="text-sm font-medium text-blue-600/70">{{ item?.uom }}</span></p>
                    <p v-if="totalStock <= (item?.stock_min || 0)" class="text-[10px] text-red-600 font-bold mt-2 flex items-center gap-1">
                      <ExclamationTriangleIcon class="h-3 w-3" /> Stok Menipis (Min: {{ item?.stock_min }})
                    </p>
                 </div>
                 
                 <div class="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 relative overflow-hidden">
                    <p class="text-[11px] uppercase font-bold text-emerald-600 tracking-wider mb-1">Valuasi Aset</p>
                    <!-- Gunakan computed averagePrice agar sesuai dengan tabel batch -->
                    <p class="text-2xl font-black text-slate-800 truncate">
                      Rp {{ averagePrice.toLocaleString('id-ID') }}
                    </p>
                    <p class="text-[10px] text-emerald-600/80 mt-1 font-medium">Harga Rata-rata Batch</p>
                 </div>

                 <div class="col-span-1 sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                       <p class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Batch Masuk</p>
                       <!-- Gunakan panjang sortedBatches -->
                       <p class="text-xl font-bold text-slate-800">{{ sortedBatches.length }} <span class="text-xs font-normal text-slate-500">x Transaksi</span></p>
                    </div>
                    <div class="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                       <ClockIcon class="h-6 w-6" />
                    </div>
                 </div>
              </div>
           </div>

           <!-- Batch Table Section -->
           <div>
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-sm font-bold text-slate-700 flex items-center gap-2">
                   <span class="w-1.5 h-4 rounded-full bg-purple-500"></span> 
                   Rincian Batch (FIFO)
                </h4>
                <span v-if="totalPages > 1" class="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                  Hal {{ currentPage }} dari {{ totalPages }}
                </span>
              </div>

              <div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table class="min-w-full divide-y divide-slate-100">
                   <thead class="bg-slate-50">
                      <tr>
                         <th class="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tgl Masuk</th>
                         <th class="px-4 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Harga Beli</th>
                         <th class="px-4 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sisa Stok</th>
                         <th class="px-4 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subtotal</th>
                      </tr>
                   </thead>
                   <tbody class="divide-y divide-slate-100 bg-white">
                      <!-- PERBAIKAN LOGIKA: Cek sortedBatches.length (data gabungan), bukan item.batches -->
                      <tr v-if="sortedBatches.length === 0">
                        <td colspan="4" class="px-4 py-8 text-center text-sm text-slate-400 italic bg-slate-50/30">
                          Tidak ada data batch aktif.
                        </td>
                      </tr>
                      <tr v-for="batch in paginatedBatches" :key="batch.id" class="hover:bg-blue-50/30 transition-colors">
                         <td class="px-4 py-3 text-xs text-slate-600 font-mono">{{ formatDate(batch.date) }}</td>
                         <td class="px-4 py-3 text-xs text-right font-medium text-slate-700">Rp {{ batch.price.toLocaleString('id-ID') }}</td>
                         <td class="px-4 py-3 text-xs text-center">
                           <span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">{{ batch.stock }}</span>
                         </td>
                         <td class="px-4 py-3 text-xs text-right font-mono text-slate-500">
                           Rp {{ (batch.price * batch.stock).toLocaleString('id-ID') }}
                         </td>
                      </tr>
                   </tbody>
                </table>
              </div>

              <!-- Pagination Controls -->
              <div v-if="totalPages > 1" class="flex items-center justify-end gap-2 mt-3">
                 <button 
                   @click="currentPage--" 
                   :disabled="currentPage === 1"
                   class="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   <ChevronLeftIcon class="h-4 w-4" />
                 </button>
                 <button 
                   @click="currentPage++" 
                   :disabled="currentPage === totalPages"
                   class="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   <ChevronRightIcon class="h-4 w-4" />
                 </button>
              </div>
           </div>
        </div>

        <!-- Footer -->
        <div class="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end shrink-0 rounded-b-2xl">
           <button type="button" @click="$emit('close')" class="rounded-xl bg-white border border-slate-300 px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm">
             Tutup
           </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { 
  XMarkIcon, MapPinIcon, ArchiveBoxIcon, PencilSquareIcon, PhotoIcon, 
  ExclamationTriangleIcon, TagIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon 
} from '@heroicons/vue/24/outline';

const props = defineProps(['show', 'item']);
defineEmits(['close', 'edit']);

// --- Pagination Logic ---
const currentPage = ref(1);
const itemsPerPage = 5; 

const sortedBatches = computed(() => {
  // Data Dummy Tambahan (5 Item)
  const dummyBatches = [
    { id: 'd1', date: '2023-11-15', price: 45000, stock: 10 },
    { id: 'd2', date: '2023-11-10', price: 44500, stock: 20 },
    { id: 'd3', date: '2023-11-05', price: 46000, stock: 15 },
    { id: 'd4', date: '2023-10-28', price: 43000, stock: 30 },
    { id: 'd5', date: '2023-10-15', price: 42500, stock: 25 },
  ];

  const realBatches = props.item?.batches ? [...props.item.batches] : [];
  
  // Gabungkan data asli dengan dummy, lalu urutkan
  return [...realBatches, ...dummyBatches].sort((a, b) => new Date(b.date) - new Date(a.date));
});

const totalPages = computed(() => Math.ceil(sortedBatches.value.length / itemsPerPage));

const paginatedBatches = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return sortedBatches.value.slice(start, start + itemsPerPage);
});

// Computed untuk Statistik (Menggunakan data gabungan agar konsisten)
const totalStock = computed(() => {
  return sortedBatches.value.reduce((sum, batch) => sum + batch.stock, 0);
});

const averagePrice = computed(() => {
  if (sortedBatches.value.length === 0) return 0;
  const totalVal = sortedBatches.value.reduce((sum, batch) => sum + (batch.price * batch.stock), 0);
  const totalQty = sortedBatches.value.reduce((sum, batch) => sum + batch.stock, 0);
  return totalQty > 0 ? Math.round(totalVal / totalQty) : 0;
});

// Reset pagination when item changes
watch(() => props.item, () => {
  currentPage.value = 1;
});

// --- Helpers ---
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Lock scroll
watch(() => props.show, (isOpen) => {
  if (isOpen) document.body.style.overflow = 'hidden';
  else document.body.style.overflow = '';
});

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>