<template>
  <div class="unauthorized-page">
    <!-- Background Pattern -->
    <div class="unauthorized-background" />

    <v-container class="unauthorized-container">
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" sm="10" md="8" lg="6" xl="5">
          <v-card
            class="unauthorized-card text-center"
            elevation="16"
            rounded="xl"
          >
            <v-card-text class="pa-10">
              <!-- Animated Icon -->
              <div class="icon-container mb-6">
                <div class="icon-circle">
                  <v-icon
                    size="80"
                    color="error"
                    class="lock-icon"
                  >
                    mdi-lock-alert-outline
                  </v-icon>
                </div>
                <div class="icon-pulse" />
              </div>

              <!-- Title -->
              <h1 class="text-h3 font-weight-bold mb-4 error-title">
                {{ $t('unauthorized.title') }}
              </h1>

              <!-- Message -->
              <p class="text-h6 text-medium-emphasis mb-6 px-md-6">
                {{ $t('unauthorized.message') }}
              </p>

              <!-- Countdown Circle -->
              <div class="countdown-section mb-8">
                <div class="countdown-wrapper">
                  <v-progress-circular
                    :model-value="progressValue"
                    :size="140"
                    :width="8"
                    color="primary"
                    class="countdown-circle"
                  >
                    <div class="countdown-content">
                      <div class="countdown-number">
                        {{ countdown }}
                      </div>
                      <div class="countdown-label">
                        {{ countdown === 1 ? $t('unauthorized.second') : $t('unauthorized.seconds') }}
                      </div>
                    </div>
                  </v-progress-circular>
                </div>
                
                <p class="text-body-1 text-medium-emphasis mt-6">
                  {{ $t('unauthorized.redirecting') }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="d-flex flex-column flex-md-row gap-3 justify-center mb-6">
                <v-btn
                  color="primary"
                  variant="elevated"
                  size="x-large"
                  prepend-icon="mdi-login"
                  class="flex-grow-1 text-none font-weight-bold"
                  @click="goToLogin"
                >
                  {{ $t('unauthorized.loginNow') }}
                </v-btn>

                <v-btn
                  color="secondary"
                  variant="outlined"
                  size="x-large"
                  prepend-icon="mdi-home"
                  class="flex-grow-1 text-none"
                  @click="goToHome"
                >
                  {{ $t('unauthorized.goHome') }}
                </v-btn>
              </div>

              <!-- Divider -->
              <v-divider class="my-6" />

              <!-- Register Prompt -->
              <div class="register-section">
                <p class="text-body-1 text-medium-emphasis mb-3">
                  {{ $t('unauthorized.noAccount') }}
                </p>
                <v-btn
                  variant="text"
                  color="primary"
                  size="large"
                  class="text-none font-weight-medium"
                  @click="goToRegister"
                >
                  <v-icon start>mdi-account-plus</v-icon>
                  {{ $t('unauthorized.register') }}
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </div>

              <!-- Help Section -->
              <div class="help-section mt-8">
                <v-expansion-panels
                  variant="accordion"
                  class="help-accordion"
                >
                  <v-expansion-panel
                    elevation="0"
                    :title="$t('unauthorized.needHelp')"
                  >
                    <v-expansion-panel-text>
                      <div class="text-start">
                        <p class="text-body-2 mb-3">
                          {{ $t('unauthorized.helpText') }}
                        </p>
                        <v-list density="compact">
                          <v-list-item
                            prepend-icon="mdi-email"
                            :title="$t('unauthorized.contactEmail')"
                            subtitle="support@company.com"
                          />
                          <v-list-item
                            prepend-icon="mdi-phone"
                            :title="$t('unauthorized.contactPhone')"
                            subtitle="+966 11 123 4567"
                          />
                          <v-list-item
                            prepend-icon="mdi-help-circle"
                            :title="$t('unauthorized.helpCenter')"
                            subtitle="/help"
                          />
                        </v-list>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
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
  layout: 'empty',
  middleware: []
})

const router = useRouter()
const { t, locale } = useI18n()

// Ensure proper dir based on current locale
useHead({
  htmlAttrs: {
    dir: () => (locale.value === 'ar' ? 'rtl' : 'ltr'),
    lang: () => locale.value
  }
})

// ⏱️ عداد تنازلي 5 ثوانٍ
const countdown = ref(5)
const progressValue = computed(() => (countdown.value / 5) * 100)

// 🔄 بدء العداد التنازلي (store interval id as number)
let intervalId = 0

onMounted(() => {
  // بدء العداد
  intervalId = window.setInterval(() => {
    countdown.value--
    
    // عند انتهاء العداد
    if (countdown.value <= 0) {
      if (intervalId) {
        window.clearInterval(intervalId)
      }
      redirectToLogin()
    }
  }, 1000)
})

onUnmounted(() => {
  // تنظيف العداد عند مغادرة الصفحة
  if (intervalId) {
    window.clearInterval(intervalId)
  }
})

// 🔐 إعادة التوجيه لصفحة تسجيل الدخول
const redirectToLogin = async () => {
  await router.push('/auth/login')
}

const goToLogin = async () => {
  // إيقاف العداد
  if (intervalId) {
    window.clearInterval(intervalId)
  }
  await redirectToLogin()
}

const goToHome = async () => {
  if (intervalId) {
    window.clearInterval(intervalId)
  }
  // إعادة التوجيه لصفحة تسجيل الدخول بدلاً من الصفحة الرئيسية
  await router.push('/auth/login')
}

const goToRegister = async () => {
  if (intervalId) {
    window.clearInterval(intervalId)
  }
  await router.push('/auth/register')
}

// SEO
useHead({
  title: t('unauthorized.title'),
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
.unauthorized-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #FFFFFF;
}

.unauthorized-background {
  display: none;
}

.unauthorized-container {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.unauthorized-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(var(--v-theme-surface), 0.98) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Icon Animation */
.icon-container {
  position: relative;
  display: inline-block;
}

.icon-circle {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 140px;
  background: linear-gradient(135deg, 
    rgba(var(--v-theme-error), 0.1), 
    rgba(var(--v-theme-error), 0.05));
  border-radius: 50%;
  border: 3px solid rgb(var(--v-theme-error));
}

.lock-icon {
  animation: shake 3s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% { 
    transform: rotate(0deg); 
  }
  10%, 30%, 50%, 70%, 90% { 
    transform: rotate(-5deg); 
  }
  20%, 40%, 60%, 80% { 
    transform: rotate(5deg); 
  }
}

.icon-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(var(--v-theme-error), 0.3);
  animation: pulse 2s ease-out infinite;
  z-index: 1;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.7;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

/* Title */
.error-title {
  color: rgb(var(--v-theme-error));
  text-shadow: 0 2px 8px rgba(var(--v-theme-error), 0.2);
}

/* Countdown */
.countdown-section {
  padding: 24px 0;
}

.countdown-wrapper {
  display: inline-block;
  position: relative;
}

.countdown-circle {
  box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.2);
  border-radius: 50%;
}

.countdown-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.countdown-number {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  color: rgb(var(--v-theme-primary));
  font-variant-numeric: tabular-nums;
}

.countdown-label {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
  line-height: 1;
  font-weight: 500;
}

/* Help Section */
.help-accordion {
  background: transparent !important;
}

.help-accordion :deep(.v-expansion-panel) {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 12px;
}

/* Responsive */
@media (max-width: 600px) {
  .unauthorized-card :deep(.v-card-text) {
    padding: 32px 24px !important;
  }
  
  .icon-circle {
    width: 120px;
    height: 120px;
  }
  
  .icon-circle .v-icon {
    font-size: 64px !important;
  }
  
  .icon-pulse {
    width: 120px;
    height: 120px;
  }
  
  .countdown-number {
    font-size: 3rem;
  }
  
  .error-title {
    font-size: 2rem !important;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .unauthorized-background,
  .unauthorized-card,
  .lock-icon,
  .icon-pulse {
    animation: none;
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .icon-circle {
    background: linear-gradient(135deg, 
      rgba(var(--v-theme-error), 0.2), 
      rgba(var(--v-theme-error), 0.1));
  }
}
</style>
