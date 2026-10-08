<template>
  <div class="inline-flex items-center rounded-control border border-line" role="group" :aria-label="label">
    <button type="button" class="grid h-9 w-9 place-items-center transition-colors duration-200 hover:text-accent disabled:opacity-40" :disabled="modelValue <= min" :aria-label="`Decrease ${label}`" @click="set(modelValue - 1)">
      <Icon name="lucide:minus" size="14" aria-hidden="true" />
    </button>
    <input
      :value="modelValue"
      type="number"
      inputmode="numeric"
      :min="min"
      :max="max"
      :aria-label="label"
      class="h-9 w-12 border-x border-line bg-transparent text-center font-mono text-sm [appearance:textfield] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      @change="set(Number(($event.target as HTMLInputElement).value), $event)"
    />
    <button type="button" class="grid h-9 w-9 place-items-center transition-colors duration-200 hover:text-accent disabled:opacity-40" :disabled="modelValue >= max" :aria-label="`Increase ${label}`" @click="set(modelValue + 1)">
      <Icon name="lucide:plus" size="14" aria-hidden="true" />
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{ modelValue: number; min?: number; max?: number; label?: string }>(),
  { min: 1, max: 99, label: "Quantity" },
);
const emit = defineEmits<{ "update:modelValue": [value: number] }>();

const set = (n: number, e?: Event) => {
  const next = Math.min(props.max, Math.max(props.min, Math.floor(n) || props.min));
  // Snap the field back if what was typed was out of range.
  if (e) (e.target as HTMLInputElement).value = String(next);
  emit("update:modelValue", next);
};
</script>
