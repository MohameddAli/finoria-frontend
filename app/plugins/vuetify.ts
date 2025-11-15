import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify, type ThemeDefinition } from "vuetify";
import { en, ar as arLocale } from "vuetify/locale";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { VStepperVertical } from "vuetify/labs/VStepperVertical";
import { themes } from "../theme/themes";

const ALLOWED_THEMES = ["gold", "blue", "red"] as const;
const ALLOWED_MODES = ["light", "dark"] as const;

export default defineNuxtPlugin((nuxtApp) => {
  const getInitialTheme = () => {
    if (import.meta.client) {
      const rawTheme = localStorage.getItem("theme") || "gold";
      const rawMode = localStorage.getItem("theme-mode") || "light";
      const theme = ALLOWED_THEMES.includes(rawTheme as any) ? rawTheme : "gold";
      const mode = ALLOWED_MODES.includes(rawMode as any) ? rawMode : "light";
      return `${theme}-${mode}`;
    }
    return "gold-light";
  };

  const allThemes: Record<string, ThemeDefinition> = {};
  Object.keys(themes).forEach((themeName) => {
    const theme = themes[themeName as keyof typeof themes];
    allThemes[`${themeName}-light`] = theme.light;
    allThemes[`${themeName}-dark`] = theme.dark;
  });

  const vuetify = createVuetify({
    components: {
      VStepperVertical,
    },
    locale: { locale: "ar", fallback: "en", messages: { en, ar: arLocale }, rtl: { ar: true } },
    theme: { defaultTheme: getInitialTheme(), themes: allThemes },
    icons: { defaultSet: "mdi", aliases, sets: { mdi } },
    display: { mobileBreakpoint: "sm", thresholds: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 } },
  });

  const setSafeThemeName = (name: string) => {
    const [theme, mode] = name.split("-");
    const safeTheme = ALLOWED_THEMES.includes(theme as any) ? theme : "gold";
    const safeMode = ALLOWED_MODES.includes(mode as any) ? mode : "light";
    const finalName = `${safeTheme}-${safeMode}`;
    vuetify.theme.global.name.value = finalName;
    return finalName;
  };

  if (import.meta.client) {
    window.addEventListener("theme-mode-change", ((event: CustomEvent) => {
      const currentTheme = localStorage.getItem("theme") || "gold";
      setSafeThemeName(`${currentTheme}-${event.detail}`);
    }) as EventListener);

    window.addEventListener("theme-change", ((event: CustomEvent) => {
      const currentMode = localStorage.getItem("theme-mode") || "light";
      setSafeThemeName(`${event.detail}-${currentMode}`);
    }) as EventListener);
  }

  nuxtApp.vueApp.use(vuetify);
  return { provide: { vuetify } };
});