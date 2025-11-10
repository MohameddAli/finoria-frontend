import { classifyError } from "~~/shared/utils/errorHandler";
import { useAuthStore } from "~/stores/auth/storeAuth";

/**
 * Flag to prevent concurrent 401 handling (dedupe)
 * علامة لمنع معالجة 401 المتزامنة
 */
let handlingAuth = false;

/**
 * Centralized API error handler
 * معالج مركزي لأخطاء API
 *
 * Handles system-level errors:
 * - 401: Session expired → clear auth, redirect to login
 * - 403: Forbidden → redirect to unauthorized page
 * - 500+: Server errors → show error message
 * - Network/Timeout: Connectivity issues
 *
 * Business logic errors (400) should be handled by components
 *
 * @param error - Error object from API request
 * @returns Object with shouldRetry flag for retry logic
 *
 * @example
 * try {
 *   await api.post('/users', data)
 * } catch (err) {
 *   await handleApiError(err)
 *   throw err
 * }
 */
export const handleApiError = async (error: any) => {
  // Skip on server (no navigation/localStorage)
  if (!process.client) return { shouldRetry: false };

  const toast = useToast();
  const authStore = useAuthStore();
  const route = useRoute();

  const status = error?.status || error?.statusCode || error?.response?.status;

  // === 401 Unauthorized (Session expired) ===
  if (status === 401) {
    // Dedupe: prevent concurrent 401 handling
    if (handlingAuth) return { shouldRetry: false };

    handlingAuth = true;

    try {
      // Smart redirect: save current page (except login/unauthorized)
      if (route.path !== "/login" && route.path !== "/unauthorized") {
        localStorage.setItem("auth_redirect_url", route.fullPath);
      }

      // Clear auth data
      authStore.clearAuth();

      // Show warning
      toast.warning("انتهت صلاحية الجلسة، يرجى تسجيل الدخول");

      // Navigate to login
      await navigateTo("/login");
    } finally {
      // Reset flag after navigation
      handlingAuth = false;
    }

    return { shouldRetry: false };
  }

  // === 403 Forbidden ===
  if (status === 403) {
    const message = error?.data?.message || "غير مصرح لك بالدخول";
    toast.error(message);
    await navigateTo("/unauthorized");
    return { shouldRetry: false };
  }

  // === 500+ Server Errors ===
  if (status >= 500) {
    toast.error("خطأ في الخادم، يرجى المحاولة لاحقاً");
    return { shouldRetry: false };
  }

  // === Network/Timeout Errors ===
  const errorInfo = classifyError(error);

  if (errorInfo.type === "network" || errorInfo.type === "timeout") {
    toast.error("تحقق من اتصال الإنترنت");
    // Return retry flag for caller to handle
    return { shouldRetry: errorInfo.isRetryable || false };
  }

  // === Unknown errors ===
  if (errorInfo.type === "unknown") {
    toast.error(errorInfo.message);
  }

  return { shouldRetry: false };
};

// Ensure Nuxt registers this as a plugin (even if unused at runtime)
export default defineNuxtPlugin(() => {});
