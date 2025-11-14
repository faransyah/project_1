<!-- src/views/MasterATKView.vue -->
<template>
  <div class="space-y-8">
    
    <!-- 1. Header & Tombol Tambah Baru -->
    <div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div class="min-w-0 flex-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Master Data ATK</h1>
        <p class="mt-2 text-lg text-gray-600">
          Kelola semua jenis barang ATK yang tersedia di sistem.
        </p>
      </div>
      <div class="flex-shrink-0">
        <button 
          @click="openModal(null)"
          class="flex items-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          <PlusIcon class="mr-2 h-5 w-5" />
          Tambah ATK
        </button>
      </div>
    </div>

    <!-- 2. Tabel Data (Read) -->
    <div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
      <h2 class="text-lg font-semibold leading-6 text-gray-900">Daftar ATK</h2>
      <div class="mt-4 -mx-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nama Barang</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Kategori</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-if="items.length === 0">
              <td colspan="3" class="py-10 text-center text-sm text-gray-500">
                Belum ada data ATK.
              </td>
            </tr>
            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
              <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ item.name }}</td>
              <td class="px-3 py-4 text-sm text-gray-500">{{ item.category }}</td>
              <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3">
                <button @click="openModal(item)" class="text-blue-600 hover:text-blue-800">
                  Edit
                </button>
                <button @click="handleDelete(item.id)" class="text-red-600 hover:text-red-800">
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- 3. Modal Form (Create/Update) -->
  <ATKFormModal
    :show="showModal"
    :item-to-edit="selectedItem"
    @close="closeModal"
    @save="handleSave"
  />

</template>

<script setup>
import { ref } from 'vue';
import { PlusIcon } from '@heroicons/vue/24/outline';
// Pastikan path impor ini benar
import ATKFormModal from '../components/ATKFormModal.vue';

// --- DATABASE SIMULASI ---
const items = ref([
  { id: 1, name: 'Pensil 2B Faber-Castell', category: 'Alat Tulis' },
  { id: 2, name: 'Kertas A4 Sinar Dunia 80gr', category: 'Kertas & Dokumen' },
  { id: 3, name: 'Tinta Printer Epson 003 Black', category: 'Tinta & Toner' },
]);
// -------------------------

const showModal = ref(false);
const selectedItem = ref(null); 

const openModal = (item) => {
  selectedItem.value = item ? { ...item } : null;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedItem.value = null;
};

// Create & Update
const handleSave = (item) => {
  if (item.id) {
    const index = items.value.findIndex(i => i.id === item.id);
    if (index !== -1) items.value[index] = item;
  } else {
    const newId = items.value.length > 0 ? Math.max(...items.value.map(i => i.id)) + 1 : 1;
    items.value.push({ ...item, id: newId });
  }
  closeModal();
};

// Delete
const handleDelete = (itemId) => {
  if (confirm('Apakah Anda yakin ingin menghapus ATK ini? Ini mungkin mempengaruhi data stok.')) {
    items.value = items.value.filter(i => i.id !== itemId);
  }
};
</script>