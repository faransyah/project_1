<template>
  <div class="space-y-6 pb-20 animate-fade-in-up">

    <Transition name="toast-slide-top">
      <div 
        v-if="toast.show" 
        class="fixed top-20 left-1/2 z-[100] w-full max-w-sm -translate-x-1/2 transform px-4"
      >
        <div 
          class="flex items-center overflow-hidden rounded-2xl p-4 shadow-2xl backdrop-blur-xl ring-1 transition-all"
          :class="{ 
            'bg-white/95 text-slate-800 ring-slate-200': true, 
            'border-l-4 border-green-500': toast.type === 'success', 
            'border-l-4 border-red-500': toast.type === 'error' 
          }"
        >
          <div class="flex-shrink-0">
            <CheckCircleIcon v-if="toast.type === 'success'" class="h-6 w-6 text-green-500" />
            <XCircleIcon v-if="toast.type === 'error'" class="h-6 w-6 text-red-500" />
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-semibold">{{ toast.message }}</p>
          </div>
          <button @click="toast.show = false" class="ml-4 flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div v-if="chartModal.show" class="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" @click="closeChartModal"></div>

        <div class="relative w-full max-w-4xl h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up ring-1 ring-white/20">
            
            <div class="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur shrink-0 z-20">
                <div>
                    <h3 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <component :is="chartModal.icon" class="h-6 w-6" :class="chartModal.colorClass" />
                        {{ chartModal.title }}
                    </h3>
                    <p class="text-sm text-slate-500 mt-1">{{ chartModal.subtitle }}</p>
                </div>
                <button @click="closeChartModal" class="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
                    <XMarkIcon class="h-6 w-6" />
                </button>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar bg-white relative">
                
                <div v-if="chartModal.data.length > 0" class="px-8 pt-6 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
                    <div class="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm relative overflow-hidden group">
                        <div class="absolute right-0 top-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <component :is="chartModal.type === 'transaction' ? TrophyIcon : ArrowTrendingUpIcon" class="h-16 w-16 text-emerald-600" />
                        </div>
                        <div class="h-12 w-12 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-sm border border-emerald-100 shrink-0">
                            <ArrowTrendingUpIcon class="h-6 w-6" />
                        </div>
                        <div>
                            <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">
                                {{ chartModal.type === 'transaction' ? 'Paling Banyak Diminta' : 'Stok Tertinggi' }}
                            </p>
                            <h4 class="text-sm font-black text-slate-800 line-clamp-1">{{ chartModal.stats.topItem?.name || '-' }}</h4>
                            <p class="text-xs text-slate-500 font-mono">
                                <span class="font-bold text-emerald-600">{{ chartModal.stats.topItem?.value || 0 }}</span> {{ chartModal.type === 'transaction' ? 'Pcs (Total)' : 'Unit' }}
                            </p>
                        </div>
                    </div>

                    <div class="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm relative overflow-hidden group">
                        <div class="absolute right-0 top-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                             <component :is="chartModal.type === 'transaction' ? ArrowTrendingDownIcon : ExclamationCircleIcon" class="h-16 w-16 text-amber-600" />
                        </div>
                        <div class="h-12 w-12 rounded-xl bg-white text-amber-600 flex items-center justify-center shadow-sm border border-amber-100 shrink-0">
                            <ArrowTrendingDownIcon class="h-6 w-6" />
                        </div>
                        <div>
                            <p class="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-0.5">
                                 {{ chartModal.type === 'transaction' ? 'Paling Sedikit Diminta' : 'Stok Terendah' }}
                            </p>
                            <h4 class="text-sm font-black text-slate-800 line-clamp-1">{{ chartModal.stats.lowItem?.name || '-' }}</h4>
                            <p class="text-xs text-slate-500 font-mono">
                                <span class="font-bold text-amber-600">{{ chartModal.stats.lowItem?.value || 0 }}</span> {{ chartModal.type === 'transaction' ? 'Pcs (Total)' : 'Unit' }}
                            </p>
                        </div>
                    </div>
                </div>

                <div v-if="chartModal.data.length === 0" class="flex flex-col items-center justify-center h-40 text-slate-400">
                    <CubeIcon class="h-12 w-12 mb-2 opacity-50" />
                    <p>Tidak ada data detail untuk item ini.</p>
                </div>

                <div v-if="chartModal.type === 'transaction'" class="w-full">
                    
                    <div class="px-8 pb-4">
                        <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Ringkasan Item</h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            <div 
                                v-for="(summary, idx) in itemSummaries" 
                                :key="idx"
                                class="relative flex items-center p-2 rounded-md border border-slate-100 shadow-sm transition-all hover:shadow-md bg-white border-l-[3px]"
                                :class="getCategoryColor(summary.categoryId)"
                            >
                                <div class="h-8 w-8 rounded bg-white/50 flex items-center justify-center shrink-0 mr-3 border border-black/5 overflow-hidden">
                                     <img v-if="summary.url_photo" :src="summary.url_photo" class="h-full w-full object-cover mix-blend-multiply" />
                                     <CubeIcon v-else class="h-4 w-4 opacity-50" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs font-bold truncate leading-tight">{{ summary.itemName }}</p>
                                    <div class="flex items-center gap-2 mt-0.5">
                                        <span class="text-[10px] font-medium opacity-80 bg-white/60 px-1.5 rounded">
                                           {{ summary.totalRequests }} Permintaan
                                        </span>
                                        <span class="text-[10px] font-bold opacity-100">
                                           {{ summary.totalQty }} Pcs
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <table class="w-full text-left border-collapse">
                        <thead class="bg-white sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.05)] border-b border-slate-100">
                            <tr>
                                <th class="py-3 pl-8 pr-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Detail Barang</th>
                                <th class="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Pemohon</th>
                                <th class="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Jumlah</th>
                                <th class="py-3 pl-4 pr-8 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(item, idx) in chartModal.data" :key="idx" class="hover:bg-slate-50 transition-colors group">
                                <td class="py-3 pl-8 pr-4">
                                    <div class="flex items-center gap-3">
                                        <div class="h-9 w-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                                            <img v-if="item.url_photo" :src="item.url_photo" class="h-full w-full object-cover mix-blend-multiply" />
                                            <CubeIcon v-else class="h-4 w-4 text-slate-300" />
                                        </div>
                                        <div class="min-w-0">
                                            <p class="text-xs font-bold text-slate-800 truncate">{{ item.itemName }}</p>
                                            <p class="text-[10px] text-slate-500 font-mono bg-slate-100 w-fit px-1.5 rounded">{{ item.itemCode }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-3 px-4">
                                    <div class="flex items-center gap-2">
                                        <div class="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                                            {{ item.userName.charAt(0) }}
                                        </div>
                                        <div class="min-w-0">
                                            <p class="text-xs font-bold text-slate-700 truncate">{{ item.userName }}</p>
                                            <p class="text-[10px] text-slate-400 truncate">{{ item.unitName }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-3 px-4 text-center">
                                    <span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold border border-slate-200">
                                        {{ item.qty }}
                                    </span>
                                </td>
                                <td class="py-3 pl-4 pr-8 text-right">
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border"
                                        :class="{
                                            'bg-emerald-50 text-emerald-600 border-emerald-100': item.status === 'Completed' || item.status === 'Approved',
                                            'bg-amber-50 text-amber-600 border-amber-100': item.status === 'Pending',
                                            'bg-red-50 text-red-600 border-red-100': item.status === 'Rejected'
                                        }">
                                        <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="{
                                             'bg-emerald-500': item.status === 'Completed',
                                             'bg-amber-500': item.status === 'Pending',
                                             'bg-red-500': item.status === 'Rejected'
                                        }"></span>
                                        {{ item.status }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-else-if="chartModal.type === 'stock'" class="px-8 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="(item, idx) in chartModal.data" :key="idx" class="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all group">
                         <div class="h-14 w-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden relative group-hover:bg-white transition-colors">
                            <img v-if="item.url_photo" :src="item.url_photo" class="h-full w-full object-cover mix-blend-multiply" />
                            <CubeIcon v-else class="h-6 w-6 text-slate-300" />
                            <div class="absolute top-0 right-0 bg-blue-500 w-2 h-2 rounded-bl-lg shadow-sm"></div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-[10px] font-bold text-blue-500 mb-0.5 uppercase tracking-wide">{{ item.categoryName }}</p>
                            <h4 class="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{{ item.itemName }}</h4>
                            <p class="text-[10px] text-slate-400 font-mono">{{ item.itemCode }}</p>
                        </div>
                        <div class="text-right">
                             <p class="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Stok</p>
                             <p class="text-xl font-black text-slate-700 leading-none group-hover:text-blue-600 transition-colors">{{ item.stock }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="px-8 py-5 bg-slate-50 border-t border-slate-200 text-right shrink-0 z-20">
                <button @click="closeChartModal" class="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 hover:text-slate-800 transition-colors shadow-sm active:scale-95">
                    Tutup
                </button>
            </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div v-if="approvalModal.show" class="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeApprovalModal"></div>

        <div class="relative w-full max-w-5xl h-[85vh] transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all flex flex-col animate-scale-up">
            
          <div class="relative bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 shrink-0 border-b border-white/10">
            <div class="flex items-start justify-between text-white">
              <div>
                <h3 class="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <ClipboardDocumentCheckIcon class="h-7 w-7 text-blue-200" />
                  Review Permintaan
                </h3>
                <div class="flex flex-wrap gap-3 mt-3">
                    <div class="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-semibold text-white">
                      <UserIcon class="h-3.5 w-3.5 opacity-80" /> {{ approvalModal.data?.user_name }}
                    </div>
                    <div class="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-semibold text-white">
                      <BuildingOfficeIcon class="h-3.5 w-3.5 opacity-80" /> {{ approvalModal.data?.unit_name }}
                    </div>
                    <div class="flex items-center gap-2 bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-bold font-mono">
                      <HashtagIcon class="h-3.5 w-3.5" /> {{ approvalModal.data?.code }}
                    </div>
                </div>
              </div>
              <button @click="closeApprovalModal" class="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300">
                <XMarkIcon class="h-6 w-6 text-white" />
              </button>
            </div>
          </div>

          <div class="px-8 pt-6 pb-2 shrink-0 bg-slate-50">
              <div class="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-4">
                <div class="bg-blue-100 rounded-lg p-2 h-fit text-blue-600">
                   <ChatBubbleBottomCenterTextIcon class="h-5 w-5" />
                </div>
                <div>
                   <h4 class="text-xs font-bold text-blue-700 uppercase mb-1">Catatan / Alasan User</h4>
                   <p class="text-sm text-slate-700 italic">"{{ approvalModal.data?.description || 'Tidak ada catatan khusus.' }}"</p>
                </div>
              </div>
          </div>

          <div class="p-8 overflow-y-auto custom-scrollbar bg-slate-50 flex-1">
            <div class="space-y-5">
                
              <div 
                v-for="(item, index) in approvalModal.items" 
                :key="item.item_id" 
                class="bg-white rounded-2xl border p-5 shadow-sm transition-all flex flex-col xl:flex-row gap-6 items-start xl:items-center group hover:shadow-md"
                :class="{
                  'border-red-200 bg-red-50/20': item.action === 'reject',
                  'border-emerald-200 bg-emerald-50/20': item.action === 'approve' && item.approved_qty >= item.reqQty,
                  'border-amber-200 bg-amber-50/20': item.action === 'approve' && item.approved_qty > 0 && item.approved_qty < item.reqQty,
                  'border-slate-200': !item.action
                }"
              >
                <div class="flex items-start gap-5 flex-1 w-full xl:w-auto">
                    <div class="h-20 w-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 relative shadow-sm">
                      <img v-if="item.url_photo" :src="item.url_photo" class="h-full w-full object-cover" />
                      <CubeIcon v-else class="h-10 w-10 text-slate-300" />
                      <span class="absolute top-0 left-0 bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg">#{{ index + 1 }}</span>
                    </div>
                    
                    <div class="min-w-0 flex-1">
                      <p class="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{{ item.itemName }}</p>
                      <p class="text-xs text-slate-500 font-mono bg-slate-100 w-fit px-2 py-0.5 rounded mt-1">{{ item.itemCode }}</p>
                       
                      <p v-if="item.notes" class="text-xs text-slate-500 mt-2 flex items-center gap-1">
                          <span class="font-bold text-slate-400 text-[10px] uppercase">Note:</span> {{ item.notes }}
                      </p>

                      <div class="flex flex-wrap items-center gap-2 mt-3 text-[11px] font-bold uppercase tracking-wider">
                          <span class="bg-slate-100 text-slate-600 px-2.5 py-1 rounded border border-slate-200" title="Stok Gudang Saat Ini">
                            Gudang: {{ item.currentStock }}
                          </span>
                          <span 
                            class="px-2.5 py-1 rounded border"
                            :class="item.maxAllocatable > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'"
                            title="Sisa Slot yang boleh diambil"
                          >
                            Sisa Slot: +{{ item.maxAllocatable }}
                          </span>
                      </div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-5 w-full xl:w-auto items-stretch sm:items-start">
                     
                    <div class="flex flex-col gap-2 shrink-0">
                        <button 
                          @click="item.action = 'approve'; validateItem(item)"
                          class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border"
                          :class="item.action === 'approve' 
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200' 
                            : 'bg-white text-slate-400 border-slate-200 hover:border-emerald-300 hover:text-emerald-500'"
                        >
                          <CheckCircleIcon class="h-4 w-4" /> Terima
                        </button>
                        <button 
                          @click="item.action = 'reject'; item.reason = ''"
                          class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border"
                          :class="item.action === 'reject' 
                            ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200' 
                            : 'bg-white text-slate-400 border-slate-200 hover:border-red-300 hover:text-red-500'"
                        >
                          <NoSymbolIcon class="h-4 w-4" /> Tolak
                        </button>
                    </div>

                    <div class="flex-1 min-w-[260px]">
                        
                        <div v-if="item.action === 'approve'" class="bg-white p-4 rounded-xl border shadow-sm flex flex-col justify-between gap-4 animate-fade-in-up h-full"
                             :class="(item.approved_qty > 0 && item.approved_qty < item.reqQty) ? 'border-amber-200' : 'border-emerald-200'">
                            
                            <div class="flex gap-4 items-center">
                                <div class="text-center px-2 border-r border-slate-100">
                                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Req</p>
                                  <span class="text-xl font-black text-slate-700">{{ item.reqQty }}</span>
                                </div>
                                
                                <div class="flex-1">
                                  <label class="text-[10px] font-bold uppercase mb-1.5 block flex justify-between" 
                                               :class="(item.approved_qty > 0 && item.approved_qty < item.reqQty) ? 'text-amber-600' : 'text-emerald-600'">
                                     <span>Jml Disetujui</span>
                                     <span v-if="item.approved_qty > 0 && item.approved_qty < item.reqQty" class="text-[9px] bg-amber-100 px-1.5 rounded">Parsial</span>
                                     <span v-else-if="item.approved_qty > item.reqQty" class="text-[9px] bg-emerald-100 px-1.5 rounded">Lebih / Bonus</span>
                                  </label>
                                  
                                  <div class="relative flex items-center">
                                     <input 
                                       type="number" 
                                       v-model="item.approved_qty" 
                                       min="0" 
                                       :max="item.maxAllocatable"
                                       class="w-full text-center rounded-lg shadow-sm font-bold text-slate-800 text-sm py-2 transition-colors"
                                       :class="{
                                         'border-amber-300 focus:border-amber-500 focus:ring-amber-500 text-amber-700': item.approved_qty > 0 && item.approved_qty < item.reqQty,
                                         'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500': item.approved_qty >= item.reqQty,
                                         'border-red-300 focus:border-red-500 focus:ring-red-500 text-red-600': !item.approved_qty || item.approved_qty <= 0
                                       }"
                                      />
                                      <span class="ml-2 text-xs font-bold text-slate-400">Pcs</span>
                                  </div>
                                </div>
                            </div>

                            <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
                                    Catatan Admin <span class="text-[9px] font-normal text-slate-300">(Opsional)</span>
                                </label>
                                <input 
                                    type="text" 
                                    v-model="item.reason" 
                                    class="w-full rounded-lg border-slate-200 text-xs px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    :placeholder="item.approved_qty !== item.reqQty ? 'Alasan penyesuaian...' : 'Tambahkan catatan...'"
                                />
                            </div>
                             
                            <div class="mt-1">
                                <p v-if="!item.approved_qty || item.approved_qty <= 0" class="text-[10px] text-red-600 font-bold flex items-center gap-1">
                                    <ExclamationCircleIcon class="h-3 w-3" /> Wajib diisi (>0)
                                </p>
                                <p v-else-if="item.approved_qty > item.maxAllocatable" class="text-[10px] text-red-600 font-bold flex items-center gap-1">
                                    <ExclamationCircleIcon class="h-3 w-3" /> Melebihi Slot Gudang!
                                </p>
                                <p v-else-if="item.approved_qty < item.reqQty" class="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                                    <ExclamationCircleIcon class="h-3 w-3" /> Kurang dari permintaan ({{ item.reqQty }})
                                </p>
                                <p v-else-if="item.approved_qty > item.reqQty" class="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                    <CheckCircleIcon class="h-3 w-3" /> Lebih dari permintaan ({{ item.reqQty }})
                                </p>
                            </div>
                        </div>

                        <div v-else class="bg-white p-4 rounded-xl border border-red-200 shadow-sm animate-fade-in-up h-full flex flex-col">
                            <label class="text-[10px] font-bold text-red-600 uppercase mb-2 flex justify-between">
                              Alasan Penolakan <span class="text-red-400">*Wajib</span>
                            </label>
                            <textarea 
                              v-model="item.reason" 
                              rows="2" 
                              class="w-full rounded-lg border-red-200 bg-red-50/10 text-xs text-slate-700 shadow-inner focus:border-red-500 focus:ring-red-500 placeholder:text-slate-400 p-2 resize-none flex-1"
                              placeholder="Contoh: Stok habis, Bukan prioritas..."
                            ></textarea>
                        </div>

                    </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white border-t border-slate-100 p-6 shrink-0 flex flex-col md:flex-row justify-between items-center gap-5 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
              
              <div class="flex-1 w-full md:w-auto">
                 <div v-if="!isFormValid" class="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2.5 rounded-xl border border-red-100 text-xs font-bold animate-pulse shadow-sm">
                    <ExclamationCircleIcon class="h-5 w-5" />
                    <span>{{ formErrorMessage }}</span>
                 </div>
                 <div v-else class="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100 text-xs font-bold shadow-sm">
                    <CheckCircleIcon class="h-5 w-5" />
                    <span>Data valid. Siap diproses.</span>
                 </div>
              </div>
              
              <div class="flex gap-3 w-full md:w-auto">
                <button 
                  @click="closeApprovalModal" 
                  class="flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-all"
                >
                  Batal
                </button>
                
                <button 
                  @click="submitBatchProcessing"
                  :disabled="!isFormValid"
                  class="flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                  :class="isFormValid ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-600/30 hover:-translate-y-0.5' : 'bg-slate-400'"
                >
                  <CheckBadgeIcon class="h-5 w-5" />
                  Konfirmasi Keputusan
                </button>
              </div>
          </div>

        </div>
      </div>
    </Transition>

    <div class="space-y-8 pb-10">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Dashboard</h1>
          <p class="mt-2 text-base text-slate-500">Rangkuman sistem ATK <span class="font-semibold text-[#009BDB]">Icon Plus</span>.</p>
        </div>
        <div class="hidden sm:flex flex-col items-end justify-center">
          <div class="flex items-center gap-2 text-sm font-bold text-slate-700">
            <CalendarDaysIcon class="h-4 w-4 text-slate-400" />
            <span>{{ currentDate }}</span>
          </div>
          <div class="flex items-center gap-1.5 mt-1">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span class="text-xs font-mono font-medium text-slate-500 tracking-wide">{{ currentTime }} WIB</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-yellow-400">
          <div class="flex items-center justify-between">
            <div class="relative z-10">
               <p class="text-sm font-bold text-slate-400 uppercase tracking-wider group-hover:text-yellow-600 transition-colors">Unit Aktif</p>
               <p class="mt-1 text-3xl font-black text-slate-800 tracking-tight">{{ stats.activeUnits }}</p>
            </div>
            <div class="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600 transition-all group-hover:scale-110">
              <BoltSolidIcon class="h-7 w-7" />
            </div>
          </div>
        </div>
        <div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-violet-400">
          <div class="flex items-center justify-between">
            <div class="relative z-10">
              <p class="text-sm font-bold text-slate-400 uppercase tracking-wider group-hover:text-violet-600 transition-colors">Master ATK</p>
              <p class="mt-1 text-3xl font-black text-slate-800 tracking-tight">{{ stats.totalATK }}</p>
            </div>
            <div class="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition-all group-hover:scale-110">
              <ClipboardDocumentListIcon class="h-6 w-6" />
            </div>
          </div>
        </div>
        <div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-emerald-400">
          <div class="flex items-center justify-between">
            <div class="relative z-10">
              <p class="text-sm font-bold text-slate-400 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">Total Stok</p>
              <p class="mt-1 text-3xl font-black text-slate-800 tracking-tight">{{ stats.totalStock }}</p>
            </div>
            <div class="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-all group-hover:scale-110">
              <ArchiveBoxIcon class="h-6 w-6" />
            </div>
          </div>
        </div>
        <div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-rose-400">
          <div class="flex items-center justify-between">
            <div class="relative z-10">
              <p class="text-sm font-bold text-slate-400 uppercase tracking-wider group-hover:text-rose-600 transition-colors">Stok Menipis</p>
              <p class="mt-1 text-3xl font-black text-rose-600 tracking-tight">{{ stats.lowStockCount }}</p>
            </div>
            <div class="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 transition-all group-hover:scale-110">
              <ExclamationTriangleIcon class="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-6">
        
        <div class="col-span-12 lg:col-span-8">
          <div class="h-full rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <div class="mb-6 flex justify-between items-start">
               <div>
                  <h3 class="text-lg font-bold text-slate-800">Tren Permintaan</h3>
                  <p class="text-sm text-slate-500">Statistik permintaan tahun 2025.</p>
               </div>
               <ChartBarIcon class="h-6 w-6 text-blue-500 opacity-50" />
            </div>
            <div class="-ml-2 cursor-pointer">
                <apexchart type="bar" height="350" :options="barChartOptions" :series="barChartSeries"></apexchart>
            </div>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-4">
          <div class="h-full rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col">
            <div class="mb-4 flex justify-between items-start">
               <div>
                   <h3 class="text-lg font-bold text-slate-800">Kategori Stok</h3>
                   <p class="text-sm text-slate-500">Klik irisan untuk lihat item.</p>
               </div>
               <ChartPieIcon class="h-6 w-6 text-purple-500 opacity-50" />
            </div>
            <div class="flex-1 flex flex-col items-center justify-center py-4 cursor-pointer">
              <apexchart ref="donutChartRef" type="donut" width="300" :options="donutChartOptions" :series="donutChartSeries"></apexchart>
            </div>
          </div>
        </div>

        <div class="col-span-12">
          <div class="h-full rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div class="p-6 border-b border-slate-100">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-lg font-bold text-slate-800">Permintaan Persetujuan</h2>
                  <p class="text-sm text-slate-500">Menunggu aksi dari Administrator (FIFO).</p>
                </div>
                <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-100">
                  {{ sortedPendingTransactions.length }} pending
                </span>
              </div>
            </div>

            <div class="flex-1 overflow-hidden p-0">
              <div class="custom-scrollbar max-h-[500px] overflow-y-auto p-6 pt-0">
                <ul role="list" class="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-6">
                  <li v-if="sortedPendingTransactions.length === 0" class="col-span-full flex flex-col items-center justify-center py-16 text-center">
                    <div class="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                      <DocumentCheckIcon class="h-8 w-8 text-slate-300" />
                    </div>
                    <p class="text-slate-500 font-medium">Tidak ada permintaan baru.</p>
                  </li>

                  <li v-for="trx in sortedPendingTransactions" :key="trx.id" class="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 transition-all hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-md h-full">
                    
                    <div class="flex items-start gap-4 mb-4">
                      <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-lg shadow-md shadow-blue-500/20">
                        {{ trx.user_name.charAt(0) }}
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center justify-between mb-1">
                          <p class="text-sm font-bold text-slate-900 truncate pr-2">{{ trx.user_name }}</p>
                          <span class="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono border border-slate-200 flex-shrink-0">{{ trx.code }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <BuildingOfficeIcon class="h-3.5 w-3.5" /> 
                          <span class="truncate">{{ trx.unit_name }}</span>
                          <span class="text-slate-300">|</span>
                          <ClockIcon class="h-3.5 w-3.5" /> 
                          <span>{{ formatTime(trx.created_at) }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <ArchiveBoxIcon class="h-4 w-4 text-slate-400" />
                            <span class="text-xs font-bold text-slate-700">{{ trx.itemCount }} Jenis Barang</span>
                        </div>
                        <p v-if="trx.description" class="text-xs text-slate-500 italic line-clamp-2">
                          "{{ trx.description }}"
                        </p>
                        <p v-else class="text-xs text-slate-400 italic">Tidak ada catatan.</p>
                    </div>
                    
                    <button @click="openApprovalModal(trx)" type="button" class="w-full rounded-xl bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 px-4 py-2.5 text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-blue-200">
                        <ClipboardDocumentCheckIcon class="h-4 w-4" /> Review & Putuskan
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-6">
          <div class="h-full rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div class="p-6 border-b border-slate-100">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span class="relative flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Peringatan Stok Rendah
              </h2>
              <p class="text-sm text-slate-500">Segera lakukan restock barang.</p>
            </div>
            <div class="flex-1 overflow-hidden p-0">
              <div class="custom-scrollbar h-[350px] overflow-y-auto p-6 pt-0">
                <ul role="list" class="divide-y divide-slate-100 mt-2">
                  <li v-if="store.lowStockItems.length === 0" class="py-12 text-center">
                    <div class="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-50 text-green-600 mb-3">
                      <CheckCircleIcon class="h-6 w-6" />
                    </div>
                    <p class="text-sm text-slate-500">Stok semua unit aman.</p>
                  </li>
                  <li v-for="item in store.lowStockItems" :key="item.id" class="py-4 flex items-center justify-between group hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors">
                    <div class="flex items-center gap-3 min-w-0 flex-1">
                      <div class="flex-shrink-0">
                          <div class="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
                            <ExclamationTriangleIcon class="h-5 w-5" />
                          </div>
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-bold text-slate-900">{{ item.name }}</p>
                        <p class="truncate text-xs text-slate-500 font-medium">{{ item.unit }}</p>
                      </div>
                    </div>
                    <div class="text-right pl-4">
                      <p class="text-sm font-black text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">{{ item.stock }} <span class="text-[10px] font-bold opacity-70">Pcs</span></p>
                      <button @click="handleRequestStock(item)" class="mt-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">+ Manual Add</button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-6">
          <div class="h-full rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
            <div class="p-6 border-b border-slate-100">
               <h3 class="text-lg font-bold text-slate-800">Aktivitas Terbaru</h3>
               <p class="text-sm text-slate-500">Log barang masuk & keluar realtime.</p>
            </div>
            <div class="custom-scrollbar h-[350px] overflow-y-auto p-6 pt-0">
              <div class="relative border-l border-slate-200 ml-3 mt-6 space-y-6">
                  <div v-if="recentActivity.length === 0" class="py-8 text-center text-sm text-slate-500 pl-6">
                    Belum ada aktivitas.
                  </div>
                  <div v-for="activity in recentActivity" :key="activity.id" class="relative pl-6 group">
                    <span class="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white shadow-sm" :class="activity.type === 'masuk' ? 'bg-green-500' : 'bg-amber-500'"></span>
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <div>
                        <p class="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{{ activity.item }} <span class="font-extrabold" :class="activity.type === 'masuk' ? 'text-green-600' : 'text-amber-600'">({{ activity.type === 'masuk' ? '+' : '-' }}{{ activity.qty }})</span></p>
                        <p class="text-xs text-slate-500 mt-0.5 font-medium">{{ activity.user }} • <span class="capitalize" :class="activity.type === 'masuk' ? 'text-green-600' : 'text-amber-600'">{{ activity.type }}</span></p>
                      </div>
                      <span class="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full whitespace-nowrap border border-slate-100">{{ activity.time }}</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-if="confirmModal.show" class="relative z-[60]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeConfirmModal"></div>
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg ring-1 ring-slate-900/5 animate-scale-up">
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 transition-colors shadow-sm" :class="confirmModal.iconBg">
                  <component :is="confirmModal.icon" class="h-6 w-6" :class="confirmModal.iconColor" />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <h3 class="text-lg font-bold leading-6 text-slate-900">{{ confirmModal.title }}</h3>
                  <div class="mt-2"><p class="text-sm text-slate-500 leading-relaxed">{{ confirmModal.message }}</p></div>
                </div>
              </div>
            </div>
            <div class="bg-slate-50/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3 border-t border-slate-100">
              <button type="button" @click="onConfirm" class="inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 sm:w-auto" :class="confirmModal.buttonClass">{{ confirmModal.buttonText }}</button>
              <button type="button" @click="closeConfirmModal" class="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all sm:mt-0 sm:w-auto">Batal</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, shallowRef, onMounted, onUnmounted, watch } from 'vue'; 
import VueApexCharts from 'vue3-apexcharts';
import { useInventoryStore } from '../../stores/inventoryStore'; 

import {
  BoltIcon, ClipboardDocumentListIcon, ClockIcon, CalendarDaysIcon, ArchiveBoxIcon,
  ExclamationTriangleIcon, ArrowDownIcon, ArrowUpIcon, DocumentCheckIcon, TrophyIcon,
  CheckCircleIcon, XCircleIcon, XMarkIcon, QuestionMarkCircleIcon, NoSymbolIcon,
  MapPinIcon, ChartPieIcon, ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon,
  UserIcon, BuildingOfficeIcon, HashtagIcon, CubeIcon, CheckBadgeIcon, ClipboardDocumentCheckIcon,
  ArrowLongRightIcon, ExclamationCircleIcon, ChatBubbleBottomCenterTextIcon
} from '@heroicons/vue/24/outline';
import { BoltIcon as BoltSolidIcon } from '@heroicons/vue/24/solid';

const store = useInventoryStore();

// =========================================================
//  STATE & TOAST
// =========================================================
const toast = ref({ show: false, message: '', type: 'success' });
let toastTimeout = null;
const triggerToast = (message, type = 'success') => {
  if (toastTimeout) clearTimeout(toastTimeout); 
  toast.value.message = message; toast.value.type = type; toast.value.show = true;
  toastTimeout = setTimeout(() => { toast.value.show = false; }, 3000); 
};

// =========================================================
//  CHART MODAL INTERACTION (ENHANCED)
// =========================================================
const chartModal = ref({
    show: false,
    title: '',
    subtitle: '',
    type: 'transaction', // 'transaction' or 'stock'
    data: [],
    stats: {}, // Store calculated highlights
    icon: ChartBarIcon,
    colorClass: 'text-blue-500'
});

const closeChartModal = () => { chartModal.value.show = false; };

const openChartModal = (config) => {
    chartModal.value = { ...chartModal.value, ...config, show: true };
};

// --- LOGIC: Summary Detail Barang (Grouping) ---
const itemSummaries = computed(() => {
  if (!chartModal.value.data || chartModal.value.type !== 'transaction') return [];

  const summary = {};

  chartModal.value.data.forEach(item => {
    const key = item.itemCode || item.itemName;
    if (!summary[key]) {
      summary[key] = {
        itemName: item.itemName,
        itemCode: item.itemCode,
        totalRequests: 0, 
        totalQty: 0,      
        url_photo: item.url_photo,
        categoryId: item.categoryId // Capture Category ID
      };
    }
    summary[key].totalRequests += 1;
    summary[key].totalQty += parseInt(item.qty || 0);
  });

  return Object.values(summary).sort((a, b) => b.totalQty - a.totalQty);
});

// LOGIC BARU: Warna Berdasarkan Kategori
const getCategoryColor = (categoryId) => {
  // Mapping ID Kategori ke Style Warna
  const map = {
    1: 'border-l-blue-500 bg-blue-50 text-blue-700',       // Alat Tulis (Blue)
    2: 'border-l-emerald-500 bg-emerald-50 text-emerald-700', // Kertas (Green)
    3: 'border-l-violet-500 bg-violet-50 text-violet-700',    // Tinta (Violet)
    4: 'border-l-amber-500 bg-amber-50 text-amber-700',      // Perlengkapan (Orange)
    5: 'border-l-rose-500 bg-rose-50 text-rose-700',         // Perekat (Red)
  };
  // Default jika ID tidak ditemukan
  return map[categoryId] || 'border-l-slate-500 bg-slate-50 text-slate-700';
};

// =========================================================
//  CHART: BAR CHART LOGIC (REAL DATA FROM STORE)
// =========================================================
const monthlyRequestStats = computed(() => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  const counts = Array(12).fill(0);
  
  // Use current year based on store context (2025)
  const currentYear = 2025; 
  
  store.transactions.forEach(trx => {
    const d = new Date(trx.trx_date); 
    if (d.getFullYear() === currentYear) {
      counts[d.getMonth()]++; 
    }
  });

  const currentMonthIndex = 11; // December 2025
  let start = currentMonthIndex - 5;
  if (start < 0) start = 0;
  let end = currentMonthIndex + 1;

  const labels = monthNames.slice(start, end);
  const data = counts.slice(start, end);
  
  const monthIndices = [];
  for(let i=start; i<end; i++) monthIndices.push(i);

  return { labels, data, monthIndices };
});

const barChartSeries = computed(() => [{ 
  name: 'Permintaan', 
  data: monthlyRequestStats.value.data 
}]);

const barChartOptions = computed(() => ({ 
  chart: { 
      type: 'bar', 
      height: 320, 
      fontFamily: 'Inter, sans-serif', 
      toolbar: { show: false }, 
      zoom: { enabled: false },
      events: {
        dataPointSelection: (e, chartContext, config) => {
            handleBarChartClick(config.dataPointIndex);
        }
      }
  }, 
  // --- FIX WARNA: JANGAN BERUBAH SAAT KLIK/HOVER ---
  states: {
    normal: { filter: { type: 'none', value: 0 } },
    hover: { filter: { type: 'none', value: 0 } },
    active: { allowMultipleDataPointsSelection: false, filter: { type: 'none', value: 0 } }
  },
  // -------------------------------------------------
  plotOptions: { 
    bar: { 
      distributed: true, 
      borderRadius: 4, 
      horizontal: false, 
      columnWidth: '55%' 
    } 
  }, 
  dataLabels: { enabled: false }, 
  stroke: { show: false }, 
  xaxis: { 
    categories: monthlyRequestStats.value.labels, 
    labels: { style: { colors: '#64748b', fontSize: '12px' } }, 
    axisBorder: { show: false }, 
    axisTicks: { show: false } 
  }, 
  yaxis: { labels: { style: { colors: '#64748b', fontSize: '12px' }, formatter: (val) => val.toFixed(0) } }, 
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4, yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } }, 
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'], 
  legend: { show: false }, 
  tooltip: { y: { formatter: (val) => val + " permintaan" } } 
}));

// HANDLER: CLICK BAR CHART (Drill Down to Transactions)
const handleBarChartClick = (dataPointIndex) => {
    if (dataPointIndex < 0) return;
    
    const monthIndex = monthlyRequestStats.value.monthIndices[dataPointIndex];
    const monthName = monthlyRequestStats.value.labels[dataPointIndex];
    const currentYear = 2025;

    const filteredTrx = store.transactions.filter(trx => {
        const d = new Date(trx.trx_date);
        return d.getMonth() === monthIndex && d.getFullYear() === currentYear;
    });

    const detailList = [];
    const itemAggregates = {};

    filteredTrx.forEach(trx => {
        const user = store.users.find(u => u.id === trx.user_id) || { full_name: 'Unknown', unit_id: 0 };
        const unit = store.units.find(u => u.id === trx.unit_id) || { alias: 'Unknown Unit' };
        
        const details = store.transactionDetails.filter(d => d.transaction_id === trx.id);
        
        details.forEach(d => {
            const item = store.atks.find(a => a.id === d.item_id);
            
            if (item) {
                detailList.push({
                    itemName: item.name,
                    itemCode: item.code,
                    url_photo: item.url_photo,
                    uom: item.uom,
                    qty: d.qty,
                    status: trx.status, 
                    userName: user.full_name,
                    unitName: unit.alias,
                    categoryId: item.category_id // Include Category ID for Coloring
                });

                if (!itemAggregates[item.name]) itemAggregates[item.name] = 0;
                itemAggregates[item.name] += d.qty;
            }
        });
    });

    let topItem = null;
    let lowItem = null;
    const sortedKeys = Object.keys(itemAggregates).sort((a, b) => itemAggregates[b] - itemAggregates[a]);
    
    if (sortedKeys.length > 0) {
        topItem = { name: sortedKeys[0], value: itemAggregates[sortedKeys[0]] };
        lowItem = { name: sortedKeys[sortedKeys.length - 1], value: itemAggregates[sortedKeys[sortedKeys.length - 1]] };
    }

    openChartModal({
        title: `Detail Permintaan: ${monthName} ${currentYear}`,
        subtitle: `Total ${filteredTrx.length} transaksi dengan ${detailList.length} item barang.`,
        type: 'transaction',
        data: detailList,
        stats: { topItem, lowItem },
        icon: ChartBarIcon,
        colorClass: 'text-blue-600'
    });
};

// =========================================================
//  CHART: DONUT CHART LOGIC (REAL DATA FROM STORE)
// =========================================================
const chartColors = ['#2563EB', '#22C55E', '#8B5CF6', '#F59E0B', '#F43F5E']; 
const chartBgClasses = ['bg-blue-700', 'bg-emerald-700', 'bg-violet-700', 'bg-amber-700', 'bg-rose-700'];

const categoryStats = computed(() => {
  const catMap = {}; 
  store.categories.forEach(cat => { catMap[cat.name] = 0; });
  
  store.stocks.forEach(stock => {
      const atk = store.atks.find(a => a.id === stock.item_id);
      if(atk) {
         const cat = store.categories.find(c => c.id === atk.category_id);
         if(cat && catMap[cat.name] !== undefined) { 
             catMap[cat.name] += stock.stock; 
         }
      }
  });

  const grandTotal = Object.values(catMap).reduce((sum, val) => sum + val, 0);
  
  return Object.keys(catMap).map((name, index) => ({
    name: name,
    value: catMap[name],
    percentage: grandTotal > 0 ? Math.round((catMap[name] / grandTotal) * 100) + '%' : '0%',
    colorClass: chartBgClasses[index % chartBgClasses.length],
    hexColor: chartColors[index % chartColors.length]
  }));
});

const donutChartSeries = computed(() => categoryStats.value.map(cat => cat.value));
const donutChartRef = ref(null);

const donutChartOptions = computed(() => ({
  chart: { 
      type: 'donut', 
      width: 300, 
      fontFamily: 'Inter, sans-serif', 
      animations: { enabled: true }, 
      events: { 
          dataPointSelection: (event, chartContext, config) => { 
             handleDonutChartClick(config.dataPointIndex);
          } 
      } 
  },
  // --- FIX WARNA: JANGAN BERUBAH SAAT KLIK/HOVER ---
  states: {
    normal: { filter: { type: 'none', value: 0 } },
    hover: { filter: { type: 'none', value: 0 } },
    active: { allowMultipleDataPointsSelection: false, filter: { type: 'none', value: 0 } }
  },
  // -------------------------------------------------
  labels: categoryStats.value.map(cat => cat.name),
  colors: categoryStats.value.map(cat => cat.hexColor),
  plotOptions: { pie: { donut: { size: '75%', labels: { show: true, name: { show: true, fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#64748b', offsetY: -10 }, value: { show: true, fontSize: '20px', fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#1e293b', offsetY: 16, formatter: (val) => val }, total: { show: true, label: 'Total Item', color: '#64748b', formatter: () => stats.value.realTotalStock.toLocaleString('id-ID') } } } } },
  legend: { show: false }, stroke: { show: true, colors: ['#ffffff'], width: 2 }, tooltip: { y: { formatter: (val) => val.toLocaleString('id-ID') + ' item' }, style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' } }, dataLabels: { enabled: false }, 
}));

// HANDLER: CLICK DONUT CHART
const handleDonutChartClick = (dataPointIndex) => {
    const categoryName = categoryStats.value[dataPointIndex].name;
    const categoryId = store.categories.find(c => c.name === categoryName)?.id;
    if (!categoryId) return;

    const stockDetails = store.stocks
        .map(stock => {
            const item = store.atks.find(a => a.id === stock.item_id);
            if (!item || item.category_id !== categoryId) return null;
            return {
                itemName: item.name,
                itemCode: item.code,
                url_photo: item.url_photo,
                stock: stock.stock,
                categoryName: categoryName,
                categoryId: item.category_id // Pass Category ID
            };
        })
        .filter(item => item !== null);

    const aggregatedStock = {};
    stockDetails.forEach(s => {
        if (!aggregatedStock[s.itemCode]) {
            aggregatedStock[s.itemCode] = { ...s };
        } else {
            aggregatedStock[s.itemCode].stock += s.stock;
        }
    });
    const finalList = Object.values(aggregatedStock);

    const sortedStock = [...finalList].sort((a, b) => b.stock - a.stock);
    let topItem = null;
    let lowItem = null;
    if (sortedStock.length > 0) {
        topItem = { name: sortedStock[0].itemName, value: sortedStock[0].stock };
        lowItem = { name: sortedStock[sortedStock.length - 1].itemName, value: sortedStock[sortedStock.length - 1].stock };
    }

    openChartModal({
        title: `Stok Kategori: ${categoryName}`,
        subtitle: `Menampilkan ${finalList.length} jenis item dalam kategori ini.`,
        type: 'stock',
        data: finalList,
        stats: { topItem, lowItem },
        icon: ChartPieIcon,
        colorClass: 'text-purple-600'
    });
};


// =========================================================
//  PENDING APPROVAL LIST
// =========================================================
const sortedPendingTransactions = computed(() => {
    return [...store.pendingTransactionList].sort((a, b) => new Date(a.trx_date) - new Date(b.trx_date));
});

const formatTime = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleTimeString('id-ID', { 
        hour: '2-digit', minute: '2-digit', hour12: false 
    }).replace(/\./g, ':');
};


// =========================================================
//  MODAL STATE (APPROVAL & REVIEW)
// =========================================================
const approvalModal = ref({ show: false, data: null, items: [] });

const openApprovalModal = (trx) => {
    const itemsWithStats = trx.details.map(detail => {
        const masterItem = store.atks.find(a => a.id === detail.item_id) || {};
        const existingStock = store.stocks.find(s => s.item_id === detail.item_id && s.unit_id === trx.unit_id);
        const currentStock = existingStock ? existingStock.stock : 0;
        const maxStock = masterItem.max_stock || 9999;
        const maxAllocatable = Math.max(0, maxStock - currentStock);

        let defaultApproved = detail.qty;
        if (defaultApproved > maxAllocatable) defaultApproved = maxAllocatable;

        return {
            ...detail,
            itemName: masterItem.name,
            itemCode: masterItem.code,
            url_photo: masterItem.url_photo,
            uom: masterItem.uom || 'Pcs',
            currentStock, maxStock, maxAllocatable,
            reqQty: detail.qty,
            approved_qty: defaultApproved,
            action: 'approve',
            reason: ''
        };
    });
    approvalModal.value = { show: true, data: trx, items: itemsWithStats };
};

const closeApprovalModal = () => { approvalModal.value.show = false; };
const validateItem = (item) => {}

const isFormValid = computed(() => {
    if (!approvalModal.value.items.length) return false;
    for (const item of approvalModal.value.items) {
        if (item.action === 'approve') {
            if (item.approved_qty > item.maxAllocatable) return false; 
            if (!item.approved_qty || item.approved_qty <= 0) return false; 
        } else {
            if (!item.reason || item.reason.trim() === '') return false; 
        }
    }
    return true;
});

const formErrorMessage = computed(() => {
    const invalidItem = approvalModal.value.items.find(item => {
        return (item.action === 'approve' && (item.approved_qty > item.maxAllocatable || !item.approved_qty || item.approved_qty <= 0)) ||
               (item.action === 'reject' && !item.reason);
    });
    if (!invalidItem) return '';
    if (invalidItem.action === 'approve') {
        if (!invalidItem.approved_qty || invalidItem.approved_qty <= 0) return `Jumlah disetujui "${invalidItem.itemName}" tidak boleh 0!`;
        return `Stok "${invalidItem.itemName}" melebihi batas maksimal unit!`;
    }
    return `Alasan penolakan "${invalidItem.itemName}" wajib diisi!`;
});

const submitBatchProcessing = () => {
    if (!isFormValid.value) return;
    store.processBatchTransaction(approvalModal.value.data.id, approvalModal.value.items);
    closeApprovalModal();
    triggerToast('Keputusan tersimpan. Notifikasi dikirim ke User.', 'success');
};


// MANUAL REQUEST MODAL
const confirmModal = ref({ show: false, title: '', message: '', buttonText: '', buttonClass: '', icon: null, iconBg: '', iconColor: '', showInput: false, inputValue: '', onConfirmAction: () => {} });

const openConfirmModal = ({ title, message, buttonText, buttonClass, icon, iconBg, iconColor, showInput = false, onConfirm }) => {
  confirmModal.value = { show: true, title, message, buttonText, buttonClass, icon: shallowRef(icon), iconBg, iconColor, showInput, inputValue: '', onConfirmAction: onConfirm };
};

const closeConfirmModal = () => { confirmModal.value.show = false; };

const onConfirm = () => {
  if (typeof confirmModal.value.onConfirmAction === 'function') { 
    confirmModal.value.onConfirmAction(confirmModal.value.inputValue); 
  }
  closeConfirmModal();
};

const handleRequestStock = (item) => {
  const targetUnitId = item.unit_id;
  const targetUnit = store.units.find(u => u.id === targetUnitId);
  const unitName = targetUnit ? targetUnit.alias : 'Unit Terkait';

  const isPending = store.pendingTransactionList.some(trx => {
      if (trx.unit_id !== targetUnitId) return false;
      return trx.details.some(d => d.item_id === item.item_id);
  });

  if (isPending) {
      triggerToast(`Permintaan untuk ${item.name} di ${unitName} masih Pending.`, 'error');
      return;
  }

  const targetUser = store.users.find(u => u.unit_id === targetUnitId && u.is_active === 1);
  if (!targetUser) {
      triggerToast('Gagal: Tidak ada user aktif di unit ini untuk dikirimi notifikasi.', 'error');
      return;
  }

  const masterItem = store.atks.find(a => a.id === item.item_id) || {};
  const currentStock = item.stock;
  const maxStock = masterItem.max_stock || 100; 
  const recommendedQty = Math.max(20, maxStock - currentStock); 

  openConfirmModal({
    title: 'Buat Rekomendasi Restock',
    message: `Kirim notifikasi restock "${item.name}" kepada ${targetUser.full_name} (${unitName})?`,
    buttonText: 'Kirim Notifikasi',
    buttonClass: 'bg-blue-600 hover:bg-blue-700',
    icon: QuestionMarkCircleIcon, iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
    showInput: false,
    onConfirm: () => {
      store.createTransaction({
        user_id: targetUser.id, 
        unit_id: targetUnitId,
        description: 'System Alert: Stok Menipis (Harap segera proses)',
        details: [{ item_id: item.item_id, qty: recommendedQty, notes: 'Rekomendasi System' }]
      });
      triggerToast(`Notifikasi dikirim ke ${targetUser.full_name}.`, 'success');
    }
  });
};

const currentTime = ref('');
const currentDate = ref('');
let timeInterval = null;

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }).replace(/\./g, ':'); 
  currentDate.value = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};
onMounted(() => { updateTime(); timeInterval = setInterval(updateTime, 1000); });
onUnmounted(() => { if (timeInterval) clearInterval(timeInterval); });

const stats = computed(() => {
  const activeUnits = store.units.filter(u => u.is_active === 1).length;
  const totalATK = store.atks.length;
  const totalStock = store.stocks.reduce((sum, item) => sum + item.stock, 0);
  const lowStockCount = store.lowStockItems.length; 
  let formattedStock = totalStock;
  if (totalStock > 1000) { formattedStock = (totalStock / 1000).toFixed(1).replace('.', ',') + 'k'; }
  return { activeUnits, totalATK, totalStock: formattedStock, realTotalStock: totalStock, lowStockCount };
});

const recentActivity = computed(() => {
  return store.history.slice(0, 10).map(log => {
    let timeLabel = 'Baru saja';
    if (log.id) {
        const diff = Date.now() - log.id;
        const minutes = Math.floor(diff / 60000);
        if (minutes > 0 && minutes < 60) timeLabel = `${minutes} menit lalu`;
        else if (minutes >= 60 && minutes < 1440) timeLabel = `${Math.floor(minutes/60)} jam lalu`;
        else if (minutes >= 1440) timeLabel = 'Kemarin';
    }
    return { id: log.id, type: log.type === 'IN' ? 'masuk' : 'keluar', item: log.itemName, qty: log.qty, user: log.actor, time: timeLabel };
  });
});

// =========================================================
//  SCROLL LOCK WATCHER (Moved to Bottom to Fix ReferenceError)
//  Mencegah scroll pada body saat ADA modal yang terbuka
// =========================================================
watch(
  [() => chartModal.value.show, () => approvalModal.value.show, () => confirmModal.value.show],
  ([chartOpen, approvalOpen, confirmOpen]) => {
    if (chartOpen || approvalOpen || confirmOpen) {
        document.body.style.overflow = 'hidden'; // Kunci scroll
    } else {
        document.body.style.overflow = ''; // Lepas kunci
    }
  }
);

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
.custom-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
.toast-slide-top-enter-active{ transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-slide-top-leave-active { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-slide-top-enter-from, .toast-slide-top-leave-to { opacity: 0; transform: translateY(-20px) translateX(-50%); }

/* Modal Animation */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>