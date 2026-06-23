import { createRouter, createWebHistory } from 'vue-router';
import TvDisplay from '../views/TvDisplay.vue';
import LoginView from '../views/LoginView.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    redirect: '/tv'
  },
  {
    path: '/tv',
    name: 'TV',
    component: TvDisplay
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard for Protected Routes
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
});

export default router;
