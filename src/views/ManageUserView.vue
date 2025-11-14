<!-- src/views/ManageUserView.vue -->
<template>
  <div class="space-y-8">
    
    <!-- 1. Header & Tombol Tambah Baru -->
    <div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div class="min-w-0 flex-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Manage Users</h1>
        <p class="mt-2 text-lg text-gray-600">
          Kelola pengguna yang dapat mengakses sistem.
        </p>
      </div>
      <div class="flex-shrink-0">
        <button 
          @click="openModal(null)"
          class="flex items-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          <PlusIcon class="mr-2 h-5 w-5" />
          Tambah User
        </button>
      </div>
    </div>

    <!-- 2. Tabel Data (Read) -->
    <div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
      <h2 class="text-lg font-semibold leading-6 text-gray-900">Daftar Pengguna</h2>
      <div class="mt-4 -mx-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nama</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Email</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Peran</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-if="users.length === 0">
              <td colspan="4" class="py-10 text-center text-sm text-gray-500">
                Belum ada data pengguna.
              </td>
            </tr>
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                {{ user.name }}
                <dl class="font-normal lg:hidden">
                  <dt class="sr-only">Email</dt>
                  <dd class="mt-1 truncate text-gray-500">{{ user.email }}</dd>
                </dl>
              </td>
              <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ user.email }}</td>
              <td class="px-3 py-4 text-sm text-gray-500">
                <span class="inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium"
                  :class="user.role === 'Admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3">
                <button @click="openModal(user)" class="text-blue-600 hover:text-blue-800">
                  Edit
                </button>
                <button @click="handleDelete(user.id)" class="text-red-600 hover:text-red-800">
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
  <UserFormModal
    :show="showModal"
    :user-to-edit="selectedUser"
    @close="closeModal"
    @save="handleSave"
  />

</template>

<script setup>
import { ref } from 'vue';
import { PlusIcon } from '@heroicons/vue/24/outline';
import UserFormModal from '../components/UserFormModal.vue';

// --- DATABASE SIMULASI (DI-UPDATE DENGAN PASSWORD) ---
const users = ref([
  { id: 1, name: 'Admin Utama', email: 'admin@pln.co.id', role: 'Admin', password: 'password-admin' },
  { id: 2, name: 'Budi (UID Jatim)', email: 'budi.jatim@pln.co.id', role: 'User', password: 'password-budi' },
  { id: 3, name: 'Citra (UID Jabar)', email: 'citra.jabar@pln.co.id', role: 'User', password: 'password-citra' },
]);
// ------------------------------------------------

const showModal = ref(false);
const selectedUser = ref(null); 

const openModal = (user) => {
  selectedUser.value = user ? { ...user } : null;
  showModal.value = true;
};

// --- INI PERBAIKAN DARI ERROR SEBELUMNYA (TIDAK ADA TITIK) ---
const closeModal = () => {
  showModal.value = false;
  selectedUser.value = null;
};

// Create & Update (LOGIKA DI-UPDATE)
const handleSave = (userFromModal) => {
  if (userFromModal.id) {
    // --- UPDATE ---
    const index = users.value.findIndex(u => u.id === userFromModal.id);
    if (index !== -1) {
      // Me-merge data lama dengan data baru
      // Jika 'userFromModal' tidak punya key 'password' (karena dikosongkan), 
      // password lama akan tetap dipertahankan.
      users.value[index] = { ...users.value[index], ...userFromModal };
    }
  } else {
    // --- CREATE ---
    const newId = users.value.length > 0 ? Math.max(...users.value.map(u => u.id)) + 1 : 1;
    users.value.push({ ...userFromModal, id: newId });
  }
  closeModal();
};

// Delete
const handleDelete = (userId) => {
  if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
    users.value = users.value.filter(u => u.id !== userId);
  }
};
</script>