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

<script setup lang="ts">
import { useTheme } from 'vuetify';

interface Props {
  series?: any[];
  categories?: string[];
  title?: string;
  height?: number | string;
  width?: number | string;
  elevation?: number;
  curve?: string;
  dataLabels?: boolean;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  showDownload?: boolean;
  customOptions?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  series: () => [{ name: 'Series 1', data: [31, 40, 28, 51, 42, 109, 100] }],
  categories: () => ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  title: '',
  height: 350,
  width: '100%',
  elevation: 2,
  curve: 'smooth',
  dataLabels: false,
  colors: () => ['#008FFB', '#00E396', '#FEB019'],
  showLegend: true,
  showGrid: true,
  showDownload: true,
  customOptions: () => ({}),
});

const { locale } = useI18n();
const theme = useTheme();

const isRTL = computed(() => locale.value === 'ar');
const isDark = computed(() => theme.current.value.dark);
const chartRef = ref(null);

const baseOptions = computed(() => ({
  chart: {
    type: 'area',
    fontFamily: isRTL.value ? 'Tajawal, sans-serif' : 'Inter, Roboto, sans-serif',
    toolbar: { show: true, tools: { download: false } },
  },
  colors: props.colors,
  dataLabels: { enabled: props.dataLabels },
  stroke: { curve: props.curve, width: 2 },
  legend: { show: props.showLegend, position: 'top', labels: { colors: isDark.value ? '#fff' : '#000' } },
  xaxis: { categories: props.categories, labels: { style: { colors: isDark.value ? '#aaa' : '#666' } } },
  yaxis: { labels: { style: { colors: isDark.value ? '#aaa' : '#666' } } },
  grid: { show: props.showGrid, borderColor: isDark.value ? '#444' : '#e0e0e0' },
  tooltip: { theme: isDark.value ? 'dark' : 'light' },
  fill: { type: 'gradient', gradient: { shadeIntensity: 0.4, opacityFrom: 0.6, opacityTo: 0.05, stops: [0, 90, 100] } },
}));

const chartOptions = computed(() => mergeDeep(baseOptions.value, props.customOptions));

const mergeDeep = (t: any, s: any): any => {
  const o = { ...t };
  if (s && typeof s === 'object') {
    Object.keys(s).forEach(k => { o[k] = (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) ? mergeDeep(t[k] || {}, s[k]) : s[k]; });
  }
  return o;
};

const downloadChart = () => {
  (chartRef.value as any)?.chart?.dataURI().then(({ imgURI }: { imgURI: string }) => {
    const a = document.createElement('a');
    a.href = imgURI;
    a.download = `${props.title || 'area-chart'}.png`;
    a.click();
  });
};

defineExpose({ downloadChart });
</script>

