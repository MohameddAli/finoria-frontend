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

const HTML_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

export const useSanitization = () => {
  const sanitizeHtml = (input: string) =>
    input ? input.replace(/[&<>"'/]/g, (char) => HTML_MAP[char] || char) : "";

  const sanitizeSql = (input: string) =>
    input ? input.replace(/['";\\]|--|\/\*|\*\//g, "") : "";

  const sanitizeName = (input: string) =>
    input ? input.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, "").trim() : "";

  const sanitizeEmail = (input: string) =>
    input ? input.toLowerCase().trim().replace(/[^a-z0-9@._-]/g, "") : "";

  const sanitizePhone = (input: string) => (input ? input.replace(/[^\d+]/g, "") : "");

  const sanitizeUrl = (input: string) => {
    if (!input) return "";
    try {
      const url = new URL(input);
      return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
    } catch {
      return "";
    }
  };

  const sanitizeInput = (input: string, type: "text" | "html" | "email" | "phone" | "url" = "text"): string => {
    if (type === "html") return sanitizeHtml(input);
    if (type === "email") return sanitizeEmail(input);
    if (type === "phone") return sanitizePhone(input);
    if (type === "url") return sanitizeUrl(input);
    return input.trim();
  };

  const sanitizeObject = <T extends Record<string, any>>(
    obj: T,
    fieldTypes: Partial<Record<keyof T, "text" | "html" | "email" | "phone" | "url">> = {}
  ): T => {
    const result = { ...obj };
    for (const key in result) {
      if (typeof result[key] === "string") {
        result[key] = sanitizeInput(result[key], fieldTypes[key] || "text") as any;
      }
    }
    return result;
  };

  return { sanitizeHtml, sanitizeSql, sanitizeName, sanitizeEmail, sanitizePhone, sanitizeUrl, sanitizeInput, sanitizeObject };
};

export const useCsrf = () => {
  const csrfToken = ref<string | null>(null);
  const csrfTokenExpiry = ref<number>(0);
  const CSRF_EXPIRY_MS = 3600000; // 1 hour

  const generateCsrfToken = (): string => {
    const token = `csrf_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    csrfToken.value = token;
    csrfTokenExpiry.value = Date.now() + CSRF_EXPIRY_MS;

    if (import.meta.client) {
      sessionStorage.setItem("csrf_token", token);
      sessionStorage.setItem("csrf_token_expiry", csrfTokenExpiry.value.toString());
    }
    return token;
  };

  const getCsrfToken = (): string => {
    if (import.meta.client) {
      const storedToken = sessionStorage.getItem("csrf_token");
      const storedExpiry = sessionStorage.getItem("csrf_token_expiry");
      if (storedToken && storedExpiry && Date.now() < parseInt(storedExpiry)) {
        csrfToken.value = storedToken;
        csrfTokenExpiry.value = parseInt(storedExpiry);
        return storedToken;
      }
    }
    return generateCsrfToken();
  };

  const validateCsrfToken = (token: string): boolean => {
    const currentToken = csrfToken.value || (import.meta.client ? sessionStorage.getItem("csrf_token") : null);
    const expiry = csrfTokenExpiry.value || (import.meta.client ? parseInt(sessionStorage.getItem("csrf_token_expiry") || "0") : 0);
    return !!(currentToken && token && Date.now() <= expiry && currentToken === token);
  };

  const clearCsrfToken = () => {
    csrfToken.value = null;
    csrfTokenExpiry.value = 0;
    if (import.meta.client) {
      sessionStorage.removeItem("csrf_token");
      sessionStorage.removeItem("csrf_token_expiry");
    }
  };

  const addCsrfHeader = (headers: Record<string, string> = {}) => ({ ...headers, "X-CSRF-Token": getCsrfToken() });

  return { csrfToken: readonly(csrfToken), getCsrfToken, validateCsrfToken, clearCsrfToken, addCsrfHeader };
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
const STATUS_ICONS: Record<string, string> = {
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

const AVAILABLE_STATUSES = [
  { value: "active", text: "نشط", color: "success" },
  { value: "inactive", text: "غير نشط", color: "grey" },
  { value: "pending", text: "قيد الانتظار", color: "warning" },
  { value: "approved", text: "موافق عليه", color: "success" },
  { value: "rejected", text: "مرفوض", color: "error" },
  { value: "cancelled", text: "ملغي", color: "error" },
];

export const useStatus = () => {
  const { getStatusColor, getStatusText } = useUtils();

  const getStatusIcon = (status: string) => STATUS_ICONS[status?.toLowerCase()] || "mdi-help-circle";

  const getStatusInfo = (status: string) => ({
    color: getStatusColor(status),
    text: getStatusText(status),
    icon: getStatusIcon(status),
    status,
  });

  return { getStatusInfo, getStatusIcon, getStatusColor, getStatusText, availableStatuses: AVAILABLE_STATUSES };
};

export const useDateUtils = () => {
  const { formatDate, formatDateTime } = useUtils();

  const now = () => new Date();
  
  const startOfDay = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const endOfDay = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  const daysDifference = (date1: Date, date2: Date) => Math.ceil(Math.abs(date2.getTime() - date1.getTime()) / 86400000);
  
  const isToday = (date: Date) => date.toDateString() === new Date().toDateString();
  
  const formatRelative = (date: Date) => {
    const diffInSeconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return "الآن";
    if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    if (diffInSeconds < 2592000) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
    return formatDate(date);
  };

  return { formatDate, formatDateTime, formatRelative, now, startOfDay, endOfDay, addDays, daysDifference, isToday };
};

export const useSearch = <T = any>() => {
  const items = ref<T[]>([]);
  const searchTerm = ref("");
  const searchFields = ref<string[]>([]);

  const filteredItems = computed(() =>
    searchTerm.value.trim() ? searchInArray(items.value, searchTerm.value, searchFields.value) : items.value
  );

  return {
    items: readonly(items),
    searchTerm,
    searchFields,
    filteredItems,
    setItems: (newItems: T[]) => (items.value = newItems),
    setSearchFields: (fields: string[]) => (searchFields.value = fields),
    setSearchTerm: (term: string) => (searchTerm.value = term),
    clearSearch: () => (searchTerm.value = ""),
  };
};
