<template>
  <!-- حاوية الباجينيشن - Pagination container -->
  <div class="pagination-wrapper d-flex align-center flex-wrap gap-2" :class="alignmentClass">
    <!-- ملخص النطاق - Range summary -->
    <div v-if="showRange && rangeText" class="text-caption text-medium-emphasis">
      {{ rangeText }}
    </div>

    <!-- محدد حجم الصفحة - Page size selector -->
    <div v-if="showPageSize" class="d-flex align-center">
      <span class="text-caption me-2">{{ t('pagination.itemsPerPage') || 'العناصر في الصفحة' }}</span>
      <v-select
        :model-value="actualPageSize"
        :items="pageSizes"
        :density="dense ? 'compact' : 'comfortable'"
        variant="outlined"
        hide-details
        style="max-width: 92px"
        @update:model-value="handleUpdatePageSize"
      />
    </div>

    <!-- تحكم الباجينيشن - Pagination control -->
    <div class="d-flex align-center gap-1">
      <!-- زر الانتقال لأول صفحة - First page button -->
      <v-btn
        v-if="showFirstLast"
        :size="size"
        variant="text"
        :icon="isRTL ? 'mdi-page-last' : 'mdi-page-first'"
        :density="dense ? 'compact' : 'default'"
        class="pagination-first-btn"
        :disabled="lastPage === 1"
        @click="handlePageChange(1)"
      />

      <!-- عنصر الباجينيشن الأساسي - Main pagination component -->
      <v-pagination
        :model-value="currentPage"
        :length="lastPage"
        :total-visible="totalVisible"
        :density="dense ? 'compact' : 'default'"
        :size="size"
        :color="color"
        :active-color="activeColor"
        @update:model-value="handlePageChange"
      />

      <!-- زر الانتقال لآخر صفحة - Last page button -->
      <v-btn
        v-if="showFirstLast"
        :size="size"
        variant="text"
        :icon="isRTL ? 'mdi-page-first' : 'mdi-page-last'"
        :density="dense ? 'compact' : 'default'"
        class="pagination-last-btn"
        :disabled="lastPage === 1"
        @click="handlePageChange(lastPage)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'

interface Props {
  data?: { results?: any[]; count?: number }
  page?: number
  length?: number
  totalItems?: number
  perPage?: number
  pageSize?: number
  pageSizes?: number[]
  totalVisible?: number
  size?: string
  showPageSize?: boolean
  showRange?: boolean
  showFirstLast?: boolean
  align?: 'start' | 'center' | 'end' | 'space-between'
  dense?: boolean
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({ results: [], count: 0 }),
  perPage: 10,
  pageSizes: () => [5, 10, 20, 50, 100],
  totalVisible: 10,
  size: 'small',
  showPageSize: true,
  showRange: true,
  showFirstLast: false,
  align: 'end',
  dense: false,
  color: 'primary',
})

const emit = defineEmits(['page-changed', 'update:page', 'update:pageSize', 'update:page-size'])

const route = useRoute()
const { t, locale } = useI18n()
const theme = useTheme()

const isRTL = computed(() => locale.value === 'ar')
const activeColor = computed(() => theme.global.current.value.colors.primary)
const actualPageSize = computed(() => props.pageSize || props.perPage)
const currentPage = computed(() => props.page !== undefined ? props.page : Number(route.query.page) || 1)
const total = computed(() => props.totalItems !== undefined ? props.totalItems : props.data?.count || 0)
const from = computed(() => total.value === 0 ? 0 : (currentPage.value - 1) * actualPageSize.value + 1)
const to = computed(() => total.value === 0 ? 0 : Math.min(currentPage.value * actualPageSize.value, total.value))
const lastPage = computed(() => props.length !== undefined ? props.length : total.value ? Math.ceil(total.value / actualPageSize.value) : 1)
const rangeText = computed(() => !props.showRange ? '' : total.value <= 0 ? t('pagination.rangeEmpty') || 'لا توجد نتائج' : t('pagination.showing_from_to_items', { from: from.value, to: to.value, total: total.value }))
const alignmentClass = computed(() => ({ 'justify-start': props.align === 'start', 'justify-center': props.align === 'center', 'justify-space-between': props.align === 'space-between', 'justify-end': props.align === 'end' }))

watch(() => route.query.page, (newPage) => {
  if (props.page === undefined) {
    const pageNum = Number(newPage) || 1
    if (pageNum !== currentPage.value) handlePageChange(pageNum)
  }
})

const handlePageChange = (page: number) => {
  emit('page-changed', page)
  emit('update:page', page)
}

const handleUpdatePageSize = (size: number) => {
  emit('update:pageSize', size)
  emit('update:page-size', size)
  emit('update:page', 1)
  emit('page-changed', 1)
}
</script>

<style scoped>
/* تنسيقات بسيطة للمكون - Simple component styling */
.pagination-wrapper {
  width: 100%;
}

/* دعم RTL للأيقونات - RTL support for icons */
[dir="rtl"] :deep(.v-pagination .v-btn .v-icon) {
  transform: scaleX(-1);
}

/* تنسيق الصفحة النشطة - Active page styling */
:deep(.v-pagination .v-btn[aria-current="true"]) {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-pagination .v-btn[aria-current="true"] .v-btn__content) {
  color: rgb(var(--v-theme-on-primary)) !important;
}

:deep(.v-pagination .v-btn[aria-current="true"]:hover) {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
  opacity: 0.9;
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

/* تحسين العرض على الشاشات الصغيرة - Better mobile display */
@media (max-width: 600px) {
  :deep(.v-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .pagination-wrapper :deep(.v-row) {
    gap: 0.5rem;
  }
}
</style>
