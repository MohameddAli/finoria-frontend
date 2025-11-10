<template>
  <v-container fluid class="pa-6">
    <v-card class="multi-step-form-container" elevation="0">
      <!-- Header -->
      <v-card-title class="text-h4 font-weight-bold pa-6 pb-4">
        {{ $t("multiStepForm.title") }}
      </v-card-title>
      <v-card-subtitle class="pa-6 pt-0 text-body-1">
        {{ $t("multiStepForm.subtitle") }}
      </v-card-subtitle>

      <!-- Stepper -->
      <v-stepper
        v-model="currentStep"
        :items="steps"
        :alt-labels="!mobile"
        class="elevation-0"
        hide-actions
        :mobile="mobile"
      >
        <template #default>
          <v-stepper-window>
            <!-- Step 1: User Information -->
            <v-stepper-window-item :value="1">
              <UserInfoStep v-model="formData.userInfo" @next="goToNextStep" />
            </v-stepper-window-item>

            <!-- Step 2: Agent Information -->
            <v-stepper-window-item :value="2">
              <AgentInfoStep
                v-model="formData.agentInfo"
                @next="goToNextStep"
                @back="goToPreviousStep"
              />
            </v-stepper-window-item>

            <!-- Step 3: Company Information -->
            <v-stepper-window-item :value="3">
              <CompanyInfoStep
                v-model="formData.companyInfo"
                @next="goToNextStep"
                @back="goToPreviousStep"
              />
            </v-stepper-window-item>

            <!-- Step 4: Product Selection -->
            <v-stepper-window-item :value="4">
              <ProductSelectionStep
                v-model="formData.productSelection"
                @next="goToNextStep"
                @back="goToPreviousStep"
              />
            </v-stepper-window-item>

            <!-- Step 5: Documents Upload -->
            <v-stepper-window-item :value="5">
              <DocumentsUploadStep
                v-model="formData.documents"
                @next="goToNextStep"
                @back="goToPreviousStep"
              />
            </v-stepper-window-item>

            <!-- Step 6: Confirmation -->
            <v-stepper-window-item :value="6">
              <ConfirmationStep
                :form-data="formData"
                :loading="submitting"
                @submit="submitForm"
                @back="goToPreviousStep"
              />
            </v-stepper-window-item>

            <!-- Step 7: Success -->
            <v-stepper-window-item :value="7">
              <SuccessStep
                :registration-id="registrationId"
                :qr-code="qrCode"
                @new-form="resetForm"
              />
            </v-stepper-window-item>
          </v-stepper-window>
        </template>
      </v-stepper>
    </v-card>
  </v-container>
</template>

<script setup>
import { useDisplay } from "vuetify";
import UserInfoStep from "./steps/UserInfoStep.vue";
import AgentInfoStep from "./steps/AgentInfoStep.vue";
import CompanyInfoStep from "./steps/CompanyInfoStep.vue";
import ProductSelectionStep from "./steps/ProductSelectionStep.vue";
import DocumentsUploadStep from "./steps/DocumentsUploadStep.vue";
import ConfirmationStep from "./steps/ConfirmationStep.vue";
import SuccessStep from "./steps/SuccessStep.vue";

definePageMeta({
  layout: "dashboard",
});

const { t } = useI18n();
const { mobile } = useDisplay();

// Current step
const currentStep = ref(1);

// Form data
const formData = ref({
  userInfo: {},
  agentInfo: {},
  companyInfo: {},
  productSelection: {},
  documents: {},
});

// Submission state
const submitting = ref(false);
const registrationId = ref("");
const qrCode = ref("");

// Steps configuration
const steps = computed(() => [
  { title: t("multiStepForm.steps.userInfo"), value: 1 },
  { title: t("multiStepForm.steps.agentInfo"), value: 2 },
  { title: t("multiStepForm.steps.companyInfo"), value: 3 },
  { title: t("multiStepForm.steps.productSelection"), value: 4 },
  { title: t("multiStepForm.steps.documents"), value: 5 },
  { title: t("multiStepForm.steps.confirmation"), value: 6 },
  { title: t("multiStepForm.steps.success"), value: 7 },
]);

// Navigation methods
const goToNextStep = () => {
  if (currentStep.value < 7) {
    currentStep.value++;
  }
};

const goToPreviousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

// Submit form
const submitForm = async () => {
  submitting.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate mock registration ID and QR code
    registrationId.value = `REG-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;
    qrCode.value = generateQRCode(registrationId.value);

    // Move to success step
    currentStep.value = 7;
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    submitting.value = false;
  }
};

// Generate QR code (mock - in real app, use QR library)
const generateQRCode = (data) => {
  // This would typically use a library like qrcode or vue-qrcode
  // For now, return a placeholder SVG
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23000'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23fff' font-size='12'%3E${data}%3C/text%3E%3C/svg%3E`;
};

// Reset form
const resetForm = () => {
  currentStep.value = 1;
  formData.value = {
    userInfo: {},
    agentInfo: {},
    companyInfo: {},
    productSelection: {},
    documents: {},
  };
  registrationId.value = "";
  qrCode.value = "";
};
</script>

<style scoped>
.multi-step-form-container {
  background: rgb(var(--v-theme-surface));
  border-radius: 16px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

:deep(.v-stepper) {
  background: transparent !important;
}

:deep(.v-stepper-header) {
  box-shadow: none !important;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
  padding: 24px;
}

:deep(.v-stepper-item) {
  padding: 16px;
}

:deep(.v-stepper-item--selected .v-stepper-item__avatar) {
  background: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-stepper-item--complete .v-stepper-item__avatar) {
  background: rgb(var(--v-theme-success)) !important;
}
</style>
