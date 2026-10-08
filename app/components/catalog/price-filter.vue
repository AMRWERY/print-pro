<template>
  <div class="space-y-3">
    <div class="grid grid-cols-2 gap-2">
      <div>
        <label :for="`${uid}-min`" class="eyebrow mb-1 block">Min ($)</label>
        <input
          :id="`${uid}-min`"
          type="number"
          inputmode="numeric"
          min="0"
          placeholder="0"
          class="field font-mono"
          :value="catalog.filters.priceMin ?? ''"
          @input="catalog.filters.priceMin = parse($event)"
        />
      </div>
      <div>
        <label :for="`${uid}-max`" class="eyebrow mb-1 block">Max ($)</label>
        <input
          :id="`${uid}-max`"
          type="number"
          inputmode="numeric"
          min="0"
          placeholder="Any"
          class="field font-mono"
          :value="catalog.filters.priceMax ?? ''"
          @input="catalog.filters.priceMax = parse($event)"
        />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="p in pricePresets"
        :key="p.label"
        type="button"
        class="rounded-control border px-2 py-1.5 font-mono text-xs transition duration-200"
        :class="
          isActive(p)
            ? 'border-accent text-accent'
            : 'border-line text-mute hover:border-mute hover:text-paper'
        "
        :aria-pressed="isActive(p)"
        @click="apply(p)"
      >
        {{ p.label }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { pricePresets } from "~/data/catalog";

type Preset = (typeof pricePresets)[number];

const catalog = useCatalog();
const uid = useId();

const parse = (e: Event) => {
  const raw = (e.target as HTMLInputElement).value;
  const n = Number(raw);
  return raw === "" || Number.isNaN(n) ? null : Math.max(0, n);
};

const isActive = (p: Preset) =>
  catalog.filters.priceMin === p.min && catalog.filters.priceMax === p.max;

const apply = (p: Preset) => {
  const active = isActive(p);
  catalog.filters.priceMin = active ? null : p.min;
  catalog.filters.priceMax = active ? null : p.max;
};
</script>