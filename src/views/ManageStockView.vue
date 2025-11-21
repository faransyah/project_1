<template>
  <div class="space-y-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Manage Stock</h1>
        <p class="mt-2 text-base text-slate-500">
          Lihat, filter, dan sesuaikan jumlah stok barang.
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
      
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 whitespace-nowrap">
          <ArchiveBoxIcon class="h-5 w-5 text-slate-400" />
          Daftar Stok
        </h2>

        <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
          <div class="relative flex-1 sm:w-64 w-full">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon class="h-3.5 w-3.5 text-slate-400" />
            </div>
            <input 
              v-model="searchQuery"
              type="text" 
              class="block w-full rounded-lg border-0 h-9 py-0 pl-10 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-xs sm:leading-5 shadow-sm" 
              placeholder="Cari nama barang..."
            />
          </div>
          <div class="relative flex-1 sm:w-48 w-full">
            <select 
              v-model="selectedUnit"
              class="block w-full rounded-lg border-0 h-9 py-0 pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-xs sm:leading-5 shadow-sm cursor-pointer"
            >
              <option value="Semua Unit">Semua Unit</option>
              <option v-for="unit in uniqueUnits" :key="unit">{{ unit }}</option>
            </select>
          </div>
          <button 
            @click="openAdjustModal(null)"
            class="inline-flex items-center justify-center rounded-lg bg-blue-600 h-9 px-4 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 active:scale-95 whitespace-nowrap w-full sm:w-auto"
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
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 sm:pl-6">Nama Barang</th>
                <th scope="col" class="hidden px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 lg:table-cell">Unit</th>
                <th scope="col" class="hidden px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 md:table-cell">Kategori</th>
                <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Stok</th>
                <th scope="col" class="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Status</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">
              
              <tr v-if="filteredStock.length === 0">
                <td colspan="6" class="py-12 text-center text-sm text-slate-500">
                  <div class="flex flex-col items-center justify-center">
                    <div class="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <ArchiveBoxIcon class="h-6 w-6 text-slate-300" />
                    </div>
                    <p>Tidak ada barang yang cocok.</p>
                  </div>
                </td>
              </tr>

              <tr v-for="item in filteredStock" :key="item.id" class="group hover:bg-slate-50/80 transition-colors">
                
                <td class="py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div class="font-semibold text-slate-800">{{ item.name }}</div>
                  <div class="text-xs text-slate-500 mt-0.5 lg:hidden">
                    {{ item.unit }} <span class="mx-1">•</span> {{ item.kategori }}
                  </div>
                </td>

                <td class="hidden px-3 py-4 text-sm text-slate-500 lg:table-cell">{{ item.unit }}</td>
                <td class="hidden px-3 py-4 text-sm text-slate-500 md:table-cell">{{ item.kategori }}</td>

                <td class="px-3 py-4 text-sm font-bold text-slate-700">
                  {{ item.stock }} <span class="text-xs font-normal text-slate-400">Pcs</span>
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
                      @click="openAdjustModal(item)" 
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
      </div>
    </div>

  </div>

  <div v-if="isModalOpen" class="relative z-[60]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center">
        <div class="relative transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg ring-1 ring-slate-900/5">
          
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <ArchiveBoxIcon class="h-6 w-6" />
              </div>
              <h3 class="text-lg font-bold text-slate-900" id="modal-title">
                {{ isEditing ? 'Penyesuaian Stok' : 'Tambah Entri Stok' }}
              </h3>
            </div>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600 transition-colors">
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <div class="mb-6">
            <div v-if="isEditing" class="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p class="text-xs text-slate-500 uppercase font-bold tracking-wide mb-1">Item Terpilih</p>
              <p class="text-sm font-bold text-slate-800">{{ selectedItem.name }}</p>
              <p class="text-xs text-slate-500 mt-0.5">{{ selectedItem.unit }} • Saat ini: <span class="font-bold text-slate-700">{{ selectedItem.stock }} Pcs</span></p>
            </div>
            <p v-else class="text-sm text-slate-500">Buat entri stok baru untuk sebuah item di unit tertentu.</p>
          </div>
          
          <form @submit.prevent="handleStockAdjustment" class="space-y-4">
            
            <template v-if="!isEditing">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Barang ATK</label>
                <select v-model="adjustmentForm.atkId" class="block w-full rounded-lg border-slate-200 text-sm focus:border-blue-500 focus:ring-blue-500" required>
                  <option value="" disabled>Pilih Barang</option>
                  <option v-for="atk in allATK" :key="atk.id" :value="atk.id">{{ atk.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Unit</label>
                <select v-model="adjustmentForm.unitId" class="block w-full rounded-lg border-slate-200 text-sm focus:border-blue-500 focus:ring-blue-500" required>
                  <option value="" disabled>Pilih Unit</option>
                  <option v-for="unit in allUnits" :key="unit.id" :value="unit.id">{{ unit.name }}</option>
                </select>
              </div>
            </template>

            <div v-if="isEditing">
              <label class="block text-xs font-bold text-slate-700 mb-1.5">Jenis Penyesuaian</label>
              <select v-model="adjustmentForm.type" class="block w-full rounded-lg border-slate-200 text-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="tambah">Tambah Stok (Masuk)</option>
                <option value="kurangi">Kurangi Stok (Keluar)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                {{ isEditing ? 'Jumlah Penyesuaian' : 'Stok Awal' }}
              </label>
              <input 
                v-model.number="adjustmentForm.qty"
                type="number" 
                class="block w-full rounded-lg border-slate-200 text-sm focus:border-blue-500 focus:ring-blue-500" 
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div class="flex gap-3 mt-6 pt-2">
              <button 
                type="button" 
                @click="closeModal" 
                class="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all"
              >
                Batal
              </button>
              <button 
                type="submit" 
                class="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
              >
                Simpan
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { MagnifyingGlassIcon, PlusIcon, ArchiveBoxIcon, XMarkIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline';

// --- TIME LOGIC ---
const currentTime = ref('');
let timeInterval = null;
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }).replace(/\./g, ':');
};
onMounted(() => { updateTime(); timeInterval = setInterval(updateTime, 1000); });
onUnmounted(() => { if (timeInterval) clearInterval(timeInterval); });

// --- DATA SIMULASI ---
const allStockItems = ref([
  { id: 1, name: 'Kertas A4 Sinar Dunia 80gr', sku: 'ATK-KRT-001', unit: 'UID Jatim', kategori: 'Kertas', stock: 5, threshold: 10, atkId: 2, unitId: 1 },
  { id: 2, name: 'Tinta Printer Epson 003 Black', sku: 'ATK-TNT-003', unit: 'UID Jatim', kategori: 'Tinta', stock: 8, threshold: 5, atkId: 3, unitId: 1 },
  { id: 3, name: 'Spidol Boardmarker Hitam', sku: 'ATK-ATS-001', unit: 'UID Pusat', kategori: 'Alat Tulis', stock: 20, threshold: 15, atkId: 4, unitId: 3 },
  { id: 4, name: 'Baterai ABC AA (Isi 4)', sku: 'ATK-LAI-002', unit: 'UID Jabar', kategori: 'Lain-lain', stock: 12, threshold: 10, atkId: 5, unitId: 2 },
  { id: 5, name: 'Map Snelhecter Biru', sku: 'ATK-KRT-005', unit: 'UID Pusat', kategori: 'Kertas', stock: 15, threshold: 20, atkId: 6, unitId: 3 },
  { id: 6, name: 'Kertas A4 Sinar Dunia 80gr', sku: 'ATK-KRT-001', unit: 'UID Pusat', kategori: 'Kertas', stock: 150, threshold: 20, atkId: 2, unitId: 3 },
  { id: 7, name: 'Buku Tulis Sinar Dunia (Isi 50)', sku: 'ATK-ATS-005', unit: 'UID Jatim', kategori: 'Alat Tulis', stock: 75, threshold: 25, atkId: 7, unitId: 1 },
  { id: 8, name: 'Toner Printer HP 85A', sku: 'ATK-TNT-001', unit: 'UID Jabar', kategori: 'Tinta', stock: 30, threshold: 10, atkId: 8, unitId: 2 },
  { id: 9, name: 'Stabilo Boss Kuning', sku: 'ATK-ATS-009', unit: 'UID Pusat', kategori: 'Alat Tulis', stock: 40, threshold: 15, atkId: 9, unitId: 3 },
  { id: 10, name: 'Kertas A4 Sinar Dunia 80gr', sku: 'ATK-KRT-001', unit: 'UID Jabar', kategori: 'Kertas', stock: 80, threshold: 20, atkId: 2, unitId: 2 },
]);

const allATK = ref([
  { id: 1, name: 'Pensil 2B Faber-Castell' },
  { id: 2, name: 'Kertas A4 Sinar Dunia 80gr' },
  { id: 3, name: 'Tinta Printer Epson 003 Black' },
  { id: 4, name: 'Spidol Boardmarker Hitam' },
  { id: 5, name: 'Baterai ABC AA (Isi 4)' },
  { id: 6, name: 'Map Snelhecter Biru' },
  { id: 7, name: 'Buku Tulis Sinar Dunia (Isi 50)' },
  { id: 8, name: 'Toner Printer HP 85A' },
  { id: 9, name: 'Stabilo Boss Kuning' },
]);

const allUnits = ref([
  { id: 1, name: 'UID Jatim' },
  { id: 2, name: 'UID Jabar' },
  { id: 3, name: 'UID Pusat' },
]);

// --- FILTER ---
const searchQuery = ref('');
const selectedUnit = ref('Semua Unit');

const uniqueUnits = computed(() => {
  const units = allStockItems.value.map(item => item.unit);
  return [...new Set(units)];
});

const filteredStock = computed(() => {
  return allStockItems.value.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const unitMatch = (selectedUnit.value === 'Semua Unit') || (item.unit === selectedUnit.value);
    return nameMatch && unitMatch;
  });
});

// --- MODAL LOGIC ---
const isModalOpen = ref(false);
const selectedItem = ref(null);
const isEditing = computed(() => !!selectedItem.value);

const adjustmentForm = ref({ type: 'tambah', qty: 0, atkId: '', unitId: '' });

const openAdjustModal = (item) => {
  if (item) {
    selectedItem.value = item;
    adjustmentForm.value = { type: 'tambah', qty: 0, atkId: item.atkId, unitId: item.unitId };
  } else {
    selectedItem.value = null;
    adjustmentForm.value = { type: 'tambah', qty: 0, atkId: '', unitId: '' };
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedItem.value = null;
};

const handleStockAdjustment = () => {
  if (adjustmentForm.value.qty <= 0) {
    alert("Jumlah harus lebih besar dari 0.");
    return;
  }

  if (isEditing.value) {
    const itemIndex = allStockItems.value.findIndex(item => item.id === selectedItem.value.id);
    if (itemIndex === -1) return;

    if (adjustmentForm.value.type === 'tambah') {
      allStockItems.value[itemIndex].stock += adjustmentForm.value.qty;
    } else {
      if (allStockItems.value[itemIndex].stock < adjustmentForm.value.qty) {
        alert(`Stok tidak cukup. Saat ini: ${allStockItems.value[itemIndex].stock}`);
        return;
      }
      allStockItems.value[itemIndex].stock -= adjustmentForm.value.qty;
    }
  } else {
    if (!adjustmentForm.value.atkId || !adjustmentForm.value.unitId) {
      alert("Pilih Barang dan Unit.");
      return;
    }
    const duplicate = allStockItems.value.find(item => item.atkId === adjustmentForm.value.atkId && item.unitId === adjustmentForm.value.unitId);
    if (duplicate) {
      alert("Stok barang di unit ini sudah ada.");
      return;
    }

    const atk = allATK.value.find(a => a.id === adjustmentForm.value.atkId);
    const unit = allUnits.value.find(u => u.id === adjustmentForm.value.unitId);
    
    const newId = allStockItems.value.length > 0 ? Math.max(...allStockItems.value.map(i => i.id)) + 1 : 1;
    allStockItems.value.push({
      id: newId,
      name: atk.name,
      sku: `ATK-NEW-${newId}`,
      unit: unit.name,
      kategori: 'N/A',
      stock: adjustmentForm.value.qty,
      threshold: 10,
      atkId: adjustmentForm.value.atkId,
      unitId: adjustmentForm.value.unitId,
    });
  }
  closeModal();
};

const handleDelete = (itemToDelete) => {
  if (confirm(`Hapus stok "${itemToDelete.name}" di "${itemToDelete.unit}"?`)) {
    allStockItems.value = allStockItems.value.filter(item => item.id !== itemToDelete.id);
  }
};
</script>