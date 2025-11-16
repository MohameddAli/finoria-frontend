<template>
  <v-container fluid class="news-page" id="news-page">
    <section v-if="heroArticle" class="news-hero" :style="heroStyle">
      <div class="hero-overlay">
        <div class="hero-meta">
          <v-chip
            size="small"
            :color="heroArticle.source === 'cbl' ? 'primary' : 'deep-purple'"
            variant="flat"
          >
            {{ sourceLabel(heroArticle.source) }}
          </v-chip>
          <span class="text-caption">{{ formatDate(heroArticle.publishedAt) }}</span>
        </div>
        <h1 class="hero-title">{{ heroArticle.title }}</h1>
        <p class="hero-summary text-body-1">
          {{ heroArticle.summary }}
        </p>
        <div class="hero-actions">
          <v-btn color="primary" prepend-icon="mdi-open-in-new" :to="heroArticle.link" target="_blank">
            قراءة التفاصيل
          </v-btn>
          <v-btn variant="text" prepend-icon="mdi-bell-ring" @click="subscribe">
            تنبيهات الأخبار
          </v-btn>
          <v-btn variant="text" prepend-icon="mdi-refresh" @click="refresh">
            تحديث
          </v-btn>
        </div>
      </div>
    </section>
    <section v-else class="news-hero placeholder">
      <div class="hero-overlay text-center">
        <v-icon size="48" class="mb-2">mdi-newspaper-variant-outline</v-icon>
        <p class="text-body-1">لا توجد أخبار لعرضها الآن.</p>
      </div>
    </section>

    <section class="filter-bar">
      <v-card class="filter-card">
        <v-row class="ga-2" align="center">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              variant="plain"
              prepend-inner-icon="mdi-magnify"
              label="ابحث في الأخبار"
              hide-details
            />
          </v-col>
          <v-col cols="6" md="2">
            <v-select
              v-model="sourceFilter"
              :items="sourceOptions"
              item-title="label"
              item-value="value"
              variant="plain"
              hide-details
              label="الجهة"
            />
          </v-col>
          <v-col cols="6" md="2">
            <v-select
              v-model="categoryFilter"
              :items="categoryOptions"
              variant="plain"
              hide-details
              clearable
              label="التصنيف"
            />
          </v-col>
          <v-col cols="6" md="2">
            <v-switch
              v-model="highlightCentral"
              inset
              color="primary"
              hide-details
              :label="highlightCentral ? 'تركيز المركزي' : 'الكل'"
            />
          </v-col>
          <v-col cols="12">
            <div class="tag-row">
              <span class="text-caption">وسوم:</span>
              <v-chip-group v-model="tagFilter" multiple selected-class="text-white">
                <v-chip
                  v-for="tag in tagOptions"
                  :key="tag"
                  :value="tag"
                  size="small"
                  variant="outlined"
                >
                  {{ tag }}
                </v-chip>
              </v-chip-group>
              <v-spacer />
              <v-btn variant="text" prepend-icon="mdi-filter-off" @click="resetFilters">
                إعادة تعيين
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </section>

    <section class="news-grid">
      <div class="news-feed">
        <article
          v-for="item in feedArticles"
          :key="item.id"
          class="feed-article"
        >
          <div class="feed-meta">
            <span>{{ formatDate(item.publishedAt) }}</span>
            <span>•</span>
            <span>{{ item.category }}</span>
          </div>
          <h2>{{ item.title }}</h2>
          <p>{{ item.summary }}</p>
          <div class="feed-tags">
            <v-chip
              v-for="tag in item.tags"
              :key="tag"
              size="x-small"
              variant="tonal"
            >
              {{ tag }}
            </v-chip>
          </div>
          <div class="feed-footer">
            <v-chip size="small" :color="impactColor(item.impact)" variant="tonal" prepend-icon="mdi-pulse">
              تأثير {{ item.impact }}
            </v-chip>
            <v-btn variant="text" prepend-icon="mdi-open-in-new" :to="item.link" target="_blank">
              متابعة الخبر
            </v-btn>
          </div>
        </article>
        <v-alert v-if="!feedArticles.length" type="info" class="mt-4" variant="tonal">
          لا توجد أخبار إضافية بعد العنوان الرئيسي.
        </v-alert>
      </div>

      <aside class="news-sidebar">
        <v-card class="sidebar-section">
          <v-card-title>أبرز العناوين</v-card-title>
          <v-divider />
          <v-list density="compact">
            <v-list-item
              v-for="item in topHeadlines"
              :key="item.id"
              :title="item.title"
              :subtitle="formatDate(item.publishedAt)"
              lines="two"
            >
              <template #prepend>
                <v-avatar size="32" color="primary" variant="tonal">
                  <span class="text-caption">{{ bankInitial(item.bank) }}</span>
                </v-avatar>
              </template>
              <template #append>
                <v-btn icon="mdi-open-in-new" variant="text" size="small" :to="item.link" target="_blank" />
              </template>
            </v-list-item>
            <v-list-item v-if="!topHeadlines.length" title="لا توجد عناوين" />
          </v-list>
        </v-card>

        <v-card class="sidebar-section" variant="tonal">
          <v-card-title>التصنيفات</v-card-title>
          <v-divider />
          <div class="category-pills">
            <v-chip
              v-for="cat in categorySummary"
              :key="cat.name"
              size="small"
              variant="outlined"
              prepend-icon="mdi-pound"
            >
              {{ cat.name }} ({{ cat.count }})
            </v-chip>
          </div>
        </v-card>

        <v-card class="sidebar-section" variant="tonal">
          <v-card-title>النشرة البريدية</v-card-title>
          <v-card-text>
            <p class="text-body-2 text-medium-emphasis mb-4">
              اشترك في موجز Ru'ya اليومي لتصلك أهم الأخبار المصرفية.
            </p>
            <v-text-field
              v-model="newsletterEmail"
              label="البريد الإلكتروني"
              type="email"
              prepend-inner-icon="mdi-email"
              hide-details
            />
            <v-btn block color="primary" class="mt-3" @click="subscribe">
              اشتراك
            </v-btn>
          </v-card-text>
        </v-card>
      </aside>
    </section>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({
  layout: "dashboard",
});

type NewsSource = "cbl" | "partner";
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  details: string;
  publishedAt: string;
  source: NewsSource;
  bank: string;
  category: string;
  impact: "مرتفع" | "متوسط" | "منخفض";
  tags: string[];
  link: string;
  timelineNote: string;
  cover?: string;
}

const search = ref("");
const sourceFilter = ref<NewsSource | "all">("all");
const categoryFilter = ref<string | null>(null);
const tagFilter = ref<string[]>([]);
const highlightCentral = ref(true);
const newsletterEmail = ref("");

const HERO_FALLBACK =
  "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1400&q=80";

const newsItems = ref<NewsItem[]>([
  {
    id: "n-001",
    title: "مصرف ليبيا المركزي يضخ سيولة إضافية للفروع الشرقية",
    summary:
      "أعلن المصرف عن إرسال شحنة سيولة بقيمة 500 مليون د.ل لدعم الفروع الواقعة في برقة بهدف تخفيف الضغط على عمليات السحب.",
    details:
      "تشمل الشحنة فروع مصرف الجمهورية والتجاري الوطني، مع متابعة رقمية لحركة الأموال عبر منصة Ru'ya لضمان وصول السيولة حسب الجدول.",
    publishedAt: "2025-11-15T09:00:00Z",
    source: "cbl",
    bank: "مصرف ليبيا المركزي",
    category: "سيولة",
    impact: "مرتفع",
    tags: ["سيولة", "فروع الشرق"],
    link: "https://cbl.gov.ly",
    timelineNote: "تم إرسال الشحنة الأولى إلى مطار بنينا.",
    cover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "n-002",
    title: "مصرف الجمهورية يطلق خدمة التحويل الفوري عبر تطبيقه",
    summary:
      "أطلق مصرف الجمهورية تحديثًا جديدًا يتيح التحويل بين الحسابات خلال 30 ثانية مع إشعارات لحظية داخل تطبيق الهاتف.",
    details:
      "الخدمة الجديدة متاحة لعملاء الشركات الصغيرة والمتوسطة مع حدود يومية مرنة، وتم تكاملها مع واجهة Ru'ya للتحقق من الامتثال.",
    publishedAt: "2025-11-14T13:30:00Z",
    source: "partner",
    bank: "مصرف الجمهورية",
    category: "تحول رقمي",
    impact: "متوسط",
    tags: ["تحويلات", "تطبيقات"],
    link: "https://www.aljomhoria.ly",
    timelineNote: "التطبيق متاح الآن على متجري iOS وAndroid.",
    cover: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "n-003",
    title: "تحديث أسعار الصرف الرسمية للأغراض التجارية",
    summary:
      "أصدر مصرف ليبيا المركزي نشرة جديدة لأسعار الصرف المعتمدة للمصارف المسجلة، مع توجيهات حول سقوف الاعتمادات المستندية.",
    details:
      "تتضمن النشرة ربطًا أسبوعيًا مع منصة Ru'ya لعرض الأسعار داخل أنظمة الفروع، إضافةً إلى آلية مراقبة للتقلبات اليومية.",
    publishedAt: "2025-11-13T08:15:00Z",
    source: "cbl",
    bank: "مصرف ليبيا المركزي",
    category: "سياسات نقدية",
    impact: "مرتفع",
    tags: ["أسعار الصرف", "اعتمادات"],
    link: "https://cbl.gov.ly/rates",
    timelineNote: "تم إشعار المصارف عبر القنوات الآمنة.",
    cover: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "n-004",
    title: "مصرف الصحارى يدشن برنامج تمويل الطاقة الشمسية",
    summary:
      "أعلن المصرف عن حزمة تمويلية بفائدة تفضيلية لمشروعات الطاقة الشمسية المنزلية مع فترة سماح تصل إلى 12 شهرًا.",
    details:
      "يستهدف البرنامج 2,000 عميل خلال المرحلة الأولى مع دعم فني من شركات معتمدة، ويرتبط بنظام مراقبة الأداء على منصة Ru'ya.",
    publishedAt: "2025-11-12T10:45:00Z",
    source: "partner",
    bank: "مصرف الصحارى",
    category: "تمويل",
    impact: "متوسط",
    tags: ["طاقة", "تمويل"],
    link: "https://www.saharabank.ly",
    timelineNote: "فتح باب التسجيل الإلكتروني للمرحلة الأولى.",
    cover: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "n-005",
    title: "تقرير الاستقرار المالي نصف السنوي",
    summary:
      "نشر مصرف ليبيا المركزي تقرير الاستقرار المالي متضمناً تحليلًا لمؤشرات المخاطر الائتمانية والسيولة لدى المصارف التجارية.",
    details:
      "التقرير يوصي بتعزيز اختبارات الضغط الربع سنوية وتكاملها مع بوابة Ru'ya لمراقبة مؤشرات السيولة اليومية.",
    publishedAt: "2025-11-10T15:20:00Z",
    source: "cbl",
    bank: "مصرف ليبيا المركزي",
    category: "تقارير",
    impact: "مرتفع",
    tags: ["تقارير", "حوكمة"],
    link: "https://cbl.gov.ly/reports",
    timelineNote: "تسليم نسخة للمصارف المشاركة في لجنة الامتثال.",
    cover: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "n-006",
    title: "مصرف الوحدة يعزز قبول المدفوعات اللاتلامسية",
    summary:
      "أضاف المصرف 1,200 جهاز POS يدعم المدفوعات اللاتلامسية في الفروع الغربية مع حملات توعوية للتجار.",
    details:
      "يشمل المشروع تدريب 300 تاجر على بوابة Ru'ya للتسويات اليومية، مع تقارير دورية حول نسب الاستخدام.",
    publishedAt: "2025-11-09T11:05:00Z",
    source: "partner",
    bank: "مصرف الوحدة",
    category: "قبول مدفوعات",
    impact: "منخفض",
    tags: ["POS", "مدفوعات"],
    link: "https://www.wahda.ly",
    timelineNote: "تم تركيب 400 جهاز في طرابلس كمرحلة أولى.",
    cover: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&q=80",
  },
]);

const sourceOptions = [
  { label: "كل المصادر", value: "all" },
  { label: "مصرف ليبيا المركزي", value: "cbl" },
  { label: "مصارف مسجلة", value: "partner" },
];

const categoryOptions = computed(() =>
  Array.from(new Set(newsItems.value.map((item) => item.category)))
);
const tagOptions = computed(() =>
  Array.from(new Set(newsItems.value.flatMap((item) => item.tags)))
);

const filteredNews = computed(() => {
  let list = newsItems.value.slice();

  if (sourceFilter.value !== "all") {
    list = list.filter((item) => item.source === sourceFilter.value);
  }

  if (categoryFilter.value) {
    list = list.filter((item) => item.category === categoryFilter.value);
  }

  if (tagFilter.value.length) {
    list = list.filter((item) => tagFilter.value.every((tag) => item.tags.includes(tag)));
  }

  const q = search.value.trim().toLowerCase();
  if (q) {
    list = list.filter((item) =>
      `${item.title} ${item.summary} ${item.details} ${item.category}`
        .toLowerCase()
        .includes(q)
    );
  }

  return list.sort((a, b) => {
    if (highlightCentral.value && a.source !== b.source) {
      return a.source === "cbl" ? -1 : 1;
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
});

const heroArticle = computed(() => filteredNews.value[0] ?? null);
const feedArticles = computed(() =>
  heroArticle.value ? filteredNews.value.slice(1) : filteredNews.value
);
const topHeadlines = computed(() => filteredNews.value.slice(0, 4));
const categorySummary = computed(() => {
  const map = new Map<string, number>();
  newsItems.value.forEach((item) => {
    map.set(item.category, (map.get(item.category) ?? 0) + 1);
  });
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
});
const heroStyle = computed(() => ({
  backgroundImage: `linear-gradient(135deg, rgba(10, 14, 28, 0.8), rgba(15, 23, 42, 0.75)), url(${heroArticle.value?.cover ?? HERO_FALLBACK})`,
}));

function sourceLabel(source: NewsSource) {
  return source === "cbl" ? "مصرف ليبيا المركزي" : "مصارف مسجلة";
}

function impactColor(level: NewsItem["impact"]) {
  if (level === "مرتفع") return "error";
  if (level === "متوسط") return "warning";
  return "success";
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("ar-LY", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(dateStr));
}

function bankInitial(name: string) {
  return name.trim().charAt(0) || "";
}

function resetFilters() {
  search.value = "";
  sourceFilter.value = "all";
  categoryFilter.value = null;
  tagFilter.value = [];
  highlightCentral.value = true;
}

function subscribe() {
  /* hook for notification subscription */
}

function refresh() {
  /* hook for refreshing news later */
}
</script>

<style scoped>
.news-page {
  direction: rtl;
  min-height: 100vh;
  padding: 24px clamp(16px, 4vw, 48px) 64px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.06), transparent 200px);
}

.news-hero {
  border-radius: 28px;
  min-height: 320px;
  margin-bottom: 32px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.news-hero.placeholder {
  background: rgba(var(--v-theme-surface-variant), 0.4);
}

.hero-overlay {
  padding: clamp(24px, 6vw, 56px);
  color: white;
  max-width: 720px;
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.hero-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.3;
}

.hero-summary {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 24px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-card {
  border-radius: 24px;
  padding: 8px 24px 16px;
  backdrop-filter: blur(8px);
  background: rgba(var(--v-theme-surface), 0.9);
  margin-bottom: 32px;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.news-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
  align-items: start;
}

.news-feed {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.feed-article {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.1);
  padding-bottom: 20px;
}

.feed-article h2 {
  font-size: 1.25rem;
  margin-bottom: 8px;
}

.feed-article p {
  color: rgba(var(--v-theme-on-background), 0.7);
  margin-bottom: 12px;
}

.feed-meta {
  display: flex;
  gap: 8px;
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-background), 0.6);
  margin-bottom: 8px;
}

.feed-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.feed-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.news-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-section {
  border-radius: 20px;
  border: 1px solid rgba(var(--v-border-color), 0.08);
}

.category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;
}

@media (max-width: 1200px) {
  .news-grid {
    grid-template-columns: 1fr;
  }

  .news-sidebar {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .sidebar-section {
    flex: 1 1 300px;
  }
}

@media (max-width: 600px) {
  .filter-card {
    padding: 8px 16px 16px;
  }

  .feed-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
