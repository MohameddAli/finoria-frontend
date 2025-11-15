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
          accept="image/*"
          :max-size="5"
          required
        />
      </v-col>

      <v-col cols="12" md="6">
        <FileUploadField
          v-model="localData.passportPhoto"
          :label="t('form.passportPhoto')"
          icon="mdi-passport"
          accept="image/*"
          :max-size="5"
          required
        />
      </v-col>

      <v-col cols="12" md="6">
        <FileUploadField
          v-model="localData.signaturePhoto"
          :label="t('form.signaturePhoto')"
          icon="mdi-draw"
          accept="image/*"
          :max-size="5"
          required
        />
      </v-col>

      <v-col cols="12" md="6">
        <FileUploadField
          v-model="localData.employmentLetter"
          :label="t('form.employmentLetter')"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          icon="mdi-file-document"
          :max-size="10"
          required
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
import { ref, watch } from 'vue';
import FileUploadField from '~/components/form/FileUploadField.vue';

interface FormData {
  personalPhoto: File | null;
  passportPhoto: File | null;
  signaturePhoto: File | null;
  employmentLetter: File | null;
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

const handleNext = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) {
    emit('next');
  }
};
</script>
