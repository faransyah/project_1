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
  <div v-if="deleteModal.show" class="relative z-[1100]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" @click="closeDeleteModal"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg ring-1 ring-slate-900/5">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-red-100 text-red-600">
                <NoSymbolIcon class="h-6 w-6" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-bold leading-6 text-slate-900" id="modal-title">Hapus Barang ATK</h3>
                <div class="mt-2">
                  <p class="text-sm text-slate-500 leading-relaxed">
                    Yakin hapus <strong>{{ itemToDelete?.name }}</strong>? Semua data stok terkait barang ini juga akan hilang permanen.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-slate-50/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
            <button type="button" @click="confirmDeleteAction" class="inline-flex w-full justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:w-auto">Hapus</button>
            <button type="button" @click="closeDeleteModal" class="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all sm:mt-0 sm:w-auto">Batal</button>
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
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Master Data ATK</h1>
        <p class="mt-2 text-base text-slate-500">
          Katalog Barang & Spesifikasi (Referensi tabel: <code>eatk_item</code>).
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
      
      <!-- TOOLBAR -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <ClipboardDocumentListIcon class="h-5 w-5 text-slate-400" />
          Daftar Barang
        </h2>

        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <!-- SEARCH -->
          <div class="relative w-full sm:w-72">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon class="h-4 w-4 text-slate-400" />
            </div>
            <input 
              v-model="searchQuery"
              @input="handleSearch"
              type="text" 
              class="block w-full rounded-lg border-0 h-10 py-1.5 pl-10 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow" 
              placeholder="Cari nama, kode, atau kategori..."
            >
          </div>

          <!-- ADD BUTTON -->
          <button 
            @click="openModal(null)"
            class="inline-flex items-center justify-center rounded-lg bg-blue-600 h-10 px-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 active:scale-95 whitespace-nowrap"
          >
            <PlusIcon class="mr-1.5 h-4 w-4" />
            Tambah Barang
          </button>
        </div>
      </div>

      <!-- TABLE -->
      <div class="overflow-hidden rounded-xl border border-slate-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <!-- Fixed Widths untuk mencegah layout shift -->
                <th scope="col" class="w-[30%] py-3.5 pl-4 pr-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 sm:pl-6">Info Barang</th>
                <th scope="col" class="w-[20%] px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Kategori & UOM</th>
                <th scope="col" class="w-[15%] px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Ketentuan Stok</th>
                <th scope="col" class="w-[15%] px-3 py-3.5 text-right text-xs font-bold uppercase tracking-wide text-slate-500">Harga Acuan</th>
                <th scope="col" class="w-[10%] px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Status</th>
                <th scope="col" class="w-[10%] py-3.5 pl-3 pr-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500 sm:pr-6">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">
              
              <tr v-if="filteredItems.length === 0">
                <td colspan="6" class="py-12 text-center text-sm text-slate-500">
                  <div class="flex flex-col items-center justify-center">
                    <div class="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <ClipboardDocumentListIcon class="h-6 w-6 text-slate-300" />
                    </div>
                    <p v-if="searchQuery">Tidak ada barang yang cocok dengan "<strong>{{ searchQuery }}</strong>"</p>
                    <p v-else>Belum ada data Master ATK.</p>
                  </div>
                </td>
              </tr>

              <tr v-for="item in paginatedItems" :key="item.id" class="group hover:bg-slate-50/80 transition-colors">
                <!-- KOLOM 1: INFO BARANG -->
                <td class="py-4 pl-4 pr-3 sm:pl-6">
                  <div class="flex items-start gap-3">
                    <!-- FOTO BARANG -->
                    <div class="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center shadow-sm">
                       <!-- Menggunakan URL dari store, fallback ke icon jika kosong -->
                       <img v-if="item.url_photo" :src="item.url_photo" alt="" class="h-full w-full object-contain p-1" />
                       <PhotoIcon v-else class="h-5 w-5 text-slate-400" />
                    </div>
                    <div class="flex flex-col min-w-0">
                      <div class="text-sm font-bold text-slate-800 truncate">{{ item.name }}</div>
                      <div class="flex items-center gap-2 mt-1">
                         <span class="bg-slate-100 text-slate-500 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200 tracking-wide">
                           {{ item.code }}
                         </span>
                         <span class="text-xs text-slate-400 truncate max-w-[150px]" :title="item.description">{{ item.description }}</span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- KOLOM 2: KATEGORI -->
                <td class="px-3 py-4">
                   <div class="flex flex-col gap-1">
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 w-fit">
                        <TagIcon class="h-3 w-3 mr-1" />
                        {{ getCategoryName(item.category_id) }}
                      </span>
                      <span class="text-xs text-slate-500 font-medium pl-0.5">Satuan: <span class="text-slate-700">{{ item.uom }}</span></span>
                   </div>
                </td>

                <!-- KOLOM 3: STOK -->
                <td class="px-3 py-4">
                   <div class="flex flex-col gap-1 text-xs">
                      <div class="flex items-center gap-2 border-b border-slate-100 pb-0.5 w-fit">
                         <span class="text-slate-500 w-8">Min:</span>
                         <span class="font-mono font-bold text-slate-700">{{ item.min_stock }}</span>
                      </div>
                      <div class="flex items-center gap-2 pt-0.5 w-fit">
                         <span class="text-slate-500 w-8">Max:</span>
                         <span class="font-mono font-bold text-slate-700">{{ item.max_stock }}</span>
                      </div>
                   </div>
                </td>

                <!-- KOLOM 4: HARGA -->
                <td class="px-3 py-4 text-right text-sm font-medium text-slate-700 tabular-nums">
                   Rp {{ (item.price || 0).toLocaleString('id-ID') }}
                </td>

                <!-- KOLOM 5: STATUS -->
                <td class="px-3 py-4 text-center">
                   <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                    :class="item.status === 'Active' 
                      ? 'bg-green-50 text-green-700 ring-green-600/20' 
                      : 'bg-slate-100 text-slate-500 ring-slate-500/20'"
                  >
                    <span class="h-1.5 w-1.5 rounded-full mr-1.5" :class="item.status === 'Active' ? 'bg-green-600' : 'bg-slate-400'"></span>
                    {{ item.status === 'Active' ? 'Aktif' : 'Non-Aktif' }}
                  </span>
                </td>

                <!-- KOLOM 6: AKSI -->
                <td class="py-4 pl-3 pr-4 text-center text-xs font-medium sm:pr-6">
                  <div class="flex items-center justify-center gap-2">
                    <button @click="openModal(item)" class="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-all font-semibold shadow-sm border border-blue-200">Edit</button>
                    <button @click="handleDelete(item)" class="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-all font-semibold shadow-sm border border-red-200">Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAGINATION FOOTER -->
        <div v-if="filteredItems.length > 0" class="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
          <div class="flex flex-1 justify-between sm:hidden">
            <button @click="currentPage > 1 ? currentPage-- : null" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Previous</button>
            <button @click="currentPage < totalPages ? currentPage++ : null" :disabled="currentPage === totalPages" class="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-slate-700">
                Menampilkan <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> sampai <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredItems.length) }}</span> dari <span class="font-medium">{{ filteredItems.length }}</span> hasil
              </p>
            </div>
            <div>
              <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button @click="currentPage > 1 ? currentPage-- : null" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50">
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
  
  <!-- ATK FORM MODAL -->
  <!-- Terhubung ke Store -->
  <ATKFormModal 
    :show="showModal" 
    :item-to-edit="selectedItem" 
    :category-options="categories" 
    @close="closeModal" 
    @save="handleSave" 
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, shallowRef } from 'vue';
import { 
  ClipboardDocumentListIcon, XMarkIcon, CheckCircleIcon, XCircleIcon, 
  NoSymbolIcon, MagnifyingGlassIcon, PlusIcon, CalendarDaysIcon,
  ChevronLeftIcon, ChevronRightIcon, PhotoIcon, TagIcon
} from '@heroicons/vue/24/outline';

import { useInventoryStore } from '../../stores/inventoryStore';
import ATKFormModal from '../../components/admin/ATKFormModal.vue';

const store = useInventoryStore();

// --- TOAST & CONFIRM ---
const toast = ref({ show: false, message: '', type: 'success' });
let toastTimeout = null;
const triggerToast = (msg, type) => { 
  if (toastTimeout) clearTimeout(toastTimeout);
  toast.value = {show:true, message:msg, type}; 
  toastTimeout = setTimeout(()=>toast.value.show=false, 3000); 
};

const deleteModal = ref({ show: false });
const itemToDelete = ref(null);

const confirmDeleteAction = () => {
  if(itemToDelete.value) {
    // Panggil Action Delete di Store
    const idx = store.atks.findIndex(i => i.id === itemToDelete.value.id);
    if (idx !== -1) {
      store.atks.splice(idx, 1); // Hapus data dari store
      triggerToast('Barang berhasil dihapus.', 'success');
    } else {
      triggerToast('Data tidak ditemukan.', 'error');
    }
    deleteModal.value.show = false;
    
    // Reset pagination jika halaman kosong
    if(paginatedItems.value.length === 0 && currentPage.value > 1) currentPage.value--;
  }
};

const closeDeleteModal = () => { deleteModal.value.show = false; itemToDelete.value = null; };
const handleDelete = (item) => { itemToDelete.value = item; deleteModal.value.show = true; };

// --- DATA FROM STORE ---
const items = computed(() => store.atks);
const categories = computed(() => store.categories);
const getCategoryName = (id) => categories.value.find(c => c.id === id)?.name || '-';

// --- FILTER ---
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

const filteredItems = computed(() => {
  return items.value.filter(item => {
    const search = searchQuery.value.toLowerCase();
    const catName = getCategoryName(item.category_id).toLowerCase();
    // Pencarian mencakup Nama, Kode, dan Kategori
    return (
       item.name.toLowerCase().includes(search) || 
       item.code.toLowerCase().includes(search) ||
       catName.includes(search)
    );
  }).sort((a,b)=>a.name.localeCompare(b.name));
});

const paginatedItems = computed(() => filteredItems.value.slice((currentPage.value-1)*itemsPerPage, currentPage.value*itemsPerPage));
const totalPages = computed(() => Math.ceil(filteredItems.value.length/itemsPerPage));
const handleSearch = () => currentPage.value = 1;

// --- MODAL CRUD ---
const showModal = ref(false);
const selectedItem = ref(null);
const openModal = (item) => { selectedItem.value = item ? JSON.parse(JSON.stringify(item)) : null; showModal.value = true; };
const closeModal = () => { showModal.value = false; selectedItem.value = null; };

const handleSave = (item) => {
  const today = new Date().toLocaleDateString('en-GB');
  try {
    if(item.id) {
      // UPDATE Store
      const idx = store.atks.findIndex(a => a.id === item.id);
      if (idx !== -1) {
        store.atks[idx] = { ...store.atks[idx], ...item, updated_at: today };
        triggerToast('Data ATK berhasil diperbarui.', 'success');
      }
    } else {
      // ADD Store
      const newId = store.atks.length > 0 ? Math.max(...store.atks.map(a => a.id)) + 1 : 1;
      store.atks.push({ ...item, id: newId, created_at: today, status: 'Active' });
      triggerToast('Barang baru berhasil ditambahkan.', 'success');
    }
    closeModal();
  } catch (e) {
    triggerToast('Gagal menyimpan data.', 'error');
  }
};

// Time
const currentTime = ref('');
onMounted(() => setInterval(() => currentTime.value = new Date().toLocaleTimeString('id-ID'), 1000));
watch(() => deleteModal.value.show, (val) => document.body.style.overflow = val ? 'hidden' : '');
</script>

<style scoped>
.toast-slide-top-enter-active{ transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-slide-top-leave-active { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-slide-top-enter-from, .toast-slide-top-leave-to { opacity: 0; transform: translateY(-20px) translateX(-50%); }
</style>