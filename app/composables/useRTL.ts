/**
 * useRTL Composable
 * 
 * نظام مركزي للكشف التلقائي عن اتجاه اللغة (RTL/LTR) وتوفير أدوات مساعدة
 * للتعامل مع الأيقونات، القوائم، والمحاذاة بشكل ديناميكي
 * 
 * @example
 * ```vue
 * <script setup>
 * const { isRTL, isLTR, getDirectionalIcon, getMenuLocation } = useRTL()
 * 
 * const chevronIcon = getDirectionalIcon('mdi-chevron-left', 'mdi-chevron-right')
 * const menuPos = getMenuLocation('bottom end', 'bottom start')
 * </script>
 * ```
 */

import type { ComputedRef } from 'vue'

export interface RTLHelpers {
  /** هل الاتجاه الحالي RTL؟ */
  isRTL: ComputedRef<boolean>
  /** هل الاتجاه الحالي LTR؟ */
  isLTR: ComputedRef<boolean>
  /** اللغة الحالية */
  currentLocale: ComputedRef<string>
  /** اتجاه النص (rtl أو ltr) */
  direction: ComputedRef<'rtl' | 'ltr'>
  
  /**
   * الحصول على الأيقونة المناسبة بناءً على الاتجاه
   * @param ltrIcon - الأيقونة في حالة LTR
   * @param rtlIcon - الأيقونة في حالة RTL (اختياري، افتراضياً نفس ltrIcon)
   * @returns الأيقونة المناسبة
   */
  getDirectionalIcon: (ltrIcon: string, rtlIcon?: string) => ComputedRef<string>
  
  /**
   * الحصول على class CSS المناسب بناءً على الاتجاه
   * @param ltrClass - الـ class في حالة LTR
   * @param rtlClass - الـ class في حالة RTL
   * @returns الـ class المناسب
   */
  getDirectionalClass: (ltrClass: string, rtlClass: string) => ComputedRef<string>
  
  /**
   * الحصول على موقع القائمة المنسدلة المناسب
   * @param ltrLocation - الموقع في حالة LTR (مثل: 'bottom end')
   * @param rtlLocation - الموقع في حالة RTL (مثل: 'bottom start')
   * @returns الموقع المناسب
   */
  getMenuLocation: (
    ltrLocation: string,
    rtlLocation?: string
  ) => ComputedRef<string>
  
  /**
   * الحصول على محاذاة النص المناسبة
   * @param alignment - المحاذاة المطلوبة ('start' أو 'end')
   * @returns المحاذاة المناسبة للاتجاه الحالي
   */
  getTextAlignment: (alignment: 'start' | 'end') => ComputedRef<'left' | 'right'>
  
  /**
   * تبديل الأيقونات المعكوسة تلقائياً (مثل الأسهم)
   * @param iconName - اسم الأيقونة
   * @returns الأيقونة المعدلة للاتجاه الحالي
   */
  flipIcon: (iconName: string) => ComputedRef<string>
}

/**
 * خريطة للأيقونات التي تحتاج للتبديل في RTL
 */
const DIRECTIONAL_ICONS: Record<string, string> = {
  'mdi-chevron-left': 'mdi-chevron-right',
  'mdi-chevron-right': 'mdi-chevron-left',
  'mdi-arrow-left': 'mdi-arrow-right',
  'mdi-arrow-right': 'mdi-arrow-left',
  'mdi-menu-left': 'mdi-menu-right',
  'mdi-menu-right': 'mdi-menu-left',
  'mdi-page-first': 'mdi-page-last',
  'mdi-page-last': 'mdi-page-first',
  'mdi-format-indent-increase': 'mdi-format-indent-decrease',
  'mdi-format-indent-decrease': 'mdi-format-indent-increase',
  'mdi-subdirectory-arrow-left': 'mdi-subdirectory-arrow-right',
  'mdi-subdirectory-arrow-right': 'mdi-subdirectory-arrow-left',
}

/**
 * Composable للكشف التلقائي عن RTL وتوفير أدوات مساعدة
 */
export function useRTL(): RTLHelpers {
  const { locale } = useI18n()
  
  // الحالة الأساسية
  const isRTL = computed(() => locale.value === 'ar')
  const isLTR = computed(() => !isRTL.value)
  const currentLocale = computed(() => locale.value)
  const direction = computed<'rtl' | 'ltr'>(() => isRTL.value ? 'rtl' : 'ltr')
  
  /**
   * الحصول على الأيقونة المناسبة
   */
  function getDirectionalIcon(
    ltrIcon: string,
    rtlIcon?: string
  ): ComputedRef<string> {
    return computed(() => {
      if (isRTL.value) {
        // إذا تم توفير أيقونة RTL محددة، استخدمها
        if (rtlIcon) return rtlIcon
        
        // وإلا حاول الحصول على الأيقونة المعكوسة من الخريطة
        return DIRECTIONAL_ICONS[ltrIcon] || ltrIcon
      }
      return ltrIcon
    })
  }
  
  /**
   * الحصول على class المناسب
   */
  function getDirectionalClass(
    ltrClass: string,
    rtlClass: string
  ): ComputedRef<string> {
    return computed(() => isRTL.value ? rtlClass : ltrClass)
  }
  
  /**
   * الحصول على موقع القائمة المناسب
   */
  function getMenuLocation(
    ltrLocation: string,
    rtlLocation?: string
  ): ComputedRef<string> {
    return computed(() => {
      if (isRTL.value) {
        // إذا تم توفير موقع RTL، استخدمه
        if (rtlLocation) return rtlLocation
        
        // وإلا حاول التبديل التلقائي
        return ltrLocation
          .replace('end', 'temp')
          .replace('start', 'end')
          .replace('temp', 'start')
          .replace('right', 'temp')
          .replace('left', 'right')
          .replace('temp', 'left')
      }
      return ltrLocation
    })
  }
  
  /**
   * الحصول على محاذاة النص
   */
  function getTextAlignment(
    alignment: 'start' | 'end'
  ): ComputedRef<'left' | 'right'> {
    return computed(() => {
      if (alignment === 'start') {
        return isRTL.value ? 'right' : 'left'
      }
      return isRTL.value ? 'left' : 'right'
    })
  }
  
  /**
   * تبديل الأيقونة إذا لزم الأمر
   */
  function flipIcon(iconName: string): ComputedRef<string> {
    return computed(() => {
      if (isRTL.value && DIRECTIONAL_ICONS[iconName]) {
        return DIRECTIONAL_ICONS[iconName]
      }
      return iconName
    })
  }
  
  return {
    isRTL,
    isLTR,
    currentLocale,
    direction,
    getDirectionalIcon,
    getDirectionalClass,
    getMenuLocation,
    getTextAlignment,
    flipIcon,
  }
}

/**
 * نسخة مختصرة من الـ composable لاستخدامات بسيطة
 * @returns isRTL فقط
 */
export function useIsRTL(): ComputedRef<boolean> {
  const { locale } = useI18n()
  return computed(() => locale.value === 'ar')
}

/**
 * Helper function للحصول على أيقونة chevron المناسبة
 * @param direction - الاتجاه المطلوب ('collapse' أو 'expand' أو 'next' أو 'prev')
 * @returns الأيقونة المناسبة
 */
export function useChevronIcon(
  direction: 'collapse' | 'expand' | 'next' | 'prev'
): ComputedRef<string> {
  const { isRTL } = useRTL()
  
  return computed(() => {
    const icons = {
      collapse: isRTL.value ? 'mdi-chevron-right' : 'mdi-chevron-left',
      expand: isRTL.value ? 'mdi-chevron-left' : 'mdi-chevron-right',
      next: isRTL.value ? 'mdi-chevron-left' : 'mdi-chevron-right',
      prev: isRTL.value ? 'mdi-chevron-right' : 'mdi-chevron-left',
    }
    return icons[direction]
  })
}

