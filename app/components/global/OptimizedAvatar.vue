<template>
  <v-avatar :size="size" :color="color" v-bind="$attrs">
    <NuxtImg
      v-if="src"
      :src="src"
      :alt="alt"
      :width="parsedSize"
      :height="parsedSize"
      fit="cover"
      :loading="loading"
      :placeholder="placeholder"
      :preset="preset"
      format="webp"
    />
    <v-icon v-else :size="iconSize">{{ fallbackIcon }}</v-icon>
  </v-avatar>
</template>

<script setup lang="ts">
/**
 * OptimizedAvatar - مكون Avatar محسّن باستخدام NuxtImg
 *
 * @example
 * <OptimizedAvatar
 *   :src="user.avatarUrl"
 *   :alt="user.name"
 *   size="96"
 * />
 */

interface Props {
  /** مسار الصورة - يدعم مسارات محلية وخارجية */
  src?: string | null;
  /** النص البديل للصورة (مهم للـ accessibility) */
  alt?: string;
  /** حجم الـ Avatar - يقبل رقم أو string (مثل "96" أو "96px") */
  size?: string | number;
  /** لون الخلفية عند عدم وجود صورة */
  color?: string;
  /** أيقونة احتياطية عند عدم وجود صورة */
  fallbackIcon?: string;
  /** تحميل الصورة: eager للصور المهمة أو lazy للصور أسفل الصفحة */
  loading?: "lazy" | "eager";
  /** عرض placeholder أثناء التحميل */
  placeholder?: boolean;
  /** استخدام preset محدد من nuxt.config (avatar, logo, thumbnail) */
  preset?: "avatar" | "logo" | "thumbnail";
}

const props = withDefaults(defineProps<Props>(), {
  alt: "User avatar",
  size: 48,
  color: "grey",
  fallbackIcon: "mdi-account",
  loading: "lazy",
  placeholder: true,
  preset: "avatar",
});

/**
 * تحويل size إلى رقم صحيح
 */
const parsedSize = computed(() => {
  if (typeof props.size === "number") return props.size;
  return parseInt(props.size.toString().replace(/\D/g, "")) || 48;
});

/**
 * حجم الأيقونة الاحتياطية (70% من حجم الـ Avatar)
 */
const iconSize = computed(() => Math.round(parsedSize.value * 0.7));
</script>

<style scoped>
/* تحسين عرض الصورة داخل Avatar */
.v-avatar img {
  object-fit: cover;
}
</style>
