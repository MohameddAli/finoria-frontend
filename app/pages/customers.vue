<template>
  <v-container id="Customers" fluid tag="section">
    <v-card class="my-4 mx-auto w-100" rounded="lg">
      <v-card-title class="d-flex align-center pa-4">
        <v-text-field
          v-model.trim="filters.q"
          :label="$t('common.search')"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          class="mr-4"
          style="max-width: 350px"
        />
        <v-spacer />
        <v-btn icon variant="text" size="small" class="mr-2">
          <v-icon>mdi-filter-variant</v-icon>
        </v-btn>
        <v-btn icon variant="text" size="small" @click="refreshData">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="paged"
        :loading="isLoading"
        show-select
        class="elevation-0"
        hide-default-footer
      >
        <template #item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="40" color="primary">
              <span class="text-subtitle-2 font-weight-bold text-white">
                {{ item.name?.charAt(0).toUpperCase() || "U" }}
              </span>
            </v-avatar>
            <div class="ml-4">
              <div class="font-weight-bold text-body-1">
                {{ item.name }}
              </div>
            </div>
          </div>
        </template>

        <template #item.created_at="{ item }">
          <span class="text-body-2">{{ item.created_at }}</span>
        </template>

        <template #item.actions="{ item }">
          <div class="table-actions-group">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              @click="() => console.log('Edit user:', item.id)"
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
              @click="() => console.log('Delete user:', item.id)"
            />
          </div>
        </template>
      </v-data-table>
      <v-divider />
      <v-card-text>
        <AppPagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :total-items="filtered.length"
          :total-visible="7"
          :show-range="true"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import AppPagination from "~/components/pagination/AppPagination.vue";
import { useUsersStore } from "~/stores/users/storeUsers";

// 🔒 صفحة محمية
definePageMeta({
  layout: "dashboard",
  title: "pages.customers.title",
  subtitle: "pages.customers.subtitle",
});

const { t } = useI18n();
const usersStore = useUsersStore();
const { users, isLoading } = storeToRefs(usersStore);

const filters = reactive({ q: "" });
const selected = ref([]);
const page = ref(1);
const pageSize = ref(10);

// Fetch users on mount
onMounted(async () => {
  try {
    await usersStore.fetchUsers();
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
});

const headers = computed(() => [
  { title: t("table.name"), key: "name", sortable: false, width: "30%" },
  { title: t("table.email"), key: "email", sortable: false, width: "30%" },
  {
    title: t("table.createdAt") || "تاريخ الإنشاء",
    key: "created_at",
    sortable: false,
    width: "25%",
  },
  {
    title: t("table.more"),
    key: "actions",
    sortable: false,
    align: "center" as const,
    width: "15%",
  },
]);

// Transform users data for table display
const all = computed(() => users.value || []);

const filtered = computed(() => {
  const q = filters.q?.toLowerCase() || "";
  if (!q) return all.value;
  return all.value.filter((user) =>
    [user.name, user.email]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(q))
  );
});

const paged = computed(() => {
  return filtered.value.slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value
  );
});

const totalPages = computed(() =>
  Math.ceil(filtered.value.length / pageSize.value)
);

const refreshData = async () => {
  try {
    await usersStore.fetchUsers();
  } catch (error) {
    console.error("Failed to refresh users:", error);
  }
};
</script>

<style scoped>
:deep(.v-data-table-header__content) {
  font-weight: 600 !important;
  color: #4b5563 !important; /* text-gray-600 */
}

:deep(.v-chip) {
  font-weight: 500;
}
</style>
