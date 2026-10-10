<template>
  <div
    class="container-page page-stack"
    aria-busy="true"
    aria-label="Loading products"
  >
    <LazyVSkeletonLoader variant="line" class="!h-3 w-1/3" />

    <div class="space-y-3">
      <LazyVSkeletonLoader variant="line" class="!h-8 w-1/2" />
      <LazyVSkeletonLoader variant="text" :lines="2" class="max-w-xl" />
    </div>

    <div class="gap-8 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside class="hidden lg:block" aria-hidden="true">
        <div class="card-compact space-y-5">
          <div v-for="n in 4" :key="n" class="space-y-3">
            <LazyVSkeletonLoader variant="line" class="!h-3 w-1/2" />
            <LazyVSkeletonLoader variant="text" :lines="3" />
          </div>
        </div>
      </aside>

      <section class="space-y-4">
        <LazyVSkeletonLoader variant="button" class="!h-12 w-full" />
        <ul class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <li v-for="n in 6" :key="n" class="flex">
            <product-card-skeleton-loader class="w-full" />
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Placeholder for the catalogue page (header, filter sidebar, toolbar and product grid) while products load.
</script>
