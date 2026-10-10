<template>
  <section class="rounded-card border border-line bg-surface p-5 sm:p-6" aria-labelledby="companions-section-title">
    <header class="flex items-start justify-between gap-3 border-b border-line pb-3">
      <div>
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          <h2 id="companions-section-title" class="font-display text-base font-bold text-paper sm:text-lg">
            Curated Companion Apparatus &amp; Consumables
          </h2>
        </div>
        <p class="mt-0.5 text-xs text-mute">
          Calibrated compatibility for your active camera and printer configurations
        </p>
      </div>

      <span class="rounded-control border border-line bg-raised px-2 py-0.5 font-mono text-[10px] text-mute">
        ATELIER COMPATIBLE
      </span>
    </header>

    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article v-for="p in products" :key="p.id"
        class="flex flex-col justify-between rounded-card border border-line bg-ink/30 p-3.5 transition duration-200 hover:border-accent/40">
        <div class="space-y-3">
          <!-- Image container -->
          <div class="relative aspect-[4/3] w-full overflow-hidden rounded-control border border-line bg-surface">
            <img v-if="p.image" :src="p.image" :alt="p.name"
              class="h-full w-full object-cover transition duration-300 hover:scale-105" />
            <div v-else class="grid h-full w-full place-items-center text-mute">
              <Icon :name="p.icon || 'lucide:box'" size="28" />
            </div>
          </div>

          <!-- Tags & title -->
          <div class="space-y-1">
            <p class="eyebrow flex items-center gap-1.5 text-accent text-[10px]">
              {{ p.tag }}
            </p>
            <h3 class="font-display text-sm font-semibold text-paper leading-snug">
              {{ p.name }}
            </h3>
            <p class="text-xs text-mute line-clamp-2">
              {{ p.description }}
            </p>
          </div>
        </div>

        <!-- Price & action -->
        <div class="mt-4 flex items-center justify-between gap-2 border-t border-line/60 pt-3">
          <span class="font-display text-sm font-bold text-paper">
            {{ money.format(p.price) }}
          </span>

          <LazyVButton variant="plain"
            class="inline-flex items-center gap-1 rounded-control bg-surface border border-line px-2.5 py-1 font-mono text-xs font-semibold text-paper shadow-sm transition hover:border-accent hover:text-accent active:scale-95"
            @click="$emit('add-companion', p)">
            <Icon name="lucide:plus" size="12" />
            <span>{{ p.price > 10000 ? 'REQUEST' : 'ADD' }}</span>
          </LazyVButton>
        </div>
      </article>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { CompanionProduct } from "~/types/account";

defineProps<{
  products: CompanionProduct[];
}>();

defineEmits<{
  (e: "add-companion", product: CompanionProduct): void;
}>();

const money = useMoney();
</script>