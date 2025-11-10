<template>
  <v-layout id="atm-finder-3d">
    <v-main>
      <v-container fluid class="pa-0">
        <!-- Top Header Bar -->
        <v-card flat class="top-bar px-6 py-4 mb-2 elevation-0">
          <div class="d-flex align-center justify-space-between flex-wrap ga-4">
            <div class="d-flex align-center ga-3">
              <v-avatar size="48" class="header-icon elevation-2">
                <v-icon size="28" color="primary">mdi-atom</v-icon>
              </v-avatar>
              <div>
                <h2 class="text-h5 font-weight-bold mb-1">خريطة ماكينات الصراف ثلاثية الأبعاد</h2>
                <p class="text-caption text-medium-emphasis mb-0">تجربة تفاعلية متطورة مع Mapbox 3D</p>
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

              <v-select
                v-model="bankFilter"
                :items="bankOptions"
                label="البنك"
                dense
                hide-details
                variant="outlined"
                style="min-width: 160px"
                clearable
              />

              <v-btn
                variant="tonal"
                color="error"
                @click="resetFilters"
                prepend-icon="mdi-filter-off"
              >
                إعادة
              </v-btn>
              <v-btn
                variant="tonal"
                color="success"
                @click="exportCsv"
                prepend-icon="mdi-download"
              >
                تصدير
              </v-btn>
            </div>
          </div>

          <!-- Stats Cards (No hover effects) -->
          <v-row class="mt-4">
            <v-col cols="12" sm="3">
              <v-card class="stat-card elevation-1" color="success" variant="tonal">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="text-caption font-weight-medium mb-1">متاحة</div>
                      <div class="text-h5 font-weight-bold">{{ availableCount }}</div>
                    </div>
                    <v-avatar size="48" color="success">
                      <v-icon size="28" color="white">mdi-check-circle</v-icon>
                    </v-avatar>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="3">
              <v-card class="stat-card elevation-1" color="error" variant="tonal">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="text-caption font-weight-medium mb-1">غير متاحة</div>
                      <div class="text-h5 font-weight-bold">{{ unavailableCount }}</div>
                    </div>
                    <v-avatar size="48" color="error">
                      <v-icon size="28" color="white">mdi-close-circle</v-icon>
                    </v-avatar>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="3">
              <v-card class="stat-card elevation-1" color="info" variant="tonal">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="text-caption font-weight-medium mb-1">المجموع</div>
                      <div class="text-h5 font-weight-bold">{{ filteredAtms.length }}</div>
                    </div>
                    <v-avatar size="48" color="info">
                      <v-icon size="28" color="white">mdi-cash-multiple</v-icon>
                    </v-avatar>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="3">
              <v-card class="stat-card elevation-1" color="warning" variant="tonal">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="text-caption font-weight-medium mb-1">قريب مني</div>
                      <div class="text-h5 font-weight-bold">{{ nearbyCount }}</div>
                    </div>
                    <v-avatar size="48" color="warning">
                      <v-icon size="28" color="white">mdi-map-marker-radius</v-icon>
                    </v-avatar>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>

        <!-- Split View: List + 3D Mapbox Map -->
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
              class="atm-list-card h-100 rounded-xl d-flex flex-column elevation-2"
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
                >
                  موقعي
                </v-btn>
              </v-card-title>

              <v-divider />

              <!-- List with smooth scroll -->
              <div class="flex-grow-1 overflow-auto list-container">
                <v-list class="pa-2" v-if="filteredAtms.length">
                  <v-list-item
                    v-for="atm in filteredAtms"
                    :key="atm.id"
                    class="atm-list-item mb-2 rounded-lg elevation-1"
                    :class="{
                      'active-item': selectedAtm?.id === atm.id,
                      'available-item': atm.status === 'available',
                      'unavailable-item': atm.status === 'unavailable'
                    }"
                    @click="focusAtm(atm)"
                  >
                    <template #prepend>
                      <v-avatar
                        size="56"
                        :color="atm.status === 'available' ? 'success' : 'error'"
                        class="atm-avatar"
                      >
                        <v-icon size="28" color="white">mdi-cash-multiple</v-icon>
                        <div
                          class="status-indicator"
                          :class="atm.status"
                        />
                      </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-bold mb-1">
                      {{ atm.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="mb-2">
                      <v-icon size="14" class="mr-1">mdi-bank</v-icon>
                      {{ atm.bank }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="mb-2">
                      <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
                      {{ atm.address }}
                    </v-list-item-subtitle>

                    <template #append>
                      <div class="d-flex flex-column align-end ga-1">
                        <v-chip
                          size="x-small"
                          :color="atm.status === 'available' ? 'success' : 'error'"
                          variant="flat"
                          class="status-chip"
                        >
                          {{ atm.status === 'available' ? 'متاحة' : 'غير متاحة' }}
                        </v-chip>
                        <v-chip
                          v-if="atm.available24h"
                          size="x-small"
                          color="info"
                          variant="flat"
                        >
                          24/7
                        </v-chip>
                        <v-chip
                          v-if="nearMe && atm.distanceKm != null"
                          size="x-small"
                          color="warning"
                          variant="flat"
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

          <!-- 3D Mapbox Map -->
          <v-col cols="12" md="8" class="pa-0 order-1 order-md-2">
            <div class="map-wrapper">
              <div id="map" ref="mapEl" class="rounded-0 rounded-md-xl" />
              
              <!-- 3D Map Controls -->
              <div class="map-controls elevation-4">
                <v-btn-group divided density="comfortable" color="primary">
                  <v-btn
                    @click="toggleMapStyle"
                    prepend-icon="mdi-layers"
                  >
                    {{ mapStyle === 'streets' ? 'قمر صناعي' : 'شوارع' }}
                  </v-btn>
                  <v-btn
                    @click="toggle3DTerrain"
                    :color="is3DEnabled ? 'primary' : undefined"
                    prepend-icon="mdi-terrain"
                  >
                    3D تضاريس
                  </v-btn>
                  <v-btn
                    @click="toggleBuildings"
                    :color="buildingsEnabled ? 'primary' : undefined"
                    prepend-icon="mdi-office-building"
                  >
                    مباني
                  </v-btn>
                  <v-btn
                    @click="toggleHeatmap"
                    :color="heatmapEnabled ? 'primary' : undefined"
                    prepend-icon="mdi-heat-wave"
                  >
                    كثافة
                  </v-btn>
                  <v-btn
                    @click="toggleClustering"
                    :color="clusteringEnabled ? 'primary' : undefined"
                    prepend-icon="mdi-group"
                  >
                    تجميع
                  </v-btn>
                </v-btn-group>

                <v-divider class="my-2" />

                <v-btn-group divided density="comfortable" color="primary">
                  <v-btn
                    @click="fitToResults"
                    prepend-icon="mdi-fit-to-screen"
                  >
                    عرض الكل
                  </v-btn>
                  <v-btn
                    @click="startFlyover"
                    :color="flyoverActive ? 'success' : undefined"
                    prepend-icon="mdi-airplane"
                  >
                    {{ flyoverActive ? 'إيقاف الجولة' : 'جولة طيران' }}
                  </v-btn>
                </v-btn-group>

                <v-divider class="my-2" />

                <!-- Pitch Control -->
                <div class="control-group pa-2">
                  <div class="text-caption font-weight-bold mb-2">زاوية الميل</div>
                  <v-slider
                    v-model="currentPitch"
                    :min="0"
                    :max="85"
                    :step="5"
                    hide-details
                    density="compact"
                    color="primary"
                    @update:model-value="onPitchChange"
                  >
                    <template #append>
                      <span class="text-caption">{{ currentPitch }}°</span>
                    </template>
                  </v-slider>
                </div>

                <!-- Distance Ring Control -->
                <div class="control-group pa-2">
                  <div class="text-caption font-weight-bold mb-2">دائرة المسافة</div>
                  <v-slider
                    v-model="distanceRingRadius"
                    :min="0"
                    :max="10"
                    :step="0.5"
                    hide-details
                    density="compact"
                    color="warning"
                    @update:model-value="onDistanceRingChange"
                  >
                    <template #append>
                      <span class="text-caption">{{ distanceRingRadius }} كم</span>
                    </template>
                  </v-slider>
                </div>
              </div>

              <!-- Legend -->
              <v-card class="map-legend pa-3 elevation-4">
                <div class="text-subtitle-2 font-weight-bold mb-2">الدليل</div>
                <div class="d-flex align-center mb-2">
                  <div class="legend-indicator success-indicator mr-2" />
                  <span class="text-caption">متاحة</span>
                </div>
                <div class="d-flex align-center mb-2">
                  <div class="legend-indicator error-indicator mr-2" />
                  <span class="text-caption">غير متاحة</span>
                </div>
                <div class="d-flex align-center">
                  <div class="legend-indicator user-indicator mr-2" />
                  <span class="text-caption">موقعك</span>
                </div>
              </v-card>

              <div
                v-if="!mapReady"
                class="map-skeleton d-flex align-center justify-center"
              >
                <div class="text-center">
                  <v-progress-circular indeterminate color="primary" size="64" />
                  <p class="text-h6 mt-4">جاري تحميل الخريطة...</p>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Enhanced Details Dialog -->
        <v-dialog v-model="detailsOpen" max-width="600">
          <v-card v-if="selectedAtm" class="details-dialog elevation-8">
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
                  class="ma-4"
                >
                  <v-icon start>mdi-circle</v-icon>
                  {{ selectedAtm.status === 'available' ? 'متاحة' : 'غير متاحة' }}
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
                    <v-icon>mdi-map-marker</v-icon>
                  </template>
                  <v-list-item-title>{{ selectedAtm.address }}</v-list-item-title>
                </v-list-item>

                <v-list-item v-if="selectedAtm.city" class="px-0">
                  <template #prepend>
                    <v-icon>mdi-city</v-icon>
                  </template>
                  <v-list-item-title>{{ selectedAtm.city }}</v-list-item-title>
                </v-list-item>

                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon>mdi-clock-outline</v-icon>
                  </template>
                  <v-list-item-title>
                    {{ selectedAtm.available24h ? 'متاح 24/7' : 'ساعات عمل محدودة' }}
                  </v-list-item-title>
                </v-list-item>

                <v-list-item v-if="selectedAtm.accessible" class="px-0">
                  <template #prepend>
                    <v-icon>mdi-wheelchair-accessibility</v-icon>
                  </template>
                  <v-list-item-title>
                    متاح لذوي الاحتياجات الخاصة
                  </v-list-item-title>
                </v-list-item>

                <v-list-item v-if="nearMe && selectedAtm.distanceKm != null" class="px-0">
                  <template #prepend>
                    <v-icon>mdi-map-marker-distance</v-icon>
                  </template>
                  <v-list-item-title>
                    {{ selectedAtm.distanceKm.toFixed(2) }} كم من موقعك
                  </v-list-item-title>
                </v-list-item>
              </v-list>

              <v-divider class="my-3" />

              <div class="text-subtitle-2 font-weight-bold mb-2">الخدمات المتاحة:</div>
              <div class="d-flex flex-wrap ga-2">
                <v-chip size="small" color="primary" variant="tonal">
                  <v-icon start size="16">mdi-cash</v-icon>
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
})

import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { Ref } from 'vue'
import mapboxgl from 'mapbox-gl'

// Raster styles (token-less) to avoid Mapbox 403 errors
// Base streets: OpenStreetMap
const OSM_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    }
  },
  layers: [
    { id: 'osm', type: 'raster', source: 'osm' }
  ]
} as const

// Satellite (Esri World Imagery)
const SATELLITE_STYLE = {
  version: 8,
  sources: {
    esri: {
      type: 'raster',
      tiles: [
        'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution: 'Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
    }
  },
  layers: [
    { id: 'esri', type: 'raster', source: 'esri' }
  ]
} as const

// IMPORTANT: Replace with your Mapbox access token
// Get a free token at: https://account.mapbox.com/access-tokens/
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' // Public demo token

/**
 * Types
 */
interface ATM {
  id: string
  name: string
  bank: string
  address: string
  city?: string
  lat: number
  lng: number
  status: 'available' | 'unavailable'
  available24h: boolean
  accessible?: boolean
  image?: string
  phone?: string
  distanceKm?: number | null
}

/**
 * State
 */
const search = ref('')
const statusFilter = ref<'all' | 'available' | 'unavailable'>('all')
const bankFilter = ref<string | null>(null)
const nearMe = ref(false)
const radiusKm = ref(10)
const selectedAtm = ref<ATM | null>(null)
const detailsOpen = ref(false)
const mapStyle = ref<'streets' | 'satellite'>('streets')
const is3DEnabled = ref(false)
const buildingsEnabled = ref(false)
const heatmapEnabled = ref(false)
const clusteringEnabled = ref(true)
const currentPitch = ref(0)
const distanceRingRadius = ref(5)
const flyoverActive = ref(false)

// Map refs
const mapEl = ref<HTMLDivElement | null>(null)
const mapReady = ref(false)
let map: mapboxgl.Map | null = null
const markers: mapboxgl.Marker[] = []
let userMarker: mapboxgl.Marker | null = null
let distanceRingCircle: any = null
let flyoverInterval: NodeJS.Timeout | null = null

// User location
const userLocation = ref<{ lat: number; lng: number } | null>(null)

/**
 * Sample ATM Data
 */
const atms = ref<ATM[]>([
  {
    id: '1',
    name: 'صراف الجمهورية - الفرع الرئيسي',
    bank: 'مصرف الجمهورية',
    address: 'شارع عمر المختار',
    city: 'طرابلس',
    lat: 32.8872,
    lng: 13.1913,
    status: 'available',
    available24h: true,
    accessible: true,
    image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&h=600&fit=crop',
    phone: '+218-21-1234567'
  },
  {
    id: '2',
    name: 'ATM الوحدة - سوق الجمعة',
    bank: 'مصرف الوحدة',
    address: 'سوق الجمعة',
    city: 'طرابلس',
    lat: 32.8651,
    lng: 13.1876,
    status: 'unavailable',
    available24h: false,
    accessible: false,
    image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&h=600&fit=crop'
  },
  {
    id: '3',
    name: 'صراف التجاري الوطني - فرع الظهرة',
    bank: 'المصرف التجاري الوطني',
    address: 'شارع الظهرة',
    city: 'بنغازي',
    lat: 32.1165,
    lng: 20.0686,
    status: 'available',
    available24h: true,
    accessible: true,
    image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&h=600&fit=crop'
  },
  {
    id: '4',
    name: 'ATM الصحارى - وسط المدينة',
    bank: 'مصرف الصحارى',
    address: 'شارع جمال عبد الناصر',
    city: 'بنغازي',
    lat: 32.1190,
    lng: 20.0810,
    status: 'available',
    available24h: false,
    accessible: false,
    image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&h=600&fit=crop'
  },
  {
    id: '5',
    name: 'صراف الأمان - المطار الدولي',
    bank: 'مصرف الأمان',
    address: 'مطار طرابلس الدولي',
    city: 'طرابلس',
    lat: 32.6635,
    lng: 13.1590,
    status: 'available',
    available24h: true,
    accessible: true,
    image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&h=600&fit=crop'
  },
  {
    id: '6',
    name: 'ATM الواحة - شارع الفاتح',
    bank: 'مصرف الواحة',
    address: 'شارع الفاتح',
    city: 'مصراتة',
    lat: 32.3754,
    lng: 15.0925,
    status: 'unavailable',
    available24h: false,
    accessible: false,
    image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&h=600&fit=crop'
  },
  {
    id: '7',
    name: 'صراف المتوسط - كورنيش بنغازي',
    bank: 'مصرف المتوسط',
    address: 'كورنيش بنغازي',
    city: 'بنغازي',
    lat: 32.1074,
    lng: 20.0640,
    status: 'available',
    available24h: true,
    accessible: true,
    image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&h=600&fit=crop'
  },
  {
    id: '8',
    name: 'ATM النهر - مدينة سبها',
    bank: 'مصرف النهر',
    address: 'وسط مدينة سبها',
    city: 'سبها',
    lat: 27.0377,
    lng: 14.4283,
    status: 'available',
    available24h: false,
    accessible: false,
    image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&h=600&fit=crop'
  }
]) as Ref<ATM[]>

/**
 * UI Options
 */
const statusOptions = [
  { label: 'الكل', value: 'all' },
  { label: 'متاحة', value: 'available' },
  { label: 'غير متاحة', value: 'unavailable' }
] as const

const bankOptions = computed(() => {
  const set = new Set(atms.value.map(a => a.bank))
  return Array.from(set.values())
})

const statusFilterColor = computed(() => {
  if (statusFilter.value === 'available') return 'success'
  if (statusFilter.value === 'unavailable') return 'error'
  return 'primary'
})

const statusLabel = computed(() => {
  const opt = statusOptions.find(o => o.value === statusFilter.value)
  return opt?.label ?? 'الكل'
})

/**
 * Filtering
 */
const filteredAtms = computed<ATM[]>(() => {
  let list = atms.value.map(a => ({ ...a }))

  // Distance
  if (nearMe.value && userLocation.value) {
    for (const a of list) {
      a.distanceKm = haversine(
        userLocation.value.lat,
        userLocation.value.lng,
        a.lat,
        a.lng
      )
    }
    list = list.filter(a => (a.distanceKm ?? Infinity) <= radiusKm.value)
  } else {
    for (const a of list) a.distanceKm = null
  }

  // Status
  if (statusFilter.value !== 'all') {
    list = list.filter(a => a.status === statusFilter.value)
  }

  // Bank
  if (bankFilter.value) {
    list = list.filter(a => a.bank === bankFilter.value)
  }

  // Search
  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter(a =>
      [a.name, a.bank, a.address, a.city]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(q))
    )
  }

  // Sort
  list.sort((a, b) => {
    if (nearMe.value && userLocation.value) {
      return (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9)
    }
    return a.name.localeCompare(b.name)
  })

  return list
})

/**
 * Stats
 */
const availableCount = computed(() => filteredAtms.value.filter(a => a.status === 'available').length)
const unavailableCount = computed(() => filteredAtms.value.filter(a => a.status === 'unavailable').length)
const nearbyCount = computed(() => {
  if (!nearMe.value || !userLocation.value) return 0
  return filteredAtms.value.filter(a => (a.distanceKm ?? Infinity) <= 5).length
})

/**
 * Map Init (Mapbox GL JS)
 */
async function initMap() {
  await nextTick()
  const container = mapEl.value instanceof HTMLElement ? mapEl.value : document.getElementById('map')
  if (!container) return

  // Use OSM raster style to avoid Mapbox API 403s
  map = new mapboxgl.Map({
    container,
    style: OSM_STYLE as any,
    center: [13.1913, 32.8872],
    zoom: 6,
    pitch: 0,
    bearing: 0,
    antialias: true
  })

  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl(), 'top-left')

  map.on('load', () => {
    mapReady.value = true
    addAtmSourceAndLayers()
    refreshMarkers()
    fitToResults()
  })
}

// Centralized layer/source (re)creation so we can call after style changes
function addAtmSourceAndLayers() {
  if (!map) return
  // Guard: avoid duplicate re-add if already present
  if (map.getSource('atms')) return

  map.addSource('atms', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    },
    cluster: clusteringEnabled.value,
    clusterMaxZoom: 14,
    clusterRadius: 50
  })

  if (clusteringEnabled.value) {
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'atms',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          10,
          '#f1f075',
          30,
          '#f28cb1'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          10,
          30,
          30,
          40
        ]
      }
    })

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'atms',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    })
  }

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'atms',
    filter: clusteringEnabled.value ? ['!', ['has', 'point_count']] : undefined,
    paint: {
      'circle-color': [
        'match',
        ['get', 'status'],
        'available', '#4CAF50',
        'unavailable', '#F44336',
        '#999'
      ],
      'circle-radius': 8,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#fff'
    }
  })

  // Interaction handlers
  map.on('click', 'clusters', (e) => {
    if (!map) return
    const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })
    if (!features || !features.length) return
  const f = features[0]
  if (!f) return
  const clusterId = f.properties && (f.properties as any).cluster_id
    if (clusterId == null) return
    const source = map.getSource('atms') as mapboxgl.GeoJSONSource | undefined
    if (!source) return
    source.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err || zoom == null) return
      const coords = f && (f.geometry as any).coordinates as [number, number] | undefined
      if (!coords) return
      if (map) map.easeTo({ center: coords, zoom })
    })
  })

  map.on('click', 'unclustered-point', (e) => {
    if (!map || !e.features?.length) return
  const first = e.features[0]
  if (!first) return
  const atmId = first.properties && (first.properties as any).id
    if (!atmId) return
    const atm = filteredAtms.value.find(a => a.id === atmId)
    if (atm) focusAtm(atm)
  })

  map.on('mouseenter', 'clusters', () => { if (map) map.getCanvas().style.cursor = 'pointer' })
  map.on('mouseleave', 'clusters', () => { if (map) map.getCanvas().style.cursor = '' })

  if (heatmapEnabled.value) {
    addHeatmap()
  }
}

function updateMapStyle() {
  if (!map || !mapReady.value) return
  const targetStyle = mapStyle.value === 'streets' ? OSM_STYLE : SATELLITE_STYLE
  // setStyle wipes sources/layers; re-add after style loads
  map.setStyle(targetStyle as any)
  map.once('styledata', () => {
    // Rebuild ATM layers after style change
    addAtmSourceAndLayers()
    refreshMarkers()
  })
}

function toggleMapStyle() {
  mapStyle.value = mapStyle.value === 'streets' ? 'satellite' : 'streets'
  updateMapStyle()
}

function toggle3DTerrain() {
  if (!map || !mapReady.value) return
  
  if (is3DEnabled.value) {
    map.setTerrain(null)
    is3DEnabled.value = false
    currentPitch.value = 0
    map.easeTo({ pitch: 0, duration: 1000 })
  } else {
    map.addSource('mapbox-dem', {
      type: 'raster-dem',
      url: 'mapbox://mapbox.terrain-rgb',
      tileSize: 512,
      maxzoom: 14
    })
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })
    is3DEnabled.value = true
    currentPitch.value = 60
    map.easeTo({ pitch: 60, duration: 1000 })
  }
}

function toggleBuildings() {
  if (!map || !mapReady.value) return
  
  if (buildingsEnabled.value) {
    remove3DBuildings()
    buildingsEnabled.value = false
  } else {
    add3DBuildings()
    buildingsEnabled.value = true
  }
}

function add3DBuildings() {
  if (!map || !mapReady.value) return
  
  const layers = map.getStyle().layers
  const labelLayerId = layers?.find(
    (layer: any) => layer.type === 'symbol' && layer.layout?.['text-field']
  )?.id

  if (!map.getLayer('3d-buildings')) {
    map.addLayer(
      {
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      },
      labelLayerId
    )
  }
}

function remove3DBuildings() {
  if (!map || !mapReady.value) return
  if (map.getLayer('3d-buildings')) {
    map.removeLayer('3d-buildings')
  }
}

function toggleHeatmap() {
  if (!map || !mapReady.value) return
  
  if (heatmapEnabled.value) {
    removeHeatmap()
    heatmapEnabled.value = false
  } else {
    addHeatmap()
    heatmapEnabled.value = true
  }
}

function addHeatmap() {
  if (!map || !mapReady.value) return
  
  if (!map.getLayer('atms-heat')) {
    map.addLayer(
      {
        id: 'atms-heat',
        type: 'heatmap',
        source: 'atms',
        maxzoom: 15,
        paint: {
          'heatmap-weight': 1,
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            1,
            15,
            3
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(33,102,172,0)',
            0.2,
            'rgb(103,169,207)',
            0.4,
            'rgb(209,229,240)',
            0.6,
            'rgb(253,219,199)',
            0.8,
            'rgb(239,138,98)',
            1,
            'rgb(178,24,43)'
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            2,
            15,
            20
          ],
          'heatmap-opacity': 0.8
        }
      },
      'unclustered-point'
    )
  }
}

function removeHeatmap() {
  if (!map || !mapReady.value) return
  if (map.getLayer('atms-heat')) {
    map.removeLayer('atms-heat')
  }
}

function toggleClustering() {
  clusteringEnabled.value = !clusteringEnabled.value
  if (map && mapReady.value) {
    const source = map.getSource('atms') as mapboxgl.GeoJSONSource
    if (source) {
      map.removeLayer('clusters')
      map.removeLayer('cluster-count')
      map.removeLayer('unclustered-point')
      if (heatmapEnabled.value) {
        map.removeLayer('atms-heat')
      }
      map.removeSource('atms')
      
      // Re-add with new clustering setting
      map.addSource('atms', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: filteredAtms.value.map(atm => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [atm.lng, atm.lat]
            },
            properties: {
              id: atm.id,
              name: atm.name,
              status: atm.status
            }
          }))
        },
        cluster: clusteringEnabled.value,
        clusterMaxZoom: 14,
        clusterRadius: 50
      })

      if (clusteringEnabled.value) {
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'atms',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              10,
              '#f1f075',
              30,
              '#f28cb1'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              10,
              30,
              30,
              40
            ]
          }
        })

        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'atms',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        })
      }

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'atms',
        filter: clusteringEnabled.value ? ['!', ['has', 'point_count']] : undefined,
        paint: {
          'circle-color': [
            'match',
            ['get', 'status'],
            'available', '#4CAF50',
            'unavailable', '#F44336',
            '#999'
          ],
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      })

      if (heatmapEnabled.value) {
        addHeatmap()
      }
    }
  }
}

function refreshMarkers() {
  if (!mapReady.value || !map) return

  const source = map.getSource('atms') as mapboxgl.GeoJSONSource
  if (source) {
    source.setData({
      type: 'FeatureCollection',
      features: filteredAtms.value.map(atm => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [atm.lng, atm.lat]
        },
        properties: {
          id: atm.id,
          name: atm.name,
          status: atm.status
        }
      }))
    })
  }
}

function focusAtm(atm: ATM) {
  selectedAtm.value = atm
  detailsOpen.value = true
  
  if (map) {
    map.flyTo({
      center: [atm.lng, atm.lat],
      zoom: 16,
      pitch: 60,
      duration: 2000
    })
  }
}

function fitToResults() {
  if (!map || !filteredAtms.value.length) return
  
  const bounds = new mapboxgl.LngLatBounds()
  filteredAtms.value.forEach(atm => bounds.extend([atm.lng, atm.lat]))
  
  map.fitBounds(bounds, { padding: 50, maxZoom: 15 })
}

function locateMe() {
  if (!('geolocation' in navigator)) return
  
  navigator.geolocation.getCurrentPosition(async (pos) => {
    userLocation.value = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    }
    nearMe.value = true

    if (map) {
      // Remove old user marker
      if (userMarker) {
        userMarker.remove()
      }

      // Add new user marker
      const el = document.createElement('div')
      el.className = 'user-marker'
      el.style.width = '30px'
      el.style.height = '30px'
      el.style.borderRadius = '50%'
      el.style.backgroundColor = '#F44336'
      el.style.border = '3px solid white'
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'

      userMarker = new mapboxgl.Marker({ element: el })
        .setLngLat([userLocation.value.lng, userLocation.value.lat])
        .addTo(map)

      map.flyTo({
        center: [userLocation.value.lng, userLocation.value.lat],
        zoom: 14
      })
    }

    await nextTick()
    refreshMarkers()
  })
}

function resetFilters() {
  search.value = ''
  statusFilter.value = 'all'
  bankFilter.value = null
  nearMe.value = false
  radiusKm.value = 10
}

function directionsUrl(atm: ATM) {
  return `https://www.google.com/maps/dir/?api=1&destination=${atm.lat},${atm.lng}`
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
  ]
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'atm-locations-3d.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function onPitchChange(value: number) {
  if (map) {
    map.easeTo({ pitch: value, duration: 500 })
  }
}

function onDistanceRingChange(value: number) {
  // Update distance ring visualization
  if (map && userLocation.value) {
    if (distanceRingCircle) {
      distanceRingCircle.remove()
    }
    // Add circle around user location
    // This would require additional implementation
  }
}

function startFlyover() {
  if (flyoverActive.value) {
    stopFlyover()
    return
  }

  if (!map || filteredAtms.value.length === 0) return

  flyoverActive.value = true
  let currentIndex = 0

  flyoverInterval = setInterval(() => {
    if (currentIndex >= filteredAtms.value.length) {
      currentIndex = 0
    }

    const atm = filteredAtms.value[currentIndex]
    if (!atm || !map) return
    map.flyTo({
      center: [atm.lng, atm.lat],
      zoom: 16,
      pitch: 60,
      bearing: (currentIndex * 45) % 360,
      duration: 3000
    })

    currentIndex++
  }, 4000)
}

function stopFlyover() {
  flyoverActive.value = false
  if (flyoverInterval) {
    clearInterval(flyoverInterval)
    flyoverInterval = null
  }
}

/**
 * Watchers
 */
watch([filteredAtms], () => {
  refreshMarkers()
})

onMounted(() => {
  if (process.client) {
    initMap()
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
  stopFlyover()
})
</script>

<style scoped>
@import 'mapbox-gl/dist/mapbox-gl.css';

#atm-finder-3d {
  direction: rtl;
  background: #f5f5f5;
  min-height: 100vh;
}

.top-bar {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  border-radius: 12px !important;
}

.search-field :deep(.v-field) {
  border-radius: 12px;
}

.stat-card {
  border-radius: 16px !important;
}

.content-row {
  min-height: calc(100vh - 320px);
}

.atm-list-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
}

.list-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(102, 126, 234, 0.3) transparent;
}

.list-container::-webkit-scrollbar {
  width: 6px;
}

.list-container::-webkit-scrollbar-track {
  background: transparent;
}

.list-container::-webkit-scrollbar-thumb {
  background-color: rgba(25, 118, 210, 0.4);
  border-radius: 3px;
}

.atm-list-item {
  background: white;
  border: 2px solid transparent;
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

.map-wrapper {
  position: relative;
  height: calc(100vh - 320px);
  border-radius: 16px;
  overflow: hidden;
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
  background: white;
  border-radius: 12px;
  padding: 12px;
  max-width: 280px;
}

.control-group {
  background: rgba(var(--v-theme-surface), 0.05);
  border-radius: 8px;
}

.map-legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 12px;
}

.legend-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.success-indicator {
  background: #4CAF50;
}

.error-indicator {
  background: #F44336;
}

.user-indicator {
  background: #F44336;
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
    max-width: 240px;
  }

  .map-legend {
    bottom: 10px;
    left: 10px;
  }
}
</style>
