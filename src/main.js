// src/main.js

import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // <-- Impor router kita
import './assets/main.css'; // <-- Pastikan ini mengimpor Tailwind

const app = createApp(App);

app.use(router); // <-- Gunakan router

app.mount('#app');