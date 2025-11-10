<template>
  <v-dialog
    :model-value="modelValue"
    :max-width="maxWidth"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon v-if="icon" :icon="icon" class="me-2" :color="iconColor" />
        <span>{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <slot>
          {{ message }}
        </slot>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          :variant="cancelVariant"
          :color="cancelColor"
          @click="onCancelClick"
        >
          {{ cancelText || t('common.cancel') }}
        </v-btn>
        <v-btn
          :variant="confirmVariant"
          :color="confirmColor"
          @click="onConfirmClick"
        >
          {{ confirmText || t('common.confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  message?: string
  maxWidth?: string | number
  icon?: string
  iconColor?: string
  confirmText?: string
  confirmColor?: string
  confirmVariant?: 'text' | 'flat' | 'outlined' | 'tonal' | 'elevated'
  cancelText?: string
  cancelColor?: string
  cancelVariant?: 'text' | 'flat' | 'outlined' | 'tonal' | 'elevated'
}

withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  message: '',
  maxWidth: 420,
  icon: undefined,
  iconColor: undefined,
  confirmText: undefined,
  confirmColor: 'error',
  confirmVariant: 'flat',
  cancelText: undefined,
  cancelColor: undefined,
  cancelVariant: 'outlined',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const { t } = useI18n()

const onCancelClick = () => {
  emit('cancel')
  emit('update:modelValue', false)
}

const onConfirmClick = () => {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<style scoped>
/* Keep styles minimal and theme-friendly */
</style>


