<template>
  <section
    id="addresses"
    class="scroll-mt-28 card-roomy"
    aria-labelledby="ports-title"
  >
    <header
      class="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4"
    >
      <div>
        <h2
          id="ports-title"
          class="flex items-center gap-2 font-display text-lg font-bold text-paper"
        >
          <Icon
            name="lucide:map-pinned"
            size="18"
            class="text-cyan"
            aria-hidden="true"
          />Receiving ports &amp; addresses
        </h2>
        <p class="text-xs text-mute">
          Where your orders are delivered. The primary port is pre-selected at
          checkout.
        </p>
      </div>
      <LazyVButton variant="secondary" icon="lucide:plus" @click="$emit('add')"
        >Add port</LazyVButton
      >
    </header>

    <LazyVEmptyState
      v-if="!docks.length"
      icon="lucide:map-pin-off"
      title="No receiving ports yet"
      description="Add a delivery address so checkout can fill it in for you."
    >
      <LazyVButton variant="primary" icon="lucide:plus" @click="$emit('add')"
        >Add your first port</LazyVButton
      >
    </LazyVEmptyState>

    <TransitionGroup
      v-else
      name="list"
      tag="ul"
      class="grid gap-3 md:grid-cols-2"
    >
      <li
        v-for="dock in docks"
        :key="dock.id"
        class="flex flex-col rounded-control border bg-ink/30 p-4"
        :class="dock.isPrimary ? 'border-accent/50' : 'border-line'"
      >
        <div
          class="mb-2 flex flex-wrap items-center gap-1.5 font-mono text-2xs font-bold tracking-wider"
        >
          <span
            v-if="dock.isPrimary"
            class="inline-flex items-center gap-1 rounded-control bg-accent-soft px-2 py-0.5 text-accent"
            ><Icon
              name="lucide:star"
              size="10"
              aria-hidden="true"
            />Primary</span
          >
          <span class="rounded-control bg-raised px-2 py-0.5 text-mute">{{
            dock.typeBadge
          }}</span>
          <span
            class="rounded-control border border-line px-1.5 py-0.5 text-mute"
            >{{ dock.clearanceBadge }}</span
          >
        </div>
        <h3 class="font-display text-sm font-semibold text-paper">
          {{ dock.name }}
        </h3>
        <p class="mt-1 flex-1 text-xs leading-relaxed text-mute">
          {{ dock.address }}
        </p>
        <p class="mt-2 font-mono text-1xs text-cyan">{{ dock.telemetry }}</p>

        <div
          v-if="confirming === dock.id"
          class="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3"
          role="alertdialog"
          :aria-label="`Remove ${dock.name}?`"
        >
          <p class="w-full text-xs text-paper">
            Remove “{{ dock.name }}”? This can’t be undone.
          </p>
          <LazyVButton
            size="sm"
            variant="primary"
            icon="lucide:trash-2"
            @click="confirmRemove(dock.id)"
            >Remove</LazyVButton
          >
          <LazyVButton size="sm" variant="tertiary" @click="confirming = null"
            >Keep</LazyVButton
          >
        </div>
        <div
          v-else
          class="mt-3 flex flex-wrap items-center gap-1 border-t border-line pt-3"
        >
          <LazyVButton
            size="sm"
            variant="tertiary"
            icon="lucide:pencil"
            @click="$emit('edit', dock)"
            >Edit</LazyVButton
          >
          <LazyVButton
            v-if="!dock.isPrimary"
            size="sm"
            variant="tertiary"
            icon="lucide:star"
            @click="$emit('primary', dock)"
            >Make primary</LazyVButton
          >
          <LazyVButton
            size="sm"
            variant="tertiary"
            icon="lucide:trash-2"
            class="ms-auto"
            :aria-label="`Remove ${dock.name}`"
            @click="confirming = dock.id"
            >Remove</LazyVButton
          >
        </div>
      </li>
    </TransitionGroup>
  </section>
</template>

<script lang="ts" setup>
import type { ReceivingDock } from "~/types/account";

defineProps<{ docks: ReceivingDock[] }>();

const emit = defineEmits<{
  add: [];
  edit: [dock: ReceivingDock];
  primary: [dock: ReceivingDock];
  remove: [id: string];
}>();

const confirming = ref<string | null>(null);

const confirmRemove = (id: string) => {
  confirming.value = null;
  emit("remove", id);
};
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.list-leave-active {
  position: absolute;
}

@media (prefers-reduced-motion: reduce) {
  .list-move,
  .list-enter-active,
  .list-leave-active {
    transition: none;
  }
}
</style>