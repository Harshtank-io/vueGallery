import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import AuthLayout from "../layouts/AuthLayout.vue";

function isAuthenticated() {
  const keys = Object.keys(localStorage);
  const matchingKey = keys.find((key) => key.includes("auth-token"));

  return !!matchingKey;
}

const routes = [
  {
    path: "/login",
    component: () => import("../views/auth/Login.vue"),
    meta: { layout: AuthLayout },
  },
  {
    path: "/register",
    component: () => import("../views/auth/Register.vue"),
    meta: { layout: AuthLayout },
  },
  {
    path: "/",
    component: () => import("../views/Home.vue"),
    meta: { layout: MainLayout },
  },
  {
    path: "/about",
    component: () => import("../views/AboutUs.vue"),
    meta: { layout: MainLayout },
  },
  {
    path: "/contact-us",
    component: () => import("../views/contact-us.vue"),
    meta: { layout: MainLayout },
  },
  {
    path: "/gallery/:id",
    component: () => import("../views/GalleryDetail.vue"),
    meta: {
      layout: MainLayout,
      requiresAuth: true,
    },
  },
  {
    path: "/gallery",
    component: () => import("../views/Gallery.vue"),
    meta: {
      layout: MainLayout,
      requiresAuth: true,
    },
    // children: [
    //   {
    //     path: ":id",
    //     component: () => import("../views/GalleryDetail.vue"),
    //     meta: {
    //       requiresAuth: true,
    //     },
    //   },
    // ],
  },
  {
    path: "/profile",
    component: () => import("../views/Profile.vue"),
    meta: {
      layout: MainLayout,
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next("/login");
  } else {
    next();
  }
});
export default router;
