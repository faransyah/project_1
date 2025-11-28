<template>
  <Teleport to="body">
    <!-- Overlay Gelap & Blur -->
    <div v-if="show" @click="onClose" class="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"></div>

    <!-- Modal Panel Container -->
    <div v-if="show" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
      
      <!-- Modal Frame (Layout Split) -->
      <div class="relative w-full max-w-6xl h-[85vh] transform overflow-hidden rounded-2xl bg-slate-50 text-left shadow-2xl transition-all ring-1 ring-slate-900/5 flex flex-col" @click.stop>
        
        <!-- Header (Fixed Full Width) -->
        <div class="flex items-center justify-between border-b border-slate-200 px-8 py-5 bg-white z-20 flex-shrink-0 shadow-sm relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <div class="flex items-center gap-5 relative">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-white">
              <UserCircleIcon class="h-7 w-7" />
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
          <button 
            @click="onClose" 
            class="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
            title="Tutup Modal"
          >
            <XMarkIcon class="h-7 w-7" />
          </button>
        </div>

        <!-- CONTENT BODY (Split View) -->
        <div class="flex flex-1 overflow-hidden">
          
          <!-- KIRI: FOTO PROFIL (FIXED / STATIC) -->
          <div class="w-1/3 h-full bg-white border-r border-slate-200 p-8 flex flex-col items-center shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10">
             <div class="w-full max-w-xs flex flex-col h-full">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center shrink-0">Foto Profil</label>
                
                <!-- Container Foto -->
                <div 
                  class="relative w-48 h-48 mx-auto rounded-full bg-slate-50 border-4 border-white shadow-xl ring-1 ring-slate-200 flex items-center justify-center overflow-hidden group cursor-pointer transition-all hover:ring-4 hover:ring-blue-200 shrink-0"
                  @click="triggerFileInput"
                >
                  <img v-if="localUser.url_photo" :src="localUser.url_photo" alt="Profile" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div v-else class="flex flex-col items-center justify-center text-slate-300">
                      <UserIcon class="h-20 w-20 mb-1" />
                  </div>
                  
                  <!-- Overlay Hover -->
                  <div class="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[1px]">
                    <CameraIcon class="h-8 w-8 text-white mb-1 drop-shadow-md" />
                    <span class="text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md">Ubah Foto</span>
                  </div>
                </div>
                
                <!-- Tombol & Keterangan -->
                <div class="mt-8 flex flex-col items-center w-full">
                  <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
                  
                  <button 
                    type="button" 
                    @click="triggerFileInput" 
                    class="w-full px-5 py-3 rounded-xl bg-white border border-slate-300 text-slate-600 text-xs font-bold hover:border-blue-500 hover:text-blue-600 hover:shadow-sm transition-all mb-3"
                  >
                    Upload Foto
                  </button>
                  
                  <p class="text-[11px] text-center text-slate-400 leading-relaxed px-4">
                    Format: JPG, PNG.<br>
                    Maksimal ukuran file 2MB.
                  </p>
                </div>
             </div>
          </div>

          <!-- KANAN: FORM INPUT (SCROLLABLE) -->
          <div class="flex-1 h-full overflow-y-auto custom-scrollbar bg-slate-50/50">
            <div class="p-8 max-w-3xl mx-auto pb-24">
              <form @submit.prevent="onSave" class="space-y-8">
                
                <!-- SECTION 1: IDENTITAS & AKUN -->
                <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                   <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
                      Identitas & Akun
                   </h4>
                   
                   <div class="space-y-6">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Nama Lengkap -->
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap <span class="text-red-500">*</span></label>
                          <input v-model="localUser.full_name" type="text" required class="form-input-bold px-4" placeholder="Nama sesuai KTP" />
                        </div>
                        
                        <!-- Username -->
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username <span class="text-red-500">*</span></label>
                          <div class="relative group">
                             <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span class="text-slate-400 font-bold text-sm transition-colors group-focus-within:text-blue-600">@</span>
                             </div>
                             <input v-model="localUser.username" type="text" required class="form-input-bold pl-9" placeholder="username.pln" />
                          </div>
                        </div>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Email -->
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email <span class="text-red-500">*</span></label>
                          <div class="relative group">
                             <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                <EnvelopeIcon class="h-5 w-5 text-slate-400" />
                             </div>
                             <input v-model="localUser.email" type="email" required class="form-input-bold pl-12" placeholder="contoh@pln.co.id" />
                          </div>
                        </div>

                        <!-- Telepon -->
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">No. Telepon</label>
                          <div class="relative group">
                             <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                <PhoneIcon class="h-5 w-5 text-slate-400" />
                             </div>
                             <input v-model="localUser.phone" @input="filterPhone" type="text" maxlength="15" class="form-input-bold pl-12" placeholder="0812..." />
                          </div>
                        </div>
                      </div>

                      <!-- Password -->
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

                <!-- SECTION 2: DATA KEPEGAWAIAN -->
                <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div class="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                   <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
                      Data Kepegawaian
                   </h4>

                   <div class="space-y-6">
                      <!-- NIP & PERNR -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                           <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">NIP <span class="text-red-500">*</span></label>
                           <div class="relative group">
                             <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-600">
                                <IdentificationIcon class="h-5 w-5 text-slate-400" />
                             </div>
                             <input v-model="localUser.nip" @input="filterNumeric($event, 'nip')" maxlength="20" type="text" required class="form-input-bold pl-12 font-mono tracking-wide" placeholder="XXXXXXXX" />
                           </div>
                        </div>
                        <div class="space-y-2">
                           <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">PERNR (SAP)</label>
                           <input v-model="localUser.pernr" @input="filterNumeric($event, 'pernr')" maxlength="20" type="text" class="form-input-bold font-mono tracking-wide px-4" placeholder="Nomor Personel" />
                        </div>
                      </div>

                      <!-- Area Personalia -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div class="space-y-2">
                           <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Personnel Area</label>
                           <div class="relative group">
                             <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-600">
                                <MapPinIcon class="h-5 w-5 text-slate-400" />
                             </div>
                             <input v-model="localUser.personnel_area" type="text" class="form-input-bold pl-12" placeholder="Kode Area" />
                           </div>
                        </div>
                        <div class="space-y-2">
                           <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Personnel Sub Area</label>
                           <input v-model="localUser.personnel_sub_area" type="text" class="form-input-bold px-4" placeholder="Kode Sub Area" />
                        </div>
                      </div>

                      <!-- Pribadi & Tanggal -->
                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                        <div class="space-y-2">
                           <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Jenis Kelamin</label>
                           <select v-model="localUser.gender" class="form-select-bold px-4">
                             <option value="">- Pilih -</option>
                             <option value="L">Laki-laki</option>
                             <option value="P">Perempuan</option>
                           </select>
                        </div>
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
                           <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tgl Lahir</label>
                           <input v-model="localUser.date_birth" type="date" class="form-input-bold px-4" />
                        </div>
                      </div>
                   </div>
                </div>

                <!-- SECTION 3: ORGANISASI & JABATAN -->
                <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                   <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
                      Unit & Organisasi
                   </h4>
                   
                   <div class="space-y-6">
                      <!-- Unit Kerja -->
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
                            <input v-model="localUser.company_code" type="text" class="form-input-bold px-4" placeholder="4000" />
                         </div>
                         <div class="space-y-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Organization Code</label>
                            <input v-model="localUser.organization_code" type="text" class="form-input-bold px-4" placeholder="50012345" />
                         </div>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                         <div class="space-y-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Jabatan</label>
                            <input v-model="localUser.position_name" type="text" class="form-input-bold px-4" placeholder="cth: Staff Gudang" />
                         </div>
                         <div class="space-y-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Kode Jabatan</label>
                            <input v-model="localUser.position_code" type="text" class="form-input-bold px-4" placeholder="cth: 50012345" />
                         </div>
                      </div>
                   </div>
                </div>

                <!-- SECTION 4: SUPERIOR & SYSTEM -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   
                   <!-- Atasan Langsung -->
                   <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                      <div class="absolute left-0 top-0 bottom-0 w-1 bg-slate-400"></div>
                      <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <UserGroupIcon class="h-5 w-5 text-slate-400" /> Atasan
                      </h4>
                      <div class="space-y-4">
                         <div class="space-y-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Atasan</label>
                            <input v-model="localUser.superior_name" type="text" class="form-input-bold px-4" placeholder="Nama atasan langsung" />
                         </div>
                         <div class="space-y-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">NIP Atasan</label>
                            <input v-model="localUser.superior_nip" type="text" class="form-input-bold px-4" placeholder="NIP Atasan" />
                         </div>
                      </div>
                   </div>

                   <!-- Konfigurasi Sistem -->
                   <div class="flex flex-col gap-6">
                      <!-- Role -->
                      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                         <div class="space-y-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Role Aplikasi <span class="text-red-500">*</span></label>
                            <div class="relative group">
                               <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600">
                                  <ShieldCheckIcon class="h-5 w-5 text-slate-400" />
                               </div>
                               <select v-model="localUser.role" required class="form-select-bold pl-12">
                                  <option value="User">User (Karyawan)</option>
                                  <option value="Admin">Administrator</option>
                               </select>
                            </div>
                         </div>
                      </div>

                      <!-- Switches -->
                      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                          <!-- Status Switch -->
                          <div 
                            class="flex items-center justify-between cursor-pointer group" 
                            @click="localUser.is_active = localUser.is_active ? 0 : 1"
                          >
                            <div>
                              <span class="block text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Status Akun Aktif</span>
                              <span class="text-[11px] text-slate-500">Akses login sistem.</span>
                            </div>
                            <button type="button" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none" :class="localUser.is_active ? 'bg-green-500' : 'bg-slate-300'">
                              <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="localUser.is_active ? 'translate-x-5' : 'translate-x-0'"></span>
                            </button>
                          </div>

                          <div class="border-t border-slate-100"></div>

                          <!-- SSO Switch -->
                          <div 
                            class="flex items-center justify-between cursor-pointer group" 
                            @click="localUser.is_sso = localUser.is_sso ? 0 : 1"
                          >
                            <div>
                              <span class="block text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Single Sign On</span>
                              <span class="text-[11px] text-slate-500">Login via akun korporat.</span>
                            </div>
                            <button type="button" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none" :class="localUser.is_sso ? 'bg-blue-600' : 'bg-slate-300'">
                              <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="localUser.is_sso ? 'translate-x-5' : 'translate-x-0'"></span>
                            </button>
                          </div>
                      </div>
                   </div>
                </div>

                <!-- Audit Log (Hanya Edit) -->
                <div v-if="isEditing" class="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                   <h4 class="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                     <ClockIcon class="h-4 w-4" /> Jejak Audit
                   </h4>
                   <div class="grid grid-cols-2 gap-4 text-[10px] text-slate-500">
                      <div>
                        <span class="block font-bold text-slate-700 mb-0.5">Created</span>
                        <div class="flex items-center gap-2">
                          <div class="h-5 w-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-400">SY</div>
                          <span>{{ localUser.created_by || 'System' }}</span>
                        </div>
                        <span class="font-mono ml-7 mt-0.5 block">{{ localUser.created_at || '-' }}</span>
                      </div>
                      <div>
                        <span class="block font-bold text-slate-700 mb-0.5">Updated</span>
                        <div class="flex items-center gap-2">
                          <div class="h-5 w-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-400">AD</div>
                          <span>{{ localUser.updated_by || 'Admin' }}</span>
                        </div>
                        <span class="font-mono ml-7 mt-0.5 block">{{ localUser.updated_at || '-' }}</span>
                      </div>
                   </div>
                </div>

              </form>
            </div>
          </div>

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
  MapPinIcon, EnvelopeIcon, PhoneIcon
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

const filterNumeric = (event, field) => {
  const val = event.target.value.replace(/[^0-9]/g, '');
  localUser.value[field] = val;
  if (event.target.value !== val) event.target.value = val;
};
const filterPhone = (event) => {
  const val = event.target.value.replace(/[^0-9+\-\(\)\s]/g, '');
  localUser.value.phone = val;
  if (event.target.value !== val) event.target.value = val;
};

const isValid = computed(() => {
  return localUser.value.full_name?.trim() &&
         localUser.value.username?.trim() &&
         localUser.value.email?.trim() &&
         localUser.value.nip?.trim() &&
         localUser.value.unit_id &&
         localUser.value.role; 
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
        nip: '', pernr: '', gender: '', religion: '', date_birth: '', date_entry: '',
        unit_id: '', position_name: '', position_code: '',
        superior_name: '', superior_nip: '', superior_position: '',
        personnel_area: '', personnel_sub_area: '', company_code: '', organization_code: '',
        role: 'User', is_active: 1, is_sso: 0, created_by: 'Admin'
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
    const payload = { ...localUser.value };
    if (isEditing.value && payload.password === DUMMY_PASSWORD) delete payload.password;
    emit('save', payload);
  }
};
</script>

<style scoped>
/* --- Professional Form Styles (Bold & Clean) --- */
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