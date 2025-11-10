<template>
  <div class="permissions-manager">
    <v-row>
      <!-- Assigned Permissions Table -->
      <v-col cols="12" lg="6">
        <v-card class="mb-4">
          <v-card-title class="bg-success white--text">
            <v-icon color="white" :left="!isRTL" :right="isRTL"
              >mdi-shield-check</v-icon
            >
            {{ $t("pages.roles.assignedPermissions") }}
            <v-spacer />
            <v-chip small color="white" text-color="success">
              {{ selectedAssigned.length }} / {{ localAssigned.length }}
            </v-chip>
          </v-card-title>

          <v-card-text class="pa-0">
            <!-- Action Buttons -->
            <div class="pa-3">
              <v-row align="center">
                <v-col cols="12" sm="auto">
                  <v-checkbox
                    v-model="selectAllAssigned"
                    :label="$t('common.selectAll')"
                    dense
                    hide-details
                    @change="toggleSelectAllAssigned"
                  />
                </v-col>
                <v-col cols="12" sm="auto">
                  <v-btn
                    small
                    color="error"
                    :disabled="selectedAssigned.length === 0"
                    @click="removePermissions"
                  >
                    <v-icon small :left="!isRTL" :right="isRTL"
                      >mdi-minus-circle</v-icon
                    >
                    {{ $t("pages.roles.removeSelected") }}
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="auto">
                  <v-btn
                    small
                    outlined
                    :disabled="localAssigned.length === 0"
                    @click="clearAssignedSelection"
                  >
                    {{ $t("common.clearSelection") }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <v-divider />

            <!-- Permissions Table -->
            <v-data-table
              v-model="selectedAssigned"
              :headers="assignedHeaders"
              :items="localAssigned"
              :items-per-page="-1"
              show-select
              item-key="id"
              hide-default-footer
              class="elevation-0"
            >
              <template #[`item.name`]="{ item }">
                <div class="d-flex align-center">
                  <v-icon small color="success" :class="isRTL ? 'ml-2' : 'mr-2'"
                    >mdi-key-variant</v-icon
                  >
                  {{ item.name }}
                </div>
              </template>

              <template #[`item.module`]="{ item }">
                <v-chip x-small color="primary">{{ item.module }}</v-chip>
              </template>

              <template #[`item.actions`]="{ item }">
                <v-btn
                  x-small
                  icon
                  color="error"
                  @click="removePermission(item.id)"
                >
                  <v-icon small>mdi-minus-circle</v-icon>
                </v-btn>
              </template>

              <template #no-data>
                <div class="text-center py-4 text-medium-emphasis">
                  {{ $t("pages.roles.noAssignedPermissions") }}
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Available Permissions Table -->
      <v-col cols="12" lg="6">
        <v-card class="mb-4">
          <v-card-title class="bg-primary white--text">
            <v-icon color="white" :left="!isRTL" :right="isRTL"
              >mdi-key-outline</v-icon
            >
            {{ $t("pages.roles.availablePermissions") }}
            <v-spacer />
            <v-chip small color="white" text-color="primary">
              {{ selectedAvailable.length }} / {{ localAvailable.length }}
            </v-chip>
          </v-card-title>

          <v-card-text class="pa-0">
            <!-- Action Buttons -->
            <div class="pa-3">
              <v-row align="center">
                <v-col cols="12" sm="auto">
                  <v-checkbox
                    v-model="selectAllAvailable"
                    :label="$t('common.selectAll')"
                    dense
                    hide-details
                    @change="toggleSelectAllAvailable"
                  />
                </v-col>
                <v-col cols="12" sm="auto">
                  <v-btn
                    small
                    color="success"
                    :disabled="selectedAvailable.length === 0"
                    @click="addPermissions"
                  >
                    <v-icon small :left="!isRTL" :right="isRTL"
                      >mdi-plus-circle</v-icon
                    >
                    {{ $t("pages.roles.addSelected") }}
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="auto">
                  <v-btn
                    small
                    outlined
                    :disabled="localAvailable.length === 0"
                    @click="clearAvailableSelection"
                  >
                    {{ $t("common.clearSelection") }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <v-divider />

            <!-- Permissions Table -->
            <v-data-table
              v-model="selectedAvailable"
              :headers="availableHeaders"
              :items="localAvailable"
              :items-per-page="-1"
              show-select
              item-key="id"
              hide-default-footer
              class="elevation-0"
            >
              <template #[`item.name`]="{ item }">
                <div class="d-flex align-center">
                  <v-icon small color="grey" :class="isRTL ? 'ml-2' : 'mr-2'"
                    >mdi-key-outline</v-icon
                  >
                  {{ item.name }}
                </div>
              </template>

              <template #[`item.module`]="{ item }">
                <v-chip x-small color="primary">{{ item.module }}</v-chip>
              </template>

              <template #[`item.actions`]="{ item }">
                <v-btn
                  x-small
                  icon
                  color="success"
                  @click="addPermission(item.id)"
                >
                  <v-icon small>mdi-plus-circle</v-icon>
                </v-btn>
              </template>

              <template #no-data>
                <div class="text-center py-4 text-medium-emphasis">
                  {{ $t("pages.roles.noAvailablePermissions") }}
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
// @ts-nocheck
const props = defineProps({
  roleId: {
    type: String,
    required: true,
  },
  assignedPermissions: {
    type: Array,
    default: () => [],
  },
  availablePermissions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["permissions-updated"]);

const { t } = useI18n();
const { locale } = useI18n();

const isRTL = computed(() => locale.value === "ar");

// Local state
const localAssigned = ref([...props.assignedPermissions]);
const localAvailable = ref([...props.availablePermissions]);
const selectedAssigned = ref([]);
const selectedAvailable = ref([]);
const selectAllAssigned = ref(false);
const selectAllAvailable = ref(false);

// Watch props
watch(
  () => props.assignedPermissions,
  (newVal) => {
    localAssigned.value = [...newVal];
  },
  { deep: true }
);

watch(
  () => props.availablePermissions,
  (newVal) => {
    localAvailable.value = [...newVal];
  },
  { deep: true }
);

// Headers for assigned permissions
const assignedHeaders = computed(() => [
  { title: t("attributes.name"), key: "name", align: "start", sortable: true },
  {
    title: t("attributes.description"),
    key: "description",
    align: "start",
    sortable: false,
  },
  {
    title: t("attributes.module"),
    key: "module",
    align: "center",
    sortable: true,
  },
  {
    title: t("table.actions"),
    key: "actions",
    align: "center",
    sortable: false,
    width: "80px",
  },
]);

// Headers for available permissions
const availableHeaders = computed(() => [
  { title: t("attributes.name"), key: "name", align: "start", sortable: true },
  {
    title: t("attributes.description"),
    key: "description",
    align: "start",
    sortable: false,
  },
  {
    title: t("attributes.module"),
    key: "module",
    align: "center",
    sortable: true,
  },
  {
    title: t("table.actions"),
    key: "actions",
    align: "center",
    sortable: false,
    width: "80px",
  },
]);

// Methods
const toggleSelectAllAssigned = (value) => {
  selectedAssigned.value = value ? localAssigned.value.map((p) => p.id) : [];
};

const toggleSelectAllAvailable = (value) => {
  selectedAvailable.value = value ? localAvailable.value.map((p) => p.id) : [];
};

const clearAssignedSelection = () => {
  selectedAssigned.value = [];
  selectAllAssigned.value = false;
};

const clearAvailableSelection = () => {
  selectedAvailable.value = [];
  selectAllAvailable.value = false;
};

const addPermission = (permissionId) => {
  const permission = localAvailable.value.find((p) => p.id === permissionId);
  if (permission) {
    localAssigned.value.push(permission);
    localAvailable.value = localAvailable.value.filter(
      (p) => p.id !== permissionId
    );
    emitUpdate();
  }
};

const removePermission = (permissionId) => {
  const permission = localAssigned.value.find((p) => p.id === permissionId);
  if (permission) {
    localAvailable.value.push(permission);
    localAssigned.value = localAssigned.value.filter(
      (p) => p.id !== permissionId
    );
    emitUpdate();
  }
};

const addPermissions = () => {
  const permissionsToAdd = localAvailable.value.filter((p) =>
    selectedAvailable.value.includes(p.id)
  );
  localAssigned.value.push(...permissionsToAdd);
  localAvailable.value = localAvailable.value.filter(
    (p) => !selectedAvailable.value.includes(p.id)
  );
  clearAvailableSelection();
  emitUpdate();
};

const removePermissions = () => {
  const permissionsToRemove = localAssigned.value.filter((p) =>
    selectedAssigned.value.includes(p.id)
  );
  localAvailable.value.push(...permissionsToRemove);
  localAssigned.value = localAssigned.value.filter(
    (p) => !selectedAssigned.value.includes(p.id)
  );
  clearAssignedSelection();
  emitUpdate();
};

const emitUpdate = () => {
  emit("permissions-updated", {
    assigned: localAssigned.value,
    available: localAvailable.value,
  });
};
</script>

<style scoped>
.permissions-manager {
  width: 100%;
}

:deep(.v-data-table) {
  max-height: 500px;
  overflow-y: auto;
}
</style>
