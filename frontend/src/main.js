/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import axios from "axios";

// Components
import App from "./App.vue";
import router from "./router";

// Composables
import { createApp } from "vue";

const app = createApp(App);

registerPlugins(app);

app.mount("#app");
// axios.defaults.baseURL = import.meta.env.VITE_APP_API_BASE_URL;
axios.interceptors.request.use(
  (config) => {
    if (
      !config.url.endsWith("/auth/login") &&
      !config.url.endsWith("/auth/register") &&
      !config.url.endsWith("/auth/refresh")
    ) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
let isRefreshing = false;
let subscribers = [];

function onAccessTokenFetched(accessToken) {
  subscribers.forEach((callback) => callback(accessToken));
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !isRefreshing) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshRequest = await axios.post(
            "http://localhost:3000/auth/refresh",
            {},

            { withCredentials: true }
          );
          if (refreshRequest.status === 200) {
            localStorage.setItem(
              "accessToken",
              refreshRequest.data.accessToken
            );
            isRefreshing = false;
            onAccessTokenFetched(refreshRequest.data.accessToken);
          }
        } catch (err) {
          console.error("401 error", err);
          localStorage.removeItem("accessToken");
          router.push("/auth/login");
          isRefreshing = false;
          return Promise.reject(err);
        }
      }

      const retryOriginalRequest = new Promise((resolve) => {
        addSubscriber((accessToken) => {
          originalRequest.headers["Authorization"] = "Bearer " + accessToken;
          resolve(axios(originalRequest));
        });
      });

      return retryOriginalRequest;
    }

    return Promise.reject(error);
  }
);
