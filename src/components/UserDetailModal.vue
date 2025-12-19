<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
        
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

        <div class="relative w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 transition-all flex flex-col max-h-[90vh]">
          
          <div class="relative h-32 w-full bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden shrink-0">
            <div class="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
            <div class="absolute left-10 bottom-[-20px] h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
            
            <button 
              @click="$emit('close')" 
              class="absolute top-4 right-4 p-2 rounded-full bg-black/10 text-white hover:bg-black/20 backdrop-blur-md transition-colors focus:outline-none"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>

          <div class="px-8 relative shrink-0">
             <div class="flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-6 gap-6">
                <div class="relative h-32 w-32 rounded-full bg-white p-1.5 shadow-lg ring-1 ring-slate-100 shrink-0">
                   <div class="h-full w-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center relative group">
                      <img v-if="user?.url_photo" :src="user.url_photo" class="h-full w-full object-cover" alt="User Profile" />
                      <div v-else class="flex flex-col items-center justify-center text-slate-300">
                         <UserIcon class="h-16 w-16" />
                      </div>
                   </div>
                   <div 
                      class="absolute bottom-2 right-2 h-6 w-6 rounded-full border-4 border-white"
                      :class="user?.is_active ? 'bg-emerald-500' : 'bg-red-500'"
                      :title="user?.is_active ? 'Aktif' : 'Non-Aktif'"
                   ></div>
                </div>

                <div class="text-center sm:text-left pb-2 flex-1 min-w-0 w-full">
                   <h2 class="text-2xl font-black text-slate-800 tracking-tight truncate">{{ user?.full_name }}</h2>
                   
                   <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                      <span class="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-100">
                         <BriefcaseIcon class="h-3.5 w-3.5" />
                         {{ user?.position_name || '-' }}
                      </span>
                      <span class="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200 font-mono">
                         NIP: {{ user?.nip }}
                      </span>
                      <span class="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 border border-purple-100 font-mono">
                         PERNR: {{ user?.pernr || '-' }}
                      </span>
                   </div>
                </div>
                
                <div class="hidden sm:block pb-2">
                   <button @click="$emit('edit')" class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                      <PencilSquareIcon class="h-4 w-4" /> Edit Profil
                   </button>
                </div>
             </div>
          </div>

          <div class="px-8 pb-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
             <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
                
                <div class="space-y-6">
                   
                   <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                         <UserIcon class="h-4 w-4" /> Data Pribadi
                      </h4>
                      <div class="grid grid-cols-2 gap-4">
                         <div>
                            <p class="text-[10px] uppercase text-slate-400 font-bold">Jenis Kelamin</p>
                            <p class="text-sm font-semibold text-slate-700">{{ user?.gender === 'L' ? 'Laki-laki' : 'Perempuan' }}</p>
                         </div>
                         <div>
                            <p class="text-[10px] uppercase text-slate-400 font-bold">Agama</p>
                            <p class="text-sm font-semibold text-slate-700 capitalize">{{ user?.religion?.toLowerCase() || '-' }}</p>
                         </div>
                         <div class="col-span-2">
                            <p class="text-[10px] uppercase text-slate-400 font-bold">Tanggal Lahir</p>
                            <p class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                               <CakeIcon class="h-4 w-4 text-pink-400" />
                               {{ formatDate(user?.date_birth) }}
                            </p>
                         </div>
                      </div>
                   </div>

                   <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                         <IdentificationIcon class="h-4 w-4" /> Kontak & Akun
                      </h4>
                      <div class="space-y-3">
                         <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                               <div class="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><EnvelopeIcon class="h-4 w-4" /></div>
                               <div>
                                  <p class="text-[10px] text-slate-400 font-bold">Email</p>
                                  <p class="text-sm font-semibold text-slate-700">{{ user?.email }}</p>
                               </div>
                            </div>
                         </div>
                         <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                               <div class="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600"><PhoneIcon class="h-4 w-4" /></div>
                               <div>
                                  <p class="text-[10px] text-slate-400 font-bold">No. Telepon</p>
                                  <p class="text-sm font-semibold text-slate-700">{{ user?.phone }}</p>
                               </div>
                            </div>
                         </div>
                         <div class="flex items-center justify-between pt-2 border-t border-slate-50">
                            <div class="flex items-center gap-3">
                               <div class="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600"><UserCircleIcon class="h-4 w-4" /></div>
                               <div>
                                  <p class="text-[10px] text-slate-400 font-bold">Username</p>
                                  <p class="text-sm font-semibold text-slate-700">@{{ user?.username }}</p>
                               </div>
                            </div>
                            <span v-if="user?.is_sso" class="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-100">SSO Active</span>
                         </div>
                      </div>
                   </div>

                </div>

                <div class="space-y-6">
                   
                   <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                      <div class="absolute top-0 right-0 w-16 h-16 bg-orange-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
                      <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-2 relative z-10">
                         <BuildingOfficeIcon class="h-4 w-4" /> Detail Organisasi
                      </h4>
                      
                      <div class="mb-4 relative z-10">
                         <p class="text-[10px] uppercase text-slate-400 font-bold mb-1">Unit Kerja</p>
                         <p class="text-sm font-bold text-slate-800">{{ user?.unit_name }}</p>
                         <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPinIcon class="h-3 w-3" /> {{ user?.unit_address }}
                         </p>
                      </div>

                      <div class="grid grid-cols-2 gap-y-4 gap-x-2 text-xs relative z-10 bg-slate-50 p-3 rounded-xl border border-slate-100">
                         <div>
                            <p class="text-slate-400 font-medium">Company Code</p>
                            <p class="font-mono font-bold text-slate-700">{{ user?.company_code || '-' }}</p>
                         </div>
                         <div>
                            <p class="text-slate-400 font-medium">Org. Code</p>
                            <p class="font-mono font-bold text-slate-700">{{ user?.organization_code || '-' }}</p>
                         </div>
                         <div>
                            <p class="text-slate-400 font-medium">Personnel Area</p>
                            <p class="font-mono font-bold text-slate-700">{{ user?.personnel_area || '-' }}</p>
                         </div>
                         <div>
                            <p class="text-slate-400 font-medium">Sub Area</p>
                            <p class="font-mono font-bold text-slate-700">{{ user?.personnel_sub_area || '-' }}</p>
                         </div>
                         <div class="col-span-2 border-t border-slate-200 pt-2 mt-1">
                            <p class="text-slate-400 font-medium">Kode Jabatan</p>
                            <p class="font-mono font-bold text-slate-700">{{ user?.position_code || '-' }}</p>
                         </div>
                      </div>
                   </div>

                   <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                         <UserGroupIcon class="h-4 w-4" /> Atasan Langsung
                      </h4>
                      <div class="flex items-center gap-4">
                         <div class="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold border border-orange-200">
                            {{ user?.superior_name ? user.superior_name.charAt(0).toUpperCase() : '?' }}
                         </div>
                         <div>
                            <p class="text-sm font-bold text-slate-800">{{ user?.superior_name || 'Belum Ditentukan' }}</p>
                            <p class="text-xs text-slate-500 font-mono mt-0.5" v-if="user?.superior_nip">NIP: {{ user?.superior_nip }}</p>
                         </div>
                      </div>
                   </div>

                   <div class="bg-slate-100/50 p-4 rounded-xl border border-slate-200 text-[10px] text-slate-500 flex justify-between items-center">
                      <div>
                         <span class="block">Dibuat: <strong>{{ user?.created_by }}</strong> ({{ user?.created_at }})</span>
                         <span class="block mt-0.5">Role App: <strong class="text-slate-700">{{ user?.role }}</strong></span>
                      </div>
                      <ShieldCheckIcon class="h-5 w-5 text-slate-300" />
                   </div>

                </div>
             </div>
          </div>

          <div class="sm:hidden p-4 border-t border-slate-100 bg-white shrink-0">
             <button @click="$emit('edit')" class="w-full inline-flex justify-center items-center gap-2 px-5 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg">
                <PencilSquareIcon class="h-4 w-4" /> Edit Profil
             </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, onUnmounted } from 'vue';
import { 
  XMarkIcon, UserIcon, EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, 
  PencilSquareIcon, MapPinIcon, UserGroupIcon, IdentificationIcon, 
  ShieldCheckIcon, BriefcaseIcon, UserCircleIcon, CakeIcon 
} from '@heroicons/vue/24/outline';

const props = defineProps({
  show: Boolean,
  user: Object
});

const emit = defineEmits(['close', 'edit']);

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Scroll Locking Logic
watch(() => props.show, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid white; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(0.95) translateY(10px); }
.modal-fade-enter-to, .modal-fade-leave-from { opacity: 1; transform: scale(1) translateY(0); }
</style>