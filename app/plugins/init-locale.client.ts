/**
 * Initialize locale from localStorage (Client-side only - SPA mode)
 * تهيئة اللغة من localStorage عند تحميل التطبيق
 * 
 * Note: This runs after i18n.client.ts due to alphabetical ordering
 */
export default defineNuxtPlugin({
  name: 'init-locale',
  dependsOn: ['i18n:plugin'], // Ensure i18n is loaded first
  setup(nuxtApp) {
    const defaultLocale = "ar";

    if (import.meta.client) {
      // Read saved locale from localStorage
      const savedLocale = localStorage.getItem("i18n_locale") as "ar" | "en" | null;

      // If no saved locale, set default and save it
      if (!savedLocale) {
        localStorage.setItem("i18n_locale", defaultLocale);
      }

      // Use nuxtApp's i18n instance safely
      const i18n = nuxtApp.$i18n as any;
      if (i18n && savedLocale && savedLocale !== i18n.locale.value) {
        i18n.locale.value = savedLocale;
      }
    }
  }
});
