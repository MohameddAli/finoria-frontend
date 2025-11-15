<template>
  <v-form ref="formRef" @submit.prevent="handleNext">
    <v-row>
      <v-col cols="12">
        <h3 class="text-h6 mb-2">{{ t('signup.step2.documentsTitle') }}</h3>
        <p class="text-caption text-medium-emphasis mb-4">
          {{ t('signup.step2.documentsSubtitle') }}
        </p>
      </v-col>

      <v-col cols="12" md="6">
        <FileUploadField
          v-model="localData.personalPhoto"
          :label="t('form.personalPhoto')"
          icon="mdi-account-circle"
        />
      </v-col>

      <v-col cols="12" md="6">
        <FileUploadField
          v-model="localData.passportPhoto"
          :label="t('form.passportPhoto')"
          icon="mdi-passport"
        />
      </v-col>

      <v-col cols="12" md="6">
        <FileUploadField
          v-model="localData.signaturePhoto"
          :label="t('form.signaturePhoto')"
          icon="mdi-draw"
        />
      </v-col>

      <v-col cols="12" md="6">
        <FileUploadField
          v-model="localData.employmentLetter"
          :label="t('form.employmentLetter')"
          accept=".pdf,.doc,.docx"
          icon="mdi-file-document"
        />
      </v-col>

      <v-col cols="12">
        <v-divider class="my-4" />
        <h3 class="text-h6 mb-4">{{ t('signup.step2.nationalityTitle') }}</h3>
      </v-col>

      <v-col cols="12">
        <NationalitySelector
          v-model:nationality="localData.nationality"
          v-model:id-type="localData.idType"
          v-model:id-number="localData.idNumber"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12">
        <v-divider class="my-4" />
        <h3 class="text-h6 mb-4">{{ t('signup.step2.employmentTitle') }}</h3>
      </v-col>

      <v-col cols="12" md="6">
        <v-select
          v-model="localData.workSector"
          :items="workSectors"
          :label="t('form.workSector')"
          variant="outlined"
          density="comfortable"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-select
          v-model="localData.educationLevel"
          :items="educationLevels"
          :label="t('form.educationLevel')"
          variant="outlined"
          density="comfortable"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-select
          v-model="localData.averageIncome"
          :items="incomeRanges"
          :label="t('form.averageIncome')"
          variant="outlined"
          density="comfortable"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="localData.yearsOfWork"
          :label="t('form.yearsOfWork')"
          variant="outlined"
          density="comfortable"
          type="number"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="localData.employerName"
          :label="t('form.employerName')"
          variant="outlined"
          density="comfortable"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="localData.email"
          :label="t('form.email')"
          variant="outlined"
          density="comfortable"
          type="email"
          prepend-inner-icon="mdi-email"
          :rules="[rules.required, rules.email]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="localData.employerPhone"
          :label="t('form.employerPhone')"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-phone"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="localData.jobTitle"
          :label="t('form.jobTitle')"
          variant="outlined"
          density="comfortable"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-select
          v-model="localData.maritalStatus"
          :items="maritalStatuses"
          :label="t('form.maritalStatus')"
          variant="outlined"
          density="comfortable"
          :rules="[rules.required]"
        />
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <div class="d-flex justify-space-between">
      <v-btn
        variant="outlined"
        size="large"
        prepend-icon="mdi-arrow-left"
        @click="emit('prev')"
      >
        {{ t('common.previous') }}
      </v-btn>
      <v-btn
        type="submit"
        color="primary"
        size="large"
        append-icon="mdi-arrow-right"
      >
        {{ t('common.next') }}
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

interface FormData {
  personalPhoto: File | null;
  passportPhoto: File | null;
  signaturePhoto: File | null;
  employmentLetter: File | null;
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
}

const props = defineProps<{
  formData: FormData;
}>();

const emit = defineEmits<{
  'update:formData': [value: FormData];
  next: [];
  prev: [];
}>();

const { t } = useI18n();
const formRef = ref();

const localData = ref({ ...props.formData });

watch(localData, (newVal) => {
  emit('update:formData', newVal);
}, { deep: true });

const workSectors = computed(() => [
  t('form.sectors.public'),
  t('form.sectors.private'),
  t('form.sectors.selfEmployed'),
]);

const educationLevels = computed(() => [
  t('form.education.highSchool'),
  t('form.education.bachelor'),
  t('form.education.master'),
  t('form.education.phd'),
]);

const incomeRanges = computed(() => [
  t('form.income.low'),
  t('form.income.medium'),
  t('form.income.high'),
]);

const maritalStatuses = computed(() => [
  t('form.marital.single'),
  t('form.marital.married'),
  t('form.marital.divorced'),
  t('form.marital.widowed'),
]);

const rules = {
  required: (v: any) => !!v || t('validation.required'),
  email: (v: string) => /.+@.+\..+/.test(v) || t('validation.invalidEmail'),
};

const handleNext = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) {
    emit('next');
  }
};
</script>
