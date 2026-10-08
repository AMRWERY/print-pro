<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-if="open"
        class="fixed inset-0 z-50 lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Filter products"
      >
        <div
          class="absolute inset-0 bg-ink/70 backdrop-blur-sm"
          @click="emit('close')"
        />
        <div
          class="sheet-panel absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-panel border-t border-line bg-surface"
        >
          <div
            class="flex items-center justify-between border-b border-line px-4 py-3"
          >
            <h2 class="font-display text-xl">Filters</h2>
            <button
              type="button"
              class="btn-icon"
              aria-label="Close filters"
              @click="emit('close')"
            >
              <Icon name="lucide:x" size="18" aria-hidden="true" />
            </button>
          </div>
          <div class="flex-1 overflow-y-auto px-4 py-4">
            <catalog-filters />
          </div>
          <div class="grid grid-cols-[auto_1fr] gap-2 border-t border-line p-4">
            <button
              type="button"
              class="btn-ghost"
              :disabled="!catalog.chips.length"
              @click="catalog.reset()"
            >
              Reset
            </button>
            <button type="button" class="btn-accent" @click="emit('close')">
              Show {{ catalog.total }}
              {{ catalog.total === 1 ? "result" : "results" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
const props = defineProps<{ open: boolean }>();

const emit = defineEmits<{ close: [] }>();

const catalog = useCatalog();

onKeyStroke("Escape", () => {
  if (props.open) emit("close");
});

watch(
  () => props.open,
  (v) => {
    if (import.meta.client) document.body.style.overflow = v ? "hidden" : "";
  },
);

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = "";
});
</script>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease-out;
}

.sheet-enter-active .sheet-panel,
.sheet-leave-active .sheet-panel {
  transition: transform 0.3s cubic-bezier(0.22, 0.8, 0.3, 1);
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .sheet-panel,
.sheet-leave-to .sheet-panel {
  transform: translateY(100%);
}
</style>