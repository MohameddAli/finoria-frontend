<template>
  <div class="settings-page">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-4">{{ $t('navigation.settings') }}</h1>
          
          <v-card>
            <v-card-text>
              <p class="text-body-1">{{ $t('common.comingSoon') }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  title: "navigation.settings",
});
</script>
