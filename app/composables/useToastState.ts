/**
 * 🍞 Toast State Management - Nuxt 4
 * Global State using Nuxt useState API
 */

import type { ToastVariant } from "~~/shared/utils/toast";

export const useToastState = () => ({
  lines: useState<string[]>("toast:lines", () => []),
  variant: useState<ToastVariant>("toast:variant", () => "info"),
  visible: useState<boolean>("toast:visible", () => false),
  timeout: useState<number>("toast:timeout", () => 4000),
  icon: useState<string>("toast:icon", () => "mdi-information"),
});
