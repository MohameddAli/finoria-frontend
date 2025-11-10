<template>
  <v-card :elevation="elevation">
    <v-card-title v-if="title" class="d-flex justify-space-between align-center">
      <span>{{ title }}</span>
      <v-btn v-if="showDownload" icon size="small" variant="text" @click="downloadChart">
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="pa-2 pa-md-4">
      <ClientOnly>
        <apexchart
          ref="chartRef"
          type="candlestick"
          :height="height"
          :width="width"
          :options="chartOptions"
          :series="series"
        />
        <template #fallback>
          <v-skeleton-loader type="image" :height="height" />
        </template>
      </ClientOnly>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'

const props = defineProps({
  series: { type: Array, default: () => [ { data: [
    { x: 1600000000000, y: [51.98, 56.29, 51.59, 53.85] },
    { x: 1600086400000, y: [53.66, 54.99, 51.35, 52.95] },
    { x: 1600172800000, y: [52.96, 53.78, 51.54, 52.48] }
  ] } ] },
  title: { type: String, default: '' },
  height: { type: [Number, String], default: 350 },
  width: { type: [Number, String], default: '100%' },
  elevation: { type: Number, default: 2 },
  colors: { type: Array, default: () => ['#26A69A', '#EF5350'] },
  showDownload: { type: Boolean, default: true },
  customOptions: { type: Object, default: () => ({}) },
})

const { locale } = useI18n()
const { current: currentTheme } = useTheme()
const isRTL = computed(() => locale.value === 'ar')
const isDark = computed(() => currentTheme.value.dark)
const chartRef = ref(null)

const baseOptions = computed(() => ({
  chart: { type: 'candlestick', fontFamily: isRTL.value ? 'Tajawal, sans-serif' : 'Inter, Roboto, sans-serif' },
  xaxis: { type: 'datetime', labels: { style: { colors: isDark.value ? '#aaa' : '#666' } } },
  yaxis: { tooltip: { enabled: true }, labels: { style: { colors: isDark.value ? '#aaa' : '#666' } } },
  plotOptions: { candlestick: { colors: { upward: props.colors[0], downward: props.colors[1] } } },
  tooltip: { theme: isDark.value ? 'dark' : 'light' },
}))

const chartOptions = computed(() => mergeDeep(baseOptions.value, props.customOptions))
const mergeDeep = (t, s) => { const o = { ...t }; if (s && typeof s === 'object') Object.keys(s).forEach(k => { o[k] = (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) ? mergeDeep(t[k] || {}, s[k]) : s[k] }); return o }

const downloadChart = () => { chartRef.value?.chart?.dataURI().then(({ imgURI }) => { const a = document.createElement('a'); a.href = imgURI; a.download = `${props.title || 'candlestick'}.png`; a.click() }) }

defineExpose({ downloadChart })
</script>
