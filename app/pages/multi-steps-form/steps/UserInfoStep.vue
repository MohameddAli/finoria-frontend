<template>
  <v-card flat class="step-card">
    <v-card-text class="pa-8">
      <div class="text-h5 font-weight-bold mb-2">
        {{ $t("multiStepForm.userInfo.title") }}
      </div>
      <div class="text-body-2 text-medium-emphasis mb-6">
        {{ $t("multiStepForm.userInfo.description") }}
      </div>

      <v-form ref="formRef" v-model="valid" @submit.prevent="handleNext">
        <v-row>
          <!-- Full Name -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.fullName"
              :label="$t('multiStepForm.userInfo.fullName')"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-account"
            />
          </v-col>

          <!-- Email -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.email"
              :label="$t('multiStepForm.userInfo.email')"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-email"
              type="email"
            />
          </v-col>

          <!-- Phone -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.phone"
              :label="$t('multiStepForm.userInfo.phone')"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-phone"
            />
          </v-col>

          <!-- ID Number -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.idNumber"
              :label="$t('multiStepForm.userInfo.idNumber')"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-card-account-details"
            />
          </v-col>

          <!-- Date of Birth -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.dateOfBirth"
              :label="$t('multiStepForm.userInfo.dateOfBirth')"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-calendar"
              type="date"
            />
          </v-col>

          <!-- Nationality -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.nationality"
              :label="$t('multiStepForm.userInfo.nationality')"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-flag"
            />
          </v-col>

          <!-- Address -->
          <v-col cols="12">
            <v-textarea
              v-model="formData.address"
              :label="$t('multiStepForm.userInfo.address')"
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
        <div class="d-flex justify-end gap-3">
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

const emit = defineEmits(["update:modelValue", "next"]);

const formRef = ref(null);
const valid = ref(false);

const formData = ref({
  fullName: props.modelValue.fullName || "",
  email: props.modelValue.email || "",
  phone: props.modelValue.phone || "",
  idNumber: props.modelValue.idNumber || "",
  dateOfBirth: props.modelValue.dateOfBirth || "",
  nationality: props.modelValue.nationality || "",
  address: props.modelValue.address || "",
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

.gap-3 {
  gap: 12px;
}
</style>
