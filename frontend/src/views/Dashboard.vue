<script setup>
import { ref, watch, computed, nextTick } from "vue";
import axios from "axios";
import { onMounted } from "vue";
const dialog = ref(false);
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
  { title: "Number of Employees", key: "employerNumber" },
  { title: "Discount Status", key: "isFree" },
  { title: "Actions", key: "actions", sortable: false },
]);

const desserts = ref([]);
const editedIndex = ref(-1);
const editedItem = ref({
  companyId: "223e9b87-85f4-45ec-8eb6-efd6bd2fcaff",
  companyName: "Alstom",
  subscriptionStart: "2023-12-12T13:07:34.096Z",
  subscriptionEnd: "2023-12-12T13:07:34.096Z",
  employerNumber: 12,
  isFree: true,
});
const defaultItem = ref({
  companyId: "223e9b87-85f4-45ec-8eb6-efd6bd2fcaff",
  companyName: "Alstom",
  subscriptionStart: "2023-12-12T13:07:34.096Z",
  subscriptionEnd: "2023-12-12T13:07:34.096Z",
  employerNumber: 12,
  isFree: true,
});
const formTitle = computed(() => {
  return editedIndex.value === -1 ? "New Company" : "Edit Company";
});

const getAllCompanies = async () => {
  try {
    const response = await axios.get("http://localhost:3000/company/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    console.log(response.data);
    desserts.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const getCompanyById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3000/company/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getAllCompanies();
});

watch(dialog, (val) => {
  if (!val) close();
});

watch(dialogDelete, (val) => {
  if (!val) closeDelete();
});

const editItem = async (item) => {
  editedIndex.value = desserts.value.indexOf(item);

  const company = await getCompanyById(item.companyId);
  editedItem.value = Object.assign({}, company);
  dialog.value = true;
};

const deleteItem = (item) => {
  editedIndex.value = desserts.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogDelete.value = true;
};

const deleteItemConfirm = () => {
  desserts.value.splice(editedIndex.value, 1);
  closeDelete();
};

const close = () => {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  });
};

const closeDelete = () => {
  dialogDelete.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  });
};

const save = () => {
  if (editedIndex.value > -1) {
    Object.assign(desserts.value[editedIndex.value], editedItem.value);
  } else {
    desserts.value.push(editedItem.value);
  }
  close();
};
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    :sort-by="[{ key: 'calories', order: 'asc' }]"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>My CRUD</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" dark class="mb-2" v-bind="props">
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.companyName"
                      label="Company Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.calories"
                      label="Calories"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.employerNumber"
                      label="Fat (g)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.subscriptionEnd"
                      label="Carbs (g)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.protein"
                      label="Protein (g)"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
    <template v-slot:item.actions="{ item }">
      <v-icon size="small" class="me-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>
