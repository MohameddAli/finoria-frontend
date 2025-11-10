/**
 * Users API Composable
 * Handles admin users CRUD operations using useApi
 *
 * Based on API documentation in api_md/users.md
 */

import { useApi } from "./useApi";

// User types
export interface User {
  id: string; // encrypted ID
  name: string;
  email: string;
  created_at: string;
  role_id?: string;
}

export interface UserCreatePayload {
  name: string;
  email: string;
  password: string;
  role_id: string;
}

export interface UserUpdatePayload {
  name: string;
  email: string;
  password?: string; // Optional on update
  role_id: string;
}

export const useUsersApi = () => {
  const api = useApi();

  return {
    /**
     * Get all users
     * GET /admin/users
     */
    getAll: () => api.get<{ data: User[] }>("/admin/users"),

    /**
     * Get single user by ID
     * GET /admin/users/{id}
     */
    getById: (id: string) => api.get<{ data: User }>(`/admin/users/${id}`),

    /**
     * Create new user
     * POST /admin/users?name&email&password&role_id
     *
     * API uses query params as per documentation
     */
    create: (payload: UserCreatePayload) =>
      api.post<{ data: User }>("/admin/users", undefined, {
        params: payload as Record<string, string>,
      }),

    /**
     * Update existing user
     * PUT /admin/users/{id}?name&email&password&role_id
     *
     * API uses query params as per documentation
     * password is optional
     */
    update: (id: string, payload: UserUpdatePayload) => {
      // Remove empty password field if not provided
      const params = { ...payload };
      if (!params.password) {
        delete params.password;
      }

      return api.put<{ data: User }>(`/admin/users/${id}`, undefined, {
        params: params as Record<string, string>,
      });
    },

    /**
     * Delete user
     * DELETE /admin/users/{id}
     * Returns 204 No Content or success message
     */
    delete: (id: string) =>
      api.delete<{ success?: boolean; message?: string }>(`/admin/users/${id}`),
  };
};
