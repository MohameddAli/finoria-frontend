/**
 * Composable للدوال المساعدة والتنسيق
 * يوفر واجهة reactive للدوال المساعدة
 */

import {
  formatDate,
  formatDateTime,
  formatNumber,
  formatFileSize,
  formatPhone,
  getStatusColor,
  getStatusText,
  truncateText,
  isValidEmail,
  isValidSaudiPhone,
  slugify,
  copyToClipboard,
  generateId,
  searchInArray,
} from "~~/shared/utils/helpers";

/**
 * Input Sanitization Functions
 * تنظيف وتعقيم المدخلات لمنع XSS و Injection attacks
 */
export const useSanitization = () => {
  /**
   * تنظيف HTML من المدخلات
   */
  const sanitizeHtml = (input: string): string => {
    if (!input) return "";

    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
    };

    return input.replace(/[&<>"'/]/g, (char) => map[char] || char);
  };

  /**
   * تنظيف SQL من المدخلات
   */
  const sanitizeSql = (input: string): string => {
    if (!input) return "";

    // إزالة الأحرف الخطرة لـ SQL
    return input
      .replace(/['";\\]/g, "")
      .replace(/--/g, "")
      .replace(/\/\*/g, "")
      .replace(/\*\//g, "");
  };

  /**
   * تنظيف الأسماء من الأحرف الخاصة
   */
  const sanitizeName = (input: string): string => {
    if (!input) return "";

    // السماح فقط بالأحرف العربية والإنجليزية والمسافات
    return input.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, "").trim();
  };

  /**
   * تنظيف البريد الإلكتروني
   */
  const sanitizeEmail = (input: string): string => {
    if (!input) return "";

    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9@._-]/g, "");
  };

  /**
   * تنظيف رقم الجوال
   */
  const sanitizePhone = (input: string): string => {
    if (!input) return "";

    // إزالة كل شيء عدا الأرقام والعلامة +
    return input.replace(/[^\d+]/g, "");
  };

  /**
   * تنظيف URL
   */
  const sanitizeUrl = (input: string): string => {
    if (!input) return "";

    try {
      const url = new URL(input);
      // السماح فقط بالبروتوكولات الآمنة
      if (!["http:", "https:"].includes(url.protocol)) {
        return "";
      }
      return url.toString();
    } catch {
      return "";
    }
  };

  /**
   * تنظيف شامل للمدخلات
   */
  const sanitizeInput = (
    input: string,
    type: "text" | "html" | "email" | "phone" | "url" = "text"
  ): string => {
    switch (type) {
      case "html":
        return sanitizeHtml(input);
      case "email":
        return sanitizeEmail(input);
      case "phone":
        return sanitizePhone(input);
      case "url":
        return sanitizeUrl(input);
      default:
        return input.trim();
    }
  };

  /**
   * تنظيف كائن كامل
   */
  const sanitizeObject = <T extends Record<string, any>>(
    obj: T,
    fieldTypes: Partial<
      Record<keyof T, "text" | "html" | "email" | "phone" | "url">
    > = {}
  ): T => {
    const result = { ...obj };

    for (const key in result) {
      if (typeof result[key] === "string") {
        const type = fieldTypes[key] || "text";
        result[key] = sanitizeInput(result[key], type) as any;
      }
    }

    return result;
  };

  return {
    sanitizeHtml,
    sanitizeSql,
    sanitizeName,
    sanitizeEmail,
    sanitizePhone,
    sanitizeUrl,
    sanitizeInput,
    sanitizeObject,
  };
};

/**
 * CSRF Protection Composable
 */
export const useCsrf = () => {
  const csrfToken = ref<string | null>(null);
  const csrfTokenExpiry = ref<number>(0);

  /**
   * Generate CSRF token
   */
  const generateCsrfToken = (): string => {
    const token = `csrf_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}`;
    csrfToken.value = token;
    csrfTokenExpiry.value = Date.now() + 3600000; // 1 hour

    if (import.meta.client) {
      sessionStorage.setItem("csrf_token", token);
      sessionStorage.setItem(
        "csrf_token_expiry",
        csrfTokenExpiry.value.toString()
      );
    }

    return token;
  };

  /**
   * Get CSRF token (generate if not exists or expired)
   */
  const getCsrfToken = (): string => {
    if (import.meta.client) {
      const storedToken = sessionStorage.getItem("csrf_token");
      const storedExpiry = sessionStorage.getItem("csrf_token_expiry");

      if (storedToken && storedExpiry) {
        const expiry = parseInt(storedExpiry);
        if (Date.now() < expiry) {
          csrfToken.value = storedToken;
          csrfTokenExpiry.value = expiry;
          return storedToken;
        }
      }
    }

    return generateCsrfToken();
  };

  /**
   * Validate CSRF token
   */
  const validateCsrfToken = (token: string): boolean => {
    const currentToken =
      csrfToken.value ||
      (import.meta.client ? sessionStorage.getItem("csrf_token") : null);
    const expiry =
      csrfTokenExpiry.value ||
      (import.meta.client
        ? parseInt(sessionStorage.getItem("csrf_token_expiry") || "0")
        : 0);

    if (!currentToken || !token) return false;
    if (Date.now() > expiry) return false;

    return currentToken === token;
  };

  /**
   * Clear CSRF token
   */
  const clearCsrfToken = (): void => {
    csrfToken.value = null;
    csrfTokenExpiry.value = 0;

    if (import.meta.client) {
      sessionStorage.removeItem("csrf_token");
      sessionStorage.removeItem("csrf_token_expiry");
    }
  };

  /**
   * Add CSRF token to headers
   */
  const addCsrfHeader = (
    headers: Record<string, string> = {}
  ): Record<string, string> => {
    return {
      ...headers,
      "X-CSRF-Token": getCsrfToken(),
    };
  };

  return {
    csrfToken: readonly(csrfToken),
    getCsrfToken,
    validateCsrfToken,
    clearCsrfToken,
    addCsrfHeader,
  };
};

export const useUtils = () => {
  return {
    // تنسيق التواريخ
    formatDate,
    formatDateTime,

    // تنسيق الأرقام والأحجام
    formatNumber,
    formatFileSize,
    formatPhone,

    // إدارة الحالات
    getStatusColor,
    getStatusText,

    // تنسيق النصوص
    truncateText,
    slugify,

    // التحقق من صحة البيانات
    isValidEmail,
    isValidSaudiPhone,

    // أدوات عامة
    copyToClipboard,
    generateId,
    searchInArray,
  };
};

/**
 * Composable مخصص للحالات
 * يوفر إدارة شاملة لحالات العناصر
 */
export const useStatus = () => {
  const { getStatusColor, getStatusText } = useUtils();

  /**
   * الحصول على معلومات الحالة كاملة
   * @param status - الحالة
   * @returns كائن يحتوي على اللون والنص والأيقونة
   */
  const getStatusInfo = (status: string) => {
    const color = getStatusColor(status);
    const text = getStatusText(status);
    const icon = getStatusIcon(status);

    return { color, text, icon, status };
  };

  /**
   * الحصول على أيقونة الحالة
   * @param status - الحالة
   * @returns اسم الأيقونة
   */
  const getStatusIcon = (status: string): string => {
    const statusIcons: Record<string, string> = {
      active: "mdi-check-circle",
      inactive: "mdi-circle-outline",
      pending: "mdi-clock-outline",
      approved: "mdi-check-circle",
      rejected: "mdi-close-circle",
      cancelled: "mdi-cancel",
      draft: "mdi-pencil-outline",
      published: "mdi-publish",
      new: "mdi-new-box",
      processing: "mdi-cog-outline",
      completed: "mdi-check",
      failed: "mdi-alert-circle",
      uploading: "mdi-upload",
      uploaded: "mdi-check-circle",
      error: "mdi-alert-circle",
      success: "mdi-check-circle",
      confirmed: "mdi-check-decagram",
      declined: "mdi-close-circle",
      refunded: "mdi-cash-refund",
    };

    return statusIcons[status?.toLowerCase()] || "mdi-help-circle";
  };

  /**
   * قائمة جميع الحالات المتاحة
   */
  const availableStatuses = [
    { value: "active", text: "نشط", color: "success" },
    { value: "inactive", text: "غير نشط", color: "grey" },
    { value: "pending", text: "قيد الانتظار", color: "warning" },
    { value: "approved", text: "موافق عليه", color: "success" },
    { value: "rejected", text: "مرفوض", color: "error" },
    { value: "cancelled", text: "ملغي", color: "error" },
  ];

  return {
    getStatusInfo,
    getStatusIcon,
    getStatusColor,
    getStatusText,
    availableStatuses,
  };
};

/**
 * Composable للتواريخ والأوقات
 */
export const useDateUtils = () => {
  const { formatDate, formatDateTime } = useUtils();

  /**
   * الحصول على التاريخ الحالي
   */
  const now = () => new Date();

  /**
   * الحصول على بداية اليوم
   */
  const startOfDay = (date?: Date) => {
    const d = date || new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  /**
   * الحصول على نهاية اليوم
   */
  const endOfDay = (date?: Date) => {
    const d = date || new Date();
    return new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      23,
      59,
      59,
      999
    );
  };

  /**
   * إضافة أيام لتاريخ
   */
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  /**
   * حساب الفرق بين تاريخين بالأيام
   */
  const daysDifference = (date1: Date, date2: Date) => {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  /**
   * التحقق من كون التاريخ اليوم
   */
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  /**
   * تنسيق التاريخ النسبي (منذ ساعة، قبل يومين، إلخ)
   */
  const formatRelative = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "الآن";
    if (diffInSeconds < 3600)
      return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400)
      return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    if (diffInSeconds < 2592000)
      return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;

    return formatDate(date);
  };

  return {
    formatDate,
    formatDateTime,
    formatRelative,
    now,
    startOfDay,
    endOfDay,
    addDays,
    daysDifference,
    isToday,
  };
};

/**
 * Composable للبحث والتصفية
 */
export const useSearch = <T = any>() => {
  const items = ref<T[]>([]);
  const searchTerm = ref("");
  const searchFields = ref<string[]>([]);

  /**
   * النتائج المفلترة
   */
  const filteredItems = computed(() => {
    if (!searchTerm.value.trim()) return items.value;
    return searchInArray(items.value, searchTerm.value, searchFields.value);
  });

  /**
   * تعيين البيانات
   */
  const setItems = (newItems: T[]) => {
    items.value = newItems;
  };

  /**
   * تعيين حقول البحث
   */
  const setSearchFields = (fields: string[]) => {
    searchFields.value = fields;
  };

  /**
   * تعيين مصطلح البحث
   */
  const setSearchTerm = (term: string) => {
    searchTerm.value = term;
  };

  /**
   * مسح البحث
   */
  const clearSearch = () => {
    searchTerm.value = "";
  };

  return {
    items: readonly(items),
    searchTerm,
    searchFields,
    filteredItems,
    setItems,
    setSearchFields,
    setSearchTerm,
    clearSearch,
  };
};
