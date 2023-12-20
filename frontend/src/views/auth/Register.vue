<script setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
import * as yup from "yup";
import axios from "axios";
import { useRouter } from "vue-router";
import { useLocale } from "vuetify";
import LanguageSwitcher from "@/components/common/LanguageSwitcher.vue";
const router = useRouter();
const { current, t } = useLocale();
const snackbar = ref(false);
const text = ref("My timeout is set to 2000.");
const color = ref("blue-gray");
const timeout = ref(2000);
const loading = ref(false);
const schema = yup.object({
  name: yup
    .string()
    .trim()
    .required(t("name_required"))
    .matches(/^[a-zA-Z\s]*$/, t("name_alpha"))
    .min(8, t("name_min"))
    .label(t("name")),
  surname: yup
    .string()
    .trim()
    .required(t("surname_required"))
    .matches(/^[a-zA-Z\s]*$/, t("surname_alpha"))
    .label(t("surname")),
  email: yup
    .string()
    .trim()
    .email(t("email_invalid"))
    .required(t("email_required"))
    .label(t("email")),
  role: yup
    .string()
    .oneOf(["admin", "editor"])
    .required(t("role_required"))
    .label(t("role")),
  password: yup
    .string()
    .required(t("password_required"))
    .min(8, t("password_min"))
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
      t("password_complexity")
    )
    .label(t("password")),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], t("password_match"))
    .required(t("password_required"))
    .label(t("password_confirm")),
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

const [name, nameProps] = defineField("name", vuetifyConfig);
const [surname, surnameProps] = defineField("surname", vuetifyConfig);
const [email, emailProps] = defineField("email", vuetifyConfig);
const [role, roleProps] = defineField("role", vuetifyConfig);
const [password, passwordProps] = defineField("password", vuetifyConfig);
const [passwordConfirm, confirmProps] = defineField(
  "passwordConfirm",
  vuetifyConfig
);

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  try {
    const response = await registerUser(values);

    if (response?.status === 201) {
      snackbar.value = true;
      text.value = t("register_success");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1000);
    } else {
      snackbar.value = true;
      color.value = "red";
      text.value = t("something_went_wrong");
    }
  } catch (error) {
    console.log(error);
    snackbar.value = true;
    color.value = "red";
    text.value = error.response.data.message;
  } finally {
    loading.value = false;
  }
});

const registerUser = async (values) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/auth/register",
      {
        name: values.name,
        surname: values.surname,
        email: values.email,
        role: values.role,
        password: values.password,
      },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    snackbar.value = true;
    color.value = "red";
    text.value = error.response.data.message;
    console.log(error);
  }
};
</script>

<template>
  <div class="d-flex w-100 justify-center align-center h-screen">
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      location="top"
      variant="tonal"
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
          <v-form @submit="onSubmit" class="px-4 w-100">
            <div class="d-flex justify-space-between mb-10">
              <h1 class="text-center">{{ t("register") }}</h1>
              <LanguageSwitcher />
            </div>
            <v-text-field
              v-model="name"
              v-bind="nameProps"
              :label="t('name')"
            />
            <v-text-field
              v-model="surname"
              v-bind="surnameProps"
              :label="t('surname')"
            />
            <v-text-field
              v-model="email"
              v-bind="emailProps"
              :label="t('email')"
              type="email"
            />
            <v-select
              v-model="role"
              v-bind="roleProps"
              :label="t('select_role')"
              :items="['admin', 'editor']"
            ></v-select>
            <v-text-field
              v-model="password"
              v-bind="passwordProps"
              :label="t('password')"
              type="password"
            />
            <v-text-field
              v-model="passwordConfirm"
              v-bind="confirmProps"
              :label="t('confirm_password')"
              type="password"
            />

            <div class="mb-4">
              <v-btn color="primary" type="submit"> {{ t("register") }} </v-btn>
            </div>
            <router-link to="/auth/login">
              {{ t("direct_login") }}
            </router-link>
          </v-form></v-col
        >
      </v-row>
    </v-container>
  </div>
</template>
