<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// --- KONFIGURASI WAKTU ---
// Ubah angka 15 ini saja, maka Timer dan Pesan Alert akan otomatis menyesuaikan
const TIMEOUT_MINUTES = 15; 

// Konversi ke milidetik untuk setTimeout (Menit * 60 detik * 1000 ms)
const TIMEOUT_DURATION = TIMEOUT_MINUTES * 60 * 1000; 

let activityTimer = null;
const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

const resetTimer = () => {
  const isUserLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

  if (isUserLoggedIn) {
    if (activityTimer) clearTimeout(activityTimer);
    activityTimer = setTimeout(performAutoLogout, TIMEOUT_DURATION);
  }
};

const performAutoLogout = () => {
  localStorage.removeItem('userLoggedIn');
  localStorage.removeItem('activeUser');
  
  // Menggunakan Backticks (`) agar bisa memasukkan variabel ${TIMEOUT_MINUTES}
  alert(`Sesi Anda telah berakhir karena tidak ada aktivitas selama ${TIMEOUT_MINUTES} menit.`);

  router.push('/'); 
};

onMounted(() => {
  activityEvents.forEach(event => {
    window.addEventListener(event, resetTimer);
  });
  resetTimer();
});

onUnmounted(() => {
  activityEvents.forEach(event => {
    window.removeEventListener(event, resetTimer);
  });
  if (activityTimer) clearTimeout(activityTimer);
});
</script>

<style>
body, html, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>