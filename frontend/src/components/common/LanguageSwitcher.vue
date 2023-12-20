<script setup>
import { i18n } from "@/main.js";
import { useLocale } from "vuetify";
import { ref } from "vue";
const { current, t } = useLocale();
const languageItems = ref([
  {
    title: "Tr",
    langCode: "tr",
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJmbGFnLWljb25zLXRyIiB2aWV3Qm94PSIwIDAgNjQwIDQ4MCI+CiAgPGcgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxwYXRoIGZpbGw9IiNlMzBhMTciIGQ9Ik0wIDBoNjQwdjQ4MEgweiIvPgogICAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTQwNyAyNDcuNWMwIDY2LjItNTQuNiAxMTkuOS0xMjIgMTE5LjlzLTEyMi01My43LTEyMi0xMjAgNTQuNi0xMTkuOCAxMjItMTE5LjggMTIyIDUzLjcgMTIyIDExOS45eiIvPgogICAgPHBhdGggZmlsbD0iI2UzMGExNyIgZD0iTTQxMyAyNDcuNWMwIDUzLTQzLjYgOTUuOS05Ny41IDk1LjlzLTk3LjYtNDMtOTcuNi05NiA0My43LTk1LjggOTcuNi05NS44IDk3LjYgNDIuOSA5Ny42IDk1Ljl6Ii8+CiAgICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJtNDMwLjcgMTkxLjUtMSA0NC4zLTQxLjMgMTEuMiA0MC44IDE0LjUtMSA0MC43IDI2LjUtMzEuOCA0MC4yIDE0LTIzLjItMzQuMSAyOC4zLTMzLjktNDMuNSAxMi0yNS44LTM3eiIvPgogIDwvZz4KPC9zdmc+Cg==",
  },
  {
    title: "En",
    langCode: "en",
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJmbGFnLWljb25zLWdiIiB2aWV3Qm94PSIwIDAgNjQwIDQ4MCI+CiAgPHBhdGggZmlsbD0iIzAxMjE2OSIgZD0iTTAgMGg2NDB2NDgwSDB6Ii8+CiAgPHBhdGggZmlsbD0iI0ZGRiIgZD0ibTc1IDAgMjQ0IDE4MUw1NjIgMGg3OHY2Mkw0MDAgMjQxbDI0MCAxNzh2NjFoLTgwTDMyMCAzMDEgODEgNDgwSDB2LTYwbDIzOS0xNzhMMCA2NFYwaDc1eiIvPgogIDxwYXRoIGZpbGw9IiNDODEwMkUiIGQ9Im00MjQgMjgxIDIxNiAxNTl2NDBMMzY5IDI4MWg1NXptLTE4NCAyMCA2IDM1TDU0IDQ4MEgwbDI0MC0xNzl6TTY0MCAwdjNMMzkxIDE5MWwyLTQ0TDU5MCAwaDUwek0wIDBsMjM5IDE3NmgtNjBMMCA0MlYweiIvPgogIDxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0yNDEgMHY0ODBoMTYwVjBIMjQxek0wIDE2MHYxNjBoNjQwVjE2MEgweiIvPgogIDxwYXRoIGZpbGw9IiNDODEwMkUiIGQ9Ik0wIDE5M3Y5Nmg2NDB2LTk2SDB6TTI3MyAwdjQ4MGg5NlYwaC05NnoiLz4KPC9zdmc+Cg==",
  },
]);
const selectedLanguage = ref(
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJmbGFnLWljb25zLXRyIiB2aWV3Qm94PSIwIDAgNjQwIDQ4MCI+CiAgPGcgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxwYXRoIGZpbGw9IiNlMzBhMTciIGQ9Ik0wIDBoNjQwdjQ4MEgweiIvPgogICAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTQwNyAyNDcuNWMwIDY2LjItNTQuNiAxMTkuOS0xMjIgMTE5LjlzLTEyMi01My43LTEyMi0xMjAgNTQuNi0xMTkuOCAxMjItMTE5LjggMTIyIDUzLjcgMTIyIDExOS45eiIvPgogICAgPHBhdGggZmlsbD0iI2UzMGExNyIgZD0iTTQxMyAyNDcuNWMwIDUzLTQzLjYgOTUuOS05Ny41IDk1LjlzLTk3LjYtNDMtOTcuNi05NiA0My43LTk1LjggOTcuNi05NS44IDk3LjYgNDIuOSA5Ny42IDk1Ljl6Ii8+CiAgICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJtNDMwLjcgMTkxLjUtMSA0NC4zLTQxLjMgMTEuMiA0MC44IDE0LjUtMSA0MC43IDI2LjUtMzEuOCA0MC4yIDE0LTIzLjItMzQuMSAyOC4zLTMzLjktNDMuNSAxMi0yNS44LTM3eiIvPgogIDwvZz4KPC9zdmc+Cg=="
);
const changeLanguage = (item) => {
  current.value = item.langCode;
  selectedLanguage.value = item.icon;
  i18n.locale = item.langCode;
};
</script>

<template>
  <v-menu open-on-click>
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        append-icon="mdi-chevron-down"
        class="d-flex justify-space-between"
      >
        <v-img
          :width="20"
          aspect-ratio="16/9"
          cover
          :src="selectedLanguage"
        ></v-img>
      </v-btn>
    </template>

    <v-list>
      <v-list-item v-for="(item, index) in languageItems" :key="index">
        <v-btn
          @click="changeLanguage(item)"
          class="flex justify-start align-center w-100"
        >
          <v-img :width="20" aspect-ratio="16/9" cover :src="item.icon"></v-img
          ><span class="ml-2">{{ item.title }}</span>
          <span v-if="item.icon === selectedLanguage">
            <v-icon color="blue" icon="mdi-check"></v-icon>
          </span>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
