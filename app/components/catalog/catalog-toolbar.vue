<template>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <LazyVButton variant="secondary"
      class="h-10 !px-3 lg:hidden"
      aria-haspopup="dialog"
      @click="emit('open-filters')"
    >
      <Icon
        name="lucide:sliders-horizontal"
        size="16"
        class="icon-wiggle"
        aria-hidden="true"
      />
      Filters
      <span
        v-if="catalog.chips.length"
        class="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 font-mono text-xs font-bold text-onaccent"
        >{{ catalog.chips.length }}</span
      >
    </LazyVButton>

    <div class="ms-auto flex flex-wrap items-center gap-4">
      <LazyVSelectInput
        v-model="catalog.sort"
        name="catalogSort"
        label="Sort products"
        hide-label
        :options="sortOptions"
        input-class="!w-auto py-2 pe-8"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { perPageOptions } from "~/data/catalog";

const emit = defineEmits<{ "open-filters": [] }>();

const catalog = useCatalog();
const sortOptions = computed(() => catalog.sortOptions.map((s) => ({ value: s.key, label: s.label })));
const uid = useId();
</script>