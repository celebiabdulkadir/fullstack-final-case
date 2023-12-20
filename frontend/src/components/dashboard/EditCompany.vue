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
import { useLocale } from "vuetify";
import { formatDate, parseDate, convertToStartOfDay } from "@/utils/dateFormat";
const { current, t } = useLocale();
const snackbar = ref(false);
const text = ref("My timeout is set to 2000.");
const color = ref("blue-gray");
const timeout = ref(2000);
const loading = ref(false);
const menu1 = ref(false);
const menu2 = ref(false);
const vuetifyConfig = (state) => ({
  props: {
    "error-messages": state.errors,
  },
});

const schema = yup.object({
  companyName: yup
    .string()
    .required(t("company_name_required"))
    .label(t("company_name")),
  employerNumber: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === "" || isNaN(originalValue) ? undefined : value;
    })
    .required(t("employee_number_required"))
    .label(t("employee_number")),
  subscriptionStart: yup
    .string()
    .required(t("subscription_start_required"))
    .label(t("subscription_start")),
  subscriptionEnd: yup
    .string()
    .required(t("subscription_end_required"))
    .label(t("subscription_end")),
  isFree: yup
    .boolean()
    .required(t("subscription_status_required"))
    .label(t("subscription_status")),
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
  loading.value = true;
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
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.dialog,
  () => {
    if (props.dialog) getCompanyById();
  }
);
const editCompany = async (values) => {
  loading.value = true;
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
  } finally {
    loading.value = false;
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
  loading.value = true;
  try {
    const response = await editCompany(values);
    console.log(response);

    if (response?.status === 200) {
      snackbar.value = true;
      text.value = t("update_success");
      closeDialog();
      emit("getAllCompanies");
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

const closeDialog = () => {
  emit("closeEditDialog");
  resetForm();
};

watch(subscriptionStart, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    menu1.value = false;
  }
});

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
          {{ t("close") }}
        </v-btn>
      </template>
    </v-snackbar>
    <Spinner v-if="loading"></Spinner>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ t("update_company") }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row justify="center">
            <v-col cols="12">
              <v-form @submit="onSubmit" class="px-4 w-100">
                <v-text-field
                  v-model="companyName"
                  v-bind="companyNameProps"
                  :label="t('company_name')"
                />
                <v-text-field
                  v-model="employerNumber"
                  v-bind="employerNumberProps"
                  :label="t('employee_number')"
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
                      :label="t('subscription_start')"
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
                      :label="t('subscription_end')"
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
                  :label="t('subscription_status')"
                >
                </v-checkbox>
                <div class="d-flex justify-center w-100">
                  <v-btn color="blue-darken-1" @click="closeDialog()">
                    {{ t("cancel") }}
                  </v-btn>
                  <v-btn class="ml-4" color="blue-darken-1" type="submit">
                    {{ t("update") }}
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
