<script setup>
import { ref, watch, computed, nextTick } from "vue";
import axios from "axios";
import { onMounted } from "vue";
import CreateCompany from "@/components/dashboard/CreateCompany.vue";
import EditCompany from "@/components/dashboard/EditCompany.vue";
import { formatDate, parseDate } from "@/utils/dateFormat";
import { useRouter } from "vue-router";
import { useLocale } from "vuetify";
const { current, t } = useLocale();
const router = useRouter();
const dialog = ref(false);
const dialogCreate = ref(false);
const dialogEdit = ref(false);
const dialogDelete = ref(false);
const loading = ref(false);
const headers = computed(() => [
  {
    title: t("company_name"),
    align: "start",
    sortable: false,
    key: "companyName",
  },
  { title: t("subscription_start"), key: "subscriptionStart" },
  { title: t("subscription_end"), key: "subscriptionEnd" },
  { title: t("employee_number"), align: "center", key: "employerNumber" },
  { title: t("subscription_status"), key: "isFree" },
  { title: t("actions"), align: "center", key: "actions", sortable: false },
]);
const snackbar = ref(false);
const text = ref("My timeout is set to 2000.");
const color = ref("blue-gray");
const timeout = ref(2000);
const companies = ref([]);
const selectedCompanyForDelete = ref(null);
const selectedCompanyForEdit = ref(null);

const getAllCompanies = async () => {
  loading.value = true;
  try {
    const response = await axios.get("/company/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    console.log(response.data);
    companies.value = response.data;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getAllCompanies();
});

const deleteItem = async (item) => {
  // Store the company id when the delete button is clicked
  selectedCompanyForDelete.value = item.companyId;
  dialogDelete.value = true;
};

const deleteItemConfirm = async () => {
  loading.value = true;
  // Use the stored company id to delete the company
  try {
    const response = await axios.delete(
      `/company/${selectedCompanyForDelete.value}`
    );

    if (response.status === 200) {
      snackbar.value = true;
      text.value = "Company deleted successfully";
      getAllCompanies();
      closeDelete();
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const closeDelete = () => {
  dialogDelete.value = false;
};
const closeCreateDialog = () => {
  dialogCreate.value = false;
};
const closeEditDialog = () => {
  dialogEdit.value = false;
};
const openEditDialog = (item) => {
  selectedCompanyForEdit.value = item.companyId;
  dialogEdit.value = true;
};

const openCreateDialog = () => {
  dialogCreate.value = true;
};
</script>

<template>
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
  <v-data-table
    :headers="headers"
    :items="companies"
    :sort-by="[{ key: 'employeeNumber', order: 'asc' }]"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>{{ t("companies") }}</v-toolbar-title>

        <v-btn
          prepend-icon="mdi-plus"
          color="primary"
          dark
          class="mb-2"
          @click="openCreateDialog()"
        >
          {{ t("create_company") }}
        </v-btn>

        <CreateCompany
          :dialog="dialogCreate"
          @closeCreateDialog="closeCreateDialog"
          @getAllCompanies="getAllCompanies"
        ></CreateCompany>
        <EditCompany
          :dialog="dialogEdit"
          :company="selectedCompanyForEdit"
          @closeEditDialog="closeEditDialog"
          @getAllCompanies="getAllCompanies"
        ></EditCompany>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5 text-center">{{
              t("delete_confirmation")
            }}</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="closeDelete"
                >{{ t("cancel") }}</v-btn
              >
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="deleteItemConfirm"
                >{{ t("ok") }}</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template center v-slot:item.actions="{ item }">
      <v-btn
        icon="mdi-pencil"
        color="blue"
        class="ma-2"
        size="small"
        @click="openEditDialog(item)"
      ></v-btn>

      <v-btn
        icon="mdi-delete"
        color="red"
        class="ma-2"
        size="small"
        @click="deleteItem(item)"
      ></v-btn>

      <v-tooltip :text="t('detail')">
        <template v-slot:activator="{ props }">
          <v-btn
            class="ma-2"
            color="indigo"
            size="small"
            icon="mdi-arrow-right"
            @click="router.push(`/company-detail/${item.companyId}`)"
            prepend-icon="mdi-arrow-right"
            v-bind="props"
          ></v-btn>
        </template>
      </v-tooltip>
    </template>

    <template v-slot:item.isFree="{ item }">
      <v-chip
        :color="item.isFree ? 'green' : 'red'"
        text-color="white"
        label
        small
        >{{ item.isFree ? t("free") : t("not_free") }}</v-chip
      >
    </template>

    <template v-slot:item.subscriptionStart="{ item }">
      <span>{{ formatDate(new Date(item.subscriptionStart)) }}</span>
    </template>

    <template v-slot:item.subscriptionEnd="{ item }">
      <span>{{ formatDate(new Date(item.subscriptionEnd)) }}</span>
    </template>
  </v-data-table>
</template>
