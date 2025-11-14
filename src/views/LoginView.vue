  <template>
      <!-- 1. Latar Belakang & Penengah Halaman -->
      <!-- Kelas-kelas ini (bg-gray-50, flex, min-h-screen) adalah Tailwind -->
      <div class="font-inter flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
          
          <!-- 2. Kartu Login -->
          <!-- Kelas-kelas ini (w-full, max-w-md, bg-white, shadow-lg) adalah Tailwind -->
          <div class="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
              
              <!-- 3. Header Kartu -->
              <div class="text-center">
                  <!-- Ikon Gembok (h-12, w-auto, text-blue-600) adalah Tailwind -->
                  <svg class="mx-auto h-12 w-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  
                  <!-- Tipografi (mt-5, text-3xl, font-bold, text-gray-900) adalah Tailwind -->
                  <h2 class="mt-5 text-center text-3xl font-bold tracking-tight text-gray-900">
                      Selamat Datang Kembali
                  </h2>
                  <p class="mt-2 text-center text-sm text-gray-600">
                      Silakan login untuk melanjutkan
                  </p>
              </div>
              
              <!-- 4. Form Login -->
              <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                  
                  <!-- Grup Input -->
                  <div class="space-y-4 rounded-md">
                      <div>
                          <label for="email" class="block text-sm font-medium text-gray-700">Email / Username</label>
                          <!-- Styling Form (block, w-full, rounded-md, border-gray-300) adalah Tailwind -->
                          <input 
                              id="email" 
                              name="email" 
                              type="text" 
                              required
                              v-model="email"
                              class="mt-1 relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                              placeholder="admin"
                          />
                      </div>
                      
                      <div>
                          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                          <input 
                              id="password" 
                              name="password" 
                              type="password" 
                              required
                              v-model="password"
                              class="mt-1 relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                              placeholder="password"
                          />
                      </div>
                  </div>

                  <!-- 5. Opsi Tambahan -->
                  <div class="flex items-center justify-end">
                      <div class="text-sm">
                          <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                              Lupa password?
                          </a>
                      </div>
                  </div>

                  <!-- 6. Pesan Error (Ditampilkan dengan v-if) -->
                  <!-- Styling Pesan Error (bg-red-50, text-red-700) adalah Tailwind -->
                  <div v-if="errorMsg" class="rounded-md bg-red-50 p-4">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-red-700">{{ errorMsg }}</p>
                      </div>
                    </div>
                  </div>


                  <!-- 7. Tombol Submit -->
                  <div>
                      <!-- Styling Tombol (bg-blue-600, hover:bg-blue-700, disabled:opacity-50) adalah Tailwind -->
                      <button 
                          type="submit" 
                          :disabled="isLoading"
                          class="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          <span v-if="isLoading">Memproses...</span>
                          <span v-else>Login</span>
                      </button>
                  </div>
              </form>

          </div>
          
          <!-- 8. Link "Daftar" di bawah kartu -->
          <p class="mt-8 text-center text-sm text-gray-600">
              Belum punya akun?
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                  Mulai mendaftar
              </a>
          </p>
      </div>
  </template>

  <script setup>
  import { ref } from 'vue';
  // Import 'useRouter' ini akan bekerja di dalam proyek Vue yang sudah dikonfigurasi
  import { useRouter } from 'vue-router';

  // 1. Definisikan state reaktif
  const email = ref('');
  const password = ref('');
  const errorMsg = ref('');
  const isLoading = ref(false);

  // 2. Dapatkan instance router
  const router = useRouter();

  // 3. Buat fungsi handler login
  const handleLogin = () => {
    // Set loading state dan reset error
    isLoading.value = true;
    errorMsg.value = '';

    // 4. Simulasi proses login
    setTimeout(() => {
      if (email.value === 'admin' && password.value === 'password') {
        // 5. Simpan status login
        localStorage.setItem('userLoggedIn', 'true');
        
        // 6. Arahkan ke dashboard
        router.push('/dashboard'); // Ganti dengan rute tujuan Anda
      } else {
        // 7. Tampilkan pesan error
        errorMsg.value = 'Username atau password salah!';
      }
      
      // 8. Selesai loading
      isLoading.value = false;
    }, 1000); // Simulasi delay 1 detik
  };
  </script>

  <style>
    /* Anda bisa menambahkan font Inter di file index.html 
      utama proyek Vue Anda atau di file CSS global Anda.
    */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
    
    .font-inter {
      font-family: 'Inter', sans-serif;
    }
  </style>