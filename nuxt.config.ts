import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Disable SSR - SPA mode only
  ssr: false,

  build: {
    transpile: ["vuetify"],
  },
  srcDir: "app",
  compatibilityDate: "2025-07-15",
  // Disable Nuxt DevTools to avoid Console Ninja code injection
  // which can break Vite/Unctx transforms with TS tokens in JS.
  devtools: { enabled: false },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_URL,
    },
  },

  css: ["@/assets/css/global.css", "@/assets/css/rtl-utilities.css"],

  fonts: {
    families: [
      { name: "Inter", provider: "google", weights: [300, 400, 500, 600, 700] },
    ],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error - Vuetify plugin types are incompatible with Vite config types
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
  ],
  i18n: {
    // Lazy loading is implicit when using langDir + file per locale in v8;
    // For TS types, keep only supported keys and rely on file-based loading.
    // nuxt-i18n resolves paths from project root; with srcDir: 'app' use project-root paths
    // Our locale JSON files live at project-root/i18n/locales
    // Ensure correct path so hyphenated navigation keys load
    langDir: "locales",
    locales: [
      { code: "ar", file: "ar.json", name: "العربية", dir: "rtl" },
      { code: "en", file: "en.json", name: "English", dir: "ltr" },
    ],
    // Arabic is default locale
    defaultLocale: "ar",
    strategy: "no_prefix",
    // Our i18n.config.ts lives at project root
    vueI18n: "../i18n.config.ts",
    // Enable SSR-safe locale persistence so Arabic stays after refresh
    // detectBrowserLanguage: {
    //   useCookie: true,
    //   cookieKey: "i18n_redirected",
    //   alwaysRedirect: false,
    // },
    detectBrowserLanguage: false,
  },
  vite: {
    // Reduce noisy dev logs in the terminal
    logLevel: "error",
    // Fix Vite serving allow list for Vuetify and node_modules
    server: {
      fs: {
        allow: [
          // Project root
          process.cwd(),
          // Allow node_modules access
          "C:/projects/nuxt3/nuxt 4/ProjectHome/finoria/node_modules",
          // Allow any node_modules in parent directories
          "C:/projects/nuxt3",
        ],
      },
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    resolve: {
      alias: {
        "~/shared": "/shared",
      },
    },
    build: {
      // Code splitting optimization
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate large vendor libraries
            vuetify: ["vuetify"],
            pinia: ["pinia"],
            charts: ["apexcharts"],
            // Only bundle runtime-safe i18n utilities; the Nuxt module stays server-side
            i18n: ["vue-i18n"],
            // Group common utilities
            utils: ["./shared/utils/helpers", "./app/composables/useUtils"],
          },
        },
      },
      // Optimize chunk size warnings
      chunkSizeWarningLimit: 1000,
      // Enable CSS code splitting
      cssCodeSplit: true,
    },
    optimizeDeps: {
      include: ["vuetify", "pinia", "vue-i18n"],
    },
  },

  // Keep @nuxt/icon fully local to avoid external iconify API calls
  icon: {
    provider: "server",
    fallbackToApi: false,
  },

  // Image optimization configuration
  image: {
    // Quality defaults
    quality: 80,
    // Supported formats with WebP as default
    format: ["webp", "png", "jpg"],
    // Enable responsive images
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    // Provider configuration
    provider: "ipx",
    // IPX options
    ipx: {
      // Compression quality by format
      modifiers: {
        quality: 80,
        format: "webp",
      },
    },
    // Presets for common use cases
    presets: {
      avatar: {
        modifiers: {
          format: "webp",
          width: 96,
          height: 96,
          fit: "cover",
          quality: 85,
        },
      },
      logo: {
        modifiers: {
          format: "webp",
          width: 200,
          height: 100,
          fit: "contain",
          quality: 90,
        },
      },
      thumbnail: {
        modifiers: {
          format: "webp",
          width: 200,
          height: 150,
          fit: "cover",
          quality: 75,
        },
      },
    },
  },

  nitro: {
    prerender: {
      // prerendering
      ignore: [
        "/language-test",
        "/auth-test",
        "/theme-test",
        "/loading-test",
        "/pagination-test",
      ],
      //
      failOnError: false,
    },
  },
});
