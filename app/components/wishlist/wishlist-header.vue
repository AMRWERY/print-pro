<template>
  <header v-reveal class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="space-y-3">
        <p class="eyebrow flex items-center gap-2 text-accent">
          <span class="h-2 w-2 bg-accent" aria-hidden="true" />Studio registry ·
          saved apparatus
        </p>
        <h1 class="max-w-3xl text-4xl uppercase sm:text-5xl">
          Studio apparatus wishlist &amp; registry
        </h1>
        <p class="max-w-2xl text-sm text-mute sm:text-base">
          Curated technical configurations, lab-tested optics, fine-art print
          engines and archival substrates reserved for studio allocation and
          cleanroom integration.
        </p>
      </div>

      <div
        class="inline-flex rounded-control border border-line p-0.5 font-mono text-xs uppercase tracking-wider"
        role="group"
        aria-label="Registry view mode"
      >
        <button
          type="button"
          class="rounded-[4px] px-3 py-1.5 transition-colors duration-200"
          :class="
            !preview ? 'bg-raised text-paper' : 'text-mute hover:text-paper'
          "
          :aria-pressed="!preview"
          @click="emit('update:preview', false)"
        >
          Active ({{ count }})
        </button>
        <button
          type="button"
          class="rounded-[4px] px-3 py-1.5 transition-colors duration-200"
          :class="
            preview ? 'bg-raised text-paper' : 'text-mute hover:text-paper'
          "
          :aria-pressed="preview"
          @click="emit('update:preview', true)"
        >
          Empty state preview
        </button>
      </div>
    </div>

    <dl
      class="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3"
    >
      <div class="bg-surface p-4">
        <dt class="eyebrow flex items-center justify-between">
          Active registry
          <Icon name="lucide:folder-open" size="14" aria-hidden="true" />
        </dt>
        <dd class="mt-1">
          <LazyVInput
            :model-value="name"
            name="registryName"
            label="Registry name"
            hide-label
            variant="bare"
            maxlength="40"
            input-class="w-full bg-transparent font-display text-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            @update:model-value="(v) => emit('update:name', String(v ?? ''))"
          />
        </dd>
        <dd class="font-mono text-xs text-mute">ID: REG-{{ registryId }}</dd>
      </div>
      <div class="bg-surface p-4">
        <dt class="eyebrow">Estimated asset total</dt>
        <dd class="mt-1 font-display text-2xl" aria-live="polite">
          {{ money.format(total) }}
          <span class="font-mono text-xs text-mute">USD</span>
        </dd>
        <dd class="font-mono text-xs text-mute">Excl. bonded tax / VAT</dd>
      </div>
      <div class="bg-surface p-4">
        <dt class="eyebrow flex items-center justify-between">
          Readiness telemetry
          <Icon
            name="lucide:circle-check"
            size="14"
            class="text-success"
            aria-hidden="true"
          />
        </dt>
        <dd class="mt-1 font-display text-2xl">
          {{ ready }} / {{ count }} <span class="text-base">Ready</span>
        </dd>
        <dd class="font-mono text-xs text-mute">
          {{ ready }}/{{ count }} units bench-tested
        </dd>
      </div>
    </dl>

    <div class="flex flex-wrap items-center gap-3">
      <button
        type="button"
        class="btn-accent"
        :disabled="!selectedCount"
        @click="emit('move-selected')"
      >
        <Icon
          name="lucide:shopping-cart"
          size="16"
          class="icon-bob"
          aria-hidden="true"
        />
        Move selected to cart ({{ selectedCount }})
      </button>
      <button
        type="button"
        class="btn-ghost"
        :disabled="!count"
        @click="emit('share')"
      >
        <Icon
          :key="`s-${copied}`"
          :name="copied ? 'lucide:check' : 'lucide:share-2'"
          size="16"
          :class="copied && 'animate-icon-pop'"
          aria-hidden="true"
        />
        {{ copied ? "Link copied" : "Share registry manifest" }}
      </button>
      <button
        v-if="!confirmNew"
        type="button"
        class="btn-ghost"
        :disabled="!count"
        @click="confirmNew = true"
      >
        <Icon name="lucide:plus" size="16" aria-hidden="true" />New registry
      </button>
      <span
        v-else
        class="flex items-center gap-2 rounded-control border border-accent/40 bg-accent-soft py-1 pe-1 ps-3 text-sm"
        role="alert"
      >
        Clear this registry and start over?
        <button
          type="button"
          class="btn-accent !px-3 !py-1.5 text-xs"
          @click="startNew"
        >
          Yes, clear
        </button>
        <button
          type="button"
          class="btn-ghost !px-3 !py-1.5 text-xs"
          @click="confirmNew = false"
        >
          Cancel
        </button>
      </span>
    </div>
  </header>
</template>

<script lang="ts" setup>
const props = defineProps<{
  name: string;
  count: number;
  ready: number;
  total: number;
  selectedCount: number;
  copied: boolean;
  preview: boolean;
  registryId: string;
}>();

const emit = defineEmits<{
  "update:name": [value: string];
  "update:preview": [value: boolean];
  "move-selected": [];
  share: [];
  "new-registry": [];
}>();

const money = useMoney();
const confirmNew = ref(false);
const startNew = () => {
  confirmNew.value = false;
  emit("new-registry");
};

// Collapse the confirmation if the list changes underneath it.
watch(
  () => props.count,
  () => (confirmNew.value = false),
);
</script>