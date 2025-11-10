# Multi-Steps Form Feature

## Overview

صفحة نموذج تسجيل متعدد الخطوات (Multi-Step Registration Form) من 7 خطوات مع دعم كامل للغتين العربية والإنجليزية.

## Structure

```
app/pages/multi-steps-form/
├── index.vue                     # الصفحة الرئيسية
└── steps/
    ├── UserInfoStep.vue          # الخطوة 1: بيانات المستخدم
    ├── AgentInfoStep.vue         # الخطوة 2: بيانات الوكيل
    ├── CompanyInfoStep.vue       # الخطوة 3: بيانات الشركة
    ├── ProductSelectionStep.vue  # الخطوة 4: اختيار المنتج
    ├── DocumentsUploadStep.vue   # الخطوة 5: رفع المستندات
    ├── ConfirmationStep.vue      # الخطوة 6: المراجعة والتأكيد
    └── SuccessStep.vue           # الخطوة 7: النجاح مع QR Code
```

## Features

### ✅ الخطوات السبع

#### 1️⃣ **Stepخطوة 1: بيانات المستخدم (User Information)**

- الاسم الكامل
- البريد الإلكتروني
- رقم الهاتف
- رقم الهوية
- تاريخ الميلاد
- الجنسية
- العنوان

#### 2️⃣ **الخطوة 2: بيانات الوكيل (Agent Information)**

- اسم الوكيل
- شركة الوكيل
- البريد الإلكتروني
- رقم الهاتف
- رقم الترخيص
- سنوات الخبرة
- العنوان

#### 3️⃣ **الخطوة 3: بيانات الشركة (Company Information)**

- اسم الشركة
- رقم التسجيل
- الرقم الضريبي
- المجال (Industry)
- البريد الإلكتروني
- الهاتف
- الموقع الإلكتروني
- عدد الموظفين
- العنوان

#### 4️⃣ **الخطوة 4: اختيار المنتج (Product Selection)**

- اختيار منتج واحد أو أكثر من منتجين متاحين:
  - **الباقة المميزة** (Premium Package)
  - **الباقة المؤسسية** (Enterprise Package)
- تحديد الكمية لكل منتج
- ملاحظات إضافية اختيارية

#### 5️⃣ **الخطوة 5: رفع المستندات (Documents Upload)**

- رفع ملف PDF (مطلوب)
- رفع صور متعددة (مطلوب)
- رفع مستندات إضافية (اختياري)
- معاينة الصور المرفوعة
- عداد للملفات المرفوعة

#### 6️⃣ **الخطوة 6: المراجعة والتأكيد (Confirmation)**

- عرض ملخص لجميع البيانات المدخلة:
  - بيانات المستخدم
  - بيانات الوكيل
  - بيانات الشركة
  - المنتجات المختارة والكميات
  - عدد الملفات المرفوعة
- Checkbox للتأكيد على صحة البيانات
- زر الإرسال

#### 7️⃣ **الخطوة 7: النجاح (Success)**

- رسالة نجاح
- عرض رقم التسجيل (Registration ID)
- عرض QR Code
- إمكانية نسخ رقم التسجيل
- إمكانية تحميل QR Code
- إمكانية طباعة التأكيد
- معلومات عن الخطوات التالية
- زر لبدء تسجيل جديد
- زر للعودة للصفحة الرئيسية

## Components & Features

### 🎨 **Design Features**

- ✅ Material Design 3 with Vuetify
- ✅ Responsive design (Mobile & Desktop)
- ✅ RTL Support (Arabic)
- ✅ Dark/Light theme support
- ✅ Smooth animations
- ✅ Progress indicator (Stepper)

### 📝 **Form Validation**

- ✅ Required field validation
- ✅ Email validation
- ✅ Number validation
- ✅ File type validation
- ✅ Real-time validation feedback

### 🌍 **Internationalization (i18n)**

- ✅ Full Arabic translation
- ✅ Full English translation
- ✅ Dynamic language switching

### 💾 **Data Management**

- ✅ Form state preservation between steps
- ✅ Two-way data binding
- ✅ File upload handling
- ✅ Image preview

## How to Use

### Navigation

```javascript
// الوصول للصفحة
navigateTo("/multi-steps-form");

// متاح من Sidebar تحت اسم "Multi-Step Form" / "نموذج متعدد الخطوات"
```

### Form Data Structure

```javascript
{
  userInfo: {
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    dateOfBirth: '',
    nationality: '',
    address: ''
  },
  agentInfo: {
    agentName: '',
    agentCompany: '',
    agentEmail: '',
    agentPhone: '',
    licenseNumber: '',
    yearsOfExperience: 0,
    agentAddress: ''
  },
  companyInfo: {
    companyName: '',
    registrationNumber: '',
    taxId: '',
    industry: '',
    companyEmail: '',
    companyPhone: '',
    website: '',
    numberOfEmployees: '',
    companyAddress: ''
  },
  productSelection: {
    products: [],
    quantities: {},
    notes: ''
  },
  documents: {
    pdfFile: [],
    images: [],
    additionalDocs: []
  }
}
```

## Customization

### Adding New Products

Edit `ProductSelectionStep.vue`:

```vue
<!-- Add new product card -->
<v-col cols="12" md="6">
  <v-card @click="toggleProduct('product3')">
    <!-- Product details -->
  </v-card>
</v-col>
```

Update translations in `i18n/locales/`:

```json
"product3": {
  "name": "New Product",
  "code": "PRD-003",
  "description": "Description",
  "price": "$XXX"
}
```

### Customizing Validation Rules

Edit individual step files:

```javascript
const rules = {
  required: (value) => !!value || t("validation.required"),
  email: (value) => pattern.test(value) || t("validation.invalidEmail"),
  // Add custom rules
};
```

### Styling

All components use scoped styles. Customize in each step file:

```vue
<style scoped>
.step-card {
  /* Custom styles */
}
</style>
```

## API Integration (Future Enhancement)

Replace mock submission in `index.vue`:

```javascript
const submitForm = async () => {
  submitting.value = true;

  try {
    // Replace with actual API call
    const response = await $fetch("/api/registration", {
      method: "POST",
      body: formData.value,
    });

    registrationId.value = response.id;
    qrCode.value = response.qrCode;

    currentStep.value = 7;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    submitting.value = false;
  }
};
```

## QR Code Enhancement

For production, install a QR code library:

```bash
pnpm add qrcode
# or
npm install qrcode
```

Update `generateQRCode` function:

```javascript
import QRCode from "qrcode";

const generateQRCode = async (data) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data);
    return qrCodeDataUrl;
  } catch (err) {
    console.error(err);
  }
};
```

## Translation Keys

All translation keys are prefixed with `multiStepForm.*`:

- `multiStepForm.title`
- `multiStepForm.steps.*`
- `multiStepForm.userInfo.*`
- `multiStepForm.agentInfo.*`
- `multiStepForm.companyInfo.*`
- `multiStepForm.productSelection.*`
- `multiStepForm.documents.*`
- `multiStepForm.confirmation.*`
- `multiStepForm.success.*`

## Notes

1. **File Upload**: Currently handles files in memory. For production, implement proper file upload to backend/cloud storage.

2. **QR Code**: Uses SVG placeholder. Replace with actual QR code library for production.

3. **Validation**: Client-side only. Add server-side validation in production.

4. **Security**: Add CSRF protection and authentication checks in production.

5. **Data Persistence**: Add ability to save draft and resume later.

## Accessibility

- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management
- ✅ Error announcements

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## License

Part of the Nuxt 4 Project
