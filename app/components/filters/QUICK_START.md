# Quick Start Guide: Adding Filters to Your Pages

## 🚀 5-Minute Integration

This guide shows you how to add the FilterPanel component to any page in 3 simple steps.

---

## Step 1: Add FilterPanel to Template

Add the `<FilterPanel>` component between your divider and data table:

```vue
<template>
  <v-card-text>
    <v-divider />

    <!-- Add FilterPanel here -->
    <FilterPanel
      v-model="filters"
      :fields="filterFields"
      :toggle-button-label="t('common.filter')"
      :submit-button-label="t('common.search')"
      :clear-button-label="t('common.clear')"
      @submit="applyFilters"
      @clear="clearFilters"
    />

    <!-- Your data table -->
    <v-data-table
      :items="displayedItems"
      ...
    />
  </v-card-text>
</template>
```

---

## Step 2: Configure Filter Fields

Define your filter configuration in the script section:

```javascript
// Filter state - stores current filter values
const filters = ref({
  id: '',
  name: '',
  status: '',
  date_from: '',
  date_to: ''
})

// Filter fields configuration - defines what filters to show
const filterFields = [
  {
    name: 'id',                                // Must match key in filters object
    type: 'text',                              // Field type
    label: t('attributes.id'),                 // Display label (use i18n)
    placeholder: 'Enter ID',                   // Optional placeholder
    cols: 12,                                  // Full width on xs screens
    sm: 6,                                     // Half width on sm screens
    lg: 3                                      // Quarter width on lg screens
  },
  {
    name: 'name',
    type: 'text',
    label: t('attributes.name'),
    placeholder: 'Enter name',
    cols: 12,
    sm: 6,
    lg: 3
  },
  {
    name: 'status',
    type: 'select',
    label: t('attributes.status'),
    items: [                                   // Options for select
      { title: t('common.active'), value: 'active' },
      { title: t('common.inactive'), value: 'inactive' }
    ],
    cols: 12,
    sm: 6,
    lg: 3
  },
  {
    name: 'date_from',
    type: 'date',
    label: t('search.from_date'),
    cols: 12,
    sm: 6,
    lg: 3
  },
  {
    name: 'date_to',
    type: 'date',
    label: t('search.to_date'),
    cols: 12,
    sm: 6,
    lg: 3
  }
]
```

---

## Step 3: Implement Filter Logic

Add filtering logic using computed properties:

```javascript
// Your original data
const allRows = ref([
  { id: 1, name: 'Item 1', status: 'active', date: '2025-01-01' },
  { id: 2, name: 'Item 2', status: 'inactive', date: '2025-01-02' },
  // ... more items
])

// Filtered data - automatically updates when filters change
const filteredRows = computed(() => {
  let result = [...allRows.value]
  
  // Apply ID filter
  if (filters.value.id) {
    result = result.filter(row => 
      row.id.toString().includes(filters.value.id)
    )
  }
  
  // Apply name filter
  if (filters.value.name) {
    result = result.filter(row => 
      row.name.toLowerCase().includes(filters.value.name.toLowerCase())
    )
  }
  
  // Apply status filter
  if (filters.value.status) {
    const isActive = filters.value.status === 'active'
    result = result.filter(row => row.status === filters.value.status)
  }
  
  // Apply date range filters
  if (filters.value.date_from) {
    result = result.filter(row => row.date >= filters.value.date_from)
  }
  if (filters.value.date_to) {
    result = result.filter(row => row.date <= filters.value.date_to)
  }
  
  return result
})

// Use filteredRows for pagination
const totalPages = computed(() => 
  Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value))
)

const displayedItems = computed(() => {
  const start = (page.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRows.value.slice(start, end)
})

// Filter event handlers
const applyFilters = (filterValues) => {
  console.log('Filters applied:', filterValues)
  page.value = 1  // Reset to first page
}

const clearFilters = () => {
  console.log('Filters cleared')
  page.value = 1  // Reset to first page
}
```

---

## Complete Working Example

Here's a complete page with filters integrated:

```vue
<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <div class="d-flex justify-space-between align-center">
          <div>{{ t('pages.products.title') }}</div>
          <v-btn color="primary" @click="openAddDialog">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text>
        <v-divider />

        <!-- FilterPanel Integration -->
        <FilterPanel
          v-model="productFilters"
          :fields="productFilterFields"
          :toggle-button-label="t('common.filter')"
          :submit-button-label="t('common.search')"
          :clear-button-label="t('common.clear')"
          button-color="primary"
          @submit="applyProductFilters"
          @clear="clearProductFilters"
        />

        <!-- Data Table -->
        <v-data-table
          :headers="headers"
          :items="displayedProducts"
          :items-per-page="pageSize"
          hide-default-footer
        />

        <!-- Pagination -->
        <div class="d-flex justify-end mt-4">
          <Pagination
            :page="page"
            :length="totalPages"
            :total-items="filteredProducts.length"
            :page-size="pageSize"
            align="end"
            @update:page="page = $event"
            @update:page-size="pageSize = $event; page = 1"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
// @ts-nocheck
definePageMeta({
  layout: 'dashboard',
  title: 'pages.products.title',
  subtitle: 'pages.products.subtitle'
})

const { t } = useI18n()

// Pagination
const page = ref(1)
const pageSize = ref(10)

// Filter state
const productFilters = ref({
  name: '',
  category: '',
  price_min: '',
  price_max: '',
  in_stock: ''
})

// Filter configuration
const productFilterFields = [
  {
    name: 'name',
    type: 'text',
    label: t('attributes.product_name'),
    placeholder: t('search.enter_product_name'),
    cols: 12,
    sm: 6,
    lg: 4
  },
  {
    name: 'category',
    type: 'select',
    label: t('attributes.category'),
    items: ['Electronics', 'Clothing', 'Food', 'Books'],
    cols: 12,
    sm: 6,
    lg: 4
  },
  {
    name: 'price_min',
    type: 'number',
    label: t('attributes.min_price'),
    cols: 12,
    sm: 6,
    lg: 2
  },
  {
    name: 'price_max',
    type: 'number',
    label: t('attributes.max_price'),
    cols: 12,
    sm: 6,
    lg: 2
  },
  {
    name: 'in_stock',
    type: 'select',
    label: t('attributes.availability'),
    items: [
      { title: t('common.in_stock'), value: 'yes' },
      { title: t('common.out_of_stock'), value: 'no' }
    ],
    cols: 12,
    sm: 6,
    lg: 4
  }
]

// Mock data
const allProducts = ref([
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999, in_stock: true },
  { id: 2, name: 'Book', category: 'Books', price: 19.99, in_stock: true },
  { id: 3, name: 'Shirt', category: 'Clothing', price: 29.99, in_stock: false },
  // ... more products
])

// Filtered products
const filteredProducts = computed(() => {
  let result = [...allProducts.value]
  
  if (productFilters.value.name) {
    result = result.filter(p => 
      p.name.toLowerCase().includes(productFilters.value.name.toLowerCase())
    )
  }
  
  if (productFilters.value.category) {
    result = result.filter(p => p.category === productFilters.value.category)
  }
  
  if (productFilters.value.price_min) {
    const min = parseFloat(productFilters.value.price_min)
    if (!isNaN(min)) {
      result = result.filter(p => p.price >= min)
    }
  }
  
  if (productFilters.value.price_max) {
    const max = parseFloat(productFilters.value.price_max)
    if (!isNaN(max)) {
      result = result.filter(p => p.price <= max)
    }
  }
  
  if (productFilters.value.in_stock) {
    const inStock = productFilters.value.in_stock === 'yes'
    result = result.filter(p => p.in_stock === inStock)
  }
  
  return result
})

// Pagination computed
const totalPages = computed(() => 
  Math.max(1, Math.ceil(filteredProducts.value.length / pageSize.value))
)

const displayedProducts = computed(() => {
  const start = (page.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
})

// Headers
const headers = computed(() => ([
  { title: t('attributes.id'), key: 'id', width: 100, align: 'start' },
  { title: t('attributes.name'), key: 'name', width: 200, align: 'start' },
  { title: t('attributes.category'), key: 'category', width: 150, align: 'start' },
  { title: t('attributes.price'), key: 'price', width: 120, align: 'start' },
  { title: t('attributes.stock'), key: 'in_stock', width: 120, align: 'center' }
]))

// Filter handlers
const applyProductFilters = (filterValues) => {
  console.log('Applying filters:', filterValues)
  page.value = 1
}

const clearProductFilters = () => {
  console.log('Filters cleared')
  page.value = 1
}
</script>
```

---

## Common Filter Patterns

### Text Search (Case Insensitive)
```javascript
if (filters.value.name) {
  result = result.filter(row => 
    row.name.toLowerCase().includes(filters.value.name.toLowerCase())
  )
}
```

### Exact Match
```javascript
if (filters.value.category) {
  result = result.filter(row => row.category === filters.value.category)
}
```

### Number Range
```javascript
if (filters.value.price_min) {
  const min = parseFloat(filters.value.price_min)
  if (!isNaN(min)) {
    result = result.filter(row => row.price >= min)
  }
}

if (filters.value.price_max) {
  const max = parseFloat(filters.value.price_max)
  if (!isNaN(max)) {
    result = result.filter(row => row.price <= max)
  }
}
```

### Date Range
```javascript
if (filters.value.date_from) {
  result = result.filter(row => row.date >= filters.value.date_from)
}

if (filters.value.date_to) {
  result = result.filter(row => row.date <= filters.value.date_to)
}
```

### Boolean/Status
```javascript
if (filters.value.is_active) {
  const isActive = filters.value.is_active === 'active'
  result = result.filter(row => row.is_active === isActive)
}
```

### Multiple Selection
```javascript
if (filters.value.tags && filters.value.tags.length > 0) {
  result = result.filter(row => 
    filters.value.tags.some(tag => row.tags.includes(tag))
  )
}
```

---

## Field Types Quick Reference

```javascript
// Text Input
{ name: 'search', type: 'text', label: 'Search' }

// Number Input
{ name: 'age', type: 'number', label: 'Age' }

// Email Input
{ name: 'email', type: 'email', label: 'Email' }

// Single Select
{ 
  name: 'status', 
  type: 'select', 
  label: 'Status',
  items: ['Active', 'Inactive']
}

// Multiple Select
{ 
  name: 'tags', 
  type: 'select', 
  label: 'Tags',
  items: ['Tag1', 'Tag2', 'Tag3'],
  multiple: true
}

// Autocomplete
{ 
  name: 'country', 
  type: 'autocomplete', 
  label: 'Country',
  items: ['USA', 'UK', 'Canada']
}

// Date Picker
{ name: 'date', type: 'date', label: 'Date' }

// Checkbox
{ name: 'active_only', type: 'checkbox', label: 'Active Only' }

// Switch
{ name: 'show_archived', type: 'switch', label: 'Show Archived' }
```

---

## Grid Layout Examples

```javascript
// Full width on mobile, half on tablet, quarter on desktop
{ cols: 12, sm: 6, md: 4, lg: 3 }

// Full width on mobile, half on tablet, third on desktop
{ cols: 12, sm: 6, md: 6, lg: 4 }

// Always full width
{ cols: 12, sm: 12, md: 12, lg: 12 }

// Half width on all screens
{ cols: 6, sm: 6, md: 6, lg: 6 }
```

---

## Tips & Best Practices

### 1. Always Reset Page Number
```javascript
const applyFilters = (filterValues) => {
  page.value = 1  // ✅ Reset to page 1 when filters change
}
```

### 2. Use i18n for Labels
```javascript
// ✅ Good
label: t('attributes.name')

// ❌ Bad
label: 'Name'
```

### 3. Rename Data Source
```javascript
// Change from:
const rows = ref([...])

// To:
const allRows = ref([...])
const filteredRows = computed(() => { /* filter logic */ })
const rows = filteredRows  // For compatibility
```

### 4. Handle Empty Filters
```javascript
// Always check if filter value exists
if (filters.value.name) {  // ✅ Checks for empty string
  result = result.filter(...)
}
```

### 5. Parse Numbers Safely
```javascript
const min = parseFloat(filters.value.price_min)
if (!isNaN(min)) {  // ✅ Check if valid number
  result = result.filter(p => p.price >= min)
}
```

---

## Real-World Examples

### Example 1: Banks Page
See `app/pages/banks.vue` for a complete working example with:
- Text filters (ID, IBAN, BIC)
- Select filter (status)
- Integration with existing pagination

### Example 2: Currency Page
See `app/pages/currency.vue` for:
- Text filters (name, code, symbol)
- Number range filters (exchange rate min/max)
- Boolean filter (active/inactive status)

### Example 3: Movies Page (Original)
See `app/pages/movies.vue` for the original inline filters that inspired FilterPanel

---

## Troubleshooting

### Filters Not Working
- ✅ Check that filter field `name` matches keys in `filters` object
- ✅ Verify `filteredRows` computed property is used in pagination
- ✅ Ensure `v-model="filters"` is on FilterPanel

### Empty Results
- ✅ Check filter logic - may be too restrictive
- ✅ Console.log `filteredRows.value` to debug
- ✅ Verify data types match (string vs number)

### Layout Issues
- ✅ Check `cols`, `sm`, `md`, `lg` add up to 12
- ✅ Ensure FilterPanel has enough space
- ✅ Test on different screen sizes

---

## Next Steps

1. ✅ Copy one of the working examples (banks or currency)
2. ✅ Modify filter fields to match your data
3. ✅ Implement filter logic in computed property
4. ✅ Test with sample data
5. ✅ Connect to real API

---

Need more help? Check the full documentation:
- **[FilterPanel README](./README.md)** - Complete component documentation
- **[Field Types](./README.md#field-types)** - All available field types
- **[Props Reference](./README.md#props-reference)** - All customization options

Happy filtering! 🎯✨
