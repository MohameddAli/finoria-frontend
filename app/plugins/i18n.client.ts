export default defineNuxtPlugin({
  name: "i18n-localStorage",
  parallel: false,
  setup(nuxtApp) {
    const defaultLocale = "ar";

    if (import.meta.client) {
      try {
        const savedLocale = (localStorage.getItem("i18n_locale") as "ar" | "en") || defaultLocale;
        if (!localStorage.getItem("i18n_locale")) {
          localStorage.setItem("i18n_locale", defaultLocale);
        }

        nuxtApp.hook("app:created", () => {
          try {
            const i18n = nuxtApp.$i18n as any;
            if (i18n && savedLocale !== i18n.locale.value) {
              i18n.locale.value = savedLocale;
            }
          } catch (error) {
            console.error("Failed to set i18n locale:", error);
          }
        });
      } catch (error) {
        console.error("Failed to initialize i18n:", error);
      }
    }
  },
});
