# AppDetailsDialog Component

Professional reusable details/view dialog component for displaying read-only information.

## Features

- 🎨 **Customizable Header** with icon, title, subtitle
- 🏷️ **Optional Status Badge** slot
- 📜 **Scrollable Content Area** with custom scrollbar
- 🧩 **Flexible Slot-based Content**
- ⚡ **Optional Action Buttons**
- 🌍 **RTL Support**
- ♿ **Accessible**
- 📱 **Responsive Design**

## Basic Usage

```vue
<template>
  <AppDetailsDialog
    v-model="isOpen"
    title="Currency Details"
    icon="mdi-currency-usd"
  >
    <!-- Your content here -->
    <div>Currency information...</div>
  </AppDetailsDialog>
</template>

<script setup>
const isOpen = ref(false);
</script>
```

## Advanced Usage

### With Status Badge

```vue
<AppDetailsDialog
  v-model="isOpen"
  title="Currency Details"
  subtitle="USD"
  icon="mdi-currency-usd"
  icon-color="primary"
  icon-bg-color="rgba(var(--v-theme-primary), 0.1)"
>
  <template #badge>
    <v-chip color="success" size="small">
      <v-icon start size="small">mdi-check-circle</v-icon>
      Active
    </v-chip>
  </template>

  <!-- Content -->
  <v-row>
    <v-col cols="12" sm="6">
      <div class="detail-label">Currency Name</div>
      <div class="detail-value">US Dollar</div>
    </v-col>
  </v-row>
</AppDetailsDialog>
```

### With Custom Actions

```vue
<AppDetailsDialog
  v-model="isOpen"
  title="User Details"
  icon="mdi-account"
  :show-actions="true"
>
  <template #actions>
    <v-spacer />
    <v-btn variant="outlined" @click="isOpen = false">
      Close
    </v-btn>
    <v-btn color="primary" @click="viewMore">
      View Full Profile
    </v-btn>
  </template>

  <!-- Content -->
  <div>User information...</div>
</AppDetailsDialog>
```

### With Custom Icon Slot

```vue
<AppDetailsDialog v-model="isOpen" title="Product Details">
  <template #icon>
    <v-avatar size="48">
      <v-img src="/product-image.jpg" />
    </v-avatar>
  </template>

  <!-- Content -->
  <div>Product information...</div>
</AppDetailsDialog>
```

## Props

| Prop               | Type                                                        | Default                         | Description                                     |
| ------------------ | ----------------------------------------------------------- | ------------------------------- | ----------------------------------------------- |
| `modelValue`       | `boolean`                                                   | **Required**                    | Controls dialog visibility (v-model)            |
| `title`            | `string`                                                    | `undefined`                     | Dialog title                                    |
| `subtitle`         | `string`                                                    | `undefined`                     | Dialog subtitle (below title)                   |
| `icon`             | `string`                                                    | `undefined`                     | Material Design Icon (e.g., 'mdi-currency-usd') |
| `iconColor`        | `string`                                                    | `'primary'`                     | Icon color                                      |
| `iconBgColor`      | `string`                                                    | `'white'`                       | Icon background color                           |
| `iconSize`         | `number`                                                    | `48`                            | Icon avatar size in pixels                      |
| `maxWidth`         | `string \| number`                                          | `800`                           | Maximum dialog width                            |
| `elevation`        | `number`                                                    | `8`                             | Dialog elevation (shadow depth)                 |
| `persistent`       | `boolean`                                                   | `false`                         | Prevent closing by clicking outside             |
| `scrollable`       | `boolean`                                                   | `true`                          | Enable content scrolling                        |
| `showCloseButton`  | `boolean`                                                   | `true`                          | Show close button in header                     |
| `closeButtonColor` | `string`                                                    | `'grey-darken-1'`               | Close button color                              |
| `showActions`      | `boolean`                                                   | `true`                          | Show action buttons footer                      |
| `closeText`        | `string`                                                    | `t('common.close')`             | Close button text                               |
| `closeColor`       | `string`                                                    | `'grey-darken-1'`               | Close button color                              |
| `closeVariant`     | `'text' \| 'flat' \| 'outlined' \| 'tonal' \| 'elevated'`   | `'outlined'`                    | Close button variant                            |
| `buttonSize`       | `'x-small' \| 'small' \| 'default' \| 'large' \| 'x-large'` | `'default'`                     | Button size                                     |
| `headerClass`      | `string`                                                    | `'bg-gradient'`                 | Custom header CSS class                         |
| `headerStyle`      | `string`                                                    | `undefined`                     | Custom header inline style                      |
| `titleClass`       | `string`                                                    | `'text-white font-weight-bold'` | Custom title CSS class                          |
| `subtitleClass`    | `string`                                                    | `'text-white'`                  | Custom subtitle CSS class                       |
| `contentClass`     | `string`                                                    | `''`                            | Custom content CSS class                        |
| `contentStyle`     | `string`                                                    | `undefined`                     | Custom content inline style                     |
| `actionsClass`     | `string`                                                    | `'bg-surface-variant'`          | Custom actions CSS class                        |

## Slots

| Slot       | Description                                           |
| ---------- | ----------------------------------------------------- |
| `default`  | Main content area                                     |
| `icon`     | Custom icon (replaces default icon)                   |
| `title`    | Custom title (replaces title prop)                    |
| `subtitle` | Custom subtitle (replaces subtitle prop)              |
| `badge`    | Status badge area (next to title)                     |
| `actions`  | Custom action buttons (replaces default close button) |

## Events

| Event               | Payload   | Description                            |
| ------------------- | --------- | -------------------------------------- |
| `update:modelValue` | `boolean` | Emitted when dialog visibility changes |
| `close`             | -         | Emitted when dialog is closed          |

## Styling

### Custom Content Styles

```vue
<template>
  <AppDetailsDialog v-model="isOpen" title="Details">
    <div class="custom-content">
      <div class="detail-item">
        <div class="detail-label">Name</div>
        <div class="detail-value">John Doe</div>
      </div>
    </div>
  </AppDetailsDialog>
</template>

<style scoped>
.custom-content {
  padding: 16px;
}

.detail-item {
  padding: 12px;
  border-radius: 8px;
  background-color: rgba(var(--v-theme-surface-variant), 0.2);
  margin-bottom: 12px;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface-variant));
  text-transform: uppercase;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 1rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
}
</style>
```

### Remove Default Actions

```vue
<AppDetailsDialog
  v-model="isOpen"
  title="Details"
  :show-actions="false"
  show-close-button
>
  <!-- Content without footer actions -->
</AppDetailsDialog>
```

### Custom Theme Colors

```vue
<AppDetailsDialog
  v-model="isOpen"
  title="Success"
  icon="mdi-check-circle"
  icon-color="white"
  icon-bg-color="success"
  header-class="bg-success"
  title-class="text-white"
>
  <!-- Content -->
</AppDetailsDialog>
```

## Real-World Example

See `app/pages/currency/index.vue` for a complete implementation example with:

- Quick view modal
- Formatted currency details
- Status badges
- Action buttons
- Navigation to full details page

## Accessibility

- Keyboard navigation supported
- Focus management
- ARIA labels on buttons
- Screen reader friendly

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Notes

- Component auto-imports in Nuxt 3
- Uses Vuetify 3 components
- Supports i18n for button labels
- RTL-aware layout
- Responsive design for mobile
