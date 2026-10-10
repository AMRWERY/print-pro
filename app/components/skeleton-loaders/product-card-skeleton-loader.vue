<template>
  <ul
    v-if="count > 1"
    class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    aria-busy="true"
    aria-label="Loading products"
  >
    <li v-for="n in count" :key="n" class="flex">
      <product-card-skeleton-loader class="w-full" />
    </li>
  </ul>

  <article v-else class="card flex flex-col overflow-hidden" aria-hidden="true">
    <LazyVSkeletonLoader class="h-40 !rounded-none sm:h-44" />
    <div class="flex flex-1 flex-col gap-3 p-4">
      <LazyVSkeletonLoader variant="line" class="!h-2.5 w-1/3" />

      <LazyVSkeletonLoader variant="text" :lines="2" />

      <LazyVSkeletonLoader variant="line" class="!h-4 w-1/4" />

      <LazyVSkeletonLoader variant="button" class="mt-auto w-full" />
    </div>
  </article>
</template>

<script lang="ts" setup>
/**
 * Placeholder for VProductCard. `count` > 1 renders a responsive grid of them
 * (the 4-up product grid); a single card has no wrapper so it can sit inside
 * any existing grid.
 */

withDefaults(defineProps<{ count?: number }>(), { count: 1 });
</script>