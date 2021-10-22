import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import { libraryName, librarySlogan } from "@/config";

// 静态匹配
const staticRoutes: RouteRecordRaw[] = [
  {
    name: "home",
    path: "/",
    meta: { defaultTitle: `${libraryName}：${librarySlogan}` },
    component: () => import("@/pages/static/index.vue"),
  },
  {
    name: "login",
    path: "/login",
    meta: { defaultTitle: `登陆到${libraryName} · ${libraryName}` },
    component: () => import("@/pages/account/login.vue"),
  },
  {
    name: "register",
    path: "/register",
    meta: { defaultTitle: `注册账户 · ${libraryName}` },
    component: () => import("@/pages/account/register.vue"),
  },
  {
    name: "about",
    path: "/about",
    meta: { defaultTitle: `${libraryName}相关` },
    component: () => import("@/pages/static/about.vue"),
  },
];
// 有父级动态匹配
const parentedDynamicRoutes: RouteRecordRaw[] = [
  {
    name: "admin",
    path: "/admin/:adminName",
    component: () => import("@/pages/admin.vue"),
  },
];
// 无父级动态匹配
const unparentedDynamicRoutes: RouteRecordRaw[] = [
  {
    name: "user",
    path: "/:username",
    component: () => import("@/pages/user.vue"),
  },
  {
    name: "404",
    path: "/:pathMatch(.*)*",
    meta: { defaultTitle: `404 页面找不到 · ${libraryName}` },
    component: () => import("@/pages/404.vue"),
  },
];

const routes = [...staticRoutes, ...parentedDynamicRoutes, ...unparentedDynamicRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from) => {
  if (to.meta.defaultTitle && typeof to.meta.defaultTitle === "string")
    document.title = to.meta.defaultTitle;
});

export default router;
