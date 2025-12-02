<template>
  <!-- TOAST NOTIFICATION -->
  <Transition name="toast-slide-top">
    <div 
      v-if="toast.show" 
      class="fixed top-16 left-1/2 z-[100] w-full max-w-sm -translate-x-1/2 transform px-4"
    >
      <div 
        class="flex items-center overflow-hidden rounded-2xl p-4 shadow-2xl backdrop-blur-xl ring-1 transition-all"
        :class="{ 
          'bg-white/95 text-slate-800 ring-slate-200': true, 
          'border-l-4 border-green-500': toast.type === 'success', 
          'border-l-4 border-red-500': toast.type === 'error' 
        }"
      >
        <div class="flex-shrink-0">
          <CheckCircleIcon v-if="toast.type === 'success'" class="h-6 w-6 text-green-500" />
          <XCircleIcon v-if="toast.type === 'error'" class="h-6 w-6 text-red-500" />
        </div>
        
        <div class="ml-3 flex-1">
          <p class="text-sm font-semibold">{{ toast.message }}</p>
        </div>
        
        <button @click="toast.show = false" class="ml-4 flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
  </Transition>

  <!-- MODAL KONFIRMASI -->
  <div v-if="confirmModal.show" class="relative z-[60]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" @click="closeConfirmModal"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg ring-1 ring-slate-900/5">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div 
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 transition-colors"
                :class="confirmModal.iconBg"
              >
                <component :is="confirmModal.icon" class="h-6 w-6" :class="confirmModal.iconColor" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-bold leading-6 text-slate-900" id="modal-title">
                  {{ confirmModal.title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-slate-500 leading-relaxed">
                    {{ confirmModal.message }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-slate-50/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
            <button 
              type="button" 
              @click="onConfirm"
              class="inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-95 sm:w-auto"
              :class="confirmModal.buttonClass"
            >
              {{ confirmModal.buttonText }}
            </button>
            <button 
              type="button" 
              @click="closeConfirmModal"
              class="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all sm:mt-0 sm:w-auto"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- KONTEN UTAMA DASHBOARD -->
  <div class="space-y-8">

    <!-- Header & Jam Digital -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
      
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Dashboard</h1>
        <p class="mt-2 text-base text-slate-500">
          Rangkuman sistem ATK <span class="font-semibold text-[#009BDB]">Icon Plus</span>.
        </p>
      </div>
      
      <div class="hidden sm:flex flex-col items-end justify-center">
        <div class="flex items-center gap-2 text-sm font-bold text-slate-700">
          <CalendarDaysIcon class="h-4 w-4 text-slate-400" />
          <span>
            {{ new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
          </span>
        </div>

        <div class="flex items-center gap-1.5 mt-1">
          <span class="relative flex h-1.5 w-1.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          <span class="text-xs font-medium text-slate-500 tabular-nums tracking-wide">
            {{ currentTime }} WIB
          </span>
        </div>
      </div>
    </div>

    <!-- STATS CARDS -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Unit Aktif -->
      <div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(234,179,8,0.1)] border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(234,179,8,0.3)] hover:border-yellow-400">
        <div class="flex items-center justify-between">
          <div class="relative z-10">
             <p class="text-sm font-medium text-slate-500 group-hover:text-yellow-700 transition-colors duration-300">Unit Aktif</p>
             <p class="mt-2 text-3xl font-bold text-slate-800 tracking-tight group-hover:text-black transition-colors duration-300">{{ stats.activeUnits }}</p>
          </div>
          <div class="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600 transition-all duration-300 group-hover:bg-yellow-300 group-hover:text-red-600 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-yellow-400/50">
            <BoltSolidIcon class="h-7 w-7" />
          </div>
          <div class="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-yellow-50/50 blur-2xl transition-all duration-500 group-hover:bg-yellow-200/80"></div>
        </div>
      </div>

      <!-- Total Master ATK -->
      <div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(139,92,246,0.1)] border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(139,92,246,0.2)] hover:border-violet-200">
        <div class="flex items-center justify-between">
          <div class="relative z-10">
            <p class="text-sm font-medium text-slate-500 group-hover:text-violet-600 transition-colors">Total Master ATK</p>
            <p class="mt-2 text-3xl font-bold text-slate-800 tracking-tight group-hover:text-violet-700 transition-colors">{{ stats.totalATK }}</p>
          </div>
          <div class="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition-all duration-300 group-hover:bg-violet-500 group-hover:text-white group-hover:rotate-3 group-hover:scale-110 shadow-sm">
            <ClipboardDocumentListIcon class="h-6 w-6" />
          </div>
          <div class="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-violet-50/50 blur-2xl transition-all group-hover:bg-violet-100/50"></div>
        </div>
      </div>

      <!-- Total Stok -->
      <div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.1)] border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.2)] hover:border-emerald-200">
        <div class="flex items-center justify-between">
          <div class="relative z-10">
            <p class="text-sm font-medium text-slate-500 group-hover:text-emerald-600 transition-colors">Total Stok (Global)</p>
            <p class="mt-2 text-3xl font-bold text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">{{ stats.totalStock }}</p>
          </div>
          <div class="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:rotate-3 group-hover:scale-110 shadow-sm">
            <ArchiveBoxIcon class="h-6 w-6" />
          </div>
          <div class="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-emerald-50/50 blur-2xl transition-all group-hover:bg-emerald-100/50"></div>
        </div>
      </div>

      <!-- Stok Menipis -->
      <div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(244,63,94,0.1)] border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(244,63,94,0.2)] hover:border-rose-200">
        <div class="flex items-center justify-between">
          <div class="relative z-10">
            <p class="text-sm font-medium text-slate-500 group-hover:text-rose-600 transition-colors">Stok Menipis</p>
            <p class="mt-2 text-3xl font-bold text-rose-600 tracking-tight group-hover:text-rose-700 transition-colors">{{ stats.lowStockCount }}</p>
          </div>
          <div class="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 transition-all duration-300 group-hover:bg-rose-500 group-hover:text-white group-hover:rotate-3 group-hover:scale-110 shadow-sm">
            <ExclamationTriangleIcon class="h-6 w-6" />
          </div>
          <div class="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-rose-50/50 blur-2xl transition-all group-hover:bg-rose-100/50"></div>
        </div>
      </div>
    </div>

    <!-- MAIN GRID LAYOUT -->
    <div class="grid grid-cols-12 gap-6">

      <!-- 1. CHART: TREN PERMINTAAN -->
      <div class="col-span-12 lg:col-span-7 xl:col-span-8">
        <div class="h-full rounded-2xl bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100">
          <div class="mb-6">
            <h3 class="text-lg font-bold text-slate-800">Tren Permintaan</h3>
            <p class="text-sm text-slate-500">Statistik 6 bulan terakhir.</p>
          </div>
          <div class="-ml-2">
            <apexchart type="bar" height="350" :options="barChartOptions" :series="barChartSeries"></apexchart>
          </div>
        </div>
      </div>

      <!-- 2. CHART: KATEGORI STOK -->
      <div class="col-span-12 lg:col-span-5 xl:col-span-4">
        <div class="h-full rounded-2xl bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 flex flex-col">
          <div class="mb-4">
            <h3 class="text-lg font-bold text-slate-800">Kategori Stok</h3>
            <p class="text-sm text-slate-500">Distribusi item per kategori.</p>
          </div>
          <div class="flex-1 flex flex-col items-center justify-center py-4">
            <apexchart ref="donutChartRef" type="donut" width="300" :options="donutChartOptions" :series="donutChartSeries"></apexchart>
          </div>
          <div class="space-y-2 mt-4">
            <div 
              v-for="(cat, index) in categoryStats" 
              :key="cat.name" 
              @click="handleLegendClick(index)"
              class="group flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-all duration-200 border border-transparent hover:border-slate-200 hover:bg-slate-50"
              :class="{ 'opacity-40 grayscale': selectedCategoryIndices.length > 0 && !selectedCategoryIndices.includes(index), 'bg-slate-50 border-slate-200': selectedCategoryIndices.includes(index) }"
            >
              <div class="flex items-center gap-3">
                <span class="h-2.5 w-2.5 rounded-full ring-2 ring-white shadow-sm" :class="cat.colorClass"></span>
                <span class="text-sm font-medium text-slate-600 group-hover:text-slate-900">{{ cat.name }}</span>
              </div>
              <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md group-hover:bg-white group-hover:shadow-sm transition-all">{{ cat.percentage }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. PERMINTAAN PERSETUJUAN -->
      <div class="col-span-12 lg:col-span-7">
        <div class="h-full rounded-2xl bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 overflow-hidden flex flex-col">
          <div class="p-6 border-b border-slate-100">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-bold text-slate-800">Permintaan Persetujuan</h2>
                <p class="text-sm text-slate-500">Menunggu aksi dari Administrator.</p>
              </div>
              <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                {{ store.pendingApprovals.length }} pending
              </span>
            </div>
          </div>

          <div class="flex-1 overflow-hidden p-0">
            <div class="custom-scrollbar h-[400px] overflow-y-auto p-6 pt-0">
              <ul role="list" class="space-y-3 mt-4">
                <li v-if="store.pendingApprovals.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
                  <div class="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <DocumentCheckIcon class="h-8 w-8 text-slate-300" />
                  </div>
                  <p class="text-slate-500">Tidak ada permintaan baru.</p>
                </li>

                <li v-for="req in store.pendingApprovals" :key="req.id" class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 transition-all hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm">
                  <div class="flex items-center gap-4">
                    <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-lg shadow-sm">
                      {{ req.user.charAt(0) }}
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-900">{{ req.user }}</p>
                      <p class="text-sm font-bold text-blue-600 mt-0.5">
                        {{ req.itemName }} <span class="text-slate-400 font-normal">({{ req.itemCount }} item)</span>
                      </p>
                      <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <span class="font-medium text-slate-600">{{ req.unit }}</span> 
                        <span>•</span> 
                        Estimasi: {{ req.value }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 sm:ml-auto">
                    <button @click="handleApprovalAction(req, 'Tolak')" type="button" class="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-300 hover:bg-red-50 hover:text-red-700 hover:ring-red-200 transition-all">Tolak</button>
                    <button @click="handleApprovalAction(req, 'Setujui')" type="button" class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 transition-all">Setujui</button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. PERINGATAN STOK RENDAH -->
      <div class="col-span-12 lg:col-span-5">
        <div class="h-full rounded-2xl bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 overflow-hidden flex flex-col">
          <div class="p-6 border-b border-slate-100">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Peringatan Stok Rendah
            </h2>
            <p class="text-sm text-slate-500">Segera lakukan restock barang.</p>
          </div>
          <div class="flex-1 overflow-hidden p-0">
            <div class="custom-scrollbar h-[400px] overflow-y-auto p-6 pt-0">
              <ul role="list" class="divide-y divide-slate-100">
                <li v-if="store.lowStockItems.length === 0" class="py-12 text-center">
                  <div class="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-50 text-green-600 mb-3">
                    <CheckCircleIcon class="h-6 w-6" />
                  </div>
                  <p class="text-sm text-slate-500">Stok semua unit aman.</p>
                </li>
                <li v-for="item in store.lowStockItems" :key="item.id" class="py-4 flex items-center justify-between group hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors">
                  <div class="flex items-center gap-3 min-w-0 flex-1">
                    <div class="flex-shrink-0">
                       <div class="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                          <ExclamationTriangleIcon class="h-4 w-4" />
                       </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-sm font-medium text-slate-900">{{ item.name }}</p>
                      <p class="truncate text-xs text-slate-500">{{ item.unit }}</p>
                    </div>
                  </div>
                  <div class="text-right pl-4">
                    <p class="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{{ item.stock }} <span class="text-[10px] font-normal opacity-70">Pcs</span></p>
                    <button @click="handleRequestStock(item)" class="mt-1 text-[10px] font-semibold text-blue-600 hover:text-blue-800 hover:underline">+ Request</button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. ATK POPULER (REAL-TIME) -->
      <div class="col-span-12 lg:col-span-6">
        <div class="h-full rounded-2xl bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 overflow-hidden">
          <div class="p-6 border-b border-slate-100">
            <h3 class="text-lg font-bold text-slate-800">ATK Paling Populer</h3>
            <p class="text-sm text-slate-500">Berdasarkan frekuensi permintaan.</p>
          </div>
          <div class="custom-scrollbar h-[350px] overflow-y-auto p-6 pt-0">
            <ul role="list" class="divide-y divide-slate-100">
              <li v-if="topRequestedItems.length === 0" class="py-8 text-center text-sm text-slate-500">
                Belum ada data populer.
              </li>
              <li v-for="(item, index) in topRequestedItems" :key="item.name" class="flex items-center gap-4 py-4 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors">
                <div class="flex-shrink-0">
                  <span class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold shadow-sm ring-1 ring-inset ring-black/5" :class="index === 0 ? 'bg-yellow-100 text-yellow-700 ring-yellow-400/50' : index === 1 ? 'bg-slate-100 text-slate-600 ring-slate-300' : index === 2 ? 'bg-orange-50 text-orange-700 ring-orange-200' : 'bg-white text-slate-500'">{{ index + 1 }}</span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-slate-900">{{ item.name }}</p>
                  <p class="truncate text-xs text-slate-500">{{ item.category }}</p>
                </div>
                <div class="text-sm font-semibold text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{{ item.count }} <span class="text-[10px] font-normal text-slate-400">Reqs</span></div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 6. AKTIVITAS TERBARU (REAL-TIME) -->
      <div class="col-span-12 lg:col-span-6">
        <div class="h-full rounded-2xl bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 overflow-hidden">
          <div class="p-6 border-b border-slate-100">
             <h3 class="text-lg font-bold text-slate-800">Aktivitas Terbaru</h3>
             <p class="text-sm text-slate-500">Log barang masuk & keluar realtime.</p>
          </div>
          <div class="custom-scrollbar h-[350px] overflow-y-auto p-6 pt-0">
            <div class="relative border-l border-slate-200 ml-3 mt-4 space-y-6">
               <div v-if="recentActivity.length === 0" class="py-8 text-center text-sm text-slate-500 pl-6">
                 Belum ada aktivitas.
               </div>
               <div v-for="activity in recentActivity" :key="activity.id" class="relative pl-6 group">
                  <span class="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white shadow-sm" :class="activity.type === 'masuk' ? 'bg-green-500' : 'bg-amber-500'"></span>
                  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <div>
                      <p class="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{{ activity.item }} <span class="font-bold" :class="activity.type === 'masuk' ? 'text-green-600' : 'text-amber-600'">({{ activity.type === 'masuk' ? '+' : '-' }}{{ activity.qty }})</span></p>
                      <p class="text-xs text-slate-500 mt-0.5">{{ activity.user }} • <span class="capitalize font-medium" :class="activity.type === 'masuk' ? 'text-green-600' : 'text-amber-600'">{{ activity.type }}</span></p>
                    </div>
                    <span class="text-[10px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded whitespace-nowrap border border-slate-100">{{ activity.time }}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, shallowRef, onMounted, onUnmounted } from 'vue'; 
import VueApexCharts from 'vue3-apexcharts';
import { useInventoryStore } from '../stores/inventoryStore'; 

// Impor ikon
import {
  BoltIcon, ClipboardDocumentListIcon, ClockIcon, CalendarDaysIcon, ArchiveBoxIcon,
  ExclamationTriangleIcon, ArrowDownIcon, ArrowUpIcon, DocumentCheckIcon, TrophyIcon,
  CheckCircleIcon, XCircleIcon, XMarkIcon, QuestionMarkCircleIcon, NoSymbolIcon,
} from '@heroicons/vue/24/outline';
import { BoltIcon as BoltSolidIcon } from '@heroicons/vue/24/solid';

const store = useInventoryStore();

// =========================================================
//  State untuk Toast Notifikasi & Modal
// =========================================================
const toast = ref({ show: false, message: '', type: 'success' });
let toastTimeout = null;
const triggerToast = (message, type = 'success') => {
  if (toastTimeout) clearTimeout(toastTimeout); 
  toast.value.message = message; toast.value.type = type; toast.value.show = true;
  toastTimeout = setTimeout(() => { toast.value.show = false; }, 3000); 
};

const confirmModal = ref({ show: false, title: '', message: '', buttonText: '', buttonClass: '', icon: null, iconBg: '', iconColor: '', onConfirmAction: () => {} });
const openConfirmModal = ({ title, message, buttonText, buttonClass, icon, iconBg, iconColor, onConfirm }) => {
  confirmModal.value = { show: true, title, message, buttonText, buttonClass, icon: shallowRef(icon), iconBg, iconColor, onConfirmAction: onConfirm };
};
const closeConfirmModal = () => { confirmModal.value.show = false; };
const onConfirm = () => {
  if (typeof confirmModal.value.onConfirmAction === 'function') { confirmModal.value.onConfirmAction(); }
  closeConfirmModal();
};

const currentTime = ref('');
let timeInterval = null;
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }).replace(/\./g, ':'); 
};
onMounted(() => { updateTime(); timeInterval = setInterval(updateTime, 1000); });
onUnmounted(() => { if (timeInterval) clearInterval(timeInterval); });

// =========================================================
//  REAL-TIME STATS
// =========================================================
const stats = computed(() => {
  const activeUnits = store.units.filter(u => u.is_active === 1).length;
  const totalATK = store.atks.length;
  const totalStock = store.stocks.reduce((sum, item) => sum + item.stock, 0);
  const lowStockCount = store.lowStockItems.length; 

  let formattedStock = totalStock;
  if (totalStock > 1000) { formattedStock = (totalStock / 1000).toFixed(1).replace('.', ',') + 'k'; }

  return { activeUnits, totalATK, totalStock: formattedStock, realTotalStock: totalStock, lowStockCount };
});

// =========================================================
//  DATA & ACTIONS (REAL-TIME VIA STORE)
// =========================================================

// --- RECENT ACTIVITY COMPUTED (REAL-TIME) ---
const recentActivity = computed(() => {
  // Ambil 10 history teratas
  return store.history.slice(0, 10).map(log => {
    // Hitung waktu relatif sederhana
    let timeLabel = 'Baru saja';
    if (log.id) { // ID adalah timestamp
        const diff = Date.now() - log.id;
        const minutes = Math.floor(diff / 60000);
        if (minutes > 0 && minutes < 60) timeLabel = `${minutes} menit lalu`;
        else if (minutes >= 60 && minutes < 1440) timeLabel = `${Math.floor(minutes/60)} jam lalu`;
        else if (minutes >= 1440) timeLabel = 'Kemarin';
    }

    return {
      id: log.id,
      type: log.type === 'IN' ? 'masuk' : 'keluar',
      item: log.itemName,
      qty: log.qty,
      user: log.actor, // Nama user/actor
      time: timeLabel
    };
  });
});

// --- POPULAR ITEMS COMPUTED (REAL-TIME) ---
const topRequestedItems = computed(() => {
  // Hitung frekuensi request berdasarkan history
  const frequencyMap = {};
  
  store.history.forEach(log => {
    if (!frequencyMap[log.itemName]) {
      frequencyMap[log.itemName] = { count: 0, item_id: log.item_id };
    }
    frequencyMap[log.itemName].count += 1;
  });

  // Convert ke array dan sort
  const sortedItems = Object.keys(frequencyMap).map(name => {
    const data = frequencyMap[name];
    // Cari kategori dari master data
    let catName = '-';
    
    // STRATEGI 1: Cari berdasarkan item_id (jika ada)
    if (data.item_id) {
       const atk = store.atks.find(a => a.id === data.item_id);
       if (atk) {
         const cat = store.categories.find(c => c.id === atk.category_id);
         if (cat) catName = cat.name;
       }
    }
    
    // STRATEGI 2 (FALLBACK): Cari berdasarkan Nama jika ID gagal
    // Ini memperbaiki masalah data lama yang mungkin tidak punya ID valid
    if (catName === '-') {
       const atkByName = store.atks.find(a => a.name === name);
       if (atkByName) {
          const cat = store.categories.find(c => c.id === atkByName.category_id);
          if (cat) catName = cat.name;
       }
    }
    
    return {
      name: name,
      count: data.count,
      category: catName
    };
  }).sort((a, b) => b.count - a.count).slice(0, 5); // Ambil Top 5

  return sortedItems;
});


const handleApprovalAction = (req, action) => {
  if (action === 'Setujui') {
    openConfirmModal({
      title: 'Konfirmasi Persetujuan',
      message: `Setujui penambahan ${req.itemCount} stok untuk ${req.itemName} di ${req.unit}? Stok akan bertambah otomatis.`,
      buttonText: 'Ya, Setujui',
      buttonClass: 'bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-600',
      icon: CheckCircleIcon,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      onConfirm: () => {
        store.approveRestockRequest({
           request_id: req.id, 
           item_id: req.item_id,
           unit_id: req.unit_id,
           qty: parseInt(req.itemCount),
           user: req.user,
           price_estimate: 0 
        });
        triggerToast(`Permintaan disetujui. Stok ${req.unit} bertambah.`, 'success');
      }
    });
  } else { 
    openConfirmModal({
      title: 'Konfirmasi Penolakan',
      message: `Apakah Anda yakin ingin menolak permintaan dari ${req.user}? Tindakan ini tidak dapat dibatalkan.`,
      buttonText: 'Ya, Tolak',
      buttonClass: 'bg-red-600 hover:bg-red-700 focus-visible:outline-red-600',
      icon: NoSymbolIcon,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      onConfirm: () => {
        store.rejectRestockRequest(req.id);
        triggerToast('Permintaan telah ditolak.', 'success');
      }
    });
  }
};

const handleRequestStock = (item) => {
  openConfirmModal({
    title: 'Konfirmasi Request Stok',
    message: `Buat permintaan restock manual untuk item: ${item.name} di ${item.unit}? Permintaan ini akan masuk ke daftar persetujuan.`,
    buttonText: 'Ya, Buat Request',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-600',
    icon: QuestionMarkCircleIcon,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    onConfirm: () => {
      const newRequest = {
        id: Date.now(), 
        user: 'System Request (Admin)',
        unit: item.unit,
        unit_id: item.unit_id,
        item_id: item.item_id,
        itemName: item.name,
        itemCount: 20, 
        value: 'Estimasi System'
      };
      store.addRestockRequest(newRequest);
      triggerToast('Permintaan restock berhasil dibuat.', 'success');
    }
  });
};

// =============================================
//    CHART LOGIC
// =============================================
const totalStockNumeric = stats.value.realTotalStock; 

const categoryStats = ref([
  { name: 'Kertas & Dokumen', percentage: '45%', value: totalStockNumeric * 0.45, colorClass: 'bg-blue-600' },
  { name: 'Tinta & Toner', percentage: '25%', value: totalStockNumeric * 0.25, colorClass: 'bg-green-500' },
  { name: 'Alat Tulis', percentage: '20%', value: totalStockNumeric * 0.20, colorClass: 'bg-yellow-500' },
  { name: 'Lain-lain', percentage: '10%', value: totalStockNumeric * 0.10, colorClass: 'bg-red-500' },
]);

const requestTrendData = ref([
    { name: 'Jun', value: 300 },
    { name: 'Jul', value: 450 },
    { name: 'Ags', value: 600 },
    { name: 'Sep', value: 500 },
    { name: 'Okt', value: 750 },
    { name: 'Nov', value: 900 },
]);

// Bar Chart Options
const barChartSeries = computed(() => [{ name: 'Permintaan', data: requestTrendData.value.map(month => month.value) }]);
const barChartOptions = computed(() => ({
  chart: { type: 'bar', height: 320, fontFamily: 'Inter, sans-serif', toolbar: { show: false }, zoom: { enabled: false } },
  plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: '55%' } },
  dataLabels: { enabled: false },
  stroke: { show: false },
  xaxis: { categories: requestTrendData.value.map(month => month.name), labels: { style: { colors: '#64748b', fontSize: '12px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { labels: { style: { colors: '#64748b', fontSize: '12px' }, formatter: (val) => val.toFixed(0) } },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4, yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } },
  colors: ['#3b82f6'],
  tooltip: { y: { formatter: (val) => val + " permintaan" } }
}));

// Donut Chart Logic
const donutChartRef = ref(null);
const donutChartTotalLabel = ref('Total Item');
const donutChartTotalValue = ref(stats.value.totalStock); 
const selectedCategoryIndices = ref([]);
const calculateSelectedTotal = () => selectedCategoryIndices.value.reduce((sum, idx) => sum + categoryStats.value[idx].value, 0);
const updateCenterLabel = () => {
  const count = selectedCategoryIndices.value.length;
  if (count === 0) { donutChartTotalLabel.value = 'Total Item'; donutChartTotalValue.value = stats.value.realTotalStock.toLocaleString('id-ID'); }
  else if (count === 1) { const idx = selectedCategoryIndices.value[0]; donutChartTotalLabel.value = categoryStats.value[idx].name; donutChartTotalValue.value = categoryStats.value[idx].value.toLocaleString('id-ID'); }
  else { donutChartTotalLabel.value = 'Total Terpilih'; donutChartTotalValue.value = calculateSelectedTotal().toLocaleString('id-ID'); }
  if (donutChartRef.value) { donutChartRef.value.updateOptions({ plotOptions: { pie: { donut: { labels: { total: { label: donutChartTotalLabel.value, formatter: () => donutChartTotalValue.value } } } } } }); }
};
const updateSliceOpacity = () => {
  const selected = selectedCategoryIndices.value;
  if (!donutChartRef.value) return;
  donutChartRef.value.updateOptions({ states: { normal: { filter: { type: selected.length === 0 ? 'none' : 'lighten', value: selected.length === 0 ? 0 : 0.5 } } } });
};
const handleLegendClick = (index) => {
  const pos = selectedCategoryIndices.value.indexOf(index);
  if (pos >= 0) selectedCategoryIndices.value.splice(pos, 1); else selectedCategoryIndices.value.push(index);
  if (donutChartRef.value) donutChartRef.value.toggleDataPointSelection(index);
  updateCenterLabel(); updateSliceOpacity();
};
const donutChartSeries = computed(() => categoryStats.value.map((cat) => cat.value));
const donutChartOptions = computed(() => ({
  chart: { type: 'donut', width: 300, fontFamily: 'Inter, sans-serif', animations: { enabled: true }, events: { dataPointSelection: () => {} } },
  labels: categoryStats.value.map((cat) => cat.name),
  colors: categoryStats.value.map((cat) => {
    if (cat.colorClass === 'bg-blue-600') return '#2563EB'; if (cat.colorClass === 'bg-green-500') return '#22C55E'; if (cat.colorClass === 'bg-yellow-500') return '#EAB308'; if (cat.colorClass === 'bg-red-500') return '#EF4444'; return '#A3A3A3';
  }),
  plotOptions: { pie: { donut: { size: '75%', labels: { show: true, name: { show: true, fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#64748b', offsetY: -10 }, value: { show: true, fontSize: '20px', fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#1e293b', offsetY: 16, formatter: (val) => val }, total: { show: true, label: donutChartTotalLabel.value, color: '#64748b', formatter: () => donutChartTotalValue.value } } } } },
  legend: { show: false }, stroke: { show: true, colors: ['#ffffff'], width: 2 }, tooltip: { y: { formatter: (val) => val.toLocaleString('id-ID') + ' item' }, style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' } }, dataLabels: { enabled: false }, states: { normal: { filter: { type: 'none', value: 0 } }, active: { filter: { type: 'none' } }, hover: { filter: { type: 'lighten', value: 0.15 } } }
}));
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
.custom-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
.toast-slide-top-enter-active{ transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-slide-top-leave-active { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-slide-top-enter-from, .toast-slide-top-leave-to { opacity: 0; transform: translateY(-20px) translateX(-50%); }
.toast-fade-enter-active { transition: all 0.3s ease-out; }
.toast-fade-leave-active { transition: all 0.8s ease-in; }
.toast-fade-enter-from { opacity: 0; transform: translateY(-20px) scale(0.95); }
.toast-fade-leave-to { opacity: 0; }
</style>