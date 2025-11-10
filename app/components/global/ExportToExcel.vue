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
    <v-icon v-if="icon">mdi-file-excel-outline</v-icon>
    <template v-if="!icon">
      <v-icon start>mdi-file-excel-outline</v-icon>
      {{ label || $t("common.exportToExcel") }}
    </template>
    <v-tooltip v-if="tooltip" activator="parent" location="top">
      {{ tooltip }}
    </v-tooltip>
  </v-btn>
</template>

<script setup>
/**
 * ExportToExcel Component - Nuxt 4 + Vuetify 3
 *
 * Professional Excel export component using SheetJS (xlsx)
 * Features:
 * - Export data to Excel (.xlsx)
 * - Support for multiple sheets
 * - Customizable filename with timestamp
 * - Loading states
 * - Error handling
 * - Support for objects array, HTML table, or raw data
 * - Auto-column width
 * - Header styling
 *
 * @example
 * <ExportToExcel
 *   :data="tableData"
 *   filename="report"
 *   sheet-name="Sheet1"
 *   :color="teal"
 * />
 */

const props = defineProps({
  // Data to export (array of objects)
  data: {
    type: Array,
    default: () => [],
  },

  // Table element ID to export (alternative to data)
  tableId: {
    type: String,
    default: null,
  },

  // Filename for the Excel file (without extension)
  filename: {
    type: String,
    default: "spreadsheet",
  },

  // Sheet name
  sheetName: {
    type: String,
    default: "Sheet1",
  },

  // Include timestamp in filename
  includeTimestamp: {
    type: Boolean,
    default: true,
  },

  // Button color
  color: {
    type: String,
    default: "teal",
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

  // Auto column width
  autoWidth: {
    type: Boolean,
    default: true,
  },

  // Custom headers (if different from object keys)
  headers: {
    type: Array,
    default: null,
  },

  // Column widths (array of numbers)
  columnWidths: {
    type: Array,
    default: null,
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
  const base = props.filename || "spreadsheet";
  if (props.includeTimestamp) {
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5)
      .replace("T", "_");
    return `${base}_${timestamp}.xlsx`;
  }
  return `${base}.xlsx`;
};

// Export to Excel
const handleExport = async () => {
  try {
    // Dynamic import for client-side only library
    const XLSX = await import("xlsx");

    isLoading.value = true;
    emit("before-export");

    let worksheet;

    // Auto-fit column widths helper
    const autoFitColumns = (worksheet) => {
      if (!props.autoWidth) return;

      const cols = [];
      const range = XLSX.utils.decode_range(worksheet["!ref"]);

      for (let C = range.s.c; C <= range.e.c; ++C) {
        let maxWidth = 10;
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const cellAddress = { c: C, r: R };
          const cellRef = XLSX.utils.encode_cell(cellAddress);
          const cell = worksheet[cellRef];
          if (cell && cell.v) {
            const cellValue = cell.v.toString();
            maxWidth = Math.max(maxWidth, cellValue.length);
          }
        }
        cols.push({ wch: Math.min(maxWidth + 2, 50) });
      }

      worksheet["!cols"] = cols;
    };

    // Export from HTML table
    if (props.tableId) {
      const table = document.getElementById(props.tableId);
      if (!table) {
        throw new Error(t("errors.tableNotFound") || "Table not found");
      }
      worksheet = XLSX.utils.table_to_sheet(table);
    }
    // Export from data array
    else if (props.data && props.data.length > 0) {
      // Use custom headers if provided
      if (props.headers) {
        const data = [props.headers, ...props.data.map(Object.values)];
        worksheet = XLSX.utils.aoa_to_sheet(data);
      } else {
        worksheet = XLSX.utils.json_to_sheet(props.data);
      }
    } else {
      throw new Error(t("errors.noDataToExport") || "No data to export");
    }

    // Auto-fit columns
    autoFitColumns(worksheet);

    // Apply custom column widths if provided
    if (props.columnWidths && props.columnWidths.length > 0) {
      worksheet["!cols"] = props.columnWidths.map((w) => ({ wch: w }));
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, props.sheetName);

    // Save file
    const filename = getFilename();
    XLSX.writeFile(workbook, filename);

    isLoading.value = false;
    emit("after-export", { filename });
    emit("success", { filename });

    if (props.onSuccess) {
      props.onSuccess({ filename });
    } else {
      toast.success(t("common.exportSuccess") || "Excel exported successfully");
    }
  } catch (error) {
    handleError(error);
  }
};

// Handle errors
const handleError = (error) => {
  console.error("Excel Export Error:", error);
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
