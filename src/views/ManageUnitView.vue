<!-- src/views/ManageUnitView.vue -->
<template>
  <div class="space-y-8">
    
    <!-- 1. Header & Tombol Tambah Baru -->
    <div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div class="min-w-0 flex-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Manage Units</h1>
        <p class="mt-2 text-lg text-gray-600">
          Kelola unit terdaftar (UID, UIP, dll.) yang ada di sistem.
        </p>
      </div>
      <div class="flex-shrink-0">
        <button 
          @click="openModal(null)"
          class="flex items-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          <PlusIcon class="mr-2 h-5 w-5" />
          Tambah Unit
        </button>
      </div>
    </div>

    <!-- 2. Tabel Data (Read) -->
    <div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
      <h2 class="text-lg font-semibold leading-6 text-gray-900">Daftar Unit</h2>
      <div class="mt-4 -mx-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nama Unit</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Lokasi</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-if="units.length === 0">
              <td colspan="3" class="py-10 text-center text-sm text-gray-500">
                Belum ada data unit.
              </td>
            </tr>
            <tr v-for="unit in units" :key="unit.id" class="hover:bg-gray-50">
              <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ unit.name }}</td>
              <td class="px-3 py-4 text-sm text-gray-500">{{ unit.location }}</td>
              <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3">
                <button @click="openModal(unit)" class="text-blue-600 hover:text-blue-800">
                  Edit
                </button>
                <button @click="handleDelete(unit.id)" class="text-red-600 hover:text-red-800">
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
  <UnitFormModal
    :show="showModal"
    :unit-to-edit="selectedUnit"
    @close="closeModal"
    @save="handleSave"
  />

</template>

<script setup>
import { ref } from 'vue';
import { PlusIcon } from '@heroicons/vue/24/outline';
// Pastikan path impor ini benar
import UnitFormModal from '../components/UnitFormModal.vue';

// --- DATABASE SIMULASI ---
const units = ref([
  { id: 1, name: 'UID Jatim', location: 'Surabaya' },
  { id: 2, name: 'UID Jabar', location: 'Bandung' },
  { id: 3, name: 'UID Pusat', location: 'Jakarta' },
  { id: 4, name: 'UID Jateng', location: 'Semarang' },
  { id: 5, name: 'UID Bali', location: 'Denpasar' },
  { id: 6, name: 'UID Sulsel', location: 'Makassar' },
  { id: 7, name: 'UID Sumut', location: 'Medan' },
  { id: 8, name: 'UID Sumbar', location: 'Padang' },
  { id: 9, name: 'UID Sumsel', location: 'Palembang' },
  { id: 10, name: 'UID Kaltim', location: 'Samarinda' },
  { id: 11, name: 'UID Kalsel', location: 'Banjarmasin' },
  { id: 12, name: 'UID Kalbar', location: 'Pontianak' },
  { id: 13, name: 'UID Kalteng', location: 'Palangkaraya' },
  { id: 14, name: 'UID Papua', location: 'Jayapura' },
  { id: 15, name: 'UID Banten', location: 'Serang' },
  { id: 16, name: 'UID DIY', location: 'Yogyakarta' },
  { id: 17, name: 'UID Lampung', location: 'Bandar Lampung' },
  { id: 18, name: 'UID Riau', location: 'Pekanbaru' },
  { id: 19, name: 'UID Kepri', location: 'Tanjung Pinang' },
  { id: 20, name: 'UID Aceh', location: 'Banda Aceh' },
  { id: 21, name: 'UID NTB', location: 'Mataram' },
  { id: 22, name: 'UID NTT', location: 'Kupang' },
  { id: 23, name: 'UID Sulut', location: 'Manado' },
  { id: 24, name: 'UID Sulteng', location: 'Palu' },
  { id: 25, name: 'UID Sultra', location: 'Kendari' },
  { id: 26, name: 'UID Maluku', location: 'Ambon' },
  { id: 27, name: 'UID Malut', location: 'Ternate' },
  { id: 28, name: 'UID Gorontalo', location: 'Gorontalo' },
  { id: 29, name: 'UID Babel', location: 'Pangkal Pinang' },
  { id: 30, name: 'UID Kaltara', location: 'Tanjung Selor' },
]);
// -------------------------

const showModal = ref(false);
const selectedUnit = ref(null); 

const openModal = (unit) => {
  // Kirim "copy" dari data, bukan referensi aslinya
  selectedUnit.value = unit ? { ...unit } : null;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedUnit.value = null;
};

// Create & Update
const handleSave = (unit) => {
  if (unit.id) {
    // UPDATE
    const index = units.value.findIndex(u => u.id === unit.id);
    if (index !== -1) units.value[index] = unit;
  } else {
    // CREATE
    const newId = units.value.length > 0 ? Math.max(...units.value.map(u => u.id)) + 1 : 1;
    units.value.push({ ...unit, id: newId });
  }
  closeModal();
};

// Delete
const handleDelete = (unitId) => {
  // Di aplikasi nyata, ganti 'confirm' dengan modal konfirmasi yang cantik
  if (confirm('Apakah Anda yakin ingin menghapus unit ini?')) {
    units.value = units.value.filter(u => u.id !== unitId);
  }
};
</script>