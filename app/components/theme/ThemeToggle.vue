<template>
  <div class="theme-toggle-container">
    <v-btn
      icon
      variant="text"
      size="small"
      class="theme-toggle-btn"
      @click="toggleMode"
    >
      <v-icon v-if="isDark">mdi-white-balance-sunny</v-icon>
      <v-icon v-else>mdi-weather-night</v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useAppTheme } from '~/composables/useAppTheme'

const { isDark, toggleMode } = useAppTheme()
</script>

<style scoped>
.theme-toggle-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle-btn {
  transition: transform 0.2s ease;
}

.theme-toggle-btn:hover {
  transform: scale(1.1);
}
</style>