<template>
  <Teleport to="body">
    <div v-if="show" @click="onClose" class="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"></div>

    <div v-if="show" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
      
      <div class="relative w-full max-w-6xl h-[85vh] transform overflow-hidden rounded-2xl bg-slate-50 text-left shadow-2xl transition-all ring-1 ring-slate-900/5 flex flex-col" @click.stop>
        
        <div class="flex items-center justify-between border-b border-slate-200 px-8 py-5 bg-white z-20 flex-shrink-0 shadow-sm relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <div class="flex items-center gap-5 relative">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-white">
              <UserCircleIcon v-if="!isEditing" class="h-7 w-7" />
              <PencilSquareIcon v-else class="h-7 w-7" />
            </div>
            <div>
              <h3 class="text-xl font-extrabold leading-6 text-slate-800 tracking-tight">
                {{ isEditing ? 'Edit Data Pegawai' : 'Registrasi Pegawai Baru' }}
              </h3>
              <p class="text-sm text-slate-500 mt-0.5 font-medium">
                Kelola informasi detail pengguna & hak akses sistem.
              </p>
            </div>
          </div>
          <button @click="onClose" class="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none">
            <XMarkIcon class="h-7 w-7" />
          </button>
        </div>

        <div class="flex flex-1 overflow-hidden">
          
          <div class="w-1/3 h-full bg-white border-r border-slate-200 p-8 flex flex-col items-center shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10 hidden md:flex">
             <div class="w-full max-w-xs flex flex-col h-full">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center shrink-0">
                  Foto Profil <span class="text-red-500">*</span>
                </label>
                
                <div 
                  class="relative w-48 h-48 mx-auto rounded-full bg-slate-50 border-4 border-white shadow-xl ring-1 flex items-center justify-center overflow-hidden group cursor-pointer transition-all hover:ring-4 hover:ring-blue-200 shrink-0" 
                  :class="localUser.url_photo ? 'ring-slate-200' : 'ring-red-200 bg-red-50'"
                  @click="triggerFileInput"
                >
                  <img v-if="localUser.url_photo" :src="localUser.url_photo" alt="Profile" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  
                  <div v-else class="flex flex-col items-center justify-center text-slate-300 group-hover:text-blue-400 transition-colors">
                      <UserIcon class="h-24 w-24 mb-1" :class="{'text-red-200': !localUser.url_photo}" />
                      <span class="text-[10px] font-bold uppercase tracking-wide opacity-50" :class="{'text-red-400': !localUser.url_photo}">Wajib Upload</span>
                  </div>

                  <div class="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[1px]">
                    <CameraIcon class="h-8 w-8 text-white mb-1 drop-shadow-md" />
                    <span class="text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md">Ubah Foto</span>
                  </div>
                </div>
                
                <div class="mt-8 flex flex-col items-center w-full">
                  <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
                  <button type="button" @click="triggerFileInput" class="w-full px-5 py-3 rounded-xl bg-white border border-slate-300 text-slate-600 text-xs font-bold hover:border-blue-500 hover:text-blue-600 hover:shadow-sm transition-all mb-3">
                    Pilih File Foto
                  </button>
                  <p class="text-[11px] text-center text-slate-400 leading-relaxed px-4">Format: JPG, PNG. Max 2MB.</p>
                </div>
             </div>
          </div>

          <div class="flex-1 h-full overflow-y-auto custom-scrollbar bg-slate-50/50">
            <div class="p-8 max-w-3xl mx-auto pb-24">
              <form @submit.prevent="onSave" class="space-y-8">
                
                <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                   <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
                     Identitas & Akun
                   </h4>
                   
                   <div class="space-y-6">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap <span class="text-red-500">*</span></label>
                          <input v-model="localUser.full_name" type="text" required class="form-input-bold px-4" placeholder="Nama sesuai KTP" />
                        </div>
                        
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username <span class="text-red-500">*</span></label>
                          <div class="relative group">
                             <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span class="text-slate-400 font-bold text-sm transition-colors group-focus-within:text-blue-600">@</span>
                             </div>
                             <input 
                               v-model="localUser.username" 
                               @input="applyFilter($event, 'username', 'username')"
                               type="text" required class="form-input-bold pl-9 lowercase" placeholder="username.pln" 
                             />
                          </div>
                        </div>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email <span class="text-red-500">*</span></label>
                          <div class="relative group">
                             <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                <EnvelopeIcon class="h-5 w-5 text-slate-400" />
                             </div>
                             <input 
                               v-model="localUser.email" 
                               type="email" required 
                               class="form-input-bold pl-12" 
                               :class="{'border-red-300 focus:border-red-500 text-red-600': localUser.email && !isValidEmail(localUser.email)}"
                               placeholder="contoh@pln.co.id" 
                             />
                          </div>
                          <p v-if="localUser.email && !isValidEmail(localUser.email)" class="text-[10px] text-red-500 mt-1 ml-1">Format email tidak valid</p>
                        </div>

                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">No. Telepon</label>
                          <div class="relative group">
                             <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                <PhoneIcon class="h-5 w-5 text-slate-400" />
                             </div>
                             <input 
                               v-model="localUser.phone" 
                               @input="applyFilter($event, 'phone', 'phone')"
                               type="text" maxlength="15" class="form-input-bold pl-12" placeholder="0812..." 
                             />
                          </div>
                        </div>
                      </div>

                      <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                          <div class="relative group">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                               <LockClosedIcon class="h-5 w-5 text-slate-400" />
                            </div>
                            <input 
                              v-model="localUser.password"
                              :type="showPassword ? 'text' : 'password'"
                              class="form-input-bold pl-12 pr-12"
                              :class="{'text-slate-400 bg-slate-50 border-slate-200 cursor-default hover:border-slate-200 focus:ring-0': !isEditing && localUser.password === DUMMY_PASSWORD}"
                              :placeholder="isEditing ? 'Klik untuk ubah password' : 'Password default: 123'"
                              :readonly="!isEditing"
                              @focus="handlePassFocus"
                              @blur="handlePassBlur"
                            />
                            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer focus:outline-none rounded-lg m-1 hover:bg-slate-100 p-1">
                              <component :is="showPassword ? EyeSlashIcon : EyeIcon" class="h-5 w-5" />
                            </button>
                          </div>
                          <p v-if="isEditing && localUser.password === DUMMY_PASSWORD" class="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 w-fit">
                            <CheckBadgeIcon class="h-3.5 w-3.5" /> Password aman. Klik kolom jika ingin mereset.
                          </p>
                      </div>
                   </div>
                </div>

                <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                   <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
                     Unit & Organisasi
                   </h4>
                   
                   <div class="space-y-6">
                      <div class="space-y-2">
                         <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Unit Kerja Utama <span class="text-red-500">*</span></label>
                         <div class="relative group">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-orange-600">
                               <BuildingOfficeIcon class="h-5 w-5 text-slate-400" />
                            </div>
                            <select v-model="localUser.unit_id" required class="form-select-bold pl-12">
                              <option disabled value="">Pilih Unit...</option>
                              <option v-for="unit in unitOptions" :key="unit.id" :value="unit.id">
                                {{ unit.alias }} - {{ unit.name }}
                              </option>
                            </select>
                         </div>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div class="space-y-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Company Code</label>
                            <input 
                               v-model="localUser.company_code" 
                               @input="applyFilter($event, 'company_code', 'numeric')"
                               type="text" maxlength="6" class="form-input-bold px-4 font-mono" placeholder="4000" 
                            />
                         </div>
                         <div class="space-y-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Organization Code</label>
                            <input 
                               v-model="localUser.organization_code" 
                               @input="applyFilter($event, 'organization_code', 'numeric')"
                               type="text" maxlength="12" class="form-input-bold px-4 font-mono" placeholder="50012345" 
                            />
                         </div>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                         <div class="space-y-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Jabatan</label>
                            <input v-model="localUser.position_name" type="text" class="form-input-bold px-4" placeholder="cth: Staff Gudang" />
                         </div>
                         <div class="space-y-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Kode Jabatan</label>
                            <input 
                               v-model="localUser.position_code" 
                               @input="applyFilter($event, 'position_code', 'numeric')"
                               type="text" maxlength="12" class="form-input-bold px-4 font-mono" placeholder="cth: 50012345" 
                            />
                         </div>
                      </div>
                   </div>
                </div>

                <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div class="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                   <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
                     Akses & Lainnya
                   </h4>

                   <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-2">
                         <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex justify-between">
                           <span>Role Aplikasi <span class="text-red-500">*</span></span>
                           <span v-if="localUser.unit_id && !isPusat" class="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">Auto User</span>
                         </label>
                         <div class="relative group">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-600">
                               <ShieldCheckIcon class="h-5 w-5" :class="isPusat ? 'text-slate-400' : 'text-slate-300'" />
                            </div>
                            <select 
                              v-model="localUser.role" 
                              required 
                              class="form-select-bold pl-12"
                              :class="{'bg-slate-100 text-slate-500 cursor-not-allowed': !isPusat}"
                              :disabled="!isPusat"
                            >
                               <option value="User">User (Karyawan)</option>
                               <option v-if="isPusat || localUser.role === 'Admin'" value="Admin">Administrator</option>
                            </select>
                         </div>
                         <p v-if="!isPusat && localUser.unit_id" class="text-[10px] text-slate-400 mt-1 ml-1">
                           Role Admin hanya tersedia untuk Unit Pusat (ID 3).
                         </p>
                      </div>

                      <div class="space-y-2">
                         <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Jenis Kelamin</label>
                         <select v-model="localUser.gender" class="form-select-bold px-4">
                           <option value="">- Pilih -</option>
                           <option value="L">Laki-laki</option>
                           <option value="P">Perempuan</option>
                         </select>
                      </div>
                   </div>
                   
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div class="space-y-2">
                         <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Agama</label>
                         <select v-model="localUser.religion" class="form-select-bold px-4">
                           <option value="">- Pilih -</option>
                           <option value="ISLAM">Islam</option>
                           <option value="KRISTEN">Kristen</option>
                           <option value="KATOLIK">Katolik</option>
                           <option value="HINDU">Hindu</option>
                           <option value="BUDDHA">Buddha</option>
                           <option value="KONGHUCU">Konghucu</option>
                         </select>
                      </div>
                      
                      <div class="space-y-2">
                         <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">NIP <span class="text-red-500">*</span></label>
                         <input 
                            v-model="localUser.nip" 
                            @input="applyFilter($event, 'nip', 'numeric')" 
                            maxlength="20" type="text" required class="form-input-bold px-4 font-mono tracking-wide" placeholder="XXXXXXXX" 
                         />
                      </div>
                   </div>

                   <div class="mt-6 flex flex-col gap-4">
                      <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between cursor-pointer group" @click="localUser.is_active = localUser.is_active ? 0 : 1">
                        <div>
                          <span class="block text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Status Akun Aktif</span>
                          <span class="text-[11px] text-slate-500">Izinkan user login ke sistem.</span>
                        </div>
                        <button type="button" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none" :class="localUser.is_active ? 'bg-green-500' : 'bg-slate-300'">
                          <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="localUser.is_active ? 'translate-x-5' : 'translate-x-0'"></span>
                        </button>
                      </div>
                   </div>
                </div>

              </form>
            </div>
          </div>

        </div>

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
              :class="(!isModified || !isValid) ? 'bg-slate-300 text-slate-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-0.5 hover:shadow-blue-500/30'"
            >
              {{ isEditing ? 'Simpan Perubahan' : 'Tambah Pegawai' }}
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
  UserCircleIcon, XMarkIcon, IdentificationIcon, BriefcaseIcon, 
  BuildingOfficeIcon, Cog6ToothIcon, CameraIcon, EyeIcon, EyeSlashIcon,
  UserGroupIcon, LockClosedIcon, CheckBadgeIcon, CalendarDaysIcon,
  ShieldCheckIcon, FingerPrintIcon, InformationCircleIcon, ClockIcon,
  MapPinIcon, EnvelopeIcon, PhoneIcon, UserIcon, PencilSquareIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  show: Boolean,
  userToEdit: Object,
  unitOptions: Array, 
});

const emit = defineEmits(['close', 'save']);
const DUMMY_PASSWORD = '••••••••';

const localUser = ref({});
const originalUser = ref({});
const isEditing = computed(() => !!localUser.value.id);
const showPassword = ref(false);
const fileInput = ref(null);

const triggerFileInput = () => fileInput.value.click();
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) localUser.value.url_photo = URL.createObjectURL(file);
};

// --- CONSTRAINT LOGIC: ROLE ---
const isPusat = computed(() => localUser.value.unit_id === 3);

watch(() => localUser.value.unit_id, (newVal) => {
  if (props.show) { 
      if (newVal === 3) {
        if (!isEditing.value) localUser.value.role = 'User'; 
      } else {
        localUser.value.role = 'User';
      }
  }
});

// --- FILTER & VALIDATION ---
const applyFilter = (event, field, type) => {
  let val = event.target.value;
  if (type === 'numeric') val = val.replace(/[^0-9]/g, '');
  else if (type === 'phone') val = val.replace(/[^0-9+\-\(\)\s]/g, '');
  else if (type === 'username') val = val.replace(/[^a-zA-Z0-9._]/g, '');
  else if (type === 'alphanum') val = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  
  localUser.value[field] = val;
  if (event.target.value !== val) event.target.value = val;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValid = computed(() => {
  return localUser.value.full_name?.trim() &&
         localUser.value.username?.trim() &&
         localUser.value.email?.trim() &&
         isValidEmail(localUser.value.email) &&
         localUser.value.nip?.trim() &&
         localUser.value.unit_id &&
         localUser.value.role &&
         localUser.value.url_photo; // WAJIB ADA FOTO
});

const isModified = computed(() => {
  if (!isEditing.value) return true;
  const passChanged = localUser.value.password !== DUMMY_PASSWORD;
  return JSON.stringify(localUser.value) !== JSON.stringify(originalUser.value) || passChanged;
});

const handlePassFocus = () => { if (isEditing.value && localUser.value.password === DUMMY_PASSWORD) localUser.value.password = ''; };
const handlePassBlur = () => { if (isEditing.value && localUser.value.password === '') localUser.value.password = DUMMY_PASSWORD; };

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
    showPassword.value = false;

    if (props.userToEdit) {
      const data = { ...props.userToEdit, password: DUMMY_PASSWORD };
      if (!data.role) data.role = 'User';
      localUser.value = JSON.parse(JSON.stringify(data)); 
      originalUser.value = JSON.parse(JSON.stringify(data));
    } else {
      localUser.value = {
        full_name: '', username: '', email: '', phone: '', password: '123',
        nip: '', pernr: '', gender: '', religion: '', date_birth: '',
        unit_id: '', position_name: '', position_code: '',
        superior_name: '', superior_nip: '',
        company_code: '', organization_code: '',
        role: 'User', is_active: 1, is_sso: 0, created_by: 'Admin', url_photo: ''
      };
      originalUser.value = {};
    }
  } else {
    document.body.style.overflow = '';
  }
});

onUnmounted(() => document.body.style.overflow = '');
const onClose = () => emit('close');
const onSave = () => {
  if (isValid.value) {
    if (localUser.value.unit_id !== 3) localUser.value.role = 'User';
    const payload = { ...localUser.value };
    if (isEditing.value && payload.password === DUMMY_PASSWORD) delete payload.password;
    emit('save', payload);
  }
};
</script>

<style scoped>
.form-input-bold {
  @apply block w-full rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold tracking-wide
  focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white
  placeholder:text-slate-300 placeholder:font-normal transition-all duration-200 sm:text-sm py-2 shadow-sm hover:border-blue-300;
}

.form-select-bold {
  @apply block w-full rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold tracking-wide
  focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
  sm:text-sm py-2 shadow-sm cursor-pointer hover:border-blue-300;
}

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>