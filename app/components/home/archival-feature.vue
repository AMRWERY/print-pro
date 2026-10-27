<template>
  <section
    class="border-y border-line bg-surface"
    aria-labelledby="archival-title"
  >
    <div
      class="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20"
    >
      <media-placeholder
        v-reveal:start
        src="/img/hero-img.png"
        fit="cover"
        :label="t('home.technician_installing_a_photocopier_in_an_office')"
        size="140"
        class="h-[360px] w-full rounded-panel border border-line sm:h-[440px] lg:h-[520px]"
      />

      <div v-reveal class="space-y-6">
        <div class="space-y-3">
          <p class="eyebrow text-accent">{{ t("home.genuine_supplies") }}</p>
          <h2 id="archival-title" class="text-3xl lg:text-5xl">
            {{ t("home.genuine_ink_and_toner_matched_to_your_machine") }}
          </h2>
          <p class="text-base text-mute">
            {{
              t(
                "home.original_ink_toner_and_drum_units_keep_prints_sharp_and_machines_reliable_every_supply_lists_the_exact_models_it_fits_so_you_order_the_right_one_the_first_time",
              )
            }}
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <article class="card-compact space-y-1 bg-ink">
            <p class="eyebrow">{{ t("home.sealed_and_genuine") }}</p>
            <h3 class="text-xl">{{ t("home.factory_sealed_packaging") }}</h3>
            <p class="text-sm text-mute">
              {{
                t(
                  "home.never_refilled_or_relabelled_what_you_receive_is_what_the_manufacturer_packed",
                )
              }}
            </p>
          </article>
          <article class="card-compact space-y-1 bg-ink">
            <p class="eyebrow">{{ t("home.matched_to_your_model") }}</p>
            <h3 class="text-xl">{{ t("home.compatibility_checked") }}</h3>
            <p class="text-sm text-mute">
              {{
                t(
                  "home.each_product_page_lists_the_printers_and_photocopiers_it_fits_with_page_yield_and_cost_per_page",
                )
              }}
            </p>
          </article>
        </div>

        <dl class="grid grid-cols-3 gap-3 border-t border-line pt-5">
          <div v-for="s in specs" :key="s.label">
            <dt class="eyebrow">{{ s.label }}</dt>
            <dd class="font-display text-xl text-start" dir="ltr">{{ s.value }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const specs = [
  { label: t("home.genuine"), value: "100 %" },
  { label: t("home.dispatch"), value: "Same day" },
  { label: t("home.returns"), value: "Easy" },
];
</script>