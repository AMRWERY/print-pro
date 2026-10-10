<template>
  <div class="card overflow-hidden" aria-busy="true" aria-label="Loading table">
    <div
      class="flex items-center gap-4 border-b border-line bg-raised/50 px-4 py-3"
    >
      <LazyVSkeletonLoader
        v-for="n in cols"
        :key="n"
        variant="line"
        class="!h-2.5 flex-1"
      />
    </div>

    <ul class="divide-y divide-line">
      <li v-for="r in rows" :key="r" class="flex items-center gap-4 px-4 py-4">
        <LazyVSkeletonLoader
          v-for="c in cols"
          :key="c"
          variant="line"
          class="flex-1"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
// Placeholder for data tables: a header row plus `rows` body rows of `cols` cells.
withDefaults(defineProps<{ rows?: number; cols?: number }>(), {
  rows: 5,
  cols: 5,
});
</script>