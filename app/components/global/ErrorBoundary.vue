<!-- ErrorBoundary.vue - Nuxt 4 + Vue 3 Composition API -->
<template>
  <div v-if="hasError" class="error-boundary">
    <v-alert
      type="error"
      prominent
      border="start"
      variant="tonal"
      closable
      class="ma-4"
      @click:close="resetError"
    >
      <template #title>
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-alert-circle</v-icon>
          <span class="text-h6">{{
            $t("errors.boundary.title") || "حدث خطأ"
          }}</span>
        </div>
      </template>

      <div class="text-body-1 mb-3">
        {{ $t("errors.boundary.message") || "عذراً، حدث خطأ غير متوقع." }}
      </div>

      <div v-if="errorDetails && isDev" class="error-details mt-3">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon class="mr-2">mdi-bug</v-icon>
              {{ $t("errors.boundary.details") || "تفاصيل الخطأ" }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <pre class="error-code"><code>{{ errorDetails }}</code></pre>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>

      <template #append>
        <v-btn
          color="error"
          variant="outlined"
          @click="resetError"
          class="mr-2"
        >
          {{ $t("common.retry") || "إعادة المحاولة" }}
        </v-btn>
        <v-btn color="primary" variant="text" @click="goHome">
          {{ $t("common.home") || "الصفحة الرئيسية" }}
        </v-btn>
      </template>
    </v-alert>
  </div>

  <slot v-else />
</template>

<script setup lang="ts">
/**
 * ErrorBoundary Component
 * Catches and displays errors in child components
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */

import { useToast } from "~/composables/useToast";

// ═══════════════════════════════════════════════
// Props & Emits
// ═══════════════════════════════════════════════
interface Props {
  /** Show toast notification on error */
  showToast?: boolean;
  /** Custom error message */
  fallbackMessage?: string;
  /** Log errors to console */
  logErrors?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showToast: true,
  fallbackMessage: "",
  logErrors: true,
});

const emit = defineEmits<{
  error: [error: Error];
  reset: [];
}>();

// ═══════════════════════════════════════════════
// Composables
// ═══════════════════════════════════════════════
const { t } = useI18n();
const router = useRouter();
const toast = useToast();

// ═══════════════════════════════════════════════
// State
// ═══════════════════════════════════════════════
const hasError = ref(false);
const errorDetails = ref<string>("");
const isDev = ref(import.meta.dev);

// ═══════════════════════════════════════════════
// Error Handler
// ═══════════════════════════════════════════════
onErrorCaptured((error: Error, instance, info) => {
  hasError.value = true;
  errorDetails.value = `${error.message}\n\nStack:\n${error.stack}\n\nInfo: ${info}`;

  // Log to console if enabled
  if (props.logErrors) {
    console.error("ErrorBoundary caught:", {
      error,
      component: instance?.$options?.name || "Unknown",
      info,
    });
  }

  // Show toast notification
  if (props.showToast) {
    toast.error(
      props.fallbackMessage ||
        t("errors.boundary.notification") ||
        "حدث خطأ في تحميل المكون"
    );
  }

  // Emit error event
  emit("error", error);

  // Prevent error from propagating further
  return false;
});

// ═══════════════════════════════════════════════
// Methods
// ═══════════════════════════════════════════════
function resetError() {
  hasError.value = false;
  errorDetails.value = "";
  emit("reset");
}

function goHome() {
  hasError.value = false;
  router.push("/");
}

// ═══════════════════════════════════════════════
// Lifecycle
// ═══════════════════════════════════════════════
onBeforeUnmount(() => {
  resetError();
});
</script>

<style scoped>
.error-boundary {
  width: 100%;
  min-height: 200px;
}

.error-details {
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 8px;
  padding: 12px;
}

.error-code {
  background: rgba(var(--v-theme-on-surface), 0.05);
  border-radius: 4px;
  padding: 12px;
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-x: auto;
  color: rgb(var(--v-theme-error));
  font-family: "Courier New", monospace;
  margin: 0;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
