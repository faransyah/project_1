<!-- src/components/ATKFormModal.vue -->
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
            <ClipboardDocumentListIcon class="h-6 w-6 text-blue-700" />
          </div>
          <div class="ml-4 text-left">
            <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
              {{ isEditing ? 'Edit Master ATK' : 'Tambah ATK Baru' }}
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Masukkan detail untuk master barang ATK.
            </p>
          </div>
          <button @click="onClose" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Body Form -->
        <div class="p-6 space-y-4">
          
          <!-- Baris 1: Nama Barang -->
          <div>
            <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Nama Barang</label>
            <div class="relative mt-2">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <PencilIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input 
                v-model="localItem.name"
                type="text" 
                id="name" 
                required
                class="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                placeholder="cth: Kertas A4 Sinar Dunia 80gr"
              />
            </div>
          </div>

          <!-- Baris 2: Kategori -->
          <div>
            <label for="category" class="block text-sm font-medium leading-6 text-gray-900">Kategori</label>
            <div class="relative mt-2">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <TagIcon class="h-5 w-5 text-gray-400" />
              </div>
              <select 
                v-model="localItem.category"
                id="category" 
                required
                class="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
              >
                <option value="Alat Tulis">Alat Tulis</option>
                <option value="Kertas & Dokumen">Kertas & Dokumen</option>
                <option value="Tinta & Toner">Tinta & Toner</option>
                <option value="Lain-lain">Lain-lain</option>
              </select>
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
  ClipboardDocumentListIcon,
  PencilIcon,
  TagIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
  show: Boolean,
  itemToEdit: Object,
});

const emit = defineEmits(['close', 'save']);

const localItem = ref({});
const isEditing = computed(() => !!localItem.value.id);

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.itemToEdit) {
      localItem.value = { ...props.itemToEdit };
    } else {
      // Default ke kategori paling umum
      localItem.value = { name: '', category: 'Alat Tulis' };
    }
  }
});

const onClose = () => {
  emit('close');
};

const onSave = () => {
  emit('save', localItem.value);
};
</script>