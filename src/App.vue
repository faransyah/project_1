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
const TIMEOUT_MINUTES = 15; 
const TIMEOUT_DURATION = TIMEOUT_MINUTES * 60 * 1000; 

let activityTimer = null;
const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

// Fungsi Cek Saat Aplikasi Baru Dibuka/Direfresh
const checkSessionValidity = () => {
  const isUserLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
  const lastActiveTime = localStorage.getItem('lastActiveTime');
  
  if (isUserLoggedIn && lastActiveTime) {
    const now = Date.now();
    const timePassed = now - parseInt(lastActiveTime);

    // Jika selisih waktu > 15 menit, logout
    if (timePassed > TIMEOUT_DURATION) {
      performAutoLogout();
      return false; // Sesi sudah kadaluarsa
    }
  }
  return true; // Sesi masih valid
};

const resetTimer = () => {
  const isUserLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

  if (isUserLoggedIn) {
    // 1. Update waktu terakhir aktif ke LocalStorage (PENTING UNTUK KASUS TUTUP BROWSER)
    localStorage.setItem('lastActiveTime', Date.now().toString());

    // 2. Reset timer memori (untuk kasus browser tetap terbuka)
    if (activityTimer) clearTimeout(activityTimer);
    activityTimer = setTimeout(performAutoLogout, TIMEOUT_DURATION);
  }
};

const performAutoLogout = () => {
  localStorage.removeItem('userLoggedIn');
  localStorage.removeItem('activeUser');
  localStorage.removeItem('lastActiveTime'); // Hapus jejak waktu
  
  // Hapus timer agar tidak jalan double
  if (activityTimer) clearTimeout(activityTimer);

  // alert(`Sesi Anda telah berakhir karena tidak ada aktivitas selama ${TIMEOUT_MINUTES} menit.`);
  alert(`Sesi Anda telah habis. Silakan masuk kembali untuk melanjutkan.`);
  router.push('/login'); 
};

onMounted(() => {
  // 1. Cek dulu apakah sesi valid saat pertama kali load
  const isSessionValid = checkSessionValidity();

  // 2. Jika valid, baru pasang event listener
  if (isSessionValid) {
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    
    // Jalankan timer awal
    resetTimer();
  }
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