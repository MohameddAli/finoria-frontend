<template>
  <v-form ref="formRef" @submit.prevent="handleSubmit">
    <v-row>
      <v-col cols="12">
        <h3 class="text-h6 mb-4">{{ t('signup.step3.subtitle') }}</h3>
      </v-col>

      <v-col cols="12" md="6">
        <v-select
          v-model="localData.branch"
          :items="branches"
          :label="t('form.branch')"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-bank"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="localData.birthPlace"
          :label="t('form.birthPlace')"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-map-marker"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="localData.passportIssuePlace"
          :label="t('form.passportIssuePlace')"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-passport"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-textarea
          v-model="localData.address"
          :label="t('form.address')"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-home"
          rows="3"
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
        color="success"
        size="large"
        append-icon="mdi-check"
        :loading="loading"
      >
        {{ t('common.submit') }}
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

interface FormData {
  branch: string;
  birthPlace: string;
  passportIssuePlace: string;
  address: string;
}

const props = defineProps<{
  formData: FormData;
}>();

const emit = defineEmits<{
  'update:formData': [value: FormData];
  prev: [];
  submit: [];
}>();

const { t } = useI18n();
const formRef = ref();
const loading = ref(false);

const localData = ref({ ...props.formData });

watch(localData, (newVal) => {
  emit('update:formData', newVal);
}, { deep: true });

const branches = computed(() => [
  t('form.branches.tripoli'),
  t('form.branches.benghazi'),
  t('form.branches.misrata'),
  t('form.branches.zawiya'),
]);

const rules = {
  required: (v: string) => !!v || t('validation.required'),
};

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) {
    loading.value = true;
    try {
      emit('submit');
    } finally {
      loading.value = false;
    }
  }
};
</script>
