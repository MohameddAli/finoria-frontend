<template>
  <v-container fluid class="pa-0 atm-pro" id="atm-pro">
    <!-- Fullscreen interactive map -->
    <div ref="mapEl" id="map" />

    <!-- Floating glass control panel -->
    <v-card class="glass-panel rounded-2xl pa-3" elevation="8">
      <div class="d-flex align-center justify-space-between mb-2">
        <div class="text-subtitle-1 font-weight-bold">خريطة أجهزة الصراف (ATM)</div>
        <div class="d-flex align-center ga-2">
          <v-btn icon variant="text" @click="toggleFullscreen" :title="'ملء الشاشة'"><v-icon>mdi-fullscreen</v-icon></v-btn>
          <v-btn icon variant="text" @click="recenter" :title="'ملائمة النتائج على الخريطة'"><v-icon>mdi-crosshairs-gps</v-icon></v-btn>
        </div>
      </div>

      <!-- Filters -->
      <div class="d-flex align-center flex-wrap ga-3">
        <v-text-field v-model="search" variant="outlined" density="comfortable" hide-details prepend-inner-icon="mdi-magnify" placeholder="ابحث باسم البنك أو العنوان" class="flex-grow-1 min-w-56" />

        <v-select v-model="bankFilter" :items="bankOptions" label="البنك" variant="outlined" density="comfortable" hide-details clearable style="min-width: 180px" />

        <v-select v-model="statusFilter" :items="statusOptions" item-title="label" item-value="value" label="الحالة" variant="outlined" density="comfortable" hide-details clearable style="min-width: 170px" />

        <v-switch v-model="features.deposit" inset hide-details :label="features.deposit ? 'يقبل إيداع' : 'إيداع'" />
        <v-switch v-model="features.withdrawOnly" inset hide-details :label="features.withdrawOnly ? 'سحب فقط' : 'سحب فقط'" />

        <v-switch v-model="nearMe" inset hide-details :label="nearMe ? `قريب مني (≤ ${radiusKm} كم)` : 'قريب مني'" />
        <v-slider v-if="nearMe" v-model="radiusKm" :min="1" :max="50" :step="1" hide-details thumb-label class="radius-slider" />

        <v-switch v-model="clusterOn" inset hide-details :label="clusterOn ? 'تجميع' : 'تجميع'" />
        <v-switch v-model="use3D" inset hide-details :label="use3D ? '3D تشغيل' : '3D'" />
        <v-switch v-model="heatmapOn" inset hide-details :label="heatmapOn ? 'Heatmap' : 'Heatmap'" />

        <v-btn size="small" variant="tonal" prepend-icon="mdi-target" @click="locateMe">تحديد موقعي</v-btn>
        <v-btn size="small" variant="tonal" prepend-icon="mdi-filter-off" @click="resetFilters">تصفير</v-btn>
      </div>

      <!-- Counters / Legend -->
      <div class="mt-3 d-flex align-center flex-wrap ga-3 text-medium-emphasis">
        <v-chip size="small" variant="flat">{{ filteredATMs.length }} جهاز</v-chip>
        <div class="legend d-flex align-center ga-2">
          <span class="dot ok"></span><span>شغال</span>
          <span class="dot warn"></span><span>صيانة</span>
          <span class="dot off"></span><span>متوقف</span>
        </div>
      </div>

      <!-- Mini list (optional) -->
      <div class="mt-2 list-scroll">
        <v-list lines="one" density="comfortable">
          <v-list-item v-for="m in topList" :key="m.id" @click="focusATM(m)" class="rounded-lg">
            <template #prepend>
              <v-avatar size="36" :color="statusColor(m.status)" class="elevation-1"><v-icon>mdi-atm</v-icon></v-avatar>
            </template>
            <v-list-item-title class="font-weight-medium">{{ m.bank }} — {{ m.name }}</v-list-item-title>
            <v-list-item-subtitle class="text-truncate">{{ m.address }}</v-list-item-subtitle>
            <template #append>
              <div class="d-flex align-center ga-2">
                <v-chip size="x-small" :color="statusColor(m.status)" variant="flat">{{ statusLabel(m.status) }}</v-chip>
                <v-chip v-if="nearMe && m.distanceKm != null" size="x-small" variant="tonal">{{ m.distanceKm.toFixed(1) }} كم</v-chip>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-card>

    <!-- Details Dialog -->
    <v-dialog v-model="detailsOpen" max-width="520">
      <v-card>
        <v-card-title class="d-flex align-center ga-2">
          <v-avatar size="40" :color="selected ? statusColor(selected.status) : undefined"><v-icon>mdi-atm</v-icon></v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold">{{ selected?.bank }} — {{ selected?.name }}</div>
            <div class="text-caption text-medium-emphasis">{{ selected?.address }}</div>
          </div>
        </v-card-title>
        <v-card-text>
          <div class="d-flex align-center ga-3 mb-2">
            <v-chip size="small" :color="selected ? statusColor(selected.status) : undefined" variant="flat">{{ selected ? statusLabel(selected.status) : '' }}</v-chip>
            <v-chip v-if="nearMe && selected?.distanceKm != null" size="small" variant="tonal">{{ selected?.distanceKm?.toFixed(1) }} كم</v-chip>
            <v-chip v-if="selected?.features.deposit" size="small" color="primary" variant="flat">إيداع</v-chip>
            <v-chip v-if="selected?.features.withdrawOnly" size="small" color="deep-orange" variant="flat">سحب فقط</v-chip>
          </div>
          <div class="text-medium-emphasis">
            <div><v-icon size="18" class="mr-1">mdi-timer-sand</v-icon> آخر تحديث: {{ formatRelative(selected?.lastPing) }}</div>
            <div><v-icon size="18" class="mr-1">mdi-credit-card-outline</v-icon> بطاقات مقبولة: {{ (selected?.cards ?? ['Visa','Mastercard']).join('، ') }}</div>
          </div>
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn variant="text" @click="detailsOpen = false">إغلاق</v-btn>
          <div class="d-flex align-center ga-2">
            <v-btn :href="directionsUrl(selected)" target="_blank" color="primary" prepend-icon="mdi-directions">الاتجاهات</v-btn>
          </div>
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
type ATMStatus = 'OK' | 'WARN' | 'OFF';
// eslint-disable-next-line no-unused-vars
interface ATM {
  id: string
  name: string
  bank: string
  address: string
  city?: string
  lat: number
  lng: number
  status: ATMStatus
  lastPing: number // epoch ms
  features: { deposit: boolean; withdrawOnly: boolean }
  cards?: string[]
  distanceKm?: number | null
 }

// UI state
const search = ref('');
const bankFilter = ref<string | null>(null);
const statusFilter = ref<ATMStatus | null>(null);
const features = ref({ deposit: false, withdrawOnly: false });
const nearMe = ref(false)
const radiusKm = ref(15)
const clusterOn = ref(true)
const use3D = ref(true)
const heatmapOn = ref(false)

const detailsOpen = ref(false)
const selected = ref<ATM | null>(null)

// Map refs
const mapEl = ref<HTMLDivElement | null>(null)
let map: any = null
let Lref: any = null
let clusterLayer: any = null
let markers: any[] = []
let locateCtrl: any = null
let deckLayer: any = null
let heatLayer: any = null

// User location
const userLocation = ref<{ lat: number; lng: number } | null>(null)

// Sample data (replace with API)
const atms = ref([
  mkATM('ATM السراي 1', 'مصرف الجمهورية', 'طرابلس - طريق الشط', 32.896, 13.191, 'OK', { deposit: true, withdrawOnly: false }),
  mkATM('ATM البرج 2', 'مصرف الوحدة', 'طرابلس - شارع الجرابة', 32.884, 13.180, 'WARN', { deposit: false, withdrawOnly: true }),
  mkATM('ATM الفاتح', 'مصرف التجاري الوطني', 'بنغازي - شارع جمال', 32.118, 20.066, 'OK', { deposit: true, withdrawOnly: false }),
  mkATM('ATM الميدان', 'مصرف الصحارى', 'مصراتة - طريق المطار', 32.375, 15.092, 'OFF', { deposit: false, withdrawOnly: true }),
  mkATM('ATM الجامعة', 'مصرف الجمهورية', 'البيضاء - وسط المدينة', 32.764, 21.755, 'OK', { deposit: false, withdrawOnly: false }),
]);

function mkATM(name: string, bank: string, address: string, lat: number, lng: number, status: ATMStatus, features: { deposit: boolean; withdrawOnly: boolean }): ATM {
  return { id: Math.random().toString(36).slice(2), name, bank, address, lat, lng, status, lastPing: Date.now() - Math.floor(Math.random()*3600*1000), features, cards: ['Visa','Mastercard'], distanceKm: null }
}

// Options
const bankOptions = computed(() => Array.from(new Set(atms.value.map(a => a.bank))))
const statusOptions = [
  { label: 'شغال', value: 'OK' },
  { label: 'صيانة', value: 'WARN' },
  { label: 'متوقف', value: 'OFF' },
] as const

// Filtering
const filteredATMs = computed<ATM[]>(() => {
  let list = atms.value.map(a => ({ ...a }));
  if (nearMe.value && userLocation.value) {
    for (const a of list) a.distanceKm = haversine(userLocation.value.lat, userLocation.value.lng, a.lat, a.lng);
    list = list.filter(a => (a.distanceKm ?? Infinity) <= radiusKm.value);
  } else {
    for (const a of list) a.distanceKm = null;
  }
  const q = search.value.trim().toLowerCase();
  if (q) list = list.filter(a => [a.name, a.bank, a.address, a.city].filter(Boolean).some(v => String(v).toLowerCase().includes(q)));
  if (bankFilter.value) list = list.filter(a => a.bank === bankFilter.value);
  if (statusFilter.value) list = list.filter(a => a.status === statusFilter.value);
  if (features.value.deposit) list = list.filter(a => a.features.deposit);
  if (features.value.withdrawOnly) list = list.filter(a => a.features.withdrawOnly);
  // sort by status then distance/name
  list.sort((a,b) => statusRank(a.status) - statusRank(b.status) || (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9) || a.name.localeCompare(b.name));
  return list;
});

const topList = computed(() => filteredATMs.value.slice(0, 8));

function statusRank(s: ATMStatus) { return s === 'OK' ? 0 : s === 'WARN' ? 1 : 2 }
function statusLabel(s: ATMStatus) { return s === 'OK' ? 'شغال' : s === 'WARN' ? 'صيانة' : 'متوقف' }
function statusColor(s: ATMStatus) { return s === 'OK' ? 'green' : s === 'WARN' ? 'amber' : 'red' }

// Map stack loaders
function loadCss(href: string) { return new Promise<void>((res, rej) => { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; l.onload = () => res(); l.onerror = rej; document.head.appendChild(l) }) }
function loadScript(src: string) { return new Promise<void>((res, rej) => { const s = document.createElement('script'); s.src = src; s.async = true; s.onload = () => res(); s.onerror = rej; document.body.appendChild(s) }) }

async function ensureLeafletStack() {
  await loadCss('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css')
  await loadCss('https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css')
  await loadCss('https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css')
  await loadCss('https://unpkg.com/leaflet.locatecontrol@0.79.0/dist/L.Control.Locate.min.css')
  await loadCss('https://cdnjs.cloudflare.com/ajax/libs/leaflet.fullscreen/4.0.0/Control.FullScreen.min.css')

  await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js')
  await loadScript('https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js')
  await loadScript('https://unpkg.com/leaflet.locatecontrol@0.79.0/dist/L.Control.Locate.min.js')
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/leaflet.fullscreen/4.0.0/Control.FullScreen.min.js')
  await loadScript('https://unpkg.com/deck.gl@8.9.36/dist.min.js')
  await loadScript('https://unpkg.com/deck.gl-leaflet@1.3.1/dist/deck.gl-leaflet.min.js')
  await loadScript('https://unpkg.com/leaflet.heat/dist/leaflet-heat.js')
  // Bind L
  // @ts-ignore
  Lref = (window as any).L
}

function markerIcon(a: ATM) {
  const color = a.status === 'OK' ? '#2E7D32' : a.status === 'WARN' ? '#F9A825' : '#C62828'
  return Lref.divIcon({ className: 'atm-marker', html: `<div class=pin style="--c:${color}"></div><div class=badge>${statusLabel(a.status)}</div>` })
}

function refreshMarkers() {
  if (!map || !Lref) return
  if (clusterLayer) clusterLayer.clearLayers();
  for (const m of markers) try { map.removeLayer(m) } catch {}
  markers = [];
  const group = clusterOn.value ? (clusterLayer ?? (clusterLayer = Lref.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 52 }))) : null;
  if (group && !map.hasLayer(group)) map.addLayer(group);
  filteredATMs.value.forEach(a => {
    const mark = Lref.marker([a.lat, a.lng], { icon: markerIcon(a) }).on('click', () => openDetails(a));
    if (group) group.addLayer(mark);
    else mark.addTo(map);
    markers.push(mark);
  });
}

function fitToResults() {
  if (!map || filteredATMs.value.length === 0) return;
  const latlngs = filteredATMs.value.map(a => [a.lat, a.lng]);
  const bounds = Lref.latLngBounds(latlngs);
  map.fitBounds(bounds.pad(0.15), { animate: true });
}

function buildDeckLayer() {
  // @ts-ignore globals deck & LeafletLayer from deck.gl-leaflet
  const { deck, LeafletLayer } = (window as any);
  if (!deck || !LeafletLayer) return null;
  const data = filteredATMs.value.map(a => ({ position: [a.lng, a.lat], height: a.status === 'OK' ? 60 : a.status === 'WARN' ? 35 : 18, color: a.status === 'OK' ? [46,125,50,180] : a.status === 'WARN' ? [249,168,37,200] : [198,40,40,200] }));
  // @ts-ignore
  return new LeafletLayer({
    layers: [
      // @ts-ignore
      new deck.ColumnLayer({ id: 'atm-3d', data, diskResolution: 12, radius: 120, extruded: true, pickable: true, elevationScale: 4, getPosition: (d:any) => d.position, getElevation: (d:any) => d.height, getFillColor: (d:any) => d.color, onClick: (info:any) => { if (info?.coordinate) { const [lng,lat] = info.coordinate; const nearest = filteredATMs.value.reduce((acc,a)=>{ const d=haversine(lat,lng,a.lat,a.lng); return !acc||d<acc.d?{a,d}:acc },null as any); if(nearest) focusATM(nearest.a) } } })
    ]
  });
}

function refresh3D() {
  if (!map || !Lref) return;
  if (deckLayer) { try { map.removeLayer(deckLayer) } catch {} deckLayer = null; }
  if (use3D.value) { deckLayer = buildDeckLayer(); if (deckLayer) map.addLayer(deckLayer); }
}

function refreshHeatmap() {
  if (!map || !Lref) return;
  if (heatLayer) { try { map.removeLayer(heatLayer) } catch {} heatLayer = null; }
  if (heatmapOn.value) {
    const points = filteredATMs.value.map(a => [a.lat, a.lng, a.status === 'OK' ? .4 : a.status === 'WARN' ? .7 : 1]);
    // @ts-ignore
    heatLayer = (Lref as any).heatLayer(points, { radius: 28, blur: 22, maxZoom: 14 });
    heatLayer.addTo(map);
  }
}

function openDetails(a: ATM) { selected.value = a; detailsOpen.value = true; }
function focusATM(a: ATM) { selected.value = a; detailsOpen.value = true; if (map) map.flyTo([a.lat, a.lng], Math.max(map.getZoom(), 14), { duration: 0.8 }); }

async function locateMe() {
  if (!('geolocation' in navigator)) return;
  navigator.geolocation.getCurrentPosition(async (pos) => {
    userLocation.value = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    nearMe.value = true;
    await nextTick(); refreshComputed(); if (locateCtrl) try { locateCtrl.start() } catch {}
  });
}

function toggleFullscreen() { if (map && map.toggleFullscreen) map.toggleFullscreen(); }
function recenter() { fitToResults(); }

function resetFilters() {
  search.value = '';
  bankFilter.value = null;
  statusFilter.value = null;
  features.value = { deposit: false, withdrawOnly: false };
  nearMe.value = false;
  radiusKm.value = 15;
  clusterOn.value = true;
  heatmapOn.value = false;
}

function formatRelative(ts?: number) {
  if (!ts) return '-';
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `${mins} د`;
  const hrs = Math.round(mins/60);
  if (hrs < 24) return `${hrs} س`;
  const days = Math.round(hrs/24);
  return `${days} يوم`;
}

function directionsUrl(a?: ATM | null) { if (!a) return '#'; return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${a.lat},${a.lng}`)}`; }

// Utilities
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) { const toRad = (v: number) => (v*Math.PI)/180; const R=6371; const dLat=toRad(lat2-lat1); const dLon=toRad(lon2-lon1); const a=Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2; return 2*R*Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); }

// Initialize map
async function initMap() {
  if (!mapEl.value) return;
  await ensureLeafletStack();
  map = Lref.map(mapEl.value, { zoomControl: false, attributionControl: true });
  const osm = Lref.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
  Lref.control.zoom({ position: 'bottomleft' }).addTo(map);
  // @ts-ignore locatecontrol
  locateCtrl = Lref.control.locate({ position: 'topleft', flyTo: true, keepCurrentZoomLevel: true, strings: { title: 'موقعي' } });
  map.addControl(locateCtrl);
  // @ts-ignore fullscreen plugin
  map.addControl(new Lref.Control.Fullscreen({ position: 'topleft', title: { 'false': 'ملء الشاشة', 'true': 'الخروج من ملء الشاشة' } }));

  refreshComputed();
  fitToResults();
}

function refreshComputed() { refreshMarkers(); refresh3D(); refreshHeatmap(); }

// Auto-refresh ATM status simulation (replace with real-time API/WebSocket)
let ticker: any = null;
function startTicker() {
  if (ticker) clearInterval(ticker);
  ticker = setInterval(() => {
    // Randomly toggle statuses to simulate updates
    atms.value = atms.value.map(a => {
      const r = Math.random();
      const s: ATMStatus = r < 0.85 ? a.status : (['OK','WARN','OFF'] as const)[Math.floor(Math.random()*3)] as ATMStatus;
      return { ...a, status: s, lastPing: Date.now() };
    });
    refreshComputed();
  }, 10000);
}

// Watchers
watch([filteredATMs, clusterOn], () => { refreshMarkers(); nextTick().then(()=>{ fitToResults(); refresh3D(); refreshHeatmap(); }); });
watch([use3D], () => refresh3D());
watch([heatmapOn], () => refreshHeatmap());

onMounted(() => { if (process.client) { initMap(); startTicker(); } });
</script>

<style scoped>
.atm-pro { position: relative; direction: rtl; height: calc(100vh - 64px); overflow: hidden; }
#map { position: absolute; inset: 0; z-index: 0; }
.glass-panel { position: absolute; top: 16px; right: 16px; width: min(460px, 92vw); max-height: calc(100vh - 140px); overflow-y: auto; backdrop-filter: blur(10px); background: rgba(255,255,255,.90); border: 1px solid rgba(255,255,255,.6); z-index: 1000; box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
.list-scroll { max-height: 40vh; overflow: auto; }
.radius-slider { width: 160px; }

/* Markers */
.atm-marker { position: relative; }
.atm-marker .pin { width: 14px; height: 14px; border-radius: 50%; background: var(--c); border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,.35); transform: translateY(6px); }
.atm-marker .badge { position: absolute; top: -22px; right: 50%; transform: translateX(50%); background: #fff; border: 1px solid #eee; padding: 2px 6px; border-radius: 12px; font-size: 10px; white-space: nowrap; }
.legend .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; border: 1px solid rgba(0,0,0,.1) }
.legend .dot.ok { background: #2E7D32 }
.legend .dot.warn { background: #F9A825 }
.legend .dot.off { background: #C62828 }
</style>

<!--
USAGE
- احفظ الملف باسم: pages/atm-map-pro.vue
- افتح: /atm-map-pro
- يعتمد على Leaflet + markercluster + locatecontrol + fullscreen + deck.gl 3D + heatmap
- لا تحتاج مفاتيح API للإعداد الافتراضي (OSM + deck.gl للأعمدة ثلاثية الأبعاد)
- لاستبدال بيانات atms[] بباك-إندك، زوّد حقل status (OK/WARN/OFF)، lastPing (ms)، ومزايا الجهاز.
- للتحديث الآني: اربط WebSocket أو poll كل 30-60 ثانية بدل محاكي startTicker()
-->
