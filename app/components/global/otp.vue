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

<script setup lang="ts">
interface Props {
  modelValue?: string;
  length?: number;
  numeric?: boolean;
  masked?: boolean;
  autofocus?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessages?: string | string[];
  color?: string;
  variant?: 'outlined' | 'plain' | 'filled' | 'solo' | 'solo-filled' | 'solo-inverted' | 'underlined';
  density?: 'default' | 'comfortable' | 'compact';
  inputWidth?: string;
  gap?: string;
  center?: boolean;
  uppercase?: boolean;
  name?: string;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  length: 6,
  numeric: true,
  masked: false,
  autofocus: false,
  disabled: false,
  error: false,
  errorMessages: () => [],
  color: 'primary',
  variant: 'outlined',
  density: 'compact',
  inputWidth: '48px',
  gap: '8px',
  center: true,
  uppercase: false,
  name: 'otp',
  ariaLabel: 'One-time code input',
});

const emit = defineEmits<{ 'update:modelValue': [value: string]; change: [value: string]; complete: [value: string] }>();

const valueChars = ref(Array.from({ length: props.length }, (_, i) => props.modelValue?.[i] ?? ''));
watch(() => props.modelValue, (val) => {
  if (val == null) return;
  const arr = Array.from({ length: props.length }, (_, i) => val[i] ?? '');
  if (arr.join('') !== valueChars.value.join('')) valueChars.value = arr;
});

const isComplete = computed(() => valueChars.value.every((ch) => ch && ch.length === 1));
const joinedValue = computed(() => valueChars.value.join(''));
const firstEmptyIndex = computed(() => valueChars.value.findIndex((ch) => !ch || ch.length === 0));

const inputs = ref<any[]>([]);
const setInputRef = (index: number) => (el: any) => { inputs.value[index] = el; };

const focusIndex = async (index: number) => {
  await nextTick();
  const el = inputs.value[index];
  if (el && typeof el.focus === 'function') el.focus();
};

const selectOnFocus = (e: FocusEvent) => { (e.target as HTMLInputElement)?.select?.(); };

const normalize = (str: string) => {
  let s = String(str ?? '');
  if (props.numeric) s = s.replace(/\D+/g, '');
  if (props.uppercase) s = s.toUpperCase();
  return s;
};

const emitValue = () => {
  const val = joinedValue.value;
  emit('update:modelValue', val);
  emit('change', val);
  if (isComplete.value) emit('complete', val);
};

const distribute = async (src: string, start: number) => {
  const s = normalize(src);
  if (!s) return;
  for (let i = 0; i < s.length && start + i < props.length; i++) {
    valueChars.value[start + i] = s[i] || '';
  }
  await nextTick();
  await focusIndex(Math.min(start + s.length, props.length - 1));
  emitValue();
};

const handleInput = async (val: string, index: number) => {
  const s = normalize(val);
  if (s.length > 1) {
    await distribute(s, index);
    return;
  }
  valueChars.value[index] = s.slice(0, 1);
  if (s && index < props.length - 1) await focusIndex(index + 1);
  emitValue();
};

const onPaste = async (e: ClipboardEvent, indexOrComputed: number) => {
  const idx = typeof indexOrComputed === 'number' ? indexOrComputed : firstEmptyIndex.value;
  const data = e.clipboardData?.getData('text') ?? '';
  if (data) {
    e.preventDefault();
    await distribute(data, idx < 0 ? 0 : idx);
  }
};

const onKeydown = async (e: KeyboardEvent, index: number) => {
  const key = e.key;
  if (key === 'Backspace') {
    if (valueChars.value[index]) valueChars.value[index] = '';
    else if (index > 0) {
      valueChars.value[index - 1] = '';
      await focusIndex(index - 1);
    }
    emitValue();
    e.preventDefault();
    return;
  }
  if (key === 'ArrowLeft') {
    await focusIndex(Math.max(0, index - 1));
    e.preventDefault();
    return;
  }
  if (key === 'ArrowRight') {
    await focusIndex(Math.min(props.length - 1, index + 1));
    e.preventDefault();
    return;
  }
  if (props.numeric && key.length === 1 && /\D/.test(key)) {
    e.preventDefault();
    return;
  }
  if (key === 'Enter' && isComplete.value) emit('complete', joinedValue.value);
};

const clear = async () => {
  valueChars.value = Array.from({ length: props.length }, () => '');
  await nextTick();
  if (props.autofocus) await focusIndex(0);
  emitValue();
};

const setValue = async (value: string) => {
  const s = normalize(value).slice(0, props.length);
  valueChars.value = Array.from({ length: props.length }, (_, i) => s[i] ?? '');
  await nextTick();
  if (!isComplete.value) await focusIndex(firstEmptyIndex.value < 0 ? props.length - 1 : firstEmptyIndex.value);
  emitValue();
};

onMounted(async () => {
  if (props.autofocus) await focusIndex(Math.max(0, firstEmptyIndex.value));
});

defineExpose({ focus: focusIndex, clear, setValue, value: joinedValue });
</script>
