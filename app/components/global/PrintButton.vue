<template>
  <v-btn
    color="blue-grey"
    class="text-white"
    type="button"
    variant="flat"
    prepend-icon="mdi-printer"
    rounded="lg"
    size="small"
    @click="openPrintWindow"
  >
    {{ t("common.print") }}
  </v-btn>
</template>

<script setup>
const { t } = useI18n();

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  filter: {
    type: Object,
    default: () => ({}),
  },
});

const config = useRuntimeConfig();
const authStore = useAuthStore();

const fullUrl = computed(() => {
  const params = { ...(props.filter ?? {}) };

  // include auth token if needed by backend
  if (authStore.token) {
    params._token = authStore.token;
  }

  let serverUrl = config.public.apiBase || "";

  // إذا لم يكن هناك serverUrl، استخدم window.location.origin
  if (!serverUrl && typeof window !== "undefined") {
    serverUrl = window.location.origin;
  }

  if (serverUrl.endsWith("/api")) {
    serverUrl = serverUrl.slice(0, -4);
  }

  const queryString = new URLSearchParams(params).toString();
  const printUrl = `${serverUrl}/print/${props.url}`;

  return queryString ? `${printUrl}?${queryString}` : printUrl;
});

const openPrintWindow = () => {
  // Ensure we're in browser environment
  if (typeof window !== "undefined") {
    window.open(fullUrl.value, "_blank");
  }
};
</script>

<style scoped>
.v-btn {
  text-transform: none;
  font-weight: 500;
  border-radius: 12px;
}
</style>
