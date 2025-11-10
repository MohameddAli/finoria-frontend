<template>
  <div class="filter-panel">
    <!-- Filter toggle button - only show when collapsible is true -->
    <div v-if="collapsible" class="d-flex align-center mb-4">
      <v-btn
        :variant="buttonVariant"
        :color="buttonColor"
        :aria-label="toggleButtonLabel"
        :class="['filter-toggle-btn', { 'rtl-btn': isRTL }]"
        @click="toggleFilters"
      >
        <v-icon v-if="!isRTL" start>{{ filterIcon }}</v-icon>
        <v-icon v-else>{{ filterIcon }}</v-icon>
        {{ toggleButtonLabel }}
      </v-btn>

      <!-- Optional: Show active filters count -->
      <v-chip
        v-if="showActiveCount && activeFiltersCount > 0"
        class="ms-2"
        size="small"
        :color="chipColor"
      >
        {{ activeFiltersCount }} {{ activeFiltersLabel }}
      </v-chip>
    </div>

    <!-- Expandable filters section (when collapsible) or always visible (when not collapsible) -->
    <v-expand-transition v-if="collapsible">
      <div v-show="isOpen">
        <v-form
          ref="formRef"
          :class="collapsible ? 'px-4' : ''"
          @submit.prevent="handleSubmit"
        >
          <v-row align="center">
            <!-- Dynamic filter fields -->
            <v-col
              v-for="(field, index) in fields"
              :key="index"
              :cols="field.cols || 12"
              :sm="field.sm || 6"
              :md="field.md || 4"
              :lg="field.lg || 3"
            >
              <!-- Text Field -->
              <v-text-field
                v-if="
                  field.type === 'text' ||
                  field.type === 'number' ||
                  field.type === 'email'
                "
                v-model="filterValues[field.name]"
                :label="field.label"
                :type="field.type"
                :placeholder="field.placeholder"
                :clearable="field.clearable !== false"
                :disabled="field.disabled"
                :counter="field.counter"
                :maxlength="field.maxlength"
                :hint="field.hint"
                :persistent-hint="field.persistentHint"
                :prepend-inner-icon="field.prependInnerIcon"
                :rules="field.rules || []"
                variant="outlined"
                density="comfortable"
              />

              <!-- Select Field -->
              <v-select
                v-else-if="field.type === 'select'"
                v-model="filterValues[field.name]"
                :label="field.label"
                :items="field.items || []"
                :item-title="field.itemTitle || 'name'"
                :item-value="field.itemValue || 'id'"
                :multiple="field.multiple"
                :clearable="field.clearable !== false"
                :disabled="field.disabled"
                :hint="field.hint"
                :persistent-hint="field.persistentHint"
                :prepend-inner-icon="field.prependInnerIcon"
                :rules="field.rules || []"
                variant="outlined"
                density="comfortable"
              />

              <!-- Autocomplete Field -->
              <v-autocomplete
                v-else-if="field.type === 'autocomplete'"
                v-model="filterValues[field.name]"
                :label="field.label"
                :items="field.items || []"
                :multiple="field.multiple"
                :clearable="field.clearable !== false"
                :disabled="field.disabled"
                :hint="field.hint"
                :persistent-hint="field.persistentHint"
                :prepend-inner-icon="field.prependInnerIcon"
                :rules="field.rules || []"
                variant="outlined"
                density="comfortable"
              />

              <!-- Date Picker Field -->
              <v-text-field
                v-else-if="field.type === 'date'"
                v-model="filterValues[field.name]"
                :label="field.label"
                type="date"
                :clearable="field.clearable !== false"
                :disabled="field.disabled"
                :hint="field.hint"
                :persistent-hint="field.persistentHint"
                :prepend-inner-icon="field.prependInnerIcon"
                :rules="field.rules || []"
                variant="outlined"
                density="comfortable"
              />

              <!-- Checkbox Field -->
              <v-checkbox
                v-else-if="field.type === 'checkbox'"
                v-model="filterValues[field.name]"
                :label="field.label"
                :disabled="field.disabled"
                :color="field.color || 'primary'"
                density="comfortable"
              />

              <!-- Switch Field -->
              <v-switch
                v-else-if="field.type === 'switch'"
                v-model="filterValues[field.name]"
                :label="field.label"
                :disabled="field.disabled"
                :color="field.color || 'primary'"
                density="comfortable"
              />
            </v-col>

            <!-- Action buttons column -->
            <v-col
              v-if="showSubmitButton"
              :cols="submitButtonCols || 12"
              :sm="submitButtonSm || 3"
              :md="submitButtonMd || 2"
              :lg="submitButtonLg || 2"
              class="mb-2"
            >
              <div class="d-flex gap-2">
                <!-- Search/Submit button -->
                <v-btn
                  :color="submitButtonColor"
                  type="submit"
                  :variant="submitButtonVariant"
                  :aria-label="submitButtonLabel"
                  :loading="loading"
                  :disabled="!isValid"
                  size="large"
                >
                  <v-icon v-if="submitButtonIcon" start>{{
                    submitButtonIcon
                  }}</v-icon>
                  <span v-if="submitButtonText">{{ submitButtonText }}</span>
                  <span v-else>{{ submitButtonLabel }}</span>
                </v-btn>

                <!-- Clear/Reset button -->
                <v-btn
                  v-if="showClearButton"
                  :color="clearButtonColor"
                  :variant="clearButtonVariant"
                  :aria-label="clearButtonLabel"
                  size="large"
                  @click="clearFilters"
                >
                  <v-icon v-if="clearButtonIcon" start>{{
                    clearButtonIcon
                  }}</v-icon>
                  <span v-if="clearButtonText">{{ clearButtonText }}</span>
                  <span v-else>{{ clearButtonLabel }}</span>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-expand-transition>

    <!-- Non-collapsible mode - always visible -->
    <div v-else>
      <v-form ref="formRef" @submit.prevent="handleSubmit">
        <v-row align="center">
          <!-- Dynamic filter fields -->
          <v-col
            v-for="(field, index) in fields"
            :key="index"
            :cols="field.cols || 12"
            :sm="field.sm || 6"
            :md="field.md || 4"
            :lg="field.lg || 3"
          >
            <!-- Text Field -->
            <v-text-field
              v-if="
                field.type === 'text' ||
                field.type === 'number' ||
                field.type === 'email'
              "
              v-model="filterValues[field.name]"
              :label="field.label"
              :type="field.type"
              :placeholder="field.placeholder"
              :clearable="field.clearable !== false"
              :disabled="field.disabled"
              :counter="field.counter"
              :maxlength="field.maxlength"
              :hint="field.hint"
              :persistent-hint="field.persistentHint"
              :prepend-inner-icon="field.prependInnerIcon"
              :rules="field.rules || []"
              :min="field.min"
              :max="field.max"
              :step="field.step"
              variant="outlined"
              density="comfortable"
            />

            <!-- Select Field -->
            <v-select
              v-else-if="field.type === 'select'"
              v-model="filterValues[field.name]"
              :label="field.label"
              :items="field.items || []"
              :item-title="field.itemTitle || 'name'"
              :item-value="field.itemValue || 'id'"
              :multiple="field.multiple"
              :clearable="field.clearable !== false"
              :disabled="field.disabled"
              :hint="field.hint"
              :persistent-hint="field.persistentHint"
              :prepend-inner-icon="field.prependInnerIcon"
              :rules="field.rules || []"
              variant="outlined"
              density="comfortable"
            />

            <!-- Autocomplete Field -->
            <v-autocomplete
              v-else-if="field.type === 'autocomplete'"
              v-model="filterValues[field.name]"
              :label="field.label"
              :items="field.items || []"
              :multiple="field.multiple"
              :clearable="field.clearable !== false"
              :disabled="field.disabled"
              :hint="field.hint"
              :persistent-hint="field.persistentHint"
              :prepend-inner-icon="field.prependInnerIcon"
              :rules="field.rules || []"
              variant="outlined"
              density="comfortable"
            />

            <!-- Date Picker Field -->
            <v-text-field
              v-else-if="field.type === 'date'"
              v-model="filterValues[field.name]"
              :label="field.label"
              type="date"
              :clearable="field.clearable !== false"
              :disabled="field.disabled"
              :hint="field.hint"
              :persistent-hint="field.persistentHint"
              :prepend-inner-icon="field.prependInnerIcon"
              :rules="field.rules || []"
              variant="outlined"
              density="comfortable"
            />

            <!-- Checkbox Field -->
            <v-checkbox
              v-else-if="field.type === 'checkbox'"
              v-model="filterValues[field.name]"
              :label="field.label"
              :disabled="field.disabled"
              :color="field.color || 'primary'"
              density="comfortable"
            />

            <!-- Switch Field -->
            <v-switch
              v-else-if="field.type === 'switch'"
              v-model="filterValues[field.name]"
              :label="field.label"
              :disabled="field.disabled"
              :color="field.color || 'primary'"
              density="comfortable"
            />
          </v-col>

          <!-- Action buttons column -->
          <v-col
            v-if="showSubmitButton"
            :cols="submitButtonCols || 12"
            :sm="submitButtonSm || 3"
            :md="submitButtonMd || 2"
            :lg="submitButtonLg || 2"
            class="mb-2"
          >
            <div class="d-flex gap-2">
              <!-- Search/Submit button -->
              <v-btn
                :color="submitButtonColor"
                type="submit"
                :variant="submitButtonVariant"
                :aria-label="submitButtonLabel"
                :loading="loading"
                :disabled="!isValid"
                size="large"
              >
                <v-icon v-if="submitButtonIcon" start>{{
                  submitButtonIcon
                }}</v-icon>
                <span v-if="submitButtonText">{{ submitButtonText }}</span>
                <span v-else>{{ submitButtonLabel }}</span>
              </v-btn>

              <!-- Clear/Reset button -->
              <v-btn
                v-if="showClearButton"
                :color="clearButtonColor"
                :variant="clearButtonVariant"
                :aria-label="clearButtonLabel"
                size="large"
                @click="clearFilters"
              >
                <v-icon v-if="clearButtonIcon" start>{{
                  clearButtonIcon
                }}</v-icon>
                <span v-if="clearButtonText">{{ clearButtonText }}</span>
                <span v-else>{{ clearButtonLabel }}</span>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </div>

    <!-- Divider after filters -->
    <v-divider v-if="showDivider" class="mt-4" />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/**
 * FilterPanel Component
 *
 * A reusable, flexible filter panel component for Nuxt 4 + Vuetify 3
 * Supports various field types: text, number, select, autocomplete, date, checkbox, switch
 * Fully RTL-compatible and theme-aware
 */

/**
 * FilterField type definition:
 * {
 *   name: string - Unique field name (used as v-model key)
 *   type: 'text' | 'number' | 'email' | 'select' | 'autocomplete' | 'date' | 'checkbox' | 'switch'
 *   label: string - Field label
 *   placeholder?: string - Placeholder text
 *   items?: any[] - Items for select/autocomplete
 *   multiple?: boolean - Multiple selection
 *   clearable?: boolean - Show clear button (default: true)
 *   disabled?: boolean - Disable field
 *   cols?: number - Grid cols (default: 12)
 *   sm?: number - Grid sm breakpoint (default: 6)
 *   md?: number - Grid md breakpoint (default: 4)
 *   lg?: number - Grid lg breakpoint (default: 3)
 *   hint?: string - Help text
 *   persistentHint?: boolean - Always show hint
 *   counter?: boolean - Show character counter
 *   maxlength?: number - Max character length
 *   color?: string - Color for checkbox/switch
 * }
 */

const props = defineProps({
  // Filter fields configuration
  fields: {
    type: Array,
    default: () => [],
  },

  // Initial filter values
  modelValue: {
    type: Object,
    default: () => ({}),
  },

  // Collapsible mode - if false, filters are always visible without toggle button
  collapsible: {
    type: Boolean,
    default: true,
  },

  // Initial open state (only used when collapsible is true)
  initialOpen: {
    type: Boolean,
    default: false,
  },

  // Toggle button props
  buttonVariant: {
    type: String,
    default: "outlined",
  },
  buttonColor: {
    type: String,
    default: "primary",
  },
  filterIcon: {
    type: String,
    default: "mdi-filter-variant",
  },
  toggleButtonLabel: {
    type: String,
    default: "Filter",
  },

  // Active filters indicator
  showActiveCount: {
    type: Boolean,
    default: true,
  },
  chipColor: {
    type: String,
    default: "primary",
  },
  activeFiltersLabel: {
    type: String,
    default: "active",
  },

  // Submit button props
  showSubmitButton: {
    type: Boolean,
    default: true,
  },
  submitButtonColor: {
    type: String,
    default: "primary",
  },
  submitButtonVariant: {
    type: String,
    default: "flat",
  },
  submitButtonIcon: {
    type: String,
    default: "mdi-magnify",
  },
  submitButtonText: {
    type: String,
    default: "",
  },
  submitButtonLabel: {
    type: String,
    default: "Search",
  },
  submitButtonCols: {
    type: Number,
    default: 12,
  },
  submitButtonSm: {
    type: Number,
    default: 3,
  },
  submitButtonMd: {
    type: Number,
    default: 2,
  },
  submitButtonLg: {
    type: Number,
    default: 2,
  },

  // Clear button props
  showClearButton: {
    type: Boolean,
    default: true,
  },
  clearButtonColor: {
    type: String,
    default: "default",
  },
  clearButtonVariant: {
    type: String,
    default: "outlined",
  },
  clearButtonIcon: {
    type: String,
    default: "mdi-close",
  },
  clearButtonText: {
    type: String,
    default: "",
  },
  clearButtonLabel: {
    type: String,
    default: "Clear",
  },

  // UI options
  showDivider: {
    type: Boolean,
    default: true,
  },

  // Loading state (passed from parent)
  loading: {
    type: Boolean,
    default: false,
  },
});

// Define emits
const emit = defineEmits(["update:modelValue", "submit", "clear", "toggle"]);

// i18n for RTL detection
const { locale } = useI18n();
const isRTL = computed(() => locale.value === "ar");

// Local state
const isOpen = ref(props.collapsible ? props.initialOpen : true);
const formRef = ref(null);

// Filter values - synced with v-model
const filterValues = ref({ ...props.modelValue });

// Flag to prevent watch loops during programmatic updates
const isUpdating = ref(false);

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (!isUpdating.value) {
      isUpdating.value = true;
      filterValues.value = { ...newValue };
      nextTick(() => {
        isUpdating.value = false;
      });
    }
  },
  { deep: true }
);

// Watch for internal changes and emit - debounced for performance
watch(
  filterValues,
  (newValue) => {
    if (!isUpdating.value) {
      emit("update:modelValue", newValue);
    }
  },
  { deep: true }
);

// Computed: Count active filters (non-empty values) - memoized for performance
const activeFiltersCount = computed(() => {
  const values = filterValues.value;
  let count = 0;

  for (const key in values) {
    const value = values[key];
    if (value === null || value === undefined || value === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    count++;
  }

  return count;
});

// Computed: Check if form is valid
const isValid = computed(() => {
  // If no fields have rules, consider form valid
  const hasRequiredFields = props.fields.some(
    (field) => field.rules && field.rules.length > 0
  );
  if (!hasRequiredFields) return true;

  // Check each field with rules
  return props.fields.every((field) => {
    if (!field.rules || field.rules.length === 0) return true;
    const value = filterValues.value[field.name];
    return field.rules.every((rule) => {
      const result = rule(value);
      return result === true;
    });
  });
});

// Toggle filters visibility
const toggleFilters = () => {
  isOpen.value = !isOpen.value;
  emit("toggle", isOpen.value);
};

// Handle form submit
const handleSubmit = () => {
  emit("submit", filterValues.value);
};

// Clear all filters - optimized for performance
const clearFilters = async () => {
  // Prevent watch from emitting during clear operation
  isUpdating.value = true;

  // Build cleared values object efficiently
  const clearedValues = {};
  props.fields.forEach((field) => {
    if (field.type === "checkbox" || field.type === "switch") {
      clearedValues[field.name] = false;
    } else if (field.multiple) {
      clearedValues[field.name] = [];
    } else {
      clearedValues[field.name] = "";
    }
  });

  // Update values in one operation
  filterValues.value = clearedValues;

  // Reset form validation if exists
  if (formRef.value) {
    formRef.value.reset();
  }

  // Wait for DOM update, then emit and allow watches
  await nextTick();
  isUpdating.value = false;
  emit("clear");
};

// Expose methods for parent component
defineExpose({
  toggleFilters,
  clearFilters,
  isOpen,
  filterValues,
});
</script>

<style scoped>
.filter-panel {
  width: 100%;
}

/* Filter toggle button styling */
.filter-toggle-btn {
  transition: all 0.3s ease;
}

.filter-toggle-btn :deep(.v-icon) {
  transition: all 0.3s ease;
}

/* RTL button alignment - محاذاة المحتوى لليمين في العربية */
.filter-toggle-btn.rtl-btn {
  text-align: right !important;
  direction: rtl !important;
}

.filter-toggle-btn.rtl-btn :deep(.v-btn__content) {
  display: flex !important;
  flex-direction: row !important; /* الترتيب العادي في RTL */
  justify-content: flex-start !important;
  align-items: center !important;
  gap: 8px !important;
}

/* Smooth transition for filter panel */
:deep(.v-expand-transition-enter-active),
:deep(.v-expand-transition-leave-active) {
  transition: all 0.3s ease;
}
</style>
