<template>
  <v-container fluid class="pa-0 neo-pos" id="neo-pos">
    <!-- Fullscreen Map -->
    <div ref="mapEl" id="leafletMap" />

    <!-- Floating Glass Panel (RTL) -->
    <v-card class="glass-panel rounded-2xl pa-3" elevation="8">
      <div class="d-flex align-center justify-space-between mb-2">
        <div class="text-subtitle-1 font-weight-bold">متاجر POS & NPG</div>
        <div class="d-flex align-center ga-2">
          <v-btn icon variant="text" @click="toggleFullscreen" :title="'ملء الشاشة'"><v-icon>mdi-fullscreen</v-icon></v-btn>
          <v-btn icon variant="text" @click="recenter" :title="'ملائمة النتائج على الخريطة'"><v-icon>mdi-crosshairs-gps</v-icon></v-btn>
        </div>
      </div>

      <div class="d-flex align-center ga-3 flex-wrap mb-3">
        <v-text-field
          v-model="search"
          density="comfortable"
          hide-details
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          placeholder="ابحث باسم المتجر أو العنوان"
          class="flex-grow-1 min-w-56"
        />

        <v-chip-group v-model="typeFilter" selected-class="text-white" column multiple>
          <v-chip value="POS" :color="typeFilter.includes('POS') ? 'primary' : undefined" variant="elevated" size="small">POS</v-chip>
          <v-chip value="NPG" :color="typeFilter.includes('NPG') ? 'success' : undefined" variant="elevated" size="small">NPG</v-chip>
        </v-chip-group>
      </div>

      <div class="d-flex align-center ga-3 flex-wrap">
        <v-switch v-model="clusterOn" inset hide-details :label="clusterOn ? 'تجميع العلامات مفعّل' : 'تفعيل التجميع'" />
        <v-switch v-model="use3D" inset hide-details :label="use3D ? 'عرض ثلاثي الأبعاد: تشغيل' : '3D تشغيل'" />
        <v-switch v-model="nearMe" inset hide-details :label="nearMe ? `قريب مني (≤ ${radiusKm} كم)` : 'تفعيل القرب مني'" />
        <v-slider v-if="nearMe" v-model="radiusKm" :min="1" :max="50" :step="1" hide-details thumb-label class="radius-slider" />
        <v-btn variant="tonal" size="small" prepend-icon="mdi-target" @click="locateMe">تحديد موقعي</v-btn>
        <v-btn variant="tonal" size="small" prepend-icon="mdi-filter-off" @click="resetFilters">تصفير</v-btn>
      </div>

      <div class="mt-3 d-flex align-center ga-2 text-medium-emphasis">
        <v-chip size="small" variant="flat">{{ filteredMerchants.length }} نتيجة</v-chip>
        <v-chip v-if="nearMe && userLocation" size="small" color="primary" variant="flat">ضمن {{ radiusKm }} كم</v-chip>
      </div>

      <div class="mt-2 list-scroll">
        <v-list lines="one" density="comfortable">
          <v-list-item v-for="m in filteredMerchants" :key="m.id" @click="focusMerchant(m)" class="rounded-lg">
            <template #prepend>
              <v-avatar size="36" :color="serviceColor(m)" class="elevation-1"><v-icon>mdi-storefront-outline</v-icon></v-avatar>
            </template>
            <v-list-item-title class="font-weight-medium">{{ m.name }}</v-list-item-title>
            <v-list-item-subtitle class="text-truncate">{{ m.address }}<span v-if="m.city"> • {{ m.city }}</span></v-list-item-subtitle>
            <template #append>
              <div class="d-flex align-center ga-2">
                <v-chip size="x-small" :color="serviceColor(m)" variant="flat">{{ serviceLabel(m.services) }}</v-chip>
                <v-chip v-if="nearMe && m.distanceKm != null" size="x-small" variant="tonal">{{ m.distanceKm.toFixed(1) }} كم</v-chip>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-card>

    <!-- Dialog -->
    <v-dialog v-model="detailsOpen" max-width="460">
      <v-card>
        <v-card-title class="d-flex align-center ga-2">
          <v-avatar size="36" :color="selectedMerchant ? serviceColor(selectedMerchant) : undefined"><v-icon>mdi-store</v-icon></v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold">{{ selectedMerchant?.name }}</div>
            <div class="text-caption text-medium-emphasis">{{ selectedMerchant?.address }}</div>
          </div>
        </v-card-title>
        <v-card-text>
          <v-chip size="small" :color="selectedMerchant ? serviceColor(selectedMerchant) : undefined" variant="flat" class="mr-2">{{ selectedMerchant ? serviceLabel(selectedMerchant.services) : '' }}</v-chip>
          <v-chip v-if="nearMe && selectedMerchant?.distanceKm != null" size="small" class="mr-2" variant="tonal">{{ selectedMerchant?.distanceKm?.toFixed(1) }} كم بعيداً</v-chip>
          <div class="mt-3 d-flex flex-column ga-2">
            <div><v-icon size="small" class="mr-1">mdi-map-marker</v-icon> {{ selectedMerchant?.city }}</div>
            <div v-if="selectedMerchant?.phone"><v-icon size="small" class="mr-1">mdi-phone</v-icon> {{ selectedMerchant?.phone }}</div>
            <div v-if="selectedMerchant"><v-icon size="small" class="mr-1">mdi-credit-card-outline</v-icon> يقبل البطاقات: {{ (selectedMerchant.cards ?? ['Visa','Mastercard']).join('، ') }}</div>
          </div>
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn variant="text" @click="detailsOpen = false">إغلاق</v-btn>
          <v-btn v-if="selectedMerchant" :href="directionsUrl(selectedMerchant)" target="_blank" color="primary" prepend-icon="mdi-directions">الاتجاهات</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';

definePageMeta({
  layout: 'dashboard'
});

// eslint-disable-next-line no-unused-vars
type Service = 'POS' | 'NPG';
// eslint-disable-next-line no-unused-vars
interface Merchant {
  id: string
  name: string
  address: string
  city?: string
  lat: number
  lng: number
  services: Service[]
  phone?: string
  cards?: string[]
  distanceKm?: number | null
 }

// UI state
const search = ref('')
const typeFilter = ref<Service[]>(['POS','NPG'])
const clusterOn = ref(true)
const use3D = ref(false) // deck.gl overlay (no API key needed)
const nearMe = ref(false)
const radiusKm = ref(10)

// Selection
const selectedMerchant = ref<Merchant | null>(null)
const detailsOpen = ref(false)

// Map refs
const mapEl = ref<HTMLDivElement | null>(null)
let map: any = null
let Lref: any = null // Leaflet global
let clusterLayer: any = null
let markers: any[] = []
let deckLayer: any = null // deck.gl overlay
let locateCtrl: any = null
let fullscreenCtrl: any = null

// User location
const userLocation = ref<{ lat: number; lng: number } | null>(null)

// Sample data (replace with API)
const merchants = ref([
  { id: '1', name: 'تكنو طرابلس', address: 'شارع الجرابة', city: 'طرابلس', lat: 32.885, lng: 13.182, services: ['POS','NPG'] as Service[], phone: '+218-21-1234567', cards: ['Visa','Mastercard'], distanceKm: null as number | null },
  { id: '2', name: 'سوبرماركت السراي', address: 'طريق الشط', city: 'طرابلس', lat: 32.900, lng: 13.190, services: ['POS'] as Service[], distanceKm: null as number | null },
  { id: '3', name: 'مقهى المرجان', address: 'شارع جمال عبد الناصر', city: 'بنغازي', lat: 32.118, lng: 20.066, services: ['NPG'] as Service[], distanceKm: null as number | null },
  { id: '4', name: 'صيدلية النخيل', address: 'شارع عمر المختار', city: 'بنغازي', lat: 32.106, lng: 20.074, services: ['POS','NPG'] as Service[], distanceKm: null as number | null },
  { id: '5', name: 'محطة وقود الميدان', address: 'طريق المطار', city: 'مصراتة', lat: 32.375, lng: 15.092, services: ['POS'] as Service[], distanceKm: null as number | null },
  { id: '6', name: 'مطعم اللؤلؤة', address: 'وسط المدينة', city: 'البيضاء', lat: 32.764, lng: 21.755, services: ['NPG'] as Service[], distanceKm: null as number | null },
]);

// Filtering
const filteredMerchants = computed<Merchant[]>(() => {
  let list = merchants.value.map(m => ({ ...m }))

  // Distance filtering
  if (nearMe.value && userLocation.value) {
    for (const m of list) m.distanceKm = haversine(userLocation.value.lat, userLocation.value.lng, m.lat, m.lng)
    list = list.filter(m => (m.distanceKm ?? Infinity) <= radiusKm.value)
  } else {
    for (const m of list) m.distanceKm = null
  }

  // Type filter
  list = list.filter(m => typeFilter.value.some(t => m.services.includes(t)));

  // Search
  const q = search.value.trim().toLowerCase();
  if (q) {
    list = list.filter(m => [m.name, m.address, m.city].filter(Boolean).some(v => String(v).toLowerCase().includes(q)));
  }

  // Sort
  list.sort((a, b) => {
    if (nearMe.value && userLocation.value) return (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9)
    return a.name.localeCompare(b.name)
  })

  return list
})

function serviceLabel(services: Service[]) { return services.length === 2 ? 'POS + NPG' : services[0] }
function serviceColor(m: Merchant | { services: Service[] }) { return m.services.length === 2 ? 'purple' : (m.services[0] === 'POS' ? 'blue' : 'green') }

// Helpers
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
function directionsUrl(m: Merchant) { return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${m.lat},${m.lng}`)}` }

// Loaders for CSS/JS
function loadCss(href: string) { return new Promise<void>((res, rej) => { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; l.onload = () => res(); l.onerror = rej; document.head.appendChild(l) }) }
function loadScript(src: string) { return new Promise<void>((res, rej) => { const s = document.createElement('script'); s.src = src; s.async = true; s.onload = () => res(); s.onerror = rej; document.body.appendChild(s) }) }

async function ensureLeafletStack() {
  // CSS
  await loadCss('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css')
  await loadCss('https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css')
  await loadCss('https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css')
  await loadCss('https://unpkg.com/leaflet.locatecontrol@0.79.0/dist/L.Control.Locate.min.css')
  await loadCss('https://cdnjs.cloudflare.com/ajax/libs/leaflet.fullscreen/4.0.0/Control.FullScreen.min.css')

  // JS
  await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js')
  await loadScript('https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js')
  await loadScript('https://unpkg.com/leaflet.locatecontrol@0.79.0/dist/L.Control.Locate.min.js')
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/leaflet.fullscreen/4.0.0/Control.FullScreen.min.js')

  // deck.gl overlay (for 3D columns without API keys)
  await loadScript('https://unpkg.com/deck.gl@8.9.36/dist.min.js')
  await loadScript('https://unpkg.com/deck.gl-leaflet@1.3.1/dist/deck.gl-leaflet.min.js')

  // Optional: MapLibre GL inside Leaflet (for real 3D buildings if a vector style with building extrusions is provided)
  await loadCss('https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css')
  await loadScript('https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js')
  await loadScript('https://unpkg.com/@maplibre/maplibre-gl-leaflet@latest/dist/maplibre-gl-leaflet.js')

  // Bind L
  // @ts-ignore
  Lref = (window as any).L
}

function markerIcon(m: Merchant) {
  const color = m.services.length === 2 ? '#7B1FA2' : (m.services[0] === 'POS' ? '#1976D2' : '#2E7D32')
  return Lref.divIcon({
    className: 'neo-marker',
    html: `<div class="pin" style="--c:${color}"></div><div class="badge">${serviceLabel(m.services)}</div>`
  })
}

function buildDeckLayer() {
  // @ts-ignore globals from deck.gl and plugin
  const { deck, LeafletLayer } = (window as any)
  if (!deck || !LeafletLayer) return null

  const data = filteredMerchants.value.map(m => ({ position: [m.lng, m.lat], height: m.services.length === 2 ? 60 : (m.services[0] === 'POS' ? 40 : 30) }))

  // @ts-ignore
  const layer = new LeafletLayer({
    layers: [
      // @ts-ignore
      new deck.ColumnLayer({
        id: 'pos-3d-columns',
        data,
        diskResolution: 12,
        radius: 120,
        extruded: true,
        pickable: true,
        elevationScale: 4,
        getPosition: (d: any) => d.position,
        getElevation: (d: any) => d.height,
        getFillColor: (d: any) => [25, 118, 210, 160],
        onClick: (info: any) => {
          if (info?.object) {
            // Find nearest merchant to clicked column
            const [lng, lat] = info.coordinate
            const nearest = filteredMerchants.value.reduce((acc, m) => {
              const d = haversine(lat, lng, m.lat, m.lng)
              return !acc || d < acc.d ? { m, d } : acc
            }, null as any)
            if (nearest) focusMerchant(nearest.m)
          }
        }
      })
    ]
  })

  return layer
}

function refreshMarkers() {
  if (!map || !Lref) return
  // Clear old
  if (clusterLayer) clusterLayer.clearLayers()
  for (const m of markers) map.removeLayer(m)
  markers = []

  const group = clusterOn.value ? (clusterLayer ?? (clusterLayer = Lref.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 48 }))) : null;
  if (group && !map.hasLayer(group)) map.addLayer(group);

  filteredMerchants.value.forEach(m => {
    const mark = Lref.marker([m.lat, m.lng], { icon: markerIcon(m) })
      .on('click', () => openDetails(m));
    if (group) group.addLayer(mark);
    else mark.addTo(map);
    markers.push(mark);
  });
}

function fitToResults() {
  if (!map || filteredMerchants.value.length === 0) return
  const latlngs = filteredMerchants.value.map(m => [m.lat, m.lng])
  const bounds = Lref.latLngBounds(latlngs)
  map.fitBounds(bounds.pad(0.15), { animate: true })
}

function openDetails(m: Merchant) { selectedMerchant.value = m; detailsOpen.value = true }
function focusMerchant(m: Merchant) {
  selectedMerchant.value = m
  detailsOpen.value = true
  if (map) map.flyTo([m.lat, m.lng], Math.max(map.getZoom(), 14), { duration: 0.8 })
}

async function locateMe() {
  if (!('geolocation' in navigator)) return
  navigator.geolocation.getCurrentPosition(async (pos) => {
    userLocation.value = { lat: pos.coords.latitude, lng: pos.coords.longitude }
    nearMe.value = true
    await nextTick();
    refreshMarkers();
    fitToResults();
    if (locateCtrl) locateCtrl.start()
  })
}

function toggleFullscreen() {
  // Leaflet.fullscreen exposes map.toggleFullscreen();
  if (map && map.toggleFullscreen) map.toggleFullscreen()
}

function recenter() { fitToResults() }

function resetFilters() {
  search.value = ''
  typeFilter.value = ['POS','NPG']
  nearMe.value = false
  radiusKm.value = 10
}

async function initMap() {
  if (!mapEl.value) return
  await ensureLeafletStack()

  // Base map
  map = Lref.map(mapEl.value, { zoomControl: false, attributionControl: true })
  const osm = Lref.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  // Controls
  Lref.control.zoom({ position: 'bottomleft' }).addTo(map)
  // @ts-ignore locate control plugin
  locateCtrl = Lref.control.locate({ position: 'topleft', flyTo: true, keepCurrentZoomLevel: true, strings: { title: 'موقعي' } }).addTo(map)
  // @ts-ignore fullscreen plugin
  fullscreenCtrl = new Lref.Control.Fullscreen({ position: 'topleft', title: { 'false': 'ملء الشاشة', 'true': 'الخروج من ملء الشاشة' } })
  map.addControl(fullscreenCtrl)

  // Geosearch (OpenStreetMap provider)
  // @ts-ignore loaded from CDN
  const GeoSearch = (window as any).leafletGeoSearch
  if (GeoSearch?.GeoSearchControl && GeoSearch?.OpenStreetMapProvider) {
    const provider = new GeoSearch.OpenStreetMapProvider()
    const searchControl = new GeoSearch.GeoSearchControl({ provider, style: 'bar', showMarker: false, retainZoomLevel: false, animateZoom: true })
    map.addControl(searchControl)
  }

  // Initial markers
  refreshMarkers()
  fitToResults()
}

// 3D toggle handler
watch([use3D, filteredMerchants], () => {
  if (!map || !Lref) return
  if (deckLayer) { try { map.removeLayer(deckLayer) } catch (e) {} deckLayer = null }
  if (use3D.value) {
    deckLayer = buildDeckLayer()
    if (deckLayer) map.addLayer(deckLayer)
  }
})

// Update markers when filters change
watch([filteredMerchants, clusterOn], () => { refreshMarkers(); nextTick().then(fitToResults) })

onMounted(() => { if (process.client) initMap() })
</script>

<style scoped>
.neo-pos { position: relative; direction: rtl; height: calc(100vh - 64px); overflow: hidden; }
#leafletMap { position: absolute; inset: 0; z-index: 0; }
.glass-panel {
  position: absolute; top: 16px; right: 16px; width: min(420px, 92vw);
  max-height: calc(100vh - 140px); overflow-y: auto; backdrop-filter: blur(10px);
  background: rgba(255,255,255,0.90); border: 1px solid rgba(255,255,255,0.6);
  z-index: 1000; box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}
.list-scroll { max-height: 42vh; overflow: auto; }
.radius-slider { width: 160px; }

/* Minimalistic pin */
.neo-marker { position: relative; }
.neo-marker .pin { width: 14px; height: 14px; border-radius: 50%; background: var(--c); border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,.35); transform: translateY(6px); }
.neo-marker .badge { position: absolute; top: -22px; right: 50%; transform: translateX(50%); background: #fff; border: 1px solid #eee; padding: 2px 6px; border-radius: 12px; font-size: 10px; white-space: nowrap; }
</style>

<!--
USAGE (Nuxt):
- Save this file as pages/find-pos-neo.vue
- Open /find-pos-neo
- 3D mode uses deck.gl extruded columns (no API keys). For real 3D buildings:
  * Provide a MapLibre style URL that contains a fill-extrusion building layer
  * Then you can add via L.maplibreGL({ style: '<YOUR_STYLE_URL>' }).addTo(map)
  * See MapLibre docs for 3D buildings example
-->
