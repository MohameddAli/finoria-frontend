# FilterPanel2 Component

مكون فلترة متقدم قابل لإعادة الاستخدام مصمم خصيصاً لنمط الفلترة المستخدم في صفحة companies-card.

## المميزات الرئيسية

- ✅ **مجموعات الأزرار العائمة (Chip Groups)** - فلترة بالأزرار العائمة بجانب بعضها
- ✅ **حقول Switch** - أزرار التبديل مثل العربون، التقسيط، مفتوح الآن
- ✅ **حقول Select** - قوائم منسدلة مثل المدينة والبطاقات المقبولة
- ✅ **حقول Text** - حقول البحث والإدخال النصي
- ✅ **قابل للطي (Collapsible)** - يمكن إخفاء/إظهار الفلاتر
- ✅ **عداد النتائج** - عرض عدد النتائج المفلترة
- ✅ **دعم RTL كامل** - يعمل بشكل مثالي مع اللغة العربية
- ✅ **تحديث تلقائي** - يصدر التغييرات فوراً عند تعديل أي فلتر

---

## التركيب الأساسي

### Props الرئيسية

| Prop               | Type    | Default | Description                                     |
| ------------------ | ------- | ------- | ----------------------------------------------- |
| `chipGroups`       | Array   | `[]`    | مصفوفة من مجموعات الأزرار العائمة               |
| `fields`           | Array   | `[]`    | مصفوفة من الحقول العادية (select, switch, text) |
| `modelValue`       | Object  | `{}`    | قيم الفلاتر الحالية (v-model)                   |
| `collapsible`      | Boolean | `false` | هل الفلاتر قابلة للطي؟                          |
| `showResultsCount` | Boolean | `true`  | عرض عدد النتائج                                 |
| `resultsCount`     | Number  | `null`  | عدد النتائج المفلترة                            |

---

## مثال من صفحة companies-card

### استخدام المكون

```vue
<template>
  <div>
    <!-- FilterPanel2 Component -->
    <FilterPanel2
      v-model="filters"
      :chip-groups="chipGroups"
      :fields="filterFields"
      :results-count="filteredCompanies.length"
      results-label="نتيجة"
      collapsible
      :initial-open="true"
      show-clear-button
      clear-button-label="تصفير"
      @clear="handleClearFilters"
      @change="handleFilterChange"
    />

    <!-- Your content here -->
    <div v-for="company in filteredCompanies" :key="company.id">
      {{ company.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// Filter state
const filters = ref({
  categories: [], // للأزرار العائمة
  city: null, // للمدينة
  cards: null, // للبطاقات المقبولة
  acceptsDeposit: false, // للعربون
  installments: false, // للتقسيط
  openNow: false, // لمفتوح الآن
});

// Chip Groups Configuration (الأزرار العائمة)
const chipGroups = [
  {
    name: "categories",
    items: [
      "إلكترونيات",
      "سوبرماركت",
      "مجوهرات",
      "أثاث",
      "صيدلية",
      "ملابس",
      "اتصالات",
    ],
    multiple: true,
    selectedClass: "text-white",
    variant: "elevated",
    size: "small",
    class: "mr-1",
  },
];

// Regular Fields Configuration
const filterFields = computed(() => [
  // City Select
  {
    name: "city",
    type: "select",
    label: "المدينة",
    items: cityOptions.value,
    clearable: true,
    cols: 12,
    sm: 6,
    md: 3,
    lg: 2,
    style: "min-width: 160px",
  },

  // Cards Select (Multiple)
  {
    name: "cards",
    type: "select",
    label: "بطاقات مقبولة",
    items: ["Visa", "Mastercard", "Amex"],
    multiple: true,
    chips: true,
    clearable: true,
    cols: 12,
    sm: 6,
    md: 4,
    lg: 3,
    style: "min-width: 220px",
  },

  // Accepts Deposit Switch
  {
    name: "acceptsDeposit",
    type: "switch",
    label: "عربون",
    labelActive: "يقبل عربون",
    labelInactive: "عربون",
    inset: true,
    color: "deep-orange",
    cols: 12,
    sm: 6,
    md: 2,
    lg: 2,
  },

  // Installments Switch
  {
    name: "installments",
    type: "switch",
    label: "تقسيط",
    labelActive: "يقبل التقسيط",
    labelInactive: "تقسيط",
    inset: true,
    color: "purple",
    cols: 12,
    sm: 6,
    md: 2,
    lg: 2,
  },

  // Open Now Switch
  {
    name: "openNow",
    type: "switch",
    label: "حالة مفتوح الآن",
    labelActive: "مفتوح الآن",
    labelInactive: "حالة مفتوح الآن",
    inset: true,
    color: "success",
    cols: 12,
    sm: 6,
    md: 2,
    lg: 2,
  },
]);

// Filtered companies (your filtering logic)
const filteredCompanies = computed(() => {
  let list = companies.value.slice();

  // Filter by categories
  if (filters.value.categories && filters.value.categories.length > 0) {
    list = list.filter((c) => filters.value.categories.includes(c.category));
  }

  // Filter by city
  if (filters.value.city) {
    list = list.filter((c) => c.city === filters.value.city);
  }

  // Filter by cards
  if (filters.value.cards && filters.value.cards.length > 0) {
    list = list.filter((c) =>
      filters.value.cards.every((card) => c.cards.includes(card))
    );
  }

  // Filter by deposit
  if (filters.value.acceptsDeposit) {
    list = list.filter((c) => c.accepts.deposit);
  }

  // Filter by installments
  if (filters.value.installments) {
    list = list.filter((c) => c.accepts.installments);
  }

  // Filter by open now
  if (filters.value.openNow) {
    list = list.filter((c) => c.openNow);
  }

  return list;
});

// Handle filter change (auto-update)
const handleFilterChange = (newFilters) => {
  console.log("Filters changed:", newFilters);
  // Your logic here
};

// Handle clear filters
const handleClearFilters = () => {
  console.log("Filters cleared");
  // Your logic here
};
</script>
```

---

## أمثلة إضافية

### مثال 1: فلترة بسيطة بدون أزرار عائمة

```vue
<FilterPanel2
  v-model="filters"
  :fields="[
    {
      name: 'status',
      type: 'switch',
      label: 'نشط فقط',
      labelActive: 'نشط',
      labelInactive: 'غير نشط',
      inset: true,
    },
    {
      name: 'category',
      type: 'select',
      label: 'التصنيف',
      items: ['تصنيف 1', 'تصنيف 2', 'تصنيف 3'],
    },
  ]"
  :results-count="results.length"
/>
```

### مثال 2: أزرار عائمة فقط

```vue
<FilterPanel2
  v-model="filters"
  :chip-groups="[
    {
      name: 'tags',
      items: ['علامة 1', 'علامة 2', 'علامة 3'],
      multiple: true,
      color: 'primary',
    },
  ]"
  :results-count="results.length"
/>
```

### مثال 3: مع زر التطبيق

```vue
<FilterPanel2
  v-model="filters"
  :fields="fields"
  show-submit-button
  submit-button-label="تطبيق الفلاتر"
  @submit="applyFilters"
/>
```

---

## ChipGroup Configuration

### تكوين مجموعة الأزرار العائمة

```typescript
{
  name: string              // اسم الحقل (مطلوب)
  items: Array<string | {   // عناصر الأزرار (مطلوب)
    label: string,
    value: any,
    disabled?: boolean
  }>
  multiple?: boolean        // اختيار متعدد (افتراضي: true)
  selectedClass?: string    // CSS class للمحدد (افتراضي: 'text-white')
  variant?: string          // نوع الزر (افتراضي: 'elevated')
  size?: string            // حجم الزر (افتراضي: 'small')
  color?: string           // لون الزر
  class?: string           // CSS class إضافي
}
```

---

## Field Configuration (للسويتش)

### تكوين حقل Switch

```typescript
{
  name: string              // اسم الحقل (مطلوب)
  type: 'switch'           // نوع الحقل (مطلوب)
  label: string            // التسمية الافتراضية
  labelActive?: string     // التسمية عند التفعيل
  labelInactive?: string   // التسمية عند التعطيل
  inset?: boolean          // نمط inset
  color?: string           // اللون
  disabled?: boolean       // معطل
  cols?: number            // عدد الأعمدة (12 grid system)
  sm?: number              // breakpoint sm
  md?: number              // breakpoint md
  lg?: number              // breakpoint lg
}
```

---

## Events

### الأحداث المصدرة من المكون

| Event               | Payload   | Description                      |
| ------------------- | --------- | -------------------------------- |
| `update:modelValue` | `Object`  | يصدر عند تغيير أي فلتر (v-model) |
| `change`            | `Object`  | يصدر عند تغيير أي فلتر           |
| `submit`            | `Object`  | يصدر عند الضغط على زر التطبيق    |
| `clear`             | -         | يصدر عند مسح جميع الفلاتر        |
| `toggle`            | `Boolean` | يصدر عند فتح/إغلاق الفلاتر       |

---

## Methods المكشوفة

يمكن الوصول إلى هذه الدوال من المكون الأب:

```vue
<template>
  <FilterPanel2 ref="filterRef" ... />
</template>

<script setup>
const filterRef = ref(null);

// Clear filters
filterRef.value?.clearFilters();

// Toggle filters
filterRef.value?.toggleFilters();

// Get current values
console.log(filterRef.value?.filterValues);
</script>
```

---

## التخصيص والتنسيق

### تخصيص الألوان والأنماط

```vue
<FilterPanel2
  v-model="filters"
  :chip-groups="chipGroups"
  :fields="fields"

  <!-- Toggle Button -->
  button-variant="flat"
  button-color="primary"
  filter-icon="mdi-filter-variant"
  toggle-button-label="فلاتر"

  <!-- Active Count Chip -->
  show-active-count
  chip-color="primary"
  active-filters-label="نشط"

  <!-- Results Count Chip -->
  show-results-count
  results-count="50"
  results-label="نتيجة"

  <!-- Clear Button -->
  show-clear-button
  clear-button-color="default"
  clear-button-variant="tonal"
  clear-button-icon="mdi-filter-off"
  clear-button-label="تصفير"

  <!-- Submit Button -->
  show-submit-button
  submit-button-color="primary"
  submit-button-variant="flat"
  submit-button-icon="mdi-check"
  submit-button-label="تطبيق"
/>
```

---

## الفرق بين FilterPanel و FilterPanel2

| Feature                         | FilterPanel       | FilterPanel2        |
| ------------------------------- | ----------------- | ------------------- |
| Chip Groups                     | ❌                | ✅                  |
| Switch Labels (Active/Inactive) | ❌                | ✅                  |
| Results Count Display           | ❌                | ✅                  |
| Auto-submit on change           | ❌                | ✅ (default)        |
| Default collapsible             | ✅                | ❌ (always visible) |
| Best for                        | Forms with submit | Real-time filtering |

---

## نصائح الاستخدام

1. **استخدم FilterPanel2** عندما تريد:

   - فلترة فورية (بدون زر تطبيق)
   - أزرار عائمة للتصنيفات
   - عرض عدد النتائج
   - نمط companies-card

2. **استخدم FilterPanel** عندما تريد:

   - نموذج تقليدي مع زر إرسال
   - فلترة بعد الضغط على زر البحث
   - حقول نصية وتاريخ أكثر

3. **الأداء**:
   - FilterPanel2 يصدر التغييرات فوراً
   - استخدم debounce في معالج `@change` إذا كان الفلترة ثقيلة

---

## License

MIT

---

## المساهمة

Pull requests are welcome! 🚀
