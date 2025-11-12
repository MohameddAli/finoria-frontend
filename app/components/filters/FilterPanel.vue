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
interface FilterField {
  name: string
  type: 'text' | 'number' | 'email' | 'select' | 'autocomplete' | 'date' | 'checkbox' | 'switch'
  label: string
  placeholder?: string
  items?: any[]
  itemTitle?: string
  itemValue?: string
  multiple?: boolean
  clearable?: boolean
  disabled?: boolean
  cols?: number
  sm?: number
  md?: number
  lg?: number
  hint?: string
  persistentHint?: boolean
  counter?: boolean
  maxlength?: number
  min?: number
  max?: number
  step?: number
  color?: string
  prependInnerIcon?: string
  rules?: ((v: any) => boolean | string)[]
}

interface Props {
  fields?: FilterField[]
  modelValue?: Record<string, any>
  collapsible?: boolean
  initialOpen?: boolean
  buttonVariant?: 'flat' | 'text' | 'elevated' | 'outlined' | 'plain' | 'tonal'
  buttonColor?: string
  filterIcon?: string
  toggleButtonLabel?: string
  showActiveCount?: boolean
  chipColor?: string
  activeFiltersLabel?: string
  showSubmitButton?: boolean
  submitButtonColor?: string
  submitButtonVariant?: 'flat' | 'text' | 'elevated' | 'outlined' | 'plain' | 'tonal'
  submitButtonIcon?: string
  submitButtonText?: string
  submitButtonLabel?: string
  submitButtonCols?: number
  submitButtonSm?: number
  submitButtonMd?: number
  submitButtonLg?: number
  showClearButton?: boolean
  clearButtonColor?: string
  clearButtonVariant?: 'flat' | 'text' | 'elevated' | 'outlined' | 'plain' | 'tonal'
  clearButtonIcon?: string
  clearButtonText?: string
  clearButtonLabel?: string
  showDivider?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fields: () => [],
  modelValue: () => ({}),
  collapsible: true,
  initialOpen: false,
  buttonVariant: 'outlined',
  buttonColor: 'primary',
  filterIcon: 'mdi-filter-variant',
  toggleButtonLabel: 'Filter',
  showActiveCount: true,
  chipColor: 'primary',
  activeFiltersLabel: 'active',
  showSubmitButton: true,
  submitButtonColor: 'primary',
  submitButtonVariant: 'flat',
  submitButtonIcon: 'mdi-magnify',
  submitButtonText: '',
  submitButtonLabel: 'Search',
  submitButtonCols: 12,
  submitButtonSm: 3,
  submitButtonMd: 2,
  submitButtonLg: 2,
  showClearButton: true,
  clearButtonColor: 'default',
  clearButtonVariant: 'outlined',
  clearButtonIcon: 'mdi-close',
  clearButtonText: '',
  clearButtonLabel: 'Clear',
  showDivider: true,
  loading: false,
})

const emit = defineEmits(['update:modelValue', 'submit', 'clear', 'toggle'])
const { locale } = useI18n()

const isRTL = computed(() => locale.value === 'ar')
const isOpen = ref(props.collapsible ? props.initialOpen : true)
const formRef = ref<any>(null)
const filterValues = ref({ ...props.modelValue })
const isUpdating = ref(false)

watch(() => props.modelValue, (n) => {
  if (!isUpdating.value) {
    isUpdating.value = true
    filterValues.value = { ...n }
    nextTick(() => { isUpdating.value = false })
  }
}, { deep: true })

watch(filterValues, (n) => {
  if (!isUpdating.value) emit('update:modelValue', n)
}, { deep: true })

const activeFiltersCount = computed(() => {
  const v = filterValues.value
  let c = 0
  for (const k in v) {
    const val = v[k]
    if (val === null || val === undefined || val === '') continue
    if (Array.isArray(val) && val.length === 0) continue
    c++
  }
  return c
})

const isValid = computed(() => {
  const hasRules = props.fields.some(f => f.rules && f.rules.length > 0)
  if (!hasRules) return true
  return props.fields.every(f => {
    if (!f.rules || f.rules.length === 0) return true
    const v = filterValues.value[f.name]
    return f.rules.every(r => r(v) === true)
  })
})

const toggleFilters = () => {
  isOpen.value = !isOpen.value
  emit('toggle', isOpen.value)
}

const handleSubmit = () => emit('submit', filterValues.value)

const clearFilters = async () => {
  isUpdating.value = true
  const cleared: Record<string, any> = {}
  props.fields.forEach(f => {
    cleared[f.name] = (f.type === 'checkbox' || f.type === 'switch') ? false : f.multiple ? [] : ''
  })
  filterValues.value = cleared
  if (formRef.value) formRef.value.reset()
  await nextTick()
  isUpdating.value = false
  emit('clear')
}

defineExpose({ toggleFilters, clearFilters, isOpen, filterValues })
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
