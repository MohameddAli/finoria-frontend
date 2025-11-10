/**
 * Toast Plugin Type Definitions
 */

import type { useToast } from "~/composables/useToast";

declare module "#app" {
  interface NuxtApp {
    $toast: ReturnType<typeof useToast>;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $toast: ReturnType<typeof useToast>;
  }
}

export {};
