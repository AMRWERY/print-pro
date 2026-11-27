<template>
  <aside class="card space-y-4 p-5" aria-labelledby="co-summary-title">
    <div class="flex items-center justify-between gap-3">
      <h2 id="co-summary-title" class="font-display text-xl">
        {{ t("btn.order_summary") }}
      </h2>
      <LazyVButton
        variant="tertiary"
        to="/cart"
        class="text-sm underline-offset-4 hover:underline"
        >{{ t("btn.edit_cart") }}</LazyVButton
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
            class="thumb-contain"
            loading="lazy"
          />

          <media-placeholder
            v-else
            :icon="e.product.icon"
            :label="t('cart_ui.product_image', { name: e.product.name })"
            size="24"
            class="h-full w-full"
          />
          <span
            class="absolute -end-0 -top-0 grid h-5 min-w-5 place-items-center rounded-bl-control bg-accent px-1 font-mono text-2xs font-bold text-onaccent"
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
          {{ t("cart.subtotal") }} ({{ amounts.units }}
          {{ amounts.units === 1 ? t("cart.unit") : t("cart.units") }})
        </dt>
        <dd class="font-mono">{{ money.format(amounts.subtotal) }}</dd>
      </div>
      <div v-if="amounts.volume" class="flex justify-between gap-4 text-accent">
        <dt>{{ t("cart.volume_discount") }}</dt>
        <dd class="font-mono">−{{ money.format(amounts.volume) }}</dd>
      </div>
      <div
        v-if="amounts.voucher"
        class="flex justify-between gap-4 text-accent"
      >
        <dt>{{ amounts.voucherLabel }}</dt>
        <dd class="font-mono">−{{ money.format(amounts.voucher) }}</dd>
      </div>
      <div class="flex justify-between gap-4">
        <dt class="text-mute">{{ t("checkout_ui.delivery") }}</dt>
        <dd class="font-mono" :class="amounts.shipping === 0 && 'text-success'">
          {{
            amounts.shipping === 0
              ? t("checkout_ui.free")
              : money.format(amounts.shipping)
          }}
        </dd>
      </div>
      <div class="flex justify-between gap-4">
        <dt class="text-mute">{{ t("cart.estimated_sales_tax") }}</dt>
        <dd class="font-mono">{{ money.format(amounts.tax) }}</dd>
      </div>
    </dl>

    <p class="flex items-end justify-between gap-3 border-t border-line pt-4">
      <span class="eyebrow !text-paper">{{ t("checkout_ui.total") }}</span>
      <span class="font-display text-3xl font-semibold" aria-live="polite"
        >{{ money.format(amounts.total) }} <span class="meta">{{ t("cart_ui.egp") }}</span></span
      >
    </p>

    <ul class="space-y-2 border-t border-line pt-4 text-xs text-mute">
      <li v-for="item in trust" :key="item.icon" class="flex items-start gap-2">
        <Icon
          :name="item.icon"
          size="14"
          class="bullet-icon"
          aria-hidden="true"
        />{{ item.label }}
      </li>
    </ul>
  </aside>
</template>

<script lang="ts" setup>
import type { CartEntry } from "~/composables/useCartTotals";
import type { CheckoutAmounts } from "~/types/checkout";

const { t } = useI18n();

defineProps<{ entries: CartEntry[]; amounts: CheckoutAmounts }>();

const money = useMoney();

const trust = computed(() => [
  {
    icon: "lucide:shield-check",
    label: t("checkout_ui.trust_warranty"),
  },
  {
    icon: "lucide:flask-conical",
    label: t("checkout_ui.trust_tested"),
  },
  {
    icon: "lucide:headset",
    label: t("checkout_ui.trust_hotline", { phone: "+1 (800) 412-5866" }),
  },
]);
</script>