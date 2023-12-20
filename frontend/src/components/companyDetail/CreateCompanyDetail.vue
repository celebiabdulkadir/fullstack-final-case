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
import { formatDate, parseDate } from "@/utils/dateFormat";
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
  departmentName: yup.string().required().label("Department Name"),
  consumptionAmount: yup.number().required().label("Consumption Amount"),
  consumptionFee: yup.number().required().label("Consumption Fee"),
  subscriptionStart: yup.string().required().label("Start Date"),
  subscriptionEnd: yup.string().required().label("End Date"),
  isDiscountPrice: yup.boolean().required().label("Discount Status"),
});

const { defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});
const [departmentName, departmentNameProps] = defineField(
  "departmentName",
  vuetifyConfig
);
const [consumptionAmount, consumptionAmountProps] = defineField(
  "consumptionAmount",
  vuetifyConfig
);
const [consumptionFee, consumptionFeeProps] = defineField(
  "consumptionFee",
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
const [isDiscountPrice, isDiscountPriceProps] = defineField(
  "isDiscountPrice",
  vuetifyConfig
);

const props = defineProps({
  dialog: Boolean,
});
const emit = defineEmits(["closeCreateDialog", "getAllCompanies"]);

const createCompany = async (values) => {
  try {
    values.subscriptionStart = subscriptionStart.value.toISOString();
    values.subscriptionEnd = subscriptionEnd.value.toISOString();
    values.consumptionAmount = parseInt(values.employerNumber);

    const response = await axios.post("/company", values);

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
    const response = await createCompany(values);
    console.log(response);

    if (response?.status === 201) {
      snackbar.value = true;
      text.value = "User registered successfully";
      close();
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

const close = () => {
  emit("closeCreateDialog");
  resetForm();
};

//wathc the date change and close the menu
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
        <span class="text-h5">Create New Department</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row justify="center">
            <v-col cols="12">
              <v-form @submit="onSubmit" class="px-4 w-100">
                <v-text-field
                  v-model="departmentName"
                  v-bind="departmentNameProps"
                  label="Department Name"
                />
                <v-text-field
                  v-model="consumptionFee"
                  v-bind="consumptionFeeProps"
                  label="Employee Number"
                  type="number"
                />
                <v-text-field
                  v-model="consumptionAmount"
                  v-bind="consumptionAmountProps"
                  label="Consumption Amount"
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
                  v-model="isDiscountPrice"
                  v-bind="isDiscountPriceProps"
                  label="Discount"
                >
                </v-checkbox>
                <div class="d-flex justify-center w-100">
                  <v-btn color="blue-darken-1" @click="close"> Cancel </v-btn>
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