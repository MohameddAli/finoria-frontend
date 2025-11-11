import { defineStore } from "pinia";
import {
  useUsersApi,
  type User,
  type UserCreatePayload,
  type UserUpdatePayload,
} from "~/composables/api/useUsersApi";
import { useToast } from "~/composables/useToast";

export const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]);
  const currentUser = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const api = useUsersApi();
  const toast = useToast();

  async function fetchUsers() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.getAll();
      users.value = response.data;
      return response.data;
    } catch (e: any) {
      const msg = e.message || "Failed to fetch users";
      error.value = msg;
      toast.error(msg);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUserById(id: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.getById(id);
      currentUser.value = response.data;
      return response.data;
    } catch (e: any) {
      const msg = e.message || "Failed to fetch user";
      error.value = msg;
      toast.error(msg);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function createUser(payload: UserCreatePayload) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.create(payload);
      users.value.push(response.data);
      toast.success("تم إنشاء المستخدم بنجاح");
      return response.data;
    } catch (e: any) {
      const msg = e.message || "Failed to create user";
      error.value = msg;
      toast.error(msg);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateUser(id: string, payload: UserUpdatePayload) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.update(id, payload);
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) users.value[index] = response.data;
      toast.success("تم تحديث المستخدم بنجاح");
      return response.data;
    } catch (e: any) {
      const msg = e.message || "Failed to update user";
      error.value = msg;
      toast.error(msg);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteUser(id: string) {
    isLoading.value = true;
    error.value = null;
    try {
      await api.delete(id);
      users.value = users.value.filter((u) => u.id !== id);
      toast.success("تم حذف المستخدم بنجاح");
    } catch (e: any) {
      const msg = e.message || "Failed to delete user";
      error.value = msg;
      toast.error(msg);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  const clearError = () => (error.value = null);
  const $reset = () => {
    users.value = [];
    currentUser.value = null;
    isLoading.value = false;
    error.value = null;
  };

  return {
    users: readonly(users),
    currentUser: readonly(currentUser),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    clearError,
    $reset,
  };
});
