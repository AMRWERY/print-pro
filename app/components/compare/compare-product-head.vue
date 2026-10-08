<template>
  <div
    class="relative flex flex-col gap-3 border-s border-line p-4"
    role="columnheader"
  >
    <button
      type="button"
      class="btn-icon absolute end-3 top-3 z-10 h-8 w-8 bg-ink/70 backdrop-blur"
      :aria-label="`Remove ${product.name} from comparison`"
      @click="emit('remove')"
    >
      <Icon name="lucide:x" size="14" aria-hidden="true" />
    </button>

    <div class="relative overflow-hidden rounded-control border border-line">
      <div v-if="product.image" class="h-32 bg-white">
        <img
          :src="product.image"
          :alt="product.imageAlt ?? product.name"
          class="h-full w-full object-contain p-2"
          loading="lazy"
          decoding="async"
        />
      </div>
      <media-placeholder
        v-else
        :icon="product.icon"
        :label="`${product.name} image`"
        size="56"
        class="h-32"
      />
      <span
        v-if="profile.bench"
        class="absolute start-2 top-2 rounded-control bg-ink/80 px-2 py-0.5 font-mono text-xs backdrop-blur"
      >
        Bench <span class="text-accent">{{ profile.bench }}</span>
      </span>
    </div>

    <p class="eyebrow">{{ profile.origin }}</p>
    <h3 class="font-display text-xl leading-snug">
      <nuxt-link-locale
        :to="`/product/${product.id}`"
        class="hover:text-accent"
        >{{ product.name }}</nuxt-link-locale
      >
    </h3>
    <p class="flex items-center gap-1 font-mono text-xs text-mute">
      <Icon
        name="lucide:star"
        size="12"
        class="fill-yellow text-yellow"
        aria-hidden="true"
      />
      {{ product.rating.toFixed(2) }} ({{ product.reviews }} audits)
    </p>

    <div>
      <p class="font-display text-3xl font-semibold">
        {{ money.format(product.price) }}
      </p>
      <p v-if="product.lease" class="font-mono text-xs text-mute">
        Lease: {{ money.format(product.lease) }} / mo
      </p>
    </div>
    <p>
      <status-badge
        :label="product.badge.label"
        :tone="product.badge.tone"
        :icon="product.badge.icon"
      />
    </p>

    <ul class="space-y-1.5 text-xs text-mute">
      <li
        v-for="h in profile.highlights"
        :key="h"
        class="flex items-start gap-1.5"
      >
        <Icon
          name="lucide:check"
          size="12"
          class="mt-0.5 shrink-0 text-accent"
          aria-hidden="true"
        />{{ h }}
      </li>
    </ul>

    <div class="mt-auto space-y-2 pt-1">
      <button
        type="button"
        class="btn-accent w-full"
        :disabled="added"
        @click="acquire"
      >
        <Icon
          :key="`a-${added}`"
          :name="added ? 'lucide:check' : 'lucide:shopping-bag'"
          size="16"
          :class="added ? 'animate-icon-pop' : 'icon-bob'"
          aria-hidden="true"
        />
        {{ added ? "Added" : profile.primary }}
      </button>
      <nuxt-link-locale
        :to="`/product/${product.id}`"
        class="btn-ghost w-full"
        >{{ profile.secondary }}</nuxt-link-locale
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { compareData } from "~/data/compare";
import type { DetailedProduct } from "~/types/product";

const props = defineProps<{ product: DetailedProduct }>();

const emit = defineEmits<{ remove: [] }>();

const money = useMoney();
const cart = useCartStore();

const profile = computed(
  () =>
    compareData[props.product.id]?.profile ?? {
      origin: props.product.brand,
      bench: undefined,
      highlights: props.product.specs,
      primary: "Add to cart",
      secondary: "View details",
    },
);

const added = ref(false);

const { start } = useTimeoutFn(() => (added.value = false), 1800, {
  immediate: false,
});

const acquire = () => {
  cart.add(props.product.price);
  added.value = true;
  start();
};
</script>