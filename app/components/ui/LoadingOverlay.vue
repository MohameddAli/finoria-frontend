<template>
  <!-- نقل إلى body لضمان ظهور فوق جميع العناصر - Teleport to body for top-level display -->
  <Teleport to="body">
    <!-- انتقال فوري في الظهور، سلس في الاختفاء - Instant appear, smooth disappear -->
    <Transition
      name="loading-overlay"
      appear
      :duration="{ enter: 0, leave: 300 }"
    >
      <!-- الغطاء العام للتحميل - Global loading overlay -->
      <div
        v-if="isVisible"
        class="global-loading-overlay"
      >
        <!-- محتوى التحميل - Loading content -->
        <div class="loading-content">
          <!-- مؤشر التحميل الحديث - Modern spinner -->
          <div class="spinner-container">
            <div
              class="modern-spinner"
              :style="{
                borderTopColor: `rgb(var(--v-theme-${spinnerColor}))`,
                borderRightColor: `rgba(var(--v-theme-${spinnerColor}), 0.3)`,
              }"
            />
          </div>

          <!-- نص التحميل - Loading text -->
          <div v-if="displayText" class="loading-text">
            {{ displayText }}
          </div>

          <!-- نقاط التقدم - Progress dots -->
          <div class="loading-dots">
            <span
              v-for="i in 3"
              :key="i"
              class="dot"
              :style="{
                backgroundColor: `rgba(var(--v-theme-${spinnerColor}), 0.6)`,
                animationDelay: `${(i - 1) * 0.15}s`,
              }"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// استيراد متجر التحميل - Import loading store
const loadingStore = useLoadingStore();

// الخصائص المحسوبة - Computed properties
const isVisible = computed(() => loadingStore.isLoading);     // هل التحميل مرئي
const displayText = computed(() => loadingStore.loadingText);  // النص المعروض
const spinnerColor = computed(() => loadingStore.spinnerColor); // لون المؤشر

// تنظيف العمليات القديمة دورياً - Periodic cleanup of old operations
let cleanupInterval: ReturnType<typeof setInterval>;

// عند تركيب المكون - On component mount
onMounted(() => {
  // بدء تنظيف دوري كل 10 ثواني - Start periodic cleanup every 10 seconds
  cleanupInterval = setInterval(() => {
    loadingStore.cleanupOldOperations();
  }, 10000);
});

// عند إلغاء تركيب المكون - On component unmount
onUnmounted(() => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);        // إيقاف التنظيف الدوري
  }
});
</script>

<style scoped>
.global-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 99999; /* Increased z-index to ensure it appears above everything */
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  pointer-events: all;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  max-width: 300px;
}

.spinner-container {
  position: relative;
  width: 64px;
  height: 64px;
  margin-bottom: 1.5rem;
}

.modern-spinner {
  width: 64px;
  height: 64px;
  border: 4px solid transparent;
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  position: relative;
}

.modern-spinner::before {
  content: "";
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 4px solid transparent;
  border-top-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: spin 2s linear infinite reverse;
}

.loading-text {
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  line-height: 1.4;
}

.loading-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: dot-pulse 1.4s ease-in-out infinite both;
}

/* Animations */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dot-pulse {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* انتقالات الظهور/الاختفاء - Enter/Leave transitions */
.loading-overlay-enter-active {
  transition: none; /* ظهور فوري */
}

.loading-overlay-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* اختفاء سلس */
}

.loading-overlay-enter-from {
  opacity: 1; /* ظهور بشفافية كاملة */
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transform: scale(1);
}

.loading-overlay-enter-to {
  opacity: 1;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transform: scale(1);
}

.loading-overlay-leave-from {
  opacity: 1;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transform: scale(1);
}

.loading-overlay-leave-to {
  opacity: 0; /* اختفاء كامل */
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  transform: scale(1.05); /* توسع طفيف */
}


/* Responsive Design */
@media (max-width: 480px) {
  .loading-content {
    padding: 1.5rem;
    max-width: 250px;
  }

  .spinner-container {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
  }

  .modern-spinner {
    width: 48px;
    height: 48px;
  }

  .loading-text {
    font-size: 1rem;
  }
}

/* Accessibility - Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .modern-spinner,
  .modern-spinner::before {
    animation-duration: 3s;
  }

  .dot {
    animation-duration: 2s;
  }

  .loading-fade-enter-active,
  .loading-fade-leave-active {
    transition-duration: 0.1s;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .global-loading-overlay {
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .loading-text {
    color: white;
    text-shadow: none;
    font-weight: 600;
  }
}
</style>
