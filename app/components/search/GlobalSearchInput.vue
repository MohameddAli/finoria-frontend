<template>
  <v-text-field
    :model-value="inputValue"
    :placeholder="resolvedPlaceholder"
    :prepend-inner-icon="icon"
    :variant="variant"
    :density="density"
    :hide-details="true"
    :single-line="true"
    class="cursor-pointer"
    :style="maxWidthStyle"
    :readonly="readonly"
    :aria-label="resolvedAriaLabel"
    tabindex="0"
    @click="handleOpenIfEnabled('click')"
    @keydown.enter.prevent="handleOpenIfEnabled('enter')"
    @update:model-value="handleUpdate"
  />
</template>

<script setup lang="ts">
import { useAppStore } from '~/stores/app'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: undefined },
  ariaLabel: { type: String, default: undefined },
  icon: { type: String, default: 'mdi-magnify' },
  density: {
    type: String,
    default: 'compact',
    validator: (v) => ['compact', 'comfortable', 'default'].includes(String(v))
  },
  variant: {
    type: String,
    default: 'outlined',
    validator: (v) => ['outlined', 'filled', 'solo', 'underlined', 'plain'].includes(String(v))
  },
  maxWidth: { type: [String, Number], default: '400px' },
  readonly: { type: Boolean, default: true },
  openOnClick: { type: Boolean, default: true },
  openOnEnter: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'open'])

const { t } = useI18n()
const appStore = useAppStore()

const localValue = ref(props.modelValue ?? '')
watch(() => props.modelValue, (v) => {
  if (v === undefined) return
  localValue.value = v ?? ''
})

const inputValue = computed(() => props.modelValue ?? localValue.value)
const resolvedPlaceholder = computed(() => props.placeholder ?? t('header.searchPlaceholder'))
const resolvedAriaLabel = computed(() => props.ariaLabel ?? t('header.openSearch'))

const maxWidthStyle = computed(() => ({ maxWidth: typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth }))

const handleUpdate = (val) => {
  localValue.value = val
  emit('update:modelValue', val)
}

const openLightbox = (source) => {
  appStore.openSearch()
  emit('open', source)
}

const handleOpenIfEnabled = (source) => {
  if (source === 'click' && !props.openOnClick) return
  if (source === 'enter' && !props.openOnEnter) return
  openLightbox(source)
}
</script>

<style scoped>
/* Inherit styling from parent context; keep component minimal */
</style>


