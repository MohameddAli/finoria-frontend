<template>
  <v-card flat class="step-card">
    <v-card-text class="pa-8">
      <div class="text-h5 font-weight-bold mb-2">
        {{ $t("multiStepForm.companyInfo.title") }}
      </div>
      <div class="text-body-2 text-medium-emphasis mb-6">
        {{ $t("multiStepForm.companyInfo.description") }}
      </div>

      <v-form ref="formRef" v-model="valid" @submit.prevent="handleNext">
        <v-row>
          <!-- Company Name -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.companyName"
              :label="$t('multiStepForm.companyInfo.companyName')"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-domain"
            />
          </v-col>

          <!-- Registration Number -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.registrationNumber"
              :label="$t('multiStepForm.companyInfo.registrationNumber')"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-numeric"
            />
          </v-col>

          <!-- Tax ID -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.taxId"
              :label="$t('multiStepForm.companyInfo.taxId')"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-file-document"
            />
          </v-col>

          <!-- Industry -->
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.industry"
              :label="$t('multiStepForm.companyInfo.industry')"
              :rules="[rules.required]"
              :items="industries"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-factory"
            />
          </v-col>

          <!-- Company Email -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.companyEmail"
              :label="$t('multiStepForm.companyInfo.companyEmail')"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-email"
              type="email"
            />
          </v-col>

          <!-- Company Phone -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.companyPhone"
              :label="$t('multiStepForm.companyInfo.companyPhone')"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-phone"
            />
          </v-col>

          <!-- Website -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.website"
              :label="$t('multiStepForm.companyInfo.website')"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-web"
              type="url"
            />
          </v-col>

          <!-- Number of Employees -->
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.numberOfEmployees"
              :label="$t('multiStepForm.companyInfo.numberOfEmployees')"
              :rules="[rules.required]"
              :items="employeeRanges"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-account-group"
            />
          </v-col>

          <!-- Company Address -->
          <v-col cols="12">
            <v-textarea
              v-model="formData.companyAddress"
              :label="$t('multiStepForm.companyInfo.companyAddress')"
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
  companyName: props.modelValue.companyName || "",
  registrationNumber: props.modelValue.registrationNumber || "",
  taxId: props.modelValue.taxId || "",
  industry: props.modelValue.industry || "",
  companyEmail: props.modelValue.companyEmail || "",
  companyPhone: props.modelValue.companyPhone || "",
  website: props.modelValue.website || "",
  numberOfEmployees: props.modelValue.numberOfEmployees || "",
  companyAddress: props.modelValue.companyAddress || "",
});

// Industries list
const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Manufacturing",
  "Retail",
  "Education",
  "Construction",
  "Transportation",
  "Real Estate",
  "Other",
];

// Employee ranges
const employeeRanges = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];

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
