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
  departmentName: yup.string().required().label("Department Name"),
  consumptionAmount: yup.number().required().label("Consumption Amount"),
  consumptionFee: yup.number().required().label("Consumption Fee"),
  startTime: yup.string().required().label("Start Date"),
  endTime: yup.string().required().label("End Date"),
  isDiscountPrice: yup.boolean().required().label("Discount Status"),
});

const { defineField, handleSubmit, resetForm, setValues } = useForm({
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
const [startTime, startTimeProps] = defineField("startTime", vuetifyConfig);
const [endTime, endTimeProps] = defineField("endTime", vuetifyConfig);
const [isDiscountPrice, isDiscountPriceProps] = defineField(
  "isDiscountPrice",
  vuetifyConfig
);

const props = defineProps({
  dialog: Boolean,
  companyId: String,
  companyDetail: String,
});
const emit = defineEmits(["closeEditDialog", "getAllCompanyDetails"]);

const getCompanyDetailById = async () => {
  try {
    const response = await axios.get(`/companydetail/${props.companyDetail}`);

    setValues({
      departmentName: response.data.departmentName,
      consumptionAmount: response.data.consumptionAmount,
      consumptionFee: response.data.consumptionFee,
      startTime: convertToStartOfDay(response.data.usagePeriod.startTime),
      endTime: convertToStartOfDay(response.data.usagePeriod.endTime),
      isDiscountPrice: response.data.isDiscountPrice,
    });
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => props.dialog,
  () => {
    if (props.dialog) getCompanyDetailById();
  }
);
const editCompany = async (values) => {
  try {
    values.startTime = startTime.value.toISOString();
    values.endTime = endTime.value.toISOString();
    values.consumptionAmount = parseInt(values.consumptionAmount);
    values.consumptionFee = parseInt(values.consumptionFee);

    const response = await axios.put("/companydetail", {
      ...values,
      companyId: props.companyId,
      companyDetailId: props.companyDetail,
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};
const startTimeFormatted = computed({
  get: () => formatDate(startTime.value),
  set: (value) => (startTime.value = parseDate(value)),
});

const endTimeFormatted = computed({
  get: () => formatDate(endTime.value),
  set: (value) => (endTime.value = parseDate(value)),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await editCompany(values);
    console.log(response);

    if (response?.status === 200) {
      snackbar.value = true;
      text.value = "User registered successfully";
      closeDialog();
      emit("getAllCompanyDetails");
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

watch(startTime, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    menu1.value = false;
    console.log(startTime.value);
  }
});
console.log(startTime.value);
watch(endTime, (newVal, oldVal) => {
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
                      v-model="startTimeFormatted"
                      label="Start Time"
                      readonly
                      v-bind="{ ...props, ...startTimeProps }"
                    ></v-text-field>
                  </template>

                  <v-date-picker v-model="startTime"></v-date-picker>
                </v-menu>

                <v-menu
                  location="bottom"
                  :close-on-content-click="false"
                  v-model="menu2"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="endTimeFormatted"
                      label="End Time"
                      readonly
                      v-bind="{ ...props, ...endTimeProps }"
                    ></v-text-field>
                  </template>

                  <v-date-picker
                    :min="startTime"
                    v-model="endTime"
                  ></v-date-picker>
                </v-menu>

                <v-checkbox
                  v-model="isDiscountPrice"
                  v-bind="isDiscountPriceProps"
                  label="Discount"
                >
                </v-checkbox>
                <div class="d-flex justify-center w-100">
                  <v-btn color="blue-darken-1" @click="closeDialog">
                    Cancel
                  </v-btn>
                  <v-btn class="ml-4" color="blue-darken-1" type="submit">
                    Update
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
