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
          type="polarArea"
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
  series: { type: Array, default: () => [14, 23, 21, 17, 15] },
  labels: { type: Array, default: () => ['Series A','Series B','Series C','Series D','Series E'] },
  title: { type: String, default: '' },
  height: { type: [Number, String], default: 330 },
  width: { type: [Number, String], default: '100%' },
  elevation: { type: Number, default: 2 },
  colors: { type: Array, default: () => undefined },
  showLegend: { type: Boolean, default: true },
  showDownload: { type: Boolean, default: true },
  customOptions: { type: Object, default: () => ({}) },
})

const { locale } = useI18n()
const { current: currentTheme } = useTheme()
const isRTL = computed(() => locale.value === 'ar')
const isDark = computed(() => currentTheme.value.dark)
const chartRef = ref(null)

const baseOptions = computed(() => ({
  labels: props.labels,
  colors: props.colors,
  chart: { type: 'polarArea', fontFamily: isRTL.value ? 'Tajawal, sans-serif' : 'Inter, Roboto, sans-serif' },
  legend: { show: props.showLegend, position: 'bottom', labels: { colors: isDark.value ? '#fff' : '#000' } },
  stroke: { colors: [isDark.value ? '#1e1e1e' : '#fff'] },
  fill: { opacity: 0.9 },
  yaxis: { show: false },
  tooltip: { theme: isDark.value ? 'dark' : 'light' },
}))

const chartOptions = computed(() => mergeDeep(baseOptions.value, props.customOptions))
const mergeDeep = (t, s) => { const o = { ...t }; if (s && typeof s === 'object') Object.keys(s).forEach(k => { o[k] = (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) ? mergeDeep(t[k] || {}, s[k]) : s[k] }); return o }

const downloadChart = () => { chartRef.value?.chart?.dataURI().then(({ imgURI }) => { const a = document.createElement('a'); a.href = imgURI; a.download = `${props.title || 'polar-area'}.png`; a.click() }) }

defineExpose({ downloadChart })
</script>

