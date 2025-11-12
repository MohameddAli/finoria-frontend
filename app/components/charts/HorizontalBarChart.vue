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
          type="bar"
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
  stacked?: boolean
  dataLabels?: boolean
  colors?: string[]
  showLegend?: boolean
  showGrid?: boolean
  showDownload?: boolean
  barHeight?: string
  xMin?: number
  xMax?: number
  distributed?: boolean
  customOptions?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  series: () => [{ name: "Series 1", data: [44, 55, 41, 67, 22, 43] }],
  categories: () => ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5", "Category 6"],
  title: "",
  height: 350,
  width: "100%",
  elevation: 2,
  stacked: false,
  dataLabels: true,
  colors: () => ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"],
  showLegend: true,
  showGrid: true,
  showDownload: true,
  barHeight: "70%",
  distributed: false,
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
    chart: { type: "bar", fontFamily: "inherit", toolbar: { show: true, tools: { download: false, selection: true, zoom: true, zoomin: true, zoomout: true, pan: true, reset: true } }, background: "transparent", animations: { enabled: true, easing: "easeinout", speed: 800 }, stacked: props.stacked },
    plotOptions: { bar: { horizontal: true, barHeight: props.barHeight, distributed: props.distributed, dataLabels: { position: props.stacked ? "center" : "top" } } },
    colors: props.colors,
    dataLabels: { enabled: props.dataLabels, formatter: formatValue, offsetX: isRTL.value ? -5 : 5, style: { fontSize: "12px", colors: [isDark.value ? "#ffffff" : "#000000"] } },
    stroke: { show: true, width: 1, colors: ["transparent"] },
    grid: { show: props.showGrid, borderColor: isDark.value ? "#424242" : "#e0e0e0", strokeDashArray: 4, position: "back", xaxis: { lines: { show: props.showGrid } }, yaxis: { lines: { show: false } }, padding: { top: 0, right: isRTL.value ? 10 : 0, bottom: 0, left: isRTL.value ? 0 : 10 } },
    xaxis: { min: props.xMin, max: props.xMax, labels: { style: { colors: isDark.value ? "#e0e0e0" : "#424242", fontSize: "12px" }, formatter: formatValue }, axisBorder: { color: isDark.value ? "#616161" : "#e0e0e0" }, axisTicks: { color: isDark.value ? "#616161" : "#e0e0e0" } },
    yaxis: { categories: props.categories, labels: { style: { colors: isDark.value ? "#e0e0e0" : "#424242", fontSize: "12px" }, maxWidth: 160, align: isRTL.value ? "left" : "right" } },
    legend: { show: props.showLegend && !props.distributed, position: "top", horizontalAlign: isRTL.value ? "right" : "left", labels: { colors: isDark.value ? "#e0e0e0" : "#424242" }, markers: { width: 12, height: 12, radius: 2 } },
    tooltip: { theme: isDark.value ? "dark" : "light", y: { formatter: formatValue } },
    responsive: [
      { breakpoint: 1280, options: { chart: { height: typeof props.height === "number" ? props.height * 0.9 : props.height }, plotOptions: { bar: { barHeight: "65%" } } } },
      { breakpoint: 960, options: { chart: { height: typeof props.height === "number" ? props.height * 0.8 : props.height }, plotOptions: { bar: { barHeight: "60%" } }, yaxis: { labels: { maxWidth: 120 } } } },
      { breakpoint: 600, options: { chart: { height: typeof props.height === "number" ? props.height * 0.7 : props.height }, plotOptions: { bar: { barHeight: "55%" } }, dataLabels: { enabled: false }, yaxis: { labels: { maxWidth: 80, style: { fontSize: "10px" } } } } }
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
