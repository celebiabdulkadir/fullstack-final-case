<script setup>
import { ref, computed } from "vue";
import axios from "axios";
</script>

<template>
  <div class="spinner-overlay">
    <v-progress-circular
      :size="50"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<style scoped>
.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}

.v-progress-circular {
  margin: 1rem;
}
</style>
