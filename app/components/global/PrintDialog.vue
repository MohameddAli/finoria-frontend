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

<script setup lang="ts">
import { format } from "date-fns";

interface Props {
  modelValue: boolean;
  title: string;
  search?: Record<string, any>;
  apiUrl?: string;
  headers: any[];
  bank?: string;
  mockData?: any[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  search: () => ({}),
  apiUrl: "",
  bank: "",
  mockData: () => [],
});

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const { t } = useI18n();

const data = ref<any[]>([]);
const selectedHeaders = ref<any[]>([]);
const loading = ref(false);

const currentDate = computed(() => format(new Date(), "dd-MM-yyyy"));

const fetchData = async () => {
  if (props.mockData?.length) {
    data.value = props.mockData.map((item, index) => ({ ...item, sno: index + 1 }));
    return;
  }
  if (!props.apiUrl) return;
  loading.value = true;
  try {
    const response: any = await $fetch(props.apiUrl, { method: "GET", params: props.search });
    const rawData = response?.data || response || [];
    data.value = rawData.map((item: any, index: number) => ({ ...item, sno: index + 1 }));
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
  const allElements = document.body.querySelectorAll("body > *:not(#__nuxt)");
  const nuxtApp = document.getElementById("__nuxt");
  const originalDisplay: string[] = [];
  allElements.forEach((el, index) => {
    originalDisplay[index] = (el as HTMLElement).style.display;
    (el as HTMLElement).style.display = "none";
  });
  if (nuxtApp) {
    const nuxtChildren = nuxtApp.querySelectorAll(":scope > *");
    const originalNuxtDisplay: string[] = [];
    nuxtChildren.forEach((el, index) => {
      if (!el.contains(printElement)) {
        originalNuxtDisplay[index] = (el as HTMLElement).style.display;
        (el as HTMLElement).style.display = "none";
      }
    });
    const nonPrintElements = document.querySelectorAll('#header, .v-overlay__scrim, [role="dialog"] > .v-toolbar');
    const originalNonPrintDisplay: string[] = [];
    nonPrintElements.forEach((el, index) => {
      originalNonPrintDisplay[index] = (el as HTMLElement).style.display;
      (el as HTMLElement).style.display = "none";
    });
    window.print();
    allElements.forEach((el, index) => { (el as HTMLElement).style.display = originalDisplay[index] || ''; });
    nuxtChildren.forEach((el, index) => {
      if (originalNuxtDisplay[index] !== undefined) (el as HTMLElement).style.display = originalNuxtDisplay[index] || '';
    });
    nonPrintElements.forEach((el, index) => {
      if (originalNonPrintDisplay[index] !== undefined) (el as HTMLElement).style.display = originalNonPrintDisplay[index] || '';
    });
  }
};

const formatDate = (value: string) => {
  if (!value) return "";
  try {
    return format(new Date(value.substring(0, 15)), "yyyy-MM-dd h:mm:ss");
  } catch {
    return value;
  }
};

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedHeaders.value = props.headers;
    fetchData();
  }
}, { immediate: true });

watch(() => props.headers, (newHeaders) => { selectedHeaders.value = newHeaders; }, { deep: true });
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
