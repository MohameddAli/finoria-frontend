# ColumnVisibilitySelector Component

مكون احترافي للتحكم في رؤية أعمدة الجداول في Nuxt 4 + Vuetify 3

## المميزات الجديدة ✨

### خاصية `collapsible`

تتيح لك التحكم في طريقة عرض محدد الأعمدة:

#### الوضع القابل للطي (`collapsible: true`) - الافتراضي

```vue
<ColumnVisibilitySelector
  v-model="visibleColumns"
  :columns="allColumns"
  :collapsible="true"
  label="Show Columns"
/>
```

- يظهر زر "Show Columns" في الأعلى
- عند الضغط عليه تظهر/تختفي قائمة الأعمدة
- يظهر chip يعرض عدد الأعمدة المرئية
- مثالي للجداول الكبيرة

#### الوضع المباشر (`collapsible: false`)

```vue
<ColumnVisibilitySelector
  v-model="visibleColumns"
  :columns="allColumns"
  :collapsible="false"
/>
```

- لا يوجد زر toggle
- قائمة الأعمدة مرئية دائماً
- مثالي عندما تريد عرض الأعمدة دائماً (sidebar مثلاً)

## الاستخدام الكامل

### 1. تعريف الأعمدة

```javascript
const allColumns = ref([
  { title: "ID", key: "id" },
  { title: "Name", key: "name" },
  { title: "Email", key: "email" },
  { title: "Status", key: "status" },
  { title: "Created At", key: "created_at" },
]);

const visibleColumns = ref([]);
```

### 2. استخدام المكون

```vue
<template>
  <div>
    <!-- مع زر toggle (الافتراضي) -->
    <ColumnVisibilitySelector
      v-model="visibleColumns"
      :columns="allColumns"
      :collapsible="true"
      label="Show Columns"
      @change="handleColumnChange"
    />

    <!-- أو بدون زر (مباشر) -->
    <ColumnVisibilitySelector
      v-model="visibleColumns"
      :columns="allColumns"
      :collapsible="false"
      :show-search="true"
      @change="handleColumnChange"
    />

    <!-- استخدام الأعمدة المرئية في الجدول -->
    <ReusableTable :headers="visibleColumns" :items="tableData" />
  </div>
</template>

<script setup>
const visibleColumns = ref([]);
const allColumns = ref([
  { title: "ID", key: "id", sortable: true },
  { title: "Name", key: "name", sortable: true },
  { title: "Email", key: "email", sortable: false },
  { title: "Status", key: "status", sortable: true },
]);

const handleColumnChange = (selectedColumns) => {
  console.log("Selected columns:", selectedColumns);
};
</script>
```

## الخصائص (Props)

### الخصائص الأساسية

| الخاصية                 | النوع   | الافتراضي | الوصف                                        |
| ----------------------- | ------- | --------- | -------------------------------------------- |
| `columns`               | Array   | **مطلوب** | جميع الأعمدة المتاحة                         |
| `modelValue`            | Array   | `[]`      | الأعمدة المرئية حالياً (v-model)             |
| `defaultVisibleColumns` | Array   | `[]`      | الأعمدة المرئية افتراضياً                    |
| `collapsible`           | Boolean | `true`    | **جديد!** تفعيل/تعطيل وضع الطي               |
| `initialOpen`           | Boolean | `false`   | فتح القائمة افتراضياً (عند collapsible=true) |

### خصائص زر Toggle

| الخاصية         | النوع  | الافتراضي            | الوصف       |
| --------------- | ------ | -------------------- | ----------- |
| `label`         | String | `'Show Columns'`     | نص الزر     |
| `toggleIcon`    | String | `'mdi-table-column'` | أيقونة الزر |
| `buttonVariant` | String | `'outlined'`         | نوع الزر    |
| `buttonColor`   | String | `'primary'`          | لون الزر    |
| `buttonSize`    | String | `'default'`          | حجم الزر    |

### خصائص الـ Badge

| الخاصية      | النوع   | الافتراضي   | الوصف                     |
| ------------ | ------- | ----------- | ------------------------- |
| `showBadge`  | Boolean | `true`      | إظهار عدد الأعمدة المرئية |
| `badgeColor` | String  | `'primary'` | لون الـ badge             |

### خصائص البحث

| الخاصية             | النوع   | الافتراضي             | الوصف                 |
| ------------------- | ------- | --------------------- | --------------------- |
| `showSearch`        | Boolean | `true`                | إظهار حقل البحث       |
| `searchPlaceholder` | String  | `'Search columns...'` | نص placeholder        |
| `noResultsText`     | String  | `'No columns found'`  | نص عند عدم وجود نتائج |

### خصائص الأزرار

| الخاصية         | النوع   | الافتراضي      | الوصف                 |
| --------------- | ------- | -------------- | --------------------- |
| `showSelectAll` | Boolean | `true`         | إظهار زر "تحديد الكل" |
| `showClearAll`  | Boolean | `true`         | إظهار زر "إلغاء الكل" |
| `selectAllText` | String  | `'Select All'` | نص زر التحديد         |
| `clearAllText`  | String  | `'Clear All'`  | نص زر الإلغاء         |
| `checkboxColor` | String  | `'primary'`    | لون الـ checkboxes    |

## الأحداث (Events)

- `@update:modelValue` - عند تغيير الأعمدة المرئية
- `@change` - عند تغيير الأعمدة (مع البيانات الكاملة)
- `@toggle` - عند فتح/إغلاق القائمة (collapsible فقط)

## Methods المتاحة (Exposed)

يمكنك استخدام `ref` للوصول إلى هذه الدوال:

```vue
<template>
  <ColumnVisibilitySelector
    ref="columnSelector"
    v-model="visibleColumns"
    :columns="allColumns"
  />
</template>

<script setup>
const columnSelector = ref(null);

// استخدام الدوال
columnSelector.value.selectAllColumns();
columnSelector.value.clearAllColumns();
columnSelector.value.toggleMenu();
columnSelector.value.openMenu();
columnSelector.value.closeMenu();
</script>
```

## أمثلة عملية

### مثال 1: وضع Sidebar (بدون toggle)

```vue
<template>
  <v-navigation-drawer permanent>
    <v-list-item title="Column Settings" />

    <ColumnVisibilitySelector
      v-model="visibleColumns"
      :columns="allColumns"
      :collapsible="false"
      :show-search="true"
      :menu-elevation="0"
    />
  </v-navigation-drawer>
</template>
```

### مثال 2: وضع Toolbar (مع toggle)

```vue
<template>
  <v-toolbar>
    <v-toolbar-title>Users Table</v-toolbar-title>
    <v-spacer />

    <ColumnVisibilitySelector
      v-model="visibleColumns"
      :columns="allColumns"
      :collapsible="true"
      label="Columns"
      button-variant="flat"
    />
  </v-toolbar>

  <ReusableTable :headers="visibleColumns" :items="users" />
</template>
```

### مثال 3: مع الترجمة (i18n)

```vue
<template>
  <ColumnVisibilitySelector
    v-model="visibleColumns"
    :columns="translatedColumns"
    :collapsible="true"
    :label="$t('table.showColumns')"
    :select-all-text="$t('table.selectAll')"
    :clear-all-text="$t('table.clearAll')"
    :search-placeholder="$t('table.searchColumns')"
    :no-results-text="$t('table.noColumns')"
  />
</template>

<script setup>
const { t } = useI18n();

const translatedColumns = computed(() => [
  { title: t("table.columns.id"), key: "id" },
  { title: t("table.columns.name"), key: "name" },
  { title: t("table.columns.email"), key: "email" },
]);
</script>
```

## الفرق بين الوضعين

### Collapsible (true) - مثالي لـ:

- ✅ الجداول الكبيرة مع أعمدة كثيرة
- ✅ توفير مساحة في الصفحة
- ✅ عندما تكون إعدادات الأعمدة اختيارية
- ✅ في Toolbars و Headers

### Non-Collapsible (false) - مثالي لـ:

- ✅ Sidebars الدائمة
- ✅ صفحات الإعدادات
- ✅ عندما تريد عرض الأعمدة دائماً
- ✅ Panels المخصصة

## دعم RTL

المكون يدعم RTL تلقائياً:

- ✅ محاذاة الأيقونات والنصوص
- ✅ ترتيب الأزرار من اليمين لليسار
- ✅ Animation من اليمين في RTL

## الأداء

المكون محسّن للأداء:

- ✅ Computed properties للتصفية
- ✅ Debounced search
- ✅ Lazy rendering مع v-show
- ✅ تحديثات DOM قليلة

## الملاحظات

1. **التوافق**: يعمل مع ReusableTable و v-data-table
2. **التخزين**: يمكن حفظ الأعمدة في localStorage
3. **الثيمات**: يدعم Dark/Light mode تلقائياً
4. **إمكانية الوصول**: يتضمن ARIA labels

## مثال كامل متقدم

```vue
<template>
  <div>
    <!-- في Toolbar -->
    <v-toolbar>
      <v-toolbar-title>{{ $t("users.title") }}</v-toolbar-title>
      <v-spacer />

      <FilterPanel
        v-model="filters"
        :fields="filterFields"
        :collapsible="true"
      />

      <ColumnVisibilitySelector
        ref="columnSelector"
        v-model="visibleColumns"
        :columns="allColumns"
        :collapsible="true"
        :label="$t('table.columns')"
        @change="saveColumnPreferences"
      />
    </v-toolbar>

    <!-- الجدول -->
    <ReusableTable
      :headers="visibleColumns"
      :items="filteredUsers"
      :loading="loading"
    />
  </div>
</template>

<script setup>
const { t } = useI18n();

// الأعمدة المتاحة
const allColumns = ref([
  { title: t("user.id"), key: "id", sortable: true },
  { title: t("user.name"), key: "name", sortable: true },
  { title: t("user.email"), key: "email", sortable: true },
  { title: t("user.role"), key: "role", sortable: true },
  { title: t("user.status"), key: "status", sortable: true },
  { title: t("user.created"), key: "created_at", sortable: true },
]);

// تحميل الأعمدة المحفوظة
const visibleColumns = ref(
  JSON.parse(localStorage.getItem("visibleColumns")) || []
);

// حفظ التفضيلات
const saveColumnPreferences = (columns) => {
  localStorage.setItem("visibleColumns", JSON.stringify(columns));
};

// الباقي من الكود...
</script>
```

---

تم تطويره لـ Nuxt 4 + Vuetify 3 مع أفضل الممارسات 🚀
