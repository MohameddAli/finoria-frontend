import type { ComputedRef } from "vue";

export interface RTLHelpers {
  isRTL: ComputedRef<boolean>;
  isLTR: ComputedRef<boolean>;
  currentLocale: ComputedRef<string>;
  direction: ComputedRef<"rtl" | "ltr">;
  getDirectionalIcon: (ltrIcon: string, rtlIcon?: string) => ComputedRef<string>;
  getDirectionalClass: (ltrClass: string, rtlClass: string) => ComputedRef<string>;
  getMenuLocation: (ltrLocation: string, rtlLocation?: string) => ComputedRef<string>;
  getTextAlignment: (alignment: "start" | "end") => ComputedRef<"left" | "right">;
  flipIcon: (iconName: string) => ComputedRef<string>;
}

const DIRECTIONAL_ICONS: Record<string, string> = {
  "mdi-chevron-left": "mdi-chevron-right",
  "mdi-chevron-right": "mdi-chevron-left",
  "mdi-arrow-left": "mdi-arrow-right",
  "mdi-arrow-right": "mdi-arrow-left",
  "mdi-menu-left": "mdi-menu-right",
  "mdi-menu-right": "mdi-menu-left",
  "mdi-page-first": "mdi-page-last",
  "mdi-page-last": "mdi-page-first",
  "mdi-format-indent-increase": "mdi-format-indent-decrease",
  "mdi-format-indent-decrease": "mdi-format-indent-increase",
  "mdi-subdirectory-arrow-left": "mdi-subdirectory-arrow-right",
  "mdi-subdirectory-arrow-right": "mdi-subdirectory-arrow-left",
};

export function useRTL(): RTLHelpers {
  const { locale } = useI18n();

  const isRTL = computed(() => locale.value === "ar");
  const isLTR = computed(() => !isRTL.value);
  const currentLocale = computed(() => locale.value);
  const direction = computed<"rtl" | "ltr">(() => (isRTL.value ? "rtl" : "ltr"));

  const getDirectionalIcon = (ltrIcon: string, rtlIcon?: string): ComputedRef<string> =>
    computed(() => (isRTL.value ? rtlIcon || DIRECTIONAL_ICONS[ltrIcon] || ltrIcon : ltrIcon));

  const getDirectionalClass = (ltrClass: string, rtlClass: string): ComputedRef<string> =>
    computed(() => (isRTL.value ? rtlClass : ltrClass));

  const getMenuLocation = (ltrLocation: string, rtlLocation?: string): ComputedRef<string> =>
    computed(() => {
      if (!isRTL.value) return ltrLocation;
      if (rtlLocation) return rtlLocation;
      return ltrLocation
        .replace("end", "temp")
        .replace("start", "end")
        .replace("temp", "start")
        .replace("right", "temp")
        .replace("left", "right")
        .replace("temp", "left");
    });

  const getTextAlignment = (alignment: "start" | "end"): ComputedRef<"left" | "right"> =>
    computed(() => {
      if (alignment === "start") return isRTL.value ? "right" : "left";
      return isRTL.value ? "left" : "right";
    });

  const flipIcon = (iconName: string): ComputedRef<string> =>
    computed(() => (isRTL.value && DIRECTIONAL_ICONS[iconName] ? DIRECTIONAL_ICONS[iconName] : iconName));

  return { isRTL, isLTR, currentLocale, direction, getDirectionalIcon, getDirectionalClass, getMenuLocation, getTextAlignment, flipIcon };
}

export function useIsRTL(): ComputedRef<boolean> {
  const { locale } = useI18n();
  return computed(() => locale.value === "ar");
}

export function useChevronIcon(direction: "collapse" | "expand" | "next" | "prev"): ComputedRef<string> {
  const { isRTL } = useRTL();
  return computed(() => {
    const icons = {
      collapse: isRTL.value ? "mdi-chevron-right" : "mdi-chevron-left",
      expand: isRTL.value ? "mdi-chevron-left" : "mdi-chevron-right",
      next: isRTL.value ? "mdi-chevron-left" : "mdi-chevron-right",
      prev: isRTL.value ? "mdi-chevron-right" : "mdi-chevron-left",
    };
    return icons[direction];
  });
}

