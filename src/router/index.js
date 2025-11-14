// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';

// 1. Definisikan komponen halaman (Views)
// Kita gunakan dynamic import (lazy loading) agar lebih cepat
const LoginView = () => import('../views/LoginView.vue');
const MainLayout = () => import('../layouts/MainLayout.vue');
const DashboardView = () => import('../views/DashboardView.vue');
const ManageUserView = () => import('../views/ManageUserView.vue');
const ManageUnitView = () => import('../views/ManageUnitView.vue');
const MasterATKView = () => import('../views/MasterATKView.vue');
const ManageStockView = () => import('../views/ManageStockView.vue');

// 2. Definisikan routes
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    // Ini adalah route untuk layout utama (setelah login)
    // Semua halaman admin akan menjadi "children" dari layout ini
    path: '/',
    component: MainLayout,
    redirect: '/dashboard', // Arahkan / ke /dashboard
    meta: { requiresAuth: true }, // Menandakan rute ini butuh login
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView,
      },
      {
        path: 'manage-users',
        name: 'ManageUser',
        component: ManageUserView,
      },
      {
        path: 'manage-units',
        name: 'ManageUnit',
        component: ManageUnitView,
      },
      {
        path: 'master-atk',
        name: 'MasterATK',
        component: MasterATKView,
      },
      {
        path: 'manage-stock',
        name: 'ManageStock',
        component: ManageStockView,
      },
    ],
  },
];

// 3. Buat instance router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 4. Buat Navigation Guard (PENTING)
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('userLoggedIn');

  if (to.meta.requiresAuth && !isLoggedIn) {
    // Jika rute butuh login dan user belum login
    next({ name: 'Login' }); // Arahkan ke halaman login
  } else if (to.name === 'Login' && isLoggedIn) {
    // Jika user sudah login tapi mencoba akses halaman login
    next({ name: 'Dashboard' }); // Arahkan ke dashboard
  } else {
    // Jika semua oke
    next();
  }
});

export default router;