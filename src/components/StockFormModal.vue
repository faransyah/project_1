<template>
  <Transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 z-[70]" role="dialog" aria-modal="true">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative w-full max-w-lg transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
          
          <div class="flex justify-between items-center mb-5">
            <h3 class="text-lg font-bold leading-6 text-slate-900">
              {{ stockToEdit ? 'Restock / Edit Barang' : 'Tambah Item Baru' }}
            </h3>
            <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600">
              <span class="text-2xl">&times;</span>
            </button>
          </div>

          <form @submit.prevent="submitForm" class="space-y-4">
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nama Barang</label>
              <select v-model="form.atkId" required :disabled="!!stockToEdit"
                class="block w-full rounded-lg border-slate-300 bg-slate-50 border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 disabled:opacity-60 disabled:cursor-not-allowed">
                <option value="" disabled>-- Pilih Barang --</option>
                <option v-for="atk in atkOptions" :key="atk.id" :value="atk.id">
                  {{ atk.sku }} - {{ atk.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Unit / Lokasi</label>
              <select v-model="form.unitId" required :disabled="!!stockToEdit"
                class="block w-full rounded-lg border-slate-300 bg-slate-50 border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 disabled:opacity-60 disabled:cursor-not-allowed">
                <option value="" disabled>-- Pilih Unit --</option>
                <option v-for="unit in unitOptions" :key="unit.id" :value="unit.id">
                  {{ unit.name }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  {{ stockToEdit ? 'Tambah Stok (Qty Masuk)' : 'Stok Awal' }}
                </label>
                <div class="relative">
                  <input type="number" v-model="form.stock" required min="0"
                    class="block w-full rounded-lg border-slate-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3">
                   <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span class="text-slate-400 text-xs font-bold">Pcs</span>
                   </div>
                </div>
                <p v-if="stockToEdit" class="text-[10px] text-blue-600 mt-1">*Isi 0 jika hanya ingin update batas minim.</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Batas Minim (Alert)</label>
                <input type="number" v-model="form.threshold" required min="1"
                  class="block w-full rounded-lg border-slate-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Harga Beli Satuan (Rp)</label>
              <div class="relative rounded-md shadow-sm">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span class="text-slate-500 sm:text-sm">Rp</span>
                </div>
                <input type="number" v-model="form.price" required min="0"
                  class="block w-full rounded-lg border-slate-300 border pl-10 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
              </div>
              <p class="text-[10px] text-slate-500 mt-1" v-if="stockToEdit">
                *Harga baru ini akan dirata-rata dengan stok lama (Batch System).
              </p>
            </div>

            <div class="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" @click="$emit('close')" class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                Batal
              </button>
              <button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                Simpan
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'; // 1. Import digabung jadi satu baris

const props = defineProps({
  show: Boolean,
  stockToEdit: Object, 
  atkOptions: Array,   
  unitOptions: Array   
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  id: null, atkId: '', unitId: '', stock: 0, threshold: 10, price: 0
});

// 2. Watcher digabung (Logic Reset Form + Logic Kunci Scroll)
watch(() => props.show, (isOpen) => {
  if (isOpen) {
    // A. Kunci Scroll Body
    document.body.style.overflow = 'hidden'; 
    
    // B. Logic Reset Form
    if (props.stockToEdit) {
      // MODE EDIT/RESTOCK: Isi form, tapi stock 0
      form.value = { 
        ...props.stockToEdit, 
        stock: 0 
      }; 
    } else {
      // MODE BARU: Reset kosong
      form.value = { id: null, atkId: '', unitId: '', stock: 0, threshold: 10, price: 0 };
    }
  } else {
    // C. Lepas Kunci Scroll saat modal tutup
    document.body.style.overflow = ''; 
  }
});

const submitForm = () => {
  emit('save', form.value);
};

// 3. Lifecycle Hook (Jaga-jaga)
onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>