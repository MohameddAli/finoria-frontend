<!-- 
  📋 نموذج جاهز للنسخ واللصق
  استخدم هذا النموذج لإنشاء صفحات جديدة بسرعة
-->

<template>
  <v-container id="PageName" fluid tag="section">
    <div>
      <!-- ═══════════════════════════════════════════════ -->
      <!-- Header -->
      <!-- ═══════════════════════════════════════════════ -->
      <v-row align="center" class="mb-6">
        <v-col cols="12" md="6">
          <div class="d-flex align-center">
            <v-avatar color="primary" size="56" class="me-4">
              <v-icon size="32" color="white">mdi-icon-name</v-icon>
            </v-avatar>
            <div>
              <h1 class="text-h4 font-weight-bold mb-1">
                {{ t("pages.pageName.title") }}
              </h1>
              <p class="text-subtitle-1 text-medium-emphasis mb-0">
                {{ t("pages.pageName.subtitle") }}
              </p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6" class="text-md-end">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            size="large"
            elevation="3"
            @click="openAddDialog"
            :disabled="isLoading"
          >
            {{ t("common.add_new") }}
          </v-btn>
        </v-col>
      </v-row>

      <!-- ═══════════════════════════════════════════════ -->
      <!-- Error Alert -->
      <!-- ═══════════════════════════════════════════════ -->
      <v-alert
        v-if="error"
        type="error"
        dismissible
        class="mb-4"
        @click:close="clearError"
      >
        {{ error }}
      </v-alert>

      <!-- ═══════════════════════════════════════════════ -->
      <!-- Data Table -->
      <!-- ═══════════════════════════════════════════════ -->
      <v-data-table
        :headers="tableHeaders"
        :items="displayedItems"
        :loading="isLoading"
        item-value="id"
        class="elevation-1"
        hide-default-footer
      >
        <!-- Actions Column -->
        <template #item.actions="{ item, index }">
          <div class="table-actions-group">
            <v-tooltip :text="t('common.edit')" location="top">
              <template #activator="{ props }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  color="primary"
                  variant="text"
                  v-bind="props"
                  @click="openUpdateDialog(item)"
                ></v-btn>
              </template>
            </v-tooltip>

            <v-tooltip :text="t('common.delete')" location="top">
              <template #activator="{ props }">
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  color="error"
                  variant="text"
                  v-bind="props"
                  @click="confirmDelete(item)"
                ></v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>

      <!-- ═══════════════════════════════════════════════ -->
      <!-- Add Dialog -->
      <!-- ═══════════════════════════════════════════════ -->
      <AddDialog
        v-model="addDialogOpen"
        :title="t('pages.pageName.add')"
        :loading="isLoading"
        :submit-text="t('common.save')"
        :cancel-text="t('common.cancel')"
        @submit="submitAdd"
        @cancel="closeAddDialog"
      >
        <template #form>
          <v-row>
            <!-- حقل 1 -->
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.field1"
                :label="t('attributes.field1')"
                :rules="[(v) => !!v || t('validation.required')]"
                variant="outlined"
                density="comfortable"
                :disabled="isLoading"
              />
            </v-col>

            <!-- حقل 2 -->
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.field2"
                :label="t('attributes.field2')"
                variant="outlined"
                density="comfortable"
                :disabled="isLoading"
              />
            </v-col>

            <!-- حقل Select -->
            <v-col cols="12">
              <v-select
                v-model="form.select_field"
                :items="selectItems"
                item-title="name"
                item-value="id"
                :label="t('attributes.select_field')"
                variant="outlined"
                density="comfortable"
                :disabled="isLoading"
              />
            </v-col>

            <!-- حقل Switch -->
            <v-col cols="12">
              <v-switch
                v-model="form.is_active"
                :label="t('attributes.status')"
                color="success"
                :disabled="isLoading"
                hide-details
              />
            </v-col>
          </v-row>
        </template>
      </AddDialog>

      <!-- ═══════════════════════════════════════════════ -->
      <!-- Update Dialog -->
      <!-- ═══════════════════════════════════════════════ -->
      <UpdateDialog
        v-model="updateDialogOpen"
        :title="t('pages.pageName.edit')"
        :loading="isLoading"
        :submit-text="t('common.save')"
        :cancel-text="t('common.cancel')"
        @submit="submitUpdate"
        @cancel="closeUpdateDialog"
      >
        <template #form>
          <!-- نفس الحقول كما في AddDialog -->
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.field1"
                :label="t('attributes.field1')"
                :rules="[(v) => !!v || t('validation.required')]"
                variant="outlined"
                density="comfortable"
                :disabled="isLoading"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.field2"
                :label="t('attributes.field2')"
                variant="outlined"
                density="comfortable"
                :disabled="isLoading"
              />
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="form.select_field"
                :items="selectItems"
                item-title="name"
                item-value="id"
                :label="t('attributes.select_field')"
                variant="outlined"
                density="comfortable"
                :disabled="isLoading"
              />
            </v-col>

            <v-col cols="12">
              <v-switch
                v-model="form.is_active"
                :label="t('attributes.status')"
                color="success"
                :disabled="isLoading"
                hide-details
              />
            </v-col>
          </v-row>
        </template>
      </UpdateDialog>

      <!-- ═══════════════════════════════════════════════ -->
      <!-- Delete Confirmation Dialog -->
      <!-- ═══════════════════════════════════════════════ -->
      <AppConfirmDialog
        v-model="deleteDialogOpen"
        :title="t('common.confirm_delete')"
        :message="t('common.delete_confirmation')"
        @confirm="performDelete"
        :loading="isLoading"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import AddDialog from "~/components/global/AddDialog.vue";
import UpdateDialog from "~/components/global/UpdateDialog.vue";
import AppConfirmDialog from "~/components/ui/AppConfirmDialog.vue";
// استيراد الـ store الخاص بك
// import { useYourStore } from "~/stores/yourStore";

// ═══════════════════════════════════════════════
// Page Meta
// ═══════════════════════════════════════════════
definePageMeta({
  layout: "dashboard",
  title: "pages.pageName.title",
  subtitle: "pages.pageName.subtitle",
});

// ═══════════════════════════════════════════════
// Composables
// ═══════════════════════════════════════════════
const { t } = useI18n();
// const yourStore = useYourStore();

// ═══════════════════════════════════════════════
// Store State
// ═══════════════════════════════════════════════
// const { items, isLoading, error } = storeToRefs(yourStore);
const items = ref([]);
const isLoading = ref(false);
const error = ref(null);

// ═══════════════════════════════════════════════
// Local State
// ═══════════════════════════════════════════════

// Dialog states
const addDialogOpen = ref(false);
const updateDialogOpen = ref(false);
const deleteDialogOpen = ref(false);

// Editing state
const editingId = ref<string | null>(null);
const pendingDeleteId = ref<string | null>(null);

// Pagination
const page = ref(1);
const pageSize = ref(10);

// Form model
const form = reactive({
  field1: "",
  field2: "",
  select_field: "",
  is_active: true,
});

// ═══════════════════════════════════════════════
// Computed
// ═══════════════════════════════════════════════

// Table headers
const tableHeaders = computed(() => [
  {
    title: t("attributes.id"),
    key: "id",
    sortable: true,
  },
  {
    title: t("attributes.field1"),
    key: "field1",
    sortable: true,
  },
  {
    title: t("attributes.field2"),
    key: "field2",
    sortable: true,
  },
  {
    title: t("common.actions"),
    key: "actions",
    sortable: false,
    align: "center" as const,
  },
]);

// Select items (مثال)
const selectItems = computed(() => [
  { id: "1", name: "خيار 1" },
  { id: "2", name: "خيار 2" },
]);

// Pagination
const totalPages = computed(() =>
  Math.max(1, Math.ceil(items.value.length / pageSize.value))
);

const displayedItems = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return items.value.slice(start, end);
});

// ═══════════════════════════════════════════════
// Add Dialog Methods
// ═══════════════════════════════════════════════

function openAddDialog() {
  resetForm();
  addDialogOpen.value = true;
}

function closeAddDialog() {
  addDialogOpen.value = false;
  resetForm();
}

async function submitAdd() {
  try {
    // await yourStore.create(form);
    console.log("Creating:", form);
    closeAddDialog();
    useToast().success(t("common.created_successfully"));
  } catch (err) {
    console.error("Failed to create:", err);
    useToast().error(t("errors.create_failed"));
  }
}

// ═══════════════════════════════════════════════
// Update Dialog Methods
// ═══════════════════════════════════════════════

function openUpdateDialog(item: any) {
  editingId.value = item.id;
  Object.assign(form, { ...item });
  updateDialogOpen.value = true;
}

function closeUpdateDialog() {
  updateDialogOpen.value = false;
  resetForm();
  editingId.value = null;
}

async function submitUpdate() {
  if (!editingId.value) return;

  try {
    // await yourStore.update(editingId.value, form);
    console.log("Updating:", editingId.value, form);
    closeUpdateDialog();
    useToast().success(t("common.updated_successfully"));
  } catch (err) {
    console.error("Failed to update:", err);
    useToast().error(t("errors.update_failed"));
  }
}

// ═══════════════════════════════════════════════
// Delete Methods
// ═══════════════════════════════════════════════

function confirmDelete(item: any) {
  pendingDeleteId.value = item.id;
  deleteDialogOpen.value = true;
}

async function performDelete() {
  if (!pendingDeleteId.value) return;

  try {
    // await yourStore.remove(pendingDeleteId.value);
    console.log("Deleting:", pendingDeleteId.value);
    deleteDialogOpen.value = false;
    pendingDeleteId.value = null;
    useToast().success(t("common.deleted_successfully"));
  } catch (err) {
    console.error("Failed to delete:", err);
    useToast().error(t("errors.delete_failed"));
  }
}

// ═══════════════════════════════════════════════
// Helper Methods
// ═══════════════════════════════════════════════

function resetForm() {
  Object.assign(form, {
    field1: "",
    field2: "",
    select_field: "",
    is_active: true,
  });
  editingId.value = null;
}

function clearError() {
  error.value = null;
  // أو: yourStore.clearError();
}

// ═══════════════════════════════════════════════
// Lifecycle
// ═══════════════════════════════════════════════

onMounted(async () => {
  try {
    // await yourStore.fetchAll();
    console.log("Fetching data...");
  } catch (err) {
    console.error("Failed to fetch data:", err);
  }
});
</script>

<style scoped>
/* يمكنك إضافة أنماط مخصصة هنا */
</style>
