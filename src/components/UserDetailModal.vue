<template>
  <Teleport to="body">
    <!-- Transition Wrapper for Smooth Animation -->
    <Transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
        
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

        <!-- Modal Panel -->
        <div class="relative w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 transition-all flex flex-col max-h-[90vh]">
          
          <!-- Decorative Banner -->
          <div class="relative h-32 w-full bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden shrink-0">
            <!-- Decorative elements -->
            <div class="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
            <div class="absolute left-10 bottom-[-20px] h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
            
            <!-- Close Button (Top Right) -->
            <button 
              @click="$emit('close')" 
              class="absolute top-4 right-4 p-2 rounded-full bg-black/10 text-white hover:bg-black/20 backdrop-blur-md transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>

          <!-- Profile Header (Overlapping Banner) -->
          <div class="px-8 relative shrink-0">
             <div class="flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-6 gap-6">
                <!-- Avatar -->
                <div class="relative h-32 w-32 rounded-full bg-white p-1.5 shadow-lg ring-1 ring-slate-100 shrink-0">
                   <div class="h-full w-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center relative group">
                      <img 
                        v-if="user?.url_photo" 
                        :src="user.url_photo" 
                        class="h-full w-full object-cover" 
                        alt="User Profile" 
                      />
                      <div v-else class="flex flex-col items-center justify-center text-slate-300">
                         <UserIcon class="h-16 w-16" />
                      </div>
                   </div>
                   <!-- Active Status Indicator -->
                   <div 
                      class="absolute bottom-2 right-2 h-6 w-6 rounded-full border-4 border-white"
                      :class="user?.is_active ? 'bg-emerald-500' : 'bg-red-500'"
                      :title="user?.is_active ? 'Status: Aktif' : 'Status: Non-Aktif'"
                   ></div>
                </div>

                <!-- Name & Role Info -->
                <div class="text-center sm:text-left pb-2 flex-1 min-w-0 w-full">
                   <h2 class="text-2xl font-black text-slate-800 tracking-tight truncate">{{ user?.full_name }}</h2>
                   <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
                      <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-100">
                         <BriefcaseIcon class="h-3.5 w-3.5" />
                         {{ user?.position_name || 'Posisi Belum Diatur' }}
                      </span>
                      <span class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200 font-mono">
                         NIP: {{ user?.nip }}
                      </span>
                   </div>
                </div>
                
                <!-- Edit Button (Desktop) -->
                <div class="hidden sm:block pb-2">
                   <button 
                      @click="$emit('edit')"
                      class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all shadow-lg shadow-slate-900/20"
                   >
                      <PencilSquareIcon class="h-4 w-4" /> Edit Profil
                   </button>
                </div>
             </div>
          </div>

          <!-- Scrollable Content Area -->
          <div class="px-8 pb-8 overflow-y-auto custom-scrollbar flex-1">
             
             <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <!-- LEFT COLUMN -->
                <div class="space-y-8">
                   
                   <!-- Contact Info -->
                   <section>
                      <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                         <IdentificationIcon class="h-4 w-4" /> Informasi Kontak
                      </h4>
                      <div class="space-y-3">
                         <div class="group flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:border-blue-200 hover:bg-blue-50/30">
                            <div class="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-500 border border-slate-100">
                               <EnvelopeIcon class="h-5 w-5" />
                            </div>
                            <div class="min-w-0">
                               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Email</p>
                               <p class="text-sm font-semibold text-slate-700 truncate">{{ user?.email }}</p>
                            </div>
                         </div>
                         
                         <div class="group flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:border-green-200 hover:bg-green-50/30">
                            <div class="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center text-green-500 border border-slate-100">
                               <PhoneIcon class="h-5 w-5" />
                            </div>
                            <div class="min-w-0">
                               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Telepon</p>
                               <p class="text-sm font-semibold text-slate-700 font-mono">{{ user?.phone }}</p>
                            </div>
                         </div>

                         <div class="group flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:border-purple-200 hover:bg-purple-50/30">
                            <div class="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center text-purple-500 border border-slate-100">
                               <UserIcon class="h-5 w-5" />
                            </div>
                            <div class="min-w-0">
                               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Username</p>
                               <p class="text-sm font-semibold text-slate-700">@{{ user?.username }}</p>
                            </div>
                         </div>
                      </div>
                   </section>
                </div>

                <!-- RIGHT COLUMN -->
                <div class="space-y-8">
                   
                   <!-- Work Unit -->
                   <section>
                      <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                         <BuildingOfficeIcon class="h-4 w-4" /> Unit & Organisasi
                      </h4>
                      <div class="p-5 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-colors">
                         <div class="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                            <BuildingOfficeIcon class="h-24 w-24" />
                         </div>
                         <div class="relative z-10">
                            <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 mb-2">
                               {{ user?.unit_alias }}
                            </span>
                            <p class="text-base font-bold text-slate-800 leading-snug mb-2">{{ user?.unit_name }}</p>
                            <div class="flex items-start gap-2 text-xs text-slate-500">
                               <MapPinIcon class="h-4 w-4 shrink-0 mt-0.5 text-slate-400" />
                               <span class="leading-relaxed">{{ user?.unit_address || 'Alamat tidak tersedia' }}</span>
                            </div>
                         </div>
                      </div>
                   </section>

                   <!-- Superior -->
                   <section>
                      <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                         <UserGroupIcon class="h-4 w-4" /> Atasan Langsung
                      </h4>
                      <div class="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                         <div class="h-12 w-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-lg font-bold border border-orange-200 shadow-inner">
                            {{ user?.superior_name ? user.superior_name.charAt(0).toUpperCase() : '?' }}
                         </div>
                         <div>
                            <p class="text-sm font-bold text-slate-800">{{ user?.superior_name || 'Belum Ditentukan' }}</p>
                            <p class="text-xs text-slate-500">{{ user?.superior_position || 'Jabatan tidak tersedia' }}</p>
                            <p v-if="user?.superior_nip" class="text-[10px] text-slate-400 mt-0.5 font-mono">NIP: {{ user.superior_nip }}</p>
                         </div>
                      </div>
                   </section>

                   <!-- System Info -->
                   <section>
                      <div class="flex items-center justify-between text-xs p-4 rounded-xl bg-slate-50 border border-slate-100">
                         <div class="flex items-center gap-2 text-slate-500">
                            <ShieldCheckIcon class="h-4 w-4" />
                            Role: <strong class="text-slate-700">{{ user?.role }}</strong>
                         </div>
                         <div class="flex items-center gap-2 text-slate-500">
                            <FingerPrintIcon class="h-4 w-4" />
                            SSO: <strong :class="user?.is_sso ? 'text-emerald-600' : 'text-slate-400'">{{ user?.is_sso ? 'Ya' : 'Tidak' }}</strong>
                         </div>
                      </div>
                   </section>

                </div>
             </div>
          </div>

          <!-- Mobile Edit Button (Sticky Bottom) -->
          <div class="sm:hidden p-4 border-t border-slate-100 bg-white shrink-0">
             <button 
                @click="$emit('edit')"
                class="w-full inline-flex justify-center items-center gap-2 px-5 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-lg"
             >
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
  ShieldCheckIcon, BriefcaseIcon, CameraIcon, FingerPrintIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  show: Boolean,
  user: Object
});

const emit = defineEmits(['close', 'edit']);

// Scroll Locking Logic
watch(() => props.show, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'; // Lock scroll
  } else {
    document.body.style.overflow = ''; // Unlock scroll
  }
});

// Cleanup saat component di-unmount
onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* Scrollbar Kustom agar sesuai desain modal */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid white; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

/* Transisi Modal Fade & Scale */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(0.95) translateY(10px); }
.modal-fade-enter-to, .modal-fade-leave-from { opacity: 1; transform: scale(1) translateY(0); }
</style>