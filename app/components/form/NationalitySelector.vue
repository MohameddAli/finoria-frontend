<template>
  <div class="nationality-selector">
    <v-radio-group v-model="nationality" inline hide-details="auto">
      <v-radio :label="t('form.libyan')" value="libyan" color="primary" />
      <v-radio :label="t('form.foreign')" value="foreign" color="primary" />
    </v-radio-group>

    <v-expand-transition>
      <div v-if="nationality === 'libyan'" class="mt-4">
        <v-select
          v-model="idType"
          :items="idTypes"
          :label="t('form.idType')"
          variant="outlined"
          density="comfortable"
          :rules="rules"
        />
        <v-text-field
          v-if="idType"
          v-model="idNumber"
          :label="idTypeLabel"
          variant="outlined"
          density="comfortable"
          :rules="rules"
          class="mt-3"
        />
      </div>
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  rules?: any[];
}

const props = withDefaults(defineProps<Props>(), {
  rules: () => [],
});

const { t } = useI18n();

const nationality = defineModel<'libyan' | 'foreign'>('nationality');
const idType = defineModel<string>('idType');
const idNumber = defineModel<string>('idNumber');

const idTypes = computed(() => [
  { title: t('form.nationalId'), value: 'national' },
  { title: t('form.administrativeId'), value: 'administrative' },
]);

const idTypeLabel = computed(() => {
  return idType.value === 'national' 
    ? t('form.nationalIdNumber') 
    : t('form.administrativeIdNumber');
});
</script>
