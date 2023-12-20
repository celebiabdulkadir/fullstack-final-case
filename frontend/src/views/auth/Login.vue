<script setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
import * as yup from "yup";
import axios from "axios";
import { useAppStore } from "@/store/app";
import { useLocale } from "vuetify";
import { useRouter } from "vue-router";
import LanguageSwitcher from "@/components/common/LanguageSwitcher.vue";
const { current, t } = useLocale();
const router = useRouter();
const snackbar = ref(false);
const text = ref("My timeout is set to 2000.");
const color = ref("blue-gray");
const timeout = ref(2000);
const loading = ref(false);
const schema = yup.object({
  email: yup
    .string()
    .trim()
    .email(t("email_invalid"))
    .required(t("email_required"))
    .label(t("email")),
  password: yup
    .string()
    .required(t("password_required"))
    .min(8, t("password_min"))
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
      t("password_complexity")
    )
    .label(t("password")),
});

const { defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

// Refer to the docs for how to make advanced validation behaviors with dynamic configs
// TODO: Add link
const vuetifyConfig = (state) => ({
  props: {
    "error-messages": state.errors,
  },
});

const [email, emailProps] = defineField("email", vuetifyConfig);
const [password, passwordProps] = defineField("password", vuetifyConfig);

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  try {
    const user = await login(values);
    localStorage.setItem("accessToken", user.accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    snackbar.value = true;
    color.value = "green";
    text.value = t("login_success");
    setTimeout(() => {
      router.push("/");
    }, 500);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
});

const login = async (values) => {
  try {
    const response = await axios.post(
      "/auth/login",
      {
        email: values.email,
        password: values.password,
      },
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response.status === 404) {
      snackbar.value = true;
      color.value = "red";
      text.value = t("user_not_found");
      return;
    } else {
      snackbar.value = true;
      color.value = "red";
      text.value = t("something_went_wrong");
    }
  }
};
</script>

<template>
  <div class="d-flex w-100 justify-center align-center h-screen">
    <v-snackbar
      variant="tonal"
      v-model="snackbar"
      :timeout="timeout"
      location="top"
    >
      {{ text }}

      <template v-slot:actions>
        <v-btn :color="color" variant="text" @click="snackbar = false">
          {{ t("close") }}
        </v-btn>
      </template>
    </v-snackbar>
    <Spinner v-if="loading"></Spinner>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="6">
          <v-form @submit="onSubmit" class="px-4 w-100 shadow-md">
            <div class="d-flex justify-center w-100">
              <div class="w-50 d-flex justify-center">
                <v-img
                  :width="80"
                  aspect-ratio="16/9"
                  cover
                  src="/logo.png"
                ></v-img>
              </div>
            </div>
            <div class="d-flex justify-space-between align-center pb-12">
              <h1 class="text-center">{{ t("login") }}</h1>
              <LanguageSwitcher />
            </div>

            <v-text-field
              class="mb-4"
              v-model="email"
              v-bind="emailProps"
              :label="t('email')"
              type="email"
            />

            <v-text-field
              class="mb-4"
              v-model="password"
              v-bind="passwordProps"
              :label="t('password')"
              type="password"
            />

            <div class="mb-4">
              <v-btn color="primary" type="submit"> {{ t("login") }} </v-btn>
            </div>
            <router-link to="/auth/register">{{
              t("direct_register")
            }}</router-link>
          </v-form></v-col
        >
      </v-row>
    </v-container>
  </div>
</template>
