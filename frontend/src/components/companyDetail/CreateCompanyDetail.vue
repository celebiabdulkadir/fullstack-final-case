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
import { useLocale } from "vuetify";
const { current, t } = useLocale();
const snackbar = ref(false);
const text = ref("My timeout is set to 2000.");
const color = ref("blue-gray");
const timeout = ref(2000);
const menu1 = ref(false);
const menu2 = ref(false);
const loading = ref(false);
const vuetifyConfig = (state) => ({
  props: {
    "error-messages": state.errors,
  },
});

const schema = yup.object({
  departmentName: yup
    .string()
    .required(t("department_name_required"))
    .label(t("department_name")),
  consumptionAmount: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === "" || isNaN(originalValue) ? undefined : value;
    })
    .required(t("consumption_amount_required"))
    .label(t("consumption_amount")),
  consumptionFee: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === "" || isNaN(originalValue) ? undefined : value;
    })
    .required(t("consumption_fee_required"))
    .label(t("consumption_fee")),
  startTime: yup
    .string()
    .required(t("start_time_required"))
    .label(t("start_time")),
  endTime: yup.string().required(t("end_time_required")).label(t("end_time")),
  isDiscountPrice: yup
    .boolean()
    .required(t("discount_status_required"))
    .label(t("discount_status")),
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
const [startTime, startTimeProps] = defineField("startTime", vuetifyConfig);
const [endTime, endTimeProps] = defineField("endTime", vuetifyConfig);
const [isDiscountPrice, isDiscountPriceProps] = defineField(
  "isDiscountPrice",
  vuetifyConfig
);

const props = defineProps({
  dialog: Boolean,
  companyId: String,
});
const emit = defineEmits(["closeCreateDialog", "getAllCompanyDetails"]);

const createCompany = async (values) => {
  try {
    values.startTime = startTime.value.toISOString();
    values.endTime = endTime.value.toISOString();
    values.consumptionAmount = parseInt(values.consumptionAmount);
    values.consumptionFee = parseInt(values.consumptionFee);

    const response = await axios.post("/companydetail", {
      ...values,
      companyId: props.companyId,
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
  loading.value = true;
  try {
    const response = await createCompany(values);
    console.log(response);

    if (response?.status === 201) {
      snackbar.value = true;
      text.value = t("department_created");
      close();
      emit("getAllCompanyDetails");
    } else {
      snackbar.value = true;
      color.value = "red";
      text.value = t("something_went_wrong");
      return;
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

const close = () => {
  emit("closeCreateDialog");
  resetForm();
};

//wathc the date change and close the menu
watch(startTime, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    menu1.value = false;
  }
});

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
          {{ t("close") }}
        </v-btn>
      </template>
    </v-snackbar>
    <Spinner v-if="loading"></Spinner>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ t("create_department") }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row justify="center">
            <v-col cols="12">
              <v-form @submit="onSubmit" class="px-4 w-100">
                <v-text-field
                  v-model="departmentName"
                  v-bind="departmentNameProps"
                  :label="t('department_name')"
                />
                <v-text-field
                  v-model="consumptionFee"
                  v-bind="consumptionFeeProps"
                  :label="t('consumption_fee')"
                  type="number"
                />
                <v-text-field
                  v-model="consumptionAmount"
                  v-bind="consumptionAmountProps"
                  :label="t('consumption_amount')"
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
                      :label="t('start_time')"
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
                      :label="t('end_time')"
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
                  :label="t('discount_status')"
                >
                </v-checkbox>
                <div class="d-flex justify-center w-100">
                  <v-btn color="blue-darken-1" @click="close">
                    {{ t("cancel") }}
                  </v-btn>
                  <v-btn class="ml-4" color="blue-darken-1" type="submit">
                    {{ t("save") }}
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
