/**
 * نظام موحد لمعالجة الأخطاء - Unified Error Handler
 * يعالج جميع أنواع الأخطاء: API, Network, Validation, Auth, Client-side
 */

import { useAuthStore } from "~/stores/auth/storeAuth";
import type { ErrorInfo } from "~~/shared/types";
import { classifyError } from "~~/shared/utils/errorHandler";

export interface ErrorHandlerOptions {
  showSnackbar?: boolean;
  logToConsole?: boolean;
  fallbackMessage?: string;
  redirect?: string;
  context?: string;
  retryFn?: () => void;
}

export const useErrorHandler = () => {
  const toast = useToast();
  const authStore = useAuthStore();

  const getErrorType = (error: any): ErrorInfo["type"] => {
    const statusCode = error?.status || error?.statusCode;
    if (statusCode === 401 || statusCode === 403) return "auth";
    if (statusCode === 400) return "validation";
    if (statusCode === 404 || statusCode >= 500) return "server";
    const transport = classifyError(error);
    if (transport.type === "network" || transport.type === "timeout") return "network";
    if (error?.name === "TypeError" || error?.name === "ReferenceError") return "client";
    return "unknown";
  };

  const handleAuthError = (statusCode: number, message?: string, options: ErrorHandlerOptions = {}) => {
    if (statusCode === 401) {
      authStore.clearAuth();
      toast.error("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى");
      if (options.logToConsole !== false) console.warn("401 Unauthorized");
      navigateTo("/login");
    } else if (statusCode === 403) {
      const msg = message || "ليس لديك صلاحية للوصول إلى هذا المورد";
      toast.error(msg);
      if (options.logToConsole !== false) console.warn("403 Forbidden:", msg);
      navigateTo(options.redirect || "/");
    }
  };

  const handleValidationError = (errors: Record<string, string[]> | string, options: ErrorHandlerOptions = {}) => {
    if (typeof errors === "string") {
      toast.warning(errors);
      return;
    }

    const firstError = Object.values(errors)[0];
    const msg = firstError?.[0] || "يرجى التحقق من البيانات المدخلة";
    toast.warning(msg);
    
    if (options.logToConsole !== false) console.warn("Validation Error:", errors);
  };

  const handleNetworkError = (error: any, options: ErrorHandlerOptions = {}) => {
    const msg = !navigator.onLine
      ? "لا يوجد اتصال بالإنترنت، يرجى التحقق من الاتصال والمحاولة مرة أخرى"
      : "حدث خطأ في الاتصال بالخادم، يرجى المحاولة مرة أخرى";
    
    toast.error(msg);
    if (options.logToConsole !== false) console.error("Network Error:", error);
  };

  const handleServerError = (error: any, options: ErrorHandlerOptions = {}) => {
    const statusCode = error?.status || error?.statusCode;
    let message = "حدث خطأ في الخادم، يرجى المحاولة مرة أخرى لاحقاً";

    if (statusCode === 404) message = "المورد المطلوب غير موجود";
    else if (statusCode >= 500) message = "خطأ داخلي في الخادم، يرجى المحاولة لاحقاً";

    toast.error(options.context ? `${options.context}: ${message}` : message);
    if (options.logToConsole !== false) console.error("Server Error:", error);
  };

  const handleClientError = (error: Error, options: ErrorHandlerOptions = {}) => {
    const message = options.fallbackMessage || "حدث خطأ في العرض، يرجى إعادة تحميل الصفحة";
    toast.error(message);
    
    if (options.logToConsole !== false) {
      console.error("Client Error:", {
        message: error.message,
        stack: error.stack,
        component: options.context,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleError = (error: Error | string | any, options: ErrorHandlerOptions = {}): ErrorInfo => {
    const errorObj = typeof error === "string" ? new Error(error) : error;
    const statusCode = errorObj?.status || errorObj?.statusCode;
    const errorType = getErrorType(errorObj);

    const errorInfo: ErrorInfo = {
      error: errorObj,
      context: options.context,
      timestamp: new Date(),
      statusCode,
      type: errorType,
    };

    switch (errorType) {
      case "auth":
        handleAuthError(statusCode, errorObj.message, options);
        break;
      case "validation":
        handleValidationError(errorObj?.data?.errors || errorObj.message, options);
        break;
      case "network":
        handleNetworkError(errorObj, options);
        break;
      case "server":
        handleServerError(errorObj, options);
        break;
      case "client":
        handleClientError(errorObj, options);
        break;
      default:
        const message = errorObj?.message || errorObj?.data?.message || options.fallbackMessage || "حدث خطأ غير متوقع";
        const contextMessage = options.context ? `${options.context}: ${message}` : message;
        toast.error(contextMessage);
        if (options.logToConsole !== false) console.error("Unknown Error:", errorInfo);
    }

    if (options.redirect && errorType !== "auth") navigateTo(options.redirect);
    return errorInfo;
  };

  const handleAsyncError = async <T>(asyncFn: () => Promise<T>, fallback?: T, options?: ErrorHandlerOptions): Promise<T | undefined> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, options);
      return fallback;
    }
  };

  const handleErrorWithRetry = async <T>(
    asyncFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000,
    context?: string
  ): Promise<T> => {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await asyncFn();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          handleError(lastError, {
            context: `${context} (المحاولة ${attempt}/${maxRetries})`,
            showSnackbar: true,
            logToConsole: true,
          });
          throw lastError;
        }

        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
        toast.warning(`إعادة المحاولة ${attempt}/${maxRetries}...`);
      }
    }

    throw lastError!;
  };

  return {
    handleError,
    handleAuthError,
    handleValidationError,
    handleNetworkError,
    handleServerError,
    handleClientError,
    handleAsyncError,
    handleErrorWithRetry,
    getErrorType,
    isNetworkError: (error: any) => getErrorType(error) === "network",
    isAuthError: (error: any) => getErrorType(error) === "auth",
    isValidationError: (error: any) => getErrorType(error) === "validation",
  };
};
