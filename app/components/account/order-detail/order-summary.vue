<template>
  <aside class="space-y-4">
    <section class="rounded-card border border-line bg-surface p-5" aria-labelledby="sum-title">
      <h2 id="sum-title" class="eyebrow mb-4 flex items-center gap-2 text-mute"><Icon name="lucide:receipt" size="14" aria-hidden="true" />Order summary</h2>
      <dl class="space-y-2 text-sm">
        <template v-if="source">
          <div class="flex justify-between"><dt class="text-mute">Subtotal</dt><dd class="font-mono">{{ money.format(source.amounts.subtotal) }}</dd></div>
          <div v-if="source.amounts.volume" class="flex justify-between"><dt class="text-mute">Volume discount</dt><dd class="font-mono text-success">−{{ money.format(source.amounts.volume) }}</dd></div>
          <div v-if="source.amounts.voucher" class="flex justify-between"><dt class="text-mute">{{ source.amounts.voucherLabel || "Voucher" }}</dt><dd class="font-mono text-success">−{{ money.format(source.amounts.voucher) }}</dd></div>
          <div class="flex justify-between"><dt class="text-mute">Shipping</dt><dd class="font-mono">{{ source.amounts.shipping ? money.format(source.amounts.shipping) : "Free" }}</dd></div>
          <div class="flex justify-between"><dt class="text-mute">Tax</dt><dd class="font-mono">{{ money.format(source.amounts.tax) }}</dd></div>
        </template>
        <div class="flex justify-between border-t border-line pt-3 text-base"><dt class="font-semibold">Total</dt><dd class="font-display text-xl font-bold text-paper">{{ money.format(order.amount) }}</dd></div>
      </dl>
    </section>

    <section class="rounded-card border border-line bg-surface p-5" aria-labelledby="deliv-title">
      <h2 id="deliv-title" class="eyebrow mb-3 flex items-center gap-2 text-mute"><Icon name="lucide:map-pin" size="14" aria-hidden="true" />Delivery</h2>
      <template v-if="source">
        <address class="text-sm not-italic leading-relaxed text-paper">
          {{ source.name }}<br />
          {{ source.address.line1 }}<span v-if="source.address.line2">, {{ source.address.line2 }}</span><br />
          {{ source.address.city }}, {{ source.address.region }} {{ source.address.postal }}<br />
          {{ countryName(source.address.country) }}
        </address>
        <p class="mt-2 font-mono text-xs text-mute">{{ source.delivery.label }} · {{ source.payment.label }}<span v-if="source.payment.last4"> ···· {{ source.payment.last4 }}</span></p>
      </template>
      <p v-else class="text-sm text-paper">{{ order.destination || order.dispatchedFrom || "Receiving port on file" }}</p>
    </section>

    <section class="space-y-2 rounded-card border border-line bg-surface p-5">
      <LazyVButton v-if="source" variant="primary" block :to="{ path: '/track', query: { order: source.id } }" icon="lucide:radar">Track this order</LazyVButton>
      <LazyVButton variant="secondary" block icon="lucide:refresh-cw" @click="$emit('reorder')">Reorder these items</LazyVButton>
      <LazyVButton variant="tertiary" block :href="support.phoneHref" icon="lucide:headset">Call {{ support.phone }}</LazyVButton>
    </section>
  </aside>
</template>

<script lang="ts" setup>
import { countryName, orderSupport as support } from "~/data/order";
import type { RequisitionOrder } from "~/types/account";

const props = defineProps<{ order: RequisitionOrder }>();
defineEmits<{ reorder: [] }>();

const money = useMoney();
const { sourceOrder } = useAccount();
const source = computed(() => sourceOrder(props.order));
</script>
