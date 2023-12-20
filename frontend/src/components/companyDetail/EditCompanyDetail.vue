<script setup>
import {
  ref,
  onMounted,
  watch,
  nextTick,
  reactive,
  defineEmits,
  defineProps,
  computed,
} from "vue";
import { useDate } from "vuetify";

import { useForm } from "vee-validate";
import * as yup from "yup";
import axios from "axios";
import { formatDate, parseDate, convertToStartOfDay } from "@/utils/dateFormat";
const snackbar = ref(false);
const text = ref("My timeout is set to 2000.");
const color = ref("blue-gray");
const timeout = ref(2000);

const menu1 = ref(false);
const menu2 = ref(false);
const vuetifyConfig = (state) => ({
  props: {
    "error-messages": state.errors,
  },
});

const schema = yup.object({
  companyName: yup.string().required().label("Company Name"),
  employerNumber: yup.number().required().label("Employee Number"),
  subscriptionStart: yup.string().required().label("Start Date"),
  subscriptionEnd: yup.string().required().label("End Date"),
  isFree: yup.boolean().required().label("Is Free"),
});

const { defineField, handleSubmit, resetForm, setValues } = useForm({
  validationSchema: schema,
});
const [companyName, companyNameProps] = defineField(
  "companyName",
  vuetifyConfig
);
const [employerNumber, employerNumberProps] = defineField(
  "employerNumber",
  vuetifyConfig
);
const [subscriptionStart, subscriptionStartProps] = defineField(
  "subscriptionStart",
  vuetifyConfig
);
const [subscriptionEnd, subscriptionEndProps] = defineField(
  "subscriptionEnd",
  vuetifyConfig
);
const [isFree, isFreeProps] = defineField("isFree", vuetifyConfig);

const props = defineProps({
  dialog: Boolean,
  company: String,
});
const emit = defineEmits(["closeEditDialog", "getAllCompanies"]);

const getCompanyById = async () => {
  try {
    const response = await axios.get(`/company/${props.company}`);

    setValues({
      companyName: response.data.companyName,
      employerNumber: response.data.employerNumber,
      subscriptionStart: convertToStartOfDay(response.data.subscriptionStart),
      subscriptionEnd: convertToStartOfDay(response.data.subscriptionEnd),
      isFree: response.data.isFree,
    });
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => props.dialog,
  () => {
    if (props.dialog) getCompanyById();
  }
);
const editCompany = async (values) => {
  try {
    values.subscriptionStart = subscriptionStart.value.toISOString();
    values.subscriptionEnd = subscriptionEnd.value.toISOString();
    values.employerNumber = parseInt(values.employerNumber);

    const response = await axios.put("/company", {
      ...values,
      companyId: props.company,
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};
const subscriptionStartFormatted = computed({
  get: () => formatDate(subscriptionStart.value),
  set: (value) => (subscriptionStart.value = parseDate(value)),
});

const subscriptionEndFormatted = computed({
  get: () => formatDate(subscriptionEnd.value),
  set: (value) => (subscriptionEnd.value = parseDate(value)),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await editCompany(values);
    console.log(response);

    if (response?.status === 200) {
      snackbar.value = true;
      text.value = "User registered successfully";
      closeDialog();
      emit("getAllCompanies");
    } else {
      snackbar.value = true;
      color.value = "red";
      text.value = "Something went wrong";
      return;
    }
  } catch (error) {
    console.log(error);
    snackbar.value = true;
    color.value = "red";
    text.value = error.response.data.message;
  }
});

const closeDialog = () => {
  emit("closeEditDialog");
  resetForm();
};

watch(subscriptionStart, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    menu1.value = false;
    console.log(subscriptionStart.value);
  }
});
console.log(subscriptionStart.value);
watch(subscriptionEnd, (newVal, oldVal) => {
  if (newVal !== oldVal) menu2.value = false;
});
</script>

<template>
  <v-dialog v-model="props.dialog" max-width="500px">
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
    <v-card>
      <v-card-title>
        <span class="text-h5">Update Company</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row justify="center">
            <v-col cols="12">
              <v-form @submit="onSubmit" class="px-4 w-100">
                <v-text-field
                  v-model="companyName"
                  v-bind="companyNameProps"
                  label="Company Name"
                />
                <v-text-field
                  v-model="employerNumber"
                  v-bind="employerNumberProps"
                  label="Employee Number"
                  type="number"
                />

                <v-menu
                  location="bottom"
                  :close-on-content-click="false"
                  v-model="menu1"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="subscriptionStartFormatted"
                      label="Start Time"
                      readonly
                      v-bind="{ ...props, ...subscriptionStartProps }"
                    ></v-text-field>
                  </template>

                  <v-date-picker v-model="subscriptionStart"></v-date-picker>
                </v-menu>

                <v-menu
                  location="bottom"
                  :close-on-content-click="false"
                  v-model="menu2"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="subscriptionEndFormatted"
                      label="End Time"
                      readonly
                      v-bind="{ ...props, ...subscriptionEndProps }"
                    ></v-text-field>
                  </template>

                  <v-date-picker
                    :min="subscriptionStart"
                    v-model="subscriptionEnd"
                  ></v-date-picker>
                </v-menu>

                <v-checkbox
                  v-model="isFree"
                  v-bind="isFreeProps"
                  label="Is Free"
                >
                </v-checkbox>
                <div class="d-flex justify-center w-100">
                  <v-btn color="blue-darken-1" @click="closeDialog()">
                    Cancel
                  </v-btn>
                  <v-btn class="ml-4" color="blue-darken-1" type="submit">
                    Save
                  </v-btn>
                </div>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
