<template>
  <v-container id="Orders" fluid tag="section">
    <div>
      <v-card class="my-4 mx-auto">
        <v-card-title>
          <div class="d-flex justify-space-between align-center">
            <div>{{ $t("pages.orders.title") }}</div>
            <!-- Button container -->
            <div class="d-flex">
              <v-btn fab small color="primary" @click="openAddDialog">
                <v-icon color="white">mdi-plus</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card-title>

        <!-- Start Add form dialog -->
        <v-dialog v-model="addDialogOpen" max-width="1200px">
          <v-card>
            <v-card-title>{{ t("orders.add") }}</v-card-title>
            <v-card-text>
              <v-form class="px-3">
                <v-row class="pt-5">
                  <v-col cols="12" sm="6" lg="3">
                    <v-select
                      :label="t('attributes.bank')"
                      :items="bankOptions"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
                    <v-select :label="t('attributes.branch')" clearable />
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
                    <v-select
                      :label="t('attributes.checkbooktype')"
                      :items="checkbookOptions"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
                    <v-select
                      :label="t('attributes.micrtype')"
                      :items="micrOptions"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
                    <v-select
                      :label="t('attributes.account_type')"
                      :items="accountOptions"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
                    <v-select
                      :label="t('attributes.checkbook_size')"
                      :items="sizeOptions"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
                    <v-text-field
                      :label="t('attributes.batch')"
                      counter
                      :maxlength="32"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
                    <v-file-input
                      :label="t('attributes.file')"
                      show-size
                      counter
                    />
                  </v-col>
                  <v-col cols="12" sm="6" lg="3">
                    <v-checkbox
                      :label="t('attributes.override_account_name')"
                      color="primary"
                    />
                  </v-col>
                </v-row>
                <v-divider />
                <div class="d-flex justify-end mt-4">
                  <v-btn color="primary" @click="closeAddDialog">{{
                    t("common.save")
                  }}</v-btn>
                  <v-btn variant="outlined" @click="closeAddDialog">{{
                    t("common.cancel")
                  }}</v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>

        <!-- Start Cancel Order form dialog -->
        <v-dialog v-model="cancelDialogOpen" max-width="600px">
          <v-card>
            <v-card-title>{{ t("options.cancelorder") }}</v-card-title>
            <v-card-text>
              <v-form class="px-3">
                <v-text-field
                  :label="t('attributes.cancel_reason')"
                  counter
                  :maxlength="32"
                />
                <div class="d-flex justify-end mt-4">
                  <v-btn color="primary" @click="closeCancelDialog">{{
                    t("common.confirm")
                  }}</v-btn>
                  <v-btn variant="outlined" @click="closeCancelDialog">{{
                    t("common.cancel")
                  }}</v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>

        <!-- Filters toggle button -->
        <v-card-text>
          <v-divider />
          <div class="d-flex align-center mb-4">
            <v-btn outlined color="primary" @click="toggleFilters">
              <v-icon left>mdi-filter-variant</v-icon>
              {{ t("common.filter") }}
            </v-btn>
          </div>

          <v-expand-transition>
            <div v-show="filtersOpen">
              <v-form class="px-4">
                <v-row align="center">
                  <v-col cols="12" sm="3" lg="3">
                    <v-text-field :label="t('attributes.id')" clearable />
                  </v-col>
                  <v-col cols="12" sm="3" lg="3">
                    <v-text-field :label="t('attributes.batch')" clearable />
                  </v-col>
                  <v-col cols="12" sm="3" lg="3">
                    <v-select :label="t('attributes.bank')" clearable />
                  </v-col>
                  <v-col cols="12" sm="3" lg="3">
                    <v-select :label="t('attributes.branch')" clearable />
                  </v-col>
                  <v-col cols="12" sm="3" lg="3">
                    <v-select
                      :label="t('attributes.checkbooktype')"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12" sm="3" lg="3">
                    <v-text-field :label="t('search.from_date')" clearable />
                  </v-col>
                  <v-col cols="12" sm="4" lg="3">
                    <v-text-field :label="t('search.to_date')" clearable />
                  </v-col>
                  <v-col cols="12" sm="3" lg="3">
                    <v-text-field :label="t('attributes.ftpid')" clearable />
                  </v-col>
                  <v-col cols="12" sm="3" lg="3">
                    <v-select
                      :label="t('attributes.priority')"
                      :items="priorityOptions"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12" sm="3" lg="3">
                    <v-select
                      :label="t('attributes.not_canceled_at_title')"
                      :items="notCanceledOptions"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12" sm="4" lg="3">
                    <v-text-field
                      :label="t('search.canceled_from')"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12" sm="3" lg="3">
                    <v-text-field :label="t('search.canceled_to')" clearable />
                  </v-col>
                  <v-col cols="12" sm="2" lg="2" class="mb-2">
                    <v-btn color="primary" type="submit">
                      <v-icon color="white">mdi-magnify</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </div>
          </v-expand-transition>

          <v-divider />

          <v-data-table
            :headers="tableHeaders"
            :items="displayedOrders"
            :items-per-page="pageSize"
            hide-default-footer
            class="elevation-1"
          >
            <!-- eslint-disable-next-line vue/no-unused-vars -->
            <template v-slot:[`item.order__created_at`]="{ item }">
              <span>{{ item.order__created_at || "N/A" }}</span>
            </template>
            <!-- eslint-disable-next-line vue/no-unused-vars -->
            <template v-slot:[`item.order__priority`]="{ item }">
              <v-icon :color="item.order__priority ? 'green' : 'red'">
                {{ item.order__priority ? "mdi-check" : "mdi-close" }}
              </v-icon>
            </template>
            <!-- eslint-disable-next-line vue/no-unused-vars -->
            <template v-slot:[`item.order__canceled_at`]="{ item }">
              <v-chip small :color="item.order__canceled_at ? 'red' : 'green'">
                {{
                  item.order__canceled_at
                    ? t("orders.not_canceled_at.high")
                    : t("orders.not_canceled_at.low")
                }}
              </v-chip>
            </template>
            <!-- eslint-disable-next-line vue/no-unused-vars -->
            <template v-slot:[`item.cancel_date`]="{ item }">
              <span>{{ item.order__canceled_at || "N/A" }}</span>
            </template>
            <!-- eslint-disable-next-line vue/no-unused-vars -->
            <template v-slot:[`item.actions`]="{ item }">
              <div class="table-actions-group">
                <v-btn x-small fab color="primary" @click="openDetailsDialog">
                  <v-icon color="white">mdi-arrow-left-bold</v-icon>
                </v-btn>
              </div>
            </template>
            <!-- eslint-disable-next-line vue/no-unused-vars -->
            <template v-slot:[`item.Print`]="{ item }">
              <div class="table-actions-group">
                <v-btn x-small fab color="primary">
                  <v-icon color="white">mdi-printer</v-icon>
                </v-btn>
              </div>
            </template>
            <!-- eslint-disable-next-line vue/no-unused-vars -->
            <template v-slot:[`item.cancel`]="{ item }">
              <div class="table-actions-group">
                <v-btn x-small fab color="primary" @click="openCancelDialog">
                  <v-icon color="white">mdi-cancel</v-icon>
                </v-btn>
              </div>
            </template>
          </v-data-table>

          <!-- details modal -->
          <v-dialog
            v-model="detailsDialogOpen"
            max-width="1200px"
            width="90%"
            max-height="90vh"
            scrollable
          >
            <v-card>
              <v-card-title>{{ t("orders.details") }}</v-card-title>
              <v-card-text>
                <p>{{ t("orders.details_placeholder") }}</p>
                <div class="d-flex justify-end">
                  <v-btn @click="closeDetailsDialog">{{
                    t("common.close")
                  }}</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>

          <!-- Start pagination -->
          <div class="d-flex justify-end mt-4">
            <AppPagination
              :page="page"
              :length="totalPages"
              :total-items="mockOrders.length"
              :page-size="pageSize"
              :page-sizes="[5, 10, 20, 50, 100]"
              :total-visible="5"
              :dense="false"
              :disabled="false"
              :show-page-size="true"
              :show-range="true"
              :show-first-last="true"
              :color="paginationColor"
              align="end"
              size="small"
              variant="outlined"
              @update:page="handleUpdatePage"
              @update:page-size="handleUpdatePageSize"
            />
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
// 🔒 صفحة محمية
definePageMeta({
  layout: "dashboard",
  title: "pages.movies.title",
  subtitle: "pages.movies.subtitle",
});

// Import AppPagination component
import AppPagination from "~/components/pagination/AppPagination.vue";

// Use i18n for translations
const { t } = useI18n();

// Reactive variables for UI state
const addDialogOpen = ref(false);
const cancelDialogOpen = ref(false);
const detailsDialogOpen = ref(false);
const filtersOpen = ref(false);
const page = ref(1);
const pageSize = ref(10); // Items per page

// Empty data - replace with real API data
const mockOrders = ref([]);

// Options for Selects
const bankOptions = ["Bank A", "Bank B", "Bank C", "Bank D"];
const checkbookOptions = ["Type 1", "Type 2", "Type 3"];
const micrOptions = ["MICR1", "MICR2", "MICR3"];
const accountOptions = ["Personal", "Business"];
const sizeOptions = ["Small", "Medium", "Large"];
const priorityOptions = ["High", "Low"];
const notCanceledOptions = ["High", "Low"];

// Computed properties for pagination
const totalPages = computed(() =>
  Math.max(1, Math.ceil(mockOrders.value.length / pageSize.value))
);
const displayedOrders = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return mockOrders.value.slice(start, end);
});

// Computed property for pagination color to match the gold theme
const paginationColor = computed(() => "primary");

// Table Headers (aligned with dashboard style: title/key/width/align/sortable)
const tableHeaders = computed(() => [
  {
    title: t("attributes.id"),
    key: "order_id",
    width: 100,
    align: "start",
    sortable: true,
  },
  {
    title: t("attributes.batch"),
    key: "order__batch",
    width: 140,
    align: "start",
    sortable: true,
  },
  {
    title: t("attributes.bank"),
    key: "order__bank",
    width: 160,
    align: "start",
    sortable: true,
  },
  {
    title: t("attributes.branch"),
    key: "order__branch",
    width: 160,
    align: "start",
    sortable: true,
  },
  {
    title: t("attributes.checkbooktype"),
    key: "order__checkbooktype",
    width: 180,
    align: "start",
    sortable: true,
  },
  {
    title: t("attributes.created_at"),
    key: "order__created_at",
    width: 160,
    align: "start",
    sortable: true,
  },
  {
    title: t("attributes.priority"),
    key: "order__priority",
    width: 120,
    align: "center",
    sortable: true,
  },
  {
    title: t("attributes.canceled_at"),
    key: "order__canceled_at",
    width: 140,
    align: "center",
    sortable: true,
  },
  {
    title: t("attributes.cancel_date"),
    key: "cancel_date",
    width: 140,
    align: "start",
    sortable: true,
  },
  {
    title: t("common.actions"),
    key: "actions",
    width: 120,
    align: "center",
    sortable: false,
  },
  {
    title: t("common.print"),
    key: "Print",
    width: 100,
    align: "center",
    sortable: false,
  },
  {
    title: t("common.cancel"),
    key: "cancel",
    width: 120,
    align: "center",
    sortable: false,
  },
]);

// Functions for UI interactions
const openAddDialog = () => {
  addDialogOpen.value = true;
};
const closeAddDialog = () => {
  addDialogOpen.value = false;
};
const openCancelDialog = () => {
  cancelDialogOpen.value = true;
};
const closeCancelDialog = () => {
  cancelDialogOpen.value = false;
};
const openDetailsDialog = () => {
  detailsDialogOpen.value = true;
};
const closeDetailsDialog = () => {
  detailsDialogOpen.value = false;
};
const toggleFilters = () => {
  filtersOpen.value = !filtersOpen.value;
};

// Pagination handlers
const handleUpdatePage = (newPage: number) => {
  page.value = newPage;
};
const handleUpdatePageSize = (newPageSize: number) => {
  pageSize.value = newPageSize;
  page.value = 1; // Reset to first page when page size changes
};
</script>

<style scoped>
/* Minimal scoped styles */
.v-data-table {
  margin-top: 16px;
}

/* Match dashboard table header styling */
:deep(.v-data-table thead th) {
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
  font-weight: 600;
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
}

/* Row hover effect similar to dashboard */
:deep(.v-data-table tbody tr:hover) {
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
}
</style>
