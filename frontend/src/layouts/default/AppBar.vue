<script setup>
import { useLocale } from "vuetify";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import axios from "axios";
import { i18n } from "@/main.js";
import { watch } from "vue";
import LanguageSwitcher from "@/components/common/LanguageSwitcher.vue";
const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : {
      name: "A",
      surname: "A",
      email: "deneme@deneme.com",
    };

const { current, t } = useLocale();

const userInitials = computed(() => {
  return (
    user?.name?.charAt(0).toUpperCase() + user?.surname?.charAt(0).toUpperCase()
  );
});

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
        <div class="d-flex align-center">
          <v-img
            :width="80"
            aspect-ratio="16/9"
            cover
            role="button"
            src="/logo.svg"
            @click="router.push('/')"
          ></v-img>
          <v-btn @click="router.push('/dashboard')">{{ t("dashboard") }}</v-btn>
        </div>
        <div class="d-flex justify-space-between">
          <div class="d-flex align-items-center">
            <div class="text-center d-flex flex-row align-center">
              <LanguageSwitcher />

              <v-container fluid>
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
                            {{ t("logout") }}
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
