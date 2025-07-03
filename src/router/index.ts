import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

// 導入頁面組件
import Login from "../pages/Login.vue";
import Dashboard from "../pages/Dashboard.vue";
import Clock from "../pages/Clock.vue";
import Schedule from "../pages/Schedule.vue";
import Settings from "../pages/Settings.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { requiresGuest: true }
    },
    {
      path: "/",
      name: "dashboard",
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: "/clock",
      name: "clock",
      component: Clock,
      meta: { requiresAuth: true }
    },
    {
      path: "/schedule",
      name: "schedule",
      component: Schedule,
      meta: { requiresAuth: true }
    },
    {
      path: "/settings",
      name: "settings",
      component: Settings,
      meta: { requiresAuth: true, requiresManager: true }
    },
    {
      // 404 頁面重導向
      path: "/:pathMatch(.*)*",
      redirect: "/"
    }
  ],
});

// 路由守護
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // 初始化身份驗證狀態
  authStore.initAuth();
  
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.user?.role;
  
  // 檢查是否需要登入
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
    return;
  }
  
  // 檢查是否需要管理員權限
  if (to.meta.requiresManager && userRole !== 'manager') {
    next('/');
    return;
  }
  
  // 如果已登入用戶試圖訪問登入頁面，重導向到首頁
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/');
    return;
  }
  
  next();
});

export default router;
