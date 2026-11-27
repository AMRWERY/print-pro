<template>
  <section class="card-roomy" aria-labelledby="items-title">
    <header class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 id="items-title" class="font-display text-2xl">
        {{ t("order_ui.allocated_items") }}
      </h2>
      <p
        class="rounded-control border border-line px-2.5 py-1 meta"
      >
        {{
          t(
            items.length === 1
              ? "order_ui.line_item_verified"
              : "order_ui.line_items_verified",
            { n: items.length },
          )
        }}
      </p>
    </header>

    <ul class="space-y-3">
      <li
        v-for="i in items"
        :key="i.key"
        class="flex gap-4 card p-3"
      >
        <div
          class="h-20 w-24 shrink-0 overflow-hidden rounded-control border border-line sm:h-24 sm:w-28"
        >
          <img
            v-if="i.image"
            :src="i.image"
            :alt="i.imageAlt ?? i.name"
            class="thumb-contain"
            loading="lazy"
            decoding="async"
          />
          <media-placeholder
            v-else
            :icon="i.icon"
            :label="t('order_ui.item_image', { name: i.name })"
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
              <p class="meta">
                {{ t("order_ui.qty", { n: i.qty })
                }}<span v-if="i.qty > 1">
                  ·
                  {{ t("order_ui.each", { price: money.format(i.unitPrice) }) }}</span
                >
              </p>
            </div>
          </div>
          <ul class="flex flex-wrap gap-1.5" :aria-label="t('order_ui.key_specifications')">
            <li v-for="s in i.specs" :key="s" class="chip">{{ s }}</li>
          </ul>
        </div>
      </li>
    </ul>
  </section>
</template>

<script lang="ts" setup>
import type { OrderItem } from "~/types/order";

const { t } = useI18n();

defineProps<{ items: OrderItem[] }>();

const money = useMoney();
</script>