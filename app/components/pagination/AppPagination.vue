<template>
  <!-- حاوية الباجينيشن مع تنسيق مرن - Pagination wrapper with flexible layout -->
  <div class="d-flex align-center flex-wrap gap-2" :class="alignmentClass">
    <!-- ملخص النطاق - Range summary -->
    <div v-if="showRange" class="text-caption text-medium-emphasis">
      {{ rangeText }}
    </div>

    <!-- محدد حجم الصفحة - Page size selector -->
    <div v-if="showPageSize" class="d-flex align-center">
      <span class="text-caption me-2">{{ t('pagination.itemsPerPage') }}</span>
      <v-select
        :model-value="pageSizeValue"
        :items="pageSizes"
        :density="dense ? 'compact' : 'comfortable'"
        variant="outlined"
        hide-details
        style="max-width: 92px"
        @update:model-value="handleUpdatePageSize"
      />
    </div>

    <!-- تحكم الباجينيشن مع أزرار الانتقال السريع - Pagination control with quick navigation -->
    <div class="d-flex align-center gap-1">
      <!-- زر الانتقال لأول صفحة - First page button -->
      <v-btn
        v-if="showFirstLast"
        :size="size"
        variant="text"
        :icon="isRTL ? 'mdi-page-last' : 'mdi-page-first'"
        :density="dense ? 'compact' : 'default'"
        class="pagination-first-btn"
        :disabled="lengthValue === 1"
        @click="handleUpdatePage(1)"
      />

      <!-- عنصر الباجينيشن الأساسي - Main pagination component -->
      <v-pagination
        :model-value="pageValue"
        :length="lengthValue"
        :total-visible="totalVisible"
        :density="dense ? 'compact' : 'default'"
        :size="size"
        :color="color"
        :active-color="activeColor"
        @update:model-value="handleUpdatePage"
      />

      <!-- زر الانتقال لآخر صفحة - Last page button -->
      <v-btn
        v-if="showFirstLast"
        :size="size"
        variant="text"
        :icon="isRTL ? 'mdi-page-first' : 'mdi-page-last'"
        :density="dense ? 'compact' : 'default'"
        class="pagination-last-btn"
        :disabled="lengthValue === 1"
        @click="handleUpdatePage(lengthValue)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
// تعريف الخصائص مع قيم افتراضية محسنة - Enhanced props with better defaults (runtime props)
const props = defineProps({
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  totalItems: { type: Number, default: 0 },
  length: { type: Number, default: 1 },
  pageSizes: { type: Array, default: () => [5, 10, 20, 50, 100] },
  totalVisible: { type: Number, default: 5 },
  dense: { type: Boolean, default: false },
  showPageSize: { type: Boolean, default: true },
  showRange: { type: Boolean, default: true },
  showFirstLast: { type: Boolean, default: true },
  align: { 
    type: String, 
    default: 'center',
    validator: (value) => ['start', 'center', 'end', 'space-between'].includes(value)
  },
  size: { type: String, default: 'small' },
  // Vuetify v3 color props
  color: { type: String, default: 'primary' },
  activeColor: { type: String, default: 'primary' },
})

// تعريف الأحداث - Event definitions
const emit = defineEmits(['update:page', 'update:pageSize', 'update:page-size', 'change'])

const { t, locale } = useI18n()

// التحقق من اتجاه اللغة - Check language direction
const isRTL = computed(() => locale.value === 'ar')

// حالة تفاعلية - Reactive state
const currentPage = ref(props.page)
const currentPageSize = ref(props.pageSize)

// مراقبة تغيير الصفحة من الخارج - Watch for external page changes
watch(() => props.page, (newPage) => {
  if (newPage !== currentPage.value) {
    currentPage.value = newPage
  }
})

// مراقبة تغيير حجم الصفحة من الخارج - Watch for external page size changes
watch(() => props.pageSize, (newPageSize) => {
  if (newPageSize !== currentPageSize.value) {
    currentPageSize.value = newPageSize
  }
})

// حساب مجموع الصفحات - Compute total pages
const computedTotalPages = computed(() => {
  if (props.length && props.length > 0) {
    return props.length
  }
  const calculated = Math.ceil((props.totalItems || 0) / (currentPageSize.value || 1))
  return Math.max(1, calculated)
})

// قيم محسوبة - Computed values
const pageValue = computed(() => clampPage(currentPage.value))
const pageSizeValue = computed(() => clampPageSize(currentPageSize.value))
const lengthValue = computed(() => computedTotalPages.value)

// ملخص النطاق - Range summary
const startIndex = computed(() => (pageValue.value - 1) * pageSizeValue.value + 1)
const endIndex = computed(() => Math.min(pageValue.value * pageSizeValue.value, props.totalItems ?? 0))
const rangeText = computed(() => {
  if (!props.showRange) return ''
  const total = props.totalItems ?? 0
  if (total <= 0) return t('pagination.rangeEmpty')
  return t('pagination.range', { from: startIndex.value, to: endIndex.value, total })
})

// فئات المحاذاة - Alignment classes
const alignmentClass = computed(() => {
  switch (props.align) {
    case 'start':
      return 'justify-start'
    case 'center':
      return 'justify-center'
    case 'space-between':
      return 'justify-space-between'
    case 'end':
    default:
      return 'justify-end'
  }
})

// وظائف مساعدة - Helper functions
const clampPage = (p) => Math.min(Math.max(1, p), computedTotalPages.value)
const clampPageSize = (s) => (s > 0 ? s : 10)

// إرسال التغييرات - Emit changes
const emitChange = () => {
  emit('change', { page: pageValue.value, pageSize: pageSizeValue.value, totalPages: lengthValue.value })
}

// معالجات التحديثات - Handle updates
const handleUpdatePage = (p) => {
  const next = clampPage(p)
  if (next === pageValue.value) return
  currentPage.value = next
  emit('update:page', next)
  emitChange()
}

const handleUpdatePageSize = (s) => {
  const nextSize = clampPageSize(Number(s))
  if (nextSize === pageSizeValue.value) return
  currentPageSize.value = nextSize
  currentPage.value = clampPage(1)
  emit('update:pageSize', nextSize)
  // Also emit kebab-case variant to support v-model:page-size
  emit('update:page-size', nextSize)
  emit('update:page', currentPage.value)
  emitChange()
}
</script>

<style scoped>
/* تنسيق بسيط باستخدام Vuetify tokens - Minimal styling using Vuetify tokens */

/* دعم RTL لأيقونات داخل مكوّن الـ pagination */
[dir="rtl"] :deep(.v-pagination .v-btn .v-icon) {
  transform: scaleX(-1);
}

/* منع عكس أيقونات أزرار الصفحة الأولى والأخيرة لأنها تتبدل ديناميكياً */
[dir="rtl"] .pagination-first-btn :deep(.v-icon),
[dir="rtl"] .pagination-last-btn :deep(.v-icon) {
  transform: none !important;
}

/* تحسين التنسيق للصفحات الصغيرة - Better styling for small screens */
@media (max-width: 600px) {
  :deep(.v-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
}

/* Active page styling: primary background and on-primary text */
:deep(.v-pagination .v-btn[aria-current="true"]) {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
}

/* Ensure the inner content is also white */
:deep(.v-pagination .v-btn[aria-current="true"] .v-btn__content) {
  color: rgb(var(--v-theme-on-primary)) !important;
}

/* Preserve active styles on hover */
:deep(.v-pagination .v-btn[aria-current="true"]:hover) {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
}

/* إصلاح مشكلة الصفحة الواحدة - Fix single page issue */
/* عندما تكون هناك صفحة واحدة فقط، نجعلها تبدو نشطة وليست معطلة */
:deep(.v-pagination .v-btn.v-btn--disabled[aria-current="true"]) {
  opacity: 1 !important;
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
  pointer-events: auto !important;
}

:deep(.v-pagination .v-btn.v-btn--disabled[aria-current="true"] .v-btn__content) {
  color: rgb(var(--v-theme-on-primary)) !important;
  opacity: 1 !important;
}

/* إزالة مظهر disabled من الصفحة النشطة */
:deep(.v-pagination .v-btn--disabled[aria-current="true"]) {
  opacity: 1 !important;
}

/* تطبيق disabled على أزرار الانتقال السريع عندما تكون صفحة واحدة فقط */
/* Apply disabled style to first/last page buttons when only one page exists */
.pagination-first-btn.v-btn--disabled,
.pagination-last-btn.v-btn--disabled {
  opacity: 0.5 !important;
  color: rgba(var(--v-theme-on-surface), 0.5) !important;
  pointer-events: none !important;
}

.pagination-first-btn.v-btn--disabled :deep(.v-icon),
.pagination-last-btn.v-btn--disabled :deep(.v-icon) {
  opacity: 0.5 !important;
}
</style>
