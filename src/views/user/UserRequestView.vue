<template>
  <div class="space-y-6 pb-20 animate-fade-in-up">
    
    <Transition name="toast">
      <div v-if="toast.show" 
           class="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border transition-all w-max max-w-sm backdrop-blur-md" 
           :class="toast.type === 'success' ? 'bg-white/95 text-slate-800 border-l-4 border-green-500' : 'bg-white/95 text-slate-800 border-l-4 border-red-500'"
      >
        <div class="h-8 w-8 rounded-full flex items-center justify-center shrink-0" :class="toast.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
          <component :is="toast.type === 'success' ? CheckIcon : XMarkIcon" class="h-5 w-5" />
        </div>
        <div>
          <h4 class="text-sm font-bold">{{ toast.title }}</h4>
          <p class="text-xs opacity-80">{{ toast.message }}</p>
        </div>
        <button @click="toast.show = false" class="ml-4 opacity-40 hover:opacity-100 transition-opacity"><XMarkIcon class="h-5 w-5" /></button>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div v-if="detailModal.show" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeDetailModal"></div>

        <div class="relative w-full max-w-4xl h-[85vh] bg-slate-50 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up ring-1 ring-white/20">
            
            <div class="px-8 py-6 border-b border-slate-200 bg-white flex justify-between items-start shrink-0 z-10 relative">
                <div>
                    <div class="flex items-center gap-3 mb-2">
                        <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border flex items-center gap-1.5"
                              :class="{
                                'bg-amber-100 text-amber-700 border-amber-200': detailModal.data.status === 'Pending',
                                'bg-blue-100 text-blue-700 border-blue-200': detailModal.data.status !== 'Pending'
                              }">
                              <span class="w-2 h-2 rounded-full" :class="detailModal.data.status === 'Pending' ? 'bg-amber-500' : 'bg-blue-500'"></span>
                              {{ detailModal.data.status === 'Pending' ? 'Menunggu Proses' : 'Selesai Diproses' }}
                        </span>
                        <span class="text-xs text-slate-400 font-mono font-bold tracking-wider">#{{ detailModal.data.code }}</span>
                    </div>
                    <h2 class="text-2xl font-black text-slate-800 tracking-tight">Detail Transaksi</h2>
                    <p class="text-sm text-slate-500 mt-1 flex items-center gap-2">
                        <UserIcon class="h-4 w-4 text-blue-600" /> 
                        <span class="font-bold text-slate-700">{{ currentUser?.full_name }}</span> 
                        <span class="text-slate-300">|</span> 
                        <span class="text-slate-500">{{ currentUser?.unit_name }}</span>
                    </p>
                </div>
                <button @click="closeDetailModal" class="p-2 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors">
                    <XMarkIcon class="h-6 w-6" />
                </button>
            </div>

            <div class="px-8 py-5 bg-white border-b border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
                <div class="space-y-1">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Waktu Pengajuan</p>
                    <p class="text-sm font-bold text-slate-700 font-mono flex items-center gap-2 bg-slate-50 w-fit px-2 py-1 rounded border border-slate-100">
                        <PaperAirplaneIcon class="h-4 w-4 text-blue-500" />
                        {{ formatDateTimeFull(detailModal.data.created_at) }} WIB
                    </p>
                </div>
                <div v-if="detailModal.data.status !== 'Pending'" class="space-y-1">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Waktu Diproses Admin</p>
                    <p class="text-sm font-bold text-slate-700 font-mono flex items-center gap-2 bg-slate-50 w-fit px-2 py-1 rounded border border-slate-100">
                        <CheckBadgeIcon class="h-4 w-4 text-emerald-500" />
                        {{ formatDateTimeFull(detailModal.data.updated_at || detailModal.data.trx_date) }} WIB
                    </p>
                </div>
                <div class="col-span-1 md:col-span-2">
                    <p class="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Catatan Pengajuan</p>
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm text-slate-600 italic flex gap-2"
                          :class="{'border-l-4 border-l-blue-500': detailModal.data.description.includes('System Alert')}">
                        <ChatBubbleBottomCenterTextIcon class="h-5 w-5 text-slate-400 shrink-0" />
                        "{{ detailModal.data.description || 'Tidak ada catatan.' }}"
                    </div>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                <div v-for="(item, idx) in detailModal.data.details" :key="idx" 
                     class="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-md"
                     :class="{
                        'border-slate-200': detailModal.data.status === 'Pending',
                        'border-emerald-500 ring-1 ring-emerald-500/20': detailModal.data.status !== 'Pending' && item.qty_approved >= item.qty,
                        'border-amber-500 ring-1 ring-amber-500/20': detailModal.data.status !== 'Pending' && item.qty_approved > 0 && item.qty_approved < item.qty,
                        'border-red-500 ring-1 ring-red-500/20': detailModal.data.status !== 'Pending' && (item.qty_approved === 0 || item.qty_approved === null)
                      }">
                    
                    <div class="w-full md:w-32 bg-slate-50 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-100 relative">
                        <img v-if="getDetailItem(item.item_id)?.url_photo" :src="getDetailItem(item.item_id).url_photo" class="h-20 w-20 object-contain mix-blend-multiply" />
                        <CubeIcon v-else class="h-10 w-10 text-slate-300" />
                        <span class="absolute top-2 left-2 text-[9px] font-bold text-slate-500 bg-white/90 px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                            {{ getCategoryName(getDetailItem(item.item_id)?.category_id) }}
                        </span>
                    </div>

                    <div class="flex-1 p-5 flex flex-col justify-center">
                        <div class="flex justify-between items-start mb-1">
                            <div>
                                <h4 class="text-base font-bold text-slate-800 leading-tight">{{ getDetailItem(item.item_id)?.name || 'Unknown Item' }}</h4>
                                <p class="text-xs text-slate-400 font-mono mt-0.5">{{ getDetailItem(item.item_id)?.code }}</p>
                            </div>
                        </div>

                        <p v-if="item.notes" class="text-xs text-slate-500 mt-2 italic bg-slate-50 w-fit px-2 py-1 rounded border border-slate-100">
                            Note User: "{{ item.notes }}"
                        </p>

                        <div v-if="detailModal.data.status !== 'Pending'" 
                             class="mt-3 border p-3 rounded-xl flex items-start gap-3 shadow-sm animate-fade-in-up"
                             :class="{
                                 'bg-emerald-50 border-emerald-200': item.qty_approved >= item.qty,
                                 'bg-amber-50 border-amber-200': item.qty_approved > 0 && item.qty_approved < item.qty,
                                 'bg-red-50 border-red-200': item.qty_approved === 0 || item.qty_approved === null
                             }">
                            
                            <div class="p-1 rounded-full shrink-0"
                                 :class="{
                                    'bg-emerald-100 text-emerald-600': item.qty_approved >= item.qty,
                                    'bg-amber-100 text-amber-600': item.qty_approved > 0 && item.qty_approved < item.qty,
                                    'bg-red-100 text-red-600': item.qty_approved === 0 || item.qty_approved === null
                                 }">
                                <InformationCircleIcon class="h-4 w-4" />
                            </div>
                            
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-wide mb-0.5"
                                   :class="{
                                     'text-emerald-600': item.qty_approved >= item.qty,
                                     'text-amber-600': item.qty_approved > 0 && item.qty_approved < item.qty,
                                     'text-red-600': item.qty_approved === 0 || item.qty_approved === null
                                   }">
                                   {{ item.qty_approved === 0 ? 'Alasan Penolakan:' : 'Catatan Admin:' }}
                                </p>
                                
                                <p class="text-sm font-bold italic leading-snug"
                                   :class="{
                                     'text-emerald-800': item.qty_approved >= item.qty,
                                     'text-amber-800': item.qty_approved > 0 && item.qty_approved < item.qty,
                                     'text-red-800': item.qty_approved === 0 || item.qty_approved === null
                                   }">
                                    "{{ item.reject_reason || getAutoTemplateMessage(item) }}"
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="w-full md:w-40 bg-slate-50/50 border-t md:border-t-0 md:border-l border-slate-100 p-5 flex flex-col justify-center items-end text-right">
                        
                        <div class="mb-3">
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Permintaan</p>
                            <p class="text-lg font-black text-slate-700">{{ item.qty }} <span class="text-xs font-medium text-slate-400">Pcs</span></p>
                        </div>

                        <div v-if="detailModal.data.status !== 'Pending'">
                            <p class="text-[10px] font-bold uppercase tracking-wider mb-0.5" 
                               :class="{
                                   'text-emerald-600': item.qty_approved >= item.qty,
                                   'text-amber-600': item.qty_approved > 0 && item.qty_approved < item.qty,
                                   'text-red-600': item.qty_approved === 0 || item.qty_approved === null
                               }">
                                <span v-if="item.qty_approved > item.qty">Disetujui Lebih</span>
                                <span v-else-if="item.qty_approved === item.qty">Disetujui Penuh</span>
                                <span v-else-if="item.qty_approved > 0">Disetujui Sebagian</span>
                                <span v-else>Ditolak</span>
                            </p>
                            
                            <div class="flex items-baseline justify-end gap-1">
                                <p class="text-2xl font-black" 
                                   :class="{
                                      'text-emerald-600': item.qty_approved >= item.qty,
                                      'text-amber-600': item.qty_approved > 0 && item.qty_approved < item.qty,
                                      'text-red-600': item.qty_approved === 0 || item.qty_approved === null
                                   }">
                                    {{ item.qty_approved ?? 0 }}
                                </p>
                                <span class="text-xs font-bold" 
                                      :class="{
                                          'text-emerald-600': item.qty_approved >= item.qty,
                                          'text-amber-600': item.qty_approved > 0 && item.qty_approved < item.qty,
                                          'text-red-600': item.qty_approved === 0 || item.qty_approved === null
                                      }">Pcs</span>
                            </div>
                        </div>

                        <div v-else>
                            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg border border-amber-200">
                                <ClockIcon class="h-4 w-4" /> Menunggu
                            </span>
                        </div>

                    </div>
                </div>
            </div>

        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div v-if="consumeModal.show" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeConsumeModal"></div>
        <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-up ring-1 ring-white/10">
            
            <div class="bg-gradient-to-r from-orange-500 to-amber-500 p-6 flex items-start justify-between text-white shadow-lg relative z-10">
                <div class="flex items-center gap-4">
                    <div class="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md border border-white/20 shadow-inner">
                        <BoltIcon class="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h3 class="text-xl font-black leading-tight tracking-tight">Lapor Pemakaian</h3>
                        <p class="text-xs text-orange-100 font-medium mt-0.5 opacity-90">Stok berkurang otomatis.</p>
                    </div>
                </div>
                <button @click="closeConsumeModal" class="text-white/60 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg">
                    <XMarkIcon class="h-6 w-6" />
                </button>
            </div>

            <div class="p-6 space-y-6 bg-white">
                
                <div class="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div class="absolute right-0 top-0 bottom-0 w-1 bg-orange-400"></div>
                    <div class="h-16 w-16 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-2 shadow-sm shrink-0">
                        <img v-if="consumeModal.item?.url_photo" :src="consumeModal.item.url_photo" class="h-full w-full object-contain mix-blend-multiply" />
                        <CubeIcon v-else class="h-8 w-8 text-slate-300" />
                    </div>
                    <div class="min-w-0">
                        <p class="text-xs text-slate-400 font-mono mb-0.5">{{ consumeModal.item?.code }}</p>
                        <h4 class="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">{{ consumeModal.item?.name }}</h4>
                        <div class="flex items-center gap-2 mt-1.5">
                            <span class="text-[10px] font-bold bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-100 uppercase tracking-wide">
                                Stok Unit: {{ getUnitStock(consumeModal.item?.id) }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="space-y-5">
                    <div class="grid grid-cols-2 gap-4 items-end">
                        <div class="col-span-2">
                            <label class="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                                <span>Jumlah Dipakai <span class="text-red-500">*</span></span>
                                <span class="text-slate-400 font-normal normal-case">Sisa nanti: <b class="text-slate-700">{{ getUnitStock(consumeModal.item?.id) - consumeForm.qty }}</b></span>
                            </label>
                            <div class="relative group">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <ArchiveBoxIcon class="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <input type="number" 
                                       v-model.number="consumeForm.qty" 
                                       min="1" 
                                       :max="getUnitStock(consumeModal.item?.id)" 
                                       class="w-full pl-12 pr-12 py-3 rounded-xl border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all bg-slate-50 focus:bg-white text-lg"
                                       placeholder="0"
                                />
                                <span class="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-slate-400 pointer-events-none">{{ consumeModal.item?.uom }}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Keperluan / Keterangan <span class="text-red-500">*</span></label>
                        <div class="relative group">
                            <textarea v-model="consumeForm.reason" 
                                      rows="2" 
                                      class="w-full rounded-xl border-slate-200 text-sm p-4 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all bg-slate-50 focus:bg-white resize-none leading-relaxed" 
                                      placeholder="Contoh: Digunakan untuk kebutuhan rapat..."
                            ></textarea>
                        </div>
                    </div>
                </div>

            </div>

            <div class="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
                <button @click="closeConsumeModal" class="flex-1 py-3.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 hover:text-slate-800 transition-colors shadow-sm">
                    Batal
                </button>
                <button @click="submitConsume" 
                        :disabled="!consumeForm.qty || consumeForm.qty < 1 || !consumeForm.reason || consumeForm.qty > getUnitStock(consumeModal.item?.id)"
                        class="flex-1 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 flex items-center justify-center gap-2">
                    <BoltIcon class="h-4 w-4" />
                    Konfirmasi
                </button>
            </div>
        </div>
      </div>
    </Transition>

    <div class="bg-white rounded-2xl p-5 shadow-sm border border-blue-50 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-30 backdrop-blur-xl bg-white/90 transition-all">
      <div class="flex items-center gap-4 w-full md:w-auto">
        <div class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-blue-100">
          {{ getFirstName(currentUser?.full_name).charAt(0) }}
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-800 leading-tight">Halo, {{ getFirstName(currentUser?.full_name) }}!</h1>
          <p class="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
            <BuildingOfficeIcon class="h-3 w-3 text-blue-500" /> {{ currentUser?.unit_name }}
            <span class="w-1 h-1 rounded-full bg-slate-300"></span>
            <span class="text-blue-600 font-bold">{{ currentUser?.position_name }}</span>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto justify-end">
        <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button @click="activeTab = 'catalog'" class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2" :class="activeTab === 'catalog' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'">
            <Squares2X2Icon class="h-4 w-4" /> Katalog
          </button>
          <button @click="activeTab = 'history'" class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2" :class="activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'">
            <ClockIcon class="h-4 w-4" /> Riwayat
          </button>
        </div>

        <div class="relative" ref="notificationRef">
          <button @click="toggleNotifications" class="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all relative shadow-sm">
            <BellIcon class="h-5 w-5" />
            <span v-if="unreadNotifications.length > 0 && !isNotificationRead" class="absolute top-2 right-2.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
          </button>
          
          <Transition name="fade">
            <div v-if="showNotifications" class="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden ring-1 ring-black/5">
                <div class="p-4 border-b border-slate-50 bg-slate-50/80 backdrop-blur flex justify-between items-center">
                    <h4 class="text-xs font-bold text-slate-700">Notifikasi Terbaru</h4>
                    <span class="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">{{ unreadNotifications.length }} Update</span>
                </div>
                <div class="max-h-64 overflow-y-auto custom-scrollbar">
                    <div v-if="unreadNotifications.length === 0" class="p-6 text-center text-slate-400 text-xs">Semua permintaan telah dicek.</div>
                    
                    <div v-else v-for="notif in unreadNotifications" :key="notif.id" class="p-4 border-b border-slate-50 hover:bg-blue-50/30 transition-colors cursor-pointer group" @click="openDetailModalFromNotif(notif)">
                        <div class="flex gap-3 items-start">
                            <div class="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
                                 :class="{
                                    'bg-blue-100 text-blue-600': notif.status === 'Pending', 
                                    'bg-emerald-100 text-emerald-600': notif.status === 'Completed',
                                    'bg-red-100 text-red-600': notif.status === 'Rejected'
                                 }">
                                <InformationCircleIcon v-if="notif.status === 'Pending'" class="h-5 w-5" />
                                <CheckBadgeIcon v-else-if="notif.status === 'Completed'" class="h-5 w-5" />
                                <XCircleIcon v-else class="h-5 w-5" />
                            </div>
                            <div>
                                <p class="text-xs text-slate-700 font-medium leading-snug">
                                    <span v-if="notif.status === 'Pending'">
                                        <span class="font-bold text-blue-600">Pesan Admin:</span> Stok Menipis. Harap cek request <span class="font-mono">{{ notif.code }}</span>.
                                    </span>
                                    <span v-else>
                                        Request <span class="font-mono font-bold text-blue-600">{{ notif.code }}</span> telah diproses.
                                    </span>
                                </p>
                                <p class="text-[10px] text-slate-400 mt-1 font-mono">
                                    {{ getRelativeTime(notif.updated_at || notif.trx_date || notif.created_at) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </Transition>
        </div>

        <button v-if="activeTab === 'catalog'" @click="isCartOpen = true" class="relative p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center gap-2 pr-4 group">
           <ShoppingCartIcon class="h-5 w-5 group-hover:scale-110 transition-transform" />
           <span class="text-xs font-bold">Keranjang</span>
           <span v-if="cart.length > 0" class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">{{ cart.length }}</span>
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'catalog'">
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input v-model="searchQuery" type="text" placeholder="Cari barang (nama, kode)..." class="w-full pl-11 pr-4 py-3 rounded-2xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm bg-white" />
        </div>
        <select v-model="selectedCategory" class="px-4 py-3 rounded-2xl border-slate-200 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 text-slate-600 bg-white min-w-[200px] cursor-pointer">
          <option value="All">Semua Kategori</option>
          <option v-for="cat in store.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="item in filteredCatalog" :key="item.id" class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden group flex flex-col relative">
          
          <div class="absolute top-3 right-3 z-10">
              <span class="px-2.5 py-1 text-[10px] font-bold rounded-lg shadow-sm backdrop-blur-sm border flex items-center gap-1.5"
                    :class="getStockStatus(item).class">
                  <span class="w-2 h-2 rounded-full" :class="getStockStatus(item).dot"></span>
                  {{ getStockStatus(item).label }}
              </span>
          </div>

          <div class="h-44 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden flex items-center justify-center p-6 group-hover:from-blue-50/50 transition-colors">
              <img v-if="item.url_photo" :src="item.url_photo" class="h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500" />
              <div v-else class="flex flex-col items-center text-slate-300"><CubeIcon class="h-12 w-12 mb-1" /><span class="text-[10px] font-bold">No Image</span></div>
          </div>
          <div class="p-5 flex-1 flex flex-col border-t border-slate-50">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider">{{ getCategoryName(item.category_id) }}</span>
                </div>
                <h3 class="text-sm font-bold text-slate-800 line-clamp-2 min-h-[40px] leading-snug group-hover:text-blue-600 transition-colors">{{ item.name }}</h3>
                <p class="text-[10px] text-slate-400 mt-1 font-mono flex items-center gap-1"><TagIcon class="h-3 w-3" /> {{ item.code }}</p>
              </div>
              <div class="mt-4 grid grid-cols-2 gap-2 text-[10px] font-medium text-slate-500">
                 <div class="bg-slate-50 p-1.5 rounded text-center border border-slate-100">Stok: <b class="text-slate-700">{{ getUnitStock(item.id) }}</b></div>
                 <div class="bg-slate-50 p-1.5 rounded text-center border border-slate-100">Max: <b class="text-slate-700">{{ item.max_stock }}</b></div>
              </div>
              
              <div class="mt-4 flex gap-2">
                  <button @click="openConsumeModal(item)" 
                          :disabled="getUnitStock(item.id) <= 0"
                          class="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95 border border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100"
                          title="Lapor Pemakaian Langsung (Tanpa Approval)">
                      <BoltIcon class="h-4 w-4" /> Pakai
                  </button>

                  <button @click="addToCart(item)" 
                          :disabled="getRemainingQuota(item.id) <= 0 || isInCart(item.id)" 
                          class="flex-[2] py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md" 
                          :class="[
                            isInCart(item.id) ? 'bg-emerald-50 text-emerald-600 cursor-not-allowed border border-emerald-100 shadow-none' 
                            : getRemainingQuota(item.id) <= 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-600/30'
                          ]">
                      <component :is="isInCart(item.id) ? CheckCircleIcon : PlusCircleIcon" class="h-4 w-4" /> 
                      <span v-if="isInCart(item.id)">Keranjang</span>
                      <span v-else-if="getRemainingQuota(item.id) <= 0">Penuh</span>
                      <span v-else>Request</span>
                  </button>
              </div>
          </div>
        </div>
      </div>
      
      <div v-if="filteredCatalog.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
         <div class="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100"><MagnifyingGlassIcon class="h-10 w-10 text-slate-300" /></div>
         <h3 class="text-lg font-bold text-slate-700">Barang tidak ditemukan</h3>
         <p class="text-sm text-slate-400 mt-1">Coba gunakan kata kunci lain atau ubah kategori.</p>
      </div>
    </div>

    <div v-if="activeTab === 'history'" class="animate-fade-in-up space-y-8">
        
        <div v-if="Object.keys(groupedTransactions).length === 0" class="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed">
            <div class="bg-slate-50 p-6 rounded-full mb-4"><ClockIcon class="h-12 w-12 text-slate-300" /></div>
            <h3 class="text-slate-600 font-bold text-lg">Belum ada riwayat pengajuan</h3>
            <p class="text-slate-400 text-sm mt-1">Permintaan Anda akan muncul di sini.</p>
            <button @click="activeTab='catalog'" class="mt-6 text-blue-600 font-bold text-sm hover:underline">Mulai Request Baru &rarr;</button>
        </div>

        <div v-for="(transactions, date) in groupedTransactions" :key="date">
            <div class="sticky top-[88px] z-20 flex items-center gap-4 mb-6 py-2 bg-[#F8FAFC]/90 backdrop-blur-sm">
                <div class="h-px bg-slate-300 flex-1"></div>
                <div class="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm text-slate-600">
                    <CalendarDaysIcon class="h-4 w-4 text-blue-500" />
                    <span class="text-xs font-bold uppercase tracking-widest">{{ date }}</span>
                </div>
                <div class="h-px bg-slate-300 flex-1"></div>
            </div>

            <div class="space-y-4 px-1">
                <div v-for="trx in transactions" :key="trx.id" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group hover:border-blue-300" @click="openDetailModal(trx)">
                    <div class="flex items-start gap-4">
                        <div class="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors"
                             :class="{
                                'bg-amber-50 border-amber-100 text-amber-500': trx.status === 'Pending',
                                'bg-blue-50 border-blue-100 text-blue-600': trx.status !== 'Pending'
                             }">
                            <ClockIcon v-if="trx.status === 'Pending'" class="h-6 w-6 animate-pulse" />
                            <ClipboardDocumentCheckIcon v-else class="h-6 w-6" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="text-sm font-bold text-slate-800">{{ trx.code }}</h4>
                                    <p class="text-xs text-slate-500 mt-0.5 line-clamp-1 italic">"{{ trx.description }}"</p>
                                </div>
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border"
                                      :class="{
                                        'bg-amber-100 text-amber-700 border-amber-200': trx.status === 'Pending',
                                        'bg-blue-100 text-blue-700 border-blue-200': trx.status !== 'Pending'
                                      }">
                                      {{ trx.status === 'Pending' ? 'Menunggu Proses' : 'Selesai Diproses' }}
                                </span>
                            </div>
                            <div class="flex items-center gap-3 mt-3 text-[10px] font-mono text-slate-400">
                                <span class="bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center gap-1">
                                    <PaperAirplaneIcon class="h-3 w-3" /> {{ getRelativeTime(trx.created_at) }}
                                </span>
                                <span v-if="trx.status !== 'Pending'" class="bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center gap-1">
                                    <CheckBadgeIcon class="h-3 w-3 text-blue-500" /> Updated: {{ getRelativeTime(trx.trx_date || trx.updated_at) }}
                                </span>
                                <span class="ml-auto text-blue-600 font-bold group-hover:underline">Lihat Detail &rarr;</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Transition name="slide-over">
      <div v-if="isCartOpen" class="fixed inset-0 z-[100] flex justify-end">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="isCartOpen = false"></div>
          <div class="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col transform transition-transform animate-slide-in-right">
             <div class="p-6 border-b border-blue-100 flex justify-between items-center bg-blue-600 text-white shadow-md z-10">
                <div>
                  <h3 class="text-lg font-bold flex items-center gap-2"><ShoppingCartIcon class="h-6 w-6 text-blue-200"/> Keranjang Request</h3>
                  <p class="text-blue-100 text-xs mt-0.5">{{ cart.length }} Item dipilih</p>
                </div>
                <button @click="isCartOpen = false" class="text-blue-200 hover:text-white transition-colors bg-white/10 p-1.5 rounded-lg"><XMarkIcon class="h-6 w-6"/></button>
             </div>
             <div class="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50">
                <div v-if="cart.length === 0" class="flex flex-col items-center justify-center h-full text-slate-400">
                   <div class="bg-white p-4 rounded-full shadow-sm mb-3 border border-slate-100"><ShoppingCartIcon class="h-10 w-10 text-slate-300" /></div>
                   <p class="text-sm font-medium">Keranjang masih kosong.</p>
                </div>
                <TransitionGroup name="list" tag="div" class="space-y-4">
                  <div v-for="(cartItem, idx) in cart" :key="cartItem.id" class="p-4 border border-slate-200 rounded-2xl bg-white shadow-sm relative group hover:border-blue-300 transition-colors">
                      <button @click="removeFromCart(idx)" class="absolute -top-2 -right-2 bg-white border border-slate-200 text-slate-400 rounded-full p-1 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors shadow-sm z-10"><XMarkIcon class="h-4 w-4" /></button>
                      <div class="flex gap-4">
                          <div class="h-14 w-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                             <img v-if="cartItem.url_photo" :src="cartItem.url_photo" class="h-full w-full object-cover" />
                             <CubeIcon v-else class="h-6 w-6 text-slate-300" />
                          </div>
                          <div class="flex-1 min-w-0">
                             <p class="text-xs font-bold text-slate-800 line-clamp-1">{{ cartItem.name }}</p>
                             <p class="text-[10px] text-slate-500 mb-2 font-mono">{{ cartItem.code }}</p>
                             <div class="flex justify-between items-end">
                                <div class="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                                 <button @click="updateCartQty(cartItem, -1, idx)" class="px-2.5 py-1 text-slate-500 hover:bg-blue-100 hover:text-blue-600 rounded-l-lg transition-colors font-bold">-</button>
                                 <input type="number" v-model.number="cartItem.qty" @change="validateInputQty(cartItem, idx)" @keydown="preventAlpha" class="w-12 text-center bg-transparent border-none text-xs font-bold focus:ring-0 p-0 text-slate-700 no-spinner" />
                                 <button @click="updateCartQty(cartItem, 1, idx)" :disabled="getRemainingQuota(cartItem.id) - cartItem.qty <= 0" class="px-2.5 py-1 text-slate-500 hover:bg-blue-100 hover:text-blue-600 rounded-r-lg transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed">+</button>
                                </div>
                                <span class="text-[9px] font-bold text-slate-400">Max: <span class="text-blue-600">{{ getRemainingQuota(cartItem.id) }}</span></span>
                             </div>
                          </div>
                      </div>
                      <div class="mt-3 pt-3 border-t border-slate-100">
                          <input type="text" v-model="cartItem.notes" placeholder="Catatan per item (opsional)..." class="w-full text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-700 placeholder:text-slate-400" />
                      </div>
                   </div>
                </TransitionGroup>
             </div>
             <div class="p-6 border-t border-slate-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                <label class="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Alasan / Keterangan Pengajuan <span class="text-red-500">*</span></label>
                <textarea v-model="requestDescription" rows="2" class="w-full rounded-xl border-slate-200 text-xs focus:ring-blue-500 focus:border-blue-500 mb-4 p-3 bg-slate-50" placeholder="Contoh: Kebutuhan operasional bulan ini..."></textarea>
                <button @click="handleSubmit" :disabled="cart.length === 0 || !requestDescription" class="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2" :class="(cart.length > 0 && requestDescription) ? 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5' : 'bg-slate-300 cursor-not-allowed'"><PaperAirplaneIcon class="h-4 w-4" /> Kirim Pengajuan</button>
             </div>
          </div>
       </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useInventoryStore } from '../../stores/inventoryStore'; 
import { 
  PlusCircleIcon, CheckCircleIcon, CubeIcon, ShoppingCartIcon, 
  MagnifyingGlassIcon, XMarkIcon, Squares2X2Icon, ClockIcon, 
  BellIcon, BuildingOfficeIcon, ArchiveBoxIcon, CheckIcon, PaperAirplaneIcon,
  ChevronDownIcon, ChevronUpIcon, ClipboardDocumentCheckIcon, CheckBadgeIcon, TagIcon, ChatBubbleBottomCenterTextIcon, ExclamationCircleIcon,
  UserIcon, InformationCircleIcon, XCircleIcon, BoltIcon
} from '@heroicons/vue/24/outline';

const store = useInventoryStore();
const activeTab = ref('catalog'); 
const isCartOpen = ref(false);
const showNotifications = ref(false);
const notificationRef = ref(null);
const cart = ref([]);
const requestDescription = ref('');
const searchQuery = ref('');
const selectedCategory = ref('All');
const toast = ref({ show: false, type: 'success', title: '', message: '' });
const isNotificationRead = ref(false); 

// --- DETAIL MODAL STATE ---
const detailModal = ref({
    show: false,
    data: {}
});

// --- CONSUME (DIRECT USE) MODAL STATE ---
const consumeModal = ref({
    show: false,
    item: null
});
const consumeForm = ref({
    qty: 1,
    reason: ''
});

// --- ACTIONS MODAL CONSUME ---
const openConsumeModal = (item) => {
    consumeModal.value.item = item;
    consumeForm.value = { qty: 1, reason: '' };
    consumeModal.value.show = true;
};

const closeConsumeModal = () => {
    consumeModal.value.show = false;
    consumeModal.value.item = null;
};

const submitConsume = () => {
    if (!consumeForm.value.qty || consumeForm.value.qty < 1 || !consumeForm.value.reason) {
        showToast('error', 'Gagal', 'Lengkapi jumlah dan keterangan.');
        return;
    }

    try {
        store.consumeStock({
            user_id: currentUserId,
            unit_id: currentUser.value.unit_id,
            item_id: consumeModal.value.item.id,
            qty: consumeForm.value.qty,
            reason: consumeForm.value.reason
        });
        showToast('success', 'Berhasil', `Stok ${consumeModal.value.item.name} berhasil dipakai.`);
        closeConsumeModal();
    } catch (error) {
        showToast('error', 'Gagal', error.message || 'Terjadi kesalahan.');
    }
};

const openDetailModal = (trx) => {
    detailModal.value.data = trx;
    detailModal.value.show = true;
};

const openDetailModalFromNotif = (trx) => {
    openDetailModal(trx);
    showNotifications.value = false;
};

const closeDetailModal = () => {
    detailModal.value.show = false;
};

// --- SCROLL LOCK WATCHER ---
watch(() => detailModal.value.show || consumeModal.value.show, (val) => {
    document.body.style.overflow = val ? 'hidden' : '';
});

// --- LOGIC TEMPLATE PESAN OTOMATIS ---
const getAutoTemplateMessage = (item) => {
    if (item.qty_approved === 0 || item.qty_approved === null) return "Permintaan ditolak / Stok Kosong";
    if (item.qty_approved > item.qty) return "Penambahan dari Admin (Bonus/Min Order)";
    if (item.qty_approved < item.qty) return "Stok terbatas / Disesuaikan oleh Admin";
    return "Permintaan disetujui sesuai pengajuan";
};

// --- LOGIC NOTIFIKASI ---
const toggleNotifications = () => { 
    showNotifications.value = !showNotifications.value; 
    if (showNotifications.value) {
        isNotificationRead.value = true; 
    }
};

const handleClickOutside = (event) => { if (notificationRef.value && !notificationRef.value.contains(event.target)) { showNotifications.value = false; } };
onMounted(() => { document.addEventListener('click', handleClickOutside); });
onUnmounted(() => { 
    document.removeEventListener('click', handleClickOutside); 
    document.body.style.overflow = ''; // Clean up scroll lock
});

// USER & DATA
const storedUser = JSON.parse(localStorage.getItem('activeUser') || '{}');
const currentUserId = storedUser.id || 1; 

const currentUser = computed(() => {
  const user = store.users.find(u => u.id === currentUserId);
  const unit = store.units.find(u => u.id === user?.unit_id);
  return { ...user, unit_name: unit ? unit.alias : 'Unknown Unit' };
});

// HELPERS
const getFirstName = (name) => name ? name.split(' ')[0] : 'User';
const getCategoryName = (id) => store.categories.find(c => c.id === id)?.name || 'Umum';
const getDetailItem = (itemId) => store.atks.find(i => i.id === itemId);

// --- HELPER BARU: STATUS STOK (LOGIKA YANG DIMINTA) ---
const getStockStatus = (item) => {
    const stock = getUnitStock(item.id);
    const min = item.min_stock || 0;
    const max = item.max_stock || 100;

    if (stock === 0) return { label: 'Stok Kosong', class: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' };
    if (stock >= max) return { label: 'Stok Penuh', class: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' };
    if (stock <= min) return { label: 'Stok Menipis', class: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
    
    return { label: 'Tersedia', class: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
};

// --- FORMAT WAKTU LENGKAP & RELATIF ---
const formatDateHeader = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

const formatDateTimeFull = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }).replace(/\./g, ':');
};

const getRelativeTime = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    
    return formatDateTimeFull(isoString);
};

const getUnitStock = (itemId) => {
    const stock = store.stocks.find(s => s.item_id === itemId && s.unit_id === currentUser.value.unit_id);
    return stock ? stock.stock : 0;
};

const getRemainingQuota = (itemId) => {
    const item = store.atks.find(i => i.id === itemId);
    const currentStock = getUnitStock(itemId);
    if (!item) return 0;
    return Math.max(0, item.max_stock - currentStock);
};

const filteredCatalog = computed(() => {
    let items = store.atks;
    if (selectedCategory.value !== 'All') items = items.filter(i => i.category_id === selectedCategory.value);
    if (searchQuery.value) {
        const lower = searchQuery.value.toLowerCase();
        items = items.filter(i => i.name.toLowerCase().includes(lower) || i.code.toLowerCase().includes(lower));
    }
    return items;
});

// CART LOGIC
const isInCart = (itemId) => cart.value.some(c => c.id === itemId);

const addToCart = (item) => {
    if (isInCart(item.id)) { showToast('error', 'Info', 'Barang sudah ada di keranjang.'); return; }
    const quota = getRemainingQuota(item.id);
    if (quota <= 0) { showToast('error', 'Gudang Penuh', 'Stok di unit Anda sudah maksimal.'); return; }
    cart.value.push({ id: item.id, name: item.name, code: item.code, qty: 1, notes: '', url_photo: item.url_photo });
    showToast('success', 'Berhasil', 'Masuk keranjang. Atur jumlahnya nanti.');
};

const removeFromCart = (index) => cart.value.splice(index, 1);

const updateCartQty = (cartItem, change, index) => {
    const quota = getRemainingQuota(cartItem.id);
    const newQty = cartItem.qty + change;
    if (newQty < 1) { removeFromCart(index); return; }
    if (newQty > quota) { showToast('error', 'Batas Maksimum', `Sisa slot gudang hanya ${quota} pcs.`); cartItem.qty = quota; return; }
    cartItem.qty = newQty;
};

const preventAlpha = (e) => {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'];
  if (allowedKeys.includes(e.key)) return;
  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
};

const validateInputQty = (cartItem, index) => {
    const quota = getRemainingQuota(cartItem.id);
    if (!cartItem.qty || cartItem.qty < 1) cartItem.qty = 1;
    else if (cartItem.qty > quota) { showToast('error', 'Batas Maksimum', `Disesuaikan ke batas max: ${quota} pcs.`); cartItem.qty = quota; }
};

const handleSubmit = () => {
    if (cart.value.length === 0) return;
    const payload = {
        user_id: currentUserId,
        unit_id: currentUser.value.unit_id,
        description: requestDescription.value,
        details: cart.value.map(c => ({ item_id: c.id, qty: c.qty, notes: c.notes }))
    };
    store.createTransaction(payload);
    cart.value = [];
    requestDescription.value = '';
    isCartOpen.value = false;
    showToast('success', 'Permintaan Terkirim', 'Cek status di menu Riwayat.');
    isNotificationRead.value = false; 
};

// --- FIX DATA JOIN TRANSAKSI & DETAILS ---
const myTransactions = computed(() => {
    const allTrx = store.transactions || store.pendingTransactionList || [];
    const allDetails = store.transactionDetails || []; 

    const userTrx = allTrx.filter(t => t.user_id === currentUserId);

    return userTrx.map(trx => {
        const details = allDetails.filter(d => d.transaction_id === trx.id);
        return { ...trx, details: details };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

const groupedTransactions = computed(() => {
    const groups = {};
    myTransactions.value.forEach(trx => {
        const dateKey = formatDateHeader(trx.created_at);
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(trx);
    });
    return groups;
});

const unreadNotifications = computed(() => {
    return myTransactions.value
        .filter(t => 
             t.status === 'Completed' || 
             t.status === 'Rejected' || 
             (t.status === 'Pending' && t.description && t.description.includes('System Alert'))
        )
        .slice(0, 5); 
});

const showToast = (type, title, message) => {
  toast.value = { show: true, type, title, message };
  setTimeout(() => toast.value.show = false, 3000);
};
</script>

<style scoped>
.no-spinner::-webkit-inner-spin-button, .no-spinner::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.no-spinner { -moz-appearance: textfield; }
.animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(30px); }
.toast-enter-active, .toast-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-20px) translateX(-50%); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

/* Modal Scale Animation */
.animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>