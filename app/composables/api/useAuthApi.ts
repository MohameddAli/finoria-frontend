/**
 * Auth API Composable
 * Handles authentication API calls using useApi
 */

import type { Admin } from "~~/shared/types";
import { useApi } from "./useApi";

export interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuthApi = () => {
  const api = useApi();

  return {
    /**
     * Admin login (no auth headers needed)
     * تسجيل الدخول (لا يحتاج Authorization header)
     */
    login: (credentials: LoginCredentials) =>
      api.post<{ admin: Admin; token: string }>(
        "/admin/login",
        credentials, // Send as body, not params
        { skipAuth: true } // Don't send Authorization header
      ),
    // POST login with query params (as per API docs)
    // login: (credentials: LoginCredentials) => {
    //   // Send credentials as query params (as per API documentation)
    //   const queryParams = new URLSearchParams({
    //     email: credentials.email,
    //     password: credentials.password,
    //   }).toString();
      
    //   return api.post<{ admin: Admin; token: string }>(
    //     `/admin/login?${queryParams}`,
    //     undefined, // No body needed
    //     { skipAuth: true } // Don't send Authorization header
    //   );
    // },


    /**
     * Get current admin user
     */
    // me: () => api.get<{ admin: Admin }>("/admin/me"),

    /**
     * Verify token validity
     */
    // verify: () => api.get("/admin/verify"),

    /**
     * Update admin profile
     */
    updateProfile: (data: Partial<Admin>) =>
      api.put<{ admin: Admin }>("/admin/profile", data),

    /**
     * Logout (server-side)
     */
    // logout: () => api.post("/admin/logout"),
    logout: () => {
      // Client-only storage cleanup
      if (import.meta.client) {
        try {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
        } catch (e) {
          // ignore storage errors
          // console.log("Failed to clear localStorage on logout", e);
        }
      }
    },
  };
};
