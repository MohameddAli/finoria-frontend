<template>
  <div
    class="d-flex align-center"
    :class="{ 'justify-center': center }"
    :style="{ gap }"
    @paste="onPaste($event, firstEmptyIndex)"
  >
    <v-text-field
      v-for="i in length"
      :key="i"
      :ref="setInputRef(i - 1)"
      :model-value="valueChars[i - 1]"
      :type="masked ? 'password' : numeric ? 'tel' : 'text'"
      :variant="variant"
      :density="density"
      :color="color"
      :disabled="disabled"
      :error="error"
      :error-messages="errorMessages"
      :maxlength="1"
      :minlength="1"
      :inputmode="numeric ? 'numeric' : 'text'"
      autocomplete="one-time-code"
      hide-details
      class="text-center"
      :style="{ width: inputWidth }"
      :aria-label="`${ariaLabel} ${i} / ${length}`"
      :name="`${name}-${i - 1}`"
      @keydown="onKeydown($event, i - 1)"
      @focus="selectOnFocus"
      @update:model-value="val => handleInput(String(val ?? ''), i - 1)"
    />
  </div>
  <!-- Optional hint slot -->
  <slot name="hint" />
  <!-- Optional actions slot -->
  <slot name="actions" />
  <!-- Optional error slot (if you want custom rendering instead of error-messages) -->
  <slot name="error" />
  <!-- Default slot ignored by design -->
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
const props = defineProps({
  modelValue: { type: String, default: '' },
  length: { type: Number, default: 6 },
  numeric: { type: Boolean, default: true },
  masked: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  errorMessages: { type: [String, Array], default: () => [] },
  color: { type: String, default: 'primary' },
  variant: { type: String, default: 'outlined' },
  density: { type: String, default: 'compact' },
  inputWidth: { type: String, default: '48px' },
  gap: { type: String, default: '8px' },
  center: { type: Boolean, default: true },
  uppercase: { type: Boolean, default: false },
  name: { type: String, default: 'otp' },
  ariaLabel: { type: String, default: 'One-time code input' },
})

const emit = defineEmits(['update:modelValue','change','complete'])

// Internal state as array of single characters
const valueChars = ref(Array.from({ length: props.length }, (_, i) => props.modelValue?.[i] ?? ''))
watch(
  () => props.modelValue,
  (val) => {
    if (val == null) return
    const arr = Array.from({ length: props.length }, (_, i) => val[i] ?? '')
    if (arr.join('') !== valueChars.value.join('')) valueChars.value = arr
  },
)

const isComplete = computed(() => valueChars.value.every((ch) => ch && ch.length === 1))
const joinedValue = computed(() => valueChars.value.join(''))
const firstEmptyIndex = computed(() => valueChars.value.findIndex((ch) => !ch || ch.length === 0))

const inputs = ref([])
const setInputRef = (index) => (el) => { inputs.value[index] = el }

const focusIndex = async (index) => {
  await nextTick()
  const el = inputs.value[index]
  if (el && typeof el.focus === 'function') el.focus()
}

const selectOnFocus = (e) => {
  const target = e.target
  target?.select?.()
}

const normalize = (str) => {
  let s = String(str ?? '')
  if (props.numeric) s = s.replace(/\D+/g, '')
  if (props.uppercase) s = s.toUpperCase()
  return s
}

const emitValue = () => {
  const val = joinedValue.value
  emit('update:modelValue', val)
  emit('change', val)
  if (isComplete.value) emit('complete', val)
}

const distribute = async (src, start) => {
  const s = normalize(src)
  if (!s) return
  for (let i = 0; i < s.length && start + i < props.length; i++) {
    valueChars.value[start + i] = s[i]
  }
  await nextTick()
  const nextIndex = Math.min(start + s.length, props.length - 1)
  await focusIndex(nextIndex)
  emitValue()
}

const handleInput = async (val, index) => {
  const s = normalize(val)
  if (s.length > 1) {
    // Pasted multiple characters into a single input
    await distribute(s, index)
    return
  }
  valueChars.value[index] = s.slice(0, 1)
  if (s && index < props.length - 1) await focusIndex(index + 1)
  emitValue()
}

const onPaste = async (e, indexOrComputed) => {
  const idx = typeof indexOrComputed === 'number' ? indexOrComputed : firstEmptyIndex.value
  const data = e.clipboardData?.getData('text') ?? ''
  if (data) {
    e.preventDefault()
    await distribute(data, idx < 0 ? 0 : idx)
  }
}

const onKeydown = async (e, index) => {
  const key = e.key
  if (key === 'Backspace') {
    if (valueChars.value[index]) {
      valueChars.value[index] = ''
    } else if (index > 0) {
      valueChars.value[index - 1] = ''
      await focusIndex(index - 1)
    }
    emitValue()
    e.preventDefault()
    return
  }
  if (key === 'ArrowLeft') {
    await focusIndex(Math.max(0, index - 1))
    e.preventDefault()
    return
  }
  if (key === 'ArrowRight') {
    await focusIndex(Math.min(props.length - 1, index + 1))
    e.preventDefault()
    return
  }
  if (props.numeric && key.length === 1 && /\D/.test(key)) {
    e.preventDefault()
    return
  }
  if (key === 'Enter' && isComplete.value) {
    emit('complete', joinedValue.value)
  }
}

const clear = async () => {
  valueChars.value = Array.from({ length: props.length }, () => '')
  await nextTick()
  if (props.autofocus) await focusIndex(0)
  emitValue()
}

const setValue = async (value) => {
  const s = normalize(value).slice(0, props.length)
  valueChars.value = Array.from({ length: props.length }, (_, i) => s[i] ?? '')
  await nextTick()
  if (!isComplete.value) await focusIndex(firstEmptyIndex.value < 0 ? props.length - 1 : firstEmptyIndex.value)
  emitValue()
}

onMounted(async () => {
  // Ensure internal state mirrors initial modelValue (already set above)
  if (props.autofocus) await focusIndex(Math.max(0, firstEmptyIndex.value))
})

defineExpose({
  focus: focusIndex,
  clear,
  setValue,
  value: joinedValue,
})
</script>
