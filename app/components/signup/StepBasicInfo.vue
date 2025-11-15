<template>
  <v-form ref="formRef" @submit.prevent="handleNext">
    <v-row>
      <v-col cols="12">
        <h3 class="text-h6 mb-2">{{ t('signup.step1.subtitle') }}</h3>
        <p class="text-caption text-medium-emphasis mb-4">
          {{ t('signup.step1.description') }}
        </p>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="localData.nationalId"
          :label="t('form.nationalId')"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-card-account-details"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="localData.passportNumber"
          :label="t('form.passportNumber')"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-passport"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="localData.phoneNumber"
          :label="t('form.phoneNumber')"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-phone"
          type="tel"
          :rules="[rules.required, rules.phone]"
        />
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <div class="d-flex justify-end">
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

interface FormData {
  nationalId: string;
  passportNumber: string;
  phoneNumber: string;
}

const props = defineProps<{
  formData: FormData;
}>();

const emit = defineEmits<{
  'update:formData': [value: FormData];
  next: [];
}>();

const { t } = useI18n();
const formRef = ref();

const localData = ref({ ...props.formData });

watch(localData, (newVal) => {
  emit('update:formData', newVal);
}, { deep: true });

const rules = {
  required: (v: string) => !!v || t('validation.required'),
  phone: (v: string) => /^[0-9]{10,}$/.test(v) || t('validation.invalidPhone'),
};

const handleNext = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) {
    emit('next');
  }
};
</script>
