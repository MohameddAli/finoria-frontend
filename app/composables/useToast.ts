/**
 * 🍞 Toast Notification System - Nuxt 4
 * ────────────────────────────────────────────────────────────────────────────
 * نظام Toast موحد مع دعم Multi-line, RTL, i18n, وAPI responses
 */

import { useToastState } from "./useToastState";
import {
  normalizeBackendMessage,
  pickToastType,
  type ToastVariant,
} from "~~/shared/utils/toast";

const VARIANT_ICONS: Record<ToastVariant, string> = {
  success: "mdi-check-circle",
  error: "mdi-alert-circle",
  warning: "mdi-alert",
  info: "mdi-information",
};

const VARIANT_TIMEOUTS: Record<ToastVariant, number> = {
  success: 4000,
  error: 6000,
  warning: 5000,
  info: 4000,
};

export const useToast = () => {
  const state = useToastState();

  function show(
    inLines: string | string[],
    options: {
      variant?: ToastVariant;
      timeout?: number;
      icon?: string;
    } = {}
  ) {
    const finalVariant = options.variant ?? "info";
    const lines = Array.isArray(inLines) ? inLines : [inLines];

    state.lines.value = lines;
    state.variant.value = finalVariant;
    state.timeout.value = options.timeout ?? VARIANT_TIMEOUTS[finalVariant];
    state.icon.value = options.icon ?? VARIANT_ICONS[finalVariant];
    state.visible.value = true;
  }

  const success = (message: string | string[]) => show(message, { variant: "success" });
  const error = (message: string | string[]) => show(message, { variant: "error" });
  const warning = (message: string | string[]) => show(message, { variant: "warning" });
  const info = (message: string | string[]) => show(message, { variant: "info" });

  function fromResponse(payload: unknown, statusCode?: number) {
    const { lines: normalizedLines } = normalizeBackendMessage(payload);
    const detectedVariant = pickToastType(statusCode);
    show(normalizedLines, { variant: detectedVariant });
  }

  const hide = () => (state.visible.value = false);
  const clear = () => {
    state.lines.value = [];
    state.visible.value = false;
  };

  return {
    success,
    error,
    warning,
    info,
    fromResponse,
    show,
    hide,
    clear,
    state: {
      lines: readonly(state.lines),
      variant: readonly(state.variant),
      visible: readonly(state.visible),
      timeout: readonly(state.timeout),
      icon: readonly(state.icon),
    },
  };
};

// Backward Compatibility
export const useSnackbar = () => {
  const toast = useToast();
  const state = useToastState();

  return {
    snackbar: {
      get show() { return state.visible.value; },
      set show(val: boolean) { state.visible.value = val; },
      get message() { return state.lines.value[0] || ""; },
      set message(val: string) { state.lines.value = [val]; },
      get color() { return state.variant.value; },
      set color(val: ToastVariant) { state.variant.value = val; },
      get timeout() { return state.timeout.value; },
      set timeout(val: number) { state.timeout.value = val; },
      get icon() { return state.icon.value; },
      set icon(val: string) { state.icon.value = val; },
    },
    showSuccess: toast.success,
    showError: toast.error,
    showWarning: toast.warning,
    showInfo: toast.info,
    hide: toast.hide,
  };
};
