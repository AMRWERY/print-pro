<template>
  <div
    v-if="catalog.chips.length"
    class="flex flex-wrap items-center gap-2"
    role="group"
    aria-label="Active filters"
  >
    <span class="eyebrow">Active</span>
    <TransitionGroup name="chip">
      <LazyVButton
        variant="plain"
        v-for="c in catalog.chips"
        :key="c.key"
        class="inline-flex items-center gap-1.5 rounded-control border border-accent/40 bg-accent-soft px-2.5 py-1 text-xs transition duration-200 hover:border-accent"
        :aria-label="`Remove filter ${c.label}`"
        @click="c.remove()"
      >
        {{ c.label }}
        <Icon name="lucide:x" size="12" aria-hidden="true" />
      </LazyVButton>
    </TransitionGroup>

    <LazyVButton
      variant="plain"
      class="link-accent"
      @click="catalog.reset()"
    >
      Reset all
    </LazyVButton>
  </div>
</template>

<script lang="ts" setup>
const catalog = useCatalog();
</script>

<style scoped>
.chip-enter-active,
.chip-leave-active {
  transition:
    opacity 0.2s ease-out,
    transform 0.2s ease-out;
}

.chip-enter-from,
.chip-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>