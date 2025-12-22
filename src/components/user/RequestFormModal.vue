<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
        
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="handleClose"></div>

        <div class="relative w-full max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/5 transform transition-all">
          
          <div class="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 z-20">
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <ShoppingCartIcon class="h-6 w-6" />
              </div>
              <div>
                <h3 class="text-xl font-black text-slate-800 tracking-tight">Form Permintaan Barang</h3>
                <p class="text-sm text-slate-500 font-medium">Pastikan permintaan tidak melebihi kapasitas stok unit.</p>
              </div>
            </div>
            
            <button 
              @click="handleClose" 
              class="group p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
              title="Tutup (Esc)"
            >
              <XMarkIcon class="h-7 w-7 transition-transform group-hover:rotate-90" />
            </button>
          </div>

          <div class="flex flex-1 overflow-hidden">
            
            <div class="w-full md:w-5/12 flex flex-col border-r border-slate-100 bg-slate-50/50">
              
              <div class="p-5 sticky top-0 z-10 bg-slate-50/95 backdrop-blur border-b border-slate-200/60">
                <div class="relative group">
                  <MagnifyingGlassIcon class="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="Cari nama barang..." 
                    class="w-full pl-12 pr-4 py-3 rounded-2xl border-none bg-white shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 focus:shadow-md transition-all text-sm font-semibold placeholder:font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div class="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-3">
                <div 
                  v-for="item in filteredItems" 
                  :key="item.id" 
                  class="group relative flex items-center gap-4 p-3 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200"
                  @click="selectItem(item)"
                  :class="{'ring-2 ring-blue-500 border-blue-500 bg-blue-50/30': tempSelectedItem?.id === item.id}"
                >
                  <div class="h-16 w-16 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                    <img v-if="item.url_photo" :src="item.url_photo" class="h-full w-full object-contain" />
                    <PhotoIcon v-else class="h-8 w-8 text-slate-300" />
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start">
                      <p class="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-blue-700 transition-colors">{{ item.name }}</p>
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500">{{ item.uom }}</span>
                    </div>
                    <p class="text-xs text-slate-500 mt-0.5 font-mono">{{ item.code }}</p>
                    <div class="flex items-center gap-2 mt-1">
                       <span class="text-[10px] text-slate-400">Max: {{ item.max_stock }}</span>
                    </div>
                  </div>

                  <div class="h-8 w-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <PlusIcon class="h-5 w-5" />
                  </div>
                </div>
                
                <div v-if="filteredItems.length === 0" class="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                  <MagnifyingGlassIcon class="h-8 w-8 mb-2 opacity-50" />
                  <p class="text-sm">Barang tidak ditemukan</p>
                </div>
              </div>
            </div>

            <div class="w-full md:w-7/12 flex flex-col bg-white relative">
              
              <div class="p-6 border-b border-slate-100 relative">
                <Transition name="fade-slide">
                  <div v-if="localSuccessMsg" class="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 z-30">
                    <CheckCircleIcon class="h-4 w-4 text-green-400" />
                    {{ localSuccessMsg }}
                  </div>
                </Transition>

                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TagIcon class="h-4 w-4" /> Detail Permintaan
                </h4>

                <div v-if="tempSelectedItem" class="animate-fade-in space-y-5">
                  <div class="grid grid-cols-3 gap-3">
                    <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <p class="text-[10px] uppercase font-bold text-slate-400">Stok Unit Saat Ini</p>
                      <p class="text-lg font-black text-slate-700">{{ currentUnitStock }} <span class="text-xs font-medium text-slate-400">{{ tempSelectedItem.uom }}</span></p>
                    </div>
                    <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <p class="text-[10px] uppercase font-bold text-slate-400">Batas Maksimal</p>
                      <p class="text-lg font-black text-slate-700">{{ tempSelectedItem.max_stock }} <span class="text-xs font-medium text-slate-400">{{ tempSelectedItem.uom }}</span></p>
                    </div>
                    <div class="p-3 rounded-xl border text-center transition-colors" 
                      :class="remainingQuota > 0 ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'">
                      <p class="text-[10px] uppercase font-bold" :class="remainingQuota > 0 ? 'text-blue-500' : 'text-red-500'">Bisa Diminta</p>
                      <p class="text-lg font-black" :class="remainingQuota > 0 ? 'text-blue-700' : 'text-red-600'">{{ remainingQuota }} <span class="text-xs font-medium opacity-70">{{ tempSelectedItem.uom }}</span></p>
                    </div>
                  </div>

                  <div class="flex gap-4 items-center">
                    <div class="h-12 w-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-1">
                       <img v-if="tempSelectedItem.url_photo" :src="tempSelectedItem.url_photo" class="h-full w-full object-contain" />
                       <PhotoIcon v-else class="h-6 w-6 text-slate-300" />
                    </div>
                    <div>
                      <p class="text-base font-bold text-slate-800 leading-tight">{{ tempSelectedItem.name }}</p>
                      <p class="text-xs text-slate-500 font-mono">{{ tempSelectedItem.code }}</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-5 relative">
                      <label class="block text-xs font-bold text-slate-500 mb-1.5 flex justify-between">
                        <span>Jumlah Request</span>
                        <button 
                          v-if="remainingQuota > 0 && inputQty !== remainingQuota"
                          @click="inputQty = remainingQuota" 
                          class="text-[10px] text-blue-600 hover:underline font-bold"
                        >
                          Isi Penuh ({{ remainingQuota }})
                        </button>
                      </label>
                      
                      <div class="relative">
                        <input 
                          v-model.number="inputQty" 
                          type="number" 
                          min="1" 
                          class="w-full rounded-xl border bg-white py-2.5 px-3 text-sm font-bold focus:ring-2 transition-all pr-12"
                          :class="qtyError ? 'border-red-300 text-red-600 focus:ring-red-200 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'"
                        />
                        <span class="absolute right-3 top-2.5 text-xs font-bold text-slate-400">{{ tempSelectedItem.uom }}</span>
                      </div>

                      <p v-if="qtyError" class="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1 animate-pulse">
                        <ExclamationCircleIcon class="h-3 w-3" /> {{ qtyError }}
                      </p>
                    </div>

                    <div class="col-span-7">
                      <label class="block text-xs font-bold text-slate-500 mb-1.5">Catatan</label>
                      <input 
                        v-model="inputNote" 
                        type="text" 
                        placeholder="Cth: Warna Hitam..." 
                        class="w-full rounded-xl border-slate-300 bg-white py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        @keydown.enter="addToCart"
                      />
                    </div>
                  </div>

                  <button 
                    @click="addToCart" 
                    :disabled="!!qtyError || inputQty < 1"
                    class="w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
                  >
                    <PlusCircleIcon class="h-5 w-5" />
                    Tambahkan ke Daftar
                  </button>
                </div>

                <div v-else class="flex flex-col items-center justify-center h-56 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                  <CursorArrowRaysIcon class="h-10 w-10 text-slate-300 mb-2" />
                  <p class="text-sm font-bold text-slate-500">Pilih barang di sisi kiri</p>
                  <p class="text-xs text-slate-400">Untuk melihat detail stok & input jumlah.</p>
                </div>
              </div>

              <div class="flex-1 flex flex-col min-h-0 bg-slate-50/30">
                <div class="px-6 py-3 flex justify-between items-end border-b border-slate-100">
                  <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Daftar Permintaan <span v-if="cart.length" class="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-md">{{ cart.length }}</span>
                  </h4>
                  <button v-if="cart.length > 0" @click="confirmClearCart" class="text-[10px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors">
                    Hapus Semua
                  </button>
                </div>

                <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                  <TransitionGroup name="list">
                    <div v-for="(item, index) in cart" :key="item.id + index" class="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all">
                      <div class="flex items-center gap-3 overflow-hidden">
                        <div class="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-100">
                          {{ index + 1 }}
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-bold text-slate-800 truncate">{{ item.name }}</p>
                          <div class="flex items-center gap-2 text-xs text-slate-500">
                            <span class="font-bold bg-slate-100 px-1.5 rounded">{{ item.qty }} {{ item.uom }}</span>
                            <span v-if="item.note" class="italic text-slate-400 truncate max-w-[150px]">• {{ item.note }}</span>
                          </div>
                        </div>
                      </div>
                      <button @click="removeFromCart(index)" class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <TrashIcon class="h-5 w-5" />
                      </button>
                    </div>
                  </TransitionGroup>

                  <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-slate-300 opacity-60 mt-4">
                    <ShoppingCartIcon class="h-12 w-12 mb-2" />
                    <p class="text-xs">Keranjang kosong</p>
                  </div>
                </div>
              </div>

              <div class="p-6 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-10">
                <div class="mb-4">
                  <label class="block text-xs font-bold text-slate-500 mb-1.5 flex justify-between">
                    <span>Keterangan Pengajuan <span class="text-red-500">*</span></span>
                    <span class="text-[10px] font-normal" :class="requestDescription.length > 5 ? 'text-blue-500' : 'text-slate-400'">{{ requestDescription.length }} chars</span>
                  </label>
                  <textarea 
                    v-model="requestDescription" 
                    rows="2" 
                    class="w-full rounded-xl border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 resize-none transition-all" 
                    placeholder="Contoh: Kebutuhan operasional bulan Februari..."
                  ></textarea>
                </div>
                
                <div class="flex gap-3">
                  <button @click="handleClose" class="flex-1 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Batal</button>
                  <button 
                    @click="submitRequest" 
                    :disabled="cart.length === 0 || !requestDescription.trim()"
                    class="flex-[2] py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
                  >
                    <PaperAirplaneIcon class="h-5 w-5 -rotate-45 mb-1" /> Kirim Pengajuan
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useInventoryStore } from '../../stores/inventoryStore'; // Gunakan store untuk cek stok real-time
import { 
  XMarkIcon, ShoppingCartIcon, MagnifyingGlassIcon, PlusIcon, 
  PhotoIcon, TagIcon, PlusCircleIcon, TrashIcon, PaperAirplaneIcon,
  CursorArrowRaysIcon, CheckCircleIcon, ExclamationCircleIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  show: Boolean,
  items: Array, 
});

const emit = defineEmits(['close', 'submit']);
const store = useInventoryStore();

// --- STATE ---
const searchQuery = ref('');
const tempSelectedItem = ref(null);
const inputQty = ref(1);
const inputNote = ref('');
const requestDescription = ref('');
const cart = ref([]);
const localSuccessMsg = ref('');

// --- COMPUTED: STOK CALCULATION ---
const currentUser = computed(() => {
  const stored = JSON.parse(localStorage.getItem('activeUser') || '{}');
  return stored.id ? stored : { id: 2, unit_id: 1 }; // Default fallback
});

// Ambil stok real unit user untuk item yang dipilih
const currentUnitStock = computed(() => {
  if (!tempSelectedItem.value) return 0;
  const stockRecord = store.stocks.find(
    s => s.item_id === tempSelectedItem.value.id && s.unit_id === currentUser.value.unit_id
  );
  return stockRecord ? stockRecord.stock : 0;
});

// Hitung Sisa Kuota (Max Master - Current Unit Stock)
const remainingQuota = computed(() => {
  if (!tempSelectedItem.value) return 0;
  const max = tempSelectedItem.value.max_stock || 0;
  const current = currentUnitStock.value;
  // Jika stok sekarang sudah melebihi max, kuota 0
  return Math.max(0, max - current);
});

// Validasi Pesan Error
const qtyError = computed(() => {
  if (!tempSelectedItem.value) return '';
  if (remainingQuota.value <= 0) return 'Stok unit Anda sudah penuh/mencapai batas.';
  if (inputQty.value > remainingQuota.value) return `Maksimal request: ${remainingQuota.value} ${tempSelectedItem.value.uom}`;
  if (inputQty.value < 1) return 'Minimal 1';
  return '';
});

const filteredItems = computed(() => {
  if (!props.items) return [];
  const q = searchQuery.value.toLowerCase();
  return props.items.filter(i => 
    i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q)
  );
});

// --- METHODS ---
const handleClose = () => { emit('close'); };

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.show) handleClose();
};

const selectItem = (item) => {
  tempSelectedItem.value = item;
  inputQty.value = 1;
  inputNote.value = '';
};

const showLocalNotification = (msg) => {
  localSuccessMsg.value = msg;
  setTimeout(() => localSuccessMsg.value = '', 2000);
};

const addToCart = () => {
  if (qtyError.value || inputQty.value < 1) return;
  
  const existing = cart.value.find(c => c.id === tempSelectedItem.value.id);
  
  // Cek apakah total di cart melebihi kuota? (Optional, advanced check)
  // Untuk simpel, kita cek per input saja.
  
  if (existing) {
    existing.qty = inputQty.value; // Replace qty atau add? Disini kita replace biar simpel editnya
    existing.note = inputNote.value;
    showLocalNotification(`Jumlah diperbarui jadi ${inputQty.value}!`);
  } else {
    cart.value.push({
      id: tempSelectedItem.value.id,
      name: tempSelectedItem.value.name,
      code: tempSelectedItem.value.code,
      uom: tempSelectedItem.value.uom,
      qty: inputQty.value,
      note: inputNote.value
    });
    showLocalNotification('Berhasil ditambahkan!');
  }
  
  // Reset input form only
  tempSelectedItem.value = null;
  inputQty.value = 1;
  inputNote.value = '';
};

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
};

const confirmClearCart = () => {
  if (confirm('Hapus semua item dari daftar?')) cart.value = [];
};

const submitRequest = () => {
  if (cart.value.length === 0 || !requestDescription.value.trim()) return;
  
  const payload = {
    description: requestDescription.value,
    details: cart.value.map(item => ({
      item_id: item.id,
      qty: item.qty,
      notes: item.note
    }))
  };
  
  emit('submit', payload);
  cart.value = [];
  requestDescription.value = '';
};

// --- WATCHERS ---
watch(() => props.show, (val) => {
  if(!val) {
    cart.value = [];
    requestDescription.value = '';
    searchQuery.value = '';
    tempSelectedItem.value = null;
    localSuccessMsg.value = '';
  }
});

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

/* Animations */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .transform, .modal-fade-leave-active .transform { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-fade-enter-from .transform { transform: scale(0.95) translateY(20px); }
.modal-fade-leave-to .transform { transform: scale(0.95) translateY(20px); }

.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-20px); }

.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translate(-50%, -20px); }
</style>