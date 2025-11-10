// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import { en, ar as arLocale } from 'vuetify/locale'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { themes } from '../theme/themes'

export default defineNuxtPlugin((nuxtApp) => {
  // Build list of allowed names for validation
  const allowedThemes = ['gold', 'blue', 'red'] as const
  const allowedModes = ['light', 'dark'] as const



  // Get initial theme from localStorage or default to gold-light (validated)
  const getInitialTheme = () => {
    if (import.meta.client) {
      const rawTheme = localStorage.getItem('theme') || 'gold'
      const rawMode = localStorage.getItem('theme-mode') || 'light'
      const theme = allowedThemes.includes(rawTheme as any) ? rawTheme : 'gold'
      const mode = allowedModes.includes(rawMode as any) ? rawMode : 'light'
      return `${theme}-${mode}`
    }
    return 'gold-light'
  }

  // Create theme definitions for all themes
  const allThemes: Record<string, ThemeDefinition> = {}
  
  // Add light and dark versions for each theme
  Object.keys(themes).forEach(themeName => {
    allThemes[`${themeName}-light`] = themes[themeName as keyof typeof themes].light
    allThemes[`${themeName}-dark`] = themes[themeName as keyof typeof themes].dark
  })

  const vuetify: ReturnType<typeof createVuetify> = createVuetify({
    // Map RTL locales and messages so Vuetify flips layouts correctly when locale changes
    locale: {
      locale: 'ar',
      fallback: 'en',
      messages: { en, ar: arLocale },
      rtl: { ar: true },
    },
    theme: {
      defaultTheme: getInitialTheme(),
      themes: allThemes,
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi },
    },
    display: {
      mobileBreakpoint: 'sm',
      thresholds: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
    },
  })

  // Helper to safely set the current theme name if it exists, otherwise fallback
  const setSafeThemeName = (name: string) => {
    // We know our keys are of the form `${theme}-${mode}`
    const [theme, mode] = name.split('-')
    const safeTheme = allowedThemes.includes(theme as any) ? theme : 'gold'
    const safeMode = allowedModes.includes(mode as any) ? mode : 'light'
    const finalName = `${safeTheme}-${safeMode}`
    // Apply
    vuetify.theme.global.name.value = finalName
    return finalName
  }

  // Watch for theme changes and update Vuetify theme
  if (import.meta.client) {
    // Watch for theme mode changes
    const handleModeChange = (event: Event) => {
      const customEvent = event as CustomEvent
      const mode = customEvent.detail
      const currentTheme = localStorage.getItem('theme') || 'gold'
      setSafeThemeName(`${currentTheme}-${mode}`)
    }
    
    // Watch for theme color changes
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent
      const themeName = customEvent.detail
      const currentMode = localStorage.getItem('theme-mode') || 'light'
      setSafeThemeName(`${themeName}-${currentMode}`)
    }
    
    window.addEventListener('theme-mode-change', handleModeChange as EventListener)
    window.addEventListener('theme-change', handleThemeChange as EventListener)
  }

  nuxtApp.vueApp.use(vuetify)
  // RTL/LTR handled globally in app/app.vue via useHead
  
  // Make vuetify available globally
  return {
    provide: {
      vuetify
    }
  }
})