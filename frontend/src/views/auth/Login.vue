<script setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
import * as yup from "yup";
import axios from "axios";

import { useRouter } from "vue-router";
const router = useRouter();
const schema = yup.object({
  email: yup.string().email().required().label("E-mail"),
  password: yup.string().min(6).required().label("Password"),
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
  try {
    const user = await login(values);
    localStorage.setItem("accessToken", user.accessToken);
    // cookie.setItem("refreshToken", response.cookie.refreshToken);
    router.push("/");
    console.log("Submitted with", user);
  } catch (error) {
    console.log(error);
  }
});

const login = async (values) => {
  try {
    const response = await axios.post("http://localhost:3000/auth/login", {
      email: values.email,
      password: values.password,
    });
    return response.data;
  } catch (error) {}
};
</script>

<template>
  <div class="d-flex w-100 justify-center align-center h-screen">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="6">
          <v-form @submit="onSubmit" class="px-4 w-100">
            <h1 class="text-center mb-10">Login</h1>

            <v-text-field
              class="mb-4"
              v-model="email"
              v-bind="emailProps"
              label="Email"
              type="email"
            />

            <v-text-field
              class="mb-4"
              v-model="password"
              v-bind="passwordProps"
              label="Password"
              type="password"
            />

            <div class="mb-4">
              <v-btn color="primary" type="submit"> Login </v-btn>
              <v-btn color="outline" class="ml-4" @click="resetForm()">
                Reset
              </v-btn>
            </div>
            <router-link to="/auth/register"
              >Don't you have an account ? Register here</router-link
            >
          </v-form></v-col
        >
      </v-row>
    </v-container>
  </div>
</template>
