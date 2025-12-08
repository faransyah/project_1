<template>
  <Teleport to="body">
    <!-- Overlay -->
    <div v-if="show" @click="onClose" class="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"></div>

    <!-- Modal Panel -->
    <div v-if="show" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
      
      <div class="relative w-full max-w-6xl h-[85vh] transform overflow-hidden rounded-2xl bg-slate-50 text-left shadow-2xl transition-all ring-1 ring-slate-900/5 flex flex-col" @click.stop>
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-200 px-8 py-5 bg-white z-20 flex-shrink-0 shadow-sm relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <div class="flex items-center gap-5">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-white">
              <ArchiveBoxIcon class="h-7 w-7" />
            </div>
            <div>
              <h3 class="text-xl font-extrabold leading-6 text-slate-800 tracking-tight">
                {{ isEditing ? 'Kelola Stok Barang' : 'Tambah Stok Baru' }}
              </h3>
              <p class="text-sm text-slate-500 mt-0.5 font-medium">
                {{ isEditing ? 'Catat transaksi masuk/keluar atau update data.' : 'Registrasi stok barang baru ke unit kerja.' }}
              </p>
            </div>
          </div>
          <button @click="onClose" class="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-all">
            <XMarkIcon class="h-7 w-7" />
          </button>
        </div>

        <!-- Content Body (Split View) -->
        <div class="flex flex-1 overflow-hidden">
          
          <!-- KIRI: PREVIEW BARANG (FIXED) -->
          <div class="w-1/3 h-full bg-white border-r border-slate-200 p-8 flex flex-col items-center shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10 hidden md:flex">
             <div class="w-full max-w-xs flex flex-col h-full">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center shrink-0">Preview Barang</label>
                
                <!-- Container Foto -->
                <div class="relative w-full aspect-square rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden mb-6 p-4 shadow-inner group">
                  <img v-if="selectedATKPhoto" :src="selectedATKPhoto" alt="Preview Produk" class="w-full h-full object-contain transition-all duration-500 group-hover:scale-105" />
                  <div v-else class="flex flex-col items-center text-slate-300">
                      <PhotoIcon class="h-16 w-16 mb-3" />
                      <span class="text-xs font-medium text-slate-400">Pilih Barang ATK</span>
                  </div>
                </div>

                <!-- Info Statis Barang yang Dipilih -->
                <div v-if="selectedATK" class="w-full space-y-4">
                   <div class="text-center">
                      <h4 class="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">{{ selectedATK.name }}</h4>
                      <p class="text-xs text-slate-500 font-mono mt-1 bg-slate-100 px-2 py-0.5 rounded inline-block border border-slate-200">{{ selectedATK.code }}</p>
                   </div>
                   <div class="grid grid-cols-2 gap-3">
                      <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                         <p class="text-[10px] font-bold text-slate-400 uppercase">Kategori</p>
                         <p class="text-xs font-bold text-blue-600 mt-0.5 truncate">{{ getCategoryName(selectedATK.category_id) }}</p>
                      </div>
                      <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                         <p class="text-[10px] font-bold text-slate-400 uppercase">Satuan</p>
                         <p class="text-xs font-bold text-slate-700 mt-0.5">{{ selectedATK.uom }}</p>
                      </div>
                   </div>
                </div>
                <p v-else class="text-center text-xs text-slate-400 italic mt-4 px-4">
                   Silakan pilih "Barang ATK" di formulir sebelah kanan untuk melihat detailnya.
                </p>
             </div>
          </div>

          <!-- KANAN: FORM INPUT (SCROLLABLE) -->
          <div class="flex-1 h-full overflow-y-auto custom-scrollbar bg-slate-50/50">
            <div class="p-8 max-w-3xl mx-auto pb-24">
              <form @submit.prevent="onSave" class="space-y-8">
                
                <!-- SECTION 1: RELASI DATA -->
                <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                   <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
                      <LinkIcon class="h-5 w-5 text-blue-500" /> Relasi Data
                   </h4>
                   
                   <div class="space-y-6">
                      <div class="space-y-2">
                        <label class="label-modern">Barang ATK <span class="text-red-500">*</span></label>
                        <div class="relative group">
                           <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <ClipboardDocumentListIcon class="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                           </div>
                           <select 
                              v-model="localStock.item_id" 
                              required 
                              class="form-select-bold !pl-11 w-full"
                              :disabled="isEditing" 
                              :class="{'bg-slate-100 cursor-not-allowed text-slate-500': isEditing}"
                           >
                             <option value="" disabled>-- Pilih Barang --</option>
                             <option v-for="atk in atkOptions" :key="atk.id" :value="atk.id">
                               {{ atk.code }} - {{ atk.name }}
                             </option>
                           </select>
                        </div>
                      </div>

                      <div class="space-y-2">
                        <label class="label-modern">Unit Kerja <span class="text-red-500">*</span></label>
                        <div class="relative group">
                           <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <BuildingOfficeIcon class="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                           </div>
                           <select 
                              v-model="localStock.unit_id" 
                              required 
                              class="form-select-bold !pl-11 w-full"
                              :disabled="isEditing"
                              :class="{'bg-slate-100 cursor-not-allowed text-slate-500': isEditing}"
                           >
                             <option value="" disabled>-- Pilih Unit --</option>
                             <option v-for="unit in unitOptions" :key="unit.id" :value="unit.id">
                               {{ unit.alias }} - {{ unit.name }}
                             </option>
                           </select>
                        </div>
                      </div>
                   </div>
                </div>

                <!-- SECTION 2: TRANSAKSI (KHUSUS EDIT) -->
                <div v-if="isEditing" class="bg-blue-50 p-8 rounded-2xl border border-blue-100 shadow-inner relative overflow-hidden">
                   <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                   <h4 class="text-sm font-bold text-blue-800 uppercase tracking-wide mb-6 flex items-center gap-2">
                     <ArrowsRightLeftIcon class="h-5 w-5" /> Transaksi Stok
                   </h4>
                   
                   <div class="flex space-x-4 mb-6">
                      <button type="button" @click="transactionType = 'in'" class="flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm" :class="transactionType === 'in' ? 'border-green-500 bg-green-50 text-green-700 ring-1 ring-green-200' : 'border-slate-200 bg-white text-slate-500 hover:border-green-200 hover:text-green-600'">
                         <ArrowUpTrayIcon class="h-5 w-5" /> Masuk / Tambah
                      </button>
                      <button type="button" @click="transactionType = 'out'" class="flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm" :class="transactionType === 'out' ? 'border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-200' : 'border-slate-200 bg-white text-slate-500 hover:border-orange-200 hover:text-orange-600'">
                         <ArrowDownIcon class="h-5 w-5" /> Keluar / Koreksi
                      </button>
                   </div>

                   <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-2">
                        <label class="label-modern text-blue-900">{{ transactionType === 'in' ? 'Jumlah Masuk' : 'Jumlah Keluar' }}</label>
                        
                        <!-- INPUT DENGAN VALIDASI VISUAL -->
                        <div class="relative">
                          <input 
                              v-model.number="transactionQty" 
                              type="number" 
                              min="0" 
                              class="form-input-bold text-lg transition-all pr-10 no-spinner" 
                              :class="stockError ? 'border-red-500 text-red-600 bg-red-50 focus:border-red-600 focus:ring-red-200 placeholder:text-red-300' : 'border-blue-200 focus:border-blue-500'"
                              placeholder="0" 
                          />
                          <!-- Ikon Peringatan di dalam Input -->
                          <ExclamationCircleIcon v-if="stockError" class="absolute right-3 top-3.5 h-6 w-6 text-red-500 animate-pulse" />
                        </div>
                        
                        <!-- CONTAINER INFO & ERROR -->
                        <div class="flex flex-col gap-2 mt-2">
                            <!-- 1. Info Stok Normal (Selalu Muncul) -->
                            <div class="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-100/50 p-2 rounded-lg border border-blue-100 w-fit transition-all duration-300" :class="{'opacity-60': stockError}">
                              <ArchiveBoxIcon class="h-3.5 w-3.5" />
                              <span>Sisa Stok Saat Ini: <strong class="font-mono text-sm">{{ localStock.stock }}</strong></span>
                            </div>

                            <!-- 2. Pesan Error (Muncul DI BAWAH info stok) -->
                            <transition name="fade-slide">
                                <div v-if="stockError" class="flex items-start gap-2 text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 shadow-sm">
                                  <ExclamationCircleIcon class="h-4 w-4 shrink-0 mt-0.5" />
                                  <span>{{ stockError }}</span>
                                </div>
                            </transition>
                        </div>
                      </div>
                      
                      <div class="space-y-2">
                        <label class="label-modern text-blue-900">Keterangan</label>
                        <input v-model="transactionNote" type="text" class="form-input-bold border-blue-200 focus:border-blue-500" :placeholder="transactionType === 'in' ? 'Cth: Pembelian baru' : 'Cth: Rusak / Opname'" />
                      </div>
                   </div>
                </div>

                <!-- SECTION 2B: STOK AWAL (KHUSUS CREATE) -->
                <div v-else class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                   <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
                      <ArchiveBoxIcon class="h-5 w-5 text-emerald-600" /> Stok Awal
                   </h4>
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-2">
                        <label class="label-modern">Jumlah Stok</label>
                        <input v-model.number="localStock.stock" type="number" min="0" class="form-input-bold px-4 no-spinner" placeholder="0" />
                      </div>
                      <div class="space-y-2">
                        <label class="label-modern">Stok Minimum (Alert)</label>
                        <input v-model.number="localStock.stock_min" type="number" min="0" class="form-input-bold px-4 no-spinner" placeholder="5" />
                        <p class="text-[10px] text-slate-400 mt-1">Notifikasi jika stok dibawah angka ini.</p>
                      </div>
                   </div>
                </div>

                <!-- SECTION 3: HARGA & STATUS -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                   <!-- Harga -->
                   <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-center h-full">
                      <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>
                      <label class="label-modern mb-2">Harga Satuan</label>
                      <div class="relative group w-full">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span class="text-slate-400 font-bold text-sm group-focus-within:text-cyan-600 transition-colors duration-200">Rp</span>
                        </div>
                        <input 
                          v-model.number="localStock.price" 
                          type="number" 
                          min="0" 
                          class="form-input-bold w-full !pl-12 focus:border-cyan-500 focus:ring-cyan-100 placeholder:text-slate-300 no-spinner" 
                          placeholder="0" 
                        />
                      </div>
                      <p class="text-[10px] text-slate-400 mt-2 ml-1 font-medium">Harga pembelian per unit barang.</p>
                   </div>
                   
                   <!-- Status -->
                   <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full relative overflow-hidden group cursor-pointer hover:border-emerald-300 transition-all" @click="toggleStatus">
                      <div class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                      <div class="flex items-center justify-between h-full">
                         <div class="flex gap-4 items-center">
                            <div class="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                               <ShieldCheckIcon class="h-6 w-6" />
                            </div>
                            <div>
                               <span class="block text-base font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">Status Stok</span>
                               <span class="text-xs text-slate-500 font-medium">{{ localStock.status === 'Active' ? 'Barang Aktif' : 'Barang Non-Aktif' }}</span>
                            </div>
                         </div>
                         <button type="button" class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none" :class="localStock.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'">
                           <span aria-hidden="true" class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="localStock.status === 'Active' ? 'translate-x-5' : 'translate-x-0'"></span>
                         </button>
                      </div>
                   </div>
                </div>

              </form>
            </div>
          </div>
        </div>

        <!-- Footer (Fixed) -->
        <div class="flex items-center justify-end gap-4 px-8 py-5 bg-white border-t border-slate-200 shrink-0 rounded-b-2xl z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <button @click="onClose" class="px-6 py-2.5 text-sm font-bold bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors border border-transparent">
             Batal
          </button>
          
          <button 
            @click="onSave" 
            :disabled="!isValid"
            class="px-8 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none min-w-[140px]"
            :class="isEditing 
              ? (transactionQty > 0 
                  ? (transactionType === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700') 
                  : 'bg-blue-600 hover:bg-blue-700')
              : 'bg-blue-600 hover:bg-blue-700'"
          >
            <span v-if="!isEditing">Simpan Data Baru</span>
            <span v-else-if="transactionQty > 0">{{ transactionType === 'in' ? 'Simpan Pemasukan' : 'Simpan Pengeluaran' }}</span>
            <span v-else>Simpan Perubahan</span>
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue';
import { 
  ArchiveBoxIcon, XMarkIcon, ClipboardDocumentListIcon, BuildingOfficeIcon, 
  ArrowsRightLeftIcon, ArrowUpTrayIcon, ArrowDownIcon, PhotoIcon, LinkIcon, 
  ShieldCheckIcon, CurrencyDollarIcon, ExclamationCircleIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  show: Boolean,
  stockToEdit: Object,
  atkOptions: Array,  
  unitOptions: Array  
});

const emit = defineEmits(['close', 'save']);

const localStock = ref({});
const originalStock = ref({}); // Untuk melacak perubahan data master
const isEditing = computed(() => !!localStock.value.id);
const transactionType = ref('in');
const transactionQty = ref(0);
const transactionNote = ref('');

// --- Helper Kategori ---
const getCategoryName = (id) => {
  const cats = { 1: 'Alat Tulis', 2: 'Kertas & Dokumen', 3: 'Tinta & Toner', 4: 'Perlengkapan', 5: 'Lain-lain' };
  return cats[id] || '-';
};

// --- Computed ---
const selectedATK = computed(() => {
  if (!localStock.value.item_id) return null;
  return props.atkOptions.find(a => a.id === localStock.value.item_id);
});
const selectedATKPhoto = computed(() => selectedATK.value?.url_photo || null);

// --- Validasi Error Stok ---
const stockError = computed(() => {
  // Hanya validasi jika sedang Edit, tipe Keluar, dan Qty melebihi stok
  if (isEditing.value && transactionType.value === 'out' && transactionQty.value > localStock.value.stock) {
    return 'Stok tidak mencukupi untuk dikeluarkan!';
  }
  return '';
});

const toggleStatus = () => {
  localStock.value.status = localStock.value.status === 'Active' ? 'Inactive' : 'Active';
};

// Validasi Tombol Simpan
const isValid = computed(() => {
  // Cek dasar
  const basicCheck = localStock.value.item_id && localStock.value.unit_id;
  
  if (isEditing.value) {
     // Jika mode edit, cek error stok (harus kosong/false)
     if (stockError.value) return false;
     
     // Cek apakah ada perubahan data master ATAU ada transaksi
     const hasMasterChange = localStock.value.price !== originalStock.value.price ||
                             localStock.value.stock_min !== originalStock.value.stock_min ||
                             localStock.value.status !== originalStock.value.status;
     
     const hasTransaction = transactionQty.value > 0;
     
     // Valid jika ada perubahan di salah satu
     return basicCheck && (hasMasterChange || hasTransaction);
  }
  
  return basicCheck;
});

const isModified = computed(() => {
  if (!isEditing.value) return true;
  return localStock.value.price !== originalStock.value.price ||
         localStock.value.stock_min !== originalStock.value.stock_min ||
         localStock.value.status !== originalStock.value.status;
});

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
    transactionQty.value = 0;
    transactionNote.value = '';
    transactionType.value = 'in';
    
    if (props.stockToEdit) {
      localStock.value = JSON.parse(JSON.stringify(props.stockToEdit));
      originalStock.value = JSON.parse(JSON.stringify(props.stockToEdit));
    } else {
      localStock.value = { item_id: '', unit_id: '', stock: 0, stock_min: 5, price: 0, status: 'Active' };
      originalStock.value = {};
    }
  } else {
    document.body.style.overflow = '';
  }
});

onUnmounted(() => document.body.style.overflow = '');
const onClose = () => emit('close');

const onSave = () => {
  emit('save', { 
    ...localStock.value, 
    txType: transactionType.value, 
    txQty: transactionQty.value, 
    txNote: transactionNote.value 
  });
};
</script>

<style scoped>
.label-modern { @apply block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5; }
.form-input-bold { @apply block w-full rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-blue-100 focus:border-blue-500 py-2.5 px-4 transition-all shadow-sm hover:border-blue-300; }
.form-select-bold { @apply block w-full rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-blue-100 focus:border-blue-500 py-2.5 px-4 transition-all cursor-pointer shadow-sm hover:border-blue-300; }

/* HIDE SPINNERS for cleaner look */
.no-spinner::-webkit-inner-spin-button, 
.no-spinner::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
.no-spinner { 
  -moz-appearance: textfield; 
}

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>