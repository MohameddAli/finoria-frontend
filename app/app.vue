<template>
  <NuxtLayout>
    <!-- 
      Global Loading Overlay - يظهر فقط للصفحات خارج الداشبورد
      Dashboard pages have their own loading in dashboard.vue layout 
    -->
    <LoadingOverlay
      v-if="!isDashboardRoute && loadingStore.loadingType === 'overlay'"
    />
    <LoadingProgressBar
      v-if="!isDashboardRoute && loadingStore.loadingType === 'progressbar'"
    />

    <!-- 🍞 Global Toast System - New Unified Toast -->
    <ToastHost />

    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import LoadingOverlay from "~/components/ui/LoadingOverlay.vue";
import LoadingProgressBar from "~/components/ui/LoadingProgressBar.vue";
import { useLocale as useVuetifyLocale } from "vuetify";
import { useLoadingStore } from "~/stores/loading";

/**
 * 🌐 Root App Component
 * ────────────────────────────────────────────────────────
 *
 * المسؤوليات:
 * - ضبط HTML attributes (lang, dir) بناءً على i18n locale
 * - i18n locale هو المصدر الوحيد للحقيقة (Client-side only)
 * - التزامن التلقائي مع أي تغيير في اللغة
 * - إدارة Loading للصفحات خارج الداشبورد
 *
 * لتغيير نوع Loading:
 * - للصفحات العامة: loadingStore.setLoadingType('overlay' | 'progressbar' | 'none')
 * - للداشبورد: loadingStore.setDashboardLoadingType('overlay' | 'progressbar' | 'none')
 */

const { locale, setLocale } = useI18n();
const appStore = useAppStore();
const loadingStore = useLoadingStore();
const vuetifyLocale = useVuetifyLocale();
const route = useRoute();

// ═══════════════════════════════════════════════════════════════════════════
// 🎛️ إعدادات Loading - Loading Configuration (المكان الوحيد للتحكم!)
// ═══════════════════════════════════════════════════════════════════════════
//
// � الخيارات المتاحة: 'overlay' | 'progressbar' | 'none'
//
//    overlay      → غطاء كامل مع spinner (للعمليات المهمة)
//    progressbar  → شريط تقدم في الأعلى (أقل إزعاجاً)
//    none         → بدون مؤشر تحميل
//
// ═══════════════════════════════════════════════════════════════════════════

// 🎯 غيّر هنا فقط - Change only here:
const LOADING_CONFIG = {
  dashboard: "progressbar", // نوع Loading للداشبورد
  general: "overlay", // نوع Loading للصفحات العامة
} as const;

// ═══════════════════════════════════════════════════════════════════════════

onMounted(() => {
  // تطبيق الإعدادات - Apply configuration
  loadingStore.setDashboardLoadingType(LOADING_CONFIG.dashboard);
  loadingStore.setLoadingType(LOADING_CONFIG.general);
});

// فحص إذا كان الـ route الحالي من صفحات الداشبورد
const isDashboardRoute = computed(() => {
  // الصفحات التي تستخدم dashboard layout
  return (
    route.meta?.layout === "dashboard" || route.path.startsWith("/dashboard")
  );
});

// قراءة اللغة من localStorage (SPA mode)
if (import.meta.client) {
  const savedLocale = localStorage.getItem("i18n_locale") as "ar" | "en" | null;
  if (savedLocale && savedLocale !== locale.value) {
    await setLocale(savedLocale);
  }
}

// مزامنة تلقائية عند تغيير اللغة
watch(
  locale,
  (newLocale) => {
    // Sync Pinia Store
    if (appStore.currentLocale !== newLocale) {
      appStore.currentLocale = newLocale;
    }

    // Sync Vuetify locale
    try {
      vuetifyLocale.current.value = newLocale;
    } catch {
      // ignore
    }

    // Save to localStorage for persistence
    if (import.meta.client) {
      localStorage.setItem("i18n_locale", newLocale);
    }

    // Sync DOM attributes
    if (import.meta.client) {
      const html = document.documentElement;
      html.setAttribute("lang", newLocale);
      html.setAttribute("dir", newLocale === "ar" ? "rtl" : "ltr");
      // Ensure teleports (dialogs/menus) inherit directional styles
      html.classList.toggle("v-locale--is-rtl", newLocale === "ar");

      // إضافة/إزالة class rtl من body (للتوافق مع الأنماط القديمة)
      if (newLocale === "ar") {
        document.body.classList.add("rtl");
      } else {
        document.body.classList.remove("rtl");
      }
    }
  },
  { immediate: true }
);

// ضبط HTML attributes بناءً على locale (for SSR)
useHead({
  htmlAttrs: {
    lang: () => locale.value,
    dir: () => (locale.value === "ar" ? "rtl" : "ltr"),
  },
});
</script>
