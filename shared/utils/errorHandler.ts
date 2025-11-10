/**
 * Error type classification for API errors
 * تصنيف أنواع الأخطاء من API
 */
export interface TransportErrorInfo {
  type: 'network' | 'http' | 'timeout' | 'abort' | 'unknown'
  message: string
  statusCode?: number
  isRetryable?: boolean
}

/**
 * Categorize error types for appropriate handling
 * تصنيف الأخطاء للمعالجة المناسبة
 * 
 * @param error - Error object from API request
 * @returns TransportErrorInfo with type, message, and metadata
 * 
 * @example
 * const { type, isRetryable } = getErrorType(error)
 * if (isRetryable && attempt < maxRetries) {
 *   // retry logic
 * }
 */
export const classifyError = (error: any): TransportErrorInfo => {
  // Only run browser-specific checks in browser environment
  if (typeof window === 'undefined') {
    // Server environment - handle basic error types
    if (
      error instanceof TypeError &&
      (error.message.toLowerCase().includes('failed to fetch') ||
       error.message.toLowerCase().includes('network request failed'))
    ) {
      return {
        type: 'network',
        message: 'فشل الاتصال بالشبكة',
        isRetryable: true
      }
    }

    if (error?.name === 'TimeoutError' ||
        error?.message?.toLowerCase().includes('timeout')) {
      return {
        type: 'timeout',
        message: 'انتهت مهلة الطلب',
        isRetryable: true
      }
    }

    if (error?.name === 'AbortError' ||
        error?.message?.toLowerCase().includes('aborted')) {
      return {
        type: 'abort',
        message: 'تم إلغاء الطلب',
        isRetryable: false
      }
    }

    if (error && (error.status || error.statusCode)) {
      const statusCode = error.status || error.statusCode
      return {
        type: 'http',
        message: error.data?.message || error.statusMessage || 'خطأ في الطلب',
        statusCode,
        isRetryable: [408, 429, 500, 502, 503, 504].includes(statusCode)
      }
    }

    return {
      type: 'unknown',
      message: error?.message || 'حدث خطأ غير متوقع',
      isRetryable: false
    }
  }

  // Browser environment - can use navigator
  if (
    error instanceof TypeError &&
    (error.message.toLowerCase().includes('failed to fetch') ||
     error.message.toLowerCase().includes('network request failed'))
  ) {
    return {
      type: 'network',
      message: 'فشل الاتصال بالشبكة',
      isRetryable: true
    }
  }

  // Return unknown error for any remaining cases
  return {
    type: 'unknown',
    message: error?.message || 'حدث خطأ غير متوقع',
    isRetryable: false
  }
}
