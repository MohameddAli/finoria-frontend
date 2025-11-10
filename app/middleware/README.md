# 🔐 Middleware - نظام حماية المسارات

## 📋 الملفات المتاحة

### 1️⃣ `protected.ts` - حماية صفحات Dashboard
**الوظيفة:** يمنع المستخدمين غير المسجلين من الوصول للصفحات المحمية

**الاستخدام:**
```vue
definePageMeta({
  middleware: ['protected']
})
```

**التدفق:**
```
غير مسجل → /unauthorized (فوري) → /auth/login (بعد 5 ثوانٍ)
```

---

### 2️⃣ `public.ts` - صفحات المصادقة
**الوظيفة:** يمنع المستخدمين المسجلين من الوصول لصفحات login/register

**الاستخدام:**
```vue
definePageMeta({
  middleware: ['public'],
  layout: 'empty'
})
```

**التدفق:**
```
مسجل → /dashboard (أو المسار المحفوظ)
```

---

### 3️⃣ `permission.ts` - التحقق من الصلاحيات
**الوظيفة:** يتحقق من صلاحيات المستخدم للوصول لموارد معينة

**الاستخدام:**
```vue
definePageMeta({
  middleware: ['protected', 'permission'],
  permission: 'users.view' // صلاحية واحدة
})
```

**أو عدة صلاحيات:**
```vue
definePageMeta({
  middleware: ['protected', 'permission'],
  permissions: ['users.view', 'users.edit'],
  permissionMode: 'all' // 'all' = يحتاج جميع الصلاحيات | 'any' = يحتاج أي صلاحية
})
```

---

## 🎯 أمثلة الاستخدام

### ✅ صفحة Dashboard محمية
```vue
<script setup lang="ts">
definePageMeta({
  layout: 'dashboard' // يطبق protected middleware تلقائياً
})
</script>
```

### ✅ صفحة Login عامة
```vue
<script setup lang="ts">
definePageMeta({
  layout: 'empty',
  middleware: ['public']
})
</script>
```

### ✅ صفحة Users محمية بصلاحية
```vue
<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['permission'],
  permission: 'users.view'
})
</script>
```

---

## 📖 الوثائق الكاملة

راجع `app/docs/PROTECTED_ROUTES_GUIDE.md` للحصول على الدليل الكامل.

---

**📝 ملاحظة:** جميع middleware تعمل على Client Side فقط (`process.server` checks included)


