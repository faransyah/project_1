<template>
  <div class="space-y-6 pb-20 animate-fade-in-up">
    
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-blue-50 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-30 backdrop-blur-xl bg-white/90">
      
      <div class="flex items-center gap-4 w-full md:w-auto">
        <div class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-blue-100">
          {{ getFirstName(currentUser?.full_name).charAt(0) }}
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-800 leading-tight">Halo, {{ getFirstName(currentUser?.full_name) }}!</h1>
          <p class="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
            <BuildingOfficeIcon class="h-3 w-3 text-blue-500" /> {{ currentUser?.unit_name }}
            <span class="w-1 h-1 rounded-full bg-slate-300"></span>
            <span class="text-blue-600 font-bold">{{ currentUser?.position_name }}</span>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto justify-end">
        <div class="flex bg-blue-50/50 p-1 rounded-xl border border-blue-100">
          <button 
            @click="activeTab = 'catalog'"
            class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
            :class="activeTab === 'catalog' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-600 hover:bg-blue-100'"
          >
            <Squares2X2Icon class="h-4 w-4" /> Katalog
          </button>
          <button 
            @click="activeTab = 'history'"
            class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
            :class="activeTab === 'history' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-600 hover:bg-blue-100'"
          >
            <ClockIcon class="h-4 w-4" /> Riwayat
            <span v-if="pendingCount > 0" class="bg-amber-400 text-white text-[9px] px-1.5 rounded-full shadow-sm">{{ pendingCount }}</span>
          </button>
        </div>

        <div class="relative">
          <button @click="showNotifications = !showNotifications" class="p-2.5 rounded-xl bg-white border border-blue-100 text-blue-600 hover:bg-blue-50 transition-all relative shadow-sm">
            <BellIcon class="h-5 w-5" />
            <span v-if="unreadNotifications.length > 0" class="absolute top-2 right-2.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
          </button>
          </div>

        <button v-if="activeTab === 'catalog'" @click="isCartOpen = true" class="relative p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center gap-2 pr-4 group">
           <ShoppingCartIcon class="h-5 w-5 group-hover:scale-110 transition-transform" />
           <span class="text-xs font-bold">Keranjang</span>
           <span v-if="cart.length > 0" class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
             {{ cart.length }}
           </span>
        </button>

      </div>
    </div>

    <div v-if="activeTab === 'catalog'">
      
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari barang (nama, kode)..." 
            class="w-full pl-11 pr-4 py-3 rounded-2xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm bg-white"
          />
        </div>
        <select v-model="selectedCategory" class="px-4 py-3 rounded-2xl border-slate-200 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 text-slate-600 bg-white">
          <option value="All">Semua Kategori</option>
          <option v-for="cat in store.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="item in filteredCatalog" :key="item.id" 
             class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden group flex flex-col relative"
        >
          <div class="absolute top-3 right-3 z-10">
             <span v-if="getRemainingQuota(item.id) <= 0" class="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg shadow-sm backdrop-blur-sm">Penuh / Habis</span>
             <span v-else class="px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-lg shadow-sm backdrop-blur-sm">Tersedia: {{ getRemainingQuota(item.id) }}</span>
          </div>

          <div class="h-44 bg-slate-50 relative overflow-hidden flex items-center justify-center p-6 group-hover:bg-blue-50/30 transition-colors">
             <img v-if="item.url_photo" :src="item.url_photo" class="h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500" />
             <CubeIcon v-else class="h-16 w-16 text-slate-300" />
          </div>

          <div class="p-5 flex-1 flex flex-col">
             <div class="flex-1">
               <p class="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">{{ getCategoryName(item.category_id) }}</p>
               <h3 class="text-sm font-bold text-slate-800 line-clamp-2 min-h-[40px] leading-snug">{{ item.name }}</h3>
               <p class="text-[10px] text-slate-400 mt-1 font-mono bg-slate-100 w-fit px-1.5 rounded">{{ item.code }}</p>
             </div>

             <div class="mt-4 flex items-center gap-2 text-[10px] font-medium text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span class="flex-1">Stok Unit: <b class="text-slate-700">{{ getUnitStock(item.id) }}</b></span>
                <span class="w-px h-3 bg-slate-300"></span>
                <span class="flex-1 text-right">Max: <b class="text-slate-700">{{ item.max_stock }}</b></span>
             </div>

             <button 
                @click="addToCart(item)"
                :disabled="getRemainingQuota(item.id) <= 0 || isInCart(item.id)"
                class="mt-4 w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                :class="[
                  isInCart(item.id) 
                    ? 'bg-emerald-100 text-emerald-600 cursor-not-allowed border border-emerald-200' 
                    : getRemainingQuota(item.id) <= 0 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-blue-600/30'
                ]"
             >
                <component :is="isInCart(item.id) ? CheckCircleIcon : PlusCircleIcon" class="h-4 w-4" />
                {{ isInCart(item.id) ? 'Sudah di Keranjang' : (getRemainingQuota(item.id) <= 0 ? 'Tidak Bisa Request' : 'Tambah ke Keranjang') }}
             </button>
          </div>
        </div>
      </div>
      
      <div v-if="filteredCatalog.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
         <div class="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <MagnifyingGlassIcon class="h-10 w-10 text-blue-300" />
         </div>
         <h3 class="text-lg font-bold text-slate-700">Barang tidak ditemukan</h3>
         <p class="text-sm text-slate-400 mt-1">Coba gunakan kata kunci lain.</p>
      </div>

    </div>

    <div v-if="activeTab === 'history'" class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up">
        <div class="p-6 border-b border-slate-100 bg-blue-50/30">
             <h3 class="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                 <ArchiveBoxIcon class="h-5 w-5 text-blue-600" /> Riwayat Pengajuan
             </h3>
        </div>
        <div class="overflow-x-auto">
           <table class="w-full text-left border-collapse">
              <thead>
                 <tr class="border-b border-slate-100 bg-slate-50/50">
                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase">#</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Info</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Status</th>
                 </tr>
              </thead>
              <tbody>
                 <tr v-for="(trx, index) in myTransactions" :key="trx.id" class="border-b border-slate-50 hover:bg-blue-50/50">
                    <td class="px-6 py-4 text-xs font-bold text-slate-400">{{ index + 1 }}</td>
                    <td class="px-6 py-4">
                        <span class="block text-sm font-bold text-blue-600">{{ trx.code }}</span>
                        <span class="text-xs text-slate-500">{{ trx.description }}</span>
                    </td>
                    <td class="px-6 py-4 text-center">
                        <span class="px-2 py-1 rounded-full text-[10px] font-bold" :class="trx.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'">{{ trx.status }}</span>
                    </td>
                 </tr>
                 <tr v-if="myTransactions.length === 0"><td colspan="3" class="px-6 py-10 text-center text-slate-400 text-sm">Belum ada riwayat.</td></tr>
              </tbody>
           </table>
        </div>
    </div>

    <Transition name="slide-over">
      <div v-if="isCartOpen" class="fixed inset-0 z-[100] flex justify-end">
         <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="isCartOpen = false"></div>
         
         <div class="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col transform transition-transform animate-slide-in-right">
            
            <div class="p-6 border-b border-blue-100 flex justify-between items-center bg-blue-600 text-white shadow-md z-10">
               <div>
                 <h3 class="text-lg font-bold flex items-center gap-2">
                    <ShoppingCartIcon class="h-6 w-6 text-blue-200"/> Keranjang Request
                 </h3>
                 <p class="text-blue-100 text-xs mt-0.5">{{ cart.length }} Item dipilih</p>
               </div>
               <button @click="isCartOpen = false" class="text-blue-200 hover:text-white transition-colors bg-white/10 p-1.5 rounded-lg"><XMarkIcon class="h-6 w-6"/></button>
            </div>

            <div class="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50">
               <div v-if="cart.length === 0" class="flex flex-col items-center justify-center h-full text-slate-400">
                  <div class="bg-white p-4 rounded-full shadow-sm mb-3">
                    <ShoppingCartIcon class="h-10 w-10 text-slate-300" />
                  </div>
                  <p class="text-sm font-medium">Keranjang masih kosong.</p>
               </div>

               <TransitionGroup name="list" tag="div" class="space-y-4">
                 <div v-for="(cartItem, idx) in cart" :key="cartItem.id" class="p-4 border border-slate-200 rounded-2xl bg-white shadow-sm relative group hover:border-blue-300 transition-colors">
                    
                    <button @click="removeFromCart(idx)" class="absolute -top-2 -right-2 bg-white border border-slate-200 text-slate-400 rounded-full p-1 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors shadow-sm z-10">
                        <XMarkIcon class="h-4 w-4" />
                    </button>
                    
                    <div class="flex gap-4">
                       <div class="h-14 w-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                          <img v-if="cartItem.url_photo" :src="cartItem.url_photo" class="h-full w-full object-cover" />
                          <CubeIcon v-else class="h-6 w-6 text-slate-300" />
                       </div>
                       <div class="flex-1 min-w-0">
                          <p class="text-xs font-bold text-slate-800 line-clamp-1">{{ cartItem.name }}</p>
                          <p class="text-[10px] text-slate-500 mb-2 font-mono">{{ cartItem.code }}</p>
                          
                          <div class="flex justify-between items-end">
                             <div class="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                              <button @click="updateCartQty(cartItem, -1, idx)" class="px-2.5 py-1 text-slate-500 hover:bg-blue-100 hover:text-blue-600 rounded-l-lg transition-colors font-bold">-</button>
                                  
                              <input 
                                type="number" 
                                v-model.number="cartItem.qty"
                                @change="validateInputQty(cartItem, idx)"
                                @keydown="preventAlpha"
                                class="w-12 text-center bg-transparent border-none text-xs font-bold focus:ring-0 p-0 text-slate-700 no-spinner" 
                              />
                                  
                              <button 
                                @click="updateCartQty(cartItem, 1, idx)" 
                                :disabled="getRemainingQuota(cartItem.id) - cartItem.qty <= 0"
                                class="px-2.5 py-1 text-slate-500 hover:bg-blue-100 hover:text-blue-600 rounded-r-lg transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                              >+</button>
                             </div>
                             <span class="text-[9px] font-bold text-slate-400">
                               Max: <span class="text-blue-600">{{ getRemainingQuota(cartItem.id) }}</span>
                             </span>
                          </div>
                       </div>
                    </div>
                    
                    <div class="mt-3 pt-3 border-t border-slate-100">
                       <input 
                          type="text" 
                          v-model="cartItem.notes" 
                          placeholder="Keterangan (opsional)..." 
                          class="w-full text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-700 placeholder:text-slate-400" 
                       />
                    </div>
                 </div>
               </TransitionGroup>
            </div>

            <div class="p-6 border-t border-slate-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
               <label class="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Alasan Permintaan</label>
               <textarea 
                  v-model="requestDescription" 
                  rows="2" 
                  class="w-full rounded-xl border-slate-200 text-xs focus:ring-blue-500 focus:border-blue-500 mb-4 p-3 bg-slate-50"
                  placeholder="Kebutuhan operasional..."
               ></textarea>
               
               <button 
                  @click="handleSubmit" 
                  :disabled="cart.length === 0 || !requestDescription"
                  class="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                  :class="(cart.length > 0 && requestDescription) ? 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5' : 'bg-slate-300 cursor-not-allowed'"
               >
                  <PaperAirplaneIcon class="h-4 w-4" /> Kirim Pengajuan
               </button>
            </div>
         </div>
      </div>
    </Transition>

    <Transition name="toast">
      <div v-if="toast.show" 
           class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border transition-all" 
           :class="toast.type === 'success' ? 'bg-blue-600 text-white border-blue-500' : 'bg-red-600 text-white border-red-500'"
      >
        <div class="h-8 w-8 rounded-full flex items-center justify-center shrink-0" :class="toast.type === 'success' ? 'bg-white/20 text-white' : 'bg-white/20 text-white'">
          <component :is="toast.type === 'success' ? CheckIcon : XMarkIcon" class="h-5 w-5" />
        </div>
        <div>
          <h4 class="text-sm font-bold">{{ toast.title }}</h4>
          <p class="text-xs opacity-90">{{ toast.message }}</p>
        </div>
        <button @click="toast.show = false" class="ml-4 opacity-50 hover:opacity-100 transition-opacity"><XMarkIcon class="h-5 w-5" /></button>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useInventoryStore } from '../../stores/inventoryStore'; 
import { 
  PlusCircleIcon, CheckCircleIcon, CubeIcon, ShoppingCartIcon, 
  MagnifyingGlassIcon, XMarkIcon, Squares2X2Icon, ClockIcon, 
  BellIcon, BuildingOfficeIcon, ArchiveBoxIcon, CheckIcon, PaperAirplaneIcon
} from '@heroicons/vue/24/outline';

const store = useInventoryStore();
const activeTab = ref('catalog'); 
const isCartOpen = ref(false);
const showNotifications = ref(false);
const cart = ref([]);
const requestDescription = ref('');
const searchQuery = ref('');
const selectedCategory = ref('All');
const toast = ref({ show: false, type: 'success', title: '', message: '' });

// --- DATA HELPERS ---
const storedUser = JSON.parse(localStorage.getItem('activeUser') || '{}');
const currentUserId = storedUser.id || 1; 

const currentUser = computed(() => {
  const user = store.users.find(u => u.id === currentUserId);
  const unit = store.units.find(u => u.id === user?.unit_id);
  return { ...user, unit_name: unit ? unit.alias : 'Unknown Unit' };
});

const getFirstName = (name) => name ? name.split(' ')[0] : 'User';
const getCategoryName = (id) => store.categories.find(c => c.id === id)?.name || 'Umum';

// --- STOCK LOGIC ---
const getUnitStock = (itemId) => {
    const stock = store.stocks.find(s => s.item_id === itemId && s.unit_id === currentUser.value.unit_id);
    return stock ? stock.stock : 0;
};

// Sisa kuota REAL (Max - Stok Sekarang)
const getRemainingQuota = (itemId) => {
    const item = store.atks.find(i => i.id === itemId);
    const currentStock = getUnitStock(itemId);
    if (!item) return 0;
    return Math.max(0, item.max_stock - currentStock);
};

// --- CATALOG & SEARCH ---
const filteredCatalog = computed(() => {
    let items = store.atks;
    if (selectedCategory.value !== 'All') {
        items = items.filter(i => i.category_id === selectedCategory.value);
    }
    if (searchQuery.value) {
        const lower = searchQuery.value.toLowerCase();
        items = items.filter(i => i.name.toLowerCase().includes(lower) || i.code.toLowerCase().includes(lower));
    }
    return items;
});

// Helper check keranjang
const isInCart = (itemId) => {
  return cart.value.some(c => c.id === itemId);
};

// --- CART LOGIC ---

const addToCart = (item) => {
    // 1. Validasi: Jika sudah ada di cart, stop (Sesuai request)
    if (isInCart(item.id)) {
        showToast('error', 'Info', 'Barang sudah ada di keranjang.');
        return;
    }

    // 2. Validasi Kuota Unit
    const quota = getRemainingQuota(item.id);
    if (quota <= 0) {
        showToast('error', 'Gudang Penuh', 'Stok di unit Anda sudah maksimal.');
        return;
    }

    // 3. Tambah ke cart (Unit default 1, user atur jumlah di dalam keranjang)
    cart.value.push({ 
        id: item.id, 
        name: item.name, 
        code: item.code, 
        qty: 1, 
        notes: '', 
        url_photo: item.url_photo 
    });
    
    showToast('success', 'Berhasil', 'Masuk keranjang. Atur jumlahnya nanti.');
};

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
};

// Handle tombol +/-
const updateCartQty = (cartItem, change, index) => {
    const quota = getRemainingQuota(cartItem.id);
    const newQty = cartItem.qty + change;

    // Jika user menekan (-) pada jumlah 1 -> Hapus item
    if (newQty < 1) {
        removeFromCart(index);
        return;
    }
    
    // Jika user menekan (+) melebihi kuota
    if (newQty > quota) {
        showToast('error', 'Batas Maksimum', `Sisa slot gudang hanya ${quota} pcs.`);
        cartItem.qty = quota; // set ke max
        return;
    }
    
    cartItem.qty = newQty;
};
const preventAlpha = (e) => {
  // Daftar tombol yang diperbolehkan (Navigasi & Edit)
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'];
  
  // Jika tombol yang ditekan ada di daftar allowed, biarkan
  if (allowedKeys.includes(e.key)) return;

  // Jika tombol yang ditekan BUKAN angka (0-9), batalkan (preventDefault)
  // Regex /^[0-9]$/ memastikan hanya angka yang bisa diketik
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
};
// Handle Input Manual (Ketik Angka)
const validateInputQty = (cartItem, index) => {
    const quota = getRemainingQuota(cartItem.id);
    
    // Jika kosong atau < 1, reset ke 1
    if (!cartItem.qty || cartItem.qty < 1) {
       cartItem.qty = 1;
    } 
    // Jika melebihi kuota, reset ke Max Quota
    else if (cartItem.qty > quota) {
       showToast('error', 'Batas Maksimum', `Disesuaikan ke batas max: ${quota} pcs.`);
       cartItem.qty = quota;
    }
};

const handleSubmit = () => {
    if (cart.value.length === 0) return;

    const payload = {
        user_id: currentUserId,
        unit_id: currentUser.value.unit_id,
        description: requestDescription.value,
        details: cart.value.map(c => ({ item_id: c.id, qty: c.qty, notes: c.notes }))
    };
    store.createTransaction(payload);
    
    cart.value = [];
    requestDescription.value = '';
    isCartOpen.value = false;
    showToast('success', 'Permintaan Terkirim', 'Silakan cek status di menu Riwayat.');
    activeTab.value = 'history'; 
};

// --- HISTORY & NOTIFICATIONS (Minimal Logic) ---
const myTransactions = computed(() => {
  return store.pendingTransactionList 
    .filter(t => t.user_id === currentUserId) 
    .map(t => ({ ...t, total_items: t.details.length }));
});
const pendingCount = computed(() => myTransactions.value.filter(t => t.status === 'Pending').length);
const unreadNotifications = computed(() => []); // Simplified for this view

const showToast = (type, title, message) => {
  toast.value = { show: true, type, title, message };
  setTimeout(() => toast.value.show = false, 3000);
};
</script>

<style scoped>

.no-spinner::-webkit-inner-spin-button, 
.no-spinner::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}

.no-spinner {
  -moz-appearance: textfield; /* Untuk Firefox */
}
/* Main Page Animation */
.animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* Slide Over Animation */
.animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }

/* Cart List Item Animation (TransitionGroup) */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Toast Animation */
.toast-enter-active, .toast-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>