<template>
  <div class="auth-page">
    <!-- Background Pattern -->
    <div class="auth-background" />

    <v-container class="auth-container">
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" sm="10" md="8" lg="6" xl="5">
          <!-- Logo Section -->
          <div class="text-center mb-6">
            <v-avatar size="70" class="logo-avatar mb-3">
              <v-img src="/images/moamalatLogo.png" alt="Logo" cover />
            </v-avatar>
            <h1 class="text-h4 font-weight-bold mb-2">
              {{ $t("auth.register.welcome") }}
            </h1>
            <p class="text-body-1 text-medium-emphasis">
              {{ $t("auth.register.subtitle") }}
            </p>
          </div>

          <!-- Register Card -->
          <v-card class="auth-card" elevation="12" rounded="xl">
            <v-card-text class="pa-8">
              <v-form ref="formRef" @submit.prevent="handleRegister">
                <v-row>
                  <!-- Full Name -->
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.name"
                      :label="$t('auth.register.fullName')"
                      :rules="nameRules"
                      variant="outlined"
                      color="primary"
                      prepend-inner-icon="mdi-account"
                      clearable
                      autofocus
                      :disabled="loading"
                    />
                  </v-col>

                  <!-- Username -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.username"
                      :label="$t('auth.register.username')"
                      :rules="usernameRules"
                      variant="outlined"
                      color="primary"
                      prepend-inner-icon="mdi-at"
                      clearable
                      :disabled="loading"
                    />
                  </v-col>

                  <!-- Email -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.email"
                      :label="$t('auth.register.email')"
                      :rules="emailRules"
                      type="email"
                      variant="outlined"
                      color="primary"
                      prepend-inner-icon="mdi-email"
                      clearable
                      :disabled="loading"
                    />
                  </v-col>

                  <!-- Password -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.password"
                      :label="$t('auth.register.password')"
                      :rules="passwordRules"
                      :type="showPassword ? 'text' : 'password'"
                      :append-inner-icon="
                        showPassword ? 'mdi-eye-off' : 'mdi-eye'
                      "
                      variant="outlined"
                      color="primary"
                      prepend-inner-icon="mdi-lock"
                      :disabled="loading"
                      @click:append-inner="showPassword = !showPassword"
                    >
                      <template #details>
                        <div class="password-strength mt-1">
                          <v-progress-linear
                            :model-value="passwordStrength"
                            :color="passwordStrengthColor"
                            height="4"
                            rounded
                          />
                          <span class="text-caption mt-1">
                            {{ passwordStrengthText }}
                          </span>
                        </div>
                      </template>
                    </v-text-field>
                  </v-col>

                  <!-- Confirm Password -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.confirmPassword"
                      :label="$t('auth.register.confirmPassword')"
                      :rules="confirmPasswordRules"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      :append-inner-icon="
                        showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'
                      "
                      variant="outlined"
                      color="primary"
                      prepend-inner-icon="mdi-lock-check"
                      :disabled="loading"
                      @click:append-inner="
                        showConfirmPassword = !showConfirmPassword
                      "
                    />
                  </v-col>

                  <!-- Terms & Conditions -->
                  <v-col cols="12">
                    <v-checkbox
                      v-model="form.acceptTerms"
                      :rules="termsRules"
                      color="primary"
                      density="compact"
                      :disabled="loading"
                    >
                      <template #label>
                        <span class="text-body-2">
                          {{ $t("auth.register.acceptTermsPrefix") }}
                          <v-btn
                            variant="text"
                            color="primary"
                            size="small"
                            class="pa-0 text-none"
                            style="vertical-align: baseline; height: auto"
                          >
                            {{ $t("auth.register.termsLink") }}
                          </v-btn>
                          {{ $t("auth.register.acceptTermsAnd") }}
                          <v-btn
                            variant="text"
                            color="primary"
                            size="small"
                            class="pa-0 text-none"
                            style="vertical-align: baseline; height: auto"
                          >
                            {{ $t("auth.register.privacyLink") }}
                          </v-btn>
                        </span>
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>

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

                <!-- Success Alert -->
                <v-alert
                  v-if="successMessage"
                  type="success"
                  variant="tonal"
                  density="compact"
                  class="mb-4"
                  closable
                  @click:close="successMessage = ''"
                >
                  {{ successMessage }}
                </v-alert>

                <!-- Register Button -->
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
                  <v-icon start>mdi-account-plus</v-icon>
                  {{ $t("auth.register.submit") }}
                </v-btn>

                <!-- Divider -->
                <v-divider class="my-4" />

                <!-- Login Link -->
                <div class="text-center">
                  <p class="text-body-2 text-medium-emphasis mb-2">
                    {{ $t("auth.register.hasAccount") }}
                  </p>
                  <v-btn
                    variant="outlined"
                    color="primary"
                    size="large"
                    block
                    class="text-none"
                    :disabled="loading"
                    @click="goToLogin"
                  >
                    <v-icon start>mdi-login</v-icon>
                    {{ $t("auth.register.loginNow") }}
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
// 🎨 صفحة عامة بدون حماية
definePageMeta({
  layout: "empty",
});

const router = useRouter();
const toast = useToast();
const { t, locale } = useI18n();

// Ensure proper dir based on current locale
useHead({
  htmlAttrs: {
    dir: () => (locale.value === "ar" ? "rtl" : "ltr"),
    lang: () => locale.value,
  },
});

// State
const formRef = ref();
const form = reactive({
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
});
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// Password Strength Calculator
const passwordStrength = computed(() => {
  const password = form.password;
  if (!password) return 0;

  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 25;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
  if (/\d/.test(password)) strength += 12.5;
  if (/[^a-zA-Z\d]/.test(password)) strength += 12.5;

  return Math.min(strength, 100);
});

const passwordStrengthColor = computed(() => {
  if (passwordStrength.value < 25) return "error";
  if (passwordStrength.value < 50) return "warning";
  if (passwordStrength.value < 75) return "info";
  return "success";
});

const passwordStrengthText = computed(() => {
  if (passwordStrength.value < 25) return t("auth.register.passwordWeak");
  if (passwordStrength.value < 50) return t("auth.register.passwordFair");
  if (passwordStrength.value < 75) return t("auth.register.passwordGood");
  return t("auth.register.passwordStrong");
});

// Validation Rules
const nameRules = [
  (v: string) => !!v || t("auth.validation.nameRequired"),
  (v: string) => v?.length >= 3 || t("auth.validation.nameMin"),
];

const usernameRules = [
  (v: string) => !!v || t("auth.validation.usernameRequired"),
  (v: string) => v?.length >= 3 || t("auth.validation.usernameMin"),
  (v: string) =>
    /^[a-zA-Z0-9_]+$/.test(v) || t("auth.validation.usernameInvalid"),
];

const emailRules = [
  (v: string) => !!v || t("auth.validation.emailRequired"),
  (v: string) => /.+@.+\..+/.test(v) || t("auth.validation.emailInvalid"),
];

const passwordRules = [
  (v: string) => !!v || t("auth.validation.passwordRequired"),
  (v: string) => v?.length >= 8 || t("auth.validation.passwordMinLength"),
];

const confirmPasswordRules = [
  (v: string) => !!v || t("auth.validation.confirmPasswordRequired"),
  (v: string) => v === form.password || t("auth.validation.passwordMismatch"),
];

const termsRules = [(v: boolean) => !!v || t("auth.validation.termsRequired")];

// Methods
const handleRegister = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  // Validate form
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;

  try {
    // TODO: استبدل هذا بـ API call حقيقي
    // await authStore.register(form)

    // محاكاة التسجيل للتطوير
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const successMsg = t("auth.register.success");
    successMessage.value = successMsg;
    toast.success(successMsg);

    // إعادة التوجيه لصفحة تسجيل الدخول بعد 2 ثانية
    setTimeout(() => {
      router.push("/auth/login");
    }, 2000);
  } catch (error: any) {
    console.error("Register error:", error);
    const errorMsg = error?.message || t("auth.errors.registerFailed");
    errorMessage.value = errorMsg;
    toast.error(errorMsg);
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push("/auth/login");
};

// SEO
useHead({
  title: t("auth.register.title"),
  meta: [{ name: "description", content: t("auth.register.description") }],
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
  padding: 32px 0;
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

.password-strength {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  .auth-page {
    padding: 16px 0;
  }

  .auth-card :deep(.v-card-text) {
    padding: 24px !important;
  }

  .logo-avatar {
    width: 56px !important;
    height: 56px !important;
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
