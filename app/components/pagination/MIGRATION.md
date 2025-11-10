# Migration Guide - دليل الترحيل

## من Nuxt 2 + Vuetify 2 إلى Nuxt 4 + Vuetify 3
### From Nuxt 2 + Vuetify 2 to Nuxt 4 + Vuetify 3

---

## جدول المقارنة - Comparison Table

| الميزة - Feature | الإصدار القديم - Old Version | الإصدار الجديد - New Version |
|-----------------|----------------------------|----------------------------|
| **API Style** | Options API | Composition API with `<script setup>` |
| **Router Access** | `this.$route` | `useRoute()` composable |
| **i18n Access** | `this.$t()` | `useI18n()` composable |
| **v-model** | `:value` + `@input` | `v-model` |
| **Theme Access** | ❌ Not available | ✅ `useTheme()` from vuetify |
| **TypeScript** | ⚠️ Limited | ✅ Full support |
| **RTL Support** | ⚠️ Manual | ✅ Automatic |
| **Reactive** | `data()` + `computed` | `ref()` + `computed()` |

---

## الكود القديم - Old Code

```vue
<template>
  <div class="text-center px-4">
    <v-row justify="space-between" align="center">
      <v-col cols="auto" class="mb-3 mt-1">
        {{ $t("pagination.showing_from_to_items", { from, to, total }) }}
      </v-col>
      <v-col cols="auto">
        <v-pagination
          color="primary"
          class="my-4"
          :total-visible="9"
          :length="lastPage"
          :value="page"
          @input="pageChanged"
        ></v-pagination>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  
  props: {
    data: {
      type: Object
    },
    perPage: {
      type: Number,
      default: 10
    }
  },
  
  computed: {
    page() {
      return Number(this.$route.query.page) || 1;
    },
    
    from() {
      if (this.count) {
        return (this.page - 1) * this.perPage + 1;
      }
      return 0;
    },
    
    to() {
      if (this.count) {
        return this.from + this.count - 1;
      }
      return 0;
    },
    
    count() {
      return (this.data.results && this.data.results.length) || 0;
    },
    
    total() {
      return this.data.count || 0;
    },
    
    lastPage() {
      if (this.total) {
        return Math.ceil(this.total / this.perPage);
      }
      return 1;
    }
  },
  
  methods: {
    pageChanged(page) {
      this.$emit("page-changed", page);
    }
  }
};
</script>
```

---

## الكود الجديد - New Code

```vue
<template>
  <div class="pagination-wrapper">
    <v-row justify="space-between" align="center" class="px-4">
      <v-col cols="12" sm="auto" class="mb-2 mb-sm-3 mt-1 text-center text-sm-start">
        <span class="text-caption text-medium-emphasis">
          {{ rangeText }}
        </span>
      </v-col>
      
      <v-col cols="12" sm="auto" class="d-flex justify-center">
        <v-pagination
          v-model="currentPage"
          :length="lastPage"
          :total-visible="totalVisible"
          color="primary"
          :active-color="activeColor"
          :size="size"
          class="my-2"
          @update:model-value="handlePageChange"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useTheme } from 'vuetify'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ results: [], count: 0 })
  },
  perPage: {
    type: Number,
    default: 10
  },
  totalVisible: {
    type: Number,
    default: 9
  },
  size: {
    type: String,
    default: 'default'
  }
})

const emit = defineEmits(['page-changed', 'update:page'])

const route = useRoute()
const { t } = useI18n()
const theme = useTheme()

const activeColor = computed(() => theme.global.current.value.colors.primary)
const currentPage = ref(Number(route.query.page) || 1)

watch(() => route.query.page, (newPage) => {
  const pageNum = Number(newPage) || 1
  if (pageNum !== currentPage.value) {
    currentPage.value = pageNum
  }
})

const count = computed(() => (props.data?.results?.length) || 0)
const from = computed(() => count.value ? (currentPage.value - 1) * props.perPage + 1 : 0)
const to = computed(() => count.value ? from.value + count.value - 1 : 0)
const total = computed(() => props.data?.count || 0)
const lastPage = computed(() => total.value ? Math.ceil(total.value / props.perPage) : 1)

const rangeText = computed(() => {
  if (total.value <= 0) {
    return t('pagination.rangeEmpty') || 'لا توجد نتائج'
  }
  return t('pagination.showing_from_to_items', {
    from: from.value,
    to: to.value,
    total: total.value
  })
})

const handlePageChange = (page) => {
  currentPage.value = page
  emit('page-changed', page)
  emit('update:page', page)
}
</script>

<style scoped>
.pagination-wrapper {
  width: 100%;
}

[dir="rtl"] :deep(.v-pagination .v-btn .v-icon) {
  transform: scaleX(-1);
}

:deep(.v-pagination .v-btn[aria-current="true"]) {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-pagination .v-btn[aria-current="true"] .v-btn__content) {
  color: rgb(var(--v-theme-on-primary)) !important;
}

:deep(.v-pagination .v-btn[aria-current="true"]:hover) {
  background-color: rgb(var(--v-theme-primary)) !important;
  opacity: 0.9;
}

@media (max-width: 600px) {
  :deep(.v-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .pagination-wrapper :deep(.v-row) {
    gap: 0.5rem;
  }
}
</style>
```

---

## التغييرات الرئيسية - Key Changes

### 1. **من Options API إلى Composition API**

**قديم:**
```js
export default {
  name: "Pagination",
  props: { ... },
  computed: { ... },
  methods: { ... }
}
```

**جديد:**
```js
const props = defineProps({ ... })
const emit = defineEmits([...])
const computed = computed(() => ...)
const method = () => { ... }
```

---

### 2. **الوصول إلى Router و i18n**

**قديم:**
```js
this.$route.query.page
this.$t("pagination.showing_from_to_items")
```

**جديد:**
```js
const route = useRoute()
const { t } = useI18n()

route.query.page
t('pagination.showing_from_to_items')
```

---

### 3. **v-model بدلاً من :value + @input**

**قديم (Vuetify 2):**
```vue
<v-pagination
  :value="page"
  @input="pageChanged"
/>
```

**جديد (Vuetify 3):**
```vue
<v-pagination
  v-model="currentPage"
  @update:model-value="handlePageChange"
/>
```

---

### 4. **دعم الثيم التلقائي**

**جديد فقط:**
```js
import { useTheme } from 'vuetify'

const theme = useTheme()
const activeColor = computed(() => theme.global.current.value.colors.primary)
```

```css
:deep(.v-pagination .v-btn[aria-current="true"]) {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
}
```

---

### 5. **دعم RTL التلقائي**

**جديد فقط:**
```css
[dir="rtl"] :deep(.v-pagination .v-btn .v-icon) {
  transform: scaleX(-1);
}
```

---

### 6. **Reactive State**

**قديم:**
```js
computed: {
  page() {
    return Number(this.$route.query.page) || 1;
  }
}
```

**جديد:**
```js
const currentPage = ref(Number(route.query.page) || 1)

watch(() => route.query.page, (newPage) => {
  const pageNum = Number(newPage) || 1
  if (pageNum !== currentPage.value) {
    currentPage.value = pageNum
  }
})
```

---

### 7. **خصائص إضافية - Additional Props**

الإصدار الجديد يضيف:

```js
totalVisible: {
  type: Number,
  default: 9
},
size: {
  type: String,
  default: 'default'
}
```

---

## خطوات الترحيل - Migration Steps

### 1. استبدل الملف القديم بالملف الجديد

```bash
# نسخ احتياطية
cp app/components/pagination/Pagination.vue app/components/pagination/Pagination.vue.backup

# استبدال
# Replace the content with new version
```

### 2. تحديث ملفات الترجمة

تأكد من وجود:

```json
{
  "pagination": {
    "showing_from_to_items": "عرض {from} إلى {to} من {total}",
    "rangeEmpty": "لا توجد نتائج"
  }
}
```

### 3. لا حاجة لتغيير الاستخدام!

الاستخدام القديم **يعمل كما هو**:

```vue
<Pagination
  :data="paginationData"
  :per-page="10"
  @page-changed="handlePageChange"
/>
```

---

## الفوائد - Benefits

✅ **أداء أفضل** - Composition API أسرع  
✅ **كود أنظف** - أقل تعقيدًا  
✅ **دعم TypeScript** - تحسين التطوير  
✅ **دعم RTL** - تلقائي  
✅ **دعم الثيم** - تلقائي  
✅ **متجاوب** - أفضل على الموبايل  
✅ **قابل للصيانة** - كود أسهل للقراءة  

---

## اختبار بعد الترحيل - Testing After Migration

### 1. اختبار الوظائف الأساسية

- [ ] الصفحة الأولى تعمل
- [ ] الانتقال بين الصفحات
- [ ] عرض النطاق (from - to - total)
- [ ] التحميل من URL query

### 2. اختبار RTL

- [ ] تغيير اللغة إلى العربية
- [ ] الأيقونات معكوسة بشكل صحيح
- [ ] النص من اليمين لليسار

### 3. اختبار الثيم

- [ ] تغيير الثيم (gold/blue/red)
- [ ] تغيير الوضع (light/dark)
- [ ] الألوان تتحدث تلقائيًا

### 4. اختبار التجاوب

- [ ] الموبايل (< 600px)
- [ ] التابلت (600-960px)
- [ ] سطح المكتب (> 960px)

---

## الدعم - Support

إذا واجهت مشاكل:

1. تحقق من console للأخطاء
2. تأكد من وجود الترجمات
3. تأكد من تثبيت Vuetify 3
4. تأكد من تثبيت nuxt-i18n

---

تم التحديث: 2025  
Updated: 2025
