<template>
  <Teleport to="body">
    <!-- Overlay Gelap & Blur -->
    <div v-if="show" @click="onClose" class="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"></div>

    <!-- Modal Panel Container -->
    <div v-if="show" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
      <!-- Modal Besar dengan Tinggi Fix -->
      <div class="relative w-full max-w-5xl h-[85vh] transform overflow-hidden rounded-2xl bg-slate-50 text-left shadow-2xl transition-all ring-1 ring-slate-900/5 flex flex-col" @click.stop>
        
        <!-- Header Modal (Fixed Top) -->
        <div class="flex items-center justify-between border-b border-slate-200 px-8 py-5 bg-white z-20 flex-shrink-0 shadow-sm relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <div class="flex items-center gap-5 relative">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30 ring-2 ring-white">
              <UserCircleIcon class="h-8 w-8" />
            </div>
            <div>
              <h3 class="text-xl font-extrabold leading-6 text-slate-800 tracking-tight">
                {{ isEditing ? 'Edit Data Pegawai' : 'Registrasi Pegawai Baru' }}
              </h3>
              <p class="text-sm text-slate-500 mt-1 font-medium">
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

        <!-- Tabs Navigation (Fixed) -->
        <div class="px-8 pt-4 pb-0 bg-white border-b border-slate-200 flex-shrink-0 z-10">
          <nav class="-mb-px flex space-x-8 overflow-x-auto custom-scrollbar" aria-label="Tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              class="group inline-flex items-center border-b-[3px] py-4 px-2 text-sm font-bold transition-all duration-200 ease-in-out whitespace-nowrap outline-none"
              :class="activeTab === tab.id 
                ? 'border-blue-600 text-blue-700' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'"
            >
              <component 
                :is="tab.icon" 
                class="mr-2.5 h-5 w-5 transition-colors" 
                :class="activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'" 
              />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Body Form (Scrollable Area - Colored Background) -->
        <div class="p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/80">
          <form @submit.prevent="onSave" id="userForm" class="space-y-8 max-w-6xl mx-auto pb-10">
            
            <!-- TAB 1: AKUN & IDENTITAS -->
            <div v-show="activeTab === 'account'">
              <div class="flex flex-col lg:flex-row gap-10">
                
                <!-- Kolom Kiri: Foto Profil (Sticky) -->
                <div class="flex flex-col items-center lg:w-1/4 space-y-5 lg:sticky lg:top-0 h-fit">
                  <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm w-full flex flex-col items-center relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
                    <div 
                      class="relative h-40 w-40 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg ring-1 ring-slate-200 group cursor-pointer transition-all hover:ring-4 hover:ring-blue-200 mt-4"
                      @click="triggerFileInput"
                    >
                      <img v-if="localUser.url_photo" :src="localUser.url_photo" alt="Profile" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <UserIcon v-else class="h-20 w-20 text-slate-300" />
                      
                      <!-- Overlay Upload -->
                      <div class="absolute inset-0 bg-slate-900/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                        <CameraIcon class="h-8 w-8 text-white mb-1" />
                        <span class="text-[10px] font-bold text-white uppercase tracking-wider">Ubah</span>
                      </div>
                    </div>
                    
                    <div class="text-center mt-6 w-full">
                      <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
                      <button type="button" @click="triggerFileInput" class="w-full py-2.5 px-4 rounded-xl bg-blue-50 text-blue-700 text-sm font-bold hover:bg-blue-100 hover:text-blue-800 transition-colors border border-blue-100">
                        Pilih Foto
                      </button>
                      <p class="text-xs text-slate-400 mt-3 leading-relaxed font-medium">
                        Maksimal 2MB.<br>Format JPG, PNG.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Kolom Kanan: Form Input -->
                <div class="flex-1 space-y-6">
                   <!-- Card Informasi Dasar -->
                   <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                     <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                     <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                        Informasi Dasar
                     </h4>
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap <span class="text-red-500">*</span></label>
                          <input v-model="localUser.full_name" type="text" required class="form-input-bold px-4" placeholder="Nama sesuai KTP" />
                        </div>
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username <span class="text-red-500">*</span></label>
                          <div class="relative group">
                             <!-- Icon @ (Hanya muncul jika kosong) -->
                             <div v-if="!localUser.username" class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span class="text-slate-400 font-bold text-sm transition-colors">@</span>
                             </div>
                             <!-- Padding dinamis: pl-9 jika kosong (utk icon), pl-4 jika isi -->
                             <input 
                               v-model="localUser.username" 
                               type="text" 
                               required 
                               class="form-input-bold"
                               :class="!localUser.username ? 'pl-9' : 'px-4'" 
                               placeholder="username.pln" 
                              />
                          </div>
                        </div>
                     </div>
                   </div>
                   
                   <!-- Card Kontak & Keamanan -->
                   <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                     <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                     <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                        Kontak & Keamanan
                     </h4>
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email <span class="text-red-500">*</span></label>
                          <div class="relative group">
                            <div v-if="!localUser.email" class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <EnvelopeIcon class="h-5 w-5 text-slate-400" />
                            </div>
                            <input 
                              v-model="localUser.email" 
                              type="email" 
                              required 
                              class="form-input-bold"
                              :class="!localUser.email ? 'pl-12' : 'px-4'" 
                              placeholder="contoh@pln.co.id" 
                            />
                          </div>
                        </div>
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">No. Telepon</label>
                          <div class="relative group">
                            <div v-if="!localUser.phone" class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <PhoneIcon class="h-5 w-5 text-slate-400" />
                            </div>
                            <input 
                              v-model="localUser.phone" 
                              @input="filterPhone" 
                              type="text" 
                              maxlength="15" 
                              class="form-input-bold"
                              :class="!localUser.phone ? 'pl-12' : 'px-4'" 
                              placeholder="0812..." 
                            />
                          </div>
                        </div>
                        
                        <!-- Password -->
                        <div class="md:col-span-2 space-y-2">
                           <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                           <div class="relative group">
                             <div v-if="!localUser.password" class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                               <LockClosedIcon class="h-5 w-5 text-slate-400" />
                             </div>
                             <input 
                               v-model="localUser.password"
                               :type="showPassword ? 'text' : 'password'"
                               class="form-input-bold pr-12"
                               :class="[
                                  !localUser.password ? 'pl-12' : 'pl-4', 
                                  {'text-slate-400 bg-slate-50 border-slate-200 cursor-default hover:border-slate-200 focus:ring-0 focus:border-slate-200': !isEditing && localUser.password === DUMMY_PASSWORD}
                               ]"
                               :placeholder="isEditing ? 'Klik untuk ubah password' : 'Password default: 123'"
                               :readonly="!isEditing"
                               @focus="handlePassFocus"
                               @blur="handlePassBlur"
                             />
                             <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer focus:outline-none rounded-lg m-1 hover:bg-slate-100 p-1">
                               <component :is="showPassword ? EyeSlashIcon : EyeIcon" class="h-5 w-5" />
                             </button>
                           </div>
                           <p v-if="isEditing && localUser.password === DUMMY_PASSWORD" class="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1.5 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 w-fit">
                             <CheckBadgeIcon class="h-4 w-4" />
                             Password aman. Klik kolom di atas jika ingin mereset.
                           </p>
                        </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>

            <!-- TAB 2: DATA KEPEGAWAIAN -->
            <div v-show="activeTab === 'hr'" class="space-y-6">
              <!-- Card Identitas -->
              <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                   Identitas Pegawai
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">NIP (Nomor Induk) <span class="text-red-500">*</span></label>
                    <div class="relative group">
                       <div v-if="!localUser.nip" class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <IdentificationIcon class="h-5 w-5 text-slate-400" />
                       </div>
                       <input 
                         v-model="localUser.nip" 
                         @input="filterNumeric($event, 'nip')" 
                         maxlength="20" 
                         type="text" 
                         required 
                         class="form-input-bold font-mono tracking-wide" 
                         :class="!localUser.nip ? 'pl-12' : 'px-4'"
                         placeholder="XXXXXXXX" 
                       />
                    </div>
                    <p class="text-[11px] text-slate-400 pt-1 ml-1">Nomor unik pegawai perusahaan.</p>
                  </div>
                  <div class="space-y-2">
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">PERNR (SAP ID)</label>
                    <input v-model="localUser.pernr" @input="filterNumeric($event, 'pernr')" maxlength="20" type="text" class="form-input-bold font-mono tracking-wide px-4" placeholder="Nomor Personel SAP" />
                  </div>
                </div>
              </div>

              <!-- Card Area Personalia -->
              <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>
                <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                   Area Personalia
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Personnel Area</label>
                    <div class="relative group">
                       <div v-if="!localUser.personnel_area" class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MapPinIcon class="h-5 w-5 text-slate-400" />
                       </div>
                       <input 
                        v-model="localUser.personnel_area" 
                        type="text" 
                        class="form-input-bold" 
                        :class="!localUser.personnel_area ? 'pl-12' : 'px-4'"
                        placeholder="Kode Area" 
                       />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Personnel Sub Area</label>
                    <input v-model="localUser.personnel_sub_area" type="text" class="form-input-bold px-4" placeholder="Kode Sub Area" />
                  </div>
                </div>
              </div>

              <!-- Card Pribadi & Masa Kerja -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div class="absolute left-0 top-0 bottom-0 w-1 bg-pink-500"></div>
                   <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-5">Data Pribadi</h4>
                   <div class="space-y-4">
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

                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div class="absolute left-0 top-0 bottom-0 w-1 bg-teal-500"></div>
                   <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-5">Masa Kerja</h4>
                   <div class="space-y-4">
                     <div class="space-y-2">
                       <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tanggal Masuk</label>
                       <input v-model="localUser.date_entry" type="date" class="form-input-bold px-4" />
                    </div>
                     <div class="space-y-2">
                       <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tanggal Pensiun</label>
                       <input v-model="localUser.date_retire" type="date" class="form-input-bold px-4" />
                    </div>
                   </div>
                </div>
              </div>
            </div>

            <!-- TAB 3: ORGANISASI & JABATAN -->
            <div v-show="activeTab === 'org'" class="space-y-8">
               <!-- Card Unit & Org Code -->
               <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                  <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                    Unit & Organisasi
                  </h4>
                  
                  <div class="space-y-6">
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

                    <div class="space-y-2">
                      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Unit Kerja Utama <span class="text-red-500">*</span></label>
                      <div class="relative group">
                        <div v-if="!localUser.unit_id" class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                           <BuildingOfficeIcon class="h-5 w-5 text-slate-400" />
                        </div>
                        <select 
                          v-model="localUser.unit_id" 
                          required 
                          class="form-select-bold"
                          :class="!localUser.unit_id ? 'pl-12' : 'px-4'"
                        >
                          <option disabled value="">Pilih Unit...</option>
                          <option v-for="unit in unitOptions" :key="unit.id" :value="unit.id">
                            {{ unit.alias }} - {{ unit.name }}
                          </option>
                        </select>
                      </div>
                      <p class="text-xs text-slate-400 mt-1 ml-1">User ini akan terikat dengan data stok dan aset di unit ini.</p>
                    </div>
                  </div>
               </div>

               <!-- Card Jabatan -->
               <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                  <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                    Posisi Jabatan
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

               <!-- Card Atasan -->
               <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-slate-400"></div>
                  <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                    Data Atasan (Superior)
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div class="space-y-2">
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Atasan</label>
                        <input v-model="localUser.superior_name" type="text" class="form-input-bold px-4" placeholder="Nama atasan langsung" />
                     </div>
                     <div class="space-y-2">
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">NIP Atasan</label>
                        <input v-model="localUser.superior_nip" type="text" class="form-input-bold px-4" placeholder="NIP Atasan" />
                     </div>
                     <div class="md:col-span-2 space-y-2">
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Jabatan Atasan</label>
                        <input v-model="localUser.superior_position" type="text" class="form-input-bold px-4" placeholder="Contoh: Manager Bagian..." />
                     </div>
                  </div>
               </div>
            </div>

            <!-- TAB 4: AKSES & PENGATURAN -->
            <div v-show="activeTab === 'settings'" class="p-8 bg-white h-full space-y-8">
              
              <div class="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                <label class="block text-sm font-bold text-indigo-900 mb-3">Role Aplikasi <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select v-model="localUser.role" required class="form-select-bold px-4 bg-white border-indigo-200 text-indigo-900 focus:border-indigo-500 focus:ring-indigo-500">
                    <option value="User">User (Karyawan Biasa)</option>
                    <option value="Admin">Administrator</option>
                  </select>
                  <div class="absolute inset-y-0 right-8 flex items-center pointer-events-none">
                     <ShieldCheckIcon class="h-5 w-5 text-indigo-400" />
                  </div>
                </div>
                <p class="text-xs text-indigo-600 mt-2 font-medium ml-1">Menentukan menu apa saja yang bisa diakses.</p>
              </div>

              <div class="space-y-4 border-t border-slate-100 pt-6">
                <!-- Status Switch -->
                <div 
                  class="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group cursor-pointer" 
                  @click="localUser.is_active = localUser.is_active ? 0 : 1"
                >
                  <div class="flex gap-4 items-center">
                    <div class="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                       <ShieldCheckIcon class="h-6 w-6" />
                    </div>
                    <div>
                      <span class="block text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors">Status Akun Aktif</span>
                      <span class="text-xs text-slate-500">Jika dimatikan, user tidak dapat login ke sistem.</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                    :class="localUser.is_active ? 'bg-green-500' : 'bg-slate-200'"
                  >
                    <span aria-hidden="true" class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="localUser.is_active ? 'translate-x-5' : 'translate-x-0'"></span>
                  </button>
                </div>

                <!-- SSO Switch -->
                <div 
                  class="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group cursor-pointer" 
                  @click="localUser.is_sso = localUser.is_sso ? 0 : 1"
                >
                  <div class="flex gap-4 items-center">
                    <div class="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                       <FingerPrintIcon class="h-6 w-6" />
                    </div>
                    <div>
                      <span class="block text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors">Single Sign On (SSO)</span>
                      <span class="text-xs text-slate-500">Login via akun korporat PLN.</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                    :class="localUser.is_sso ? 'bg-blue-600' : 'bg-slate-200'"
                  >
                    <span aria-hidden="true" class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="localUser.is_sso ? 'translate-x-5' : 'translate-x-0'"></span>
                  </button>
                </div>
              </div>

              <!-- Audit Trail -->
              <div v-if="isEditing" class="pt-6 mt-2">
                <div class="flex items-center gap-2 mb-4 px-1">
                   <ClockIcon class="h-5 w-5 text-slate-400" />
                   <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Jejak Audit Sistem</h4>
                </div>
                <div class="bg-slate-50 rounded-xl p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8">
                   <div class="flex flex-col">
                      <span class="text-[10px] text-slate-400 uppercase font-bold mb-1.5 tracking-wider">Dibuat Oleh</span>
                      <div class="flex items-center gap-3">
                        <div class="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">{{ (localUser.created_by || 'SY').substring(0,2).toUpperCase() }}</div>
                        <span class="text-sm font-bold text-slate-700">{{ localUser.created_by || 'System' }}</span>
                      </div>
                      <span class="text-xs font-mono text-slate-400 mt-1 ml-[44px]">{{ localUser.created_at || '-' }}</span>
                   </div>
                   <div class="flex flex-col">
                      <span class="text-[10px] text-slate-400 uppercase font-bold mb-1.5 tracking-wider">Terakhir Diupdate</span>
                      <div class="flex items-center gap-3">
                        <div class="h-8 w-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-600 shadow-sm">{{ (localUser.updated_by || 'AD').substring(0,2).toUpperCase() }}</div>
                        <span class="text-sm font-bold text-slate-700">{{ localUser.updated_by || 'Administrator' }}</span>
                      </div>
                      <span class="text-xs font-mono text-slate-400 mt-1 ml-[44px]">{{ localUser.updated_at || '-' }}</span>
                   </div>
                </div>
              </div>
            </div>

          </form>
        </div>

        <!-- Footer Modal (Fixed) -->
        <div class="flex items-center justify-between px-8 py-5 bg-white border-t border-slate-200 shrink-0">
          <div class="text-xs font-bold" :class="isValid ? 'text-emerald-600' : 'text-slate-400'">
             <span v-if="isValid" class="flex items-center gap-1"><CheckBadgeIcon class="h-5 w-5" /> DATA LENGKAP</span>
             <span v-else>Lengkapi kolom bertanda *</span>
          </div>

          <div class="flex gap-4">
            <button @click="onClose" class="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors">
              Batal
            </button>
            <button 
              type="button" 
              @click="onSave"
              :disabled="!isModified || !isValid"
              class="px-8 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="(!isModified || !isValid) ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'"
            >
              {{ isEditing ? 'Simpan' : 'Tambah' }}
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

const tabs = [
  { id: 'account', name: 'Akun', icon: UserCircleIcon },
  { id: 'hr', name: 'Kepegawaian', icon: IdentificationIcon },
  { id: 'org', name: 'Organisasi', icon: BuildingOfficeIcon },
  { id: 'settings', name: 'Sistem', icon: Cog6ToothIcon },
];
const activeTab = ref('account');

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
    activeTab.value = 'account'; 
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
  focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:bg-white
  placeholder:text-slate-300 placeholder:font-normal transition-all duration-200 sm:text-sm py-3 shadow-sm hover:border-blue-300;
}

.form-select-bold {
  @apply block w-full rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold tracking-wide
  focus:border-blue-600 focus:ring-2 focus:ring-blue-100 
  sm:text-sm py-3 shadow-sm cursor-pointer hover:border-blue-300;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>