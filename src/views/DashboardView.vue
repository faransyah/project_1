<template>
  <div class="space-y-6">

    <div>
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Dashboard</h1>
      <p class="mt-2 text-lg text-gray-600">
        Selamat datang, Admin. Rangkuman sistem ATK Icon Plus Anda.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 p-6 shadow-lg">
        <div class="relative z-10">
          <div class="flex items-center justify-between">
            <span class="text-3xl font-bold text-white truncate">{{ stats.activeUnits }}</span>
            <BoltIcon class="h-8 w-8 text-yellow-400 opacity-100 flex-shrink-0" />
          </div>
          <p class="mt-2 text-sm font-medium text-blue-100 truncate">Unit Aktif</p>
        </div>
      </div>

      <div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
        <div class="flex items-center justify-between">
          <span class="text-3xl font-bold text-gray-900 truncate">{{ stats.totalATK }}</span>
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 flex-shrink-0">
            <ClipboardDocumentListIcon class="h-6 w-6" />
          </div>
        </div>
        <p class="mt-2 text-sm font-medium text-gray-500 truncate">Total Master ATK</p>
      </div>

      <div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
        <div class="flex items-center justify-between">
          <span class="text-3xl font-bold text-gray-900 truncate">{{ stats.totalStock }}</span>
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 flex-shrink-0">
            <ArchiveBoxIcon class="h-6 w-6" />
          </div>
        </div>
        <p class="mt-2 text-sm font-medium text-gray-500 truncate">Total Stok (Semua Unit)</p>
      </div>

      <div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
        <div class="flex items-center justify-between">
          <span class="text-3xl font-bold text-red-600 truncate">{{ lowStockItems.length }}</span>
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700 flex-shrink-0">
            <ExclamationTriangleIcon class="h-6 w-6" />
          </div>
        </div>
        <p class="mt-2 text-sm font-medium text-gray-500 truncate">Item Stok Rendah</p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6">

      <div class="col-span-12 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 lg:col-span-8">
        <h3 class="text-lg font-semibold leading-6 text-gray-900">Tren Permintaan (6 Bulan Terakhir)</h3>
        <p class="mt-1 text-sm text-gray-500">Jumlah permintaan ATK yang disetujui.</p>
        
        <div class="mt-6">
          <div class="relative h-64 w-full">
            <div class="absolute -left-8 top-0 flex h-full flex-col justify-between pr-2 text-right text-xs font-medium text-gray-500">
              <span>{{ maxRequestValue }}</span>
              <span>{{ Math.round(maxRequestValue * 0.75) }}</span>
              <span>{{ Math.round(maxRequestValue * 0.5) }}</span>
              <span>{{ Math.round(maxRequestValue * 0.25) }}</span>
              <span>0</span>
            </div>
            
            <div class="relative h-full w-full border-l border-b border-gray-200">
              <div class="absolute inset-x-0 top-0 h-px bg-gray-200"></div>
              <div class="absolute inset-x-0 top-1/4 h-px bg-gray-100"></div>
              <div class="absolute inset-x-0 top-1/2 h-px bg-gray-100"></div>
              <div class="absolute inset-x-0 top-3/4 h-px bg-gray-100"></div>

              <div class="absolute inset-x-0 bottom-0 h-full flex items-end justify-between px-2">
                <div v-for="month in requestTrendData" :key="month.name" class="w-full group">
                  <div 
                    class="relative w-full rounded-t-lg bg-blue-500 transition-all duration-300 hover:bg-blue-700" 
                    :style="{ height: (month.value / maxRequestValue * 100) + '%' }"
                  >
                    <span class="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                      {{ month.value }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-2 flex justify-between pl-8 pr-2">
            <span v-for="month in requestTrendData" :key="month.name" class="w-full text-center text-xs font-medium text-gray-500">
              {{ month.name }}
            </span>
          </div>
        </div>
        </div>

      <div class="col-span-12 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 lg:col-span-4">
        <h3 class="text-lg font-semibold leading-6 text-gray-900">Stok Berdasarkan Kategori</h3>
        <p class="mt-1 text-sm text-gray-500">Distribusi jumlah item di gudang.</p>
        
        <div class="relative mx-auto mt-6 h-48 w-48">
          <svg class="h-full w-full" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9155" fill="none" class="text-gray-200" stroke-width="3.8"></circle>
            
            <circle cx="18" cy="18" r="15.9155" fill="none"
              class="text-blue-600"
              stroke-width="3.8"
              :stroke-dasharray="categoryPercentages[0].dashArray"
              :stroke-dashoffset="categoryPercentages[0].dashOffset"></circle>
              
            <circle cx="18" cy="18" r="15.9155" fill="none"
              class="text-blue-500"
              stroke-width="3.8"
              :stroke-dasharray="categoryPercentages[1].dashArray"
              :stroke-dashoffset="categoryPercentages[1].dashOffset"></circle>

            <circle cx="18" cy="18" r="15.9155" fill="none"
              class="text-blue-400"
              stroke-width="3.8"
              :stroke-dasharray="categoryPercentages[2].dashArray"
              :stroke-dashoffset="categoryPercentages[2].dashOffset"></circle>
              
            <circle cx="18" cy="18" r="15.9155" fill="none"
              class="text-blue-300"
              stroke-width="3.8"
              :stroke-dasharray="categoryPercentages[3].dashArray"
              :stroke-dashoffset="categoryPercentages[3].dashOffset"></circle>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-2xl font-bold text-gray-900">{{ stats.totalStock }}</span>
            <span class="text-sm text-gray-500">Total Item</span>
          </div>
        </div>
        <div class="mt-6 space-y-3">
          <div v-for="cat in categoryStats" :key="cat.name" class="flex items-center justify-between">
            <div class="flex items-center">
              <span class="h-3 w-3 rounded-full" :class="cat.colorClass"></span>
              <span class="ml-2 text-sm text-gray-600">{{ cat.name }}</span>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ cat.percentage }}</span>
          </div>
        </div>
      </div>

      <div class="col-span-12 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 lg:col-span-7">
        <h2 class="text-lg font-semibold leading-6 text-gray-900">Permintaan Persetujuan</h2>
        <p class="mt-1 text-sm text-gray-500">Permintaan barang yang menunggu persetujuan Anda.</p>
  
        <div class="mt-4 flow-root">
          <div class="custom-scrollbar -my-4 h-96 overflow-y-auto pr-2">
            <ul role="list" class="divide-y divide-gray-200">
              <li v-if="pendingApprovals.length === 0" class="py-6 text-center text-sm text-gray-500">
                Tidak ada permintaan yang menunggu.
              </li>
              <li v-for="req in pendingApprovals" :key="req.id" class="flex flex-wrap items-center justify-between gap-y-4 py-4">
                <div class="flex items-center space-x-4">
                  <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <DocumentCheckIcon class="h-5 w-5 text-blue-700" />
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-medium text-gray-900">{{ req.user }} ({{ req.unit }})</p>
                    <p class="truncate text-sm text-gray-500">Meminta {{ req.itemCount }} item senilai {{ req.value }}</p>
                  </div>
                </div>
                <div class="flex-shrink-0 space-x-3">
                  <button
                    @click="handleApprovalAction(req, 'Tolak')"
                    type="button"
                    class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition hover:bg-red-50 hover:text-red-700"
                  >
                    Tolak
                  </button>
                  <button
                    @click="handleApprovalAction(req, 'Setujui')"
                    type="button"
                    class="rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    Setujui
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-span-12 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 lg:col-span-5">
        <h2 class="text-lg font-semibold leading-6 text-gray-900">Peringatan Stok Rendah</h2>
        <p class="mt-1 text-sm text-gray-500">Barang-barang berikut perlu segera di-restock.</p>
  
        <div class="mt-4 flow-root">
          <div class="custom-scrollbar -my-4 h-96 overflow-y-auto pr-2">
            <ul role="list" class="divide-y divide-gray-200">
              <li v-if="lowStockItems.length === 0" class="py-6 text-center text-sm text-gray-500">
                  Kerja bagus! Stok aman.
              </li>
              <li v-for="item in lowStockItems" :key="item.id" class="flex items-center space-x-4 py-4">
                <div class="flex-shrink-0">
                  <span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                    <ExclamationTriangleIcon class="h-5 w-5 text-red-700" />
                  </span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-gray-900">{{ item.name }}</p>
                  <p class="truncate text-sm text-gray-500">{{ item.unit }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold text-red-600">{{ item.stock }} Pcs</p>
                  <button @click="handleRequestStock(item)" class="text-sm text-blue-600 hover:text-blue-800">Request</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-span-12 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 lg:col-span-6">
        <h3 class="text-lg font-semibold leading-6 text-gray-900">
          ATK Paling Sering Diminta
        </h3>
        <p class="mt-1 text-sm text-gray-500">Barang paling populer di semua unit bulan ini.</p>
        <div class="mt-4 flow-root">
          <div class="custom-scrollbar -my-4 h-96 overflow-y-auto pr-2">
            <ul role="list" class="divide-y divide-gray-200">
              <li v-for="(item, index) in topRequestedItems" :key="item.id" class="flex items-center space-x-4 py-4">
                <div class="flex-shrink-0">
                  <span class="flex h-10 w-10 items-center justify-center rounded-full"
                    :class="index === 0 ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-100 text-gray-700'"
                  >
                    <TrophyIcon v-if="index === 0" class="h-5 w-5" />
                    <span v-else class="font-medium">{{ index + 1 }}</span>
                  </span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-gray-900">{{ item.name }}</p>
                  <p class="truncate text-sm text-gray-500">{{ item.category }}</p>
                </div>
                <div class="text-sm font-medium text-gray-900">{{ item.count }} reqs</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-span-12 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 lg:col-span-6">
        <h3 class="text-lg font-semibold leading-6 text-gray-900">
          Aktivitas Terbaru
        </h3>
        <p class="mt-1 text-sm text-gray-500">Log transaksi stok barang masuk & keluar.</p>
        <div class="mt-4 flow-root">
          <div class="custom-scrollbar -my-4 h-96 overflow-y-auto pr-2">
            <ul role="list" class="divide-y divide-gray-200">
              <li v-for="activity in recentActivity" :key="activity.id" class="flex items-center space-x-4 py-4">
                <div class="flex-shrink-0">
                  <span class="inline-flex h-10 w-10 items-center justify-center rounded-full" :class="activity.type === 'masuk' ? 'bg-green-100' : 'bg-yellow-100'">
                    <ArrowDownIcon v-if="activity.type === 'masuk'" class="h-5 w-5 text-green-700" />
                    <ArrowUpIcon v-else class="h-5 w-5 text-yellow-700" />
                  </span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-gray-900">
                    {{ activity.item }} ({{ activity.qty }} Pcs)
                  </p>
                  <p class="truncate text-sm text-gray-500">
                    Oleh: {{ activity.user }} - <span class="capitalize">{{ activity.type }}</span>
                  </p>
                </div>
                <div class="text-sm text-gray-500">{{ activity.time }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>

    <div v-if="globalActionMessage" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70" @click="globalActionMessage = null">
        <div class="rounded-lg bg-white p-6 shadow-2xl max-w-sm w-full" @click.stop>
            <h3 class="text-lg font-semibold text-gray-900">Simulasi Aksi</h3>
            <p class="mt-2 text-sm text-gray-600">{{ globalActionMessage }}</p>
            <button @click="globalActionMessage = null" class="mt-4 w-full rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">
                Tutup
            </button>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'; // <-- 'computed' SANGAT PENTING

// Impor ikon yang kita gunakan
import {
  BoltIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  DocumentCheckIcon,
  TrophyIcon,
} from '@heroicons/vue/24/outline';

// State untuk pesan aksi global (Setujui/Tolak/Request)
const globalActionMessage = ref(null);

// --- HANDLERS UNTUK KLIK ---
const handleApprovalAction = (item, action) => {
    globalActionMessage.value = `${action} permintaan dari ${item.user} untuk ${item.itemCount} item senilai ${item.value}. Logika backend akan dipicu di sini.`;
};

const handleRequestStock = (item) => {
    globalActionMessage.value = `Permintaan Request restock untuk item: ${item.name} (${item.stock} unit). Logika untuk membuat Purchase Request (PR) akan berjalan di sini.`;
};


// --- DATA SIMULASI (Mock Data) ---
const stats = ref({
  activeUnits: '8',
  totalATK: '142',
  totalStock: '10,2k'
});

// DIPERBANYAK DATANYA
const lowStockItems = ref([
  { id: 1, name: 'Kertas A4 Sinar Dunia 80gr', unit: 'UID Jatim', stock: 5 },
  { id: 2, name: 'Tinta Printer Epson 003 Black', unit: 'UID Jatim', stock: 8 },
  { id: 3, name: 'Spidol Boardmarker Hitam', unit: 'UID Pusat', stock: 20 },
  { id: 4, name: 'Baterai ABC AA (Isi 4)', unit: 'UID Jabar', stock: 12 },
  { id: 5, name: 'Map Snelhecter Biru', unit: 'UID Pusat', stock: 15 },
  { id: 6, name: 'Buku Tulis Sinar Dunia', unit: 'UID Jatim', stock: 18 },
  { id: 7, name: 'Lakban Bening 2 Inch', unit: 'UID Pusat', stock: 9 },
]);

// DIPERBANYAK DATANYA
const recentActivity = ref([
  { id: 1, type: 'masuk', item: 'Kertas A4 Sinar Dunia 80gr', qty: 200, user: 'Admin Gudang', time: 'Baru saja' },
  { id: 2, type: 'keluar', item: 'Spidol Boardmarker Hitam', qty: 50, user: 'User Jatim', time: '1 jam lalu' },
  { id: 3, type: 'keluar', item: 'Tinta Printer Epson 003 Black', qty: 10, user: 'User Jabar', time: '3 jam lalu' },
  { id: 4, type: 'masuk', item: 'Baterai ABC AA (Isi 4)', qty: 100, user: 'Admin Gudang', time: 'Kemarin' },
  { id: 5, type: 'keluar', item: 'Map Snelhecter Biru', qty: 30, user: 'User Pusat', time: 'Kemarin' },
  { id: 6, type: 'masuk', item: 'Buku Tulis Sinar Dunia', qty: 150, user: 'Admin Gudang', time: '2 hari lalu' },
  { id: 7, type: 'keluar', item: 'Kertas A4 Sinar Dunia 80gr', qty: 20, user: 'User Jatim', time: '2 hari lalu' },
]);

// DIPERBANYAK DATANYA
const pendingApprovals = ref([
  { id: 1, user: 'Andi (UID Jatim)', unit: 'UID Jatim', itemCount: 5, value: 'Rp 1.500.000' },
  { id: 2, user: 'Budi (UID Jabar)', unit: 'UID Jabar', itemCount: 2, value: 'Rp 800.000' },
  { id: 3, user: 'Citra (UID Pusat)', unit: 'UID Pusat', itemCount: 8, value: 'Rp 2.100.000' },
  { id: 4, user: 'Dewi (UID Jateng)', unit: 'UID Jateng', itemCount: 3, value: 'Rp 500.000' },
  { id: 5, user: 'Eka (UID Bali)', unit: 'UID Bali', itemCount: 12, value: 'Rp 3.200.000' },
]);

// Data untuk Chart Kategori (Dengan nilai numerik untuk perhitungan)
const categoryStats = ref([
  { name: 'Kertas & Dokumen', percentage: '45%', value: 45, colorClass: 'bg-blue-600' },
  { name: 'Tinta & Toner', percentage: '25%', value: 25, colorClass: 'bg-blue-500' },
  { name: 'Alat Tulis', percentage: '20%', value: 20, colorClass: 'bg-blue-400' },
  { name: 'Lain-lain', percentage: '10%', value: 10, colorClass: 'bg-blue-300' },
]);

// =============================================
//     Computed Property untuk Donut Chart
// =============================================
const categoryPercentages = computed(() => {
  // Keliling lingkaran = 100 (dari 2 * pi * 15.9155)
  const total = categoryStats.value.reduce((sum, cat) => sum + cat.value, 0);
  let cumulativePercentage = 0;

  return categoryStats.value.map(cat => {
    const percentage = (cat.value / total) * 100;
    const dashArray = `${percentage}, 100`; // (panjang_terisi, keliling_total)
    const dashOffset = `-${cumulativePercentage}`;
    cumulativePercentage += percentage;
    return { ...cat, dashArray, dashOffset };
  });
});

// Data untuk Chart Tren Permintaan (Dengan nilai numerik)
const requestTrendData = ref([
    { name: 'Jun', value: 300 },
    { name: 'Jul', value: 450 },
    { name: 'Ags', value: 600 },
    { name: 'Sep', value: 500 },
    { name: 'Okt', value: 750 },
    { name: 'Nov', value: 900 },
]);

// =============================================
//     Computed Property untuk Bar Chart
// =============================================
const maxRequestValue = computed(() => {
  // Ambil nilai tertinggi, bulatkan ke atas ke ratusan terdekat
  const max = Math.max(...requestTrendData.value.map(month => month.value));
  return Math.ceil(max / 100) * 100; // Cth: 900 -> 900, 750 -> 800
});

// Data untuk List ATK Teratas (DIPERBANYAK)
const topRequestedItems = ref([
    { id: 2, name: 'Kertas A4 Sinar Dunia 80gr', category: 'Kertas & Dokumen', count: 120 },
    { id: 3, name: 'Spidol Boardmarker Hitam', category: 'Alat Tulis', count: 95 },
    { id: 1, name: 'Tinta Printer Epson 003 Black', category: 'Tinta & Toner', count: 88 },
    { id: 7, name: 'Buku Tulis Sinar Dunia (Isi 50)', category: 'Alat Tulis', count: 60 },
    { id: 5, name: 'Map Snelhecter Biru', category: 'Kertas & Dokumen', count: 55 },
    { id: 4, name: 'Baterai ABC AA (Isi 4)', category: 'Lain-lain', count: 42 },
    { id: 9, name: 'Pulpen Standard AE7 Hitam', category: 'Alat Tulis', count: 30 },
    { id: 8, name: 'Toner Printer HP 85A', category: 'Tinta & Toner', count: 25 },
]);
</script>

<style scoped>
/* =========================================================
  Style Kustom untuk Scrollbar & Animasi
  =========================================================
*/

/* Animasi draw untuk segmen Donut Chart */
@keyframes draw-circle {
  from {
    /* Mulai dari 0, keliling 100 */
    stroke-dasharray: 0, 100;
  }
}

svg circle:not(.text-gray-200) { /* Hanya terapkan animasi ke segmen warna */
  animation: draw-circle 1s ease-out forwards;
  transform: rotate(-90deg); /* Memulai dari atas */
  transform-origin: 50% 50%;
}

/* Kustomisasi Scrollbar untuk panel-panel */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9; /* bg-slate-100 */
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; /* bg-slate-300 */
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; /* bg-slate-400 */
}

/* Fallback untuk Firefox (opsional tapi bagus) */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}
</style>