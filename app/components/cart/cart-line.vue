<template>
  <article
    class="card flex flex-col gap-4 p-4 sm:flex-row"
    :class="!selected && 'opacity-70'"
  >
    <div class="flex items-start gap-3 sm:contents">
      <LazyVInput
        type="checkbox"
        :model-value="selected"
        :label="'Select ' + product.name"
        hide-label
        class="grid h-8 w-8 shrink-0 place-items-center sm:order-1"
        @update:model-value="(v) => emit('update:selected', !!v)"
      />

      <div
        class="relative h-24 w-28 shrink-0 overflow-hidden rounded-control border border-line sm:order-2 sm:h-28 sm:w-32"
      >
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.imageAlt ?? product.name"
          class="h-full w-full bg-white object-contain p-1"
          loading="lazy"
          decoding="async"
        />

        <media-placeholder
          v-else
          :icon="product.icon"
          :label="`${product.name} image`"
          size="40"
          class="h-full w-full"
        />
      </div>
    </div>

    <div class="flex min-w-0 flex-1 flex-col gap-3 sm:order-3">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div class="min-w-0">
          <p class="eyebrow">
            {{ product.brand
            }}<span v-if="product.sku"> // {{ product.sku }}</span>
          </p>
          <h3 class="font-display text-lg leading-snug sm:text-xl">
            <nuxt-link-locale
              :to="`/product/${product.id}`"
              class="hover:text-accent"
              >{{ product.name }}</nuxt-link-locale
            >
          </h3>
        </div>

        <status-badge
          :label="product.badge.label"
          :tone="product.badge.tone"
          :icon="product.badge.icon"
        />
      </div>

      <p v-if="line.option" class="text-sm text-mute">
        <span class="eyebrow">Config</span> {{ line.option }}
      </p>
      <ul class="flex flex-wrap gap-1.5" aria-label="Key specifications">
        <li v-for="s in product.specs" :key="s" class="chip">{{ s }}</li>
      </ul>

      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="eyebrow">Allocation</span>

          <LazyVQuantityStepper
            :model-value="line.qty"
            :label="`Quantity of ${product.name}`"
            @update:model-value="(n) => emit('qty', n)"
          />
        </div>

        <div class="text-end">
          <p class="font-display text-2xl font-semibold" aria-live="polite">
            {{ money.format(line.qty * line.unitPrice) }}
          </p>
          <p v-if="line.qty > 1" class="font-mono text-xs text-mute">
            {{ line.qty }} × {{ money.format(line.unitPrice) }}
          </p>
          <p v-if="product.lease" class="font-mono text-xs text-mute">
            Lease: {{ money.format(product.lease * line.qty) }} / mo
          </p>
        </div>
      </div>

      <div
        class="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-3 text-sm"
      >
        <LazyVButton variant="tertiary"
          class="inline-flex items-center gap-1.5"
          :aria-pressed="inRegistry"
          @click="emit('registry')"
        >
          <Icon
            :key="`r-${inRegistry}`"
            name="lucide:bookmark"
            size="14"
            :class="inRegistry && 'animate-icon-pop fill-accent text-accent'"
            aria-hidden="true"
          />
          {{ inRegistry ? "In registry" : "Save for registry" }}
        </LazyVButton>

        <LazyVButton variant="tertiary"
          class="inline-flex items-center gap-1.5"
          @click="emit('later')"
        >
          <Icon name="lucide:clock" size="14" aria-hidden="true" />Save for
          later
        </LazyVButton>

        <LazyVButton variant="tertiary"
          class="inline-flex items-center gap-1.5 hover:!text-accent"
          @click="emit('remove')"
        >
          <Icon name="lucide:trash-2" size="14" aria-hidden="true" />De-allocate
        </LazyVButton>
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
import type { CartEntry } from "~/composables/useCartTotals";

const props = defineProps<{
  entry: CartEntry;
  selected: boolean;
  inRegistry: boolean;
}>();

const emit = defineEmits<{
  "update:selected": [value: boolean];
  qty: [value: number];
  remove: [];
  later: [];
  registry: [];
}>();

const money = useMoney();

const line = computed(() => props.entry.line);

const product = computed(() => props.entry.product);
</script>