<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { onMounted } from "vue";
import CreateCompanyDetail from "@/components/companyDetail/CreateCompanyDetail.vue";
import EditCompanyDetail from "@/components/companyDetail/EditCompanyDetail.vue";
import { formatDate, parseDate } from "@/utils/dateFormat";
import { useRoute, useRouter } from "vue-router";
import { useLocale } from "vuetify";
const { current, t } = useLocale();
const router = useRouter();
const dialogCreate = ref(false);
const dialogEdit = ref(false);
const dialogDelete = ref(false);
const loading = ref(false);
const headers = computed(() => [
  {
    title: t("department_name"),
    align: "start",
    sortable: false,
    key: "departmentName",
  },
  { title: t("usage_period"), key: "usagePeriod", align: "center" },

  { title: t("consumption_fee"), align: "center", key: "consumptionFee" },
  {
    title: t("consumption_amount"),
    align: "center",
    key: "consumptionAmount",
  },
  { title: t("discount_status"), key: "isDiscountPrice" },
  { title: t("actions"), align: "center", key: "actions", sortable: false },
]);
const snackbar = ref(false);
const text = ref("My timeout is set to 2000.");
const color = ref("blue-gray");
const timeout = ref(2000);
const companyDetails = ref([]);
const selectedCompanyDetailForDelete = ref(null);
const selectedCompanyDetailForEdit = ref(null);
const route = useRoute(); // Get the current route
const companyId = route.params.id;
const getAllCompanyDetails = async () => {
  loading.value = true;
  // Get the companyId parameter
  try {
    const response = await axios.get(
      `/companydetail/getCompanyDetailByCompanyId/${companyId}`
    );
    console.log(response.data);
    companyDetails.value = response.data;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getAllCompanyDetails();
});

const deleteItem = async (item) => {
  // Store the company id when the delete button is clicked
  selectedCompanyDetailForDelete.value = item.companyDetailId;
  dialogDelete.value = true;
};

const deleteItemConfirm = async () => {
  loading.value = true;

  // Use the stored company id to delete the company
  try {
    const response = await axios.delete(
      `/companydetail/${selectedCompanyDetailForDelete.value}`
    );

    if (response.status === 200) {
      snackbar.value = true;
      text.value = "Company detail deleted successfully";
      getAllCompanyDetails();
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
  selectedCompanyDetailForEdit.value = item.companyDetailId;
  dialogEdit.value = true;
};

const openCreateDialog = () => {
  dialogCreate.value = true;
};
const goBack = () => {
  router.push("/dashboard");
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

  <div class="d-flex flex-column">
    <v-tooltip text="Back">
      <template v-slot:activator="{ props }">
        <v-btn
          class="ma-2"
          size="small"
          icon="mdi-arrow-left"
          @click="goBack()"
          prepend-icon="mdi-arrow-right"
          v-bind="props"
        ></v-btn>
      </template>
    </v-tooltip>

    <v-data-table
      :headers="headers"
      :items="companyDetails"
      :sort-by="[{ key: 'consumptionAmount', order: 'asc' }]"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ t("company_detail") }}</v-toolbar-title>

          <v-btn
            prepend-icon="mdi-plus"
            color="primary"
            dark
            class="mb-2"
            @click="openCreateDialog()"
          >
            {{ t("create_department") }}
          </v-btn>

          <CreateCompanyDetail
            :dialog="dialogCreate"
            @closeCreateDialog="closeCreateDialog"
            :companyId="companyId"
            @getAllCompanyDetails="getAllCompanyDetails"
          ></CreateCompanyDetail>
          <EditCompanyDetail
            :dialog="dialogEdit"
            :companyDetail="selectedCompanyDetailForEdit"
            :companyId="companyId"
            @closeEditDialog="closeEditDialog"
            @getAllCompanyDetails="getAllCompanyDetails"
          ></EditCompanyDetail>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">{{
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
      </template>

      <template v-slot:item.isDiscountPrice="{ item }">
        <v-chip
          :color="item.isDiscountPrice ? 'green' : 'red'"
          text-color="white"
          label
          small
          >{{
            item.isDiscountPrice ? t("discount") : t("not_discount")
          }}</v-chip
        >
      </template>

      <template v-slot:item.usagePeriod="{ item }">
        <span
          >{{ formatDate(new Date(item.usagePeriod.startTime)) }} -
          {{ formatDate(new Date(item.usagePeriod.endTime)) }}</span
        >
      </template>
    </v-data-table>
  </div>
</template>
