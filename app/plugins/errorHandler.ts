import { classifyError } from "~~/shared/utils/errorHandler";
import { useAuthStore } from "~/stores/auth/storeAuth";

let handlingAuth = false;

export const handleApiError = async (error: any) => {
  if (!process.client) return { shouldRetry: false };

  const toast = useToast();
  const authStore = useAuthStore();
  const route = useRoute();
  const status = error?.status || error?.statusCode || error?.response?.status;

  if (status === 401) {
    if (handlingAuth) return { shouldRetry: false };
    handlingAuth = true;

    try {
      if (route.path !== "/login" && route.path !== "/unauthorized") {
        localStorage.setItem("auth_redirect_url", route.fullPath);
      }
      authStore.clearAuth();
      toast.warning("انتهت صلاحية الجلسة، يرجى تسجيل الدخول");
      await navigateTo("/login");
    } finally {
      handlingAuth = false;
    }
    return { shouldRetry: false };
  }

  if (status === 403) {
    toast.error(error?.data?.message || "غير مصرح لك بالدخول");
    await navigateTo("/unauthorized");
    return { shouldRetry: false };
  }

  if (status >= 500) {
    toast.error("خطأ في الخادم، يرجى المحاولة لاحقاً");
    return { shouldRetry: false };
  }

  const errorInfo = classifyError(error);
  if (errorInfo.type === "network" || errorInfo.type === "timeout") {
    toast.error("تحقق من اتصال الإنترنت");
    return { shouldRetry: errorInfo.isRetryable || false };
  }

  if (errorInfo.type === "unknown") toast.error(errorInfo.message);
  return { shouldRetry: false };
};

export default defineNuxtPlugin(() => {});
