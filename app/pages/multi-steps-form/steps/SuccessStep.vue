<template>
  <v-card flat class="step-card">
    <v-card-text class="pa-8">
      <div class="text-center">
        <!-- Success Icon -->
        <v-icon size="120" color="success" class="mb-6 success-icon">
          mdi-check-circle
        </v-icon>

        <!-- Success Message -->
        <div class="text-h4 font-weight-bold mb-3">
          {{ $t("multiStepForm.success.title") }}
        </div>
        <div class="text-body-1 text-medium-emphasis mb-8">
          {{ $t("multiStepForm.success.message") }}
        </div>

        <!-- Registration Details -->
        <v-card variant="outlined" class="mx-auto mb-6" max-width="600">
          <v-card-text class="pa-6">
            <v-row>
              <!-- Registration ID -->
              <v-col cols="12">
                <v-card variant="tonal" color="primary">
                  <v-card-text class="pa-4">
                    <div class="text-caption text-medium-emphasis mb-2">
                      {{ $t("multiStepForm.success.registrationId") }}
                    </div>
                    <div class="text-h6 font-weight-bold font-monospace">
                      {{ registrationId }}
                    </div>
                    <v-btn
                      variant="text"
                      size="small"
                      color="primary"
                      class="mt-2"
                      @click="copyToClipboard(registrationId)"
                    >
                      <v-icon start size="small">mdi-content-copy</v-icon>
                      {{ $t("multiStepForm.success.copy") }}
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- QR Code -->
              <v-col cols="12">
                <div class="text-subtitle-2 text-medium-emphasis mb-3">
                  {{ $t("multiStepForm.success.scanQr") }}
                </div>
                <v-card
                  variant="outlined"
                  class="mx-auto qr-container"
                  max-width="250"
                >
                  <v-card-text class="pa-4">
                    <img :src="qrCode" alt="QR Code" class="qr-code-image" />
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Download Options -->
              <v-col cols="12">
                <v-divider class="my-4" />
                <div class="d-flex justify-center gap-3">
                  <v-btn
                    color="primary"
                    variant="outlined"
                    @click="downloadQRCode"
                  >
                    <v-icon start>mdi-download</v-icon>
                    {{ $t("multiStepForm.success.downloadQr") }}
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="outlined"
                    @click="printConfirmation"
                  >
                    <v-icon start>mdi-printer</v-icon>
                    {{ $t("multiStepForm.success.print") }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Next Steps Information -->
        <v-alert
          type="info"
          variant="tonal"
          class="mx-auto mb-6"
          max-width="600"
        >
          <div class="text-subtitle-2 font-weight-bold mb-2">
            {{ $t("multiStepForm.success.nextSteps.title") }}
          </div>
          <ul class="text-start text-body-2">
            <li>{{ $t("multiStepForm.success.nextSteps.step1") }}</li>
            <li>{{ $t("multiStepForm.success.nextSteps.step2") }}</li>
            <li>{{ $t("multiStepForm.success.nextSteps.step3") }}</li>
          </ul>
        </v-alert>

        <!-- Actions -->
        <v-divider class="my-6" />
        <div class="d-flex justify-center gap-3">
          <v-btn
            color="primary"
            size="large"
            variant="elevated"
            @click="emit('new-form')"
          >
            <v-icon start>mdi-plus</v-icon>
            {{ $t("multiStepForm.success.newForm") }}
          </v-btn>
          <v-btn color="secondary" size="large" variant="outlined" :to="'/'">
            <v-icon start>mdi-home</v-icon>
            {{ $t("multiStepForm.success.backHome") }}
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  registrationId: {
    type: String,
    required: true,
  },
  qrCode: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["new-form"]);

// Copy to clipboard
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    // You can add a snackbar notification here
    console.log("Copied to clipboard:", text);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

// Download QR code
const downloadQRCode = () => {
  const link = document.createElement("a");
  link.href = props.qrCode;
  link.download = `registration-${props.registrationId}.png`;
  link.click();
};

// Print confirmation
const printConfirmation = () => {
  window.print();
};
</script>

<style scoped>
.step-card {
  min-height: 500px;
}

.success-icon {
  animation: scale-in 0.5s ease-out;
}

@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.qr-container {
  background-color: rgb(var(--v-theme-surface-variant));
}

.qr-code-image {
  width: 100%;
  height: auto;
  display: block;
}

.gap-3 {
  gap: 12px;
}

.font-monospace {
  font-family: "Courier New", monospace;
}

@media print {
  .v-btn {
    display: none !important;
  }
}
</style>
