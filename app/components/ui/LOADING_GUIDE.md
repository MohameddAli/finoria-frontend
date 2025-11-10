# 🔄 دليل نظام التحميل (Loading System)

## نظرة عامة

نظام التحميل في المشروع يدعم **3 أنواع** من مؤشرات التحميل:

1. **overlay** - غطاء كامل مع spinner (افتراضي للصفحات العامة)
2. **progressbar** - شريط تقدم في أعلى الصفحة (افتراضي للداشبورد)
3. **none** - بدون مؤشر تحميل

---

## 📁 الملفات الرئيسية

```
app/
├── components/ui/
│   ├── LoadingOverlay.vue       # مكون Overlay
│   ├── LoadingProgressBar.vue   # مكون Progress Bar
│   └── LOADING_GUIDE.md         # هذا الملف
├── stores/
│   └── loading.ts               # متجر إدارة التحميل
├── composables/
│   └── useLoading.ts            # Composable للتحميل
├── app.vue                      # التحميل للصفحات العامة
└── layouts/
    └── dashboard.vue            # التحميل للداشبورد
```

---

## 🎯 كيفية تغيير نوع Loading

### 1️⃣ تغيير نوع Loading للداشبورد

#### الطريقة الأولى: من `app.vue`

```vue
<script setup>
import { useLoadingStore } from "~/stores/loading";

const loadingStore = useLoadingStore();

// تغيير نوع Loading للداشبورد
onMounted(() => {
  // اختر واحد من الثلاثة:
  loadingStore.setDashboardLoadingType("overlay"); // غطاء كامل
  loadingStore.setDashboardLoadingType("progressbar"); // شريط تقدم (افتراضي)
  loadingStore.setDashboardLoadingType("none"); // بدون loading
});
</script>
```

#### الطريقة الثانية: من `dashboard.vue` layout

```vue
<script setup>
import { useLoadingStore } from "~/stores/loading";

const loadingStore = useLoadingStore();

onMounted(() => {
  // تغيير النوع للداشبورد فقط
  loadingStore.setDashboardLoadingType("progressbar");
});
</script>
```

---

### 2️⃣ تغيير نوع Loading للصفحات العامة (خارج الداشبورد)

```vue
<!-- في app.vue أو أي composable -->
<script setup>
import { useLoadingStore } from "~/stores/loading";

const loadingStore = useLoadingStore();

onMounted(() => {
  // تغيير نوع Loading للصفحات العامة
  loadingStore.setLoadingType("overlay"); // غطاء كامل (افتراضي)
  loadingStore.setLoadingType("progressbar"); // شريط تقدم
  loadingStore.setLoadingType("none"); // بدون loading
});
</script>
```

---

## 🔧 الإعدادات الافتراضية

```typescript
// في stores/loading.ts
state: (): LoadingState => ({
  loadingType: "overlay", // للصفحات العامة
  dashboardLoadingType: "progressbar", // للداشبورد
});
```

---

## 📝 أمثلة الاستخدام

### مثال 1: استخدام Progress Bar للداشبورد و Overlay للصفحات العامة

```vue
<!-- app.vue -->
<script setup>
const loadingStore = useLoadingStore();

onMounted(() => {
  loadingStore.setLoadingType("overlay"); // صفحات عامة
  loadingStore.setDashboardLoadingType("progressbar"); // داشبورد
});
</script>
```

### مثال 2: إيقاف Loading في الداشبورد فقط

```vue
<!-- dashboard.vue -->
<script setup>
const loadingStore = useLoadingStore();

onMounted(() => {
  loadingStore.setDashboardLoadingType("none"); // إيقاف loading للداشبورد
});
</script>
```

### مثال 3: استخدام Overlay للكل

```vue
<!-- app.vue -->
<script setup>
const loadingStore = useLoadingStore();

onMounted(() => {
  loadingStore.setLoadingType("overlay");
  loadingStore.setDashboardLoadingType("overlay");
});
</script>
```

### مثال 4: استخدام Progress Bar للكل

```vue
<!-- app.vue -->
<script setup>
const loadingStore = useLoadingStore();

onMounted(() => {
  loadingStore.setLoadingType("progressbar");
  loadingStore.setDashboardLoadingType("progressbar");
});
</script>
```

---

## 🎨 تخصيص الألوان

### تغيير لون المؤشر

```typescript
const { setSpinnerColor } = useLoading();

// استخدام ألوان Vuetify theme
setSpinnerColor("primary"); // أزرق (افتراضي)
setSpinnerColor("secondary"); // رمادي
setSpinnerColor("success"); // أخضر
setSpinnerColor("error"); // أحمر
setSpinnerColor("warning"); // برتقالي
```

---

## 🔄 استخدام Loading في الكود

### بدء وإيقاف Loading يدوياً

```typescript
const { startLoading, stopLoading } = useLoading();

// بدء loading
const loadingControl = startLoading({
  text: "جاري تحميل البيانات...",
  type: "api",
});

// إيقاف loading
loadingControl.stop();

// أو باستخدام ID
stopLoading(loadingControl.id);
```

### استخدام withLoading للعمليات Async

```typescript
const { withLoading } = useLoading();

const fetchData = async () => {
  await withLoading(
    async () => {
      const data = await $fetch("/api/data");
      return data;
    },
    { text: "جاري التحميل...", type: "api" }
  );
};
```

---

## 📊 الفرق بين الأنواع

| النوع           | الوصف                | متى تستخدمه                     | RTL Support |
| --------------- | -------------------- | ------------------------------- | ----------- |
| **overlay**     | غطاء كامل مع spinner | صفحات تسجيل الدخول، عمليات حرجة | ✅          |
| **progressbar** | شريط تقدم في الأعلى  | الداشبورد، التنقل بين الصفحات   | ✅          |
| **none**        | بدون مؤشر            | عندما لا تريد إظهار loading     | N/A         |

---

## 🌍 دعم RTL

جميع مكونات Loading تدعم RTL تلقائياً:

- Overlay: spinner يتحرك بشكل صحيح
- Progress Bar: الأنيميشن يعمل من اليمين لليسار في وضع RTL

---

## ⚙️ الإعدادات المتقدمة

### تخصيص Progress Bar

```vue
<!-- في dashboard.vue -->
<LoadingProgressBar
  :show-text="true"      <!-- عرض النص -->
  :auto-progress="true"  <!-- تقدم تلقائي -->
/>
```

### تخصيص Overlay

الـ Overlay يستخدم إعدادات افتراضية من loading store ولا يحتاج props.

---

## 🐛 استكشاف الأخطاء

### المشكلة: Loading لا يظهر في الداشبورد

**الحل:** تأكد من أن `dashboardLoadingType` ليس `'none'`

```typescript
loadingStore.setDashboardLoadingType("progressbar");
```

### المشكلة: Loading يظهر في كل مكان

**الحل:** تأكد من الفصل بين `loadingType` و `dashboardLoadingType`

### المشكلة: Progress Bar عالق على 90%

**الحل:** هذا سلوك طبيعي - ينتظر انتهاء العملية فعلياً ثم يصل لـ 100%

---

## 📚 API Reference

### Loading Store

```typescript
interface LoadingStore {
  // State
  loadingType: LoadingDisplayType;
  dashboardLoadingType: LoadingDisplayType;
  operations: LoadingOperation[];

  // Actions
  setLoadingType(type: LoadingDisplayType): void;
  setDashboardLoadingType(type: LoadingDisplayType): void;
  startLoading(options?: LoadingOptions): string;
  stopLoading(id?: string): void;
  withLoading<T>(
    operation: () => Promise<T>,
    options?: LoadingOptions
  ): Promise<T>;
}
```

### Types

```typescript
type LoadingDisplayType = "overlay" | "progressbar" | "none";

interface LoadingOptions {
  text?: string;
  type?: "navigation" | "api" | "manual";
  id?: string;
}
```

---

## 💡 نصائح

1. **استخدم `progressbar` للداشبورد** - أقل إزعاجاً للمستخدم
2. **استخدم `overlay` للعمليات الحرجة** - مثل تسجيل الدخول
3. **استخدم `none` بحذر** - قد يحتار المستخدم
4. **غيّر اللون حسب الحالة** - أحمر للأخطاء، أخضر للنجاح

---

## 🔗 ملفات ذات صلة

- `app/stores/loading.ts` - متجر Loading
- `app/composables/useLoading.ts` - Composable
- `app/components/ui/LoadingOverlay.vue` - مكون Overlay
- `app/components/ui/LoadingProgressBar.vue` - مكون Progress Bar
- `app/app.vue` - Loading للصفحات العامة
- `app/layouts/dashboard.vue` - Loading للداشبورد

---

تم إنشاء هذا الدليل بواسطة: GitHub Copilot 🤖
آخر تحديث: نوفمبر 2025
