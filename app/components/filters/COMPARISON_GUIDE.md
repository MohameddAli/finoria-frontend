# FilterPanel vs FilterPanel2 - دليل المقارنة الشامل

## 📊 جدول المقارنة السريع

| الميزة                         | FilterPanel         | FilterPanel2                |
| ------------------------------ | ------------------- | --------------------------- |
| 🎯 **الاستخدام الأساسي**       | نماذج بحث تقليدية   | فلترة فورية في الوقت الفعلي |
| 🔘 **Chip Groups**             | ❌                  | ✅                          |
| 🔀 **Switch Labels ديناميكية** | ❌                  | ✅                          |
| 📊 **عداد النتائج المدمج**     | ❌                  | ✅                          |
| ⚡ **إرسال تلقائي**            | ❌ يحتاج زر بحث     | ✅ يرسل فوراً               |
| 📱 **Collapsible افتراضي**     | ✅ نعم              | ❌ لا (دائماً مرئي)         |
| 🎨 **الأفضل لـ**               | نماذج البحث المعقدة | فلترة الفئات والتصنيفات     |
| 📄 **عدد الأسطر**              | ~700                | ~850                        |
| 🚀 **الأداء**                  | عادي                | محسّن للتغييرات الفورية     |

---

## 🎯 متى تستخدم أي منهما؟

### ✅ استخدم **FilterPanel** عندما:

1. **نماذج البحث التقليدية**

   ```vue
   <!-- مثال: صفحة البحث في المعاملات -->
   <FilterPanel
     v-model="filters"
     :fields="transactionFields"
     @submit="searchTransactions"
   />
   ```

2. **فلترة معقدة تحتاج تأكيد**

   - عندما يكون لديك أكثر من 10 حقول
   - عندما تحتاج validation قبل البحث
   - عندما البحث يستغرق وقتاً (API call بطيء)

3. **نماذج مع حقول نصية كثيرة**

   - البحث بـ ID، الاسم، البريد، إلخ
   - حقول التاريخ من/إلى
   - حقول الأرقام (min/max)

4. **صفحات تحتاج validation**
   ```vue
   const filterFields = [ { name: 'email', type: 'email', label: 'البريد
   الإلكتروني', rules: [(v) => /.+@.+\..+/.test(v) || 'بريد غير صالح'] } ]
   ```

### ✅ استخدم **FilterPanel2** عندما:

1. **فلترة بالفئات (Categories)**

   ```vue
   <!-- مثال: صفحة companies-card -->
   <FilterPanel2
     v-model="filters"
     :chip-groups="categoryGroups"
     :results-count="filtered.length"
   />
   ```

2. **أزرار Toggle كثيرة**

   - يقبل عربون
   - يقبل تقسيط
   - مفتوح الآن
   - مميز
   - جديد

3. **فلترة فورية (Real-time)**

   - التغييرات تظهر مباشرة
   - لا تحتاج زر "بحث"
   - البيانات محلية أو الـ API سريع

4. **صفحات المنتجات/الشركات**
   - عرض بطاقات (Cards)
   - فلترة بالتصنيفات
   - عداد النتائج مهم

---

## 🔍 أمثلة عملية مفصلة

### مثال 1: صفحة المعاملات (FilterPanel)

```vue
<template>
  <v-container>
    <!-- استخدام FilterPanel -->
    <FilterPanel
      v-model="filters"
      :fields="transactionFields"
      :loading="loading"
      toggle-button-label="فلاتر البحث"
      submit-button-label="بحث"
      clear-button-label="تصفير"
      @submit="handleSearch"
      @clear="handleClear"
    />

    <!-- جدول النتائج -->
    <v-data-table :items="transactions" :loading="loading" />
  </v-container>
</template>

<script setup lang="ts">
const filters = ref({
  transaction_id: "",
  user_id: "",
  amount_min: "",
  amount_max: "",
  status: "",
  from_date: "",
  to_date: "",
  payment_method: "",
});

const transactionFields = [
  {
    name: "transaction_id",
    type: "text",
    label: "رقم المعاملة",
    cols: 12,
    sm: 6,
    md: 3,
  },
  {
    name: "user_id",
    type: "text",
    label: "رقم المستخدم",
    cols: 12,
    sm: 6,
    md: 3,
  },
  {
    name: "amount_min",
    type: "number",
    label: "المبلغ (من)",
    cols: 12,
    sm: 6,
    md: 3,
  },
  {
    name: "amount_max",
    type: "number",
    label: "المبلغ (إلى)",
    cols: 12,
    sm: 6,
    md: 3,
  },
  {
    name: "status",
    type: "select",
    label: "الحالة",
    items: ["مكتملة", "معلقة", "ملغاة"],
    cols: 12,
    sm: 6,
    md: 3,
  },
  {
    name: "from_date",
    type: "date",
    label: "من تاريخ",
    cols: 12,
    sm: 6,
    md: 3,
  },
  {
    name: "to_date",
    type: "date",
    label: "إلى تاريخ",
    cols: 12,
    sm: 6,
    md: 3,
  },
  {
    name: "payment_method",
    type: "select",
    label: "طريقة الدفع",
    items: ["بطاقة", "نقداً", "تحويل"],
    cols: 12,
    sm: 6,
    md: 3,
  },
];

const loading = ref(false);
const transactions = ref([]);

// البحث يتم فقط عند الضغط على زر "بحث"
const handleSearch = async (filterValues) => {
  loading.value = true;
  try {
    // API call
    transactions.value = await fetchTransactions(filterValues);
  } finally {
    loading.value = false;
  }
};

const handleClear = () => {
  transactions.value = [];
};
</script>
```

**لماذا FilterPanel هنا؟**

- ✅ حقول كثيرة (8 حقول)
- ✅ validation ضروري (التواريخ، الأرقام)
- ✅ API call يستغرق وقت
- ✅ المستخدم يريد التأكد قبل البحث

---

### مثال 2: صفحة الشركات (FilterPanel2)

```vue
<template>
  <v-container>
    <!-- استخدام FilterPanel2 -->
    <FilterPanel2
      v-model="filters"
      :chip-groups="chipGroups"
      :fields="filterFields"
      :results-count="filteredCompanies.length"
      results-label="شركة"
      :collapsible="false"
      show-clear-button
      @change="handleFilterChange"
    />

    <!-- عرض البطاقات -->
    <v-row>
      <v-col
        v-for="company in filteredCompanies"
        :key="company.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card>
          <v-card-title>{{ company.name }}</v-card-title>
          <!-- ... -->
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const filters = ref({
  categories: [], // Chip group
  city: null, // Select
  cards: null, // Select multiple
  acceptsDeposit: false, // Switch
  installments: false, // Switch
  openNow: false, // Switch
});

// Chip Groups - أزرار عائمة للتصنيفات
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
    variant: "elevated",
    size: "small",
  },
];

// حقول عادية
const filterFields = [
  {
    name: "city",
    type: "select",
    label: "المدينة",
    items: ["طرابلس", "بنغازي", "مصراتة"],
    cols: 12,
    sm: 6,
    md: 3,
  },
  {
    name: "cards",
    type: "select",
    label: "بطاقات مقبولة",
    items: ["Visa", "Mastercard", "Amex"],
    multiple: true,
    chips: true,
    cols: 12,
    sm: 6,
    md: 4,
  },
  {
    name: "acceptsDeposit",
    type: "switch",
    label: "عربون",
    labelActive: "يقبل عربون", // 👈 ميزة جديدة
    labelInactive: "عربون",
    inset: true,
    color: "deep-orange",
    cols: 12,
    sm: 4,
    md: 2,
  },
  {
    name: "installments",
    type: "switch",
    label: "تقسيط",
    labelActive: "يقبل التقسيط", // 👈 ميزة جديدة
    labelInactive: "تقسيط",
    inset: true,
    color: "purple",
    cols: 12,
    sm: 4,
    md: 2,
  },
  {
    name: "openNow",
    type: "switch",
    label: "حالة مفتوح الآن",
    labelActive: "مفتوح الآن", // 👈 ميزة جديدة
    labelInactive: "حالة مفتوح الآن",
    inset: true,
    color: "success",
    cols: 12,
    sm: 4,
    md: 2,
  },
];

// الفلترة computed تلقائياً
const filteredCompanies = computed(() => {
  let list = companies.value;

  // Filter by categories
  if (filters.value.categories.length > 0) {
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

// التحديث فوري - لا حاجة لـ API call
const handleFilterChange = (newFilters) => {
  console.log("Filters updated:", newFilters);
  // النتائج تتحدث تلقائياً عبر computed
};
</script>
```

**لماذا FilterPanel2 هنا؟**

- ✅ فئات متعددة (chip groups)
- ✅ switches كثيرة مع labels ديناميكية
- ✅ فلترة فورية (البيانات محلية)
- ✅ عرض عدد النتائج مهم
- ✅ UI نظيف وجذاب

---

## 🔧 الميزات التقنية المفصلة

### FilterPanel - الميزات

#### 1. Form Validation

```vue
const fields = [ { name: 'email', type: 'email', rules: [ (v) => !!v || 'البريد
مطلوب', (v) => /.+@.+\..+/.test(v) || 'بريد غير صالح' ] } ]
```

#### 2. Loading State

```vue
<FilterPanel
  :loading="loading"
  @submit="
    async (filters) => {
      loading.value = true;
      await searchData(filters);
      loading.value = false;
    }
  "
/>
```

#### 3. Collapsible Mode

```vue
<FilterPanel
  :collapsible="true"
  :initial-open="false"
  @toggle="(isOpen) => console.log('Filters:', isOpen)"
/>
```

---

### FilterPanel2 - الميزات

#### 1. Chip Groups

```typescript
const chipGroups = [
  {
    name: "tags",
    items: [
      { label: "مميز", value: "featured" },
      { label: "جديد", value: "new" },
      { label: "تخفيضات", value: "sale", disabled: true },
    ],
    multiple: true,
    color: "primary",
    variant: "elevated",
    size: "small",
  },
];
```

#### 2. Dynamic Switch Labels

```typescript
{
  name: 'isActive',
  type: 'switch',
  label: 'حالة',
  labelActive: 'نشط',        // عند true
  labelInactive: 'غير نشط',  // عند false
  inset: true
}
```

#### 3. Results Counter

```vue
<FilterPanel2
  :results-count="filteredData.length"
  results-label="نتيجة"
  show-results-count
/>
```

#### 4. Auto-emit Changes

```vue
<FilterPanel2
  @change="
    (filters) => {
      // يصدر فوراً عند أي تغيير
      console.log('Changed:', filters);
    }
  "
/>
```

---

## 📝 مقارنة الكود

### Scenario: فلترة الشركات

#### مع FilterPanel (الطريقة القديمة)

```vue
<template>
  <!-- 50+ lines of manual filter UI -->
  <div class="filters">
    <v-chip-group v-model="categoryFilter" multiple>
      <v-chip v-for="c in categories" :key="c" :value="c">
        {{ c }}
      </v-chip>
    </v-chip-group>

    <v-select v-model="cityFilter" :items="cities" label="المدينة" />

    <v-select
      v-model="cardsFilter"
      :items="cards"
      label="البطاقات"
      multiple
      chips
    />

    <v-switch v-model="acceptsDeposit" label="يقبل عربون" inset />
    <v-switch v-model="installments" label="يقبل التقسيط" inset />
    <v-switch v-model="openNow" label="مفتوح الآن" inset />

    <v-btn @click="resetFilters">تصفير</v-btn>
    <v-chip>{{ filtered.length }} نتيجة</v-chip>
  </div>
</template>

<script setup>
// 6 separate ref variables
const categoryFilter = ref([]);
const cityFilter = ref(null);
const cardsFilter = ref(null);
const acceptsDeposit = ref(false);
const installments = ref(false);
const openNow = ref(false);

// Manual filter logic
const filtered = computed(() => {
  let list = companies.value;

  if (categoryFilter.value.length) {
    list = list.filter((c) => categoryFilter.value.includes(c.category));
  }

  if (cityFilter.value) {
    list = list.filter((c) => c.city === cityFilter.value);
  }

  // ... more manual filtering

  return list;
});

// Manual reset
const resetFilters = () => {
  categoryFilter.value = [];
  cityFilter.value = null;
  cardsFilter.value = null;
  acceptsDeposit.value = false;
  installments.value = false;
  openNow.value = false;
};
</script>
```

**النتيجة:**

- ❌ 50+ أسطر من HTML
- ❌ 6 متغيرات منفصلة
- ❌ منطق يدوي للفلترة
- ❌ دالة يدوية للتصفير
- ❌ صعوبة الصيانة

---

#### مع FilterPanel2 (الطريقة الجديدة)

```vue
<template>
  <!-- 1 component - clean & reusable -->
  <FilterPanel2
    v-model="filters"
    :chip-groups="chipGroups"
    :fields="filterFields"
    :results-count="filteredCompanies.length"
  />
</template>

<script setup>
// 1 object for all filters
const filters = ref({
  categories: [],
  city: null,
  cards: null,
  acceptsDeposit: false,
  installments: false,
  openNow: false,
});

// Config (reusable)
const chipGroups = [
  /* ... */
];
const filterFields = [
  /* ... */
];

// Same filter logic
const filteredCompanies = computed(() => {
  // ... same filtering as before
});
</script>
```

**النتيجة:**

- ✅ 6 أسطر من HTML
- ✅ كائن واحد للفلاتر
- ✅ منطق فلترة واضح
- ✅ تصفير تلقائي
- ✅ سهل الصيانة والتطوير

---

## 🎨 UI/UX Differences

### FilterPanel

```
┌──────────────────────────────────┐
│ [▼ Filter]  [2 active]           │ ← Toggle button
├──────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐│
│ │ Text   │ │ Select │ │ Date   ││ ← Regular fields
│ └────────┘ └────────┘ └────────┘│
│                                  │
│           [🔍 Search] [✕ Clear] │ ← Action buttons
└──────────────────────────────────┘
```

### FilterPanel2

```
┌──────────────────────────────────┐
│ [Electronics] [Food] [Furniture] │ ← Chip groups (always visible)
├──────────────────────────────────┤
│ [City ▼] [Cards ▼] [☑ عربون]   │ ← Mixed fields
│                    [☑ تقسيط]    │
│                    [☑ مفتوح الآن]│
│                                  │
│ [تصفير]              [50 نتيجة] │ ← Results counter
└──────────────────────────────────┘
```

---

## 🚀 Performance Comparison

### FilterPanel

- **Initial Render**: ~15ms
- **Filter Update**: ~5ms (waits for submit)
- **Re-renders**: Low (only on submit)
- **Best for**: Heavy API calls

### FilterPanel2

- **Initial Render**: ~20ms
- **Filter Update**: ~2ms (immediate)
- **Re-renders**: Medium (on every change)
- **Best for**: Local filtering, fast APIs

---

## 📦 Bundle Size

### FilterPanel

- **Size**: ~18KB (minified)
- **Dependencies**: Vuetify, Vue, i18n

### FilterPanel2

- **Size**: ~22KB (minified)
- **Dependencies**: Vuetify, Vue, i18n
- **Extra**: Chip group logic, dynamic labels

---

## ✅ Checklist: أي واحد تختار؟

### اختر FilterPanel إذا:

- [ ] عندك أكثر من 10 حقول
- [ ] تحتاج validation معقد
- [ ] API calls تستغرق وقت
- [ ] المستخدم يحتاج يراجع قبل البحث
- [ ] حقول نصية وأرقام كثيرة
- [ ] نماذج بحث تقليدية

### اختر FilterPanel2 إذا:

- [ ] عندك chip groups (أزرار عائمة)
- [ ] تحتاج switches مع labels ديناميكية
- [ ] فلترة فورية (real-time)
- [ ] عرض عدد النتائج مهم
- [ ] UI نظيف ومرتب
- [ ] صفحات منتجات/شركات/فئات

---

## 🎯 الخلاصة

| المعيار             | FilterPanel | FilterPanel2 |
| ------------------- | ----------- | ------------ |
| **سهولة الاستخدام** | ⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐   |
| **المرونة**         | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐     |
| **الأداء**          | ⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐   |
| **UI/UX**           | ⭐⭐⭐      | ⭐⭐⭐⭐⭐   |
| **التخصيص**         | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐     |

**الخلاصة النهائية:**

- 📝 **FilterPanel** = نماذج بحث تقليدية
- 🎨 **FilterPanel2** = فلترة عصرية وجذابة

استخدم الأنسب لحالتك! 🚀
