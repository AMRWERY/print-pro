<template>
  <section class="rounded-card border border-line bg-surface p-4" aria-labelledby="cost-title">
    <h2 id="cost-title" class="eyebrow mb-3 text-mute">Itemised cost telemetry</h2>

    <TransitionGroup name="row" tag="ul" class="space-y-2 text-sm">
      <li v-for="l in price.lines" :key="l.key" class="flex items-start justify-between gap-3">
        <span class="text-mute">{{ l.label }}</span>
        <span class="shrink-0 font-mono" :class="l.amount < 0 ? 'text-success' : 'text-paper'">{{ l.amount < 0 ? "−" : "" }}{{ money.format(Math.abs(l.amount)) }}</span>
      </li>
    </TransitionGroup>

    <div class="mt-4 flex items-end justify-between gap-3 border-t border-line pt-4">
      <span class="font-mono text-xs uppercase tracking-wider text-mute">Total valuation</span>
      <span class="font-display text-3xl font-bold text-paper" aria-live="polite">{{ money.format(price.total) }}</span>
    </div>
    <p class="mt-1 text-end font-mono text-[10px] text-mute">{{ money.format(price.unit) }} per print before discounts and fees</p>

    <p v-if="blocked" role="alert" class="mt-4 flex items-start gap-2 rounded-control border border-accent/40 bg-accent-soft p-3 text-xs text-accent">
      <Icon name="lucide:circle-alert" size="14" class="mt-0.5 shrink-0" aria-hidden="true" />{{ blocked }}
    </p>

    <div class="mt-4 space-y-2">
      <LazyVButton variant="primary" block size="lg" icon="lucide:shopping-cart" :disabled="!!blocked" @click="add">Add requisition to cart ({{ config.copies }} {{ config.copies === 1 ? "item" : "items" }})</LazyVButton>
      <LazyVButton variant="secondary" block icon="lucide:zap" :disabled="!!blocked" @click="checkoutNow">Instant checkout</LazyVButton>
    </div>

    <p class="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-mute">
      <Icon name="lucide:badge-check" size="14" class="mt-0.5 shrink-0 text-cyan" aria-hidden="true" />
      Every print ships with a numbered certificate of authenticity and its spectro-verification report.
    </p>
  </section>
</template>

<script lang="ts" setup>
const { config, price, addToCart, checkoutNow } = usePrintConfig();
const money = useMoney();

const add = () => addToCart();

// A custom size has to be a real size before anything can be ordered.
const blocked = computed(() => {
  if (config.size !== "custom") return "";
  const w = Number(config.customW);
  const l = Number(config.customL);
  return w >= 4 && w <= 44 && l >= 4 && l <= 200 ? "" : "Enter a valid custom width and length in step 2 to continue.";
});
</script>

<style scoped>
.row-move,
.row-enter-active,
.row-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.row-enter-from,
.row-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
.row-leave-active {
  position: absolute;
}
@media (prefers-reduced-motion: reduce) {
  .row-move,
  .row-enter-active,
  .row-leave-active {
    transition: none;
  }
}
</style>
