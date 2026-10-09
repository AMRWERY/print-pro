<template>
  <div class="space-y-3">
    <div class="grid grid-cols-2 gap-2">
      <LazyVInput
          v-model="catalog.filters.priceMin"
          type="number"
          name="priceMin"
          label="Min ($)"
          label-class="eyebrow mb-1 block"
          inputmode="numeric"
          min="0"
          placeholder="0"
          input-class="font-mono"
        />
      <LazyVInput
          v-model="catalog.filters.priceMax"
          type="number"
          name="priceMax"
          label="Max ($)"
          label-class="eyebrow mb-1 block"
          inputmode="numeric"
          min="0"
          placeholder="Any"
          input-class="font-mono"
        />
    </div>
    <div class="grid grid-cols-2 gap-2">
      <LazyVButton variant="plain"
        v-for="p in pricePresets"
        :key="p.label"
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
      </LazyVButton>
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