<template>
  <Teleport to="body">
    <!-- Overlay -->
    <div v-if="show" @click="onClose" class="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"></div>

    <!-- Modal Panel -->
    <div v-if="show" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
      
      <div class="relative w-full max-w-4xl h-[85vh] transform overflow-hidden rounded-2xl bg-slate-50 text-left shadow-2xl transition-all ring-1 ring-slate-900/5 flex flex-col" @click.stop>
        
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
                {{ isEditing ? 'Catat transaksi atau update data stok.' : 'Registrasi barang baru ke unit kerja.' }}
              </p>
            </div>
          </div>
          <button @click="onClose" class="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-all">
            <XMarkIcon class="h-7 w-7" />
          </button>
        </div>

        <!-- Body Form -->
        <div class="p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/80">
          <form @submit.prevent="onSave" class="space-y-6 max-w-3xl mx-auto pb-10">
            
            <!-- Info Barang (Read-only saat Edit) -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 border-b border-slate-100 pb-2">Informasi Barang & Lokasi</h4>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="label-modern">Barang ATK</label>
                    <select v-model="localStock.item_id" required class="form-select-bold w-full" :disabled="isEditing" :class="{'bg-slate-100 cursor-not-allowed': isEditing}">
                       <option disabled value="">-- Pilih Barang --</option>
                       <option v-for="atk in atkOptions" :key="atk.id" :value="atk.id">{{ atk.code }} - {{ atk.name }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="label-modern">Unit Kerja</label>
                    <select v-model="localStock.unit_id" required class="form-select-bold w-full" :disabled="isEditing" :class="{'bg-slate-100 cursor-not-allowed': isEditing}">
                       <option disabled value="">-- Pilih Unit --</option>
                       <option v-for="unit in unitOptions" :key="unit.id" :value="unit.id">{{ unit.alias }}</option>
                    </select>
                  </div>
               </div>
            </div>

            <!-- Form Transaksi (Khusus Edit) -->
            <div v-if="isEditing" class="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-inner">
               <h4 class="text-sm font-bold text-blue-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                 <ClipboardDocumentListIcon class="h-5 w-5" /> Transaksi Stok
               </h4>
               
               <!-- Tabs Transaksi -->
               <div class="flex space-x-4 mb-6">
                  <button type="button" @click="transactionType = 'in'" class="flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all flex items-center justify-center gap-2" :class="transactionType === 'in' ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' : 'border-slate-200 bg-white text-slate-500 hover:border-green-200'">
                     <ArrowUpIcon class="h-5 w-5" /> Tambah Stok (Masuk)
                  </button>
                  <button type="button" @click="transactionType = 'out'" class="flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all flex items-center justify-center gap-2" :class="transactionType === 'out' ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' : 'border-slate-200 bg-white text-slate-500 hover:border-orange-200'">
                     <ArrowDownIcon class="h-5 w-5" /> Koreksi / Keluar
                  </button>
               </div>

               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="label-modern">{{ transactionType === 'in' ? 'Jumlah Masuk' : 'Jumlah Keluar' }}</label>
                    <input v-model.number="transactionQty" type="number" min="0" class="form-input-bold text-lg" placeholder="0" />
                    <p class="text-xs text-slate-500 mt-1 ml-1">Stok saat ini: <strong>{{ localStock.stock }}</strong></p>
                  </div>
                  <div>
                    <label class="label-modern">Keterangan</label>
                    <input v-model="transactionNote" type="text" class="form-input-bold" :placeholder="transactionType === 'in' ? 'Cth: Pembelian baru' : 'Cth: Rusak / Opname'" />
                  </div>
               </div>
            </div>

            <!-- Form Stok Awal (Khusus Create) -->
            <div v-else class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Stok Awal</h4>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="label-modern">Jumlah Stok</label>
                    <input v-model.number="localStock.stock" type="number" min="0" class="form-input-bold px-4" />
                  </div>
                  <div>
                    <label class="label-modern">Stok Minimum (Alert)</label>
                    <input v-model.number="localStock.stock_min" type="number" min="0" class="form-input-bold px-4" />
                  </div>
               </div>
            </div>
            
            <!-- Harga & Status (Selalu ada) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <label class="label-modern">Harga Satuan (Rp)</label>
                  <div class="relative w-full">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span class="text-slate-500 font-bold text-sm">Rp</span>
                    </div>
                    
                    <input 
                      v-model.number="localStock.price" 
                      type="number" 
                      min="0" 
                      class="form-input-bold !pl-12" 
                      placeholder="0" 
                    />
                  </div>
                  <p class="text-[10px] text-slate-400 mt-1 ml-1">Harga pembelian per unit.</p>
                </div>
               
               <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-300 transition-all" @click="toggleStatus">
                  <div>
                    <label class="label-modern mb-0 cursor-pointer">Status Aktif</label>
                    <p class="text-xs text-slate-400">Barang dapat ditransaksikan</p>
                  </div>
                  <button 
                    type="button" 
                    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none" 
                    :class="localStock.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'"
                  >
                    <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="localStock.status === 'Active' ? 'translate-x-5' : 'translate-x-0'"></span>
                  </button>
               </div>
            </div>

          </form>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-4 px-8 py-5 bg-white border-t border-slate-200 shrink-0 rounded-b-2xl">
          <button @click="onClose" class="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors border border-slate-300">Batal</button>
          
          <!-- LOGIKA DISABLED DIPERBARUI:
               Hanya disable jika:
               1. Form tidak valid (!isValid)
               2. ATAU Jika mode Edit:
                  - Tidak ada transaksi (transactionQty <= 0)
                  - DAN Tidak ada perubahan data (isModified == false)
          -->
          <button 
            @click="onSave" 
            :disabled="!isValid || (isEditing && transactionQty <= 0 && !isModified)"
            class="px-8 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            :class="isEditing 
              ? (transactionQty > 0 ? (transactionType === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700') : 'bg-blue-600 hover:bg-blue-700')
              : 'bg-blue-600 hover:bg-blue-700'"
          >
            <!-- Teks Tombol Dinamis -->
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
import { ArchiveBoxIcon, XMarkIcon, ClipboardDocumentListIcon, BuildingOfficeIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/outline';

const props = defineProps({ show: Boolean, stockToEdit: Object, atkOptions: Array, unitOptions: Array });
const emit = defineEmits(['close', 'save']);

const localStock = ref({});
const originalStock = ref({}); // Untuk melacak perubahan
const isEditing = computed(() => !!localStock.value.id);
const transactionType = ref('in');
const transactionQty = ref(0);
const transactionNote = ref('');

const toggleStatus = () => {
  localStock.value.status = localStock.value.status === 'Active' ? 'Inactive' : 'Active';
};

// Cek Validasi Dasar
const isValid = computed(() => {
  return localStock.value.item_id && localStock.value.unit_id;
});

// Cek apakah ada perubahan data Master (selain transaksi)
const isModified = computed(() => {
  if (!isEditing.value) return true;
  // Bandingkan field penting
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
      // Clone data agar tidak reaktif langsung ke parent sebelum save
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
  // Kirim data ke parent
  emit('save', { 
    ...localStock.value, 
    txType: transactionType.value, 
    txQty: transactionQty.value, 
    txNote: transactionNote.value 
  });
};
</script>

<style scoped>
.label-modern { @apply block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5; }
.form-input-bold { @apply block w-full rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-blue-100 focus:border-blue-500 py-2.5 px-4 transition-all shadow-sm hover:border-blue-300; }
.form-select-bold { @apply block w-full rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-blue-100 focus:border-blue-500 py-2.5 px-4 transition-all cursor-pointer shadow-sm hover:border-blue-300; }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>