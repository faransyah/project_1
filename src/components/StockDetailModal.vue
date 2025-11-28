<template>
  <Transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative w-full max-w-2xl transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
          
          <div class="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
            <div>
              <h3 class="text-xl font-bold text-slate-800">{{ item?.name }}</h3>
              <p class="text-sm text-slate-500 font-mono mt-1">{{ item?.sku }} • {{ item?.unit }}</p>
            </div>
            <button @click="$emit('close')" class="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p class="text-xs text-blue-600 font-bold uppercase tracking-wider">Total Stok</p>
              <p class="text-2xl font-bold text-slate-800 mt-1">{{ item?.stock }} <span class="text-sm font-normal text-slate-500">{{ item?.uom }}</span></p>
            </div>
            <div class="bg-green-50 p-4 rounded-xl border border-green-100">
              <p class="text-xs text-green-600 font-bold uppercase tracking-wider">Harga Rata-rata</p>
              <p class="text-2xl font-bold text-slate-800 mt-1">Rp {{ averagePrice.toLocaleString('id-ID') }}</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p class="text-xs text-slate-500 font-bold uppercase tracking-wider">Jumlah Batch</p>
              <p class="text-2xl font-bold text-slate-800 mt-1">{{ item?.batches?.length || 0 }} <span class="text-sm font-normal text-slate-500">x Masuk</span></p>
            </div>
          </div>

          <h4 class="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <span class="bg-slate-200 w-2 h-2 rounded-full"></span>
            Rincian Harga Beli (FIFO/Batch)
          </h4>
          
          <div class="overflow-hidden rounded-lg border border-slate-200">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Tanggal Masuk</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Harga Beli</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Sisa Stok</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Total Nilai</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr v-if="!item?.batches?.length">
                   <td colspan="4" class="px-4 py-8 text-center text-sm text-slate-500 italic">Data batch tidak tersedia.</td>
                </tr>
                <tr v-for="batch in sortedBatches" :key="batch.id" class="hover:bg-slate-50 transition-colors">
                  <td class="px-4 py-3 text-sm text-slate-600 font-mono">{{ formatDate(batch.date) }}</td>
                  <td class="px-4 py-3 text-sm font-medium text-slate-800">Rp {{ batch.price.toLocaleString('id-ID') }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">
                    <span class="font-bold">{{ batch.stock }}</span> {{ item.uom }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-500 tabular-nums">
                    Rp {{ (batch.price * batch.stock).toLocaleString('id-ID') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-6 flex justify-end">
            <button type="button" @click="$emit('close')" class="rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
              Tutup
            </button>
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';
import { watch, onUnmounted } from 'vue';

const props = defineProps({
  show: Boolean,
  item: Object
});

const emit = defineEmits(['close']);

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const sortedBatches = computed(() => {
  if (!props.item?.batches) return [];
  return [...props.item.batches].sort((a, b) => new Date(b.date) - new Date(a.date));
});

const averagePrice = computed(() => {
  if (!props.item?.batches?.length) return 0;
  const totalValue = props.item.batches.reduce((sum, batch) => sum + (batch.price * batch.stock), 0);
  const totalStock = props.item.batches.reduce((sum, batch) => sum + batch.stock, 0);
  return totalStock > 0 ? Math.round(totalValue / totalStock) : 0;
});

watch(() => props.show, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>