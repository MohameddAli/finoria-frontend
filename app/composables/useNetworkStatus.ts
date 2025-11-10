/**
 * 🌐 Network Status Monitor - Nuxt 4
 * ────────────────────────────────────────────────────────────────────────────
 *
 * مراقبة حالة الاتصال بالإنترنت مع Toast notifications تلقائية
 *
 * Features:
 * - Real-time online/offline detection
 * - Automatic toast notifications
 * - Internationalization (i18n) support
 * - Auto-hide success message after 5 seconds
 * - Persistent error message until reconnected
 *
 * @example
 * const { isOnline } = useNetworkStatus()
 *
 * // تلقائياً:
 * // - عند فقدان الاتصال: toast أحمر "لا يوجد اتصال بالإنترنت"
 * // - عند استعادة الاتصال: toast أخضر "تم استعادة الاتصال" (5 ثواني)
 */

import { ref, onMounted, onUnmounted } from "vue";

export const useNetworkStatus = () => {
  const isOnline = ref(true);
  const { $i18n } = useNuxtApp();

  // Get toast composable (will be available after composables are loaded)
  let toast: ReturnType<typeof useToast> | null = null;

  const getToast = () => {
    if (!toast) {
      toast = useToast();
    }
    return toast;
  };

  // Get localized messages
  const getMessages = () => {
    const locale = $i18n.locale.value;

    return {
      offline:
        locale === "ar"
          ? "⚠️ لا يوجد اتصال بالإنترنت"
          : "⚠️ No internet connection",
      online:
        locale === "ar"
          ? "✅ تم استعادة الاتصال بالإنترنت"
          : "✅ Internet connection restored",
    };
  };

  const updateOnlineStatus = () => {
    const wasOnline = isOnline.value;
    isOnline.value = navigator.onLine;

    // Show toast only on status change
    if (wasOnline !== isOnline.value) {
      const toastInstance = getToast();
      const messages = getMessages();

      if (!isOnline.value) {
        // Lost connection - show error toast (stays longer)
        toastInstance.error(messages.offline);
      } else {
        // Restored connection - show success toast (5 seconds)
        toastInstance.success(messages.online);
      }
    }
  };

  onMounted(() => {
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    updateOnlineStatus();
  });

  onUnmounted(() => {
    window.removeEventListener("online", updateOnlineStatus);
    window.removeEventListener("offline", updateOnlineStatus);
  });

  return {
    isOnline,
  };
};
