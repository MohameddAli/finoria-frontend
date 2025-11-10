<template>
  <v-card class="app-data-table-card" elevation="2">
    <!-- Title + Actions -->
    <v-card-title class="d-flex align-center justify-space-between pa-6">
      <div class="d-flex align-center">
        <slot name="title">
          <span v-if="title" class="text-h6 font-weight-bold">{{ title }}</span>
        </slot>
      </div>
      <div class="d-flex align-center">
        <slot name="actions">
          <v-btn
            v-if="actionLabel"
            variant="text"
            size="small"
            color="primary"
            @click="$emit('action:click')"
          >
            {{ actionLabel }}
          </v-btn>
        </slot>
      </div>
    </v-card-title>

    <v-divider />

    <!-- Data Table -->
    <v-data-table
      class="app-data-table"
      :headers="processedHeaders"
      :items="items"
      :items-per-page="pageSize"
      :page="page"
      :sort-by="sortBy"
      :multi-sort="multiSort"
      :density="dense ? 'compact' : 'default'"
      hide-default-footer
      @click:row="row => $emit('row:click', row)"
      @update:page="$emit('update:page', $event)"
      @update:sort-by="$emit('update:sortBy', $event)"
    >
      <!-- Custom cell slots -->
      <template v-for="col in processedHeaders" v-slot:[`item.${col.value}`]="{ item }">
        <slot :name="`cell-${col.value}`" :item="item" :value="item[col.value]">
          <span class="text-body-2">{{ item[col.value] }}</span>
        </slot>
      </template>
    </v-data-table>

    <!-- الباجينيشن المخصص - Custom Pagination -->
    <div v-if="showPagination" class="table-pagination pa-4">
      <AppPagination
        :page="page"
        :page-size="pageSize"
        :total-items="totalItems"
        v-bind="paginationOptions"
        @update:page="$emit('update:page', $event)"
        @update:pageSize="$emit('update:pageSize', $event)"
        @change="$emit('change', $event)"
      />
    </div>
  </v-card>
</template>

<script setup>
import AppPagination from '~/components/pagination/AppPagination.vue';

// تعريف الخصائص - Props definition
const props = defineProps({
  // البيانات الأساسية - Core data props
  title: String,
  items: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  dense: { type: Boolean, default: false },

  // خصائص الترتيب - Sorting props
  sortBy: { type: Array, default: () => [] },
  multiSort: { type: Boolean, default: false },

  // الإجراءات - Actions
  actionLabel: { type: String, default: '' },

  // خصائص الباجينيشن الأساسية فقط - Essential pagination props only
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  totalItems: { type: Number, default: 0 },
  showPagination: { type: Boolean, default: true },

  // خيارات الباجينيشن (اختيارية) - Pagination options (optional)
  paginationOptions: {
    type: Object,
    default: () => ({
      length: undefined,
      totalVisible: 5,
      pageSizes: [5, 10, 20, 50, 100],
      showPageSize: true,
      showRange: true,
      showFirstLast: true,
      size: 'small',
      variant: 'outlined',
      disabled: false,
      align: 'center'
    })
  },
})

// معالجة الأعمدة لضمان التوافق مع Vuetify 3
// Process headers to ensure Vuetify 3 compatibility
const processedHeaders = computed(() => {
  return props.columns.map(col => ({
    ...col,
    value: col.value || col.key, // استخدام value أو key كبديل
    sortable: col.sortable !== false, // تفعيل الترتيب افتراضياً
    align: col.align || 'start',
    width: col.width
  }))
})

defineEmits([
  'update:page',
  'update:pageSize',
  'change',
  'row:click',
  'action:click',
  'update:sortBy',
])

// منطق بسيط ونظيف - Clean and simple logic
</script>

<style scoped>
.app-data-table-card {
  border-radius: 16px;
  border: 1px solid rgba(var(--v-border-color), 0.08);
}

/* Table headers */
:deep(.v-data-table thead th) {
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
  font-weight: 600;
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

:deep(.v-data-table thead th:hover) {
  background-color: rgba(var(--v-theme-surface-variant), 0.4);
}

/* Sort arrows styling */
:deep(.v-data-table thead th .v-data-table-header__icon) {
  margin-inline-start: 4px;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

:deep(.v-data-table thead th:hover .v-data-table-header__icon) {
  opacity: 1;
}

:deep(.v-data-table thead th.v-data-table__th--sorted .v-data-table-header__icon) {
  opacity: 1;
  color: rgb(var(--v-theme-primary));
}

/* RTL support for sort arrows - handled by margin-inline-start */

/* Table rows */
:deep(.v-data-table tbody tr) {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.06);
  transition: background-color 0.2s ease;
}
:deep(.v-data-table tbody tr:hover) {
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
}
:deep(.v-data-table tbody tr:last-child) {
  border-bottom: none;
}

/* Pagination */
.table-pagination {
  border-top: 1px solid rgba(var(--v-border-color), 0.06);
}
</style>
