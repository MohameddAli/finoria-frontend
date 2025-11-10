# مكون التحكم بإظهار/إخفاء الأعمدة
# Column Visibility Selector Component

## 📖 نظرة عامة | Overview

**العربية:**
مكون قابل لإعادة الاستخدام للتحكم في إظهار/إخفاء أعمدة الجداول في تطبيقات Nuxt 4 + Vuetify 3. يتيح للمستخدمين اختيار الأعمدة التي يرغبون في عرضها بشكل ديناميكي.

**English:**
A reusable component for controlling table column visibility in Nuxt 4 + Vuetify 3 applications. Allows users to dynamically select which columns they want to display.

---

## ✨ المميزات | Features

### العربية:
- ✅ قائمة منسدلة متعددة الاختيارات للأعمدة
- ✅ أزرار "تحديد الكل" و "مسح الكل"
- ✅ عرض الأعمدة المحددة على شكل Chips
- ✅ تكوين الأعمدة الافتراضية المرئية
- ✅ دعم كامل للـ RTL (العربية)
- ✅ قابل للتخصيص بالكامل (الألوان، الأحجام، النصوص)
- ✅ تكامل سلس مع v-data-table
- ✅ TypeScript Support

### English:
- ✅ Multi-select dropdown for columns
- ✅ "Select All" and "Clear All" buttons
- ✅ Selected columns displayed as chips
- ✅ Default visible columns configuration
- ✅ Full RTL support (Arabic)
- ✅ Fully customizable (colors, sizes, texts)
- ✅ Seamless integration with v-data-table
- ✅ TypeScript Support

---

## 📦 موقع الملف | File Location

```
app/
└── components/
    └── table/
        ├── ColumnVisibilitySelector.vue  ← المكون الرئيسي | Main Component
        └── COLUMN_VISIBILITY_GUIDE.md    ← هذا الملف | This File
```

---

## 🚀 الاستخدام السريع | Quick Usage

### 1️⃣ الخطوة الأولى: استيراد المكون | Step 1: Import Component

```vue
<script setup lang="ts">
import ColumnVisibilitySelector from '~/components/table/ColumnVisibilitySelector.vue'
</script>
```

### 2️⃣ الخطوة الثانية: إعداد البيانات | Step 2: Setup Data

```vue
<script setup lang="ts">
const { t } = useI18n()

// State for selected columns
const selectedHeaders = ref([])

// Default visible columns (by key)
const defaultVisibleColumns = ['id', 'name', 'email', 'status', 'actions']

// All available columns
const allHeaders = computed(() => ([
  { title: t('attributes.id'),      key: 'id',         width: 100, align: 'start',  sortable: true },
  { title: t('attributes.name'),    key: 'name',       width: 200, align: 'start',  sortable: true },
  { title: t('attributes.email'),   key: 'email',      width: 240, align: 'start',  sortable: true },
  { title: t('attributes.phone'),   key: 'phone',      width: 160, align: 'start',  sortable: true },
  { title: t('attributes.status'),  key: 'status',     width: 120, align: 'center', sortable: true },
  { title: t('attributes.created'), key: 'created_at', width: 180, align: 'start',  sortable: true },
  { title: t('common.actions'),     key: 'actions',    width: 140, align: 'center', sortable: false },
]))

// Visible headers (filtered based on selection)
const tableHeaders = computed(() => {
  if (!selectedHeaders.value || selectedHeaders.value.length === 0) {
    return allHeaders.value.filter(h => defaultVisibleColumns.includes(h.key))
  }
  return selectedHeaders.value
})

// Handle column visibility changes
const handleColumnChange = (columns) => {
  console.log('Visible columns:', columns.map(c => c.key))
}
</script>
```

### 3️⃣ الخطوة الثالثة: استخدام المكون في القالب | Step 3: Use Component in Template

```vue
<template>
  <v-card>
    <v-card-text>
      <!-- Column Visibility Selector -->
      <div class="px-4 mb-2">
        <ColumnVisibilitySelector
          v-model="selectedHeaders"
          :columns="allHeaders"
          :default-visible-columns="defaultVisibleColumns"
          :label="t('common.show_columns') || 'Show Columns'"
          :select-all-text="t('common.all') || 'All'"
          :clear-all-text="t('common.clear') || 'Clear'"
          :more-text="t('common.more') || 'more'"
          @change="handleColumnChange"
        />
      </div>

      <v-divider />

      <!-- Data Table -->
      <v-data-table
        :headers="tableHeaders"
        :items="items"
        :items-per-page="10"
      />
    </v-card-text>
  </v-card>
</template>
```

---

## 🎛️ Props التفصيلية | Detailed Props

### العربية:

| Prop | النوع | القيمة الافتراضية | الوصف |
|------|-------|-------------------|-------|
| `columns` | `Array` | `[]` | **مطلوب** - جميع الأعمدة المتاحة |
| `defaultVisibleColumns` | `Array` | `[]` | مفاتيح الأعمدة الافتراضية المرئية |
| `modelValue` | `Array` | `[]` | v-model - الأعمدة المحددة حالياً |
| `label` | `String` | `'Show Columns'` | نص التسمية للقائمة المنسدلة |
| `density` | `String` | `'comfortable'` | كثافة العنصر: `'compact'` / `'comfortable'` / `'default'` |
| `variant` | `String` | `'outlined'` | نمط العنصر: `'outlined'` / `'filled'` / `'solo'` / `'plain'` |
| `color` | `String` | `'primary'` | لون العنصر الأساسي |
| `chipColor` | `String` | `'primary'` | لون الـ chips |
| `showChips` | `Boolean` | `true` | إظهار الأعمدة المحددة كـ chips |
| `maxChipsDisplay` | `Number` | `3` | الحد الأقصى لعدد الـ chips المعروضة |
| `moreText` | `String` | `'more'` | نص "+X more" |
| `showSelectAll` | `Boolean` | `true` | إظهار زر "تحديد الكل" |
| `showClearAll` | `Boolean` | `true` | إظهار زر "مسح الكل" |
| `selectAllText` | `String` | `'All'` | نص زر "تحديد الكل" |
| `clearAllText` | `String` | `'Clear'` | نص زر "مسح الكل" |
| `prependIcon` | `String` | `'mdi-table-column'` | أيقونة قبل النص |

### English:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `Array` | `[]` | **Required** - All available columns |
| `defaultVisibleColumns` | `Array` | `[]` | Keys of default visible columns |
| `modelValue` | `Array` | `[]` | v-model - Currently selected columns |
| `label` | `String` | `'Show Columns'` | Dropdown label text |
| `density` | `String` | `'comfortable'` | Component density: `'compact'` / `'comfortable'` / `'default'` |
| `variant` | `String` | `'outlined'` | Component variant: `'outlined'` / `'filled'` / `'solo'` / `'plain'` |
| `color` | `String` | `'primary'` | Primary component color |
| `chipColor` | `String` | `'primary'` | Chips color |
| `showChips` | `Boolean` | `true` | Show selected columns as chips |
| `maxChipsDisplay` | `Number` | `3` | Maximum chips to display |
| `moreText` | `String` | `'more'` | "+X more" text |
| `showSelectAll` | `Boolean` | `true` | Show "Select All" button |
| `showClearAll` | `Boolean` | `true` | Show "Clear All" button |
| `selectAllText` | `String` | `'All'` | "Select All" button text |
| `clearAllText` | `String` | `'Clear'` | "Clear All" button text |
| `prependIcon` | `String` | `'mdi-table-column'` | Prepend icon |

---

## 📤 Events الأحداث | Events

### العربية:

| الحدث | المعاملات | الوصف |
|-------|-----------|-------|
| `update:modelValue` | `columns: Array` | يُطلق عند تغيير الأعمدة المحددة |
| `change` | `columns: Array` | يُطلق عند تغيير الأعمدة المحددة (نسخة بديلة) |

### English:

| Event | Parameters | Description |
|-------|------------|-------------|
| `update:modelValue` | `columns: Array` | Emitted when selected columns change |
| `change` | `columns: Array` | Emitted when selected columns change (alternative) |

---

## 🎯 أمثلة متقدمة | Advanced Examples

### مثال 1: تخصيص كامل | Example 1: Full Customization

**العربية:**
```vue
<ColumnVisibilitySelector
  v-model="selectedHeaders"
  :columns="allHeaders"
  :default-visible-columns="['id', 'name', 'email']"
  label="اختر الأعمدة المرئية"
  select-all-text="الكل"
  clear-all-text="مسح"
  more-text="المزيد"
  color="success"
  chip-color="info"
  variant="filled"
  density="compact"
  :max-chips-display="5"
  prepend-icon="mdi-view-column"
  @change="handleColumnChange"
/>
```

**English:**
```vue
<ColumnVisibilitySelector
  v-model="selectedHeaders"
  :columns="allHeaders"
  :default-visible-columns="['id', 'name', 'email']"
  label="Choose Visible Columns"
  select-all-text="All"
  clear-all-text="Clear"
  more-text="more"
  color="success"
  chip-color="info"
  variant="filled"
  density="compact"
  :max-chips-display="5"
  prepend-icon="mdi-view-column"
  @change="handleColumnChange"
/>
```

### مثال 2: بدون أزرار تحديد/مسح | Example 2: Without Select/Clear Buttons

```vue
<ColumnVisibilitySelector
  v-model="selectedHeaders"
  :columns="allHeaders"
  :default-visible-columns="defaultVisibleColumns"
  :show-select-all="false"
  :show-clear-all="false"
  :show-chips="true"
/>
```

### مثال 3: مع حفظ التفضيلات | Example 3: With Preferences Persistence

```vue
<script setup lang="ts">
const selectedHeaders = ref([])

// Load saved preferences from localStorage
onMounted(() => {
  const saved = localStorage.getItem('table-visible-columns')
  if (saved) {
    try {
      const keys = JSON.parse(saved)
      selectedHeaders.value = allHeaders.value.filter(h => keys.includes(h.key))
    } catch (e) {
      console.error('Failed to load column preferences', e)
    }
  }
})

// Save preferences when changed
const handleColumnChange = (columns) => {
  const keys = columns.map(c => c.key)
  localStorage.setItem('table-visible-columns', JSON.stringify(keys))
}
</script>

<template>
  <ColumnVisibilitySelector
    v-model="selectedHeaders"
    :columns="allHeaders"
    :default-visible-columns="defaultVisibleColumns"
    @change="handleColumnChange"
  />
</template>
```

---

## 📋 تكامل كامل مع الصفحة | Full Page Integration

### مثال كامل | Complete Example

```vue
<template>
  <v-container fluid>
    <v-card class="my-4 mx-auto">
      <v-card-title>
        <div class="d-flex justify-space-between align-center">
          <div>{{ $t('pages.users.title') }}</div>
          <v-btn color="primary" @click="openAddDialog">
            <v-icon>mdi-plus</v-icon>
            {{ $t('common.add') }}
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text>
        <v-divider />

        <!-- Column Visibility Selector -->
        <div class="px-4 mb-2">
          <ColumnVisibilitySelector
            v-model="selectedHeaders"
            :columns="allHeaders"
            :default-visible-columns="defaultVisibleColumns"
            :label="t('common.show_columns')"
            :select-all-text="t('common.all')"
            :clear-all-text="t('common.clear')"
            :more-text="t('common.more')"
            @change="handleColumnChange"
          />
        </div>

        <v-divider />

        <!-- Filters (optional) -->
        <FilterPanel
          v-model="filters"
          :fields="filterFields"
          @submit="applyFilters"
          @clear="clearFilters"
        />

        <!-- Data Table -->
        <v-data-table
          :headers="tableHeaders"
          :items="displayedItems"
          :items-per-page="pageSize"
          hide-default-footer
          class="elevation-1"
        >
          <template #item.status="{ item }">
            <v-chip :color="item.status ? 'success' : 'error'">
              {{ item.status ? t('common.active') : t('common.inactive') }}
            </v-chip>
          </template>

          <template #item.actions="{ item, index }">
            <v-btn icon size="small" color="primary" @click="editItem(index)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon size="small" color="error" @click="deleteItem(index)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>

        <!-- Pagination -->
        <div class="d-flex justify-end mt-4">
          <AppPagination
            :page="page"
            :length="totalPages"
            :total-items="items.length"
            :page-size="pageSize"
            @update:page="page = $event"
            @update:page-size="pageSize = $event"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import ColumnVisibilitySelector from '~/components/table/ColumnVisibilitySelector.vue'
import FilterPanel from '~/components/filters/FilterPanel.vue'
import AppPagination from '~/components/pagination/AppPagination.vue'

definePageMeta({
  layout: 'dashboard',
  title: 'pages.users.title'
})

const { t } = useI18n()

// Column visibility
const selectedHeaders = ref([])
const defaultVisibleColumns = ['id', 'name', 'email', 'phone', 'status', 'actions']

// All available columns
const allHeaders = computed(() => ([
  { title: t('attributes.id'),         key: 'id',         width: 100, align: 'start',  sortable: true },
  { title: t('attributes.name'),       key: 'name',       width: 200, align: 'start',  sortable: true },
  { title: t('attributes.email'),      key: 'email',      width: 240, align: 'start',  sortable: true },
  { title: t('attributes.phone'),      key: 'phone',      width: 160, align: 'start',  sortable: true },
  { title: t('attributes.address'),    key: 'address',    width: 200, align: 'start',  sortable: true },
  { title: t('attributes.status'),     key: 'status',     width: 120, align: 'center', sortable: true },
  { title: t('attributes.created_at'), key: 'created_at', width: 180, align: 'start',  sortable: true },
  { title: t('attributes.updated_at'), key: 'updated_at', width: 180, align: 'start',  sortable: true },
  { title: t('common.actions'),        key: 'actions',    width: 140, align: 'center', sortable: false },
]))

// Visible headers based on selection
const tableHeaders = computed(() => {
  if (!selectedHeaders.value || selectedHeaders.value.length === 0) {
    return allHeaders.value.filter(h => defaultVisibleColumns.includes(h.key))
  }
  return selectedHeaders.value
})

// Data
const items = ref([
  { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', phone: '0912345678', status: true },
  { id: 2, name: 'فاطمة علي', email: 'fatima@example.com', phone: '0923456789', status: true },
  // ... more items
])

// Pagination
const page = ref(1)
const pageSize = ref(10)
const totalPages = computed(() => Math.ceil(items.value.length / pageSize.value))
const displayedItems = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return items.value.slice(start, start + pageSize.value)
})

// Handlers
const handleColumnChange = (columns) => {
  console.log('Visible columns:', columns.map(c => c.key))
  // Save to localStorage or backend
  localStorage.setItem('users-visible-columns', JSON.stringify(columns.map(c => c.key)))
}

const openAddDialog = () => {
  // Implementation
}

const editItem = (index) => {
  // Implementation
}

const deleteItem = (index) => {
  // Implementation
}
</script>
```

---

## 🌐 دعم اللغات | Language Support

### إضافة الترجمات | Add Translations

**ملف: `app/i18n/locales/en.json`**
```json
{
  "common": {
    "show_columns": "Show Columns",
    "all": "All",
    "clear": "Clear",
    "more": "more",
    "actions": "Actions",
    "active": "Active",
    "inactive": "Inactive"
  },
  "attributes": {
    "id": "ID",
    "name": "Name",
    "email": "Email",
    "phone": "Phone",
    "status": "Status",
    "created_at": "Created At",
    "updated_at": "Updated At"
  }
}
```

**ملف: `app/i18n/locales/ar.json`**
```json
{
  "common": {
    "show_columns": "إظهار الأعمدة",
    "all": "الكل",
    "clear": "مسح",
    "more": "المزيد",
    "actions": "الإجراءات",
    "active": "نشط",
    "inactive": "غير نشط"
  },
  "attributes": {
    "id": "الرقم",
    "name": "الاسم",
    "email": "البريد الإلكتروني",
    "phone": "الهاتف",
    "status": "الحالة",
    "created_at": "تاريخ الإنشاء",
    "updated_at": "تاريخ التحديث"
  }
}
```

---

## 🎨 التخصيص المتقدم | Advanced Customization

### تغيير الألوان | Color Customization

```vue
<ColumnVisibilitySelector
  color="success"        <!-- Primary color -->
  chip-color="info"      <!-- Chip color -->
  select-all-color="primary"
  clear-all-color="error"
/>
```

### تغيير الكثافة والنمط | Density & Variant

```vue
<ColumnVisibilitySelector
  density="compact"      <!-- compact | comfortable | default -->
  variant="filled"       <!-- outlined | filled | solo | plain -->
/>
```

### إضافة Hint | Add Hint

```vue
<ColumnVisibilitySelector
  hint="اختر الأعمدة التي تريد عرضها في الجدول"
  :persistent-hint="true"
/>
```

---

## 🔧 استكشاف الأخطاء | Troubleshooting

### العربية:

#### المشكلة 1: لا تظهر الأعمدة المحددة
**الحل:**
- تأكد من أن `v-model` مرتبط بشكل صحيح
- تأكد من أن `tableHeaders` يستخدم `selectedHeaders.value`
- تحقق من أن `allHeaders` يحتوي على جميع الأعمدة

#### المشكلة 2: الأعمدة الافتراضية لا تظهر
**الحل:**
- تأكد من أن مفاتيح `defaultVisibleColumns` تطابق `key` في `allHeaders`
- تحقق من computed `tableHeaders`

#### المشكلة 3: الترجمات لا تظهر
**الحل:**
- تأكد من أن ملفات الترجمة محدثة
- تحقق من أن `useI18n()` مستورد ومستخدم بشكل صحيح

### English:

#### Issue 1: Selected columns not showing
**Solution:**
- Ensure `v-model` is properly bound
- Verify `tableHeaders` uses `selectedHeaders.value`
- Check that `allHeaders` contains all columns

#### Issue 2: Default columns not showing
**Solution:**
- Ensure `defaultVisibleColumns` keys match `key` in `allHeaders`
- Verify computed `tableHeaders`

#### Issue 3: Translations not showing
**Solution:**
- Ensure translation files are updated
- Verify `useI18n()` is imported and used correctly

---

## ✅ قائمة التحقق للتطبيق | Implementation Checklist

### العربية:

- [ ] استيراد المكون `ColumnVisibilitySelector`
- [ ] إنشاء `selectedHeaders` ref
- [ ] تعريف `defaultVisibleColumns` array
- [ ] إنشاء `allHeaders` computed مع جميع الأعمدة
- [ ] إنشاء `tableHeaders` computed مع منطق التصفية
- [ ] إضافة المكون في القالب قبل الجدول
- [ ] ربط `v-model` بـ `selectedHeaders`
- [ ] تمرير جميع الـ props المطلوبة
- [ ] إضافة معالج `@change` (اختياري)
- [ ] إضافة الترجمات في ملفات i18n
- [ ] اختبار جميع الوظائف

### English:

- [ ] Import `ColumnVisibilitySelector` component
- [ ] Create `selectedHeaders` ref
- [ ] Define `defaultVisibleColumns` array
- [ ] Create `allHeaders` computed with all columns
- [ ] Create `tableHeaders` computed with filter logic
- [ ] Add component in template before table
- [ ] Bind `v-model` to `selectedHeaders`
- [ ] Pass all required props
- [ ] Add `@change` handler (optional)
- [ ] Add translations in i18n files
- [ ] Test all functionality

---

## 📚 موارد إضافية | Additional Resources

### روابط مفيدة | Useful Links

- [Vuetify 3 Documentation](https://vuetifyjs.com/)
- [Nuxt 4 Documentation](https://nuxt.com/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vuetify v-select Component](https://vuetifyjs.com/en/components/selects/)
- [Vuetify v-data-table Component](https://vuetifyjs.com/en/components/data-tables/)

---

## 🎯 أمثلة الصفحات المطبقة | Implemented Pages

المكون مطبق بالفعل في الصفحات التالية:
The component is already implemented in the following pages:

1. **Banks Page** - `app/pages/banks.vue`
2. **Currency Page** - `app/pages/currency.vue`
3. **Companies Page** - `app/pages/companies.vue`

يمكنك الاطلاع على هذه الصفحات كأمثلة عملية للتطبيق.
You can refer to these pages as practical implementation examples.

---

## 📝 ملاحظات مهمة | Important Notes

### العربية:

1. **الأداء**: المكون محسّن للأداء باستخدام `computed` properties
2. **TypeScript**: المكون يدعم TypeScript بالكامل
3. **RTL**: دعم كامل للغة العربية واتجاه RTL
4. **الحفظ**: يمكن حفظ التفضيلات في localStorage أو backend
5. **التوافقية**: متوافق مع Nuxt 4 و Vuetify 3

### English:

1. **Performance**: Component optimized using `computed` properties
2. **TypeScript**: Full TypeScript support
3. **RTL**: Full Arabic and RTL support
4. **Persistence**: Preferences can be saved to localStorage or backend
5. **Compatibility**: Compatible with Nuxt 4 and Vuetify 3

---

## 💡 نصائح وأفضل الممارسات | Tips & Best Practices

### العربية:

1. **استخدم أسماء مفاتيح واضحة** - اجعل `key` في كل عمود واضحاً ومعبراً
2. **حدد الأعمدة الافتراضية بعناية** - اختر الأعمدة الأكثر أهمية
3. **احفظ التفضيلات** - احفظ اختيارات المستخدم لتحسين تجربة الاستخدام
4. **استخدم الترجمات** - استخدم i18n لجميع النصوص
5. **اختبر على RTL** - تأكد من أن كل شيء يعمل بشكل صحيح في الاتجاه من اليمين لليسار

### English:

1. **Use clear key names** - Make column `key` clear and descriptive
2. **Choose default columns carefully** - Select the most important columns
3. **Save preferences** - Save user choices for better UX
4. **Use translations** - Use i18n for all text
5. **Test on RTL** - Ensure everything works in right-to-left direction

---

## 🤝 المساهمة | Contributing

إذا وجدت مشكلة أو لديك اقتراح لتحسين المكون، يرجى:
If you find an issue or have a suggestion, please:

1. فتح Issue جديد | Open a new Issue
2. إنشاء Pull Request | Create a Pull Request
3. مشاركة الملاحظات | Share Feedback

---

## 📄 الترخيص | License

هذا المكون جزء من المشروع ويتبع نفس الترخيص.
This component is part of the project and follows the same license.

---

## ✨ شكراً لاستخدامك هذا المكون! | Thank you for using this component!

تم إنشاؤه بـ ❤️ لـ Nuxt 4 + Vuetify 3
Created with ❤️ for Nuxt 4 + Vuetify 3
