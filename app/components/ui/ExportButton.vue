<template>
  <div class="export-button">
    <!-- Export Menu Button -->
    <v-menu v-if="showAsMenu" :close-on-content-click="false">
      <template v-slot:activator="{ props: menuProps }">
        <v-btn
          v-bind="{ ...menuProps, ...$attrs }"
          :color="color"
          :variant="variant"
          :size="size"
          :disabled="disabled || isExporting"
          :loading="isExporting"
        >
          <v-icon start>{{ icon }}</v-icon>
          {{ buttonText }}
          <v-icon end>mdi-chevron-down</v-icon>
        </v-btn>
      </template>

      <v-card min-width="320">
        <v-card-title class="text-subtitle-1">
          <v-icon class="mr-2">mdi-download</v-icon>
          {{ $t('export.title') }}
        </v-card-title>
        
        <v-card-text class="pa-4">
          <ExportOptionsForm
            :data="data"
            :columns="columns"
            :default-filename="defaultFilename"
            :formats="formats"
            :disabled="disabled || isExporting"
            @export="handleExport"
            @cancel="closeMenu"
          />
        </v-card-text>
      </v-card>
    </v-menu>

    <!-- Direct Export Buttons -->
    <div v-else class="d-flex gap-2">
      <v-btn
        v-for="format in formats"
        :key="format"
        v-bind="$attrs"
        :color="color"
        :variant="variant"
        :size="size"
        :disabled="disabled || isExporting"
        :loading="isExporting && currentFormat === format"
        @click="handleQuickExport(format)"
      >
        <v-icon start>{{ getFormatIcon(format) }}</v-icon>
        {{ $t(`export.${format}`) }}
      </v-btn>
    </div>

    <!-- Export Dialog -->
    <ExportDialog
      v-model="showDialog"
      :data="data"
      :columns="columns"
      :default-filename="defaultFilename"
      :formats="formats"
      @export="handleExport"
    />

    <!-- Progress Overlay -->
    <v-overlay
      v-if="showProgress && isExporting"
      :model-value="isExporting"
      class="align-center justify-center"
      contained
    >
      <v-card class="pa-4" width="300">
        <div class="text-center">
          <v-progress-circular
            :model-value="exportProgress"
            :size="64"
            :width="6"
            color="primary"
            class="mb-4"
          >
            {{ Math.round(exportProgress) }}%
          </v-progress-circular>
          
          <h4 class="text-h6 mb-2">
            {{ $t('export.exporting') }}
          </h4>
          
          <p class="text-body-2 text-grey-600 mb-4">
            {{ progressText }}
          </p>

          <v-btn
            v-if="currentJob"
            color="error"
            variant="outlined"
            size="small"
            @click="handleCancelExport"
          >
            {{ $t('export.cancel') }}
          </v-btn>
        </div>
      </v-card>
    </v-overlay>
  </div>
</template>

<script setup lang="ts">
import type { ExportColumn, ExportOptions } from '@/composables/useExport'

interface Props {
  data: any[];
  columns: ExportColumn[];
  filename?: string;
  formats?: ('pdf' | 'excel')[];
  disabled?: boolean;
  showAsMenu?: boolean;
  showProgress?: boolean;
  color?: string;
  variant?: 'text' | 'outlined' | 'tonal' | 'elevated' | 'flat';
  size?: 'small' | 'default' | 'large';
  icon?: string;
  buttonText?: string;
  autoExport?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  formats: () => ['pdf', 'excel'],
  disabled: false,
  showAsMenu: true,
  showProgress: true,
  color: 'primary',
  variant: 'tonal',
  size: 'default',
  icon: 'mdi-download',
  buttonText: 'Export',
  autoExport: false,
});

const emit = defineEmits<{
  'export-start': [format: string, options: ExportOptions];
  'export-complete': [format: string, filename: string];
  'export-error': [error: string];
}>();

const { exportData, isExporting, exportProgress, currentJob, cancelExport, generateFilename } = useExport();

const showDialog = ref(false);
const currentFormat = ref<string>('');

const defaultFilename = computed(() => props.filename || `Export_${new Date().toISOString().split('T')[0]}`);

const progressText = computed(() => {
  if (currentJob.value) {
    const status = currentJob.value.status;
    if (status === 'processing') return `Processing ${currentFormat.value.toUpperCase()} export...`;
    if (status === 'pending') return 'Preparing export...';
  }
  return `Generating ${currentFormat.value.toUpperCase()}...`;
});

const getFormatIcon = (format: string) => ({ pdf: 'mdi-file-pdf-box', excel: 'mdi-file-excel-box' }[format] || 'mdi-file');

const closeMenu = () => {};

const handleQuickExport = async (format: 'pdf' | 'excel') => {
  if (props.autoExport) {
    await handleExport({
      format,
      filename: generateFilename(defaultFilename.value, format),
      selectedColumns: props.columns.map(col => col.key),
      dataSelection: 'all',
      includeHeaders: true,
      pageOrientation: 'portrait',
      pageSize: 'A4'
    });
  } else {
    showDialog.value = true;
  }
};

const handleExport = async (options: ExportOptions) => {
  if (!props.data?.length) {
    emit('export-error', 'No data available for export');
    return;
  }
  try {
    currentFormat.value = options.format;
    emit('export-start', options.format, options);
    await exportData(props.data, props.columns, options);
    emit('export-complete', options.format, options.filename);
    showDialog.value = false;
  } catch (error: any) {
    emit('export-error', error.message || 'Export failed');
  } finally {
    currentFormat.value = '';
  }
};

const handleCancelExport = async () => {
  if (currentJob.value) await cancelExport(currentJob.value.id);
};

watch(() => props.data, (newData) => {}, { immediate: true });
</script>

<style scoped>
.export-button {
  position: relative;
}

.v-overlay {
  z-index: 2000;
}

.v-progress-circular {
  font-weight: bold;
}

/* Animation for progress overlay */
.export-button .v-overlay {
  transition: opacity 0.3s ease;
}

/* Ensure menu positioning */
:deep(.v-menu > .v-overlay__content) {
  max-height: 80vh;
  overflow-y: auto;
}
</style> 