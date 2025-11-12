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
import { useTheme } from 'vuetify';

interface Props {
  series?: any[];
  categories?: string[];
  title?: string;
  height?: number | string;
  width?: number | string;
  elevation?: number;
  stacked?: boolean;
  horizontal?: boolean;
  dataLabels?: boolean;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  showDownload?: boolean;
  downloadTooltip?: string;
  customOptions?: Record<string, any>;
  cardClass?: string;
  cardTextClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  series: () => [{ name: "Series 1", data: [44, 55, 41, 67, 22, 43] }],
  categories: () => ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  title: "",
  height: 350,
  width: "100%",
  elevation: 2,
  stacked: false,
  horizontal: false,
  dataLabels: false,
  colors: () => ["#1976D2", "#42A5F5", "#64B5F6", "#90CAF9"],
  showLegend: true,
  showGrid: true,
  showDownload: true,
  downloadTooltip: "Download Chart",
  customOptions: () => ({}),
  cardClass: "",
  cardTextClass: "pa-4",
});

const { locale } = useI18n();
const theme = useTheme();
const chartRef = ref(null);

const isRTL = computed(() => locale.value === "ar");
const isDark = computed(() => theme.current.value.dark);

const formatValue = (val: number) => {
  if (val >= 1e9) return (val / 1e9).toFixed(1) + "B";
  if (val >= 1e6) return (val / 1e6).toFixed(1) + "M";
  if (val >= 1e3) return (val / 1e3).toFixed(1) + "K";
  return val;
};

const chartOptions = computed(() => {
  const baseOptions = {
    chart: {
      type: "bar",
      fontFamily: isRTL.value ? "Tajawal, sans-serif" : "Roboto, sans-serif",
      toolbar: { show: true, tools: { download: false, selection: true, zoom: true, zoomin: true, zoomout: true, pan: true, reset: true } },
      animations: { enabled: true, easing: "easeinout", speed: 800 },
      stacked: props.stacked,
      direction: isRTL.value ? "rtl" : "ltr",
    },
    plotOptions: { bar: { horizontal: props.horizontal, borderRadius: 4, columnWidth: "60%", dataLabels: { position: "top" } } },
    dataLabels: { enabled: props.dataLabels, style: { fontSize: "12px", colors: [isDark.value ? "#fff" : "#000"] }, formatter: formatValue },
    colors: props.colors,
    legend: { show: props.showLegend, position: "top", horizontalAlign: isRTL.value ? "right" : "left", fontSize: "14px", fontWeight: 500, labels: { colors: isDark.value ? "#fff" : "#000" } },
    xaxis: {
      categories: props.categories,
      labels: { style: { colors: isDark.value ? "#aaa" : "#666", fontSize: "12px" }, rotate: -45, rotateAlways: props.categories.length > 8 },
      axisBorder: { show: true, color: isDark.value ? "#444" : "#e0e0e0" },
      axisTicks: { show: true, color: isDark.value ? "#444" : "#e0e0e0" },
    },
    yaxis: { labels: { style: { colors: isDark.value ? "#aaa" : "#666", fontSize: "12px" }, formatter: formatValue } },
    grid: { show: props.showGrid, borderColor: isDark.value ? "#444" : "#e0e0e0", strokeDashArray: 3, xaxis: { lines: { show: false } }, yaxis: { lines: { show: props.showGrid } } },
    tooltip: { theme: isDark.value ? "dark" : "light", style: { fontSize: "13px" }, y: { formatter: (val: number) => val >= 1e9 ? (val / 1e9).toFixed(2) + "B" : val >= 1e6 ? (val / 1e6).toFixed(2) + "M" : val >= 1e3 ? (val / 1e3).toFixed(1) + "K" : val } },
    responsive: [{ breakpoint: 600, options: { plotOptions: { bar: { columnWidth: "80%" } }, xaxis: { labels: { rotate: -45 } } } }],
  };
  return mergeDeep(baseOptions, props.customOptions);
});

const mergeDeep = (target: any, source: any): any => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      output[key] = isObject(source[key]) ? (!(key in target) ? source[key] : mergeDeep(target[key], source[key])) : source[key];
    });
  }
  return output;
};

const isObject = (item: any) => item && typeof item === "object" && !Array.isArray(item);

const downloadChart = () => {
  (chartRef.value as any)?.chart?.dataURI().then(({ imgURI }: { imgURI: string }) => {
    const link = document.createElement("a");
    link.href = imgURI;
    link.download = `${props.title || "chart"}.png`;
    link.click();
  });
};

const updateSeries = (newSeries: any) => { (chartRef.value as any)?.chart?.updateSeries(newSeries); };
const updateOptions = (newOptions: any) => { (chartRef.value as any)?.chart?.updateOptions(newOptions); };

defineExpose({ updateSeries, updateOptions, downloadChart });
</script>

<style scoped>
/* ApexCharts RTL support */
:deep(.apexcharts-canvas) {
  direction: v-bind('isRTL ? "rtl" : "ltr"');
}

/* Smooth transitions */
:deep(.apexcharts-bar-area) {
  transition: all 0.3s ease;
}

/* Custom scrollbar for toolbar */
:deep(.apexcharts-toolbar) {
  direction: ltr !important;
}
</style>
