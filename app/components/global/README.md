# Global Components - Nuxt 4 + Vuetify 3

Professional reusable components for the entire application.

## 📦 Components

### 1. ExportToPdf

Professional PDF export component using **jsPDF** and **html2canvas**.

### 2. ExportToExcel

Professional Excel export component using **SheetJS (xlsx)**.

### 3. AddDialog ✨ NEW

Professional reusable dialog component for adding new records.

### 4. UpdateDialog ✨ NEW

Professional reusable dialog component for editing/updating records.

### 5. AppDetailsDialog

Professional dialog component for displaying record details.

### 6. AppConfirmDialog

Professional confirmation dialog component.

### 7. ToastHost

Toast notification system.

### 8. PrintButton & PrintDialog

Professional printing components.

---

## � الوثائق المتاحة

| الملف                     | الوصف                 | المستوى  |
| ------------------------- | --------------------- | -------- |
| **README.md**             | هذا الملف - نظرة عامة | 📘 عام   |
| **README_DIALOGS.md**     | دليل شامل للنوافذ     | 📕 متقدم |
| **QUICK_START.md**        | دليل البداية السريعة  | 🟢 مبتدئ |
| **EXAMPLE_CONVERSION.md** | مثال عملي للتحويل     | 🟡 متوسط |
| **TEMPLATE_PAGE.vue**     | نموذج جاهز للنسخ      | 🟢 مبتدئ |

### 🎯 أين تبدأ؟

- **مبتدئ؟** ابدأ بـ `QUICK_START.md` (5 دقائق)
- **تريد مثال؟** اقرأ `EXAMPLE_CONVERSION.md` (10 دقائق)
- **تريد التفاصيل؟** اقرأ `README_DIALOGS.md` (20 دقيقة)
- **تريد كود جاهز؟** انسخ `TEMPLATE_PAGE.vue`

---

## �🚀 Installation

Components are already in the `global` folder and will be auto-imported by Nuxt.

### Required Dependencies

```bash
pnpm add jspdf html2canvas xlsx
```

Already installed:

- ✅ jsPDF v3.0.1
- ✅ xlsx v0.18.5
- ✅ html2canvas v1.4.1

---

## 📘 ExportToPdf Component

### Features

- Export any HTML element to PDF
- Multiple pages support for long content
- Customizable filename with auto-timestamp
- A4 / custom page formats
- Portrait / Landscape orientation
- High quality output
- Loading states
- Error handling
- Success notifications

### Basic Usage

```vue
<template>
  <!-- Export by element ID -->
  <ExportToPdf element-id="content-to-export" filename="report" />

  <!-- Content to export -->
  <div id="content-to-export">
    <h1>My Report</h1>
    <p>This will be exported to PDF</p>
  </div>
</template>
```

### Advanced Usage

```vue
<template>
  <ExportToPdf
    element-id="my-content"
    filename="custom-report"
    :include-timestamp="true"
    orientation="landscape"
    format="a4"
    :quality="0.95"
    :scale="2"
    color="error"
    variant="elevated"
    size="large"
    label="Download PDF"
    tooltip="Export this page to PDF"
    @before-export="handleBeforeExport"
    @success="handleSuccess"
    @error="handleError"
  />
</template>

<script setup>
const handleBeforeExport = () => {
  console.log("Starting export...");
};

const handleSuccess = ({ filename }) => {
  console.log(`Exported: ${filename}`);
};

const handleError = (error) => {
  console.error("Export failed:", error);
};
</script>
```

### Props

| Prop               | Type        | Default      | Description                          |
| ------------------ | ----------- | ------------ | ------------------------------------ |
| `elementId`        | String      | `null`       | ID of element to export (without #)  |
| `element`          | HTMLElement | `null`       | Direct element reference             |
| `filename`         | String      | `'document'` | Filename without extension           |
| `includeTimestamp` | Boolean     | `true`       | Add timestamp to filename            |
| `color`            | String      | `'error'`    | Button color                         |
| `variant`          | String      | `'elevated'` | Button variant                       |
| `size`             | String      | `'default'`  | Button size                          |
| `icon`             | Boolean     | `false`      | Icon-only button                     |
| `label`            | String      | `null`       | Button label                         |
| `tooltip`          | String      | `null`       | Tooltip text                         |
| `disabled`         | Boolean     | `false`      | Disable button                       |
| `orientation`      | String      | `'portrait'` | PDF orientation (portrait/landscape) |
| `format`           | String      | `'a4'`       | PDF format                           |
| `quality`          | Number      | `0.95`       | Image quality (0-1)                  |
| `scale`            | Number      | `2`          | Scale for html2canvas                |
| `useCORS`          | Boolean     | `true`       | Use CORS for images                  |
| `onError`          | Function    | `null`       | Custom error handler                 |
| `onSuccess`        | Function    | `null`       | Custom success handler               |

### Events

| Event           | Payload        | Description                  |
| --------------- | -------------- | ---------------------------- |
| `before-export` | -              | Fired before export starts   |
| `after-export`  | `{ filename }` | Fired after export completes |
| `success`       | `{ filename }` | Fired on successful export   |
| `error`         | `error`        | Fired on export error        |

### Exposed Methods

```vue
<template>
  <ExportToPdf ref="pdfExporter" element-id="content" />
  <v-btn @click="exportManually">Export</v-btn>
</template>

<script setup>
const pdfExporter = ref(null);

const exportManually = () => {
  pdfExporter.value?.export();
};
</script>
```

---

## 📗 ExportToExcel Component

### Features

- Export data arrays to Excel
- Export HTML tables to Excel
- Multiple sheets support
- Auto column width
- Custom headers
- Customizable filename with auto-timestamp
- Loading states
- Error handling
- Success notifications

### Basic Usage

```vue
<template>
  <!-- Export from data array -->
  <ExportToExcel :data="tableData" filename="users" sheet-name="Users List" />
</template>

<script setup>
const tableData = ref([
  { name: "John", age: 30, city: "New York" },
  { name: "Jane", age: 25, city: "London" },
]);
</script>
```

### Export HTML Table

```vue
<template>
  <ExportToExcel table-id="my-table" filename="table-export" />

  <table id="my-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John</td>
        <td>30</td>
      </tr>
    </tbody>
  </table>
</template>
```

### Advanced Usage

```vue
<template>
  <ExportToExcel
    :data="users"
    filename="user-report"
    sheet-name="Active Users"
    :include-timestamp="true"
    :auto-width="true"
    :headers="['Name', 'Age', 'City', 'Status']"
    :column-widths="[20, 10, 15, 15]"
    color="teal"
    variant="elevated"
    size="large"
    label="Download Excel"
    tooltip="Export data to Excel"
    @before-export="handleBeforeExport"
    @success="handleSuccess"
    @error="handleError"
  />
</template>

<script setup>
const users = ref([
  { name: "John Doe", age: 30, city: "NY", status: "Active" },
  { name: "Jane Smith", age: 25, city: "LA", status: "Active" },
]);

const handleBeforeExport = () => {
  console.log("Starting export...");
};

const handleSuccess = ({ filename }) => {
  console.log(`Exported: ${filename}`);
};

const handleError = (error) => {
  console.error("Export failed:", error);
};
</script>
```

### Props

| Prop               | Type     | Default         | Description                |
| ------------------ | -------- | --------------- | -------------------------- |
| `data`             | Array    | `[]`            | Data array to export       |
| `tableId`          | String   | `null`          | HTML table ID to export    |
| `filename`         | String   | `'spreadsheet'` | Filename without extension |
| `sheetName`        | String   | `'Sheet1'`      | Sheet name in Excel        |
| `includeTimestamp` | Boolean  | `true`          | Add timestamp to filename  |
| `color`            | String   | `'teal'`        | Button color               |
| `variant`          | String   | `'elevated'`    | Button variant             |
| `size`             | String   | `'default'`     | Button size                |
| `icon`             | Boolean  | `false`         | Icon-only button           |
| `label`            | String   | `null`          | Button label               |
| `tooltip`          | String   | `null`          | Tooltip text               |
| `disabled`         | Boolean  | `false`         | Disable button             |
| `autoWidth`        | Boolean  | `true`          | Auto-fit column widths     |
| `headers`          | Array    | `null`          | Custom headers             |
| `columnWidths`     | Array    | `null`          | Custom column widths       |
| `onError`          | Function | `null`          | Custom error handler       |
| `onSuccess`        | Function | `null`          | Custom success handler     |

### Events

| Event           | Payload        | Description                  |
| --------------- | -------------- | ---------------------------- |
| `before-export` | -              | Fired before export starts   |
| `after-export`  | `{ filename }` | Fired after export completes |
| `success`       | `{ filename }` | Fired on successful export   |
| `error`         | `error`        | Fired on export error        |

### Exposed Methods

```vue
<template>
  <ExportToExcel ref="excelExporter" :data="tableData" />
  <v-btn @click="exportManually">Export</v-btn>
</template>

<script setup>
const excelExporter = ref(null);

const exportManually = () => {
  excelExporter.value?.export();
};
</script>
```

---

## 🎨 Styling Examples

### Icon Buttons

```vue
<ExportToPdf
  element-id="content"
  :icon="true"
  color="error"
  tooltip="Export to PDF"
/>

<ExportToExcel
  :data="tableData"
  :icon="true"
  color="teal"
  tooltip="Export to Excel"
/>
```

### Custom Styled Buttons

```vue
<ExportToPdf
  element-id="content"
  color="primary"
  variant="flat"
  size="x-large"
  label="📄 Save as PDF"
/>

<ExportToExcel
  :data="tableData"
  color="success"
  variant="outlined"
  size="small"
  label="📊 Download Excel"
/>
```

---

## 🌍 i18n Support

Add these translations to your i18n files:

### English (`en.json`)

```json
{
  "common": {
    "exportToPdf": "Export to PDF",
    "exportToExcel": "Export to Excel",
    "exportSuccess": "Export completed successfully"
  },
  "errors": {
    "elementNotFound": "Element to export not found",
    "tableNotFound": "Table to export not found",
    "noDataToExport": "No data to export",
    "exportFailed": "Export failed"
  }
}
```

### Arabic (`ar.json`)

```json
{
  "common": {
    "exportToPdf": "تصدير إلى PDF",
    "exportToExcel": "تصدير إلى Excel",
    "exportSuccess": "تم التصدير بنجاح"
  },
  "errors": {
    "elementNotFound": "العنصر المطلوب تصديره غير موجود",
    "tableNotFound": "الجدول المطلوب تصديره غير موجود",
    "noDataToExport": "لا توجد بيانات للتصدير",
    "exportFailed": "فشل التصدير"
  }
}
```

---

## 💡 Best Practices

### 1. PDF Export

- Keep content width reasonable for A4 size
- Use white background for better results
- Avoid complex CSS animations
- Test with both portrait and landscape orientations

### 2. Excel Export

- Keep data structure consistent
- Use meaningful headers
- Avoid special characters in sheet names
- Consider column widths for readability

### 3. Performance

- Show loading state for large exports
- Use error handling for better UX
- Add success notifications
- Consider pagination for very large datasets

---

## 🔧 Troubleshooting

### PDF Not Exporting

- Check if element ID exists
- Ensure content is visible (not hidden)
- Check for CORS issues with images
- Verify element has content

### Excel Not Exporting

- Ensure data is valid array of objects
- Check table ID if using table export
- Verify data is not empty
- Check console for errors

### Images Not Showing in PDF

- Set `useCORS: true` prop
- Ensure images are loaded
- Check image URLs
- Consider using base64 images

---

## 📊 Examples

### Complete Example with Both Exports

```vue
<template>
  <v-container>
    <v-card>
      <v-card-title>User Report</v-card-title>
      <v-card-text id="report-content">
        <v-table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.status }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-actions>
        <ExportToPdf
          element-id="report-content"
          filename="user-report"
          color="error"
          label="PDF"
        />
        <ExportToExcel
          :data="users"
          filename="user-report"
          sheet-name="Users"
          color="teal"
          label="Excel"
        />
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
const users = ref([
  { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active" },
]);
</script>
```

---

## 🔗 Related Libraries

- **jsPDF**: https://github.com/parallax/jsPDF
- **html2canvas**: https://html2canvas.hertzen.com
- **SheetJS (xlsx)**: https://sheetjs.com

---

## 📝 License

These components are part of your Nuxt 4 project and follow your project's license.

---

## 🚀 Version

- **Nuxt**: 4.x
- **Vuetify**: 3.x
- **Vue**: 3.x
- **jsPDF**: 3.0.1
- **html2canvas**: 1.4.1
- **xlsx**: 0.18.5

---

**Created with ❤️ using the best libraries and practices for Nuxt 4 + Vuetify 3**
