type FetchOptions = Parameters<typeof $fetch>[1] & {
  silent?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
};

export default defineNuxtPlugin((nuxtApp) => {
  const toast = useToast();

  nuxtApp.hook("app:error", (error) => {
    console.error("[App Error]", error);
    toast.error("حدث خطأ ما");
  });

  const originalFetch = globalThis.$fetch;

  globalThis.$fetch = new Proxy(originalFetch, {
    async apply(target, thisArg, argArray: [string, FetchOptions?]) {
      const [url, options = {}] = argArray;
      const { silent = false, showSuccessToast = false, successMessage } = options;

      try {
        const response = await Reflect.apply(target, thisArg, argArray);
        if (showSuccessToast) {
          successMessage ? toast.success(successMessage) : toast.fromResponse(response, 200);
        }
        return response;
      } catch (error: any) {
        if (silent) throw error;

        const statusCode = error?.response?.status || error?.status || 500;
        const data = error?.response?._data || error?.data || error;

        if (statusCode === 401) {
          console.warn("[API] Unauthorized request");
        } else if (statusCode === 403) {
          toast.error("لا تملك الصلاحيات اللازمة");
        } else if (statusCode === 404) {
          toast.error("المورد غير موجود");
        } else if (statusCode === 422) {
          toast.fromResponse(data, statusCode);
        } else if (statusCode >= 500) {
          toast.error("خطأ في الخادم، يرجى المحاولة لاحقاً");
        } else {
          toast.fromResponse(data, statusCode);
        }
        throw error;
      }
    },
  });

  return { provide: { toast } };
});
