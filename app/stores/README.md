# Pinia 3 Stores Architecture

دليل شامل لاستخدام Pinia 3 Stores في مشروع AldorerDashboard

## 📁 البنية

```
stores/
├── auth/
│   └── storeAuth.ts          # إدارة المصادقة والجلسة
├── companies/
│   └── storeCompanies.ts     # إدارة الشركات (CRUD)
└── currencies/
    └── storeCurrencies.ts    # إدارة العملات (CRUD)
```

## 🎯 نمط Setup Stores

جميع المخازن مبنية باستخدام **Setup Stores** (Composition API):

```typescript
export const useMyStore = defineStore('myStore', () => {
  // State (ref)
  const data = ref<MyType[]>([])
  
  // Getters (computed)
  const count = computed(() => data.value.length)
  
  // Actions (functions)
  async function fetchData() {
    // logic
  }
  
  return { data, count, fetchData }
})
```

## 🔐 Auth Store

### الاستخدام في المكونات

```vue
<script setup lang="ts">
import { useAuthStore } from '~/stores/auth/storeAuth'

const authStore = useAuthStore()

// Login
async function handleLogin() {
  const success = await authStore.login({
    email: 'admin@example.com',
    password: 'password'
  })
  
  if (success) {
    // Redirect to dashboard
  }
}

// Logout
function handleLogout() {
  authStore.logout()
  // Redirect to login
}
</script>

<template>
  <div>
    <p v-if="authStore.isAuthenticated">
      مرحباً {{ authStore.adminName }}
    </p>
    <v-btn @click="handleLogout" v-if="authStore.isAuthenticated">
      تسجيل خروج
    </v-btn>
  </div>
</template>
```

### State & Getters

- `admin`: بيانات المسؤول الحالي
- `token`: JWT token
- `isLoading`: حالة التحميل
- `error`: رسالة خطأ
- `isAuthenticated`: computed - هل المستخدم مسجل دخول؟
- `adminName`: computed - اسم المسؤول
- `adminEmail`: computed - بريد المسؤول

### Actions

- `login(credentials)`: تسجيل الدخول
- `logout()`: تسجيل الخروج
- `restoreSession()`: استعادة الجلسة من localStorage
- `clearError()`: مسح رسالة الخطأ

## 🏢 Companies Store

### مثال CRUD كامل

```vue
<script setup lang="ts">
import { useCompaniesStore } from '~/stores/companies/storeCompanies'
import { onMounted } from 'vue'

const companiesStore = useCompaniesStore()

// Fetch all companies on mount
onMounted(async () => {
  await companiesStore.fetchAll()
})

// Create company
async function createCompany() {
  const newCompany = await companiesStore.create({
    name: 'شركة جديدة',
    email: 'company@example.com',
    phone: '0911234567',
    address: 'طرابلس',
    is_active: true
  })
  
  if (newCompany) {
    // Success
  }
}

// Update company
async function updateCompany(id: string) {
  const success = await companiesStore.update(id, {
    email: 'company@example.com', // required
    name: 'اسم محدث',
    is_active: true
  })
}

// Delete company
async function deleteCompany(id: string) {
  const success = await companiesStore.remove(id)
  if (success) {
    // Company deleted
  }
}
</script>

<template>
  <div>
    <v-progress-linear v-if="companiesStore.isLoading" indeterminate />
    
    <v-alert v-if="companiesStore.error" type="error">
      {{ companiesStore.error }}
    </v-alert>
    
    <v-list>
      <v-list-item 
        v-for="company in companiesStore.companies" 
        :key="company.id"
      >
        {{ company.name }}
      </v-list-item>
    </v-list>
    
    <p>عدد الشركات النشطة: {{ companiesStore.activeCompanies.length }}</p>
  </div>
</template>
```

### State & Getters

- `companies`: قائمة الشركات
- `currentCompany`: الشركة المحددة حالياً
- `isLoading`: حالة التحميل
- `error`: رسالة خطأ
- `companiesCount`: computed - عدد الشركات
- `activeCompanies`: computed - الشركات النشطة فقط
- `inactiveCompanies`: computed - الشركات غير النشطة

### Actions

- `fetchAll()`: جلب جميع الشركات
- `fetchById(id)`: جلب شركة بالمعرف
- `create(payload)`: إنشاء شركة جديدة
- `update(id, payload)`: تحديث شركة
- `remove(id)`: حذف شركة
- `getById(id)`: البحث في المخزن المحلي
- `clearCurrent()`: مسح الشركة الحالية
- `clearError()`: مسح رسالة الخطأ

## 💱 Currencies Store

### الاستخدام

```vue
<script setup lang="ts">
import { useCurrenciesStore } from '~/stores/currencies/storeCurrencies'

const currenciesStore = useCurrenciesStore()

// Create currency
async function createCurrency() {
  const currency = await currenciesStore.create({
    name: 'دولار أمريكي',
    code: 'USD',
    symbol: '$',
    exchange_rate: 1,
    is_active: true
  })
}

// Update currency (all fields required)
async function updateCurrency(id: string) {
  const success = await currenciesStore.update(id, {
    symbol: '$',           // required
    exchange_rate: 1.2,    // required
    is_active: true,       // required
    name: 'دولار',
    code: 'USD'
  })
}

// Delete currency (204 No Content)
async function deleteCurrency(id: string) {
  const success = await currenciesStore.remove(id)
  // API returns 204, handled automatically
}
</script>

<template>
  <div>
    <v-select
      :items="currenciesStore.activeCurrencies"
      item-title="name"
      item-value="id"
      label="اختر العملة"
    />
  </div>
</template>
```

### State & Getters

- `currencies`: قائمة العملات
- `currentCurrency`: العملة المحددة حالياً
- `isLoading`: حالة التحميل
- `error`: رسالة خطأ
- `currenciesCount`: computed - عدد العملات
- `activeCurrencies`: computed - العملات النشطة فقط
- `inactiveCurrencies`: computed - العملات غير النشطة

### Actions

- `fetchAll()`: جلب جميع العملات
- `fetchById(id)`: جلب عملة بالمعرف
- `create(payload)`: إنشاء عملة جديدة
- `update(id, payload)`: تحديث عملة (symbol, exchange_rate, is_active مطلوبة)
- `remove(id)`: حذف عملة (returns 204)
- `getById(id)`: البحث في المخزن المحلي
- `getByCode(code)`: البحث بالرمز
- `clearCurrent()`: مسح العملة الحالية
- `clearError()`: مسح رسالة الخطأ

## 🔄 معالجة الأخطاء

جميع Stores تتبع نفس النمط:

```typescript
async function someAction() {
  try {
    // API call
  } catch (err) {
    error.value = (err as ApiError).message || 'رسالة افتراضية'
  } finally {
    isLoading.value = false
  }
}
```

### في المكونات

```vue
<script setup lang="ts">
const store = useMyStore()

async function doSomething() {
  const success = await store.someAction()
  
  if (!success && store.error) {
    // Show error toast/snackbar
    console.error(store.error)
  }
}
</script>
```

## 💡 أفضل الممارسات

### 1. استخدام storeToRefs للـ destructuring

```typescript
import { storeToRefs } from 'pinia'

const store = useCompaniesStore()
const { companies, isLoading } = storeToRefs(store)
const { fetchAll, create } = store // actions لا تحتاج storeToRefs
```

### 2. مسح الأخطاء بعد المعالجة

```typescript
onMounted(() => {
  store.clearError()
})
```

### 3. استخدام Computed للفلترة

```typescript
const activeItems = computed(() => 
  store.items.filter(item => item.is_active)
)
```

### 4. تجنب الطلبات المتكررة

```typescript
onMounted(async () => {
  if (store.companies.length === 0) {
    await store.fetchAll()
  }
})
```

## 🎨 التكامل مع Vuetify 3

```vue
<template>
  <v-container>
    <!-- Loading -->
    <v-progress-linear 
      v-if="store.isLoading" 
      indeterminate 
      color="primary"
    />
    
    <!-- Error Alert -->
    <v-alert 
      v-if="store.error" 
      type="error" 
      closable
      @click:close="store.clearError()"
    >
      {{ store.error }}
    </v-alert>
    
    <!-- Data Table -->
    <v-data-table
      :items="store.companies"
      :loading="store.isLoading"
    />
  </v-container>
</template>
```

## 📦 Services Layer

جميع Stores تستخدم Services layer احترافية:

```typescript
import { companyService } from '~/services'

// في Store
const companies = await companyService.getAll()
```

Services تتعامل مع:
- HTTP requests
- Token management
- Error handling
- Response parsing (including 204 No Content)

## 🔗 الربط مع API

Base URL: `https://www.aldorer.com/api`

جميع الطلبات تستخدم `Authorization: Bearer {token}` تلقائياً.
