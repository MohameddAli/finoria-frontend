import { useLocale } from "vuetify";

export type SupportedLocale = "ar" | "en";

export const useLanguage = () => {
  const { locale, setLocale, t } = useI18n();
  const vuetifyLocale = useLocale();
  const appStore = useAppStore();

  const currentLocale = computed<SupportedLocale>(() => locale.value as SupportedLocale);
  const direction = computed(() => t("_meta.direction"));
  const isRTL = computed(() => direction.value === "rtl");
  const isArabic = computed(() => currentLocale.value === "ar");

  const changeLanguage = async (newLocale: SupportedLocale) => {
    if (!["ar", "en"].includes(newLocale) || locale.value === newLocale) return;

    try {
      await setLocale(newLocale);

      if (import.meta.client) {
        localStorage.setItem("i18n_locale", newLocale);
        const html = document.documentElement;
        html.setAttribute("lang", newLocale);
        html.setAttribute("dir", newLocale === "ar" ? "rtl" : "ltr");
        html.classList.toggle("v-locale--is-rtl", newLocale === "ar");
        document.body.classList.toggle("rtl", newLocale === "ar");
      }

      vuetifyLocale.current.value = newLocale;
      appStore.setLocale(newLocale);
    } catch (error) {
      console.error("Language change error:", error);
    }
  };

  const toggleLanguage = () => changeLanguage(currentLocale.value === "ar" ? "en" : "ar");

  return { currentLocale, direction, isRTL, isArabic, changeLanguage, toggleLanguage, locale, t };
};
