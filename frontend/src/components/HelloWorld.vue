<script setup>
import { useLocale } from "vuetify";
const { current, t } = useLocale();
</script>
<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-img height="300" src="/logo.png" />

      <div class="text-body-2 font-weight-light mb-n1">{{ t("welcome") }}</div>

      <h1 class="text-lg-h2 text-md-h3 text-h4 font-weight-bold">
        {{ t("company_management_system") }}
      </h1>

      <div class="py-14" />
    </v-responsive>
  </v-container>
</template>
