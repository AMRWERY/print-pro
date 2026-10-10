<template>
  <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Atelier performance metrics">
    <!-- Card 1: TOTAL REQUISITIONS YTD -->
    <article class="rounded-card border border-line bg-surface p-4 transition duration-200 hover:border-accent/40">
      <div class="flex items-start justify-between">
        <p class="eyebrow flex items-center gap-1.5 text-mute">
          TOTAL REQUISITIONS YTD
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

      <p class="font-mono text-xs text-mute mt-0.5">
        {{ money.format(settledTotal) }} Settled
      </p>

      <div class="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5">
        <!-- SVG Sparkline Trend -->
        <svg class="h-6 w-20 text-accent" viewBox="0 0 80 24" fill="none">
          <path d="M2 18L18 16L34 20L50 10L66 12L78 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>

        <span class="font-mono text-xs font-semibold text-accent">
          +18.4% vs 2023
        </span>
      </div>
    </article>

    <!-- Card 2: ACTIVE IN-TRANSIT TELEMETRY -->
    <article class="rounded-card border border-line bg-surface p-4 transition duration-200 hover:border-accent/40">
      <div class="flex items-start justify-between">
        <p class="eyebrow flex items-center gap-1.5 text-accent">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          ACTIVE IN-TRANSIT
        </p>
        <span class="rounded-control bg-accent/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-accent">
          LIVE RADAR
        </span>
      </div>

      <div class="mt-2 flex items-baseline gap-2">
        <span class="font-display text-2xl font-bold tracking-tight text-paper">
          {{ activeTransitCount }} Consignment{{ activeTransitCount > 1 ? 's' : '' }}
        </span>
      </div>

      <p class="font-mono text-xs text-mute mt-0.5">
        {{ activeCrateCode }} • Stage 4 / 5
      </p>

      <div class="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 font-mono text-xs">
        <span class="text-mute">Air Cargo LH-400</span>
        <span class="font-semibold text-paper">ETA 28 OCT</span>
      </div>
    </article>

    <!-- Card 3: STUDIO APPARATUS REGISTRY -->
    <article class="rounded-card border border-line bg-surface p-4 transition duration-200 hover:border-accent/40">
      <div class="flex items-start justify-between">
        <p class="eyebrow flex items-center gap-1.5 text-mute">
          STUDIO APPARATUS
        </p>
        <span class="rounded-control bg-raised p-1.5 text-mute">
          <Icon name="lucide:bookmark" size="14" aria-hidden="true" />
        </span>
      </div>

      <div class="mt-2 flex items-baseline gap-2">
        <span class="font-display text-2xl font-bold tracking-tight text-paper">
          {{ apparatusCount }} Apparatus
        </span>
      </div>

      <p class="font-mono text-xs text-mute mt-0.5">
        {{ money.format(registryValuation) }} Total Valuation
      </p>

      <div class="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 font-mono text-xs">
        <span class="text-accent font-medium">3 Priority Reserved</span>
        <span class="text-mute">1 Notice</span>
      </div>
    </article>

    <!-- Card 4: ESCROW VAULT & GRANTS -->
    <article class="rounded-card border border-line bg-surface p-4 transition duration-200 hover:border-accent/40">
      <div class="flex items-start justify-between">
        <p class="eyebrow flex items-center gap-1.5 text-mute">
          ESCROW VAULT &amp; GRANTS
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

      <p class="font-mono text-xs text-mute mt-0.5">
        Available Liquidity Pool
      </p>

      <div class="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 font-mono text-xs">
        <span class="text-success font-medium">1 Biennial Grant Active</span>
        <span class="text-mute">Cycle 24-26</span>
      </div>
    </article>
  </section>
</template>

<script lang="ts" setup>
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