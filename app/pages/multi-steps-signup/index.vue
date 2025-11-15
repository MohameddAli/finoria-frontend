<template>
  <v-container class="signup-container py-8">
    <v-card class="mx-auto" max-width="1000" elevation="2">
      <v-card-title class="text-h5 pa-6 bg-primary">
        {{ t('signup.title') }}
      </v-card-title>

      <v-card-text class="pa-6">
        <div class="vertical-stepper">
          <!-- Step 1 -->
          <div class="step-container">
            <div
              class="step-header"
              :class="{ 'step-complete': currentStep > 1, 'step-active': currentStep === 1 }"
              @click="currentStep > 1 ? goToStep(1) : null"
            >
              <div class="step-indicator">
                <v-avatar
                  :color="currentStep > 1 ? 'success' : 'primary'"
                  size="40"
                >
                  <v-icon v-if="currentStep > 1" color="white">mdi-check</v-icon>
                  <span v-else class="text-white font-weight-bold">1</span>
                </v-avatar>
              </div>
              <div class="step-info">
                <div class="step-title">{{ t('signup.step1.title') }}</div>
                <div class="step-subtitle">{{ t('signup.step1.subtitle') }}</div>
              </div>
            </div>
            <div v-if="currentStep === 1" class="step-content">
              <StepBasicInfo
                v-model:form-data="step1Data"
                @next="goToStep(2)"
              />
            </div>
          </div>

          <!-- Step 2 -->
          <div class="step-container">
            <div
              class="step-header"
              :class="{ 'step-complete': currentStep > 2, 'step-active': currentStep === 2, 'step-disabled': currentStep < 2 }"
              @click="currentStep > 2 ? goToStep(2) : null"
            >
              <div class="step-indicator">
                <v-avatar
                  :color="currentStep > 2 ? 'success' : currentStep === 2 ? 'primary' : 'grey-lighten-1'"
                  size="40"
                >
                  <v-icon v-if="currentStep > 2" color="white">mdi-check</v-icon>
                  <span v-else class="text-white font-weight-bold">2</span>
                </v-avatar>
              </div>
              <div class="step-info">
                <div class="step-title">{{ t('signup.step2.title') }}</div>
                <div class="step-subtitle">{{ t('signup.step2.subtitle') }}</div>
              </div>
            </div>
            <div v-if="currentStep === 2" class="step-content">
              <StepDocuments
                v-model:form-data="step2Data"
                @next="goToStep(3)"
                @prev="goToStep(1)"
              />
            </div>
          </div>

          <!-- Step 3 -->
          <div class="step-container">
            <div
              class="step-header"
              :class="{ 'step-complete': currentStep > 3, 'step-active': currentStep === 3, 'step-disabled': currentStep < 3 }"
              @click="currentStep > 3 ? goToStep(3) : null"
            >
              <div class="step-indicator">
                <v-avatar
                  :color="currentStep > 3 ? 'success' : currentStep === 3 ? 'primary' : 'grey-lighten-1'"
                  size="40"
                >
                  <v-icon v-if="currentStep > 3" color="white">mdi-check</v-icon>
                  <span v-else class="text-white font-weight-bold">3</span>
                </v-avatar>
              </div>
              <div class="step-info">
                <div class="step-title">{{ t('signup.step3.title') }}</div>
                <div class="step-subtitle">{{ t('signup.step3.subtitle') }}</div>
              </div>
            </div>
            <div v-if="currentStep === 3" class="step-content">
              <StepEmployment
                v-model:form-data="step3Data"
                @next="goToStep(4)"
                @prev="goToStep(2)"
              />
            </div>
          </div>

          <!-- Step 4 -->
          <div class="step-container">
            <div
              class="step-header"
              :class="{ 'step-complete': currentStep > 4, 'step-active': currentStep === 4, 'step-disabled': currentStep < 4 }"
              @click="currentStep > 4 ? goToStep(4) : null"
            >
              <div class="step-indicator">
                <v-avatar
                  :color="currentStep > 4 ? 'success' : currentStep === 4 ? 'primary' : 'grey-lighten-1'"
                  size="40"
                >
                  <v-icon v-if="currentStep > 4" color="white">mdi-check</v-icon>
                  <span v-else class="text-white font-weight-bold">4</span>
                </v-avatar>
              </div>
              <div class="step-info">
                <div class="step-title">{{ t('signup.step4.title') }}</div>
                <div class="step-subtitle">{{ t('signup.step4.subtitle') }}</div>
              </div>
            </div>
            <div v-if="currentStep === 4" class="step-content">
              <StepBranchAddress
                v-model:form-data="step4Data"
                @prev="goToStep(3)"
                @submit="handleSubmit"
              />
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import StepBasicInfo from '~/components/signup/StepBasicInfo.vue';
import StepDocuments from '~/components/signup/StepDocuments.vue';
import StepEmployment from '~/components/signup/StepEmployment.vue';
import StepBranchAddress from '~/components/signup/StepBranchAddress.vue';

definePageMeta({
  // Registration should be accessible without dashboard shell/auth guard
  layout: 'empty',
});

const { t } = useI18n();

const currentStep = ref(1);

const step1Data = ref({
  nationalId: '',
  passportNumber: '',
  phoneNumber: '',
});

const step2Data = ref({
  personalPhoto: null as File | null,
  passportPhoto: null as File | null,
  signaturePhoto: null as File | null,
  employmentLetter: null as File | null,
});

const step3Data = ref<{
  nationality: 'libyan' | 'foreign';
  idType: string;
  idNumber: string;
  workSector: string;
  educationLevel: string;
  averageIncome: string;
  yearsOfWork: string;
  employerName: string;
  email: string;
  employerPhone: string;
  jobTitle: string;
  maritalStatus: string;
}>({
  nationality: 'libyan',
  idType: '',
  idNumber: '',
  workSector: '',
  educationLevel: '',
  averageIncome: '',
  yearsOfWork: '',
  employerName: '',
  email: '',
  employerPhone: '',
  jobTitle: '',
  maritalStatus: '',
});

const step4Data = ref({
  branch: '',
  birthPlace: '',
  passportIssuePlace: '',
  address: '',
});

const goToStep = (step: number) => {
  currentStep.value = step;
};

const handleSubmit = async () => {
  const formData = {
    ...step1Data.value,
    ...step2Data.value,
    ...step3Data.value,
    ...step4Data.value,
  };

  console.log('Form submitted:', formData);
  // Handle form submission
};
</script>

<style scoped>
.signup-container {
  min-height: 100vh;
}

.vertical-stepper {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step-container {
  position: relative;
}

.step-container:not(:last-child)::before {
  content: '';
  position: absolute;
  right: 19px;
  top: 50px;
  bottom: -10px;
  width: 2px;
  background: rgba(var(--v-border-color), 0.12);
}

.step-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  transition: all 0.3s ease;
}

.step-header.step-complete {
  cursor: pointer;
}

.step-header.step-complete:hover {
  opacity: 0.8;
}

.step-header.step-disabled {
  opacity: 0.5;
}

.step-indicator {
  flex-shrink: 0;
}

.step-info {
  flex: 1;
}

.step-title {
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 4px;
}

.step-subtitle {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  line-height: 1.3;
}

.step-content {
  margin-right: 56px;
  padding: 16px 0 24px 0;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* RTL Support */
[dir="rtl"] .step-container:not(:last-child)::before {
  right: auto;
  left: 19px;
}

[dir="rtl"] .step-content {
  margin-right: 0;
  margin-left: 56px;
}
</style>
