<template>
  <!-- نقل إلى body لضمان ظهور فوق جميع العناصر - Teleport to body for top-level display -->
  <Teleport to="body">
    <!-- انتقال سلس - Smooth transition -->
    <Transition name="progress-fade" appear>
      <!-- شريط التقدم العام - Global progress bar -->
      <div
        v-if="showBar"
        class="global-progress-bar"
        role="progressbar"
        aria-label="Loading progress"
        :aria-valuemin="0"
        :aria-valuemax="100"
        :aria-valuenow="progress"
      >
        <!-- الشريط المتحرك - Animated bar -->
        <div
          class="progress-bar-fill"
          :style="{
            width: `${progress}%`,
            backgroundColor: `rgb(var(--v-theme-${spinnerColor}))`,
          }"
        >
          <!-- تأثير لامع - Shine effect -->
          <div class="progress-shine" />
        </div>

        <!-- نص التحميل الاختياري - Optional loading text -->
        <div v-if="displayText && showText" class="progress-text">
          {{ displayText }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// الخصائص - Props
interface Props {
  showText?: boolean; // عرض النص
  autoProgress?: boolean; // تقدم تلقائي
}

const props = withDefaults(defineProps<Props>(), {
  showText: false,
  autoProgress: true,
});

// استيراد متجر التحميل - Import loading store
const loadingStore = useLoadingStore();

// الحالة المحلية - Local state
const progress = ref(0);
const showBar = ref(false); // التحكم في ظهور/إخفاء الشريط
let progressInterval: ReturnType<typeof setInterval> | null = null;
let hideTimeout: ReturnType<typeof setTimeout> | null = null;

// الخصائص المحسوبة - Computed properties
const isLoading = computed(() => loadingStore.isLoading);
const displayText = computed(() => loadingStore.loadingText);
const spinnerColor = computed(() => loadingStore.spinnerColor);

// دالة التقدم التلقائي - Auto progress function
const startAutoProgress = () => {
  progress.value = 0;

  if (!props.autoProgress) {
    progress.value = 100;
    return;
  }

  // تقدم سريع في البداية ثم يتباطأ - Fast start then slow down
  const speeds = [
    { until: 30, increment: 3, delay: 50 }, // سريع: 0-30%
    { until: 60, increment: 2, delay: 100 }, // متوسط: 30-60%
    { until: 80, increment: 1, delay: 200 }, // بطيء: 60-80%
    { until: 90, increment: 0.5, delay: 300 }, // بطيء جداً: 80-90%
  ];

  let currentSpeedIndex = 0;

  progressInterval = setInterval(() => {
    if (progress.value >= 90) {
      // توقف عند 90% حتى ينتهي التحميل فعلياً
      if (progressInterval) clearInterval(progressInterval);
      return;
    }

    const currentSpeed = speeds[currentSpeedIndex];
    if (!currentSpeed) return;

    if (progress.value >= currentSpeed.until) {
      currentSpeedIndex++;
      if (progressInterval) clearInterval(progressInterval);
      if (currentSpeedIndex < speeds.length) {
        const nextSpeed = speeds[currentSpeedIndex];
        if (nextSpeed) {
          progressInterval = setInterval(() => {
            progress.value = Math.min(progress.value + nextSpeed.increment, 90);
          }, nextSpeed.delay);
        }
      }
    } else {
      progress.value = Math.min(
        progress.value + currentSpeed.increment,
        currentSpeed.until
      );
    }
  }, speeds[0]!.delay);
};

// إتمام التقدم - Complete progress
const completeProgress = () => {
  // إيقاف التقدم التلقائي
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }

  // الوصول لـ 100% بسرعة
  const currentProgress = progress.value;
  const remaining = 100 - currentProgress;
  const steps = 10; // عدد الخطوات للوصول لـ 100%
  const increment = remaining / steps;
  let step = 0;

  const completeInterval = setInterval(() => {
    step++;
    progress.value = Math.min(currentProgress + increment * step, 100);

    if (progress.value >= 100 || step >= steps) {
      clearInterval(completeInterval);
      progress.value = 100;

      // إبقاء الشريط مرئياً لفترة قصيرة عند 100%
      hideTimeout = setTimeout(() => {
        showBar.value = false;
        // إعادة تعيين progress بعد الإخفاء
        setTimeout(() => {
          progress.value = 0;
        }, 300);
      }, 400); // 400ms لعرض الـ 100%
    }
  }, 20); // 20ms بين كل خطوة = 200ms إجمالي
};

// مراقبة حالة التحميل - Watch loading state
watch(
  isLoading,
  (loading) => {
    // إلغاء أي timeout للإخفاء
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    if (loading) {
      showBar.value = true;
      progress.value = 0;
      startAutoProgress();
    } else {
      completeProgress();
    }
  },
  { immediate: true }
);

// التنظيف عند إلغاء التركيب - Cleanup on unmount
onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval);
  }
  if (hideTimeout) {
    clearTimeout(hideTimeout);
  }
});
</script>

<style scoped>
.global-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 99999;
  overflow: hidden;
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

.progress-bar-fill {
  height: 100%;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 0 10px currentColor;
}

.progress-shine {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4) 50%,
    transparent
  );
  /* استخدم تحريك موضع الخلفية بدلاً من transform لتجنب تحريك المحتوى */
  background-size: 200% 100%;
  background-position: 0% 0;
  will-change: background-position;
  pointer-events: none;
  animation: shine-bg 1.5s linear infinite;
}

.progress-text {
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(var(--v-theme-surface), 0.95);
  color: rgb(var(--v-theme-on-surface));
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 99998;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  white-space: nowrap;
}

/* Animations - تحريك الخلفية بدل التحويل */
@keyframes shine-bg {
  0% {
    background-position: 0% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* انتقالات الظهور/الاختفاء - Enter/Leave transitions */
.progress-fade-enter-active,
.progress-fade-leave-active {
  transition: opacity 0.3s ease;
}

.progress-fade-enter-from,
.progress-fade-leave-to {
  opacity: 0;
}

/* RTL Support */
:global(.v-locale--is-rtl) .progress-shine {
  /* في RTL نحرك الخلفية بالعكس */
  animation: shine-bg-rtl 1.5s linear infinite;
}

@keyframes shine-bg-rtl {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: 0% 0;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .global-progress-bar {
    height: 4px;
    background: rgb(var(--v-theme-surface));
  }

  .progress-text {
    border: 2px solid rgb(var(--v-theme-primary));
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .progress-bar-fill {
    transition-duration: 0.1s;
  }

  .progress-shine {
    animation: none;
    background: transparent;
    background-position: 0 0;
  }

  .progress-fade-enter-active,
  .progress-fade-leave-active {
    transition-duration: 0.1s;
  }
}
</style>
