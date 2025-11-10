export const useAppTheme = () => {
  // Get current theme mode (light/dark) from localStorage or default to light
  const currentMode = ref<'light' | 'dark'>('light')
  
  // Get current theme (gold, blue, red) from localStorage or default to gold
  const currentTheme = ref<'gold' | 'blue' | 'red'>('gold')

  // Initialize from localStorage on client side
  if (process.client) {
    const savedMode = localStorage.getItem('theme-mode')
    if (savedMode === 'dark' || savedMode === 'light') {
      currentMode.value = savedMode
    }
    
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'gold' || savedTheme === 'blue' || savedTheme === 'red') {
      currentTheme.value = savedTheme
    }
  }

  // Computed property for isDark
  const isDark = computed(() => currentMode.value === 'dark')

  const toggle = () => {
    currentMode.value = currentMode.value === 'dark' ? 'light' : 'dark'
    if (process.client) {
      localStorage.setItem('theme-mode', currentMode.value)
      // Dispatch event to update Vuetify theme
      window.dispatchEvent(new CustomEvent('theme-mode-change', { detail: currentMode.value }))
    }
  }

  const setTheme = (theme: 'gold' | 'blue' | 'red') => {
    currentTheme.value = theme
    if (process.client) {
      localStorage.setItem('theme', theme)
      // Update Vuetify theme by triggering a watch effect
      window.dispatchEvent(new CustomEvent('theme-change', { detail: theme }))
    }
  }

  const setMode = (mode: 'light' | 'dark') => {
    // Only allow light or dark mode
    if (mode === 'light' || mode === 'dark') {
      currentMode.value = mode
      if (process.client) {
        localStorage.setItem('theme-mode', mode)
        // Dispatch event to update Vuetify theme
        window.dispatchEvent(new CustomEvent('theme-mode-change', { detail: mode }))
      }
    }
  }

  const toggleMode = () => {
    setMode(currentMode.value === 'dark' ? 'light' : 'dark')
  }

  // Apply theme class to root element
  watch([isDark, currentTheme], ([dark, theme]) => {
    if (process.client) {
      const root = document.documentElement
      if (dark) {
        root.setAttribute('data-theme', 'dark')
        root.classList.add('dark-theme')
      } else {
        root.setAttribute('data-theme', 'light')
        root.classList.remove('dark-theme')
      }
      // Set theme attribute
      root.setAttribute('data-theme-name', theme)
    }
  }, { immediate: true })

  return { 
    isDark, 
    currentTheme,
    toggle, 
    setTheme,
    setMode,
    toggleMode
  }
}