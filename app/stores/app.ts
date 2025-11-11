import { defineStore } from "pinia";

export interface NavigationItem {
  title: string;
  icon: string;
  to?: string;
  value?: string;
  children?: NavigationItem[];
  divider?: boolean;
  badge?: string | number;
  badgeColor?: string;
}

const getInitialLocale = (): string => {
  if (import.meta.client) {
    try {
      const saved = localStorage.getItem("locale");
      if (saved === "en" || saved === "ar") return saved;
    } catch {}
    const htmlLang = document.documentElement.getAttribute("lang");
    if (htmlLang === "en" || htmlLang === "ar") return htmlLang;
  }
  return "ar";
};

const toIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizeToIso = (value: string | Date | null | undefined): string | null => {
  if (!value) return null;
  return value instanceof Date ? toIsoDate(value) : value;
};

export const useAppStore = defineStore("app", () => {
  const sidebarOpen = ref(true);
  const sidebarMini = ref(false);
  const currentLocale = ref(getInitialLocale());
  const isLoading = ref(false);
  const isSearchOpen = ref(false);
  const dateRange = ref<{ start: string | null; end: string | null }>({ start: null, end: null });

  const navigationItems = ref<NavigationItem[]>([
    { title: "navigation.overview", icon: "mdi-view-dashboard", to: "/" },
    { title: "navigation.chat", icon: "mdi-chat", to: "/chat" },
    { title: "navigation.cards", icon: "mdi-credit-card", to: "/cards" },
    { title: "navigation.customers", icon: "mdi-account-group", to: "/customers" },
    { title: "navigation.companies", icon: "mdi-domain", to: "/companies" },
    { title: "navigation.currency", icon: "mdi-currency-usd", to: "/currency" },
    { title: "navigation.banks", icon: "mdi-bank", to: "/banks" },
    {
      title: "navigation.wallets",
      icon: "mdi-wallet",
      children: [
        { title: "navigation.walletHome", icon: "mdi-wallet-outline", to: "/wallets/home" },
        { title: "navigation.personal", icon: "mdi-account-outline", to: "/wallets/personal" },
        { title: "navigation.corporate", icon: "mdi-office-building-outline", to: "/wallets/corporate" },
        { title: "navigation.investment", icon: "mdi-trending-up", to: "/wallets/investment" },
      ],
    },
    {
      title: "navigation.orders",
      icon: "mdi-file-document",
      children: [{ title: "navigation.allChecks", icon: "mdi-file-document-outline", to: "/orders/all-checks" }],
    },
    { divider: true, title: "", icon: "" },
    { title: "navigation.printDemo", icon: "mdi-printer", to: "/print-demo" },
    { title: "navigation.printDialogDemo", icon: "mdi-printer-outline", to: "/examples/print-dialog-demo" },
    { title: "navigation.support", icon: "mdi-help-circle", to: "/support" },
    { title: "navigation.settings", icon: "mdi-cog", to: "/settings" },
  ]);

  const filteredNavigationItems = computed(() => navigationItems.value);

  const formattedDateRange = computed(() => {
    const { start, end } = dateRange.value;
    if (!start || !end) return "";
    const locale = currentLocale.value === "ar" ? "ar-EG" : "en-US";
    const formatter = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
    return `${formatter.format(new Date(start))} - ${formatter.format(new Date(end))}`;
  });

  const toggleSidebar = () => (sidebarOpen.value = !sidebarOpen.value);
  const toggleSidebarMini = () => (sidebarMini.value = !sidebarMini.value);
  const setSidebarOpen = (value: boolean) => (sidebarOpen.value = value);
  const setSidebarMini = (value: boolean) => (sidebarMini.value = value);
  const setLocale = (locale: string) => (currentLocale.value = locale);
  const setLoading = (loading: boolean) => (isLoading.value = loading);

  const setDateRange = (range: { start: string | Date | null; end: string | Date | null }) => {
    const startIso = normalizeToIso(range.start);
    const endIso = normalizeToIso(range.end);
    if (startIso && endIso) {
      const startDate = new Date(startIso);
      const endDate = new Date(endIso);
      const [minDate, maxDate] = startDate <= endDate ? [startDate, endDate] : [endDate, startDate];
      dateRange.value = { start: toIsoDate(minDate), end: toIsoDate(maxDate) };
    } else {
      dateRange.value = { start: startIso, end: endIso };
    }
    if (import.meta.client) localStorage.setItem("dateRange", JSON.stringify(dateRange.value));
  };

  const clearDateRange = () => {
    dateRange.value = { start: null, end: null };
    if (import.meta.client) localStorage.removeItem("dateRange");
  };

  const openSearch = () => (isSearchOpen.value = true);
  const closeSearch = () => (isSearchOpen.value = false);
  const toggleSearch = () => (isSearchOpen.value = !isSearchOpen.value);

  const initializeApp = () => {
    if (import.meta.client) {
      const savedLocale = localStorage.getItem("locale");
      if (savedLocale) currentLocale.value = savedLocale;

      const savedRange = localStorage.getItem("dateRange");
      if (savedRange) {
        try {
          const parsed = JSON.parse(savedRange) as { start?: string | null; end?: string | null };
          dateRange.value = { start: parsed?.start ?? null, end: parsed?.end ?? null };
        } catch {}
      }

      if (!dateRange.value.start || !dateRange.value.end) {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        dateRange.value = { start: toIsoDate(start), end: toIsoDate(end) };
        localStorage.setItem("dateRange", JSON.stringify(dateRange.value));
      }
    }
  };

  return {
    sidebarOpen,
    sidebarMini,
    currentLocale,
    isLoading,
    isSearchOpen,
    dateRange,
    navigationItems,
    filteredNavigationItems,
    formattedDateRange,
    toggleSidebar,
    toggleSidebarMini,
    setSidebarOpen,
    setSidebarMini,
    setLocale,
    setLoading,
    setDateRange,
    clearDateRange,
    openSearch,
    closeSearch,
    toggleSearch,
    initializeApp,
  };
});
