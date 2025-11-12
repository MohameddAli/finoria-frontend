<template>
  <v-card :elevation="elevation" :class="cardClass">
    <v-card-title
      v-if="title"
      class="d-flex justify-space-between align-center"
    >
      <span>{{ title }}</span>
      <v-btn
        v-if="showDownload"
        icon
        size="small"
        variant="text"
        @click="downloadChart"
      >
        <v-icon>mdi-download</v-icon>
        <v-tooltip activator="parent" location="top">
          {{ downloadTooltip }}
        </v-tooltip>
      </v-btn>
    </v-card-title>

    <v-card-text :class="cardTextClass">
      <ClientOnly>
        <apexchart
          ref="chartRef"
          type="line"
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

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { useTheme } from "vuetify"

interface Props {
  series?: Array<{ name: string; data: number[] }>
  categories?: string[]
  title?: string
  height?: number | string
  width?: number | string
  elevation?: number
  curve?: "smooth" | "straight" | "stepline"
  area?: boolean
  dataLabels?: boolean
  colors?: string[]
  showLegend?: boolean
  showGrid?: boolean
  showDownload?: boolean
  showMarkers?: boolean
  markerSize?: number
  strokeWidth?: number
  yMin?: number
  yMax?: number
  enableZoom?: boolean
  customOptions?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  series: () => [{ name: "Series 1", data: [28, 29, 33, 36, 32, 32, 33] }],
  categories: () => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  title: "",
  height: 350,
  width: "100%",
  elevation: 2,
  curve: "smooth",
  area: false,
  dataLabels: false,
  colors: () => ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"],
  showLegend: true,
  showGrid: true,
  showDownload: true,
  showMarkers: true,
  markerSize: 5,
  strokeWidth: 2,
  enableZoom: true,
  customOptions: () => ({}),
})

const { locale } = useI18n()
const { current: currentTheme } = useTheme()

const chartRef = ref<any>(null)
const isRTL = computed(() => locale.value === "ar")
const isDark = computed(() => currentTheme.value.dark)
const cardClass = computed(() => ({ "rtl-chart": isRTL.value }))
const cardTextClass = computed(() => ({ "pa-2": true, "pa-md-4": true }))
const downloadTooltip = computed(() => isRTL.value ? "تحميل الرسم البياني" : "Download Chart")

const formatValue = (val: number) => {
  if (val >= 1e9) return (val / 1e9).toFixed(1) + "B"
  if (val >= 1e6) return (val / 1e6).toFixed(1) + "M"
  if (val >= 1e3) return (val / 1e3).toFixed(1) + "K"
  return val.toString()
}

const mergeDeep = (t: any, s: any): any => {
  const o = { ...t }
  if (s && typeof s === "object") Object.keys(s).forEach(k => { o[k] = (s[k] && typeof s[k] === "object" && !Array.isArray(s[k])) ? mergeDeep(t[k] || {}, s[k]) : s[k] })
  return o
}

const chartOptions = computed(() => {
  const base = {
    chart: { type: props.area ? "area" : "line", fontFamily: "inherit", toolbar: { show: true, tools: { download: false, selection: true, zoom: props.enableZoom, zoomin: props.enableZoom, zoomout: props.enableZoom, pan: props.enableZoom, reset: props.enableZoom } }, background: "transparent", animations: { enabled: true, easing: "easeinout", speed: 800 }, zoom: { enabled: props.enableZoom, type: "x", autoScaleYaxis: true } },
    colors: props.colors,
    dataLabels: { enabled: props.dataLabels, formatter: formatValue },
    stroke: { curve: props.curve, width: props.strokeWidth },
    markers: { size: props.showMarkers ? props.markerSize : 0, hover: { sizeOffset: 2 } },
    grid: { show: props.showGrid, borderColor: isDark.value ? "#424242" : "#e0e0e0", strokeDashArray: 4, position: "back", xaxis: { lines: { show: props.showGrid } }, yaxis: { lines: { show: props.showGrid } }, padding: { top: 0, right: isRTL.value ? 10 : 0, bottom: 0, left: isRTL.value ? 0 : 10 } },
    xaxis: { categories: props.categories, labels: { style: { colors: isDark.value ? "#e0e0e0" : "#424242", fontSize: "12px" }, rotate: -45, rotateAlways: false }, axisBorder: { color: isDark.value ? "#616161" : "#e0e0e0" }, axisTicks: { color: isDark.value ? "#616161" : "#e0e0e0" } },
    yaxis: { min: props.yMin, max: props.yMax, labels: { style: { colors: isDark.value ? "#e0e0e0" : "#424242", fontSize: "12px" }, formatter: formatValue } },
    legend: { show: props.showLegend, position: "top", horizontalAlign: isRTL.value ? "right" : "left", labels: { colors: isDark.value ? "#e0e0e0" : "#424242" }, markers: { width: 12, height: 12, radius: 12 } },
    tooltip: { theme: isDark.value ? "dark" : "light", x: { show: true }, y: { formatter: formatValue } },
    fill: props.area ? { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3, stops: [0, 90, 100] } } : {},
    responsive: [
      { breakpoint: 1280, options: { chart: { height: typeof props.height === "number" ? props.height * 0.9 : props.height } } },
      { breakpoint: 960, options: { chart: { height: typeof props.height === "number" ? props.height * 0.8 : props.height }, legend: { position: "bottom" } } },
      { breakpoint: 600, options: { chart: { height: typeof props.height === "number" ? props.height * 0.7 : props.height }, xaxis: { labels: { rotate: -90 } } } }
    ]
  }
  return mergeDeep(base, props.customOptions)
})

const downloadChart = () => chartRef.value?.dataURI?.().then(({ imgURI }: any) => { const a = document.createElement("a"); a.href = imgURI; a.download = `${(props.title || "chart").replace(/\s+/g, "_")}.png`; a.click() })

defineExpose({
  downloadChart,
  updateSeries: (s: any) => chartRef.value?.updateSeries?.(s),
  updateOptions: (o: any) => chartRef.value?.updateOptions?.(o)
})
</script>

<style scoped>
.rtl-chart {
  direction: rtl;
}
</style>
