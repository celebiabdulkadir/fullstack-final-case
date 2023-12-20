<script setup>
import { ref, watch, computed, nextTick } from "vue";
import axios from "axios";
import { onMounted } from "vue";
import CreateCompany from "@/components/dashboard/CreateCompany.vue";
import EditCompany from "@/components/dashboard/EditCompany.vue";
import { formatDate, parseDate } from "@/utils/dateFormat";
import { useRouter } from "vue-router";
const router = useRouter();
const dialog = ref(false);
const dialogCreate = ref(false);
const dialogEdit = ref(false);
const dialogDelete = ref(false);
const headers = ref([
  {
    title: "Company Name",
    align: "start",
    sortable: false,
    key: "companyName",
  },
  { title: "Start Time", key: "subscriptionStart" },
  { title: "End Time", key: "subscriptionEnd" },
  { title: "Number of Employees", align: "center", key: "employerNumber" },
  { title: "Discount Status", key: "isFree" },
  { title: "Actions", align: "center", key: "actions", sortable: false },
]);
const snackbar = ref(false);
const text = ref("My timeout is set to 2000.");
const color = ref("blue-gray");
const timeout = ref(2000);
const companies = ref([]);
const selectedCompanyForDelete = ref(null);
const selectedCompanyForEdit = ref(null);

const getAllCompanies = async () => {
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
    :items="companies"
    :sort-by="[{ key: 'calories', order: 'asc' }]"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>COMPANIES</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn
          prepend-icon="mdi-plus"
          color="primary"
          dark
          class="mb-2"
          @click="openCreateDialog()"
        >
          Create New Company
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

      <v-tooltip text="Detail">
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
        >{{ item.isFree ? "Free" : "Not Free" }}</v-chip
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
