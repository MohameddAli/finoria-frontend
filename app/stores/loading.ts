import { defineStore } from "pinia";

export type LoadingDisplayType = "overlay" | "progressbar" | "none";

interface LoadingOperation {
  id: string;
  text: string;
  type: "navigation" | "api" | "manual";
  priority: number;
  timestamp: number;
}

interface LoadingState {
  operations: LoadingOperation[];
  spinnerColor: string;
  loadingType: LoadingDisplayType;
  dashboardLoadingType: LoadingDisplayType;
}

const PRIORITY_MAP = { navigation: 100, api: 50, manual: 25 } as const;

export const useLoadingStore = defineStore("loading", {
  state: (): LoadingState => ({
    operations: [],
    spinnerColor: "primary",
    loadingType: "overlay",
    dashboardLoadingType: "progressbar",
  }),

  getters: {
    isLoading: (state) => state.operations.length > 0,
    currentOperation: (state) =>
      state.operations.length === 0
        ? null
        : state.operations.reduce((h, c) => (c.priority > h.priority ? c : h)),
    loadingText: (state) =>
      state.operations.length === 0
        ? "جاري التحميل..."
        : state.operations.reduce((h, c) => (c.priority > h.priority ? c : h))
            ?.text || "جاري التحميل...",
    isNavigationLoading: (state) =>
      state.operations.some((op) => op.type === "navigation"),
    isApiLoading: (state) => state.operations.some((op) => op.type === "api"),
    operationsCount: (state) => state.operations.length,
  },

  actions: {
    setLoadingType(type: LoadingDisplayType) {
      this.loadingType = type;
    },
    setDashboardLoadingType(type: LoadingDisplayType) {
      this.dashboardLoadingType = type;
    },
    startLoading(
      options: {
        id?: string;
        text?: string;
        type?: "navigation" | "api" | "manual";
      } = {}
    ): string {
      const {
        id = `loading-${Date.now()}`,
        text = "جاري التحميل...",
        type = "manual",
      } = options;
      this.stopLoading(id);
      this.operations.push({
        id,
        text,
        type,
        priority: PRIORITY_MAP[type] || 1,
        timestamp: Date.now(),
      });
      return id;
    },
    stopLoading(id?: string): void {
      if (id) {
        const index = this.operations.findIndex((op) => op.id === id);
        if (index > -1) this.operations.splice(index, 1);
      } else {
        this.operations = [];
      }
    },
    async withLoading<T>(
      operation: () => Promise<T>,
      options: { text?: string; type?: "navigation" | "api" | "manual" } = {}
    ): Promise<T> {
      const loadingId = this.startLoading(options);
      try {
        return await operation();
      } finally {
        this.stopLoading(loadingId);
      }
    },
    updateLoadingText(text: string): void {
      const current = this.currentOperation;
      if (current) {
        const index = this.operations.findIndex((op) => op.id === current.id);
        if (index > -1 && this.operations[index])
          this.operations[index]!.text = text;
      }
    },
    setSpinnerColor(color: string) {
      this.spinnerColor = color;
    },
    cleanupOldOperations() {
      const now = Date.now();
      this.operations = this.operations.filter((op) => now - op.timestamp < 30000);
    },
  },
});
