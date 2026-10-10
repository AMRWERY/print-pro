<template>
  <section class="rounded-card border border-line bg-surface p-5 sm:p-6" aria-labelledby="registry-section-title">
    <header class="flex items-start justify-between gap-3 border-b border-line pb-3">
      <div>
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-yellow" aria-hidden="true" />
          <h2 id="registry-section-title" class="font-display text-base font-bold text-paper sm:text-lg">
            Studio Registry &amp; Reserved Apparatus
          </h2>
        </div>
        <p class="mt-0.5 text-xs text-mute">
          Curated inventory queued for cleanroom collimation &amp; allocation
        </p>
      </div>

      <span class="rounded-control border border-line bg-raised px-2 py-0.5 font-mono text-[10px] text-mute">
        {{ items.length }} PRESENT ITEMS
      </span>
    </header>

    <div class="mt-4 space-y-3">
      <article v-for="item in items" :key="item.id"
        class="flex flex-col gap-3 rounded-control border border-line bg-ink/30 p-3 sm:flex-row sm:items-center sm:justify-between transition hover:border-accent/30">
        <div class="flex items-center gap-3">
          <div class="h-12 w-12 shrink-0 overflow-hidden rounded-control border border-line bg-surface">
            <img v-if="item.image" :src="item.image" :alt="item.name" class="h-full w-full object-cover" />
            <div v-else class="grid h-full w-full place-items-center text-mute">
              <Icon :name="item.icon || 'lucide:box'" size="20" />
            </div>
          </div>

          <div class="space-y-0.5">
            <p class="eyebrow flex items-center gap-1.5 text-accent">
              {{ item.category }} • {{ item.statusBadge }}
            </p>
            <h3 class="font-display text-sm font-semibold text-paper">
              {{ item.name }}
            </h3>
            <p class="font-mono text-[11px] text-mute">
              {{ item.specNotes }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between gap-4 border-t border-line/60 pt-2 sm:border-0 sm:pt-0">
          <span class="font-display text-base font-bold text-paper">
            {{ money.format(item.price) }}
          </span>

          <LazyVButton variant="plain"
            class="inline-flex items-center gap-1 rounded-control bg-accent px-2.5 py-1 font-mono text-xs font-semibold text-onaccent shadow-sm transition hover:brightness-110 active:scale-95"
            @click="$emit('add-to-manifest', item)">
            <Icon name="lucide:plus" size="12" />
            <span>MOVE TO MANIFEST</span>
          </LazyVButton>
        </div>
      </article>
    </div>

    <footer class="mt-4 border-t border-line pt-3 text-end font-mono text-xs">
      <NuxtLinkLocale to="/wishlist" class="inline-flex items-center gap-1 text-accent transition hover:underline">
        <span>OPEN REGISTRY LEDGER</span>
        <Icon name="lucide:arrow-right" size="13" />
      </NuxtLinkLocale>
    </footer>
  </section>
</template>

<script lang="ts" setup>
import type { RegistryItem } from "~/types/account";

defineProps<{
  items: RegistryItem[];
}>();

defineEmits<{
  (e: "add-to-manifest", item: RegistryItem): void;
}>();

const money = useMoney();
</script>