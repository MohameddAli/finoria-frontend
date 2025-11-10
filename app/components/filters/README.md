# FilterPanel Component Documentation

## Overview

`FilterPanel` is a reusable, flexible filter component for Nuxt 4 + Vuetify 3 applications. It provides an expandable/collapsible filter panel with support for multiple field types, RTL compatibility, and full theme integration.

## ✨ NEW: Collapsible Mode Control

You can now control how filters are displayed using the `collapsible` prop:

### Collapsible Mode (`collapsible: true`) - Default

```vue
<FilterPanel
  v-model="formData"
  :fields="filterFields"
  :collapsible="true"
  toggle-button-label="Show Filters"
  @submit="handleSubmit"
/>
```

- Shows a "Filter" button at the top
- Click to expand/collapse filters
- Perfect for optional filters in data tables

### Direct Mode (`collapsible: false`)

```vue
<FilterPanel
  v-model="formData"
  :fields="filterFields"
  :collapsible="false"
  @submit="handleSubmit"
/>
```

- No toggle button
- Filters always visible
- Perfect for search forms like JSON Body page

---

## Features

✅ **Multiple Field Types**: text, number, email, select, autocomplete, date, checkbox, switch  
✅ **Expandable/Collapsible**: Smooth transitions with visual feedback  
✅ **Active Filter Counter**: Shows how many filters are active  
✅ **RTL Support**: Automatically adapts to Arabic/RTL layouts  
✅ **Theme Aware**: Integrates with Vuetify 3 theme system  
✅ **Fully Customizable**: Extensive props for customization  
✅ **Responsive Grid**: Flexible column layout for all screen sizes  
✅ **Two-Way Binding**: v-model support for filter values

---

## Installation

The component is located at:

```
app/components/filters/FilterPanel.vue
```

No additional installation needed - it's auto-imported by Nuxt!

---

## Basic Usage

### 1. Import and Use

```vue
<template>
  <FilterPanel
    v-model="filters"
    :fields="filterFields"
    toggle-button-label="Filter"
    @submit="handleFilterSubmit"
    @clear="handleFilterClear"
  />
</template>

<script setup>
const filters = ref({});

const filterFields = [
  {
    name: "search",
    type: "text",
    label: "Search",
    placeholder: "Enter search term...",
  },
  {
    name: "status",
    type: "select",
    label: "Status",
    items: ["Active", "Inactive", "Pending"],
  },
];

const handleFilterSubmit = (filterValues) => {
  console.log("Filters submitted:", filterValues);
  // Apply filters to your data
};

const handleFilterClear = () => {
  console.log("Filters cleared");
  // Reset your data
};
</script>
```

---

## Field Types

### Text Field

```javascript
{
  name: 'username',
  type: 'text',
  label: 'Username',
  placeholder: 'Enter username',
  clearable: true,
  counter: true,
  maxlength: 50,
  cols: 12,
  sm: 6,
  lg: 3
}
```

### Number Field

```javascript
{
  name: 'age',
  type: 'number',
  label: 'Age',
  placeholder: 'Enter age',
  cols: 12,
  sm: 6,
  lg: 3
}
```

### Email Field

```javascript
{
  name: 'email',
  type: 'email',
  label: 'Email Address',
  placeholder: 'user@example.com',
  cols: 12,
  sm: 6,
  lg: 4
}
```

### Select Field

```javascript
{
  name: 'category',
  type: 'select',
  label: 'Category',
  items: ['Electronics', 'Clothing', 'Food'],
  clearable: true,
  cols: 12,
  sm: 6,
  lg: 3
}
```

### Multiple Select

```javascript
{
  name: 'tags',
  type: 'select',
  label: 'Tags',
  items: ['Tag1', 'Tag2', 'Tag3'],
  multiple: true,
  clearable: true,
  cols: 12,
  sm: 6,
  lg: 4
}
```

### Autocomplete Field

```javascript
{
  name: 'country',
  type: 'autocomplete',
  label: 'Country',
  items: ['USA', 'UK', 'Canada', 'Australia'],
  clearable: true,
  cols: 12,
  sm: 6,
  lg: 3
}
```

### Date Field

```javascript
{
  name: 'from_date',
  type: 'date',
  label: 'From Date',
  clearable: true,
  cols: 12,
  sm: 6,
  lg: 3
}
```

### Checkbox Field

```javascript
{
  name: 'is_active',
  type: 'checkbox',
  label: 'Active Only',
  color: 'primary',
  cols: 12,
  sm: 6,
  lg: 3
}
```

### Switch Field

```javascript
{
  name: 'show_archived',
  type: 'switch',
  label: 'Show Archived',
  color: 'success',
  cols: 12,
  sm: 6,
  lg: 3
}
```

---

## Props Reference

### Core Props

| Prop          | Type    | Default | Description                                                 |
| ------------- | ------- | ------- | ----------------------------------------------------------- |
| `fields`      | Array   | `[]`    | Array of field configuration objects                        |
| `modelValue`  | Object  | `{}`    | v-model binding for filter values                           |
| `collapsible` | Boolean | `true`  | **NEW:** Enable/disable collapsible mode                    |
| `initialOpen` | Boolean | `false` | Whether filters start expanded (only when collapsible=true) |
| `loading`     | Boolean | `false` | **NEW:** Loading state for submit button                    |

### Toggle Button Props

| Prop                | Type   | Default                | Description            |
| ------------------- | ------ | ---------------------- | ---------------------- |
| `buttonVariant`     | String | `'outlined'`           | Vuetify button variant |
| `buttonColor`       | String | `'primary'`            | Button color           |
| `filterIcon`        | String | `'mdi-filter-variant'` | Icon for filter button |
| `toggleButtonLabel` | String | `'Filter'`             | Button text            |

### Active Filter Indicator Props

| Prop                 | Type    | Default     | Description                    |
| -------------------- | ------- | ----------- | ------------------------------ |
| `showActiveCount`    | Boolean | `true`      | Show active filters count chip |
| `chipColor`          | String  | `'primary'` | Chip color                     |
| `activeFiltersLabel` | String  | `'active'`  | Label for active filters       |

### Submit Button Props

| Prop                  | Type    | Default         | Description                 |
| --------------------- | ------- | --------------- | --------------------------- |
| `showSubmitButton`    | Boolean | `true`          | Show submit button          |
| `submitButtonColor`   | String  | `'primary'`     | Submit button color         |
| `submitButtonVariant` | String  | `'flat'`        | Submit button variant       |
| `submitButtonIcon`    | String  | `'mdi-magnify'` | Submit button icon          |
| `submitButtonText`    | String  | `''`            | Submit button text          |
| `submitButtonLabel`   | String  | `'Search'`      | Submit button aria-label    |
| `submitButtonCols`    | Number  | `12`            | Grid cols for submit button |
| `submitButtonSm`      | Number  | `3`             | Grid sm for submit button   |
| `submitButtonMd`      | Number  | `2`             | Grid md for submit button   |
| `submitButtonLg`      | Number  | `2`             | Grid lg for submit button   |

### Clear Button Props

| Prop                 | Type    | Default       | Description             |
| -------------------- | ------- | ------------- | ----------------------- |
| `showClearButton`    | Boolean | `true`        | Show clear button       |
| `clearButtonColor`   | String  | `'default'`   | Clear button color      |
| `clearButtonVariant` | String  | `'outlined'`  | Clear button variant    |
| `clearButtonIcon`    | String  | `'mdi-close'` | Clear button icon       |
| `clearButtonText`    | String  | `''`          | Clear button text       |
| `clearButtonLabel`   | String  | `'Clear'`     | Clear button aria-label |

### UI Options

| Prop          | Type    | Default | Description                |
| ------------- | ------- | ------- | -------------------------- |
| `showDivider` | Boolean | `true`  | Show divider after filters |

---

## Events

| Event               | Payload   | Description                        |
| ------------------- | --------- | ---------------------------------- |
| `update:modelValue` | `Object`  | Emitted when filter values change  |
| `submit`            | `Object`  | Emitted when search button clicked |
| `clear`             | -         | Emitted when clear button clicked  |
| `toggle`            | `Boolean` | Emitted when filter panel toggled  |

---

## Field Configuration

Each field object in the `fields` array can have:

| Property         | Type    | Description                                    |
| ---------------- | ------- | ---------------------------------------------- |
| `name`           | String  | **Required** - Unique field identifier         |
| `type`           | String  | **Required** - Field type (text, select, etc.) |
| `label`          | String  | **Required** - Field label                     |
| `placeholder`    | String  | Placeholder text                               |
| `items`          | Array   | Items for select/autocomplete                  |
| `multiple`       | Boolean | Enable multiple selection                      |
| `clearable`      | Boolean | Show clear button (default: true)              |
| `disabled`       | Boolean | Disable field                                  |
| `cols`           | Number  | Grid columns (default: 12)                     |
| `sm`             | Number  | Small breakpoint (default: 6)                  |
| `md`             | Number  | Medium breakpoint (default: 4)                 |
| `lg`             | Number  | Large breakpoint (default: 3)                  |
| `hint`           | String  | Help text                                      |
| `persistentHint` | Boolean | Always show hint                               |
| `counter`        | Boolean | Show character counter                         |
| `maxlength`      | Number  | Max character length                           |
| `color`          | String  | Color for checkbox/switch                      |

---

## Complete Example: Movies Page

```vue
<template>
  <v-container>
    <v-card>
      <v-card-title>Movies</v-card-title>

      <v-card-text>
        <!-- Filter Panel -->
        <FilterPanel
          v-model="filters"
          :fields="filterFields"
          :toggle-button-label="t('common.filter')"
          :submit-button-label="t('common.search')"
          :clear-button-label="t('common.clear')"
          :active-filters-label="t('common.active')"
          @submit="applyFilters"
          @clear="resetFilters"
        />

        <!-- Data Table -->
        <v-data-table
          :headers="headers"
          :items="filteredMovies"
          :items-per-page="10"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
const { t } = useI18n();

// Filter state
const filters = ref({
  id: "",
  batch: "",
  bank: "",
  branch: "",
  checkbooktype: "",
  from_date: "",
  to_date: "",
  ftpid: "",
  priority: "",
  not_canceled_at: "",
  canceled_from: "",
  canceled_to: "",
});

// Filter fields configuration
const filterFields = [
  {
    name: "id",
    type: "text",
    label: t("attributes.id"),
    cols: 12,
    sm: 3,
    lg: 3,
  },
  {
    name: "batch",
    type: "text",
    label: t("attributes.batch"),
    cols: 12,
    sm: 3,
    lg: 3,
  },
  {
    name: "bank",
    type: "select",
    label: t("attributes.bank"),
    items: ["Bank A", "Bank B", "Bank C"],
    cols: 12,
    sm: 3,
    lg: 3,
  },
  {
    name: "branch",
    type: "select",
    label: t("attributes.branch"),
    items: ["Branch 1", "Branch 2", "Branch 3"],
    cols: 12,
    sm: 3,
    lg: 3,
  },
  {
    name: "checkbooktype",
    type: "select",
    label: t("attributes.checkbooktype"),
    items: ["Type 1", "Type 2", "Type 3"],
    cols: 12,
    sm: 3,
    lg: 3,
  },
  {
    name: "from_date",
    type: "date",
    label: t("search.from_date"),
    cols: 12,
    sm: 3,
    lg: 3,
  },
  {
    name: "to_date",
    type: "date",
    label: t("search.to_date"),
    cols: 12,
    sm: 4,
    lg: 3,
  },
  {
    name: "ftpid",
    type: "text",
    label: t("attributes.ftpid"),
    cols: 12,
    sm: 3,
    lg: 3,
  },
  {
    name: "priority",
    type: "select",
    label: t("attributes.priority"),
    items: ["High", "Low"],
    cols: 12,
    sm: 3,
    lg: 3,
  },
  {
    name: "not_canceled_at",
    type: "select",
    label: t("attributes.not_canceled_at_title"),
    items: ["High", "Low"],
    cols: 12,
    sm: 3,
    lg: 3,
  },
  {
    name: "canceled_from",
    type: "date",
    label: t("search.canceled_from"),
    cols: 12,
    sm: 4,
    lg: 3,
  },
  {
    name: "canceled_to",
    type: "date",
    label: t("search.canceled_to"),
    cols: 12,
    sm: 3,
    lg: 3,
  },
];

// Mock data
const movies = ref([
  // Your movies data
]);

// Filtered data
const filteredMovies = computed(() => {
  let result = [...movies.value];

  // Apply filters
  if (filters.value.id) {
    result = result.filter((m) => m.id.toString().includes(filters.value.id));
  }
  if (filters.value.batch) {
    result = result.filter((m) => m.batch.includes(filters.value.batch));
  }
  if (filters.value.bank) {
    result = result.filter((m) => m.bank === filters.value.bank);
  }
  // ... more filter logic

  return result;
});

// Filter handlers
const applyFilters = (filterValues) => {
  console.log("Applying filters:", filterValues);
  // Filters are already applied via computed property
};

const resetFilters = () => {
  console.log("Filters cleared");
  // Filters are already reset by the component
};
</script>
```

---

## Example: Banks Page

```vue
<template>
  <v-container>
    <v-card>
      <v-card-title>Banks</v-card-title>

      <v-card-text>
        <FilterPanel
          v-model="bankFilters"
          :fields="bankFilterFields"
          :toggle-button-label="t('common.filter')"
          @submit="searchBanks"
        />

        <v-data-table :headers="bankHeaders" :items="filteredBanks" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
const { t } = useI18n();

const bankFilters = ref({
  id: "",
  company_id: "",
  currency_id: "",
  iban: "",
  bic: "",
  status: "",
});

const bankFilterFields = [
  {
    name: "id",
    type: "text",
    label: t("attributes.id"),
    cols: 12,
    sm: 6,
    lg: 3,
  },
  {
    name: "company_id",
    type: "select",
    label: t("attributes.company_id"),
    items: ["Company A", "Company B"],
    cols: 12,
    sm: 6,
    lg: 3,
  },
  {
    name: "currency_id",
    type: "select",
    label: t("attributes.currency_id"),
    items: ["USD", "EUR", "LYD"],
    cols: 12,
    sm: 6,
    lg: 3,
  },
  {
    name: "iban",
    type: "text",
    label: t("attributes.iban"),
    cols: 12,
    sm: 6,
    lg: 3,
  },
  {
    name: "bic",
    type: "text",
    label: t("attributes.bic"),
    cols: 12,
    sm: 6,
    lg: 3,
  },
  {
    name: "status",
    type: "select",
    label: t("attributes.status"),
    items: ["Active", "Inactive"],
    cols: 12,
    sm: 6,
    lg: 3,
  },
];

const searchBanks = (filterValues) => {
  console.log("Searching banks with:", filterValues);
  // Perform search/filter logic
};
</script>
```

---

## Example: Currency Page

```vue
<template>
  <v-container>
    <v-card>
      <v-card-title>Currency</v-card-title>

      <v-card-text>
        <FilterPanel
          v-model="currencyFilters"
          :fields="currencyFilterFields"
          :toggle-button-label="t('common.filter')"
          button-color="success"
          submit-button-color="success"
          @submit="searchCurrencies"
        />

        <v-data-table :headers="currencyHeaders" :items="filteredCurrencies" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
const { t } = useI18n();

const currencyFilters = ref({
  name: "",
  code: "",
  symbol: "",
  exchange_rate_min: "",
  exchange_rate_max: "",
  is_active: "",
});

const currencyFilterFields = [
  {
    name: "name",
    type: "text",
    label: t("attributes.currency"),
    placeholder: "Enter currency name",
    cols: 12,
    sm: 6,
    lg: 4,
  },
  {
    name: "code",
    type: "text",
    label: t("attributes.code"),
    placeholder: "e.g., USD",
    cols: 12,
    sm: 6,
    lg: 4,
  },
  {
    name: "symbol",
    type: "text",
    label: t("attributes.symbol"),
    placeholder: "e.g., $",
    cols: 12,
    sm: 6,
    lg: 4,
  },
  {
    name: "exchange_rate_min",
    type: "number",
    label: t("attributes.exchange_rate_min"),
    cols: 12,
    sm: 6,
    lg: 3,
  },
  {
    name: "exchange_rate_max",
    type: "number",
    label: t("attributes.exchange_rate_max"),
    cols: 12,
    sm: 6,
    lg: 3,
  },
  {
    name: "is_active",
    type: "select",
    label: t("attributes.status"),
    items: [
      { title: "Active", value: true },
      { title: "Inactive", value: false },
    ],
    cols: 12,
    sm: 6,
    lg: 3,
  },
];

const searchCurrencies = (filterValues) => {
  console.log("Searching currencies with:", filterValues);
  // Perform search/filter logic
};
</script>
```

---

## Advanced Features

### 1. Programmatic Control

You can control the filter panel programmatically using refs:

```vue
<template>
  <FilterPanel ref="filterPanelRef" v-model="filters" :fields="filterFields" />

  <v-btn @click="openFilters">Open Filters</v-btn>
  <v-btn @click="closeFilters">Close Filters</v-btn>
  <v-btn @click="clearAllFilters">Clear All</v-btn>
</template>

<script setup>
const filterPanelRef = ref(null);

const openFilters = () => {
  if (filterPanelRef.value) {
    filterPanelRef.value.isOpen = true;
  }
};

const closeFilters = () => {
  if (filterPanelRef.value) {
    filterPanelRef.value.isOpen = false;
  }
};

const clearAllFilters = () => {
  if (filterPanelRef.value) {
    filterPanelRef.value.clearFilters();
  }
};
</script>
```

### 2. Dynamic Fields

You can dynamically change fields based on conditions:

```vue
<script setup>
const filterFields = computed(() => {
  const baseFields = [{ name: "search", type: "text", label: "Search" }];

  // Add fields based on user role
  if (userRole.value === "admin") {
    baseFields.push({
      name: "user_id",
      type: "select",
      label: "User",
      items: users.value,
    });
  }

  return baseFields;
});
</script>
```

### 3. Custom Validation

```vue
<template>
  <FilterPanel
    v-model="filters"
    :fields="filterFields"
    @submit="validateAndSubmit"
  />
</template>

<script setup>
const validateAndSubmit = (filterValues) => {
  // Custom validation
  if (filterValues.from_date && filterValues.to_date) {
    if (new Date(filterValues.from_date) > new Date(filterValues.to_date)) {
      alert("From date must be before to date");
      return;
    }
  }

  // Proceed with filter
  applyFilters(filterValues);
};
</script>
```

### 4. Persistence (Save Filters)

```vue
<script setup>
const filters = ref({});

// Load saved filters
onMounted(() => {
  const saved = localStorage.getItem("myPageFilters");
  if (saved) {
    filters.value = JSON.parse(saved);
  }
});

// Save filters on change
watch(
  filters,
  (newFilters) => {
    localStorage.setItem("myPageFilters", JSON.stringify(newFilters));
  },
  { deep: true }
);
</script>
```

---

## Styling and Customization

### Custom Colors

```vue
<FilterPanel
  button-color="success"
  submit-button-color="success"
  chip-color="warning"
  clear-button-color="error"
/>
```

### Custom Icons

```vue
<FilterPanel
  filter-icon="mdi-tune"
  submit-button-icon="mdi-magnify"
  clear-button-icon="mdi-refresh"
/>
```

### Button Text

```vue
<FilterPanel
  toggle-button-label="Advanced Filters"
  submit-button-text="Apply"
  clear-button-text="Reset"
/>
```

---

## RTL Support

The component automatically detects RTL mode and adjusts:

- Icon positions flip automatically
- Text alignment adjusts
- Grid layout mirrors

No additional configuration needed!

---

## Best Practices

### 1. Use Meaningful Field Names

```javascript
// ✅ Good
{ name: 'user_email', type: 'email', label: 'Email' }

// ❌ Bad
{ name: 'field1', type: 'email', label: 'Email' }
```

### 2. Set Appropriate Grid Sizes

```javascript
// For 4 columns on large screens
{ name: 'field1', cols: 12, sm: 6, md: 4, lg: 3 }

// For full width on small, half on medium, third on large
{ name: 'field2', cols: 12, sm: 12, md: 6, lg: 4 }
```

### 3. Provide Clear Labels

```javascript
// ✅ Good - Use i18n
{ name: 'status', type: 'select', label: t('attributes.status') }

// ❌ Bad - Hardcoded
{ name: 'status', type: 'select', label: 'Status' }
```

### 4. Use Computed Filtered Data

```javascript
const filteredData = computed(() => {
  return data.value.filter((item) => {
    // Apply filter logic
    if (filters.value.name && !item.name.includes(filters.value.name)) {
      return false;
    }
    return true;
  });
});
```

---

## Troubleshooting

### Filters Not Working

**Issue:** Filter values not updating  
**Solution:** Make sure you're using `v-model` and the field `name` matches your filter object keys

### Fields Not Showing

**Issue:** Fields configured but not visible  
**Solution:** Check that `fields` prop is passed correctly and each field has `name`, `type`, and `label`

### Submit Not Triggering

**Issue:** Submit event not firing  
**Solution:** Ensure `@submit` handler is attached and `showSubmitButton` is `true`

### Styling Issues

**Issue:** Fields not aligned properly  
**Solution:** Check `cols`, `sm`, `md`, `lg` values add up correctly across breakpoints

---

## Migration from Old Filters

### Before (Inline Filters)

```vue
<v-row>
  <v-col cols="12" sm="6">
    <v-text-field v-model="filter1" />
  </v-col>
  <v-col cols="12" sm="6">
    <v-text-field v-model="filter2" />
  </v-col>
</v-row>
```

### After (FilterPanel)

```vue
<FilterPanel
  v-model="filters"
  :fields="[
    { name: 'filter1', type: 'text', label: 'Filter 1', cols: 12, sm: 6 },
    { name: 'filter2', type: 'text', label: 'Filter 2', cols: 12, sm: 6 },
  ]"
/>
```

---

## 🆕 NEW: FilterPanel2 Component

### Overview

`FilterPanel2` is a specialized filter component designed for **floating button filters** (chip groups) and **switch filters**, perfect for companies-card page style filtering.

### Key Differences

| Feature                 | FilterPanel                    | FilterPanel2                      |
| ----------------------- | ------------------------------ | --------------------------------- |
| **Primary Use**         | Form-style filters with submit | Real-time filtering               |
| **Chip Groups**         | ❌                             | ✅ Floating button filters        |
| **Switch Labels**       | Static                         | Dynamic (Active/Inactive)         |
| **Results Count**       | ❌                             | ✅ Built-in results counter       |
| **Auto-submit**         | ❌ Requires submit button      | ✅ Changes emit immediately       |
| **Default collapsible** | ✅ Yes                         | ❌ No (always visible by default) |
| **Best for**            | Search forms, complex filters  | Category filters, toggle filters  |

### Quick Example

```vue
<FilterPanel2
  v-model="filters"
  :chip-groups="chipGroups"
  :fields="filterFields"
  :results-count="filteredData.length"
  @change="handleFilterChange"
/>
```

### Documentation

For complete FilterPanel2 documentation, see:

- 📖 [FILTER_PANEL2_README.md](./FILTER_PANEL2_README.md)
- 🚀 [FILTER_PANEL2_QUICK_START.md](./FILTER_PANEL2_QUICK_START.md)

---

## Summary

The `FilterPanel` component provides:

- ✅ **Reusable** - One component for all filter needs
- ✅ **Flexible** - Support for 8 field types
- ✅ **Responsive** - Works on all screen sizes
- ✅ **Accessible** - Proper ARIA labels and keyboard navigation
- ✅ **i18n Ready** - RTL support and translation-ready
- ✅ **Theme Aware** - Automatically matches your theme
- ✅ **Developer Friendly** - Clear API and extensive documentation

Use it in your pages to standardize filter UX across your application! 🎯

---

تم التوثيق بنجاح! ✅  
Documentation Complete! ✅
