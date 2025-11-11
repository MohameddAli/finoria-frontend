export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error("Vue Error:", error, "Info:", info);
  };

  if (import.meta.client) {
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled Promise:", event.reason);
      event.preventDefault();
    });

    window.addEventListener("error", (event) => {
      console.error("Global Error:", event.error);
      event.preventDefault();
    });
  }
});
