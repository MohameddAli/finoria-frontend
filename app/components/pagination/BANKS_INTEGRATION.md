# استخدام Pagination مع صفحة Banks
## Using Pagination with Banks Page

---

## ✅ تم التحديث بنجاح - Successfully Updated!

تم استبدال **AppPagination** بـ **Pagination** في صفحة banks.

---

## 📋 التغييرات - Changes Made:

### 1. استبدال الاستيراد - Import Replacement

**قديم:**
```js
import AppPagination from '~/components/pagination/AppPagination.vue'
```

**جديد:**
```js
import Pagination from '~/components/pagination/Pagination.vue'
```

### 2. استبدال المكون - Component Replacement

**قديم:**
```vue
<AppPagination
  :page="page"
  :length="totalPages"
  :total-items="rows.length"
  :page-size="pageSize"
  :page-sizes="[5, 10, 20, 50, 100]"
  :total-visible="5"
  :dense="false"
  :disabled="false"
  :show-page-size="true"
  :show-range="true"
  :show-first-last="true"
  :color="paginationColor"
  align="end"
  size="small"
  variant="outlined"
  @update:page="handleUpdatePage"
  @update:page-size="handleUpdatePageSize"
/>
```

**جديد:**
```vue
<Pagination
  :page="page"
  :length="totalPages"
  :total-items="rows.length"
  :page-size="pageSize"
  :page-sizes="[5, 10, 20, 50, 100]"
  :total-visible="5"
  :dense="false"
  :show-page-size="true"
  :show-range="true"
  :show-first-last="true"
  :color="paginationColor"
  align="end"
  size="small"
  @update:page="handleUpdatePage"
  @update:page-size="handleUpdatePageSize"
/>
```

---

## 🎯 المميزات المحافظ عليها - Preserved Features:

✅ **تغيير حجم الصفحة** - Page size selector  
✅ **عرض النطاق** - Range display (showing X to Y of Z)  
✅ **أزرار الانتقال السريع** - First/Last page buttons  
✅ **التأثر بالثيم** - Theme-aware colors  
✅ **دعم RTL** - RTL support  
✅ **متجاوب** - Responsive design  

---

## 🎨 المميزات الإضافية الجديدة - New Additional Features:

### 1. **دعم RTL محسّن**
```css
[dir="rtl"] :deep(.v-pagination .v-btn .v-icon) {
  transform: scaleX(-1);
}
```

### 2. **ألوان ديناميكية من الثيم**
```js
const activeColor = computed(() => theme.global.current.value.colors.primary)
```

### 3. **تخطيط مرن**
يستخدم Flexbox لتخطيط أفضل على جميع الأحجام:
```html
<div class="pagination-wrapper d-flex align-center flex-wrap gap-2">
```

---

## 📊 كيف يعمل - How It Works:

### Props المستخدمة في صفحة Banks:

| Prop | Value | الوصف - Description |
|------|-------|---------------------|
| `:page` | `page` (ref) | رقم الصفحة الحالية |
| `:length` | `totalPages` (computed) | إجمالي عدد الصفحات |
| `:total-items` | `rows.length` | إجمالي عدد العناصر |
| `:page-size` | `pageSize` (ref) | عدد العناصر في الصفحة |
| `:page-sizes` | `[5, 10, 20, 50, 100]` | خيارات أحجام الصفحات |
| `:total-visible` | `5` | عدد الأزرار المرئية |
| `:dense` | `false` | وضع مضغوط |
| `:show-page-size` | `true` | عرض محدد الحجم |
| `:show-range` | `true` | عرض النطاق |
| `:show-first-last` | `true` | أزرار الأولى/الأخيرة |
| `:color` | `paginationColor` | اللون الأساسي |
| `align` | `'end'` | المحاذاة (يمين) |
| `size` | `'small'` | حجم الأزرار |

### Events المستخدمة:

| Event | Handler | الوصف - Description |
|-------|---------|---------------------|
| `@update:page` | `handleUpdatePage` | عند تغيير الصفحة |
| `@update:page-size` | `handleUpdatePageSize` | عند تغيير حجم الصفحة |

---

## 🔄 كيفية العمل مع البيانات - How It Works with Data:

### 1. البيانات المحلية (كما في صفحة banks)

```js
// البيانات
const rows = ref([...]) // جميع السجلات

// الباجينيشن
const page = ref(1)
const pageSize = ref(10)

// الحسابات
const totalPages = computed(() => Math.max(1, Math.ceil(rows.value.length / pageSize.value)))
const displayedBanks = computed(() => {
  const start = (page.value - 1) * pageSize.value
  const end = start + pageSize.value
  return rows.value.slice(start, end)
})

// معالجات الأحداث
const handleUpdatePage = (newPage) => { page.value = newPage }
const handleUpdatePageSize = (newPageSize) => { 
  pageSize.value = newPageSize
  page.value = 1 
}
```

### 2. البيانات من API (نمط بديل)

إذا كانت البيانات تأتي من API:

```js
const paginationData = ref({
  results: [],  // النتائج الحالية
  count: 0      // إجمالي العدد
})

// استخدام بسيط
<Pagination
  :data="paginationData"
  :per-page="10"
  @page-changed="fetchData"
/>
```

---

## 🌐 دعم اللغات - Language Support:

المكون يستخدم الترجمات التالية:

```json
{
  "pagination": {
    "showing_from_to_items": "عرض {from} إلى {to} من {total}",
    "rangeEmpty": "لا توجد نتائج",
    "itemsPerPage": "العناصر في الصفحة"
  }
}
```

**English:**
```json
{
  "pagination": {
    "showing_from_to_items": "Showing {from} to {to} of {total}",
    "rangeEmpty": "No results",
    "itemsPerPage": "Items per page"
  }
}
```

---

## 🎨 التخصيص - Customization:

### تغيير الألوان

```vue
<Pagination
  :color="'secondary'"  <!-- تغيير اللون الأساسي -->
  ...
/>
```

### تغيير الحجم

```vue
<Pagination
  size="large"  <!-- small | default | large -->
  ...
/>
```

### تغيير المحاذاة

```vue
<Pagination
  align="center"  <!-- start | center | end -->
  ...
/>
```

### إخفاء العناصر

```vue
<Pagination
  :show-page-size="false"    <!-- إخفاء محدد الحجم -->
  :show-range="false"        <!-- إخفاء النطاق -->
  :show-first-last="false"   <!-- إخفاء أزرار الأولى/الأخيرة -->
  ...
/>
```

---

## 📱 التجاوب - Responsiveness:

المكون متجاوب تلقائيًا:

```css
/* على الشاشات الصغيرة */
@media (max-width: 600px) {
  :deep(.v-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
}
```

---

## 🧪 الاختبار - Testing:

### اختبار التغييرات:

1. **افتح صفحة Banks**: `/banks`
2. **جرب تغيير الصفحة**: انقر على أزرار الصفحات
3. **جرب تغيير حجم الصفحة**: اختر حجمًا مختلفًا من القائمة المنسدلة
4. **جرب أزرار الانتقال السريع**: انتقل للأولى/الأخيرة
5. **جرب RTL**: غيّر اللغة إلى العربية
6. **جرب الثيم**: غيّر بين gold/blue/red و light/dark

---

## 🔍 استكشاف الأخطاء - Troubleshooting:

### المشكلة: النطاق لا يظهر

**الحل:**
تأكد من وجود الترجمات:
```json
{
  "pagination": {
    "showing_from_to_items": "عرض {from} إلى {to} من {total}"
  }
}
```

### المشكلة: الألوان لا تتغير مع الثيم

**الحل:**
تأكد من استيراد `useTheme` من vuetify:
```js
import { useTheme } from 'vuetify'
```

### المشكلة: RTL لا يعمل

**الحل:**
تأكد من أن locale مضبوط على `'ar'` عند تغيير اللغة.

---

## 📦 الملفات ذات الصلة - Related Files:

- `app/components/pagination/Pagination.vue` - المكون الرئيسي
- `app/components/pagination/README.md` - دليل كامل
- `app/components/pagination/MIGRATION.md` - دليل الترحيل
- `app/components/pagination/PaginationExample.vue` - مثال عملي
- `app/pages/banks.vue` - صفحة banks المحدثة

---

## ✅ الخلاصة - Summary:

تم استبدال **AppPagination** بـ **Pagination** بنجاح في صفحة banks مع:

✅ الحفاظ على جميع الوظائف الأصلية  
✅ إضافة دعم RTL محسّن  
✅ إضافة ألوان ديناميكية من الثيم  
✅ تخطيط أفضل وأكثر مرونة  
✅ كود أنظف وأسهل للصيانة  

**المكون جاهز للاستخدام! 🎉**

---

تم التحديث: 2025-10-19  
Updated: 2025-10-19
