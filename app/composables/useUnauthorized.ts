import { useAuthStore } from "~/stores/auth/storeAuth";

const REASON_MAP: Record<string, string> = {
  not_logged_in: "لم تقم بتسجيل الدخول",
  session_expired: "انتهت صلاحية جلستك",
  insufficient_permissions: "لا تملك الصلاحيات الكافية",
  account_deactivated: "تم إلغاء تفعيل حسابك",
  invalid_token: "رمز المصادقة غير صالح",
};

export const useUnauthorized = () => {
  const router = useRouter();
  const toast = useToast();
  const authStore = useAuthStore();

  const createCountdown = (seconds: number, callback: () => void) => {
    const countdown = ref(seconds);
    const isActive = ref(true);
    let timer: NodeJS.Timeout | null = null;

    const start = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        if (!isActive.value) return;
        countdown.value--;
        if (countdown.value <= 0) {
          stop();
          callback();
        }
      }, 1000);
    };

    const stop = () => {
      isActive.value = false;
      if (timer) clearInterval(timer), (timer = null);
    };

    const reset = (newSeconds?: number) => {
      stop();
      countdown.value = newSeconds || seconds;
      isActive.value = true;
    };

    start();
    onBeforeUnmount(stop);

    return { countdown: readonly(countdown), isActive: readonly(isActive), start, stop, reset };
  };

  const redirectTo = async (path: string, query?: Record<string, any>, message?: string) => {
    if (message) toast.info(message);
    await router.push({ path, query }).catch(() => toast.error("حدث خطأ أثناء التوجيه"));
  };

  const redirectToLogin = async (saveCurrentPath = true) => {
    if (saveCurrentPath && process.client) {
      const currentPath = router.currentRoute.value.fullPath;
      if (currentPath !== "/login" && currentPath !== "/unauthorized") {
        localStorage.setItem("auth_redirect_url", currentPath);
      }
    }
    await redirectTo("/login", undefined, "جاري التوجيه إلى صفحة تسجيل الدخول...");
  };

  const redirectToUnauthorized = (reason?: string) =>
    redirectTo("/unauthorized", reason ? { reason } : undefined);

  const redirectToHome = () => redirectTo("/");

  const redirectToDashboard = async () => {
    if (!authStore.isAuthenticated) return redirectToLogin(false);
    await redirectTo("/roles");
  };

  const checkAuthAndRedirect = () =>
    authStore.isAuthenticated ? redirectToDashboard() : redirectToLogin();

  const getUnauthorizedReason = () => {
    const reason = useRoute().query.reason as string;
    return reason ? REASON_MAP[reason] || reason : null;
  };

  const createUnauthorizedMessage = (error?: any) => {
    if (error?.data?.message) return error.data.message;
    if (error?.statusCode === 401) return "يجب عليك تسجيل الدخول للوصول إلى هذا المحتوى";
    if (error?.statusCode === 403) return "ليس لديك صلاحية للوصول إلى هذا المورد";
    return "غير مصرح بالوصول إلى هذه الصفحة";
  };

  const handleUnauthorizedError = (error: any) => {
    toast.error(createUnauthorizedMessage(error));
    setTimeout(() => {
      if (error?.statusCode === 401) redirectToLogin();
      else if (error?.statusCode === 403) redirectToUnauthorized("insufficient_permissions");
      else redirectToUnauthorized();
    }, 2000);
  };

  return {
    redirectToLogin,
    redirectToUnauthorized,
    redirectToHome,
    redirectToDashboard,
    checkAuthAndRedirect,
    handleUnauthorizedError,
    createUnauthorizedMessage,
    getUnauthorizedReason,
    createCountdown,
  };
};

