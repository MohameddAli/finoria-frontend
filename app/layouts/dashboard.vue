<template>
  <v-app class="app-layout">
    <!-- Loading للداشبورد فقط - Dashboard Loading Only -->
    <LoadingProgressBar
      v-if="loadingStore.dashboardLoadingType === 'progressbar'"
    />
    <LoadingOverlay v-if="loadingStore.dashboardLoadingType === 'overlay'" />

    <!-- App Header -->
    <AppHeader />

    <!-- App Sidebar -->
    <AppSidebar :items="appStore.filteredNavigationItems" />

    <!-- Main Content Area -->
    <v-main class="main-content">
      <v-container
        fluid
        class="main-container"
        :class="{
          'main-container-mobile': mobile,
          'main-container-mini': !mobile && appStore.sidebarMini,
        }"
      >
        <!-- Breadcrumbs -->
        <div
          v-if="showBreadcrumbs"
          class="breadcrumbs-container mb-4"
          :dir="locale === 'ar' ? 'rtl' : 'ltr'"
        >
          <v-breadcrumbs
            :items="breadcrumbItems"
            class="pa-0"
            density="compact"
          >
            <template #prepend>
              <v-icon size="16" class="me-2">mdi-home</v-icon>
            </template>
            <template #item="{ item }">
              <v-breadcrumbs-item
                :to="item.to"
                :disabled="item.disabled"
                class="breadcrumb-item"
              >
                {{ item.title }}
              </v-breadcrumbs-item>
            </template>
            <template #divider>
              <v-icon size="14">{{ chevronDivider }}</v-icon>
            </template>
          </v-breadcrumbs>
        </div>

        <!-- Page Content -->
        <div class="page-content">
          <div :key="route.path" class="page-wrapper">
            <!-- Page Header -->
            <!-- <div v-if="pageTitle" class="page-header mb-6">
                <h1 class="page-title text-h4 font-weight-bold mb-2">
                  {{ pageTitle }}
                </h1>
                <p
                  v-if="pageSubtitle"
                  class="page-subtitle text-body-1 text-medium-emphasis"
                >
                  {{ pageSubtitle }}
                </p>
              </div> -->

            <!-- Slot for page content -->
            <div class="content-area">
              <slot />
            </div>
          </div>
        </div>
      </v-container>

      <!-- Scroll to Top Button -->
      <v-fab
        v-show="showScrollTop"
        icon="mdi-chevron-up"
        location="bottom end"
        size="small"
        color="primary"
        class="scroll-top-btn"
        :aria-label="$t('common.scrollToTop')"
        @click="scrollToTop"
      />
    </v-main>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top right"
      class="app-snackbar"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ snackbar.icon }}</v-icon>
        {{ snackbar.message }}
      </div>
      <template #actions>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="snackbar.show = false"
        />
      </template>
    </v-snackbar>

    <!-- Global Search Lightbox -->
    <SearchLightbox :items="globalSearchItems" @submit="handleGlobalSearch" />

    <!-- AI Chatbot Components -->
    <AIChatbotFAB />
    <AIChatbotDialog v-model="chatStore.isOpen" />
  </v-app>
</template>

<script setup lang="ts">
import { useDisplay, useLocale } from "vuetify";
import SearchLightbox from "~/components/SearchLightbox.vue";
import LoadingProgressBar from "~/components/ui/LoadingProgressBar.vue";
import LoadingOverlay from "~/components/ui/LoadingOverlay.vue";
import AIChatbotFAB from "~/components/chatbot/AIChatbotFAB.vue";
import AIChatbotDialog from "~/components/chatbot/AIChatbotDialog.vue";
import { useAppStore } from "~/stores/app";
import { useLoadingStore } from "~/stores/loading";
import { useChatStore } from "~/stores/chat";

/**
 * 🔒 Dashboard Layout
 * ────────────────────────────────────────────────────────
 * هذا الـ layout محمي تلقائياً بواسطة auth.global middleware
 * أي صفحة تستخدم layout: 'dashboard' ستكون محمية تلقائياً
 * لا حاجة لإضافة middleware في كل صفحة
 *
 * يدعم ثلاثة أنواع من Loading:
 * - overlay: غطاء كامل مع spinner
 * - progressbar: شريط تقدم في أعلى الصفحة
 * - none: بدون مؤشر تحميل
 */

// Composables
const { mobile } = useDisplay();
const appStore = useAppStore();
const loadingStore = useLoadingStore();
const chatStore = useChatStore();
const route = useRoute();
const { t, locale } = useI18n();
const { current } = useLocale();
const { getDirectionalIcon } = useRTL();
const chevronDivider = getDirectionalIcon(
  "mdi-chevron-right",
  "mdi-chevron-left"
);

// State
const showScrollTop = ref(false);
const snackbar = reactive({
  show: false,
  message: "",
  color: "success",
  timeout: 4000,
  icon: "mdi-check-circle",
});

// Example global search items (can be replaced per page via provide/inject later)
const globalSearchItems = computed(() => [
  { id: "home", title: t("navigation.home"), icon: "mdi-home", to: "/" },
  {
    id: "settings",
    title: t("navigation.settings", "Settings"),
    icon: "mdi-cog",
    to: "/settings",
  },
]);

// Computed properties
// const pageTitle = computed(() => {
//   return route.meta?.title ? t(String(route.meta.title)) : "";
// });

// const pageSubtitle = computed(() => {
//   return route.meta?.subtitle ? t(String(route.meta.subtitle)) : "";
// });

const showBreadcrumbs = computed(() => {
  return route.meta?.breadcrumbs !== false && route.path !== "/";
});

const breadcrumbItems = computed(() => {
  const items = [
    {
      title: t("navigation.home"),
      to: "/",
      disabled: false,
    },
  ];

  // Generate breadcrumbs from route path
  const pathSegments = route.path.split("/").filter((segment) => segment);
  let currentPath = "";

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;

    items.push({
      title: t(`navigation.${segment}`, segment),
      to: isLast ? currentPath : currentPath,
      disabled: isLast,
    });
  });

  return items;
});

// Methods
const scrollToTop = () => {
  if (import.meta.client) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};

const showNotification = (
  message = "",
  color = "success",
  icon = "mdi-check-circle"
) => {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.icon = icon;
  snackbar.show = true;
};

const handleGlobalSearch = (value = "") => {
  if (!value?.trim()) return;
  appStore.closeSearch();
};

// Scroll event handler
const handleScroll = () => {
  if (import.meta.client) {
    showScrollTop.value = window.scrollY > 300;
  }
};

// Lifecycle
onMounted(() => {
  if (import.meta.client) {
    window.addEventListener("scroll", handleScroll, { passive: true });
  }
  appStore.initializeApp();
  // مزامنة Vuetify locale/RTL فور بدء التشغيل لتفادي قلب السايدبار لحظياً
  try {
    current.value = locale.value;
  } catch {
    /* ignore: safe on hydration */
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("scroll", handleScroll);
  }
});

// Watch for route changes to scroll to top
// watch(locale, (code) => {
//   try {
//     current.value = code;
//   } catch {
//     /* ignore: safe on hydration */
//   }
// });

watch(
  () => route.path,
  () => {
    nextTick(() => {
      if (import.meta.client) window.scrollTo(0, 0);
    });
  }
);

// Provide notification function to child components
provide("showNotification", showNotification);

// SEO and meta tags
// useHead({
//   titleTemplate: (title) => {
//     const baseTitle = t("app.title");
//     return title ? `${title} - ${baseTitle}` : baseTitle;
//   },
//   meta: [
//     { name: "description", content: t("app.description") },
//     { name: "viewport", content: "width=device-width, initial-scale=1" },
//     { name: "theme-color", content: "#1976D2" },
//   ],
// });
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.main-content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-container {
  padding: 24px;
  max-width: 100%;
  min-height: calc(100vh - 72px);
  margin-left: 0;
  transition: margin-left 0.3s ease;
}

.main-container-mobile {
  padding: 16px;
}

.main-container-mini {
  margin-left: 0;
}

.breadcrumbs-container {
  background: rgba(var(--v-theme-surface), 0.7);
  border-radius: 12px;
  padding: 12px 16px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.breadcrumb-item {
  font-weight: 500;
  transition: color 0.2s ease;
}

.breadcrumb-item:hover {
  color: rgb(var(--v-theme-primary));
}

.page-content {
  position: relative;
}

.page-header {
  text-align: start;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding-bottom: 16px;
}

.page-title {
  color: rgb(var(--v-theme-on-background));
  line-height: 1.2;
}

.page-subtitle {
  max-width: 600px;
}

.content-area {
  position: relative;
  z-index: 1;
}

.scroll-top-btn {
  position: fixed !important;
  bottom: 24px;
  inset-inline-end: 24px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;
}

.scroll-top-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(var(--v-theme-primary), 0.4);
}

.app-snackbar {
  z-index: 9998;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .main-container {
    padding: 12px;
  }

  .page-header {
    margin-bottom: 16px;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .scroll-top-btn {
    bottom: 16px;
    inset-inline-end: 16px;
  }
}

@media (max-width: 960px) {
  .breadcrumbs-container {
    padding: 8px 12px;
  }
}

/* Print styles */
@media print {
  .scroll-top-btn,
  .app-snackbar {
    display: none !important;
  }

  .main-container {
    padding: 0;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .breadcrumbs-container {
    border: 2px solid rgb(var(--v-theme-on-surface));
  }

  .page-header {
    border-bottom: 2px solid rgb(var(--v-theme-on-surface));
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .main-content,
  .scroll-top-btn,
  .breadcrumb-item {
    transition: none;
  }

  .scroll-top-btn:hover {
    transform: none;
  }
}

/* Focus styles for accessibility */
.scroll-top-btn:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Custom scrollbar */
:deep(.v-main) {
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--v-theme-on-surface), 0.2) transparent;
}

:deep(.v-main)::-webkit-scrollbar {
  width: 8px;
}

:deep(.v-main)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.v-main)::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-on-surface), 0.2);
  border-radius: 4px;
}

:deep(.v-main)::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--v-theme-on-surface), 0.3);
}
</style>
