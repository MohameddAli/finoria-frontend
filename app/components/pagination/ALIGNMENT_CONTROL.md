# Pagination Alignment Control

## Overview
Both `Pagination.vue` and `AppPagination.vue` components now support comprehensive alignment control for positioning pagination elements on the page.

## The `align` Prop

### Supported Values
```typescript
align: 'start' | 'center' | 'end' | 'space-between'
```

### Default Value
- **Pagination.vue**: `'end'` (aligns to the right in LTR, left in RTL)
- **AppPagination.vue**: `'center'` (centers the pagination)

### Prop Validation
Both components include a validator that ensures only valid alignment values are accepted:
```javascript
align: { 
  type: String, 
  default: 'end', // or 'center'
  validator: (value) => ['start', 'center', 'end', 'space-between'].includes(value)
}
```

---

## Alignment Options

### 1. `align="start"`
Aligns pagination to the **start** of the container.

**Visual (LTR):**
```
[← First] [1] [2] [3] [Next →]                                    
```

**Visual (RTL):**
```
                                    [→ أول] [١] [٢] [٣] [← التالي]
```

**Usage:**
```vue
<Pagination
  :page="1"
  :length="10"
  align="start"
/>
```

---

### 2. `align="center"`
Centers pagination in the container.

**Visual (LTR):**
```
                    [← First] [1] [2] [3] [Next →]                    
```

**Visual (RTL):**
```
                    [→ أول] [١] [٢] [٣] [← التالي]
```

**Usage:**
```vue
<AppPagination
  :page="1"
  :length="10"
  align="center"
/>
```

---

### 3. `align="end"`
Aligns pagination to the **end** of the container.

**Visual (LTR):**
```
                                    [← First] [1] [2] [3] [Next →]
```

**Visual (RTL):**
```
[→ أول] [١] [٢] [٣] [← التالي]                                    
```

**Usage:**
```vue
<Pagination
  :page="1"
  :length="10"
  align="end"
/>
```

---

### 4. `align="space-between"`
Distributes pagination elements with **maximum space** between them.

**Visual (LTR):**
```
[← First]                    [1] [2] [3]                    [Next →]
```

**Visual (RTL):**
```
[→ أول]                      [١] [٢] [٣]                      [← التالي]
```

**Usage:**
```vue
<Pagination
  :page="1"
  :length="10"
  align="space-between"
  :show-first-last="true"
/>
```

**Note:** `space-between` works best when `show-first-last` is enabled to create clear separation.

---

## RTL Behavior

The alignment system is **RTL-aware**:

- `align="start"` → Aligns to **left** in LTR, **right** in RTL
- `align="end"` → Aligns to **right** in LTR, **left** in RTL
- `align="center"` → Always centers regardless of direction
- `align="space-between"` → Works the same in both directions

**Example:**
```vue
<template>
  <div>
    <!-- English (LTR): aligns to right -->
    <!-- Arabic (RTL): aligns to left -->
    <Pagination
      :page="currentPage"
      :length="totalPages"
      align="end"
    />
  </div>
</template>
```

---

## Implementation Details

### Computed Property
```javascript
const alignmentClass = computed(() => {
  switch (props.align) {
    case 'start':
      return 'justify-start'
    case 'center':
      return 'justify-center'
    case 'space-between':
      return 'justify-space-between'
    case 'end':
    default:
      return 'justify-end'
  }
})
```

### CSS Classes Applied
The computed `alignmentClass` returns Flexbox utility classes:
- `justify-start` → `justify-content: flex-start`
- `justify-center` → `justify-content: center`
- `justify-end` → `justify-content: flex-end`
- `justify-space-between` → `justify-content: space-between`

### Container Structure
```vue
<div class="pagination-container" :class="alignmentClass">
  <!-- First button (if showFirstLast) -->
  <!-- v-pagination component -->
  <!-- Last button (if showFirstLast) -->
</div>
```

---

## Practical Examples

### Example 1: Banks Page (End Alignment)
```vue
<template>
  <div class="banks-page">
    <BanksTable :items="banks" />
    
    <!-- Pagination aligned to the right (LTR) or left (RTL) -->
    <Pagination
      v-model:page="currentPage"
      :length="totalPages"
      :total-items="totalBanks"
      :page-size="pageSize"
      align="end"
      show-first-last
    />
  </div>
</template>
```

### Example 2: Dashboard (Center Alignment)
```vue
<template>
  <div class="dashboard">
    <DataGrid :data="items" />
    
    <!-- Centered pagination for better visual balance -->
    <AppPagination
      :page="page"
      :length="pages"
      :total-items="total"
      align="center"
      show-range
    />
  </div>
</template>
```

### Example 3: Reports (Space Between)
```vue
<template>
  <div class="reports-page">
    <ReportsTable :reports="reports" />
    
    <!-- First/Last buttons separated from page numbers -->
    <Pagination
      v-model:page="currentPage"
      :length="totalPages"
      :total-items="totalReports"
      align="space-between"
      show-first-last
      size="large"
    />
  </div>
</template>
```

### Example 4: Mobile Responsive
```vue
<template>
  <div class="mobile-list">
    <MobileItems :items="items" />
    
    <!-- Center on mobile, end on desktop -->
    <Pagination
      v-model:page="page"
      :length="pages"
      :align="isMobile ? 'center' : 'end'"
      :size="isMobile ? 'small' : 'default'"
      dense
    />
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)
</script>
```

---

## Best Practices

### 1. Consistency
Use the same alignment across similar pages for consistent UX:
```javascript
// composables/usePaginationDefaults.ts
export const usePaginationDefaults = () => {
  return {
    align: 'end', // or 'center' based on your design system
    size: 'small',
    showFirstLast: true,
    showRange: true,
    dense: false
  }
}
```

### 2. Responsive Design
Adjust alignment based on screen size:
```vue
<Pagination
  :align="$vuetify.display.xs ? 'center' : 'end'"
  :dense="$vuetify.display.xs"
/>
```

### 3. Visual Hierarchy
- Use `align="end"` when pagination is secondary
- Use `align="center"` when pagination is the main action
- Use `align="space-between"` for complex layouts with multiple controls

### 4. RTL Testing
Always test alignment in both RTL and LTR modes:
```bash
# Test with Arabic locale
# Change locale to 'ar' and verify alignment flips correctly
```

---

## Migration Guide

### Updating Existing Components

**Before:**
```vue
<AppPagination
  :page="page"
  :length="pages"
  <!-- No alignment control -->
/>
```

**After:**
```vue
<AppPagination
  :page="page"
  :length="pages"
  align="end"  <!-- Now with full alignment control -->
/>
```

### Default Behavior
If you don't specify `align`, the component uses its default:
- **Pagination.vue** → `align="end"`
- **AppPagination.vue** → `align="center"`

No code changes are needed for existing implementations.

---

## Troubleshooting

### Issue: Alignment Not Working
**Cause:** Invalid alignment value  
**Solution:** Use only allowed values: `'start'`, `'center'`, `'end'`, `'space-between'`

```vue
<!-- ❌ Wrong -->
<Pagination align="left" />

<!-- ✅ Correct -->
<Pagination align="start" />
```

### Issue: Space Between Not Visible
**Cause:** `show-first-last` is disabled  
**Solution:** Enable first/last buttons for better spacing

```vue
<!-- ✅ Space between works best with first/last buttons -->
<Pagination
  align="space-between"
  show-first-last
/>
```

### Issue: RTL Alignment Reversed
**Cause:** Normal behavior - `start`/`end` are directional  
**Solution:** Use `center` for non-directional alignment, or test in RTL mode

```vue
<!-- Always centered, regardless of direction -->
<Pagination align="center" />
```

---

## Testing Checklist

- [ ] Test all 4 alignment values: `start`, `center`, `end`, `space-between`
- [ ] Verify alignment in **LTR mode** (English)
- [ ] Verify alignment in **RTL mode** (Arabic)
- [ ] Test with `show-first-last` enabled and disabled
- [ ] Test on different screen sizes (mobile, tablet, desktop)
- [ ] Verify invalid alignment values are rejected by validator
- [ ] Check visual consistency across different pages
- [ ] Test with single page (length=1) scenario

---

## Summary

The alignment control feature provides:
- ✅ **4 alignment options**: start, center, end, space-between
- ✅ **RTL-aware**: Automatic direction handling
- ✅ **Prop validation**: Prevents invalid values
- ✅ **Consistent API**: Same across both pagination components
- ✅ **Flexible layouts**: Adapt to any page design
- ✅ **Easy migration**: Default values ensure backward compatibility

Use `align` prop to position pagination exactly where you need it! 🎯
