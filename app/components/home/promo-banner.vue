<template>
  <section
    aria-labelledby="promo-title"
    class="border-y border-accent/30 bg-accent-soft"
  >
    <div
      v-reveal:fade
      class="container-page flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between"
    >
      <div class="flex items-start gap-4">
        <span
          class="grid h-11 w-11 shrink-0 place-items-center rounded-control border border-accent/50 text-accent"
          aria-hidden="true"
        >
          <Icon name="lucide:badge-percent" size="22" />
        </span>
        <div>
          <h2 id="promo-title" class="text-xl">
            Trade in your old printer or photocopier
          </h2>
          <p class="text-sm text-mute">
            Get credit toward a new machine. We assess your old one, collect it
            and take care of the swap.
          </p>
        </div>
      </div>
      <LazyVButton variant="primary" to="/services/trade-in">
        {{ t("btn.see_how_trade_in_works") }}
        <Icon
          name="lucide:arrow-right"
          size="16"
          class="icon-nudge rtl:-scale-x-100"
          aria-hidden="true"
        />
      </LazyVButton>
    </div>
  </section>
</template>

<script lang="ts" setup>
const { t } = useI18n();
</script>