/**
 * Rate Limiting Composable
 * حماية من الطلبات المتكررة (Rate Limiting)
 */

interface RateLimitOptions {
  /** عدد الطلبات المسموح بها */
  maxRequests: number;
  /** المدة الزمنية بالميلي ثانية */
  windowMs: number;
  /** رسالة الخطأ */
  message?: string;
}

interface RateLimitState {
  requests: number;
  resetTime: number;
}

export const useRateLimit = () => {
  // Store rate limit states per key
  const rateLimits = new Map<string, RateLimitState>();

  /**
   * التحقق من الطلب
   * @param key - مفتاح فريد للطلب (مثلاً: 'login', 'api_call')
   * @param options - إعدادات Rate Limiting
   * @returns true إذا كان الطلب مسموحاً، false إذا تم تجاوز الحد
   */
  const checkRateLimit = (
    key: string,
    options: RateLimitOptions = {
      maxRequests: 5,
      windowMs: 60000, // 1 minute
      message: "عدد كبير جداً من المحاولات. يرجى المحاولة بعد قليل.",
    }
  ): {
    allowed: boolean;
    message?: string;
    remainingRequests?: number;
    resetTime?: number;
  } => {
    const now = Date.now();
    const state = rateLimits.get(key);

    // إذا لم يكن هناك حالة أو انتهت المدة الزمنية
    if (!state || now >= state.resetTime) {
      rateLimits.set(key, {
        requests: 1,
        resetTime: now + options.windowMs,
      });

      return {
        allowed: true,
        remainingRequests: options.maxRequests - 1,
        resetTime: now + options.windowMs,
      };
    }

    // زيادة عدد الطلبات
    state.requests++;

    // التحقق من تجاوز الحد
    if (state.requests > options.maxRequests) {
      const timeRemaining = Math.ceil((state.resetTime - now) / 1000);

      return {
        allowed: false,
        message:
          options.message ||
          `تم تجاوز الحد الأقصى للمحاولات. حاول مرة أخرى بعد ${timeRemaining} ثانية.`,
        remainingRequests: 0,
        resetTime: state.resetTime,
      };
    }

    return {
      allowed: true,
      remainingRequests: options.maxRequests - state.requests,
      resetTime: state.resetTime,
    };
  };

  /**
   * إعادة تعيين Rate Limit لمفتاح معين
   */
  const resetRateLimit = (key: string): void => {
    rateLimits.delete(key);
  };

  /**
   * مسح جميع Rate Limits
   */
  const clearAllRateLimits = (): void => {
    rateLimits.clear();
  };

  /**
   * الحصول على حالة Rate Limit
   */
  const getRateLimitState = (
    key: string
  ): { requests: number; resetTime: number } | null => {
    return rateLimits.get(key) || null;
  };

  /**
   * Rate Limit Middleware للاستخدام مع API calls
   */
  const withRateLimit = async <T>(
    key: string,
    fn: () => Promise<T>,
    options?: RateLimitOptions
  ): Promise<T> => {
    const { allowed, message } = checkRateLimit(key, options);

    if (!allowed) {
      throw new Error(message || "تم تجاوز الحد الأقصى للمحاولات");
    }

    return await fn();
  };

  /**
   * Decorator للدوال مع Rate Limiting
   */
  const rateLimited = <T extends (...args: any[]) => Promise<any>>(
    key: string,
    fn: T,
    options?: RateLimitOptions
  ): T => {
    return (async (...args: any[]) => {
      return await withRateLimit(key, () => fn(...args), options);
    }) as T;
  };

  return {
    checkRateLimit,
    resetRateLimit,
    clearAllRateLimits,
    getRateLimitState,
    withRateLimit,
    rateLimited,
  };
};

/**
 * Rate Limiting للأنواع المختلفة من الطلبات
 */
export const useApiRateLimit = () => {
  const rateLimit = useRateLimit();

  /**
   * Rate Limit لتسجيل الدخول
   */
  const checkLoginRateLimit = () => {
    return rateLimit.checkRateLimit("login", {
      maxRequests: 5,
      windowMs: 300000, // 5 minutes
      message:
        "عدد كبير جداً من محاولات تسجيل الدخول. حاول مرة أخرى بعد 5 دقائق.",
    });
  };

  /**
   * Rate Limit للطلبات العامة
   */
  const checkApiRateLimit = (endpoint: string) => {
    return rateLimit.checkRateLimit(`api_${endpoint}`, {
      maxRequests: 60,
      windowMs: 60000, // 1 minute
      message: "عدد كبير جداً من الطلبات. حاول مرة أخرى بعد دقيقة.",
    });
  };

  /**
   * Rate Limit للبحث
   */
  const checkSearchRateLimit = () => {
    return rateLimit.checkRateLimit("search", {
      maxRequests: 20,
      windowMs: 60000, // 1 minute
      message: "عدد كبير جداً من عمليات البحث. حاول مرة أخرى بعد دقيقة.",
    });
  };

  /**
   * Rate Limit للتحميل (Upload)
   */
  const checkUploadRateLimit = () => {
    return rateLimit.checkRateLimit("upload", {
      maxRequests: 10,
      windowMs: 300000, // 5 minutes
      message: "عدد كبير جداً من عمليات التحميل. حاول مرة أخرى بعد 5 دقائق.",
    });
  };

  /**
   * Rate Limit للتصدير
   */
  const checkExportRateLimit = () => {
    return rateLimit.checkRateLimit("export", {
      maxRequests: 5,
      windowMs: 300000, // 5 minutes
      message: "عدد كبير جداً من عمليات التصدير. حاول مرة أخرى بعد 5 دقائق.",
    });
  };

  return {
    checkLoginRateLimit,
    checkApiRateLimit,
    checkSearchRateLimit,
    checkUploadRateLimit,
    checkExportRateLimit,
    ...rateLimit,
  };
};

/**
 * Plugin لتطبيق Rate Limiting على جميع API calls
 */
export const useApiRateLimitPlugin = () => {
  const { checkApiRateLimit } = useApiRateLimit();
  const toast = useToast();

  /**
   * Middleware لـ API calls
   */
  const rateLimitMiddleware = async (
    endpoint: string,
    request: () => Promise<any>
  ) => {
    const { allowed, message } = checkApiRateLimit(endpoint);

    if (!allowed) {
      toast.warning(message || "عدد كبير جداً من الطلبات");
      throw new Error(message || "Rate limit exceeded");
    }

    return await request();
  };

  return {
    rateLimitMiddleware,
  };
};
