<template>
  <v-container fluid class="pa-0 pos-locations-page" id="pos-finder">
    <!-- Top Filters Bar -->
    <v-card flat class="px-4 py-3 mb-2">
      <div class="d-flex align-center justify-space-between flex-wrap ga-3">
        <h2 class="text-h6 font-weight-bold">
          البحث عن نقاط البيع (POS & NPG)
        </h2>

        <div class="d-flex align-center ga-3 flex-wrap">
          <v-text-field
            v-model="search"
            dense
            hide-details
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            placeholder="ابحث باسم المتجر أو العنوان"
            style="min-width: 260px"
          />

          <v-select
            v-model="typeFilter"
            :items="typeOptions"
            item-title="label"
            item-value="value"
            label="نوع الخدمة"
            dense
            hide-details
            variant="outlined"
            style="min-width: 170px"
          />

          <v-select
            v-model="cityFilter"
            :items="cityOptions"
            label="المدينة"
            dense
            hide-details
            variant="outlined"
            style="min-width: 160px"
            clearable
          />

          <v-switch
            v-model="nearMe"
            color="primary"
            hide-details
            inset
            :label="nearMe ? `قريب مني (≤ ${radiusKm} كم)` : 'تفعيل القرب مني'"
          />

          <v-slider
            v-if="nearMe"
            v-model="radiusKm"
            :min="1"
            :max="50"
            :step="1"
            class="radius-slider"
            hide-details
            thumb-label
            style="width: 180px"
          />

          <v-btn
            variant="tonal"
            @click="resetFilters"
            prepend-icon="mdi-filter-off"
            >إعادة التعيين</v-btn
          >
          <v-btn variant="tonal" @click="exportCsv" prepend-icon="mdi-download"
            >تصدير CSV</v-btn
          >
        </div>
      </div>
    </v-card>

    <!-- Content Split: List (left) + Map (right) -->
    <v-row no-gutters class="h-100">
      <v-col
        cols="12"
        md="5"
        class="pa-3 order-2 order-md-1"
        style="max-height: calc(100vh - 200px); overflow: hidden"
      >
        <v-card
          variant="elevated"
          class="h-100 rounded-xl pa-2 d-flex flex-column"
        >
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="text-body-1">
              النتائج: <strong>{{ filteredMerchants.length }}</strong>
              <v-chip size="small" class="ml-2" variant="flat">{{
                typeLabel(typeFilter)
              }}</v-chip>
              <v-chip
                v-if="nearMe && userLocation"
                size="small"
                class="ml-2"
                color="primary"
                variant="flat"
              >
                ضمن {{ radiusKm }} كم
              </v-chip>
            </div>
            <v-btn
              size="small"
              variant="text"
              prepend-icon="mdi-crosshairs-gps"
              @click="locateMe"
              >تحديد موقعي</v-btn
            >
          </v-card-title>

          <v-divider class="my-1" />

          <!-- List with virtual scroll -->
          <div class="flex-grow-1 overflow-auto pr-2" ref="listScroll">
            <v-virtual-scroll
              :items="filteredMerchants"
              :item-height="96"
              height="100%"
            >
              <template #default="{ item }">
                <v-list-item
                  :key="item.id"
                  density="comfortable"
                  class="rounded-lg my-1"
                  :class="{
                    'active-item':
                      selectedMerchant && selectedMerchant.id === item.id,
                  }"
                  @click="focusMerchant(item)"
                >
                  <template #prepend>
                    <v-avatar
                      size="40"
                      :color="serviceColor(item)"
                      class="elevation-1"
                    >
                      <v-icon>mdi-storefront-outline</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-medium">{{
                    item.name
                  }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <span class="text-medium-emphasis">{{ item.address }}</span>
                    <span v-if="item.city"> • {{ item.city }}</span>
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="d-flex align-center ga-2">
                      <v-chip
                        size="x-small"
                        :color="serviceColor(item)"
                        variant="flat"
                      >
                        {{ serviceLabel(item.services) }}
                      </v-chip>
                      <v-chip
                        v-if="nearMe && item.distanceKm != null"
                        size="x-small"
                        variant="tonal"
                      >
                        {{ item.distanceKm.toFixed(1) }} كم
                      </v-chip>
                      <v-btn
                        icon
                        variant="text"
                        @click.stop="openDetails(item)"
                      >
                        <v-icon>mdi-information-outline</v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="7" class="pa-0 order-1 order-md-2">
        <div class="map-wrapper">
          <div id="map" ref="mapEl" class="rounded-0 rounded-md-xl" />
          <div
            v-if="!mapReady"
            class="map-skeleton d-flex align-center justify-center"
          >
            <v-progress-circular indeterminate size="36" />
            <span class="ml-3">جارٍ تحميل الخريطة…</span>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Details Dialog -->
    <v-dialog v-model="detailsOpen" max-width="480">
      <v-card>
        <v-card-title class="d-flex align-center ga-2">
          <v-avatar
            size="36"
            :color="
              selectedMerchant ? serviceColor(selectedMerchant) : undefined
            "
          >
            <v-icon>mdi-store</v-icon>
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold">
              {{ selectedMerchant?.name }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ selectedMerchant?.address }}
            </div>
          </div>
        </v-card-title>
        <v-card-text>
          <v-chip
            size="small"
            :color="
              selectedMerchant ? serviceColor(selectedMerchant) : undefined
            "
            variant="flat"
            class="mr-2"
          >
            {{
              selectedMerchant ? serviceLabel(selectedMerchant.services) : ""
            }}
          </v-chip>
          <v-chip
            v-if="nearMe && selectedMerchant?.distanceKm != null"
            size="small"
            class="mr-2"
            variant="tonal"
          >
            {{ selectedMerchant?.distanceKm?.toFixed(1) }} كم بعيداً
          </v-chip>

          <div class="mt-3 d-flex flex-column ga-2">
            <div>
              <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
              {{ selectedMerchant?.city }}
            </div>
            <div v-if="selectedMerchant?.phone">
              <v-icon size="small" class="mr-1">mdi-phone</v-icon>
              {{ selectedMerchant?.phone }}
            </div>
            <div v-if="selectedMerchant">
              <v-icon size="small" class="mr-1">mdi-credit-card-outline</v-icon>
              يقبل البطاقات:
              {{
                (selectedMerchant.cards ?? ["Visa", "Mastercard"]).join("، ")
              }}
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn variant="text" @click="detailsOpen = false">إغلاق</v-btn>
          <v-btn
            v-if="selectedMerchant"
            :href="directionsUrl(selectedMerchant)"
            target="_blank"
            color="primary"
            prepend-icon="mdi-directions"
          >
            الاتجاهات
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
import { ref, computed, watch, onMounted, nextTick } from "vue";
import type { Ref } from "vue";

/**
 * Types
 */
type Service = "POS" | "NPG";
interface Merchant {
  id: string;
  name: string;
  address: string;
  city?: string;
  lat: number;
  lng: number;
  services: Service[]; // e.g., ['POS'] or ['POS','NPG']
  phone?: string;
  cards?: string[];
  distanceKm?: number | null;
}

/**
 * Reactive state
 */
const search = ref("");
const typeFilter = ref<"all" | "POS" | "NPG" | "BOTH">("all");
const nearMe = ref(false);
const radiusKm = ref(10);
const cityFilter = ref<string | null>(null);
const selectedMerchant = ref<Merchant | null>(null);
const detailsOpen = ref(false);

// Map refs
const mapEl = ref<HTMLDivElement | null>(null);
const mapReady = ref(false);
let map: any = null;
const markers = new Map<string, any>();
let popup: any = null;

// User location
const userLocation = ref<{ lat: number; lng: number } | null>(null);

// Sample data (replace with API call)
const merchants = ref<Merchant[]>([
  {
    id: "1",
    name: "متجر المدينة للتقنية",
    address: "شارع الجرابة",
    city: "طرابلس",
    lat: 32.885,
    lng: 13.182,
    services: ["POS", "NPG"],
    phone: "+218-21-1234567",
    cards: ["Visa", "Mastercard"],
  },
  {
    id: "2",
    name: "سوبرماركت السراي",
    address: "طريق الشط",
    city: "طرابلس",
    lat: 32.9,
    lng: 13.19,
    services: ["POS"],
    phone: "+218-21-1111111",
  },
  {
    id: "3",
    name: "مقهى المرجان",
    address: "شارع جمال عبد الناصر",
    city: "بنغازي",
    lat: 32.118,
    lng: 20.066,
    services: ["NPG"],
    phone: "+218-61-2222222",
  },
  {
    id: "4",
    name: "صيدلية النخيل",
    address: "شارع عمر المختار",
    city: "بنغازي",
    lat: 32.106,
    lng: 20.074,
    services: ["POS", "NPG"],
  },
  {
    id: "5",
    name: "محطة وقود الميدان",
    address: "طريق المطار",
    city: "مصراتة",
    lat: 32.375,
    lng: 15.092,
    services: ["POS"],
  },
  {
    id: "6",
    name: "مطعم اللؤلؤة",
    address: "وسط المدينة",
    city: "البيضاء",
    lat: 32.764,
    lng: 21.755,
    services: ["NPG"],
  },
]) as Ref<Merchant[]>;

/**
 * UI Options
 */
const typeOptions = [
  { label: "الكل", value: "all" },
  { label: "POS فقط", value: "POS" },
  { label: "NPG فقط", value: "NPG" },
  { label: "POS + NPG معًا", value: "BOTH" },
] as const;

const cityOptions = computed(() => {
  const set = new Set(
    merchants.value.map((m) => m.city).filter(Boolean) as string[]
  );
  return Array.from(set.values());
});

function typeLabel(v: "all" | "POS" | "NPG" | "BOTH") {
  return typeOptions.find((o) => o.value === v)?.label ?? "الكل";
}

function serviceLabel(services: Service[]) {
  if (services.length === 2) return "POS + NPG";
  return services[0];
}

function serviceColor(m: Merchant | { services: Service[] }) {
  if (m.services.length === 2) return "purple";
  return m.services[0] === "POS" ? "blue" : "green";
}

/**
 * Filtering & Sorting
 */
const filteredMerchants = computed<Merchant[]>(() => {
  let list = merchants.value.map((m) => ({ ...m }));

  // Distance calc if needed
  if (nearMe.value && userLocation.value) {
    for (const m of list) {
      m.distanceKm = haversine(
        userLocation.value.lat,
        userLocation.value.lng,
        m.lat,
        m.lng
      );
    }
    list = list.filter((m) => (m.distanceKm ?? Infinity) <= radiusKm.value);
  } else {
    for (const m of list) m.distanceKm = null;
  }

  // City
  if (cityFilter.value) list = list.filter((m) => m.city === cityFilter.value);

  // Type filter
  list = list.filter((m) => matchesType(m, typeFilter.value));

  // Search
  const q = search.value.trim().toLowerCase();
  if (q) {
    list = list.filter((m) =>
      [m.name, m.address, m.city]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }

  // Sort: by distance if available, otherwise by name
  list.sort((a, b) => {
    if (nearMe.value && userLocation.value) {
      return (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9);
    }
    return a.name.localeCompare(b.name);
  });

  return list;
});

function matchesType(m: Merchant, f: "all" | "POS" | "NPG" | "BOTH") {
  if (f === "all") return true;
  if (f === "BOTH")
    return m.services.includes("POS") && m.services.includes("NPG");
  return m.services.includes(f);
}

/**
 * Map setup (MapLibre GL JS, OSM tiles)
 */
async function initMap() {
  console.log("🗺️ Starting map initialization...");

  try {
    // Wait for DOM to render
    await nextTick();
    console.log("✅ nextTick completed");

    // Get container element
    const container = document.getElementById("map");
    if (!container) {
      console.error("❌ Map container not found");
      return;
    }
    console.log("✅ Map container found:", container);

    // Lazy-load maplibre and CSS to avoid SSR issues
    console.log("⏳ Loading MapLibre GL...");
    const { Map, Marker, Popup } = await import("maplibre-gl");
    console.log("✅ MapLibre GL loaded");

    // Inject CSS
    const cssHref = "https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css";
    if (!document.querySelector(`link[href="${cssHref}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssHref;
      document.head.appendChild(link);
      console.log("✅ MapLibre CSS injected");
    } else {
      console.log("ℹ️ MapLibre CSS already loaded");
    }

    // Create map with OSM raster source (no API key required)
    console.log("⏳ Creating map instance...");
    map = new Map({
      container,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: [13.182, 32.885],
      zoom: 10,
      hash: false,
      pitchWithRotate: false,
    });
    console.log("✅ Map instance created");

    popup = new Popup({ closeButton: true, closeOnClick: true });

    map.on("load", () => {
      console.log("✅ Map loaded successfully");
      mapReady.value = true;
      refreshMarkers();
      fitToResults();
    });

    // Handle map errors
    map.on("error", (e: any) => {
      console.error("❌ Map error:", e);
    });

    // Close popup when clicking on map blank area
    map.on("click", () => popup?.remove());
  } catch (error) {
    console.error("❌ Failed to initialize map:", error);
    // Don't throw - let the page continue to work without map
  }
}

function markerHtml(m: Merchant) {
  const color =
    m.services.length === 2
      ? "#7B1FA2"
      : m.services[0] === "POS"
      ? "#1976D2"
      : "#2E7D32";
  return `<div class="marker" style="--color:${color}">
    <span class="dot"></span>
    <span class="badge">${
      m.services.length === 2 ? "POS+NPG" : m.services[0]
    }</span>
  </div>`;
}

async function refreshMarkers() {
  if (!mapReady.value || !map) return;

  try {
    // Remove markers not in filtered
    const ids = new Set(filteredMerchants.value.map((m) => m.id));
    for (const [id, mk] of Array.from(markers.entries())) {
      if (!ids.has(id)) {
        mk.remove();
        markers.delete(id);
      }
    }

    // Add/update markers for filtered merchants
    const { Marker } = await import("maplibre-gl");

    for (const m of filteredMerchants.value) {
      let mk = markers.get(m.id);
      if (!mk) {
        const el = document.createElement("div");
        el.innerHTML = markerHtml(m);
        const node = el.firstElementChild as HTMLElement;
        node.addEventListener("click", (e) => {
          e.stopPropagation();
          openPopup(m);
        });
        mk = new Marker({ element: node, anchor: "bottom" })
          .setLngLat([m.lng, m.lat])
          .addTo(map);
        markers.set(m.id, mk);
      } else {
        mk.setLngLat([m.lng, m.lat]);
      }
    }
  } catch (error) {
    console.error("Failed to refresh markers:", error);
  }
}

function openPopup(m: Merchant) {
  selectedMerchant.value = m;
  popup
    ?.setLngLat([m.lng, m.lat])
    .setHTML(
      `<div style="min-width: 220px">
      <div style="font-weight:600; font-size: 14px">${m.name}</div>
      <div style="color:#666; font-size:12px">${m.address}${
        m.city ? " • " + m.city : ""
      }</div>
      <div style="margin-top:6px"><span style="background:#eee; padding:2px 6px; border-radius:12px; font-size:12px">${serviceLabel(
        m.services
      )}</span></div>
    </div>`
    )
    .addTo(map);
}

function fitToResults() {
  if (!map) return;
  const list = filteredMerchants.value;
  if (!list.length) return;
  const lats = list.map((m) => m.lat);
  const lngs = list.map((m) => m.lng);
  const minLat = Math.min(...lats),
    maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs),
    maxLng = Math.max(...lngs);
  // add small padding
  const pad = 0.02;
  map.fitBounds(
    [
      [minLng - pad, minLat - pad],
      [maxLng + pad, maxLat + pad],
    ],
    { padding: 40, duration: 400 }
  );
}

function focusMerchant(m: Merchant) {
  selectedMerchant.value = m;
  if (map) {
    map.easeTo({
      center: [m.lng, m.lat],
      zoom: Math.max(map.getZoom(), 13),
      duration: 600,
    });
    openPopup(m);
  }
}

// Open details dialog (used by template button)
function openDetails(m: Merchant) {
  selectedMerchant.value = m;
  detailsOpen.value = true;
}

function resetFilters() {
  search.value = "";
  typeFilter.value = "all";
  cityFilter.value = null;
  nearMe.value = false;
  radiusKm.value = 10;
}

function directionsUrl(m: Merchant) {
  const dest = `${m.lat},${m.lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    dest
  )}`;
}

async function locateMe() {
  if (!("geolocation" in navigator)) return;
  navigator.geolocation.getCurrentPosition(async (pos) => {
    userLocation.value = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    };
    nearMe.value = true;
    // Add/Update user marker
    const { Marker } = (await import("maplibre-gl")) as any;
    const el = document.createElement("div");
    el.className = "user-marker";
    const mk = new Marker({ element: el, anchor: "bottom" })
      .setLngLat([userLocation.value.lng, userLocation.value.lat])
      .addTo(map);
    // refresh list distances and markers view
    await nextTick();
    refreshMarkers();
    fitToResults();
  });
}

/**
 * Utils
 */
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function exportCsv() {
  const rows = [
    ["id", "name", "address", "city", "lat", "lng", "services", "distanceKm"],
    ...filteredMerchants.value.map((m) => [
      m.id,
      m.name,
      m.address,
      m.city ?? "",
      m.lat,
      m.lng,
      m.services.join("+"),
      m.distanceKm?.toFixed(2) ?? "",
    ]),
  ];
  const csv = rows
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "merchants.csv";
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Watchers
 */
watch([filteredMerchants], () => {
  try {
    console.log(
      "🔄 Filtered merchants changed:",
      filteredMerchants.value.length
    );
    refreshMarkers();
  } catch (error) {
    console.error("❌ Error in watch handler:", error);
  }
});

onMounted(() => {
  console.log("🎬 Component mounted, client:", process.client);
  if (process.client) {
    try {
      initMap();
    } catch (error) {
      console.error("❌ Error during map initialization:", error);
    }
  }
});
</script>

<style scoped>
#pos-finder {
  direction: rtl;
}
.map-wrapper {
  position: relative;
  height: calc(100vh - 200px);
}
#map {
  position: absolute;
  inset: 0;
}
.map-skeleton {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    #fafafa,
    #fafafa 10px,
    #f3f3f3 10px,
    #f3f3f3 20px
  );
}
.radius-slider {
  max-width: 220px;
}
.active-item {
  background-color: rgba(25, 118, 210, 0.08);
}

/* Marker styles */
.marker {
  position: relative;
  transform: translateY(6px);
}
.marker .dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color);
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  margin: 0 auto;
}
.marker .badge {
  position: absolute;
  top: -26px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  color: #333;
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 10px;
  border: 1px solid #eee;
  white-space: nowrap;
}

/* User location marker */
.user-marker {
  width: 18px;
  height: 18px;
  background: #e53935;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  transform: translateY(6px);
}
</style>
