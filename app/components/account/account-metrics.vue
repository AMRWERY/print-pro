<template>
  <section
    class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    aria-label="Account summary"
  >
    <!-- Card 1: ORDERS THIS YEAR -->
    <article
      class="card-compact transition duration-200 hover:border-accent/40"
    >
      <div class="flex items-start justify-between">
        <p class="eyebrow flex items-center gap-1.5 text-mute">
          {{ t("account.orders_this_year") }}
        </p>
        <span class="rounded-control bg-accent-soft p-1.5 text-accent">
          <Icon name="lucide:receipt" size="14" aria-hidden="true" />
        </span>
      </div>

      <div class="mt-2 flex items-baseline gap-2">
        <span class="font-display text-2xl font-bold tracking-tight text-paper">
          {{ orderCount }} Orders
        </span>
      </div>

      <p class="meta mt-0.5">
        {{ money.format(settledTotal) }} {{ t("account.settled") }}
      </p>

      <div
        class="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5"
      >
        <!-- SVG Sparkline Trend -->
        <svg class="h-6 w-20 text-accent" viewBox="0 0 80 24" fill="none">
          <path
            d="M2 18L18 16L34 20L50 10L66 12L78 4"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <span class="font-mono text-xs font-semibold text-accent">
          +18.4% vs 2023
        </span>
      </div>
    </article>

    <!-- Card 2: ACTIVE DELIVERIES -->
    <article
      class="card-compact transition duration-200 hover:border-accent/40"
    >
      <div class="flex items-start justify-between">
        <p class="eyebrow flex items-center gap-1.5 text-accent">
          <span class="relative flex h-2 w-2">
            <span class="ping-ring" />
            <span class="relative inline-flex pip rounded-full" />
          </span>
          {{ t("account.active_delivery") }}
        </p>
        <span
          class="rounded-control bg-accent/20 px-1.5 py-0.5 font-mono text-2xs font-bold text-accent"
        >
          {{ t("account.live") }}
        </span>
      </div>

      <div class="mt-2 flex items-baseline gap-2">
        <span class="font-display text-2xl font-bold tracking-tight text-paper">
          {{ activeTransitCount }} Order{{ activeTransitCount > 1 ? "s" : "" }}
          {{ t("account.on_the_way") }}
        </span>
      </div>

      <p class="meta mt-0.5">
        {{ activeCrateCode }} {{ t("account.step_3_4") }}
      </p>

      <div
        class="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 font-mono text-xs"
      >
        <span class="text-mute">{{ t("account.insured_courier") }}</span>
        <span class="font-semibold text-paper">{{
          t("account.eta_date")
        }}</span>
      </div>
    </article>

    <!-- Card 3: SAVED ITEMS -->
    <article
      class="card-compact transition duration-200 hover:border-accent/40"
    >
      <div class="flex items-start justify-between">
        <p class="eyebrow flex items-center gap-1.5 text-mute">
          {{ t("account.saved_items") }}
        </p>
        <span class="rounded-control bg-raised p-1.5 text-mute">
          <Icon name="lucide:bookmark" size="14" aria-hidden="true" />
        </span>
      </div>

      <div class="mt-2 flex items-baseline gap-2">
        <span class="font-display text-2xl font-bold tracking-tight text-paper">
          {{ apparatusCount }} {{ t("account.items") }}
        </span>
      </div>

      <p class="meta mt-0.5">
        {{ money.format(registryValuation) }} {{ t("account.total_valuation") }}
      </p>

      <div
        class="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 font-mono text-xs"
      >
        <span class="text-accent font-medium">{{ t("account.in_stock") }}</span>
        <span class="text-mute">{{ t("account.price_drop") }}</span>
      </div>
    </article>

    <!-- Card 4: ACCOUNT CREDIT -->
    <article
      class="card-compact transition duration-200 hover:border-accent/40"
    >
      <div class="flex items-start justify-between">
        <p class="eyebrow flex items-center gap-1.5 text-mute">
          {{ t("account.account_credit") }}
        </p>
        <span class="rounded-control bg-raised p-1.5 text-mute">
          <Icon name="lucide:shield" size="14" aria-hidden="true" />
        </span>
      </div>

      <div class="mt-2 flex items-baseline gap-2">
        <span class="font-display text-2xl font-bold tracking-tight text-paper">
          {{ money.format(escrowAmount) }}
        </span>
      </div>

      <p class="meta mt-0.5">{{ t("account.available_liquidity_pool") }}</p>

      <div
        class="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 font-mono text-xs"
      >
        <span class="text-success font-medium">{{
          t("account.trade_in_credit_active")
        }}</span>
        <span class="text-mute">{{ t("account.valid_months") }}</span>
      </div>
    </article>
  </section>
</template>

<script lang="ts" setup>
const { t } = useI18n();

defineProps<{
  orderCount: number;
  settledTotal: number;
  activeTransitCount: number;
  activeCrateCode: string;
  apparatusCount: number;
  registryValuation: number;
  escrowAmount: number;
}>();

const money = useMoney();
</script>