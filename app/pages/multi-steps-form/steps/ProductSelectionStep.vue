<template>
  <v-card flat class="step-card">
    <v-card-text class="pa-8">
      <div class="text-h5 font-weight-bold mb-2">
        {{ $t("multiStepForm.productSelection.title") }}
      </div>
      <div class="text-body-2 text-medium-emphasis mb-6">
        {{ $t("multiStepForm.productSelection.description") }}
      </div>

      <v-form ref="formRef" v-model="valid" @submit.prevent="handleNext">
        <v-row>
          <!-- Product Selection -->
          <v-col cols="12">
            <div class="text-subtitle-1 font-weight-medium mb-4">
              {{ $t("multiStepForm.productSelection.selectProducts") }}
            </div>
            <v-row>
              <!-- Product 1 -->
              <v-col cols="12" md="6">
                <v-card
                  :class="[
                    'product-card',
                    {
                      'product-selected':
                        formData.products.includes('product1'),
                    },
                  ]"
                  elevation="2"
                  @click="toggleProduct('product1')"
                >
                  <v-card-text class="pa-6">
                    <div class="d-flex align-center mb-4">
                      <v-icon size="48" color="primary"
                        >mdi-package-variant</v-icon
                      >
                      <div class="ms-4 flex-grow-1">
                        <div class="text-h6 font-weight-bold">
                          {{
                            $t("multiStepForm.productSelection.product1.name")
                          }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          {{
                            $t("multiStepForm.productSelection.product1.code")
                          }}
                        </div>
                      </div>
                      <v-checkbox
                        :model-value="formData.products.includes('product1')"
                        color="primary"
                        hide-details
                        @click.stop
                        @update:model-value="toggleProduct('product1')"
                      />
                    </div>
                    <v-divider class="my-3" />
                    <div class="text-body-2">
                      {{
                        $t(
                          "multiStepForm.productSelection.product1.description"
                        )
                      }}
                    </div>
                    <div class="mt-4">
                      <v-chip color="primary" variant="tonal" size="small">
                        {{
                          $t("multiStepForm.productSelection.product1.price")
                        }}
                      </v-chip>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Product 2 -->
              <v-col cols="12" md="6">
                <v-card
                  :class="[
                    'product-card',
                    {
                      'product-selected':
                        formData.products.includes('product2'),
                    },
                  ]"
                  elevation="2"
                  @click="toggleProduct('product2')"
                >
                  <v-card-text class="pa-6">
                    <div class="d-flex align-center mb-4">
                      <v-icon size="48" color="success"
                        >mdi-package-variant-closed</v-icon
                      >
                      <div class="ms-4 flex-grow-1">
                        <div class="text-h6 font-weight-bold">
                          {{
                            $t("multiStepForm.productSelection.product2.name")
                          }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          {{
                            $t("multiStepForm.productSelection.product2.code")
                          }}
                        </div>
                      </div>
                      <v-checkbox
                        :model-value="formData.products.includes('product2')"
                        color="success"
                        hide-details
                        @click.stop
                        @update:model-value="toggleProduct('product2')"
                      />
                    </div>
                    <v-divider class="my-3" />
                    <div class="text-body-2">
                      {{
                        $t(
                          "multiStepForm.productSelection.product2.description"
                        )
                      }}
                    </div>
                    <div class="mt-4">
                      <v-chip color="success" variant="tonal" size="small">
                        {{
                          $t("multiStepForm.productSelection.product2.price")
                        }}
                      </v-chip>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <!-- Quantity for each selected product -->
          <v-col v-if="formData.products.length > 0" cols="12">
            <v-divider class="my-4" />
            <div class="text-subtitle-1 font-weight-medium mb-4">
              {{ $t("multiStepForm.productSelection.quantities") }}
            </div>
            <v-row>
              <v-col
                v-for="product in formData.products"
                :key="product"
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model.number="formData.quantities[product]"
                  :label="$t(`multiStepForm.productSelection.${product}.name`)"
                  :rules="[rules.required, rules.positive]"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-numeric"
                  type="number"
                  min="1"
                />
              </v-col>
            </v-row>
          </v-col>

          <!-- Additional Notes -->
          <v-col cols="12">
            <v-textarea
              v-model="formData.notes"
              :label="$t('multiStepForm.productSelection.notes')"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-note-text"
              rows="3"
              :placeholder="
                $t('multiStepForm.productSelection.notesPlaceholder')
              "
            />
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
          <v-btn
            color="primary"
            size="large"
            type="submit"
            :disabled="!valid || formData.products.length === 0"
          >
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

const formData = ref({
  products: props.modelValue.products || [],
  quantities: props.modelValue.quantities || {},
  notes: props.modelValue.notes || "",
});

// Validation rules
const rules = {
  required: (value) => !!value || t("validation.required"),
  positive: (value) => value > 0 || t("validation.mustBePositive"),
};

// Toggle product selection
const toggleProduct = (product) => {
  const index = formData.value.products.indexOf(product);
  if (index > -1) {
    formData.value.products.splice(index, 1);
    delete formData.value.quantities[product];
  } else {
    formData.value.products.push(product);
    formData.value.quantities[product] = 1;
  }
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
  if (formData.value.products.length === 0) {
    return;
  }
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

.product-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.product-card:hover {
  border-color: rgb(var(--v-theme-primary));
  transform: translateY(-2px);
}

.product-selected {
  border-color: rgb(var(--v-theme-primary)) !important;
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>
