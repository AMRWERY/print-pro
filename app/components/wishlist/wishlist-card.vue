<template>
  <article
    class="group card relative flex overflow-hidden transition duration-200 hover:border-mute/50"
    :class="[
      list ? 'flex-col sm:flex-row' : 'flex-col',
      selected ? '' : 'opacity-70',
    ]"
  >
    <!-- Media -->
    <div class="relative shrink-0" :class="list && 'sm:w-64'">
      <div
        v-if="product.image"
        class="h-44 bg-white"
        :class="list && 'sm:h-full sm:min-h-44'"
      >
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
        :label="`${product.name} product image`"
        size="64"
        class="h-44"
        :class="list && 'sm:h-full sm:min-h-44'"
      />

      <status-badge
        :label="product.badge.label"
        :tone="product.badge.tone"
        :icon="product.badge.icon"
        class="absolute start-3 top-3 backdrop-blur"
      />

      <LazyVInput
        v-if="!readonly"
        type="checkbox"
        :model-value="selected"
        :label="'Select ' + product.name"
        hide-label
        class="absolute end-3 top-3 grid h-8 w-8 place-items-center rounded-control bg-ink/70 backdrop-blur"
        @update:model-value="(v) => emit('update:selected', !!v)"
      />
    </div>

    <!-- Body -->
    <div class="flex flex-1 flex-col gap-3 p-4">
      <div class="flex items-center justify-between gap-2">
        <p class="eyebrow">{{ product.brand }}</p>
        <p
          class="flex items-center gap-1 font-mono text-xs"
          :aria-label="`Rated ${product.rating} out of 5 from ${product.reviews} audits`"
        >
          <Icon
            name="lucide:star"
            size="12"
            class="fill-yellow text-yellow"
            aria-hidden="true"
          />
          {{ product.rating.toFixed(2) }}
          <span class="text-mute">({{ product.reviews }})</span>
        </p>
      </div>

      <h3 class="font-display text-xl leading-snug">
        <nuxt-link-locale
          :to="`/product/${product.id}`"
          class="hover:text-accent"
          >{{ product.name }}</nuxt-link-locale
        >
      </h3>

      <p class="text-sm text-mute">{{ product.blurb }}</p>
      <ul class="flex flex-wrap gap-1.5" aria-label="Key specifications">
        <li v-for="s in product.specs" :key="s" class="chip">{{ s }}</li>
      </ul>

      <div class="mt-auto space-y-3">
        <div
          class="flex items-end justify-between gap-3 border-t border-line pt-3"
        >
          <p class="font-display text-2xl font-semibold">
            {{ money.format(product.price) }}
          </p>
          <p v-if="product.lease" class="text-end font-mono text-xs text-mute">
            Lease: {{ money.format(product.lease) }} / mo
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="btn-accent flex-1"
            :disabled="moved"
            @click="move"
          >
            <Icon
              :key="`m-${moved}`"
              :name="moved ? 'lucide:check' : 'lucide:shopping-bag'"
              size="16"
              :class="moved ? 'animate-icon-pop' : 'icon-bob'"
              aria-hidden="true"
            />
            {{ moved ? "Added" : readonly ? "Add to cart" : "Move to cart" }}
          </button>
          <button
            v-if="!readonly"
            type="button"
            class="btn-icon"
            :aria-label="`Remove ${product.name} from registry`"
            @click="emit('remove')"
          >
            <Icon name="lucide:trash-2" size="16" aria-hidden="true" />
          </button>
        </div>

        <div v-if="!readonly" class="flex items-center gap-2">
          <Icon
            name="lucide:tag"
            size="14"
            class="shrink-0 text-mute"
            aria-hidden="true"
          />
          <LazyVSelectInput
            :model-value="tag"
            name="studioTag"
            label="Studio tag"
            inline
            label-class="eyebrow shrink-0"
            class="min-w-0 flex-1"
            :options="tagOptions"
            input-class="!py-1.5 text-xs"
            @update:model-value="(v) => emit('tag', String(v))"
          />
        </div>
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { studioTags } from "~/data/wishlist";
import type { DetailedProduct } from "~/types/product";

const props = defineProps<{
  product: DetailedProduct;
  selected: boolean;
  tag: string;
  list?: boolean;
  readonly?: boolean;
}>();
const emit = defineEmits<{
  "update:selected": [value: boolean];
  tag: [value: string];
  remove: [];
  move: [];
}>();

const money = useMoney();
const uid = useId();

const moved = ref(false);
const { start } = useTimeoutFn(() => (moved.value = false), 1800, {
  immediate: false,
});
const move = () => {
  emit("move");
  if (props.readonly) {
    moved.value = true;
    start();
  }
};

const tagOptions = studioTags.map((t) => ({ value: t, label: t }));
</script>