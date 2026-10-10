<template>
  <div
    class="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
    aria-busy="true"
    aria-label="Loading product"
  >
    <!-- Gallery: large viewport + thumbnail strip -->
    <div class="space-y-3">
      <LazyVSkeletonLoader class="aspect-[4/3] w-full" />

      <div class="grid grid-cols-4 gap-3">
        <LazyVSkeletonLoader v-for="n in 4" :key="n" class="aspect-square" />
      </div>
    </div>

    <!-- Buy box: identity, price, options, actions -->
    <div class="space-y-5">
      <LazyVSkeletonLoader variant="line" class="!h-2.5 w-1/4" />

      <LazyVSkeletonLoader variant="line" class="!h-8 w-4/5" />

      <LazyVSkeletonLoader variant="text" :lines="3" />

      <LazyVSkeletonLoader variant="line" class="!h-7 w-1/3" />

      <div class="grid grid-cols-3 gap-3">
        <LazyVSkeletonLoader v-for="n in 3" :key="n" variant="button" />
      </div>

      <div class="flex gap-3">
        <LazyVSkeletonLoader variant="button" class="!h-12 flex-1" />

        <LazyVSkeletonLoader variant="button" class="!h-12 w-1/3" />
      </div>

      <LazyVSkeletonLoader class="h-24" />
    </div>
  </div>
</template>

<script lang="ts" setup>
// Placeholder for the product detail hero (gallery + buy box), same column split as pages/product/[id].vue.
</script>