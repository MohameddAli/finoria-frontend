<template>
  <v-container fluid class="pa-0 bene-page" id="bene-page">
    <!-- App Bar -->
    <v-app-bar flat color="transparent" density="comfortable" class="px-4 py-2">
      <v-app-bar-title class="text-h6 font-weight-bold"
        >المستفيدون وجهات التحويل</v-app-bar-title
      >
      <v-spacer />
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-plus"
        @click="openCreate"
        >إضافة مستفيد</v-btn
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
        placeholder="ابحث بالاسم، البنك، المدينة، الوسوم"
        class="min-w-56"
      />

      <v-select
        v-model="typeFilter"
        :items="typeOptions"
        item-title="label"
        item-value="value"
        label="النوع"
        variant="outlined"
        density="comfortable"
        hide-details
        clearable
        style="min-width: 160px"
      />

      <v-select
        v-model="bankFilter"
        :items="bankOptions"
        label="البنك"
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
        <v-chip value="favorite" variant="elevated" size="small">مفضلة</v-chip>
        <v-chip value="frequent" variant="elevated" size="small">متكرر</v-chip>
        <v-chip value="business" variant="elevated" size="small">شركة</v-chip>
        <v-chip value="individual" variant="elevated" size="small">فرد</v-chip>
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
    <v-container fluid class="px-4 pb-8">
      <v-tabs v-model="viewMode" density="comfortable" class="mb-4">
        <v-tab value="cards" prepend-icon="mdi-account-multiple-outline"
          >بطاقات</v-tab
        >
        <v-tab value="table" prepend-icon="mdi-table">جدول</v-tab>
      </v-tabs>

      <v-window v-model="viewMode" class="mt-1">
        <!-- Cards Directory -->
        <v-window-item value="cards">
          <v-row :dense="compact">
            <v-col
              v-for="b in paged"
              :key="b.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-hover v-slot="{ isHovering, props: hoverProps }">
                <v-card 
                  v-bind="hoverProps"
                  rounded="lg" 
                  :elevation="isHovering ? 12 : 2" 
                  height="380" 
                  class="bene-card d-flex flex-column"
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
                  {{ b.bank }} • {{ b.city }}
                </v-card-subtitle>

                <!-- Card Content -->
                <v-card-text class="flex-grow-1 pt-2">
                  <div class="info-block mb-2">
                    <div class="text-caption text-medium-emphasis mb-1">IBAN</div>
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
                  <v-btn
                    size="small"
                    variant="text"
                    color="primary"
                    prepend-icon="mdi-hand-heart"
                    @click="quickTransfer(b)"
                  >
                    دعم المشروع
                  </v-btn>
                  <v-spacer />
                  <v-btn 
                    icon 
                    size="small" 
                    variant="text" 
                    @click="openEdit(b)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    color="error"
                    @click="confirmDelete(b)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
              </v-hover>
            </v-col>
          </v-row>

          <div v-if="!filtered.length" class="text-center py-10">
            <v-icon size="40" class="mb-2">mdi-account-search</v-icon>
            <div class="text-subtitle-1 font-weight-medium mb-1">
              لا توجد نتائج مطابقة
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
                    >تحويل</v-btn
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
          editing ? "تعديل مستفيد" : "إضافة مستفيد"
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
            label="الاسم"
            prepend-inner-icon="mdi-account"
          />
          <v-select
            v-model="form.type"
            :items="typeOptions"
            item-title="label"
            item-value="value"
            :rules="[req]"
            label="النوع"
            prepend-inner-icon="mdi-shape"
          />
          <v-text-field
            v-model="form.bank"
            :rules="[req]"
            label="البنك"
            prepend-inner-icon="mdi-bank"
          />
          <v-text-field
            v-model="form.city"
            label="المدينة"
            prepend-inner-icon="mdi-map-marker"
          />
          <v-text-field
            v-model="form.iban"
            :rules="[req, ibanRule]"
            label="IBAN"
            prepend-inner-icon="mdi-card-bulleted-outline"
            hint="تحقق فوري من صحة الأرقام"
            persistent-hint
          />
          <v-text-field
            v-model="form.account"
            label="رقم الحساب (اختياري)"
            prepend-inner-icon="mdi-numeric"
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
          >سيتم حذف المستفيد <strong>{{ activeTarget?.name }}</strong
          >. لا يمكن التراجع عن هذه العملية.</v-card-text
        >
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="confirmOpen = false">إلغاء</v-btn>
          <v-btn color="error" @click="doDelete" :loading="deleting">حذف</v-btn>
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
type BeneType = "individual" | "business";
interface Beneficiary {
  id: string;
  name: string;
  type: BeneType;
  bank: string;
  city?: string;
  iban: string;
  account?: string;
  tags: string[];
  favorite?: boolean;
  avatar?: string;
  note?: string;
}

/** State **/
const viewMode = ref<"cards" | "table">("cards");
const compact = ref(false);
const search = ref("");
const typeFilter = ref<BeneType | null>(null);
const bankFilter = ref<string | null>(null);
const cityFilter = ref<string | null>(null);
const tagFilter = ref<string[]>([]);

const currencies = ["LYD", "USD", "EUR"];

/** Sample Data **/
const benes = ref<Beneficiary[]>([
  mk(
    "أحمد عمر",
    "individual",
    "مصرف الجمهورية",
    "طرابلس",
    "LY22RIBL00000000000012345678",
    ["frequent"]
  ),
  mk(
    "شركة الرفاق",
    "business",
    "مصرف الوحدة",
    "بنغازي",
    "LY29WABA00000000001234567890",
    ["business", "favorite"]
  ),
  mk(
    "سالم الهادي",
    "individual",
    "التجاري الوطني",
    "مصراتة",
    "LY12NCB00000000000098765432",
    ["individual"]
  ),
  mk(
    "LibyTech LLC",
    "business",
    "مصرف الصحارى",
    "طرابلس",
    "LY53SARA00000000000012340001",
    ["business"]
  ),
]);

function mk(
  name: string,
  type: BeneType,
  bank: string,
  city: string,
  iban: string,
  tags: string[]
): Beneficiary {
  const projectImages = [
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
  ];
  const randomImage = projectImages[Math.floor(Math.random() * projectImages.length)];
  
  return {
    id: Math.random().toString(36).slice(2),
    name,
    type,
    bank,
    city,
    iban,
    tags,
    favorite: tags.includes("favorite"),
    avatar: randomImage,
  };
}

/** Options **/
const typeOptions = [
  { label: "فرد", value: "individual" },
  { label: "شركة", value: "business" },
];
const bankOptions = computed(() =>
  Array.from(new Set(benes.value.map((b) => b.bank)))
);
const cityOptions = computed(() =>
  Array.from(
    new Set(benes.value.map((b) => b.city).filter(Boolean) as string[])
  )
);
const tagOptions = ["favorite", "frequent", "business", "individual"];

/** Filtering **/
const filtered = computed(() => {
  let list = benes.value.slice();
  const q = search.value.trim().toLowerCase();
  if (q)
    list = list.filter((b) =>
      `${b.name} ${b.bank} ${b.city ?? ""} ${b.tags.join(" ")}`
        .toLowerCase()
        .includes(q)
    );
  if (typeFilter.value) list = list.filter((b) => b.type === typeFilter.value);
  if (bankFilter.value) list = list.filter((b) => b.bank === bankFilter.value);
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
  { title: "الاسم", key: "name", sortable: true },
  { title: "النوع", key: "type", sortable: true },
  { title: "البنك", key: "bank", sortable: true },
  { title: "المدينة", key: "city", sortable: true },
  { title: "IBAN", key: "iban", sortable: false },
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
  type: "individual",
  bank: "",
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
    type: "individual",
    bank: "",
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
  tx.value = { currency: currencies[0] || 'LYD', amount: null, note: "" };
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
    ? "مفضلة"
    : t === "frequent"
    ? "متكرر"
    : t === "business"
    ? "شركة"
    : "فرد";
}
function placeholder(b: Beneficiary) {
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
    b.name
  )}`;
}
function resetFilters() {
  search.value = "";
  typeFilter.value = null;
  bankFilter.value = null;
  cityFilter.value = null;
  tagFilter.value = [];
}

onMounted(() => {
  /* hook for server fetching later */
});
</script>

<style scoped>
.bene-page {
  direction: rtl;
}
.min-w-56 {
  min-width: 320px;
}
.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}

/* Card Styling - Same as cards page with hover effects */
.bene-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.bene-card::before,
.bene-card::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  background-color: rgb(var(--v-theme-primary));
  transition: width 0.3s ease-out;
  z-index: 1;
}

.bene-card::before {
  top: 0;
  left: 0;
}

.bene-card::after {
  bottom: 0;
  right: 0;
}

.bene-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
}

.bene-card:hover::before,
.bene-card:hover::after {
  width: 100%;
}

/* Image Wrapper */
.card-image-wrapper {
  position: relative;
  overflow: hidden;
}

.card-main-image {
  transition: transform 0.3s ease;
}

.bene-card:hover .card-main-image {
  transform: scale(1.05);
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

/* Table Styling */
.bene-table :deep(thead th) {
  background: #fafafa;
}
</style>

<!--
USAGE
- احفظ الملف باسم: pages/beneficiaries.vue
- افتح: /beneficiaries
- الميزات: شبكة بطاقات + جدول، بحث/فلاتر، إنشاء/تعديل في درج، تحويل سريع، تحقق IBAN (mod97) وتنسيق، مفضلة/وسوم، حوار حذف مؤكد.
- للتكامل مع API: استبدل benes[] بنداءات CRUD (GET/POST/PATCH/DELETE)، وفعّل server-side data-table عند الحاجة.
-->
