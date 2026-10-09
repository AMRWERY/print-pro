<template>
  <aside class="card space-y-4 p-5" aria-labelledby="co-summary-title">
    <div class="flex items-center justify-between gap-3">
      <h2 id="co-summary-title" class="font-display text-xl">Order summary</h2>
      <nuxt-link-locale
        to="/cart"
        class="link-quiet text-sm underline-offset-4 hover:underline"
        >Edit cart</nuxt-link-locale
      >
    </div>

    <ul class="divide-y divide-line">
      <li
        v-for="e in entries"
        :key="e.line.key"
        class="flex gap-3 py-3 first:pt-0"
      >
        <div
          class="relative h-14 w-16 shrink-0 overflow-hidden rounded-control border border-line"
        >
          <img
            v-if="e.product.image"
            :src="e.product.image"
            :alt="e.product.imageAlt ?? e.product.name"
            class="h-full w-full bg-white object-contain p-1"
            loading="lazy"
          />
          <media-placeholder
            v-else
            :icon="e.product.icon"
            :label="`${e.product.name} image`"
            size="24"
            class="h-full w-full"
          />
          <span
            class="absolute -end-0 -top-0 grid h-5 min-w-5 place-items-center rounded-bl-control bg-accent px-1 font-mono text-[10px] font-bold text-onaccent"
            >{{ e.line.qty }}</span
          >
        </div>
        <div class="min-w-0 flex-1">
          <p class="line-clamp-2 text-sm font-medium leading-snug">
            {{ e.product.name }}
          </p>
          <p v-if="e.line.option" class="truncate text-xs text-mute">
            {{ e.line.option }}
          </p>
        </div>
        <p class="shrink-0 font-mono text-sm">
          {{ money.format(e.line.qty * e.line.unitPrice) }}
        </p>
      </li>
    </ul>

    <dl class="space-y-2 border-t border-line pt-4 text-sm">
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
        <dt>{{ amounts.voucherLabel }}</dt>
        <dd class="font-mono">−{{ money.format(amounts.voucher) }}</dd>
      </div>
      <div v-if="amounts.wire" class="flex justify-between gap-4 text-accent">
        <dt>Wire transfer saving (2%)</dt>
        <dd class="font-mono">−{{ money.format(amounts.wire) }}</dd>
      </div>
      <div class="flex justify-between gap-4">
        <dt class="text-mute">Delivery</dt>
        <dd class="font-mono" :class="amounts.shipping === 0 && 'text-success'">
          {{ amounts.shipping === 0 ? "Free" : money.format(amounts.shipping) }}
        </dd>
      </div>
      <div class="flex justify-between gap-4">
        <dt class="text-mute">Estimated sales tax</dt>
        <dd class="font-mono">{{ money.format(amounts.tax) }}</dd>
      </div>
    </dl>

    <p class="flex items-end justify-between gap-3 border-t border-line pt-4">
      <span class="eyebrow !text-paper">Total</span>
      <span class="font-display text-3xl font-semibold" aria-live="polite"
        >{{ money.format(amounts.total) }}
        <span class="font-mono text-xs text-mute">USD</span></span
      >
    </p>

    <ul class="space-y-2 border-t border-line pt-4 text-xs text-mute">
      <li v-for="t in trust" :key="t.label" class="flex items-start gap-2">
        <Icon
          :name="t.icon"
          size="14"
          class="mt-0.5 shrink-0 text-accent"
          aria-hidden="true"
        />{{ t.label }}
      </li>
    </ul>
  </aside>
</template>

<script lang="ts" setup>
import type { CartEntry } from "~/composables/useCartTotals";

export interface CheckoutAmounts {
  units: number;
  subtotal: number;
  volume: number;
  voucher: number;
  voucherLabel?: string;
  wire: number;
  shipping: number;
  tax: number;
  total: number;
}

defineProps<{ entries: CartEntry[]; amounts: CheckoutAmounts }>();

const money = useMoney();
const trust = [
  {
    icon: "lucide:shield-check",
    label: "3-year zero-deductible mechanical warranty",
  },
  {
    icon: "lucide:flask-conical",
    label: "Pre-flight bench QA and collimation verified",
  },
  { icon: "lucide:headset", label: "Concierge hotline: +1 (800) 492-LUMN" },
];
</script>