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
interface Props {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  loading?: "lazy" | "eager";
  placeholder?: boolean;
  format?: "webp" | "png" | "jpg" | "jpeg" | "avif";
  quality?: number;
  preset?: "avatar" | "logo" | "thumbnail";
  responsive?: boolean;
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

const responsiveSizes = computed(() => props.responsive ? "xs:100vw sm:640px md:768px lg:1024px xl:1280px" : undefined);

watchEffect(() => {
  if (props.priority && props.loading !== "eager") {
    console.warn("OptimizedImage: priority={true} يتطلب loading='eager' للحصول على أفضل أداء");
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
