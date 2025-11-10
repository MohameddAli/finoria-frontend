<template>
  <v-btn
    :color="color"
    :variant="variant"
    :size="size"
    :icon="icon"
    :loading="isLoading"
    :disabled="disabled || isLoading"
    @click="handleExport"
  >
    <v-icon v-if="icon">mdi-file-pdf-outline</v-icon>
    <template v-if="!icon">
      <v-icon start>mdi-file-pdf-outline</v-icon>
      {{ label || $t("common.exportToPdf") }}
    </template>
    <v-tooltip v-if="tooltip" activator="parent" location="top">
      {{ tooltip }}
    </v-tooltip>
  </v-btn>
</template>

<script setup>
/**
 * ExportToPdf Component - Nuxt 4 + Vuetify 3
 *
 * Professional PDF export component using jsPDF and html2canvas
 * Features:
 * - Export HTML elements to PDF
 * - Customizable filename with timestamp
 * - Loading states
 * - Error handling
 * - Support for both element selector and direct content
 * - A4 page format support
 * - High quality output
 *
 * @example
 * <ExportToPdf
 *   element-id="content-to-export"
 *   filename="report"
 *   :color="error"
 * />
 */

const props = defineProps({
  // Element ID to export (without #)
  elementId: {
    type: String,
    default: null,
  },

  // Direct element reference
  element: {
    type: [Object, HTMLElement],
    default: null,
  },

  // Filename for the PDF (without extension)
  filename: {
    type: String,
    default: "document",
  },

  // Include timestamp in filename
  includeTimestamp: {
    type: Boolean,
    default: true,
  },

  // Button color
  color: {
    type: String,
    default: "error",
  },

  // Button variant
  variant: {
    type: String,
    default: "elevated",
  },

  // Button size
  size: {
    type: String,
    default: "default",
  },

  // Icon only button
  icon: {
    type: Boolean,
    default: false,
  },

  // Button label (if not icon mode)
  label: {
    type: String,
    default: null,
  },

  // Tooltip text
  tooltip: {
    type: String,
    default: null,
  },

  // Disabled state
  disabled: {
    type: Boolean,
    default: false,
  },

  // PDF orientation
  orientation: {
    type: String,
    default: "portrait", // portrait or landscape
    validator: (value) => ["portrait", "landscape"].includes(value),
  },

  // PDF format
  format: {
    type: String,
    default: "a4",
  },

  // Image quality (0-1)
  quality: {
    type: Number,
    default: 0.95,
    validator: (value) => value >= 0 && value <= 1,
  },

  // Scale for html2canvas
  scale: {
    type: Number,
    default: 2,
  },

  // Use CORS for images
  useCORS: {
    type: Boolean,
    default: true,
  },

  // Custom error handler
  onError: {
    type: Function,
    default: null,
  },

  // Custom success handler
  onSuccess: {
    type: Function,
    default: null,
  },
});

const emit = defineEmits(["before-export", "after-export", "error", "success"]);

const { t } = useI18n();
const toast = useToast();

// Loading state
const isLoading = ref(false);

// Format filename with timestamp
const getFilename = () => {
  const base = props.filename || "document";
  if (props.includeTimestamp) {
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5)
      .replace("T", "_");
    return `${base}_${timestamp}.pdf`;
  }
  return `${base}.pdf`;
};

// Get element to export
const getElement = () => {
  if (props.element) {
    return props.element;
  }
  if (props.elementId) {
    return document.getElementById(props.elementId);
  }
  return null;
};

// Export to PDF
const handleExport = async () => {
  try {
    // Dynamic imports for client-side only libraries
    const [{ jsPDF }, html2canvas] = await Promise.all([
      import("jspdf"),
      import("html2canvas").then((m) => m.default),
    ]);

    const element = getElement();

    if (!element) {
      const error = new Error(
        t("errors.elementNotFound") || "Element to export not found"
      );
      handleError(error);
      return;
    }

    isLoading.value = true;
    emit("before-export");

    // Convert HTML to canvas
    const canvas = await html2canvas(element, {
      scale: props.scale,
      useCORS: props.useCORS,
      logging: false,
      backgroundColor: "#ffffff",
      imageTimeout: 15000,
      removeContainer: true,
    });

    // Get canvas dimensions
    const imgWidth = props.format === "a4" ? 210 : 297; // A4 width in mm
    const pageHeight = props.format === "a4" ? 297 : 210; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF
    const pdf = new jsPDF({
      orientation: props.orientation,
      unit: "mm",
      format: props.format,
    });

    let position = 0;

    // Add image to PDF
    const imgData = canvas.toDataURL("image/jpeg", props.quality);
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add new pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save PDF
    const filename = getFilename();
    pdf.save(filename);

    isLoading.value = false;
    emit("after-export", { filename });
    emit("success", { filename });

    if (props.onSuccess) {
      props.onSuccess({ filename });
    } else {
      toast.success(t("common.exportSuccess") || "PDF exported successfully");
    }
  } catch (error) {
    handleError(error);
  }
};

// Handle errors
const handleError = (error) => {
  console.error("PDF Export Error:", error);
  isLoading.value = false;
  emit("error", error);

  if (props.onError) {
    props.onError(error);
  } else {
    toast.error(error.message || t("errors.exportFailed") || "Export failed");
  }
};

// Expose methods
defineExpose({
  export: handleExport,
});
</script>

<style scoped>
/* No specific styles needed - using Vuetify components */
</style>
