<template>
  <v-container fluid>
    <v-row>
      <!-- Left column: Profile summary + preferences -->
      <v-col cols="12" md="4">
        <v-card class="mb-6">
          <v-card-text class="d-flex flex-column align-center text-center">
            <OptimizedAvatar
              :src="avatarPreview || currentUser?.avatarUrl"
              :alt="displayName"
              size="96"
              loading="eager"
            />
            <div class="text-h6 mt-3">{{ displayName }}</div>
            <div class="text-caption text-medium-emphasis">
              {{ currentUser?.email }}
            </div>

            <div class="d-flex flex-wrap justify-center mt-2" style="gap: 6px">
              <v-chip
                v-for="role in roles"
                :key="role"
                size="small"
                color="primary"
                variant="tonal"
              >
                {{ role }}
              </v-chip>
            </div>

            <v-divider class="my-4" />

            <div class="d-flex flex-column align-center">
              <v-btn
                variant="outlined"
                color="primary"
                class="mb-2"
                @click="pickAvatar"
              >
                <v-icon start>mdi-camera</v-icon>
                {{ $t("pages.profile.uploadAvatar") }}
              </v-btn>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="d-none"
                @change="onFileChange"
              />
              <v-btn variant="text" color="error" @click="removeAvatar">
                <v-icon start>mdi-delete</v-icon>
                {{ $t("pages.profile.removeAvatar") }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title class="text-subtitle-1">{{
            $t("pages.profile.preferences")
          }}</v-card-title>
          <v-divider />
          <v-card-text>
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="text-body-2">{{ $t("pages.profile.darkMode") }}</div>
              <v-switch
                color="primary"
                hide-details
                inset
                :model-value="isDark"
                @update:model-value="toggleMode"
              />
            </div>

            <div class="text-body-2 mb-2">Theme color</div>
            <div class="d-flex align-center" style="gap: 8px">
              <v-chip
                v-for="t in themes"
                :key="t"
                :color="t === currentTheme ? 'primary' : undefined"
                :variant="t === currentTheme ? 'elevated' : 'tonal'"
                class="cursor-pointer"
                @click="setTheme(t)"
              >
                {{ capitalize(t) }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right column: Account + Security -->
      <v-col cols="12" md="8">
        <v-card>
          <v-tabs v-model="tab" color="primary">
            <v-tab value="account"
              ><v-icon start>mdi-account</v-icon>Account</v-tab
            >
            <v-tab value="security"
              ><v-icon start>mdi-shield-key-outline</v-icon>Security</v-tab
            >
          </v-tabs>
          <v-divider />

          <v-window v-model="tab">
            <v-window-item value="account">
              <v-card-text>
                <v-form ref="accountForm" v-model="accountValid">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="form.name"
                        label="Full Name"
                        :rules="[rules.required]"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="form.email"
                        label="Email"
                        type="email"
                        :rules="[rules.required, rules.email]"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="form.phone" label="Phone" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="form.company" label="Company" />
                    </v-col>
                  </v-row>
                  <div class="d-flex justify-end mt-2">
                    <v-btn
                      color="primary"
                      :loading="savingAccount"
                      @click="saveAccount"
                    >
                      <v-icon start>mdi-content-save</v-icon>Save
                    </v-btn>
                  </div>
                </v-form>
              </v-card-text>
            </v-window-item>

            <v-window-item value="security">
              <v-card-text>
                <v-form ref="securityForm" v-model="securityValid">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="security.currentPassword"
                        label="Current Password"
                        :type="showCurrent ? 'text' : 'password'"
                        :append-inner-icon="
                          showCurrent ? 'mdi-eye-off' : 'mdi-eye'
                        "
                        :rules="[rules.required]"
                        @click:append-inner="showCurrent = !showCurrent"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="security.newPassword"
                        label="New Password"
                        :type="showNew ? 'text' : 'password'"
                        :append-inner-icon="showNew ? 'mdi-eye-off' : 'mdi-eye'"
                        :rules="[rules.required, rules.min(6)]"
                        @click:append-inner="showNew = !showNew"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="security.confirmPassword"
                        label="Confirm Password"
                        :type="showConfirm ? 'text' : 'password'"
                        :append-inner-icon="
                          showConfirm ? 'mdi-eye-off' : 'mdi-eye'
                        "
                        :rules="[
                          rules.required,
                          rules.match(security.newPassword),
                        ]"
                        @click:append-inner="showConfirm = !showConfirm"
                      />
                    </v-col>
                  </v-row>
                  <div class="d-flex justify-end mt-2">
                    <v-btn
                      color="primary"
                      :loading="savingSecurity"
                      @click="savePassword"
                    >
                      <v-icon start>mdi-shield-key</v-icon>Update Password
                    </v-btn>
                  </div>
                </v-form>
              </v-card-text>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.open" :color="snackbar.color" timeout="2500">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { useAuthApi } from "~/composables/api/useAuthApi";
import { useAppTheme } from "~/composables/useAppTheme";
import { useAuthStore } from "~/stores/auth/storeAuth";

// 🔒 صفحة محمية
definePageMeta({
  layout: "dashboard",
  title: "pages.profile.title",
  subtitle: "pages.profile.subtitle",
});

const authStore = useAuthStore();
const authApi = useAuthApi();
const currentUser = computed(() => authStore.currentUser);
const { isDark, toggleMode, currentTheme, setTheme } = useAppTheme();

const tab = ref("account");

// Profile summary state
const fileInput = ref(null);
const avatarPreview = ref("");
const roles = computed(() => currentUser?.value?.roles || []);
const displayName = computed(
  () => currentUser?.value?.name || currentUser?.value?.username || "User"
);

const themes = ["gold", "blue", "red"];
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const pickAvatar = () => fileInput.value?.click();
const onFileChange = (e) => {
  const file = e.target?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    avatarPreview.value = String(reader.result || "");
  };
  reader.readAsDataURL(file);
};
const removeAvatar = () => {
  avatarPreview.value = "";
};

// Account form
const accountForm = ref(null);
const accountValid = ref(false);
const form = reactive({
  name: currentUser?.value?.name || "",
  email: currentUser?.value?.email || "",
  phone: currentUser?.value?.phone || "",
  company: currentUser?.value?.company || "",
});

const rules = {
  required: (v) => (!!v && String(v).trim().length > 0) || "Required",
  email: (v) => !v || /.+@.+\..+/.test(v) || "Invalid email",
  min: (n) => (v) => !v || String(v).length >= n || `Min ${n} chars`,
  match: (target) => (v) => v === target || "Does not match",
};

const savingAccount = ref(false);
const snackbar = ref({ open: false, message: "", color: "success" });

const saveAccount = async () => {
  let isValid = false;
  if (accountForm.value && typeof accountForm.value.validate === "function") {
    const res = await accountForm.value.validate();
    isValid = !!(res && res.valid);
  }
  if (!isValid) {
    snackbar.value = {
      open: true,
      message: "Please fix form errors",
      color: "error",
    };
    return;
  }
  savingAccount.value = true;
  try {
    const response = await authApi.updateProfile({
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      avatar: avatarPreview.value || undefined,
    });

    // Update the store with the new user data
    if (response?.admin) {
      authStore.admin = response.admin;
    }

    snackbar.value = {
      open: true,
      message: "Profile updated",
      color: "success",
    };
  } catch (error) {
    console.error("Failed to update profile:", error);
    snackbar.value = {
      open: true,
      message: "Failed to update profile",
      color: "error",
    };
  } finally {
    savingAccount.value = false;
  }
};

// Security form
const securityForm = ref(null);
const securityValid = ref(false);
const security = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

const savingSecurity = ref(false);
const savePassword = async () => {
  let isValid = false;
  if (securityForm.value && typeof securityForm.value.validate === "function") {
    const res = await securityForm.value.validate();
    isValid = !!(res && res.valid);
  }
  if (!isValid) {
    snackbar.value = {
      open: true,
      message: "Please fix form errors",
      color: "error",
    };
    return;
  }
  if (security.newPassword !== security.confirmPassword) {
    snackbar.value = {
      open: true,
      message: "Passwords do not match",
      color: "error",
    };
    return;
  }
  savingSecurity.value = true;
  try {
    await authApi.updateProfile({ password: security.newPassword });
    snackbar.value = {
      open: true,
      message: "Password updated",
      color: "success",
    };
    security.currentPassword = "";
    security.newPassword = "";
    security.confirmPassword = "";
  } catch (error) {
    console.error("Failed to update password:", error);
    snackbar.value = {
      open: true,
      message: "Failed to update password",
      color: "error",
    };
  } finally {
    savingSecurity.value = false;
  }
};
</script>
