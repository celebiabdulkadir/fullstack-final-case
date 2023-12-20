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

axios.defaults.baseURL = "http://localhost:3000";

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
  console.log("onAccessTokenFetched called with accessToken:", accessToken);
  subscribers.forEach((callback) => callback(accessToken));
  subscribers = [];
}

function addSubscriber(callback) {
  console.log("addSubscriber called with callback:", callback);
  subscribers.push(callback);
}

function retryRequestWithNewToken(accessToken, originalRequest) {
  originalRequest.headers["Authorization"] = "Bearer " + accessToken;
  return axios(originalRequest);
}

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    // Check if the error is due to an expired access token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        subscribers = []; // Clear previous subscribers

        try {
          const refreshRequest = await axios.post(
            "/auth/refresh",
            {},
            { withCredentials: true }
          );
          const newAccessToken = refreshRequest.data.accessToken;

          if (refreshRequest.status === 201) {
            localStorage.setItem("accessToken", newAccessToken);
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            // Notify subscribers with the new token
            subscribers.forEach((callback) => callback(newAccessToken));
            subscribers = []; // Clear subscribers after notifying
            isRefreshing = false;
          }
        } catch (err) {
          console.error("Error refreshing token:", err);
          localStorage.removeItem("accessToken");
          router.push("/auth/login");
          isRefreshing = false;
          return Promise.reject(err);
        }
      }

      // Return a new promise that resolves once the token has been refreshed
      return new Promise((resolve) => {
        addSubscriber((newToken) => {
          resolve(retryRequestWithNewToken(newToken, originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);
