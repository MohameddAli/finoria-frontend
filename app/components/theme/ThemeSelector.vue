<template>
  <v-menu :location="location" :offset="offset" transition="fade-transition">
    <template #activator="{ props }">
      <v-btn v-bind="props" icon variant="text" size="small">
        <v-icon>mdi-palette</v-icon>
      </v-btn>
    </template>
    
    <v-list density="compact">
      <v-list-subheader>{{ $t('theme.selectTheme') }}</v-list-subheader>
      
      <v-list-item 
        v-for="theme in availableThemes" 
        :key="theme.value"
        :active="currentTheme === theme.value"
        @click="selectTheme(theme.value)"
      >
        <template #prepend>
          <div 
            class="theme-preview" 
            :class="`${theme.value}-theme-preview`"
          ></div>
        </template>
        <v-list-item-title>{{ theme.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { useAppTheme } from '~/composables/useAppTheme'

const props = withDefaults(defineProps<{
  location?: 'bottom end' | 'bottom start' | 'top end' | 'top start'
  offset?: [number, number]
}>(), {
  location: 'bottom end',
  offset: () => [0, 8]
})

const { currentTheme, setTheme } = useAppTheme()

const availableThemes = computed(() => [
  { name: 'Gold', value: 'gold' },
  { name: 'Blue', value: 'blue' },
  { name: 'Red', value: 'red' }
])

const selectTheme = (theme: string) => setTheme(theme as 'gold' | 'blue' | 'red')
</script>

<style scoped>
.theme-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
}

.gold-theme-preview {
  background: linear-gradient(45deg, #B8860B, #DAA520);
}

.blue-theme-preview {
  background: linear-gradient(45deg, #1E88E5, #64B5F6);
}

.red-theme-preview {
  background: linear-gradient(45deg, #C62828, #E53935);
}
</style>