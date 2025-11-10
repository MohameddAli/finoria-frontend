<template>
  <v-dialog v-model="isOpen" :max-width="maxWidth" persistent>
    <v-card class="rounded-lg">
      <!-- Header with gradient background -->
      <v-card-title class="pa-6 bg-gradient-primary">
        <div class="d-flex align-center">
          <v-avatar color="white" size="48" class="me-3">
            <v-icon color="primary" size="24">mdi-plus-circle</v-icon>
          </v-avatar>
          <span class="text-h5 font-weight-bold text-white">
            {{ title }}
          </span>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Form Content Slot -->
      <v-card-text class="pa-6">
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <slot name="form" :form="formRef" :loading="loading"></slot>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <!-- Actions -->
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="handleCancel" :disabled="loading">
          {{ cancelText }}
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="handleSubmit"
          :loading="loading"
        >
          {{ submitText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
/**
 * AddDialog - مكون عام لنافذة الإضافة
 *
 * @example
 * <AddDialog
 *   v-model="dialogOpen"
 *   title="إضافة عملة جديدة"
 *   @submit="handleSubmit"
 *   @cancel="handleCancel"
 * >
 *   <template #form>
 *     <v-text-field v-model="form.name" label="الاسم" />
 *     <v-text-field v-model="form.code" label="الرمز" />
 *   </template>
 * </AddDialog>
 */

// ═══════════════════════════════════════════════
// Props & Emits
// ═══════════════════════════════════════════════
interface Props {
  modelValue: boolean;
  title?: string;
  maxWidth?: string | number;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "إضافة جديد",
  maxWidth: 700,
  loading: false,
  submitText: "حفظ",
  cancelText: "إلغاء",
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  submit: [];
  cancel: [];
}>();

// ═══════════════════════════════════════════════
// Composables
// ═══════════════════════════════════════════════
const { t } = useI18n();

// ═══════════════════════════════════════════════
// Local State
// ═══════════════════════════════════════════════
const formRef = ref();

// ═══════════════════════════════════════════════
// Computed
// ═══════════════════════════════════════════════
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// ═══════════════════════════════════════════════
// Methods
// ═══════════════════════════════════════════════
async function handleSubmit() {
  // Validate form if form ref exists
  if (formRef.value) {
    const { valid } = await formRef.value.validate();
    if (!valid) return;
  }

  emit("submit");
}

function handleCancel() {
  emit("cancel");
  isOpen.value = false;
}
</script>

<style scoped>
/* Dialog Header Gradient */
.bg-gradient-primary {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-primary-darken-1))
  ) !important;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
}

/* Card Enhancements */
.v-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Avatar Animation */
.v-avatar {
  transition: all 0.3s ease;
}

/* Button Enhancements */
.v-btn {
  transition: all 0.2s ease;
  font-weight: 600;
}

.v-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Form Field Enhancements */
::deep(.v-text-field input),
::deep(.v-textarea textarea),
::deep(.v-select) {
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 600px) {
  ::deep(.v-card-title) {
    font-size: 1.1rem;
  }

  .v-avatar {
    width: 40px !important;
    height: 40px !important;
  }
}
</style>
