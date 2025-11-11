const PAGE_TRANSLATIONS: Record<string, Record<string, string>> = {
  ar: {
    index: "الصفحة الرئيسية",
    home: "الصفحة الرئيسية",
    overview: "نظرة عامة",
    analytics: "التحليلات",
    chat: "المحادثة",
    cards: "البطاقات",
    customers: "العملاء",
    support: "الدعم",
    settings: "الإعدادات",
    profile: "الملف الشخصي",
    users: "المستخدمون",
    reports: "التقارير",
    transactions: "المعاملات",
    wallets: "المحافظ",
    help: "المساعدة",
  },
  en: {
    index: "Home Page",
    home: "Home Page",
    overview: "Overview",
    analytics: "Analytics",
    chat: "Chat",
    cards: "Cards",
    customers: "Customers",
    support: "Support",
    settings: "Settings",
    profile: "Profile",
    users: "Users",
    reports: "Reports",
    transactions: "Transactions",
    wallets: "Wallets",
    help: "Help",
  },
};

const MIN_LOADING_TIME = 300;
const MAX_LOADING_TIME = 5000;

export default defineNuxtPlugin((nuxtApp) => {
  const loadingStore = useLoadingStore();
  const router = useRouter();

  let isNavigating = false;
  let loadingStartTime = 0;
  let navigationTimeout: ReturnType<typeof setTimeout> | null = null;

  const getCurrentLocale = (): string => {
    const i18n = (nuxtApp as any).$i18n;
    if (i18n?.locale?.value) return i18n.locale.value;
    if (import.meta.client) return document.documentElement.lang || "en";
    return "en";
  };

  const getPageName = (path: string): string => {
    const locale = getCurrentLocale();
    const segments = path.replace("/", "").split("?")[0]?.split("#")[0]?.split("/");
    const pageName = segments?.[0] || "index";
    const lang = locale === "ar" ? "ar" : "en";
    return PAGE_TRANSLATIONS[lang]?.[pageName] || pageName.charAt(0).toUpperCase() + pageName.slice(1);
  };

  const getLoadingMessage = (path: string): string => {
    const locale = getCurrentLocale();
    const pageName = getPageName(path);
    return locale === "ar" ? `جاري الانتقال إلى ${pageName}...` : `Navigating to ${pageName}...`;
  };

  const clearNavigationState = () => {
    if (navigationTimeout) clearTimeout(navigationTimeout), (navigationTimeout = null);
    isNavigating = false;
  };

  const finishLoading = () => {
    if (!isNavigating) return;
    const remaining = Math.max(0, MIN_LOADING_TIME - (Date.now() - loadingStartTime));
    setTimeout(() => {
      loadingStore.stopLoading("navigation");
      clearNavigationState();
    }, remaining);
  };

  const startNavigationLoading = (to: any) => {
    if (isNavigating) return;
    clearNavigationState();
    loadingStore.stopLoading();
    isNavigating = true;
    loadingStartTime = Date.now();
    loadingStore.startLoading({ id: "navigation", text: getLoadingMessage(to.path), type: "navigation" });
    navigationTimeout = setTimeout(() => {
      if (isNavigating) {
        console.warn("Navigation timeout");
        loadingStore.stopLoading("navigation");
        clearNavigationState();
      }
    }, MAX_LOADING_TIME);
  };

  router.beforeEach((to, from) => {
    if (to.path !== from.path) startNavigationLoading(to);
    return true;
  });

  nuxtApp.hook("page:finish", () => {
    if (isNavigating) finishLoading();
  });

  router.onError((error) => {
    console.error("Navigation error:", error);
    if (isNavigating) loadingStore.stopLoading("navigation"), clearNavigationState();
  });

  nuxtApp.hook("vue:error", (error, instance, info) => {
    console.error("Vue error:", error, info);
    if (isNavigating) loadingStore.stopLoading("navigation"), clearNavigationState();
  });

  nuxtApp.hook("app:error", (error) => {
    console.error("App error:", error);
    if (isNavigating) loadingStore.stopLoading("navigation"), clearNavigationState();
  });

  nuxtApp.hook("app:mounted", () => {
    loadingStore.stopLoading();
    clearNavigationState();
  });
});
