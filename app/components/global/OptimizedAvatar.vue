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
interface Props {
  src?: string | null;
  alt?: string;
  size?: string | number;
  color?: string;
  fallbackIcon?: string;
  loading?: "lazy" | "eager";
  placeholder?: boolean;
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

const parsedSize = computed(() => typeof props.size === "number" ? props.size : parseInt(props.size.toString().replace(/\D/g, "")) || 48);
const iconSize = computed(() => Math.round(parsedSize.value * 0.7));
</script>

<style scoped>
/* تحسين عرض الصورة داخل Avatar */
.v-avatar img {
  object-fit: cover;
}
</style>
