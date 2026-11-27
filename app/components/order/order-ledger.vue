<template>
  <section class="card-roomy" aria-labelledby="ledger-title">
    <h2 id="ledger-title" class="mb-4 font-display text-2xl">
      {{ t("order_ui.payment_summary") }}
    </h2>

    <dl class="space-y-2.5 text-sm">
      <div class="flex justify-between gap-4">
        <dt class="text-mute">
          {{
            t(
              amounts.units === 1
                ? "order_ui.subtotal_unit"
                : "order_ui.subtotal_units",
              { n: amounts.units },
            )
          }}
        </dt>
        <dd class="font-mono">{{ money.format(amounts.subtotal) }}</dd>
      </div>
      <div v-if="amounts.volume" class="flex justify-between gap-4 text-accent">
        <dt>{{ t("order_ui.volume_discount") }}</dt>
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
      <div class="flex justify-between gap-4">
        <dt class="text-mute">{{ t("order_ui.delivery") }}</dt>
        <dd class="font-mono" :class="amounts.shipping === 0 && 'text-success'">
          {{
            amounts.shipping === 0
              ? t("order_ui.complimentary")
              : money.format(amounts.shipping)
          }}
        </dd>
      </div>
      <div class="flex justify-between gap-4">
        <dt class="text-mute">{{ t("order_ui.estimated_tax") }}</dt>
        <dd class="font-mono">{{ money.format(amounts.tax) }}</dd>
      </div>
    </dl>

    <div
      class="mt-5 flex flex-wrap items-end justify-between gap-3 rounded-card border border-line bg-raised p-4"
    >
      <div>
        <p class="eyebrow !text-paper">
          {{
            payment.id === "card"
              ? t("order_ui.total_charged")
              : t("order_ui.total_due")
          }}
        </p>
        <p class="mt-1 meta">
          {{
            payment.id === "card"
              ? t("order_ui.card_ending", {
                  label: payment.label,
                  last4: payment.last4,
                })
              : payment.label
          }}
        </p>
      </div>
      <p class="font-display text-4xl font-semibold text-accent">
        {{ money.format(amounts.total) }}
        <span class="meta">{{ t("order_ui.currency") }}</span>
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { Order } from "~/types/order";

const { t } = useI18n();

defineProps<{ amounts: Order["amounts"]; payment: Order["payment"] }>();

const money = useMoney();
</script>