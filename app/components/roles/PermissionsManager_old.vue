<template>
  <div class="permissions-manager">
    <v-row>
      <!-- Assigned Permissions Table -->
      <v-col cols="12" lg="6">
        <v-card class="mb-4">
          <v-card-title class="bg-success white--text">
            <v-icon color="white" left>mdi-shield-check</v-icon>
            {{ $t('pages.roles.assignedPermissions') }}
            <v-spacer />
            <v-chip small color="white" text-color="success">
              {{ selectedAssigned.length }} / {{ assignedPermissions.length }}
            </v-chip>
          </v-card-title>

          <v-card-text class="pa-0">
            <!-- Action Buttons -->
            <div class="pa-3 d-flex align-center flex-wrap gap-2">
              <v-btn
                small
                color="error"
                :disabled="selectedAssigned.length === 0"
                @click="removePermissions"
              >
                <v-icon small left>mdi-minus-circle</v-icon>
                {{ $t('pages.roles.removeSelected') }}
              </v-btn>
              
              <v-btn
                small
                outlined
                :disabled="assignedPermissions.length === 0"
                @click="clearAssignedSelection"
              >
                {{ $t('common.clearSelection') }}
              </v-btn>

              <v-spacer />

              <v-checkbox
                v-model="selectAllAssigned"
                :label="$t('common.selectAll')"
                dense
                hide-details
                @change="toggleSelectAllAssigned"
              />
            </div>

            <v-divider />

            <!-- Permissions Table -->
            <v-data-table
              v-model="selectedAssigned"
              :headers="permissionsHeaders"
              :items="assignedPermissions"
              :items-per-page="-1"
              show-select
              item-key="id"
              hide-default-footer
              class="elevation-0"
            >
              <template #item.name="{ item }">
                <div class="d-flex align-center">
                  <v-icon small color="success" class="mr-2">mdi-key-variant</v-icon>
                  {{ item.name }}
                </div>
              </template>

              <template #item.module="{ item }">
                <v-chip x-small color="primary">{{ item.module }}</v-chip>
              </template>

              <template #item.actions="{ item }">
                <v-btn x-small icon color="error" @click="removePermission(item.id)">
                  <v-icon small>mdi-minus-circle</v-icon>
                </v-btn>
              </template>

              <template #no-data>
                <div class="text-center py-4 text-medium-emphasis">
                  {{ $t('pages.roles.noAssignedPermissions') }}
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
            <v-icon color="white" left>mdi-key-outline</v-icon>
            {{ $t('pages.roles.availablePermissions') }}
            <v-spacer />
            <v-chip small color="white" text-color="primary">
              {{ selectedAvailable.length }} / {{ availablePermissions.length }}
            </v-chip>
          </v-card-title>

          <v-card-text class="pa-0">
            <!-- Action Buttons -->
            <div class="pa-3 d-flex align-center flex-wrap gap-2">
              <v-btn
                small
                color="success"
                :disabled="selectedAvailable.length === 0"
                @click="addPermissions"
              >
                <v-icon small left>mdi-plus-circle</v-icon>
                {{ $t('pages.roles.addSelected') }}
              </v-btn>
              
              <v-btn
                small
                outlined
                :disabled="availablePermissions.length === 0"
                @click="clearAvailableSelection"
              >
                {{ $t('common.clearSelection') }}
              </v-btn>

              <v-spacer />

              <v-checkbox
                v-model="selectAllAvailable"
                :label="$t('common.selectAll')"
                dense
                hide-details
                @change="toggleSelectAllAvailable"
              />
            </div>

            <v-divider />

            <!-- Permissions Table -->
            <v-data-table
              v-model="selectedAvailable"
              :headers="permissionsHeaders"
              :items="availablePermissions"
              :items-per-page="-1"
              show-select
              item-key="id"
              hide-default-footer
              class="elevation-0"
            >
              <template #item.name="{ item }">
                <div class="d-flex align-center">
                  <v-icon small color="grey" class="mr-2">mdi-key-outline</v-icon>
                  {{ item.name }}
                </div>
              </template>

              <template #item.module="{ item }">
                <v-chip x-small color="primary">{{ item.module }}</v-chip>
              </template>

              <template #item.actions="{ item }">
                <v-btn x-small icon color="success" @click="addPermission(item.id)">
                  <v-icon small>mdi-plus-circle</v-icon>
                </v-btn>
              </template>

              <template #no-data>
                <div class="text-center py-4 text-medium-emphasis">
                  {{ $t('pages.roles.noAvailablePermissions') }}
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
    required: true
  },
  assignedPermissions: {
    type: Array,
    default: () => []
  },
  availablePermissions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['permissions-updated'])

const { t } = useI18n()

// Local state
const localAssigned = ref([...props.assignedPermissions])
const localAvailable = ref([...props.availablePermissions])
const selectedAssigned = ref([])
const selectedAvailable = ref([])
const selectAllAssigned = ref(false)
const selectAllAvailable = ref(false)

// Watch props
watch(() => props.assignedPermissions, (newVal) => {
  localAssigned.value = [...newVal]
}, { deep: true })

watch(() => props.availablePermissions, (newVal) => {
  localAvailable.value = [...newVal]
}, { deep: true })

// Headers
const permissionsHeaders = computed(() => [
  { text: t('attributes.name'), value: 'name', sortable: true },
  { text: t('attributes.description'), value: 'description', sortable: false },
  { text: t('attributes.module'), value: 'module', sortable: true, align: 'center' },
  { text: t('table.actions'), value: 'actions', sortable: false, align: 'center', width: '80px' }
])

// Methods
const toggleSelectAllAssigned = (value) => {
  selectedAssigned.value = value ? localAssigned.value.map(p => p.id) : []
}

const toggleSelectAllAvailable = (value) => {
  selectedAvailable.value = value ? localAvailable.value.map(p => p.id) : []
}

const clearAssignedSelection = () => {
  selectedAssigned.value = []
  selectAllAssigned.value = false
}

const clearAvailableSelection = () => {
  selectedAvailable.value = []
  selectAllAvailable.value = false
}

const addPermission = (permissionId) => {
  const permission = localAvailable.value.find(p => p.id === permissionId)
  if (permission) {
    localAssigned.value.push(permission)
    localAvailable.value = localAvailable.value.filter(p => p.id !== permissionId)
    emitUpdate()
  }
}

const removePermission = (permissionId) => {
  const permission = localAssigned.value.find(p => p.id === permissionId)
  if (permission) {
    localAvailable.value.push(permission)
    localAssigned.value = localAssigned.value.filter(p => p.id !== permissionId)
    emitUpdate()
  }
}

const addPermissions = () => {
  const permissionsToAdd = localAvailable.value.filter(p => 
    selectedAvailable.value.includes(p.id)
  )
  localAssigned.value.push(...permissionsToAdd)
  localAvailable.value = localAvailable.value.filter(p => 
    !selectedAvailable.value.includes(p.id)
  )
  clearAvailableSelection()
  emitUpdate()
}

const removePermissions = () => {
  const permissionsToRemove = localAssigned.value.filter(p => 
    selectedAssigned.value.includes(p.id)
  )
  localAvailable.value.push(...permissionsToRemove)
  localAssigned.value = localAssigned.value.filter(p => 
    !selectedAssigned.value.includes(p.id)
  )
  clearAssignedSelection()
  emitUpdate()
}

const emitUpdate = () => {
  emit('permissions-updated', {
    assigned: localAssigned.value,
    available: localAvailable.value
  })
}
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
            <!-- Action Buttons -->
            <div class="action-bar pa-4 bg-surface-variant">
              <div class="d-flex gap-2 align-center flex-wrap">
                <v-btn
                  size="small"
                  color="error"
                  variant="flat"
                  :disabled="selectedAssigned.length === 0"
                  :prepend-icon="!isRTL ? 'mdi-minus-circle' : undefined"
                  :append-icon="isRTL ? 'mdi-minus-circle' : undefined"
                  @click="removePermissions"
                >
                  {{ $t('pages.roles.removeSelected') }}
                </v-btn>
                
                <v-btn
                  size="small"
                  color="default"
                  variant="outlined"
                  :disabled="assignedPermissions.length === 0"
                  @click="clearAssignedSelection"
                >
                  {{ $t('common.clearSelection') }}
                </v-btn>

                <v-spacer />

                <!-- Select All Checkbox -->
                <v-checkbox
                  v-model="selectAllAssigned"
                  :label="$t('common.selectAll')"
                  density="compact"
                  hide-details
                  color="success"
                  @update:model-value="toggleSelectAllAssigned"
                />
              </div>
            </div>

            <!-- Permissions Table -->
            <v-data-table
              v-model="selectedAssigned"
              :headers="permissionsHeaders"
              :items="assignedPermissions"
              :items-per-page="-1"
              show-select
              item-value="id"
              hide-default-footer
              class="permissions-table"
              :no-data-text="$t('pages.roles.noAssignedPermissions')"
            >
              <template #item.id="{ index }">
                <span class="font-weight-medium">{{ index + 1 }}</span>
              </template>

              <template #item.name="{ item }">
                <div class="permission-name">
                  <v-icon size="small" color="success" class="me-2">
                    mdi-key-variant
                  </v-icon>
                  <span class="font-weight-medium">{{ item.name }}</span>
                </div>
              </template>

              <template #item.description="{ item }">
                <span class="text-caption text-medium-emphasis">
                  {{ item.description }}
                </span>
              </template>

              <template #item.module="{ item }">
                <v-chip size="small" color="info" variant="tonal">
                  {{ item.module }}
                </v-chip>
              </template>

              <template #item.actions="{ item }">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="error"
                  @click="removePermission(item.id)"
                  :aria-label="$t('common.remove')"
                >
                  <v-icon size="small">mdi-minus-circle</v-icon>
                  <v-tooltip activator="parent" location="top">
                    {{ $t('common.remove') }}
                  </v-tooltip>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Available Permissions Table (Right/Left based on RTL) -->
      <v-col cols="12" lg="6">
        <v-card class="permissions-card" elevation="2">
          <v-card-title class="bg-primary text-white d-flex align-center justify-space-between">
            <div class="d-flex align-center gap-2">
              <v-icon>mdi-key-outline</v-icon>
              <span>{{ $t('pages.roles.availablePermissions') }}</span>
              <v-chip size="small" color="white" variant="flat" class="text-primary">
                {{ selectedAvailable.length }} / {{ availablePermissions.length }}
              </v-chip>
            </div>
          </v-card-title>

          <v-card-text class="pa-0">
            <!-- Action Buttons -->
            <div class="action-bar pa-4 bg-surface-variant">
              <div class="d-flex gap-2 align-center flex-wrap">
                <v-btn
                  size="small"
                  color="success"
                  variant="flat"
                  :disabled="selectedAvailable.length === 0"
                  :prepend-icon="!isRTL ? 'mdi-plus-circle' : undefined"
                  :append-icon="isRTL ? 'mdi-plus-circle' : undefined"
                  @click="addPermissions"
                >
                  {{ $t('pages.roles.addSelected') }}
                </v-btn>
                
                <v-btn
                  size="small"
                  color="default"
                  variant="outlined"
                  :disabled="availablePermissions.length === 0"
                  @click="clearAvailableSelection"
                >
                  {{ $t('common.clearSelection') }}
                </v-btn>

                <v-spacer />

                <!-- Select All Checkbox -->
                <v-checkbox
                  v-model="selectAllAvailable"
                  :label="$t('common.selectAll')"
                  density="compact"
                  hide-details
                  color="primary"
                  @update:model-value="toggleSelectAllAvailable"
                />
              </div>
            </div>

            <!-- Permissions Table -->
            <v-data-table
              v-model="selectedAvailable"
              :headers="permissionsHeaders"
              :items="availablePermissions"
              :items-per-page="-1"
              show-select
              item-value="id"
              hide-default-footer
              class="permissions-table"
              :no-data-text="$t('pages.roles.noAvailablePermissions')"
            >
              <template #item.id="{ index }">
                <span class="font-weight-medium">{{ index + 1 }}</span>
              </template>

              <template #item.name="{ item }">
                <div class="permission-name">
                  <v-icon size="small" color="grey" class="me-2">
                    mdi-key-outline
                  </v-icon>
                  <span class="font-weight-medium">{{ item.name }}</span>
                </div>
              </template>

              <template #item.description="{ item }">
                <span class="text-caption text-medium-emphasis">
                  {{ item.description }}
                </span>
              </template>

              <template #item.module="{ item }">
                <v-chip size="small" color="info" variant="tonal">
                  {{ item.module }}
                </v-chip>
              </template>

              <template #item.actions="{ item }">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="success"
                  @click="addPermission(item.id)"
                  :aria-label="$t('common.add')"
                >
                  <v-icon size="small">mdi-plus-circle</v-icon>
                  <v-tooltip activator="parent" location="top">
                    {{ $t('common.add') }}
                  </v-tooltip>
                </v-btn>
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
    required: true
  },
  assignedPermissions: {
    type: Array,
    default: () => []
  },
  availablePermissions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['permissions-updated'])

const { t } = useI18n()
const { locale } = useI18n()
const isRTL = computed(() => locale.value === 'ar')

// Local state for permissions
const localAssigned = ref([...props.assignedPermissions])
const localAvailable = ref([...props.availablePermissions])

// Selected permissions
const selectedAssigned = ref([])
const selectedAvailable = ref([])

// Select all checkboxes
const selectAllAssigned = ref(false)
const selectAllAvailable = ref(false)

// Watch props changes
watch(() => props.assignedPermissions, (newVal) => {
  localAssigned.value = [...newVal]
}, { deep: true })

watch(() => props.availablePermissions, (newVal) => {
  localAvailable.value = [...newVal]
}, { deep: true })

// Table headers
const permissionsHeaders = computed(() => [
  { title: t('attributes.id'), key: 'id', width: 80, sortable: false },
  { title: t('attributes.name'), key: 'name', sortable: true },
  { title: t('attributes.description'), key: 'description', sortable: false },
  { title: t('attributes.module'), key: 'module', width: 150, sortable: true },
  { title: t('table.actions'), key: 'actions', width: 100, sortable: false, align: 'center' }
])

// Toggle select all assigned
const toggleSelectAllAssigned = (value) => {
  if (value) {
    selectedAssigned.value = localAssigned.value.map(p => p.id)
  } else {
    selectedAssigned.value = []
  }
}

// Toggle select all available
const toggleSelectAllAvailable = (value) => {
  if (value) {
    selectedAvailable.value = localAvailable.value.map(p => p.id)
  } else {
    selectedAvailable.value = []
  }
}

// Clear selections
const clearAssignedSelection = () => {
  selectedAssigned.value = []
  selectAllAssigned.value = false
}

const clearAvailableSelection = () => {
  selectedAvailable.value = []
  selectAllAvailable.value = false
}

// Add single permission
const addPermission = (permissionId) => {
  const permission = localAvailable.value.find(p => p.id === permissionId)
  if (permission) {
    localAssigned.value.push(permission)
    localAvailable.value = localAvailable.value.filter(p => p.id !== permissionId)
    emitUpdate()
  }
}

// Remove single permission
const removePermission = (permissionId) => {
  const permission = localAssigned.value.find(p => p.id === permissionId)
  if (permission) {
    localAvailable.value.push(permission)
    localAssigned.value = localAssigned.value.filter(p => p.id !== permissionId)
    emitUpdate()
  }
}

// Add multiple permissions
const addPermissions = () => {
  const permissionsToAdd = localAvailable.value.filter(p => 
    selectedAvailable.value.includes(p.id)
  )
  
  localAssigned.value.push(...permissionsToAdd)
  localAvailable.value = localAvailable.value.filter(p => 
    !selectedAvailable.value.includes(p.id)
  )
  
  clearAvailableSelection()
  emitUpdate()
}

// Remove multiple permissions
const removePermissions = () => {
  const permissionsToRemove = localAssigned.value.filter(p => 
    selectedAssigned.value.includes(p.id)
  )
  
  localAvailable.value.push(...permissionsToRemove)
  localAssigned.value = localAssigned.value.filter(p => 
    !selectedAssigned.value.includes(p.id)
  )
  
  clearAssignedSelection()
  emitUpdate()
}

// Emit update
const emitUpdate = () => {
  emit('permissions-updated', {
    assigned: localAssigned.value,
    available: localAvailable.value
  })
}
</script>

<style scoped>
.permissions-manager {
  width: 100%;
}

.permissions-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
}

.action-bar {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.permissions-table {
  max-height: 600px;
  overflow-y: auto;
}

.permission-name {
  display: flex;
  align-items: center;
}

:deep(.v-data-table th) {
  font-weight: 600 !important;
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
}

:deep(.v-data-table tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.03);
  cursor: pointer;
}

:deep(.v-data-table .v-checkbox) {
  cursor: pointer;
}

/* Responsive */
@media (max-width: 1279px) {
  .permissions-table {
    max-height: 500px;
  }
}

@media (max-width: 599px) {
  .action-bar .d-flex {
    flex-direction: column;
    align-items: stretch !important;
  }
  
  .action-bar .v-btn {
    width: 100%;
  }
  
  :deep(.v-data-table th),
  :deep(.v-data-table td) {
    font-size: 0.75rem;
    padding: 8px 4px;
  }
}
</style>
