# FilterPanel - خاصية Collapsible الجديدة

## نظرة عامة

تم إضافة خاصية `collapsible` إلى مكون FilterPanel للتحكم في طريقة عرض الفلاتر.

## الفرق بين الوضعين

### 1. الوضع القابل للطي `collapsible: true` (الافتراضي)

```vue
<FilterPanel
  v-model="filters"
  :fields="filterFields"
  :collapsible="true"
  toggle-button-label="عرض الفلاتر"
  @submit="handleSubmit"
/>
```

**المميزات:**
- ✅ يظهر زر "عرض الفلاتر" في الأعلى
- ✅ عند الضغط عليه تظهر/تختفي الفلاتر
- ✅ يظهر عداد للفلاتر النشطة
- ✅ مثالي للصفحات التي تحتوي على فلاتر اختيارية

**متى تستخدمه:**
- صفحات الجداول (Tables)
- صفحات القوائم (Lists)
- عند وجود فلاتر متعددة اختيارية

---

### 2. الوضع المباشر `collapsible: false`

```vue
<FilterPanel
  v-model="formData"
  :fields="filterFields"
  :collapsible="false"
  @submit="handleSubmit"
/>
```

**المميزات:**
- ✅ لا يوجد زر toggle
- ✅ الفلاتر ظاهرة دائماً
- ✅ تصميم أنظف وأبسط
- ✅ مثالي للفورمات الأساسية

**متى تستخدمه:**
- صفحات البحث الأساسية
- الفورمات المطلوبة
- عندما تكون الفلاتر قليلة وضرورية
- مثل صفحة JSON Body

---

## مثال عملي: صفحة JSON Body

### قبل التحديث
كان الكود يستخدم `<v-form>` يدوياً مع جميع الحقول:

```vue
<v-form ref="formRef" v-model="valid" @submit.prevent="handleSubmit">
  <v-row>
    <v-col cols="12" md="4">
      <v-select v-model="formData.bank_id" ... />
    </v-col>
    <v-col cols="12" md="4">
      <v-text-field v-model="formData.rrn" ... />
    </v-col>
    <!-- المزيد من الحقول ... -->
  </v-row>
</v-form>
```

### بعد التحديث
الآن يستخدم FilterPanel مع `collapsible: false`:

```vue
<FilterPanel
  v-model="formData"
  :fields="filterFields"
  :collapsible="false"
  :loading="loading"
  @submit="handleSubmit"
  @clear="handleClear"
/>
```

**الفوائد:**
- ✅ كود أقل بكثير
- ✅ سهولة الصيانة
- ✅ إعادة استخدام المنطق
- ✅ دعم RTL تلقائي
- ✅ validation موحد

---

## تعريف الحقول

في `json-body.vue` الجديد، الحقول معرفة في `computed`:

```javascript
const filterFields = computed(() => {
  const fields = [];
  
  // إضافة حقل Bank فقط إذا كان showBankField = true
  if (showBankField.value) {
    fields.push({
      name: 'bank_id',
      type: 'select',
      label: t('jsonBody.form.bank'),
      items: banks.value,
      itemTitle: 'name',
      itemValue: 'id',
      prependInnerIcon: 'mdi-bank',
      rules: [rules.required],
      cols: 12,
      md: 4
    });
  }
  
  // باقي الحقول...
  fields.push({
    name: 'rrn',
    type: 'text',
    label: t('jsonBody.form.rrn'),
    prependInnerIcon: 'mdi-numeric',
    rules: [rules.required],
    cols: 12,
    md: 4
  });
  
  return fields;
});
```

**لاحظ:**
- يمكن إضافة/إزالة حقول ديناميكياً
- جميع الخصائص (icons, rules, cols) في مكان واحد
- سهولة الإدارة والتعديل

---

## الخصائص الجديدة

### في FilterPanel

| الخاصية | النوع | الافتراضي | الوصف |
|---------|-------|-----------|-------|
| `collapsible` | Boolean | `true` | تفعيل/تعطيل الوضع القابل للطي |
| `loading` | Boolean | `false` | حالة التحميل (تمرر للزر) |

### في field configuration

يمكنك الآن إضافة خصائص جديدة لكل حقل:

```javascript
{
  name: 'amount',
  type: 'number',
  label: 'المبلغ',
  prependInnerIcon: 'mdi-currency-usd',  // ← جديد
  rules: [rules.required, rules.number],  // ← جديد
  min: 0,                                 // ← جديد
  step: 0.01,                             // ← جديد
  cols: 12,
  md: 4
}
```

---

## الملفات المعدلة

### 1. `/app/components/filters/FilterPanel.vue`
**التغييرات:**
- ✅ إضافة prop `collapsible`
- ✅ إضافة prop `loading`
- ✅ دعم `prependInnerIcon` في الحقول
- ✅ دعم `rules` في الحقول
- ✅ دعم `min`, `max`, `step` للحقول الرقمية
- ✅ دعم `itemTitle` و `itemValue` للـ select
- ✅ إضافة computed `isValid` للتحقق من الصحة
- ✅ عرض النصوص في الأزرار مع الأيقونات
- ✅ إزالة padding عند `collapsible: false`

### 2. `/app/pages/json-body.vue`
**التغييرات:**
- ✅ استبدال `<v-form>` بـ `<FilterPanel>`
- ✅ نقل تعريف الحقول إلى `filterFields` computed
- ✅ إزالة `formRef` و `valid`
- ✅ استخدام `collapsible: false`
- ✅ تمرير `loading` للمكون
- ✅ استخدام events `@submit` و `@clear`

### 3. `/app/components/filters/README.md`
**التغييرات:**
- ✅ إضافة قسم عن `collapsible`
- ✅ تحديث جدول Props
- ✅ إضافة أمثلة جديدة

---

## كيفية الاستخدام في صفحاتك

### للفلاتر الاختيارية (مثل الجداول):

```vue
<template>
  <div>
    <FilterPanel
      v-model="filters"
      :fields="filterFields"
      :collapsible="true"
      :initial-open="false"
      toggle-button-label="عرض الفلاتر"
      @submit="fetchData"
    />
    
    <ReusableTable :data="tableData" />
  </div>
</template>
```

### للفورمات الأساسية (مثل البحث):

```vue
<template>
  <FilterPanel
    v-model="searchData"
    :fields="searchFields"
    :collapsible="false"
    :loading="isSearching"
    submit-button-label="بحث"
    @submit="handleSearch"
    @clear="resetSearch"
  />
</template>
```

---

## الخلاصة

الآن يمكنك:
1. ✅ استخدام نفس المكون لحالتين مختلفتين
2. ✅ تقليل تكرار الكود
3. ✅ تحسين الصيانة
4. ✅ توحيد تجربة المستخدم

**مثال حي:** راجع `/app/pages/json-body.vue` لمشاهدة `collapsible: false` في العمل!
