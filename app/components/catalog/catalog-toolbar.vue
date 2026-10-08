<template>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <button
      type="button"
      class="btn-ghost h-10 !px-3 lg:hidden"
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
    </button>

    <div class="ms-auto flex flex-wrap items-center gap-4">
      <div class="flex items-center gap-2">
        <select
          :id="`${uid}-sort`"
          v-model="catalog.sort"
          class="field !w-auto py-2 pe-8"
        >
          <option v-for="s in catalog.sortOptions" :key="s.key" :value="s.key">
            {{ s.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { perPageOptions } from "~/data/catalog";

const emit = defineEmits<{ "open-filters": [] }>();

const catalog = useCatalog();
const uid = useId();
</script>