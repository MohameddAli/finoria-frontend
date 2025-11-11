import { useLoadingStore } from "@/stores/loading";

export interface LoadingOptions {
  text?: string;
  type?: "navigation" | "api" | "manual";
  id?: string;
}

export interface LoadingControl {
  stop: () => void;
  updateText: (text: string) => void;
  id: string;
}

export const useLoading = () => {
  const loadingStore = useLoadingStore();

  const startLoading = (options: LoadingOptions = {}): LoadingControl => {
    const loadingId = loadingStore.startLoading(options);
    return {
      id: loadingId,
      stop: () => loadingStore.stopLoading(loadingId),
      updateText: (text: string) => {
        if (loadingStore.operations.some((op) => op.id === loadingId)) {
          loadingStore.updateLoadingText(text);
        }
      },
    };
  };

  return {
    isLoading: computed(() => loadingStore.isLoading),
    loadingText: computed(() => loadingStore.loadingText),
    operationsCount: computed(() => loadingStore.operationsCount),
    isNavigationLoading: computed(() => loadingStore.isNavigationLoading),
    isApiLoading: computed(() => loadingStore.isApiLoading),
    currentOperation: computed(() => loadingStore.currentOperation),
    startLoading,
    stopLoading: (id?: string) => loadingStore.stopLoading(id),
    withLoading: <T>(operation: () => Promise<T>, options: LoadingOptions = {}) =>
      loadingStore.withLoading(operation, options),
    setSpinnerColor: (color: string) => loadingStore.setSpinnerColor(color),
  };
};

export const useAutoLoading = (options: LoadingOptions = {}) => {
  const { startLoading: _startLoading, ...rest } = useLoading();
  const activeLoadings = ref<string[]>([]);

  const startLoading = (overrideOptions: LoadingOptions = {}) => {
    const control = _startLoading({ ...options, ...overrideOptions });
    activeLoadings.value.push(control.id);

    const originalStop = control.stop;
    control.stop = () => {
      originalStop();
      const index = activeLoadings.value.indexOf(control.id);
      if (index > -1) activeLoadings.value.splice(index, 1);
    };
    return control;
  };

  onUnmounted(() => {
    activeLoadings.value.forEach((id) => rest.stopLoading(id));
    activeLoadings.value = [];
  });

  return { ...rest, startLoading, activeLoadingsCount: computed(() => activeLoadings.value.length) };
};
