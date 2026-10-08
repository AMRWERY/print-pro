<template>
  <section class="section !py-12 md:!py-16" aria-labelledby="related-title">
    <div class="container-page space-y-8">
      <section-heading
        id="related-title"
        eyebrow="Recommended pairings"
        title="Certified media, substrates & consumables"
      >
        <nuxt-link-locale
          to="/products"
          class="link-quiet inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider"
        >
          View all
          <Icon
            name="lucide:arrow-right"
            size="14"
            class="icon-nudge rtl:-scale-x-100"
            aria-hidden="true"
          />
        </nuxt-link-locale>
      </section-heading>

      <ul class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <li
          v-for="(p, i) in items"
          :key="p.id"
          v-reveal="{ delay: i * 70 }"
          class="flex"
        >
          <LazyVProductCard :product="p" class="w-full" />
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { Product } from "~/types/home";

defineProps<{ items: Product[] }>();
</script>