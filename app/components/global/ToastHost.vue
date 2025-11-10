<script setup lang="ts">
/**
 * 🍞 Toast Host Component - Global Toast Display
 * ────────────────────────────────────────────────────────────────────────────
 *
 * مكون عرض Toast مع دعم كامل لـ:
 * - Multi-line messages
 * - RTL/LTR automatic detection
 * - Vuetify 3 theming
 * - Smooth animations
 * - Icons for each variant
 * - Accessibility features
 *
 * @example
 * // Add to app.vue or layout:
 * <ToastHost />
 *
 * // Then anywhere in your app:
 * const toast = useToast()
 * toast.success('تم الحفظ بنجاح')
 */

// Get toast state directly (writable refs, not readonly)
const toastState = useToastState();
const { locale } = useI18n();

// Map variant to Vuetify color
const snackbarColor = computed(() => {
  const colorMap: Record<typeof toastState.variant.value, string> = {
    success: "success",
    error: "error",
    warning: "warning",
    info: "info",
  };
  return colorMap[toastState.variant.value] ?? "info";
});

// Text direction based on locale
const textDirection = computed(() => (locale.value === "ar" ? "rtl" : "ltr"));
</script>

<template>
  <v-snackbar
    v-model="toastState.visible.value"
    :timeout="toastState.timeout.value"
    :color="snackbarColor"
    location="top right"
    elevation="6"
    rounded="lg"
    :dir="textDirection"
    class="toast-host"
  >
    <!-- Multi-line content with icon -->
    <div class="toast-content">
      <!-- Icon -->
      <v-icon
        v-if="toastState.icon.value"
        :icon="toastState.icon.value"
        class="toast-icon"
        size="20"
      />

      <!-- Message Lines -->
      <div class="toast-lines">
        <div
          v-for="(line, idx) in toastState.lines.value"
          :key="idx"
          class="toast-line"
        >
          {{ line }}
        </div>
      </div>
    </div>

    <!-- Close button -->
    <template #actions>
      <v-btn
        color="white"
        variant="text"
        density="compact"
        icon="mdi-close"
        @click="toastState.visible.value = false"
      />
    </template>
  </v-snackbar>
</template>

<style scoped>
.toast-host {
  z-index: 9999;
}

.toast-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.toast-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.toast-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toast-line {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
  word-break: break-word;
}

/* RTL Support */
:deep(.v-snackbar__content) {
  direction: inherit;
}

/* Custom styling for different types */
:deep(.v-snackbar--variant-elevated.bg-success) {
  background: rgb(var(--v-theme-success)) !important;
}

:deep(.v-snackbar--variant-elevated.bg-error) {
  background: rgb(var(--v-theme-error)) !important;
}

:deep(.v-snackbar--variant-elevated.bg-warning) {
  background: rgb(var(--v-theme-warning)) !important;
}

:deep(.v-snackbar--variant-elevated.bg-info) {
  background: rgb(var(--v-theme-info)) !important;
}

/* Responsive */
@media (max-width: 600px) {
  .toast-line {
    font-size: 0.8125rem;
  }
}

/* Animations */
.toast-line {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .toast-content {
    border: 2px solid currentColor;
    padding: 4px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .toast-line {
    animation: none;
  }
}
</style>
