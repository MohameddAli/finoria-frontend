<template>
  <v-container class="loading-test-page">
    <v-row>
      <v-col cols="12">
        <v-card class="pa-6">
          <v-card-title>
            <h2 class="text-h4 mb-4">{{ $t('pages.loadingTest.title') }}</h2>
          </v-card-title>

          <v-card-text>
            <div class="test-controls">
              <!-- معلومات الحالة الحالية -->
              <v-alert
                v-if="loading.isLoading.value"
                type="info"
                variant="tonal"
                class="mb-4"
              >
                <strong>{{ $t('pages.loadingTest.loadingStatus') }}:</strong> {{ $t('pages.loadingTest.loadingActive') }}
                <br />
                <strong>{{ $t('pages.loadingTest.loadingText') }}:</strong> {{ loading.loadingText.value }}
                <br />
                <strong>{{ $t('pages.loadingTest.operationsCount') }}:</strong>
                {{ loading.operationsCount.value }}
              </v-alert>

              <v-alert v-else type="success" variant="tonal" class="mb-4">
                {{ $t('pages.loadingTest.noActiveLoading') }}
              </v-alert>

              <!-- أزرار الاختبار الأساسية -->
              <v-row class="mb-4">
                <v-col cols="12" md="6">
                  <v-btn
                    :disabled="loading.isLoading.value"
                    color="primary"
                    block
                    @click="testBasicLoading"
                  >
                    {{ $t('pages.loadingTest.basicLoadingTest') }}
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn
                    :disabled="loading.isLoading.value"
                    color="secondary"
                    block
                    @click="testApiLoading"
                  >
                    {{ $t('pages.loadingTest.apiLoadingTest') }}
                  </v-btn>
                </v-col>
              </v-row>

              <!-- أزرار الاختبار المتقدمة -->
              <v-row class="mb-4">
                <v-col cols="12" md="6">
                  <v-btn
                    :disabled="loading.isLoading.value"
                    color="orange"
                    block
                    @click="testProgressiveLoading"
                  >
                    اختبار التحميل المتدرج
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn
                    :disabled="loading.isLoading.value"
                    color="warning"
                    block
                    @click="testMultipleSteps"
                  >
                    اختبار متعدد المراحل
                  </v-btn>
                </v-col>
              </v-row>

              <!-- أزرار التحكم -->
              <v-row class="mb-4">
                <v-col cols="12" md="4">
                  <v-btn
                    color="success"
                    variant="outlined"
                    block
                    @click="changeSpinnerColor"
                  >
                    تغيير لون الـ Spinner
                  </v-btn>
                </v-col>
                <v-col cols="12" md="4">
                  <v-btn
                    color="warning"
                    variant="outlined"
                    block
                    @click="testNavigation"
                  >
                    اختبار تحميل التنقل
                  </v-btn>
                </v-col>
                <v-col cols="12" md="4">
                  <v-btn
                    :disabled="!loading.isLoading.value"
                    color="error"
                    variant="outlined"
                    block
                    @click="loading.clearAllLoading()"
                  >
                    إيقاف جميع التحميل
                  </v-btn>
                </v-col>
              </v-row>

              <!-- اختبارات الأداء -->
              <v-divider class="my-4" />
              <h3 class="text-h6 mb-3">اختبارات الأداء</h3>

              <v-row>
                <v-col cols="12" md="6">
                  <v-btn
                    :disabled="loading.isLoading.value"
                    color="indigo"
                    block
                    @click="testParallelLoading"
                  >
                    اختبار التحميل المتوازي
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn
                    :disabled="loading.isLoading.value"
                    color="teal"
                    block
                    @click="testErrorHandling"
                  >
                    اختبار معالجة الأخطاء
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- لوحة النتائج -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="pa-4">
          <v-card-title>
            <h3 class="text-h6">نتائج الاختبارات</h3>
          </v-card-title>
          <v-card-text>
            <div class="test-results">
              <div v-if="lastResult" class="mb-4">
                <v-alert
                  :type="lastResult.success ? 'success' : 'error'"
                  variant="tonal"
                >
                  <strong>{{ lastResult.test }}</strong
                  >: {{ lastResult.message }}
                  <div v-if="lastResult.duration" class="mt-1">
                    <v-chip size="small" color="info">
                      {{ lastResult.duration }}ms
                    </v-chip>
                  </div>
                </v-alert>
              </div>
              <v-alert v-else type="info" variant="outlined">
                لم يتم تشغيل أي اختبارات بعد
              </v-alert>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useLoading } from "~/composables/useLoading";

// 🔒 صفحة محمية - اختبار
definePageMeta({
  layout: 'dashboard',
  title: 'اختبار نظام التحميل',
  description: 'صفحة لاختبار جميع ميزات نظام التحميل العام'
})

// استخدام نظام التحميل
const loading = useLoading();

// حالة النتائج
const lastResult = ref(null);

// ألوان الـ spinner المتاحة
const spinnerColors = [
  "primary",
  "secondary",
  "success",
  "warning",
  "error",
  "info",
];
let currentColorIndex = 0;

// إضافة نتيجة اختبار
const addTestResult = (test, success, message, duration = null) => {
  lastResult.value = {
    test,
    success,
    message,
    duration,
  };
};

// اختبار التحميل البسيط
const testBasicLoading = async () => {
  const startTime = Date.now();

  try {
    await loading.showLoadingFor(3000, {
      text: "اختبار التحميل البسيط...",
      type: "manual",
    });

    const duration = Date.now() - startTime;
    addTestResult("التحميل البسيط", true, "تم بنجاح لمدة 3 ثوان", duration);
  } catch {
    addTestResult("التحميل البسيط", false, "فشل في الاختبار");
  }
};

// اختبار تحميل API
const testApiLoading = async () => {
  const startTime = Date.now();

  try {
    await loading.withLoading(
      async () => {
        // محاكاة استدعاء API
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return { data: "test data" };
      },
      {
        text: "جاري تحميل البيانات من API...",
        type: "api",
      }
    );

    const duration = Date.now() - startTime;
    addTestResult("تحميل API", true, "تم تحميل البيانات بنجاح", duration);
  } catch {
    addTestResult("تحميل API", false, "فشل في تحميل البيانات");
  }
};

// اختبار التحميل المتدرج
const testProgressiveLoading = async () => {
  const startTime = Date.now();

  try {
    const control = loading.startLoading({
      text: "بدء التحميل المتدرج...",
      type: "manual",
    });

    const steps = [
      "تحميل المرحلة الأولى...",
      "معالجة البيانات...",
      "تحديث الواجهة...",
      "اكتمال العملية...",
    ];

    for (let i = 0; i < steps.length; i++) {
      control.updateText(`${steps[i]} (${i + 1}/${steps.length})`);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    control.stop();

    const duration = Date.now() - startTime;
    addTestResult(
      "التحميل المتدرج",
      true,
      `تم بنجاح عبر ${steps.length} مراحل`,
      duration
    );
  } catch {
    addTestResult("التحميل المتدرج", false, "فشل في التحميل المتدرج");
  }
};

// اختبار متعدد المراحل
const testMultipleSteps = async () => {
  const startTime = Date.now();

  try {
    const control = loading.startLoading({
      text: "بدء العملية المعقدة...",
      type: "manual",
      priority: 80,
    });

    const steps = [
      { text: "تحضير البيانات...", delay: 1000 },
      { text: "معالجة المعلومات...", delay: 1500 },
      { text: "التحقق من النتائج...", delay: 800 },
      { text: "حفظ البيانات...", delay: 1200 },
      { text: "اكتمال العملية...", delay: 500 },
    ];

    for (const step of steps) {
      control.updateText(step.text);
      await new Promise((resolve) => setTimeout(resolve, step.delay));
    }

    control.stop();

    const duration = Date.now() - startTime;
    addTestResult("متعدد المراحل", true, "تمت العملية المعقدة بنجاح", duration);
  } catch {
    addTestResult("متعدد المراحل", false, "فشل في العملية المعقدة");
  }
};

// تغيير لون الـ spinner
const changeSpinnerColor = () => {
  currentColorIndex = (currentColorIndex + 1) % spinnerColors.length;
  const newColor = spinnerColors[currentColorIndex];
  if (newColor) {
    loading.setSpinnerColor(newColor);

    addTestResult(
      "تغيير اللون",
      true,
      `تم تغيير لون الـ spinner إلى ${newColor}`
    );
  }
};

// اختبار تحميل التنقل
const testNavigation = async () => {
  const startTime = Date.now();

  try {
    loading.startNavigationLoading("اختبار تحميل التنقل...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    loading.stopNavigationLoading();

    const duration = Date.now() - startTime;
    addTestResult(
      "تحميل التنقل",
      true,
      "تم اختبار تحميل التنقل بنجاح",
      duration
    );
  } catch {
    addTestResult("تحميل التنقل", false, "فشل في اختبار التنقل");
  }
};

// اختبار التحميل المتوازي
const testParallelLoading = async () => {
  const startTime = Date.now();

  try {
    const control = loading.startLoading({
      text: "بدء التحميل المتوازي...",
      type: "api",
    });

    const operations = Array.from(
      { length: 3 },
      (_, i) =>
        new Promise((resolve) =>
          setTimeout(() => resolve(`نتيجة ${i + 1}`), Math.random() * 2000)
        )
    );

    control.updateText("معالجة العمليات المتوازية...");
    const results = await Promise.all(operations);

    control.updateText("اكتملت جميع العمليات!");
    await new Promise((resolve) => setTimeout(resolve, 500));
    control.stop();

    const duration = Date.now() - startTime;
    addTestResult(
      "التحميل المتوازي",
      true,
      `تم تنفيذ ${results.length} عمليات بالتوازي`,
      duration
    );
  } catch {
    addTestResult("التحميل المتوازي", false, "فشل في التحميل المتوازي");
  }
};

// اختبار معالجة الأخطاء
const testErrorHandling = async () => {
  const startTime = Date.now();

  try {
    await loading.withLoading(
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        throw new Error("خطأ مقصود للاختبار");
      },
      {
        text: "اختبار معالجة الأخطاء...",
        type: "api",
      }
    );
  } catch {
    const duration = Date.now() - startTime;
    addTestResult(
      "معالجة الأخطاء",
      true,
      "تم اختبار معالجة الأخطاء بنجاح - توقف التحميل عند الخطأ",
      duration
    );
  }
};
</script>

<style scoped>
.loading-test-page {
  max-width: 1200px;
  margin: 0 auto;
}

.test-controls .v-btn {
  margin-bottom: 8px;
}

.test-results {
  max-height: 400px;
  overflow-y: auto;
}

.v-chip {
  margin-left: 8px;
}
</style>
