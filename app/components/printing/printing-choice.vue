<template>
  <div
    :role="multiple ? 'group' : 'radiogroup'"
    :aria-label="label"
    class="grid gap-3"
    :class="columns"
  >
    <LazyVButton
      v-for="(o, i) in options"
      :key="o.value"
      ref="buttons"
      variant="plain"
      :role="multiple ? 'checkbox' : 'radio'"
      :aria-checked="isOn(o.value)"
      :disabled="o.disabled"
      :tabindex="multiple || tabStop === i ? 0 : -1"
      class="group relative flex h-full flex-col items-stretch gap-1.5 rounded-card border p-4 text-start transition duration-200 disabled:cursor-not-allowed disabled:opacity-50"
      :class="
        isOn(o.value)
          ? 'border-accent bg-accent-soft shadow-sm'
          : 'border-line bg-ink/40 hover:border-accent/50'
      "
      @click="pick(o.value)"
      @keydown="onKey($event, i)"
    >
      <span
        class="absolute end-3 top-3 grid h-4 w-4 place-items-center border-2 transition-colors"
        :class="[
          multiple ? 'rounded-tight' : 'rounded-full',
          isOn(o.value)
            ? 'border-accent bg-accent text-onaccent'
            : 'border-line',
        ]"
        aria-hidden="true"
      >
        <Icon v-if="isOn(o.value)" name="lucide:check" size="10" />
      </span>
      <slot :option="o" :on="isOn(o.value)" />
      <span v-if="o.disabled && o.reason" class="text-1xs text-mute">{{
        o.reason
      }}</span>
    </LazyVButton>
  </div>
</template>

<script lang="ts" setup>
// Option cards that behave like a radio group (one value) or a checkbox group (many values).
// Arrow keys move through a radio group, as users expect.
import type { PrintOption } from "~/types/printing";

const props = withDefaults(
  defineProps<{
    options: PrintOption[];
    label: string;
    multiple?: boolean;
    columns?: string;
  }>(),
  { columns: "sm:grid-cols-2" },
);

const model = defineModel<string | string[]>({ required: true });

const buttons = ref<{ focus: () => void }[]>([]);

const isOn = (v: string) =>
  props.multiple ? (model.value as string[]).includes(v) : model.value === v;

const pick = (v: string) => {
  if (!props.multiple) return void (model.value = v);
  const cur = model.value as string[];
  model.value = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
};

// Only the selected card is in the tab order for radios (roving tabindex).
const tabStop = computed(() =>
  Math.max(
    0,
    props.options.findIndex((o) => o.value === model.value),
  ),
);

const onKey = (e: KeyboardEvent, i: number) => {
  if (props.multiple) return;
  const rtl = document.dir === "rtl";
  const forward =
    e.key === "ArrowDown" || e.key === (rtl ? "ArrowLeft" : "ArrowRight");
  const back =
    e.key === "ArrowUp" || e.key === (rtl ? "ArrowRight" : "ArrowLeft");
  if (!forward && !back) return;
  e.preventDefault();
  const step = forward ? 1 : -1;
  for (let n = 1; n <= props.options.length; n++) {
    const j = (i + step * n + props.options.length * n) % props.options.length;
    if (!props.options[j]!.disabled) {
      pick(props.options[j]!.value);
      buttons.value[j]?.focus();
      return;
    }
  }
};
</script>