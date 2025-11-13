<template>
  <v-container fluid class="pa-0 bene-page" id="bene-page">
    <!-- App Bar -->
    <v-app-bar flat color="transparent" density="comfortable" class="px-4 py-2">
      <v-app-bar-title class="text-h6 font-weight-bold"
        >دعم المشاريع</v-app-bar-title
      >
      <v-spacer />
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-plus"
        @click="openCreate"
        >إضافة مشروع</v-btn
      >
    </v-app-bar>

    <!-- Filters Bar -->
    <div class="px-4 pb-2 d-flex align-center flex-wrap ga-3">
      <v-text-field
        v-model="search"
        variant="outlined"
        density="comfortable"
        hide-details
        prepend-inner-icon="mdi-magnify"
        placeholder="ابحث بالاسم، المدينة، الوسوم"
        class="min-w-56"
      />

      <v-select
        v-model="typeFilter"
        :items="typeOptions"
        item-title="label"
        item-value="value"
        label="نوع المشروع"
        variant="outlined"
        density="comfortable"
        hide-details
        clearable
        style="min-width: 160px"
      />

      <v-select
        v-model="categoryFilter"
        :items="categoryOptions"
        label="الفئة"
        variant="outlined"
        density="comfortable"
        hide-details
        clearable
        style="min-width: 200px"
      />

      <v-select
        v-model="cityFilter"
        :items="cityOptions"
        label="المدينة"
        variant="outlined"
        density="comfortable"
        hide-details
        clearable
        style="min-width: 180px"
      />

      <v-chip-group v-model="tagFilter" multiple selected-class="text-white">
        <v-chip value="favorite" variant="elevated" size="small">مفضل</v-chip>
        <v-chip value="urgent" variant="elevated" size="small">عاجل</v-chip>
        <v-chip value="ongoing" variant="elevated" size="small"
          >قيد التنفيذ</v-chip
        >
        <v-chip value="completed" variant="elevated" size="small">مكتمل</v-chip>
      </v-chip-group>

      <v-spacer />
      <v-switch
        v-model="compact"
        inset
        hide-details
        :label="compact ? 'عرض مضغوط' : 'عرض واسع'"
      />
      <v-btn variant="tonal" prepend-icon="mdi-filter-off" @click="resetFilters"
        >تصفير</v-btn
      >
    </div>

    <!-- Content: Cards grid + optional table view toggle -->
    <v-container fluid class="px-4 py-0">
      <v-tabs v-model="viewMode" density="comfortable" class="mb-4">
        <v-tab value="cards" prepend-icon="mdi-view-grid-outline">بطاقات</v-tab>
        <v-tab value="table" prepend-icon="mdi-table">جدول</v-tab>
      </v-tabs>

      <v-window v-model="viewMode" class="mt-1">
        <!-- Cards Directory -->
        <v-window-item value="cards">
          <v-row :dense="compact" class="cards-grid">
            <v-col
              v-for="b in paged"
              :key="b.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  rounded="lg"
                  :elevation="isHovering ? 12 : 2"
                  height="380"
                  class="bene-card d-flex flex-column"
                  @click="openProjectDetails(b)"
                >
                  <!-- Card Image/Avatar Section -->
                  <div class="card-image-wrapper position-relative">
                    <v-img
                      :src="b.avatar || placeholder(b)"
                      height="140"
                      cover
                      class="card-main-image"
                    />
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      class="fav-btn"
                      @click.stop="toggleFav(b)"
                    >
                      <v-icon
                        :icon="isFav(b.id) ? 'mdi-heart' : 'mdi-heart-outline'"
                        :color="isFav(b.id) ? 'error' : 'white'"
                      />
                    </v-btn>
                  </div>

                  <!-- Card Title -->
                  <v-card-title class="text-subtitle-1 pb-1">
                    {{ b.name }}
                  </v-card-title>

                  <!-- Card Subtitle -->
                  <v-card-subtitle class="text-caption pb-2">
                    {{ b.category || "عام" }} • {{ b.city }}
                  </v-card-subtitle>

                  <!-- Card Content -->
                  <v-card-text class="flex-grow-1 pt-2">
                    <div class="info-block mb-2">
                      <div class="text-caption text-medium-emphasis mb-1">
                        الهدف المالي
                      </div>
                      <div class="text-body-2 mono text-truncate">
                        {{ formatIBAN(b.iban) }}
                      </div>
                    </div>

                    <div class="d-flex align-center ga-1 flex-wrap">
                      <v-chip
                        v-for="t in b.tags"
                        :key="t"
                        size="x-small"
                        variant="tonal"
                        label
                      >
                        {{ tagLabel(t) }}
                      </v-chip>
                    </div>
                  </v-card-text>

                  <!-- Card Actions -->
                  <v-card-actions class="mt-auto pt-0">
                    <v-spacer />
                    <v-btn
                      size="small"
                      variant="text"
                      color="primary"
                      prepend-icon="mdi-hand-heart"
                      @click.stop="quickTransfer(b)"
                    >
                      دعم المشروع
                    </v-btn>
                    <v-spacer />
                    <!-- Hidden action buttons (kept for functionality) -->
                    <v-btn
                      v-show="false"
                      icon
                      size="small"
                      variant="text"
                      @click.stop="openEdit(b)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      v-show="false"
                      icon
                      size="small"
                      variant="text"
                      color="error"
                      @click.stop="confirmDelete(b)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>

          <div v-if="!filtered.length" class="text-center py-10">
            <v-icon size="40" class="mb-2">mdi-folder-search</v-icon>
            <div class="text-subtitle-1 font-weight-medium mb-1">
              لا توجد مشاريع مطابقة
            </div>
            <div class="text-medium-emphasis mb-4">
              جرّب تعديل/إزالة بعض الفلاتر أو البحث بكلمة أوسع.
            </div>
            <v-btn
              variant="tonal"
              prepend-icon="mdi-filter-off"
              @click="resetFilters"
              >إزالة الفلاتر</v-btn
            >
          </div>

          <div v-if="pages > 1" class="d-flex justify-center mt-6">
            <v-pagination
              v-model="page"
              :length="pages"
              total-visible="7"
              rounded="circle"
            />
          </div>
        </v-window-item>

        <!-- Table View -->
        <v-window-item value="table">
          <v-card class="rounded-2xl" variant="elevated">
            <v-data-table
              :headers="headers"
              :items="filtered"
              item-key="id"
              class="bene-table"
              fixed-header
              height="70vh"
              :sort-by="[{ key: 'name', order: 'asc' }]"
              :search="search"
              show-select
            >
              <template #item.iban="{ item }">
                <code class="mono">{{ formatIBAN(item.iban) }}</code>
              </template>
              <template #item.tags="{ item }">
                <div class="d-flex ga-1 flex-wrap">
                  <v-chip
                    v-for="t in item.tags"
                    :key="t"
                    size="x-small"
                    variant="tonal"
                    >{{ tagLabel(t) }}</v-chip
                  >
                </div>
              </template>
              <template #item.actions="{ item }">
                <div class="table-actions-group">
                  <v-btn
                    size="x-small"
                    color="primary"
                    variant="flat"
                    @click="quickTransfer(item)"
                    >دعم</v-btn
                  >
                  <v-btn
                    size="x-small"
                    variant="text"
                    icon
                    @click="openEdit(item)"
                    ><v-icon>mdi-pencil</v-icon></v-btn
                  >
                  <v-btn
                    size="x-small"
                    variant="text"
                    icon
                    @click="confirmDelete(item)"
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-window-item>
      </v-window>
    </v-container>

    <!-- Create / Edit Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      location="right"
      temporary
      width="440"
      class="pa-0"
    >
      <v-toolbar flat>
        <v-toolbar-title class="text-subtitle-1 font-weight-bold">{{
          editing ? "تعديل مشروع" : "إضافة مشروع"
        }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon variant="text" @click="drawer = false"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-toolbar>
      <v-divider />
      <div class="pa-4">
        <v-form ref="formRef" @submit.prevent="save" validate-on="input">
          <v-text-field
            v-model="form.name"
            :rules="[req]"
            label="اسم المشروع"
            prepend-inner-icon="mdi-folder-star"
          />
          <v-select
            v-model="form.type"
            :items="typeOptions"
            item-title="label"
            item-value="value"
            :rules="[req]"
            label="نوع المشروع"
            prepend-inner-icon="mdi-shape"
          />
          <v-text-field
            v-model="form.category"
            :rules="[req]"
            label="الفئة"
            prepend-inner-icon="mdi-tag"
          />
          <v-text-field
            v-model="form.city"
            label="المدينة"
            prepend-inner-icon="mdi-map-marker"
          />
          <v-text-field
            v-model="form.iban"
            :rules="[req, ibanRule]"
            label="حساب الاستقبال (IBAN)"
            prepend-inner-icon="mdi-card-bulleted-outline"
            hint="تحقق فوري من صحة الأرقام"
            persistent-hint
          />
          <v-text-field
            v-model="form.account"
            label="معلومات إضافية (اختياري)"
            prepend-inner-icon="mdi-information"
          />
          <v-combobox
            v-model="form.tags"
            :items="tagOptions"
            multiple
            chips
            label="وسوم"
            prepend-inner-icon="mdi-tag-multiple"
          />
          <v-textarea
            v-model="form.note"
            label="ملاحظة"
            auto-grow
            rows="2"
            prepend-inner-icon="mdi-note-text-outline"
          />

          <div class="d-flex align-center justify-space-between mt-3">
            <v-switch
              v-model="form.favorite"
              inset
              hide-details
              :label="form.favorite ? 'مفضلة' : 'إضافة للمفضلة'"
            />
            <div class="d-flex ga-2">
              <v-btn variant="text" @click="drawer = false">إلغاء</v-btn>
              <v-btn color="primary" type="submit" :loading="saving">حفظ</v-btn>
            </div>
          </div>
        </v-form>
      </div>
    </v-navigation-drawer>

    <!-- Quick Transfer Dialog -->
    <v-dialog v-model="transferOpen" max-width="520">
      <v-card>
        <v-card-title class="d-flex align-center ga-2"
          ><v-icon>mdi-hand-heart</v-icon>دعم المشروع</v-card-title
        >
        <v-card-text>
          <div class="text-medium-emphasis mb-2">
            إلى: <strong>{{ activeTarget?.name }}</strong> —
            <span class="mono">{{ formatIBAN(activeTarget?.iban || "") }}</span>
          </div>
          <v-form
            ref="txRef"
            @submit.prevent="sendTransfer"
            validate-on="input"
          >
            <v-select
              v-model="tx.currency"
              :items="currencies"
              label="العملة"
              :rules="[req]"
            />
            <v-text-field
              v-model.number="tx.amount"
              type="number"
              min="0"
              step="0.01"
              :rules="[positive]"
              label="المبلغ"
            />
            <v-text-field v-model="tx.note" label="ملاحظة (اختياري)" />
            <div class="d-flex justify-end ga-2 mt-2">
              <v-btn variant="text" @click="transferOpen = false">إلغاء</v-btn>
              <v-btn color="primary" type="submit" :loading="sending"
                >إرسال</v-btn
              >
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Confirm -->
    <v-dialog v-model="confirmOpen" max-width="420">
      <v-card>
        <v-card-title class="d-flex align-center ga-2"
          ><v-icon color="error">mdi-alert</v-icon> تأكيد الحذف</v-card-title
        >
        <v-card-text
          >سيتم حذف المشروع <strong>{{ activeTarget?.name }}</strong
          >. لا يمكن التراجع عن هذه العملية.</v-card-text
        >
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="confirmOpen = false">إلغاء</v-btn>
          <v-btn color="error" @click="doDelete" :loading="deleting">حذف</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Project Details Modal -->
    <v-dialog v-model="detailsOpen" max-width="800" scrollable>
      <v-card v-if="selectedProject">
        <v-card-title class="d-flex align-center pa-4 bg-primary text-white">
          <v-icon size="large" class="ml-2">mdi-folder-star</v-icon>
          <span class="text-h6">{{ selectedProject.name }}</span>
          <v-spacer />
          <v-btn icon variant="text" color="white" @click="detailsOpen = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4" style="max-height: 600px">
          <!-- Project Header Image -->
          <v-img
            :src="selectedProject.avatar || placeholder(selectedProject)"
            height="200"
            cover
            class="rounded-lg mb-4"
          />

          <!-- Project Info Grid -->
          <v-row dense class="mb-4">
            <v-col cols="12" sm="6">
              <div class="info-item">
                <div class="text-caption text-medium-emphasis mb-1">
                  <v-icon size="small" class="ml-1">mdi-shape</v-icon>
                  نوع المشروع
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ getTypeLabel(selectedProject.type) }}
                </div>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="info-item">
                <div class="text-caption text-medium-emphasis mb-1">
                  <v-icon size="small" class="ml-1">mdi-tag</v-icon>
                  الفئة
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ selectedProject.category }}
                </div>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="info-item">
                <div class="text-caption text-medium-emphasis mb-1">
                  <v-icon size="small" class="ml-1">mdi-map-marker</v-icon>
                  المدينة
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ selectedProject.city }}
                </div>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="info-item">
                <div class="text-caption text-medium-emphasis mb-1">
                  <v-icon size="small" class="ml-1">mdi-calendar</v-icon>
                  تاريخ البداية
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ selectedProject.startDate }}
                </div>
              </div>
            </v-col>
          </v-row>

          <!-- Description -->
          <div class="mb-4">
            <div class="text-subtitle-2 font-weight-bold mb-2">
              <v-icon size="small" class="ml-1">mdi-text</v-icon>
              وصف المشروع
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ selectedProject.description }}
            </div>
          </div>

          <!-- Financial Progress -->
          <v-card variant="tonal" class="mb-4">
            <v-card-text>
              <div class="text-subtitle-2 font-weight-bold mb-3">
                <v-icon size="small" class="ml-1">mdi-cash-multiple</v-icon>
                التقدم المالي
              </div>
              <v-row dense>
                <v-col cols="12" sm="4">
                  <div class="text-caption text-medium-emphasis">
                    الهدف المالي
                  </div>
                  <div class="text-h6 font-weight-bold text-primary">
                    {{ formatCurrency(selectedProject.targetAmount) }}
                  </div>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="text-caption text-medium-emphasis">
                    المبلغ المحصل
                  </div>
                  <div class="text-h6 font-weight-bold text-success">
                    {{ formatCurrency(selectedProject.collectedAmount) }}
                  </div>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="text-caption text-medium-emphasis">المتبقي</div>
                  <div class="text-h6 font-weight-bold text-warning">
                    {{
                      formatCurrency(
                        (selectedProject.targetAmount || 0) -
                          (selectedProject.collectedAmount || 0)
                      )
                    }}
                  </div>
                </v-col>
              </v-row>
              <v-progress-linear
                :model-value="selectedProject.progress"
                color="success"
                height="12"
                rounded
                class="mt-3"
              >
                <template #default>
                  <span class="text-caption font-weight-bold"
                    >{{ selectedProject.progress }}%</span
                  >
                </template>
              </v-progress-linear>
            </v-card-text>
          </v-card>

          <!-- Bank Account Info -->
          <v-card variant="outlined" class="mb-4">
            <v-card-text>
              <div class="text-subtitle-2 font-weight-bold mb-2">
                <v-icon size="small" class="ml-1">mdi-bank</v-icon>
                معلومات الحساب البنكي
              </div>
              <div class="text-caption text-medium-emphasis mb-1">IBAN</div>
              <code
                class="mono text-body-2 pa-2 bg-grey-lighten-4 rounded d-inline-block"
              >
                {{ formatIBAN(selectedProject.iban) }}
              </code>
            </v-card-text>
          </v-card>

          <!-- Tags -->
          <div class="mb-4">
            <div class="text-subtitle-2 font-weight-bold mb-2">
              <v-icon size="small" class="ml-1">mdi-tag-multiple</v-icon>
              الوسوم
            </div>
            <div class="d-flex ga-2 flex-wrap">
              <v-chip
                v-for="t in selectedProject.tags"
                :key="t"
                size="small"
                variant="tonal"
                :color="getTagColor(t)"
              >
                {{ tagLabel(t) }}
              </v-chip>
            </div>
          </div>

          <!-- Additional Info -->
          <v-expansion-panels variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon size="small" class="ml-2">mdi-information</v-icon>
                معلومات إضافية
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="text-body-2">
                  <div class="mb-2">
                    <strong>تاريخ النهاية المتوقع:</strong>
                    {{ selectedProject.endDate }}
                  </div>
                  <div class="mb-2">
                    <strong>عدد المساهمين:</strong>
                    {{ selectedProject.contributors }}
                  </div>
                  <div class="mb-2" v-if="selectedProject.note">
                    <strong>ملاحظات:</strong> {{ selectedProject.note }}
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-btn
            variant="text"
            prepend-icon="mdi-heart"
            @click="toggleFav(selectedProject)"
          >
            {{
              isFav(selectedProject.id) ? "إزالة من المفضلة" : "إضافة للمفضلة"
            }}
          </v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-hand-heart"
            @click="quickTransferFromDetails"
          >
            دعم المشروع
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

definePageMeta({
  layout: "dashboard",
});

/** Types **/
type BeneType = "charity" | "education" | "health" | "infrastructure";
interface Beneficiary {
  id: string;
  name: string;
  type: BeneType;
  category: string;
  city?: string;
  iban: string;
  account?: string;
  tags: string[];
  favorite?: boolean;
  avatar?: string;
  note?: string;
  description?: string;
  targetAmount?: number;
  collectedAmount?: number;
  progress?: number;
  startDate?: string;
  endDate?: string;
  contributors?: number;
}

/** State **/
const viewMode = ref<"cards" | "table">("cards");
const compact = ref(false);
const search = ref("");
const typeFilter = ref<BeneType | null>(null);
const categoryFilter = ref<string | null>(null);
const cityFilter = ref<string | null>(null);
const tagFilter = ref<string[]>([]);

const currencies = ["LYD", "USD", "EUR"];

/** Sample Data **/
const benes = ref<Beneficiary[]>([
  mk(
    "مشروع تطوير التعليم الرقمي",
    "education",
    "تعليم وتدريب",
    "طرابلس",
    "LY22RIBL00000000000012345678",
    ["urgent"],
    "مشروع يهدف إلى توفير بنية تحتية رقمية متكاملة للمدارس والجامعات في ليبيا، مع تدريب المعلمين على استخدام التقنيات الحديثة في التعليم.",
    500000,
    325000,
    "2024-01-15",
    "2025-06-30",
    156
  ),
  mk(
    "بناء مستشفى الأمل",
    "health",
    "صحة ورعاية",
    "بنغازي",
    "LY29WABA00000000001234567890",
    ["favorite", "ongoing"],
    "إنشاء مستشفى حديث متخصص في علاج الأورام والأمراض المزمنة، مجهز بأحدث المعدات الطبية وطاقم طبي مؤهل.",
    2000000,
    1450000,
    "2023-09-01",
    "2025-12-31",
    423
  ),
  mk(
    "مبادرة الطرق الآمنة",
    "infrastructure",
    "بنية تحتية",
    "مصراتة",
    "LY12NCB00000000000098765432",
    ["ongoing"],
    "مشروع لتطوير وتحسين شبكة الطرق الرئيسية والجسور، مع تركيب أنظمة إضاءة حديثة وكاميرات مراقبة لضمان سلامة المرور.",
    1500000,
    900000,
    "2024-03-20",
    "2025-09-15",
    287
  ),
  mk(
    "دعم الأيتام والمحتاجين",
    "charity",
    "إنساني واجتماعي",
    "طرابلس",
    "LY53SARA00000000000012340001",
    ["favorite", "urgent"],
    "برنامج شامل لرعاية الأيتام والأسر المحتاجة، يشمل توفير المسكن، التعليم، الرعاية الصحية، والدعم النفسي والاجتماعي.",
    750000,
    620000,
    "2024-01-01",
    "2025-12-31",
    534
  ),
]);

function mk(
  name: string,
  type: BeneType,
  category: string,
  city: string,
  iban: string,
  tags: string[],
  description: string,
  targetAmount: number,
  collectedAmount: number,
  startDate: string,
  endDate: string,
  contributors: number
): Beneficiary {
  const progress = Math.round((collectedAmount / targetAmount) * 100);
  return {
    id: Math.random().toString(36).slice(2),
    name,
    type,
    category,
    city,
    iban,
    tags,
    favorite: tags.includes("favorite"),
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      name
    )}`,
    description,
    targetAmount,
    collectedAmount,
    progress,
    startDate,
    endDate,
    contributors,
  };
}

/** Options **/
const typeOptions = [
  { label: "خيري", value: "charity" },
  { label: "تعليمي", value: "education" },
  { label: "صحي", value: "health" },
  { label: "بنية تحتية", value: "infrastructure" },
];
const categoryOptions = computed(() =>
  Array.from(new Set(benes.value.map((b) => b.category)))
);
const cityOptions = computed(() =>
  Array.from(
    new Set(benes.value.map((b) => b.city).filter(Boolean) as string[])
  )
);
const tagOptions = ["favorite", "urgent", "ongoing", "completed"];

/** Filtering **/
const filtered = computed(() => {
  let list = benes.value.slice();
  const q = search.value.trim().toLowerCase();
  if (q)
    list = list.filter((b) =>
      `${b.name} ${b.category} ${b.city ?? ""} ${b.tags.join(" ")}`
        .toLowerCase()
        .includes(q)
    );
  if (typeFilter.value) list = list.filter((b) => b.type === typeFilter.value);
  if (categoryFilter.value)
    list = list.filter((b) => b.category === categoryFilter.value);
  if (cityFilter.value) list = list.filter((b) => b.city === cityFilter.value);
  if (tagFilter.value.length)
    list = list.filter((b) => tagFilter.value.every((t) => b.tags.includes(t)));
  list.sort(
    (a, b) =>
      Number(b.favorite) - Number(a.favorite) ||
      a.name.localeCompare(b.name, "ar")
  );
  return list;
});

/** Pagination for cards **/
const page = ref(1);
const pageSize = ref(12);
const pages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / pageSize.value))
);
const paged = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filtered.value.slice(start, start + pageSize.value);
});

/** Table headers **/
const headers = [
  { title: "اسم المشروع", key: "name", sortable: true },
  { title: "النوع", key: "type", sortable: true },
  { title: "الفئة", key: "category", sortable: true },
  { title: "المدينة", key: "city", sortable: true },
  { title: "حساب الاستقبال", key: "iban", sortable: false },
  { title: "وسوم", key: "tags", sortable: false },
  { title: "", key: "actions", sortable: false, width: 160 },
];

/** Favorites **/
const favs = ref<Set<string>>(new Set());
function toggleFav(b: Beneficiary) {
  const v = favs.value;
  v.has(b.id) ? v.delete(b.id) : v.add(b.id);
  b.favorite = v.has(b.id);
  if (b.favorite && !b.tags.includes("favorite")) b.tags.push("favorite");
}
function isFav(id: string) {
  return favs.value.has(id);
}

/** Create/Edit **/
const drawer = ref(false);
const editing = ref(false);
const formRef = ref();
const form = ref<Partial<Beneficiary>>({
  name: "",
  type: "charity",
  category: "",
  city: "",
  iban: "",
  account: "",
  tags: [],
  note: "",
  favorite: false,
});
const saving = ref(false);

function openCreate() {
  editing.value = false;
  form.value = {
    name: "",
    type: "charity",
    category: "",
    city: "",
    iban: "",
    account: "",
    tags: [],
    note: "",
    favorite: false,
  };
  drawer.value = true;
}
function openEdit(b: Beneficiary) {
  editing.value = true;
  form.value = { ...b };
  drawer.value = true;
}
async function save() {
  // validate
  const ok = await formRef.value.validate();
  if (!ok.valid) return;
  saving.value = true;
  setTimeout(() => {
    if (editing.value) {
      const i = benes.value.findIndex((x) => x.id === form.value.id);
      if (i > -1)
        benes.value[i] = { ...(benes.value[i] as any), ...(form.value as any) };
    } else {
      benes.value.unshift({
        ...(form.value as any),
        id: Math.random().toString(36).slice(2),
      });
    }
    saving.value = false;
    drawer.value = false;
  }, 400);
}

/** Quick transfer **/
const transferOpen = ref(false);
const txRef = ref();
const activeTarget = ref<Beneficiary | null>(null);
const tx = ref<{
  currency: string | null;
  amount: number | null;
  note?: string;
}>({ currency: null, amount: null, note: "" });
const sending = ref(false);
function quickTransfer(b: Beneficiary) {
  activeTarget.value = b;
  tx.value = { currency: currencies[0] || "LYD", amount: null, note: "" };
  transferOpen.value = true;
}
async function sendTransfer() {
  const ok = await txRef.value.validate();
  if (!ok.valid) return;
  sending.value = true;
  setTimeout(() => {
    sending.value = false;
    transferOpen.value = false;
  }, 600);
}

/** Delete **/
const confirmOpen = ref(false);
const active = ref<Beneficiary | null>(null);
const deleting = ref(false);
function confirmDelete(b: Beneficiary) {
  active.value = b;
  confirmOpen.value = true;
}
function doDelete() {
  if (!active.value) return;
  deleting.value = true;
  setTimeout(() => {
    benes.value = benes.value.filter((x) => x.id !== active.value!.id);
    deleting.value = false;
    confirmOpen.value = false;
  }, 400);
}

/** Project Details Modal **/
const detailsOpen = ref(false);
const selectedProject = ref<Beneficiary | null>(null);

function openProjectDetails(project: Beneficiary) {
  selectedProject.value = project;
  detailsOpen.value = true;
}

function quickTransferFromDetails() {
  if (selectedProject.value) {
    detailsOpen.value = false;
    quickTransfer(selectedProject.value);
  }
}

/** Validation rules (inline per NN/g) **/
const req = (v: any) => !!v || v === 0 || "إلزامي";
const positive = (v: any) => v > 0 || "أدخل مبلغًا صحيحًا";
const ibanRule = (v: string) => validateIBAN(v) || "IBAN غير صالح";

/** IBAN utils (format + basic mod97) **/
function normalizeIBAN(iban: string) {
  return (iban || "").replace(/\s+/g, "").toUpperCase();
}
function formatIBAN(iban: string) {
  const s = normalizeIBAN(iban);
  return s.replace(/(.{4})/g, "$1 ").trim();
}
function validateIBAN(iban: string) {
  const s = normalizeIBAN(iban);
  if (!/^[A-Z0-9]+$/.test(s) || s.length < 15 || s.length > 34) return false;
  // Move first 4 chars to end and convert letters to numbers (A=10..Z=35)
  const re = s.slice(4) + s.slice(0, 4);
  let num = "";
  for (const ch of re)
    num += ch >= "A" && ch <= "Z" ? (ch.charCodeAt(0) - 55).toString() : ch;
  // mod97 stepwise to avoid big integers
  let remainder = 0;
  for (let i = 0; i < num.length; i += 9) {
    remainder = Number(String(remainder) + num.slice(i, i + 9)) % 97;
  }
  return remainder === 1;
}

/** Helpers **/
function tagLabel(t: string) {
  return t === "favorite"
    ? "مفضل"
    : t === "urgent"
    ? "عاجل"
    : t === "ongoing"
    ? "قيد التنفيذ"
    : "مكتمل";
}
function placeholder(b: Beneficiary) {
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
    b.name
  )}`;
}
function resetFilters() {
  search.value = "";
  typeFilter.value = null;
  categoryFilter.value = null;
  cityFilter.value = null;
  tagFilter.value = [];
}

function getTypeLabel(type: BeneType) {
  const option = typeOptions.find((opt) => opt.value === type);
  return option ? option.label : type;
}

function formatCurrency(amount?: number) {
  if (!amount) return "0 LYD";
  return new Intl.NumberFormat("ar-LY", {
    style: "currency",
    currency: "LYD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getTagColor(tag: string) {
  switch (tag) {
    case "favorite":
      return "error";
    case "urgent":
      return "warning";
    case "ongoing":
      return "info";
    case "completed":
      return "success";
    default:
      return "default";
  }
}

onMounted(() => {
  /* hook for server fetching later */
});
</script>

<style scoped>
.bene-page {
  direction: rtl;
}

/* Fix container spacing */
.bene-page :deep(.v-container) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

/* Cards grid proper spacing */
.cards-grid {
  padding-top: 8px;
  padding-bottom: 24px;
}

.min-w-56 {
  min-width: 320px;
}
.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}

/* Card Styling - same as users page with animated borders and elevation */
.bene-card {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Remove Vuetify's default hover overlay */
.bene-card :deep(.v-card__overlay) {
  display: none !important;
  opacity: 0 !important;
}

.bene-card::before,
.bene-card::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  background-color: rgb(var(--v-theme-primary));
  transition: width 0.3s ease-out;
  z-index: 10;
}

.bene-card::before {
  top: 0;
  left: 0;
}

.bene-card::after {
  bottom: 0;
  right: 0;
}

.bene-card:hover::before,
.bene-card:hover::after {
  width: 100%;
}

/* Image Wrapper with zoom effect */
.card-image-wrapper {
  position: relative;
  overflow: hidden;
  height: 140px;
}

.card-main-image {
  transition: transform 0.3s ease;
}

.bene-card:hover .card-main-image {
  transform: scale(1.08);
}

/* Favorite Button */
.fav-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.fav-btn:hover {
  background: rgba(0, 0, 0, 0.5) !important;
}

/* Info Block */
.info-block {
  padding: 8px 12px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 8px;
}

/* Empty state spacing */
.text-center.py-10 {
  padding-top: 2.5rem !important;
  padding-bottom: 2.5rem !important;
}

/* Pagination spacing */
.d-flex.justify-center.mt-6 {
  margin-top: 1.5rem !important;
  margin-bottom: 1.5rem !important;
}

/* Table Styling */
.bene-table :deep(thead th) {
  background: #fafafa;
}

/* Modal Info Items */
.info-item {
  padding: 12px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 8px;
  min-height: 70px;
}

/* Modal styling */
.bg-primary {
  background-color: rgb(var(--v-theme-primary)) !important;
}

.bg-grey-lighten-4 {
  background-color: #f5f5f5;
}
</style>

<!--
USAGE
- احفظ الملف باسم: pages/beneficiaries.vue
- افتح: /beneficiaries
- الميزات: صفحة دعم المشاريع مع شبكة بطاقات + جدول، بحث/فلاتر، إنشاء/تعديل في درج، دعم المشروع، تحقق IBAN (mod97) وتنسيق، مفضلة/وسوم، حوار حذف مؤكد.
- تأثير hover: zoom على الصورة فقط بدون تأثيرات على الكارد.
- للتكامل مع API: استبدل benes[] بنداءات CRUD (GET/POST/PATCH/DELETE)، وفعّل server-side data-table عند الحاجة.
-->
