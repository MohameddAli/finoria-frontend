/**
 * ApexCharts Plugin for Nuxt 4
 *
 * This plugin registers ApexCharts globally for client-side rendering.
 * The .client.ts suffix ensures it only runs in the browser, avoiding SSR issues.
 *
 * Installation:
 * pnpm add apexcharts vue3-apexcharts
 *
 * Usage:
 * Components are auto-imported globally:
 * - <apexchart> component available everywhere
 *
 * @see https://apexcharts.com/
 * @see https://github.com/apexcharts/vue3-apexcharts
 */

import VueApexCharts from "vue3-apexcharts";

export default defineNuxtPlugin({
  name: "apexcharts",
  parallel: true,
  setup(nuxtApp) {
    // Register the apexchart component globally
    nuxtApp.vueApp.component("apexchart", VueApexCharts);
  },
});
