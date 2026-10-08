<template>
  <article
    class="group card flex flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-mute/50 hover:shadow-lg hover:shadow-black/20"
  >
    <div class="relative">
      <!-- Product shots sit on white so they read the same in both themes. -->
      <div
        v-if="product.image"
        class="h-40 overflow-hidden bg-white sm:h-44"
      >
        <img
          :src="product.image"
          :alt="product.imageAlt ?? product.name"
          loading="lazy"
          decoding="async"
          class="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105"
        />
      </div>
      <media-placeholder
        v-else
        :icon="product.icon"
        :label="`${product.name} product image`"
        class="h-40 sm:h-44"
      />

      <status-badge
        v-bind="product.badge"
        class="absolute start-3 top-3 backdrop-blur"
      />

      <div class="absolute end-3 top-3 flex flex-col gap-2">
        <button
          type="button"
          class="btn-icon h-9 w-9 bg-ink/70 backdrop-blur"
          :aria-pressed="wished"
          :aria-label="
            wished
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          "
          @click="wished = !wished"
        >
          <Icon
            :key="`heart-${wished}`"
            name="lucide:heart"
            size="16"
            :class="wished && 'animate-icon-pop fill-accent text-accent'"
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          class="btn-icon h-9 w-9 bg-ink/70 backdrop-blur"
          :aria-pressed="compared"
          :aria-label="`Compare ${product.name}`"
          @click="compared = !compared"
        >
          <Icon
            :key="`compare-${compared}`"
            :name="compared ? 'lucide:check' : 'lucide:git-compare'"
            size="16"
            :class="compared && 'animate-icon-pop'"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-4">
      <div class="flex items-center justify-between gap-2">
        <p class="eyebrow">{{ product.brand }}</p>
        <p
          class="flex items-center gap-1 font-mono text-xs"
          :aria-label="`Rated ${product.rating} out of 5 from ${product.reviews} reviews`"
        >
          <Icon
            name="lucide:star"
            size="12"
            class="fill-yellow text-yellow"
            aria-hidden="true"
          />
          {{ product.rating.toFixed(1) }}
          <span class="text-mute">({{ product.reviews }})</span>
        </p>
      </div>

      <h3 class="font-display text-xl leading-snug">{{ product.name }}</h3>
      <p class="text-sm text-mute">{{ product.blurb }}</p>

      <ul class="flex flex-wrap gap-1.5" aria-label="Key specifications">
        <li v-for="s in product.specs" :key="s" class="chip">{{ s }}</li>
      </ul>

      <div
        class="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4"
      >
        <div>
          <p class="font-mono text-xs text-mute">
            Lease from {{ money.format(product.lease) }}/mo
          </p>
          <p class="font-display text-2xl font-semibold">
            {{ money.format(product.price) }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="btn-icon"
            :aria-label="`Quick view ${product.name}`"
          >
            <Icon name="lucide:eye" size="16" class="icon-lift" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="btn-accent min-w-[6.5rem]"
            :disabled="added"
            @click="acquire"
          >
            <Icon
              :key="`added-${added}`"
              :name="added ? 'lucide:check' : 'lucide:shopping-bag'"
              size="16"
              :class="added ? 'animate-icon-pop' : 'icon-bob'"
              aria-hidden="true"
            />
            <span aria-live="polite">{{ added ? "Added" : "Acquire" }}</span>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
import type { Product } from "~/data/home";

const props = defineProps<{ product: Product }>();
const money = useMoney();
const cart = useCartStore();

const wished = ref(false);
const compared = ref(false);
const added = ref(false);

const { start } = useTimeoutFn(
  () => {
    added.value = false;
  },
  1800,
  { immediate: false },
);
const acquire = () => {
  cart.add(props.product.price);
  added.value = true;
  start();
};
</script>