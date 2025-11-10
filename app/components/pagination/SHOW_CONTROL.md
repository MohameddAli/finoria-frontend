# خاصية التحكم في الإظهار/الإخفاء - Show/Hide Control Property

## 🎯 الخاصية الجديدة - New Property

تم إضافة خاصية **`show`** للتحكم الكامل في إظهار أو إخفاء مكون الباجينيشن من الصفحة الأم.

---

## 📋 التعريف - Definition

```js
show: {
  type: Boolean,
  default: true  // يظهر افتراضياً
}
```

---

## 🔧 كيفية العمل - How It Works

### في مكون Pagination:

```js
const shouldHidePagination = computed(() => {
  // إذا تم تعيين show إلى false، أخفِ المكون
  if (!props.show) return true
  
  // إذا تم تفعيل hideOnSinglePage وكانت صفحة واحدة، أخفِ المكون
  return props.hideOnSinglePage && lastPage.value <= 1
})
```

```vue
<template>
  <div v-if="!shouldHidePagination" class="pagination-wrapper ...">
    <!-- المحتوى -->
  </div>
</template>
```

---

## 💡 الاستخدام - Usage

### 1. الاستخدام البسيط

```vue
<template>
  <Pagination
    :show="true"
    :page="page"
    :length="totalPages"
  />
</template>
```

---

### 2. التحكم الديناميكي

```vue
<template>
  <div>
    <!-- زر للتحكم -->
    <v-btn @click="showPagination = !showPagination">
      {{ showPagination ? 'إخفاء' : 'إظهار' }} الباجينيشن
    </v-btn>
    
    <!-- المكون -->
    <Pagination
      :show="showPagination"
      :page="page"
      :length="totalPages"
    />
  </div>
</template>

<script setup>
const showPagination = ref(true)
</script>
```

---

### 3. الإخفاء بناءً على شرط

```vue
<template>
  <Pagination
    :show="rows.length > 10"
    :page="page"
    :length="totalPages"
  />
</template>

<script setup>
const rows = ref([...])
</script>
```

**النتيجة:**
- ✅ يظهر فقط عندما يكون هناك أكثر من 10 سجلات
- ❌ يختفي عندما تكون السجلات 10 أو أقل

---

## 🎨 مثال في صفحة Banks - Banks Page Example

### الكود المحدث:

```vue
<template>
  <v-container id="Banks" fluid tag="section">
    <div>
      <v-card class="my-4 mx-auto">
        <v-card-title>
          <div class="d-flex justify-space-between align-center">
            <div>{{ $t('pages.banks.title') }}</div>
            <div class="d-flex gap-2">
              <!-- زر التحكم في إظهار/إخفاء الباجينيشن -->
              <v-btn 
                fab 
                small 
                :color="showPagination ? 'success' : 'grey'" 
                @click="showPagination = !showPagination"
              >
                <v-icon color="white">
                  {{ showPagination ? 'mdi-eye' : 'mdi-eye-off' }}
                </v-icon>
              </v-btn>
              
              <v-btn fab small color="primary" @click="openAddDialog">
                <v-icon color="white">mdi-plus</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card-title>

        <v-card-text>
          <!-- الجدول -->
          <v-data-table ... />

          <!-- الباجينيشن -->
          <div class="d-flex justify-end mt-4">
            <Pagination
              :show="showPagination"
              :page="page"
              :length="totalPages"
              :total-items="rows.length"
              :page-size="pageSize"
              @update:page="handleUpdatePage"
              @update:page-size="handleUpdatePageSize"
            />
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
const showPagination = ref(true) // التحكم في إظهار/إخفاء الباجينيشن
const page = ref(1)
const pageSize = ref(10)
const rows = ref([...])

const totalPages = computed(() => Math.ceil(rows.value.length / pageSize.value))
</script>
```

---

## 🎯 حالات الاستخدام - Use Cases

### 1. إخفاء الباجينيشن في وضع الطباعة

```vue
<script setup>
const isPrintMode = ref(false)

const handlePrint = () => {
  isPrintMode.value = true
  window.print()
  isPrintMode.value = false
}
</script>

<template>
  <Pagination :show="!isPrintMode" ... />
</template>
```

---

### 2. إخفاء عند البحث أو التصفية

```vue
<script setup>
const searchQuery = ref('')
const isFiltering = computed(() => searchQuery.value.length > 0)
</script>

<template>
  <v-text-field v-model="searchQuery" label="بحث..." />
  
  <Pagination 
    :show="!isFiltering" 
    ... 
  />
</template>
```

---

### 3. إخفاء للمستخدمين بدون صلاحيات

```vue
<script setup>
const user = useCurrentUser()
const canChangePage = computed(() => user.value?.role === 'admin')
</script>

<template>
  <Pagination :show="canChangePage" ... />
</template>
```

---

### 4. إخفاء في وضع التحميل

```vue
<script setup>
const isLoading = ref(false)
</script>

<template>
  <v-progress-linear v-if="isLoading" indeterminate />
  
  <Pagination :show="!isLoading" ... />
</template>
```

---

## 📊 الفرق بين show و hideOnSinglePage

| الخاصية | الغرض | التحكم |
|---------|-------|--------|
| **`show`** | إظهار/إخفاء كامل من الصفحة الأم | ✅ تحكم كامل من الخارج |
| **`hideOnSinglePage`** | إخفاء تلقائي عند صفحة واحدة | ⚙️ منطق داخلي |

---

## 🔄 الجمع بينهما - Combining Both

```vue
<Pagination
  :show="userWantsToSeePagination"
  :hide-on-single-page="true"
  ...
/>
```

**المنطق:**

1. **أولاً** يتحقق من `show`
   - إذا `false` → يخفي المكون (لا يهم أي شيء آخر)
   
2. **ثانياً** يتحقق من `hideOnSinglePage`
   - إذا `true` وكانت صفحة واحدة → يخفي المكون
   
3. **أخيراً** يظهر المكون

---

## 🎨 أمثلة متقدمة - Advanced Examples

### مثال 1: تبديل مع حفظ في localStorage

```vue
<script setup>
const showPagination = ref(
  localStorage.getItem('showPagination') === 'true'
)

watch(showPagination, (newValue) => {
  localStorage.setItem('showPagination', String(newValue))
})
</script>

<template>
  <v-switch
    v-model="showPagination"
    label="إظهار الباجينيشن"
  />
  
  <Pagination :show="showPagination" ... />
</template>
```

---

### مثال 2: إخفاء تلقائي بناءً على حجم الشاشة

```vue
<script setup>
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const showPaginationOnMobile = ref(false)

const showPagination = computed(() => {
  if (mobile.value) {
    return showPaginationOnMobile.value
  }
  return true // دائماً يظهر على الشاشات الكبيرة
})
</script>

<template>
  <!-- زر للموبايل فقط -->
  <v-btn v-if="mobile" @click="showPaginationOnMobile = !showPaginationOnMobile">
    تبديل الباجينيشن
  </v-btn>
  
  <Pagination :show="showPagination" ... />
</template>
```

---

### مثال 3: إخفاء مع رسالة توضيحية

```vue
<script setup>
const showPagination = ref(true)
</script>

<template>
  <div>
    <v-btn @click="showPagination = !showPagination">
      {{ showPagination ? 'إخفاء' : 'إظهار' }} الباجينيشن
    </v-btn>
    
    <v-alert v-if="!showPagination" type="info" class="mt-2">
      الباجينيشن مخفي حالياً. انقر الزر لإظهاره.
    </v-alert>
    
    <Pagination :show="showPagination" ... />
  </div>
</template>
```

---

## 🧪 كيفية الاختبار - How to Test

### في صفحة Banks:

1. **افتح الصفحة**: `/banks`

2. **لاحظ زر العين** 👁️ في أعلى يمين الصفحة

3. **انقر على الزر**:
   - ✅ الباجينيشن يختفي تماماً
   - 🟢 الزر يتحول للون الرمادي
   - 👁️‍🗨️ الأيقونة تتغير إلى `mdi-eye-off`

4. **انقر مرة أخرى**:
   - ✅ الباجينيشن يظهر
   - 🟢 الزر يتحول للون الأخضر
   - 👁️ الأيقونة تتغير إلى `mdi-eye`

---

## 💻 الكود الكامل في banks.vue

```vue
<script setup>
// ... imports

// Pagination control
const page = ref(1)
const pageSize = ref(10)
const showPagination = ref(true) // ✨ الخاصية الجديدة

// ... rest of code
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>
        <div class="d-flex justify-space-between align-center">
          <div>{{ $t('pages.banks.title') }}</div>
          <div class="d-flex gap-2">
            <!-- ✨ زر التحكم -->
            <v-btn 
              fab 
              small 
              :color="showPagination ? 'success' : 'grey'" 
              @click="showPagination = !showPagination"
            >
              <v-icon color="white">
                {{ showPagination ? 'mdi-eye' : 'mdi-eye-off' }}
              </v-icon>
            </v-btn>
            
            <v-btn fab small color="primary" @click="openAddDialog">
              <v-icon color="white">mdi-plus</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <v-card-text>
        <!-- Table -->
        <v-data-table ... />

        <!-- ✨ Pagination with show control -->
        <div class="d-flex justify-end mt-4">
          <Pagination
            :show="showPagination"
            :page="page"
            :length="totalPages"
            :total-items="rows.length"
            :page-size="pageSize"
            :page-sizes="[5, 10, 20, 50, 100]"
            :total-visible="5"
            :show-page-size="true"
            :show-range="true"
            :show-first-last="true"
            @update:page="handleUpdatePage"
            @update:page-size="handleUpdatePageSize"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>
```

---

## 📚 الخلاصة - Summary

### الخاصية الجديدة:

```js
:show="true | false"
```

### الفوائد:

1. ✅ **تحكم كامل** من الصفحة الأم
2. ✅ **مرونة عالية** لأي حالة استخدام
3. ✅ **سهولة الاستخدام** - boolean بسيط
4. ✅ **تكامل سلس** مع الخصائص الأخرى

### متى تستخدمها:

- ✅ عند الحاجة لإخفاء/إظهار ديناميكي
- ✅ عند الاعتماد على شروط خارجية
- ✅ عند التحكم بواسطة المستخدم
- ✅ عند الدمج مع حالات UI أخرى

---

**🎉 الآن لديك تحكم كامل في إظهار/إخفاء الباجينيشن من أي صفحة!**

تم التحديث: 2025-10-19  
Updated: 2025-10-19
