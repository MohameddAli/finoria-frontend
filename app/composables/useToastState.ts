/**
 * 🍞 Toast State Management - Nuxt 4
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Global State لنظام Toast باستخدام Nuxt 4 useState API
 *
 * Features:
 * - Multi-line messages support
 * - Variant types (success, error, warning, info)
 * - Auto-hide timeout
 * - Icon customization
 * - SSR-safe state management
 *
 * @example
 * const { lines, variant, visible } = useToastState()
 *
 * lines.value = ['تم الحفظ بنجاح', 'سيتم إعادة التوجيه خلال ثوانٍ']
 * variant.value = 'success'
 * visible.value = true
 */

import type { ToastVariant } from "~~/shared/utils/toast";

/**
 * Global Toast State - using Nuxt 4 useState
 */
export const useToastState = () => {
  // Multiple lines of text to display in toast
  const lines = useState<string[]>("toast:lines", () => []);

  // Variant type (success, error, warning, info)
  const variant = useState<ToastVariant>("toast:variant", () => "info");

  // Visibility state
  const visible = useState<boolean>("toast:visible", () => false);

  // Auto-hide timeout in milliseconds
  const timeout = useState<number>("toast:timeout", () => 4000);

  // Icon to display (optional, can be auto-determined by variant)
  const icon = useState<string>("toast:icon", () => "mdi-information");

  return {
    lines,
    variant,
    visible,
    timeout,
    icon,
  };
};
