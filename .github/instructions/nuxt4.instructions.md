---
applyTo: '**'
---
System Rule — Nuxt 4 + Pinia 3 + Vuetify 3 + TypeScript

وثيقة مرجعية (System Rule) لمشروع Nuxt 4 تُحدد قواعد كتابة الكود، بنية المشروع، التسمية، أفضل الممارسات، وكيفية التعامل مع مجلد مشترك /shared ومجلد الواجهة الأمامية app/.

🇸🇦 ملخص عام

لغة المشروع: TypeScript (strict).

نمط API: Vue 3 Composition API مع <script setup> فقط.

حالة الواجهة: Nuxt 4.

إدارة الحالة: Pinia 3 عبر @pinia/nuxt.

واجهة المستخدم: Vuetify 3 (أولوية قصوى).

تنسيق CSS مخصص ممنوع إلا عند الضرورة القصوى، وعند الحاجة استخدم أساليب Vuetify فقط.

المشروع Frontend فقط — لا يوجد مجلد server/.

Theme Vuetify 3 يتم تهيئته global لجميع المكونات من خلال plugins/vuetify.ts بالاستفادة من إعدادات app/theme.ts.

1. قواعد عامة لكتابة الكود

لا تستخدم class — اعتمد دوال، composables، وPinia actions.

Composition API فقط مع <script setup lang="ts">.

حدد واجهات (interfaces) بدلاً من type متى احتجت للـ extend أو merging.

لا تستخدم enums؛ استخدم كائنات as const أو خرائط ثابتة.

اتبع مبدأ Single Responsibility: كل ملف مسؤول عن مهمة واحدة.

التزم بمبدأ DRY: استخدم composables و utilities مشتركة بدلاً من تكرار الشيفرة.

2. قواعد التسمية

Composables: useXxx (مثال: useAuth, useUsers).

Pinia stores:

أسماء الملفات بصيغة: storeXxx.ts.

كل store داخل مجلد خاص به: stores/users/storeUsers.ts, stores/projects/storeProjects.ts.

Components: PascalCase (UserCard.vue).

Pages: kebab-case أو PascalCase حسب تفضيل الفريق.

Interfaces: PascalCase (User, ProjectConfig).

3. بنية المشروع (Structure)

/ (repo root)
├─ app/                     # frontend source (Nuxt srcDir)
│  ├─ components/
│  ├─ composables/
│  │  ├─ useApi.ts
│  │  ├─ useAuth.ts
│  │  ├─ useExport.ts
│  │  ├─ useFileUpload.ts
│  │  ├─ useLoading.ts
│  │  ├─ useNetworkStatus.ts
│  │  ├─ useSnackbar.ts
│  │  ├─ useUnauthorized.ts
│  │  ├─ useUtils.ts
│  │  ├─ useZod.ts
│  ├─ layouts/              # التخطيطات فقط (MainLayout.vue, AuthLayout.vue ...)
│  ├─ pages/
│  ├─ plugins/              # plugins مثل vuetify, i18n, loading ...
│  │  └─ vuetify.ts         # تطبيق theme global باستخدام app/theme.ts
│  ├─ stores/
│  │  ├─ users/storeUsers.ts
│  │  ├─ projects/storeProjects.ts
│  ├─ i18n/                 # ملفات الترجمة (يُدار عبر plugin i18n)
│  ├─ app.vue
│  ├─ error.vue
│  ├─ theme.ts              # تكوين theme Vuetify global
│  ├─ public/
│  │  ├─ images/
│  ├─ assets/
│  └─ nuxt.config.ts        # يمكن نسخه أو استيراده من repo root
├─ shared/
│  ├─ types/                # واجهات وtypes المشتركة
│  │  ├─ env.d.ts
│  │  ├─ index.ts
│  │  ├─ menu.ts
│  ├─ utils/                # دوال مساعدة غير مرتبطة بـ Vue أو DOM
│  │  ├─ helpers.ts
│  │  ├─ index.ts
│  │  ├─ menuItems.ts
├─ package.json
└─ README.md

4. Theme Vuetify Global

app/theme.ts يحتوي على إعدادات الـ theme (الألوان، الوضع الافتراضي light/dark).

plugins/vuetify.ts يقوم بإنشاء Vuetify instance وتطبيق الـ theme global:

// app/theme.ts
export const themeConfig = {
  defaultTheme: 'light',
  themes: {
    light: { colors: { primary: '#1976D2', secondary: '#424242', accent: '#82B1FF' } },
    dark: { colors: { primary: '#2196F3', secondary: '#FF5722', accent: '#FF4081' } }
  }
}

// plugins/vuetify.ts
import { defineNuxtPlugin } from '#app'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { themeConfig } from '@/theme'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
    theme: themeConfig
  })
  nuxtApp.vueApp.use(vuetify)
})

جميع المكونات ستلتقط الـ theme تلقائيًا.

لتغيير theme runtime، يمكن استخدام useVuetify() أو provide/inject.

5. بقية الأقسام

(تظل بقية الأقسام كما هي: قواعد frontend, fetch, Pinia, Vuetify, validation, security, config examples, workflow, checklist, performance).

