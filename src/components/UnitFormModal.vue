<template>
  <!-- Gunakan Teleport agar modal dirender di body (luar layout utama) -->
  <Teleport to="body">
    
    <!-- Overlay Gelap & Blur (Z-Index sangat tinggi) -->
    <div 
      v-if="show" 
      @click="onClose" 
      class="fixed inset-0 z-[999] bg-slate-900/75 backdrop-blur-sm transition-opacity"
    ></div>

    <!-- Modal Panel Container (Z-Index tertinggi) -->
    <div 
      v-if="show" 
      class="fixed inset-0 z-[1000] flex items-center justify-center p-4"
    >
      <div class="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all ring-1 ring-slate-900/5" @click.stop>
        
        <form @submit.prevent="onSave">
          <!-- Header Modal -->
          <div class="flex items-start border-b border-slate-100 p-6 bg-slate-50/50">
            <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 ring-4 ring-blue-50">
              <BuildingOfficeIcon class="h-6 w-6" aria-hidden="true" />
            </div>
            <div class="ml-4 flex-1">
              <h3 class="text-lg font-bold leading-6 text-slate-900" id="modal-title">
                {{ isEditing ? 'Edit Data Unit' : 'Registrasi Unit Baru' }}
              </h3>
              <p class="mt-1 text-sm text-slate-500">
                Lengkapi informasi detail unit operasional PLN di bawah ini.
              </p>
            </div>
            <button 
              type="button"
              @click="onClose" 
              class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span class="sr-only">Close</span>
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>

          <!-- Body Form (Scrollable jika layar kecil) -->
          <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            
            <!-- Row 1: Ref ID & Parent ID -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <!-- Ref ID -->
               <div>
                <div class="flex justify-between">
                  <label for="ref_id" class="block text-sm font-bold leading-6 text-slate-700">
                    Ref ID <span class="text-red-500">*</span>
                  </label>
                  <span class="text-xs leading-6" :class="localUnit.ref_id?.length >= 10 ? 'text-red-500 font-bold' : 'text-slate-400'">
                    {{ localUnit.ref_id?.length || 0 }}/10
                  </span>
                </div>
                <div class="relative mt-2">
                  <input 
                    v-model="localUnit.ref_id"
                    type="text" 
                    id="ref_id" 
                    maxlength="10"
                    required
                    class="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow"
                    placeholder="cth: 1001"
                  />
                </div>
                <p class="mt-1 text-xs text-slate-500">Kode referensi unik (SAP/Legacy).</p>
              </div>
              
               <!-- Parent ID -->
               <div>
                <label for="parent_id" class="block text-sm font-bold leading-6 text-slate-700">
                  Parent ID <span class="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <div class="relative mt-2">
                  <input 
                    v-model.number="localUnit.parent_id"
                    type="number" 
                    id="parent_id" 
                    min="0"
                    class="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow"
                    placeholder="0"
                  />
                </div>
                <p class="mt-1 text-xs text-slate-500">ID Unit atasan. Isi <strong>0</strong> jika unit ini adalah Unit Induk.</p>
              </div>
            </div>

            <!-- Row 2: Alias & Telepon -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- Alias -->
              <div>
                <div class="flex justify-between">
                  <label for="alias" class="block text-sm font-bold leading-6 text-slate-700">
                    Alias Unit <span class="text-red-500">*</span>
                  </label>
                  <span class="text-xs leading-6" :class="localUnit.alias?.length >= 20 ? 'text-red-500 font-bold' : 'text-slate-400'">
                    {{ localUnit.alias?.length || 0 }}/20
                  </span>
                </div>
                <div class="relative mt-2">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <TagIcon class="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    v-model="localUnit.alias"
                    type="text" 
                    id="alias" 
                    maxlength="20"
                    required
                    class="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow"
                    placeholder="cth: UID Jatim"
                  />
                </div>
                <p class="mt-1 text-xs text-slate-500">Nama singkatan unit.</p>
              </div>

               <!-- Telepon -->
               <div>
                <label for="phone" class="block text-sm font-bold leading-6 text-slate-700">
                  Nomor Telepon <span class="text-red-500">*</span>
                </label>
                <div class="relative mt-2">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <PhoneIcon class="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    :value="localUnit.phone"
                    @input="filterPhoneInput"
                    type="text" 
                    id="phone" 
                    maxlength="20"
                    required
                    class="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow"
                    placeholder="cth: (031) 5340651"
                  />
                </div>
                <p class="mt-1 text-xs text-slate-500">Hanya angka dan simbol (+, -).</p>
              </div>
            </div>

            <!-- Row 3: Nama Unit -->
            <div>
              <div class="flex justify-between">
                <label for="name" class="block text-sm font-bold leading-6 text-slate-700">
                  Nama Lengkap Unit <span class="text-red-500">*</span>
                </label>
                <span class="text-xs leading-6" :class="localUnit.name?.length >= 100 ? 'text-red-500 font-bold' : 'text-slate-400'">
                  {{ localUnit.name?.length || 0 }}/100
                </span>
              </div>
              <div class="relative mt-2">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <BuildingOfficeIcon class="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  v-model="localUnit.name"
                  type="text" 
                  id="name" 
                  maxlength="100"
                  required
                  class="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow"
                  placeholder="cth: PT PLN (Persero) Unit Induk Distribusi Jawa Timur"
                />
              </div>
            </div>

            <!-- Row 4: Alamat -->
            <div>
              <div class="flex justify-between">
                <label for="address" class="block text-sm font-bold leading-6 text-slate-700">
                  Alamat Lengkap <span class="text-red-500">*</span>
                </label>
                <span class="text-xs leading-6" :class="localUnit.address?.length >= 255 ? 'text-red-500 font-bold' : 'text-slate-400'">
                  {{ localUnit.address?.length || 0 }}/255
                </span>
              </div>
              <div class="relative mt-2">
                <div class="absolute top-3 left-3 pointer-events-none">
                  <MapPinIcon class="h-5 w-5 text-slate-400" />
                </div>
                <textarea 
                  v-model="localUnit.address"
                  id="address" 
                  required
                  maxlength="255"
                  rows="3"
                  class="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow resize-none"
                  placeholder="Masukkan alamat lengkap kantor unit..."
                ></textarea>
              </div>
            </div>

            <!-- Row 5: Status Toggle -->
            <div class="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div class="flex flex-col">
                <span class="text-sm font-bold text-slate-700">Status Operasional</span>
                <span class="text-xs text-slate-500">Non-aktifkan jika unit sudah tidak beroperasi.</span>
              </div>
              
              <button 
                type="button" 
                @click="localUnit.is_active = localUnit.is_active ? 0 : 1"
                class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                :class="localUnit.is_active ? 'bg-green-500' : 'bg-slate-200'"
              >
                <span class="sr-only">Toggle status</span>
                <span 
                  aria-hidden="true" 
                  class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="localUnit.is_active ? 'translate-x-5' : 'translate-x-0'"
                >
                  <span class="absolute inset-0 flex items-center justify-center transition-opacity" :class="localUnit.is_active ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'">
                     <svg class="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 12 12"><path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" /></svg>
                  </span>
                </span>
              </button>
            </div>

            <!-- SECTION DETAIL: Jejak Sistem (Audit Trail) -->
            <div v-if="isEditing" class="bg-slate-50 rounded-xl p-5 border border-slate-200 mt-4">
              <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ClockIcon class="h-4 w-4" />
                Jejak Sistem (Audit Trail)
              </h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <!-- Created Info -->
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] uppercase text-slate-400 font-semibold tracking-wide">Dibuat Oleh</span>
                  <div class="flex items-center gap-2">
                    <div class="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      {{ (localUnit.created_by || 'SYS').substring(0,2).toUpperCase() }}
                    </div>
                    <span class="text-sm font-medium text-slate-700">{{ localUnit.created_by || 'System' }}</span>
                  </div>
                  <span class="text-xs text-slate-500 mt-0.5">{{ localUnit.created_at || '-' }}</span>
                </div>

                <!-- Updated Info -->
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] uppercase text-slate-400 font-semibold tracking-wide">Terakhir Diupdate</span>
                  <div class="flex items-center gap-2">
                    <div class="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                      {{ (localUnit.updated_by || 'ADM').substring(0,2).toUpperCase() }}
                    </div>
                    <span class="text-sm font-medium text-slate-700">{{ localUnit.updated_by || 'Administrator' }}</span>
                  </div>
                  <span class="text-xs text-slate-500 mt-0.5">{{ localUnit.updated_at || 'Baru saja' }}</span>
                </div>
              </div>
            </div>
            
          </div>
          
          <!-- Footer Modal -->
          <div class="flex items-center justify-end gap-3 bg-slate-50 px-6 py-4 border-t border-slate-100">
            <button 
              type="button" 
              @click="onClose" 
              class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
            >
              Batal
            </button>
            
            <!-- TOMBOL SIMPAN (Validasi: Harus Modified DAN Valid) -->
            <button 
              type="submit" 
              :disabled="!isModified || !isValid"
              class="rounded-lg px-6 py-2.5 text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
              :class="(!isModified || !isValid) 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md focus:ring-blue-500'"
            >
              {{ isEditing ? 'Simpan Perubahan' : 'Tambah Unit' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue';
import { 
  BuildingOfficeIcon,
  MapPinIcon,
  XMarkIcon,
  TagIcon,
  PhoneIcon,
  ClockIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  show: Boolean,
  unitToEdit: Object, 
});

const emit = defineEmits(['close', 'save']);

// State lokal untuk form
const localUnit = ref({});
// Simpan data asli untuk perbandingan perubahan
const originalUnit = ref({});

const isEditing = computed(() => !!localUnit.value.id);

// --- VALIDASI & FORMATTING INPUT ---

// Filter Input Telepon: Hanya angka dan simbol +, -, (, ), spasi
const filterPhoneInput = (event) => {
  const rawValue = event.target.value;
  // Regex: Hapus semua karakter KECUALI angka, plus, minus, kurung, dan spasi
  const filteredValue = rawValue.replace(/[^0-9+\-\(\)\s]/g, '');
  
  // Update nilai di state
  localUnit.value.phone = filteredValue;
  
  // Paksa update value di elemen input jika ada karakter yang dihapus
  if (rawValue !== filteredValue) {
    event.target.value = filteredValue;
  }
};

// Cek apakah form valid (Semua kolom wajib terisi)
const isValid = computed(() => {
  return localUnit.value.ref_id?.trim().length > 0 && // Ref ID wajib
         localUnit.value.alias?.trim().length > 0 &&
         localUnit.value.name?.trim().length > 0 &&
         localUnit.value.phone?.trim().length > 0 &&
         localUnit.value.address?.trim().length > 0;
});

// Computed Property: Mengecek apakah ada perubahan field apapun
const isModified = computed(() => {
  // Mode TAMBAH: Tombol selalu nyala (return true) asalkan valid
  if (!isEditing.value) return true;

  // Mode EDIT: Cek apakah field berbeda dari data asli
  return localUnit.value.alias !== originalUnit.value.alias || 
         localUnit.value.name !== originalUnit.value.name || 
         localUnit.value.phone !== originalUnit.value.phone || 
         localUnit.value.address !== originalUnit.value.address || 
         localUnit.value.is_active !== originalUnit.value.is_active ||
         localUnit.value.ref_id !== originalUnit.value.ref_id ||
         localUnit.value.parent_id !== originalUnit.value.parent_id;
});

// Watcher: Reset/Isi form saat modal dibuka DAN Kunci Scroll Body
watch(() => props.show, (newVal) => {
  if (newVal) {
    // LOCK SCROLL BODY saat modal buka
    document.body.style.overflow = 'hidden';

    if (props.unitToEdit) {
      // Mode Edit: Salin data ke form DAN simpan snapshot data asli
      localUnit.value = { ...props.unitToEdit };
      originalUnit.value = { ...props.unitToEdit };
    } else {
      // Mode Tambah: Reset form dengan nilai default
      localUnit.value = { 
        ref_id: '',
        parent_id: 0,
        alias: '', 
        name: '', 
        address: '', 
        phone: '', 
        is_active: 1 // Default Aktif
      };
      originalUnit.value = {};
    }
  } else {
    // UNLOCK SCROLL BODY saat modal tutup
    document.body.style.overflow = '';
  }
});

// Pastikan scroll dilepas jika komponen di-unmount
onUnmounted(() => {
  document.body.style.overflow = '';
});

const onClose = () => {
  emit('close');
};

const onSave = () => {
  // Extra guard: Pastikan valid sebelum emit
  if (isValid.value) {
    emit('save', localUnit.value);
  }
};
</script>

<style scoped>
/* Scrollbar kustom untuk area form jika konten panjang */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; 
}
</style>