<template>
  <v-container fluid class="installment-link px-4 py-6">
    <v-card class="pa-6 mb-6 hero-card" elevation="2">
      <div class="d-flex flex-wrap align-start justify-space-between ga-4">
        <div class="flex-grow-1">
          <div class="text-h5 font-weight-bold mb-2">
            {{ t('installmentLink.title') }}
          </div>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ t('installmentLink.subtitle') }}
          </p>
          <v-btn color="primary" variant="flat" prepend-icon="mdi-view-dashboard-edit">
            {{ t('installmentLink.heroAction') }}
          </v-btn>
        </div>
        <div class="d-flex ga-4 flex-wrap">
          <v-sheet
            v-for="card in linkStats"
            :key="card.label"
            class="pa-4 metric-card"
            rounded="lg"
            elevation="1"
          >
            <div class="text-caption text-medium-emphasis mb-1">
              {{ card.label }}
            </div>
            <div class="text-h4 font-weight-bold">
              {{ card.value }}
            </div>
            <div class="text-caption text-success mt-1">
              {{ card.hint }}
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
              {{ t('installmentLink.form.title') }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ t('installmentLink.form.subtitle') }}
            </div>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-form ref="linkFormRef" @submit.prevent="generateLink">
              <div class="section-heading">
                {{ t('installmentLink.form.linkSection') }}
              </div>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="installmentForm.planName"
                    :label="t('installmentLink.fields.planName')"
                    :rules="[requiredRule]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="installmentForm.currency"
                    :items="currencyOptions"
                    item-title="label"
                    item-value="value"
                    :label="t('installmentLink.fields.currency')"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="installmentForm.customerName"
                    :label="t('installmentLink.fields.customerName')"
                    :rules="[requiredRule]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="installmentForm.customerPhone"
                    :label="t('installmentLink.fields.customerPhone')"
                    :rules="[requiredRule]"
                    prepend-inner-icon="mdi-phone"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="installmentForm.customerEmail"
                    type="email"
                    :label="t('installmentLink.fields.customerEmail')"
                    prepend-inner-icon="mdi-email-outline"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="installmentForm.amount"
                    type="number"
                    :label="t('installmentLink.fields.amount')"
                    :rules="[requiredRule]"
                    prepend-inner-icon="mdi-currency-usd"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="installmentForm.description"
                    :label="t('installmentLink.fields.description')"
                    rows="2"
                  />
                </v-col>
              </v-row>

              <v-divider class="my-6" />

              <div class="section-heading">
                {{ t('installmentLink.form.planSection') }}
              </div>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-slider
                    v-model="installmentForm.installmentsCount"
                    :min="2"
                    :max="24"
                    step="1"
                    thumb-label="always"
                    :label="t('installmentLink.fields.installmentsCount')"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="installmentForm.frequency"
                    :items="frequencyOptions"
                    item-value="value"
                    item-title="label"
                    :label="t('installmentLink.fields.frequency')"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="installmentForm.firstPaymentDate"
                    type="date"
                    :label="t('installmentLink.fields.firstPaymentDate')"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="installmentForm.collectionChannel"
                    :items="collectionChannels"
                    item-title="label"
                    item-value="value"
                    :label="t('installmentLink.fields.collectionChannel')"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="installmentForm.gracePeriod"
                    type="number"
                    :label="t('installmentLink.fields.gracePeriod')"
                    prepend-inner-icon="mdi-calendar-clock"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="installmentForm.reminderDays"
                    type="number"
                    :label="t('installmentLink.fields.reminderDays')"
                    prepend-inner-icon="mdi-bell-ring"
                  />
                </v-col>
              </v-row>

              <v-divider class="my-6" />

              <div class="section-heading">
                {{ t('installmentLink.form.notificationSection') }}
              </div>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-switch
                    v-model="installmentForm.autoNotify"
                    :label="t('installmentLink.fields.autoNotify')"
                    inset
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="installmentForm.notes"
                    :label="t('installmentLink.fields.notes')"
                    rows="2"
                  />
                </v-col>
              </v-row>

              <div class="d-flex flex-wrap ga-2 justify-end mt-6">
                <v-btn variant="text" @click.prevent="resetForm">
                  {{ t('installmentLink.actions.reset') }}
                </v-btn>
                <v-btn
                  variant="tonal"
                  color="secondary"
                  prepend-icon="mdi-content-copy"
                  :disabled="!generatedLink"
                  @click.prevent="copyLink"
                >
                  {{ t('installmentLink.actions.copy') }}
                </v-btn>
                <v-btn
                  type="submit"
                  color="primary"
                  variant="flat"
                  prepend-icon="mdi-link-variant-plus"
                  :loading="generating"
                >
                  {{ t('installmentLink.actions.generate') }}
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="mb-4" elevation="2">
          <v-card-title class="text-subtitle-1 font-weight-bold d-flex align-center ga-2">
            <v-icon color="primary">mdi-chart-areaspline</v-icon>
            <span>{{ t('installmentLink.summary.title') }}</span>
          </v-card-title>
          <v-card-text>
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="text-caption text-medium-emphasis">
                {{ t('installmentLink.summary.installmentAmount') }}
              </div>
              <div class="text-h5 font-weight-bold">
                {{ formattedInstallmentAmount }}
              </div>
            </div>
            <v-progress-linear
              :model-value="progressValue"
              height="6"
              color="primary"
              rounded
            />
            <div class="text-caption text-medium-emphasis mt-2">
              {{ progressLabel }}
            </div>
          </v-card-text>
        </v-card>

        <v-card class="mb-4" elevation="2">
          <v-card-title class="text-subtitle-1 font-weight-bold">
            {{ t('installmentLink.summary.scheduleTitle') }}
          </v-card-title>
          <v-card-text>
            <v-table density="compact" class="schedule-table">
              <thead>
                <tr>
                  <th>{{ t('table.date') }}</th>
                  <th>{{ t('table.amount') }}</th>
                  <th>{{ t('installmentLink.summary.status') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="payment in paymentSchedule" :key="payment.index">
                  <td>{{ payment.date }}</td>
                  <td>{{ payment.amount }}</td>
                  <td>
                    <v-chip
                      :color="payment.status === 'upcoming' ? 'primary' : 'grey'"
                      size="x-small"
                      variant="tonal"
                    >
                      {{ payment.status === 'upcoming' ? (locale.value === 'ar' ? 'قادمة' : 'Upcoming') : (locale.value === 'ar' ? 'مخطط لها' : 'Planned') }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <v-card elevation="2">
          <v-card-title class="text-subtitle-1 font-weight-bold">
            {{ t('installmentLink.timeline.title') }}
          </v-card-title>
          <v-card-text>
            <v-timeline side="end" density="compact">
              <v-timeline-item
                v-for="step in workflowSteps"
                :key="step.icon"
                :dot-color="step.color"
                :icon="step.icon"
              >
                <div class="text-body-2 font-weight-medium">{{ step.title }}</div>
                <div class="text-caption text-medium-emphasis">{{ step.subtitle }}</div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="successDialog" max-width="520">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          {{ t('installmentLink.success.title') }}
        </v-card-title>
        <v-card-text>
          <p class="mb-4">{{ t('installmentLink.success.message') }}</p>
          <v-text-field
            v-model="generatedLink"
            readonly
            variant="outlined"
            append-inner-icon="mdi-content-copy"
            @click:append-inner="copyLink"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" variant="flat" @click="successDialog = false">
            {{ t('installmentLink.success.cta') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="copied"
      color="primary"
      timeout="2500"
      location="bottom"
    >
      {{ locale.value === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard' }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

definePageMeta({
  layout: 'dashboard',
  title: 'installmentLink.title',
});

const { t, locale } = useI18n();

const linkFormRef = ref();
const successDialog = ref(false);
const generating = ref(false);
const generatedLink = ref('');
const copied = ref(false);

const requiredRule = (value: unknown) => {
  const message = locale.value === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required';
  return !!value || message;
};

const today = new Date().toISOString().slice(0, 10);

const getDefaultInstallmentForm = () => ({
  planName: '',
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  amount: '',
  currency: 'LYD',
  installmentsCount: 6,
  frequency: 'monthly',
  firstPaymentDate: today,
  description: '',
  notes: '',
  collectionChannel: 'online',
  gracePeriod: 3,
  reminderDays: 2,
  autoNotify: true,
});

const installmentForm = ref(getDefaultInstallmentForm());

const currencyOptions = [
  { value: 'LYD', label: 'LYD' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
];

const frequencyOptions = computed(() => [
  { value: 'weekly', label: t('installmentLink.frequencies.weekly') },
  { value: 'biweekly', label: t('installmentLink.frequencies.biweekly') },
  { value: 'monthly', label: t('installmentLink.frequencies.monthly') },
  { value: 'quarterly', label: t('installmentLink.frequencies.quarterly') },
]);

const collectionChannels = computed(() => [
  { value: 'pos', label: t('installmentLink.collectionChannels.pos') },
  { value: 'online', label: t('installmentLink.collectionChannels.online') },
  { value: 'bank', label: t('installmentLink.collectionChannels.bank') },
  { value: 'salary', label: t('installmentLink.collectionChannels.salary') },
]);

const formatCurrency = (value: number) => {
  const localeId = locale.value === 'ar' ? 'ar-LY' : 'en-GB';
  return new Intl.NumberFormat(localeId, {
    style: 'currency',
    currency: installmentForm.value.currency || 'LYD',
    minimumFractionDigits: 2,
  }).format(value);
};

const installmentAmount = computed(() => {
  const amount = Number(installmentForm.value.amount) || 0;
  const count = Number(installmentForm.value.installmentsCount) || 1;
  return count > 0 ? amount / count : amount;
});

const formattedInstallmentAmount = computed(() =>
  formatCurrency(installmentAmount.value || 0),
);

const progressValue = computed(() => {
  const total = Number(installmentForm.value.installmentsCount) || 1;
  return Math.min((1 / total) * 100, 100);
});

const progressLabel = computed(() => {
  if (locale.value === 'ar') {
    return `القسط الأول من ${installmentForm.value.installmentsCount}`;
  }
  return `1 of ${installmentForm.value.installmentsCount} installments`;
});

const dateFormatter = computed(
  () => new Intl.DateTimeFormat(locale.value === 'ar' ? 'ar-LY' : 'en-GB', { dateStyle: 'medium' }),
);

const paymentSchedule = computed(() => {
  const count = Number(installmentForm.value.installmentsCount) || 0;
  const baseDate = installmentForm.value.firstPaymentDate
    ? new Date(installmentForm.value.firstPaymentDate)
    : new Date();
  const frequencyMap: Record<string, number> = {
    weekly: 7,
    biweekly: 14,
    monthly: 30,
    quarterly: 90,
  };
  const step = frequencyMap[installmentForm.value.frequency] || 30;

  return Array.from({ length: count }, (_, index) => {
    const dueDate = new Date(baseDate);
    if (index > 0) {
      dueDate.setDate(dueDate.getDate() + step * index);
    }

    return {
      index,
      date: dateFormatter.value.format(dueDate),
      amount: formatCurrency(installmentAmount.value || 0),
      status: index === 0 ? 'upcoming' : 'planned',
    };
  });
});

const workflowSteps = computed(() => [
  {
    icon: 'mdi-form-select',
    color: 'primary',
    title: t('installmentLink.timeline.steps.setup'),
    subtitle: locale.value === 'ar' ? 'إدخال تفاصيل الخطة والموافقة' : 'Enter plan details & approvals',
  },
  {
    icon: 'mdi-share-variant',
    color: 'secondary',
    title: t('installmentLink.timeline.steps.share'),
    subtitle: locale.value === 'ar' ? 'إرسال الرابط للعميل' : 'Send the link to the customer',
  },
  {
    icon: 'mdi-cash-plus',
    color: 'success',
    title: t('installmentLink.timeline.steps.collect'),
    subtitle: locale.value === 'ar' ? 'تحصيل الأقساط تلقائياً' : 'Collect installments automatically',
  },
  {
    icon: 'mdi-finance',
    color: 'info',
    title: t('installmentLink.timeline.steps.reconcile'),
    subtitle: locale.value === 'ar' ? 'تسوية ومتابعة الدفعات' : 'Reconcile and monitor payments',
  },
]);

const linkStats = computed(() => [
  {
    label: locale.value === 'ar' ? 'خطط نشطة' : 'Active plans',
    value: '32',
    hint: locale.value === 'ar' ? '+5 هذا الشهر' : '+5 this month',
  },
  {
    label: locale.value === 'ar' ? 'نسبة الالتزام' : 'Collection rate',
    value: '94%',
    hint: locale.value === 'ar' ? 'آخر 90 يوماً' : 'Last 90 days',
  },
]);

const resetForm = () => {
  Object.assign(installmentForm.value, getDefaultInstallmentForm());
  linkFormRef.value?.resetValidation?.();
};

const generateLink = async () => {
  const validation = await linkFormRef.value?.validate();
  if (!validation?.valid) {
    return;
  }
  generating.value = true;
  await new Promise((resolve) => setTimeout(resolve, 900));
  generating.value = false;
  generatedLink.value = `https://finoria.ly/installments/${Date.now().toString(36)}`;
  successDialog.value = true;
};

const copyLink = async () => {
  if (!generatedLink.value) {
    return;
  }
  if (typeof navigator !== 'undefined' && navigator?.clipboard) {
    try {
      await navigator.clipboard.writeText(generatedLink.value);
    } catch {
      // ignore clipboard errors
    }
  }
  copied.value = true;
};
</script>

<style scoped>
.installment-link {
  background-color: rgba(var(--v-theme-surface), 0.98);
}

.hero-card {
  border-radius: 18px;
  background: linear-gradient(
    130deg,
    rgba(var(--v-theme-primary), 0.08),
    rgba(var(--v-theme-secondary), 0.08)
  );
  border: 1px solid rgba(var(--v-border-color), 0.15);
}

.metric-card {
  min-width: 160px;
  border: 1px solid rgba(var(--v-border-color), 0.1);
  background-color: rgb(var(--v-theme-surface));
}

.section-heading {
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-heading::before {
  content: '';
  width: 6px;
  height: 20px;
  border-radius: 99px;
  background-color: rgb(var(--v-theme-primary));
  display: inline-block;
}

.schedule-table th {
  font-weight: 600;
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.schedule-table td {
  font-size: 0.9rem;
}
</style>
