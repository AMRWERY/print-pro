<template>
  <div>
    <div class="flex items-center justify-between pb-3">
      <h2 class="eyebrow !text-paper">Filter parameters</h2>
      <LazyVButton variant="plain"
        v-if="catalog.chips.length"
        class="font-mono text-xs uppercase tracking-wider text-accent hover:underline"
        @click="catalog.reset()"
      >
        Reset
      </LazyVButton>
    </div>

    <LazyVInput
      v-if="!hideQuery"
      v-model="catalog.filters.query"
      class="pb-4"
      type="search"
      name="catalogQuery"
      label="Filter by name, spec or SKU"
      hide-label
      icon="lucide:search"
      autocomplete="off"
      placeholder="Filter specs, mounts, SKUs"
      input-class="truncate"
    />

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
      <LazyVButton variant="plain"
        v-if="catalog.brands.length > brandLimit"
        class="mt-1 font-mono text-xs uppercase tracking-wider text-mute hover:text-paper"
        :aria-expanded="showAllBrands"
        @click="showAllBrands = !showAllBrands"
      >
        {{ showAllBrands ? "Show fewer" : `Show all ${catalog.brands.length}` }}
      </LazyVButton>
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
        <LazyVInput
          v-for="r in ratingOptions"
          :key="r"
          :model-value="catalog.filters.minRating"
          type="radio"
          :value="r"
          :name="uid + '-rating'"
          label-class="items-center py-1.5"
          @update:model-value="catalog.filters.minRating = r"
        >
          <span class="flex items-center gap-2.5">
            <Icon name="lucide:star" size="14" class="fill-yellow text-yellow" aria-hidden="true" />
            <span>{{ r }} &amp; up</span>
          </span>
        </LazyVInput>
        <LazyVButton variant="plain"
          v-if="catalog.filters.minRating !== null"
          class="font-mono text-xs uppercase tracking-wider text-mute hover:text-paper"
          @click="catalog.filters.minRating = null"
        >
          Any rating
        </LazyVButton>
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

defineProps<{ hideQuery?: boolean }>();

const catalog = useCatalog();
const uid = useId();

const brandLimit = 6;
const showAllBrands = ref(false);

const visibleBrands = computed(() =>
  showAllBrands.value ? catalog.brands : catalog.brands.slice(0, brandLimit),
);
</script>