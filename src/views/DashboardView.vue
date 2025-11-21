<template>
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

  <div class="space-y-8">

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

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

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

      <div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(244,63,94,0.1)] border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(244,63,94,0.2)] hover:border-rose-200">
        <div class="flex items-center justify-between">
          <div class="relative z-10">
            <p class="text-sm font-medium text-slate-500 group-hover:text-rose-600 transition-colors">Stok Menipis</p>
            <p class="mt-2 text-3xl font-bold text-rose-600 tracking-tight group-hover:text-rose-700 transition-colors">{{ lowStockItems.length }}</p>
          </div>
          <div class="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 transition-all duration-300 group-hover:bg-rose-500 group-hover:text-white group-hover:rotate-3 group-hover:scale-110 shadow-sm">
            <ExclamationTriangleIcon class="h-6 w-6" />
          </div>

          <div class="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-rose-50/50 blur-2xl transition-all group-hover:bg-rose-100/50"></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6">

      <div class="col-span-12 lg:col-span-7 xl:col-span-8">
        <div class="h-full rounded-2xl bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100">
          <div class="mb-6">
            <h3 class="text-lg font-bold text-slate-800">Tren Permintaan</h3>
            <p class="text-sm text-slate-500">Statistik 6 bulan terakhir.</p>
          </div>
          <div class="-ml-2">
            <apexchart
              type="bar"
              height="350"
              :options="barChartOptions"
              :series="barChartSeries"
            ></apexchart>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-5 xl:col-span-4">
        <div class="h-full rounded-2xl bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 flex flex-col">
          <div class="mb-4">
            <h3 class="text-lg font-bold text-slate-800">Kategori Stok</h3>
            <p class="text-sm text-slate-500">Distribusi item per kategori.</p>
          </div>
          
          <div class="flex-1 flex flex-col items-center justify-center py-4">
            <apexchart
              ref="donutChartRef"
              type="donut"
              width="300"
              :options="donutChartOptions"
              :series="donutChartSeries"
            ></apexchart>
          </div>
          
          <div class="space-y-2 mt-4">
            <div 
              v-for="(cat, index) in categoryStats" 
              :key="cat.name" 
              @click="handleLegendClick(index)"
              class="group flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-all duration-200 border border-transparent hover:border-slate-200 hover:bg-slate-50"
              :class="{ 
                'opacity-40 grayscale': selectedCategoryIndices.length > 0 && !selectedCategoryIndices.includes(index),
                'bg-slate-50 border-slate-200': selectedCategoryIndices.includes(index)
              }"
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

      <div class="col-span-12 lg:col-span-7">
        <div class="h-full rounded-2xl bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 overflow-hidden flex flex-col">
          <div class="p-6 border-b border-slate-100">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-bold text-slate-800">Permintaan Persetujuan</h2>
                <p class="text-sm text-slate-500">Menunggu aksi dari Administrator.</p>
              </div>
              <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                {{ pendingApprovals.length }} pending
              </span>
            </div>
          </div>

          <div class="flex-1 overflow-hidden p-0">
            <div class="custom-scrollbar h-[400px] overflow-y-auto p-6 pt-0">
              <ul role="list" class="space-y-3 mt-4">
                <li v-if="pendingApprovals.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
                  <div class="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <DocumentCheckIcon class="h-8 w-8 text-slate-300" />
                  </div>
                  <p class="text-slate-500">Tidak ada permintaan baru.</p>
                </li>

                <li v-for="req in pendingApprovals" :key="req.id" class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 transition-all hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm">
                  <div class="flex items-center gap-4">
                    <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xs shadow-sm">
                      {{ req.user.charAt(0) }}
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-900">{{ req.user }}</p>
                      <p class="text-xs text-slate-500 flex items-center gap-1">
                        <span class="font-medium text-slate-600">{{ req.unit }}</span> • {{ req.itemCount }} Item • {{ req.value }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 sm:ml-auto">
                    <button
                      @click="handleApprovalAction(req, 'Tolak')"
                      type="button"
                      class="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-300 hover:bg-red-50 hover:text-red-700 hover:ring-red-200 transition-all"
                    >
                      Tolak
                    </button>
                    <button
                      @click="handleApprovalAction(req, 'Setujui')"
                      type="button"
                      class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 transition-all"
                    >
                      Setujui
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

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
                <li v-if="lowStockItems.length === 0" class="py-12 text-center">
                  <div class="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-50 text-green-600 mb-3">
                    <CheckCircleIcon class="h-6 w-6" />
                  </div>
                  <p class="text-sm text-slate-500">Stok semua unit aman.</p>
                </li>

                <li v-for="item in lowStockItems" :key="item.id" class="py-4 flex items-center justify-between group hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors">
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
                    <button @click="handleRequestStock(item)" class="mt-1 text-[10px] font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                      + Request
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-6">
        <div class="h-full rounded-2xl bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 overflow-hidden">
          <div class="p-6 border-b border-slate-100">
            <h3 class="text-lg font-bold text-slate-800">ATK Paling Populer</h3>
            <p class="text-sm text-slate-500">Berdasarkan frekuensi permintaan bulan ini.</p>
          </div>
          <div class="custom-scrollbar h-[350px] overflow-y-auto p-6 pt-0">
            <ul role="list" class="divide-y divide-slate-100">
              <li v-for="(item, index) in topRequestedItems" :key="item.id" class="flex items-center gap-4 py-4 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors">
                <div class="flex-shrink-0">
                  <span class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold shadow-sm ring-1 ring-inset ring-black/5"
                    :class="index === 0 ? 'bg-yellow-100 text-yellow-700 ring-yellow-400/50' : 
                             index === 1 ? 'bg-slate-100 text-slate-600 ring-slate-300' : 
                             index === 2 ? 'bg-orange-50 text-orange-700 ring-orange-200' : 'bg-white text-slate-500'"
                  >
                    {{ index + 1 }}
                  </span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-slate-900">{{ item.name }}</p>
                  <p class="truncate text-xs text-slate-500">{{ item.category }}</p>
                </div>
                <div class="text-sm font-semibold text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                  {{ item.count }} <span class="text-[10px] font-normal text-slate-400">Reqs</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-6">
        <div class="h-full rounded-2xl bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 overflow-hidden">
          <div class="p-6 border-b border-slate-100">
             <h3 class="text-lg font-bold text-slate-800">Aktivitas Terbaru</h3>
             <p class="text-sm text-slate-500">Log barang masuk & keluar realtime.</p>
          </div>
          <div class="custom-scrollbar h-[350px] overflow-y-auto p-6 pt-0">
            <div class="relative border-l border-slate-200 ml-3 mt-4 space-y-6">
               <div v-for="activity in recentActivity" :key="activity.id" class="relative pl-6 group">
                  <span 
                    class="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white shadow-sm"
                    :class="activity.type === 'masuk' ? 'bg-green-500' : 'bg-amber-500'"
                  ></span>
                  
                  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <div>
                      <p class="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                        {{ activity.item }}
                        <span class="font-bold" :class="activity.type === 'masuk' ? 'text-green-600' : 'text-amber-600'">
                           ({{ activity.type === 'masuk' ? '+' : '-' }}{{ activity.qty }})
                        </span>
                      </p>
                      <p class="text-xs text-slate-500 mt-0.5">
                        {{ activity.user }} • <span class="capitalize font-medium" :class="activity.type === 'masuk' ? 'text-green-600' : 'text-amber-600'">{{ activity.type }}</span>
                      </p>
                    </div>
                    <span class="text-[10px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded whitespace-nowrap border border-slate-100">
                      {{ activity.time }}
                    </span>
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

// Impor ikon yang kita gunakan
import {
  BoltIcon,
  ClipboardDocumentListIcon,
  ClockIcon,      
  CalendarDaysIcon,
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

import { BoltIcon as BoltSolidIcon } from '@heroicons/vue/24/solid';

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
  }, 3000); // durasi 3 detik
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

const currentTime = ref('');
let timeInterval = null;

const updateTime = () => {
  const now = new Date();
  // Format: 14:05:30
  currentTime.value = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta' // Memastikan WIB
  }).replace(/\./g, ':'); // Mengganti titik dengan titik dua agar terlihat digital
};

// Update Lifecycle
onMounted(() => {
  // Start Jam
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  // Clear Interval Jam
  if (timeInterval) clearInterval(timeInterval);
});

// =========================================================
//  Fungsi Handlers
// =========================================================

const handleApprovalAction = (item, action) => {
  if (action === 'Setujui') {
    openConfirmModal({
      title: 'Konfirmasi Persetujuan',
      message: `Apakah Anda yakin ingin menyetujui permintaan dari ${item.user} (${item.unit})?`,
      buttonText: 'Ya, Setujui',
      buttonClass: 'bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-600',
      icon: CheckCircleIcon,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
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
      buttonClass: 'bg-red-600 hover:bg-red-700 focus-visible:outline-red-600',
      icon: NoSymbolIcon,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
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
    buttonClass: 'bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-600',
    icon: QuestionMarkCircleIcon,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
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
//    PERUBAHAN WARNA & LOGIKA DATA
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
//    PERSIAPAN DATA UNTUK APEXCHARTS
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
        colors: '#64748b', 
        fontSize: '12px',
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: {
        colors: '#64748b',
        fontSize: '12px',
      },
      formatter: function (val) {
        return val.toFixed(0);
      }
    },
  },
  grid: {
    borderColor: '#f1f5f9', 
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
  colors: ['#3b82f6'], 
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
    width: 300,
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
        size: '75%', // Lebih tipis dan elegan
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            color: '#64748b',
            offsetY: -10,
          },
          value: {
            show: true,
            fontSize: '20px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            color: '#1e293b',
            offsetY: 16,
            formatter: function (val) {
              return val
            }
          },
          total: {
            show: true,
            label: donutChartTotalLabel.value,
            color: '#64748b',
            formatter: () => donutChartTotalValue.value,
          },
        },
      },
    },
  },
  legend: {
    show: false, // Karena kamu pakai legenda custom di HTML
  },
  stroke: {
    show: true,
    colors: ['#ffffff'], // Stroke putih agar slice terpisah rapi
    width: 2
  },
  tooltip: {
    y: {
      formatter: (val) => val.toLocaleString('id-ID') + ' item',
    },
    style: {
      fontSize: '12px',
      fontFamily: 'Inter, sans-serif',
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
  width: 4px; /* Lebih tipis */
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; 
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

/* =========================================
   ANIMASI TOAST NOTIFICATION
   ========================================= */

.toast-slide-top-enter-active{
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-slide-top-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); 
}

.toast-slide-top-enter-from,
.toast-slide-top-leave-to {
  opacity: 0;
  transform: translateY(-20px) translateX(-50%); 
}

.toast-fade-enter-active {
  transition: all 0.3s ease-out;
}
.toast-fade-leave-active {
  transition: all 0.8s ease-in;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.toast-fade-leave-to {
  opacity: 0;
}
</style>