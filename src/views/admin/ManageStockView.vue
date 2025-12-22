<template>
  <!-- TOAST NOTIFICATION -->
  <Transition name="toast-slide-top">
    <div v-if="toast.show" class="fixed top-20 left-1/2 z-[100] w-full max-w-sm -translate-x-1/2 transform px-4">
      <div class="flex items-center overflow-hidden rounded-2xl p-4 shadow-2xl backdrop-blur-xl ring-1 transition-all"
        :class="{ 
          'bg-white/95 text-slate-800 ring-slate-200': true, 
          'border-l-4 border-green-500': toast.type === 'success', 
          'border-l-4 border-red-500': toast.type === 'error' 
        }">
        <div class="flex-shrink-0">
          <CheckCircleIcon v-if="toast.type === 'success'" class="h-6 w-6 text-green-500" />
          <XCircleIcon v-if="toast.type === 'error'" class="h-6 w-6 text-red-500" />
        </div>
        <div class="ml-3 flex-1"><p class="text-sm font-semibold">{{ toast.message }}</p></div>
        <button @click="toast.show = false" class="ml-4 flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"><XMarkIcon class="h-5 w-5" /></button>
      </div>
    </div>
  </Transition>

  <!-- CONFIRM DELETE MODAL -->
  <div v-if="showDeleteModal" class="relative z-[1100]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" @click="closeDeleteModal"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg ring-1 ring-slate-900/5">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-red-100 text-red-600">
                <NoSymbolIcon class="h-6 w-6" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-bold leading-6 text-slate-900" id="modal-title">Hapus Data Stok</h3>
                <div class="mt-2">
                  <p class="text-sm text-slate-500 leading-relaxed">
                    Yakin hapus stok <strong>{{ itemToDelete?.displayName }}</strong>? Data yang dihapus akan tercatat di riwayat.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-slate-50/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
            <button type="button" @click="confirmDeleteAction" class="inline-flex w-full justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:w-auto">Hapus</button>
            <button type="button" @click="closeDeleteModal" class="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto">Batal</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- MAIN CONTENT -->
  <div class="space-y-8">
    
    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Manage Stock</h1>
        <p class="mt-2 text-base text-slate-500">
          Monitoring stok fisik per unit kerja & Riwayat Mutasi (Ref: <code>eatk_item_unit</code>).
        </p>
      </div>
      <div class="hidden sm:flex flex-col items-end justify-center">
        <div class="flex items-center gap-2 text-sm font-bold text-slate-700">
          <CalendarDaysIcon class="h-4 w-4 text-slate-400" />
          <span>{{ new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
        </div>
        <div class="flex items-center gap-1.5 mt-1">
          <span class="relative flex h-1.5 w-1.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          <span class="text-xs font-medium text-slate-500 tabular-nums tracking-wide">{{ currentTime }} WIB</span>
        </div>
      </div>
    </div>

    <!-- CARD CONTAINER -->
    <div class="rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] border border-slate-100">
      
      <!-- TABS NAVIGATION -->
      <div class="mb-8 border-b border-slate-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button 
            @click="activeTab = 'stock'"
            class="group inline-flex items-center border-b-2 py-4 px-1 text-sm font-bold transition-all duration-200 ease-in-out whitespace-nowrap outline-none"
            :class="activeTab === 'stock' 
              ? 'border-blue-600 text-blue-700' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'"
          >
            <ArchiveBoxIcon class="mr-2 h-5 w-5" :class="activeTab === 'stock' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'" />
            Stok Fisik (Aktif)
          </button>
          <button 
            @click="activeTab = 'history'"
            class="group inline-flex items-center border-b-2 py-4 px-1 text-sm font-bold transition-all duration-200 ease-in-out whitespace-nowrap outline-none"
            :class="activeTab === 'history' 
              ? 'border-blue-600 text-blue-700' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'"
          >
            <ClockIcon class="mr-2 h-5 w-5" :class="activeTab === 'history' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'" />
            Riwayat Mutasi (Log)
          </button>
        </nav>
      </div>

      <!-- KONTEN TAB 1: STOK FISIK -->
      <div v-if="activeTab === 'stock'">
        <!-- TOOLBAR -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ArchiveBoxIcon class="h-5 w-5 text-slate-400" />
            Daftar Stok Unit
          </h2>

          <!-- Toolbar Items -->
          <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
            
            <!-- SEARCH -->
            <div class="relative w-full sm:w-48">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon class="h-4 w-4 text-slate-400" />
              </div>
              <input 
                v-model="searchQuery"
                @input="handleFilterChange"
                type="text" 
                class="block w-full rounded-lg border-0 h-10 py-1.5 pl-10 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow" 
                placeholder="Cari barang / SKU..."
              >
            </div>

            <!-- FILTER UNIT -->
            <div class="relative w-full sm:w-48">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon class="h-4 w-4 text-slate-400" />
              </div>
              <select 
                v-model="selectedUnit"
                @change="handleFilterChange"
                class="block w-full rounded-lg border-0 h-10 py-1.5 pl-9 pr-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 cursor-pointer"
              >
                <option value="Semua Unit">Semua Unit</option>
                <option v-for="unit in uniqueUnits" :key="unit.id" :value="unit.id">{{ unit.alias }}</option>
              </select>
            </div>

            <!-- FILTER KATEGORI -->
            <div class="relative w-full sm:w-48">
               <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TagIcon class="h-4 w-4 text-slate-400" />
               </div>
              <select 
                v-model="selectedCategory"
                @change="handleFilterChange"
                class="block w-full rounded-lg border-0 h-10 py-1.5 pl-9 pr-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 cursor-pointer"
              >
                <option value="Semua Kategori">Semua Kategori</option>
                <option v-for="cat in uniqueCategories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
              </select>
            </div>

            <!-- BUTTON ADD -->
            <button 
              @click="openStockModal(null)"
              class="inline-flex items-center justify-center rounded-lg bg-blue-600 h-10 px-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 active:scale-95 whitespace-nowrap w-full sm:w-auto"
            >
              <PlusIcon class="mr-1.5 h-4 w-4" />
              Tambah Stok
            </button>
          </div>
        </div>

        <!-- TABLE STOK -->
        <div class="overflow-hidden rounded-xl border border-slate-200">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th scope="col" class="w-[30%] py-3.5 pl-4 pr-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 sm:pl-6">Barang (Master Item)</th>
                  <th scope="col" class="w-[20%] px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Unit & Kategori</th>
                  <th scope="col" class="w-[15%] px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Kondisi Stok</th>
                  <th scope="col" class="w-[15%] px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Harga</th>
                  <th scope="col" class="w-[10%] px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Status</th>
                  <th scope="col" class="w-[10%] relative py-3.5 pl-3 pr-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500 sm:pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                
                <!-- Empty State -->
                <tr v-if="filteredStock.length === 0">
                  <td colspan="7" class="py-12 text-center text-sm text-slate-500">
                    <div class="flex flex-col items-center justify-center">
                      <div class="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                        <ArchiveBoxIcon class="h-6 w-6 text-slate-300" />
                      </div>
                      <p>Tidak ada barang yang cocok dengan filter.</p>
                    </div>
                  </td>
                </tr>

                <tr v-for="item in paginatedStock" :key="item.id" class="group hover:bg-slate-50/80 transition-colors">
                  
                  <!-- KOLOM 1: MASTER ITEM & FOTO -->
                  <td class="py-4 pl-4 pr-3 sm:pl-6">
                    <div class="flex items-center gap-4">
                       <!-- BUTTON FOTO -->
                       <div 
                          class="h-12 w-12 rounded-lg bg-white border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center shadow-sm group-hover:border-blue-300 transition-all duration-200 cursor-pointer"
                          @click="openDetailModal(item)"
                          title="Lihat Detail Barang"
                       >
                         <img v-if="getATK(item.item_id)?.url_photo" :src="getATK(item.item_id).url_photo" alt="" class="h-full w-full object-contain p-1" />
                         <ArchiveBoxIcon v-else class="h-6 w-6 text-slate-300" />
                      </div>
                      
                      <!-- BUTTON NAMA -->
                      <div class="min-w-0">
                        <button 
                           @click="openDetailModal(item)"
                           class="text-left font-bold text-slate-800 text-sm hover:text-blue-600 hover:underline transition-all line-clamp-1 focus:outline-none"
                           title="Klik untuk detail stok"
                        >
                           {{ getATK(item.item_id)?.name }}
                        </button>
                        <div class="flex items-center gap-2 mt-1">
                           <span class="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">
                             {{ getATK(item.item_id)?.code }}
                           </span>
                           <span class="text-[10px] text-slate-400 truncate max-w-[100px]">
                             {{ getCategoryName(getATK(item.item_id)?.category_id) }}
                           </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- KOLOM 2: UNIT & KATEGORI -->
                  <td class="px-3 py-4 text-sm text-slate-500">
                    <div class="flex flex-col gap-1.5">
                       <div class="flex items-center gap-1.5">
                          <MapPinIcon class="h-3.5 w-3.5 text-slate-400" />
                          <span class="text-sm font-semibold text-slate-700 truncate max-w-[180px]" :title="getUnitAlias(item.unit_id)">{{ getUnitAlias(item.unit_id) }}</span>
                       </div>
                       <div class="flex items-center gap-1.5 ml-0.5">
                          <TagIcon class="h-3 w-3 text-slate-400" />
                          <span class="text-xs text-slate-500 bg-slate-50 px-1.5 rounded border border-slate-100">
                             {{ getCategoryName(getATK(item.item_id)?.category_id) }}
                          </span>
                       </div>
                    </div>
                  </td>
                  
                  <!-- KOLOM 3: STOK VISUAL -->
                  <td class="px-3 py-4">
                    <div class="flex flex-col gap-1.5">
                       <div class="flex justify-between items-end">
                          <span class="text-sm font-bold text-slate-800">{{ item.stock }} <span class="text-[10px] font-normal text-slate-400">{{ getATK(item.item_id)?.uom }}</span></span>
                          
                          <!-- LOGIKA STATUS STOK -->
                          <span v-if="item.stock <= 0" class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-50 text-[9px] font-bold text-red-600 border border-red-100 uppercase tracking-wide">
                             <XCircleIcon class="h-3 w-3" /> Habis
                          </span>
                          <span v-else-if="item.stock <= item.stock_min" class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-orange-50 text-[9px] font-bold text-orange-700 border border-orange-100 uppercase tracking-wide">
                             <ExclamationTriangleIcon class="h-3 w-3" /> Menipis
                          </span>
                          <span v-else class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-[9px] font-bold text-emerald-700 border border-emerald-100 uppercase tracking-wide">
                             <CheckCircleIcon class="h-3 w-3" /> Tersedia
                          </span>
                       </div>
                       <!-- Progress Bar Visual -->
                       <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div class="h-full rounded-full transition-all duration-500 relative" 
                               :class="item.stock <= 0 ? 'bg-red-600' : (item.stock <= item.stock_min ? 'bg-orange-500' : 'bg-emerald-500')"
                               :style="{ width: Math.min((item.stock / (item.stock_min * 3)) * 100, 100) + '%' }">
                          </div>
                       </div>
                       <span class="text-[10px] text-slate-400">Min: {{ item.stock_min }}</span>
                    </div>
                  </td>

                  <!-- KOLOM 4: HARGA -->
                  <td class="px-3 py-4 text-sm font-medium text-slate-700 tabular-nums">
                    Rp {{ (item.price || 0).toLocaleString('id-ID') }}
                  </td>

                  <!-- KOLOM 5: STATUS -->
                  <td class="px-3 py-4 text-center">
                     <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                      :class="item.status === 'Active' 
                        ? 'bg-green-50 text-green-700 ring-green-600/20' 
                        : 'bg-slate-100 text-slate-500 ring-slate-500/20'"
                    >
                      <span class="h-1.5 w-1.5 rounded-full mr-1.5" :class="item.status === 'Active' ? 'bg-green-600' : 'bg-slate-400'"></span>
                      {{ item.status === 'Active' ? 'Aktif' : 'Non-Aktif' }}
                    </span>
                    <div class="text-[10px] text-slate-400 mt-1 font-mono">{{ item.updated_at || item.created_at }}</div>
                  </td>

                  <!-- KOLOM 6: AKSI -->
                  <td class="py-4 pl-3 pr-4 text-center text-xs font-medium sm:pr-6">
                    <div class="flex items-center justify-center gap-2">
                      <button 
                        @click="openStockModal(item)" 
                        class="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-all font-semibold shadow-sm border border-blue-200"
                      >
                        Edit
                      </button>
                      <button 
                        @click="handleDelete(item)" 
                        class="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-all font-semibold shadow-sm border border-red-200"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- PAGINATION FOOTER -->
          <div v-if="filteredStock.length > 0" class="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-slate-700">
                  Menampilkan <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> sampai <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredStock.length) }}</span> dari <span class="font-medium">{{ filteredStock.length }}</span> hasil
                </p>
              </div>
              <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button @click="currentPage > 1 ? currentPage-- : null" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50">
                    <span class="sr-only">Previous</span>
                    <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                  <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 focus:outline-offset-0 bg-white">
                    Hal {{ currentPage }} / {{ totalPages }}
                  </span>
                  <button @click="currentPage < totalPages ? currentPage++ : null" :disabled="currentPage === totalPages" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-white focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                    <span class="sr-only">Next</span>
                    <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- KONTEN TAB 2: RIWAYAT MUTASI -->
      <div v-if="activeTab === 'history'">
         <!-- Toolbar History -->
         <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
           <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ClockIcon class="h-5 w-5 text-slate-400" />
              Log Mutasi Barang
           </h2>
           <div class="flex items-center gap-4">
              <div class="relative w-full sm:w-64">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon class="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  v-model="historySearchQuery"
                  @input="handleHistoryFilterChange"
                  type="text" 
                  class="block w-full rounded-lg border-0 h-10 py-1.5 pl-10 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow" 
                  placeholder="Cari riwayat..."
                >
              </div>
              <button @click="activeTab='stock'" class="text-sm text-blue-600 hover:underline font-semibold">← Kembali ke Stok</button>
           </div>
         </div>

         <!-- Table History -->
         <div class="overflow-hidden rounded-xl border border-slate-200">
            <div class="overflow-x-auto">
               <table class="min-w-full divide-y divide-slate-200">
                  <thead class="bg-slate-50">
                    <tr>
                      <th class="py-3.5 pl-4 text-left text-xs font-bold uppercase text-slate-500">Waktu</th>
                      <th class="px-3 py-3.5 text-left text-xs font-bold uppercase text-slate-500">Tipe</th>
                      <th class="px-3 py-3.5 text-left text-xs font-bold uppercase text-slate-500">Barang</th>
                      <th class="px-3 py-3.5 text-left text-xs font-bold uppercase text-slate-500">Qty</th>
                      <th class="px-3 py-3.5 text-left text-xs font-bold uppercase text-slate-500">Keterangan</th>
                      <th class="px-3 py-3.5 text-left text-xs font-bold uppercase text-slate-500">Oleh</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 bg-white">
                    <tr v-if="filteredHistory.length === 0">
                       <td colspan="6" class="py-8 text-center text-sm text-slate-500">Belum ada riwayat transaksi.</td>
                    </tr>
                    <tr v-for="log in paginatedHistory" :key="log.id" class="hover:bg-slate-50 transition-colors">
                      <td class="py-4 pl-4 text-sm text-slate-600 font-mono whitespace-nowrap">{{ log.date }}</td>
                      <td class="px-3 py-4 text-sm">
                        <span v-if="log.type === 'IN'" class="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          <ArrowUpTrayIcon class="h-3 w-3" /> Masuk
                        </span>
                        <span v-else class="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
                          <ArrowDownIcon class="h-3 w-3" /> Keluar
                        </span>
                      </td>
                      <td class="px-3 py-4 text-sm font-semibold text-slate-800">{{ log.itemName }}</td>
                      <td class="px-3 py-4 text-sm font-bold font-mono text-base" :class="log.type === 'IN' ? 'text-green-600' : 'text-orange-600'">
                        {{ log.type === 'IN' ? '+' : '-' }}{{ log.qty }}
                      </td>
                      <td class="px-3 py-4 text-sm text-slate-500 italic">{{ log.note }}</td>
                      <td class="px-3 py-4 text-sm text-slate-800 font-medium">{{ log.actor }}</td>
                    </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>

    </div>
  </div>

  <!-- COMPONENTS -->
  <!-- Gunakan komponen StockFormModal & StockDetailModal yang sudah dibuat -->
  <StockFormModal
    :show="isModalOpen"
    :stock-to-edit="selectedItem"
    :atk-options="allATKMaster"
    :unit-options="allUnits"
    @close="closeModal"
    @save="handleStockSave"
  />
  
  <StockDetailModal
    :show="isDetailModalOpen"
    :item="detailItem"
    @close="closeDetailModal"
    @edit="handleDetailEdit"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { 
  MagnifyingGlassIcon, PlusIcon, ArchiveBoxIcon, XMarkIcon, CalendarDaysIcon, 
  CheckCircleIcon, XCircleIcon, NoSymbolIcon, MapPinIcon, ChevronLeftIcon, ChevronRightIcon,
  ClockIcon, TagIcon, ExclamationTriangleIcon, ArrowUpTrayIcon, WrenchScrewdriverIcon, TrashIcon,
  ArrowDownIcon
} from '@heroicons/vue/24/outline';

import { useInventoryStore } from '../../stores/inventoryStore';
import StockFormModal from '../../components/admin/StockFormModal.vue';
import StockDetailModal from '../../components/admin/StockDetailModal.vue';

const store = useInventoryStore();

// ==========================================
// 1. STATE MODAL (YANG SEBELUMNYA HILANG)
// ==========================================
const isModalOpen = ref(false);        // Kontrol modal Form (Tambah/Edit)
const selectedItem = ref(null);        // Data item yang sedang diedit
const isDetailModalOpen = ref(false);  // Kontrol modal Detail
const detailItem = ref(null);          // Data untuk modal Detail

// ==========================================
// 2. TOAST NOTIFICATION
// ==========================================
const toast = ref({ show: false, message: '', type: 'success' });
let toastTimeout = null;

const triggerToast = (message, type = 'success') => {
  if (toastTimeout) clearTimeout(toastTimeout); 
  toast.value.message = message; 
  toast.value.type = type; 
  toast.value.show = true;
  toastTimeout = setTimeout(() => { toast.value.show = false; }, 3000);
};

// ==========================================
// 3. DELETE LOGIC
// ==========================================
const showDeleteModal = ref(false);
const itemToDelete = ref(null);

const handleDelete = (item) => {
  itemToDelete.value = item;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  itemToDelete.value = null;
};

const confirmDeleteAction = () => {
  if (itemToDelete.value) {
    try {
        const item = itemToDelete.value;
        const atk = getATK(item.item_id);
        const deletedName = atk ? atk.name : 'Unknown';
        const deletedStock = item.stock;
        
        // Hapus dari Store
        store.deleteStock(item.id);

        // Reset Pagination jika halaman kosong
        if (paginatedStock.value.length === 0 && currentPage.value > 1) {
          currentPage.value--;
        }

        // Catat Log Penghapusan
        if (deletedStock > 0) {
           const now = new Date().toLocaleString('id-ID');
           store.addHistory({
             id: Date.now(),
             type: 'OUT',
             date: now,
             itemName: deletedName,
             qty: deletedStock,
             actor: 'Admin',
             note: 'Penghapusan Data Stok (Write-off)'
           });
        }

        triggerToast('Data berhasil dihapus.', 'success');
    } catch (error) {
        console.error("Error deleting stock:", error);
        triggerToast('Gagal menghapus data.', 'error');
    }
    closeDeleteModal();
  }
};

watch(() => showDeleteModal.value, (val) => {
    if (val) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
});

// ==========================================
// 4. TIME & HEADER LOGIC
// ==========================================
const currentTime = ref('');
let timeInterval = null;

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }).replace(/\./g, ':');
};

onMounted(() => { 
    updateTime(); 
    timeInterval = setInterval(updateTime, 1000); 
});

onUnmounted(() => { 
    if (timeInterval) clearInterval(timeInterval); 
});

// ==========================================
// 5. DATA MASTER & HELPERS
// ==========================================
const allUnits = computed(() => store.units || []);
const allATKMaster = computed(() => store.atks || []);
const allStockItems = computed(() => store.stocks || []);
const stockHistory = computed(() => store.history || []);
const categories = computed(() => store.categories || []);

const getATK = (itemId) => {
   const item = allATKMaster.value?.find(a => a.id === itemId);
   return item || { name: 'Unknown', code: '???', url_photo: '' };
};

const getUnitAlias = (unitId) => {
   const unit = allUnits.value?.find(u => u.id === unitId);
   return unit?.alias || 'Unknown';
};

const getCategoryName = (catId) => {
   const cat = categories.value?.find(c => c.id === catId);
   return cat?.name || '-';
};

// ==========================================
// 6. FILTER & PAGINATION
// ==========================================
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const selectedUnit = ref('Semua Unit');
const selectedCategory = ref('Semua Kategori');
const activeTab = ref('stock');

// History Filter
const historySearchQuery = ref('');
const currentHistoryPage = ref(1);

// Unique Lists untuk Dropdown Filter
const uniqueUnits = computed(() => {
  const usedUnitIds = [...new Set(allStockItems.value.map(item => item.unit_id))];
  return usedUnitIds.map(id => allUnits.value.find(u => u.id === id)).filter(Boolean).sort((a, b) => a.alias.localeCompare(b.alias));
});

const uniqueCategories = computed(() => {
  const usedCatIds = new Set();
  allStockItems.value.forEach(stock => {
    const atk = getATK(stock.item_id);
    if(atk && atk.category_id) usedCatIds.add(atk.category_id);
  });
  return [...usedCatIds].map(id => categories.value.find(c => c.id === id)).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
});

// Filter Logic Stock
const filteredStock = computed(() => {
  return allStockItems.value.filter(stock => {
    const item = getATK(stock.item_id);
    const search = searchQuery.value.toLowerCase();
    
    const itemName = item.name || '';
    const itemCode = item.code || '';
    const matchSearch = itemName.toLowerCase().includes(search) || itemCode.toLowerCase().includes(search);
    const matchUnit = selectedUnit.value === 'Semua Unit' || stock.unit_id === selectedUnit.value;
    const itemCatName = getCategoryName(item.category_id);
    const matchCat = selectedCategory.value === 'Semua Kategori' || itemCatName === selectedCategory.value;
    
    return matchSearch && matchUnit && matchCat;
  }).sort((a, b) => {
    const nameA = getATK(a.item_id).name || '';
    const nameB = getATK(b.item_id).name || '';
    return nameA.localeCompare(nameB);
  });
});

const paginatedStock = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredStock.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredStock.value.length / itemsPerPage));

// Filter Logic History
const filteredHistory = computed(() => {
  return stockHistory.value.filter(log => 
      (log.itemName && log.itemName.toLowerCase().includes(historySearchQuery.value.toLowerCase())) ||
      (log.actor && log.actor.toLowerCase().includes(historySearchQuery.value.toLowerCase())) ||
      (log.note && log.note.toLowerCase().includes(historySearchQuery.value.toLowerCase()))
  );
});

const paginatedHistory = computed(() => {
  const start = (currentHistoryPage.value - 1) * itemsPerPage;
  return filteredHistory.value.slice(start, start + itemsPerPage);
});

const totalHistoryPages = computed(() => Math.ceil(filteredHistory.value.length / itemsPerPage));

// Reset pagination saat filter berubah
const handleFilterChange = () => { currentPage.value = 1; };
const handleHistoryFilterChange = () => { currentHistoryPage.value = 1; };

// ==========================================
// 7. MODAL ACTIONS (FUNGSIONALITAS TOMBOL)
// ==========================================

// Buka Modal Form (Tambah/Edit)
const openStockModal = (stock) => {
  selectedItem.value = stock ? JSON.parse(JSON.stringify(stock)) : null;
  isModalOpen.value = true;
};

// Tutup Modal Form
const closeModal = () => { 
    isModalOpen.value = false; 
    selectedItem.value = null; 
};

// Buka Modal Detail
const openDetailModal = (item) => { 
  const atk = getATK(item.item_id);
  detailItem.value = { 
    ...item, 
    name: atk.name, 
    sku: atk.code, 
    uom: atk.uom, 
    unit: getUnitAlias(item.unit_id),
    url_photo: atk.url_photo,
    category: getCategoryName(atk.category_id)
  }; 
  isDetailModalOpen.value = true; 
};

// Tutup Modal Detail
const closeDetailModal = () => { 
    isDetailModalOpen.value = false; 
    detailItem.value = null; 
};

// Tombol Edit di dalam Modal Detail
const handleDetailEdit = () => {
   const itemToEdit = allStockItems.value.find(i => i.id === detailItem.value.id);
   closeDetailModal();
   openStockModal(itemToEdit);
};

// ==========================================
// 8. SAVE & TRANSACTION LOGIC
// ==========================================
const handleStockSave = (formData) => {
  const today = new Date().toLocaleDateString('en-GB'); 
  const now = new Date().toLocaleString('id-ID');

  if (formData.id) {
    // --- MODE EDIT / TRANSAKSI ---
    const originalItem = allStockItems.value.find(s => s.id === formData.id);
    
    if (originalItem) {
      if (formData.txType && formData.txQty > 0) {
        // Logika Transaksi Masuk/Keluar
        const qty = parseInt(formData.txQty);
        let newStockVal = originalItem.stock;

        if (formData.txType === 'in') {
           newStockVal += qty;
           store.addHistory({
             id: Date.now(), type: 'IN', date: now, itemName: getATK(originalItem.item_id).name, qty: qty, actor: 'Admin', note: formData.txNote || 'Restock Manual'
           });
           triggerToast(`Berhasil restock +${qty}`, 'success');
        } else {
           if (newStockVal >= qty) {
             newStockVal -= qty;
             store.addHistory({
               id: Date.now(), type: 'OUT', date: now, itemName: getATK(originalItem.item_id).name, qty: qty, actor: 'Admin', note: formData.txNote || 'Koreksi Stok'
             });
             triggerToast(`Berhasil koreksi -${qty}`, 'success');
           } else {
             triggerToast('Stok tidak mencukupi!', 'error');
             return; // Batalkan save jika stok kurang
           }
        }
        store.updateStock({ ...originalItem, stock: newStockVal, updated_at: today });
      } else {
        // Logika Update Info Biasa (Harga, Min Stock, Status)
        store.updateStock({ ...originalItem, ...formData, updated_at: today });
        triggerToast('Data stok diperbarui', 'success');
      }
    }
  } else {
    // --- MODE TAMBAH BARU (CREATE) ---
    const duplicate = allStockItems.value.find(s => s.item_id === formData.item_id && s.unit_id === formData.unit_id);
    if (duplicate) {
      triggerToast('Stok barang ini sudah ada di unit tersebut!', 'error');
      return;
    }

    const newStock = {
      id: Date.now(),
      ...formData,
      status: 'Active',
      created_at: today,
      created_by: 'Admin',
      batches: [{ id: Date.now(), date: new Date().toISOString().slice(0,10), price: formData.price, stock: formData.stock }]
    };
    
    store.addStock(newStock);
    store.addHistory({ 
        id: Date.now()+1, type: 'IN', date: now, itemName: getATK(formData.item_id).name, qty: formData.stock, actor: 'Admin', note: 'Stok Awal' 
    });
    triggerToast('Stok baru ditambahkan', 'success');
  }
  
  closeModal();
};
</script>

<style scoped>
.toast-slide-top-enter-active{ transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-slide-top-leave-active { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-slide-top-enter-from, .toast-slide-top-leave-to { opacity: 0; transform: translateY(-20px) translateX(-50%); }
</style>