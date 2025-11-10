# Chart Components - ApexCharts Integration

Professional chart components for Nuxt 4 + Vuetify 3 using ApexCharts.

## 📦 Installation

```bash
pnpm add apexcharts vue3-apexcharts
```

The plugin is already configured in `/app/plugins/apexcharts.client.ts`.

## 🚀 Components

### 1. BarChart

Vertical bar chart for comparing data across categories.

**Features:**

- Vertical/Horizontal orientation
- Stacked bars support
- Data labels
- Custom colors
- Download as PNG
- Responsive design
- RTL support
- Dark/Light theme

**Example:**

```vue
<BarChart
  :series="[
    { name: 'Sales 2023', data: [44, 55, 41, 67, 22, 43] },
    { name: 'Sales 2024', data: [53, 32, 33, 52, 13, 44] },
  ]"
  :categories="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']"
  title="Monthly Sales Comparison"
  :height="350"
  :stacked="false"
  :horizontal="false"
  :data-labels="true"
  :show-legend="true"
  :show-grid="true"
  :show-download="true"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `series` | Array | `[{ name: 'Series 1', data: [...] }]` | Chart data series |
| `categories` | Array | `['Jan', 'Feb', ...]` | X-axis categories |
| `title` | String | `''` | Chart title |
| `height` | Number/String | `350` | Chart height |
| `width` | Number/String | `'100%'` | Chart width |
| `elevation` | Number | `2` | Card elevation |
| `stacked` | Boolean | `false` | Enable stacked bars |
| `horizontal` | Boolean | `false` | Horizontal orientation |
| `dataLabels` | Boolean | `true` | Show data labels |
| `colors` | Array | `['#008FFB', ...]` | Custom colors |
| `showLegend` | Boolean | `true` | Show legend |
| `showGrid` | Boolean | `true` | Show grid lines |
| `showDownload` | Boolean | `true` | Show download button |
| `customOptions` | Object | `{}` | Custom ApexCharts options |

---

### 2. LineChart

Line chart for showing trends over time.

**Features:**

- Smooth/Straight/Stepline curves
- Area fill option
- Multiple series support
- Markers on data points
- Zoom functionality
- Download as PNG
- Responsive design
- RTL support
- Dark/Light theme

**Example:**

```vue
<LineChart
  :series="[
    { name: 'Revenue', data: [28, 29, 33, 36, 32, 32, 33] },
    { name: 'Profit', data: [12, 11, 14, 18, 17, 13, 13] },
  ]"
  :categories="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
  title="Weekly Revenue & Profit"
  :height="350"
  curve="smooth"
  :area="false"
  :show-markers="true"
  :marker-size="5"
  :stroke-width="2"
  :enable-zoom="true"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `series` | Array | `[{ name: 'Series 1', data: [...] }]` | Chart data series |
| `categories` | Array | `['Mon', 'Tue', ...]` | X-axis categories |
| `title` | String | `''` | Chart title |
| `height` | Number/String | `350` | Chart height |
| `width` | Number/String | `'100%'` | Chart width |
| `elevation` | Number | `2` | Card elevation |
| `curve` | String | `'smooth'` | Line curve type: smooth, straight, stepline |
| `area` | Boolean | `false` | Enable area fill |
| `dataLabels` | Boolean | `false` | Show data labels |
| `colors` | Array | `['#008FFB', ...]` | Custom colors |
| `showLegend` | Boolean | `true` | Show legend |
| `showGrid` | Boolean | `true` | Show grid lines |
| `showDownload` | Boolean | `true` | Show download button |
| `showMarkers` | Boolean | `true` | Show markers on line |
| `markerSize` | Number | `5` | Marker size |
| `strokeWidth` | Number | `2` | Line width |
| `yMin` | Number | `undefined` | Y-axis minimum |
| `yMax` | Number | `undefined` | Y-axis maximum |
| `enableZoom` | Boolean | `true` | Enable zoom controls |
| `customOptions` | Object | `{}` | Custom ApexCharts options |

---

### 3. HorizontalBarChart

Horizontal bar chart perfect for rankings and comparisons.

**Features:**

- Horizontal orientation (optimized)
- Stacked bars support
- Distributed colors (different color per bar)
- Data labels
- Download as PNG
- Responsive design
- RTL support
- Dark/Light theme

**Example:**

```vue
<HorizontalBarChart
  :series="[{ name: 'Sales', data: [44, 55, 41, 67, 22, 43] }]"
  :categories="[
    'Product A',
    'Product B',
    'Product C',
    'Product D',
    'Product E',
    'Product F',
  ]"
  title="Top Products by Sales"
  :height="350"
  :distributed="true"
  :data-labels="true"
  :bar-height="70%"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `series` | Array | `[{ name: 'Series 1', data: [...] }]` | Chart data series |
| `categories` | Array | `['Category 1', ...]` | Y-axis categories |
| `title` | String | `''` | Chart title |
| `height` | Number/String | `350` | Chart height |
| `width` | Number/String | `'100%'` | Chart width |
| `elevation` | Number | `2` | Card elevation |
| `stacked` | Boolean | `false` | Enable stacked bars |
| `dataLabels` | Boolean | `true` | Show data labels |
| `colors` | Array | `['#008FFB', ...]` | Custom colors |
| `showLegend` | Boolean | `true` | Show legend |
| `showGrid` | Boolean | `true` | Show grid lines |
| `showDownload` | Boolean | `true` | Show download button |
| `barHeight` | String | `'70%'` | Bar height percentage |
| `xMin` | Number | `undefined` | X-axis minimum |
| `xMax` | Number | `undefined` | X-axis maximum |
| `distributed` | Boolean | `false` | Different color per bar |
| `customOptions` | Object | `{}` | Custom ApexCharts options |

---

## Other Components (All ApexCharts Types)

Below are reusable wrappers for the rest of ApexCharts chart types. All accept:

- `series`: pass data in ApexCharts format for that type
- `height`, `width`, `title`, `elevation`, `showDownload`, and `customOptions` (deep‑merged)
- Most support `colors`, `showLegend`, and `labels`/`categories` where applicable

### PieChart

```vue
<PieChart
  :series="[44,55,13,43,22]"
  :labels="['A','B','C','D','E']"
  title="Market Share"
  :height="320"
/>
```

### DonutChart

```vue
<DonutChart
  :series="[35, 25, 20, 20]"
  :labels="['Product A','Product B','Product C','Product D']"
  :donut-labels="true"
  title="Revenue Split"
/>
```

### AreaChart

```vue
<AreaChart
  :series="[
    { name: 'Users', data: [31, 40, 28, 51, 42, 109, 100] },
    { name: 'Sessions', data: [11, 32, 45, 32, 34, 52, 41] }
  ]"
  :categories="['Mon','Tue','Wed','Thu','Fri','Sat','Sun']"
  curve="smooth"
  title="Traffic"
/>
```

### RadarChart

```vue
<RadarChart
  :series="[{ name: 'Score', data: [80, 50, 30, 40, 100, 20] }]"
  :categories="['Speed','Power','Agility','Endurance','Flexibility','Precision']"
  title="Athlete Profile"
/>
```

### RadialBarChart

```vue
<RadialBarChart :series="[67]" :labels="['Progress']" title="Goal Progress" />
```

### HeatmapChart

```vue
<HeatmapChart :series="myHeatmapSeries" title="Hourly Load" />
```

Where `myHeatmapSeries` is:

```js
[
  { name: 'Mon', data: [{ x: '0', y: 12 }, { x: '1', y: 24 }, ...] },
  { name: 'Tue', data: [{ x: '0', y: 18 }, { x: '1', y: 16 }, ...] }
]
```

### ScatterChart

```vue
<ScatterChart :series="[{ name: 'A', data: [[16.4,5.4],[21.7,2],[25.4,3]] }]" title="Correlation" />
```

### BubbleChart

```vue
<BubbleChart :series="[{ name: 'S', data: [[10,20,30],[20,30,15],[30,10,40]] }]" title="Population" />
```

### CandlestickChart

```vue
<CandlestickChart :series="[{ data: [{ x: new Date(), y: [51.9,56.2,51.5,53.8] }] }]" title="OHLC" />
```

### RangeBarChart (Timeline)

```vue
<RangeBarChart :series="[{ data: [{ x: 'Task A', y: [Date.now(), Date.now()+86400000] }] }]" title="Timeline" />
```

### TreemapChart

```vue
<TreemapChart :series="[{ data: [{ x: 'A', y: 31 }, { x: 'B', y: 40 }] }]" title="Categories" />
```

### PolarAreaChart

```vue
<PolarAreaChart :series="[14, 23, 21, 17, 15]" :labels="['A','B','C','D','E']" title="Distribution" />
```

All components expose `downloadChart()` via `ref` and accept `customOptions` for any advanced ApexCharts configuration.

## 🎨 Theming

All charts automatically adapt to:

- **Vuetify theme** (light/dark mode)
- **RTL layout** (Arabic language support)
- **Responsive breakpoints** (mobile, tablet, desktop)

The components detect the current theme and locale using:

```typescript
const { current: currentTheme } = useTheme(); // Vuetify theme
const { locale } = useI18n(); // i18n locale
```

---

## 📊 Common Patterns

### Simple Bar Chart

```vue
<BarChart
  :series="[{ name: 'Revenue', data: [30, 40, 45, 50, 49, 60] }]"
  :categories="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']"
  title="Monthly Revenue"
/>
```

### Stacked Area Chart

```vue
<LineChart
  :series="[
    { name: 'Product A', data: [31, 40, 28, 51, 42, 109] },
    { name: 'Product B', data: [11, 32, 45, 32, 34, 52] },
  ]"
  :categories="['2019', '2020', '2021', '2022', '2023', '2024']"
  title="Product Sales Over Time"
  :area="true"
  curve="smooth"
/>
```

### Ranking Chart

```vue
<HorizontalBarChart
  :series="[{ name: 'Score', data: [95, 88, 76, 65, 52] }]"
  :categories="['Team A', 'Team B', 'Team C', 'Team D', 'Team E']"
  title="Team Performance Ranking"
  :distributed="true"
  :show-legend="false"
/>
```

### Custom Styled Chart

```vue
<BarChart
  :series="chartData"
  :categories="chartCategories"
  title="Custom Styled Chart"
  :colors="['#FF6384', '#36A2EB', '#FFCE56']"
  :custom-options="{
    chart: {
      animations: {
        speed: 1200,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
      },
    },
  }"
/>
```

---

## 🔧 Advanced Usage

### Dynamic Updates

```vue
<script setup>
const chartRef = ref(null);
const series = ref([{ name: "Sales", data: [30, 40, 35] }]);

// Update series data
const updateData = () => {
  const newData = [50, 60, 55];
  chartRef.value.updateSeries([{ name: "Sales", data: newData }]);
};

// Update chart options
const updateTheme = () => {
  chartRef.value.updateOptions({
    colors: ["#FF5733", "#33FF57"],
  });
};
</script>

<template>
  <BarChart ref="chartRef" :series="series" title="Dynamic Chart" />
</template>
```

### Programmatic Download

```vue
<script setup>
const chartRef = ref(null);

const downloadAsPNG = () => {
  chartRef.value.downloadChart();
};
</script>

<template>
  <div>
    <BarChart ref="chartRef" :series="data" />
    <v-btn @click="downloadAsPNG">Download Chart</v-btn>
  </div>
</template>
```

---

## 📱 Responsive Behavior

Charts automatically adjust at these breakpoints:

- **1280px** - Desktop: 90% height
- **960px** - Tablet: 80% height, legend moves to bottom
- **600px** - Mobile: 70% height, labels rotated, smaller fonts

You can customize responsive behavior via `customOptions`:

```vue
<BarChart
  :custom-options="{
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { height: 250 },
          legend: { position: 'bottom' },
        },
      },
    ],
  }"
/>
```

---

## 🌐 RTL Support

Charts automatically flip for Arabic (RTL) layout:

- Legend alignment
- Data label positioning
- Grid padding
- Axis alignment

Detection happens automatically via `useI18n()`.

---

## 🎯 Best Practices

1. **Use appropriate chart types:**

   - Bar charts for comparisons
   - Line charts for trends
   - Horizontal bars for rankings

2. **Limit data points:**

   - Keep categories under 20 for readability
   - Use aggregation for large datasets

3. **Color accessibility:**

   - Provide custom colors with good contrast
   - Use distributed colors for single-series rankings

4. **Performance:**

   - Charts are wrapped in `<ClientOnly>` to prevent SSR issues
   - Skeleton loaders show during hydration

5. **Custom options:**
   - Use `customOptions` prop for advanced ApexCharts features
   - Options are deep-merged with defaults

---

## 📚 Resources

- [ApexCharts Documentation](https://apexcharts.com/docs/)
- [ApexCharts Demos](https://apexcharts.com/javascript-chart-demos/)
- [vue3-apexcharts](https://github.com/apexcharts/vue3-apexcharts)
- [Vuetify 3 Docs](https://vuetifyjs.com/)

---

## 🐛 Troubleshooting

**Chart not showing:**

- Ensure `apexcharts` and `vue3-apexcharts` are installed
- Check that plugin is loaded (`/app/plugins/apexcharts.client.ts`)
- Verify data format matches ApexCharts requirements

**SSR errors:**

- Plugin has `.client.ts` suffix (client-side only)
- Components wrapped in `<ClientOnly>`

**Theme not updating:**

- Vuetify theme must be properly configured
- Check `useTheme()` composable is available

**RTL not working:**

- Ensure i18n is configured with 'ar' locale
- Check `useI18n()` composable returns correct locale
