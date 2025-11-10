export default defineNuxtPlugin((nuxtApp) => {
  const loadingStore = useLoadingStore();
  const router = useRouter();

  // خريطة الترجمة المحلية - Local translation mapping
  const pageTranslations: Record<string, Record<string, string>> = {
    ar: {
      index: 'الصفحة الرئيسية',
      home: 'الصفحة الرئيسية',
      overview: 'نظرة عامة',
      analytics: 'التحليلات',
      chat: 'المحادثة',
      cards: 'البطاقات',
      customers: 'العملاء',
      movies: 'الأفلام',
      support: 'الدعم',
      settings: 'الإعدادات',
      profile: 'الملف الشخصي',
      users: 'المستخدمون',
      reports: 'التقارير',
      transactions: 'المعاملات',
      wallets: 'المحافظ',
      help: 'المساعدة',
      'loading-test': 'اختبار التحميل',
      'translation-test': 'اختبار الترجمة'
    },
    en: {
      index: 'Home Page',
      home: 'Home Page',
      overview: 'Overview',
      analytics: 'Analytics',
      chat: 'Chat',
      cards: 'Cards',
      customers: 'Customers',
      movies: 'Movies',
      support: 'Support',
      settings: 'Settings',
      profile: 'Profile',
      users: 'Users',
      reports: 'Reports',
      transactions: 'Transactions',
      wallets: 'Wallets',
      help: 'Help',
      'loading-test': 'Loading Test',
      'translation-test': 'Translation Test'
    }
  };

  // الحصول على اللغة الحالية - Get current locale
  const getCurrentLocale = (): string => {
    const i18n = (nuxtApp as any).$i18n;
    if (i18n && i18n.locale && i18n.locale.value) {
      return i18n.locale.value;
    }
    // تراجع للإعدادات المحلية - Fallback to browser locale
    if (import.meta.client) {
      return document.documentElement.lang || 'en';
    }
    return 'en';
  };

  // متغيرات تتبع حالة التنقل - Navigation state tracking variables
  let isNavigating = false;                    // هل يتم التنقل حالياً
  let loadingStartTime = 0;                    // وقت بدء التحميل
  let navigationTimeout: ReturnType<typeof setTimeout> | null = null;  // مؤقت الأمان

  // الحد الأدنى لوقت التحميل - Minimum loading time (prevents flicker)
  const MIN_LOADING_TIME = 500;

  // وظيفة للحصول على اسم الصفحة مترجم - Function to get translated page name
  const getPageName = (path: string): string => {
    const locale = getCurrentLocale(); // الحصول على اللغة الحالية - Get current locale

    // إزالة العلامة الأولى وتنظيف المسار - Remove leading slash and clean path
    let pageName = path.replace('/', '') || 'index';

    // تنظيف إضافي للمسار - Additional path cleaning
    pageName = pageName.split('?')[0] || 'index'; // إزالة معاملات الاستعلام - Remove query params
    pageName = pageName.split('#')[0] || 'index'; // إزالة المرساة - Remove anchor
    pageName = pageName.split('/')[0] || 'index'; // أخذ الجزء الأول فقط - Take only first segment

    // الحصول على الترجمة من الخريطة المحلية - Get translation from local mapping
    const currentLang = locale === 'ar' ? 'ar' : 'en';
    const translatedName = pageTranslations[currentLang]?.[pageName];

    // إذا لم توجد ترجمة، استخدم اسم الصفحة مباشرة - If no translation, use page name directly
    return translatedName || pageName.charAt(0).toUpperCase() + pageName.slice(1);
  };

  // وظيفة للحصول على نص التحميل مع اسم الصفحة المترجم - Function to get loading text with translated page name
  const getLoadingMessage = (path: string): string => {
    const locale = getCurrentLocale(); // الحصول على اللغة الحالية - Get current locale
    const pageName = getPageName(path);

    // نص التنقل حسب اللغة - Navigation text based on language
    if (locale === 'ar') {
      return `جاري الانتقال إلى ${pageName}...`;
    } else {
      return `Navigating to ${pageName}...`;
    }
  };

  // تنظيف حالة التنقل - Clear navigation state helper
  const clearNavigationState = () => {
    if (navigationTimeout) {
      clearTimeout(navigationTimeout);           // إلغاء مؤقت الأمان
      navigationTimeout = null;
    }
    isNavigating = false;                      // إعادة تعيين حالة التنقل
  };

  // إنهاء التحميل مع فرض الحد الأدنى - Finish loading with minimum time enforcement
  const finishLoading = () => {
    if (!isNavigating) return;                 // تجاهل إذا لم يكن يتم التنقل

    const elapsed = Date.now() - loadingStartTime;  // الوقت المنقضي
    const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);  // الوقت المتبقي

    // انتظار الوقت المتبقي قبل إنهاء التحميل - Wait remaining time before stopping
    setTimeout(() => {
      loadingStore.stopLoading("navigation");  // إيقاف تحميل التنقل
      clearNavigationState();                  // تنظيف الحالة
    }, remaining);
  };

  // بدء تحميل التنقل - Start navigation loading
  const startNavigationLoading = (to: any) => {
    if (isNavigating) return;                  // منع التشغيل المزدوج

    // تنظيف الحالة السابقة وبدء الجديدة - Clear previous state and start new
    clearNavigationState();
    loadingStore.stopLoading();               // إيقاف جميع عمليات التحميل

    isNavigating = true;                      // تعيين حالة التنقل
    loadingStartTime = Date.now();            // حفظ وقت البدء

    // إنشاء نص التحميل مع اسم الصفحة - Create loading text with page name
    const loadingText = getLoadingMessage(to.path);

    // بدء عرض التحميل - Start showing loading
    loadingStore.startLoading({
      id: "navigation",
      text: loadingText,                      // عرض اسم الصفحة مترجم في رسالة التحميل
      type: "navigation",
    });

    // مؤقت أمان في حال فشل التنقل - Safety timeout for failed navigation
    navigationTimeout = setTimeout(() => {
      if (isNavigating) {
        console.warn("⚠️ انتهت وقت انتظار التنقل");
        loadingStore.stopLoading("navigation");
        clearNavigationState();
      }
    }, 8000); // 8 ثواني حد أقصى
  };

  // التقاط بدء التنقل - Intercept navigation start
  router.beforeEach((to, from) => {
    // بدء التحميل فقط للمسارات المختلفة - Start loading only for different routes
    if (to.path !== from.path) {
      startNavigationLoading(to);
    }
  });

  // التقاط انتهاء تحميل الصفحة - Intercept page loading completion
  nuxtApp.hook("page:finish", () => {
    if (isNavigating) {
      finishLoading();                        // إنهاء التحميل
    }
  });

  // معالجة أخطاء التنقل - Handle navigation errors
  router.onError((error) => {
    console.error("❌ خطأ في التنقل:", error);
    if (isNavigating) {
      loadingStore.stopLoading("navigation");
      clearNavigationState();
    }
  });

  // معالجة أخطاء التطبيق - Handle app errors
  nuxtApp.hook("app:error", (error) => {
    console.error("❌ خطأ في التطبيق:", error);
    if (isNavigating) {
      loadingStore.stopLoading("navigation");
      clearNavigationState();
    }
  });

  // تنظيف عند تحميل التطبيق - Cleanup on app mount
  nuxtApp.hook("app:mounted", () => {
    loadingStore.stopLoading();               // إيقاف جميع عمليات التحميل
    clearNavigationState();                  // تنظيف حالة التنقل
  });
});
