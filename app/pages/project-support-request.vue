<template>
  <v-container fluid class="project-support-request px-4 py-6">
    <v-card class="pa-6 mb-6 hero-card" elevation="2">
      <div class="d-flex flex-wrap align-start justify-space-between ga-4">
        <div class="flex-grow-1">
          <div class="text-h5 font-weight-bold mb-2">
            {{ t('projectSupportRequest.title') }}
          </div>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ t('projectSupportRequest.subtitle') }}
          </p>
          <v-btn color="primary" variant="flat" prepend-icon="mdi-file-eye-outline">
            {{ t('projectSupportRequest.heroAction') }}
          </v-btn>
        </div>
        <div class="d-flex flex-column ga-3 stats-wrapper">
          <v-sheet
            v-for="metric in heroMetrics"
            :key="metric.label"
            class="pa-4 metric-card"
            rounded="lg"
            elevation="1"
          >
            <div class="text-h4 font-weight-bold">
              {{ metric.value }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ metric.label }}
            </div>
            <div class="text-caption font-weight-medium text-success mt-1">
              {{ metric.hint }}
            </div>
          </v-sheet>
        </div>
      </div>
    </v-card>

    <v-row align="stretch" dense>
      <v-col cols="12" lg="8">
        <v-card elevation="2">
          <v-card-title class="d-flex flex-column align-start">
            <div class="text-subtitle-1 font-weight-bold">
              {{ t('projectSupportRequest.formCard.title') }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ t('projectSupportRequest.formCard.subtitle') }}
            </div>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-form ref="formRef" @submit.prevent="handleSubmit">
              <!-- Project information -->
              <div class="section-heading">
                {{ t('projectSupportRequest.sections.projectInfo') }}
              </div>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="requestForm.projectName"
                    :label="t('projectSupportRequest.fields.projectName')"
                    :rules="[requiredRule]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="requestForm.projectCategory"
                    :items="categoryOptions"
                    item-value="value"
                    item-title="label"
                    :label="t('projectSupportRequest.fields.projectCategory')"
                    :rules="[requiredRule]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="requestForm.projectType"
                    :items="projectTypeOptions"
                    item-value="value"
                    item-title="label"
                    :label="t('projectSupportRequest.fields.projectType')"
                    :rules="[requiredRule]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="requestForm.city"
                    :items="cityOptions"
                    item-value="value"
                    item-title="label"
                    :label="t('projectSupportRequest.fields.city')"
                    :rules="[requiredRule]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="requestForm.targetAmount"
                    type="number"
                    :label="t('projectSupportRequest.fields.targetAmount')"
                    :rules="[requiredRule]"
                    prepend-inner-icon="mdi-currency-usd"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="requestForm.currentFunding"
                    type="number"
                    :label="t('projectSupportRequest.fields.currentFunding')"
                    prepend-inner-icon="mdi-chart-line"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="requestForm.startDate"
                    type="date"
                    :label="t('projectSupportRequest.fields.startDate')"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="requestForm.endDate"
                    type="date"
                    :label="t('projectSupportRequest.fields.endDate')"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="requestForm.goals"
                    :label="t('projectSupportRequest.fields.goals')"
                    rows="3"
                  />
                </v-col>
                <v-col cols="12">
                  <div class="text-caption mb-2">
                    {{ t('projectSupportRequest.fields.tags') }}
                  </div>
                  <v-chip-group
                    v-model="requestForm.tags"
                    multiple
                    class="mb-4"
                    selected-class="chip-selected"
                  >
                    <v-chip
                      v-for="tag in tagOptions"
                      :key="tag.value"
                      :value="tag.value"
                      variant="outlined"
                      prepend-icon="mdi-checkbox-blank-circle"
                      size="small"
                    >
                      {{ tag.label }}
                    </v-chip>
                  </v-chip-group>
                </v-col>
              </v-row>

              <v-divider class="my-6" />

              <!-- Organization info -->
              <div class="section-heading">
                {{ t('projectSupportRequest.sections.organizationInfo') }}
              </div>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="requestForm.organizationName"
                    :label="t('projectSupportRequest.fields.organizationName')"
                    :rules="[requiredRule]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="requestForm.licenseNumber"
                    :label="t('projectSupportRequest.fields.licenseNumber')"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="requestForm.contactPerson"
                    :label="t('projectSupportRequest.fields.contactPerson')"
                    :rules="[requiredRule]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="requestForm.contactPhone"
                    :label="t('projectSupportRequest.fields.contactPhone')"
                    :rules="[requiredRule]"
                    prepend-inner-icon="mdi-phone"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="requestForm.contactEmail"
                    type="email"
                    :label="t('projectSupportRequest.fields.contactEmail')"
                    :rules="[requiredRule]"
                    prepend-inner-icon="mdi-email-outline"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="requestForm.website"
                    :label="t('projectSupportRequest.fields.website')"
                    prepend-inner-icon="mdi-web"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="requestForm.experienceYears"
                    type="number"
                    :label="t('projectSupportRequest.fields.experienceYears')"
                  />
                </v-col>
              </v-row>

              <v-divider class="my-6" />

              <!-- Funding & impact -->
              <div class="section-heading">
                {{ t('projectSupportRequest.sections.fundingInfo') }}
              </div>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="requestForm.payChannel"
                    :items="payChannelOptions"
                    item-value="value"
                    item-title="label"
                    :label="t('projectSupportRequest.fields.payChannel')"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="requestForm.iban"
                    :label="t('projectSupportRequest.fields.iban')"
                    prepend-inner-icon="mdi-bank"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="requestForm.disbursementPlan"
                    :label="t('projectSupportRequest.fields.disbursementPlan')"
                    rows="3"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="requestForm.monitoringPlan"
                    :label="t('projectSupportRequest.fields.monitoringPlan')"
                    rows="3"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="requestForm.impactMetrics"
                    :label="t('projectSupportRequest.fields.impactMetrics')"
                    rows="3"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="requestForm.reportingFrequency"
                    :items="reportingOptions"
                    item-value="value"
                    item-title="label"
                    :label="t('projectSupportRequest.fields.reportingFrequency')"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="requestForm.notes"
                    :label="t('projectSupportRequest.fields.notes')"
                    rows="2"
                  />
                </v-col>
              </v-row>

              <v-divider class="my-6" />

              <!-- Attachments -->
              <div class="section-heading">
                {{ t('projectSupportRequest.sections.attachments') }}
              </div>
              <v-row dense>
                <v-col cols="12" md="4">
                  <v-file-input
                    v-model="requestForm.proposal"
                    :label="t('projectSupportRequest.fields.proposal')"
                    prepend-icon="mdi-file-pdf-box"
                    accept=".pdf"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-file-input
                    v-model="requestForm.budget"
                    :label="t('projectSupportRequest.fields.budget')"
                    prepend-icon="mdi-file-table-box"
                    accept=".pdf,.xls,.xlsx"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-file-input
                    v-model="requestForm.media"
                    :label="t('projectSupportRequest.fields.media')"
                    prepend-icon="mdi-image-multiple"
                    accept="image/*"
                  />
                </v-col>
              </v-row>

              <div class="d-flex flex-wrap ga-3 justify-space-between mt-6">
                <div class="text-caption text-medium-emphasis">
                  {{ t('projectSupportRequest.guidelinesCard.subtitle') }}
                </div>
                <div class="d-flex ga-2">
                  <v-btn
                    color="secondary"
                    variant="tonal"
                    prepend-icon="mdi-content-save"
                    :loading="savingDraft"
                    @click.prevent="saveDraft"
                  >
                    {{ t('projectSupportRequest.actions.saveDraft') }}
                  </v-btn>
                  <v-btn variant="text" @click.prevent="resetForm">
                    {{ t('projectSupportRequest.actions.reset') }}
                  </v-btn>
                  <v-btn
                    type="submit"
                    color="primary"
                    variant="flat"
                    prepend-icon="mdi-send"
                    :loading="submitting"
                  >
                    {{ t('projectSupportRequest.actions.submit') }}
                  </v-btn>
                </div>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="mb-4" elevation="2">
          <v-card-title class="text-subtitle-1 font-weight-bold">
            {{ t('projectSupportRequest.guidelinesCard.title') }}
          </v-card-title>
          <v-card-text>
            <v-alert
              type="info"
              variant="tonal"
              class="mb-4"
              prepend-icon="mdi-information-outline"
            >
              {{ t('projectSupportRequest.guidelinesCard.subtitle') }}
            </v-alert>
            <v-list density="compact" nav>
              <v-list-item
                v-for="(item, index) in guidelineItems"
                :key="item"
                :title="item"
              >
                <template #prepend>
                  <v-avatar size="28" color="primary" variant="tonal">
                    <span class="text-caption font-weight-bold">{{ index + 1 }}</span>
                  </v-avatar>
                </template>
              </v-list-item>
            </v-list>
            <v-btn
              class="mt-4"
              block
              variant="outlined"
              prepend-icon="mdi-download-box"
            >
              {{ t('projectSupportRequest.guidelinesCard.cta') }}
            </v-btn>
          </v-card-text>
        </v-card>

        <v-card class="mb-4" elevation="2">
          <v-card-title class="text-subtitle-1 font-weight-bold">
            {{ t('projectSupportRequest.checklist.title') }}
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item
                v-for="check in checklistItems"
                :key="check.label"
              >
                <template #prepend>
                  <v-icon color="success">mdi-check-decagram</v-icon>
                </template>
                <v-list-item-title>{{ check.label }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-card elevation="2">
          <v-card-title class="d-flex align-center ga-2">
            <v-icon color="primary">mdi-headset</v-icon>
            <span class="text-subtitle-1 font-weight-bold">
              {{ t('projectSupportRequest.helpCard.title') }}
            </span>
          </v-card-title>
          <v-card-text>
            <p class="text-body-2 mb-4">
              {{ t('projectSupportRequest.helpCard.description') }}
            </p>
            <div class="d-flex align-center ga-2 mb-2">
              <v-icon size="18">mdi-email-outline</v-icon>
              <span class="font-weight-medium">{{ t('projectSupportRequest.helpCard.contact') }}</span>
            </div>
            <div class="d-flex align-center ga-2 mb-4">
              <v-icon size="18">mdi-clock-outline</v-icon>
              <span class="text-body-2">{{ t('projectSupportRequest.helpCard.availability') }}</span>
            </div>
            <v-progress-linear
              :model-value="reviewProgress"
              color="primary"
              rounded
              height="6"
            />
            <div class="text-caption text-medium-emphasis mt-2">
              {{ reviewProgress }}% {{ locale.value === 'ar' ? 'من الطلبات أجيبت هذا الأسبوع' : 'of requests resolved this week' }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="submissionDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">
          {{ t('projectSupportRequest.success.title') }}
        </v-card-title>
        <v-card-text>
          {{ t('projectSupportRequest.success.message') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" variant="flat" @click="submissionDialog = false">
            {{ t('projectSupportRequest.success.cta') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="draftSaved"
      color="primary"
      timeout="3000"
      location="bottom"
    >
      {{ locale.value === 'ar' ? 'تم حفظ المسودة مؤقتاً' : 'Draft saved locally' }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

definePageMeta({
  layout: 'dashboard',
  title: 'projectSupportRequest.title',
});

const { t, locale } = useI18n();

const formRef = ref();
const submissionDialog = ref(false);
const submitting = ref(false);
const savingDraft = ref(false);
const draftSaved = ref(false);

const requiredRule = (value: unknown) => {
  const message = locale.value === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required';
  return !!value || message;
};

const getDefaultForm = () => ({
  projectName: '',
  projectCategory: '',
  projectType: '',
  city: '',
  targetAmount: '',
  currentFunding: '',
  startDate: '',
  endDate: '',
  goals: '',
  tags: [] as string[],
  organizationName: '',
  licenseNumber: '',
  contactPerson: '',
  contactPhone: '',
  contactEmail: '',
  website: '',
  experienceYears: '',
  payChannel: '',
  disbursementPlan: '',
  iban: '',
  monitoringPlan: '',
  impactMetrics: '',
  reportingFrequency: '',
  notes: '',
  proposal: null as File | null,
  budget: null as File | null,
  media: null as File | null,
});

const requestForm = ref(getDefaultForm());

const heroMetrics = computed(() => [
  {
    label: t('projectSupportRequest.stats.pending'),
    value: '18',
    hint: t('projectSupportRequest.stats.pendingHint'),
  },
  {
    label: t('projectSupportRequest.stats.approved'),
    value: '46',
    hint: t('projectSupportRequest.stats.approvedHint'),
  },
  {
    label: t('projectSupportRequest.stats.funding'),
    value: '12.4M',
    hint: t('projectSupportRequest.stats.fundingHint'),
  },
]);

const projectTypeOptions = computed(() => [
  { value: 'charity', label: t('projectSupportRequest.projectTypes.charity') },
  { value: 'education', label: t('projectSupportRequest.projectTypes.education') },
  { value: 'health', label: t('projectSupportRequest.projectTypes.health') },
  { value: 'infrastructure', label: t('projectSupportRequest.projectTypes.infrastructure') },
  { value: 'innovation', label: t('projectSupportRequest.projectTypes.innovation') },
]);

const categoryOptions = computed(() => [
  { value: 'orphan', label: t('projectSupportRequest.categories.orphan') },
  { value: 'community', label: t('projectSupportRequest.categories.community') },
  { value: 'medical', label: t('projectSupportRequest.categories.medical') },
  { value: 'education', label: t('projectSupportRequest.categories.education') },
  { value: 'environment', label: t('projectSupportRequest.categories.environment') },
]);

const cityOptions = computed(() => [
  { value: 'tripoli', label: t('projectSupportRequest.cities.tripoli') },
  { value: 'benghazi', label: t('projectSupportRequest.cities.benghazi') },
  { value: 'misrata', label: t('projectSupportRequest.cities.misrata') },
  { value: 'sabha', label: t('projectSupportRequest.cities.sabha') },
  { value: 'derna', label: t('projectSupportRequest.cities.derna') },
]);

const reportingOptions = computed(() => [
  { value: 'monthly', label: t('projectSupportRequest.reportingOptions.monthly') },
  { value: 'quarterly', label: t('projectSupportRequest.reportingOptions.quarterly') },
  { value: 'milestones', label: t('projectSupportRequest.reportingOptions.milestones') },
]);

const payChannelOptions = computed(() => [
  { value: 'bank', label: t('projectSupportRequest.payChannels.bank') },
  { value: 'pos', label: t('projectSupportRequest.payChannels.pos') },
  { value: 'online', label: t('projectSupportRequest.payChannels.online') },
  { value: 'cash', label: t('projectSupportRequest.payChannels.cash') },
]);

const tagOptions = computed(() => [
  { value: 'urgent', label: t('projectSupportRequest.tagOptions.urgent') },
  { value: 'strategic', label: t('projectSupportRequest.tagOptions.strategic') },
  { value: 'community', label: t('projectSupportRequest.tagOptions.community') },
  { value: 'awareness', label: t('projectSupportRequest.tagOptions.awareness') },
]);

const reviewProgress = 78;

const guidelineItems = computed(() => [
  t('projectSupportRequest.guidelines.item1'),
  t('projectSupportRequest.guidelines.item2'),
  t('projectSupportRequest.guidelines.item3'),
  t('projectSupportRequest.guidelines.item4'),
]);

const checklistItems = computed(() => [
  { label: t('projectSupportRequest.checklist.impact') },
  { label: t('projectSupportRequest.checklist.transparency') },
  { label: t('projectSupportRequest.checklist.compliance') },
]);

const resetForm = () => {
  Object.assign(requestForm.value, getDefaultForm());
  formRef.value?.resetValidation?.();
};

const saveDraft = async () => {
  savingDraft.value = true;
  await new Promise((resolve) => setTimeout(resolve, 800));
  savingDraft.value = false;
  draftSaved.value = true;
};

const handleSubmit = async () => {
  const validation = await formRef.value?.validate();
  if (!validation?.valid) {
    return;
  }
  submitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1200));
  submitting.value = false;
  submissionDialog.value = true;
  resetForm();
};
</script>

<style scoped>
.project-support-request {
  background-color: rgba(var(--v-theme-surface), 0.98);
}

.hero-card {
  border-radius: 18px;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.08),
    rgba(var(--v-theme-secondary), 0.08)
  );
  border: 1px solid rgba(var(--v-border-color), 0.15);
}

.metric-card {
  min-width: 180px;
  border: 1px solid rgba(var(--v-border-color), 0.1);
  background-color: rgb(var(--v-theme-surface));
}

.section-heading {
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-heading::before {
  content: '';
  width: 6px;
  height: 18px;
  border-radius: 99px;
  background-color: rgb(var(--v-theme-primary));
  display: inline-block;
}

.chip-selected {
  background-color: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

.stats-wrapper {
  min-width: 260px;
}
</style>
