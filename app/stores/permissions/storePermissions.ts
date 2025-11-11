import { defineStore } from "pinia";
import {
  usePermissionsApi,
  type Permission,
  type PermissionCreatePayload,
  type PermissionUpdatePayload,
} from "~/composables/api/usePermissionsApi";
import { useToast } from "~/composables/useToast";

export const usePermissionsStore = defineStore("permissions", () => {
  const permissions = ref<Permission[]>([]);
  const currentPermission = ref<Permission | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const api = usePermissionsApi();
  const toast = useToast();

  async function fetchPermissions() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.getAll();
      permissions.value = response.data;
      return response.data;
    } catch (e: any) {
      const msg = e.message || "Failed to fetch permissions";
      error.value = msg;
      toast.error(msg);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPermissionById(id: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.getById(id);
      currentPermission.value = response.data;
      return response.data;
    } catch (e: any) {
      const msg = e.message || "Failed to fetch permission";
      error.value = msg;
      toast.error(msg);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function createPermission(payload: PermissionCreatePayload) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.create(payload);
      permissions.value.push(response.data);
      toast.success(response.message || "تم إنشاء الصلاحية بنجاح");
      return response.data;
    } catch (e: any) {
      const msg = e.message || "Failed to create permission";
      error.value = msg;
      toast.error(msg);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function updatePermission(id: string, payload: PermissionUpdatePayload) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.update(id, payload);
      const index = permissions.value.findIndex((p) => p.id === id);
      if (index !== -1) permissions.value[index] = response.data;
      toast.success(response.message || "تم تحديث الصلاحية بنجاح");
      return response.data;
    } catch (e: any) {
      const msg = e.message || "Failed to update permission";
      error.value = msg;
      toast.error(msg);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function deletePermission(id: string) {
    isLoading.value = true;
    error.value = null;
    try {
      await api.delete(id);
      permissions.value = permissions.value.filter((p) => p.id !== id);
      toast.success("تم حذف الصلاحية بنجاح");
    } catch (e: any) {
      const msg = e.message || "Failed to delete permission";
      error.value = msg;
      toast.error(msg);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  const clearError = () => (error.value = null);
  const $reset = () => {
    permissions.value = [];
    currentPermission.value = null;
    isLoading.value = false;
    error.value = null;
  };

  return {
    permissions: readonly(permissions),
    currentPermission: readonly(currentPermission),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchPermissions,
    fetchPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
    clearError,
    $reset,
  };
});
