<template>
  <Transition name="tray">
    <div
      v-if="visible"
      class="fixed bottom-5 start-5 z-30 flex items-center gap-3 rounded-card border border-line bg-surface/95 py-2 pe-2 ps-4 shadow-lg shadow-black/30 backdrop-blur"
      role="status"
    >
      <Icon
        name="lucide:git-compare"
        size="18"
        class="text-accent"
        aria-hidden="true"
      />
      <p class="text-sm">
        <span class="font-medium">{{ store.ids.length }}</span> to compare
      </p>
      <LazyVButton variant="primary"
        :to="{ path: '/compare', query: { ids: store.ids.join(',') } }"
        class="h-9 !px-3 text-xs"
        >Compare now</LazyVButton>
      <LazyVButton variant="icon" size="sm"
       
        aria-label="Clear comparison list"
        @click="store.clear()"
      >
        <Icon name="lucide:x" size="14" aria-hidden="true" />
      </LazyVButton>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const route = useRoute();
const store = useCompareStore();

// Not needed on the comparison page itself, and it would crowd a product's sticky buy bar.
const visible = computed(
  () =>
    store.ids.length > 0 && !/\/(compare|product\/[^/]+)\/?$/.test(route.path),
);
</script>

<style scoped>
.tray-enter-active,
.tray-leave-active {
  transition:
    opacity 0.25s ease-out,
    transform 0.25s ease-out;
}

.tray-enter-from,
.tray-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>