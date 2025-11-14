<!-- src/views/ManageStockView.vue -->
<template>
  <!-- Kontainer utama dengan jarak vertikal antar modul -->
  <div class="space-y-8">
    
    <!-- 1. Header Utama & Tombol Aksi -->
    <div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div class="min-w-0 flex-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Manage Stock</h1>
        <p class="mt-2 text-lg text-gray-600">
          Lihat, filter, dan sesuaikan jumlah stok untuk semua item di semua unit.
        </p>
      </div>
      <div class="flex-shrink-0">
        <!-- Tombol ini membuka modal untuk 'Item Baru' -->
        <button 
          type="button" 
          @click="openAdjustModal(null)"
          class="flex items-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
          Tambah Entri Stok
        </button>
      </div>
    </div>

    <!-- 2. Modul Filter dan Pencarian -->
    <div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
      <h3 class="text-lg font-semibold leading-6 text-gray-900">Filter Stok</h3>
      <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
        <!-- Input Pencarian -->
        <div class="sm:col-span-3">
          <label for="search_item" class="block text-sm font-medium leading-6 text-gray-900">Cari Nama Barang</label>
          <div class="relative mt-2">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input 
              v-model="searchQuery"
              type="text" 
              name="search_item" 
              id="search_item"
              class="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" 
              placeholder="Ketik nama ATK..."
            />
          </div>
        </div>
        <!-- Filter berdasarkan Unit -->
        <div class="sm:col-span-3">
          <label for="filter_unit" class="block text-sm font-medium leading-6 text-gray-900">Filter Unit</label>
          <div class="mt-2">
            <select 
              v-model="selectedUnit"
              id="filter_unit" 
              name="filter_unit" 
              class="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
            >
              <option value="Semua Unit">Semua Unit</option>
              <option v-for="unit in uniqueUnits" :key="unit">{{ unit }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Tabel Daftar Stok Lengkap -->
    <div class="rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5">
      <!-- Wrapper untuk border radius di tabel -->
      <div class="overflow-hidden md:rounded-2xl">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nama Barang</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Unit</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">Kategori</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stok Saat Ini</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            
            <!-- Loop data stok yang sudah difilter -->
            <tr v-for="item in filteredStock" :key="item.id" class="hover:bg-gray-50">
              <td class="py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div class="font-medium text-gray-900">{{ item.name }}</div>
                <div class="text-gray-500 lg:hidden">{{ item.unit }}</div> <!-- Tampilkan unit di mobile -->
                <div class="text-gray-500 md:hidden">{{ item.kategori }}</div> <!-- Tampilkan kategori di mobile -->
              </td>
              <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ item.unit }}</td>
              <td class="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{{ item.kategori }}</td>
              <td class="px-3 py-4 text-sm font-semibold text-gray-900">{{ item.stock }} Pcs</td>
              <td class="px-3 py-4 text-sm text-gray-500">
                <span 
                  v-if="item.stock > item.threshold"
                  class="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-800"
                >
                  Stok Aman
                </span>
                <span 
                  v-else
                  class="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-xs font-medium text-red-800"
                >
                  Stok Rendah
                </span>
              </td>
              <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3">
                <button 
                  @click="openAdjustModal(item)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Edit<span class="sr-only">, {{ item.name }}</span>
                </button>
                <!-- Tombol Hapus (DELETE) -->
                <button 
                  @click="handleDelete(item)"
                  class="text-red-600 hover:text-red-800"
                >
                  Hapus<span class="sr-only">, {{ item.name }}</span>
                </button>
              </td>
            </tr>
            
            <!-- Tampilan jika tidak ada hasil filter -->
            <tr v-if="filteredStock.length === 0">
              <td colspan="6" class="py-10 text-center text-sm text-gray-500">
                Tidak ada barang yang cocok dengan pencarian Anda.
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>


    <!-- 4. Modal Penyesuaian Stok (dan Tambah Stok Baru) -->
    <!-- Logika modal ini sekarang menangani "Tambah" dan "Edit" -->
    <div v-if="isModalOpen" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" @click="closeModal"></div>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          
          <!-- Panel Modal -->
          <div class="relative transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <XMarkIcon class="h-6 w-6" />
            </button>

            <div>
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <ArchiveBoxIcon class="h-6 w-6 text-blue-700" />
              </div>
              <div class="mt-3">
                <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                  {{ isEditing ? 'Penyesuaian Stok' : 'Tambah Entri Stok Baru' }}
                </h3>
                <div class="mt-2">
                  <!-- Tampilan untuk Mode EDIT -->
                  <div v-if="isEditing">
                    <p class="text-sm text-gray-700">Anda akan menyesuaikan stok untuk:</p>
                    <p class="text-sm font-bold text-gray-900">{{ selectedItem.name }} ({{ selectedItem.unit }})</p>
                    <p class="mt-1 text-sm text-gray-500">Stok saat ini: <span class="font-medium text-gray-800">{{ selectedItem.stock }} Pcs</span></p>
                  </div>
                  <!-- Tampilan untuk Mode TAMBAH BARU -->
                  <div v-else>
                    <p class="text-sm text-gray-500">Buat entri stok baru untuk sebuah item di unit tertentu.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Form Penyesuaian -->
            <form @submit.prevent="handleStockAdjustment" class="mt-6 space-y-4">
              
              <!-- Input Tambah Baru (hanya muncul saat mode 'Tambah Baru') -->
              <template v-if="!isEditing">
                <div>
                  <label for="new_atk" class="block text-sm font-medium text-gray-700">Barang ATK</label>
                  <select v-model="adjustmentForm.atkId" id="new_atk" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
                    <option value="" disabled>Pilih Barang</option>
                    <option v-for="atk in allATK" :key="atk.id" :value="atk.id">{{ atk.name }}</option>
                  </select>
                </div>
                <div>
                  <label for="new_unit" class="block text-sm font-medium text-gray-700">Unit</label>
                  <select v-model="adjustmentForm.unitId" id="new_unit" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
                    <option value="" disabled>Pilih Unit</option>
                    <option v-for="unit in allUnits" :key="unit.id" :value="unit.id">{{ unit.name }}</option>
                  </select>
                </div>
              </template>

              <!-- Input Edit (hanya muncul saat mode 'Edit') -->
              <div v-if="isEditing">
                <label for="adjustment_type" class="block text-sm font-medium text-gray-700">Jenis Penyesuaian</label>
                <select v-model="adjustmentForm.type" id="adjustment_type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                  <option value="tambah">Tambah Stok (Barang Masuk)</option>
                  <option value="kurangi">Kurangi Stok (Barang Keluar)</option>
                </select>
              </div>

              <div>
                <label for="adjustment_qty" class="block text-sm font-medium text-gray-700">
                  {{ isEditing ? 'Jumlah Penyesuaian (Pcs)' : 'Jumlah Stok Awal (Pcs)' }}
                </label>
                <input 
                  v-model.number="adjustmentForm.qty"
                  type="number" 
                  id="adjustment_qty" 
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <!-- Tombol Aksi Modal -->
              <div class="mt-6 sm:flex sm:flex-row-reverse sm:gap-3">
                <button 
                  type="submit" 
                  class="inline-flex w-full justify-center rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 sm:w-auto"
                >
                  {{ isEditing ? 'Simpan Penyesuaian' : 'Simpan Entri Baru' }}
                </button>
                <button 
                  type="button" 
                  @click="closeModal" 
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Batal
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
// Impor ikon yang kita gunakan
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ArchiveBoxIcon, // Untuk modal
  XMarkIcon, // Untuk menutup modal
} from '@heroicons/vue/24/outline';

// --- DATA SIMULASI (Mock Data) ---
// Ini adalah daftar lengkap semua stok, tidak hanya yang rendah
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

// Data Master untuk form 'Tambah Baru'
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

// --- LOGIKA FILTER ---
const searchQuery = ref('');
const selectedUnit = ref('Semua Unit');

// Mendapatkan daftar unit unik untuk dropdown filter
const uniqueUnits = computed(() => {
  const units = allStockItems.value.map(item => item.unit);
  return [...new Set(units)]; // Set() otomatis menghapus duplikat
});

// Computed property untuk memfilter tabel secara real-time
const filteredStock = computed(() => {
  return allStockItems.value.filter(item => {
    // 1. Filter berdasarkan nama
    const nameMatch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    // 2. Filter berdasarkan unit
    const unitMatch = (selectedUnit.value === 'Semua Unit') || (item.unit === selectedUnit.value);
    
    return nameMatch && unitMatch;
  });
});


// --- LOGIKA MODAL (Telah digabung) ---
const isModalOpen = ref(false);
const selectedItem = ref(null); // 'null' atau 'object'
const isEditing = computed(() => !!selectedItem.value); // Cek apakah mode Edit

// Data untuk form di modal
const adjustmentForm = ref({
  type: 'tambah',
  qty: 0,
  atkId: '',
  unitId: '',
});

// Fungsi untuk membuka modal
const openAdjustModal = (item) => {
  if (item) {
    // Mode Edit
    selectedItem.value = item;
    adjustmentForm.value = {
      type: 'tambah',
      qty: 0,
      atkId: item.atkId, // Data-data ini sudah ada
      unitId: item.unitId, // Data-data ini sudah ada
    };
  } else {
    // Mode Tambah Baru
    selectedItem.value = null; // Tidak ada item yang dipilih
    adjustmentForm.value = {
      type: 'tambah',
      qty: 0,
      atkId: '', // Kosongkan, user akan memilih
      unitId: '', // Kosongkan, user akan memilih
    };
  }
  isModalOpen.value = true;
};

// Fungsi untuk menutup modal
const closeModal = () => {
  isModalOpen.value = false;
  selectedItem.value = null; // Bersihkan item terpilih
};

// Fungsi untuk memproses penyesuaian stok (CREATE / UPDATE)
const handleStockAdjustment = () => {
  if (adjustmentForm.value.qty <= 0) {
    // Pengecekan qty di 'Tambah' harus >= 0, di 'Edit' harus > 0
    if (isEditing.value && adjustmentForm.value.qty <= 0) {
      alert("Jumlah penyesuaian harus lebih besar dari 0.");
      return;
    }
     if (!isEditing.value && adjustmentForm.value.qty < 0) {
      alert("Jumlah stok awal tidak boleh minus.");
      return;
    }
  }

  if (isEditing.value) {
    // --- LOGIKA UPDATE ---
    const itemIndex = allStockItems.value.findIndex(item => item.id === selectedItem.value.id);
    if (itemIndex === -1) return;

    if (adjustmentForm.value.type === 'tambah') {
      allStockItems.value[itemIndex].stock += adjustmentForm.value.qty;
    } else {
      if (allStockItems.value[itemIndex].stock < adjustmentForm.value.qty) {
        // PERBAIKAN: Menggunakan backtick (`) untuk template literal
        alert(`Tidak bisa mengurangi stok. Stok saat ini (${allStockItems.value[itemIndex].stock}) lebih sedikit dari jumlah yang akan dikurangi (${adjustmentForm.value.qty}).`);
        return;
      }
      allStockItems.value[itemIndex].stock -= adjustmentForm.value.qty;
    }
    console.log(`Stok ${allStockItems.value[itemIndex].name} disesuaikan. Stok baru: ${allStockItems.value[itemIndex].stock}`);

  } else {
    // --- LOGIKA CREATE ---
    if (!adjustmentForm.value.atkId || !adjustmentForm.value.unitId) {
      alert("Silakan pilih Barang ATK dan Unit.");
      return;
    }
    
    // Cek duplikat (atkId dan unitId yang sama tidak boleh ada)
    const duplicate = allStockItems.value.find(item => 
      item.atkId === adjustmentForm.value.atkId && 
      item.unitId === adjustmentForm.value.unitId
    );
    if (duplicate) {
      alert("Entri stok untuk barang dan unit tersebut sudah ada. Silakan edit entri yang ada.");
      return;
    }

    // Ambil detail nama dari master data
    const atk = allATK.value.find(a => a.id === adjustmentForm.value.atkId);
    const unit = allUnits.value.find(u => u.id === adjustmentForm.value.unitId);
    
    const newId = allStockItems.value.length > 0 ? Math.max(...allStockItems.value.map(i => i.id)) + 1 : 1;
    const newEntry = {
      id: newId,
      name: atk.name,
      sku: `ATK-NEW-${newId}`, // Buat SKU dummy
      unit: unit.name,
      kategori: 'N/A', // Kategori bisa di-join dari master ATK
      stock: adjustmentForm.value.qty,
      threshold: 10, // Default threshold
      atkId: adjustmentForm.value.atkId,
      unitId: adjustmentForm.value.unitId,
    };
    
    allStockItems.value.push(newEntry);
    console.log(`Entri baru ditambahkan: ${newEntry.name}`);
  }
  
  // Tutup modal setelah berhasil
  closeModal();
};

// --- LOGIKA DELETE ---
const handleDelete = (itemToDelete) => {
  // PENTING: Menggunakan confirm() bawaan browser
  // Di UI 10/10, ini seharusnya diganti modal konfirmasi yang cantik
  if (confirm(`Apakah Anda yakin ingin menghapus entri stok untuk "${itemToDelete.name}" di "${itemToDelete.unit}"?`)) {
    // Di API nyata: axios.delete(`/api/stock/${itemToDelete.id}`)
    allStockItems.value = allStockItems.value.filter(item => item.id !== itemToDelete.id);
    console.log(`Item ${itemToDelete.name} dihapus.`);
  }
};
</script>