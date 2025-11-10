/**
 * 🔌 API Toast Interceptor Plugin
 * ────────────────────────────────────────────
 *
 * Plugin لعرض Toast تلقائياً عند حدوث أخطاء API
 *
 * المميزات:
 * - يعترض كل API calls عبر $fetch
 * - يعرض Toast للأخطاء تلقائياً
 * - يمكن تعطيله لكل request
 * - يدعم custom error handling
 *
 * @example
 * // مع Toast تلقائي
 * await $fetch('/api/users')
 *
 * // بدون Toast
 * await $fetch('/api/users', { silent: true })
 */

export default defineNuxtPlugin((nuxtApp) => {
  // Provide toast globally - using useToast inside plugin context
  const toast = useToast();

  // Extend $fetch options type
  type FetchOptions = Parameters<typeof $fetch>[1] & {
    silent?: boolean; // تعطيل Toast للخطأ
    showSuccessToast?: boolean; // عرض Toast للنجاح
    successMessage?: string; // رسالة نجاح مخصصة
  };

  // Global error handler for unhandled errors
  nuxtApp.hook("app:error", (error) => {
    console.error("[App Error]", error);

    // عرض Toast للأخطاء غير المعالجة
    toast.error("حدث خطأ ما");
  });

  // Global $fetch interceptor
  const originalFetch = globalThis.$fetch;

  globalThis.$fetch = new Proxy(originalFetch, {
    async apply(target, thisArg, argArray: [string, FetchOptions?]) {
      const [url, options = {}] = argArray;
      const silent = options.silent ?? false;
      const showSuccessToast = options.showSuccessToast ?? false;
      const successMessage = options.successMessage;

      try {
        const response = await Reflect.apply(target, thisArg, argArray);

        // Success Toast (إذا كان مطلوباً)
        if (showSuccessToast) {
          if (successMessage) {
            toast.success(successMessage);
          } else {
            toast.fromResponse(response, 200);
          }
        }

        return response;
      } catch (error: any) {
        // لا تعرض Toast إذا كان silent
        if (silent) {
          throw error;
        }

        // استخراج البيانات من الخطأ
        const statusCode = error?.response?.status || error?.status || 500;
        const data = error?.response?._data || error?.data || error;

        // حالات خاصة
        if (statusCode === 401) {
          // Unauthorized - يتم معالجته في auth middleware
          console.warn("[API] Unauthorized request");
          throw error;
        }

        if (statusCode === 403) {
          // Forbidden
          toast.error("لا تملك الصلاحيات اللازمة");
          throw error;
        }

        if (statusCode === 404) {
          // Not Found
          toast.error("المورد غير موجود");
          throw error;
        }

        if (statusCode === 422) {
          // Validation Error
          toast.fromResponse(data, statusCode);
          throw error;
        }

        if (statusCode >= 500) {
          // Server Error
          toast.error("خطأ في الخادم، يرجى المحاولة لاحقاً");
          throw error;
        }

        // أخطاء أخرى - عرض الرسالة من Backend
        toast.fromResponse(data, statusCode);
        throw error;
      }
    },
  });

  return {
    provide: {
      toast,
    },
  };
});
