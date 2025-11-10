/**
 * Permissions API Composable
 * Handles permissions CRUD operations using useApi
 *
 * Based on API documentation in api_md/permetion.md
 * Note: API endpoint is /admin/permetion (not permissions)
 */

import { useApi } from "./useApi";

// Permission types
export interface Permission {
  id: string; // encrypted ID
  name: string;
  content: string | null; // description/details
}

export interface PermissionCreatePayload {
  name: string;
  content?: string;
}

export interface PermissionUpdatePayload {
  name: string;
  content?: string;
}

export const usePermissionsApi = () => {
  const api = useApi();

  return {
    /**
     * Get all permissions
     * GET /admin/permetion
     */
    getAll: () => api.get<{ data: Permission[] }>("/admin/permetion"),

    /**
     * Get single permission by ID
     * GET /admin/permetion/{id}
     */
    getById: (id: string) =>
      api.get<{ data: Permission }>(`/admin/permetion/${id}`),

    /**
     * Create new permission
     * POST /admin/permetion?name&content
     *
     * API uses query params as per documentation
     */
    create: (payload: PermissionCreatePayload) =>
      api.post<{ data: Permission; message?: string }>(
        "/admin/permetion",
        undefined,
        {
          params: payload as Record<string, string>,
        }
      ),

    /**
     * Update existing permission
     * PUT /admin/permetion/{id}?name&content
     *
     * API uses query params as per documentation
     */
    update: (id: string, payload: PermissionUpdatePayload) =>
      api.put<{ data: Permission; message?: string }>(
        `/admin/permetion/${id}`,
        undefined,
        {
          params: payload as Record<string, string>,
        }
      ),

    /**
     * Delete permission
     * DELETE /admin/permetion/{id}
     * Returns 204 No Content or success message
     */
    delete: (id: string) =>
      api.delete<{ success?: boolean; message?: string }>(
        `/admin/permetion/${id}`
      ),
  };
};
