<template>
  <div class="space-y-5">
    <header class="space-y-2">
      <p class="eyebrow">
        {{ product.brand
        }}<span v-if="product.sku"> · SKU {{ product.sku }}</span>
      </p>
      <h1 class="text-3xl sm:text-4xl">{{ product.name }}</h1>
      <p class="text-sm text-mute sm:text-base">{{ detail.subtitle }}</p>
      <a
        href="#reviews"
        class="inline-flex items-center gap-1.5 meta hover:text-paper"
        :aria-label="`Rated ${product.rating} out of 5 from ${product.reviews} reviews. Jump to reviews`"
      >
        <Icon
          name="lucide:star"
          size="14"
          class="fill-yellow text-yellow"
          aria-hidden="true"
        />
        {{ product.rating.toFixed(1) }} ({{ product.reviews }} audits)
      </a>
    </header>

    <div class="space-y-1 border-y border-line py-4">
      <p class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span class="font-display text-4xl font-semibold" aria-live="polite">{{
          money.format(total)
        }}</span>
        <template v-if="detail.compareAt && selected.delta === 0">
          <s class="font-mono text-sm text-mute">{{
            money.format(detail.compareAt)
          }}</s>
          <span
            class="rounded-control bg-accent px-2 py-0.5 font-mono text-xs font-bold text-onaccent"
          >
            Save {{ money.format(detail.compareAt - product.price) }}
          </span>
        </template>
      </p>
      <p v-if="detail.leaseNote" class="meta">
        {{ detail.leaseNote }}
      </p>
      <p class="mt-2">
        <status-badge
          :label="detail.stockLabel"
          :tone="product.badge.tone"
          :icon="product.badge.icon"
        />
      </p>
    </div>

    <fieldset v-if="detail.packages.length > 1" class="space-y-2">
      <legend class="eyebrow mb-2">Configuration package</legend>
      <LazyVRadioInput
        v-for="p in detail.packages"
        :key="p.id"
        v-model="choice"
        name="package"
        :value="p.id"
        boxed
        dense
      >
        <span class="flex items-start gap-3">
          <span class="flex-1">
            <span class="label">{{ p.label }}</span>
            <span class="block text-xs text-mute">{{ p.note }}</span>
          </span>
          <span class="shrink-0 font-mono text-sm">{{ money.format(product.price + p.delta) }}</span>
        </span>
      </LazyVRadioInput>
    </fieldset>

    <div class="space-y-3">
      <div ref="cta" class="flex gap-2">
        <LazyVButton variant="primary" size="lg"
          class="flex-1"
          :disabled="added"
          @click="acquire"
        >
          <Icon
            :key="`a-${added}`"
            :name="added ? 'lucide:check' : 'lucide:shopping-bag'"
            size="18"
            :class="added ? 'animate-icon-pop' : 'icon-bob'"
            aria-hidden="true"
          />
          {{ added ? "Added to order" : "Acquire engine" }}
        </LazyVButton>
        <LazyVButton variant="icon"
          class="h-12 w-12"
          :aria-pressed="wished"
          :aria-label="wished ? 'Remove from wishlist' : 'Add to wishlist'"
          @click="wished = !wished"
        >
          <Icon
            :key="`w-${wished}`"
            name="lucide:heart"
            size="18"
            :class="wished && 'animate-icon-pop fill-accent text-accent'"
            aria-hidden="true"
          />
        </LazyVButton>
      </div>
      <LazyVButton variant="secondary" block>
        <Icon
          name="lucide:calendar-clock"
          size="16"
          class="icon-wiggle"
          aria-hidden="true"
        />
        Request a studio print test
      </LazyVButton>
    </div>

    <aside
      class="rounded-card border border-line bg-raised p-4"
      aria-label="Delivery assurance"
    >
      <p class="eyebrow mb-2 !text-paper">
        PrintPro logistics assurance
      </p>
      <ul class="space-y-1.5 text-sm text-mute">
        <li
          v-for="a in detail.assurance"
          :key="a"
          class="flex items-start gap-2"
        >
          <Icon
            name="lucide:circle-check"
            size="16"
            class="mt-0.5 shrink-0 text-success"
            aria-hidden="true"
          />{{ a }}
        </li>
      </ul>
    </aside>
  </div>

  <!-- Mobile: keep the purchase action in reach once the main button scrolls away -->
  <Transition name="bar">
    <div
      v-if="showBar"
      class="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-surface/95 px-4 py-3 pe-20 backdrop-blur lg:hidden"
    >
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium">{{ product.name }}</p>
        <p class="meta">{{ money.format(total) }}</p>
      </div>
      <LazyVButton variant="primary"
        class="shrink-0"
        :disabled="added"
        @click="acquire"
      >
        {{ added ? "Added" : "Acquire" }}
      </LazyVButton>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import type { DetailedProduct, ProductDetail } from "~/types/product";

const props = defineProps<{
  product: DetailedProduct;
  detail: ProductDetail;
}>();

const money = useMoney();
const cart = useCartStore();

const choice = ref(props.detail.packages[0]!.id);
const selected = computed(
  () =>
    props.detail.packages.find((p) => p.id === choice.value) ??
    props.detail.packages[0]!,
);
const total = computed(() => props.product.price + selected.value.delta);

const wished = ref(false);
const added = ref(false);
const toast = useToast();

const { start } = useTimeoutFn(() => (added.value = false), 1800, {
  immediate: false,
});

const acquire = () => {
  cart.add(props.product.id, total.value, {
    option: selected.value.delta ? selected.value.label : undefined,
  });
  toast.success("Added to cart", {
    description: props.product.name,
    action: { label: "View cart", to: "/cart" },
  });
  added.value = true;
  start();
};

const cta = ref<HTMLElement>();
const ctaVisible = ref(true);

useIntersectionObserver(
  cta,
  ([entry]) => (ctaVisible.value = entry?.isIntersecting ?? true),
);

const showBar = computed(() => !ctaVisible.value);
</script>

<style scoped>
.bar-enter-active,
.bar-leave-active {
  transition:
    transform 0.25s ease-out,
    opacity 0.25s ease-out;
}

.bar-enter-from,
.bar-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>