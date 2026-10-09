<template>
  <section class="card p-5 sm:p-6" aria-labelledby="items-title">
    <header class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 id="items-title" class="font-display text-2xl">Allocated items</h2>
      <p
        class="rounded-control border border-line px-2.5 py-1 font-mono text-xs text-mute"
      >
        {{ items.length }}
        {{ items.length === 1 ? "line item" : "line items" }} verified
      </p>
    </header>

    <ul class="space-y-3">
      <li
        v-for="i in items"
        :key="i.key"
        class="flex gap-4 rounded-card border border-line bg-surface p-3"
      >
        <div
          class="h-20 w-24 shrink-0 overflow-hidden rounded-control border border-line sm:h-24 sm:w-28"
        >
          <img
            v-if="i.image"
            :src="i.image"
            :alt="i.imageAlt ?? i.name"
            class="h-full w-full bg-white object-contain p-1"
            loading="lazy"
            decoding="async"
          />
          <media-placeholder
            v-else
            :icon="i.icon"
            :label="`${i.name} image`"
            size="36"
            class="h-full w-full"
          />
        </div>

        <div class="min-w-0 flex-1 space-y-2">
          <div
            class="flex flex-wrap items-start justify-between gap-x-4 gap-y-1"
          >
            <div class="min-w-0">
              <p class="eyebrow">
                {{ i.brand }}<span v-if="i.sku"> · {{ i.sku }}</span>
              </p>
              <h3 class="font-display text-lg leading-snug">
                <nuxt-link-locale
                  :to="`/product/${i.id}`"
                  class="hover:text-accent"
                  >{{ i.name }}</nuxt-link-locale
                >
              </h3>
              <p v-if="i.option" class="text-xs text-mute">{{ i.option }}</p>
            </div>
            <div class="text-end">
              <p class="font-mono text-sm font-medium">
                {{ money.format(i.qty * i.unitPrice) }}
              </p>
              <p class="font-mono text-xs text-mute">
                Qty {{ i.qty
                }}<span v-if="i.qty > 1">
                  · {{ money.format(i.unitPrice) }} each</span
                >
              </p>
            </div>
          </div>
          <ul class="flex flex-wrap gap-1.5" aria-label="Key specifications">
            <li v-for="s in i.specs" :key="s" class="chip">{{ s }}</li>
          </ul>
        </div>
      </li>
    </ul>
  </section>
</template>

<script lang="ts" setup>
import type { OrderItem } from "~/types/order";

defineProps<{ items: OrderItem[] }>();

const money = useMoney();
</script>