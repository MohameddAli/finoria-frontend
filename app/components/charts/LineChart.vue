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

<script setup>
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";

/**
 * LineChart Component - Nuxt 4 + Vuetify 3 + ApexCharts
 *
 * Professional Line Chart component using ApexCharts
 * Features:
 * - Fully responsive
 * - RTL support
 * - Dark/Light theme support
 * - Vuetify 3 integration
 * - Download chart functionality
 * - Highly customizable
 * - Smooth/straight line support
 * - Area fill support
 *
 * @example
 * <LineChart
 *   :series="chartSeries"
 *   :categories="['Jan', 'Feb', 'Mar']"
 *   title="Revenue Trend"
 *   :height="350"
 *   smooth
 * />
 */

const props = defineProps({
  // Chart data series
  series: {
    type: Array,
    default: () => [
      {
        name: "Series 1",
        data: [28, 29, 33, 36, 32, 32, 33],
      },
    ],
  },

  // X-axis categories
  categories: {
    type: Array,
    default: () => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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

  // Smooth curve
  curve: {
    type: String,
    default: "smooth", // smooth, straight, stepline
    validator: (value) => ["smooth", "straight", "stepline"].includes(value),
  },

  // Enable area fill
  area: {
    type: Boolean,
    default: false,
  },

  // Enable data labels
  dataLabels: {
    type: Boolean,
    default: false,
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

  // Show markers on lines
  showMarkers: {
    type: Boolean,
    default: true,
  },

  // Marker size
  markerSize: {
    type: Number,
    default: 5,
  },

  // Line width
  strokeWidth: {
    type: Number,
    default: 2,
  },

  // Y-axis min value
  yMin: {
    type: Number,
    default: undefined,
  },

  // Y-axis max value
  yMax: {
    type: Number,
    default: undefined,
  },

  // Enable zoom
  enableZoom: {
    type: Boolean,
    default: true,
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
      type: props.area ? "area" : "line",
      fontFamily: "inherit",
      toolbar: {
        show: true,
        tools: {
          download: false, // We use custom download button
          selection: true,
          zoom: props.enableZoom,
          zoomin: props.enableZoom,
          zoomout: props.enableZoom,
          pan: props.enableZoom,
          reset: props.enableZoom,
        },
      },
      background: "transparent",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      zoom: {
        enabled: props.enableZoom,
        type: "x",
        autoScaleYaxis: true,
      },
    },

    colors: props.colors,

    dataLabels: {
      enabled: props.dataLabels,
      formatter: formatValue,
    },

    stroke: {
      curve: props.curve,
      width: props.strokeWidth,
    },

    markers: {
      size: props.showMarkers ? props.markerSize : 0,
      hover: {
        sizeOffset: 2,
      },
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
          show: props.showGrid,
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
      categories: props.categories,
      labels: {
        style: {
          colors: isDark.value ? "#e0e0e0" : "#424242",
          fontSize: "12px",
        },
        rotate: -45,
        rotateAlways: false,
      },
      axisBorder: {
        color: isDark.value ? "#616161" : "#e0e0e0",
      },
      axisTicks: {
        color: isDark.value ? "#616161" : "#e0e0e0",
      },
    },

    yaxis: {
      min: props.yMin,
      max: props.yMax,
      labels: {
        style: {
          colors: isDark.value ? "#e0e0e0" : "#424242",
          fontSize: "12px",
        },
        formatter: formatValue,
      },
    },

    legend: {
      show: props.showLegend,
      position: isRTL.value ? "top" : "top",
      horizontalAlign: isRTL.value ? "right" : "left",
      labels: {
        colors: isDark.value ? "#e0e0e0" : "#424242",
      },
      markers: {
        width: 12,
        height: 12,
        radius: 12,
      },
    },

    tooltip: {
      theme: isDark.value ? "dark" : "light",
      x: {
        show: true,
      },
      y: {
        formatter: formatValue,
      },
    },

    fill: props.area
      ? {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
            stops: [0, 90, 100],
          },
        }
      : {},

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
          legend: {
            position: "bottom",
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
          xaxis: {
            labels: {
              rotate: -90,
            },
          },
        },
      },
    ],
  };

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
