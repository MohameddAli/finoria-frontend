// composables/useLanguage.ts
import { useLocale } from "vuetify";

export type SupportedLocale = "ar" | "en";

export const useLanguage = () => {
  const { locale, setLocale, t } = useI18n();
  const vuetifyLocale = useLocale();
  const appStore = useAppStore();

  const currentLocale = computed<SupportedLocale>(
    () => locale.value as SupportedLocale
  );
  const direction = computed(() => t("_meta.direction"));
  const isRTL = computed(() => direction.value === "rtl");
  const isArabic = computed(() => currentLocale.value === "ar");

  const changeLanguage = async (newLocale: SupportedLocale) => {
    if (!["ar", "en"].includes(newLocale) || locale.value === newLocale) return;

    try {
      // 1. حدّث i18n (هذا اللي فعليًا يغير لغة الترجمة ويعرف كل المشروع)
      await setLocale(newLocale);

      // 2. خزّن الاختيار في localStorage
      if (import.meta.client) {
        localStorage.setItem("i18n_locale", newLocale);
      }

      // 3. مزامنة Vuetify / Store
      vuetifyLocale.current.value = newLocale;
      appStore.setLocale(newLocale);

      // 4. تحديث DOM attributes
      if (import.meta.client) {
        const html = document.documentElement;
        html.setAttribute("lang", newLocale);
        html.setAttribute("dir", newLocale === "ar" ? "rtl" : "ltr");
        html.classList.toggle("v-locale--is-rtl", newLocale === "ar");

        // إضافة/إزالة class rtl من body
        if (newLocale === "ar") {
          document.body.classList.add("rtl");
        } else {
          document.body.classList.remove("rtl");
        }
      }

      console.log(`✅ تم تبديل اللغة: ${newLocale}`);
    } catch (error) {
      console.error("❌ خطأ في تبديل اللغة:", error);
    }
  };

  const toggleLanguage = () => {
    changeLanguage(currentLocale.value === "ar" ? "en" : "ar");
  };

  return {
    currentLocale,
    direction,
    isRTL,
    isArabic,
    changeLanguage,
    toggleLanguage,
    locale,
    t,
  };
};
