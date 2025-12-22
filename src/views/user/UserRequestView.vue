<template>
  <div class="space-y-8 animate-fade-in-up">
    
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-500 p-8 shadow-2xl">
      <div class="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-bold uppercase tracking-wider border border-white/10 shadow-sm">
              {{ currentUser?.position_name || 'Staff' }}
            </span>
            <span class="w-1.5 h-1.5 rounded-full bg-white/50"></span>
            <span class="text-sm font-medium text-blue-100">{{ currentUser?.unit_name || 'Unit Kerja' }}</span>
          </div>
          <h1 class="text-3xl font-black tracking-tight">Halo, {{ getFirstName(currentUser?.full_name) }}! 👋</h1>
          <p class="text-blue-100/90 mt-2 max-w-xl text-sm leading-relaxed">
            Kelola permintaan Alat Tulis Kantor (ATK) untuk unit Anda dengan mudah.
          </p>
        </div>
        
        <button @click="isModalOpen = true" class="group relative flex items-center gap-3 bg-white text-blue-700 px-6 py-3.5 rounded-2xl font-bold shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-900/30 hover:scale-105 active:scale-95 transition-all duration-300">
          <PlusCircleIcon class="h-6 w-6 text-blue-600 relative z-10 transition-transform group-hover:rotate-90 duration-500" />
          <span class="relative z-10">Buat Permintaan Baru</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ClipboardDocumentListIcon class="h-6 w-6" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengajuan</p>
            <p class="text-2xl font-black text-slate-800 mt-0.5">{{ totalStats }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ClockIcon class="h-6 w-6" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Menunggu</p>
            <p class="text-2xl font-black text-slate-800 mt-0.5">{{ pendingCount }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckBadgeIcon class="h-6 w-6" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Disetujui</p>
            <p class="text-2xl font-black text-slate-800 mt-0.5">{{ approvedCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 gap-4">
        <div>
          <h3 class="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <ArchiveBoxIcon class="h-5 w-5 text-slate-400" />
            Riwayat Permintaan
          </h3>
          <p class="text-xs text-slate-500 font-medium mt-1">Pantau status persetujuan dari Admin Logistik.</p>
        </div>
        
        <div class="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            @click="currentFilter = 'All'"
            class="px-4 py-2 rounded-lg text-xs font-bold transition-all"
            :class="currentFilter === 'All' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'"
          >
            Semua
          </button>
          <button 
            @click="currentFilter = 'Pending'"
            class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            :class="currentFilter === 'Pending' ? 'bg-amber-100 text-amber-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'"
          >
            <span class="w-2 h-2 rounded-full bg-amber-500"></span> Pending
          </button>
          <button 
            @click="currentFilter = 'Approved'"
            class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            :class="currentFilter === 'Approved' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Approved
          </button>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/30">
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-10">#</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Kode & Tanggal</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Keterangan</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Item</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-if="filteredTransactions.length === 0">
              <td colspan="6" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div class="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <DocumentMagnifyingGlassIcon class="h-8 w-8 text-slate-300" />
                  </div>
                  <p class="text-sm font-bold text-slate-600">Tidak ada data ditemukan.</p>
                  <p class="text-xs text-slate-400 mt-1">Coba ubah filter atau buat permintaan baru.</p>
                </div>
              </td>
            </tr>

            <template v-for="(trx, index) in filteredTransactions" :key="trx.id">
              <tr 
                class="hover:bg-slate-50 transition-colors cursor-pointer group"
                @click="toggleExpand(trx.id)"
              >
                <td class="px-6 py-4 text-xs font-bold text-slate-400">{{ index + 1 }}</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 w-fit">
                      {{ trx.code }}
                    </span>
                    <span class="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <CalendarIcon class="h-3 w-3" /> {{ formatDate(trx.trx_date) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm font-medium text-slate-700 max-w-xs truncate" :title="trx.description">
                    {{ trx.description }}
                  </p>
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-600 border border-slate-200">
                    {{ trx.total_items }} Barang
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm"
                    :class="{
                      'bg-amber-50 text-amber-700 border-amber-200': trx.status === 'Pending',
                      'bg-emerald-50 text-emerald-700 border-emerald-200': trx.status === 'Approved',
                      'bg-red-50 text-red-700 border-red-200': trx.status === 'Rejected',
                      'bg-blue-50 text-blue-700 border-blue-200': trx.status === 'Completed'
                    }"
                  >
                    <span class="h-1.5 w-1.5 rounded-full" :class="{
                      'bg-amber-500': trx.status === 'Pending',
                      'bg-emerald-500': trx.status === 'Approved',
                      'bg-red-500': trx.status === 'Rejected',
                      'bg-blue-500': trx.status === 'Completed'
                    }"></span>
                    {{ trx.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    
                    <button 
                      v-if="trx.status === 'Pending'"
                      @click.stop="handleCancel(trx.id)"
                      class="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                    >
                      Batalkan
                    </button>

                    <button class="text-slate-400 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-indigo-50">
                      <ChevronDownIcon 
                        class="h-5 w-5 transition-transform duration-300"
                        :class="expandedRows.includes(trx.id) ? 'rotate-180' : ''" 
                      />
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="expandedRows.includes(trx.id)" class="bg-slate-50/50 border-b border-slate-200">
                <td colspan="6" class="px-6 py-4">
                  <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm ml-10 relative overflow-hidden">
                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                    
                    <h4 class="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                      <ShoppingBagIcon class="h-4 w-4" /> Detail Barang
                    </h4>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div 
                        v-for="detail in getTransactionDetails(trx.id)" 
                        :key="detail.id"
                        class="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50"
                      >
                        <div class="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-1 overflow-hidden shrink-0">
                           <img v-if="getItemPhoto(detail.item_id)" :src="getItemPhoto(detail.item_id)" class="h-full w-full object-contain" />
                           <span v-else class="text-[8px] text-slate-400">No IMG</span>
                        </div>
                        
                        <div class="flex-1 min-w-0">
                          <p class="text-xs font-bold text-slate-700 line-clamp-1">{{ getItemName(detail.item_id) }}</p>
                          <p class="text-[10px] text-slate-400 mt-0.5" v-if="detail.notes">Catatan: <span class="italic text-slate-500">{{ detail.notes }}</span></p>
                          <p class="text-[10px] text-slate-400 mt-0.5" v-else>Tidak ada catatan</p>
                        </div>
                        
                        <span class="text-xs font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
                          x{{ detail.qty }}
                        </span>
                      </div>
                    </div>

                    <div v-if="trx.status === 'Rejected'" class="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex gap-3 text-red-700">
                      <ExclamationCircleIcon class="h-5 w-5 shrink-0" />
                      <div>
                        <p class="text-xs font-bold uppercase">Alasan Penolakan:</p>
                        <p class="text-sm">Stok barang di gudang utama sedang kosong. Silakan ajukan kembali bulan depan.</p>
                      </div>
                    </div>

                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <RequestFormModal 
      :show="isModalOpen" 
      :items="items"
      @close="isModalOpen = false"
      @submit="handleRequestSubmit"
    />

    <Transition name="toast">
      <div v-if="toast.show" class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border transition-all"
        :class="toast.type === 'success' ? 'bg-slate-900 text-white border-slate-700' : 'bg-red-600 text-white border-red-500'"
      >
        <div class="h-8 w-8 rounded-full flex items-center justify-center shrink-0" 
          :class="toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-white text-red-600'"
        >
          <component :is="toast.type === 'success' ? CheckIcon : XMarkIcon" class="h-5 w-5" />
        </div>
        <div>
          <h4 class="text-sm font-bold">{{ toast.title }}</h4>
          <p class="text-xs opacity-90">{{ toast.message }}</p>
        </div>
        <button @click="toast.show = false" class="ml-4 opacity-50 hover:opacity-100 transition-opacity">
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useInventoryStore } from '../../stores/inventoryStore'; 
import RequestFormModal from '../../components/user/RequestFormModal.vue';
import { 
  PlusCircleIcon, ClipboardDocumentListIcon, ClockIcon, CheckBadgeIcon,
  ArchiveBoxIcon, CalendarIcon, ChevronDownIcon, ShoppingBagIcon,
  DocumentMagnifyingGlassIcon, CheckIcon, XMarkIcon, ExclamationCircleIcon
} from '@heroicons/vue/24/outline';

const store = useInventoryStore();
const isModalOpen = ref(false);
const expandedRows = ref([]); 
const currentFilter = ref('All'); // State Filter

const toast = ref({ show: false, type: 'success', title: '', message: '' });

// Current User Logic
const storedUser = JSON.parse(localStorage.getItem('activeUser') || '{}');
const currentUserId = storedUser.id || 2; 

const currentUser = computed(() => {
  const user = store.users.find(u => u.id === currentUserId);
  const unit = store.units.find(u => u.id === user?.unit_id);
  return { 
    ...user, 
    unit_name: unit?.alias + ' - ' + unit?.name,
    position_name: user?.position_name 
  };
});

const items = computed(() => store.atks);

// Helper Data
const getFirstName = (name) => name ? name.split(' ')[0] : 'User';
const getItemName = (id) => store.atks.find(i => i.id === id)?.name || 'Unknown';
const getItemPhoto = (id) => store.atks.find(i => i.id === id)?.url_photo;

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

// --- CORE DATA LOGIC ---
const allMyTransactions = computed(() => {
  return store.transactions
    .filter(t => t.user_id === currentUserId)
    .map(t => {
      const details = store.transactionDetails.filter(d => d.transaction_id === t.id);
      return { ...t, total_items: details.length };
    })
    .sort((a, b) => new Date(b.trx_date) - new Date(a.trx_date));
});

// Filtered Data
const filteredTransactions = computed(() => {
  if (currentFilter.value === 'All') return allMyTransactions.value;
  return allMyTransactions.value.filter(t => t.status === currentFilter.value);
});

// Stats Counters
const totalStats = computed(() => allMyTransactions.value.length);
const pendingCount = computed(() => allMyTransactions.value.filter(t => t.status === 'Pending').length);
const approvedCount = computed(() => allMyTransactions.value.filter(t => ['Approved', 'Completed'].includes(t.status)).length);

const getTransactionDetails = (trxId) => {
  return store.transactionDetails.filter(d => d.transaction_id === trxId);
};

// --- ACTIONS ---
const toggleExpand = (id) => {
  if (expandedRows.value.includes(id)) {
    expandedRows.value = expandedRows.value.filter(rowId => rowId !== id);
  } else {
    expandedRows.value.push(id);
  }
};

const handleCancel = (trxId) => {
  if (confirm('Yakin ingin membatalkan permintaan ini? Data akan dihapus.')) {
    store.cancelTransaction(trxId);
    showToast('success', 'Dibatalkan', 'Permintaan berhasil dihapus.');
  }
};

const handleRequestSubmit = (payload) => {
  store.createTransaction({
    user_id: currentUserId,
    unit_id: currentUser.value.unit_id,
    description: payload.description,
    details: payload.details
  });
  
  isModalOpen.value = false;
  showToast('success', 'Terkirim!', 'Permintaan Anda sedang diproses oleh Admin.');
};

const showToast = (type, title, message) => {
  toast.value = { show: true, type, title, message };
  setTimeout(() => toast.value.show = false, 4000);
};
</script>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* Toast Animation */
.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }
</style>