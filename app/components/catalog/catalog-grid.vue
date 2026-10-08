<template>
  <div>
    <p class="sr-only" role="status">
      {{ catalog.total }} {{ catalog.total === 1 ? "item" : "items" }} found
    </p>

    <catalog-empty v-if="!catalog.total" />

    <TransitionGroup
      v-else
      tag="ul"
      name="grid"
      class="relative grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <li v-for="p in catalog.paged" :key="p.id" class="flex">
        <VProductCard :product="p" class="w-full" />
      </li>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
const catalog = useCatalog();
</script>

<style scoped>
.grid-enter-active,
.grid-leave-active {
  transition:
    opacity 0.25s ease-out,
    transform 0.25s ease-out;
}

.grid-enter-from,
.grid-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.grid-leave-active {
  position: absolute;
}

.grid-move {
  transition: transform 0.3s ease-out;
}
</style>