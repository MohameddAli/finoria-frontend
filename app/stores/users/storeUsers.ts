/**
 * Users Store
 * Manages admin users state and operations
 */

import { defineStore } from "pinia";
import {
  useUsersApi,
  type User,
  type UserCreatePayload,
  type UserUpdatePayload,
} from "~/composables/api/useUsersApi";
import { useToast } from "~/composables/useToast";

export const useUsersStore = defineStore("users", () => {
  // ═══════════════════════════════════════════════
  // State
  // ═══════════════════════════════════════════════
  const users = ref<User[]>([]);
  const currentUser = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // ═══════════════════════════════════════════════
  // Composables
  // ═══════════════════════════════════════════════
  const api = useUsersApi();
  const toast = useToast();

  // ═══════════════════════════════════════════════
  // Actions
  // ═══════════════════════════════════════════════

  /**
   * Fetch all users
   */
  async function fetchUsers() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.getAll();
      users.value = response.data;
      return response.data;
    } catch (e: any) {
      error.value = e.message || "Failed to fetch users";
      toast.error(error.value);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Fetch single user by ID
   */
  async function fetchUserById(id: string) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.getById(id);
      currentUser.value = response.data;
      return response.data;
    } catch (e: any) {
      error.value = e.message || "Failed to fetch user";
      toast.error(error.value);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Create new user
   */
  async function createUser(payload: UserCreatePayload) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.create(payload);
      users.value.push(response.data);
      toast.success("تم إنشاء المستخدم بنجاح");
      return response.data;
    } catch (e: any) {
      error.value = e.message || "Failed to create user";
      toast.error(error.value);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Update existing user
   */
  async function updateUser(id: string, payload: UserUpdatePayload) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.update(id, payload);
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.value[index] = response.data;
      }
      toast.success("تم تحديث المستخدم بنجاح");
      return response.data;
    } catch (e: any) {
      error.value = e.message || "Failed to update user";
      toast.error(error.value);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Delete user
   */
  async function deleteUser(id: string) {
    isLoading.value = true;
    error.value = null;

    try {
      await api.delete(id);
      users.value = users.value.filter((u) => u.id !== id);
      toast.success("تم حذف المستخدم بنجاح");
    } catch (e: any) {
      error.value = e.message || "Failed to delete user";
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
    users.value = [];
    currentUser.value = null;
    isLoading.value = false;
    error.value = null;
  }

  // ═══════════════════════════════════════════════
  // Return
  // ═══════════════════════════════════════════════
  return {
    // State
    users: readonly(users),
    currentUser: readonly(currentUser),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Actions
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    clearError,
    $reset,
  };
});
