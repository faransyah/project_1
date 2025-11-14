<!-- src/components/UserFormModal.vue -->
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
            <UserCircleIcon class="h-6 w-6 text-blue-700" />
          </div>
          <div class="ml-4 text-left">
            <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
              {{ isEditing ? 'Edit User' : 'Tambah User Baru' }}
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Masukkan detail untuk pengguna sistem.
            </p>
          </div>
          <button @click="onClose" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Body Form -->
        <div class="p-6 space-y-4">
          
          <!-- Baris 1: Nama -->
          <div>
            <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Nama</label>
            <div class="relative mt-2">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UserIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input 
                v-model="localUser.name"
                type="text" 
                id="name" 
                required
                class="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                placeholder="cth: Budi Santoso"
              />
            </div>
          </div>

          <!-- Baris 2: Email -->
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
            <div class="relative mt-2">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <EnvelopeIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input 
                v-model="localUser.email"
                type="email" 
                id="email" 
                required
                class="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                placeholder="cth: budi@pln.co.id"
              />
            </div>
          </div>

          <!-- Baris 3: Peran -->
          <div>
            <label for="role" class="block text-sm font-medium leading-6 text-gray-900">Peran</label>
            <div class="relative mt-2">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <ShieldCheckIcon class="h-5 w-5 text-gray-400" />
              </div>
              <select 
                v-model="localUser.role"
                id="role" 
                required
                class="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <!-- Baris 4: Password (PERUBAHAN DI SINI) -->
          <div>
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div class="relative mt-2">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input 
                v-model="localUser.password"
                :type="passwordFieldType" 
                id="password" 
                class="block w-full rounded-md border-0 py-2.5 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                :placeholder="isEditing ? 'Kosongkan jika tidak diubah' : ''"
                :readonly="!isEditing"
                :class="{ 'bg-gray-100 text-gray-500 cursor-not-allowed': !isEditing }"
              />
              <!-- Tombol Show/Hide HANYA muncul saat mode EDIT -->
              <button 
                v-if="isEditing"
                type="button" 
                @click="showPassword = !showPassword" 
                class="absolute inset-y-0 right-0 flex items-center pr-3"
                aria-label="Toggle password visibility"
              >
                <component :is="showPassword ? EyeSlashIcon : EyeIcon" class="h-5 w-5 text-gray-500" />
              </button>
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
import { 
  UserCircleIcon,
  UserIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  XMarkIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
  show: Boolean,
  userToEdit: Object,
});

const emit = defineEmits(['close', 'save']);

const localUser = ref({});
const isEditing = computed(() => !!localUser.value.id);

// --- Logika Show/Hide Password ---
const showPassword = ref(false);
// PERUBAHAN: Saat !isEditing (mode Create), tipe = 'text' agar '123' terlihat.
// Saat isEditing (mode Update), gunakan logika show/hide.
const passwordFieldType = computed(() => (isEditing.value && !showPassword.value) ? 'password' : 'text');
// ---------------------------------

watch(() => props.show, (newVal) => {
  if (newVal) {
    showPassword.value = false;
    if (props.userToEdit) {
      // Mode Edit: Salin data, KOSONGKAN PASSWORD
      localUser.value = { ...props.userToEdit, password: '' };
    } else {
      // PERUBAHAN: Mode Tambah: Reset form, ISI PASSWORD '123'
      localUser.value = { name: '', email: '', role: 'User', password: '123' };
    }
  }
});

const onClose = () => {
  emit('close');
};

const onSave = () => {
  // Salin data lokal untuk dimodifikasi
  const dataToSave = { ...localUser.value };

  if (isEditing.value) {
    // --- MODE EDIT ---
    if (!dataToSave.password || dataToSave.password.trim() === '') {
      // Jika admin tidak mengetik password baru, hapus field password
      // agar password lama di database (parent) tidak tertimpa string kosong.
      delete dataToSave.password;
    }
  } 
  // PERUBAHAN: Tidak perlu blok 'else' (mode Create) lagi.
  // 'dataToSave.password' akan selalu berisi '123' karena sudah di-set di 'watch'
  // dan field-nya readonly.

  // Kirim data yang sudah bersih ke parent
  emit('save', dataToSave);
};
</script>