<template>
  <Transition name="toast-slide-top">
    <div 
      v-if="toast.show" 
      class="fixed top-16 left-1/2 z-[100] w-full max-w-sm -translate-x-1/2 transform px-4"
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
    <div v-if="approvalModal.show" class="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeApprovalModal"></div>

      <div class="relative w-full max-w-5xl min-h-[600px] transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all flex flex-col max-h-[90vh] animate-scale-up">
        
        <div class="relative bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 shrink-0 border-b border-white/10">
          <div class="flex items-center justify-between text-white">
            <div>
              <h3 class="text-2xl font-bold tracking-tight flex items-center gap-2">
                <ClipboardDocumentCheckIcon class="h-7 w-7 text-blue-200" />
                Review Permintaan Barang
              </h3>
              <p class="text-blue-100 text-sm mt-1 opacity-90 font-medium">
                Tinjau setiap item. Tentukan Terima (dengan jumlah) atau Tolak (dengan alasan).
              </p>
            </div>
            <button @click="closeApprovalModal" class="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300">
              <XMarkIcon class="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div class="mt-5 flex flex-wrap gap-3">
             <div class="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-sm font-semibold text-white shadow-sm">
                <UserIcon class="h-4 w-4 opacity-80" /> {{ approvalModal.data?.user_name }}
             </div>
             <div class="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-sm font-semibold text-white shadow-sm">
                <BuildingOfficeIcon class="h-4 w-4 opacity-80" /> {{ approvalModal.data?.unit_name }}
             </div>
             <div class="flex items-center gap-2 bg-white/90 px-4 py-1.5 rounded-full text-sm font-bold text-blue-700 shadow-sm font-mono">
                <HashtagIcon class="h-4 w-4" /> {{ approvalModal.data?.code }}
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
                'border-emerald-200 bg-emerald-50/20': item.action === 'approve',
                'border-slate-200': !item.action
              }"
            >
              <div class="flex items-center gap-5 flex-1 w-full xl:w-auto">
                 <div class="h-20 w-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 relative shadow-sm">
                    <img v-if="item.url_photo" :src="item.url_photo" class="h-full w-full object-cover" />
                    <CubeIcon v-else class="h-10 w-10 text-slate-300" />
                    <span class="absolute top-0 left-0 bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg">#{{ index + 1 }}</span>
                 </div>
                 
                 <div class="min-w-0 flex-1">
                    <p class="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{{ item.itemName }}</p>
                    <p class="text-xs text-slate-500 font-mono bg-slate-100 w-fit px-2 py-0.5 rounded mt-1">{{ item.itemCode }}</p>
                    
                    <div class="flex flex-wrap items-center gap-2 mt-3 text-[11px] font-bold uppercase tracking-wider">
                       <span class="bg-slate-100 text-slate-600 px-2.5 py-1 rounded border border-slate-200">
                         Gudang: {{ item.currentStock }}
                       </span>
                       <span class="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded border border-indigo-100">
                         Max: {{ item.maxStock }}
                       </span>
                       <span 
                         class="px-2.5 py-1 rounded border"
                         :class="item.maxAllocatable > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'"
                       >
                         Sisa Slot: +{{ item.maxAllocatable }}
                       </span>
                    </div>
                 </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-5 w-full xl:w-auto items-stretch sm:items-center">
                  
                  <div class="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start sm:self-center shrink-0">
                      <button 
                        @click="item.action = 'approve'"
                        class="px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                        :class="item.action === 'approve' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-black/5 scale-100' : 'text-slate-400 hover:text-slate-600'"
                      >
                        <CheckCircleIcon class="h-4 w-4" /> Terima
                      </button>
                      <button 
                        @click="item.action = 'reject'"
                        class="px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                        :class="item.action === 'reject' ? 'bg-white text-red-600 shadow-sm ring-1 ring-black/5 scale-100' : 'text-slate-400 hover:text-slate-600'"
                      >
                        <NoSymbolIcon class="h-4 w-4" /> Tolak
                      </button>
                  </div>

                  <div class="flex-1 min-w-[240px]">
                      
                      <div v-if="item.action === 'approve'" class="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm flex items-center justify-between gap-4 animate-fade-in-up">
                          <div class="text-center px-2 border-r border-slate-100">
                             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Req</p>
                             <span class="text-xl font-black text-slate-700">{{ item.reqQty }}</span>
                          </div>
                          <div class="flex-1">
                             <label class="text-[10px] font-bold text-emerald-600 uppercase mb-1.5 block">Jml Disetujui</label>
                             <div class="relative flex items-center">
                                <input 
                                   type="number" 
                                   v-model="item.approved_qty" 
                                   min="0" 
                                   :max="item.maxAllocatable"
                                   class="w-full text-center rounded-lg border-emerald-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 font-bold text-slate-800 text-sm py-2"
                                   :class="{
                                      'text-orange-600 ring-2 ring-orange-200 border-orange-300': item.approved_qty > 0 && item.approved_qty < item.reqQty,
                                      'text-red-600 ring-2 ring-red-200 border-red-300': !item.approved_qty || item.approved_qty <= 0
                                   }"
                                />
                                <span class="ml-2 text-xs font-bold text-slate-400">Pcs</span>
                             </div>
                             
                             <p v-if="!item.approved_qty || item.approved_qty <= 0" class="text-[10px] text-red-600 mt-1 font-bold flex items-center gap-1">
                                <ExclamationCircleIcon class="h-3 w-3" /> Wajib diisi (>0)
                             </p>
                             <p v-else-if="item.approved_qty > item.maxAllocatable" class="text-[10px] text-red-600 mt-1 font-bold flex items-center gap-1">
                                <ExclamationCircleIcon class="h-3 w-3" /> Melebihi Max Stock!
                             </p>
                             <p v-else-if="item.approved_qty < item.reqQty" class="text-[10px] text-orange-500 mt-1 font-bold flex items-center gap-1">
                                <ExclamationCircleIcon class="h-3 w-3" /> Disesuaikan Max Stock
                             </p>
                          </div>
                      </div>

                      <div v-else class="bg-white p-4 rounded-xl border border-red-200 shadow-sm animate-fade-in-up">
                          <label class="text-[10px] font-bold text-red-600 uppercase mb-2 flex justify-between">
                             Alasan Penolakan <span class="text-red-400">*Wajib</span>
                          </label>
                          <textarea 
                             v-model="item.reason" 
                             rows="2" 
                             class="w-full rounded-lg border-red-200 bg-red-50/10 text-xs text-slate-700 shadow-inner focus:border-red-500 focus:ring-red-500 placeholder:text-slate-400 p-2"
                             placeholder="Contoh: Stok habis, Bukan prioritas..."
                          ></textarea>
                      </div>

                  </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white border-t border-slate-100 p-6 shrink-0 flex flex-col md:flex-row justify-between items-center gap-5">
           
           <div class="flex-1 w-full md:w-auto">
              <div v-if="!isFormValid" class="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2.5 rounded-xl border border-red-100 text-xs font-bold animate-pulse shadow-sm">
                 <ExclamationCircleIcon class="h-5 w-5" />
                 <span>{{ formErrorMessage }}</span>
              </div>
              <div v-else class="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100 text-xs font-bold shadow-sm">
                 <CheckCircleIcon class="h-5 w-5" />
                 <span>Semua data valid. Siap diproses.</span>
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
               :class="isFormValid ? 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-blue-600/20' : 'bg-slate-400'"
             >
               <CheckBadgeIcon class="h-5 w-5" />
               Konfirmasi Keputusan
             </button>
           </div>
        </div>

      </div>
    </div>
  </Transition>

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

  <div class="space-y-8 pb-10">

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Dashboard</h1>
        <p class="mt-2 text-base text-slate-500">Rangkuman sistem ATK <span class="font-semibold text-[#009BDB]">Icon Plus</span>.</p>
      </div>
      <div class="hidden sm:flex flex-col items-end justify-center">
        <div class="flex items-center gap-2 text-sm font-bold text-slate-700">
          <CalendarDaysIcon class="h-4 w-4 text-slate-400" />
          <span>{{ new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
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
      
      <div class="col-span-12 lg:col-span-7 xl:col-span-8">
        <div class="h-full rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <div class="mb-6">
            <h3 class="text-lg font-bold text-slate-800">Tren Permintaan</h3>
            <p class="text-sm text-slate-500">Statistik 6 bulan terakhir.</p>
          </div>
          <div class="-ml-2"><apexchart type="bar" height="350" :options="barChartOptions" :series="barChartSeries"></apexchart></div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-5 xl:col-span-4">
        <div class="h-full rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col">
          <div class="mb-4">
            <h3 class="text-lg font-bold text-slate-800">Kategori Stok</h3>
            <p class="text-sm text-slate-500">Persentase distribusi stok.</p>
          </div>
          <div class="flex-1 flex flex-col items-center justify-center py-4">
            <apexchart ref="donutChartRef" type="donut" width="300" :options="donutChartOptions" :series="donutChartSeries"></apexchart>
          </div>
          <div class="space-y-2 mt-4">
            <div v-for="(cat, index) in categoryStats" :key="cat.name" @click="handleLegendClick(index)" class="group flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-all duration-200 border border-transparent hover:border-slate-200 hover:bg-slate-50" :class="{ 'opacity-40 grayscale': selectedCategoryIndices.length > 0 && !selectedCategoryIndices.includes(index), 'bg-slate-50 border-slate-200': selectedCategoryIndices.includes(index) }">
              <div class="flex items-center gap-3">
                <span class="h-2.5 w-2.5 rounded-full ring-2 ring-white shadow-sm" :class="cat.colorClass"></span>
                <span class="text-sm font-medium text-slate-600 group-hover:text-slate-900">{{ cat.name }}</span>
              </div>
              <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md group-hover:bg-white group-hover:shadow-sm transition-all">{{ cat.percentage }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-7">
        <div class="h-full rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div class="p-6 border-b border-slate-100">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-bold text-slate-800">Permintaan Persetujuan</h2>
                <p class="text-sm text-slate-500">Menunggu aksi dari Administrator.</p>
              </div>
              <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-100">
                {{ store.pendingTransactionList.length }} pending
              </span>
            </div>
          </div>

          <div class="flex-1 overflow-hidden p-0">
            <div class="custom-scrollbar h-[400px] overflow-y-auto p-6 pt-0">
              <ul role="list" class="space-y-4 mt-6">
                <li v-if="store.pendingTransactionList.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
                  <div class="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <DocumentCheckIcon class="h-8 w-8 text-slate-300" />
                  </div>
                  <p class="text-slate-500 font-medium">Tidak ada permintaan baru.</p>
                </li>

                <li v-for="trx in store.pendingTransactionList" :key="trx.id" class="group flex flex-col sm:flex-row sm:items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 transition-all hover:border-blue-200 hover:bg-blue-50/20 hover:shadow-md">
                  <div class="flex items-start gap-4 flex-1">
                    <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-lg shadow-md shadow-blue-500/20">
                      {{ trx.user_name.charAt(0) }}
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center justify-between">
                         <p class="text-sm font-bold text-slate-900">{{ trx.user_name }}</p>
                         <span class="text-[10px] text-slate-400 font-mono">{{ trx.code }}</span>
                      </div>
                      <p class="text-xs text-slate-500 font-semibold mb-2">{{ trx.unit_name }}</p>
                      
                      <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl relative group-hover:bg-white transition-colors">
                        <div class="absolute left-0 top-3 bottom-3 w-1 bg-blue-500 rounded-r-full"></div>
                        <p class="text-xs font-bold text-slate-700 pl-3 flex items-center gap-2">
                           <ArchiveBoxIcon class="h-3.5 w-3.5 text-slate-400" />
                           {{ trx.itemCount }} Jenis Barang
                        </p>
                        <p class="text-xs text-slate-500 leading-relaxed line-clamp-2 pl-3 mt-1">
                          {{ trx.summaryItems }}
                        </p>
                      </div>
                      <p class="text-[10px] text-slate-400 mt-2 italic flex items-center gap-1" v-if="trx.description">
                          <span class="w-1 h-1 rounded-full bg-slate-300"></span> "{{ trx.description }}"
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex flex-col justify-center gap-2 sm:ml-auto w-full sm:w-auto pt-1">
                    <button @click="openApprovalModal(trx)" type="button" class="w-full sm:w-auto rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                        <ClipboardDocumentCheckIcon class="h-4 w-4" /> Review Detail
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-5">
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
            <div class="custom-scrollbar h-[400px] overflow-y-auto p-6 pt-0">
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
            <h3 class="text-lg font-bold text-slate-800">ATK Paling Populer</h3>
            <p class="text-sm text-slate-500">Berdasarkan frekuensi permintaan.</p>
          </div>
          <div class="custom-scrollbar h-[350px] overflow-y-auto p-6 pt-0">
            <ul role="list" class="divide-y divide-slate-100 mt-2">
              <li v-if="topRequestedItems.length === 0" class="py-8 text-center text-sm text-slate-500">
                Belum ada data populer.
              </li>
              <li v-for="(item, index) in topRequestedItems" :key="item.name" class="flex items-center gap-4 py-4 hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors">
                <div class="flex-shrink-0">
                  <span class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold shadow-sm ring-1 ring-inset ring-black/5" :class="index === 0 ? 'bg-yellow-100 text-yellow-700 ring-yellow-400/50' : index === 1 ? 'bg-slate-100 text-slate-600 ring-slate-300' : index === 2 ? 'bg-orange-50 text-orange-700 ring-orange-200' : 'bg-white text-slate-500'">{{ index + 1 }}</span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-bold text-slate-900">{{ item.name }}</p>
                  <p class="truncate text-xs text-slate-500 font-medium">{{ item.category }}</p>
                </div>
                <div class="text-sm font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{{ item.count }} <span class="text-[10px] font-normal text-slate-400">Reqs</span></div>
              </li>
            </ul>
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
</template>

<script setup>
import { ref, computed, shallowRef, onMounted, onUnmounted } from 'vue'; 
import VueApexCharts from 'vue3-apexcharts';
import { useInventoryStore } from '../../stores/inventoryStore'; 

// Impor ikon
import {
  BoltIcon, ClipboardDocumentListIcon, ClockIcon, CalendarDaysIcon, ArchiveBoxIcon,
  ExclamationTriangleIcon, ArrowDownIcon, ArrowUpIcon, DocumentCheckIcon, TrophyIcon,
  CheckCircleIcon, XCircleIcon, XMarkIcon, QuestionMarkCircleIcon, NoSymbolIcon,
  MapPinIcon, ChartPieIcon, ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon,
  UserIcon, BuildingOfficeIcon, HashtagIcon, CubeIcon, CheckBadgeIcon, ClipboardDocumentCheckIcon,
  ArrowLongRightIcon, ExclamationCircleIcon
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
//  MODAL STATE
// =========================================================

// 1. APPROVAL MODAL (COMPLEX LOGIC)
const approvalModal = ref({
    show: false,
    data: null, 
    items: []   
});

const openApprovalModal = (trx) => {
    // Siapkan data per item
    const itemsWithStats = trx.details.map(detail => {
        const masterItem = store.atks.find(a => a.id === detail.item_id) || {};
        const existingStock = store.stocks.find(s => s.item_id === detail.item_id && s.unit_id === trx.unit_id);
        const currentStock = existingStock ? existingStock.stock : 0;
        const maxStock = masterItem.max_stock || 9999;
        const maxAllocatable = Math.max(0, maxStock - currentStock);

        // Auto limit quantity jika melebihi slot
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
            action: 'approve', // Default action: Terima
            reason: '' // Reason for rejection
        };
    });

    approvalModal.value = { show: true, data: trx, items: itemsWithStats };
};

const closeApprovalModal = () => { approvalModal.value.show = false; };

// VALIDASI FORM SEBELUM SUBMIT
const isFormValid = computed(() => {
    if (!approvalModal.value.items.length) return false;
    
    // Cek setiap item
    for (const item of approvalModal.value.items) {
        if (item.action === 'approve') {
            // Jika terima: Qty tidak boleh melebihi maxAllocatable
            if (item.approved_qty > item.maxAllocatable) return false;
            // Qty tidak boleh 0 atau kosong
            if (!item.approved_qty || item.approved_qty <= 0) return false; 
        } else {
            // Jika tolak: Alasan wajib diisi
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
        if (!invalidItem.approved_qty || invalidItem.approved_qty <= 0) return `Jumlah disetujui untuk "${invalidItem.itemName}" tidak boleh 0!`;
        return `Stok "${invalidItem.itemName}" melebihi batas maksimal!`;
    }
    return `Alasan penolakan untuk "${invalidItem.itemName}" wajib diisi!`;
});

const submitBatchProcessing = () => {
    if (!isFormValid.value) return;

    // Kirim data yang sudah diproses ke Store
    store.processBatchTransaction(approvalModal.value.data.id, approvalModal.value.items);
    
    closeApprovalModal();
    triggerToast('Keputusan berhasil disimpan. User telah diberitahu.', 'success');
};


// 2. REJECT / CONFIRM MODAL (Legacy / Manual Request)
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
  openConfirmModal({
    title: 'Request Stok Manual',
    message: `Buat request untuk ${item.name} (Admin Mode)?`,
    buttonText: 'Ya, Request',
    buttonClass: 'bg-blue-600 hover:bg-blue-700',
    icon: QuestionMarkCircleIcon, iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
    showInput: false,
    onConfirm: () => {
      store.createTransaction({
        user_id: 2, 
        unit_id: item.unit_id,
        description: 'Manual Request from Dashboard (Low Stock)',
        details: [{ item_id: item.item_id, qty: 20, notes: 'Auto-req from Low Stock Alert' }]
      });
      triggerToast('Request dibuat.', 'success');
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

// =========================================================
//  REAL-TIME STATS COMPUTED
// =========================================================
const stats = computed(() => {
  const activeUnits = store.units.filter(u => u.is_active === 1).length;
  const totalATK = store.atks.length;
  const totalStock = store.stocks.reduce((sum, item) => sum + item.stock, 0);
  const lowStockCount = store.lowStockItems.length; 
  let formattedStock = totalStock;
  if (totalStock > 1000) { formattedStock = (totalStock / 1000).toFixed(1).replace('.', ',') + 'k'; }
  return { activeUnits, totalATK, totalStock: formattedStock, realTotalStock: totalStock, lowStockCount };
});

// =========================================================
//  CHART LOGIC
// =========================================================
const chartColors = ['#2563EB', '#22C55E', '#EAB308', '#EF4444', '#A855F7']; 
const chartBgClasses = ['bg-blue-600', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];

const categoryStats = computed(() => {
  const catMap = {}; 
  store.categories.forEach(cat => { catMap[cat.name] = 0; });
  store.stocks.forEach(stock => {
     const atk = store.atks.find(a => a.id === stock.item_id);
     if(atk) {
        const catName = store.categories.find(c => c.id === atk.category_id)?.name;
        if(catName && catMap[catName] !== undefined) { catMap[catName] += stock.stock; }
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
const selectedCategoryIndices = ref([]);
const donutChartTotalLabel = ref('Total Item');
const donutChartTotalValue = ref(stats.value.totalStock); 

const updateCenterLabel = () => {
  const count = selectedCategoryIndices.value.length;
  if (count === 0) { donutChartTotalLabel.value = 'Total Item'; donutChartTotalValue.value = stats.value.realTotalStock.toLocaleString('id-ID'); }
  else if (count === 1) { const idx = selectedCategoryIndices.value[0]; donutChartTotalLabel.value = categoryStats.value[idx].name; donutChartTotalValue.value = categoryStats.value[idx].value.toLocaleString('id-ID'); }
  else { const sum = selectedCategoryIndices.value.reduce((acc, idx) => acc + categoryStats.value[idx].value, 0); donutChartTotalLabel.value = 'Total Terpilih'; donutChartTotalValue.value = sum.toLocaleString('id-ID'); }
  if (donutChartRef.value) { donutChartRef.value.updateOptions({ plotOptions: { pie: { donut: { labels: { total: { label: donutChartTotalLabel.value, formatter: () => donutChartTotalValue.value } } } } } }); }
};

const donutChartOptions = computed(() => ({
  chart: { type: 'donut', width: 300, fontFamily: 'Inter, sans-serif', animations: { enabled: true }, events: { dataPointSelection: (event, chartContext, config) => { handleLegendClick(config.dataPointIndex); } } },
  labels: categoryStats.value.map(cat => cat.name),
  colors: categoryStats.value.map(cat => cat.hexColor),
  plotOptions: { pie: { donut: { size: '75%', labels: { show: true, name: { show: true, fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#64748b', offsetY: -10 }, value: { show: true, fontSize: '20px', fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#1e293b', offsetY: 16, formatter: (val) => val }, total: { show: true, label: 'Total Item', color: '#64748b', formatter: () => stats.value.realTotalStock.toLocaleString('id-ID') } } } } },
  legend: { show: false }, stroke: { show: true, colors: ['#ffffff'], width: 2 }, tooltip: { y: { formatter: (val) => val.toLocaleString('id-ID') + ' item' }, style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' } }, dataLabels: { enabled: false }, 
}));

const handleLegendClick = (index) => {
  const pos = selectedCategoryIndices.value.indexOf(index);
  if (pos >= 0) selectedCategoryIndices.value.splice(pos, 1); else selectedCategoryIndices.value.push(index);
  if (donutChartRef.value) donutChartRef.value.toggleDataPointSelection(index);
  updateCenterLabel();
};

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

const topRequestedItems = computed(() => {
  const frequencyMap = {};
  store.history.forEach(log => { if (!frequencyMap[log.itemName]) { frequencyMap[log.itemName] = { count: 0, item_id: log.item_id }; } frequencyMap[log.itemName].count += 1; });
  return Object.keys(frequencyMap).map(name => {
    const data = frequencyMap[name]; let catName = '-';
    const atk = store.atks.find(a => a.id === data.item_id) || store.atks.find(a => a.name === name);
    if(atk) { const cat = store.categories.find(c => c.id === atk.category_id); if(cat) catName = cat.name; }
    return { name: name, count: data.count, category: catName };
  }).sort((a, b) => b.count - a.count).slice(0, 5);
});

const requestTrendData = ref([{ name: 'Jun', value: 300 }, { name: 'Jul', value: 450 }, { name: 'Ags', value: 600 }, { name: 'Sep', value: 500 }, { name: 'Okt', value: 750 }, { name: 'Nov', value: 900 },]);
const barChartSeries = computed(() => [{ name: 'Permintaan', data: requestTrendData.value.map(month => month.value) }]);
const barChartOptions = computed(() => ({ chart: { type: 'bar', height: 320, fontFamily: 'Inter, sans-serif', toolbar: { show: false }, zoom: { enabled: false } }, plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: '55%' } }, dataLabels: { enabled: false }, stroke: { show: false }, xaxis: { categories: requestTrendData.value.map(month => month.name), labels: { style: { colors: '#64748b', fontSize: '12px' } }, axisBorder: { show: false }, axisTicks: { show: false } }, yaxis: { labels: { style: { colors: '#64748b', fontSize: '12px' }, formatter: (val) => val.toFixed(0) } }, grid: { borderColor: '#f1f5f9', strokeDashArray: 4, yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } }, colors: ['#3b82f6'], tooltip: { y: { formatter: (val) => val + " permintaan" } } }));
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