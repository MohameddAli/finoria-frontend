# Pagination Component - مكون الباجينيشن

## نظرة عامة - Overview

مكون Pagination محدّث للعمل مع **Nuxt 4** و **Vuetify 3** مع دعم كامل للـ RTL والثيم الديناميكي.

Updated Pagination component for **Nuxt 4** and **Vuetify 3** with full RTL and dynamic theme support.

---

## المميزات - Features

✅ **Nuxt 4 Composition API** - استخدام `<script setup>` الحديثة  
✅ **Vuetify 3 Compatible** - متوافق تمامًا مع Vuetify 3  
✅ **RTL Support** - دعم كامل للغة العربية والاتجاه من اليمين لليسار  
✅ **Theme Aware** - يتأثر تلقائيًا بثيم الموقع (ألوان primary و on-primary)  
✅ **i18n Ready** - يدعم الترجمة عبر nuxt-i18n  
✅ **Responsive** - متجاوب مع جميع أحجام الشاشات  

---

## الاستخدام - Usage

### استيراد بسيط - Basic Import

```vue
<template>
  <Pagination
    :data="paginationData"
    :per-page="10"
    @page-changed="handlePageChange"
  />
</template>

<script setup>
const paginationData = ref({
  results: [...], // المصفوفة التي تحتوي على النتائج الحالية
  count: 100      // إجمالي عدد النتائج
})

const handlePageChange = (page) => {
  console.log('الصفحة الجديدة:', page)
  // قم بتحميل بيانات الصفحة الجديدة هنا
}
</script>
```

---

## الخصائص - Props

| Property | Type | Default | Description (Arabic) | Description (English) |
|----------|------|---------|---------------------|----------------------|
| `data` | Object | `{ results: [], count: 0 }` | بيانات الباجينيشن مع `results` (المصفوفة) و `count` (إجمالي العدد) | Pagination data with `results` array and `count` total |
| `perPage` | Number | `10` | عدد العناصر في كل صفحة | Number of items per page |
| `totalVisible` | Number | `9` | عدد أزرار الصفحات المرئية | Number of visible page buttons |
| `size` | String | `'default'` | حجم الأزرار (`'small'`, `'default'`, `'large'`) | Button size |

---

## الأحداث - Events

| Event | Payload | Description (Arabic) | Description (English) |
|-------|---------|---------------------|----------------------|
| `page-changed` | `page: number` | يُطلق عند تغيير الصفحة | Emitted when page changes |
| `update:page` | `page: number` | للتكامل مع `v-model:page` | For v-model:page integration |

---

## أمثلة متقدمة - Advanced Examples

### مع Route Query Parameters

```vue
<script setup>
const router = useRouter()
const route = useRoute()

const handlePageChange = (page) => {
  router.push({
    query: { ...route.query, page }
  })
}
</script>
```

### تخصيص الألوان والحجم - Custom Colors and Size

```vue
<template>
  <Pagination
    :data="data"
    :per-page="20"
    :total-visible="7"
    size="small"
    @page-changed="handlePageChange"
  />
</template>
```

---

## التكامل مع API - API Integration

```vue
<script setup>
const page = ref(1)
const data = ref({ results: [], count: 0 })
const isLoading = ref(false)

const fetchData = async (pageNum) => {
  isLoading.value = true
  try {
    const response = await $fetch('/api/items', {
      params: { page: pageNum, per_page: 10 }
    })
    data.value = response
  } finally {
    isLoading.value = false
  }
}

const handlePageChange = (newPage) => {
  page.value = newPage
  fetchData(newPage)
}

// تحميل الصفحة الأولى عند التحميل
onMounted(() => {
  fetchData(page.value)
})
</script>

<template>
  <div>
    <div v-if="isLoading">جاري التحميل...</div>
    <div v-else>
      <!-- عرض البيانات -->
      <div v-for="item in data.results" :key="item.id">
        {{ item.name }}
      </div>
    </div>
    
    <Pagination
      :data="data"
      @page-changed="handlePageChange"
    />
  </div>
</template>
```

---

## التوافق مع الثيمات - Theme Compatibility

المكون يستخدم تلقائيًا ألوان الثيم النشط:

```css
/* الصفحة النشطة تستخدم: */
background-color: rgb(var(--v-theme-primary))
color: rgb(var(--v-theme-on-primary))
```

عند تغيير الثيم (gold/blue/red) أو الوضع (light/dark)، سيتحدث المكون تلقائيًا.

---

## الترجمات المطلوبة - Required Translations

يجب أن يكون لديك الترجمات التالية في ملفات i18n:

```json
{
  "pagination": {
    "showing_from_to_items": "عرض {from} إلى {to} من {total}",
    "rangeEmpty": "لا توجد نتائج"
  }
}
```

**English:**
```json
{
  "pagination": {
    "showing_from_to_items": "Showing {from} to {to} of {total}",
    "rangeEmpty": "No results"
  }
}
```

---

## الفروقات عن Nuxt 2 - Differences from Nuxt 2

| Feature | Nuxt 2 (Old) | Nuxt 4 (New) |
|---------|-------------|-------------|
| API Style | Options API | Composition API (`<script setup>`) |
| Router | `this.$route` | `useRoute()` |
| i18n | `this.$t()` | `useI18n()` |
| v-model | `:value` + `@input` | `v-model` |
| Theme | Manual | `useTheme()` from vuetify |
| TypeScript | Limited | Full support |

---

## الدعم - Support

- دعم كامل للـ RTL (اللغة العربية)
- دعم الوضع الداكن والفاتح
- متجاوب مع جميع الأحجام
- يعمل مع route query parameters
- **التحكم في محاذاة الباجينيشن** (start, center, end, space-between)

---

## المستندات الإضافية - Additional Documentation

- **[ALIGNMENT_CONTROL.md](./ALIGNMENT_CONTROL.md)** - دليل شامل للتحكم في محاذاة الباجينيشن
- **[SINGLE_PAGE_FIX.md](./SINGLE_PAGE_FIX.md)** - حل مشكلة الصفحة الواحدة
- **[FIRST_LAST_BUTTONS_DISABLED.md](./FIRST_LAST_BUTTONS_DISABLED.md)** - تعطيل أزرار First/Last عند صفحة واحدة
- **[MIGRATION.md](./MIGRATION.md)** - دليل الانتقال من Nuxt 2 إلى Nuxt 4
- **[BANKS_INTEGRATION.md](./BANKS_INTEGRATION.md)** - دليل دمج الباجينيشن مع صفحة البنوك

---

## ملاحظات - Notes

1. **المكون يقرأ رقم الصفحة من URL** عبر `route.query.page`
2. **يستخدم الثيم الحالي تلقائيًا** من Vuetify
3. **يدعم RTL** بشكل تلقائي عند تغيير اللغة إلى العربية
4. **لا يوجد اعتماد على مكتبات خارجية** سوى Nuxt و Vuetify

---

تم التحديث بتاريخ: 2025  
Updated: 2025
