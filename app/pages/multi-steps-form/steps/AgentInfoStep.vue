<template>
  <v-card flat class="step-card">
    <v-card-text class="pa-8">
      <div class="text-h5 font-weight-bold mb-2">
        {{ $t("multiStepForm.agentInfo.title") }}
      </div>
      <div class="text-body-2 text-medium-emphasis mb-6">
        {{ $t("multiStepForm.agentInfo.description") }}
      </div>

      <v-form ref="formRef" v-model="valid" @submit.prevent="handleNext">
        <v-row>
          <!-- Agent Name -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.agentName"
              :label="$t('multiStepForm.agentInfo.agentName')"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-account-tie"
            />
          </v-col>

          <!-- Agent Company -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.agentCompany"
              :label="$t('multiStepForm.agentInfo.agentCompany')"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-office-building"
            />
          </v-col>

          <!-- Agent Email -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.agentEmail"
              :label="$t('multiStepForm.agentInfo.agentEmail')"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-email"
              type="email"
            />
          </v-col>

          <!-- Agent Phone -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.agentPhone"
              :label="$t('multiStepForm.agentInfo.agentPhone')"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-phone"
            />
          </v-col>

          <!-- Agent License Number -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.licenseNumber"
              :label="$t('multiStepForm.agentInfo.licenseNumber')"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-certificate"
            />
          </v-col>

          <!-- Years of Experience -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="formData.yearsOfExperience"
              :label="$t('multiStepForm.agentInfo.yearsOfExperience')"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-briefcase"
              type="number"
              min="0"
            />
          </v-col>

          <!-- Agent Address -->
          <v-col cols="12">
            <v-textarea
              v-model="formData.agentAddress"
              :label="$t('multiStepForm.agentInfo.agentAddress')"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-map-marker"
              rows="3"
            />
          </v-col>
        </v-row>

        <!-- Actions -->
        <v-divider class="my-6" />
        <div class="d-flex justify-space-between">
          <v-btn
            color="secondary"
            size="large"
            variant="outlined"
            @click="emit('back')"
          >
            <v-icon start>mdi-arrow-left</v-icon>
            {{ $t("common.back") }}
          </v-btn>
          <v-btn color="primary" size="large" type="submit" :disabled="!valid">
            {{ $t("common.next") }}
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "next", "back"]);

const formRef = ref(null);
const valid = ref(false);

const formData = ref({
  agentName: props.modelValue.agentName || "",
  agentCompany: props.modelValue.agentCompany || "",
  agentEmail: props.modelValue.agentEmail || "",
  agentPhone: props.modelValue.agentPhone || "",
  licenseNumber: props.modelValue.licenseNumber || "",
  yearsOfExperience: props.modelValue.yearsOfExperience || 0,
  agentAddress: props.modelValue.agentAddress || "",
});

// Validation rules
const rules = {
  required: (value) => !!value || t("validation.required"),
  email: (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || t("validation.invalidEmail");
  },
};

// Watch for changes and emit
watch(
  formData,
  (newValue) => {
    emit("update:modelValue", newValue);
  },
  { deep: true }
);

// Handle next
const handleNext = async () => {
  const { valid: isValid } = await formRef.value.validate();
  if (isValid) {
    emit("next");
  }
};
</script>

<style scoped>
.step-card {
  min-height: 500px;
}
</style>
