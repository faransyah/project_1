<template>
  <div class="space-y-10">
    
    <div>
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Dashboard</h1>
      <p class="mt-2 text-lg text-gray-600">
        Selamat datang, Admin. Rangkuman sistem ATK Icon Plus Anda.
      </p>
    </div>

    <div class="grid grid-cols-4 gap-6">
      
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 p-6 shadow-lg">
        <div class="relative z-10">
          <div class="flex items-center justify-between">
            <span class="text-3xl font-bold text-white truncate">{{ stats.activeUnits }}</span>
            <BoltIcon class="h-8 w-8 text-white opacity-50 flex-shrink-0" />
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

    <div>
      <h2 class="text-lg font-semibold leading-6 text-gray-900">Akses Cepat</h2>
      <div class="mt-4 grid grid-cols-4 gap-4">
        
        <button class="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <PlusIcon class="h-6 w-6" />
          </div>
          <span class="mt-3 w-full text-center truncate text-sm font-semibold text-gray-700">Tambah Stok</span>
        </button>
        <button class="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <DocumentPlusIcon class="h-6 w-6" />
          </div>
          <span class="mt-3 w-full text-center truncate text-sm font-semibold text-gray-700">Master ATK Baru</span>
        </button>
        <button class="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <UsersIcon class="h-6 w-6" />
          </div>
          <span class="mt-3 w-full text-center truncate text-sm font-semibold text-gray-700">Manage User</span>
        </button>
        <button class="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <BuildingOfficeIcon class="h-6 w-6" />
          </div>
          <span class="mt-3 w-full text-center truncate text-sm font-semibold text-gray-700">Manage Unit</span>
        </button>
      </div>
    </div>

    <div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
      <h2 class="text-lg font-semibold leading-6 text-gray-900">Peringatan Stok Rendah</h2>
      <p class="mt-1 text-sm text-gray-500">Barang-barang berikut perlu segera di-restock.</p>
      
      <div class="mt-4 -mx-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nama Barang</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Unit</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stok Sisa</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="item in lowStockItems" :key="item.id" class="hover:bg-gray-50">
              <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                {{ item.name }}
                <dl class="font-normal lg:hidden">
                  <dt class="sr-only">Unit</dt>
                  <dd class="mt-1 truncate text-gray-500">{{ item.unit }}</dd>
                </dl>
              </td>
              <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ item.unit }}</td>
              <td class="px-3 py-4 text-sm font-bold text-red-600">{{ item.stock }}</td>
              <td class="px-3 py-4 text-sm text-gray-500">
                <span class="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-xs font-medium text-red-800">
                  Perlu Restock
                </span>
              </td>
              <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button class="text-blue-600 hover:text-blue-800">Request<span class="sr-only">, {{ item.name }}</span></button>
              </td>
            </tr>
            <tr v-if="lowStockItems.length === 0">
              <td colspan="5" class="py-10 text-center text-sm text-gray-500">
                Tidak ada barang dengan stok rendah. Kerja bagus!
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
      <h2 class="text-lg font-semibold leading-6 text-gray-900">Permintaan Persetujuan</h2>
      <p class="mt-1 text-sm text-gray-500">Permintaan barang yang menunggu persetujuan Anda.</p>
      
      <ul role="list" class="mt-4 divide-y divide-gray-200">
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
            <button type="button" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              Tolak
            </button>
            <button type="button" class="rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
              Setujui
            </button>
          </div>
        </li>
      </ul>
    </div>

    <div class="flex gap-6">
    
    <div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 w-72 flex-shrink-0">
      <h3 class="text-lg font-semibold leading-6 text-gray-900">
        Stok Berdasarkan Kategori
      </h3>
      <p class="mt-1 text-sm text-gray-500">Distribusi nilai stok Anda saat ini.</p>
      <ul role="list" class="mt-4 space-y-5">
        <li v-for="cat in categoryStats" :key="cat.name">
          <div class="flex justify-between text-sm font-medium gap-2">
            <span class="text-gray-900 truncate">{{ cat.name }}</span>
            <span class="text-gray-500 flex-shrink-0">{{ cat.percentage }}</span>
          </div>
          <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div class="h-2 rounded-full" :class="cat.colorClass" :style="{ width: cat.percentage }"></div>
          </div>
        </li>
      </ul>
    </div>

    <div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 flex-1 min-w-0">
      <h3 class="text-lg font-semibold leading-6 text-gray-900">
        Aktivitas Terbaru
      </h3>
        <ul role="list" class="mt-4 divide-y divide-gray-200">
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
</template>

<script setup>
import { ref } from 'vue';
// Impor semua ikon yang kita gunakan
import {
  BoltIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  DocumentPlusIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ArrowDownIcon, // Barang Masuk
  ArrowUpIcon,   // Barang Keluar
  DocumentCheckIcon, // Ikon baru untuk Persetujuan
} from '@heroicons/vue/24/outline';

// --- DATA SIMULASI (Mock Data) ---
// Nanti, data ini akan Anda dapatkan dari API menggunakan Axios

// 1. Data untuk Kartu Statistik
const stats = ref({
  activeUnits: '8',
  totalATK: '142',
  totalStock: '10,2k'
});

// 2. Data untuk Tabel Stok Rendah
const lowStockItems = ref([
  { id: 1, name: 'Kertas A4 Sinar Dunia 80gr', unit: 'UID Jatim', stock: 5 },
  { id: 2, name: 'Tinta Printer Epson 003 Black', unit: 'UID Jatim', stock: 8 },
  { id: 3, name: 'Spidol Boardmarker Hitam', unit: 'UID Pusat', stock: 20 },
  { id: 4, name: 'Baterai ABC AA (Isi 4)', unit: 'UID Jabar', stock: 12 },
  { id: 5, name: 'Map Snelhecter Biru', unit: 'UID Pusat', stock: 15 },
]);

// 3. Data untuk Aktivitas Terbaru
const recentActivity = ref([
  { id: 1, type: 'masuk', item: 'Kertas A4 Sinar Dunia 80gr', qty: 200, user: 'Admin Gudang', time: 'Baru saja' },
  { id: 2, type: 'keluar', item: 'Spidol Boardmarker Hitam', qty: 50, user: 'User Jatim', time: '1 jam lalu' },
  { id: 3, type: 'keluar', item: 'Tinta Printer Epson 003 Black', qty: 10, user: 'User Jabar', time: '3 jam lalu' },
  { id: 4, type: 'masuk', item: 'Baterai ABC AA (Isi 4)', qty: 100, user: 'Admin Gudang', time: 'Kemarin' },
]);

// 4. (DATA BARU) Permintaan Persetujuan
const pendingApprovals = ref([
  { id: 1, user: 'Andi (UID Jatim)', unit: 'UID Jatim', itemCount: 5, value: 'Rp 1.500.000' },
  { id: 2, user: 'Budi (UID Jabar)', unit: 'UID Jabar', itemCount: 2, value: 'Rp 800.000' },
  { id: 3, user: 'Citra (UID Pusat)', unit: 'UID Pusat', itemCount: 8, value: 'Rp 2.100.000' },
]);

// 5. (DATA BARU) Statistik Kategori
const categoryStats = ref([
  { name: 'Kertas & Dokumen', percentage: '45%', colorClass: 'bg-blue-600' },
  { name: 'Tinta & Toner', percentage: '25%', colorClass: 'bg-blue-500' },
  { name: 'Alat Tulis', percentage: '20%', colorClass: 'bg-blue-400' },
  { name: 'Lain-lain', percentage: '10%', colorClass: 'bg-blue-300' },
]);
</script>