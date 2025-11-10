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
          type="area"
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
  series: { type: Array, default: () => [ { name: 'Series 1', data: [31, 40, 28, 51, 42, 109, 100] } ] },
  categories: { type: Array, default: () => ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  title: { type: String, default: '' },
  height: { type: [Number, String], default: 350 },
  width: { type: [Number, String], default: '100%' },
  elevation: { type: Number, default: 2 },
  curve: { type: String, default: 'smooth' },
  dataLabels: { type: Boolean, default: false },
  colors: { type: Array, default: () => ['#008FFB', '#00E396', '#FEB019'] },
  showLegend: { type: Boolean, default: true },
  showGrid: { type: Boolean, default: true },
  showDownload: { type: Boolean, default: true },
  customOptions: { type: Object, default: () => ({}) },
})

const { locale } = useI18n()
const { current: currentTheme } = useTheme()

const isRTL = computed(() => locale.value === 'ar')
const isDark = computed(() => currentTheme.value.dark)

const chartRef = ref(null)

const baseOptions = computed(() => ({
  chart: {
    type: 'area',
    fontFamily: isRTL.value ? 'Tajawal, sans-serif' : 'Inter, Roboto, sans-serif',
    toolbar: { show: true, tools: { download: false } },
  },
  colors: props.colors,
  dataLabels: { enabled: props.dataLabels },
  stroke: { curve: props.curve, width: 2 },
  legend: {
    show: props.showLegend,
    position: 'top',
    labels: { colors: isDark.value ? '#fff' : '#000' },
  },
  xaxis: {
    categories: props.categories,
    labels: { style: { colors: isDark.value ? '#aaa' : '#666' } },
  },
  yaxis: {
    labels: { style: { colors: isDark.value ? '#aaa' : '#666' } },
  },
  grid: { show: props.showGrid, borderColor: isDark.value ? '#444' : '#e0e0e0' },
  tooltip: { theme: isDark.value ? 'dark' : 'light' },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 0.4, opacityFrom: 0.6, opacityTo: 0.05, stops: [0, 90, 100] },
  },
}))

const chartOptions = computed(() => mergeDeep(baseOptions.value, props.customOptions))

const mergeDeep = (t, s) => {
  const o = { ...t }
  if (s && typeof s === 'object') Object.keys(s).forEach(k => { o[k] = (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) ? mergeDeep(t[k] || {}, s[k]) : s[k] })
  return o
}

const downloadChart = () => {
  chartRef.value?.chart?.dataURI().then(({ imgURI }) => {
    const a = document.createElement('a')
    a.href = imgURI
    a.download = `${props.title || 'area-chart'}.png`
    a.click()
  })
}

defineExpose({ downloadChart })
</script>

