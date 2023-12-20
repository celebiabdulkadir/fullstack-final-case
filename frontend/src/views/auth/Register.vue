<script setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
import * as yup from "yup";
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();

const snackbar = ref(false);
const text = ref("My timeout is set to 2000.");
const color = ref("blue-gray");
const timeout = ref(2000);
const schema = yup.object({
  name: yup.string().required().label("Name"),
  surname: yup.string().required().label("Surname"),
  email: yup.string().email().required().label("E-mail"),
  role: yup.string().oneOf(["admin", "editor"]).required().label("Role"),
  password: yup.string().min(6).required(),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required()
    .label("Password confirmation"),
});

const { defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const roles = [
  {
    role: "admin",
  },
  {
    role: "editor",
  },
];

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
  try {
    const response = await registerUser(values);

    if (response?.status === 201) {
      snackbar.value = true;
      text.value = "User registered successfully";
      console.log("Submitted with", values);
      setTimeout(() => {
        router.push("/auth/login");
      }, 1000);
    } else {
      snackbar.value = true;
      color.value = "red";
      text.value = "Something went wrong";
    }
  } catch (error) {
    console.log(error);
    snackbar.value = true;
    color.value = "red";
    text.value = error.response.data.message;
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
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="6">
          <v-form @submit="onSubmit" class="px-4 w-100">
            <h1 class="text-center mb-10">Register</h1>
            <v-text-field v-model="name" v-bind="nameProps" label="Name" />
            <v-text-field
              v-model="surname"
              v-bind="surnameProps"
              label="Surname"
            />
            <v-text-field
              v-model="email"
              v-bind="emailProps"
              label="Email"
              type="email"
            />
            <v-select
              v-model="role"
              v-bind="roleProps"
              label="Select a role"
              :items="['admin', 'editor']"
            ></v-select>
            <v-text-field
              v-model="password"
              v-bind="passwordProps"
              label="Password"
              type="password"
            />
            <v-text-field
              v-model="passwordConfirm"
              v-bind="confirmProps"
              label="Password confirmation"
              type="password"
            />

            <div class="mb-4">
              <v-btn color="primary" type="submit"> Register </v-btn>
              <v-btn color="outline" class="ml-4" @click="resetForm()">
                Reset
              </v-btn>
            </div>
            <router-link to="/auth/login"> Login </router-link>
          </v-form></v-col
        >
      </v-row>
    </v-container>
  </div>
</template>
