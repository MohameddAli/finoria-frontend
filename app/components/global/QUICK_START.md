# 🚀 دليل سريع: AddDialog & UpdateDialog

## ⚡ البداية السريعة (5 دقائق)

### 1️⃣ استيراد المكونات

```typescript
import AddDialog from "~/components/global/AddDialog.vue";
import UpdateDialog from "~/components/global/UpdateDialog.vue";
```

### 2️⃣ إنشاء الحالة (State)

```typescript
// نوافذ منفصلة
const addDialogOpen = ref(false);
const updateDialogOpen = ref(false);

// النموذج
const form = reactive({
  name: "",
  email: "",
  // ... حقولك هنا
});

// معرف السجل للتعديل
const editingId = ref<string | null>(null);
```

### 3️⃣ استخدام المكونات

```vue
<template>
  <!-- زر الإضافة -->
  <v-btn @click="addDialogOpen = true">إضافة</v-btn>

  <!-- نافذة الإضافة -->
  <AddDialog v-model="addDialogOpen" title="إضافة سجل جديد" @submit="submitAdd">
    <template #form>
      <v-text-field v-model="form.name" label="الاسم" />
      <v-text-field v-model="form.email" label="البريد" />
    </template>
  </AddDialog>

  <!-- نافذة التعديل -->
  <UpdateDialog
    v-model="updateDialogOpen"
    title="تعديل السجل"
    @submit="submitUpdate"
  >
    <template #form>
      <v-text-field v-model="form.name" label="الاسم" />
      <v-text-field v-model="form.email" label="البريد" />
    </template>
  </UpdateDialog>
</template>
```

### 4️⃣ الدوال (Functions)

```typescript
// إضافة
async function submitAdd() {
  await store.create(form);
  addDialogOpen.value = false;
}

// تعديل
function openEdit(item: any) {
  editingId.value = item.id;
  Object.assign(form, item);
  updateDialogOpen.value = true;
}

async function submitUpdate() {
  await store.update(editingId.value, form);
  updateDialogOpen.value = false;
}
```

---

## 📋 Props الأساسية

```vue
<AddDialog
  v-model="dialogOpen"           <!-- ✅ مطلوب -->
  title="إضافة جديد"             <!-- النص -->
  :loading="isLoading"            <!-- حالة التحميل -->
  submit-text="حفظ"              <!-- نص زر الحفظ -->
  cancel-text="إلغاء"             <!-- نص زر الإلغاء -->
  :max-width="700"               <!-- العرض الأقصى -->
  @submit="handleSubmit"         <!-- ✅ مطلوب -->
  @cancel="handleCancel"         <!-- اختياري -->
/>
```

---

## 🎯 أمثلة سريعة

### مثال 1: نموذج بسيط

```vue
<AddDialog v-model="open" title="إضافة مستخدم" @submit="save">
  <template #form>
    <v-text-field v-model="form.name" label="الاسم" />
  </template>
</AddDialog>
```

### مثال 2: مع validation

```vue
<AddDialog v-model="open" title="إضافة" @submit="save">
  <template #form>
    <v-text-field
      v-model="form.email"
      label="البريد"
      :rules="[(v) => !!v || 'مطلوب']"
    />
  </template>
</AddDialog>
```

### مثال 3: نموذج كامل

```vue
<AddDialog
  v-model="dialogOpen"
  title="إضافة عملة"
  :loading="isLoading"
  @submit="handleSubmit"
>
  <template #form>
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="form.name"
          label="الاسم"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="form.code"
          label="الرمز"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12">
        <v-switch v-model="form.is_active" label="نشط" />
      </v-col>
    </v-row>
  </template>
</AddDialog>
```

---

## 🔥 نصائح سريعة

### ✅ افعل

- استخدم `v-model` للنافذة
- أضف `@submit` handler
- ضع الحقول في `<template #form>`
- استخدم `variant="outlined"` للحقول
- أضف validation rules

### ❌ لا تفعل

- لا تنسى `v-model`
- لا تضع الحقول خارج `#form`
- لا تستخدم نافذة واحدة للإضافة والتعديل
- لا تنسى معالجة الأخطاء

---

## 🎨 التخصيص السريع

### ألوان مخصصة

```vue
<!-- لا يوجد prop للألوان، يتم استخدام theme -->
<!-- لتغيير اللون، عدّل app/theme.ts -->
```

### عرض مخصص

```vue
<AddDialog :max-width="900" ... />
<!-- عرض أكبر -->
<AddDialog :max-width="500" ... />
<!-- عرض أصغر -->
```

### نص الأزرار

```vue
<AddDialog submit-text="إنشاء" cancel-text="رجوع" ... />
```

---

## 🐛 حل المشاكل

### النافذة لا تفتح

```typescript
// تأكد من:
const dialogOpen = ref(false); // ✅
// ليس:
const dialogOpen = false; // ❌
```

### النموذج لا يُحفظ

```typescript
// تأكد من معالج submit:
@submit="handleSubmit" // ✅
// وليس:
@click="handleSubmit" // ❌
```

### الحقول لا تظهر

```vue
<!-- تأكد من slot صحيح: -->
<template #form>
  <!-- ✅ -->
  <v-text-field ... />
</template>

<!-- ليس: -->
<v-text-field ... />
<!-- ❌ خارج slot -->
```

---

## 📞 المساعدة

راجع:

- `README_DIALOGS.md` - دليل كامل
- `EXAMPLE_CONVERSION.md` - مثال عملي
- `app/components/global/AddDialog.vue` - الكود المصدري

---

## ⚡ Checklist سريع

قبل الاستخدام:

- [ ] استيراد المكونات
- [ ] إنشاء `ref` للنافذة
- [ ] إنشاء `reactive` للنموذج
- [ ] إنشاء دالة `submit`
- [ ] إضافة `v-model` و `@submit`
- [ ] وضع الحقول في `<template #form>`

---

**وقت القراءة: 2 دقيقة | وقت التطبيق: 5 دقائق** ⏱️
