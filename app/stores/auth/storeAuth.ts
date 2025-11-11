import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Admin } from "~~/shared/types";
import type { LoginCredentials } from "~/composables/api/useAuthApi";
import { useAuthApi } from "~/composables/api/useAuthApi";

export const useAuthStore = defineStore("auth", () => {
  const admin = ref<Admin | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isInitialized = ref(false);

  const isAuthenticated = computed(() => !!token.value && !!admin.value);
  const adminName = computed(() => admin.value?.name || "");
  const adminEmail = computed(() => admin.value?.email || "");
  const currentUser = computed(() => admin.value);
  const loading = computed(() => isLoading.value);
  const getUserInfo = computed(() => ({
    id: admin.value?.id,
    name: admin.value?.name,
    email: admin.value?.email,
    role: admin.value?.role || "admin",
  }));

  function initAuth(): void {
    if (isInitialized.value || !import.meta.client) return;
    try {
      const storedToken = localStorage.getItem("auth_token");
      const storedAdmin = localStorage.getItem("auth_user");
      if (storedToken && storedAdmin) {
        token.value = storedToken;
        admin.value = JSON.parse(storedAdmin);
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      clearAuth();
    } finally {
      isInitialized.value = true;
    }
  }

  async function login(credentials: LoginCredentials): Promise<boolean> {
    isLoading.value = true;
    error.value = null;
    try {
      const authApi = useAuthApi();
      const response = await authApi.login(credentials);
      admin.value = response.admin;
      token.value = response.token;
      if (import.meta.client) {
        localStorage.setItem("auth_token", response.token);
        localStorage.setItem("auth_user", JSON.stringify(response.admin));
      }
      return true;
    } catch (err: any) {
      error.value = err?.data?.message || "فشل تسجيل الدخول";
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function logout(): void {
    clearAuth();
    if (import.meta.client) navigateTo("/auth/login");
  }

  function clearAuth(): void {
    admin.value = null;
    token.value = null;
    error.value = null;
    if (import.meta.client) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  }

  const hasPermission = (permission: string): boolean =>
    admin.value?.role === "admin";
  const hasRole = (role: string): boolean => admin.value?.role === role;
  const hasAllPermissions = (permissions: string[]): boolean =>
    permissions.every((p) => hasPermission(p));
  const hasAnyPermission = (permissions: string[]): boolean =>
    permissions.some((p) => hasPermission(p));
  const clearError = (): void => {
    error.value = null;
  };

  return {
    admin,
    token,
    isLoading,
    error,
    isInitialized,
    isAuthenticated,
    adminName,
    adminEmail,
    currentUser,
    loading,
    getUserInfo,
    initAuth,
    login,
    logout,
    clearAuth,
    hasPermission,
    hasRole,
    hasAllPermissions,
    hasAnyPermission,
    clearError,
  };
});
