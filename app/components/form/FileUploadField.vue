<template>
  <v-card variant="outlined" class="file-upload-field" :class="{ 'error-border': errorMessage }">
    <v-card-text>
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center flex-grow-1">
          <!-- Preview Image or Icon -->
          <div v-if="previewUrl && isImage" class="preview-container me-3">
            <v-img
              :src="previewUrl"
              :alt="fileName"
              cover
              class="preview-image"
            />
          </div>
          <v-icon v-else :color="fileColor" size="large" class="me-3">
            {{ fileIcon }}
          </v-icon>

          <div class="flex-grow-1">
            <div class="text-body-2 font-weight-medium">{{ label }}</div>
            <div v-if="fileName" class="text-caption text-medium-emphasis">
              {{ fileName }}
              <span v-if="fileSize" class="text-caption ms-1">({{ fileSize }})</span>
            </div>
            <div v-else class="text-caption text-medium-emphasis">
              {{ t('form.noFileSelected') }}
            </div>
            <div v-if="errorMessage" class="text-caption text-error mt-1">
              {{ errorMessage }}
            </div>
          </div>
        </div>

        <div class="d-flex gap-2">
          <v-btn
            v-if="file && isImage"
            variant="text"
            color="primary"
            size="small"
            icon="mdi-eye"
            @click="showPreview = true"
          />
          <v-btn
            variant="tonal"
            :color="file ? 'success' : 'primary'"
            size="small"
            :disabled="loading"
            @click="triggerFileInput"
          >
            {{ file ? t('common.change') : t('common.upload') }}
          </v-btn>
          <v-btn
            v-if="file"
            variant="text"
            color="error"
            size="small"
            icon="mdi-close"
            :disabled="loading"
            @click="clearFile"
          />
        </div>
      </div>

      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        class="d-none"
        @change="handleFileChange"
      />
    </v-card-text>

    <!-- Preview Dialog -->
    <v-dialog v-model="showPreview" max-width="800">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ fileName }}</span>
          <v-btn icon="mdi-close" variant="text" @click="showPreview = false" />
        </v-card-title>
        <v-card-text>
          <v-img
            v-if="previewUrl"
            :src="previewUrl"
            :alt="fileName"
            contain
            max-height="600"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Props {
  label: string;
  accept?: string;
  icon?: string;
  maxSize?: number; // بالميجابايت
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  icon: 'mdi-file-upload',
  maxSize: 5, // 5MB افتراضياً
  required: false,
});

const { t } = useI18n();

const file = defineModel<File | null>();
const fileInput = ref<HTMLInputElement>();
const previewUrl = ref<string | null>(null);
const showPreview = ref(false);
const loading = ref(false);
const errorMessage = ref<string>('');

const fileName = computed(() => file.value?.name);

const fileSize = computed(() => {
  if (!file.value) return null;
  const bytes = file.value.size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
});

const isImage = computed(() => {
  return file.value?.type.startsWith('image/') || false;
});

const fileIcon = computed(() => {
  if (file.value) {
    if (isImage.value) return 'mdi-image';
    if (file.value.type.includes('pdf')) return 'mdi-file-pdf-box';
    if (file.value.type.includes('word')) return 'mdi-file-word';
    return 'mdi-check-circle';
  }
  return props.icon;
});

const fileColor = computed(() => {
  if (errorMessage.value) return 'error';
  return file.value ? 'success' : 'primary';
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const validateFile = (selectedFile: File): boolean => {
  errorMessage.value = '';

  // التحقق من الحجم
  const maxSizeBytes = props.maxSize * 1024 * 1024;
  if (selectedFile.size > maxSizeBytes) {
    errorMessage.value = t('validation.fileTooLarge', { size: String(props.maxSize) });
    return false;
  }

  // التحقق من النوع
  const acceptedTypes = props.accept.split(',').map(t => t.trim());
  const fileExtension = '.' + (selectedFile.name.split('.').pop()?.toLowerCase() || '');
  const isAccepted = acceptedTypes.some(type => {
    if (type.includes('*')) {
      const mainType = type.split('/')[0] || '';
      return selectedFile.type.startsWith(mainType);
    }
    return type === selectedFile.type || type === fileExtension;
  });

  if (!isAccepted) {
    errorMessage.value = t('validation.invalidFileType');
    return false;
  }

  return true;
};

const createPreview = (selectedFile: File) => {
  if (selectedFile.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        previewUrl.value = e.target.result as string;
      }
    };
    reader.readAsDataURL(selectedFile);
  } else {
    previewUrl.value = null;
  }
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const selectedFile = target.files[0];
    
    if (validateFile(selectedFile)) {
      loading.value = true;
      file.value = selectedFile;
      createPreview(selectedFile);
      
      setTimeout(() => {
        loading.value = false;
      }, 300);
    } else {
      // مسح الملف إذا كان غير صالح
      target.value = '';
    }
  }
};

const clearFile = () => {
  file.value = null;
  previewUrl.value = null;
  errorMessage.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// مراقبة التغييرات في الملف لإنشاء المعاينة
watch(file, (newFile) => {
  if (newFile) {
    createPreview(newFile);
  } else {
    previewUrl.value = null;
  }
});
</script>


<style scoped>
.file-upload-field {
  transition: all 0.3s ease;
}

.file-upload-field:hover {
  border-color: rgb(var(--v-theme-primary));
}

.file-upload-field.error-border {
  border-color: rgb(var(--v-theme-error)) !important;
}

.preview-container {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid rgba(var(--v-border-color), 0.12);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
