<template>
  <v-card flat class="step-card">
    <v-card-text class="pa-8">
      <div class="text-h5 font-weight-bold mb-2">
        {{ $t("multiStepForm.documents.title") }}
      </div>
      <div class="text-body-2 text-medium-emphasis mb-6">
        {{ $t("multiStepForm.documents.description") }}
      </div>

      <v-form ref="formRef" v-model="valid" @submit.prevent="handleNext">
        <v-row>
          <!-- PDF Document Upload -->
          <v-col cols="12">
            <v-card variant="outlined" class="upload-area">
              <v-card-text class="pa-6">
                <div class="text-subtitle-1 font-weight-medium mb-4">
                  <v-icon start>mdi-file-pdf-box</v-icon>
                  {{ $t("multiStepForm.documents.pdfDocument") }}
                </div>

                <v-file-input
                  v-model="formData.pdfFile"
                  :label="$t('multiStepForm.documents.uploadPdf')"
                  :rules="[rules.required]"
                  variant="outlined"
                  density="comfortable"
                  prepend-icon=""
                  prepend-inner-icon="mdi-paperclip"
                  accept="application/pdf"
                  show-size
                  @update:model-value="handlePdfUpload"
                >
                  <template #selection="{ fileNames }">
                    <v-chip
                      v-for="fileName in fileNames"
                      :key="fileName"
                      color="primary"
                      size="small"
                      class="me-2"
                    >
                      {{ fileName }}
                    </v-chip>
                  </template>
                </v-file-input>

                <v-alert
                  v-if="formData.pdfFile && formData.pdfFile.length > 0"
                  type="success"
                  variant="tonal"
                  density="compact"
                  class="mt-3"
                >
                  {{ $t("multiStepForm.documents.pdfUploaded") }}
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Image Documents Upload -->
          <v-col cols="12">
            <v-card variant="outlined" class="upload-area">
              <v-card-text class="pa-6">
                <div class="text-subtitle-1 font-weight-medium mb-4">
                  <v-icon start>mdi-image-multiple</v-icon>
                  {{ $t("multiStepForm.documents.images") }}
                </div>

                <v-file-input
                  v-model="formData.images"
                  :label="$t('multiStepForm.documents.uploadImages')"
                  :rules="[rules.required]"
                  variant="outlined"
                  density="comfortable"
                  prepend-icon=""
                  prepend-inner-icon="mdi-camera"
                  accept="image/*"
                  multiple
                  show-size
                  @update:model-value="handleImagesUpload"
                >
                  <template #selection="{ fileNames }">
                    <template
                      v-for="(fileName, index) in fileNames"
                      :key="fileName"
                    >
                      <v-chip
                        v-if="index < 3"
                        color="success"
                        size="small"
                        class="me-2"
                      >
                        {{ fileName }}
                      </v-chip>
                    </template>
                    <span
                      v-if="fileNames.length > 3"
                      class="text-overline grey--text text--darken-3 mx-2"
                    >
                      +{{ fileNames.length - 3 }}
                      {{ $t("multiStepForm.documents.moreFiles") }}
                    </span>
                  </template>
                </v-file-input>

                <!-- Image Preview -->
                <div v-if="imagePreviews.length > 0" class="mt-4">
                  <div class="text-caption text-medium-emphasis mb-2">
                    {{ $t("multiStepForm.documents.preview") }}
                  </div>
                  <v-row dense>
                    <v-col
                      v-for="(preview, index) in imagePreviews"
                      :key="index"
                      cols="6"
                      sm="4"
                      md="3"
                    >
                      <v-card elevation="2">
                        <v-img :src="preview" height="150" cover>
                          <template #placeholder>
                            <div
                              class="d-flex align-center justify-center fill-height"
                            >
                              <v-progress-circular
                                indeterminate
                                color="primary"
                              />
                            </div>
                          </template>
                        </v-img>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Additional Documents Upload -->
          <v-col cols="12">
            <v-card variant="outlined" class="upload-area">
              <v-card-text class="pa-6">
                <div class="text-subtitle-1 font-weight-medium mb-4">
                  <v-icon start>mdi-file-document-multiple</v-icon>
                  {{ $t("multiStepForm.documents.additionalDocs") }}
                </div>

                <v-file-input
                  v-model="formData.additionalDocs"
                  :label="$t('multiStepForm.documents.uploadAdditional')"
                  variant="outlined"
                  density="comfortable"
                  prepend-icon=""
                  prepend-inner-icon="mdi-file"
                  multiple
                  show-size
                  counter
                >
                  <template #selection="{ fileNames }">
                    <template
                      v-for="(fileName, index) in fileNames"
                      :key="fileName"
                    >
                      <v-chip
                        v-if="index < 2"
                        color="info"
                        size="small"
                        class="me-2"
                      >
                        {{ fileName }}
                      </v-chip>
                    </template>
                    <span
                      v-if="fileNames.length > 2"
                      class="text-overline grey--text text--darken-3 mx-2"
                    >
                      +{{ fileNames.length - 2 }}
                      {{ $t("multiStepForm.documents.moreFiles") }}
                    </span>
                  </template>
                </v-file-input>

                <v-alert
                  type="info"
                  variant="tonal"
                  density="compact"
                  class="mt-3"
                >
                  {{ $t("multiStepForm.documents.optionalNote") }}
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Upload Summary -->
          <v-col cols="12">
            <v-alert
              v-if="uploadSummary"
              type="info"
              variant="outlined"
              density="compact"
            >
              <div class="d-flex align-center">
                <v-icon start>mdi-information</v-icon>
                <div>
                  {{
                    $t("multiStepForm.documents.totalFiles", {
                      count: uploadSummary,
                    })
                  }}
                </div>
              </div>
            </v-alert>
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
const imagePreviews = ref([]);

const formData = ref({
  pdfFile: props.modelValue.pdfFile || [],
  images: props.modelValue.images || [],
  additionalDocs: props.modelValue.additionalDocs || [],
});

// Validation rules
const rules = {
  required: (value) => {
    if (Array.isArray(value)) {
      return value.length > 0 || t("validation.required");
    }
    return !!value || t("validation.required");
  },
};

// Computed upload summary
const uploadSummary = computed(() => {
  const pdfCount = formData.value.pdfFile?.length || 0;
  const imagesCount = formData.value.images?.length || 0;
  const additionalCount = formData.value.additionalDocs?.length || 0;
  const total = pdfCount + imagesCount + additionalCount;
  return total > 0 ? total : null;
});

// Handle PDF upload
const handlePdfUpload = (files) => {
  console.log("PDF uploaded:", files);
};

// Handle images upload and create previews
const handleImagesUpload = (files) => {
  if (!files || files.length === 0) {
    imagePreviews.value = [];
    return;
  }

  imagePreviews.value = [];

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviews.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
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

.upload-area {
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: rgb(var(--v-theme-primary));
}
</style>
