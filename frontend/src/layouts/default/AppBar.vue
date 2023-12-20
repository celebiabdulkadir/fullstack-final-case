<script setup>
import { useLocale } from "vuetify";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import axios from "axios";
import { i18n } from "@/main.js";
import { watch } from "vue";
const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : {
      name: "A",
      surname: "A",
      email: "deneme@deneme.com",
    };

const { current, t } = useLocale();
const languageItems = ref([
  {
    title: "Tr",
    langCode: "tr",
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJmbGFnLWljb25zLXRyIiB2aWV3Qm94PSIwIDAgNjQwIDQ4MCI+CiAgPGcgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxwYXRoIGZpbGw9IiNlMzBhMTciIGQ9Ik0wIDBoNjQwdjQ4MEgweiIvPgogICAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTQwNyAyNDcuNWMwIDY2LjItNTQuNiAxMTkuOS0xMjIgMTE5LjlzLTEyMi01My43LTEyMi0xMjAgNTQuNi0xMTkuOCAxMjItMTE5LjggMTIyIDUzLjcgMTIyIDExOS45eiIvPgogICAgPHBhdGggZmlsbD0iI2UzMGExNyIgZD0iTTQxMyAyNDcuNWMwIDUzLTQzLjYgOTUuOS05Ny41IDk1LjlzLTk3LjYtNDMtOTcuNi05NiA0My43LTk1LjggOTcuNi05NS44IDk3LjYgNDIuOSA5Ny42IDk1Ljl6Ii8+CiAgICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJtNDMwLjcgMTkxLjUtMSA0NC4zLTQxLjMgMTEuMiA0MC44IDE0LjUtMSA0MC43IDI2LjUtMzEuOCA0MC4yIDE0LTIzLjItMzQuMSAyOC4zLTMzLjktNDMuNSAxMi0yNS44LTM3eiIvPgogIDwvZz4KPC9zdmc+Cg==",
  },
  {
    title: "En",
    langCode: "en",
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJmbGFnLWljb25zLWdiIiB2aWV3Qm94PSIwIDAgNjQwIDQ4MCI+CiAgPHBhdGggZmlsbD0iIzAxMjE2OSIgZD0iTTAgMGg2NDB2NDgwSDB6Ii8+CiAgPHBhdGggZmlsbD0iI0ZGRiIgZD0ibTc1IDAgMjQ0IDE4MUw1NjIgMGg3OHY2Mkw0MDAgMjQxbDI0MCAxNzh2NjFoLTgwTDMyMCAzMDEgODEgNDgwSDB2LTYwbDIzOS0xNzhMMCA2NFYwaDc1eiIvPgogIDxwYXRoIGZpbGw9IiNDODEwMkUiIGQ9Im00MjQgMjgxIDIxNiAxNTl2NDBMMzY5IDI4MWg1NXptLTE4NCAyMCA2IDM1TDU0IDQ4MEgwbDI0MC0xNzl6TTY0MCAwdjNMMzkxIDE5MWwyLTQ0TDU5MCAwaDUwek0wIDBsMjM5IDE3NmgtNjBMMCA0MlYweiIvPgogIDxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0yNDEgMHY0ODBoMTYwVjBIMjQxek0wIDE2MHYxNjBoNjQwVjE2MEgweiIvPgogIDxwYXRoIGZpbGw9IiNDODEwMkUiIGQ9Ik0wIDE5M3Y5Nmg2NDB2LTk2SDB6TTI3MyAwdjQ4MGg5NlYwaC05NnoiLz4KPC9zdmc+Cg==",
  },
]);
watch(current, (val) => {
  console.log(val);
});
const selectedLanguage = ref(
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJmbGFnLWljb25zLXRyIiB2aWV3Qm94PSIwIDAgNjQwIDQ4MCI+CiAgPGcgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxwYXRoIGZpbGw9IiNlMzBhMTciIGQ9Ik0wIDBoNjQwdjQ4MEgweiIvPgogICAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTQwNyAyNDcuNWMwIDY2LjItNTQuNiAxMTkuOS0xMjIgMTE5LjlzLTEyMi01My43LTEyMi0xMjAgNTQuNi0xMTkuOCAxMjItMTE5LjggMTIyIDUzLjcgMTIyIDExOS45eiIvPgogICAgPHBhdGggZmlsbD0iI2UzMGExNyIgZD0iTTQxMyAyNDcuNWMwIDUzLTQzLjYgOTUuOS05Ny41IDk1LjlzLTk3LjYtNDMtOTcuNi05NiA0My43LTk1LjggOTcuNi05NS44IDk3LjYgNDIuOSA5Ny42IDk1Ljl6Ii8+CiAgICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJtNDMwLjcgMTkxLjUtMSA0NC4zLTQxLjMgMTEuMiA0MC44IDE0LjUtMSA0MC43IDI2LjUtMzEuOCA0MC4yIDE0LTIzLjItMzQuMSAyOC4zLTMzLjktNDMuNSAxMi0yNS44LTM3eiIvPgogIDwvZz4KPC9zdmc+Cg=="
);

const userInitials = computed(() => {
  return (
    user?.name?.charAt(0).toUpperCase() + user?.surname?.charAt(0).toUpperCase()
  );
});

console.log(user.value);
const changeLanguage = (item) => {
  current.value = item.langCode;
  selectedLanguage.value = item.icon;
  i18n.locale = item.langCode;
};

const logout = async () => {
  const logoutRequest = await axios.get("/auth/logout", {
    withCredentials: true,
  });
  if (logoutRequest.status === 200) {
    router.push("/auth/login");
    localStorage.removeItem("accessToken");
  }
};
//
</script>

<template>
  <v-app-bar color="teal-lighten-4" flat>
    <v-app-bar-title>
      <div class="d-flex justify-space-between align-center">
        <div>
          <v-img
            :width="80"
            aspect-ratio="16/9"
            cover
            role="button"
            class="mr-lg-12"
            src="/logo.svg"
            @click="router.push('/')"
          ></v-img>
        </div>
        <div class="d-flex justify-space-between">
          <div class="d-flex align-items-center">
            <div class="text-center d-flex flex-row align-center">
              <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                  <v-btn
                    color="primary"
                    v-bind="props"
                    append-icon="mdi-chevron-down"
                    class="d-flex justify-space-between"
                  >
                    <v-img
                      :width="20"
                      aspect-ratio="16/9"
                      cover
                      :src="selectedLanguage"
                    ></v-img>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item
                    v-for="(item, index) in languageItems"
                    :key="index"
                  >
                    <v-btn
                      @click="changeLanguage(item)"
                      class="flex justify-start align-center w-100"
                    >
                      <v-img
                        :width="20"
                        aspect-ratio="16/9"
                        cover
                        :src="item.icon"
                      ></v-img
                      ><span class="ml-2">{{ item.title }}</span>
                      <span v-if="item.icon === selectedLanguage">
                        <v-icon color="blue" icon="mdi-check"></v-icon>
                      </span>
                    </v-btn>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-btn @click="router.push('/dashboard')">Dashboard</v-btn>
              <v-container fluid style="height: 50px">
                <v-row justify="center" align-content="center">
                  <v-menu min-width="200px" rounded>
                    <template v-slot:activator="{ props }">
                      <v-btn icon v-bind="props">
                        <v-avatar color="brown" size="small">
                          <span class="">{{ userInitials }}</span>
                        </v-avatar>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-text>
                        <div class="mx-auto text-center">
                          <v-avatar color="brown">
                            <span class="text-h5">{{ userInitials }}</span>
                          </v-avatar>
                          <h3>{{ user?.name }}</h3>
                          <p class="text-caption mt-1">
                            {{ user?.email }}
                          </p>

                          <v-divider class="my-3"></v-divider>
                          <v-btn rounded variant="text" @click="logout">
                            Logout
                          </v-btn>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </v-row>
              </v-container>
            </div>
          </div>
        </div>
      </div>
    </v-app-bar-title>
  </v-app-bar>
</template>

<style scoped>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}
</style>
