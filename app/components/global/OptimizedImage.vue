<template>
  <NuxtImg
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :fit="fit"
    :loading="loading"
    :placeholder="placeholder"
    :format="format"
    :quality="quality"
    :preset="preset"
    :sizes="responsiveSizes"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
/**
 * OptimizedImage - مكون صورة محسّن باستخدام NuxtImg
 *
 * يوفر تحسين تلقائي للصور مع دعم:
 * - تحويل تلقائي لـ WebP
 * - Lazy loading
 * - Responsive images
 * - Placeholder أثناء التحميل
 * - ضغط بجودة عالية
 *
 * @example
 * <!-- صورة عادية -->
 * <OptimizedImage
 *   src="/images/product.jpg"
 *   alt="Product name"
 *   width="400"
 *   height="300"
 * />
 *
 * <!-- صورة responsive -->
 * <OptimizedImage
 *   src="/images/banner.jpg"
 *   alt="Banner"
 *   width="1200"
 *   height="400"
 *   responsive
 * />
 *
 * <!-- صورة مهمة (above the fold) -->
 * <OptimizedImage
 *   src="/images/hero.jpg"
 *   alt="Hero image"
 *   width="1920"
 *   height="1080"
 *   loading="eager"
 *   priority
 * />
 */

interface Props {
  /** مسار الصورة */
  src: string;
  /** النص البديل (مطلوب للـ accessibility) */
  alt: string;
  /** عرض الصورة بالبكسل */
  width?: number | string;
  /** ارتفاع الصورة بالبكسل */
  height?: number | string;
  /** كيفية احتواء الصورة: cover (تغطية كاملة) أو contain (احتواء كامل) */
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  /** تحميل الصورة: lazy (افتراضي) أو eager (للصور المهمة) */
  loading?: "lazy" | "eager";
  /** عرض placeholder أثناء التحميل */
  placeholder?: boolean;
  /** صيغة الصورة (webp افتراضياً) */
  format?: "webp" | "png" | "jpg" | "jpeg" | "avif";
  /** جودة الضغط (1-100) */
  quality?: number;
  /** استخدام preset محدد من nuxt.config */
  preset?: "avatar" | "logo" | "thumbnail";
  /** تفعيل الصور responsive */
  responsive?: boolean;
  /** أولوية عالية (للصور المهمة فوق fold) */
  priority?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: undefined,
  height: undefined,
  fit: "cover",
  loading: "lazy",
  placeholder: true,
  format: "webp",
  quality: 80,
  preset: undefined,
  responsive: false,
  priority: false,
});

/**
 * إعدادات الصور responsive
 * تُستخدم فقط عند تفعيل responsive={true}
 */
const responsiveSizes = computed(() => {
  if (!props.responsive) return undefined;

  // أحجام responsive للشاشات المختلفة
  return "xs:100vw sm:640px md:768px lg:1024px xl:1280px";
});

/**
 * Override loading إذا كانت الأولوية عالية
 */
watchEffect(() => {
  if (props.priority && props.loading !== "eager") {
    console.warn(
      "OptimizedImage: priority={true} يتطلب loading='eager' للحصول على أفضل أداء"
    );
  }
});
</script>

<style scoped>
/* ضمان عدم تشوه الصورة */
img {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>
