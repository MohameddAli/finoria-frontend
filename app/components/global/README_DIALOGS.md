# 📚 دليل استخدام AddDialog و UpdateDialog

## 🎯 نظرة عامة

مكونان عامان (Reusable Components) لنوافذ الإضافة والتعديل في المشروع. تم تصميمهما ليكونا مرنين وقابلين لإعادة الاستخدام في جميع الصفحات.

---

## 📦 المكونات المتوفرة

### 1. `AddDialog.vue`

مكون نافذة الإضافة مع أيقونة علامة الزائد (➕) وتصميم احترافي

### 2. `UpdateDialog.vue`

مكون نافذة التعديل مع أيقونة القلم (✏️) وتصميم احترافي

---

## 🚀 كيفية الاستخدام

### ✅ المثال الأول: صفحة العملات (Currency)

```vue
<template>
  <div>
    <!-- زر الإضافة -->
    <v-btn @click="openAddDialog"> إضافة عملة جديدة </v-btn>

    <!-- نافذة الإضافة -->
    <AddDialog
      v-model="addDialogOpen"
      title="إضافة عملة جديدة"
      :loading="isLoading"
      submit-text="حفظ"
      cancel-text="إلغاء"
      @submit="submitAdd"
      @cancel="closeAddDialog"
    >
      <template #form>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.name"
              label="اسم العملة"
              :rules="[(v) => !!v || 'الحقل مطلوب']"
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.code"
              label="رمز العملة"
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.symbol"
              label="الرمز"
              :rules="[(v) => !!v || 'الحقل مطلوب']"
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="form.exchange_rate"
              label="سعر الصرف"
              type="number"
              step="0.0001"
              :rules="[(v) => !!v || 'الحقل مطلوب']"
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <v-col cols="12">
            <v-switch
              v-model="form.is_active"
              label="نشط"
              color="success"
              hide-details
            />
          </v-col>
        </v-row>
      </template>
    </AddDialog>

    <!-- نافذة التعديل -->
    <UpdateDialog
      v-model="updateDialogOpen"
      title="تعديل العملة"
      :loading="isLoading"
      submit-text="حفظ التعديلات"
      cancel-text="إلغاء"
      @submit="submitUpdate"
      @cancel="closeUpdateDialog"
    >
      <template #form>
        <!-- نفس الحقول كما في نافذة الإضافة -->
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.name"
              label="اسم العملة"
              :rules="[(v) => !!v || 'الحقل مطلوب']"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <!-- ... باقي الحقول -->
        </v-row>
      </template>
    </UpdateDialog>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCurrenciesStore } from "~/stores/currencies/storeCurrencies";
import AddDialog from "~/components/global/AddDialog.vue";
import UpdateDialog from "~/components/global/UpdateDialog.vue";

// ═══════════════════════════════════════════════
// Store & State
// ═══════════════════════════════════════════════
const currenciesStore = useCurrenciesStore();
const { isLoading } = storeToRefs(currenciesStore);

// ═══════════════════════════════════════════════
// Dialog States
// ═══════════════════════════════════════════════
const addDialogOpen = ref(false);
const updateDialogOpen = ref(false);
const editingId = ref<string | null>(null);

// ═══════════════════════════════════════════════
// Form Model
// ═══════════════════════════════════════════════
const form = reactive({
  name: "",
  code: "",
  symbol: "",
  exchange_rate: 1,
  is_active: true,
});

// ═══════════════════════════════════════════════
// Add Dialog Methods
// ═══════════════════════════════════════════════
function openAddDialog() {
  resetForm();
  addDialogOpen.value = true;
}

function closeAddDialog() {
  addDialogOpen.value = false;
  resetForm();
}

async function submitAdd() {
  try {
    await currenciesStore.create({
      name: form.name,
      code: form.code || null,
      symbol: form.symbol,
      exchange_rate: form.exchange_rate,
      is_active: form.is_active,
    });
    closeAddDialog();
  } catch (err) {
    console.error("Failed to create currency:", err);
  }
}

// ═══════════════════════════════════════════════
// Update Dialog Methods
// ═══════════════════════════════════════════════
function openUpdateDialog(currency: any) {
  editingId.value = currency.id;
  Object.assign(form, {
    name: currency.name,
    code: currency.code,
    symbol: currency.symbol,
    exchange_rate: Number(currency.exchange_rate),
    is_active: currency.is_active,
  });
  updateDialogOpen.value = true;
}

function closeUpdateDialog() {
  updateDialogOpen.value = false;
  resetForm();
  editingId.value = null;
}

async function submitUpdate() {
  if (!editingId.value) return;

  try {
    await currenciesStore.update(editingId.value, {
      name: form.name,
      code: form.code || null,
      symbol: form.symbol,
      exchange_rate: form.exchange_rate,
      is_active: form.is_active,
    });
    closeUpdateDialog();
  } catch (err) {
    console.error("Failed to update currency:", err);
  }
}

// ═══════════════════════════════════════════════
// Helper Methods
// ═══════════════════════════════════════════════
function resetForm() {
  Object.assign(form, {
    name: "",
    code: "",
    symbol: "",
    exchange_rate: 1,
    is_active: true,
  });
}
</script>
```

---

## 🎨 المثال الثاني: صفحة البنوك (Banks)

```vue
<template>
  <div>
    <!-- نافذة الإضافة/التعديل الموحدة -->
    <AddDialog
      v-if="dialogMode === 'add'"
      v-model="dialogOpen"
      title="إضافة حساب بنكي جديد"
      :loading="isLoading"
      @submit="submitBank"
      @cancel="closeDialog"
    >
      <template #form>
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="form.company_id"
              :items="companiesForSelect"
              item-title="name"
              item-value="id"
              label="الشركة"
              :rules="[(v) => !!v || 'الحقل مطلوب']"
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <v-col cols="12">
            <v-select
              v-model="form.currency_id"
              :items="currenciesForSelect"
              item-title="name"
              item-value="id"
              label="العملة"
              :rules="[(v) => !!v || 'الحقل مطلوب']"
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="form.iban"
              label="IBAN"
              :rules="[(v) => !!v || 'الحقل مطلوب']"
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="form.bic"
              label="BIC"
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <v-col cols="12">
            <v-switch
              v-model="form.is_active"
              label="نشط"
              color="success"
              hide-details
            />
          </v-col>
        </v-row>
      </template>
    </AddDialog>

    <UpdateDialog
      v-else
      v-model="dialogOpen"
      title="تعديل الحساب البنكي"
      :loading="isLoading"
      @submit="submitBank"
      @cancel="closeDialog"
    >
      <template #form>
        <!-- نفس الحقول -->
        <v-row>
          <!-- ... -->
        </v-row>
      </template>
    </UpdateDialog>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCompanyBanksStore } from "~/stores/company-banks/storeCompanyBanks";
import AddDialog from "~/components/global/AddDialog.vue";
import UpdateDialog from "~/components/global/UpdateDialog.vue";

const companyBanksStore = useCompanyBanksStore();
const { isLoading } = storeToRefs(companyBanksStore);

const dialogOpen = ref(false);
const dialogMode = ref<"add" | "edit">("add");
const editingIndex = ref<number | null>(null);

const form = reactive({
  company_id: "",
  currency_id: "",
  iban: "",
  bic: "",
  is_active: true,
});

function openAddDialog() {
  dialogMode.value = "add";
  editingIndex.value = null;
  resetForm();
  dialogOpen.value = true;
}

function openEditDialog(index: number) {
  dialogMode.value = "edit";
  editingIndex.value = index;
  // ... تحميل البيانات
  dialogOpen.value = true;
}

function closeDialog() {
  dialogOpen.value = false;
  resetForm();
}

async function submitBank() {
  try {
    if (dialogMode.value === "add") {
      await companyBanksStore.create(form);
    } else {
      await companyBanksStore.update(editingId.value, form);
    }
    closeDialog();
  } catch (err) {
    console.error("Failed to save bank:", err);
  }
}

function resetForm() {
  Object.assign(form, {
    company_id: "",
    currency_id: "",
    iban: "",
    bic: "",
    is_active: true,
  });
}
</script>
```

---

## 🎯 Props المتاحة

### AddDialog & UpdateDialog Props

| Prop         | Type               | Default                     | Description                      |
| ------------ | ------------------ | --------------------------- | -------------------------------- |
| `modelValue` | `boolean`          | `false`                     | حالة فتح/إغلاق النافذة (v-model) |
| `title`      | `string`           | `"إضافة جديد"` / `"تعديل"`  | عنوان النافذة                    |
| `maxWidth`   | `string \| number` | `700`                       | أقصى عرض للنافذة                 |
| `loading`    | `boolean`          | `false`                     | حالة التحميل                     |
| `submitText` | `string`           | `"حفظ"` / `"حفظ التعديلات"` | نص زر الحفظ                      |
| `cancelText` | `string`           | `"إلغاء"`                   | نص زر الإلغاء                    |

---

## 📤 Events المتاحة

| Event               | Payload   | Description                         |
| ------------------- | --------- | ----------------------------------- |
| `update:modelValue` | `boolean` | يتم إطلاقه عند تغيير حالة النافذة   |
| `submit`            | -         | يتم إطلاقه عند الضغط على زر الحفظ   |
| `cancel`            | -         | يتم إطلاقه عند الضغط على زر الإلغاء |

---

## 🎨 Slots المتاحة

### `#form`

Slot لمحتوى النموذج (الحقول).

**Props المتاحة داخل الـ Slot:**

- `form`: مرجع للنموذج (form ref)
- `loading`: حالة التحميل

---

## 💡 نصائح وأفضل الممارسات

### 1. استخدام نموذج منفصل لكل نافذة

```typescript
// ✅ جيد - نموذج منفصل
const addForm = reactive({ name: "", code: "" });
const updateForm = reactive({ name: "", code: "" });

// ❌ سيء - نموذج مشترك قد يسبب مشاكل
const form = reactive({ name: "", code: "" });
```

### 2. إعادة تعيين النموذج عند الإغلاق

```typescript
function closeDialog() {
  dialogOpen.value = false;
  resetForm(); // ✅ مهم جداً
}
```

### 3. معالجة الأخطاء بشكل صحيح

```typescript
async function submitAdd() {
  try {
    await store.create(form);
    closeDialog();
    // ✅ عرض رسالة نجاح
    useToast().success("تم الإضافة بنجاح");
  } catch (err) {
    // ✅ عرض رسالة خطأ
    console.error("Failed:", err);
    useToast().error("فشلت العملية");
  }
}
```

### 4. التحقق من الصحة (Validation)

```vue
<v-text-field
  v-model="form.name"
  label="الاسم"
  :rules="[
    (v) => !!v || 'الحقل مطلوب',
    (v) => v.length >= 3 || 'يجب أن يكون 3 أحرف على الأقل',
  ]"
  variant="outlined"
/>
```

---

## 🔄 خطوات تحويل صفحة موجودة

### قبل:

```vue
<!-- الطريقة القديمة -->
<v-dialog v-model="dialogOpen" max-width="700px" persistent>
  <v-card>
    <v-card-title>
      {{ dialogMode === "add" ? "إضافة" : "تعديل" }}
    </v-card-title>
    <v-card-text>
      <v-form ref="formRef">
        <!-- الحقول -->
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="closeDialog">إلغاء</v-btn>
      <v-btn @click="submitForm">حفظ</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
```

### بعد:

```vue
<!-- الطريقة الجديدة -->
<AddDialog
  v-if="dialogMode === 'add'"
  v-model="dialogOpen"
  title="إضافة جديد"
  :loading="isLoading"
  @submit="submitAdd"
  @cancel="closeDialog"
>
  <template #form>
    <!-- الحقول -->
  </template>
</AddDialog>

<UpdateDialog
  v-else
  v-model="dialogOpen"
  title="تعديل"
  :loading="isLoading"
  @submit="submitUpdate"
  @cancel="closeDialog"
>
  <template #form>
    <!-- الحقول -->
  </template>
</UpdateDialog>
```

---

## 📱 التوافق مع الشاشات الصغيرة

المكونات مصممة لتكون متجاوبة تلقائياً:

- تعديل حجم الأيقونة والنص على الشاشات الصغيرة
- تخطيط مرن للحقول
- أزرار متجاوبة

---

## 🎭 التخصيص

### تغيير الألوان:

```vue
<!-- في app/theme.ts -->
export const themeConfig = { themes: { light: { colors: { primary: '#1976D2', //
سيؤثر على لون النوافذ } } } }
```

### تغيير الحد الأقصى للعرض:

```vue
<AddDialog
  v-model="dialogOpen"
  max-width="900" <!-- عرض أكبر -->
  title="..."
  @submit="..."
>
```

---

## ✅ Checklist للصفحات الجديدة

- [ ] استيراد المكونات: `import AddDialog from "~/components/global/AddDialog.vue"`
- [ ] استيراد المكونات: `import UpdateDialog from "~/components/global/UpdateDialog.vue"`
- [ ] إنشاء refs للنوافذ: `const addDialogOpen = ref(false)`
- [ ] إنشاء نموذج البيانات: `const form = reactive({ ... })`
- [ ] إنشاء دوال الفتح: `openAddDialog()`, `openUpdateDialog()`
- [ ] إنشاء دوال الإغلاق: `closeDialog()`
- [ ] إنشاء دوال الحفظ: `submitAdd()`, `submitUpdate()`
- [ ] إنشاء دالة إعادة التعيين: `resetForm()`
- [ ] إضافة التحقق من الصحة للحقول
- [ ] معالجة الأخطاء بشكل صحيح
- [ ] اختبار النوافذ على شاشات مختلفة

---

## 🆘 الأسئلة الشائعة

### س: كيف أضيف حقول مخصصة؟

ج: استخدم الـ slot المتاح `#form` وأضف أي حقول Vuetify تريدها.

### س: كيف أغير عرض النافذة؟

ج: استخدم prop `max-width` وأعطه القيمة المطلوبة (بالبكسل أو string).

### س: هل يمكن استخدام نافذة واحدة للإضافة والتعديل؟

ج: نعم، استخدم `v-if` / `v-else` مع `dialogMode`.

### س: كيف أتحكم في حالة التحميل؟

ج: مرر prop `:loading="isLoading"` من الـ store.

---

## 📞 الدعم

في حال واجهت أي مشكلة، تحقق من:

1. استيراد المكونات بشكل صحيح
2. استخدام `v-model` بشكل صحيح
3. معالجة الأحداث `@submit` و `@cancel`
4. إضافة الحقول داخل `<template #form>`

---

**تم إنشاء هذا الدليل بواسطة GitHub Copilot** 🤖
