<template>
  <div class="auth-page">
    <!-- Background Pattern -->
    <div class="auth-background" />

    <v-container class="auth-container">
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" sm="10" md="8" lg="5" xl="4">
          <!-- Logo Section -->
          <div class="text-center mb-8">
            <v-avatar size="80" class="logo-avatar mb-4">
              <v-img src="/images/moamalatLogo.png" alt="Logo" cover />
            </v-avatar>
            <h1 class="text-h4 font-weight-bold mb-2">
              {{ $t("auth.login.welcome") }}
            </h1>
            <p class="text-body-1 text-medium-emphasis">
              {{ $t("auth.login.subtitle") }}
            </p>
          </div>

          <!-- Login Card -->
          <v-card class="auth-card" elevation="12" rounded="xl">
            <v-card-text class="pa-8">
              <v-form ref="formRef" @submit.prevent="handleLogin">
                <!-- Email Field -->
                <v-text-field
                  v-model="credentials.email"
                  :label="$t('auth.login.email')"
                  :rules="emailRules"
                  :error-messages="errors.email"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-email"
                  class="mb-4"
                  clearable
                  autofocus
                  :disabled="loading"
                />

                <!-- Password Field -->
                <v-text-field
                  v-model="credentials.password"
                  :label="$t('auth.login.password')"
                  :rules="passwordRules"
                  :error-messages="errors.password"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-lock"
                  class="mb-2"
                  :disabled="loading"
                  @click:append-inner="showPassword = !showPassword"
                />

                <!-- Remember Me & Forgot Password -->
                <div class="d-flex justify-space-between align-center mb-6">
                  <v-checkbox
                    v-model="rememberMe"
                    :label="$t('auth.login.rememberMe')"
                    color="primary"
                    density="compact"
                    hide-details
                    :disabled="loading"
                  />

                  <v-btn
                    variant="text"
                    color="primary"
                    size="small"
                    :disabled="loading"
                  >
                    {{ $t("auth.login.forgotPassword") }}
                  </v-btn>
                </div>

                <!-- Error Alert -->
                <v-alert
                  v-if="errorMessage"
                  type="error"
                  variant="tonal"
                  density="compact"
                  class="mb-4"
                  closable
                  @click:close="errorMessage = ''"
                >
                  {{ errorMessage }}
                </v-alert>

                <!-- Login Button -->
                <v-btn
                  type="submit"
                  color="primary"
                  size="x-large"
                  variant="elevated"
                  block
                  :loading="loading"
                  :disabled="loading"
                  class="mb-4 text-none font-weight-bold"
                  elevation="2"
                >
                  <v-icon start>mdi-login</v-icon>
                  {{ $t("auth.login.submit") }}
                </v-btn>

                <!-- Divider -->
                <v-divider class="my-6" />

                <!-- Register Link -->
                <div class="text-center">
                  <p class="text-body-2 text-medium-emphasis mb-2">
                    {{ $t("auth.login.noAccount") }}
                  </p>
                  <v-btn
                    variant="outlined"
                    color="primary"
                    size="large"
                    block
                    class="text-none"
                    :disabled="loading"
                    @click="goToRegister"
                  >
                    <v-icon start>mdi-account-plus</v-icon>
                    {{ $t("auth.login.createAccount") }}
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Footer Links -->
          <div class="text-center mt-6">
            <v-btn variant="text" size="small" color="primary" class="mx-2">
              {{ $t("auth.login.terms") }}
            </v-btn>
            <span class="text-medium-emphasis">•</span>
            <v-btn variant="text" size="small" color="primary" class="mx-2">
              {{ $t("auth.login.privacy") }}
            </v-btn>
            <span class="text-medium-emphasis">•</span>
            <v-btn variant="text" size="small" color="primary" class="mx-2">
              {{ $t("auth.login.help") }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { useAuthStore } from "~/stores/auth/storeAuth";

// 🎨 صفحة عامة بدون حماية
definePageMeta({
  layout: "empty",
});

const router = useRouter();
const authStore = useAuthStore();
const { t, locale } = useI18n();
const toast = useToast();

// Ensure proper dir based on current locale
useHead({
  htmlAttrs: {
    dir: () => (locale.value === "ar" ? "rtl" : "ltr"),
    lang: () => locale.value,
  },
});

// State
const formRef = ref();
const credentials = reactive({
  email: "",
  password: "",
});
const showPassword = ref(false);
const rememberMe = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const errors = reactive({
  email: "",
  password: "",
});

// Validation Rules
const emailRules = [
  (v) => !!v || t("auth.validation.emailRequired"),
  (v) => /.+@.+\..+/.test(v) || t("auth.validation.emailInvalid"),
];

const passwordRules = [
  (v) => !!v || t("auth.validation.passwordRequired"),
  (v) => v?.length >= 6 || t("auth.validation.passwordMin"),
];

// Methods
const handleLogin = async () => {
  // Reset errors
  errorMessage.value = "";
  errors.email = "";
  errors.password = "";

  // Validate form
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;

  try {
    // Login using authStore
    const success = await authStore.login({
      email: credentials.email,
      password: credentials.password,
    });

    if (!success) {
      const errorMsg = authStore.error || t("auth.errors.loginFailed");
      errorMessage.value = errorMsg;
      toast.error(errorMsg);
      return;
    }

    // Success toast
    toast.success(t("auth.login.success") || "تم تسجيل الدخول بنجاح");

    // Save remember me preference
    if (import.meta.client && rememberMe.value) {
      localStorage.setItem("remember_me", "true");
    }

    // إعادة التوجيه إلى /wallet أو الصفحة المحفوظة
    const redirectUrl = import.meta.client
      ? localStorage.getItem("auth_redirect_url") || "/wallet"
      : "/wallet";

    if (import.meta.client) {
      localStorage.removeItem("auth_redirect_url");
    }

    await router.push(redirectUrl);
  } catch (error) {
    console.error("Login error:", error);
    const errorMsg = error?.message || t("auth.errors.loginFailed");
    errorMessage.value = errorMsg;
    toast.error(errorMsg);
  } finally {
    loading.value = false;
  }
};

const goToRegister = () => {
  router.push("/auth/register");
};

// SEO
useHead({
  title: t("auth.login.title"),
  meta: [{ name: "description", content: t("auth.login.description") }],
});
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: rgb(var(--v-theme-background));
}

.auth-background {
  display: none;
}

.auth-container {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.logo-avatar {
  background: rgb(var(--v-theme-surface));
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.auth-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(var(--v-theme-surface), 0.98) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

/* RTL Support */
:deep(.v-field__prepend-inner) {
  margin-inline-end: 12px;
}

/* Animations */
.auth-card {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .auth-card :deep(.v-card-text) {
    padding: 24px !important;
  }

  .logo-avatar {
    width: 64px !important;
    height: 64px !important;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .auth-background,
  .auth-card {
    animation: none;
  }
}
</style>
