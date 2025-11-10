/**
 * i18n Client Plugin - SPA Mode with localStorage
 * ────────────────────────────────────────────────────────
 * Initializes i18n locale from localStorage on app startup
 */
export default defineNuxtPlugin({
  name: 'i18n-localStorage',
  parallel: false,
  setup(nuxtApp) {
    const defaultLocale = "ar";

    if (import.meta.client) {
      const savedLocale = localStorage.getItem("i18n_locale") as "ar" | "en" | null;
      
      // Set default if not saved
      if (!savedLocale) {
        localStorage.setItem("i18n_locale", defaultLocale);
      }

      // Wait for i18n to be ready and set locale
      nuxtApp.hook('app:created', () => {
        const i18n = nuxtApp.$i18n as any;
        const targetLocale = savedLocale || defaultLocale;
        
        if (i18n && targetLocale !== i18n.locale.value) {
          i18n.locale.value = targetLocale;
        }
      });
    }
  }
});
