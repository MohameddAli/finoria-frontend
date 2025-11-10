<template>
  <v-dialog
    :model-value="modelValue"
    :max-width="maxWidth"
    :persistent="persistent"
    :scrollable="scrollable"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <v-card :elevation="elevation" class="details-dialog">
      <!-- Header -->
      <v-card-title
        :class="['details-header pa-4', headerClass]"
        :style="headerStyle"
      >
        <div class="d-flex align-center justify-space-between w-100">
          <div class="d-flex align-center flex-grow-1">
            <v-avatar
              v-if="icon || $slots.icon"
              :color="iconBgColor"
              :size="iconSize"
              class="mr-3"
            >
              <slot name="icon">
                <v-icon :color="iconColor" :size="iconSize - 16">
                  {{ icon }}
                </v-icon>
              </slot>
            </v-avatar>
            <div class="flex-grow-1">
              <div :class="['text-h6', titleClass]">
                <slot name="title">{{ title }}</slot>
              </div>
              <div
                v-if="subtitle || $slots.subtitle"
                :class="['text-caption mt-1', subtitleClass]"
              >
                <slot name="subtitle">{{ subtitle }}</slot>
              </div>
            </div>
          </div>

          <!-- Status Badge (optional) -->
          <slot name="badge" />

          <!-- Close Button -->
          <v-btn
            v-if="showCloseButton"
            icon
            variant="text"
            size="small"
            :color="closeButtonColor"
            class="ml-2"
            @click="onClose"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-divider />

      <!-- Content -->
      <v-card-text :class="['pa-6', contentClass]" :style="contentStyle">
        <slot />
      </v-card-text>

      <!-- Actions (optional) -->
      <template v-if="showActions || $slots.actions">
        <v-divider />
        <v-card-actions :class="['pa-4', actionsClass]">
          <slot name="actions">
            <v-spacer />
            <v-btn
              :variant="closeVariant"
              :color="closeColor"
              :size="buttonSize"
              @click="onClose"
            >
              {{ closeText || t("common.close") }}
            </v-btn>
          </slot>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
/**
 * AppDetailsDialog - Reusable Details/View Dialog Component
 *
 * Professional dialog component for displaying read-only information
 * Features:
 * - Customizable header with icon, title, subtitle
 * - Optional status badge
 * - Scrollable content area
 * - Flexible slot-based content
 * - Optional action buttons
 * - RTL support
 * - Accessible
 *
 * @example
 * <AppDetailsDialog
 *   v-model="isOpen"
 *   title="Currency Details"
 *   icon="mdi-currency-usd"
 * >
 *   <template #badge>
 *     <v-chip color="success">Active</v-chip>
 *   </template>
 *
 *   <!-- Your content here -->
 *
 * </AppDetailsDialog>
 */

interface Props {
  modelValue: boolean;
  title?: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  iconSize?: number;
  maxWidth?: string | number;
  elevation?: number;
  persistent?: boolean;
  scrollable?: boolean;
  showCloseButton?: boolean;
  closeButtonColor?: string;
  showActions?: boolean;
  closeText?: string;
  closeColor?: string;
  closeVariant?: "text" | "flat" | "outlined" | "tonal" | "elevated";
  buttonSize?: "x-small" | "small" | "default" | "large" | "x-large";
  headerClass?: string;
  headerStyle?: string;
  titleClass?: string;
  subtitleClass?: string;
  contentClass?: string;
  contentStyle?: string;
  actionsClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 800,
  elevation: 8,
  persistent: false,
  scrollable: true,
  showCloseButton: true,
  closeButtonColor: "grey-darken-1",
  showActions: true,
  closeColor: "grey-darken-1",
  closeVariant: "outlined",
  buttonSize: "default",
  iconColor: "primary",
  iconBgColor: "white",
  iconSize: 48,
  headerClass: "bg-gradient",
  titleClass: "text-white font-weight-bold",
  subtitleClass: "text-white",
  contentClass: "",
  actionsClass: "bg-surface-variant",
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();

const { t } = useI18n();

function onClose() {
  emit("update:modelValue", false);
  emit("close");
}
</script>

<style scoped>
.details-dialog {
  border-radius: 12px;
  overflow: hidden;
}

.details-header {
  position: relative;
}

.bg-gradient {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgba(var(--v-theme-primary), 0.85) 100%
  );
}

/* Scrollable content area */
::deep(.v-card-text) {
  max-height: 70vh;
  overflow-y: auto;
}

/* Custom scrollbar */
::deep(.v-card-text::-webkit-scrollbar) {
  width: 8px;
}

::deep(.v-card-text::-webkit-scrollbar-track) {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 4px;
}

::deep(.v-card-text::-webkit-scrollbar-thumb) {
  background: rgba(var(--v-theme-primary), 0.4);
  border-radius: 4px;
}

::deep(.v-card-text::-webkit-scrollbar-thumb:hover) {
  background: rgba(var(--v-theme-primary), 0.6);
}

/* Responsive */
@media (max-width: 600px) {
  .details-header {
    padding: 16px !important;
  }

  ::deep(.v-card-text) {
    padding: 16px !important;
    max-height: 60vh;
  }
}
</style>
