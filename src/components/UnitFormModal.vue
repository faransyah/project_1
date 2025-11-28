<template>
  <Teleport to="body">
    <!-- Overlay Gelap & Blur -->
    <div v-if="show" @click="onClose" class="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"></div>

    <!-- Modal Panel Container -->
    <div v-if="show" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
      
      <!-- Modal Frame -->
      <div class="relative w-full max-w-4xl h-[85vh] transform overflow-hidden rounded-2xl bg-slate-50 text-left shadow-2xl transition-all ring-1 ring-slate-900/5 flex flex-col" @click.stop>
        
        <!-- Header (Fixed) -->
        <div class="flex items-center justify-between border-b border-slate-200 px-8 py-5 bg-white z-20 flex-shrink-0 shadow-sm relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <div class="flex items-center gap-5 relative">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 ring-1 ring-white">
              <BuildingOfficeIcon class="h-8 w-8" />
            </div>
            <div>
              <h3 class="text-xl font-extrabold leading-6 text-slate-800 tracking-tight">
                {{ isEditing ? 'Edit Data Unit' : 'Registrasi Unit Baru' }}
              </h3>
              <p class="text-sm text-slate-500 mt-0.5 font-medium">
                Kelola detail unit operasional dan struktur organisasi.
              </p>
            </div>
          </div>
          <button 
            @click="onClose" 
            class="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
            title="Tutup Modal"
          >
            <XMarkIcon class="h-7 w-7" />
          </button>
        </div>

        <!-- Body Form (Scrollable) -->
        <div class="p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/80">
          <form @submit.prevent="onSave" class="space-y-8 max-w-5xl mx-auto pb-10">
            
            <!-- SECTION 1: IDENTITAS UNIT -->
            <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
              <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                <InformationCircleIcon class="h-5 w-5 text-emerald-600" />
                Identitas Utama
              </h4>
              
              <div class="space-y-6">
                  <!-- Row 1 -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-2">
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Ref ID <span class="text-red-500">*</span></label>
                        <div class="relative group">
                          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-600">
                              <IdentificationIcon class="h-5 w-5 text-slate-400" />
                          </div>
                          <input 
                            v-model="localUnit.ref_id" 
                            type="text" 
                            maxlength="10" 
                            required 
                            class="form-input-bold pl-11 font-mono tracking-wide" 
                            placeholder="cth: 1001" 
                          />
                        </div>
                        <p class="text-[10px] text-slate-400 pt-1 ml-1">Kode referensi unik (SAP/Legacy).</p>
                      </div>

                      <div class="space-y-2">
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Parent ID</label>
                        <input 
                          v-model.number="localUnit.parent_id" 
                          type="number" 
                          min="0" 
                          class="form-input-bold px-4" 
                          placeholder="0 (Jika Unit Induk)" 
                        />
                        <p class="text-[10px] text-slate-400 pt-1 ml-1">Isi 0 jika ini adalah Unit Induk.</p>
                      </div>
                  </div>

                  <!-- Row 2 -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-2">
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Alias Unit <span class="text-red-500">*</span></label>
                        <div class="relative group">
                          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-600">
                              <TagIcon class="h-5 w-5 text-slate-400" />
                          </div>
                          <input 
                            v-model="localUnit.alias" 
                            type="text" 
                            maxlength="20" 
                            required 
                            class="form-input-bold pl-11" 
                            placeholder="cth: UID Jatim" 
                          />
                        </div>
                      </div>
                      <div class="space-y-2">
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap <span class="text-red-500">*</span></label>
                        <input 
                          v-model="localUnit.name" 
                          type="text" 
                          maxlength="100" 
                          required 
                          class="form-input-bold px-4" 
                          placeholder="cth: PT PLN (Persero) Unit Induk..." 
                        />
                      </div>
                  </div>
              </div>
            </div>

            <!-- SECTION 2: LOKASI & KONTAK -->
            <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>
              <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                <MapPinIcon class="h-5 w-5 text-cyan-600" />
                Detail Lokasi
              </h4>

              <div class="space-y-6">
                <div class="space-y-2">
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nomor Telepon <span class="text-red-500">*</span></label>
                    <div class="relative group w-full md:w-1/2">
                      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-cyan-600">
                        <PhoneIcon class="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        :value="localUnit.phone" 
                        @input="filterPhoneInput" 
                        type="text" 
                        maxlength="20" 
                        required 
                        class="form-input-bold pl-11" 
                        placeholder="cth: (031) 5340651" 
                      />
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Alamat Lengkap <span class="text-red-500">*</span></label>
                    <div class="relative group">
                      <div class="absolute top-3.5 left-4 pointer-events-none transition-colors group-focus-within:text-cyan-600">
                        <MapPinIcon class="h-5 w-5 text-slate-400" />
                      </div>
                      <textarea 
                        v-model="localUnit.address" 
                        rows="3" 
                        required 
                        maxlength="255"
                        class="form-input-bold pl-12 py-3 resize-none leading-relaxed" 
                        placeholder="Masukkan alamat lengkap kantor unit..."
                      ></textarea>
                    </div>
                </div>
              </div>
            </div>

            <!-- SECTION 3: STATUS & AUDIT -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Status Toggle -->
              <div 
                class="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all cursor-pointer group h-full"
                @click="localUnit.is_active = localUnit.is_active ? 0 : 1"
              >
                <div class="flex gap-4 items-center">
                    <div class="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                      <ShieldCheckIcon class="h-6 w-6" />
                    </div>
                    <div>
                      <span class="block text-base font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">Status Operasional</span>
                      <span class="text-xs text-slate-500 font-medium">Non-aktifkan jika unit tutup.</span>
                    </div>
                </div>
                <button 
                  type="button" 
                  class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none" 
                  :class="localUnit.is_active ? 'bg-green-500' : 'bg-slate-300'"
                >
                  <span aria-hidden="true" class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="localUnit.is_active ? 'translate-x-5' : 'translate-x-0'"></span>
                </button>
              </div>

              <!-- Audit Log (Only Edit) -->
              <div v-if="isEditing" class="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 flex-1">
                <h4 class="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                  <ClockIcon class="h-4 w-4" /> Jejak Audit
                </h4>
                <div class="grid grid-cols-2 gap-4 text-[10px] text-slate-500">
                  <div>
                    <span class="block font-bold text-slate-700 mb-0.5">Created</span>
                    <div class="flex items-center gap-2">
                      <div class="h-5 w-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-400">SY</div>
                      <span>{{ localUnit.created_by || 'System' }}</span>
                    </div>
                    <span class="font-mono ml-7 mt-0.5 block">{{ localUnit.created_at || '-' }}</span>
                  </div>
                  <div>
                    <span class="block font-bold text-slate-700 mb-0.5">Updated</span>
                    <div class="flex items-center gap-2">
                      <div class="h-5 w-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-400">AD</div>
                      <span>{{ localUnit.updated_by || 'Admin' }}</span>
                    </div>
                    <span class="font-mono ml-7 mt-0.5 block">{{ localUnit.updated_at || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>

        <!-- Footer (Fixed Bottom Right) -->
        <div class="flex items-center justify-between px-8 py-5 bg-white border-t border-slate-200 shrink-0 rounded-b-2xl z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div class="text-xs font-bold" :class="isValid ? 'text-emerald-600' : 'text-slate-400'">
             <span v-if="isValid" class="flex items-center gap-1.5"><CheckBadgeIcon class="h-5 w-5" /> DATA LENGKAP</span>
             <span v-else>Lengkapi kolom bertanda *</span>
          </div>
          <div class="flex gap-4">
            <button @click="onClose" class="px-6 py-2.5 text-sm font-bold bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors border border-transparent">
               Batal
            </button>
            <button 
              @click="onSave" 
              :disabled="!isModified || !isValid"
              class="px-8 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none min-w-[120px]"
              :class="(!isModified || !isValid) ? 'bg-slate-300 text-slate-500' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:-translate-y-0.5 hover:shadow-emerald-500/30'"
            >
              {{ isEditing ? 'Simpan Perubahan' : 'Tambah Unit' }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue';
import { 
  BuildingOfficeIcon, MapPinIcon, XMarkIcon, TagIcon, PhoneIcon,
  ShieldCheckIcon, ClockIcon, InformationCircleIcon, CheckBadgeIcon, IdentificationIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  show: Boolean,
  unitToEdit: Object, 
});

const emit = defineEmits(['close', 'save']);

const localUnit = ref({});
const originalUnit = ref({});
const isEditing = computed(() => !!localUnit.value.id);

const filterPhoneInput = (event) => {
  const val = event.target.value.replace(/[^0-9+\-\(\)\s]/g, '');
  localUnit.value.phone = val;
  if (event.target.value !== val) event.target.value = val;
};

const isValid = computed(() => {
  return localUnit.value.ref_id?.trim() &&
         localUnit.value.alias?.trim() &&
         localUnit.value.name?.trim() &&
         localUnit.value.phone?.trim() &&
         localUnit.value.address?.trim(); 
});

const isModified = computed(() => {
  if (!isEditing.value) return true;
  return JSON.stringify(localUnit.value) !== JSON.stringify(originalUnit.value);
});

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
    if (props.unitToEdit) {
      localUnit.value = JSON.parse(JSON.stringify(props.unitToEdit));
      originalUnit.value = JSON.parse(JSON.stringify(props.unitToEdit));
    } else {
      localUnit.value = {
        ref_id: '', parent_id: 0, alias: '', name: '', address: '', phone: '', is_active: 1
      };
      originalUnit.value = {};
    }
  } else {
    document.body.style.overflow = '';
  }
});

onUnmounted(() => document.body.style.overflow = '');
const onClose = () => emit('close');
const onSave = () => {
  if (isValid.value) emit('save', localUnit.value);
};
</script>

<style scoped>
/* --- Professional Form Styles (Bold & Clean) --- */
.form-input-bold {
  @apply block w-full rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold tracking-wide
  focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white
  placeholder:text-slate-300 placeholder:font-normal transition-all duration-200 sm:text-sm py-2 shadow-sm hover:border-emerald-300;
}

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>