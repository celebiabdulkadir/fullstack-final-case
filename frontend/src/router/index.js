// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "Home",
        // route level code-splitting
        // this generates a separate chunk (Home-[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "dashboard",
        name: "Dashboard",
        // route level code-splitting
        // this generates a separate chunk (Home-[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("@/views/Dashboard.vue"),
      },
      {
        path: "company-detail/:id",
        name: "CompanyDetail",
        // route level code-splitting
        // this generates a separate chunk (Home-[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("@/views/CompanyDetail.vue"),
      },
    ],
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/auth/Login.vue"),
      },
      {
        path: "register",
        name: "Register",
        component: () => import("@/views/auth/Register.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // List of routes that don't require authentication
  const publicPages = ["/auth/login", "/auth/register"];

  // Check if the route requires authentication
  const authRequired = !publicPages.includes(to.path);

  // Get the access token from local storage
  const loggedIn = localStorage.getItem("accessToken");

  // If the route requires authentication and there's no access token
  // in local storage, redirect to the login page
  if (authRequired && !loggedIn) {
    next("/auth/login");
  } else {
    next();
  }
});

export default router;
