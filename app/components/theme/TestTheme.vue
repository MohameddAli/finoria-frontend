<template>
  <div class="test-theme">
    <h3>Theme Test</h3>
    <p>Current Theme: {{ currentTheme }}</p>
    <p>Is Dark: {{ isDark }}</p>
    
    <div class="theme-buttons">
      <v-btn color="primary" class="ma-2">Primary</v-btn>
      <v-btn color="secondary" class="ma-2">Secondary</v-btn>
      <v-btn color="success" class="ma-2">Success</v-btn>
      <v-btn color="error" class="ma-2">Error</v-btn>
    </div>
    
    <AppPagination 
      :page="1"
      :length="5"
      color="primary"
      class="ma-4"
    />
  </div>
</template>

<script setup lang="ts">
import { useAppTheme } from '~/composables/useAppTheme'

const { currentTheme, isDark } = useAppTheme()
</script>

<style scoped>
.test-theme {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 20px 0;
}
</style>