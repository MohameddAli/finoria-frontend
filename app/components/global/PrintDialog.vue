<template>
  <ClientOnly>
    <v-row justify="center">
      <v-dialog
        fullscreen
        :scrim="false"
        transition="dialog-bottom-transition"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
      >
        <v-card id="nonmargin">
          <v-toolbar id="header" color="#FFC107">
            <v-btn icon @click="$emit('update:modelValue', false)">
              <v-icon>mdi-close</v-icon>
            </v-btn>

            <v-spacer />
            <v-toolbar-items>
              <v-btn
                class="me-2"
                color="primary"
                type="button"
                @click="handlePrint"
              >
                <v-icon>mdi-printer</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-list id="printMe" lines="two" class="modal">
            <div class="grid-container">
              <div class="item1" style="font-size: large">
                {{ t("attributes.date") }} : {{ currentDate }}
              </div>

              <div class="item3">
                <NuxtImg
                  src="/images/logo-v.png"
                  width="100"
                  height="100"
                  alt="Company Logo"
                  loading="eager"
                  format="webp"
                />
              </div>

              <div class="item5" style="font-size: x-large">
                {{ title }}
              </div>

              <div class="item6">
                <div v-if="bank">{{ t("attributes.bank") }} {{ bank }}</div>
                <div>
                  {{ t("search.from_date") }}: {{ search.from_date }}
                  {{ t("search.to_date") }}: {{ search.to_date }}
                </div>
              </div>
            </div>

            <v-data-table
              ref="grid"
              :headers="selectedHeaders"
              :items="data"
              :items-per-page="-1"
              class="elevation-1"
            >
              <template #[`item.DATE_TIME`]="{ item }">
                {{ formatDate(item.DATE_TIME) }}
              </template>

              <template #[`item.FIRSTNAME`]="{ item }">
                {{ item.FIRSTNAME }} {{ item.LASTNAME }}
              </template>

              <!-- slot مخصص للبيانات الإضافية -->
              <slot name="table-item" />
            </v-data-table>

            <div v-if="data?.length > 0" id="count">
              {{ t("attributes.count") }} : {{ data.length }}
            </div>
          </v-list>
        </v-card>
      </v-dialog>
    </v-row>
  </ClientOnly>
</template>

<script setup>
import { format } from "date-fns";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  search: {
    type: Object,
    default: () => ({}),
  },
  apiUrl: {
    type: String,
    required: false,
    default: "",
  },
  headers: {
    type: Array,
    required: true,
  },
  bank: {
    type: String,
    default: "",
  },
  mockData: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["update:modelValue"]);

// Composables
const { t } = useI18n();
const { getAuthHeaders } = useApi();

// State
const data = ref([]);
const selectedHeaders = ref([]);
const loading = ref(false);

// Computed
const currentDate = computed(() => {
  return format(new Date(), "dd-MM-yyyy");
});

// Methods
const fetchData = async () => {
  // إذا كانت هناك بيانات تجريبية، استخدمها
  if (props.mockData && props.mockData.length > 0) {
    data.value = props.mockData.map((item, index) => ({
      ...item,
      sno: index + 1,
    }));
    return;
  }

  // إذا لم يكن هناك apiUrl، لا تفعل شيء
  if (!props.apiUrl) return;

  loading.value = true;
  try {
    const headers = getAuthHeaders();
    const response = await $fetch(props.apiUrl, {
      method: "GET",
      headers,
      params: props.search,
    });

    // تعيين البيانات مع إضافة رقم تسلسلي
    const rawData = response?.data || response || [];
    data.value = rawData.map((item, index) => ({
      ...item,
      sno: index + 1,
    }));
  } catch (error) {
    console.error("Error fetching print data:", error);
    data.value = [];
  } finally {
    loading.value = false;
  }
};

const handlePrint = () => {
  const printElement = document.getElementById("printMe");
  if (!printElement) return;

  // إخفاء جميع عناصر الصفحة ماعدا printMe
  const allElements = document.body.querySelectorAll("body > *:not(#__nuxt)");
  const nuxtApp = document.getElementById("__nuxt");

  // حفظ الحالة الأصلية
  const originalDisplay = [];
  allElements.forEach((el, index) => {
    originalDisplay[index] = el.style.display;
    el.style.display = "none";
  });

  // إخفاء كل شيء في nuxt app ماعدا printMe
  if (nuxtApp) {
    const nuxtChildren = nuxtApp.querySelectorAll(":scope > *");
    const originalNuxtDisplay = [];
    nuxtChildren.forEach((el, index) => {
      if (!el.contains(printElement)) {
        originalNuxtDisplay[index] = el.style.display;
        el.style.display = "none";
      }
    });

    // إخفاء header والعناصر غير المطلوبة في الطباعة
    const nonPrintElements = document.querySelectorAll(
      '#header, .v-overlay__scrim, [role="dialog"] > .v-toolbar'
    );
    const originalNonPrintDisplay = [];
    nonPrintElements.forEach((el, index) => {
      originalNonPrintDisplay[index] = el.style.display;
      el.style.display = "none";
    });

    // طباعة
    window.print();

    // استرجاع الحالة الأصلية
    allElements.forEach((el, index) => {
      el.style.display = originalDisplay[index];
    });

    nuxtChildren.forEach((el, index) => {
      if (originalNuxtDisplay[index] !== undefined) {
        el.style.display = originalNuxtDisplay[index];
      }
    });

    nonPrintElements.forEach((el, index) => {
      if (originalNonPrintDisplay[index] !== undefined) {
        el.style.display = originalNonPrintDisplay[index];
      }
    });
  }
};

const formatDate = (value) => {
  if (!value) return "";
  try {
    const dateStr = value.substring(0, 15);
    return format(new Date(dateStr), "yyyy-MM-dd h:mm:ss");
  } catch {
    return value;
  }
};

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      selectedHeaders.value = props.headers;
      fetchData();
    }
  },
  { immediate: true }
);

watch(
  () => props.headers,
  (newHeaders) => {
    selectedHeaders.value = newHeaders;
  },
  { deep: true }
);
</script>

<style scoped>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}

@media screen {
  .modal {
    display: block !important;
  }
}

@media print {
  /* إخفاء جميع عناصر Vuetify غير الضرورية */
  .v-overlay__scrim,
  .v-toolbar,
  #header,
  .v-btn,
  body > *:not(#__nuxt),
  [role="dialog"] > .v-card > .v-toolbar {
    display: none !important;
  }

  /* عرض محتوى الطباعة فقط */
  #printMe,
  #printMe * {
    display: block !important;
    visibility: visible !important;
  }

  @page {
    margin: 0.3in 1in 0.3in 1in !important;
  }

  #nonmargin {
    padding-top: 10px;
  }

  .modal {
    display: block !important;
    visibility: visible;
    overflow: visible !important;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: "Cairo", sans-serif !important;
  }

  table,
  th,
  tr,
  td {
    font-family: "Cairo", sans-serif !important;
    border: thin solid rgba(0, 0, 0, 0.5);
    text-align: center;
    padding: 5px !important;
    height: auto !important;
    font-size: 11px !important;
  }
}

.grid-container {
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 10px;
  padding: 20px;
}

.grid-container > div {
  font-size: 11px;
  padding-bottom: 25px;
}

.item1 {
  text-align: end;
  grid-column-start: 1;
  grid-column-end: 4;
}

.item3,
.item5 {
  text-align: center;
}

.item6,
.item3,
.item5 {
  grid-column-start: 1;
  grid-column-end: 4;
}

#count {
  border: 0.5rem outset gray;
  border-radius: 12px;
  font: bold 1rem sans-serif;
  margin: 2rem;
  padding: 1rem;
  text-align: center;
}

:deep(.v-data-table) {
  background: transparent;
}

:deep(.v-data-table-footer) {
  display: none;
}
</style>
