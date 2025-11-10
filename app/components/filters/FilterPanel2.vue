<template>
  <div class="filter-panel-2">
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

      <!-- Results count chip -->
      <v-chip
        v-if="showResultsCount && resultsCount !== null"
        class="ms-2"
        size="small"
        variant="flat"
      >
        {{ resultsCount }} {{ resultsLabel }}
      </v-chip>
    </div>

    <!-- Expandable filters section (when collapsible) or always visible (when not collapsible) -->
    <v-expand-transition v-if="collapsible">
      <div v-show="isOpen">
        <div :class="collapsible ? 'px-4' : ''">
          <!-- Chip Group Filters -->
          <div
            v-if="chipGroups && chipGroups.length > 0"
            class="d-flex align-center flex-wrap ga-3 mb-4"
          >
            <template
              v-for="(group, groupIndex) in chipGroups"
              :key="groupIndex"
            >
              <v-chip-group
                v-model="filterValues[group.name]"
                :multiple="group.multiple !== false"
                :selected-class="group.selectedClass || 'text-white'"
                :class="group.class || 'mr-1'"
              >
                <v-chip
                  v-for="item in group.items"
                  :key="item.value || item"
                  :value="item.value || item"
                  :variant="group.variant || 'elevated'"
                  :size="group.size || 'small'"
                  :color="group.color"
                  :disabled="item.disabled"
                >
                  {{ item.label || item }}
                </v-chip>
              </v-chip-group>
            </template>
          </div>

          <!-- Regular Fields (Select, Switch, Text, etc.) -->
          <v-row v-if="fields && fields.length > 0" align="center">
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
                hide-details
              />

              <!-- Select Field -->
              <v-select
                v-else-if="field.type === 'select'"
                v-model="filterValues[field.name]"
                :label="field.label"
                :items="field.items || []"
                :item-title="field.itemTitle || 'label'"
                :item-value="field.itemValue || 'value'"
                :multiple="field.multiple"
                :clearable="field.clearable !== false"
                :disabled="field.disabled"
                :hint="field.hint"
                :persistent-hint="field.persistentHint"
                :prepend-inner-icon="field.prependInnerIcon"
                :rules="field.rules || []"
                :chips="field.chips"
                variant="outlined"
                density="comfortable"
                hide-details
                :style="field.style"
              />

              <!-- Autocomplete Field -->
              <v-autocomplete
                v-else-if="field.type === 'autocomplete'"
                v-model="filterValues[field.name]"
                :label="field.label"
                :items="field.items || []"
                :item-title="field.itemTitle || 'label'"
                :item-value="field.itemValue || 'value'"
                :multiple="field.multiple"
                :clearable="field.clearable !== false"
                :disabled="field.disabled"
                :hint="field.hint"
                :persistent-hint="field.persistentHint"
                :prepend-inner-icon="field.prependInnerIcon"
                :rules="field.rules || []"
                :chips="field.chips"
                variant="outlined"
                density="comfortable"
                hide-details
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
                hide-details
              />

              <!-- Checkbox Field -->
              <v-checkbox
                v-else-if="field.type === 'checkbox'"
                v-model="filterValues[field.name]"
                :label="field.label"
                :disabled="field.disabled"
                :color="field.color || 'primary'"
                density="comfortable"
                hide-details
              />

              <!-- Switch Field -->
              <v-switch
                v-else-if="field.type === 'switch'"
                v-model="filterValues[field.name]"
                :label="getSwitchLabel(field)"
                :disabled="field.disabled"
                :color="field.color || 'primary'"
                :inset="field.inset"
                density="comfortable"
                hide-details
              />
            </v-col>

            <!-- Action buttons column -->
            <v-col
              v-if="showSubmitButton || showClearButton"
              :cols="submitButtonCols || 12"
              :sm="submitButtonSm || 12"
              :md="submitButtonMd || 12"
              :lg="submitButtonLg || 12"
              class="mb-2"
            >
              <div class="d-flex gap-2">
                <!-- Clear/Reset button -->
                <v-btn
                  v-if="showClearButton"
                  :color="clearButtonColor"
                  :variant="clearButtonVariant"
                  :loading="loading"
                  :disabled="loading"
                  size="default"
                  @click="clearFilters"
                >
                  <v-icon v-if="!isRTL" start>{{ clearButtonIcon }}</v-icon>
                  <v-icon v-else>{{ clearButtonIcon }}</v-icon>
                  {{ clearButtonText || clearButtonLabel }}
                </v-btn>

                <!-- Search/Submit button -->
                <v-btn
                  v-if="showSubmitButton"
                  :color="submitButtonColor"
                  :variant="submitButtonVariant"
                  :loading="loading"
                  :disabled="loading"
                  size="default"
                  @click="handleSubmit"
                >
                  <v-icon v-if="!isRTL" start>{{ submitButtonIcon }}</v-icon>
                  <v-icon v-else>{{ submitButtonIcon }}</v-icon>
                  {{ submitButtonText || submitButtonLabel }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-expand-transition>

    <!-- Non-collapsible mode - always visible -->
    <div v-else>
      <div>
        <!-- Chip Group Filters -->
        <div
          v-if="chipGroups && chipGroups.length > 0"
          class="d-flex align-center flex-wrap ga-3 mb-4"
        >
          <template v-for="(group, groupIndex) in chipGroups" :key="groupIndex">
            <v-chip-group
              v-model="filterValues[group.name]"
              :multiple="group.multiple !== false"
              :selected-class="group.selectedClass || 'text-white'"
              :class="group.class || 'mr-1'"
            >
              <v-chip
                v-for="item in group.items"
                :key="item.value || item"
                :value="item.value || item"
                :variant="group.variant || 'elevated'"
                :size="group.size || 'small'"
                :color="group.color"
                :disabled="item.disabled"
              >
                {{ item.label || item }}
              </v-chip>
            </v-chip-group>
          </template>
        </div>

        <!-- Regular Fields (Select, Switch, Text, etc.) -->
        <v-row v-if="fields && fields.length > 0" align="center">
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
              hide-details
            />

            <!-- Select Field -->
            <v-select
              v-else-if="field.type === 'select'"
              v-model="filterValues[field.name]"
              :label="field.label"
              :items="field.items || []"
              :item-title="field.itemTitle || 'label'"
              :item-value="field.itemValue || 'value'"
              :multiple="field.multiple"
              :clearable="field.clearable !== false"
              :disabled="field.disabled"
              :hint="field.hint"
              :persistent-hint="field.persistentHint"
              :prepend-inner-icon="field.prependInnerIcon"
              :rules="field.rules || []"
              :chips="field.chips"
              variant="outlined"
              density="comfortable"
              hide-details
              :style="field.style"
            />

            <!-- Autocomplete Field -->
            <v-autocomplete
              v-else-if="field.type === 'autocomplete'"
              v-model="filterValues[field.name]"
              :label="field.label"
              :items="field.items || []"
              :item-title="field.itemTitle || 'label'"
              :item-value="field.itemValue || 'value'"
              :multiple="field.multiple"
              :clearable="field.clearable !== false"
              :disabled="field.disabled"
              :hint="field.hint"
              :persistent-hint="field.persistentHint"
              :prepend-inner-icon="field.prependInnerIcon"
              :rules="field.rules || []"
              :chips="field.chips"
              variant="outlined"
              density="comfortable"
              hide-details
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
              hide-details
            />

            <!-- Checkbox Field -->
            <v-checkbox
              v-else-if="field.type === 'checkbox'"
              v-model="filterValues[field.name]"
              :label="field.label"
              :disabled="field.disabled"
              :color="field.color || 'primary'"
              density="comfortable"
              hide-details
            />

            <!-- Switch Field -->
            <v-switch
              v-else-if="field.type === 'switch'"
              v-model="filterValues[field.name]"
              :label="getSwitchLabel(field)"
              :disabled="field.disabled"
              :color="field.color || 'primary'"
              :inset="field.inset"
              density="comfortable"
              hide-details
            />
          </v-col>

          <!-- Action buttons column -->
          <v-col
            v-if="showSubmitButton || showClearButton"
            :cols="submitButtonCols || 12"
            :sm="submitButtonSm || 12"
            :md="submitButtonMd || 12"
            :lg="submitButtonLg || 12"
            class="mb-2"
          >
            <div class="d-flex gap-2">
              <!-- Clear/Reset button -->
              <v-btn
                v-if="showClearButton"
                :color="clearButtonColor"
                :variant="clearButtonVariant"
                :loading="loading"
                :disabled="loading"
                size="default"
                @click="clearFilters"
              >
                <v-icon v-if="!isRTL" start>{{ clearButtonIcon }}</v-icon>
                <v-icon v-else>{{ clearButtonIcon }}</v-icon>
                {{ clearButtonText || clearButtonLabel }}
              </v-btn>

              <!-- Search/Submit button -->
              <v-btn
                v-if="showSubmitButton"
                :color="submitButtonColor"
                :variant="submitButtonVariant"
                :loading="loading"
                :disabled="loading"
                size="default"
                @click="handleSubmit"
              >
                <v-icon v-if="!isRTL" start>{{ submitButtonIcon }}</v-icon>
                <v-icon v-else>{{ submitButtonIcon }}</v-icon>
                {{ submitButtonText || submitButtonLabel }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- Divider after filters -->
    <v-divider v-if="showDivider" class="mt-4" />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/**
 * FilterPanel2 Component
 *
 * A reusable, flexible filter panel component for Nuxt 4 + Vuetify 3
 * Designed for companies-card page style filtering with chip groups and switches
 * Supports various field types and fully RTL-compatible
 *
 * Features:
 * - Chip groups for category-like filters (floating buttons)
 * - Switch fields for boolean filters (deposit, installments, open now)
 * - Select fields for dropdowns (city, cards)
 * - Text fields for search
 * - Full RTL support
 * - Collapsible mode
 * - Results count display
 */

/**
 * ChipGroup type definition:
 * {
 *   name: string - Unique field name (used as v-model key)
 *   items: Array<string | {label: string, value: any, disabled?: boolean}> - Chip items
 *   multiple?: boolean - Multiple selection (default: true)
 *   selectedClass?: string - CSS class for selected chips
 *   variant?: string - Chip variant (default: 'elevated')
 *   size?: string - Chip size (default: 'small')
 *   color?: string - Chip color
 *   class?: string - Additional CSS class
 * }
 *
 * Field type definition: (same as FilterPanel)
 * {
 *   name: string
 *   type: 'text' | 'number' | 'email' | 'select' | 'autocomplete' | 'date' | 'checkbox' | 'switch'
 *   label: string
 *   labelActive?: string - Label when switch is active
 *   labelInactive?: string - Label when switch is inactive
 *   inset?: boolean - Inset style for switch
 *   ... other properties
 * }
 */

const props = defineProps({
  // Chip groups configuration (for floating button filters)
  chipGroups: {
    type: Array,
    default: () => [],
  },

  // Regular filter fields configuration
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
    default: false, // Default to always visible for companies-card style
  },

  // Initial open state (only used when collapsible is true)
  initialOpen: {
    type: Boolean,
    default: true,
  },

  // Toggle button props
  buttonVariant: {
    type: String,
    default: "flat",
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
    default: "فلاتر",
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
    default: "نشط",
  },

  // Results count display
  showResultsCount: {
    type: Boolean,
    default: true,
  },
  resultsCount: {
    type: Number,
    default: null,
  },
  resultsLabel: {
    type: String,
    default: "نتيجة",
  },

  // Submit button props
  showSubmitButton: {
    type: Boolean,
    default: false, // Default to false for companies-card style (auto-filter)
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
    default: "mdi-check",
  },
  submitButtonText: {
    type: String,
    default: "",
  },
  submitButtonLabel: {
    type: String,
    default: "تطبيق",
  },
  submitButtonCols: {
    type: Number,
    default: 12,
  },
  submitButtonSm: {
    type: Number,
    default: 12,
  },
  submitButtonMd: {
    type: Number,
    default: 12,
  },
  submitButtonLg: {
    type: Number,
    default: 12,
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
    default: "tonal",
  },
  clearButtonIcon: {
    type: String,
    default: "mdi-filter-off",
  },
  clearButtonText: {
    type: String,
    default: "",
  },
  clearButtonLabel: {
    type: String,
    default: "تصفير",
  },

  // UI options
  showDivider: {
    type: Boolean,
    default: false,
  },

  // Loading state (passed from parent)
  loading: {
    type: Boolean,
    default: false,
  },
});

// Define emits
const emit = defineEmits([
  "update:modelValue",
  "submit",
  "clear",
  "toggle",
  "change",
]);

// i18n for RTL detection
const { locale } = useI18n();
const isRTL = computed(() => locale.value === "ar");

// Local state
const isOpen = ref(props.collapsible ? props.initialOpen : true);

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

// Watch for internal changes and emit
watch(
  filterValues,
  (newValue) => {
    if (!isUpdating.value) {
      emit("update:modelValue", newValue);
      emit("change", newValue);
    }
  },
  { deep: true }
);

// Computed: Count active filters (non-empty values)
const activeFiltersCount = computed(() => {
  const values = filterValues.value;
  let count = 0;

  for (const key in values) {
    const value = values[key];
    if (value === null || value === undefined || value === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (typeof value === "boolean" && !value) continue; // Don't count false boolean values
    count++;
  }

  return count;
});

// Get switch label based on state
const getSwitchLabel = (field: any) => {
  const isActive = filterValues.value[field.name];
  if (field.labelActive && field.labelInactive) {
    return isActive ? field.labelActive : field.labelInactive;
  }
  return field.label;
};

// Toggle filters visibility
const toggleFilters = () => {
  isOpen.value = !isOpen.value;
  emit("toggle", isOpen.value);
};

// Handle form submit
const handleSubmit = () => {
  emit("submit", filterValues.value);
};

// Clear all filters
const clearFilters = async () => {
  // Prevent watch from emitting during clear operation
  isUpdating.value = true;

  // Build cleared values object efficiently
  const clearedValues = {};

  // Clear chip groups
  if (props.chipGroups) {
    props.chipGroups.forEach((group) => {
      clearedValues[group.name] = group.multiple !== false ? [] : null;
    });
  }

  // Clear regular fields
  if (props.fields) {
    props.fields.forEach((field) => {
      if (field.type === "checkbox" || field.type === "switch") {
        clearedValues[field.name] = false;
      } else if (field.multiple) {
        clearedValues[field.name] = [];
      } else {
        clearedValues[field.name] = null;
      }
    });
  }

  // Update values in one operation
  filterValues.value = clearedValues;

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
.filter-panel-2 {
  width: 100%;
}

/* Filter toggle button styling */
.filter-toggle-btn {
  transition: all 0.3s ease;
}

.filter-toggle-btn :deep(.v-icon) {
  transition: all 0.3s ease;
}

/* RTL button alignment */
.filter-toggle-btn.rtl-btn {
  text-align: right !important;
  direction: rtl !important;
}

.filter-toggle-btn.rtl-btn :deep(.v-btn__content) {
  display: flex !important;
  flex-direction: row !important;
  justify-content: flex-start !important;
  align-items: center !important;
  gap: 8px !important;
}

/* Chip group styling */
:deep(.v-chip-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* Smooth transition for filter panel */
:deep(.v-expand-transition-enter-active),
:deep(.v-expand-transition-leave-active) {
  transition: all 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .filter-panel-2 :deep(.v-chip) {
    font-size: 0.75rem;
  }
}
</style>
