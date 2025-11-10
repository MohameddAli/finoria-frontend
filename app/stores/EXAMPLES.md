# 📚 أمثلة عملية لاستخدام Pinia Stores

## 🔐 مثال كامل: صفحة تسجيل الدخول

```vue path=null start=null
<!-- pages/login.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth/storeAuth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('admin@example.com')
const password = ref('password')

async function handleLogin() {
  const success = await authStore.login({
    email: email.value,
    password: password.value
  })

  if (success) {
    router.push('/dashboard')
  }
}
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>تسجيل الدخول</v-card-title>
          
          <v-card-text>
            <v-alert v-if="authStore.error" type="error" closable @click:close="authStore.clearError()">
              {{ authStore.error }}
            </v-alert>

            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="البريد الإلكتروني"
                type="email"
                :disabled="authStore.isLoading"
              />

              <v-text-field
                v-model="password"
                label="كلمة المرور"
                type="password"
                :disabled="authStore.isLoading"
              />

              <v-btn
                type="submit"
                color="primary"
                block
                :loading="authStore.isLoading"
              >
                دخول
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
```

## 🏢 مثال كامل: إدارة الشركات

```vue path=null start=null
<!-- pages/companies/index.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCompaniesStore } from '~/stores/companies/storeCompanies'
import { storeToRefs } from 'pinia'

const companiesStore = useCompaniesStore()
const { companies, isLoading, error, activeCompanies } = storeToRefs(companiesStore)

const showDialog = ref(false)
const editMode = ref(false)
const formData = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  is_active: true
})

onMounted(async () => {
  await companiesStore.fetchAll()
})

async function handleSubmit() {
  if (editMode.value) {
    // Update logic
  } else {
    const newCompany = await companiesStore.create(formData.value)
    if (newCompany) {
      showDialog.value = false
      resetForm()
    }
  }
}

function openCreateDialog() {
  editMode.value = false
  resetForm()
  showDialog.value = true
}

function resetForm() {
  formData.value = {
    name: '',
    email: '',
    phone: '',
    address: '',
    is_active: true
  }
}

async function deleteCompany(id: string) {
  if (confirm('هل أنت متأكد من حذف هذه الشركة؟')) {
    await companiesStore.remove(id)
  }
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>الشركات</span>
            <v-btn color="primary" @click="openCreateDialog">
              <v-icon start>mdi-plus</v-icon>
              إضافة شركة
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-alert v-if="error" type="error" closable @click:close="companiesStore.clearError()">
              {{ error }}
            </v-alert>

            <v-data-table
              :items="companies"
              :loading="isLoading"
              :headers="[
                { title: 'الاسم', key: 'name' },
                { title: 'البريد', key: 'email' },
                { title: 'الهاتف', key: 'phone' },
                { title: 'الحالة', key: 'is_active' },
                { title: 'إجراءات', key: 'actions', sortable: false }
              ]"
            >
              <template #item.is_active="{ item }">
                <v-chip :color="item.is_active ? 'success' : 'error'" size="small">
                  {{ item.is_active ? 'نشط' : 'غير نشط' }}
                </v-chip>
              </template>

              <template #item.actions="{ item }">
                <v-btn icon="mdi-delete" size="small" @click="deleteCompany(item.id)" />
              </template>
            </v-data-table>

            <div class="mt-4">
              <v-chip class="me-2">
                إجمالي الشركات: {{ companiesStore.companiesCount }}
              </v-chip>
              <v-chip color="success">
                الشركات النشطة: {{ activeCompanies.length }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create Dialog -->
    <v-dialog v-model="showDialog" max-width="600">
      <v-card>
        <v-card-title>إضافة شركة جديدة</v-card-title>
        
        <v-card-text>
          <v-form @submit.prevent="handleSubmit">
            <v-text-field
              v-model="formData.name"
              label="اسم الشركة"
              required
            />

            <v-text-field
              v-model="formData.email"
              label="البريد الإلكتروني"
              type="email"
              required
            />

            <v-text-field
              v-model="formData.phone"
              label="رقم الهاتف"
              required
            />

            <v-text-field
              v-model="formData.address"
              label="العنوان"
              required
            />

            <v-switch
              v-model="formData.is_active"
              label="نشط"
              color="success"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDialog = false">إلغاء</v-btn>
          <v-btn color="primary" @click="handleSubmit" :loading="isLoading">
            حفظ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
```

## 💱 مثال كامل: إدارة العملات

```vue path=null start=null
<!-- pages/currencies/index.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCurrenciesStore } from '~/stores/currencies/storeCurrencies'
import { storeToRefs } from 'pinia'

const currenciesStore = useCurrenciesStore()
const { currencies, isLoading, error } = storeToRefs(currenciesStore)

const showDialog = ref(false)
const editingId = ref<string | null>(null)
const formData = ref({
  name: '',
  code: '',
  symbol: '',
  exchange_rate: 1,
  is_active: true
})

onMounted(async () => {
  await currenciesStore.fetchAll()
})

async function handleSubmit() {
  if (editingId.value) {
    // Update - all fields required
    const success = await currenciesStore.update(editingId.value, {
      name: formData.value.name,
      code: formData.value.code,
      symbol: formData.value.symbol,         // required
      exchange_rate: formData.value.exchange_rate, // required
      is_active: formData.value.is_active    // required
    })
    
    if (success) {
      showDialog.value = false
      editingId.value = null
      resetForm()
    }
  } else {
    // Create
    const newCurrency = await currenciesStore.create(formData.value)
    if (newCurrency) {
      showDialog.value = false
      resetForm()
    }
  }
}

function openCreateDialog() {
  editingId.value = null
  resetForm()
  showDialog.value = true
}

function openEditDialog(currency: any) {
  editingId.value = currency.id
  formData.value = {
    name: currency.name,
    code: currency.code || '',
    symbol: currency.symbol,
    exchange_rate: parseFloat(currency.exchange_rate),
    is_active: currency.is_active
  }
  showDialog.value = true
}

function resetForm() {
  formData.value = {
    name: '',
    code: '',
    symbol: '',
    exchange_rate: 1,
    is_active: true
  }
}

async function deleteCurrency(id: string) {
  if (confirm('هل أنت متأكد من حذف هذه العملة؟')) {
    const success = await currenciesStore.remove(id)
    if (success) {
      // Currency deleted successfully (204 No Content handled)
    }
  }
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>العملات</span>
            <v-btn color="primary" @click="openCreateDialog">
              <v-icon start>mdi-plus</v-icon>
              إضافة عملة
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-alert v-if="error" type="error" closable @click:close="currenciesStore.clearError()">
              {{ error }}
            </v-alert>

            <v-data-table
              :items="currencies"
              :loading="isLoading"
              :headers="[
                { title: 'الاسم', key: 'name' },
                { title: 'الرمز', key: 'code' },
                { title: 'العلامة', key: 'symbol' },
                { title: 'سعر الصرف', key: 'exchange_rate' },
                { title: 'الحالة', key: 'is_active' },
                { title: 'إجراءات', key: 'actions', sortable: false }
              ]"
            >
              <template #item.is_active="{ item }">
                <v-chip :color="item.is_active ? 'success' : 'error'" size="small">
                  {{ item.is_active ? 'نشط' : 'غير نشط' }}
                </v-chip>
              </template>

              <template #item.actions="{ item }">
                <v-btn icon="mdi-pencil" size="small" @click="openEditDialog(item)" class="me-2" />
                <v-btn icon="mdi-delete" size="small" @click="deleteCurrency(item.id)" />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="showDialog" max-width="600">
      <v-card>
        <v-card-title>
          {{ editingId ? 'تعديل العملة' : 'إضافة عملة جديدة' }}
        </v-card-title>
        
        <v-card-text>
          <v-form @submit.prevent="handleSubmit">
            <v-text-field
              v-model="formData.name"
              label="اسم العملة"
              required
            />

            <v-text-field
              v-model="formData.code"
              label="رمز العملة (اختياري)"
              hint="مثال: USD, LYD"
            />

            <v-text-field
              v-model="formData.symbol"
              label="العلامة (مطلوب)"
              required
              hint="مثال: $, د.ل"
            />

            <v-text-field
              v-model.number="formData.exchange_rate"
              label="سعر الصرف (مطلوب)"
              type="number"
              step="0.0001"
              required
            />

            <v-switch
              v-model="formData.is_active"
              label="نشط (مطلوب)"
              color="success"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDialog = false">إلغاء</v-btn>
          <v-btn color="primary" @click="handleSubmit" :loading="isLoading">
            {{ editingId ? 'تحديث' : 'حفظ' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
```

## 🔒 مثال: Middleware للحماية

```typescript path=null start=null
// middleware/auth.ts
import { useAuthStore } from '~/stores/auth/storeAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
```

استخدام في الصفحات:

```vue path=null start=null
<!-- pages/dashboard.vue -->
<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

import { useAuthStore } from '~/stores/auth/storeAuth'
const authStore = useAuthStore()
</script>

<template>
  <v-container>
    <h1>مرحباً {{ authStore.adminName }}</h1>
  </v-container>
</template>
```

## 🎨 مثال: Layout مع Auth

```vue path=null start=null
<!-- layouts/MainLayout.vue -->
<script setup lang="ts">
import { useAuthStore } from '~/stores/auth/storeAuth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-title>لوحة التحكم</v-app-bar-title>

      <v-spacer />

      <v-menu v-if="authStore.isAuthenticated">
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>{{ authStore.adminName }}</v-list-item-title>
            <v-list-item-subtitle>{{ authStore.adminEmail }}</v-list-item-subtitle>
          </v-list-item>
          
          <v-divider />
          
          <v-list-item @click="handleLogout">
            <v-list-item-title>
              <v-icon start>mdi-logout</v-icon>
              تسجيل خروج
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
```

## 🔄 مثال: Composable مخصص

```typescript path=null start=null
// composables/useCompany.ts
import { computed } from 'vue'
import { useCompaniesStore } from '~/stores/companies/storeCompanies'

export function useCompany(companyId: string) {
  const store = useCompaniesStore()

  const company = computed(() => store.getById(companyId))
  const isLoading = computed(() => store.isLoading)

  async function refresh() {
    await store.fetchById(companyId)
  }

  async function update(data: any) {
    return await store.update(companyId, data)
  }

  return {
    company,
    isLoading,
    refresh,
    update
  }
}
```

استخدامه:

```vue path=null start=null
<script setup lang="ts">
const route = useRoute()
const { company, isLoading, refresh, update } = useCompany(route.params.id as string)

onMounted(() => {
  refresh()
})
</script>

<template>
  <div v-if="company">
    <h1>{{ company.name }}</h1>
    <p>{{ company.email }}</p>
  </div>
</template>
```

## ⚡ نصائح الأداء

### 1. Cache البيانات

```typescript path=null start=null
// تحميل البيانات مرة واحدة فقط
onMounted(async () => {
  if (companiesStore.companies.length === 0) {
    await companiesStore.fetchAll()
  }
})
```

### 2. Debounce للبحث

```typescript path=null start=null
import { useDebounceFn } from '@vueuse/core'

const search = ref('')

const debouncedSearch = useDebounceFn(async (value: string) => {
  // Search logic
}, 500)

watch(search, (newValue) => {
  debouncedSearch(newValue)
})
```

### 3. Pagination

```typescript path=null start=null
const currentPage = ref(1)
const itemsPerPage = ref(10)

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return companiesStore.companies.slice(start, end)
})
```

هذه الأمثلة توضح الاستخدام الكامل للـ Pinia Stores مع Vuetify 3 و Nuxt 4! 🎉
