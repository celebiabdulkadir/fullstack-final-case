import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    user: localStorage.getItem("user"), // This will hold the user information
  }),
  actions: {
    login(userInfo) {
      // Store the user information in the state
      this.user = userInfo;
    },
    logout() {
      // Remove the user information from the state
      this.user = null;
    },
  },
});
