<script setup>
import { ref, watch, computed, nextTick } from "vue";
import axios from "axios";
import { onMounted } from "vue";
import CreateCompanyDetail from "@/components/companyDetail/CreateCompanyDetail.vue";
import EditCompanyDetail from "@/components/companyDetail/EditCompanyDetail.vue";
import { formatDate, parseDate } from "@/utils/dateFormat";
import { useRoute } from "vue-router";

const dialog = ref(false);
const dialogCreate = ref(false);
const dialogEdit = ref(false);
const dialogDelete = ref(false);
const headers = ref([
  {
    title: "Department Name",
    align: "start",
    sortable: false,
    key: "departmentName",
  },
  { title: "Usage Time (H)", key: "usageTime" },

  { title: "Consumption Fee (TRY)", align: "center", key: "consumptionFee" },
  {
    title: "Consumption Amount(kWh)",
    align: "center",
    key: "consumptionAmount",
  },
  { title: "Discount Status", key: "isDiscountPrice" },
  { title: "Actions", align: "center", key: "actions", sortable: false },
]);
const snackbar = ref(false);
const text = ref("My timeout is set to 2000.");
const color = ref("blue-gray");
const timeout = ref(2000);
const companyDetails = ref([]);
const selectedCompanyForDelete = ref(null);
const selectedCompanyForEdit = ref(null);

const getAllCompanyDetails = async () => {
  debugger;
  const route = useRoute(); // Get the current route
  const companyId = route.params.id; // Get the companyId parameter
  try {
    const response = await axios.get(
      `/companydetail/getCompanyDetailByCompanyId/${companyId}`
    );
    console.log(response.data);
    companyDetails.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getAllCompanyDetails();
});

const deleteItem = async (item) => {
  // Store the company id when the delete button is clicked
  selectedCompanyForDelete.value = item.companyDetailId;
  dialogDelete.value = true;
};

const deleteItemConfirm = async () => {
  // Use the stored company id to delete the company
  try {
    const response = await axios.delete(
      `/companydetail/${selectedCompanyForDelete.value}`
    );

    if (response.status === 200) {
      snackbar.value = true;
      text.value = "Company detail deleted successfully";
      getAllCompanyDetails();
      closeDelete();
    }
  } catch (error) {
    console.log(error);
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
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-data-table
    :headers="headers"
    :items="companyDetails"
    :sort-by="[{ key: 'calories', order: 'asc' }]"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>COMPANY DETAIL</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn
          prepend-icon="mdi-plus"
          color="primary"
          dark
          class="mb-2"
          @click="openCreateDialog()"
        >
          Create New Department
        </v-btn>

        <CreateCompanyDetail
          :dialog="dialogCreate"
          @closeCreateDialog="closeCreateDialog"
          @getAllCompanyDetails="getAllCompanyDetails"
        ></CreateCompanyDetail>
        <EditCompanyDetail
          :dialog="dialogEdit"
          :company="selectedCompanyForEdit"
          @closeEditDialog="closeEditDialog"
          @getAllCompanyDetails="getAllCompanyDetails"
        ></EditCompanyDetail>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="deleteItemConfirm"
                >OK</v-btn
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
        >{{ item.isDiscountPrice ? "Discount" : "Not Discount" }}</v-chip
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
