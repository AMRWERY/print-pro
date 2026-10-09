<template>
  <div>
    <div class="flex items-center justify-between pb-2">
      <h3 class="eyebrow !text-paper">Filter parameters</h3>
      <button
        v-if="inventory.activeCount"
        type="button"
        class="font-mono text-xs uppercase tracking-wider text-accent hover:underline"
        @click="inventory.reset()"
      >
        Reset
      </button>
    </div>

    <filter-group title="Subcategory">
      <filter-option
        v-for="o in inventory.subOptions"
        :key="o.value"
        :label="o.label"
        :count="o.count"
        :checked="inventory.facets.sub.includes(o.value as CameraSub)"
        @change="inventory.toggle('sub', o.value)"
      />
    </filter-group>

    <filter-group title="Sensor format">
      <filter-option
        v-for="o in inventory.sensorOptions"
        :key="o.value"
        :label="o.value"
        :count="o.count"
        :checked="inventory.facets.sensor.includes(o.value)"
        @change="inventory.toggle('sensor', o.value)"
      />
    </filter-group>

    <filter-group title="Effective resolution">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="t in resolutionTiers"
          :key="t.min"
          type="button"
          class="rounded-control border px-2.5 py-1.5 font-mono text-xs transition duration-200"
          :class="
            inventory.facets.minMegapixels === t.min
              ? 'border-accent text-accent'
              : 'border-line text-mute hover:border-mute hover:text-paper'
          "
          :aria-pressed="inventory.facets.minMegapixels === t.min"
          @click="
            inventory.facets.minMegapixels =
              inventory.facets.minMegapixels === t.min ? null : t.min
          "
        >
          {{ t.label }}
        </button>
      </div>
    </filter-group>

    <filter-group title="Mount standard">
      <filter-option
        v-for="o in inventory.mountOptions"
        :key="o.value"
        :label="o.value"
        :count="o.count"
        :checked="inventory.facets.mount.includes(o.value)"
        @change="inventory.toggle('mount', o.value)"
      />
    </filter-group>

    <filter-group title="Investment range (USD)">
      <div class="grid grid-cols-2 gap-2">
        <LazyVInput
          v-model="inventory.facets.priceMin"
          type="number"
          name="invPriceMin"
          label="Min"
          label-class="eyebrow mb-1 block"
          inputmode="numeric"
          min="0"
          placeholder="0"
          input-class="font-mono"
        />
        <LazyVInput
          v-model="inventory.facets.priceMax"
          type="number"
          name="invPriceMax"
          label="Max"
          label-class="eyebrow mb-1 block"
          inputmode="numeric"
          min="0"
          placeholder="Any"
          input-class="font-mono"
        />
      </div>
    </filter-group>

    <filter-group title="Studio availability">
      <filter-option
        v-for="o in availabilityOptions"
        :key="o.key"
        :label="o.label"
        :checked="inventory.facets.availability.includes(o.key)"
        @change="inventory.toggle('availability', o.key)"
      />
    </filter-group>
  </div>
</template>

<script lang="ts" setup>
import type { CameraSub } from "~/types/cameras";
import { availabilityOptions, resolutionTiers } from "~/data/cameras";

const inventory = useCameraInventory();
const uid = useId();

const parse = (e: Event) => {
  const raw = (e.target as HTMLInputElement).value;
  const n = Number(raw);
  return raw === "" || Number.isNaN(n) ? null : Math.max(0, n);
};
</script>