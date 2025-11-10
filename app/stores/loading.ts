import { defineStore } from "pinia";

// أنواع عرض التحميل - Loading Display Types
export type LoadingDisplayType = "overlay" | "progressbar" | "none";

// واجهة تشغيل التحميل - Loading Operation Interface
interface LoadingOperation {
  id: string; // معرف فريد للعملية
  text: string; // النص المعروض
  type: "navigation" | "api" | "manual"; // نوع العملية
  priority: number; // أولوية العرض
  timestamp: number; // وقت الإنشاء
}

// حالة التحميل العامة - Global Loading State
interface LoadingState {
  operations: LoadingOperation[]; // قائمة العمليات النشطة
  spinnerColor: string; // لون المؤشر
  loadingType: LoadingDisplayType; // نوع عرض التحميل العام
  dashboardLoadingType: LoadingDisplayType; // نوع عرض التحميل للداشبورد
}

export const useLoadingStore = defineStore("loading", {
  state: (): LoadingState => ({
    operations: [], // قائمة فارغة في البداية
    spinnerColor: "primary", // اللون الافتراضي
    loadingType: "overlay", // نوع التحميل الافتراضي (overlay)
    dashboardLoadingType: "progressbar", // نوع التحميل للداشبورد (progressbar)
  }),

  getters: {
    // فحص وجود عمليات تحميل نشطة - Check if any loading is active
    isLoading: (state) => state.operations.length > 0,

    // الحصول على العملية ذات الأولوية العالية - Get highest priority operation
    currentOperation: (state) => {
      if (state.operations.length === 0) return null;
      return state.operations.reduce((highest, current) =>
        current.priority > highest.priority ? current : highest
      );
    },

    // النص الحالي للتحميل - Current loading text
    loadingText: (state) => {
      if (state.operations.length === 0) return "جاري التحميل...";
      const current = state.operations.reduce((highest, current) =>
        current.priority > highest.priority ? current : highest
      );
      return current?.text || "جاري التحميل...";
    },

    // فحص تحميل التنقل - Check navigation loading
    isNavigationLoading: (state) =>
      state.operations.some((op) => op.type === "navigation"),

    // فحص تحميل API - Check API loading
    isApiLoading: (state) => state.operations.some((op) => op.type === "api"),

    // عدد العمليات النشطة - Active operations count
    operationsCount: (state) => state.operations.length,
  },

  actions: {
    // تعيين نوع عرض التحميل العام - Set global loading display type
    setLoadingType(type: LoadingDisplayType): void {
      this.loadingType = type;
    },

    // تعيين نوع عرض التحميل للداشبورد - Set dashboard loading display type
    setDashboardLoadingType(type: LoadingDisplayType): void {
      this.dashboardLoadingType = type;
    },

    // بدء عملية تحميل - Start loading operation
    startLoading(
      options: {
        id?: string;
        text?: string;
        type?: "navigation" | "api" | "manual";
      } = {}
    ): string {
      const {
        id = `loading-${Date.now()}`, // معرف فريد تلقائي
        text = "جاري التحميل...", // النص الافتراضي
        type = "manual", // النوع الافتراضي
      } = options;

      // إزالة العملية الموجودة بنفس المعرف - Remove existing operation
      this.stopLoading(id);

      // إنشاء العملية الجديدة - Create new operation
      const operation: LoadingOperation = {
        id,
        text,
        type,
        priority: this._getPriorityByType(type), // تحديد الأولوية تلقائياً
        timestamp: Date.now(), // طابع زمني
      };

      // إضافة العملية للقائمة - Add to operations list
      this.operations.push(operation);
      return id;
    },

    // إيقاف عملية تحميل - Stop loading operation
    stopLoading(id?: string): void {
      if (id) {
        // إيقاف عملية محددة - Stop specific operation
        const index = this.operations.findIndex((op) => op.id === id);
        if (index > -1) {
          this.operations.splice(index, 1);
        }
      } else {
        // إيقاف جميع العمليات - Stop all operations
        this.operations = [];
      }
    },

    // تنفيذ عملية مع التحميل - Execute operation with loading
    async withLoading<T>(
      operation: () => Promise<T>,
      options: { text?: string; type?: "navigation" | "api" | "manual" } = {}
    ): Promise<T> {
      const loadingId = this.startLoading(options); // بدء التحميل
      try {
        const result = await operation(); // تنفيذ العملية
        return result;
      } finally {
        this.stopLoading(loadingId); // إيقاف التحميل في جميع الحالات
      }
    },

    // تحديث نص التحميل - Update loading text
    updateLoadingText(text: string): void {
      const current = this.currentOperation;
      if (current) {
        const index = this.operations.findIndex((op) => op.id === current.id);
        if (index > -1 && this.operations[index]) {
          this.operations[index]!.text = text;
        }
      }
    },

    // تغيير لون المؤشر - Set spinner color
    setSpinnerColor(color: string): void {
      this.spinnerColor = color;
    },

    // تنظيف العمليات القديمة - Cleanup old operations
    cleanupOldOperations(): void {
      const now = Date.now();
      const maxAge = 30000; // 30 ثانية
      this.operations = this.operations.filter(
        (op) => now - op.timestamp < maxAge
      );
    },

    // تحديد الأولوية حسب النوع - Get priority by type
    _getPriorityByType(type: "navigation" | "api" | "manual"): number {
      switch (type) {
        case "navigation":
          return 100; // أولوية عالية للتنقل
        case "api":
          return 50; // أولوية متوسطة لـ API
        case "manual":
          return 25; // أولوية منخفضة للعمليات اليدوية
        default:
          return 1;
      }
    },
  },
});
