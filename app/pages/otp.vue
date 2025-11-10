<template>
  <v-container fluid>
    <v-card class="pa-6 mx-auto" max-width="600">
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">{{ $t('pages.otp.title') }}</span>
        <v-btn size="small" variant="text" color="primary" @click="handleClear">{{ $t('common.clear') }}</v-btn>
      </v-card-title>
      <v-card-text>
        <Otp
          ref="otpRef"
          v-model="otp"
          :length="6"
          :numeric="true"
          :masked="false"
          :autofocus="true"
          color="primary"
          variant="outlined"
          density="compact"
          input-width="48px"
          gap="8px"
          :center="true"
          name="otp"
          aria-label="One-time code"
          @complete="onComplete"
        />

        <div class="d-flex justify-end mt-6">
          <v-btn :loading="submitting" color="primary" @click="verify">{{ $t('pages.otp.verify') }}</v-btn>
        </div>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar.open" :color="snackbar.color" timeout="2500">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import Otp from '~/components/global/otp.vue'
// 🔒 صفحة محمية
definePageMeta({
  layout: 'dashboard',
  title: 'pages.otp.title',
  subtitle: 'pages.otp.subtitle'
})

const otp = ref('')
const submitting = ref(false)
const snackbar = ref({ open: false, message: '', color: 'success' })
const otpRef = ref(null)

const onComplete = () => {
  snackbar.value = { open: true, message: 'Code complete', color: 'success' }
}

const verify = async () => {
  submitting.value = true
  try {
    // Simulate a verification round-trip
    await new Promise((r) => setTimeout(r, 800))
    snackbar.value = { open: true, message: `Verified: ${otp.value}`, color: 'success' }
  } catch {
    snackbar.value = { open: true, message: 'Verification failed', color: 'error' }
  } finally {
    submitting.value = false
  }
}

const handleClear = () => {
  otpRef.value?.clear()
  otp.value = ''
}
</script>
