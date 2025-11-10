<template>
  <v-card flat class="step-card">
    <v-card-text class="pa-8">
      <div class="text-h5 font-weight-bold mb-2">
        {{ $t("multiStepForm.confirmation.title") }}
      </div>
      <div class="text-body-2 text-medium-emphasis mb-6">
        {{ $t("multiStepForm.confirmation.description") }}
      </div>

      <v-row>
        <!-- User Information Summary -->
        <v-col cols="12">
          <v-card variant="outlined">
            <v-card-title class="d-flex align-center bg-primary-lighten pa-4">
              <v-icon start>mdi-account</v-icon>
              {{ $t("multiStepForm.userInfo.title") }}
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t("multiStepForm.userInfo.fullName") }}
                    </div>
                    <div class="info-value">
                      {{ formData.userInfo.fullName || "-" }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t("multiStepForm.userInfo.email") }}
                    </div>
                    <div class="info-value">
                      {{ formData.userInfo.email || "-" }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t("multiStepForm.userInfo.phone") }}
                    </div>
                    <div class="info-value">
                      {{ formData.userInfo.phone || "-" }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t("multiStepForm.userInfo.idNumber") }}
                    </div>
                    <div class="info-value">
                      {{ formData.userInfo.idNumber || "-" }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t("multiStepForm.userInfo.nationality") }}
                    </div>
                    <div class="info-value">
                      {{ formData.userInfo.nationality || "-" }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t("multiStepForm.userInfo.dateOfBirth") }}
                    </div>
                    <div class="info-value">
                      {{ formData.userInfo.dateOfBirth || "-" }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Agent Information Summary -->
        <v-col cols="12">
          <v-card variant="outlined">
            <v-card-title class="d-flex align-center bg-success-lighten pa-4">
              <v-icon start>mdi-account-tie</v-icon>
              {{ $t("multiStepForm.agentInfo.title") }}
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t("multiStepForm.agentInfo.agentName") }}
                    </div>
                    <div class="info-value">
                      {{ formData.agentInfo.agentName || "-" }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t("multiStepForm.agentInfo.agentCompany") }}
                    </div>
                    <div class="info-value">
                      {{ formData.agentInfo.agentCompany || "-" }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t("multiStepForm.agentInfo.licenseNumber") }}
                    </div>
                    <div class="info-value">
                      {{ formData.agentInfo.licenseNumber || "-" }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t("multiStepForm.agentInfo.yearsOfExperience") }}
                    </div>
                    <div class="info-value">
                      {{ formData.agentInfo.yearsOfExperience || "-" }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Company Information Summary -->
        <v-col cols="12">
          <v-card variant="outlined">
            <v-card-title class="d-flex align-center bg-info-lighten pa-4">
              <v-icon start>mdi-domain</v-icon>
              {{ $t("multiStepForm.companyInfo.title") }}
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t("multiStepForm.companyInfo.companyName") }}
                    </div>
                    <div class="info-value">
                      {{ formData.companyInfo.companyName || "-" }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t("multiStepForm.companyInfo.registrationNumber") }}
                    </div>
                    <div class="info-value">
                      {{ formData.companyInfo.registrationNumber || "-" }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t("multiStepForm.companyInfo.taxId") }}
                    </div>
                    <div class="info-value">
                      {{ formData.companyInfo.taxId || "-" }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t("multiStepForm.companyInfo.industry") }}
                    </div>
                    <div class="info-value">
                      {{ formData.companyInfo.industry || "-" }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Product Selection Summary -->
        <v-col cols="12">
          <v-card variant="outlined">
            <v-card-title class="d-flex align-center bg-warning-lighten pa-4">
              <v-icon start>mdi-package-variant</v-icon>
              {{ $t("multiStepForm.productSelection.title") }}
            </v-card-title>
            <v-card-text class="pa-4">
              <div
                v-if="
                  formData.productSelection.products &&
                  formData.productSelection.products.length > 0
                "
              >
                <v-row dense>
                  <v-col
                    v-for="product in formData.productSelection.products"
                    :key="product"
                    cols="12"
                    sm="6"
                  >
                    <v-card variant="tonal" color="primary">
                      <v-card-text class="pa-3">
                        <div class="d-flex align-center justify-space-between">
                          <div>
                            <div class="font-weight-medium">
                              {{
                                $t(
                                  `multiStepForm.productSelection.${product}.name`
                                )
                              }}
                            </div>
                            <div class="text-caption">
                              {{
                                $t(
                                  `multiStepForm.productSelection.${product}.code`
                                )
                              }}
                            </div>
                          </div>
                          <v-chip color="primary" variant="elevated">
                            {{ $t("multiStepForm.confirmation.quantity") }}:
                            {{ formData.productSelection.quantities[product] }}
                          </v-chip>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <div v-if="formData.productSelection.notes" class="mt-3">
                  <div class="text-caption text-medium-emphasis mb-1">
                    {{ $t("multiStepForm.productSelection.notes") }}
                  </div>
                  <div class="text-body-2">
                    {{ formData.productSelection.notes }}
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-medium-emphasis py-4">
                {{ $t("multiStepForm.confirmation.noProducts") }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Documents Summary -->
        <v-col cols="12">
          <v-card variant="outlined">
            <v-card-title class="d-flex align-center bg-secondary-lighten pa-4">
              <v-icon start>mdi-file-document-multiple</v-icon>
              {{ $t("multiStepForm.documents.title") }}
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row dense>
                <v-col cols="12" sm="4">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t("multiStepForm.documents.pdfDocument") }}
                    </div>
                    <div class="info-value">
                      <v-chip color="error" size="small">
                        {{ formData.documents.pdfFile?.length || 0 }}
                        {{ $t("multiStepForm.confirmation.files") }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t("multiStepForm.documents.images") }}
                    </div>
                    <div class="info-value">
                      <v-chip color="success" size="small">
                        {{ formData.documents.images?.length || 0 }}
                        {{ $t("multiStepForm.confirmation.files") }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t("multiStepForm.documents.additionalDocs") }}
                    </div>
                    <div class="info-value">
                      <v-chip color="info" size="small">
                        {{ formData.documents.additionalDocs?.length || 0 }}
                        {{ $t("multiStepForm.confirmation.files") }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Confirmation Checkbox -->
        <v-col cols="12">
          <v-card variant="outlined" color="warning">
            <v-card-text class="pa-4">
              <v-checkbox
                v-model="confirmationChecked"
                color="warning"
                hide-details
              >
                <template #label>
                  <div class="text-body-2">
                    {{ $t("multiStepForm.confirmation.confirmText") }}
                  </div>
                </template>
              </v-checkbox>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Actions -->
      <v-divider class="my-6" />
      <div class="d-flex justify-space-between">
        <v-btn
          color="secondary"
          size="large"
          variant="outlined"
          :disabled="loading"
          @click="emit('back')"
        >
          <v-icon start>mdi-arrow-left</v-icon>
          {{ $t("common.back") }}
        </v-btn>
        <v-btn
          color="success"
          size="large"
          :loading="loading"
          :disabled="!confirmationChecked"
          @click="emit('submit')"
        >
          <v-icon start>mdi-check-circle</v-icon>
          {{ $t("multiStepForm.confirmation.submit") }}
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  formData: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit", "back"]);

const confirmationChecked = ref(false);
</script>

<style scoped>
.step-card {
  min-height: 500px;
}

.info-item {
  margin-bottom: 12px;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
}

.bg-primary-lighten {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
}

.bg-success-lighten {
  background-color: rgba(var(--v-theme-success), 0.1) !important;
}

.bg-info-lighten {
  background-color: rgba(var(--v-theme-info), 0.1) !important;
}

.bg-warning-lighten {
  background-color: rgba(var(--v-theme-warning), 0.1) !important;
}

.bg-secondary-lighten {
  background-color: rgba(var(--v-theme-secondary), 0.1) !important;
}
</style>
