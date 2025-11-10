/**
 * Auth Store
 * Manages authentication state using Pinia 3 Setup Store
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Admin } from "~~/shared/types";
import type { LoginCredentials } from "~/composables/api/useAuthApi";
import { useAuthApi } from "~/composables/api/useAuthApi";

/**
 * Auth Store
 * Handles user authentication, login, logout, and token management
 */
export const useAuthStore = defineStore("auth", () => {
  // ═══════════════════════════════════════════════
  // State
  // ═══════════════════════════════════════════════
  const admin = ref<Admin | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isInitialized = ref(false);

  // ═══════════════════════════════════════════════
  // Getters
  // ═══════════════════════════════════════════════
  const isAuthenticated = computed(() => !!token.value && !!admin.value);
  const adminName = computed(() => admin.value?.name || "");
  const adminEmail = computed(() => admin.value?.email || "");
  const currentUser = computed(() => admin.value);
  const loading = computed(() => isLoading.value);

  // User info for useAuth compatibility
  const getUserInfo = computed(() => ({
    id: admin.value?.id,
    name: admin.value?.name,
    email: admin.value?.email,
    role: admin.value?.role || "admin",
  }));

  // ═══════════════════════════════════════════════
  // Actions
  // ═══════════════════════════════════════════════

  /**
   * Initialize auth from localStorage (client-only)
   */
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

  /**
   * Login with credentials
   */
  async function login(credentials: LoginCredentials): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    try {
      const authApi = useAuthApi();
      const response = await authApi.login(credentials);

      admin.value = response.admin;
      token.value = response.token;

      // Store in localStorage (client-side)
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

  /**
   * Logout and clear state
   */
  function logout(): void {
    clearAuth();

    if (import.meta.client) {
      navigateTo("/auth/login");
    }
  }

  /**
   * Clear all auth data
   */
  function clearAuth(): void {
    admin.value = null;
    token.value = null;
    error.value = null;

    if (import.meta.client) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  }

  /**
   * Refresh user data from API
   */
  // async function refreshUser(): Promise<boolean> {
  //   if (!token.value) return false;

  //   try {
  //     const authApi = useAuthApi();
  //     const response = await authApi.me();

  //     admin.value = response.admin;

  //     if (import.meta.client) {
  //       localStorage.setItem("auth_user", JSON.stringify(response.admin));
  //     }

  //     return true;
  //   } catch {
  //     clearAuth();
  //     return false;
  //   }
  // }

  /**
   * Validate token
   */
  // async function validateToken(): Promise<boolean> {
  //   if (!token.value) return false;

  //   try {
  //     const authApi = useAuthApi();
  //     await authApi.verify();
  //     return true;
  //   } catch {
  //     clearAuth();
  //     return false;
  //   }
  // }

  /**
   * Update profile
   */
  // async function updateProfile(data: Partial<Admin>): Promise<boolean> {
  //   if (!admin.value) return false;

  //   isLoading.value = true;
  //   error.value = null;

  //   try {
  //     const authApi = useAuthApi();
  //     const response = await authApi.updateProfile(data);

  //     admin.value = response.admin;

  //     if (import.meta.client) {
  //       localStorage.setItem("auth_user", JSON.stringify(response.admin));
  //     }

  //     return true;
  //   } catch (err: any) {
  //     error.value = err?.data?.message || "فشل تحديث الملف الشخصي";
  //     return false;
  //   } finally {
  //     isLoading.value = false;
  //   }
  // }

  /**
   * Check permission
   */
  function hasPermission(permission: string): boolean {
    return admin.value?.role === "admin";
  }

  /**
   * Check role
   */
  function hasRole(role: string): boolean {
    return admin.value?.role === role;
  }

  /**
   * Check all permissions
   */
  function hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((p) => hasPermission(p));
  }

  /**
   * Check any permission
   */
  function hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((p) => hasPermission(p));
  }

  /**
   * Clear error
   */
  function clearError(): void {
    error.value = null;
  }

  // ═══════════════════════════════════════════════
  // Return
  // ═══════════════════════════════════════════════
  return {
    // State
    admin,
    token,
    isLoading,
    error,
    isInitialized,

    // Getters
    isAuthenticated,
    adminName,
    adminEmail,
    currentUser,
    loading,
    getUserInfo,

    // Actions
    initAuth,
    login,
    logout,
    clearAuth,
    // refreshUser,
    // validateToken,
    // updateProfile,
    hasPermission,
    hasRole,
    hasAllPermissions,
    hasAnyPermission,
    clearError,
  };
});
