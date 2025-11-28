<template>
  <Teleport to="body">
    <!-- Overlay Gelap & Blur -->
    <div v-if="show" @click="onClose" class="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"></div>

    <!-- Modal Panel Container -->
    <div v-if="show" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
      
      <!-- Modal Frame (Layout Split) -->
      <div class="relative w-full max-w-6xl h-[85vh] transform overflow-hidden rounded-2xl bg-slate-50 text-left shadow-2xl transition-all ring-1 ring-slate-900/5 flex flex-col" @click.stop>
        
        <!-- Header (Fixed Full Width) -->
        <div class="flex items-center justify-between border-b border-slate-200 px-8 py-5 bg-white z-20 flex-shrink-0 shadow-sm relative">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <div class="flex items-center gap-5">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-white">
              <ClipboardDocumentListIcon class="h-7 w-7" />
            </div>
            <div>
              <h3 class="text-xl font-extrabold leading-6 text-slate-800 tracking-tight">
                {{ isEditing ? 'Edit Master Barang' : 'Registrasi Barang Baru' }}
              </h3>
              <p class="text-sm text-slate-500 mt-0.5 font-medium">
                Kelola katalog referensi barang dan spesifikasi.
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
          
          <!-- KIRI: FOTO PRODUK (FIXED / STATIC) -->
          <div class="w-1/3 h-full bg-white border-r border-slate-200 p-8 flex flex-col items-center shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10">
             <div class="w-full max-w-xs flex flex-col h-full">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center shrink-0">Foto Produk</label>
                
                <!-- Container Foto -->
                <div 
                  class="relative w-full aspect-square rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 shrink-0"
                  @click="triggerFileInput"
                >
                  <img v-if="localItem.url_photo" :src="localItem.url_photo" alt="Produk" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
                  <div v-else class="text-center p-6">
                      <PhotoIcon class="h-16 w-16 text-slate-300 mx-auto mb-3 group-hover:text-blue-400 transition-colors" />
                      <span class="text-xs text-slate-400 font-medium group-hover:text-blue-600">Klik untuk upload</span>
                  </div>
                  
                  <!-- Overlay Hover -->
                  <div class="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[1px]">
                    <CameraIcon class="h-10 w-10 text-white mb-2 drop-shadow-md" />
                    <span class="text-xs font-bold text-white uppercase tracking-wide drop-shadow-md">Ganti Foto</span>
                  </div>
                </div>
                
                <!-- Tombol & Keterangan -->
                <div class="mt-6 flex flex-col items-center w-full">
                  <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
                  
                  <button 
                    type="button" 
                    @click="triggerFileInput" 
                    class="w-full px-5 py-3 rounded-xl bg-white border border-slate-300 text-slate-600 text-xs font-bold hover:border-blue-500 hover:text-blue-600 hover:shadow-sm transition-all mb-3"
                  >
                    Pilih Dari Komputer
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
                
                <!-- SECTION 1: IDENTITAS UTAMA -->
                <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                   <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
                      Identitas Barang
                   </h4>
                   
                   <div class="space-y-6">
                      <!-- Grid Identitas Sejajar (2 Kolom Rata) -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- 1. Kode Barang -->
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Kode Barang <span class="text-red-500">*</span></label>
                          <div class="relative group">
                            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                               <QrCodeIcon class="h-5 w-5 text-slate-400" />
                            </div>
                            <input v-model="localItem.code" type="text" required class="form-input-bold pl-11 font-mono tracking-wide" placeholder="ATK-001" />
                          </div>
                        </div>

                        <!-- 2. Nama Barang -->
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Barang <span class="text-red-500">*</span></label>
                          <input v-model="localItem.name" type="text" required class="form-input-bold px-4" placeholder="cth: Kertas A4 Sinar Dunia 80gr" />
                        </div>

                        <!-- 3. Kategori -->
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Kategori <span class="text-red-500">*</span></label>
                          <div class="relative group">
                            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                <TagIcon class="h-5 w-5 text-slate-400" />
                            </div>
                            <select 
                                v-model="localItem.category_id" 
                                required 
                                class="form-select-bold pl-11 w-full"
                                :class="{'text-slate-400 font-normal': !localItem.category_id}"
                            >
                              <option value="" disabled selected>Pilih Kategori</option>
                              <option v-for="cat in categoryOptions" :key="cat.id" :value="cat.id" class="text-slate-800 font-semibold">{{ cat.name }}</option>
                            </select>
                          </div>
                        </div>

                         <!-- 4. Satuan -->
                         <div class="space-y-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Satuan (UOM) <span class="text-red-500">*</span></label>
                            <input v-model="localItem.uom" type="text" required class="form-input-bold px-4" placeholder="Pcs / Rim / Box" />
                         </div>
                      </div>

                      <!-- Row 3: Deskripsi -->
                       <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Deskripsi Lengkap</label>
                          <textarea v-model="localItem.description" rows="3" class="form-input-bold px-4 py-3 resize-none leading-relaxed" placeholder="Jelaskan spesifikasi, warna, atau detail teknis barang..."></textarea>
                      </div>
                   </div>
                </div>

                <!-- SECTION 2: VALUASI & STOK -->
                <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>
                    <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
                       <ArchiveBoxIcon class="h-5 w-5 text-cyan-500" /> Valuasi & Parameter Stok
                    </h4>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <!-- Harga -->
                       <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Harga Acuan</label>
                          <div class="relative group">
                             <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold text-sm transition-colors group-focus-within:text-cyan-600">Rp</span>
                             <input v-model.number="localItem.price" type="number" min="0" class="form-input-bold pl-12" placeholder="0" />
                          </div>
                          <p class="text-[10px] text-slate-400 ml-1 mt-1">Estimasi harga per satuan.</p>
                       </div>

                       <!-- Min Stock -->
                       <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Stok Minimum</label>
                          <input v-model.number="localItem.min_stock" type="number" min="0" class="form-input-bold px-4" />
                          <p class="text-[10px] text-slate-400 ml-1 mt-1">Batas alert stok menipis.</p>
                       </div>

                       <!-- Max Stock -->
                       <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Stok Maksimum</label>
                          <input v-model.number="localItem.max_stock" type="number" min="0" class="form-input-bold px-4" />
                          <p class="text-[10px] text-slate-400 ml-1 mt-1">Kapasitas gudang.</p>
                       </div>
                    </div>
                </div>

                <!-- SECTION 3: STATUS & AUDIT -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <!-- Status Toggle -->
                   <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group cursor-pointer hover:border-emerald-300 transition-all" @click="toggleStatus">
                      <div class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                      <div class="flex justify-between items-center h-full">
                         <div class="flex gap-4 items-center">
                            <div class="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                               <ShieldCheckIcon class="h-6 w-6" />
                            </div>
                            <div>
                               <span class="block text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">Status Aktif</span>
                               <span class="text-[11px] text-slate-500 font-medium">Barang tersedia untuk transaksi.</span>
                            </div>
                         </div>
                         <button type="button" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none" :class="localItem.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'">
                           <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="localItem.status === 'Active' ? 'translate-x-5' : 'translate-x-0'"></span>
                         </button>
                      </div>
                   </div>

                   <!-- Audit Log (Hanya Edit) -->
                   <div v-if="isEditing" class="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 flex-1">
                       <h4 class="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                         <ClockIcon class="h-4 w-4" /> Jejak Audit
                       </h4>
                       <div class="space-y-4 text-[11px]">
                          <div class="flex justify-between items-center border-b border-slate-200 pb-3">
                            <span class="text-slate-500 font-medium">Dibuat Oleh</span>
                            <div class="text-right">
                              <span class="block font-bold text-slate-700">{{ localItem.created_by || 'System' }}</span>
                              <span class="font-mono text-slate-400">{{ localItem.created_at || '-' }}</span>
                            </div>
                          </div>
                          <div class="flex justify-between items-center pt-1">
                            <span class="text-slate-500 font-medium">Update Terakhir</span>
                            <div class="text-right">
                              <span class="block font-bold text-slate-700">{{ localItem.updated_by || 'Admin' }}</span>
                              <span class="font-mono text-slate-400">{{ localItem.updated_at || '-' }}</span>
                            </div>
                          </div>
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
              :class="(!isModified || !isValid) ? 'bg-slate-300 text-slate-500' : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:-translate-y-0.5 hover:shadow-blue-500/30'"
            >
              {{ isEditing ? 'Simpan Perubahan' : 'Tambah Barang' }}
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
  ClipboardDocumentListIcon, XMarkIcon, CheckBadgeIcon, ClockIcon, 
  TagIcon, QrCodeIcon, ArchiveBoxIcon, InformationCircleIcon,
  PhotoIcon, CameraIcon, ShieldCheckIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  show: Boolean,
  itemToEdit: Object, 
  categoryOptions: Array 
});

const emit = defineEmits(['close', 'save']);

const localItem = ref({});
const originalItem = ref({});
const isEditing = computed(() => !!localItem.value.id);
const fileInput = ref(null);

const triggerFileInput = () => fileInput.value.click();
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) localItem.value.url_photo = URL.createObjectURL(file);
};

const toggleStatus = () => {
  localItem.value.status = localItem.value.status === 'Active' ? 'Inactive' : 'Active';
};

const isValid = computed(() => {
  return localItem.value.code?.trim() &&
         localItem.value.name?.trim() &&
         localItem.value.category_id && 
         localItem.value.uom?.trim(); 
});

const isModified = computed(() => {
  if (!isEditing.value) return true;
  return JSON.stringify(localItem.value) !== JSON.stringify(originalItem.value);
});

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
    if (props.itemToEdit) {
      localItem.value = JSON.parse(JSON.stringify(props.itemToEdit));
      originalItem.value = JSON.parse(JSON.stringify(props.itemToEdit));
    } else {
      localItem.value = {
        code: '', name: '', description: '', category_id: '',
        uom: 'Pcs', min_stock: 0, max_stock: 0, price: 0,
        status: 'Active', created_by: 'Admin', url_photo: ''
      };
      originalItem.value = {};
    }
  } else {
    document.body.style.overflow = '';
  }
});

onUnmounted(() => document.body.style.overflow = '');
const onClose = () => emit('close');
const onSave = () => {
  if (isValid.value) emit('save', localItem.value);
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