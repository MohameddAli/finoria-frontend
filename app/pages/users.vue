<template>
  <v-container id="Users" fluid tag="section">
    <v-card class="my-4 mx-auto w-100" rounded="lg">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="text-h6">{{ $t('navigation.users') || 'Users' }}</div>
        <v-btn color="primary" variant="flat" @click="resetFilters">
          <v-icon class="mr-1">mdi-filter-remove</v-icon>
          {{ $t('options.clear_filters') || 'Clear filters' }}
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form @submit.prevent>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model.trim="filters.search"
                :label="$t('search.placeholder') || 'Search'"
                prepend-inner-icon="mdi-magnify"
                clearable
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-select
                v-model="filters.role"
                :items="roles"
                :label="$t('attributes.role') || 'Role'"
                clearable
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-select
                v-model="filters.status"
                :items="statuses"
                :label="$t('attributes.status') || 'Status'"
                clearable
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />
      <v-card-text>
        <v-row>
          <v-col v-for="user in filteredUsers" :key="user.id" cols="12" sm="6" md="4" lg="3">
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                rounded="lg"
                :elevation="isHovering ? 12 : 2"
                class="d-flex flex-column text-center user-card"
              >
                <v-avatar size="80" class="mx-auto mt-6 mb-2">
                  <v-img :src="user.avatar" />
                </v-avatar>
                <v-card-title class="text-h6">{{ user.name }}</v-card-title>
                <v-card-subtitle>{{ user.email }}</v-card-subtitle>
                <v-card-text class="flex-grow-1">
                  <div class="mb-2">
                    <v-icon size="small" class="mr-1">mdi-phone-outline</v-icon>
                    <span>{{ user.phone }}</span>
                  </div>
                  <v-chip size="small" class="ma-1">
                    {{ user.role }}
                  </v-chip>
                </v-card-text>
                <v-card-actions class="justify-center mb-2">
                  <v-chip :color="user.status === 'Active' ? 'success' : 'error'" variant="tonal" size="small" label>
                    {{ user.status }}
                  </v-chip>
                </v-card-actions>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Floating Action Button -->
    <v-btn
      color="primary"
      icon="mdi-plus"
      size="large"
      style="position: fixed; bottom: 24px; right: 24px;"
      @click="dialog = true"
    />

    <!-- Add User Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Add New User</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="newUser.name"
              label="Name"
              :rules="[v => !!v || 'Name is required']"
              required
            />
            <v-text-field
              v-model="newUser.email"
              label="Email"
              :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid']"
              required
            />
            <v-text-field
              v-model="newUser.phone"
              label="Phone"
              :rules="[v => !!v || 'Phone is required']"
              required
            />
            <v-select
              v-model="newUser.role"
              :items="roles"
              label="Role"
              :rules="[v => !!v || 'Role is required']"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" :disabled="!valid" @click="addUser">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// 🔒 صفحة محمية
definePageMeta({
  layout: 'dashboard',
  title: 'pages.users.title',
  subtitle: 'pages.users.subtitle'
})

const roles = ['Admin', 'Editor', 'Viewer']
const statuses = ['Active', 'Inactive']

const filters = reactive({
  search: '',
  role: undefined,
  status: undefined,
})

const items = ref([
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', role: 'Admin', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '234-567-8901', role: 'Editor', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 3, name: 'Sam Wilson', email: 'sam.wilson@example.com', phone: '345-678-9012', role: 'Viewer', status: 'Inactive', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 4, name: 'Alice Johnson', email: 'alice.j@example.com', phone: '456-789-0123', role: 'Editor', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
])

const filteredUsers = computed(() => {
  const q = filters.search?.toLowerCase() || ''
  return items.value.filter(u => {
    const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    const matchRole = !filters.role || u.role === filters.role
    const matchStatus = !filters.status || u.status === filters.status
    return matchQ && matchRole && matchStatus
  })
})

const resetFilters = () => {
  filters.search = ''
  filters.role = undefined
  filters.status = undefined
}

const dialog = ref(false)
const valid = ref(false)
const form = ref<any>(null)

const newUser = reactive({
  name: '',
  email: '',
  phone: '',
  role: '',
})

const addUser = () => {
  if (form.value?.validate()) {
    items.value.push({
      id: items.value.length + 1,
      ...newUser,
      status: 'Active', // Default status for new users
      avatar: `https://randomuser.me/api/portraits/men/${items.value.length + 1}.jpg`,
    })
    dialog.value = false
    // Reset form
    newUser.name = ''
    newUser.email = ''
    newUser.phone = ''
    newUser.role = ''
    form.value?.resetValidation()
  }
}
</script>

<style scoped>
.user-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-card::before,
.user-card::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  background-color: rgb(var(--v-theme-primary));
  transition: width 0.3s ease-out;
}

.user-card::before {
  top: 0;
  left: 0;
}

.user-card::after {
  bottom: 0;
  right: 0;
}

.user-card:hover::before,
.user-card:hover::after {
  width: 100%;
}
</style>
