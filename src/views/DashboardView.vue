<template>
  <Transition name="toast-fade">
    <div 
      v-if="toast.show" 
      class="fixed top-6 right-6 z-[100] w-full max-w-sm rounded-lg shadow-lg"
      :class="{ 
        'bg-green-600 text-white': toast.type === 'success', 
        'bg-red-600 text-white': toast.type === 'error' 
      }"
    >
      <div class="relative flex items-center p-4">
        <div class="flex-shrink-0">
          <CheckCircleIcon v-if="toast.type === 'success'" class="h-6 w-6 text-white" />
          <XCircleIcon v-if="toast.type === 'error'" class="h-6 w-6 text-white" />
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium">{{ toast.message }}</p>
        </div>
        <button @click="toast.show = false" class="ml-4 flex-shrink-0 text-white opacity-70 hover:opacity-100">
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
  </Transition>

  <div v-if="confirmModal.show" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" @click="closeConfirmModal"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center">
        <div class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
          <div class="flex items-start">
            <div 
              class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10"
              :class="confirmModal.iconBg"
            >
              <component :is="confirmModal.icon" class="h-6 w-6" :class="confirmModal.iconColor" />
            </div>
            <div class="ml-4 mt-0 text-left">
              <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                {{ confirmModal.title }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ confirmModal.message }}
                </p>
              </div>
            </div>
          </div>
          <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button 
              type="button" 
              @click="onConfirm"
              class="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors sm:w-auto"
              :class="confirmModal.buttonClass"
            >
              {{ confirmModal.buttonText }}
            </button>
            <button 
              type="button" 
              @click="closeConfirmModal"
              class="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="space-y-6">

    <div>
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Dashboard</h1>
      <p class="mt-2 text-lg text-gray-600">
        Selamat datang, Admin. Rangkuman sistem ATK Icon Plus Anda.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

      <div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div class="flex items-center justify-between">
          <span class="text-3xl font-bold text-gray-900 truncate">{{ stats.activeUnits }}</span>
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 flex-shrink-0">
            <BoltIcon class="h-6 w-6" />
          </div>
        </div>
        <p class="mt-2 text-sm font-medium text-gray-500 truncate">Unit Aktif</p>
      </div>

      <div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div class="flex items-center justify-between">
          <span class="text-3xl font-bold text-gray-900 truncate">{{ stats.totalATK }}</span>
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 flex-shrink-0">
            <ClipboardDocumentListIcon class="h-6 w-6" />
          </div>
        </div>
        <p class="mt-2 text-sm font-medium text-gray-500 truncate">Total Master ATK</p>
      </div>

      <div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div class="flex items-center justify-between">
          <span class="text-3xl font-bold text-gray-900 truncate">{{ stats.totalStock }}</span>
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 flex-shrink-0">
            <ArchiveBoxIcon class="h-6 w-6" />
          </div>
        </div>
        <p class="mt-2 text-sm font-medium text-gray-500 truncate">Total Stok (Semua Unit)</p>
      </div>

      <div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
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

      <div class="col-span-12 flex flex-col lg:flex-row gap-6">
        
        <div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 w-full lg:w-[650px] lg:flex-shrink-0">
          <h3 class="text-lg font-semibold leading-6 text-gray-900">Tren Permintaan (6 Bulan Terakhir)</h3>
          <p class="mt-1 text-sm text-gray-500">Jumlah permintaan ATK yang disetujui.</p>
          
          <div class="mt-4 -ml-4">
            <apexchart
              type="bar"
              height="320"
              :options="barChartOptions"
              :series="barChartSeries"
            ></apexchart>
          </div>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 w-full lg:flex-1">
          <h3 class="text-lg font-semibold leading-6 text-gray-900">Stok Berdasarkan Kategori</h3>
          <p class="mt-1 text-sm text-gray-500">Distribusi jumlah item di gudang.</p>
          
          <div class="mt-4 flex items-center justify-center">
            <apexchart
              ref="donutChartRef"
              type="donut"
              width="320"
              :options="donutChartOptions"
              :series="donutChartSeries"
            ></apexchart>
          </div>
          
          <div class="mt-6 space-y-3">
            <div 
              v-for="(cat, index) in categoryStats" 
              :key="cat.name" 
              @click="handleLegendClick(index)"
              class="flex items-center justify-between rounded-md p-1 -m-1 cursor-pointer transition-all duration-200"
              :class="{ 
                'opacity-50 hover:opacity-100': selectedCategoryIndices.length > 0 && !selectedCategoryIndices.includes(index),
                'bg-gray-100': selectedCategoryIndices.includes(index)
              }"
            >
              <div class="flex items-center">
                <span class="h-3 w-3 rounded-full" :class="cat.colorClass"></span>
                <span class="ml-2 text-sm text-gray-600">{{ cat.name }}</span>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ cat.percentage }}</span>
            </div>
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
    
  </div>
</template>

<script setup>
import { ref, computed, shallowRef } from 'vue'; 
import VueApexCharts from 'vue3-apexcharts';

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
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  QuestionMarkCircleIcon,
  NoSymbolIcon,
} from '@heroicons/vue/24/outline';


// =========================================================
//  State untuk Toast Notifikasi
// =========================================================
const toast = ref({
  show: false,
  message: '',
  type: 'success',
});
let toastTimeout = null;

const triggerToast = (message, type = 'success') => {
  if (toastTimeout) clearTimeout(toastTimeout); 
  
  toast.value.message = message;
  toast.value.type = type;
  toast.value.show = true;

  toastTimeout = setTimeout(() => {
    toast.value.show = false;
  }, 3000); 
};

// =========================================================
//  State untuk Modal Konfirmasi
// =========================================================
const confirmModal = ref({
  show: false,
  title: '',
  message: '',
  buttonText: '',
  buttonClass: '',
  icon: null,
  iconBg: '',
  iconColor: '',
  onConfirmAction: () => {}, 
});

const openConfirmModal = ({ title, message, buttonText, buttonClass, icon, iconBg, iconColor, onConfirm }) => {
  confirmModal.value = {
    show: true,
    title,
    message,
    buttonText,
    buttonClass,
    icon: shallowRef(icon),
    iconBg,
    iconColor,
    onConfirmAction: onConfirm,
  };
};

const closeConfirmModal = () => {
  confirmModal.value.show = false;
};

const onConfirm = () => {
  if (typeof confirmModal.value.onConfirmAction === 'function') {
    confirmModal.value.onConfirmAction(); 
  }
  closeConfirmModal();
};

// =========================================================
//  Fungsi Handlers
// =========================================================

const handleApprovalAction = (item, action) => {
  if (action === 'Setujui') {
    openConfirmModal({
      title: 'Konfirmasi Persetujuan',
      message: `Apakah Anda yakin ingin menyetujui permintaan dari ${item.user} (${item.unit})?`,
      buttonText: 'Ya, Setujui',
      buttonClass: 'bg-blue-700 hover:bg-blue-800 focus-visible:outline-blue-700',
      icon: CheckCircleIcon,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-700',
      onConfirm: () => {
        console.log('LOGIC: Menyetujui item', item);
        triggerToast('Permintaan berhasil disetujui.', 'success');
      }
    });
  } else { // 'Tolak'
    openConfirmModal({
      title: 'Konfirmasi Penolakan',
      message: `Apakah Anda yakin ingin menolak permintaan dari ${item.user} (${item.unit})? Tindakan ini tidak dapat dibatalkan.`,
      buttonText: 'Ya, Tolak',
      buttonClass: 'bg-red-700 hover:bg-red-800 focus-visible:outline-red-700',
      icon: NoSymbolIcon,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-700',
      onConfirm: () => {
        console.log('LOGIC: Menolak item', item);
        triggerToast('Permintaan telah ditolak.', 'error');
      }
    });
  }
};

const handleRequestStock = (item) => {
  openConfirmModal({
    title: 'Konfirmasi Request Stok',
    message: `Apakah Anda yakin ingin membuat permintaan restock untuk item: ${item.name} di ${item.unit}?`,
    buttonText: 'Ya, Buat Request',
    buttonClass: 'bg-blue-700 hover:bg-blue-800 focus-visible:outline-blue-700',
    icon: QuestionMarkCircleIcon,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    onConfirm: () => {
      console.log('LOGIC: Membuat request stok untuk', item);
      triggerToast('Permintaan restock telah dibuat.', 'success');
    }
  });
};


// --- DATA SIMULASI (Mock Data) ---
const stats = ref({
  activeUnits: '8',
  totalATK: '142',
  totalStock: '10,2k'
});

const totalStockNumeric = 10200;

// =============================================
//     PERUBAHAN WARNA & LOGIKA DATA
// =============================================
const categoryStats = ref([
  { name: 'Kertas & Dokumen', percentage: '45%', value: totalStockNumeric * 0.45, colorClass: 'bg-blue-600' },   // BIRU
  { name: 'Tinta & Toner', percentage: '25%', value: totalStockNumeric * 0.25, colorClass: 'bg-green-500' }, // HIJAU
  { name: 'Alat Tulis', percentage: '20%', value: totalStockNumeric * 0.20, colorClass: 'bg-yellow-500' }, // KUNING
  { name: 'Lain-lain', percentage: '10%', value: totalStockNumeric * 0.10, colorClass: 'bg-red-500' },     // MERAH
]);
// =============================================


const lowStockItems = ref([
  { id: 1, name: 'Kertas A4 Sinar Dunia 80gr', unit: 'UID Jatim', stock: 5 },
  { id: 2, name: 'Tinta Printer Epson 003 Black', unit: 'UID Jatim', stock: 8 },
  { id: 3, name: 'Spidol Boardmarker Hitam', unit: 'UID Pusat', stock: 20 },
  { id: 4, name: 'Baterai ABC AA (Isi 4)', unit: 'UID Jabar', stock: 12 },
  { id: 5, name: 'Map Snelhecter Biru', unit: 'UID Pusat', stock: 15 },
  { id: 6, name: 'Buku Tulis Sinar Dunia', unit: 'UID Jatim', stock: 18 },
  { id: 7, name: 'Lakban Bening 2 Inch', unit: 'UID Pusat', stock: 9 },
]);

const recentActivity = ref([
  { id: 1, type: 'masuk', item: 'Kertas A4 Sinar Dunia 80gr', qty: 200, user: 'Admin Gudang', time: 'Baru saja' },
  { id: 2, type: 'keluar', item: 'Spidol Boardmarker Hitam', qty: 50, user: 'User Jatim', time: '1 jam lalu' },
  { id: 3, type: 'keluar', item: 'Tinta Printer Epson 003 Black', qty: 10, user: 'User Jabar', time: '3 jam lalu' },
  { id: 4, type: 'masuk', item: 'Baterai ABC AA (Isi 4)', qty: 100, user: 'Admin Gudang', time: 'Kemarin' },
  { id: 5, type: 'keluar', item: 'Map Snelhecter Biru', qty: 30, user: 'User Pusat', time: 'Kemarin' },
  { id: 6, type: 'masuk', item: 'Buku Tulis Sinar Dunia', qty: 150, user: 'Admin Gudang', time: '2 hari lalu' },
  { id: 7, type: 'keluar', item: 'Kertas A4 Sinar Dunia 80gr', qty: 20, user: 'User Jatim', time: '2 hari lalu' },
]);

const pendingApprovals = ref([
  { id: 1, user: 'Andi (UID Jatim)', unit: 'UID Jatim', itemCount: 5, value: 'Rp 1.500.000' },
  { id: 2, user: 'Budi (UID Jabar)', unit: 'UID Jabar', itemCount: 2, value: 'Rp 800.000' },
  { id: 3, user: 'Citra (UID Pusat)', unit: 'UID Pusat', itemCount: 8, value: 'Rp 2.100.000' },
  { id: 4, user: 'Dewi (UID Jateng)', unit: 'UID Jateng', itemCount: 3, value: 'Rp 500.000' },
  { id: 5, user: 'Eka (UID Bali)', unit: 'UID Bali', itemCount: 12, value: 'Rp 3.200.000' },
]);

const requestTrendData = ref([
    { name: 'Jun', value: 300 },
    { name: 'Jul', value: 450 },
    { name: 'Ags', value: 600 },
    { name: 'Sep', value: 500 },
    { name: 'Okt', value: 750 },
    { name: 'Nov', value: 900 },
]);

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

// =============================================
//     PERSIAPAN DATA UNTUK APEXCHARTS
// =============================================

// --- Data untuk Bar Chart ---
const barChartSeries = computed(() => [
  {
    name: 'Permintaan',
    data: requestTrendData.value.map(month => month.value)
  }
]);

// Pastikan TIDAK ADA 'animations' di sini
const barChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 320,
    fontFamily: 'Inter, sans-serif',
    toolbar: { show: false }, 
    zoom: { enabled: false }
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      columnWidth: '55%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: false,
  },
  xaxis: {
    categories: requestTrendData.value.map(month => month.name),
    labels: {
      style: {
        colors: '#6B7280', 
        fontSize: '12px',
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: {
        colors: '#6B7280',
        fontSize: '12px',
      },
      formatter: function (val) {
        return val.toFixed(0);
      }
    },
  },
  grid: {
    borderColor: '#E5E7EB', 
    strokeDashArray: 4,
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: false,
      },
    }
  },
  colors: ['#2563EB'], 
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " permintaan"
      }
    }
  }
}));

// =============================================
//  DONUT CHART – INTERAKTIF MULTI-SELECT FIXED
// =============================================

const donutChartRef = ref(null);
const donutChartTotalLabel = ref('Total Item');
const donutChartTotalValue = ref(stats.value.totalStock);
const selectedCategoryIndices = ref([]);

// Hitung total nilai kategori yang terpilih
const calculateSelectedTotal = () => {
  return selectedCategoryIndices.value.reduce((sum, idx) => {
    return sum + categoryStats.value[idx].value;
  }, 0);
};

// Update teks tengah donut (label + total)
const updateCenterLabel = () => {
  const count = selectedCategoryIndices.value.length;

  if (count === 0) {
    donutChartTotalLabel.value = 'Total Item';
    donutChartTotalValue.value = stats.value.totalStock;
  } else if (count === 1) {
    const idx = selectedCategoryIndices.value[0];
    donutChartTotalLabel.value = categoryStats.value[idx].name;
    donutChartTotalValue.value = categoryStats.value[idx].value.toLocaleString('id-ID');
  } else {
    donutChartTotalLabel.value = 'Total Terpilih';
    donutChartTotalValue.value = calculateSelectedTotal().toLocaleString('id-ID');
  }

  // Update tampilan teks di tengah chart
  if (donutChartRef.value) {
    donutChartRef.value.updateOptions({
      plotOptions: {
        pie: {
          donut: {
            labels: {
              total: {
                label: donutChartTotalLabel.value,
                formatter: () => donutChartTotalValue.value,
              },
            },
          },
        },
      },
    });
  }
};

// Update terang/gelap pada slice
const updateSliceOpacity = () => {
  const selected = selectedCategoryIndices.value;

  if (!donutChartRef.value) return;

  // Jika tidak ada yang dipilih → semua terang (filter none)
  // Jika ada yang dipilih → slice lain sedikit gelap
  donutChartRef.value.updateOptions({
    states: {
      normal: {
        filter: {
          type: selected.length === 0 ? 'none' : 'lighten',
          value: selected.length === 0 ? 0 : 0.5,
        },
      },
      active: {
        filter: { type: 'none' },
      },
      hover: {
        filter: {
          type: 'lighten',
          value: 0.15,
        },
      },
    },
  });
};

// Klik pada legenda HTML
const handleLegendClick = (index) => {
  const pos = selectedCategoryIndices.value.indexOf(index);

  if (pos >= 0) {
    // Unselect
    selectedCategoryIndices.value.splice(pos, 1);
  } else {
    // Select
    selectedCategoryIndices.value.push(index);
  }

  // Toggle highlight slice Apex
  if (donutChartRef.value) {
    donutChartRef.value.toggleDataPointSelection(index);
  }

  // Update UI
  updateCenterLabel();
  updateSliceOpacity();
};

// Data series
const donutChartSeries = computed(() =>
  categoryStats.value.map((cat) => cat.value)
);

// Options (UI clean 10/10)
const donutChartOptions = computed(() => ({
  chart: {
    type: 'donut',
    width: 320,
    fontFamily: 'Inter, sans-serif',
    animations: { enabled: true },
    events: {
      dataPointSelection: () => {}, // disable default click
    },
  },
  labels: categoryStats.value.map((cat) => cat.name),
  colors: categoryStats.value.map((cat) => {
    if (cat.colorClass === 'bg-blue-600') return '#2563EB';
    if (cat.colorClass === 'bg-green-500') return '#22C55E';
    if (cat.colorClass === 'bg-yellow-500') return '#EAB308';
    if (cat.colorClass === 'bg-red-500') return '#EF4444';
    return '#A3A3A3';
  }),
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          total: {
            show: true,
            label: donutChartTotalLabel.value,
            color: '#6B7280',
            formatter: () => donutChartTotalValue.value,
          },
        },
      },
    },
  },
  legend: {
    show: false, // Karena kamu pakai legenda custom di HTML
  },
  tooltip: {
    y: {
      formatter: (val) => val.toLocaleString('id-ID') + ' item',
    },
  },
  dataLabels: { enabled: false },
  states: {
    normal: {
      filter: { type: 'none', value: 0 },
    },
    active: {
      filter: { type: 'none' },
    },
    hover: {
      filter: { type: 'lighten', value: 0.15 },
    },
  },
}));
</script>

<style scoped>
/* =========================================================
  Style Kustom untuk Scrollbar & Transisi
  =========================================================
*/

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
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

/* Transisi "Pop In" & "Fade Out" untuk Toast */
.toast-fade-enter-active {
  transition: all 0.3s ease-out;
}
.toast-fade-leave-active {
  transition: all 0.3s ease-in;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.toast-fade-leave-to {
  opacity: 0;
}
</style>