import type { ThemeDefinition } from 'vuetify'

// 1. Unified Color Definitions
// All theme colors are now defined in this single file.
const themeColors = {
  gold: {
    light: {
      primary: '#B8860B',
      secondary: '#A67C00',
      'primary-hover': '#A67C00',
      accent: '#0f172a',
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FF9800',
      info: '#2196F3',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      'surface-variant': '#E7E0EC',
      'on-primary': '#FFFFFF',
      'on-secondary': '#FFFFFF',
      'on-surface': '#1C1B1F',
      'on-surface-variant': '#49454F',
      'outline': '#79747E',
      'outline-variant': '#CAC4D0',
    },
    dark: {
      primary: '#DAA520',
      secondary: '#C9971A',
      'primary-hover': '#F0C649',
      accent: '#f8fafc',
      success: '#81C784',
      error: '#EF5350',
      warning: '#FFB74D',
      info: '#64B5F6',
      background: '#0B0B0F',
      surface: '#121212',
      'surface-variant': '#1C1B1F',
      'on-primary': '#000000',
      'on-secondary': '#000000',
      'on-surface': '#E6E1E5',
      'on-surface-variant': '#CAC4D0',
      'outline': '#938F99',
      'outline-variant': '#49454F',
    },
  },
  blue: {
    light: {
      primary: '#1E88E5',
      secondary: '#1565C0',
      'primary-hover': '#1976D2',
      accent: '#0f172a',
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FF9800',
      info: '#2196F3',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      'surface-variant': '#E7E0EC',
      'on-primary': '#FFFFFF',
      'on-secondary': '#FFFFFF',
      'on-surface': '#1C1B1F',
      'on-surface-variant': '#49454F',
      'outline': '#79747E',
      'outline-variant': '#CAC4D0',
    },
    dark: {
      primary: '#64B5F6',
      secondary: '#2196F3',
      'primary-hover': '#90CAF9',
      accent: '#f8fafc',
      success: '#81C784',
      error: '#EF5350',
      warning: '#FFB74D',
      info: '#90CAF9',
      background: '#0B0B0F',
      surface: '#121212',
      'surface-variant': '#1C1B1F',
      'on-primary': '#000000',
      'on-secondary': '#000000',
      'on-surface': '#E6E1E5',
      'on-surface-variant': '#CAC4D0',
      'outline': '#938F99',
      'outline-variant': '#49454F',
    },
  },
  red: {
    light: {
      primary: '#C62828',
      secondary: '#AE2222',
      'primary-hover': '#B71C1C',
      accent: '#0f172a',
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FF9800',
      info: '#2196F3',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      'surface-variant': '#E7E0EC',
      'on-primary': '#FFFFFF',
      'on-secondary': '#FFFFFF',
      'on-surface': '#1C1B1F',
      'on-surface-variant': '#49454F',
      'outline': '#79747E',
      'outline-variant': '#CAC4D0',
    },
    dark: {
      primary: '#E57373',
      secondary: '#EF5350',
      'primary-hover': '#F44336',
      accent: '#f8fafc',
      success: '#81C784',
      error: '#EF5350',
      warning: '#FFB74D',
      info: '#64B5F6',
      background: '#0B0B0F',
      surface: '#121212',
      'surface-variant': '#1C1B1F',
      'on-primary': '#FFFFFF',
      'on-secondary': '#FFFFFF',
      'on-surface': '#E6E1E5',
      'on-surface-variant': '#CAC4D0',
      'outline': '#938F99',
      'outline-variant': '#49454F',
    },
  },
};
// 2. Theme Definitions
// These now consume the `themeColors` object defined above.
const goldTheme = {
  light: {
    dark: false,
    colors: {
      ...themeColors.gold.light
    },
    variables: {
      'border-color': '#E7E0EC',
      'shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
      'shadow-md': '0 4px 12px rgba(0, 0, 0, 0.1)',
      'shadow-lg': '0 8px 32px rgba(0, 0, 0, 0.12)',
      'shadow-xl': '0 16px 48px rgba(0, 0, 0, 0.15)',
    }
  } satisfies ThemeDefinition,
  dark: {
    dark: true,
    colors: {
      ...themeColors.gold.dark
    },
    variables: {
      'border-color': '#1C1B1F',
      'shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.3)',
      'shadow-md': '0 4px 12px rgba(0, 0, 0, 0.3)',
      'shadow-lg': '0 8px 32px rgba(0, 0, 0, 0.4)',
      'shadow-xl': '0 16px 48px rgba(0, 0, 0, 0.5)',
    }
  } satisfies ThemeDefinition
}

export const blueTheme = {
  light: {
    dark: false,
    colors: {
      ...themeColors.blue.light
    },
    variables: {
      'border-color': '#E7E0EC',
      'shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
      'shadow-md': '0 4px 12px rgba(0, 0, 0, 0.1)',
      'shadow-lg': '0 8px 32px rgba(0, 0, 0, 0.12)',
      'shadow-xl': '0 16px 48px rgba(0, 0, 0, 0.15)',
    }
  } satisfies ThemeDefinition,
  dark: {
    dark: true,
    colors: {
      ...themeColors.blue.dark
    },
    variables: {
      'border-color': '#1C1B1F',
      'shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.3)',
      'shadow-md': '0 4px 12px rgba(0, 0, 0, 0.3)',
      'shadow-lg': '0 8px 32px rgba(0, 0, 0, 0.4)',
      'shadow-xl': '0 16px 48px rgba(0, 0, 0, 0.5)',
    }
  } satisfies ThemeDefinition
}

export const redTheme = {
  light: {
    dark: false,
    colors: {
      ...themeColors.red.light
    },
    variables: {
      'border-color': '#E7E0EC',
      'shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
      'shadow-md': '0 4px 12px rgba(0, 0, 0, 0.1)',
      'shadow-lg': '0 8px 32px rgba(0, 0, 0, 0.12)',
      'shadow-xl': '0 16px 48px rgba(0, 0, 0, 0.15)',
    }
  } satisfies ThemeDefinition,
  dark: {
    dark: true,
    colors: {
      ...themeColors.red.dark
    },
    variables: {
      'border-color': '#1C1B1F',
      'shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.3)',
      'shadow-md': '0 4px 12px rgba(0, 0, 0, 0.3)',
      'shadow-lg': '0 8px 32px rgba(0, 0, 0, 0.4)',
      'shadow-xl': '0 16px 48px rgba(0, 0, 0, 0.5)',
    }
  } satisfies ThemeDefinition
}

// Export all themes in a structure that Vuetify can use
export const themes = {
  gold: goldTheme,
  blue: blueTheme,
  red: redTheme
}