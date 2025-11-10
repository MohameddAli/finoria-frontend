import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export interface MapboxOptions {
  container: string | HTMLElement
  style?: string
  center?: [number, number]
  zoom?: number
  pitch?: number
  bearing?: number
  accessToken: string
}

export interface MapboxFeatures {
  terrain?: boolean
  buildings3D?: boolean
  pitch?: number
  bearing?: number
}

export const useMapbox = () => {
  const map = ref<mapboxgl.Map | null>(null)
  const isLoaded = ref(false)
  const is3DEnabled = ref(false)

  /**
   * Initialize Mapbox map instance
   */
  const initMap = (options: MapboxOptions): mapboxgl.Map => {
    mapboxgl.accessToken = options.accessToken

    const mapInstance = new mapboxgl.Map({
      container: options.container,
      style: options.style || 'mapbox://styles/mapbox/streets-v12',
      center: options.center || [13.1913, 32.8872], // Libya default
      zoom: options.zoom || 12,
      pitch: options.pitch || 0,
      bearing: options.bearing || 0,
      antialias: true,
      projection: 'globe' as any
    })

    map.value = mapInstance

    mapInstance.on('load', () => {
      isLoaded.value = true
    })

    return mapInstance
  }

  /**
   * Enable 3D terrain with elevation
   */
  const enable3DTerrain = () => {
    if (!map.value || !isLoaded.value) return

    map.value.addSource('mapbox-dem', {
      type: 'raster-dem',
      url: 'mapbox://mapbox.terrain-rgb',
      tileSize: 512,
      maxzoom: 14
    })

    map.value.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })
    is3DEnabled.value = true
  }

  /**
   * Disable 3D terrain
   */
  const disable3DTerrain = () => {
    if (!map.value || !isLoaded.value) return
    map.value.setTerrain(null)
    is3DEnabled.value = false
  }

  /**
   * Toggle 3D terrain
   */
  const toggle3DTerrain = () => {
    if (is3DEnabled.value) {
      disable3DTerrain()
    } else {
      enable3DTerrain()
    }
  }

  /**
   * Add 3D building extrusions
   */
  const add3DBuildings = () => {
    if (!map.value || !isLoaded.value) return

    const layers = map.value.getStyle().layers
    const labelLayerId = layers?.find(
      (layer: any) => layer.type === 'symbol' && layer.layout?.['text-field']
    )?.id

    map.value.addLayer(
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

  /**
   * Remove 3D buildings layer
   */
  const remove3DBuildings = () => {
    if (!map.value || !isLoaded.value) return
    if (map.value.getLayer('3d-buildings')) {
      map.value.removeLayer('3d-buildings')
    }
  }

  /**
   * Set map pitch (tilt)
   */
  const setPitch = (pitch: number, options?: { duration?: number }) => {
    if (!map.value) return
    map.value.easeTo({
      pitch,
      duration: options?.duration ?? 1000
    })
  }

  /**
   * Set map bearing (rotation)
   */
  const setBearing = (bearing: number, options?: { duration?: number }) => {
    if (!map.value) return
    map.value.easeTo({
      bearing,
      duration: options?.duration ?? 1000
    })
  }

  /**
   * Fly to specific location with 3D effect
   */
  const flyTo = (
    center: [number, number],
    options?: {
      zoom?: number
      pitch?: number
      bearing?: number
      duration?: number
    }
  ) => {
    if (!map.value) return

    map.value.flyTo({
      center,
      zoom: options?.zoom ?? 15,
      pitch: options?.pitch ?? 60,
      bearing: options?.bearing ?? 0,
      duration: options?.duration ?? 2000,
      essential: true
    })
  }

  /**
   * Change map style
   */
  const changeStyle = (style: string) => {
    if (!map.value) return
    map.value.setStyle(style)
  }

  /**
   * Add marker to map
   */
  const addMarker = (
    lngLat: [number, number],
    options?: {
      color?: string
      draggable?: boolean
      element?: HTMLElement
      popup?: mapboxgl.Popup
    }
  ): mapboxgl.Marker => {
    if (!map.value) throw new Error('Map not initialized')

    const marker = new mapboxgl.Marker({
      color: options?.color,
      draggable: options?.draggable,
      element: options?.element
    })
      .setLngLat(lngLat)
      .addTo(map.value)

    if (options?.popup) {
      marker.setPopup(options.popup)
    }

    return marker
  }

  /**
   * Create popup
   */
  const createPopup = (options?: {
    closeButton?: boolean
    closeOnClick?: boolean
    maxWidth?: string
  }): mapboxgl.Popup => {
    return new mapboxgl.Popup({
      closeButton: options?.closeButton ?? true,
      closeOnClick: options?.closeOnClick ?? false,
      maxWidth: options?.maxWidth ?? '300px'
    })
  }

  /**
   * Fit bounds to markers
   */
  const fitBounds = (
    coordinates: [number, number][],
    options?: {
      padding?: number
      maxZoom?: number
      duration?: number
    }
  ) => {
    if (!map.value || coordinates.length === 0) return

    const bounds = new mapboxgl.LngLatBounds()
    coordinates.forEach(coord => bounds.extend(coord))

    map.value.fitBounds(bounds, {
      padding: options?.padding ?? 50,
      maxZoom: options?.maxZoom ?? 15,
      duration: options?.duration ?? 1000
    })
  }

  /**
   * Cleanup map instance
   */
  const cleanup = () => {
    if (map.value) {
      map.value.remove()
      map.value = null
      isLoaded.value = false
      is3DEnabled.value = false
    }
  }

  return {
    map,
    isLoaded,
    is3DEnabled,
    initMap,
    enable3DTerrain,
    disable3DTerrain,
    toggle3DTerrain,
    add3DBuildings,
    remove3DBuildings,
    setPitch,
    setBearing,
    flyTo,
    changeStyle,
    addMarker,
    createPopup,
    fitBounds,
    cleanup
  }
}
