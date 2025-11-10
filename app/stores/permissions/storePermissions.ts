/**
 * Permissions Store
 * Manages permissions state and operations
 */

import { defineStore } from "pinia";
import {
  usePermissionsApi,
  type Permission,
  type PermissionCreatePayload,
  type PermissionUpdatePayload,
} from "~/composables/api/usePermissionsApi";
import { useToast } from "~/composables/useToast";

export const usePermissionsStore = defineStore("permissions", () => {
  // ═══════════════════════════════════════════════
  // State
  // ═══════════════════════════════════════════════
  const permissions = ref<Permission[]>([]);
  const currentPermission = ref<Permission | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // ═══════════════════════════════════════════════
  // Composables
  // ═══════════════════════════════════════════════
  const api = usePermissionsApi();
  const toast = useToast();

  // ═══════════════════════════════════════════════
  // Actions
  // ═══════════════════════════════════════════════

  /**
   * Fetch all permissions
   */
  async function fetchPermissions() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.getAll();
      permissions.value = response.data;
      return response.data;
    } catch (e: any) {
      error.value = e.message || "Failed to fetch permissions";
      toast.error(error.value);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Fetch single permission by ID
   */
  async function fetchPermissionById(id: string) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.getById(id);
      currentPermission.value = response.data;
      return response.data;
    } catch (e: any) {
      error.value = e.message || "Failed to fetch permission";
      toast.error(error.value);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Create new permission
   */
  async function createPermission(payload: PermissionCreatePayload) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.create(payload);
      permissions.value.push(response.data);
      if (response.message) {
        toast.success(response.message);
      } else {
        toast.success("تم إنشاء الصلاحية بنجاح");
      }
      return response.data;
    } catch (e: any) {
      error.value = e.message || "Failed to create permission";
      toast.error(error.value);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Update existing permission
   */
  async function updatePermission(
    id: string,
    payload: PermissionUpdatePayload
  ) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.update(id, payload);
      const index = permissions.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        permissions.value[index] = response.data;
      }
      if (response.message) {
        toast.success(response.message);
      } else {
        toast.success("تم تحديث الصلاحية بنجاح");
      }
      return response.data;
    } catch (e: any) {
      error.value = e.message || "Failed to update permission";
      toast.error(error.value);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Delete permission
   */
  async function deletePermission(id: string) {
    isLoading.value = true;
    error.value = null;

    try {
      await api.delete(id);
      permissions.value = permissions.value.filter((p) => p.id !== id);
      toast.success("تم حذف الصلاحية بنجاح");
    } catch (e: any) {
      error.value = e.message || "Failed to delete permission";
      toast.error(error.value);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Reset error state
   */
  function clearError() {
    error.value = null;
  }

  /**
   * Reset all state
   */
  function $reset() {
    permissions.value = [];
    currentPermission.value = null;
    isLoading.value = false;
    error.value = null;
  }

  // ═══════════════════════════════════════════════
  // Return
  // ═══════════════════════════════════════════════
  return {
    // State
    permissions: readonly(permissions),
    currentPermission: readonly(currentPermission),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Actions
    fetchPermissions,
    fetchPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
    clearError,
    $reset,
  };
});
