<template>
  <div class="crypto-analytics-container">
    <!-- Header Controls -->
    <div class="analytics-header">
      <div class="intervals-section">
        <v-btn-toggle 
          v-model="selectedInterval" 
          mandatory 
          variant="text"
          density="compact"
          class="interval-tabs"
        >
          <v-btn 
            value="weekly"
            :class="{ 'active-tab': selectedInterval === 'weekly' }"
            class="interval-tab"
          >
            Weekly
          </v-btn>
          <v-btn 
            value="monthly"
            :class="{ 'active-tab': selectedInterval === 'monthly' }"
            class="interval-tab"
          >
            Monthly
          </v-btn>
          <v-btn 
            value="yearly"
            :class="{ 'active-tab': selectedInterval === 'yearly' }"
            class="interval-tab"
          >
            Yearly
          </v-btn>
        </v-btn-toggle>
      </div>

      <div class="controls-section">
        <v-btn
          :color="downloadButtonColor"
          variant="flat"
          class="download-btn"
          rounded="lg"
          @click="exportChart"
        >
          <v-icon start>mdi-download</v-icon>
          Download
        </v-btn>
        
        <DateRangePicker v-model="dateRange" />
      </div>
    </div>

    <!-- Chart Container -->
    <div class="chart-container">
      <div class="chart-header">
        <h3 class="chart-title">Crypto Analytics</h3>
        <div class="chart-legend">
          <div class="legend-item">
            <div 
              class="legend-dot" 
              :style="{ backgroundColor: chartColorsData.personal }"
            />
            <span class="legend-text">Personal Wallet</span>
          </div>
          <div class="legend-item">
            <div 
              class="legend-dot" 
              :style="{ backgroundColor: chartColorsData.corporate }"
            />
            <span class="legend-text">Corporate Wallet</span>
          </div>
          <div class="legend-item">
            <div 
              class="legend-dot" 
              :style="{ backgroundColor: chartColorsData.investment }"
            />
            <span class="legend-text">Investment Wallet</span>
          </div>
        </div>
      </div>

      <div class="chart-wrapper">
        <BaseBarChart 
          ref="barChart" 
          :chart-data="chartData" 
          :chart-options="chartOptions" 
          :height="350" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import BaseBarChart from '~/components/charts/base/BaseBarChart.vue'
import DateRangePicker from '~/components/DateRangePicker.vue'
// import ExportButton from '~/components/ui/ExportButton.vue'
import { useChartExport } from '~/composables/useChartExport'

const theme = useTheme()
const barChart = ref(null)

const selectedInterval = ref('monthly')
const dateRange = ref<[Date, Date] | null>(null)

const { exportChart } = useChartExport()

// Theme-based color generation
const generateThemeColors = (baseColor) => {
  // Simple hex to RGB conversion
  const hex = baseColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16) || 30
  const g = parseInt(hex.substr(2, 2), 16) || 144
  const b = parseInt(hex.substr(4, 2), 16) || 255
  
  return {
    personal: `rgba(${r}, ${g}, ${b}, 1)`,
    corporate: `rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)}, 0.8)`,
    investment: `rgba(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)}, 0.6)`
  }
}

// Computed colors based on current theme
const chartColorsData = computed(() => {
  const { colors } = theme.current.value
  const primaryColor = colors.primary || '#1976D2'
  return generateThemeColors(primaryColor)
})

// Download button color matching theme
const downloadButtonColor = computed(() => {
  const themeName = theme.global.name.value
  
  if (themeName.includes('gold')) return 'orange'
  if (themeName.includes('red')) return 'pink'
  if (themeName.includes('blue')) return 'primary'
  
  return 'primary'
})

const chartData = computed(() => {
  const colors = chartColorsData.value

  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Personal Wallet',
        backgroundColor: colors.personal,
        borderColor: colors.personal,
        borderWidth: 0,
        data: [4000, 10000, 15000, 4000, 16000, 8000, 12000, 14000, 13000, 5000, 12000, 6000],
        borderRadius: {
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
      },
      {
        label: 'Corporate Wallet',
        backgroundColor: colors.corporate,
        borderColor: colors.corporate,
        borderWidth: 0,
        data: [2000, 8500, 2500, 7500, 3500, 6500, 7500, 8000, 6000, 8000, 7600, 4000],
        borderRadius: {
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
      },
      {
        label: 'Investment Wallet',
        backgroundColor: colors.investment,
        borderColor: colors.investment,
        borderWidth: 0,
        data: [4000, 5000, 2500, 7000, 2500, 4000, 6500, 8000, 2500, 4000, 7600, 4500],
        borderRadius: {
          topLeft: 4,
          topRight: 4,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
      },
    ],
  }
})

const chartOptions = computed(() => {
  const { colors } = theme.current.value
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false, // We're using custom legend
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: colors.surface || '#ffffff',
        titleColor: colors['on-surface'] || '#000000',
        bodyColor: colors['on-surface'] || '#000000',
        borderColor: colors['outline-variant'] || '#e0e0e0',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleMarginBottom: 8,
        bodySpacing: 6,
        usePointStyle: true,
        pointStyle: 'circle',
        callbacks: {
          title: (context) => {
            return context[0].label || ''
          },
          label: (context) => {
            const label = context.dataset.label || ''
            const value = context.parsed.y
            return ` ${label}: ${value.toLocaleString()}`
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        categoryPercentage: 0.85,
        barPercentage: 1.0,
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: colors['on-surface-variant'] || '#666666',
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
          },
          padding: 8,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        border: {
          display: false,
        },
        grid: {
          color: colors['outline-variant'] || '#f0f0f0',
          lineWidth: 1,
          drawTicks: false,
        },
        ticks: {
          color: colors['on-surface-variant'] || '#666666',
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
          },
          padding: 12,
          callback: function(value) {
            if (value >= 1000) {
              return (value / 1000) + 'k'
            }
            return value.toLocaleString()
          },
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 0,
        borderSkipped: false,
        borderWidth: 0,
      },
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
  }
})
</script>

<style scoped>
.crypto-analytics-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  background: rgb(var(--v-theme-surface));
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.analytics-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.intervals-section {
  display: flex;
  align-items: center;
}

.interval-tabs {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 8px;
  padding: 4px;
}

.interval-tab {
  min-height: 36px !important;
  padding: 0 16px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  border-radius: 6px !important;
  color: rgba(var(--v-theme-on-surface-variant)) !important;
  transition: all 0.2s ease !important;
}

.interval-tab:hover {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
}

.interval-tab.active-tab {
  background-color: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

.controls-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.download-btn {
  text-transform: none !important;
  font-weight: 500 !important;
  padding: 0 20px !important;
  height: 40px !important;
  border-radius: 10px !important;
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary-darken-1), 0.2) !important;
  transition: all 0.3s ease !important;
}

.download-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary-darken-1), 0.3) !important;
}

.chart-container {
  background: rgb(var(--v-theme-surface));
  border-radius: 12px;
  overflow: hidden;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(var(--v-theme-outline-variant), 0.5);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin: 0;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 24px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-text {
  font-size: 13px;
  color: rgba(var(--v-theme-on-surface-variant));
  font-weight: 500;
}

.chart-wrapper {
  padding: 20px;
  background: rgb(var(--v-theme-surface));
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .controls-section {
    justify-content: center;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .chart-legend {
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .crypto-analytics-container {
    padding: 16px;
  }
}

/* Theme-specific overrides */
:deep(.v-btn-toggle .v-btn--selected) {
  background-color: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

/* Chart container hover effects */
.chart-container:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

/* Custom scrollbar for legend */
.chart-legend::-webkit-scrollbar {
  height: 4px;
}

.chart-legend::-webkit-scrollbar-track {
  background: rgba(var(--v-theme-outline-variant), 0.3);
  border-radius: 2px;
}

.chart-legend::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-primary), 0.5);
  border-radius: 2px;
}

.chart-legend::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--v-theme-primary), 0.7);
}
</style>
