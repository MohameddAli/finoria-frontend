import { useLoadingStore } from "@/stores/loading";
import { computed, onUnmounted, ref } from "vue";

// واجهة خيارات التحميل - Loading Options Interface
export interface LoadingOptions {
  text?: string;                          // النص المعروض
  type?: "navigation" | "api" | "manual";  // نوع العملية
  id?: string;                            // معرف فريد (اختياري)
}

// واجهة التحكم في التحميل - Loading Control Interface
export interface LoadingControl {
  stop: () => void;                       // إيقاف التحميل
  updateText: (text: string) => void;     // تحديث النص
  id: string;                             // المعرف
}

/**
 * كومبوزابل التحميل العام - Global Loading Composable
 * يوفر وصولاً سهلاً لنظام التحميل العام
 */
export const useLoading = () => {
  const loadingStore = useLoadingStore();

  // بدء عملية تحميل - Start loading operation
  const startLoading = (options: LoadingOptions = {}): LoadingControl => {
    const loadingId = loadingStore.startLoading(options);

    return {
      id: loadingId,
      // إيقاف التحميل - Stop loading
      stop: () => loadingStore.stopLoading(loadingId),
      // تحديث النص أثناء التحميل - Update text during loading
      updateText: (text: string) => {
        if (loadingStore.operations.some((op) => op.id === loadingId)) {
          loadingStore.updateLoadingText(text);
        }
      },
    };
  };

  // إيقاف تحميل محدد أو جميع العمليات - Stop specific or all loading
  const stopLoading = (id?: string) => {
    loadingStore.stopLoading(id);
  };

  // تنفيذ عملية مع مؤشر التحميل - Execute operation with loading
  const withLoading = async <T>(
    operation: () => Promise<T>,
    options: LoadingOptions = {}
  ): Promise<T> => {
    return loadingStore.withLoading(operation, options);
  };

  // تغيير لون المؤشر - Change spinner color
  const setSpinnerColor = (color: string) => {
    loadingStore.setSpinnerColor(color);
  };

  return {
    // الحالة (للقراءة فقط) - State (readonly)
    isLoading: computed(() => loadingStore.isLoading),
    loadingText: computed(() => loadingStore.loadingText),
    operationsCount: computed(() => loadingStore.operationsCount),
    isNavigationLoading: computed(() => loadingStore.isNavigationLoading),
    isApiLoading: computed(() => loadingStore.isApiLoading),
    currentOperation: computed(() => loadingStore.currentOperation),

    // الوظائف الأساسية - Core methods
    startLoading,
    stopLoading,
    withLoading,
    setSpinnerColor,
  };
};

/**
 * كومبوزابل التحميل مع التنظيف التلقائي - Auto-cleanup loading composable
 * ينظف العمليات تلقائياً عند إلغاء تركيب المكون
 */
export const useAutoLoading = (options: LoadingOptions = {}) => {
  const { startLoading: _startLoading, ...rest } = useLoading();
  const activeLoadings = ref<string[]>([]);  // قائمة العمليات النشطة

  // بدء تحميل مع التتبع التلقائي - Start loading with auto tracking
  const startLoading = (overrideOptions: LoadingOptions = {}) => {
    const control = _startLoading({ ...options, ...overrideOptions });

    // تتبع هذه العملية - Track this operation
    activeLoadings.value.push(control.id);

    // تخصيص وظيفة الإيقاف لإزالة التتبع - Override stop to remove tracking
    const originalStop = control.stop;
    control.stop = () => {
      originalStop();
      const index = activeLoadings.value.indexOf(control.id);
      if (index > -1) {
        activeLoadings.value.splice(index, 1);
      }
    };

    return control;
  };

  // تنظيف تلقائي عند إلغاء التركيب - Cleanup on unmount
  onUnmounted(() => {
    activeLoadings.value.forEach((id) => rest.stopLoading(id));
    activeLoadings.value = [];
  });

  return {
    ...rest,
    startLoading,
    // عدد العمليات النشطة - Active operations count
    activeLoadingsCount: computed(() => activeLoadings.value.length),
  };
};
