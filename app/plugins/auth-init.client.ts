/**
 * Auth Initialization Plugin
 * يستدعي initAuth() عند بدء التطبيق لقراءة البيانات من localStorage
 */

import { useAuthStore } from "~/stores/auth/storeAuth";

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  
  // استدعاء initAuth لقراءة البيانات من localStorage
  authStore.initAuth();
});
