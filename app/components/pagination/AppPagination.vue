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
interface Props {
  page?: number
  pageSize?: number
  totalItems?: number
  length?: number
  pageSizes?: number[]
  totalVisible?: number
  dense?: boolean
  showPageSize?: boolean
  showRange?: boolean
  showFirstLast?: boolean
  align?: 'start' | 'center' | 'end' | 'space-between'
  size?: string
  color?: string
  activeColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  length: 1,
  pageSizes: () => [5, 10, 20, 50, 100],
  totalVisible: 5,
  dense: false,
  showPageSize: true,
  showRange: true,
  showFirstLast: true,
  align: 'center',
  size: 'small',
  color: 'primary',
  activeColor: 'primary',
})

const emit = defineEmits(['update:page', 'update:pageSize', 'update:page-size', 'change'])
const { t, locale } = useI18n()

const isRTL = computed(() => locale.value === 'ar')
const currentPage = ref(props.page)
const currentPageSize = ref(props.pageSize)

watch(() => props.page, (n) => { if (n !== currentPage.value) currentPage.value = n })
watch(() => props.pageSize, (n) => { if (n !== currentPageSize.value) currentPageSize.value = n })

const computedTotalPages = computed(() => {
  if (props.length && props.length > 0) return props.length
  const calc = Math.ceil((props.totalItems || 0) / (currentPageSize.value || 1))
  return Math.max(1, calc)
})

const clampPage = (p: number) => Math.min(Math.max(1, p), computedTotalPages.value)
const clampPageSize = (s: number) => s > 0 ? s : 10

const pageValue = computed(() => clampPage(currentPage.value))
const pageSizeValue = computed(() => clampPageSize(currentPageSize.value))
const lengthValue = computed(() => computedTotalPages.value)
const startIndex = computed(() => (pageValue.value - 1) * pageSizeValue.value + 1)
const endIndex = computed(() => Math.min(pageValue.value * pageSizeValue.value, props.totalItems ?? 0))
const rangeText = computed(() => {
  if (!props.showRange) return ''
  const total = props.totalItems ?? 0
  if (total <= 0) return t('pagination.rangeEmpty')
  return t('pagination.range', { from: startIndex.value, to: endIndex.value, total })
})

const alignmentClass = computed(() => {
  const m: Record<string, string> = { start: 'justify-start', center: 'justify-center', 'space-between': 'justify-space-between', end: 'justify-end' }
  return m[props.align] || 'justify-end'
})

const emitChange = () => emit('change', { page: pageValue.value, pageSize: pageSizeValue.value, totalPages: lengthValue.value })

const handleUpdatePage = (p: number) => {
  const next = clampPage(p)
  if (next === pageValue.value) return
  currentPage.value = next
  emit('update:page', next)
  emitChange()
}

const handleUpdatePageSize = (s: number) => {
  const nextSize = clampPageSize(Number(s))
  if (nextSize === pageSizeValue.value) return
  currentPageSize.value = nextSize
  currentPage.value = clampPage(1)
  emit('update:pageSize', nextSize)
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
