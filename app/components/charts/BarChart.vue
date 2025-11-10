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

<script setup>
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";

/**
 * BarChart Component - Nuxt 4 + Vuetify 3 + ApexCharts
 *
 * Professional Bar Chart component using ApexCharts
 * Features:
 * - Fully responsive
 * - RTL support
 * - Dark/Light theme support
 * - Vuetify 3 integration
 * - Download chart functionality
 * - Highly customizable
 *
 * @example
 * <BarChart
 *   :series="chartSeries"
 *   :categories="['Jan', 'Feb', 'Mar']"
 *   title="Sales Report"
 *   :height="350"
 * />
 */

const props = defineProps({
  // Chart data series
  series: {
    type: Array,
    default: () => [
      {
        name: "Series 1",
        data: [44, 55, 41, 67, 22, 43],
      },
    ],
  },

  // X-axis categories
  categories: {
    type: Array,
    default: () => ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  },

  // Chart title
  title: {
    type: String,
    default: "",
  },

  // Chart height
  height: {
    type: [Number, String],
    default: 350,
  },

  // Chart width
  width: {
    type: [Number, String],
    default: "100%",
  },

  // Card elevation
  elevation: {
    type: Number,
    default: 2,
  },

  // Stacked bars
  stacked: {
    type: Boolean,
    default: false,
  },

  // Horizontal bars
  horizontal: {
    type: Boolean,
    default: false,
  },

  // Show data labels
  dataLabels: {
    type: Boolean,
    default: false,
  },

  // Custom colors
  colors: {
    type: Array,
    default: () => ["#1976D2", "#42A5F5", "#64B5F6", "#90CAF9"],
  },

  // Show legend
  showLegend: {
    type: Boolean,
    default: true,
  },

  // Show grid
  showGrid: {
    type: Boolean,
    default: true,
  },

  // Show download button
  showDownload: {
    type: Boolean,
    default: true,
  },

  // Download tooltip text
  downloadTooltip: {
    type: String,
    default: "Download Chart",
  },

  // Custom ApexCharts options (merged with defaults)
  customOptions: {
    type: Object,
    default: () => ({}),
  },

  // Card class
  cardClass: {
    type: String,
    default: "",
  },

  // Card text class
  cardTextClass: {
    type: String,
    default: "pa-4",
  },
});

const { locale } = useI18n();
const { current: currentTheme } = useTheme();

// Chart reference
const chartRef = ref(null);

// RTL detection
const isRTL = computed(() => locale.value === "ar");

// Dark mode detection
const isDark = computed(() => currentTheme.value.dark);

// Chart options
const chartOptions = computed(() => {
  const baseOptions = {
    chart: {
      type: "bar",
      fontFamily: isRTL.value ? "Tajawal, sans-serif" : "Roboto, sans-serif",
      toolbar: {
        show: true,
        tools: {
          download: false, // نستخدم الزر المخصص
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      stacked: props.stacked,
      direction: isRTL.value ? "rtl" : "ltr",
    },

    plotOptions: {
      bar: {
        horizontal: props.horizontal,
        borderRadius: 4,
        columnWidth: "60%",
        dataLabels: {
          position: "top",
        },
      },
    },

    dataLabels: {
      enabled: props.dataLabels,
      style: {
        fontSize: "12px",
        colors: [isDark.value ? "#fff" : "#000"],
      },
      formatter: (val) => {
        if (val >= 1e9) return (val / 1e9).toFixed(1) + "B";
        if (val >= 1e6) return (val / 1e6).toFixed(1) + "M";
        if (val >= 1e3) return (val / 1e3).toFixed(1) + "K";
        return val;
      },
    },

    colors: props.colors,

    legend: {
      show: props.showLegend,
      position: "top",
      horizontalAlign: isRTL.value ? "right" : "left",
      fontSize: "14px",
      fontWeight: 500,
      labels: {
        colors: isDark.value ? "#fff" : "#000",
      },
    },

    xaxis: {
      categories: props.categories,
      labels: {
        style: {
          colors: isDark.value ? "#aaa" : "#666",
          fontSize: "12px",
        },
        rotate: -45,
        rotateAlways: props.categories.length > 8,
      },
      axisBorder: {
        show: true,
        color: isDark.value ? "#444" : "#e0e0e0",
      },
      axisTicks: {
        show: true,
        color: isDark.value ? "#444" : "#e0e0e0",
      },
    },

    yaxis: {
      labels: {
        style: {
          colors: isDark.value ? "#aaa" : "#666",
          fontSize: "12px",
        },
        formatter: (val) => {
          if (val >= 1e9) return (val / 1e9).toFixed(1) + "B";
          if (val >= 1e6) return (val / 1e6).toFixed(1) + "M";
          if (val >= 1e3) return (val / 1e3).toFixed(1) + "K";
          return val;
        },
      },
    },

    grid: {
      show: props.showGrid,
      borderColor: isDark.value ? "#444" : "#e0e0e0",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: props.showGrid,
        },
      },
    },

    tooltip: {
      theme: isDark.value ? "dark" : "light",
      style: {
        fontSize: "13px",
      },
      y: {
        formatter: (val) => {
          if (val >= 1e9) return (val / 1e9).toFixed(2) + "B";
          if (val >= 1e6) return (val / 1e6).toFixed(2) + "M";
          if (val >= 1e3) return (val / 1e3).toFixed(1) + "K";
          return val;
        },
      },
    },

    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "80%",
            },
          },
          xaxis: {
            labels: {
              rotate: -45,
            },
          },
        },
      },
    ],
  };

  // Merge with custom options
  return mergeDeep(baseOptions, props.customOptions);
});

// Deep merge helper
const mergeDeep = (target, source) => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

const isObject = (item) => {
  return item && typeof item === "object" && !Array.isArray(item);
};

// Download chart as PNG
const downloadChart = () => {
  if (chartRef.value) {
    chartRef.value.chart.dataURI().then(({ imgURI }) => {
      const link = document.createElement("a");
      link.href = imgURI;
      link.download = `${props.title || "chart"}.png`;
      link.click();
    });
  }
};

// Update series programmatically
const updateSeries = (newSeries) => {
  if (chartRef.value) {
    chartRef.value.chart.updateSeries(newSeries);
  }
};

// Update options programmatically
const updateOptions = (newOptions) => {
  if (chartRef.value) {
    chartRef.value.chart.updateOptions(newOptions);
  }
};

// Expose methods
defineExpose({
  updateSeries,
  updateOptions,
  downloadChart,
});
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
