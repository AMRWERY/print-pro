<template>
  <section class="card-roomy" aria-labelledby="ledger-title">
    <h2 id="ledger-title" class="mb-4 font-display text-2xl">
      Payment summary
    </h2>

    <dl class="space-y-2.5 text-sm">
      <div class="flex justify-between gap-4">
        <dt class="text-mute">
          Subtotal ({{ amounts.units }}
          {{ amounts.units === 1 ? "unit" : "units" }})
        </dt>
        <dd class="font-mono">{{ money.format(amounts.subtotal) }}</dd>
      </div>
      <div v-if="amounts.volume" class="flex justify-between gap-4 text-accent">
        <dt>Volume discount (media)</dt>
        <dd class="font-mono">−{{ money.format(amounts.volume) }}</dd>
      </div>
      <div
        v-if="amounts.voucher"
        class="flex justify-between gap-4 text-accent"
      >
        <dt class="flex items-center gap-1.5">
          <Icon name="lucide:ticket-check" size="14" aria-hidden="true" />{{
            amounts.voucherLabel
          }}
        </dt>
        <dd class="font-mono">−{{ money.format(amounts.voucher) }}</dd>
      </div>
      <div v-if="amounts.wire" class="flex justify-between gap-4 text-accent">
        <dt>Wire transfer saving (2%)</dt>
        <dd class="font-mono">−{{ money.format(amounts.wire) }}</dd>
      </div>
      <div class="flex justify-between gap-4">
        <dt class="text-mute">Delivery</dt>
        <dd class="font-mono" :class="amounts.shipping === 0 && 'text-success'">
          {{
            amounts.shipping === 0
              ? "Complimentary"
              : money.format(amounts.shipping)
          }}
        </dd>
      </div>
      <div class="flex justify-between gap-4">
        <dt class="text-mute">Estimated sales tax</dt>
        <dd class="font-mono">{{ money.format(amounts.tax) }}</dd>
      </div>
    </dl>

    <div
      class="mt-5 flex flex-wrap items-end justify-between gap-3 rounded-card border border-line bg-raised p-4"
    >
      <div>
        <p class="eyebrow !text-paper">
          Total {{ payment.id === "card" ? "charged" : "due" }}
        </p>
        <p class="mt-1 meta">
          {{
            payment.id === "card"
              ? `${payment.label} · ending ${payment.last4}`
              : "Wire transfer / escrow"
          }}
        </p>
      </div>
      <p class="font-display text-4xl font-semibold text-accent">
        {{ money.format(amounts.total) }}
        <span class="meta">USD</span>
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { Order } from "~/types/order";

defineProps<{ amounts: Order["amounts"]; payment: Order["payment"] }>();

const money = useMoney();
</script>