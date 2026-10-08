<template>
  <div>
    <div class="flex items-center justify-between pb-3">
      <h2 class="eyebrow !text-paper">Filter parameters</h2>
      <button
        v-if="catalog.chips.length"
        type="button"
        class="font-mono text-xs uppercase tracking-wider text-accent hover:underline"
        @click="catalog.reset()"
      >
        Reset
      </button>
    </div>

    <div class="pb-4">
      <div class="relative">
        <label :for="`${uid}-q`" class="sr-only"
          >Filter by name, spec or SKU</label
        >
        <Icon
          name="lucide:search"
          size="16"
          class="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-mute"
          aria-hidden="true"
        />
        <input
          :id="`${uid}-q`"
          v-model="catalog.filters.query"
          type="search"
          autocomplete="off"
          placeholder="Filter specs, mounts, SKUs"
          class="field !ps-10 !pe-3 truncate"
        />
      </div>
    </div>

    <filter-group title="Categories">
      <filter-option
        v-for="c in catalog.categories"
        :key="c.key"
        :label="c.label"
        :count="c.count"
        :checked="catalog.filters.categories.includes(c.key)"
        @change="catalog.toggleCategory(c.key)"
      />
    </filter-group>

    <filter-group title="Brand & laboratory alliances">
      <filter-option
        v-for="b in visibleBrands"
        :key="b.name"
        :label="b.name"
        :count="b.count"
        :checked="catalog.filters.brands.includes(b.name)"
        @change="catalog.toggleBrand(b.name)"
      />
      <button
        v-if="catalog.brands.length > brandLimit"
        type="button"
        class="mt-1 font-mono text-xs uppercase tracking-wider text-mute hover:text-paper"
        :aria-expanded="showAllBrands"
        @click="showAllBrands = !showAllBrands"
      >
        {{ showAllBrands ? "Show fewer" : `Show all ${catalog.brands.length}` }}
      </button>
    </filter-group>

    <filter-group title="Acquisition value (USD)">
      <price-filter />
    </filter-group>

    <filter-group title="Dispatch status">
      <filter-option
        v-for="d in catalog.dispatches"
        :key="d.key"
        :label="d.label"
        :count="d.count"
        :checked="catalog.filters.dispatch.includes(d.key)"
        @change="catalog.toggleDispatch(d.key)"
      />
    </filter-group>

    <filter-group title="Customer rating">
      <div class="space-y-1">
        <label
          v-for="r in ratingOptions"
          :key="r"
          class="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm"
        >
          <input
            type="radio"
            class="check !rounded-full"
            :name="`${uid}-rating`"
            :checked="catalog.filters.minRating === r"
            @change="catalog.filters.minRating = r"
          />
          <Icon
            name="lucide:star"
            size="14"
            class="fill-yellow text-yellow"
            aria-hidden="true"
          />
          <span>{{ r }} &amp; up</span>
        </label>
        <button
          v-if="catalog.filters.minRating !== null"
          type="button"
          class="font-mono text-xs uppercase tracking-wider text-mute hover:text-paper"
          @click="catalog.filters.minRating = null"
        >
          Any rating
        </button>
      </div>
    </filter-group>

    <p
      class="mt-4 flex gap-2 rounded-card border border-line bg-raised p-3 text-xs text-mute"
    >
      <Icon
        name="lucide:shield-check"
        size="16"
        class="mt-0.5 shrink-0 text-success"
        aria-hidden="true"
      />
      Every printer ships with a custom ICC profile and a bench calibration
      report.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ratingOptions } from "~/data/catalog";

const catalog = useCatalog();
const uid = useId();

const brandLimit = 6;
const showAllBrands = ref(false);

const visibleBrands = computed(() =>
  showAllBrands.value ? catalog.brands : catalog.brands.slice(0, brandLimit),
);
</script>