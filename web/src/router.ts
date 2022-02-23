import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import { LIBRARY_NAME, LIBRARY_SLOGAN } from "@/store";

// 静态匹配
const staticRoutes: RouteRecordRaw[] = [
  {
    name: "home",
    path: "/",
    meta: { defaultTitle: `${LIBRARY_NAME}：${LIBRARY_SLOGAN}` },
    component: () => {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      const user =
        accessToken && refreshToken
          ? JSON.parse(
              decodeURIComponent(
                window.atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
              )
            )
          : undefined;
      if (user) return import("@/pages/static/index.vue");
      return import("@/pages/static/homeUnlogged.vue");
    },
  },
  {
    name: "articles",
    path: "/articles",
    meta: { defaultTitle: `${LIBRARY_NAME}：${LIBRARY_SLOGAN}` },
    component: () => import("@/pages/static/homeUnlogged.vue"),
  },
  {
    name: "article",
    path: "/article/:id",
    meta: { defaultTitle: `${LIBRARY_NAME}：${LIBRARY_SLOGAN}` },
    component: () => import("@/pages/article.vue"),
  },
  {
    name: "login",
    path: "/login",
    meta: { defaultTitle: `登陆到${LIBRARY_NAME} · ${LIBRARY_NAME}` },
    component: () => import("@/pages/account/login.vue"),
  },
  {
    name: "register",
    path: "/register",
    meta: { defaultTitle: `注册账户 · ${LIBRARY_NAME}` },
    component: () => import("@/pages/account/register.vue"),
  },
  {
    name: "about",
    path: "/about",
    meta: { defaultTitle: `${LIBRARY_NAME}相关` },
    component: () => import("@/pages/static/about.vue"),
  },
  {
    name: "edit",
    path: "/edit",
    meta: { defaultTitle: `编辑｜${LIBRARY_NAME}` },
    component: () => import("@/pages/static/edit.vue"),
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
    meta: { defaultTitle: `404 页面找不到 · ${LIBRARY_NAME}` },
    component: () => import("@/pages/404.vue"),
  },
];

const routes = [...staticRoutes, ...parentedDynamicRoutes, ...unparentedDynamicRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from) => {
  if (to.meta.defaultTitle === "string") document.title = to.meta.defaultTitle;
});

export default router;
