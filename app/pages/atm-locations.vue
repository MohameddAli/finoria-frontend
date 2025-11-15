<template>
  <v-layout id="atm-finder">
    <v-main>
      <v-container fluid class="pa-0">
        <v-card flat class="top-bar px-6 py-4 mb-2">
          <div class="d-flex align-center justify-space-between flex-wrap ga-4">
            <div class="d-flex align-center ga-3">
              <v-avatar size="48" class="header-icon elevation-2">
                <v-icon size="28" color="primary">mdi-cash-multiple</v-icon>
              </v-avatar>
              <div>
                <h2 class="text-h5 font-weight-bold mb-1">مواقع ماكينات الصراف الآلي (ATM)</h2>
                <p class="text-caption text-medium-emphasis mb-0">اكتشف أقرب ماكينة صراف آلي متاحة</p>
              </div>
            </div>

            <div class="d-flex align-center ga-3 flex-wrap">
              <v-text-field
                v-model="search"
                dense
                hide-details
                variant="outlined"
                prepend-inner-icon="mdi-magnify"
                placeholder="ابحث باسم الموقع أو البنك"
                class="search-field"
                style="min-width: 280px"
              />

              <v-select
                v-model="statusFilter"
                :items="statusOptions"
                item-title="label"
                item-value="value"
                label="حالة الماكينة"
                dense
                hide-details
                variant="outlined"
                style="min-width: 180px"
              >
                <template #prepend-inner>
                  <v-icon :color="statusFilterColor">mdi-circle</v-icon>
                </template>
              </v-select>



              <v-menu>
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="tonal"
                    prepend-icon="mdi-filter-variant"
                    >المزيد</v-btn
                  >
                </template>
                <v-card min-width="300" class="pa-4">
                  <v-card-title class="px-0">خيارات إضافية</v-card-title>
                  <v-switch
                    v-model="show24Hours"
                    label="متاح 24 ساعة فقط"
                    color="primary"
                    hide-details
                    inset
                    density="comfortable"
                  />
                  <v-switch
                    v-model="showAccessible"
                    label="يدعم ذوي الاحتياجات الخاصة"
                    color="primary"
                    hide-details
                    inset
                    density="comfortable"
                    class="mt-2"
                  />
                  <v-divider class="my-3" />
                  <v-switch
                    v-model="nearMe"
                    color="primary"
                    hide-details
                    inset
                    density="comfortable"
                    :label="nearMe ? `قريب مني (≤ ${radiusKm} كم)` : 'تفعيل القرب مني'"
                  />
                  <v-slider
                    v-if="nearMe"
                    v-model="radiusKm"
                    :min="1"
                    :max="50"
                    :step="1"
                    class="mt-3"
                    hide-details
                    thumb-label
                    color="primary"
                  >
                    <template #append>
                      <span class="text-caption">{{ radiusKm }} كم</span>
                    </template>
                  </v-slider>
                </v-card>
              </v-menu>

              <v-btn
                variant="tonal"
                color="error"
                @click="resetFilters"
                prepend-icon="mdi-filter-off"
                >إعادة</v-btn
              >

            </div>
          </div>

          <!-- Stats Cards -->
          <!-- <v-row class="mt-4">
            <v-col cols="12" sm="3">
              <v-card class="stat-card available-card" variant="tonal">
                <v-card-text class="pa-3">
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="text-h4 font-weight-bold">{{ availableCount }}</div>
                      <div class="text-caption">متاحة</div>
                    </div>
                    <v-icon size="32" color="success">mdi-check-circle</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="3">
              <v-card class="stat-card unavailable-card" variant="tonal">
                <v-card-text class="pa-3">
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="text-h4 font-weight-bold">{{ unavailableCount }}</div>
                      <div class="text-caption">غير متاحة</div>
                    </div>
                    <v-icon size="32" color="error">mdi-close-circle</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="3">
              <v-card class="stat-card total-card" variant="tonal">
                <v-card-text class="pa-3">
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="text-h4 font-weight-bold">{{ filteredAtms.length }}</div>
                      <div class="text-caption">إجمالي النتائج</div>
                    </div>
                    <v-icon size="32" color="primary">mdi-map-marker-multiple</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="3">
              <v-card class="stat-card nearby-card" variant="tonal">
                <v-card-text class="pa-3">
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="text-h4 font-weight-bold">{{ nearbyCount }}</div>
                      <div class="text-caption">قريبة منك</div>
                    </div>
                    <v-icon size="32" color="info">mdi-crosshairs-gps</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row> -->
        </v-card>

        <!-- Split View: List + 3D Map -->
        <v-row no-gutters class="content-row">
          <!-- ATM List -->
          <v-col
            cols="12"
            md="4"
            class="pa-3 order-2 order-md-1"
            style="max-height: calc(100vh - 320px)"
          >
            <v-card
              variant="elevated"
              class="atm-list-card h-100 rounded-xl d-flex flex-column"
            >
              <v-card-title class="d-flex align-center justify-space-between sticky-header">
                <div class="text-body-1">
                  <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
                  النتائج: <strong>{{ filteredAtms.length }}</strong>
                  <v-chip size="small" class="ml-2" :color="statusFilterColor" variant="flat">
                    {{ statusLabel }}
                  </v-chip>
                </div>
                <v-btn
                  size="small"
                  variant="text"
                  prepend-icon="mdi-crosshairs-gps"
                  @click="locateMe"
                  color="primary"
                  >موقعي</v-btn
                >
              </v-card-title>

              <v-divider />

              <!-- List with smooth scroll -->
              <div class="flex-grow-1 overflow-auto list-container">
                <v-list class="pa-2" v-if="filteredAtms.length">
                  <v-list-item
                    v-for="atm in filteredAtms"
                    :key="atm.id"
                    class="atm-list-item rounded-xl mb-2 elevation-1"
                    :class="{
                      'active-item': selectedAtm && selectedAtm.id === atm.id,
                      'available-item': atm.status === 'available',
                      'unavailable-item': atm.status === 'unavailable'
                    }"
                    @click="focusAtm(atm)"
                  >
                    <template #prepend>
                      <v-avatar
                        size="56"
                        class="elevation-2 atm-avatar"
                        :class="atm.status === 'available' ? 'pulse-success' : 'pulse-error'"
                      >
                        <v-img v-if="atm.image" :src="atm.image" cover />
                        <v-icon v-else size="32">mdi-cash-multiple</v-icon>
                      </v-avatar>
                      <div class="status-indicator" :class="atm.status" />
                    </template>

                    <v-list-item-title class="font-weight-bold mb-1">
                      {{ atm.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="mb-1">
                      <v-icon size="14" class="mr-1">mdi-bank</v-icon>
                      {{ atm.bank }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
                      {{ atm.address }}
                    </v-list-item-subtitle>

                    <template #append>
                      <div class="d-flex flex-column align-end ga-2">
                        <v-chip
                          size="x-small"
                          :color="atm.status === 'available' ? 'success' : 'error'"
                          variant="flat"
                          class="status-chip"
                        >
                          <v-icon start size="10">mdi-circle</v-icon>
                          {{ atm.status === 'available' ? 'متاحة' : 'غير متاحة' }}
                        </v-chip>
                        <v-chip
                          v-if="atm.available24h"
                          size="x-small"
                          color="blue"
                          variant="tonal"
                        >
                          <v-icon start size="10">mdi-clock-outline</v-icon>
                          24 ساعة
                        </v-chip>
                        <v-chip
                          v-if="nearMe && atm.distanceKm != null"
                          size="x-small"
                          color="primary"
                          variant="tonal"
                        >
                          {{ atm.distanceKm.toFixed(1) }} كم
                        </v-chip>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
                <div v-else class="text-center py-12">
                  <v-icon size="64" color="grey-lighten-1">mdi-map-marker-off</v-icon>
                  <p class="text-h6 mt-4 text-medium-emphasis">لا توجد نتائج</p>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- 3D Map -->
          <v-col cols="12" md="8" class="pa-0 order-1 order-md-2">
            <div class="map-wrapper">
              <div id="map" ref="mapEl" class="rounded-0 rounded-md-xl" />
              
              <!-- Map Controls -->
              <div class="map-controls">
                <v-btn
                  icon
                  size="large"
                  class="mb-2 elevation-4"
                  @click="toggleMapStyle"
                >
                  <v-icon>{{ mapStyle === 'streets' ? 'mdi-satellite-variant' : 'mdi-map' }}</v-icon>
                </v-btn>
                <v-btn
                  icon
                  size="large"
                  class="mb-2 elevation-4"
                  @click="toggle3D"
                >
                  <v-icon>{{ is3D ? 'mdi-axis-arrow' : 'mdi-video-3d' }}</v-icon>
                </v-btn>
                <v-btn
                  icon
                  size="large"
                  class="mb-2 elevation-4"
                  @click="fitToResults"
                >
                  <v-icon>mdi-fit-to-page-outline</v-icon>
                </v-btn>
                <v-btn
                  icon
                  size="large"
                  class="elevation-4"
                  @click="locateMe"
                >
                  <v-icon>mdi-crosshairs-gps</v-icon>
                </v-btn>
              </div>

              <!-- Legend -->
              <v-card class="map-legend pa-3 elevation-8">
                <div class="text-subtitle-2 font-weight-bold mb-2">الدليل</div>
                <div class="d-flex align-center mb-2">
                  <div class="legend-indicator success-indicator mr-2" />
                  <span class="text-caption">متاحة (بها سيولة)</span>
                </div>
                <div class="d-flex align-center mb-2">
                  <div class="legend-indicator error-indicator mr-2" />
                  <span class="text-caption">غير متاحة (لا سيولة)</span>
                </div>
                <div class="d-flex align-center">
                  <v-icon size="16" color="error" class="mr-2">mdi-account</v-icon>
                  <span class="text-caption">موقعك الحالي</span>
                </div>
              </v-card>

              <div
                v-if="!mapReady"
                class="map-skeleton d-flex align-center justify-center"
              >
                <div class="text-center">
                  <v-progress-circular indeterminate size="48" color="primary" />
                  <p class="mt-4 text-h6">جارٍ تحميل الخريطة ثلاثية الأبعاد…</p>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Enhanced Details Dialog -->
        <v-dialog v-model="detailsOpen" max-width="600">
          <v-card v-if="selectedAtm" class="details-dialog">
            <v-img
              v-if="selectedAtm.image"
              :src="selectedAtm.image"
              height="200"
              cover
              class="details-image"
            >
              <div class="image-overlay">
                <v-chip
                  :color="selectedAtm.status === 'available' ? 'success' : 'error'"
                  variant="flat"
                  size="large"
                  class="ma-4"
                >
                  <v-icon start>mdi-circle</v-icon>
                  {{ selectedAtm.status === 'available' ? 'متاحة الآن' : 'غير متاحة' }}
                </v-chip>
              </div>
            </v-img>

            <v-card-title class="d-flex align-center ga-3 pt-4">
              <v-avatar size="48" :color="selectedAtm.status === 'available' ? 'success' : 'error'">
                <v-icon>mdi-cash-multiple</v-icon>
              </v-avatar>
              <div>
                <div class="text-h6 font-weight-bold">{{ selectedAtm.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ selectedAtm.bank }}</div>
              </div>
            </v-card-title>

            <v-card-text class="pb-2">
              <v-list class="pa-0">
                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon color="primary">mdi-map-marker</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">{{ selectedAtm.address }}</v-list-item-title>
                </v-list-item>

                <v-list-item v-if="selectedAtm.city" class="px-0">
                  <template #prepend>
                    <v-icon color="primary">mdi-city</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">{{ selectedAtm.city }}</v-list-item-title>
                </v-list-item>

                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon :color="selectedAtm.available24h ? 'success' : 'warning'">
                      mdi-clock-outline
                    </v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">
                    {{ selectedAtm.available24h ? 'متاح 24 ساعة' : 'أوقات محددة' }}
                  </v-list-item-title>
                </v-list-item>

                <v-list-item v-if="selectedAtm.accessible" class="px-0">
                  <template #prepend>
                    <v-icon color="info">mdi-wheelchair-accessibility</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">
                    يدعم ذوي الاحتياجات الخاصة
                  </v-list-item-title>
                </v-list-item>

                <v-list-item v-if="nearMe && selectedAtm.distanceKm != null" class="px-0">
                  <template #prepend>
                    <v-icon color="primary">mdi-map-marker-distance</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">
                    المسافة: {{ selectedAtm.distanceKm.toFixed(2) }} كم
                  </v-list-item-title>
                </v-list-item>
              </v-list>

              <v-divider class="my-3" />

              <div class="text-subtitle-2 font-weight-bold mb-2">الخدمات المتاحة:</div>
              <div class="d-flex flex-wrap ga-2">
                <v-chip size="small" color="primary" variant="tonal">
                  <v-icon start size="16">mdi-cash-multiple</v-icon>
                  سحب نقدي
                </v-chip>
                <v-chip size="small" color="primary" variant="tonal">
                  <v-icon start size="16">mdi-credit-card</v-icon>
                  استعلام رصيد
                </v-chip>
                <v-chip size="small" color="primary" variant="tonal">
                  <v-icon start size="16">mdi-receipt</v-icon>
                  كشف حساب
                </v-chip>
              </div>
            </v-card-text>

            <v-card-actions class="justify-end pa-4">
              <v-btn
                color="primary"
                variant="flat"
                block
                size="large"
                prepend-icon="mdi-google-maps"
                :href="directionsUrl(selectedAtm)"
                target="_blank"
              >
                فتح في خرائط جوجل
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
});

import { ref, computed, watch, onMounted, nextTick } from 'vue';
import type { Ref } from 'vue';
import 'leaflet/dist/leaflet.css';

const ATM_IMAGE_URL = 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=900&h=600&fit=crop&q=85';

/**
 * Types
 */
interface ATM {
  id: string;
  name: string;
  bank: string;
  address: string;
  city?: string;
  lat: number;
  lng: number;
  status: 'available' | 'unavailable';
  available24h: boolean;
  accessible?: boolean;
  image?: string;
  phone?: string;
  distanceKm?: number | null;
}

/**
 * State
 */
const search = ref('');
const statusFilter = ref<'all' | 'available' | 'unavailable'>('all');
const bankFilter = ref<string | null>(null);
const nearMe = ref(false);
const radiusKm = ref(10);
const show24Hours = ref(false);
const showAccessible = ref(false);
const selectedAtm = ref<ATM | null>(null);
const detailsOpen = ref(false);
const mapStyle = ref<'streets' | 'satellite'>('streets');
const is3D = ref(false);

// Map refs
const mapEl = ref<HTMLDivElement | null>(null);
const mapReady = ref(false);
let map: any = null;
const markers = new Map<string, any>();
let userMarker: any = null;
let userRadius: any = null;

// User location
const userLocation = ref<{ lat: number; lng: number } | null>(null);

/**
 * Sample ATM Data
 */
const atms = ref<ATM[]>([
  {
    id: '1',
    name: 'صراف اليقين - الفرع الرئيسي',
    bank: 'مصرف اليقين',
    address: 'شارع عمر المختار',
    city: 'طرابلس',
    lat: 32.8872,
    lng: 13.1913,
    status: 'available',
    available24h: true,
    accessible: true,
    image: ATM_IMAGE_URL,
    phone: '+218-21-1234567'
  },
  {
    id: '2',
    name: 'صراف اليقين - سوق الجمعة',
    bank: 'مصرف اليقين',
    address: 'سوق الجمعة',
    city: 'طرابلس',
    lat: 32.8651,
    lng: 13.1876,
    status: 'available',
    available24h: false,
    accessible: false,
    image: ATM_IMAGE_URL
  },
  {
    id: '3',
    name: 'صراف اليقين - فرع الظهرة',
    bank: 'مصرف اليقين',
    address: 'شارع الظهرة',
    city: 'بنغازي',
    lat: 32.1165,
    lng: 20.0686,
    status: 'available',
    available24h: true,
    accessible: true,
    image: ATM_IMAGE_URL
  },
  {
    id: '4',
    name: 'صراف اليقين - وسط المدينة',
    bank: 'مصرف اليقين',
    address: 'شارع جمال عبد الناصر',
    city: 'بنغازي',
    lat: 32.1190,
    lng: 20.0810,
    status: 'available',
    available24h: false,
    accessible: false,
    image: ATM_IMAGE_URL
  },
  {
    id: '5',
    name: 'صراف اليقين - المطار الدولي',
    bank: 'مصرف اليقين',
    address: 'مطار طرابلس الدولي',
    city: 'طرابلس',
    lat: 32.6635,
    lng: 13.1590,
    status: 'available',
    available24h: true,
    accessible: true,
    image: ATM_IMAGE_URL
  },
  {
    id: '6',
    name: 'صراف اليقين - شارع الفاتح',
    bank: 'مصرف اليقين',
    address: 'شارع الفاتح',
    city: 'مصراتة',
    lat: 32.3754,
    lng: 15.0925,
    status: 'unavailable',
    available24h: false,
    accessible: false,
    image: ATM_IMAGE_URL
  },
  {
    id: '7',
    name: 'صراف اليقين - كورنيش بنغازي',
    bank: 'مصرف اليقين',
    address: 'كورنيش بنغازي',
    city: 'بنغازي',
    lat: 32.1074,
    lng: 20.0640,
    status: 'available',
    available24h: true,
    accessible: true,
    image: ATM_IMAGE_URL
  },
  {
    id: '8',
    name: 'صراف اليقين - مدينة سبها',
    bank: 'مصرف اليقين',
    address: 'وسط مدينة سبها',
    city: 'سبها',
    lat: 27.0377,
    lng: 14.4283,
    status: 'available',
    available24h: false,
    accessible: false,
    image: ATM_IMAGE_URL
  }
]) as Ref<ATM[]>;

/**
 * UI Options
 */
const statusOptions = [
  { label: 'الكل', value: 'all' },
  { label: 'متاحة', value: 'available' },
  { label: 'غير متاحة', value: 'unavailable' }
] as const;

const bankOptions = computed(() => {
  const set = new Set(atms.value.map(a => a.bank));
  return Array.from(set.values());
});

const statusFilterColor = computed(() => {
  if (statusFilter.value === 'available') return 'success';
  if (statusFilter.value === 'unavailable') return 'error';
  return 'primary';
});

const statusLabel = computed(() => {
  const opt = statusOptions.find(o => o.value === statusFilter.value);
  return opt?.label ?? 'الكل';
});

/**
 * Filtering
 */
const filteredAtms = computed<ATM[]>(() => {
  let list = atms.value.map(a => ({ ...a }));

  // Distance
  if (nearMe.value && userLocation.value) {
    for (const a of list) {
      a.distanceKm = haversine(
        userLocation.value.lat,
        userLocation.value.lng,
        a.lat,
        a.lng
      );
    }
    list = list.filter(a => (a.distanceKm ?? Infinity) <= radiusKm.value);
  } else {
    for (const a of list) a.distanceKm = null;
  }

  // Status
  if (statusFilter.value !== 'all') {
    list = list.filter(a => a.status === statusFilter.value);
  }

  // Bank
  if (bankFilter.value) {
    list = list.filter(a => a.bank === bankFilter.value);
  }

  // 24h
  if (show24Hours.value) {
    list = list.filter(a => a.available24h);
  }

  // Accessible
  if (showAccessible.value) {
    list = list.filter(a => a.accessible);
  }

  // Search
  const q = search.value.trim().toLowerCase();
  if (q) {
    list = list.filter(a =>
      [a.name, a.bank, a.address, a.city]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(q))
    );
  }

  // Sort
  list.sort((a, b) => {
    if (nearMe.value && userLocation.value) {
      return (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9);
    }
    return a.name.localeCompare(b.name);
  });

  return list;
});

/**
 * Stats
 */
const availableCount = computed(() => filteredAtms.value.filter(a => a.status === 'available').length);
const unavailableCount = computed(() => filteredAtms.value.filter(a => a.status === 'unavailable').length);
const nearbyCount = computed(() => {
  if (!nearMe.value || !userLocation.value) return 0;
  return filteredAtms.value.filter(a => (a.distanceKm ?? Infinity) <= 5).length;
});

/**
 * Map Init (Leaflet)
 */
async function initMap() {
  // Ensure element is mounted
  await nextTick();
  const container = mapEl.value instanceof HTMLElement ? mapEl.value : document.getElementById('map');
  if (!container) return;

  // @ts-ignore
  const L = (await import('leaflet')).default;
  // Ensure helpers relying on global Leaflet can access the instance
  (window as any).L = L;

  // Fix default icon issue
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });

  map = L.map(container, {
    center: [32.8872, 13.1913],
    zoom: 12,
    zoomControl: false,
    attributionControl: false
  });

  updateMapStyle();
  L.control.scale({ position: 'bottomright', imperial: false }).addTo(map);

  mapReady.value = true;
  await nextTick();
  refreshMarkers();
  fitToResults();
}

function updateMapStyle() {
  if (!map) return;
  
  // @ts-ignore
  const L = (window as any).L;
  
  // Remove existing tile layers
  map.eachLayer((layer: any) => {
    if (layer instanceof L.TileLayer) {
      map.removeLayer(layer);
    }
  });

  if (mapStyle.value === 'streets') {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);
  } else {
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }).addTo(map);
  }
}

function toggleMapStyle() {
  mapStyle.value = mapStyle.value === 'streets' ? 'satellite' : 'streets';
  updateMapStyle();
}

function toggle3D() {
  is3D.value = !is3D.value;
  if (map) {
    // Simple tilt simulation
    map.setView(map.getCenter(), map.getZoom(), {
      animate: true,
      duration: 0.5
    });
  }
}

async function refreshMarkers() {
  if (!mapReady.value || !map) return;

  // @ts-ignore
  const L = (window as any).L;

  // Remove old markers
  const ids = new Set(filteredAtms.value.map(a => a.id));
  for (const [id, mk] of Array.from(markers.entries())) {
    if (!ids.has(id)) {
      map.removeLayer(mk);
      markers.delete(id);
    }
  }

  // Add/update markers
  for (const atm of filteredAtms.value) {
    let marker = markers.get(atm.id);
    
    if (!marker) {
      const iconHtml = createPulseIcon(atm);
      const icon = L.divIcon({
        className: 'custom-marker',
        html: iconHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      marker = L.marker([atm.lat, atm.lng], { icon })
        .addTo(map)
        .on('click', () => openPopup(atm));

      // Tooltip on hover
      const tooltipContent = `
        <div class="atm-tooltip">
          ${atm.image ? `<img src="${atm.image}" alt="${atm.name}" class="tooltip-image" />` : ''}
          <div class="tooltip-content">
            <div class="tooltip-title">${atm.name}</div>
            <div class="tooltip-bank">${atm.bank}</div>
            <div class="tooltip-status ${atm.status}">
              ${atm.status === 'available' ? '✓ متاحة' : '✗ غير متاحة'}
            </div>
          </div>
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        direction: 'top',
        offset: [0, -40],
        className: 'custom-tooltip'
      });

      markers.set(atm.id, marker);
    }
  }
}

function createPulseIcon(atm: ATM): string {
  const color = atm.status === 'available' ? '#4CAF50' : '#F44336';
  return `
    <div class="pulse-marker" style="--pulse-color: ${color}">
      <div class="pulse-ring"></div>
      <div class="pulse-ring" style="animation-delay: 0.3s"></div>
      <div class="pulse-ring" style="animation-delay: 0.6s"></div>
      <div class="pulse-dot"></div>
    </div>
  `;
}

function openPopup(atm: ATM) {
  selectedAtm.value = atm;
  detailsOpen.value = true;
}

function focusAtm(atm: ATM) {
  selectedAtm.value = atm;
  if (map) {
    map.flyTo([atm.lat, atm.lng], 16, {
      duration: 1
    });
  }
}

function fitToResults() {
  if (!map || !filteredAtms.value.length) return;
  
  // @ts-ignore
  const L = (window as any).L;
  const bounds = L.latLngBounds(filteredAtms.value.map(a => [a.lat, a.lng]));
  map.fitBounds(bounds, { padding: [50, 50] });
}

async function locateMe() {
  if (!('geolocation' in navigator)) return;
  
  navigator.geolocation.getCurrentPosition(async (pos) => {
    userLocation.value = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    };
    nearMe.value = true;

    if (map) {
      // @ts-ignore
      const L = (window as any).L;
      
      // Add user marker
      const userIcon = L.divIcon({
        className: 'user-marker-icon',
        html: '<div class="user-location-marker"><div class="user-pulse"></div><div class="user-dot"></div></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      if (userMarker) {
        map.removeLayer(userMarker);
      }
      userMarker = L.marker([userLocation.value.lat, userLocation.value.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('موقعك الحالي');

      if (userRadius) {
        map.removeLayer(userRadius);
      }
      userRadius = L.circle([userLocation.value.lat, userLocation.value.lng], {
        radius: radiusKm.value * 1000,
        color: '#1e88e5',
        weight: 1,
        fillColor: '#1e88e5',
        fillOpacity: 0.08
      }).addTo(map);

      map.flyTo([userLocation.value.lat, userLocation.value.lng], 14);
    }

    await nextTick();
    refreshMarkers();
  });
}

watch(radiusKm, value => {
  if (userRadius && userLocation.value && map) {
    userRadius.setRadius(value * 1000);
  }
});

function resetFilters() {
  search.value = '';
  statusFilter.value = 'all';
  bankFilter.value = null;
  nearMe.value = false;
  radiusKm.value = 10;
  show24Hours.value = false;
  showAccessible.value = false;
}

function directionsUrl(atm: ATM) {
  return `https://www.google.com/maps/dir/?api=1&destination=${atm.lat},${atm.lng}`;
}

function exportCsv() {
  const rows = [
    ['id', 'name', 'bank', 'address', 'city', 'lat', 'lng', 'status', '24h', 'accessible', 'distanceKm'],
    ...filteredAtms.value.map(a => [
      a.id,
      a.name,
      a.bank,
      a.address,
      a.city ?? '',
      a.lat,
      a.lng,
      a.status,
      a.available24h,
      a.accessible ?? false,
      a.distanceKm?.toFixed(2) ?? ''
    ])
  ];
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'atm-locations.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Watchers
 */
watch([filteredAtms], () => {
  refreshMarkers();
});

onMounted(() => {
  if (process.client) {
    initMap();
  }
});
</script>

<style scoped>
#atm-finder {
  direction: rtl;
  background: #ffffff;
  min-height: 100vh;
}

.top-bar {
  background: #ffffff;
  color: #1f2933;
  border: 1px solid #e4eaf3;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);
  border-radius: 12px !important;
}

.header-icon {
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  color: #1976d2 !important;
}

.search-field :deep(.v-field) {
  border-radius: 12px;
}

.stat-card {
  border-radius: 16px !important;
  transition: all 0.25s ease;
  background: #ffffff;
  border: 1px solid #e8eef5;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.05);
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08) !important;
}

.available-card {
  border-top: 4px solid #43a047;
}

.unavailable-card {
  border-top: 4px solid #e53935;
}

.total-card {
  border-top: 4px solid #1e88e5;
}

.nearby-card {
  border-top: 4px solid #fb8c00;
}

.content-row {
  min-height: calc(100vh - 320px);
}

.atm-list-card {
  background: #ffffff;
  border: 1px solid #e8eef5;
  backdrop-filter: blur(8px);
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
}

.list-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(30, 136, 229, 0.35) transparent;
}

.list-container::-webkit-scrollbar {
  width: 6px;
}

.list-container::-webkit-scrollbar-track {
  background: transparent;
}

.list-container::-webkit-scrollbar-thumb {
  background: rgba(30, 136, 229, 0.4);
  border-radius: 3px;
}

.atm-list-item {
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: white;
}

.atm-list-item:hover {
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
}

.atm-list-item.active-item {
  border-color: #1976d2;
  background: rgba(25, 118, 210, 0.08);
}

.atm-list-item.available-item {
  border-left: 4px solid #4CAF50;
}

.atm-list-item.unavailable-item {
  border-left: 4px solid #F44336;
}

.atm-avatar {
  position: relative;
}

.pulse-success {
  animation: pulse-success 2s ease-out infinite;
}

.pulse-error {
  animation: pulse-error 2s ease-out infinite;
}

@keyframes pulse-success {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
}

@keyframes pulse-error {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
  }
}

.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-indicator.available {
  background: #4CAF50;
}

.status-indicator.unavailable {
  background: #F44336;
}

.status-chip {
  font-weight: 600;
}

.map-wrapper {
  position: relative;
  height: calc(100vh - 320px);
  border-radius: 16px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e8eef5;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

#map {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.map-skeleton {
  position: absolute;
  inset: 0;
  background: rgba(245, 245, 245, 0.95);
  z-index: 10;
}

.map-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.map-controls :deep(.v-btn) {
  background: #ffffff !important;
  border: 1px solid #e2e8f4 !important;
  color: #1e293b !important;
}

.map-legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid #e8eef5;
  backdrop-filter: blur(8px);
  border-radius: 12px;
}

.legend-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: relative;
}

.success-indicator {
  background: #4CAF50;
  animation: pulse-legend-success 2s ease-out infinite;
}

.error-indicator {
  background: #F44336;
  animation: pulse-legend-error 2s ease-out infinite;
}

@keyframes pulse-legend-success {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(76, 175, 80, 0);
  }
}

@keyframes pulse-legend-error {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(244, 67, 54, 0);
  }
}

.details-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.details-image {
  position: relative;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 100%);
}

/* Leaflet Custom Styles */
:deep(.custom-marker) {
  background: none !important;
  border: none !important;
}

:deep(.pulse-marker) {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.pulse-ring) {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--pulse-color);
  opacity: 0.6;
  animation: pulse-ring 2s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.3);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

:deep(.pulse-dot) {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--pulse-color);
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  z-index: 10;
}

:deep(.custom-tooltip) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

:deep(.atm-tooltip) {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  min-width: 200px;
}

:deep(.tooltip-image) {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

:deep(.tooltip-content) {
  padding: 12px;
}

:deep(.tooltip-title) {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

:deep(.tooltip-bank) {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

:deep(.tooltip-status) {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
}

:deep(.tooltip-status.available) {
  background: #e8f5e9;
  color: #2e7d32;
}

:deep(.tooltip-status.unavailable) {
  background: #ffebee;
  color: #c62828;
}

:deep(.user-location-marker) {
  position: relative;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.user-pulse) {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #F44336;
  opacity: 0.6;
  animation: pulse-ring 2s ease-out infinite;
}

:deep(.user-dot) {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #F44336;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  z-index: 10;
}

@media (max-width: 960px) {
  .content-row {
    min-height: auto;
  }

  .map-wrapper {
    height: 400px;
  }

  .map-controls {
    top: 10px;
    right: 10px;
  }

  .map-legend {
    bottom: 10px;
    left: 10px;
  }
}
</style>
