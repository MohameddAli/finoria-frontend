# 🍞 دليل نظام Toast الاحترافي

## نظرة عامة

نظام Toast متكامل مع دعم كامل لـ:

- ✅ **Multi-line messages** - رسائل متعددة الأسطر
- ✅ **API normalization** - تطبيع تلقائي لرسائل API
- ✅ **Auto-interceptor** - اعتراض تلقائي للأخطاء
- ✅ **RTL/LTR** - دعم كامل للعربية والإنجليزية
- ✅ **i18n** - دعم الترجمة
- ✅ **Vuetify 3** - تصميم احترافي
- ✅ **TypeScript** - أمان كامل للأنواع

---

## 📁 البنية

```
shared/utils/toast/
├── flattenObjectToLines.ts      # تحويل Objects لأسطر
├── normalizeBackendMessage.ts   # تطبيع رسائل API
├── pickToastType.ts             # تحديد النوع من Status
└── index.ts                     # Barrel export

app/
├── composables/
│   └── useSnackbar.ts           # Composable (useToast)
├── components/ui/
│   └── GlobalSnackbar.vue       # Component للعرض
└── plugins/
    └── toast.client.ts          # Interceptor plugin
```

---

## 🚀 الاستخدام

### 1️⃣ **رسائل بسيطة**

```typescript
const toast = useToast();

// نجاح
toast.success("تم الحفظ بنجاح");

// خطأ
toast.error("حدث خطأ أثناء الحفظ");

// تحذير
toast.warning("يرجى التحقق من البيانات");

// معلومات
toast.info("تم تحديث البيانات");
```

---

### 2️⃣ **رسائل متعددة الأسطر**

```typescript
const toast = useToast();

toast.show(["السطر الأول", "السطر الثاني", "السطر الثالث"], {
  variant: "success",
  timeout: 5000,
});
```

---

### 3️⃣ **من API Response - السحر الحقيقي ✨**

#### مثال 1: رسالة بسيطة

```typescript
// Backend يرجع:
{
  msg: "User created successfully";
}

// الاستخدام:
const toast = useToast();
try {
  const res = await $fetch("/api/users", { method: "POST", body: userData });
  toast.fromResponse(res, 201);
} catch (error) {
  toast.fromResponse(error.data, error.status);
}

// النتيجة: ✅
// "User created successfully"
```

#### مثال 2: رسائل متعددة

```typescript
// Backend يرجع:
{
  data: {
    user: "created",
    email: "sent",
    profile: "updated"
  }
}

// النتيجة: ✅
// "data.user: created"
// "data.email: sent"
// "data.profile: updated"
```

#### مثال 3: Validation Errors

```typescript
// Backend يرجع:
{
  errors: {
    email: ["Email is required", "Email is invalid"],
    password: ["Password must be 8+ characters"]
  }
}

// النتيجة: ❌
// "errors.email: Email is required"
// "errors.email: Email is invalid"
// "errors.password: Password must be 8+ characters"
```

#### مثال 4: Nested Objects

```typescript
// Backend يرجع:
{
  data: {
    user: {
      profile: {
        name: "updated",
        email: "verified"
      }
    }
  }
}

// النتيجة: ✅
// "data.user.profile.name: updated"
// "data.user.profile.email: verified"
```

---

### 4️⃣ **API Interceptor - تلقائي 🔌**

#### الاستخدام العادي (مع Toast تلقائي):

```typescript
// ✅ أي خطأ سيظهر Toast تلقائياً
try {
  const data = await $fetch("/api/users");
} catch (error) {
  // Toast يظهر تلقائياً ❌
  // لا حاجة لكتابة كود إضافي!
}
```

#### تعطيل Toast للخطأ:

```typescript
// ❌ لا تعرض Toast
try {
  const data = await $fetch("/api/users", { silent: true });
} catch (error) {
  // معالجة خاصة بدون Toast
  console.error(error);
}
```

#### عرض Toast للنجاح:

```typescript
// ✅ عرض Toast عند النجاح
const data = await $fetch("/api/users", {
  showSuccessToast: true,
  successMessage: "تم جلب المستخدمين بنجاح",
});
```

---

## 🎨 أمثلة واقعية

### مثال 1: إنشاء مستخدم

```typescript
const toast = useToast();

async function createUser(userData: User) {
  try {
    const response = await $fetch("/api/users", {
      method: "POST",
      body: userData,
      showSuccessToast: true,
      successMessage: "تم إنشاء المستخدم بنجاح",
    });

    // ✅ Toast أخضر يظهر تلقائياً
    return response;
  } catch (error: any) {
    // ❌ Toast أحمر يظهر تلقائياً مع تفاصيل الخطأ
    throw error;
  }
}
```

---

### مثال 2: تحديث بيانات

```typescript
async function updateProfile(profileData: Profile) {
  try {
    const response = await $fetch(`/api/profile/${id}`, {
      method: "PUT",
      body: profileData,
    });

    // عرض Toast مخصص
    toast.fromResponse(response, 200);
  } catch (error: any) {
    // Interceptor يعرض Toast تلقائياً
    // لكن يمكنك إضافة معالجة إضافية هنا
  }
}
```

---

### مثال 3: حذف مع تأكيد

```typescript
async function deleteUser(userId: string) {
  try {
    await $fetch(`/api/users/${userId}`, {
      method: "DELETE",
      showSuccessToast: true,
      successMessage: "تم حذف المستخدم بنجاح",
    });
  } catch (error: any) {
    // Toast خطأ تلقائي
  }
}
```

---

### مثال 4: جلب بيانات (بدون Toast)

```typescript
// جلب البيانات بدون Toast عند النجاح أو الخطأ
const users = await $fetch("/api/users", {
  silent: true,
});
```

---

## 🎯 حالات خاصة

### 401 Unauthorized

```typescript
// يتم معالجته في auth middleware
// لا يظهر Toast (يتم التوجيه لصفحة Login)
```

### 403 Forbidden

```typescript
// يظهر: "لا تملك الصلاحيات اللازمة"
```

### 404 Not Found

```typescript
// يظهر: "المورد غير موجود"
```

### 422 Validation Error

```typescript
// يعرض جميع أخطاء الـ Validation في أسطر منفصلة
```

### 500 Server Error

```typescript
// يظهر: "خطأ في الخادم، يرجى المحاولة لاحقاً"
```

---

## 🔧 التخصيص

### تغيير Timeout

```typescript
toast.show(["رسالة"], {
  variant: "success",
  timeout: 10000, // 10 ثواني
});
```

### تغيير Icon

```typescript
toast.show(["رسالة"], {
  variant: "info",
  icon: "mdi-rocket", // icon مخصص
});
```

### إخفاء يدوياً

```typescript
const toast = useToast();

// عرض
toast.success("رسالة");

// إخفاء بعد 2 ثانية
setTimeout(() => {
  toast.hide();
}, 2000);
```

---

## 📊 الفرق بين الأنواع

| النوع       | اللون   | Icon | Timeout | متى تستخدمه  |
| ----------- | ------- | ---- | ------- | ------------ |
| **success** | أخضر    | ✓    | 4s      | عمليات نجحت  |
| **error**   | أحمر    | ✕    | 6s      | أخطاء وفشل   |
| **warning** | برتقالي | ⚠    | 5s      | تحذيرات      |
| **info**    | أزرق    | ℹ    | 4s      | معلومات عامة |

---

## 🌍 دعم i18n

النظام يدعم الترجمة تلقائياً:

```typescript
// في i18n/locales/ar.json
{
  "errors": {
    "something_is_wrong": "حدث خطأ ما",
    "permission_denied": "لا تملك الصلاحيات",
    "not_found": "المورد غير موجود",
    "server_error": "خطأ في الخادم"
  }
}

// في i18n/locales/en.json
{
  "errors": {
    "something_is_wrong": "Something went wrong",
    "permission_denied": "Permission denied",
    "not_found": "Resource not found",
    "server_error": "Server error"
  }
}
```

---

## 🎨 دعم RTL

النظام يدعم RTL تلقائياً:

- العربية: من اليمين لليسار
- الإنجليزية: من اليسار لليمين

---

## ⚙️ API Reference

### `useToast()`

```typescript
interface UseToast {
  // عرض Toast
  show(lines: string[], options?: ToastOptions): void;

  // رسائل سريعة
  success(message: string | string[]): void;
  error(message: string | string[]): void;
  warning(message: string | string[]): void;
  info(message: string | string[]): void;

  // من API Response
  fromResponse(payload: unknown, statusCode?: number): void;

  // إخفاء
  hide(): void;
  clear(): void;

  // State (readonly)
  state: {
    lines: Ref<string[]>;
    variant: Ref<ToastVariant>;
    visible: Ref<boolean>;
    timeout: Ref<number>;
    icon: Ref<string>;
  };
}

interface ToastOptions {
  variant?: "success" | "error" | "warning" | "info";
  timeout?: number;
  icon?: string;
}
```

---

### `$fetch` Options

```typescript
interface FetchOptions {
  silent?: boolean; // تعطيل Toast للخطأ
  showSuccessToast?: boolean; // عرض Toast للنجاح
  successMessage?: string; // رسالة نجاح مخصصة
}
```

---

## 🐛 استكشاف الأخطاء

### المشكلة: Toast لا يظهر

**الحل:** تأكد من إضافة `<GlobalSnackbar />` في `app.vue`

### المشكلة: Toast يظهر مرتين

**الحل:** تأكد من عدم استدعاء `toast.fromResponse()` يدوياً مع Interceptor

### المشكلة: الرسائل لا تظهر بالكامل

**الحل:** تأكد من أن Backend يرجع البيانات في أحد المفاتيح المعروفة:

- `msg`, `message`, `error`, `errors`, `detail`, `data`, etc.

---

## 💡 نصائح

1. ✅ **استخدم `fromResponse`** - يوفر عليك كود كثير
2. ✅ **اعتمد على Interceptor** - لا حاجة لمعالجة الأخطاء يدوياً
3. ✅ **استخدم `silent: true`** - للطلبات الصامتة فقط
4. ✅ **اختبر مع بيانات حقيقية** - لضمان عمل التطبيع بشكل صحيح
5. ✅ **استخدم i18n** - للرسائل الثابتة

---

## 🔗 ملفات ذات صلة

- `shared/utils/toast/` - Utilities
- `app/composables/useSnackbar.ts` - Composable
- `app/components/ui/GlobalSnackbar.vue` - Component
- `app/plugins/toast.client.ts` - Interceptor
- `app/app.vue` - Global mounting point

---

تم إنشاء هذا الدليل بواسطة: GitHub Copilot 🤖
آخر تحديث: نوفمبر 2025
