import { getAuthHeaders } from "./getAuthHeaders";
import { handleApiError } from "~/plugins/errorHandler";
import { backoff } from "~~/shared/utils/backoff";
import { classifyError } from "~~/shared/utils/errorHandler";

/**
 * Unified API composable with retry logic
 * واجهة API موحدة مع إعادة المحاولة
 *
 * Features:
 * - SSR-safe authentication headers
 * - Automatic retry on network/timeout errors
 * - Exponential backoff
 * - Centralized error handling
 *
 * @example
 * const api = useApi()
 * const user = await api.post('/users', { name: 'Ahmad' })
 */
export const useApi = () => {
  const config = useRuntimeConfig();
  const maxRetries = 3;

  /**
   * Unified request handler with retry logic
   * معالج طلبات موحد مع إعادة المحاولة
   */
  const request = async <T = any>(
    method: string,
    endpoint: string,
    body?: any,
    opts: any = {}
  ): Promise<T> => {
    let attempt = 0;
    const { skipAuth = false, ...restOpts } = opts;

    while (true) {
      try {
        // Get headers - skip auth headers if skipAuth is true
        const headers = skipAuth ? {} : getAuthHeaders();

        // Execute request
        return await $fetch<T>(endpoint, {
          baseURL: config.public.apiBaseUrl as string,
          method,
          body,
          headers,
          ...restOpts,
        });
      } catch (err: any) {
        // Categorize error
        const errorInfo = classifyError(err);

        // Retry on network/timeout errors only
        if (errorInfo.isRetryable && attempt < maxRetries) {
          attempt++;
          const delay = backoff(attempt);
          console.warn(`Retry ${attempt}/${maxRetries} after ${delay}ms`);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        // Handle system errors (401, 403, 500+)
        await handleApiError(err);

        // Show toast notification for API errors (if not skipAuth)
        if (!skipAuth && import.meta.client) {
          const toast = useToast();
          const statusCode = err?.status || err?.statusCode || 500;

          // Extract error message from response
          const errorData = err?.data || err?.response?.data || err;

          // Use fromResponse to automatically format and display error
          toast.fromResponse(errorData, statusCode);
        }

        throw err;
      }
    }
  };

  return {
    get: <T>(u: string, o?: any) => request<T>("GET", u, undefined, o),
    post: <T>(u: string, b?: any, o?: any) => request<T>("POST", u, b, o),
    put: <T>(u: string, b?: any, o?: any) => request<T>("PUT", u, b, o),
    patch: <T>(u: string, b?: any, o?: any) => request<T>("PATCH", u, b, o),
    delete: <T>(u: string, o?: any) => request<T>("DELETE", u, undefined, o),
  };
};

/**
 * Fetch data using useFetch (SSR-friendly)
 * جلب البيانات باستخدام useFetch (متوافق مع SSR)
 *
 * Best for: Initial page data, SEO-critical data
 *
 * @param endpoint - API endpoint
 * @param options - Fetch options
 *
 * @example
 * const { data, pending } = await useFetchData('/users')
 *
 * // Disable cache
 * const { data } = await useFetchData('/users', { cache: false })
 *
 * // Client-side only
 * const { data } = await useFetchData('/users', { server: false })
 */
export const useFetchData = <T = any>(
  endpoint: string,
  options: {
    server?: boolean;
    lazy?: boolean;
    cache?: boolean;
    transform?: (data: any) => T;
    default?: () => T;
  } = {}
) => {
  const config = useRuntimeConfig();

  const fetchOptions: any = {
    baseURL: config.public.apiBaseUrl as string,
    headers: getAuthHeaders(),
    server: options.server ?? true,
    lazy: options.lazy ?? false,
    onResponseError({ response }: any) {
      handleApiError(response);
    },
  };

  // Disable cache if specified
  if (options.cache === false) {
    fetchOptions.getCachedData = () => null;
  }

  // Add transform/default if specified
  if (options.transform) fetchOptions.transform = options.transform;
  if (options.default) fetchOptions.default = options.default;

  return useFetch<T>(endpoint, fetchOptions);
};

/**
 * Mutation composable for POST/PUT/PATCH/DELETE
 * مركب للطفرات (إنشاء، تحديث، حذف)
 *
 * Best for: Form submissions, data mutations
 * Includes: loading state, error handling, retry logic
 *
 * @example
 * const { mutate, loading, error, data, reset } = useMutation()
 *
 * const user = await mutate('post', '/users', { name: 'Ahmad' })
 * if (user) {
 *   console.log('User created:', user)
 * }
 */
export const useMutation = () => {
  const api = useApi();
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const data = ref<any>(null);

  const mutate = async <T = any>(
    method: "post" | "put" | "patch" | "delete",
    endpoint: string,
    payload?: any
  ): Promise<T | null> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await api[method]<T>(endpoint, payload);
      data.value = result;
      return result;
    } catch (err) {
      error.value = err as Error;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    loading.value = false;
    error.value = null;
    data.value = null;
  };

  return {
    mutate,
    loading: readonly(loading),
    error: readonly(error),
    data: readonly(data),
    reset,
  };
};
