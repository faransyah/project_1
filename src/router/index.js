import { createRouter, createWebHistory } from 'vue-router';

// --- LAYOUTS ---
import MainLayout from '../layouts/MainLayout.vue';
import UserLayout from '../layouts/UserLayout.vue';

// --- VIEWS ---
import LoginView from '../views/auth/LoginView.vue';
import DashboardView from '../views/admin/DashboardView.vue';
import ManageUserView from '../views/admin/ManageUserView.vue';
import ManageUnitView from '../views/admin/ManageUnitView.vue';
import MasterATKView from '../views/admin/MasterATKView.vue';
import ManageStockView from '../views/admin/ManageStockView.vue';
import UserRequestView from '../views/user/UserRequestView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      redirect: '/login'
    },
    
    // --- ADMIN ROUTES ---
    {
      path: '/admin',
      component: MainLayout,
      meta: { requiresAuth: true, role: 'Admin' },
      children: [
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', name: 'admin-dashboard', component: DashboardView },
        { path: 'users', name: 'admin-users', component: ManageUserView },
        { path: 'units', name: 'admin-units', component: ManageUnitView },
        { path: 'atk', name: 'admin-atk', component: MasterATKView },
        { path: 'stock', name: 'admin-stock', component: ManageStockView },
      ]
    },

    // --- USER ROUTES ---
    {
      path: '/user',
      component: UserLayout,
      meta: { requiresAuth: true, role: 'User' },
      children: [
        { path: '', redirect: '/user/request' },
        { path: 'request', name: 'user-request', component: UserRequestView },
      ]
    },
    
    // 404 Catch All
    { path: '/:pathMatch(.*)*', redirect: '/login' }
  ]
});

// --- NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  // A. Halaman Wajib Login
  if (to.meta.requiresAuth) {
    if (!isLoggedIn) {
      return next('/login');
    }
    
    // Cek Role
    if (to.meta.role && to.meta.role !== userRole) {
      // Redirect ke dashboard masing-masing jika salah kamar
      const target = userRole === 'Admin' ? '/admin/dashboard' : '/user/request';
      if (to.path !== target) {
        return next(target);
      } else {
        return next(); // Sudah di tempat yang benar
      }
    }
    return next();
  } 
  
  // B. Halaman Login (Guest)
  else if (to.meta.requiresGuest) {
    if (isLoggedIn) {
      if (userRole === 'Admin') return next('/admin/dashboard');
      return next('/user/request');
    }
    return next();
  } 
  
  else {
    return next();
  }
});

export default router;