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
// @ts-nocheck
/**
 * Pagination Component - مكون الباجينيشن
 * يدعم Nuxt 4 و Vuetify 3 مع دعم RTL والثيم
 * Supports Nuxt 4 & Vuetify 3 with RTL and theme support
 */

import { useTheme } from 'vuetify'

// تعريف الخصائص - Props definition
const props = defineProps({
  // بيانات الباجينيشن (data.results, data.count) - Pagination data
  data: {
    type: Object,
    default: () => ({ results: [], count: 0 })
  },
  // رقم الصفحة الحالية - Current page number
  page: {
    type: Number,
    default: undefined
  },
  // إجمالي عدد الصفحات - Total number of pages
  length: {
    type: Number,
    default: undefined
  },
  // إجمالي عدد العناصر - Total items count
  totalItems: {
    type: Number,
    default: undefined
  },
  // عدد العناصر في كل صفحة - Items per page
  perPage: {
    type: Number,
    default: 10
  },
  // اسم بديل لـ perPage - Alternative name for perPage
  pageSize: {
    type: Number,
    default: undefined
  },
  // خيارات أحجام الصفحات - Page size options
  pageSizes: {
    type: Array,
    default: () => [5, 10, 20, 50, 100]
  },
  // عدد الأزرار المرئية - Number of visible pagination buttons
  totalVisible: {
    type: Number,
    default: 10
  },
  // حجم الأزرار - Button size
  size: {
    type: String,
    default: 'small'
  },
  // عرض محدد حجم الصفحة - Show page size selector
  showPageSize: {
    type: Boolean,
    default: true
  },
  // عرض النطاق - Show range text
  showRange: {
    type: Boolean,
    default: true
  },
  // عرض أزرار الانتقال للأولى والأخيرة - Show first/last buttons
  showFirstLast: {
    type: Boolean,
    default: false
  },
  // المحاذاة - Alignment
  align: {
    type: String,
    default: 'end',
    validator: (value) => ['start', 'center', 'end', 'space-between'].includes(value)
  },
  // مدمج - Dense mode
  dense: {
    type: Boolean,
    default: false
  },
  // اللون - Color
  color: {
    type: String,
    default: 'primary'
  }
})

// تعريف الأحداث - Events definition
const emit = defineEmits(['page-changed', 'update:page', 'update:pageSize', 'update:page-size'])

// استخدام composables من Nuxt
const route = useRoute()
const { t, locale } = useI18n()

// الحصول على الثيم من Vuetify
const theme = useTheme()

// التحقق من اتجاه اللغة - Check language direction
const isRTL = computed(() => locale.value === 'ar')

// لون الصفحة النشطة من الثيم - Active page color from theme
const activeColor = computed(() => theme.global.current.value.colors.primary)

// حجم الصفحة الفعلي - Actual page size
const actualPageSize = computed(() => props.pageSize || props.perPage)

// رقم الصفحة الحالية - Current page
const currentPage = computed(() => props.page !== undefined ? props.page : Number(route.query.page) || 1)

// مراقبة تغيير route.query.page - Watch route.query.page changes (فقط إذا لم يتم تمرير page كـ prop)
watch(() => route.query.page, (newPage) => {
  if (props.page === undefined) {
    const pageNum = Number(newPage) || 1
    if (pageNum !== currentPage.value) {
      handlePageChange(pageNum)
    }
  }
})

// إجمالي العناصر - Total items count
const total = computed(() => {
  if (props.totalItems !== undefined) return props.totalItems
  return props.data?.count || 0
})

// حساب العنصر الأول - Calculate first item number
const from = computed(() => {
  if (total.value === 0) return 0
  return (currentPage.value - 1) * actualPageSize.value + 1
})

// حساب العنصر الأخير - Calculate last item number
const to = computed(() => {
  if (total.value === 0) return 0
  return Math.min(currentPage.value * actualPageSize.value, total.value)
})

// حساب عدد الصفحات - Calculate total pages
const lastPage = computed(() => {
  if (props.length !== undefined) return props.length
  if (total.value) {
    return Math.ceil(total.value / actualPageSize.value)
  }
  return 1
})

// نص نطاق العرض مع الترجمة - Range text with translation
const rangeText = computed(() => {
  if (!props.showRange) return ''
  if (total.value <= 0) {
    return t('pagination.rangeEmpty') || 'لا توجد نتائج'
  }
  // استخدام الترجمة مع المعاملات
  return t('pagination.showing_from_to_items', {
    from: from.value,
    to: to.value,
    total: total.value
  })
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

// معالج تغيير الصفحة - Page change handler
const handlePageChange = (page) => {
  // إطلاق الأحداث - Emit events
  emit('page-changed', page)
  emit('update:page', page)
}

// معالج تغيير حجم الصفحة - Page size change handler
const handleUpdatePageSize = (size) => {
  emit('update:pageSize', size)
  emit('update:page-size', size)
  // إعادة تعيين الصفحة إلى 1
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
