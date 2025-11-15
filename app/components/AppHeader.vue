<template>
  <v-app-bar
    app
    elevation="0"
    height="72"
    class="app-header"
    color="surface"
    border="b"
  >
    <div
      class="header-content d-flex align-center justify-space-between w-100 px-4"
    >
      <!-- Left Section: Logo and Menu Toggle -->
      <div class="header-left d-flex align-center">
        <!-- Mobile Menu Toggle -->
        <v-btn
          v-if="mobile"
          icon
          variant="text"
          size="small"
          class="me-3"
          aria-label="فتح القائمة الجانبية"
          @click="appStore.toggleSidebar"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <!-- Logo -->
        <div class="logo-container d-flex align-center" role="banner">
          <div class="logo-icon">
            <v-icon size="32" color="primary" aria-hidden="true"
              >mdi-shield-check</v-icon
            >
          </div>
          <h2 class="logo-text ms-2 text-h5 font-weight-bold">Prime</h2>
        </div>
      </div>

      <!-- Center Section: Search (opens lightbox) -->
      <div class="header-center flex-grow-1 mx-4" style="max-width: 500px">
        <GlobalSearchInput
          v-model="searchQuery"
          class="search-field"
          :max-width="400"
          @open="() => appStore.openSearch()"
        />
      </div>

      <!-- Right Section: Actions and Profile -->
      <div class="header-right d-flex align-center">
        <!-- Download Button -->
        <!-- <v-btn
          variant="outlined"
          size="small"
          class="me-3 download-btn"
          prepend-icon="mdi-download"
          aria-label="تحميل البيانات"
        >
          {{ $t("common.download") }}
        </v-btn> -->

        <!-- Date Range Picker -->
        <!-- <div class="me-4">
          <DateRangePicker />
        </div> -->

        <!-- Notifications -->
        <NotificationsMenu
          class="me-2"
          :items="notifications"
          :count="notificationCount"
          :location="menuLocation"
          :offset="menuOffset"
          aria-label="الإشعارات"
          @select="handleNotificationSelect"
          @view-all="handleViewAllNotifications"
        />

        <!-- Theme Toggle (Separated from Theme Selector) -->
        <ThemeToggle class="me-2" />

        <!-- Theme Selector (Palette only) -->
        <ThemeSelector :location="menuLocation" :offset="menuOffset" />

        <!-- Language Toggle -->
        <v-menu
          :location="menuLocation"
          :offset="menuOffset"
          transition="fade-transition"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              size="small"
              class="me-2"
              aria-label="تغيير اللغة"
              aria-haspopup="true"
            >
              <v-icon>mdi-translate</v-icon>
            </v-btn>
          </template>
          <v-list density="compact" role="menu">
            <v-list-item @click="setLang('en')" role="menuitem">
              <v-list-item-title>English</v-list-item-title>
            </v-list-item>
            <v-list-item @click="setLang('ar')" role="menuitem">
              <v-list-item-title>العربية</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- User Profile -->
        <UserProfileMenu
          :location="menuLocation"
          :offset="menuOffset"
          :name="userName"
          :role="userRole"
          :avatar="userAvatar"
          :items="userMenuItems"
          @navigate="handleUserNavigate"
          @logout="Logout"
        />
      </div>
    </div>

    <!-- Notifications menu now handled above via activator -->
  </v-app-bar>
</template>

<script setup lang="ts">
import { useDisplay, useLocale } from "vuetify"
import { useAppStore } from "~/stores/app"
import { useAuthStore } from "~/stores/auth/storeAuth"
import { useAuthApi } from "~/composables/api/useAuthApi"

const { mobile } = useDisplay()
const vuetifyLocale = useLocale()
const appStore = useAppStore()
const authStore = useAuthStore()
const router = useRouter()
const { t, locale, setLocale: i18nSetLocale } = useI18n()

const searchQuery = ref("")
const notificationCount = ref(3)

const isArabic = computed(() => locale.value === "ar")
const menuLocation = computed(() => isArabic.value ? "bottom start" : "bottom end")
const menuOffset = computed<[number, number]>(() => [0, 8])

const userMenuItems = computed(() => [
  { title: t("navigation.profile"), icon: "mdi-account-outline", action: () => navigateTo("/profile") },
  { title: t("navigation.settings"), icon: "mdi-cog-outline", action: () => navigateTo("/settings") },
  { title: t("navigation.help"), icon: "mdi-help-circle-outline", action: () => navigateTo("/help") },
  { title: t("header.logout"), icon: "mdi-logout", action: () => Logout() },
])

const notifications = ref([
  { 
    id: 1, 
    title: "تم استلام طلب دعم مشروع جديد", 
    time: "منذ دقيقتين", 
    icon: "mdi-briefcase-check", 
    color: "success" 
  },
  { 
    id: 2, 
    title: "اكتمل تحديث ملف المشروع", 
    time: "منذ ساعة", 
    icon: "mdi-file-document-check", 
    color: "info" 
  },
  { 
    id: 3, 
    title: "تنبيه: يحتاج المشروع إلى مراجعة", 
    time: "منذ 3 ساعات", 
    icon: "mdi-alert", 
    color: "warning" 
  },
])


const userName = computed(() => authStore.admin?.name || "Guest")
const userRole = computed(() => authStore.admin?.email || "User")
const userAvatar = computed(() => "https://cdn.vuetifyjs.com/images/john.jpg")

const handleUserNavigate = (to: string) => navigateTo(to)
const handleNotificationSelect = () => {}
const handleViewAllNotifications = () => {}

const setLang = async (code: string) => {
  if ((code !== "en" && code !== "ar") || locale.value === code) return
  try {
    await i18nSetLocale(code)
    if (import.meta.client) {
      localStorage.setItem("i18n_locale", code)
      const html = document.documentElement
      html.setAttribute("lang", code)
      html.setAttribute("dir", code === "ar" ? "rtl" : "ltr")
      html.classList.toggle("v-locale--is-rtl", code === "ar")
      document.body.classList.toggle("rtl", code === "ar")
    }
    vuetifyLocale.current.value = code
    appStore.setLocale(code)
  } catch (error) {
    console.error("❌ خطأ في تبديل اللغة:", error)
  }
}

const Logout = async () => {
  try {
    useAuthApi().logout()
    authStore.clearAuth()
    await router.push("/auth/login")
  } catch (error) {
    console.error("❌ خطأ في تسجيل الخروج:", error)
  }
}
</script>

<style scoped>
.app-header {
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
}

.header-content {
  height: 100%;
}

.logo-container {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.logo-container:hover {
  opacity: 0.8;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #ffffff;
  border-radius: 8px;
}

.search-field {
  max-width: 100%;
}

.search-field :deep(.v-field) {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  border-radius: 24px;
}

.download-btn {
  border-radius: 20px;
  text-transform: none;
  font-weight: 500;
}

.user-profile-btn {
  border-radius: 12px;
  padding: 4px 8px;
  text-transform: none;
  background-color: rgba(var(--v-theme-surface-variant), 0.6);
  height: 40px;
}

.user-menu {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.user-menu-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.notifications-card {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.notification-item {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.06);
}

.notification-item:last-child {
  border-bottom: none;
}

.date-range {
  padding: 8px 12px;
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 8px;
}

@media (max-width: 960px) {
  .header-center {
    margin: 0 16px;
  }

  .date-range {
    display: none !important;
  }
}

@media (max-width: 600px) {
  .header-center {
    margin: 0 8px;
  }

  .user-info {
    display: none !important;
  }
}
</style>
