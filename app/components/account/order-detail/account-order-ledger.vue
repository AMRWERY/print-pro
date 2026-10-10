<template>
  <section class="rounded-card border border-line bg-surface" aria-labelledby="ledger-title">
    <h2 id="ledger-title" class="eyebrow flex items-center gap-2 border-b border-line p-5 text-mute"><Icon name="lucide:package" size="14" aria-hidden="true" />Items in this order</h2>
    <ul class="divide-y divide-line">
      <li v-for="(item, i) in lines" :key="i" class="flex items-center gap-4 p-4 sm:px-5">
        <span class="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-control border border-line bg-raised">
          <img v-if="item.thumb" :src="item.thumb" :alt="item.name" class="h-full w-full object-contain p-1" loading="lazy" />
          <Icon v-else :name="item.icon || 'lucide:box'" size="22" class="text-mute" aria-hidden="true" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-paper">{{ item.name }}</p>
          <p v-if="item.sku" class="font-mono text-[10px] text-mute">SKU {{ item.sku }}</p>
          <p class="mt-0.5 font-mono text-xs text-mute">Qty {{ item.quantity ?? 1 }}</p>
        </div>
        <p v-if="item.price !== undefined" class="shrink-0 font-display font-bold text-paper">{{ money.format(item.price) }}</p>
      </li>
    </ul>
  </section>
</template>

<script lang="ts" setup>
import type { RequisitionOrder } from "~/types/account";

const props = defineProps<{ order: RequisitionOrder }>();
const money = useMoney();
const { sourceOrder } = useAccount();

// Checkout orders know each line's price. Demo history only knows the order total.
const lines = computed(() => {
  const source = sourceOrder(props.order);
  return props.order.items.map((item, i) => ({
    ...item,
    price: source?.items[i] ? source.items[i].unitPrice * source.items[i].qty : props.order.items.length === 1 ? props.order.amount : undefined,
  }));
});
</script>
