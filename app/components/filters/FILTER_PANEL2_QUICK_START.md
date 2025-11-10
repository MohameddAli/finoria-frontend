# FilterPanel2 - Quick Start Example

## مثال سريع لصفحة companies-card

```vue
<template>
  <v-container fluid class="pa-0">
    <!-- App Bar مع البحث والترتيب -->
    <v-app-bar flat color="transparent" density="comfortable" class="px-4 py-2">
      <v-app-bar-title class="text-h6 font-weight-bold">
        الشركات التي تقبل الدفع بالبطاقة
      </v-app-bar-title>
      <v-spacer />

      <!-- Search -->
      <v-text-field
        v-model="search"
        variant="outlined"
        density="comfortable"
        hide-details
        append-inner-icon="mdi-magnify"
        placeholder="ابحث باسم الشركة، التصنيف أو المدينة"
        class="mr-3"
        style="min-width: 280px"
      />

      <!-- Sort -->
      <v-select
        v-model="sortBy"
        :items="sortOptions"
        item-title="label"
        item-value="value"
        variant="outlined"
        density="comfortable"
        hide-details
        class="mr-3"
        style="min-width: 180px"
        label="ترتيب"
      />
    </v-app-bar>

    <!-- FilterPanel2 Component - استبدال الفلترة القديمة -->
    <div class="px-4 pb-2">
      <FilterPanel2
        v-model="filters"
        :chip-groups="chipGroups"
        :fields="filterFields"
        :results-count="filteredCompanies.length"
        results-label="نتيجة"
        :collapsible="false"
        show-clear-button
        clear-button-label="تصفير"
        clear-button-icon="mdi-filter-off"
        clear-button-variant="tonal"
        @clear="handleClearFilters"
      />
    </div>

    <!-- Cards Grid -->
    <v-container fluid class="px-4 pb-6">
      <v-row dense>
        <v-col
          v-for="comp in pagedCompanies"
          :key="comp.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <!-- Your company card here -->
          <v-card>
            <v-card-title>{{ comp.name }}</v-card-title>
            <!-- ... -->
          </v-card>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <div
        v-if="!filteredCompanies.length"
        class="empty-state text-center py-12"
      >
        <v-icon size="40" class="mb-2">mdi-magnify</v-icon>
        <div class="text-subtitle-1 font-weight-medium mb-1">
          لا توجد نتائج مطابقة
        </div>
        <div class="text-medium-emphasis mb-4">
          جرّب توسيع نطاق البحث أو إزالة بعض الفلاتر.
        </div>
        <v-btn
          variant="tonal"
          prepend-icon="mdi-filter-off"
          @click="handleClearFilters"
        >
          إزالة الفلاتر
        </v-btn>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          total-visible="7"
          rounded="circle"
        />
      </div>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({
  layout: "dashboard",
});

// ==================== Types ====================
interface Company {
  id: string;
  name: string;
  description: string;
  city: string;
  category: string;
  image: string;
  accepts: {
    deposit: boolean;
    installments: boolean;
  };
  cards: string[];
  rating: number;
  openNow?: boolean;
}

// ==================== Data ====================
const companies = ref<Company[]>([
  // Your companies data here
]);

// ==================== Filter State ====================
const search = ref("");
const sortBy = ref("relevance");
const filters = ref({
  categories: [], // مجموعة التصنيفات (chip group)
  city: null, // المدينة
  cards: null, // البطاقات المقبولة
  acceptsDeposit: false, // يقبل عربون
  installments: false, // يقبل تقسيط
  openNow: false, // مفتوح الآن
});

// ==================== Sort Options ====================
const sortOptions = [
  { label: "الأكثر صلة", value: "relevance" },
  { label: "الأعلى تقييماً", value: "rating" },
  { label: "الاسم", value: "name" },
];

// ==================== Pagination ====================
const currentPage = ref(1);
const pageSize = ref(12);

// ==================== Chip Groups Config ====================
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

// ==================== Filter Fields Config ====================
const filterFields = computed(() => {
  // Get unique cities from companies
  const cities = Array.from(new Set(companies.value.map((c) => c.city)));

  return [
    // City Select
    {
      name: "city",
      type: "select",
      label: "المدينة",
      items: cities,
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
      items: ["Visa", "Mastercard", "Amex", "Meeza", "Mada"],
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
  ];
});

// ==================== Computed: Filtered Companies ====================
const filteredCompanies = computed(() => {
  let list = companies.value.slice();

  // 1. Search filter
  const query = search.value.trim().toLowerCase();
  if (query) {
    list = list.filter((c) =>
      [c.name, c.city, c.category, c.description].some((v) =>
        v.toLowerCase().includes(query)
      )
    );
  }

  // 2. Categories filter (chip group)
  if (filters.value.categories && filters.value.categories.length > 0) {
    list = list.filter((c) => filters.value.categories.includes(c.category));
  }

  // 3. City filter
  if (filters.value.city) {
    list = list.filter((c) => c.city === filters.value.city);
  }

  // 4. Cards filter (multiple)
  if (filters.value.cards && filters.value.cards.length > 0) {
    list = list.filter((c) =>
      filters.value.cards.every((card) => c.cards.includes(card))
    );
  }

  // 5. Accepts deposit filter
  if (filters.value.acceptsDeposit) {
    list = list.filter((c) => c.accepts.deposit);
  }

  // 6. Installments filter
  if (filters.value.installments) {
    list = list.filter((c) => c.accepts.installments);
  }

  // 7. Open now filter
  if (filters.value.openNow) {
    list = list.filter((c) => c.openNow);
  }

  // 8. Sort
  if (sortBy.value === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  } else if (sortBy.value === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // Relevance: search matches + rating
    if (query) {
      list.sort((a, b) => {
        const scoreA = matchScore(a, query);
        const scoreB = matchScore(b, query);
        if (scoreA !== scoreB) return scoreB - scoreA;
        return b.rating - a.rating;
      });
    } else {
      list.sort((a, b) => b.rating - a.rating);
    }
  }

  return list;
});

// ==================== Helper: Match Score ====================
function matchScore(company: Company, query: string): number {
  const haystack =
    `${company.name} ${company.city} ${company.category} ${company.description}`.toLowerCase();
  let score = 0;
  query.split(/\s+/).forEach((token) => {
    if (haystack.includes(token)) score += 1;
  });
  return score;
}

// ==================== Computed: Pagination ====================
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredCompanies.value.length / pageSize.value))
);

const pagedCompanies = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredCompanies.value.slice(start, start + pageSize.value);
});

// ==================== Actions ====================
const handleClearFilters = () => {
  // Clear search
  search.value = "";

  // Clear sort
  sortBy.value = "relevance";

  // Reset to first page
  currentPage.value = 1;

  // FilterPanel2 will clear its own filters automatically
};
</script>

<style scoped>
/* Your styles here */
</style>
```

---

## خطوات الاستبدال السريع

### 1. استبدل الفلترة القديمة

**قبل:**

```vue
<!-- Filters Bar (desktop) -->
<div class="px-4 pb-2 d-none d-sm-flex align-center flex-wrap ga-3">
  <v-chip-group v-model="categoryFilter" multiple>
    <v-chip v-for="c in categories" :key="c" :value="c">{{ c }}</v-chip>
  </v-chip-group>
  
  <v-select v-model="cityFilter" ... />
  <v-select v-model="cardsFilter" ... />
  <v-switch v-model="acceptsDeposit" ... />
  <v-switch v-model="installments" ... />
  <v-switch v-model="openNow" ... />
  
  <v-btn @click="resetFilters">تصفير</v-btn>
  <v-chip>{{ filtered.length }} نتيجة</v-chip>
</div>
```

**بعد:**

```vue
<div class="px-4 pb-2">
  <FilterPanel2
    v-model="filters"
    :chip-groups="chipGroups"
    :fields="filterFields"
    :results-count="filteredCompanies.length"
  />
</div>
```

### 2. غير state الفلاتر

**قبل:**

```typescript
const categoryFilter = ref<string[]>([]);
const cityFilter = ref<string | null>(null);
const cardsFilter = ref<string[] | null>(null);
const acceptsDeposit = ref(false);
const installments = ref(false);
const openNow = ref(false);
```

**بعد:**

```typescript
const filters = ref({
  categories: [],
  city: null,
  cards: null,
  acceptsDeposit: false,
  installments: false,
  openNow: false,
});
```

### 3. عدّل منطق الفلترة

**قبل:**

```typescript
if (categoryFilter.value.length) {
  list = list.filter((c) => categoryFilter.value.includes(c.category));
}

if (acceptsDeposit.value) {
  list = list.filter((c) => c.accepts.deposit);
}
```

**بعد:**

```typescript
if (filters.value.categories.length) {
  list = list.filter((c) => filters.value.categories.includes(c.category));
}

if (filters.value.acceptsDeposit) {
  list = list.filter((c) => c.accepts.deposit);
}
```

### 4. عدّل دالة resetFilters

**قبل:**

```typescript
function resetFilters() {
  categoryFilter.value = [];
  cityFilter.value = null;
  cardsFilter.value = null;
  acceptsDeposit.value = false;
  installments.value = false;
  openNow.value = false;
}
```

**بعد:**

```typescript
function handleClearFilters() {
  search.value = "";
  sortBy.value = "relevance";
  // FilterPanel2 clears automatically
}
```

### 5. احذف drawer الموبايل (اختياري)

الـ FilterPanel2 يدعم الموبايل تلقائياً، لذا يمكنك حذف:

```vue
<!-- Filters Drawer (mobile) -->
<v-dialog v-model="filtersOpen">
  <!-- ... -->
</v-dialog>
```

واستبداله بـ:

```vue
<div class="px-4 pb-2">
  <FilterPanel2
    v-model="filters"
    :chip-groups="chipGroups"
    :fields="filterFields"
    :results-count="filteredCompanies.length"
    :collapsible="true"
    :initial-open="false"
  />
</div>
```

---

## النتيجة النهائية

✅ **كود أقل** - أقل من نصف الكود الأصلي  
✅ **قابل لإعادة الاستخدام** - استخدمه في أي صفحة  
✅ **سهل الصيانة** - تعديل واحد يؤثر على كل الصفحات  
✅ **مرن** - أضف/احذف فلاتر بسهولة  
✅ **RTL** - دعم كامل للعربية

---

## تجربة المكون

```bash
# في صفحتك
cd app/pages/companies-card
# عدّل index.vue واستخدم FilterPanel2
```

🎉 **جاهز للاستخدام!**
