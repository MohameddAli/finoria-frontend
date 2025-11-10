# Theme System Documentation

## Overview

This project implements a comprehensive theme system with:

1. **Multiple Color Themes**: Gold (default), Blue, Red
2. **Light/Dark Modes**: Each theme supports both light and dark variations
3. **Vuetify Integration**: Full compatibility with all Vuetify components
4. **Centralized Color Management**: All colors defined in one place

## Theme Structure

```
app/theme/
├── colors.ts          # Base color definitions for all themes
├── themes.ts          # Vuetify theme definitions
└── README.md          # This documentation
```

## Available Themes

### Gold Theme (Default)
- Primary: `#B8860B`
- Secondary: `#A67C00`
- Hover: `#C9971A`

### Blue Theme
- Primary: `#1E88E5`
- Secondary: `#1565C0`
- Hover: `#2196F3`

### Red Theme
- Primary: `#C62828`
- Secondary: `#8E0000`
- Hover: `#D32F2F`

## Usage

### Setting a Theme

```typescript
const { setTheme } = useAppTheme()

// Set to gold theme (default)
setTheme('gold')

// Set to blue theme
setTheme('blue')

// Set to red theme
setTheme('red')
```

### Toggling Light/Dark Mode

```typescript
const { toggleMode, setMode } = useAppTheme()

// Toggle between light and dark
toggleMode()

// Set specific mode
setMode('light')
setMode('dark')
setMode('system') // Follow system preference
```

### Using Colors in Components

All Vuetify components automatically use the current theme colors:

```vue
<template>
  <!-- These will automatically use the current theme colors -->
  <v-btn color="primary">Primary Button</v-btn>
  <v-btn color="secondary">Secondary Button</v-btn>
  <v-card color="surface">Card with surface color</v-card>
</template>
```

### Using Colors in CSS

Use Vuetify's CSS variables for custom styling:

```css
.my-element {
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.my-element:hover {
  background-color: rgb(var(--v-theme-primary-darken-1));
}
```

## Adding New Themes

1. Add color definitions to `app/theme/colors.ts`
2. Add theme definitions to `app/theme/themes.ts`
3. Update the theme selector component if needed

## Technical Implementation

### Color Definitions

Colors are defined in `app/theme/colors.ts` with separate definitions for light and dark modes.

### Vuetify Integration

Themes are converted to Vuetify ThemeDefinition objects in `app/theme/themes.ts` and registered in `app/plugins/vuetify.ts`.

### Theme Persistence

Themes are stored in localStorage and restored on page load.

### Reactivity

The theme system is fully reactive - changing themes updates all components automatically.