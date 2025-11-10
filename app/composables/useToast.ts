/**
 * 🍞 Toast Notification System - Nuxt 4
 * ────────────────────────────────────────────────────────────────────────────
 *
 * نظام Toast احترافي مع دعم كامل لـ:
 * - Multi-line messages
 * - API response normalization
 * - RTL support
 * - i18n integration
 * - HTTP status code detection
 * - Network status monitoring
 *
 * @example
 * const toast = useToast()
 *
 * // رسالة بسيطة
 * toast.success('تم الحفظ بنجاح')
 *
 * // من API response
 * toast.fromResponse(response, 201)
 *
 * // متعدد الأسطر
 * toast.show(['السطر الأول', 'السطر الثاني'], { variant: 'info' })
 */

import { useToastState } from "./useToastState";
import {
  normalizeBackendMessage,
  pickToastType,
  type ToastVariant,
} from "~~/shared/utils/toast";

/**
 * Icon mapping for each variant
 */
const VARIANT_ICONS: Record<ToastVariant, string> = {
  success: "mdi-check-circle",
  error: "mdi-alert-circle",
  warning: "mdi-alert",
  info: "mdi-information",
};

/**
 * Get icon based on variant
 */
function getIconByVariant(variant: ToastVariant): string {
  return VARIANT_ICONS[variant] ?? "mdi-information";
}

/**
 * Composable للتحكم في Toast
 */
export const useToast = () => {
  const state = useToastState();

  /**
   * عرض Toast - Low-level API
   *
   * @param inLines - Array of message lines to display
   * @param options - Configuration options
   */
  function show(
    inLines: string[],
    options: {
      variant?: ToastVariant;
      timeout?: number;
      icon?: string;
    } = {}
  ) {
    const finalVariant = options.variant ?? "info";

    state.lines.value = inLines;
    state.variant.value = finalVariant;
    state.timeout.value = options.timeout ?? 4000;
    state.icon.value = options.icon ?? getIconByVariant(finalVariant);
    state.visible.value = true;
  }

  /**
   * Success Toast - أخضر ✅
   *
   * @param message - Single message or array of messages
   */
  function success(message: string | string[]) {
    const lines = Array.isArray(message) ? message : [message];
    show(lines, { variant: "success", timeout: 4000 });
  }

  /**
   * Error Toast - أحمر ❌
   *
   * @param message - Single message or array of messages
   */
  function error(message: string | string[]) {
    const lines = Array.isArray(message) ? message : [message];
    show(lines, { variant: "error", timeout: 6000 });
  }

  /**
   * Warning Toast - برتقالي ⚠️
   *
   * @param message - Single message or array of messages
   */
  function warning(message: string | string[]) {
    const lines = Array.isArray(message) ? message : [message];
    show(lines, { variant: "warning", timeout: 5000 });
  }

  /**
   * Info Toast - أزرق ℹ️
   *
   * @param message - Single message or array of messages
   */
  function info(message: string | string[]) {
    const lines = Array.isArray(message) ? message : [message];
    show(lines, { variant: "info", timeout: 4000 });
  }

  /**
   * 🎯 السحر الحقيقي - من API Response
   *
   * يحلل أي response من backend ويعرضه بشكل جميل
   *
   * Examples:
   * - { msg: "success" } -> Success toast
   * - { errors: { email: ["taken"] } } -> Error toast with "email: taken"
   * - { data: { user: "created", email: "updated" } } -> Multi-line success toast
   *
   * @param payload - API response data
   * @param statusCode - HTTP status code (optional, auto-detects variant)
   */
  function fromResponse(payload: unknown, statusCode?: number) {
    const { lines: normalizedLines } = normalizeBackendMessage(payload);
    const detectedVariant = pickToastType(statusCode);

    show(normalizedLines, { variant: detectedVariant });
  }

  /**
   * إخفاء Toast
   */
  function hide() {
    state.visible.value = false;
  }

  /**
   * مسح كل البيانات
   */
  function clear() {
    state.lines.value = [];
    state.visible.value = false;
  }

  return {
    // High-level APIs
    success,
    error,
    warning,
    info,
    fromResponse,

    // Low-level APIs
    show,
    hide,
    clear,

    // State (readonly للقراءة من Component)
    state: {
      lines: readonly(state.lines),
      variant: readonly(state.variant),
      visible: readonly(state.visible),
      timeout: readonly(state.timeout),
      icon: readonly(state.icon),
    },
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// 🔄 Backward Compatibility Layer - للتوافق مع الكود القديم
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @deprecated استخدم useToast() بدلاً منه
 * هذا موجود فقط للتوافق مع الكود القديم
 *
 * @example
 * // ❌ القديم (لا يُنصح)
 * const { showSuccess } = useSnackbar()
 *
 * // ✅ الجديد (استخدم هذا)
 * const toast = useToast()
 * toast.success('رسالة')
 */
export const useSnackbar = () => {
  const toast = useToast();
  const state = useToastState();

  return {
    snackbar: {
      get show() {
        return state.visible.value;
      },
      set show(val: boolean) {
        state.visible.value = val;
      },
      get message() {
        return state.lines.value[0] || "";
      },
      set message(val: string) {
        state.lines.value = [val];
      },
      get color() {
        return state.variant.value;
      },
      set color(val: ToastVariant) {
        state.variant.value = val;
      },
      get timeout() {
        return state.timeout.value;
      },
      set timeout(val: number) {
        state.timeout.value = val;
      },
      get icon() {
        return state.icon.value;
      },
      set icon(val: string) {
        state.icon.value = val;
      },
    },
    showSuccess: toast.success,
    showError: toast.error,
    showWarning: toast.warning,
    showInfo: toast.info,
    hide: toast.hide,
  };
};
