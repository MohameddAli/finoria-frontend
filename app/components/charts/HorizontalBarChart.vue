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
 * HorizontalBarChart Component - Nuxt 4 + Vuetify 3 + ApexCharts
 *
 * Professional Horizontal Bar Chart component using ApexCharts
 * Features:
 * - Fully responsive
 * - RTL support
 * - Dark/Light theme support
 * - Vuetify 3 integration
 * - Download chart functionality
 * - Highly customizable
 * - Perfect for ranking, comparison, and progress visualization
 *
 * @example
 * <HorizontalBarChart
 *   :series="chartSeries"
 *   :categories="['Product A', 'Product B', 'Product C']"
 *   title="Top Products"
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

  // Y-axis categories (shown on left/right in horizontal mode)
  categories: {
    type: Array,
    default: () => [
      "Category 1",
      "Category 2",
      "Category 3",
      "Category 4",
      "Category 5",
      "Category 6",
    ],
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

  // Enable data labels
  dataLabels: {
    type: Boolean,
    default: true,
  },

  // Custom colors
  colors: {
    type: Array,
    default: () => ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"],
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

  // Bar height percentage
  barHeight: {
    type: String,
    default: "70%",
  },

  // X-axis min value
  xMin: {
    type: Number,
    default: undefined,
  },

  // X-axis max value
  xMax: {
    type: Number,
    default: undefined,
  },

  // Enable distributed colors (different color per bar)
  distributed: {
    type: Boolean,
    default: false,
  },

  // Custom options (merged with default)
  customOptions: {
    type: Object,
    default: () => ({}),
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

// Card classes
const cardClass = computed(() => ({
  "rtl-chart": isRTL.value,
}));

const cardTextClass = computed(() => ({
  "pa-2": true,
  "pa-md-4": true,
}));

// Download tooltip
const downloadTooltip = computed(() =>
  isRTL.value ? "تحميل الرسم البياني" : "Download Chart"
);

// Format large numbers
const formatValue = (value) => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + "B";
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return value.toString();
};

// Deep merge objects
const deepMerge = (target, source) => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
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

// Chart options
const chartOptions = computed(() => {
  const baseOptions = {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      toolbar: {
        show: true,
        tools: {
          download: false, // We use custom download button
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      background: "transparent",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },

    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: props.barHeight,
        distributed: props.distributed,
        dataLabels: {
          position: "top",
        },
      },
    },

    colors: props.colors,

    dataLabels: {
      enabled: props.dataLabels,
      formatter: formatValue,
      offsetX: isRTL.value ? -5 : 5,
      style: {
        fontSize: "12px",
        colors: [isDark.value ? "#ffffff" : "#000000"],
      },
    },

    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },

    grid: {
      show: props.showGrid,
      borderColor: isDark.value ? "#424242" : "#e0e0e0",
      strokeDashArray: 4,
      position: "back",
      xaxis: {
        lines: {
          show: props.showGrid,
        },
      },
      yaxis: {
        lines: {
          show: false, // Usually hidden in horizontal charts
        },
      },
      padding: {
        top: 0,
        right: isRTL.value ? 10 : 0,
        bottom: 0,
        left: isRTL.value ? 0 : 10,
      },
    },

    xaxis: {
      min: props.xMin,
      max: props.xMax,
      labels: {
        style: {
          colors: isDark.value ? "#e0e0e0" : "#424242",
          fontSize: "12px",
        },
        formatter: formatValue,
      },
      axisBorder: {
        color: isDark.value ? "#616161" : "#e0e0e0",
      },
      axisTicks: {
        color: isDark.value ? "#616161" : "#e0e0e0",
      },
    },

    yaxis: {
      categories: props.categories,
      labels: {
        style: {
          colors: isDark.value ? "#e0e0e0" : "#424242",
          fontSize: "12px",
        },
        maxWidth: 160,
        align: isRTL.value ? "left" : "right",
      },
    },

    legend: {
      show: props.showLegend && !props.distributed,
      position: "top",
      horizontalAlign: isRTL.value ? "right" : "left",
      labels: {
        colors: isDark.value ? "#e0e0e0" : "#424242",
      },
      markers: {
        width: 12,
        height: 12,
        radius: 2,
      },
    },

    tooltip: {
      theme: isDark.value ? "dark" : "light",
      y: {
        formatter: formatValue,
      },
    },

    responsive: [
      {
        breakpoint: 1280,
        options: {
          chart: {
            height:
              typeof props.height === "number"
                ? props.height * 0.9
                : props.height,
          },
          plotOptions: {
            bar: {
              barHeight: "65%",
            },
          },
        },
      },
      {
        breakpoint: 960,
        options: {
          chart: {
            height:
              typeof props.height === "number"
                ? props.height * 0.8
                : props.height,
          },
          plotOptions: {
            bar: {
              barHeight: "60%",
            },
          },
          yaxis: {
            labels: {
              maxWidth: 120,
            },
          },
        },
      },
      {
        breakpoint: 600,
        options: {
          chart: {
            height:
              typeof props.height === "number"
                ? props.height * 0.7
                : props.height,
          },
          plotOptions: {
            bar: {
              barHeight: "55%",
            },
          },
          dataLabels: {
            enabled: false, // Hide labels on small screens
          },
          yaxis: {
            labels: {
              maxWidth: 80,
              style: {
                fontSize: "10px",
              },
            },
          },
        },
      },
    ],
  };

  // Stacked configuration
  if (props.stacked) {
    baseOptions.chart.stacked = true;
    baseOptions.plotOptions.bar.dataLabels = {
      position: "center",
    };
  }

  return deepMerge(baseOptions, props.customOptions);
});

// Download chart as image
const downloadChart = () => {
  if (chartRef.value) {
    const chartTitle = props.title || "chart";
    chartRef.value.dataURI().then(({ imgURI }) => {
      const link = document.createElement("a");
      link.href = imgURI;
      link.download = `${chartTitle.replace(/\s+/g, "_")}.png`;
      link.click();
    });
  }
};

// Expose methods
defineExpose({
  downloadChart,
  updateSeries: (newSeries) => {
    if (chartRef.value) {
      chartRef.value.updateSeries(newSeries);
    }
  },
  updateOptions: (newOptions) => {
    if (chartRef.value) {
      chartRef.value.updateOptions(newOptions);
    }
  },
});
</script>

<style scoped>
.rtl-chart {
  direction: rtl;
}
</style>
