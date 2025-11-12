<template>
  <div class="column-visibility-selector">
    <!-- Professional Toggle Button with Chip Badge - only show when collapsible is true -->
    <div v-if="collapsible" class="d-flex align-center mb-4">
      <v-btn
        :variant="buttonVariant"
        :color="buttonColor"
        :size="buttonSize"
        :aria-label="label"
        :class="['column-toggle-btn', 'elevation-1', { 'rtl-btn': isRTL }]"
        @click="toggleMenu"
      >
        <v-icon v-if="!isRTL" start>{{ toggleIcon }}</v-icon>
        <v-icon v-else>{{ toggleIcon }}</v-icon>
        {{ label }}
      </v-btn>

      <!-- Active columns count as separate chip (like FilterPanel style) -->
      <v-chip
        v-if="showBadge && activeColumnsCount > 0"
        class="ms-2"
        size="small"
        :color="badgeColor"
        variant="flat"
      >
        {{ activeColumnsCount }}
      </v-chip>
    </div>

    <!-- Professional Expandable Menu with Enhanced Design (when collapsible) -->
    <v-expand-transition v-if="collapsible">
      <div v-show="isMenuOpen" class="column-menu-wrapper">
        <v-card :elevation="menuElevation" class="column-menu" rounded="lg">
          <v-card-text class="pa-4">
            <!-- Search Bar (Professional Design) -->
            <v-text-field
              v-if="showSearch"
              v-model="searchQuery"
              :placeholder="searchPlaceholder"
              density="comfortable"
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
              class="mb-4 search-field"
              rounded="lg"
            />

            <!-- Action Buttons Row (Refined Style) -->
            <div
              v-if="showSelectAll || showClearAll"
              class="action-buttons mb-4"
            >
              <v-btn
                v-if="showSelectAll"
                size="small"
                :variant="selectAllVariant"
                :color="selectAllColor"
                :prepend-icon="
                  !isRTL ? 'mdi-checkbox-multiple-marked' : undefined
                "
                :append-icon="
                  isRTL ? 'mdi-checkbox-multiple-marked' : undefined
                "
                class="flex-grow-1"
                @click="selectAllColumns"
              >
                {{ selectAllText }}
              </v-btn>
              <v-btn
                v-if="showClearAll"
                size="small"
                :variant="clearAllVariant"
                :color="clearAllColor"
                :prepend-icon="
                  !isRTL ? 'mdi-checkbox-multiple-blank-outline' : undefined
                "
                :append-icon="
                  isRTL ? 'mdi-checkbox-multiple-blank-outline' : undefined
                "
                class="flex-grow-1"
                @click="clearAllColumns"
              >
                {{ clearAllText }}
              </v-btn>
            </div>

            <v-divider v-if="showSelectAll || showClearAll" class="mb-4" />

            <!-- Columns List with Enhanced Checkboxes - Full Item Clickable -->
            <div class="columns-list">
              <v-checkbox
                v-for="column in filteredColumns"
                :key="column.key"
                v-model="selectedColumnKeys"
                :value="column.key"
                :label="column.title"
                :color="checkboxColor"
                :ripple="true"
                density="comfortable"
                hide-details
                class="column-checkbox"
              />
            </div>

            <!-- Empty State (Enhanced Design) -->
            <div
              v-if="showSearch && filteredColumns.length === 0"
              class="empty-state"
            >
              <v-icon size="64" color="grey-lighten-2"
                >mdi-table-column-remove</v-icon
              >
              <p class="text-body-2 text-grey-darken-1 mt-3">
                {{ noResultsText }}
              </p>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-expand-transition>

    <!-- Non-collapsible mode - always visible -->
    <div v-else>
      <v-card
        :elevation="menuElevation"
        class="column-menu column-menu-static"
        rounded="lg"
      >
        <v-card-text class="pa-4">
          <!-- Search Bar (Professional Design) -->
          <v-text-field
            v-if="showSearch"
            v-model="searchQuery"
            :placeholder="searchPlaceholder"
            density="comfortable"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            class="mb-4 search-field"
            rounded="lg"
          />

          <!-- Action Buttons Row (Refined Style) -->
          <div v-if="showSelectAll || showClearAll" class="action-buttons mb-4">
            <v-btn
              v-if="showSelectAll"
              size="small"
              :variant="selectAllVariant"
              :color="selectAllColor"
              :prepend-icon="
                !isRTL ? 'mdi-checkbox-multiple-marked' : undefined
              "
              :append-icon="isRTL ? 'mdi-checkbox-multiple-marked' : undefined"
              class="flex-grow-1"
              @click="selectAllColumns"
            >
              {{ selectAllText }}
            </v-btn>
            <v-btn
              v-if="showClearAll"
              size="small"
              :variant="clearAllVariant"
              :color="clearAllColor"
              :prepend-icon="
                !isRTL ? 'mdi-checkbox-multiple-blank-outline' : undefined
              "
              :append-icon="
                isRTL ? 'mdi-checkbox-multiple-blank-outline' : undefined
              "
              class="flex-grow-1"
              @click="clearAllColumns"
            >
              {{ clearAllText }}
            </v-btn>
          </div>

          <v-divider v-if="showSelectAll || showClearAll" class="mb-4" />

          <!-- Columns List with Enhanced Checkboxes - Full Item Clickable -->
          <div class="columns-list">
            <v-checkbox
              v-for="column in filteredColumns"
              :key="column.key"
              v-model="selectedColumnKeys"
              :value="column.key"
              :label="column.title"
              :color="checkboxColor"
              :ripple="true"
              density="comfortable"
              hide-details
              class="column-checkbox"
            />
          </div>

          <!-- Empty State (Enhanced Design) -->
          <div
            v-if="showSearch && filteredColumns.length === 0"
            class="empty-state"
          >
            <v-icon size="64" color="grey-lighten-2"
              >mdi-table-column-remove</v-icon
            >
            <p class="text-body-2 text-grey-darken-1 mt-3">
              {{ noResultsText }}
            </p>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Column {
  title: string
  key: string
  sortable?: boolean
  align?: string
  width?: string | number
}

interface Props {
  columns: Column[]
  defaultVisibleColumns?: string[]
  modelValue?: (string | Column)[]
  collapsible?: boolean
  label?: string
  toggleIcon?: string
  buttonVariant?: string
  buttonColor?: string
  buttonSize?: string
  checkboxColor?: string
  showBadge?: boolean
  badgeColor?: string
  showSearch?: boolean
  searchPlaceholder?: string
  noResultsText?: string
  showSelectAll?: boolean
  showClearAll?: boolean
  selectAllText?: string
  clearAllText?: string
  selectAllColor?: string
  clearAllColor?: string
  selectAllVariant?: string
  clearAllVariant?: string
  menuElevation?: number
  initialOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultVisibleColumns: () => [],
  modelValue: () => [],
  collapsible: true,
  label: 'Show Columns',
  toggleIcon: 'mdi-table-column',
  buttonVariant: 'outlined',
  buttonColor: 'primary',
  buttonSize: 'default',
  checkboxColor: 'primary',
  showBadge: true,
  badgeColor: 'primary',
  showSearch: true,
  searchPlaceholder: 'Search columns...',
  noResultsText: 'No columns found',
  showSelectAll: true,
  showClearAll: true,
  selectAllText: 'Select All',
  clearAllText: 'Clear All',
  selectAllColor: 'success',
  clearAllColor: 'default',
  selectAllVariant: 'tonal',
  clearAllVariant: 'outlined',
  menuElevation: 2,
  initialOpen: false,
})

const emit = defineEmits(['update:modelValue', 'change', 'toggle'])
const { locale } = useI18n()

const isRTL = computed(() => locale.value === 'ar')
const isMenuOpen = ref(props.collapsible ? props.initialOpen : true)
const searchQuery = ref('')
const selectedColumnKeys = ref<string[]>([])

const allColumns = computed(() => props.columns.map(col => ({
  title: col.title,
  key: col.key,
  sortable: col.sortable ?? true,
  align: col.align ?? 'start',
  width: col.width,
})))

const filteredColumns = computed(() => {
  if (!searchQuery.value) return allColumns.value
  const q = searchQuery.value.toLowerCase().trim()
  return allColumns.value.filter(c => c.title.toLowerCase().includes(q) || c.key.toLowerCase().includes(q))
})

const activeColumnsCount = computed(() => selectedColumnKeys.value.length)
const selectedColumnsObjects = computed(() => allColumns.value.filter(c => selectedColumnKeys.value.includes(c.key)))

const initializeColumns = () => {
  if (props.modelValue?.length > 0) {
    selectedColumnKeys.value = props.modelValue.map(c => typeof c === 'string' ? c : c.key)
  } else if (props.defaultVisibleColumns.length > 0) {
    selectedColumnKeys.value = [...props.defaultVisibleColumns]
  } else {
    selectedColumnKeys.value = allColumns.value.map(c => c.key)
  }
}

onMounted(() => {
  initializeColumns()
  emitChange()
})

watch(() => props.modelValue, (n) => {
  if (n && Array.isArray(n) && n.length > 0) {
    const newKeys = n.map(c => typeof c === 'string' ? c : c.key)
    if (JSON.stringify(newKeys.sort()) !== JSON.stringify(selectedColumnKeys.value.sort())) {
      selectedColumnKeys.value = newKeys
    }
  }
}, { deep: true })

watch(selectedColumnKeys, () => emitChange(), { deep: true })

const emitChange = () => {
  emit('update:modelValue', selectedColumnsObjects.value)
  emit('change', selectedColumnsObjects.value)
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  emit('toggle', isMenuOpen.value)
}

const selectAllColumns = () => { selectedColumnKeys.value = allColumns.value.map(c => c.key) }
const clearAllColumns = () => { selectedColumnKeys.value = [] }
const closeMenu = () => { isMenuOpen.value = false }
const openMenu = () => { isMenuOpen.value = true }

defineExpose({ selectAllColumns, clearAllColumns, closeMenu, openMenu, toggleMenu, selectedColumns: selectedColumnsObjects, isMenuOpen })
</script>

<style scoped>
/* ==========================
   Professional Component Styles
   ========================== */

.column-visibility-selector {
  width: 100%;
  position: relative;
}

/* Toggle Button Enhancement */
.column-toggle-btn {
  font-weight: 500;
  letter-spacing: 0.0178571429em;
  text-transform: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.column-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
}

.column-toggle-btn:active {
  transform: translateY(0);
}

/* Menu Wrapper for Better Positioning */
.column-menu-wrapper {
  position: relative;
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Professional Card Menu Design - Full Width like Filter */
.column-menu {
  width: 100%; /* Full width like FilterPanel */
  max-width: 100%;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12) !important;
  overflow: hidden;
  transition: all 0.3s ease;
}

.column-menu:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
}

/* Static menu (when collapsible is false) */
.column-menu-static {
  margin-top: 0;
  animation: none;
}

/* Search Field Styling */
.search-field {
  transition: all 0.2s ease;
}

.search-field:deep(.v-field) {
  background: rgba(var(--v-theme-surface-variant), 0.5);
  transition: background 0.2s ease;
}

.search-field:deep(.v-field:hover) {
  background: rgba(var(--v-theme-surface-variant), 0.7);
}

.search-field:deep(.v-field--focused) {
  background: rgba(var(--v-theme-surface-variant), 0.8);
}

/* Action Buttons Row */
.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-buttons .v-btn {
  transition: all 0.2s ease;
}

.action-buttons .v-btn:hover {
  transform: scale(1.03);
}

/* Professional Columns List */
.columns-list {
  max-height: 350px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px;
  border-radius: 8px;
  background: rgba(var(--v-theme-surface-variant), 0.2);
}

/* Enhanced Scrollbar Design */
.columns-list::-webkit-scrollbar {
  width: 10px;
}

.columns-list::-webkit-scrollbar-track {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 10px;
  margin: 4px 0;
}

.columns-list::-webkit-scrollbar-thumb {
  background: linear-gradient(
    180deg,
    rgba(var(--v-theme-primary), 0.5),
    rgba(var(--v-theme-primary), 0.7)
  );
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.columns-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    180deg,
    rgba(var(--v-theme-primary), 0.7),
    rgba(var(--v-theme-primary), 0.9)
  );
}

.columns-list::-webkit-scrollbar-thumb:active {
  background: rgba(var(--v-theme-primary), 1);
}

/* Checkbox Styling with Hover Effects - Full Item Clickable */
.column-checkbox {
  margin-bottom: 2px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
}

.column-checkbox:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  transform: translateX(4px);
}

[dir="rtl"] .column-checkbox:hover {
  transform: translateX(-4px);
}

.column-checkbox:active {
  background: rgba(var(--v-theme-primary), 0.12);
  transform: scale(0.98);
}

.column-checkbox:last-child {
  margin-bottom: 0;
}

/* Make entire checkbox container clickable */
.column-checkbox:deep(.v-input__control) {
  width: 100%;
}

.column-checkbox:deep(.v-selection-control) {
  width: 100%;
  min-height: 44px;
}

.column-checkbox:deep(.v-label) {
  width: 100%;
  cursor: pointer;
  font-weight: 450;
  opacity: 0.87;
  transition: opacity 0.2s ease;
  padding: 4px 0;
}

.column-checkbox:hover:deep(.v-label) {
  opacity: 1;
  font-weight: 500;
}

/* Enhanced Empty State */
.empty-state {
  text-align: center;
  padding: 48px 24px;
  border-radius: 12px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.empty-state .v-icon {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

/* Smooth Expand Transition */
.v-expand-transition-enter-active,
.v-expand-transition-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* RTL Support Enhancement */
[dir="rtl"] .column-menu {
  text-align: right;
}

[dir="rtl"] .action-buttons {
  flex-direction: row-reverse;
}

/* Responsive Design - Mobile */
@media (max-width: 600px) {
  .column-menu {
    width: 100%;
    max-width: 100%;
    border-radius: 12px;
  }

  .columns-list {
    max-height: 280px;
  }

  .column-toggle-btn {
    font-size: 0.875rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .v-btn {
    width: 100%;
  }

  .column-checkbox {
    padding: 12px 16px;
  }
}

/* Responsive Design - Tablet */
@media (min-width: 601px) and (max-width: 960px) {
  .column-menu {
    width: 100%;
    max-width: 100%;
  }

  .columns-list {
    max-height: 320px;
  }
}

/* Dark Theme Optimizations */
:deep(.v-theme--dark) .columns-list {
  background: rgba(255, 255, 255, 0.05);
}

:deep(.v-theme--dark) .columns-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.08);
}

:deep(.v-theme--dark) .columns-list::-webkit-scrollbar-thumb {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.3)
  );
}

:deep(.v-theme--dark) .columns-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.4)
  );
}

:deep(.v-theme--dark) .column-checkbox:hover {
  background: rgba(255, 255, 255, 0.08);
}

:deep(.v-theme--dark) .empty-state {
  background: rgba(255, 255, 255, 0.05);
}

:deep(.v-theme--dark) .search-field .v-field {
  background: rgba(255, 255, 255, 0.05);
}

:deep(.v-theme--dark) .search-field .v-field:hover {
  background: rgba(255, 255, 255, 0.08);
}

/* Performance Optimizations */
.column-menu,
.columns-list,
.column-checkbox {
  transform: translateZ(0);
  will-change: transform;
}

/* Touch-Friendly Mobile Targets */
@media (hover: none) and (pointer: coarse) {
  .column-checkbox {
    min-height: 48px;
    padding: 12px;
  }

  .column-toggle-btn {
    min-height: 48px;
    padding: 0 20px;
  }
}

/* Column toggle button styling */
.column-toggle-btn {
  transition: all 0.3s ease;
}

.column-toggle-btn :deep(.v-icon) {
  transition: all 0.3s ease;
}

/* RTL button alignment - محاذاة المحتوى لليمين في العربية */
.column-toggle-btn.rtl-btn {
  text-align: right !important;
  direction: rtl !important;
}

.column-toggle-btn.rtl-btn :deep(.v-btn__content) {
  display: flex !important;
  flex-direction: row !important; /* الترتيب العادي في RTL */
  justify-content: flex-start !important;
  align-items: center !important;
  gap: 8px !important;
}

/* Print Styles */
@media print {
  .column-visibility-selector {
    display: none;
  }
}

/* Focus Styles for Accessibility */
.column-toggle-btn:focus-visible {
  outline: 2px solid rgba(var(--v-theme-primary), 0.5);
  outline-offset: 2px;
}

.column-checkbox:focus-within {
  outline: 2px solid rgba(var(--v-theme-primary), 0.3);
  outline-offset: 2px;
  border-radius: 8px;
}

/* Loading State (if needed) */
.column-menu.loading {
  pointer-events: none;
  opacity: 0.6;
  cursor: wait;
}
</style>
