<!-- src/components/StockFormModal.vue -->
<template>
  <!-- Overlay -->
  <div v-if="show" @click="onClose" class="fixed inset-0 z-40 bg-gray-900 bg-opacity-75 transition-opacity"></div>

  <!-- Modal Panel -->
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="relative w-full max-w-lg rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5" @click.stop>
      
      <form @submit.prevent="onSave">
        <!-- Header Modal dengan Ikon -->
        <div class="flex items-start border-b border-gray-200 p-6">
          <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:h-10 sm:w-10">
            <ArchiveBoxIcon class="h-6 w-6 text-blue-700" />
          </div>
          <div class="ml-4 text-left">
            <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
              {{ isEditing ? 'Edit Entri Stok' : 'Tambah Entri Stok' }}
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ isEditing ? 'Sesuaikan harga atau jumlah stok untuk item ini.' : 'Buat entri baru untuk item di unit tertentu.' }}
            </p>
          </div>
          <button @click="onClose" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Body Form -->
        <div class="p-6 space-y-4">
          
          <!-- Baris 1: Barang ATK -->
          <div>
            <label for="atk" class="block text-sm font-medium leading-6 text-gray-900">Barang ATK</label>
            <div class="relative mt-2">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <ClipboardDocumentListIcon class="h-5 w-5 text-gray-400" />
              </div>
              <select 
                v-model="localEntry.atkId"
                id="atk" 
                required
                class="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
              >
                <option disabled value="">Pilih barang</option>
                <option v-for="atk in atkOptions" :key="atk.id" :value="atk.id">
                  {{ atk.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Baris 2: Unit -->
          <div>
            <label for="unit" class="block text-sm font-medium leading-6 text-gray-900">Unit</label>
            <div class="relative mt-2">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <BuildingOfficeIcon class="h-5 w-5 text-gray-400" />
              </div>
              <select 
                v-model="localEntry.unitId"
                id="unit" 
                required
                class="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
              >
                <option disabled value="">Pilih unit</option>
                <option v-for="unit in unitOptions" :key="unit.id" :value="unit.id">
                  {{ unit.name }}
                </option>
              </select>
            </div>
          </div>
          
          <!-- Baris 3: Harga & Stok (Side-by-side) -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="price" class="block text-sm font-medium leading-6 text-gray-900">Harga</label>
              <div class="relative mt-2">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span class="text-gray-500 sm:text-sm">Rp</span>
                </div>
                <input 
                  v-model.number="localEntry.price"
                  type="number" 
                  name="price"
                  id="price" 
                  required
                  class="block w-full rounded-md border-0 py-2.5 pl-9 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <label for="stock" class="block text-sm font-medium leading-6 text-gray-900">Stok</label>
              <div class="relative mt-2">
                <input 
                  v-model.number="localEntry.stock"
                  type="number" 
                  name="stock"
                  id="stock" 
                  required
                  class="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  placeholder="0"
                  min="0"
                />
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span class="text-gray-500 sm:text-sm">Pcs</span>
                </div>
              </div>
            </div>
          </div>

        </div>
        
        <!-- Footer Modal -->
        <div class="flex justify-end space-x-3 border-t border-gray-200 bg-gray-50 p-6 rounded-b-2xl">
          <button type="button" @click="onClose" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Batal
          </button>
          <button type="submit" class="rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800">
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
// Impor ikon untuk form
import { 
  ArchiveBoxIcon, 
  XMarkIcon, 
  ClipboardDocumentListIcon, 
  BuildingOfficeIcon 
} from '@heroicons/vue/24/outline';

const props = defineProps({
  show: Boolean,
  stockToEdit: Object,
  atkOptions: Array, // Menerima list ATK
  unitOptions: Array, // Menerima list Unit
});

const emit = defineEmits(['close', 'save']);

const localEntry = ref({});
const isEditing = computed(() => !!localEntry.value.id);

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.stockToEdit) {
      localEntry.value = { ...props.stockToEdit };
    } else {
      localEntry.value = { atkId: '', unitId: '', price: 0, stock: 0 };
    }
  }
});

const onClose = () => {
  emit('close');
};

const onSave = () => {
  // Validasi sederhana
  if (localEntry.value.price < 0 || localEntry.value.stock < 0) {
    alert("Harga dan Stok tidak boleh minus.");
    return;
  }
  emit('save', localEntry.value);
};
</script>